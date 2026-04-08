import 'dotenv/config';
import { createClient } from '@sanity/client';
import { setDefaultResultOrder } from 'node:dns';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

setDefaultResultOrder('ipv4first');

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxyUrl) {
  setGlobalDispatcher(new ProxyAgent(proxyUrl));
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN');
  process.exit(1);
}

const TEAM_ID = Number(process.env.CTFTIME_TEAM_ID || 393723);
const TEAM_SLUG = process.env.CTFTIME_TEAM_SLUG || 'sarrus';
const BACKFILL = process.argv.includes('--backfill');
const BASE_URL = (process.env.CTFTIME_BASE_URL || 'https://ctftime.org/api/v1').replace(/\/+$/, '');
const TIMEOUT_MS = Number(process.env.CTFTIME_TIMEOUT_MS || 20000);
const FORCE_JINA = process.env.CTFTIME_USE_JINA === '1';
const DISABLE_JINA = process.env.CTFTIME_DISABLE_JINA === '1';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-04-08',
  token,
  useCdn: false,
  perspective: 'raw'
});

async function fetchJson(url, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status}`);
      }
      return await parseJsonResponse(res);
    } catch (error) {
      if (!DISABLE_JINA) {
        try {
          const jinaUrl = toJinaUrl(url);
          const jinaRes = await fetch(jinaUrl, { signal: controller.signal });
          if (jinaRes.ok) {
            return await parseJsonResponse(jinaRes);
          }
        } catch (jinaError) {
          if (FORCE_JINA && attempt === attempts) {
            throw jinaError;
          }
        }
      }
      if (attempt === attempts) {
        throw error;
      }
      const delay = 1000 * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    } finally {
      clearTimeout(timeout);
    }
  }
  return null;
}

function toJinaUrl(url) {
  const stripped = url.replace(/^https?:\/\//, '');
  return `https://r.jina.ai/http://${stripped}`;
}

async function parseJsonResponse(res) {
  const text = await res.text();
  const marker = 'Markdown Content:';
  if (text.includes(marker)) {
    const idx = text.indexOf(marker);
    const jsonText = text.slice(idx + marker.length).trim();
    return JSON.parse(jsonText);
  }
  return JSON.parse(text);
}

async function uploadLogoIfNeeded(team) {
  if (!team.logo) return { logo: undefined, logoUrl: undefined };

  const existing = await client.fetch(
    '*[_type == "teamProfile" && ctftimeTeamId == $teamId][0]',
    { teamId: TEAM_ID }
  );

  if (existing?.logoUrl === team.logo && existing.logo) {
    return { logo: existing.logo, logoUrl: existing.logoUrl };
  }

  const res = await fetch(team.logo);
  if (!res.ok) {
    return { logo: undefined, logoUrl: team.logo };
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const asset = await client.assets.upload('image', buffer, {
    filename: `ctftime-${TEAM_SLUG}.jpg`
  });

  return {
    logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    logoUrl: team.logo
  };
}

async function syncTeamProfile() {
  const team = await fetchJson(`${BASE_URL}/teams/${TEAM_ID}/`);
  const logoData = await uploadLogoIfNeeded(team);
  const now = new Date().toISOString();

  const doc = {
    _id: 'teamProfile-sarrus',
    _type: 'teamProfile',
    name: team.name,
    slug: { _type: 'slug', current: TEAM_SLUG },
    country: team.country,
    website: team.website || team.university_website,
    ctftimeTeamId: TEAM_ID,
    syncedAt: now,
    ...logoData
  };

  await client.createOrReplace(doc);
  return doc;
}

function pickManualWins(existing, incoming) {
  const patch = {};
  Object.keys(incoming).forEach((key) => {
    const value = existing?.[key];
    if (value === undefined || value === null || value === '') {
      patch[key] = incoming[key];
    }
  });
  return patch;
}

async function syncResults(year) {
  const results = await fetchJson(`${BASE_URL}/results/${year}/`);
  const eventIds = Object.keys(results);
  const synced = [];

  for (const eventId of eventIds) {
    const event = results[eventId];
    const score = event.scores?.find((entry) => entry.team_id === TEAM_ID);
    if (!score) continue;

    const eventDetails = await fetchJson(`${BASE_URL}/events/${eventId}/`);
    const incoming = {
      eventName: eventDetails.title || event.title,
      eventId: Number(eventId),
      eventUrl: eventDetails.url,
      format: eventDetails.format,
      date: eventDetails.start || eventDetails.finish,
      rank: score.place,
      score: Number(score.points),
      source: 'ctftime'
    };

    const existing = await client.fetch(
      '*[_type == "result" && eventId == $eventId][0]',
      { eventId: Number(eventId) }
    );

    if (!existing) {
      await client.create({
        _id: `result-${eventId}`,
        _type: 'result',
        ...incoming,
        syncedAt: new Date().toISOString()
      });
    } else {
      const patch = pickManualWins(existing, incoming);
      await client.patch(existing._id).set({
        ...patch,
        syncedAt: new Date().toISOString()
      }).commit();
    }

    synced.push(eventId);
  }

  return synced;
}

async function run() {
  const year = new Date().getUTCFullYear();
  const years = BACKFILL ? [year, year - 1, year - 2] : [year];

  const profile = await syncTeamProfile();
  const results = [];

  for (const y of years) {
    const synced = await syncResults(y);
    results.push(...synced);
  }

  console.log(`Synced team: ${profile.name}`);
  console.log(`Years: ${years.join(', ')}`);
  console.log(`Results synced: ${results.length}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

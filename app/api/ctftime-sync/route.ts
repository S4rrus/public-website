import { writeClient } from '../../../lib/sanity.client';

export const runtime = 'nodejs';

const TEAM_ID = 393723;
const TEAM_SLUG = 'sarrus';

type TeamResponse = {
  id: number;
  name: string;
  country?: string;
  logo?: string;
  website?: string;
  university_website?: string;
};

type ResultsResponse = Record<string, { title: string; scores: { team_id: number; points: string; place: number }[]; time?: number }>;

type EventResponse = {
  id: number;
  title: string;
  format?: string;
  start?: string;
  finish?: string;
  url?: string;
};

type TeamProfileDoc = {
  _id: string;
  _type: 'teamProfile';
  name: string;
  slug: { _type: 'slug'; current: string };
  country?: string;
  website?: string;
  ctftimeTeamId: number;
  syncedAt: string;
  logo?: any;
  logoUrl?: string;
};

function requireSecret(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return null;
  const auth = request.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  const headerSecret = request.headers.get('x-cron-secret');
  const provided = bearer || headerSecret || '';
  if (provided !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }
  return null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function uploadLogoIfNeeded(team: TeamResponse) {
  if (!team.logo) return { logo: undefined, logoUrl: undefined };

  const existing = await writeClient.fetch<{ _id: string; logoUrl?: string; logo?: any } | null>(
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
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: `ctftime-${TEAM_SLUG}.jpg`
  });

  return { logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }, logoUrl: team.logo };
}

async function syncTeamProfile() {
  const team = await fetchJson<TeamResponse>(`https://ctftime.org/api/v1/teams/${TEAM_ID}/`);
  const logoData = await uploadLogoIfNeeded(team);
  const now = new Date().toISOString();

  const doc: TeamProfileDoc = {
    _id: 'teamProfile-sarrus',
    _type: 'teamProfile',
    name: team.name,
    slug: { _type: 'slug', current: TEAM_SLUG },
    country: team.country,
    website: team.website || team.university_website,
    ctftimeTeamId: TEAM_ID,
    syncedAt: now,
    ...(logoData.logo ? { logo: logoData.logo } : {}),
    ...(logoData.logoUrl ? { logoUrl: logoData.logoUrl } : {})
  };

  await writeClient.createOrReplace(doc);
  return doc;
}

function pickManualWins(existing: any, incoming: Record<string, any>) {
  const patch: Record<string, any> = {};
  Object.keys(incoming).forEach((key) => {
    const value = existing?.[key];
    if (value === undefined || value === null || value === '') {
      patch[key] = incoming[key];
    }
  });
  return patch;
}

async function syncResults(year: number) {
  const results = await fetchJson<ResultsResponse>(`https://ctftime.org/api/v1/results/${year}/`);
  const eventIds = Object.keys(results);
  const synced: string[] = [];

  for (const eventId of eventIds) {
    const event = results[eventId];
    const score = event.scores?.find((entry) => entry.team_id === TEAM_ID);
    if (!score) continue;

    const eventDetails = await fetchJson<EventResponse>(`https://ctftime.org/api/v1/events/${eventId}/`);
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

    const existing = await writeClient.fetch<any>(
      '*[_type == "result" && eventId == $eventId][0]',
      { eventId: Number(eventId) }
    );

    if (!existing) {
      await writeClient.create({
        _id: `result-${eventId}`,
        _type: 'result',
        ...incoming,
        syncedAt: new Date().toISOString()
      });
    } else {
      const patch = pickManualWins(existing, incoming);
      await writeClient.patch(existing._id).set({
        ...patch,
        syncedAt: new Date().toISOString()
      }).commit();
    }

    synced.push(eventId);
  }

  return synced;
}

export async function GET(request: Request) {
  const unauthorized = requireSecret(request);
  if (unauthorized) return unauthorized;

  if (!process.env.SANITY_API_TOKEN) {
    return new Response('Missing SANITY_API_TOKEN', { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const backfill = url.searchParams.get('backfill') === '1';
    const year = new Date().getUTCFullYear();
    const years = backfill ? [year, year - 1, year - 2] : [year];

    const profile = await syncTeamProfile();
    const results = [] as string[];

    for (const y of years) {
      const synced = await syncResults(y);
      results.push(...synced);
    }

    return Response.json({
      ok: true,
      team: profile.name,
      years,
      resultsSynced: results.length
    });
  } catch (error) {
    return new Response(`Sync failed: ${(error as Error).message}`, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}

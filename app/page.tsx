import Link from 'next/link';
import { client } from '../lib/sanity.client';
import {
  latestResultsQuery,
  recentWriteupsQuery,
  siteSettingsQuery,
  statsQuery
} from '../lib/sanity.queries';
import { formatMonthYear, rankBadgeClass } from '../lib/format';
import { tagClass } from '../lib/tags';

export default async function HomePage() {
  const [settings, stats, recentWriteups, latestResults] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(statsQuery),
    client.fetch(recentWriteupsQuery),
    client.fetch(latestResultsQuery)
  ]);

  const heroEyebrow = settings?.heroEyebrow ?? 'Capture The Flag Team';
  const heroTitle = settings?.heroTitle ?? 'We break things';
  const heroHighlight = settings?.heroHighlight ?? 'understand';
  const heroSub = settings?.heroSub ??
    'sarrus is a competitive CTF team focused on web exploitation, binary analysis, cryptography, and reverse engineering. We compete globally and share everything we learn.';
  const primaryCtaLabel = settings?.primaryCtaLabel ?? 'Browse writeups →';
  const primaryCtaHref = settings?.primaryCtaHref ?? '/writeups';
  const secondaryCtaLabel = settings?.secondaryCtaLabel ?? 'Meet the team';
  const secondaryCtaHref = settings?.secondaryCtaHref ?? '/team';

  return (
    <section>
      <div className="container">
        <div className="hero reveal">
          <div className="hero-eyebrow">{heroEyebrow}</div>
          <h1>
            {heroTitle}
            <br />to <span>{heroHighlight}</span>
            <br />them.
          </h1>
          <p className="hero-sub">{heroSub}</p>
          <div className="hero-tags">
            <span className="member-tag">web exploitation</span>
            <span className="member-tag">pwn</span>
            <span className="member-tag">crypto</span>
            <span className="member-tag">reverse</span>
            <span className="member-tag">forensics</span>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={primaryCtaHref}>
              {primaryCtaLabel}
            </Link>
            <Link className="btn btn-ghost" href={secondaryCtaHref}>
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="stats container reveal reveal-delay-1">
        <div className="stat">
          <div className="stat-num">
            {stats?.results ?? 0}
            <span>+</span>
          </div>
          <div className="stat-label">CTFs played</div>
        </div>
        <div className="stat">
          <div className="stat-num">{stats?.writeups ?? 0}</div>
          <div className="stat-label">Writeups</div>
        </div>
        <div className="stat">
          <div className="stat-num">{stats?.members ?? 0}</div>
          <div className="stat-label">Members</div>
        </div>
        <div className="stat">
          <div className="stat-num">
            #<span>{stats?.bestRank ?? '—'}</span>
          </div>
          <div className="stat-label">Best rank</div>
        </div>
      </div>

      <div className="home-section container reveal reveal-delay-2">
        <div className="section-header">
          <h2 className="section-title">Recent Writeups</h2>
          <Link className="section-link" href="/writeups">all writeups →</Link>
        </div>
        <div className="cards-grid">
          {recentWriteups?.length ? (
            recentWriteups.map((writeup: any) => (
              <Link
                key={writeup._id}
                className="card"
                href={`/writeups/${writeup.slug?.current}`}
              >
                <span className={`card-tag ${tagClass(writeup.category)}`}>{writeup.category}</span>
                <div className="card-title">{writeup.title}</div>
                <div className="card-meta">
                  <span>{writeup.eventName}</span>
                </div>
                <div className="card-excerpt">{writeup.excerpt}</div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-title">No writeups yet</div>
              <div className="empty-sub">Your latest writeups will show up here once they’re published.</div>
            </div>
          )}
        </div>
      </div>

      <div className="home-section container reveal reveal-delay-3">
        <div className="section-header">
          <h2 className="section-title">Latest Results</h2>
          <Link className="section-link" href="/results">all results →</Link>
        </div>
        <div className="results-wrapper">
          <table className="results-table" style={{ background: 'var(--surface)' }}>
            <thead>
              <tr>
                <th>Competition</th>
                <th>Date</th>
                <th>Rank</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {latestResults?.length ? (
                latestResults.map((result: any) => (
                  <tr key={result._id}>
                    <td><div className="ctf-name">{result.eventName}</div></td>
                    <td>{formatMonthYear(result.date)}</td>
                    <td>
                      <span className={`rank-badge ${rankBadgeClass(result.rank)}`}>
                        {result.rank ? `#${result.rank}` : '-'}
                      </span>
                    </td>
                    <td>{result.score ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: 20, color: 'var(--muted2)' }}>
                    No results yet. Sync from CTFtime or add results in the CMS.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

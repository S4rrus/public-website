import Link from 'next/link';
import { client } from '../../lib/sanity.client';
import { resultsQuery } from '../../lib/sanity.queries';
import { formatMonthYear, rankBadgeClass } from '../../lib/format';

function groupByYear(results: any[]) {
  return results.reduce((acc: Record<string, any[]>, result) => {
    const year = result.date ? new Date(result.date).getFullYear().toString() : 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(result);
    return acc;
  }, {});
}

export default async function ResultsPage() {
  const results = await client.fetch(resultsQuery);
  const grouped = groupByYear(results);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">Competition history</div>
          <h1 className="page-title">Results</h1>
        </div>

        <div className="results-wrapper reveal reveal-delay-1" style={{ marginBottom: 64 }}>
          {years.map((year) => (
            <div key={year}>
              <div className="results-year">{year}</div>
              <table className="results-table" style={{ background: 'var(--surface)' }}>
                <thead>
                  <tr>
                    <th>Competition</th>
                    <th>Format</th>
                    <th>Date</th>
                    <th>Rank</th>
                    <th>Score</th>
                    <th>Writeups</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[year].map((result) => (
                    <tr key={result._id}>
                      <td>
                        <div className="ctf-name">
                          {result.eventUrl ? (
                            <Link href={result.eventUrl} target="_blank" rel="noreferrer">
                              {result.eventName}
                            </Link>
                          ) : (
                            result.eventName
                          )}
                        </div>
                      </td>
                      <td>{result.format ?? '-'}</td>
                      <td>{formatMonthYear(result.date)}</td>
                      <td>
                        <span className={`rank-badge ${rankBadgeClass(result.rank)}`}>
                          {result.rank ? `#${result.rank}` : '-'}
                        </span>
                      </td>
                      <td>{result.score ?? '-'}</td>
                      <td>{result.writeupCount ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

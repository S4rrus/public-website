import Link from 'next/link';
import { client } from '../../lib/sanity.client';
import { writeupsQuery } from '../../lib/sanity.queries';
import { tagClass } from '../../lib/tags';
import WriteupFilters from '../components/WriteupFilters';

type WriteupsSearchParams = {
  cat?: string;
};

export default async function WriteupsPage({
  searchParams
}: {
  searchParams?: Promise<WriteupsSearchParams> | WriteupsSearchParams;
}) {
  const writeups = await client.fetch(writeupsQuery);
  const resolvedSearchParams = await searchParams;
  const active = resolvedSearchParams?.cat ?? 'all';
  const filtered = active === 'all'
    ? writeups
    : writeups.filter((w: any) => w.category?.toLowerCase() === active);

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">Knowledge base</div>
          <h1 className="page-title">Writeups</h1>
        </div>

        <WriteupFilters active={active} />

        <div className="writeups-full reveal reveal-delay-1" id="writeups-grid">
          {filtered.map((writeup: any) => (
            <Link
              key={writeup._id}
              className="writeup-card-full"
              href={`/writeups/${writeup.slug?.current}`}
            >
              <span className={`card-tag ${tagClass(writeup.category)}`}>{writeup.category}</span>
              <div className="card-title">{writeup.title}</div>
              <div className="card-meta" style={{ marginTop: 8 }}>
                <span>{writeup.eventName}</span>
                {writeup.author?.handle ? <span>by {writeup.author.handle}</span> : null}
              </div>
              <div className="card-excerpt">{writeup.excerpt}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

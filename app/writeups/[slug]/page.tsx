import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client } from '../../../lib/sanity.client';
import { writeupBySlugQuery } from '../../../lib/sanity.queries';
import { formatDate } from '../../../lib/format';
import { tagClass } from '../../../lib/tags';
import { urlFor } from '../../../lib/sanity.image';

type WriteupParams = {
  slug: string;
};

export default async function WriteupDetailPage({
  params
}: {
  params: Promise<WriteupParams> | WriteupParams;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }

  const writeup = await client.fetch(writeupBySlugQuery, { slug: resolvedParams.slug });

  if (!writeup) {
    notFound();
  }

  const coverUrl = writeup.coverImage ? urlFor(writeup.coverImage)?.width(1200).height(700).url() : null;

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">Writeup</div>
          <h1 className="page-title">{writeup.title}</h1>
        </div>
      </div>
      <div className="container">
        <article className="article reveal reveal-delay-1">
          {coverUrl ? (
            <Image className="cover" src={coverUrl} alt={writeup.title} width={1200} height={700} />
          ) : null}
          <div className="meta">
            {writeup.category ? (
              <span className={`card-tag ${tagClass(writeup.category)}`}>{writeup.category}</span>
            ) : null}
            {writeup.eventName ? <span>{writeup.eventName}</span> : null}
            {writeup.author?.handle ? <span>by {writeup.author.handle}</span> : null}
            {writeup.date ? <span>{formatDate(writeup.date)}</span> : null}
          </div>
          {writeup.excerpt ? <p className="summary">{writeup.excerpt}</p> : null}
          <div className="article-content">
            <PortableText value={writeup.content ?? []} />
          </div>
        </article>
      </div>
    </section>
  );
}

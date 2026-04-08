import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client } from '../../../lib/sanity.client';
import { blogPostBySlugQuery } from '../../../lib/sanity.queries';
import { formatDate } from '../../../lib/format';
import { urlFor } from '../../../lib/sanity.image';

type BlogParams = {
  slug: string;
};

export default async function BlogDetailPage({
  params
}: {
  params: Promise<BlogParams> | BlogParams;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }

  const post = await client.fetch(blogPostBySlugQuery, { slug: resolvedParams.slug });

  if (!post) {
    notFound();
  }

  const coverUrl = post.coverImage ? urlFor(post.coverImage)?.width(1200).height(700).url() : null;

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">Blog</div>
          <h1 className="page-title">{post.title}</h1>
        </div>
      </div>
      <div className="container">
        <article className="article reveal reveal-delay-1">
          {coverUrl ? (
            <Image className="cover" src={coverUrl} alt={post.title} width={1200} height={700} />
          ) : null}
          <div className="meta">
            {post.date ? <span>{formatDate(post.date)}</span> : null}
            {post.author?.handle ? <span>by {post.author.handle}</span> : null}
          </div>
          {post.summary ? <p className="summary">{post.summary}</p> : null}
          <div className="article-content">
            <PortableText value={post.content ?? []} />
          </div>
        </article>
      </div>
    </section>
  );
}

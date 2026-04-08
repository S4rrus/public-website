import Link from 'next/link';
import { client } from '../../lib/sanity.client';
import { blogPostsQuery } from '../../lib/sanity.queries';
import { formatDate } from '../../lib/format';

export default async function BlogPage() {
  const posts = await client.fetch(blogPostsQuery);

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">Articles & thoughts</div>
          <h1 className="page-title">Blog</h1>
        </div>

        <div className="blog-list reveal reveal-delay-1" style={{ marginBottom: 64 }}>
          {posts.map((post: any) => (
            <Link key={post._id} className="blog-post" href={`/blog/${post.slug?.current}`}>
              <div>
                <div className="blog-date">
                  {formatDate(post.date)}
                  {post.author?.handle ? ` · by ${post.author.handle}` : ''}
                </div>
                <div className="blog-title">{post.title}</div>
                <div className="blog-summary">{post.summary}</div>
                {post.tags?.length ? (
                  <div className="member-tags" style={{ marginTop: 14 }}>
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="member-tag">{tag}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="blog-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

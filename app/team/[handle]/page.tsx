import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '../../../lib/sanity.client';
import { teamMemberByHandleQuery } from '../../../lib/sanity.queries';
import { formatDate } from '../../../lib/format';
import { tagClass } from '../../../lib/tags';
import { urlFor } from '../../../lib/sanity.image';

type TeamMemberParams = {
  handle: string;
};

function initials(value?: string) {
  if (!value) return '??';
  const cleaned = value.replace(/[^a-z0-9]/gi, '').slice(0, 2);
  return cleaned || value.slice(0, 2);
}

export default async function TeamMemberPage({
  params
}: {
  params: Promise<TeamMemberParams> | TeamMemberParams;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.handle) {
    notFound();
  }

  const handleParam = decodeURIComponent(resolvedParams.handle).trim();
  const member = await client.fetch(teamMemberByHandleQuery, {
    handle: handleParam
  });

  if (!member) {
    notFound();
  }

  const avatarUrl = member.avatar ? urlFor(member.avatar)?.width(160).height(160).url() : null;
  const displayName = member.name || member.handle;
  const socials = (member.socials ?? []).filter((social: { url?: string }) => social?.url);

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">Team Member</div>
          <h1 className="page-title">{displayName}</h1>
        </div>

        <div className="member-hero reveal reveal-delay-1">
          <div className="member-avatar member-avatar-lg">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} width={120} height={120} />
            ) : (
              initials(member.handle)
            )}
          </div>
          <div className="member-hero-content">
            <div className="member-handle">@{member.handle}</div>
            {member.role ? <div className="member-role member-role-lg">{member.role}</div> : null}
            {member.bio ? <p className="member-bio">{member.bio}</p> : null}
            {member.tags?.length ? (
              <div className="member-tags">
                {member.tags.map((tag: string) => (
                  <span key={tag} className="member-tag">{tag}</span>
                ))}
              </div>
            ) : null}
            {socials.length ? (
              <div className="member-socials">
                {socials.map((social: { label?: string; url?: string }, idx: number) => (
                  <a
                    key={`${social.label ?? 'social'}-${idx}`}
                    className="member-social"
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {social.label || 'link'}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="member-section">
          <div className="member-section-title">Writeups by {displayName}</div>
          {member.writeups?.length ? (
            <div className="writeups-full member-writeups">
              {member.writeups.map((writeup: any) => (
                <Link
                  key={writeup._id}
                  className="writeup-card-full"
                  href={`/writeups/${writeup.slug?.current}`}
                >
                  <span className={`card-tag ${tagClass(writeup.category)}`}>{writeup.category}</span>
                  <div className="card-title">{writeup.title}</div>
                  <div className="card-meta">
                    {writeup.eventName ? <span>{writeup.eventName}</span> : null}
                    {writeup.date ? <span>{formatDate(writeup.date)}</span> : null}
                  </div>
                  {writeup.excerpt ? <div className="card-excerpt">{writeup.excerpt}</div> : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">No writeups yet.</div>
          )}
        </div>

        <div className="member-section">
          <div className="member-section-title">Blog posts by {displayName}</div>
          {member.blogPosts?.length ? (
            <div className="blog-list member-blogs">
              {member.blogPosts.map((post: any) => (
                <Link key={post._id} className="blog-post" href={`/blog/${post.slug?.current}`}>
                  <div>
                    <div className="blog-date">
                      {post.date ? formatDate(post.date) : null}
                      {post.tags?.length ? ` · ${post.tags.join(' · ')}` : ''}
                    </div>
                    <div className="blog-title">{post.title}</div>
                    {post.summary ? <div className="blog-summary">{post.summary}</div> : null}
                  </div>
                  <div className="blog-arrow">→</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">No blog posts yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}

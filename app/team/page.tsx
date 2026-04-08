import Image from 'next/image';
import Link from 'next/link';
import { client } from '../../lib/sanity.client';
import { teamMembersQuery, teamProfileQuery } from '../../lib/sanity.queries';
import { urlFor } from '../../lib/sanity.image';

function initials(value?: string) {
  if (!value) return '??';
  const cleaned = value.replace(/[^a-z0-9]/gi, '').slice(0, 2);
  return cleaned || value.slice(0, 2);
}

export default async function TeamPage() {
  const [members, profile] = await Promise.all([
    client.fetch(teamMembersQuery),
    client.fetch(teamProfileQuery)
  ]);

  const teamLogoUrl = profile?.logo ? urlFor(profile.logo)?.width(96).height(96).url() : null;
  const ctftimeUrl = profile?.ctftimeTeamId ? `https://ctftime.org/team/${profile.ctftimeTeamId}` : null;

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">The people</div>
          <h1 className="page-title">Team</h1>
        </div>

        {profile ? (
          <div className="team-profile-card">
            <div className="member-avatar" style={{ width: 56, height: 56 }}>
              {teamLogoUrl ? (
                <Image src={teamLogoUrl} alt={profile.name} width={56} height={56} />
              ) : (
                initials(profile.name)
              )}
            </div>
            <div>
              <div className="member-name" style={{ fontSize: 18 }}>{profile.name}</div>
              <div className="member-tags" style={{ marginTop: 8 }}>
                {profile.country ? <span className="member-tag">{profile.country}</span> : null}
                {profile.website ? (
                  <a className="member-tag" href={profile.website} target="_blank" rel="noreferrer">website</a>
                ) : null}
                {ctftimeUrl ? (
                  <a className="member-tag" href={ctftimeUrl} target="_blank" rel="noreferrer">ctftime</a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="team-grid reveal reveal-delay-1">
          {members.map((member: any) => {
            const handle = member.handle || member._id;
            return (
            <Link key={member._id} className="member-card member-card-link" href={`/team/${handle}`}>
              <div className="member-avatar">
                {member.avatar ? (
                  <Image
                    src={urlFor(member.avatar)?.width(88).height(88).url() ?? ''}
                    alt={member.name}
                    width={44}
                    height={44}
                  />
                ) : (
                  initials(member.handle)
                )}
              </div>
              <div className="member-name">{member.name || member.handle}</div>
              <div className="member-role">{member.role}</div>
              <div className="member-tags">
                {member.tags?.map((tag: string) => (
                  <span key={tag} className="member-tag">{tag}</span>
                ))}
              </div>
            </Link>
            );
          })}
        </div>

        <div className="join-card">
          <div>
            <div style={{ fontFamily: 'var(--font-hero)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Want to join sarrus?</div>
            <div style={{ fontSize: 12, color: 'var(--muted2)', fontWeight: 300 }}>We're always looking for passionate players. Reach out on Discord.</div>
          </div>
          <a className="btn btn-primary" href="/apply">Apply →</a>
        </div>
      </div>
    </section>
  );
}

import { client } from '../../lib/sanity.client';
import { siteSettingsQuery } from '../../lib/sanity.queries';

export default async function Footer() {
  const settings = await client.fetch(siteSettingsQuery);
  const socials = settings?.socials ?? [
    { label: 'CTFtime', url: 'https://ctftime.org/team/393723' },
    { label: 'GitHub', url: '#' },
    { label: 'Discord', url: '#' },
    { label: 'Twitter', url: '#' }
  ];
  const footerCopy = settings?.footerCopy ?? `© ${new Date().getFullYear()} sarrus CTF Team. All rights reserved.`;

  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}
              />
              sarrus
            </div>
            <div className="footer-copy" style={{ marginTop: 6 }}>{footerCopy}</div>
          </div>
          <ul className="footer-links">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.url} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

import './globals.css';
import { IBM_Plex_Mono, Syne, Space_Grotesk } from 'next/font/google';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { client } from '../lib/sanity.client';
import { siteSettingsQuery } from '../lib/sanity.queries';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne'
});

const plex = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-plex'
});

const hero = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hero'
});

export const metadata = {
  title: 'sarrus — CTF Team',
  description: 'sarrus is a competitive CTF team focused on web exploitation, binary analysis, cryptography, and reverse engineering.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await client.fetch(siteSettingsQuery);
  const socials: { label?: string; url?: string }[] = settings?.socials ?? [];
  const cta =
    socials.find((social) => social?.label?.toLowerCase() === 'ctftime') ||
    socials.find((social) => social?.label && social?.url) ||
    undefined;

  return (
    <html lang="en" className={`${syne.variable} ${plex.variable} ${hero.variable}`}>
      <body>
        <Nav cta={cta?.label && cta?.url ? { label: cta.label, url: cta.url } : undefined} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

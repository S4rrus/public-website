'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'home' },
  { href: '/writeups', label: 'writeups' },
  { href: '/results', label: 'results' },
  { href: '/team', label: 'team' },
  { href: '/blog', label: 'blog' }
];

type NavCta = {
  label: string;
  url: string;
};

export default function Nav({ cta }: { cta?: NavCta }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ctaLabel = cta?.label || 'ctftime';
  const ctaUrl = cta?.url || 'https://ctftime.org/team/393723';

  return (
    <nav>
      <Link href="/" className="nav-brand">
        <span className="dot" />sarrus
      </Link>
      <button
        className={`nav-toggle ${open ? 'open' : ''}`}
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>
      <ul className="nav-links">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive ? 'active' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <a
            className="nav-cta"
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
          >
            {ctaLabel} ↗
          </a>
        </li>
      </ul>
      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'active' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
        <a
          className="nav-cta"
          href={ctaUrl}
          target="_blank"
          rel="noreferrer"
        >
          {ctaLabel} ↗
        </a>
      </div>
    </nav>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const LABELS: Record<string, string> = {
  all: 'all',
  web: 'web',
  pwn: 'pwn',
  crypto: 'crypto',
  rev: 'reverse',
  forensics: 'forensics',
  misc: 'misc'
};

export default function WriteupFilters({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', cat);
    }
    const query = params.toString();
    router.replace(query ? `/writeups?${query}` : '/writeups');
  };

  return (
    <div className="filter-tabs" id="writeup-filters">
      {Object.keys(LABELS).map((key) => (
        <button
          key={key}
          className={`filter-tab ${active === key ? 'active' : ''}`}
          onClick={() => setCategory(key)}
          type="button"
        >
          {LABELS[key]}
        </button>
      ))}
    </div>
  );
}

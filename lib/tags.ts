const TAG_CLASS_MAP: Record<string, string> = {
  web: 'tag-web',
  pwn: 'tag-pwn',
  crypto: 'tag-crypto',
  rev: 'tag-rev',
  reverse: 'tag-rev',
  forensics: 'tag-forensics',
  misc: 'tag-misc'
};

export function tagClass(tag?: string) {
  if (!tag) return 'tag-misc';
  return TAG_CLASS_MAP[tag.toLowerCase()] ?? 'tag-misc';
}

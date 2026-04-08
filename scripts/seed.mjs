import 'dotenv/config';
import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-04-08',
  token,
  useCdn: false
});

const block = (text) => ([{
  _type: 'block',
  style: 'normal',
  children: [{ _type: 'span', text }],
  markDefs: []
}]);

const slugify = (text) => text
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 96);

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  heroEyebrow: 'Capture The Flag Team',
  heroTitle: 'We break things',
  heroHighlight: 'understand',
  heroSub: 'sarrus is a competitive CTF team focused on web exploitation, binary analysis, cryptography, and reverse engineering. We compete globally and share everything we learn.',
  primaryCtaLabel: 'Browse writeups →',
  primaryCtaHref: '/writeups',
  secondaryCtaLabel: 'Meet the team',
  secondaryCtaHref: '/team',
  footerCopy: '© 2025 sarrus CTF Team. All rights reserved.',
  socials: [
    { label: 'CTFtime', url: 'https://ctftime.org/team/393723' },
    { label: 'GitHub', url: '#' },
    { label: 'Discord', url: '#' },
    { label: 'Twitter', url: '#' }
  ]
};

const teamProfile = {
  _id: 'teamProfile-sarrus',
  _type: 'teamProfile',
  name: 'sarrus',
  slug: { _type: 'slug', current: 'sarrus' },
  country: 'DZ',
  ctftimeTeamId: 393723
};

const teamMembers = [
  {
    _id: 'teamMember-0xm4r',
    handle: '0xm4r',
    name: '0xm4r',
    role: 'Team Lead · Web',
    bio: 'Leads strategy and web exploitation with a focus on automation and OSINT-driven recon.',
    tags: ['web', 'misc', 'osint'],
    order: 1
  },
  {
    _id: 'teamMember-retr0',
    handle: 'retr0',
    name: 'retr0',
    role: 'Pwn · Reverse',
    bio: 'Specializes in binary exploitation, kernel internals, and reverse engineering.',
    tags: ['pwn', 'rev', 'kernel'],
    order: 2
  },
  {
    _id: 'teamMember-nullx',
    handle: 'nullx',
    name: 'nullx',
    role: 'Cryptography',
    bio: 'Works on cryptographic attacks, lattice techniques, and hard math challenges.',
    tags: ['crypto', 'math', 'ecc'],
    order: 3
  },
  {
    _id: 'teamMember-phantom',
    handle: 'phantom',
    name: 'phantom',
    role: 'Reverse Engineering',
    bio: 'Reverse engineering and malware analysis with a taste for obfuscated VMs.',
    tags: ['rev', 'malware', 'rust'],
    order: 4
  },
  {
    _id: 'teamMember-spectral',
    handle: 'spectral',
    name: 'spectral',
    role: 'Forensics · OSINT',
    bio: 'Focuses on memory forensics, incident triage, and OSINT workflows.',
    tags: ['forensics', 'osint', 'memory'],
    order: 5
  },
  {
    _id: 'teamMember-r4w',
    handle: 'r4w',
    name: 'r4w',
    role: 'Pwn · Exploit Dev',
    bio: 'Exploit development with a focus on heap primitives and modern mitigations.',
    tags: ['pwn', 'rop', 'heap'],
    order: 6
  },
  {
    _id: 'teamMember-vxor',
    handle: 'vxor',
    name: 'vxor',
    role: 'Web · Cloud',
    bio: 'Builds cloud and web attack chains, from SSRF to privilege escalation.',
    tags: ['web', 'cloud', 'aws'],
    order: 7
  },
  {
    _id: 'teamMember-z3r0t',
    handle: 'z3r0t',
    name: 'z3r0t',
    role: 'Misc · Scripting',
    bio: 'Automation, scripting, and quick tooling to accelerate the team.',
    tags: ['misc', 'python', 'automation'],
    order: 8
  }
].map((member) => ({
  _type: 'teamMember',
  ...member
}));

const memberRef = (handle) => ({ _type: 'reference', _ref: `teamMember-${handle}` });

const writeups = [
  {
    title: 'JWT Algorithm Confusion in Auth Bypass',
    category: 'web',
    eventName: 'HTB Cyber Apocalypse 2025',
    author: '0xm4r',
    excerpt: 'Exploiting RS256 to HS256 algorithm confusion to forge admin tokens without the private key.'
  },
  {
    title: 'Heap Feng Shui via tcache poisoning',
    category: 'pwn',
    eventName: 'DiceCTF 2025',
    author: 'retr0',
    excerpt: 'Chaining UAF with tcache poisoning for arbitrary write on hardened glibc.'
  },
  {
    title: 'Lattice Attack on Biased ECDSA Nonces',
    category: 'crypto',
    eventName: 'PicoCTF 2025',
    author: 'nullx',
    excerpt: 'Recovering private key from 50 signatures with 4 bits of nonce bias via LLL reduction.'
  },
  {
    title: 'Obfuscated VM Bytecode Reversing',
    category: 'rev',
    eventName: 'Midnight Sun CTF 2025',
    author: 'phantom',
    excerpt: 'Reversing a custom VM implemented in Rust with anti-debugging and opaque predicates.'
  },
  {
    title: 'Memory Forensics: LSASS Credential Dump',
    category: 'forensics',
    eventName: 'ångstromCTF 2025',
    author: 'spectral',
    excerpt: 'Extracting NT hashes from a Volatility memory dump of a compromised Windows host.'
  },
  {
    title: 'GraphQL Introspection to Admin RCE',
    category: 'web',
    eventName: 'Google CTF 2025',
    author: '0xm4r',
    excerpt: 'From introspection enabled to remote code execution via a chained IDOR + SSTI bug.'
  },
  {
    title: 'Pohlig-Hellman on Smooth Order Group',
    category: 'crypto',
    eventName: '0CTF 2025',
    author: 'nullx',
    excerpt: 'Solving DLOG over a group with 60-smooth order using Pohlig-Hellman decomposition.'
  },
  {
    title: 'Jail Break: Python Restricted Sandbox',
    category: 'misc',
    eventName: 'DiceCTF 2025',
    author: 'retr0',
    excerpt: 'Escaping a heavily restricted Python sandbox using __class__ MRO traversal tricks.'
  },
  {
    title: 'Format String Primitive to Libc Leak',
    category: 'pwn',
    eventName: 'HTB Cyber Apocalypse 2025',
    author: 'r4w',
    excerpt: 'Chaining a format string bug with ret2libc on a PIE binary with partial RELRO.'
  }
].map((writeup) => ({
  _id: `writeup-${slugify(writeup.title)}`,
  _type: 'writeup',
  title: writeup.title,
  slug: { _type: 'slug', current: slugify(writeup.title) },
  category: writeup.category,
  eventName: writeup.eventName,
  author: memberRef(writeup.author),
  date: '2025-01-15',
  excerpt: writeup.excerpt,
  content: block(writeup.excerpt)
}));

const blogPosts = [
  {
    title: 'How We Placed #3 at HTB Cyber Apocalypse 2025',
    date: '2025-06-12',
    author: '0xm4r',
    summary: 'A behind-the-scenes look at our strategy, team coordination, and the most interesting challenges we solved during 5 days of intense competition.',
    tags: ['ctf recap', 'team']
  },
  {
    title: "A Beginner's Guide to Lattice-Based Attacks on ECDSA",
    date: '2025-05-04',
    author: 'nullx',
    summary: 'An accessible deep dive into the mathematics of lattice attacks, why biased nonces are dangerous, and how to implement Howgrave-Graham\'s approach using SageMath.',
    tags: ['crypto', 'tutorial']
  },
  {
    title: 'Modern Heap Exploitation: tcache Poisoning in 2025',
    date: '2025-03-20',
    author: 'retr0',
    summary: "Glibc has evolved significantly. This post covers what still works, what's been patched, and the primitive you need to get arbitrary write on modern systems.",
    tags: ['pwn', 'heap', 'glibc']
  },
  {
    title: 'Reversing Custom Bytecode VMs: A Systematic Approach',
    date: '2025-02-01',
    author: 'phantom',
    summary: "Custom interpreters are a growing trend in CTF reversing challenges. Here's a repeatable methodology to identify the opcode table, map semantics, and decompile bytecode efficiently.",
    tags: ['reverse', 'vm']
  },
  {
    title: 'Volatility 3 Cheatsheet for CTF Forensics',
    date: '2025-01-10',
    author: 'spectral',
    summary: "Quick reference for the plugins you'll actually use in competition — from network artifacts to credential extraction — with real examples from recent CTFs.",
    tags: ['forensics', 'memory', 'tools']
  }
].map((post) => ({
  _id: `blog-${slugify(post.title)}`,
  _type: 'blogPost',
  title: post.title,
  slug: { _type: 'slug', current: slugify(post.title) },
  summary: post.summary,
  author: memberRef(post.author),
  date: post.date,
  tags: post.tags,
  content: block(post.summary)
}));

const results = [
  { eventName: 'HTB Cyber Apocalypse 2025', format: 'Jeopardy', date: '2025-03-01', rank: 3, score: 9850, writeupCount: 12 },
  { eventName: '0CTF/TCTF 2025', format: 'Jeopardy', date: '2025-01-01', rank: 8, score: 7100, writeupCount: 7 },
  { eventName: 'DiceCTF 2025', format: 'Jeopardy', date: '2025-02-01', rank: 17, score: 6420, writeupCount: 9 },
  { eventName: 'ångstromCTF 2025', format: 'Jeopardy', date: '2025-04-01', rank: 11, score: 8200, writeupCount: 8 },
  { eventName: 'Google CTF 2025', format: 'Jeopardy', date: '2025-06-01', rank: 22, score: 5900, writeupCount: 5 },
  { eventName: 'DEF CON CTF Quals 2024', format: 'Jeopardy', date: '2024-05-01', rank: 34, score: 4100, writeupCount: 4 },
  { eventName: 'PlaidCTF 2024', format: 'Jeopardy', date: '2024-04-01', rank: 51, score: 3200, writeupCount: 3 },
  { eventName: 'Midnight Sun CTF 2024', format: 'Jeopardy', date: '2024-04-01', rank: 9, score: 6750, writeupCount: 10 }
].map((result) => ({
  _id: `result-${slugify(result.eventName)}-${result.date}`,
  _type: 'result',
  ...result,
  source: 'seed'
}));

async function run() {
  const tx = client.transaction();

  tx.createOrReplace(siteSettings);
  tx.createOrReplace(teamProfile);

  teamMembers.forEach((doc) => tx.createOrReplace(doc));
  writeups.forEach((doc) => tx.createOrReplace(doc));
  blogPosts.forEach((doc) => tx.createOrReplace(doc));
  results.forEach((doc) => tx.createOrReplace(doc));

  await tx.commit();
  console.log('Seed complete');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

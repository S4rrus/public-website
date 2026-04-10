import { groq } from 'next-sanity';

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  heroEyebrow,
  heroTitle,
  heroHighlight,
  heroSub,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  footerCopy,
  socials[]{label, url}
}`;

export const statsQuery = groq`{
  "writeups": count(*[_type == "writeup"]),
  "results": count(*[_type == "result" && defined(rank) && rank <= 30]),
  "members": count(*[_type == "teamMember"]),
  "bestRank": *[_type == "result" && defined(rank)] | order(rank asc)[0].rank
}`;

export const recentWriteupsQuery = groq`*[_type == "writeup"] | order(date desc)[0..2]{
  _id,
  title,
  slug,
  category,
  eventName,
  excerpt,
  date
}`;

export const latestResultsQuery = groq`*[_type == "result" && defined(rank) && rank <= 30] | order(date desc)[0..2]{
  _id,
  eventName,
  date,
  rank,
  score
}`;

export const writeupsQuery = groq`*[_type == "writeup"] | order(date desc){
  _id,
  title,
  slug,
  category,
  eventName,
  excerpt,
  date,
  author->{name, handle}
}`;

export const writeupBySlugQuery = groq`*[_type == "writeup" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  category,
  eventName,
  excerpt,
  date,
  coverImage,
  content,
  author->{name, handle}
}`;

export const blogPostsQuery = groq`*[_type == "blogPost"] | order(date desc){
  _id,
  title,
  slug,
  summary,
  date,
  tags,
  author->{name, handle}
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  summary,
  date,
  tags,
  coverImage,
  content,
  author->{name, handle}
}`;

export const resultsQuery = groq`*[_type == "result" && defined(rank) && rank <= 30] | order(date desc){
  _id,
  eventName,
  eventId,
  eventUrl,
  format,
  date,
  rank,
  score,
  writeupCount
}`;

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc, handle asc){
  _id,
  handle,
  name,
  role,
  tags,
  avatar
}`;

export const teamMemberByHandleQuery = groq`*[_type == "teamMember" && (
  (defined(handle) && string::lower(handle) == string::lower($handle)) ||
  (defined(name) && string::lower(name) == string::lower($handle)) ||
  _id == $handle
)][0]{
  _id,
  handle,
  name,
  role,
  bio,
  tags,
  avatar,
  socials[]{label, url},
  "writeups": *[_type == "writeup" && author._ref == ^._id] | order(date desc){
    _id,
    title,
    slug,
    category,
    eventName,
    excerpt,
    date
  },
  "blogPosts": *[_type == "blogPost" && author._ref == ^._id] | order(date desc){
    _id,
    title,
    slug,
    summary,
    date,
    tags
  }
}`;

export const teamProfileQuery = groq`*[_type == "teamProfile"][0]{
  name,
  slug,
  logo,
  logoUrl,
  country,
  website,
  ctftimeTeamId
}`;

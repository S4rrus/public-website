import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = '2024-04-08';

if (!projectId || !dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET');
}

const clientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published'
} as const;

export const client = createClient(clientConfig);

export const writeClient = createClient({
  ...clientConfig,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'raw'
});

export type SanityConfig = typeof clientConfig;

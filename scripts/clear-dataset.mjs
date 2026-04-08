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
  useCdn: false,
  perspective: 'raw'
});

async function clearDataset() {
  const ids = await client.fetch('*[!(_id in path("_.**"))]._id');
  if (!ids.length) {
    console.log('Dataset already empty.');
    return;
  }

  const chunkSize = 100;
  let deleted = 0;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const batch = ids.slice(i, i + chunkSize);
    const tx = client.transaction();
    batch.forEach((id) => tx.delete(id));
    await tx.commit();
    deleted += batch.length;
    console.log(`Deleted ${deleted}/${ids.length} documents...`);
  }

  console.log('Dataset cleared.');
}

clearDataset().catch((err) => {
  console.error(err);
  process.exit(1);
});

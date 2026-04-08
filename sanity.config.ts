import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './sanity/schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
  || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  || '2cruxqzz';
const dataset = process.env.SANITY_STUDIO_DATASET
  || process.env.NEXT_PUBLIC_SANITY_DATASET
  || 'production';

export default defineConfig({
  name: 'default',
  title: 'sarrus',
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes
  }
});

import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from 'sanity';
import { client } from './sanity.client';

const builder = createImageUrlBuilder(client);

export function urlFor(source: Image | undefined) {
  if (!source) return null;
  return builder.image(source);
}

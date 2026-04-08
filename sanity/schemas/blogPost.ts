import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'summary', title: 'Summary', type: 'text' }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'teamMember' }] }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false })
  ],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'coverImage' }
  }
});

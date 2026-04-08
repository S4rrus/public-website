import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'writeup',
  title: 'Writeup',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Web', value: 'web' },
          { title: 'Pwn', value: 'pwn' },
          { title: 'Crypto', value: 'crypto' },
          { title: 'Reverse', value: 'rev' },
          { title: 'Forensics', value: 'forensics' },
          { title: 'Misc', value: 'misc' }
        ]
      }
    }),
    defineField({ name: 'eventName', title: 'Event Name', type: 'string' }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'teamMember' }] }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false })
  ],
  preview: {
    select: { title: 'title', subtitle: 'eventName', media: 'coverImage' }
  }
});

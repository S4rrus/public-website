import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'teamProfile',
  title: 'Team Profile',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Team Name', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 } }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'logoUrl', title: 'Logo Source URL', type: 'url' }),
    defineField({ name: 'country', title: 'Country Code', type: 'string' }),
    defineField({ name: 'website', title: 'Website', type: 'url' }),
    defineField({ name: 'ctftimeTeamId', title: 'CTFtime Team ID', type: 'number' }),
    defineField({ name: 'syncedAt', title: 'Synced At', type: 'datetime' })
  ],
  preview: {
    select: { title: 'name', media: 'logo' }
  }
});

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string' }),
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string' }),
    defineField({ name: 'heroHighlight', title: 'Hero Highlight', type: 'string' }),
    defineField({ name: 'heroSub', title: 'Hero Subcopy', type: 'text' }),
    defineField({ name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' }),
    defineField({ name: 'primaryCtaHref', title: 'Primary CTA Link', type: 'string' }),
    defineField({ name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' }),
    defineField({ name: 'secondaryCtaHref', title: 'Secondary CTA Link', type: 'string' }),
    defineField({ name: 'footerCopy', title: 'Footer Copy', type: 'string' }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'url', type: 'url', title: 'URL' }
          ]
        }
      ]
    })
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    }
  }
});

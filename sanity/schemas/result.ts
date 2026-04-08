import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'result',
  title: 'Result',
  type: 'document',
  fields: [
    defineField({ name: 'eventName', title: 'Event Name', type: 'string' }),
    defineField({ name: 'eventId', title: 'Event ID', type: 'number' }),
    defineField({ name: 'eventUrl', title: 'Event URL', type: 'url' }),
    defineField({ name: 'format', title: 'Format', type: 'string' }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'rank', title: 'Rank', type: 'number' }),
    defineField({ name: 'score', title: 'Score', type: 'number' }),
    defineField({ name: 'writeupCount', title: 'Writeup Count', type: 'number' }),
    defineField({ name: 'notes', title: 'Notes', type: 'text' }),
    defineField({ name: 'source', title: 'Source', type: 'string' }),
    defineField({ name: 'syncedAt', title: 'Synced At', type: 'datetime' })
  ],
  preview: {
    select: { title: 'eventName', subtitle: 'date' }
  }
});

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cards' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    technology: z.enum(['vue', 'javascript']),
  }),
});

const conspect = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conspect' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    technology: z.literal('vue'),
  }),
});

const roadmap = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roadmap' }),
  schema: z.object({
    day: z.enum(['day1', 'day2', 'day3', 'optional', 'glossary-terms', 'glossary-lifecycle']),
    title: z.string(),
    questions: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        body: z.string(),
      }),
    ),
  }),
});

export const collections = { cards, conspect, roadmap };

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

const roadmapQuestion = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  label: z.string().optional(),
  topic: z.string().optional(),
  note: z.string().optional(),
});

const roadmapDay = z.object({
  day: z.enum(['day1', 'day2', 'day3', 'optional', 'glossary-terms', 'glossary-lifecycle', 'catalog']),
  title: z.string(),
  questions: z.array(roadmapQuestion),
});

const roadmapInterview = z.object({
  interview: z.enum([
    'sirisha-wealth',
    'sree-wealth',
    'sree-digibank',
    'aravind-digibank',
    'rafeeq-digibank',
    'suryateja-digibank',
    'nagendra-digibank',
  ]),
  order: z.number(),
  title: z.string(),
  candidate: z.string(),
  interviewer: z.string(),
  initiative: z.string(),
  questions: z.array(roadmapQuestion),
});

const roadmap = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roadmap' }),
  schema: z.union([roadmapDay, roadmapInterview]),
});

export const collections = { cards, conspect, roadmap };

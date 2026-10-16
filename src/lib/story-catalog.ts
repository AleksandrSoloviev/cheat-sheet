import { getCollection, type CollectionEntry } from 'astro:content';
import { technologyLabel, withBase, type Locale } from '../i18n/ui';
import { renderMarkdown } from './markdown';
import { splitStorySections } from './story-sections';

const topicOrder = ['vue', 'next', 'epam-react'] as const;

const sourcesByTopic = {
  vue: ['day1', 'day2', 'day3', 'optional'],
  next: ['catalog'],
  'epam-react': [
    'sirisha-wealth',
    'sree-wealth',
    'sree-digibank',
    'aravind-digibank',
    'rafeeq-digibank',
    'suryateja-digibank',
    'nagendra-digibank',
  ],
} as const;

export type StoryTopicSlug = (typeof topicOrder)[number];

export type StoryQuestion = {
  key: string;
  source: string;
  id: string;
  title: string;
  topic: string;
  note: string;
  fallback: boolean;
  phraseHtml: string;
  shortHtml: string;
};

export type StoryTopic = {
  slug: StoryTopicSlug;
  label: string;
  planHref: string;
  questions: StoryQuestion[];
};

export type StoryCatalog = {
  locale: Locale;
  topics: StoryTopic[];
};

function pick(items: CollectionEntry<'roadmap'>[], locale: Locale, tech: string, source: string) {
  const own = items.find((item) => item.id === `${locale}/${tech}/${source}`);
  if (own) return { entry: own, usedFallback: false };
  const russian = items.find((item) => item.id === `ru/${tech}/${source}`);
  if (!russian) return undefined;
  return { entry: russian, usedFallback: locale !== 'ru' };
}

export async function buildStoryCatalog(locale: Locale): Promise<StoryCatalog> {
  const items = await getCollection('roadmap');
  const topics: StoryTopic[] = [];

  for (const slug of topicOrder) {
    const questions: StoryQuestion[] = [];
    for (const source of sourcesByTopic[slug]) {
      const picked = pick(items, locale, slug, source);
      if (!picked) continue;
      for (const question of picked.entry.data.questions) {
        const id = question.id.trim();
        const title = question.title.trim();
        if (!id || !title) continue;
        const sections = splitStorySections(question.body);
        const phrase = sections.phrase.trim();
        const short = sections.short.trim();
        if (!phrase && !short) continue;
        questions.push({
          key: `${slug}/${source}/${question.id}`,
          source,
          id: question.id,
          title: question.title,
          topic: question.topic ?? '',
          note: question.note ?? '',
          fallback: picked.usedFallback,
          phraseHtml: phrase ? renderMarkdown(phrase) : '',
          shortHtml: short ? renderMarkdown(short) : '',
        });
      }
    }
    if (questions.length === 0) continue;
    topics.push({
      slug,
      label: technologyLabel(locale, slug),
      planHref: withBase(`/${locale}/${slug}/roadmap`),
      questions,
    });
  }

  return { locale, topics };
}

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

type NamedCollection = 'cards' | 'conspect';

function splitId(id: string) {
  const [locale, technology, ...rest] = id.split('/');
  return { locale, technology, slug: rest.join('/') };
}

export async function entriesFor<C extends NamedCollection>(collection: C, locale: Locale, technology: string) {
  const items = await getCollection(collection);
  return items
    .filter((item) => {
      const parts = splitId(item.id);
      return parts.locale === locale && parts.technology === technology;
    })
    .sort((a, b) => a.data.order - b.data.order);
}

export async function entryWithFallback<C extends NamedCollection>(collection: C, locale: Locale, technology: string, slug: string) {
  const items = await getCollection(collection);
  const match = (loc: string) =>
    items.find((item) => {
      const parts = splitId(item.id);
      return parts.locale === loc && parts.technology === technology && parts.slug === slug;
    });
  const direct = match(locale);
  if (direct) return { entry: direct, usedFallback: false };
  if (locale !== 'ru') {
    const russian = match('ru');
    if (russian) return { entry: russian, usedFallback: true };
  }
  return { entry: undefined, usedFallback: false };
}

export function entrySlug(id: string) {
  return splitId(id).slug;
}

export async function localizedList<C extends NamedCollection>(collection: C, locale: Locale, technology: string) {
  const russian = await entriesFor(collection, 'ru', technology);
  if (locale === 'ru') {
    return russian.map((entry) => ({ entry, usedFallback: false }));
  }

  const local = await entriesFor(collection, locale, technology);
  const localBySlug = new Map(local.map((entry) => [entrySlug(entry.id), entry]));
  const russianBySlug = new Map(russian.map((entry) => [entrySlug(entry.id), entry]));
  const slugs = new Set([...russianBySlug.keys(), ...localBySlug.keys()]);

  return [...slugs]
    .flatMap((slug) => {
      const own = localBySlug.get(slug);
      if (own) return [{ entry: own, usedFallback: false }];
      const fallback = russianBySlug.get(slug);
      if (!fallback) return [];
      return [{ entry: fallback, usedFallback: true }];
    })
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
}

export type CardEntry = CollectionEntry<'cards'>;
export type ConspectEntry = CollectionEntry<'conspect'>;

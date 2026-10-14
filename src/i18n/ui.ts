export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];

const dictionary = {
  ru: {
    'site.title': 'Шпаргалки',
    'locale.ru': 'Русский',
    'locale.en': 'English',
    'nav.home': 'Технологии',
    'nav.backToTech': 'К разделу',
    'kind.cards': 'Карточки',
    'kind.conspect': 'Конспект',
    'kind.roadmap': 'План подготовки',
    'tech.vue': 'Vue',
    'tech.javascript': 'JavaScript',
    'home.lead': 'Короткие шпаргалки по технологиям. Сейчас здесь Vue и JavaScript.',
    'notFound.title': 'Такой страницы нет',
    'notFound.home': 'К списку технологий',
    'roadmap.day1': 'День 1',
    'roadmap.day2': 'День 2',
    'roadmap.day3': 'День 3',
    'roadmap.optional': 'Опционально',
    'roadmap.glossary': 'Глоссарий',
    'roadmap.terms': 'Термины',
    'roadmap.lifecycle': 'Жизненный цикл',
    'roadmap.done': 'вопросов закрыто',
    'conspect.prev': 'Предыдущий раздел',
    'conspect.next': 'Следующий раздел',
    'fallback.note': 'Английского текста этой записи пока нет. Показан русский оригинал.',
  },
  en: {
    'site.title': 'Cheat sheets',
    'locale.ru': 'Русский',
    'locale.en': 'English',
    'nav.home': 'Technologies',
    'nav.backToTech': 'Back to section',
    'kind.cards': 'Cards',
    'kind.conspect': 'Conspect',
    'kind.roadmap': 'Study plan',
    'tech.vue': 'Vue',
    'tech.javascript': 'JavaScript',
    'home.lead': 'Short cheat sheets by technology. Vue and JavaScript are here now.',
    'notFound.title': 'This page does not exist',
    'notFound.home': 'Back to technologies',
    'roadmap.day1': 'Day 1',
    'roadmap.day2': 'Day 2',
    'roadmap.day3': 'Day 3',
    'roadmap.optional': 'Optional',
    'roadmap.glossary': 'Glossary',
    'roadmap.terms': 'Terms',
    'roadmap.lifecycle': 'Lifecycle',
    'roadmap.done': 'checked',
    'conspect.prev': 'Previous section',
    'conspect.next': 'Next section',
    'fallback.note': 'There is no English text for this entry yet. Showing the Russian original.',
  },
} as const;

export type MessageKey = keyof (typeof dictionary)['ru'];

export function isLocale(value: string | undefined): value is Locale {
  return value === 'ru' || value === 'en';
}

export function t(locale: Locale, key: MessageKey): string {
  return dictionary[locale][key] ?? dictionary.ru[key];
}

export function technologyLabel(locale: Locale, slug: string): string {
  const key = `tech.${slug}`;
  const local = dictionary[locale] as Record<string, string>;
  const russian = dictionary.ru as Record<string, string>;
  return local[key] ?? russian[key] ?? slug;
}

export function swapLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split('/');
  if (parts[1] === 'ru' || parts[1] === 'en') {
    parts[1] = next;
    const nextPath = parts.join('/');
    return nextPath.endsWith('/') || nextPath.includes('.', 1) ? nextPath : `${nextPath}`;
  }
  return `/${next}/`;
}

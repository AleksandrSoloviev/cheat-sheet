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
    'tech.next': 'Next.js',
    'tech.epam-react': 'Епам Реакт',
    'home.lead': 'Короткие шпаргалки по технологиям. Сейчас здесь Vue, JavaScript, Next.js и Епам Реакт.',
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
    'roadmap.interviewer': 'Интервьюер',
    'roadmap.note': 'Заметка',
    'conspect.prev': 'Предыдущий раздел',
    'conspect.next': 'Следующий раздел',
    'fallback.note': 'Английского текста этой записи пока нет. Показан русский оригинал.',
    'stories.loading': 'Собираем вопросы',
    'stories.error': 'Не удалось открыть вопросы. Список технологий на месте.',
    'stories.endTitle': 'Пачка закончилась',
    'stories.close': 'Закрыть',
    'stories.prev': 'Назад',
    'stories.next': 'Дальше',
    'stories.more': 'Ещё вопросы',
    'stories.openPlan': 'В плане подготовки',
    'stories.position': '{current} из {total}',
    'stories.ringsLabel': 'Вопросы',
    'stories.segmentsLabel': 'Позиция в пачке',
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
    'tech.next': 'Next.js',
    'tech.epam-react': 'EPAM React',
    'home.lead': 'Short cheat sheets by technology. Vue, JavaScript, Next.js, and EPAM React are here now.',
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
    'roadmap.interviewer': 'Interviewer',
    'roadmap.note': 'Note',
    'conspect.prev': 'Previous section',
    'conspect.next': 'Next section',
    'fallback.note': 'There is no English text for this entry yet. Showing the Russian original.',
    'stories.loading': 'Picking questions',
    'stories.error': 'Could not open the questions. The technology list is still here.',
    'stories.endTitle': 'This batch is done',
    'stories.close': 'Close',
    'stories.prev': 'Back',
    'stories.next': 'Next',
    'stories.more': 'More questions',
    'stories.openPlan': 'Open the study plan',
    'stories.position': '{current} of {total}',
    'stories.ringsLabel': 'Questions',
    'stories.segmentsLabel': 'Place in the batch',
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

function basePath(): string {
  const base = import.meta.env.BASE_URL;
  return !base || base === '/' ? '' : base.replace(/\/$/, '');
}

export function withBase(path: string): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${basePath()}${suffix}`;
}

export function withoutBase(pathname: string): string {
  const prefix = basePath();
  if (prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return pathname.slice(prefix.length) || '/';
  }
  return pathname;
}

export function localeFromPathname(pathname: string): Locale {
  const segment = withoutBase(pathname).split('/').filter(Boolean)[0];
  return isLocale(segment) ? segment : 'ru';
}

export function swapLocalePath(pathname: string, next: Locale): string {
  const rest = withoutBase(pathname);
  const parts = rest.split('/');
  if (parts[1] === 'ru' || parts[1] === 'en') {
    parts[1] = next;
    return `${basePath()}${parts.join('/')}`;
  }
  return withBase(`/${next}/`);
}

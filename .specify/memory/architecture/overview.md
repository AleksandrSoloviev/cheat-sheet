# Architecture Overview

## System Shape

One static Astro site. Content is Markdown. There is no API server.

## Major Components

- `src/data/technologies.ts` — which technologies exist and which material kinds they have.
- `src/content/cards`, `src/content/conspect`, `src/content/roadmap` — `{locale}/{technology}/` files.
- `src/pages/[locale]/` — home, technology page, card, conspect, Vue roadmap, and Next roadmap.
- `src/layouts/Base.astro` and `src/components/` — header, locale switch, technology list, roadmap.
- `src/middleware.ts` and `src/pages/404.astro` — `/` and an unknown locale prefix go to the Russian path.

## Runtime Boundaries

- Pages read content collections at build time. They do not read a database.
- The roadmap script in the browser toggles Vue day tabs and writes checkbox progress. Next is one catalog list and writes its own progress key.

## External Integrations

- Google Fonts stylesheet in `Base.astro` (IBM Plex Sans, Mono, Serif).

## Key Constraints

- Locales are path prefixes: `/ru/...` and `/en/...`.
- A technology not listed in `technologies.ts` is not linked and is a 404.

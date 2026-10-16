# Architecture Overview

## System Shape

One static Astro site. Content is Markdown. There is no API server.

## Major Components

- `src/data/technologies.ts` — which technologies exist and which material kinds they have.
- `src/content/cards`, `src/content/conspect`, `src/content/roadmap` — `{locale}/{technology}/` files.
- `src/pages/[locale]/` — home, technology page, card, conspect, and study plans. `src/pages/stories/[locale].json.ts` emits the home reel catalog.
- `src/lib/story-sections.ts` splits a roadmap answer into the spoken phrase and the short answer. `src/lib/story-catalog.ts` builds the reel catalog from those sections.
- `src/layouts/Base.astro` and `src/components/` — header, locale switch, technology list, roadmap, and `HomeStories.astro` on the locale home.
- `src/middleware.ts` and `src/pages/404.astro` — `/` and an unknown locale prefix go to the Russian path.

## Runtime Boundaries

- Pages read content collections at build time. They do not read a database.
- The roadmap script in the browser toggles Vue day tabs and writes checkbox progress. Next and EPAM React are catalog lists and write their own progress keys.
- The home reel fetches the static story catalog and remembers shown question keys in the browser. It does not add a route.

## External Integrations

- Google Fonts stylesheet in `Base.astro` (IBM Plex Sans, Mono, Serif).

## Key Constraints

- Locales are path prefixes: `/ru/...` and `/en/...`.
- A technology not listed in `technologies.ts` is not linked and is a 404.

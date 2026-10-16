# Architecture Data Flow

## Inputs

- Markdown under `src/content/`, plus `src/data/technologies.ts` and `src/i18n/ui.ts`.
- In the browser: locale links, technology links, roadmap tabs, question checkboxes, and the home question reel.

## Core Processing Flow

1. Astro reads the content collections and emits HTML for `ru` and `en`.
2. `/` redirects to `/ru/`. An unknown locale prefix redirects to the same path under `/ru`.
3. A page prefers the file for the URL locale. If that file is missing, it renders the Russian file and marks that item.
4. The Vue roadmap script reads `localStorage` keys `vue-roadmap-done-v1` and `vue-roadmap-tab-v1`, then shows one day panel. The Next roadmap reads and writes only `next-roadmap-done-v1` and does not use a tab key. The EPAM React plan uses `epam-react-roadmap-done-v1`.
5. The home reel does not inline answer bodies. The build writes `/stories/{locale}.json` from the spoken-phrase and short-answer sections of existing roadmap questions. The browser fetches that file and shows one section per frame.

## Outputs

- Static HTML.
- Updated `localStorage` for Vue roadmap progress and the selected day tab, for Next and EPAM React question checks, and for reel questions already shown (`prep-stories-seen-v1`).

## Persistence

- Notes live in the repo. Checkbox progress, the last Vue roadmap tab, and the reel seen-log live in the browser. The seen-log stores one question key, not a separate key per frame.
- `specs/` is gitignored.

## Failure and Recovery

- `localStorage` read/write is wrapped in try/catch and ignored on failure. The roadmap still renders, and the reel still shows a frame.
- If the reel catalog fails to load, the technology list stays in the document and the reel shows an error. The reel does not read or write roadmap checkbox keys.
- Unknown technology, kind, or slug is the 404 page.

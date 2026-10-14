# Architecture Data Flow

## Inputs

- Markdown under `src/content/`, plus `src/data/technologies.ts` and `src/i18n/ui.ts`.
- In the browser: locale links, technology links, roadmap tabs, and question checkboxes.

## Core Processing Flow

1. Astro reads the content collections and emits HTML for `ru` and `en`.
2. `/` redirects to `/ru/`. An unknown locale prefix redirects to the same path under `/ru`.
3. A page prefers the file for the URL locale. If that file is missing, it renders the Russian file and marks that item.
4. The roadmap script reads `localStorage` keys `vue-roadmap-done-v1` and `vue-roadmap-tab-v1`, then shows one day panel.

## Outputs

- Static HTML.
- Updated `localStorage` for roadmap progress and the selected day tab.

## Persistence

- Notes live in the repo. Checkbox progress and the last roadmap tab live in the browser.
- `specs/` is gitignored.

## Failure and Recovery

- `localStorage` read/write is wrapped in try/catch and ignored on failure. The roadmap still renders.
- Unknown technology, kind, or slug is the 404 page.

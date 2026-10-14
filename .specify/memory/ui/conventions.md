# UI Conventions

## State-modeling conventions

- Locale is the first URL segment, not a stored preference.
- A list entry uses the locale file when it exists and the Russian file otherwise. The fallback note is shown on that entry, not on the whole page.
- Vue roadmap days are panels on one route. The selected day is `localStorage` key `vue-roadmap-tab-v1`. Checked question ids are `vue-roadmap-done-v1` and are shared by both locales.
- A technology whose only roadmap file is `catalog` renders one question list. It has no day tabs and no glossary. Next checked ids are `next-roadmap-done-v1`, shared by both locales, with no tab key.
- Glossary subtab starts on `terms` and is not stored.

## Reusable components / patterns

- `Base.astro` wraps every page.
- `LocaleSwitch.astro` rewrites the locale prefix.
- `TechList.astro` renders `src/data/technologies.ts`. Labels come from `technologyLabel()`.
- `RoadmapApp.astro` renders Vue days, questions, and the glossary, or a single catalog list when the page passes `mode="catalog"`.

## Design-token / theme conventions

- Dark theme only, on `:root`: `--bg`, `--bg2`, `--bg3`, `--line`, `--text`, `--muted`, `--accent`, `--accent2`, `--card`.
- No light-theme switch.
- Type: IBM Plex Serif for headings, IBM Plex Sans for body, IBM Plex Mono for code.

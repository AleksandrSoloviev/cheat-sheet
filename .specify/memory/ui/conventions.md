# UI Conventions

## State-modeling conventions

- Locale is the first URL segment, not a stored preference.
- A list entry uses the locale file when it exists and the Russian file otherwise. The fallback note is shown on that entry, not on the whole page.
- Roadmap days are panels on one route. The selected day is `localStorage` key `vue-roadmap-tab-v1`. Checked question ids are `vue-roadmap-done-v1` and are shared by both locales.
- Glossary subtab starts on `terms` and is not stored.

## Reusable components / patterns

- `Base.astro` wraps every page.
- `LocaleSwitch.astro` rewrites the locale prefix.
- `TechList.astro` renders `src/data/technologies.ts`. Labels come from `technologyLabel()`.
- `RoadmapApp.astro` renders days, questions, and the glossary.

## Design-token / theme conventions

- Dark theme only, on `:root`: `--bg`, `--bg2`, `--bg3`, `--line`, `--text`, `--muted`, `--accent`, `--accent2`, `--card`.
- No light-theme switch.
- Type: IBM Plex Serif for headings, IBM Plex Sans for body, IBM Plex Mono for code.

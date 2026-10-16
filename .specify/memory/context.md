# Project Context

## Purpose

A static site of cheat sheets grouped by technology, in Russian and English. Vue notes were written for a reader with a React background and keep those comparisons.

## Primary Users

- The author, reading and extending the cheat sheets.

## Current Scope

- Astro site in the repo root. Locales `ru` (default) and `en`.
- `vue`: cards, conspect, and a study plan with saved checkboxes.
- `javascript`: cards only.
- `next`: a study plan only, questions 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 16, 17, 18, 19, 20, 21, and 22.
- `epam-react`: a study plan only, seven DBS React interviews, 259 questions with answers in Russian and English.
- The locale home opens a short reel of those existing study-plan questions: the spoken phrase, then the short answer. It does not add study text.
- Spec Kit files under `.specify/` and `.cursor/commands/`.

## Non-Goals

- A general `react` section and backend are not in the registry or the content tree. `epam-react` is only the EPAM interview plan.
- Next has no cards and no conspect. Questions 10 and 12–15 are not published yet.
- No accounts, database, or in-browser editor.
- GitHub Actions publishes the static site to GitHub Pages on push to `main`. Locally the site stays at `/`. The Pages build uses the repository name as the base path.

## Open Questions

- TODO: No pull-request or release process is documented.

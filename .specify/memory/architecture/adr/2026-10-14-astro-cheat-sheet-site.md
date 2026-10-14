# Astro cheat-sheet site

## Context

The repo held a Vue conspect, a single HTML roadmap, and two Word cheat sheets. The work item asked for a small site split by technology, with Russian and English.

## Decision

Use Astro 7 and Markdown collections. A technology is a row in `src/data/technologies.ts` plus files under `src/content/{kind}/{locale}/{slug}/`. Locales are `/ru` and `/en`. This iteration publishes `vue` (cards, conspect, roadmap) and `javascript` (cards only).

## Consequences

Next, React, and backend stay out of the registry until a later work item. English pages fall back to Russian per missing file. Checkbox progress stays in `localStorage`, shared across locales.

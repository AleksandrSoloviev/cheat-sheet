# Next study plan

## Context

The cheat-sheet site already had Vue days and a JavaScript card list. The next course batch is four numbered questions, not a three-day plan, and those numbers must stay stable when later questions arrive.

## Decision

Publish technology `next` with kind `roadmap` only. Questions live in `src/content/roadmap/{ru,en}/next/catalog.md` with `day: catalog`. `RoadmapApp` shows one list and skips day tabs and the glossary. Checked ids use `localStorage` key `next-roadmap-done-v1`, shared by both locales. Vue keeps `vue-roadmap-done-v1` and `vue-roadmap-tab-v1`.

## Consequences

React and backend stay out of the registry. Next has no cards and no conspect. Questions 17, 18, 19, 21, and 22 are reserved and are not files yet. The earlier decision that Next stays out of the registry is superseded for this slug only.

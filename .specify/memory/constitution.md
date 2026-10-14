# Cheat Sheet Constitution

## Core Principles

### I. Study materials in a static site

The repository is a static cheat-sheet site. Add a technology by a registry entry and content files. Do not add a backend, accounts, or a browser editor unless a work item asks for them.

### II. React comparison stays explicit

Vue notes keep a React comparison where the source material has one. Do not add comparisons that were not in the source.

### III. Facts over invented curriculum

New study text comes from existing notes or from an explicit request. Unknowns stay as `TODO:`.

### IV. Static delivery

The site is built with Astro and opened through `npm run dev` or the static `dist/` output. There is no application server and no database.

### V. Small artifact set

Inside a technology, cards, the conspect, and the study plan stay separate collections. Do not copy a full conspect answer onto every card.

## Content Constraints

- Locales are `ru` and `en`. Russian is the default and the fallback when an English file is missing.
- Technology slugs: `vue`, `javascript`, `next`. Do not add `react` or `backend` until a work item asks for them.
- No test runner is configured.

## Change Workflow

- Spec Kit commands live in `.cursor/commands/`.
- Durable project memory lives in `.specify/memory/` and is updated by `/speckit.finalize`.
- TODO: No pull-request or release process is documented.

## Governance

This constitution records the shape of the cheat-sheet site. If a work item changes that shape, amend this file in the same change.

**Version**: 1.2.0 | **Ratified**: 2026-10-14 | **Last Amended**: 2026-10-14

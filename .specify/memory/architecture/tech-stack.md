# Architecture Tech Stack

## Languages and Runtimes

- TypeScript and Astro templates.
- Node.js `>=22` (`package.json` `engines`). The development machine used Node 26.8.1.
- Markdown content collections.

## Frameworks and Libraries

- Astro 7.3.8 (`package.json`). No React, Vue, or UI kit runtime.
- Fonts: IBM Plex Sans, IBM Plex Mono, IBM Plex Serif via Google Fonts.

## Tooling

- Scripts: `npm run dev`, `npm run build`, `npm run preview`.
- Spec Kit: `.specify/scripts/bash/`, commands in `.cursor/commands/`.
- No test runner, linter, or formatter is configured.
- A `.venv` directory may exist on disk. The site build does not use it.

## Infrastructure and Delivery

- No Dockerfile, Makefile, or CI config.
- `npm run build` writes static files to `dist/`.

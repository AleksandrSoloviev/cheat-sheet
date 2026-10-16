# Screen Registry

Updated by `/speckit.finalize` from `specs/007-story-reels/ui-plan.md`. Earlier rows still record the work item that last changed them.

| SCREEN-ID | Screen name | Route | Archetype | Controller | Touched (work-items) |
|-----------|-------------|-------|-----------|------------|----------------------|
| SCREEN-app-frame | App frame | layout for `/{locale}/...` | shell | `src/layouts/Base.astro` | 001-cheat-sheet-app |
| SCREEN-locale-redirect | Locale redirect | `/` and any prefix other than `ru` or `en` | gate | `src/pages/index.astro`, `src/middleware.ts`, `src/pages/404.astro` | 001-cheat-sheet-app |
| SCREEN-technology-list | Technology list | `/{locale}/` | composite | `src/pages/[locale]/index.astro`, `src/components/HomeStories.astro` | 007-story-reels |
| SCREEN-technology-home | Technology home | `/{locale}/{tech}/` | collection | `src/pages/[locale]/[tech]/index.astro` | 002-next-qa |
| SCREEN-card | Card | `/{locale}/{tech}/cards/{slug}` | detail | `src/pages/[locale]/[tech]/cards/[slug].astro` | 001-cheat-sheet-app |
| SCREEN-conspect | Conspect section | `/{locale}/vue/conspect/{slug}` | detail | `src/pages/[locale]/[tech]/conspect/[...slug].astro` | 001-cheat-sheet-app |
| SCREEN-roadmap | Vue study plan | `/{locale}/vue/roadmap` | composite | `src/components/RoadmapApp.astro` | 001-cheat-sheet-app |
| SCREEN-next-roadmap | Next study plan | `/{locale}/next/roadmap` | collection | `src/components/RoadmapApp.astro` | 002-next-qa |
| SCREEN-not-found | Not found | unknown slug, kind, or technology | detail | `src/pages/404.astro` | 002-next-qa |

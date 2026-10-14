# Screen Registry

Updated by `/speckit.finalize` from `specs/001-cheat-sheet-app/ui-plan.md`.

| SCREEN-ID | Screen name | Route | Archetype | Controller | Touched (work-items) |
|-----------|-------------|-------|-----------|------------|----------------------|
| SCREEN-app-frame | App frame | layout for `/{locale}/...` | shell | `src/layouts/Base.astro` | 001-cheat-sheet-app |
| SCREEN-locale-redirect | Locale redirect | `/` and any prefix other than `ru` or `en` | gate | `src/pages/index.astro`, `src/middleware.ts`, `src/pages/404.astro` | 001-cheat-sheet-app |
| SCREEN-technology-list | Technology list | `/{locale}/` | collection | `src/pages/[locale]/index.astro` | 001-cheat-sheet-app |
| SCREEN-technology-home | Technology home | `/{locale}/{tech}/` | collection | `src/pages/[locale]/[tech]/index.astro` | 001-cheat-sheet-app |
| SCREEN-card | Card | `/{locale}/{tech}/cards/{slug}` | detail | `src/pages/[locale]/[tech]/cards/[slug].astro` | 001-cheat-sheet-app |
| SCREEN-conspect | Conspect section | `/{locale}/vue/conspect/{slug}` | detail | `src/pages/[locale]/[tech]/conspect/[...slug].astro` | 001-cheat-sheet-app |
| SCREEN-roadmap | Vue study plan | `/{locale}/vue/roadmap` | composite | `src/components/RoadmapApp.astro` | 001-cheat-sheet-app |
| SCREEN-not-found | Not found | unknown slug or technology | detail | `src/pages/404.astro` | 001-cheat-sheet-app |

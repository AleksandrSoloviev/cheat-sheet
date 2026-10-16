# Navigation Map

No authentication. Locales are `ru` and `en`.

## Guards and redirects

| Route | Guard | Where it sends on denial |
|-------|-------|--------------------------|
| `/` | none | `/ru/` |
| `/{unknown}/...` | prefix is not `ru` or `en` | same path under `/ru` |
| `/{locale}/{tech}` | `tech` must be in `src/data/technologies.ts` | 404 |
| `/{locale}/javascript/conspect` and `.../roadmap` | javascript has only `cards` | 404 |
| `/{locale}/next/cards` and `.../conspect` | next has only `roadmap` | 404 |

## Transition edges

- `SCREEN-locale-redirect` → `SCREEN-technology-list` (`/ru/`) : opening `/` or an unknown locale.
- `SCREEN-technology-list` → `SCREEN-technology-home` : technology link.
- `SCREEN-technology-list` stays on `/{locale}/` when the short question reel opens or closes. A full load of that document opens the reel. Closing it leaves the technology list and the topic rings.
- `SCREEN-technology-list` reel plan link → `SCREEN-roadmap` when the frame is Vue, and → `SCREEN-next-roadmap` when the frame is Next.js. An EPAM React frame goes to `/{locale}/epam-react/roadmap`. That page has no row in the screen registry.
- `SCREEN-app-frame` locale switch on the reel reloads the home document and opens the reel again.
- `SCREEN-technology-home` → `SCREEN-card` : card link, when `cards` is a kind.
- `SCREEN-technology-home` → `SCREEN-conspect` : section link, Vue only.
- `SCREEN-technology-home` → `SCREEN-roadmap` : study-plan link when the technology is `vue`.
- `SCREEN-technology-home` → `SCREEN-next-roadmap` : study-plan link when the technology is `next`.
- `SCREEN-app-frame` locale switch : same path with `/ru` or `/en`.
- `SCREEN-roadmap` tab `day1` → panels `day2`, `day3`, `optional`, `glossary` : `data-tab`. Default `day1` unless `localStorage` `vue-roadmap-tab-v1` says otherwise.
- Glossary panel → `terms` or `lifecycle` : `data-gloss`. `terms` is shown first. The subtab is not stored.
- `SCREEN-next-roadmap` has no day tabs and no glossary. Checked ids are `localStorage` key `next-roadmap-done-v1`, shared by `ru` and `en`. There is no tab key.
- `SCREEN-not-found` → `SCREEN-technology-list` : home link.

## Graph

```mermaid
flowchart LR
  redirect[locale redirect]
  list[technology list]
  home[technology home]
  card[card]
  conspect[conspect]
  roadmap[vue roadmap]
  nextRoadmap[next roadmap]
  epamRoadmap[epam roadmap]
  missing[not found]
  redirect --> list
  list --> home
  list --> roadmap
  list --> nextRoadmap
  list --> epamRoadmap
  home --> card
  home --> conspect
  home --> roadmap
  home --> nextRoadmap
  missing --> list
```

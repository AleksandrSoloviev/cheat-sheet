---
order: 11
title: "11. Nuxt 3"
technology: vue
---

### Q51. Чем Nuxt 3 отличается от «голого» Vue?

**Короткий ответ на собесесе:**  
Nuxt 3 — фреймворк над Vue: file-based routing, SSR/SSG/hybrid, auto-imports, `server/` API (Nitro), модули, `useFetch`/`useAsyncData`, middleware, layouts. По роли ≈ **Next.js для Vue**.

---

#### Подробно

Из коробки:
- `pages/` → роуты
- `layouts/`
- `middleware/`
- `plugins/`
- `server/api/`
- auto-import Vue/composables
- конфиг `nuxt.config.ts`

Режимы рендера: SSR, SSG, SPA-like, route rules (hybrid).  
«Голый» Vue + Vite — когда нужен чистый CSR SPA без серверных фич Nuxt.

---

#### React — для якоря в голове

Next.js App/Pages Router = ближайший аналог. Vite SPA ≈ Create React App/Vite React без Next.

---

#### Фраза «на автомате» (1–2 предложения)

> Nuxt = Next для Vue: file routing, SSR, server API, useAsyncData; голый Vue+Vite — CSR SPA.

---

### Q52. `useFetch` vs `useAsyncData`?

**Короткий ответ на собесесе:**  
`useAsyncData` — примитив: ключ + async factory. `useFetch` — сахар над ним + `$fetch` (URL/options). Оба важны для SSR: ключ кэша/дедуп и перенос payload на клиент.

---

#### Подробно

```ts
const { data, pending, error, refresh } = await useFetch('/api/users', {
  query: { page },
})

// эквивалент по духу:
const { data } = await useAsyncData('users', () => $fetch('/api/users'))
```

**Ключ** должен быть стабильным и уникальным для набора параметров — иначе гидрация/кэш поедут.  
Не трогай `window`/`document` внутри factory без `import.client` / проверки process.client.

---

#### React — для якоря в голове

Next: fetch на сервере / `getServerSideProps`; на клиенте — SWR/React Query. Ключи кэша — та же ментальная модель.

---

#### Фраза «на автомате» (1–2 предложения)

> useFetch = useAsyncData + $fetch; критичен уникальный ключ для SSR/hydration.

---

### Q53. Hydration mismatch — что это?

**Короткий ответ на собесесе:**  
SSR прислал HTML, клиент при гидрации нарисовал другое → warning/баг. Причины: `Date.now()`, `random`, `window` в setup, разные данные/локаль. Фикс: одинаковый источник, `ClientOnly`, browser-only в `onMounted`.

---

#### Подробно

Типичные виновники:
- время/случайность в render;
- `localStorage` при первом render;
- разные user-agent ветки;
- несовпавший ключ `useAsyncData`.

Стратегии:
- рендерить нестабильное только на клиенте;
- `<ClientOnly>` для виджетов;
- не мутировать DOM вручную до гидрации.

---

#### React — для якоря в голове

Та же hydration warning в React SSR/Next — идеологически идентично.

---

#### Фраза «на автомате» (1–2 предложения)

> Mismatch = HTML сервера ≠ клиент; убери random/window из первого render, выровняй данные.

---

### Q54. Middleware в Nuxt?

**Короткий ответ на собесесе:**  
Middleware — функции, бегущие до рендера страницы (часто auth redirect). Бывают глобальные (`middleware/auth.global.ts`) и именованные, подключаемые в `definePageMeta`. Похоже на router guards + Next middleware.

---

#### Подробно

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useAuth()
  if (!loggedIn.value) return navigateTo('/login')
})
```

```ts
definePageMeta({ middleware: 'auth' })
```

Порядок и server/client выполнение важны в SSR. Тяжёлую логику не раздувай — middleware на критическом пути навигации.

---

#### React — для якоря в голове

Next.js middleware (edge) + RR beforeLoad/loaders — близкие роли. Vue Router `beforeEach` — аналог вне Nuxt.

---

#### Фраза «на автомате» (1–2 предложения)

> Nuxt middleware = pre-render guards (auth и т.п.), global или через definePageMeta.

---

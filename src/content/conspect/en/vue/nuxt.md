---
order: 11
title: "11. Nuxt 3"
technology: vue
---

### Q51. How does Nuxt 3 differ from plain Vue?

**Short interview answer:**  
Nuxt 3 is a framework on top of Vue: file-based routing, SSR/SSG/hybrid, auto-imports, a `server/` API (Nitro), modules, `useFetch`/`useAsyncData`, middleware, and layouts. By role it is roughly **Next.js for Vue**.

---

#### In detail

Out of the box:
- `pages/` → routes
- `layouts/`
- `middleware/`
- `plugins/`
- `server/api/`
- auto-import of Vue and composables
- the `nuxt.config.ts` config

Render modes: SSR, SSG, SPA-like, and route rules (hybrid).  
Plain Vue + Vite is what you want when you need a pure CSR SPA without Nuxt’s server features.

---

#### React — a mental anchor

The Next.js App Router and Pages Router are the closest analog. A Vite SPA is roughly Create React App or Vite React without Next.

---

#### Autopilot phrase (1–2 sentences)

> Nuxt = Next for Vue: file routing, SSR, a server API, useAsyncData; plain Vue + Vite is a CSR SPA.

---

### Q52. `useFetch` vs `useAsyncData`?

**Short interview answer:**  
`useAsyncData` is the primitive: a key plus an async factory. `useFetch` is sugar over it plus `$fetch` (a URL and options). Both matter for SSR: a cache and dedup key, and shipping the payload to the client.

---

#### In detail

```ts
const { data, pending, error, refresh } = await useFetch('/api/users', {
  query: { page },
})

// equivalent in spirit:
const { data } = await useAsyncData('users', () => $fetch('/api/users'))
```

The **key** must be stable and unique for a given set of parameters — otherwise hydration and the cache drift apart.  
Do not touch `window` or `document` inside the factory without `import.client` or a `process.client` check.

---

#### React — a mental anchor

Next: fetch on the server, or `getServerSideProps`; on the client, SWR or React Query. Cache keys are the same mental model.

---

#### Autopilot phrase (1–2 sentences)

> useFetch = useAsyncData + $fetch; a unique key is critical for SSR and hydration.

---

### Q53. What is a hydration mismatch?

**Short interview answer:**  
SSR sent HTML, and during hydration the client rendered something else, which shows up as a warning or a bug. Causes: `Date.now()`, `random`, `window` in setup, or different data or locale. The fix: the same source of data, `ClientOnly`, and browser-only work in `onMounted`.

---

#### In detail

Typical culprits:
- time or randomness in render;
- `localStorage` on the first render;
- different user-agent branches;
- a mismatched `useAsyncData` key.

Strategies:
- render unstable content only on the client;
- `<ClientOnly>` for widgets;
- do not mutate the DOM by hand before hydration.

---

#### React — a mental anchor

The same hydration warning in React SSR and in Next — the same idea.

---

#### Autopilot phrase (1–2 sentences)

> A mismatch means the server HTML is not the client HTML; remove random and window from the first render, and align the data.

---

### Q54. What is middleware in Nuxt?

**Short interview answer:**  
Middleware is functions that run before the page renders (often an auth redirect). They come in global form (`middleware/auth.global.ts`) and as named middleware attached in `definePageMeta`. Similar to router guards plus Next middleware.

---

#### In detail

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

Order, and whether the function runs on the server or the client, matters under SSR. Do not pile heavy logic in there — middleware sits on the critical path of navigation.

---

#### React — a mental anchor

Next.js middleware (edge) and RR `beforeLoad` / loaders play similar roles. Vue Router `beforeEach` is the analog outside Nuxt.

---

#### Autopilot phrase (1–2 sentences)

> Nuxt middleware means pre-render guards (auth and the like), either global or via definePageMeta.

---

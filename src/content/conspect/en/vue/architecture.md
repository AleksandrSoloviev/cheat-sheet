---
order: 15
title: "15. Architecture and behavioral questions"
technology: vue
---

### Q66. How do you structure a Vue project?

**Short interview answer:**  
Do not dump everything into `components/`. Split by layers and features: app, pages/views, features, shared, stores, composables, router. FSD is not mandatory. Boundaries and feature-local state are what matter.

---

#### In detail

Example:

```
src/
  app/           # createApp, plugins
  pages|views/   # route-level
  features/      # features (auth, cart)
  entities/      # user, product
  shared/        # ui kit, utils, api client
  stores/        # pinia
  composables/
  router/
```

Rules:
- a page is thin: it assembles widgets and requests data;
- shared does not know about features;
- a store is a bounded context, not `useMainStore`.

In an interview, describe the **principle**, not a folder dogma.

---

#### React — mental anchor

Same as feature folders, FSD, and clean architecture in React: the same debates, the same goal, which is isolating change.

---

#### Autopilot phrase (1–2 sentences)

> Structure by features and layers: thin pages, Pinia split by domain, shared with no knowledge of features.

---

### Q67. How do you avoid a god component and a god store?

**Short interview answer:**  
Split by domain: a composable per feature, one Pinia store per bounded context, UI state kept local, a thin page container, and "dumb" presentational components.

---

#### In detail

Signs of a god component: 1k+ lines, and it knows the API, the form, the table, and the modals.  
Fix: extract `useOrderForm`, `OrderTable`, and `OrderFilters`.

Signs of a god store: `state: { user, cart, ui, filters, modal, theme }`.  
Fix: `useUserStore`, `useCartStore`, and keep UI state in the component.

PR rule: "does this file change for two different reasons?" If yes, split it.

---

#### React — mental anchor

Container and presentational components, extracting hooks, and RTK slices are the same set of muscles.

---

#### Autopilot phrase (1–2 sentences)

> Cut by domain: one store equals one context, UI stays local, and the page only glues the pieces together.

---

### Q68. How would you organize a form with 30 fields?

**Short interview answer:**  
Sections plus composables, or a library (VeeValidate + Zod/Yup); dirty, touched, and errors; debounced async validation; field components with `v-model`. Not one deep watch on the entire object.

---

#### In detail

Options:
1. **Manual:** `reactive` split by sections (`profile`, `address`, `payment`) plus `useSectionValidation`.
2. **Library:** VeeValidate or FormKit plus a Zod schema.
3. Fields are small controlled components with `defineModel`.
4. Submit is a single action. Use optimistic UI with care.
5. UX: persist a draft (localStorage or Pinia) if the form is long.

Antipattern: 30 separate `watch` calls with no schema.

---

#### React — mental anchor

React Hook Form + Zod is a direct analog of that experience. Mention it as the mental model.

---

#### Autopilot phrase (1–2 sentences)

> Thirty fields: a schema (Zod) plus sections and a composable, or VeeValidate; `v-model` on the fields; no deep watch over the whole monster.

---

### Q69. A race condition in search — how do you fix it?

**Short interview answer:**  
Debounce of 200–300ms, plus `AbortController` inside `watch`, plus ignoring stale responses (a sequence id). Do not write the result into the store if the query has already changed.

---

#### In detail

```ts
watch(query, async (q, _old, onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort())
  const seq = ++requestId
  const data = await search(q, ctrl.signal)
  if (seq === requestId) results.value = data
}, { /* debounce via useDebounceFn */ })
```

Or `useDebounceFn` from VueUse.  
Show loading only if the request lasts more than 150ms, so there is less flicker.

---

#### React — mental anchor

The same pattern lives in `useEffect` cleanup plus abort. React Query does part of this out of the box.

---

#### Autopilot phrase (1–2 sentences)

> Search: debounce, abort in the watch cleanup, and a sequence check, so a stale response does not overwrite the UI.

---

### Q70. Auth flow, end to end?

**Short interview answer:**  
Login, then a token (an httpOnly cookie is better than localStorage alone), then Pinia `user`, then a router `beforeEach` that checks `meta.requiresAuth`, then an interceptor on 401 that logs out and redirects. For SSR: the cookie plus server middleware.

---

#### In detail

The flow:
1. `POST /login` returns a Set-Cookie httpOnly header (preferred), or an access token plus a refresh token.
2. `useUserStore().setUser(profile)`.
3. Guard: no session means redirect to `/login?redirect=...`.
4. After login, `router.replace(redirect || '/')`.
5. An API 401 triggers a refresh or a logout.
6. XSS: an access token kept in JS memory is riskier than a cookie with SameSite.

Nuxt: `useFetch` with credentials, plus auth middleware.

---

#### React — mental anchor

Same as in React: an auth context or store, protected routes, and axios interceptors. On SSR, NextAuth or middleware.

---

#### Autopilot phrase (1–2 sentences)

> Auth: cookie or session, then Pinia user, then `beforeEach` on `meta.requiresAuth`, then a 401 interceptor, then logout.

---

### Q71. How do you debug "the UI is not updating"?

**Short interview answer:**  
Checklist: is it a `ref` or `reactive` at all? Did destructuring lose reactivity? Did you mutate a `shallowRef` in depth? Is the router reusing the component with no watch? Did `v-if` destroy the state? Does DevTools show the state change?

---

#### In detail

Step by step:
1. Vue DevTools: does the value actually change?
2. If the state changes and the UI does not, look at `v-if`, `key`, and whether it is the wrong component.
3. If the state does not change, the mutation bypassed the Proxy (`shallow` plus a nested assign).
4. `const { x } = store` without `storeToRefs`.
5. The route param changed, but the fetch runs only in `onMounted`.
6. You write to props directly (a warning in dev).

In an interview, walk through the checklist calmly. It sounds like production experience.

---

#### React — mental anchor

In React the matching questions are: "is the state a new reference?", does memo block the update, is the key wrong, and is the effect missing dependencies?

---

#### Autopilot phrase (1–2 sentences)

> The UI does not update: DevTools, then reactivity, destructuring, shallow, route reuse, and `v-if`. Walk the checklist in that order.

---

### Q72. Tell me about a Vue project (a STAR template)

**Short interview answer:**  
Prepare one story in STAR form. If you have little real Vue, say honestly that you have 7 years of React plus an intensive on Vue. Depth of the answers matters more than inflated years on a CV.

---

#### In detail

**Template:**

**S (Situation):** the product (a B2B admin or an account area), a team of N, stack Vue 3 + Vite + TS + Pinia + Router (and possibly Nuxt).  
**T (Task):** a hard feature: role permissions, a wizard form, realtime statuses, or a design system.  
**A (Action):**
- extracted a composable, `usePermission` or `useOrderDraft`;
- stores follow domain boundaries, not a god store;
- router guards, plus aborting in-flight requests;
- SSR keys and `ClientOnly` during hydration (if Nuxt).  
**R (Result):** faster delivery, fewer race bugs, and measurable UX (time to interactive, form errors).

**If Vue experience is thin, use an honest frame:**  
"My main production work is 7 years of React. I picked Vue up intensively: Composition, Pinia, Router, and reactivity in depth. I carry architectural decisions over one to one (hooks ↔ composables, Zustand ↔ Pinia). I am ready to write Vue on a team from day one."

A lie about "3 years of Vue" usually collapses on a follow-up about Nuxt or legacy code.

---

#### React — mental anchor

You already know how to tell React project stories. Retell the same story in Vue vocabulary (hooks become composables, and so on) when the case is similar.

---

#### Autopilot phrase (1–2 sentences)

> STAR: stack, then the hard part, then composable, store, and guards, then the result. If Vue is thin, be honest: depth matters more than years on a CV.

---

### Q73. Questions worth asking the interviewer

**Short interview answer:**  
Ask about the stack and the legacy. It shows maturity, and it tells you what to study next in the days you have left.

---

#### In detail

| Question | Why |
|--------|--------|
| Vue 2 or 3? A lot of Options API? | Decide whether to study Options and the compat build |
| Nuxt? SSR? | Decide whether the Nuxt block needs to go deep |
| Pinia or Vuex? | Legacy store |
| UI kit (Vuetify, Quasar, or a custom one)? | Form and table patterns |
| Tests? Vitest? | What they expect in the practical part |
| Microfrontends? | Module federation and the extra complexity |
| Design system or Storybook? | The level of UI engineering |
| How are code review and CI set up? | How the team actually works |

Two to four questions are enough. This is not an interrogation.

---

#### React — mental anchor

Same as in a React interview: Next or CRA? Redux or React Query? The goals are the same.

---

#### Autopilot phrase (1–2 sentences)

> Ask about Vue 2 or 3, Nuxt and SSR, Pinia or Vuex, the UI kit, and tests, so you aim at the team's real stack.

---

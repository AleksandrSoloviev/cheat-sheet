---
order: 8
title: "8. Vue Router"
technology: vue
---

### Q38. The basic Router 4 model?

**Short interview answer:**  
Vue Router 4: `createRouter` plus a history mode plus routes → `app.use(router)`. In components you use `useRoute`/`useRouter`; in the template, `<RouterView>` and `<RouterLink>`.

---

#### In detail

```ts
const router = createRouter({
  history: createWebHistory(), // or createWebHashHistory()
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/users/:id', name: 'user', component: UserView, props: true },
  ],
})

app.use(router)
```

- `useRoute()` — the current route (params, query, meta) — a reactive object.
- `useRouter()` — navigation: `push`, `replace`, `back`.
- `props: true` — params as component props (handy for testability).

HTML5 history needs a server fallback (every path → index.html). Hash mode is simpler for static hosting with no extra configuration.

---

#### React — a mental anchor

Almost 1:1 with React Router: `BrowserRouter`/`createBrowserRouter`, `useParams`/`useNavigate`, `<Outlet>` ≈ `<RouterView>`, `<Link>` ≈ `<RouterLink>`.

---

#### Autopilot phrase (1–2 sentences)

> Router 4 is createRouter plus history plus routes; in components, useRoute/useRouter and RouterView/Link — like React Router.

---

### Q39. Navigation guards?

**Short interview answer:**  
Guards are navigation hooks: global ones (`beforeEach`), per route (`beforeEnter`), and inside a component (`onBeforeRouteLeave`, and so on). The typical case is auth: if `meta.requiresAuth` and there is no session → redirect to login.

---

#### In detail

```ts
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

The levels:
- **global** — `beforeEach` / `beforeResolve` / `afterEach`
- **per-route** — `beforeEnter`
- **per-component** — Options: `beforeRouteEnter/Update/Leave`; Composition: `onBeforeRouteUpdate`, `onBeforeRouteLeave`

You can return `false` (cancel), a route location (redirect), or nothing / `true` / `next()` (the old Vue Router 3 style had `next` — in VR4 a return is preferred).

`meta` is a free-form object for flags: `requiresAuth`, `roles`, `title`.

---

#### React — a mental anchor

The analogues are RR loaders and actions, Next middleware, and a manual redirect in `useEffect`. The idea is the same: centralize the auth check, and do not scatter it across pages.

---

#### Autopilot phrase (1–2 sentences)

> Guards: beforeEach plus meta.requiresAuth leads to a redirect; to leave a page, use onBeforeRouteLeave.

---

### Q40. Lazy routes?

**Short interview answer:**  
A lazy route is `component: () => import('./View.vue')`. Webpack or Vite splits out a separate chunk; the page loads on demand.

---

#### In detail

```ts
{
  path: '/admin',
  component: () => import('./views/AdminView.vue'),
  meta: { requiresAuth: true },
}
```

Named chunks (a Vite/Rollup magic comment):

```ts
() => import(/* webpackChunkName: "admin" */ './AdminView.vue')
```

Combine this with a loading UI through Suspense, or a local spinner in the layout. Do not lazy-load everything: the critical first screen is better left eager.

---

#### React — a mental anchor

`React.lazy(() => import('./Admin'))` plus `Suspense`, or `lazy` in a React Router route config.

---

#### Autopilot phrase (1–2 sentences)

> A lazy route is a dynamic `import()` in `component` — code-splitting out of the box, like React.lazy.

---

### Q41. Nested routes and named views?

**Short interview answer:**  
Nested routes: `children` plus a nested `<RouterView />` in the layout component. Named views: several named `<RouterView name="sidebar" />` elements and `components: { default, sidebar }` on one route — for complex layouts.

---

#### In detail

**Nested:**

```ts
{
  path: '/settings',
  component: SettingsLayout,
  children: [
    { path: 'profile', component: Profile },
    { path: 'billing', component: Billing },
  ],
}
```

In `SettingsLayout.vue`, `<RouterView />` is where the children render.

**Named views:**

```ts
{
  path: '/board',
  components: {
    default: BoardMain,
    sidebar: BoardSidebar,
  },
}
```

```vue
<RouterView />
<RouterView name="sidebar" />
```

You need this when the layout is not "a single column," but several independent panels on one URL.

---

#### React — a mental anchor

Nested routes ≈ `<Outlet />` in React Router. Named views are less common in React; people usually compose the layout by hand in JSX.

---

#### Autopilot phrase (1–2 sentences)

> Nested routes are children plus a nested RouterView; named views are several RouterViews with a name, for the panels of a layout.

---

### Q42. Reactivity of `route.params`?

**Short interview answer:**  
Changing `/users/1` → `/users/2` often does **not** unmount the component — Vue Router reuses the instance. `onMounted` will not run again. You need `watch(() => route.params.id, ...)` or `onBeforeRouteUpdate`.

---

#### In detail

```ts
const route = useRoute()

watch(
  () => route.params.id,
  (id) => { loadUser(String(id)) },
  { immediate: true },
)
```

Or:

```ts
onBeforeRouteUpdate((to) => {
  loadUser(String(to.params.id))
})
```

The same trap as with `key`: you can force a remount with `<RouterView :key="$route.fullPath" />` — crude, but it works (you lose the internal state).

---

#### React — a mental anchor

In React Router it is the same story: one component type means the instance can be kept; data is loaded in `useEffect([id])`, not only on mount.

---

#### Autopilot phrase (1–2 sentences)

> A param change ≠ a remount: watch `route.params.id` (`immediate`), or use `onBeforeRouteUpdate`.

---

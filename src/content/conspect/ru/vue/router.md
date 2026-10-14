---
order: 8
title: "8. Vue Router"
technology: vue
---

### Q38. Базовая модель Router 4?

**Короткий ответ на собесесе:**  
Vue Router 4: `createRouter` + history mode + routes → `app.use(router)`. В компонентах — `useRoute`/`useRouter`, в template — `<RouterView>` и `<RouterLink>`.

---

#### Подробно

```ts
const router = createRouter({
  history: createWebHistory(), // или createWebHashHistory()
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/users/:id', name: 'user', component: UserView, props: true },
  ],
})

app.use(router)
```

- `useRoute()` — текущий route (params, query, meta) — реактивный объект.
- `useRouter()` — навигация: `push`, `replace`, `back`.
- `props: true` — params как props компонента (удобно для тестируемости).

History HTML5 требует fallback на сервере (все пути → index.html). Hash-mode проще для статичных хостингов без настройки.

---

#### React — для якоря в голове

Почти 1-в-1 с React Router: `BrowserRouter`/`createBrowserRouter`, `useParams`/`useNavigate`, `<Outlet>` ≈ `<RouterView>`, `<Link>` ≈ `<RouterLink>`.

---

#### Фраза «на автомате» (1–2 предложения)

> Router 4: createRouter + history + routes, в компонентах useRoute/useRouter и RouterView/Link — как React Router.

---

### Q39. Navigation guards?

**Короткий ответ на собесесе:**  
Guards — хуки навигации: глобальные (`beforeEach`), на route (`beforeEnter`), в компоненте (`onBeforeRouteLeave` и т.д.). Типичный кейс — auth: если `meta.requiresAuth` и нет сессии → redirect на login.

---

#### Подробно

```ts
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

Уровни:
- **global** — `beforeEach` / `beforeResolve` / `afterEach`
- **per-route** — `beforeEnter`
- **per-component** — Options: `beforeRouteEnter/Update/Leave`; Composition: `onBeforeRouteUpdate`, `onBeforeRouteLeave`

Можно вернуть `false` (отмена), route location (редирект), или ничего/`true`/`next()` (в старом стиле Vue Router 3 был `next` — в VR4 предпочтителен return).

`meta` — свободный объект для флагов: `requiresAuth`, `roles`, `title`.

---

#### React — для якоря в голове

Аналоги: RR loaders/actions, Next middleware, ручной redirect в `useEffect`. Идея та же — централизовать auth check, не размазывать по страницам.

---

#### Фраза «на автомате» (1–2 предложения)

> Guards: beforeEach + meta.requiresAuth → redirect; для ухода со страницы — onBeforeRouteLeave.

---

### Q40. Lazy routes?

**Короткий ответ на собесесе:**  
Ленивый роут — `component: () => import('./View.vue')`. Webpack/Vite режут отдельный chunk; страница грузится по требованию.

---

#### Подробно

```ts
{
  path: '/admin',
  component: () => import('./views/AdminView.vue'),
  meta: { requiresAuth: true },
}
```

Именованные chunk’и (Vite/Rollup magic comment):

```ts
() => import(/* webpackChunkName: "admin" */ './AdminView.vue')
```

Комбинируй с loading UI через Suspense или локальный spinner в layout. Не лени всё подряд: критичный first screen лучше eager.

---

#### React — для якоря в голове

`React.lazy(() => import('./Admin'))` + `Suspense`, или `lazy` в route config RR.

---

#### Фраза «на автомате» (1–2 предложения)

> Lazy route = dynamic `import()` в component — code-splitting из коробки, как React.lazy.

---

### Q41. Nested routes и named views?

**Короткий ответ на собесесе:**  
Nested: `children` + вложенный `<RouterView />` в layout-компоненте. Named views: несколько именованных `<RouterView name="sidebar" />` и `components: { default, sidebar }` на одном route — для сложных layout.

---

#### Подробно

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

В `SettingsLayout.vue`: `<RouterView />` — сюда рендерятся children.

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

Нужно, когда layout не «одна колонка», а несколько независимых панелей на одном URL.

---

#### React — для якоря в голове

Nested ≈ `<Outlet />` в RR. Named views — реже в React; обычно композируют layout JSX’ом вручную.

---

#### Фраза «на автомате» (1–2 предложения)

> Nested = children + вложенный RouterView; named views = несколько RouterView с name для панелей layout.

---

### Q42. Реактивность `route.params`?

**Короткий ответ на собесесе:**  
Смена `/users/1` → `/users/2` часто **не** размонтирует компонент — Vue Router переиспользует instance. `onMounted` не вызовется снова. Нужен `watch(() => route.params.id, ...)` или `onBeforeRouteUpdate`.

---

#### Подробно

```ts
const route = useRoute()

watch(
  () => route.params.id,
  (id) => { loadUser(String(id)) },
  { immediate: true },
)
```

Или:

```ts
onBeforeRouteUpdate((to) => {
  loadUser(String(to.params.id))
})
```

Та же ловушка, что с `key`: можно форсировать remount `<RouterView :key="$route.fullPath" />` — грубый, но рабочий вариант (теряешь внутренний state).

---

#### React — для якоря в голове

В React Router та же история: один component type → instance может сохраниться; данные грузят в `useEffect([id])`, не только на mount.

---

#### Фраза «на автомате» (1–2 предложения)

> Param сменился ≠ remount: watch на route.params.id (immediate) или onBeforeRouteUpdate.

---

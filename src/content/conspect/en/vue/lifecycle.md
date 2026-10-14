---
order: 5
title: "5. Lifecycle"
technology: vue
---

### Q29. The main Composition API hooks — a table, and when to use them

**Short interview answer:**  
In the Composition API, hooks are the functions `onMounted`, `onUnmounted`, and so on, called synchronously in `setup`. DOM measurements and subscriptions go in `onMounted`; cleanup goes in `onUnmounted`. KeepAlive uses `onActivated`/`onDeactivated`. There is no `this`; registration order equals call order.

---

#### In detail

| Hook | When | Typical use |
|------|--------|-------------------------|
| `onBeforeMount` | before the first mount | rarely; there is still no DOM |
| `onMounted` | the DOM is in the document | a fetch "once", addEventListener, ResizeObserver, focus, integrate a chart |
| `onBeforeUpdate` | before the DOM patch | rare measurements "before" |
| `onUpdated` | after the DOM patch | read layout after a change (careful → cycles) |
| `onBeforeUnmount` | before unmount | you can still touch the instance |
| `onUnmounted` | after unmount | **cleanup**: removeListener, clearInterval, abort a fetch |
| `onActivated` | KeepAlive is active again | resume subscriptions |
| `onDeactivated` | KeepAlive is hidden | pause, not a full destroy |
| `onErrorCaptured` | an error in a descendant | a local error boundary |
| `onRenderTracked` / `onRenderTriggered` | dev | debugging reactivity |
| `onServerPrefetch` | SSR | data before the render on the server |

```ts
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

**Order vs Options:** `setup` / `<script setup>` runs before the Options `beforeCreate`/`created`; `onMounted` ≈ `mounted`.

**Several calls:** you can have several `onMounted` calls — all of them get registered (convenient in composables).

**created?** Composition has no separate `onCreated`: all synchronous code in `setup` ≈ `created`.

**SSR:** `onMounted` is **not** called on the server — browser APIs only on the client, or via `import.meta.client` / `onMounted`.

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| code in setup | the component function body (every render!) |
| `onMounted` | `useEffect(() => {...}, [])` |
| `onUnmounted` cleanup | the return from `useEffect` |
| `onUpdated` | `useEffect` without the right deps / `useLayoutEffect` |
| `onBeforeUpdate` | closer to `useLayoutEffect` before paint |
| KeepAlive hooks | no direct analogue |

Important: the React component body runs on every render; Vue `setup` runs **once** per instance, and the hooks register callbacks. So in Vue an accidental infinite loop coming out of setup looks different from one in React.

---

#### Autopilot phrase (1–2 sentences)

> DOM and subscriptions go in `onMounted`, teardown in `onUnmounted`; KeepAlive uses activated/deactivated. Setup runs once per instance, unlike the React function body on every render.

---

### Q30. Fetch in `onMounted` vs `watch`?

**Short interview answer:**  
Data that comes from `route.params` / props needs **`watch` with `immediate: true`** (or `watchEffect`), so it reacts to an id change **without** a remount. A one-shot when the screen opens, with no reactive dependency, belongs in `onMounted`. In Nuxt, use `useAsyncData` / `useFetch` (SSR plus a cache key).

---

#### In detail

**Mount only (a static screen):**

```ts
const data = ref<Item | null>(null)

onMounted(async () => {
  data.value = await api.getItems()
})
```

The downside: if the router reuses the same component for `/users/1` → `/users/2` **without destroy**, `onMounted` will **not** run again → stale data.

**A reactive id (the correct pattern):**

```ts
const route = useRoute()
const user = ref<User | null>(null)
const error = ref<Error | null>(null)

watch(
  () => route.params.id,
  async (id, _prev, onCleanup) => {
    const ac = new AbortController()
    onCleanup(() => ac.abort()) // cancel on a new id / unmount

    try {
      user.value = await fetchUser(String(id), ac.signal)
      error.value = null
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      error.value = e as Error
    }
  },
  { immediate: true },
)
```

`immediate: true` ≈ "like mount, plus every later change."

**props:**

```ts
watch(
  () => props.userId,
  (id) => load(id),
  { immediate: true },
)
```

**watchEffect:** shorter, but harder to cancel and harder to read the old value; for a fetch, an explicit `watch` is more common.

**Nuxt:**

```ts
const route = useRoute()
const { data, error, refresh } = await useAsyncData(
  () => `user-${route.params.id}`,
  () => $fetch(`/api/users/${route.params.id}`),
  { watch: [() => route.params.id] },
)
```

**How to choose:**

| Situation | Where |
|----------|------|
| Once, and the component always gets a fresh mount | `onMounted` |
| Depends on route/props/id | `watch(..., { immediate: true })` |
| SSR / Nuxt | `useAsyncData` / `useFetch` |
| You need an abort when there is a race | `onCleanup` + AbortController |

---

#### React — a mental anchor

```ts
useEffect(() => {
  let cancelled = false
  fetchUser(id).then(...)
  return () => { cancelled = true }
}, [id])
```

One `useEffect` with `[id]` covers both the mount and the id change. In Vue that split is explicit: "mount only" versus `watch` plus `immediate` — a common interview nuance about the router reusing a component.

---

#### Autopilot phrase (1–2 sentences)

> A fetch driven by `id` or the route uses `watch` with `immediate: true` and abort in `onCleanup`; a pure one-shot with no dependency uses `onMounted`. In React both cases are one `useEffect([id])`.

---

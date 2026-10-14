---
order: 5
title: "5. Lifecycle"
technology: vue
---

### Q29. Основные хуки Composition API — таблица и когда использовать

**Короткий ответ на собесесе:**  
В Composition API хуки — функции `onMounted`, `onUnmounted` и т.д., вызываются синхронно в `setup`. DOM-измерения и подписки — в `onMounted`, cleanup — в `onUnmounted`. KeepAlive — `onActivated`/`onDeactivated`. Нет `this`; порядок регистрации = порядок вызова.

---

#### Подробно

| Hook | Когда | Типичное использование |
|------|--------|-------------------------|
| `onBeforeMount` | до первого mount | редко; ещё нет DOM |
| `onMounted` | DOM в документе | fetch «один раз», addEventListener, ResizeObserver, focus, integrate chart |
| `onBeforeUpdate` | перед DOM patch | редкие измерения «до» |
| `onUpdated` | после DOM patch | читать layout после изменения (осторожно → циклы) |
| `onBeforeUnmount` | перед размонтированием | можно ещё трогать instance |
| `onUnmounted` | после unmount | **cleanup**: removeListener, clearInterval, abort fetch |
| `onActivated` | KeepAlive снова активен | resume подписок |
| `onDeactivated` | KeepAlive спрятан | pause, не полный destroy |
| `onErrorCaptured` | ошибка в потомке | локальный error boundary |
| `onRenderTracked` / `onRenderTriggered` | dev | дебаг реактивности |
| `onServerPrefetch` | SSR | данные до рендера на сервере |

```ts
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

**Порядок vs Options:** `setup` / `<script setup>` бежит до `beforeCreate`/`created` Options; `onMounted` ≈ `mounted`.

**Несколько вызовов:** можно несколько `onMounted` — все зарегистрируются (удобно в composables).

**created?** В Composition отдельного `onCreated` нет: весь синхронный код в `setup` ≈ `created`.

**SSR:** `onMounted` на сервере **не** вызывается — браузерные API только там или через `import.meta.client` / `onMounted`.

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| код в setup | тело функции компонента (каждый render!) |
| `onMounted` | `useEffect(() => {...}, [])` |
| `onUnmounted` cleanup | return из `useEffect` |
| `onUpdated` | `useEffect` без правильных deps / `useLayoutEffect` |
| `onBeforeUpdate` | ближе `useLayoutEffect` до paint |
| KeepAlive hooks | нет прямого аналога |

Важно: React-тело компонента бежит каждый render; Vue `setup` — **один раз** на инстанс, хуки регистрируют колбэки. Поэтому во Vue «случайный бесконечный цикл из setup» выглядит иначе, чем в React.

---

#### Фраза «на автомате» (1–2 предложения)

> DOM и подписки — `onMounted`, снятие — `onUnmounted`; KeepAlive — activated/deactivated. Setup выполняется раз на инстанс, в отличие от тела React-функции на каждый render.

---

### Q30. Fetch в `onMounted` vs `watch`?

**Короткий ответ на собесесе:**  
Данные от `route.params` / props — **`watch` с `immediate: true`** (или `watchEffect`), чтобы реагировать на смену id **без** remount. Один раз при открытии экрана без реактивной зависимости — `onMounted`. В Nuxt — `useAsyncData` / `useFetch` (SSR + ключ кэша).

---

#### Подробно

**Только mount (статичный экран):**

```ts
const data = ref<Item | null>(null)

onMounted(async () => {
  data.value = await api.getItems()
})
```

Минус: если тот же компонент переиспользуется роутером для `/users/1` → `/users/2` **без destroy**, `onMounted` **не** вызовется снова → устаревшие данные.

**Реактивный id (правильный паттерн):**

```ts
const route = useRoute()
const user = ref<User | null>(null)
const error = ref<Error | null>(null)

watch(
  () => route.params.id,
  async (id, _prev, onCleanup) => {
    const ac = new AbortController()
    onCleanup(() => ac.abort()) // отмена при новом id / unmount

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

`immediate: true` ≈ «как mount + все последующие изменения».

**props:**

```ts
watch(
  () => props.userId,
  (id) => load(id),
  { immediate: true },
)
```

**watchEffect:** короче, но сложнее отменять и читать old value; для fetch чаще явный `watch`.

**Nuxt:**

```ts
const route = useRoute()
const { data, error, refresh } = await useAsyncData(
  () => `user-${route.params.id}`,
  () => $fetch(`/api/users/${route.params.id}`),
  { watch: [() => route.params.id] },
)
```

**Правило выбора:**

| Ситуация | Куда |
|----------|------|
| Один раз, компонент всегда fresh mount | `onMounted` |
| Зависит от route/props/id | `watch(..., { immediate: true })` |
| SSR / Nuxt | `useAsyncData` / `useFetch` |
| Нужен abort при гонках | `onCleanup` + AbortController |

---

#### React — для якоря в голове

```ts
useEffect(() => {
  let cancelled = false
  fetchUser(id).then(...)
  return () => { cancelled = true }
}, [id])
```

Один `useEffect` с `[id]` закрывает и mount, и смену id. Во Vue это явно раскладывается на «только mount» vs `watch`+`immediate` — частый собеседовательный нюанс про reuse компонента роутером.

---

#### Фраза «на автомате» (1–2 предложения)

> Fetch от `id`/route — `watch` с `immediate: true` и abort в `onCleanup`; чистый one-shot без зависимости — `onMounted`. В React оба случая — один `useEffect([id])`.

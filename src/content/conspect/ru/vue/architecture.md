---
order: 15
title: "15. Архитектура и поведенческие"
technology: vue
---

### Q66. Как структурируешь Vue-проект?

**Короткий ответ на собесесе:**  
Не сваливать всё в `components/`. Делить по слоям/фичам: app, pages/views, features, shared, stores, composables, router. FSD не обязателен — важны границы и feature-local state.

---

#### Подробно

Пример:

```
src/
  app/           # createApp, plugins
  pages|views/   # route-level
  features/      # фичи (auth, cart)
  entities/      # user, product
  shared/        # ui kit, utils, api client
  stores/        # pinia
  composables/
  router/
```

Правила:
- page тонкий: собрал widgets + запросил данные;
- shared не знает features;
- store = bounded context, не `useMainStore`.

На собесесе опиши **принцип**, не догму папок.

---

#### React — для якоря в голове

Как feature folders / FSD / clean architecture в React — те же споры, та же цель: изоляция изменений.

---

#### Фраза «на автомате» (1–2 предложения)

> Структура по фичам/слоям: тонкие pages, Pinia по домену, shared без знания features.

---

### Q67. Как избегаешь god-component / god-store?

**Короткий ответ на собесесе:**  
Дробить по домену: composable на фичу, Pinia store = один bounded context, UI-state локально, страница-контейнер тонкая, презентационные компоненты «тупые».

---

#### Подробно

Признаки god-component: 1k+ строк, знает API+форму+таблицу+модалки.  
Лечение: вынести `useOrderForm`, `OrderTable`, `OrderFilters`.

Признаки god-store: `state: { user, cart, ui, filters, modal, theme }`.  
Лечение: `useUserStore`, `useCartStore`, UI в компонент.

Правило PR: «этот файл меняется по двум разным причинам?» → режь.

---

#### React — для якоря в голове

Container/presentational, hooks extraction, slice’ы RTK — тот же набор мышц.

---

#### Фраза «на автомате» (1–2 предложения)

> Режь по домену: один store = один контекст, UI локально, страница только склеивает.

---

### Q68. Как организовал бы форму на 30 полей?

**Короткий ответ на собесесе:**  
Секции + composables или библиотека (VeeValidate + Zod/Yup); dirty/touched/errors; debounce async-validate; полевые компоненты с `v-model`; не один deep watch на весь объект.

---

#### Подробно

Варианты:
1. **Ручной:** `reactive` по секциям (`profile`, `address`, `payment`) + `useSectionValidation`.
2. **Библиотека:** VeeValidate / FormKit + Zod schema.
3. Поля — маленькие controlled-компоненты с `defineModel`.
4. Submit — одна action; optimistic UI осторожно.
5. UX: сохранение draft (localStorage/Pinia) если форма длинная.

Антипаттерн: 30 отдельных `watch` без схемы.

---

#### React — для якоря в голове

React Hook Form + Zod — прямой аналог опыта; упомяни его как модель мышления.

---

#### Фраза «на автомате» (1–2 предложения)

> 30 полей: схема (Zod) + секции/composable или VeeValidate; v-model на полях; без deep-watch всего монстра.

---

### Q69. Race condition в поиске — как лечишь?

**Короткий ответ на собесесе:**  
Debounce 200–300ms + `AbortController` в `watch` + игнор устаревших ответов (sequence id). В store не писать результат, если query уже другой.

---

#### Подробно

```ts
watch(query, async (q, _old, onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort())
  const seq = ++requestId
  const data = await search(q, ctrl.signal)
  if (seq === requestId) results.value = data
}, { /* debounce через useDebounceFn */ })
```

Либо `useDebounceFn` из VueUse.  
Показывать loading только если запрос длится >150ms — меньше мигания.

---

#### React — для якоря в голове

Тот же паттерн в `useEffect` cleanup + abort; React Query делает часть из коробки.

---

#### Фраза «на автомате» (1–2 предложения)

> Поиск: debounce + abort в cleanup watch + проверка sequence, чтобы stale ответ не перетёр UI.

---

### Q70. Auth flow end-to-end?

**Короткий ответ на собесесе:**  
Login → token (лучше httpOnly cookie, не только localStorage) → Pinia `user` → router `beforeEach` по `meta.requiresAuth` → interceptor на 401 → logout+redirect. SSR: cookie + server middleware.

---

#### Подробно

Поток:
1. `POST /login` → Set-Cookie httpOnly (предпочтительно) или access+refresh.
2. `useUserStore().setUser(profile)`.
3. Guard: нет сессии → `/login?redirect=...`.
4. После login → `router.replace(redirect || '/')`.
5. API 401 → refresh или logout.
6. XSS: access token в JS-памяти рискованнее cookie+SameSite.

Nuxt: `useFetch` с credentials + middleware auth.

---

#### React — для якоря в голове

Как в React: auth context/store + protected routes + axios interceptors; Next Auth/middleware на SSR.

---

#### Фраза «на автомате» (1–2 предложения)

> Auth: cookie/session → Pinia user → beforeEach meta.requiresAuth → 401 interceptor → logout.

---

### Q71. Как дебажишь «не обновляется UI»?

**Короткий ответ на собесесе:**  
Чеклист: это вообще ref/reactive? не потеряли реактивность деструктуром? shallowRef мутировали вглубь? router reuse без watch? v-if убил state? DevTools показывает изменение state?

---

#### Подробно

По шагам:
1. Vue DevTools — меняется ли значение?
2. Если state меняется, а UI нет — смотри `v-if`/`key`/не тот компонент.
3. Если state не меняется — мутация мимо Proxy (`shallow` + nested assign).
4. `const { x } = store` без `storeToRefs`.
5. Route param сменился, fetch только в `onMounted`.
6. Пишешь в props напрямую (warning в dev).

На собесесе перечисляй чеклист спокойно — это звучит как прод-опыт.

---

#### React — для якоря в голове

React: «state новый по ссылке?», memo блокирует, wrong key, effect не с deps.

---

#### Фраза «на автомате» (1–2 предложения)

> UI не обновляется: DevTools → реактивность/деструктур/shallow/route reuse/v-if — чеклист по порядку.

---

### Q72. Расскажи о проекте на Vue (заготовка STAR)

**Короткий ответ на собесесе:**  
Готовь одну историю по STAR. Если реального Vue мало — честно скажи про React 7 лет + интенсив по Vue; глубина ответов важнее надуманных лет в CV.

---

#### Подробно

**Шаблон:**

**S (Situation):** продукт (B2B admin / кабинет), команда N, стек Vue 3 + Vite + TS + Pinia + Router (± Nuxt).  
**T (Task):** сложная фича — права ролей / мастер-форма / realtime статусы / дизайн-система.  
**A (Action):**
- вынес composable `usePermission` / `useOrderDraft`;
- store границ домена, не god-store;
- router guards + abort запросов;
- SSR-ключи / ClientOnly при гидрации (если Nuxt).  
**R (Result):** быстрее поставка / меньше багов гонок / измеримый UX (время до интерактива, ошибки форм).

**Если Vue мало — честная рамка:**  
«Основной прод — React 7 лет. Vue поднял интенсивно: Composition, Pinia, Router, реактивность in depth. Архитектурные решения переношу 1-в-1 (hooks↔composables, Zustand↔Pinia). Готов писать на Vue в команде с day one.»

Ложь про «3 года Vue» на follow-up про Nuxt/legacy обычно лопается.

---

#### React — для якоря в голове

Ты умеешь рассказывать React-проекты — переведи ту же историю на Vue-словарь (hooks→composables и т.д.), если кейс похож.

---

#### Фраза «на автомате» (1–2 предложения)

> STAR: стек → сложность → composable/store/guards → результат; если Vue мало — честно + глубина важнее лет в CV.

---

### Q73. Вопросы, которые стоит задать интервьюеру

**Короткий ответ на собесесе:**  
Задай вопросы про стек и легаси — это показывает зрелость и помогает понять, чему учить дальше в оставшиеся дни.

---

#### Подробно

| Вопрос | Зачем |
|--------|--------|
| Vue 2 или 3? Много Options? | Понять, учить ли Options/compat |
| Nuxt? SSR? | Нужен ли блок Nuxt глубоко |
| Pinia или Vuex? | Легаси store |
| UI-kit (Vuetify/Quasar/свой)? | Паттерны форм/таблиц |
| Тесты? Vitest? | Что ждут на практике |
| Микрофронты? | Module federation / сложность |
| Дизайн-система / Storybook? | Уровень UI engineering |
| Как устроен code review / CI? | Процесс команды |

2–4 вопроса достаточно; не допрос.

---

#### React — для якоря в голове

Как на React-собесе: Next или CRA? Redux или RQ? — те же цели.

---

#### Фраза «на автомате» (1–2 предложения)

> Спроси Vue2/3, Nuxt/SSR, Pinia/Vuex, UI-kit, тесты — чтобы целиться в реальный стек команды.

---

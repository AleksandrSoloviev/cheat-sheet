---
order: 7
title: "7. Pinia / состояние"
technology: vue
---

### Q34. Что такое Pinia? Чем лучше Vuex?

**Короткий ответ на собесесе:**  
Pinia — **официальный** store для Vue 3. Проще Vuex: нет mutations, отличный TypeScript, setup-stores как composables, модульность без вложенных modules-ада. Vuex знать полезно для легаси, писать новое — Pinia.

---

#### Подробно

**Плюсы Pinia относительно Vuex:**
- actions сразу меняют state (без ceremony mutations);
- TS выводится почти без боли;
- `defineStore` + setup-синтаксис = тот же DX, что Composition API;
- каждый store — отдельный модуль по id, без обязательного nested tree;
- DevTools, SSR-поддержка, плагины (persist и т.д.).

Vuex 4 ещё жив на старых проектах. На собесесе: «миграционный путь — store за store, не big-bang».

Options-style Pinia тоже есть (`state/getters/actions`), но setup-stores предпочтительнее в новом коде.

---

#### React — для якоря в голове

Ближе всего к **Zustand** (простой API) + роль **Redux Toolkit** (официальный/стандарт команды).  
Mutations Vuex ≈ избыточный слой вроде классического Redux до RTK.

---

#### Фраза «на автомате» (1–2 предложения)

> Pinia — официальный Vue 3 store без mutations, с отличным TS и setup-stores; Vuex — легаси.

---

### Q35. Setup store — пример

**Короткий ответ на собесесе:**  
Setup store выглядит как composable внутри `defineStore`: `ref`/`computed` + функции-actions, `return` публичного API. В компоненте state достают через `storeToRefs`, actions — напрямую.

---

#### Подробно

```ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<Item[]>([])
  const total = computed(() =>
    items.value.reduce((s, i) => s + i.price, 0)
  )

  function add(item: Item) {
    items.value.push(item)
  }

  function clear() {
    items.value = []
  }

  return { items, total, add, clear }
})
```

В компоненте:

```ts
const cart = useCartStore()
const { items, total } = storeToRefs(cart)
const { add, clear } = cart

add({ id: '1', price: 10 })
```

Id `'cart'` уникален в приложении. Один вызов `useCartStore()` в разных местах = один и тот же store.

---

#### React — для якоря в голове

Похоже на Zustand:

```ts
const useCart = create((set, get) => ({
  items: [],
  add: (item) => set({ items: [...get().items, item] }),
}))
```

Разница: Pinia мутации массива (`push`) нормальны из-за реактивности Vue.

---

#### Фраза «на автомате» (1–2 предложения)

> Setup Pinia = composable в `defineStore`: вернуть refs/computed/actions; в UI — `storeToRefs` для state.

---

### Q36. Почему нельзя просто деструктурить store?

**Короткий ответ на собесесе:**  
`const { count } = store` отрывает поле от реактивного store → дальше это обычное число/значение, UI не обновится. Для state/getters нужен `storeToRefs(store)`. Actions деструктурить можно — это функции.

---

#### Подробно

```ts
const store = useCounterStore()

// плохо — потеря реактивности
const { count } = store
count // больше не связан со store

// хорошо
const { count } = storeToRefs(store)
count.value // реактивный ref

// actions — ок
const { increment } = store
increment()
```

`storeToRefs` пропускает методы и оставляет только state/getters как refs.

Альтернатива без деструктуризации: `store.count` в script/template — тоже реактивно.

---

#### React — для якоря в голове

В Zustand `const count = useStore(s => s.count)` — подписка через селектор.  
В Redux — `useSelector`.  
Во Vue «просто деструктур объекта store» ≠ селектор, отсюда ловушка.

---

#### Фраза «на автомате» (1–2 предложения)

> State/getters из Pinia — только через `storeToRefs` или `store.field`; actions можно деструктурить спокойно.

---

### Q37. Где не нужен Pinia?

**Короткий ответ на собесесе:**  
Не нужен для локального UI-state: открыта ли модалка, текст инпута до submit, hover, ephemeral wizard на одном экране. Иначе получишь god-store и лишние связи между фичами.

---

#### Подробно

**В Pinia:** сессия пользователя, корзина, кэш справочников, права, настройки, шарящиеся между роутами данные.  
**Не в Pinia:** `isDropdownOpen`, draft формы одной страницы, временный step UI.

Серая зона: «форма на двух шагах роутера» — можно Pinia feature-store или query/params + composable. Выбирай по lifetime данных.

Правило: *если компонент размонтировался и данные никто больше не должен помнить — скорее local/composable.*

---

#### React — для якоря в голове

То же, что «не всё в Redux»: server state → React Query; local UI → useState; global domain → store.

---

#### Фраза «на автомате» (1–2 предложения)

> Pinia для домена и кросс-страниц; локальный UI и черновики — `ref` в компоненте/composable.

---

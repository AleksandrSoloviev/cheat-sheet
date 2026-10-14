---
order: 7
title: "7. Pinia / state"
technology: vue
---

### Q34. What is Pinia? How is it better than Vuex?

**Short interview answer:**  
Pinia is the **official** store for Vue 3. It is simpler than Vuex: no mutations, excellent TypeScript, setup stores like composables, and modularity without the nested-modules hell. Knowing Vuex is useful for legacy; new code should be written in Pinia.

---

#### In detail

**Pinia's advantages over Vuex:**
- actions change state directly (without the ceremony of mutations);
- TypeScript is inferred with almost no pain;
- `defineStore` + setup syntax = the same DX as the Composition API;
- each store is a separate module by id, with no mandatory nested tree;
- DevTools, SSR support, plugins (persist, and so on).

Vuex 4 is still alive on older projects. In an interview: "the migration path is store by store, not a big bang."

Options-style Pinia exists too (`state/getters/actions`), but setup stores are preferable in new code.

---

#### React — a mental anchor

Closest to **Zustand** (a simple API) plus the role of **Redux Toolkit** (the team's official standard).  
Vuex mutations ≈ an extra layer, like classic Redux before RTK.

---

#### Autopilot phrase (1–2 sentences)

> Pinia is the official Vue 3 store without mutations, with excellent TS and setup stores; Vuex is legacy.

---

### Q35. A setup store — an example

**Short interview answer:**  
A setup store looks like a composable inside `defineStore`: `ref`/`computed` plus action functions, and a `return` of the public API. In a component, state is taken through `storeToRefs`; actions are used directly.

---

#### In detail

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

In the component:

```ts
const cart = useCartStore()
const { items, total } = storeToRefs(cart)
const { add, clear } = cart

add({ id: '1', price: 10 })
```

The id `'cart'` is unique in the application. One call to `useCartStore()` in different places = the same store.

---

#### React — a mental anchor

Similar to Zustand:

```ts
const useCart = create((set, get) => ({
  items: [],
  add: (item) => set({ items: [...get().items, item] }),
}))
```

The difference: Pinia array mutations (`push`) are normal because of Vue reactivity.

---

#### Autopilot phrase (1–2 sentences)

> A Pinia setup store = a composable inside `defineStore`: return refs/computed/actions; in the UI, use `storeToRefs` for state.

---

### Q36. Why can't you just destructure a store?

**Short interview answer:**  
`const { count } = store` pulls the field off the reactive store → after that it is a plain number/value, and the UI will not update. State and getters need `storeToRefs(store)`. Actions can be destructured — they are functions.

---

#### In detail

```ts
const store = useCounterStore()

// bad — reactivity is lost
const { count } = store
count // no longer tied to the store

// good
const { count } = storeToRefs(store)
count.value // a reactive ref

// actions — ok
const { increment } = store
increment()
```

`storeToRefs` skips methods and keeps only state/getters as refs.

An alternative without destructuring: `store.count` in script/template is reactive too.

---

#### React — a mental anchor

In Zustand, `const count = useStore(s => s.count)` is a subscription through a selector.  
In Redux — `useSelector`.  
In Vue, "just destructuring the store object" ≠ a selector, and that is where the trap comes from.

---

#### Autopilot phrase (1–2 sentences)

> Pinia state/getters only through `storeToRefs` or `store.field`; actions can be destructured freely.

---

### Q37. Where is Pinia not needed?

**Short interview answer:**  
It is not needed for local UI state: whether a modal is open, input text before submit, hover, an ephemeral wizard on a single screen. Otherwise you get a god-store and extra coupling between features.

---

#### In detail

**In Pinia:** the user session, the cart, a cache of reference data, permissions, settings, data shared across routes.  
**Not in Pinia:** `isDropdownOpen`, a single-page form draft, a temporary UI step.

Gray area: "a form across two router steps" — a Pinia feature store, or query/params plus a composable, can both work. Choose by the lifetime of the data.

Rule: *if the component unmounted and nobody else is supposed to remember the data — it is more likely local/composable.*

---

#### React — a mental anchor

The same idea as "not everything belongs in Redux": server state → React Query; local UI → useState; global domain → the store.

---

#### Autopilot phrase (1–2 sentences)

> Pinia is for the domain and for cross-page data; local UI and drafts are a `ref` in the component or composable.

---

---
order: 13
title: "13. Vue 2 → 3 / legacy"
technology: vue
---

### Q58. What are the main breaking changes from Vue 2 to Vue 3?

**Short interview answer:**  
The main ones: reactivity on Proxy, `createApp` instead of `new Vue`, filters removed, `$listeners` merged into `$attrs`, fragments allowed, no IE11, the ecosystem moves from Vuex to Pinia, and the event bus goes away.

---

#### In detail

A list for the interview:
1. **Reactivity** — Proxy; you no longer need `Vue.set` for new fields (in most cases).
2. **createApp(App).mount('#app')** — isolated application instances.
3. **Filters** are removed → `computed`, methods, or functions.
4. **$listeners** are merged with **$attrs**.
5. **Multiple root nodes** (fragments) are fine.
6. **v-model** API: `value` + `input` → `modelValue` + `update:modelValue`.
7. Global APIs became app-level (`app.component`, `app.use`).
8. **Vuex → Pinia**, and the event bus → mitt, Pinia, or emits.
9. No IE11 support.

The migration build `@vue/compat` helps you move over gradually.

---

#### React — a mental anchor

Like a major migration from React 17 to 18, or from classes to hooks: breaking APIs plus a new mindset, and legacy stays nearby for a long time.

---

#### Autopilot phrase (1–2 sentences)

> Vue 2→3: Proxy, createApp, no filters, a new v-model, $attrs instead of $listeners, Pinia instead of Vuex.

---

### Q59. Mixins — why are they bad, and what replaces them?

**Short interview answer:**  
Mixins implicitly merge fields, which means name conflicts, an unclear origin of the data, and types that are hard to write. The replacement is **composables** (an explicit import and explicit names).

---

#### In detail

Problems with mixins:
- two mixins with `data().loading` — which one won?
- it is unclear where a method on the component came from;
- hard for tree-shaking and for TS.

```ts
// before
mixins: [searchMixin, pagingMixin]

// after
const { query, search } = useSearch()
const { page, next } = usePaging()
```

In the Options API, composables are still called inside `setup()`.

---

#### React — a mental anchor

Class mixins / HOCs → hooks. The same story of how the ecosystem evolved.

---

#### Autopilot phrase (1–2 sentences)

> Mixins are bad because of the implicit merge; the replacement is composables with explicit names, like hooks instead of HOCs.

---

### Q60. Can you read the Options API?

**Short interview answer:**  
Yes — you have to on Vue 3+. The mapping: `data` → `ref`/`reactive`, `computed` → `computed`, `methods` → functions, `watch` → `watch`, `mounted` → `onMounted`. Legacy code, and half of the articles, are still written with Options.

---

#### In detail

```js
export default {
  props: { id: String },
  data() { return { item: null } },
  computed: {
    title() { return this.item?.name ?? '' },
  },
  watch: {
    id: { immediate: true, handler(id) { this.load(id) } },
  },
  methods: {
    async load(id) { this.item = await api(id) },
  },
  mounted() { /* ... */ },
}
```

The Composition equivalent is what you are already learning. In an interview they may hand you a chunk of Options and ask you to explain it or rewrite it.

---

#### React — a mental anchor

Like reading class components while you already live on hooks: you need to understand both dialects.

---

#### Autopilot phrase (1–2 sentences)

> You must be able to read Options: data/computed/methods/watch/mounted map to the Composition API equivalents.

---

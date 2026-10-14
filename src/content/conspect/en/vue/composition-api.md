---
order: 2
title: "2. Composition API / script setup"
technology: vue
---

### Q13. Options API vs Composition API: what do you choose, and why?

**Short interview answer:**  
The Composition API (plus `<script setup>`) is the Vue 3 standard for new logic: better reuse through composables, better TypeScript, and code grouped **by feature** rather than by option type. The Options API still lives in legacy code and in simple components. You must be able to **read** it. New code is more often Composition.

---

#### In detail

**Options API** is classic Vue 2: `data`, `methods`, `computed`, `watch`, `mounted`, and so on. The logic of one feature (for example, "search + debounce + fetch") is spread across different sections.

```vue
<script>
export default {
  data() {
    return { query: '', results: [] }
  },
  computed: {
    hasResults() { return this.results.length > 0 }
  },
  watch: {
    query(q) { this.fetch(q) }
  },
  methods: {
    async fetch(q) { /* ... */ }
  },
  mounted() {
    this.fetch(this.query)
  }
}
</script>
```

**Composition API** is the `setup()` function, or `<script setup>`: you declare `ref` and `reactive`, `computed`, `watch`, and lifecycle hooks next to each other. One feature can be extracted into `useSearch()`.

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSearch } from '@/composables/useSearch'

const { query, results, hasResults } = useSearch()
</script>
```

| | Options | Composition |
|---|--------|-------------|
| Organization | by option type | by feature / composable |
| Reuse | mixins (fragile: name collisions) | composables (an explicit API) |
| TypeScript | weaker and noisier | better (especially `script setup`) |
| `this` | `this.` everywhere | no `this` in setup |
| When it is fine | simple forms, legacy | almost everything new in Vue 3 |

**Mixins vs composables:** a mixin silently merges fields into the component, which leads to name conflicts and an unclear source of data. A composable returns an explicit object, like a custom hook.

**Interview rule:** new code uses Composition. Read and maintain Options. "Both are valid" is true, but the Vue 3 ecosystem (Pinia, VueUse, Nuxt) is built for Composition.

---

#### React — mental anchor

| | Vue | React |
|---|-----|--------|
| Old style | Options API (`data` / `methods`) | Class components |
| New style | Composition API / `<script setup>` | Function components + hooks |
| Reuse | composables `useXxx()` | custom hooks `useXxx()` |
| Antipattern | mixins | HOCs / complicated mixin analogs |

Moving from Options to Composition is like moving from classes to hooks: the same motivation, which is logic grouped by feature and reuse without inheritance.

---

#### Autopilot phrase (1–2 sentences)

> The Composition API is the Vue 3 standard: logic by feature, and composables instead of mixins. You should be able to read the Options API for legacy code. It is the same kind of shift as class components to hooks in React.

---

### Q14. What does `<script setup>` give you?

**Short interview answer:**  
It is sugar over `setup()`. Everything at the top level is automatically available in the template. You get the macros `defineProps`, `defineEmits`, `defineExpose`, `defineModel`, and `defineOptions`. There is no `return {}`, less boilerplate, and better tree-shaking. It compiles to an ordinary `setup()`.

---

#### In detail

Without `<script setup>`:

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    const inc = () => count.value++
    return { count, inc } // required
  }
}
</script>
```

With `<script setup>`:

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
const inc = () => count.value++
// no return needed: everything at the top level is visible in the template
</script>

<template>
  <button @click="inc">{{ count }}</button>
</template>
```

**Compiler macros** (not runtime imports; `vue/macros`, or available globally in the IDE):

| Macro | Why |
|--------|--------|
| `defineProps` | declare props |
| `defineEmits` | declare events |
| `defineModel` | a v-model prop plus emit (Vue 3.4+) |
| `defineExpose` | a public API for a parent ref |
| `defineOptions` | `name`, `inheritAttrs`, and the rest, without a second `<script>` |
| `defineSlots` | type the slots (TypeScript) |

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false, name: 'UserCard' })

const props = defineProps<{ id: number }>()
const emit = defineEmits<{ close: [] }>()
</script>
```

**Two `<script>` blocks:** sometimes you still need a plain `<script>` next to `<script setup>` (for example, a named export, or other rare cases). `defineOptions` often covers the need for `name` and `inheritAttrs`.

**Imports:** components imported in `<script setup>` are registered in the template automatically. You do not write `components: { Foo }`.

**Tree-shaking:** unused bindings are easier to drop. The Options API pulls in the whole options object.

---

#### React — mental anchor

`<script setup>` is like a function component: everything in the closure is immediately available in JSX or in the template. The macros are compiler magic, closer to Svelte. React has nothing like that: props are a function argument, and the ref API is `useImperativeHandle`, written by hand.

---

#### Autopilot phrase (1–2 sentences)

> `<script setup>` is sugar: top-level bindings go straight into the template, with no `return`, plus the macros `defineProps`, `defineEmits`, `defineExpose`, and `defineModel`. It feels like an ordinary function component in React.

---

### Q15. What is `defineExpose`?

**Short interview answer:**  
By default, nothing from `<script setup>` is exposed through a template ref. `defineExpose({ focus, validate })` is an explicit public API for the parent: `childRef.value.validate()`. You need it rarely: focus, form validation, an imperative API.

---

#### In detail

```vue
<!-- Child.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const input = ref<HTMLInputElement | null>(null)
const value = ref('')

const focus = () => input.value?.focus()
const validate = () => value.value.trim().length > 0

defineExpose({ focus, validate })
// value and input are not available from the outside until you expose them
</script>

<template>
  <input ref="input" v-model="value" />
</template>
```

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import Child from './Child.vue'

const childRef = ref<InstanceType<typeof Child> | null>(null)

const handleSubmit = () => {
  if (!childRef.value?.validate()) return
  // ...
}
</script>

<template>
  <Child ref="childRef" />
  <button @click="childRef?.focus()">Focus</button>
</template>
```

**Why the default is "closed":** encapsulation. The parent does not latch onto the internal implementation. Expose only what is actually part of the contract.

**Without `<script setup>`:** in the Options API, or in `setup()`, what you `return` is already exposed on the instance. `expose()` called from setup narrows that same surface.

**Antipattern:** pushing half the state outside "just in case." That breaks the component boundary. Prefer props, emits, and `v-model`. Use expose for imperative actions.

---

#### React — mental anchor

The direct analog is `forwardRef` plus `useImperativeHandle(ref, () => ({ focus, validate }))`. In React, a ref on a function component is empty by default until you forward a handle.

---

#### Autopilot phrase (1–2 sentences)

> In `<script setup>` the instance is closed. `defineExpose` opens an explicit API to the parent through a ref, like `useImperativeHandle` in React. I use it for focus and validate, not for ordinary data flow.

---

### Q16. Can setup be async? And what about Suspense?

**Short interview answer:**  
Yes. A top-level `await` in `<script setup>` makes the component async, so the parent (or something above it) must wrap it in `<Suspense>` with a `#fallback`. Without Suspense you get an error or a warning. In Nuxt this is often hidden behind `useAsyncData` or `useFetch`.

---

#### In detail

```vue
<!-- AsyncUser.vue -->
<script setup lang="ts">
import { fetchUser } from '@/api'

// top-level await means the component is async
const user = await fetchUser()
</script>

<template>
  <h1>{{ user.name }}</h1>
</template>
```

```vue
<!-- Parent -->
<script setup>
import { defineAsyncComponent } from 'vue'
const AsyncUser = defineAsyncComponent(() => import('./AsyncUser.vue'))
</script>

<template>
  <Suspense>
    <AsyncUser />
    <template #fallback>
      <p>Loading…</p>
    </template>
  </Suspense>
</template>
```

**What happens:** Vue waits for the setup promise, shows the fallback, then mounts the tree with the data. Errors go through `onErrorCaptured`, an error-boundary pattern, or the `#default` slot plus your own handling.

**Alternatives without async setup:**

```ts
const user = ref<User | null>(null)
const error = ref<Error | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    user.value = await fetchUser()
  } catch (e) {
    error.value = e as Error
  } finally {
    loading.value = false
  }
})
```

This way you render loading and error yourself, with no Suspense. In an SPA that is often simpler and more predictable.

**Nuxt:** `const { data } = await useAsyncData('user', () => $fetch('/api/user'))` gives you SSR plus hydration. It is not a bare async setup.

**`defineAsyncComponent`** lazily loads the component **code** (a chunk). Async setup waits for **data** inside setup. You can combine the two.

---

#### React — mental anchor

The idea matches React Suspense: a component can pause rendering until a promise is ready. In React, data Suspense more often goes through libraries, RSC, or loaders. In Vue 3 the built-in path for async setup and async components is easier to see in the docs, because it ships with the framework.

---

#### Autopilot phrase (1–2 sentences)

> A top-level `await` in setup makes the component async, so you need `<Suspense>` with a fallback. It is often simpler to use `onMounted` plus local loading, or Nuxt `useAsyncData`, than to thread Suspense through the whole tree.

---

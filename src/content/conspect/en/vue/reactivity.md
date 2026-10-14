---
order: 1
title: "1. Reactivity"
technology: vue
---

### Q1. What is reactivity in Vue 3?

**Short interview answer:**  
Reactivity is Vue's mechanism that **itself** tracks who read a field and whom to notify when that field changes. You do not manually say "redraw", and you do not list dependencies the way you do in `useEffect`.

---

#### What a "reactive system" means in plain language

A plain JavaScript object is deaf:

```js
let count = 0
count = 1 // nobody finds out, and the UI does not update by itself
```

**Vue's reactive system** is a layer around the data (`ref` / `reactive`) that:

1. **On read** (`count.value` / `state.name`) remembers: *this computed, watch, or render currently depends on this field*. That is **track** (a subscription).
2. **On write** (`count.value++`) finds every subscriber of that field and runs them. That is **trigger** (a notification).

Technically, in Vue 3 the data is wrapped in a **`Proxy`**: get and set are intercepted.  
`ref` and `reactive` are your entry into that system. Without them, Vue does not see the changes.

```
reading a field  →  track(who read it)
writing a field  →  trigger(notify subscribers)
                    ↓
         computed / watch / DOM update
```

**A mini example:**

```ts
const count = ref(0)

// the render / template reads count → Vue registers the dependency
// {{ count }} in the template

count.value++ // trigger → Vue knows this piece of UI depends on count → update only that piece
```

The result: you change the data, and whatever depended on it is **automatically** recomputed. Not the whole world. Only the subscribers of that specific field.

---

#### React — a mental anchor

| | Vue | React |
|---|-----|--------|
| Who knows the dependencies? | The framework (track on read) | You (`useEffect(..., [deps])`, memo) |
| What happens on `setState` / a change? | Trigger → only that field's subscribers | Re-render the **component function** (and down the tree, unless there is memo) |
| Mutating `obj.x = 1` | With `reactive`, that is fine. Vue sees it | Usually it does **not** see it. You need a new object / `setState` |
| A "reactive system" | Built in (Proxy + scheduler) | No equivalent. There is reconciliation after render |

React's formula: **UI = f(state)**. You called `setState`, so the component runs again.  
Vue's formula: **the data itself calls its subscribers**, so only the dependent computed values, watchers, and DOM pieces update.

---

#### Autopilot phrase (1–2 sentences)

> Vue's reactive system is a Proxy around state: reading a field registers a dependency, and writing notifies subscribers (render, computed, watch). That is why the UI updates by itself, without a manual dependency list the way React needs one.

---

### Q2. `ref` vs `reactive` — when do you use which?

**Short interview answer:**  
`ref` is a universal wrapper for any value, primitive or object, accessed through `.value`. `reactive` is a Proxy around an **object**. You cannot put a primitive in it. In practice: counters, flags, and "replace the whole value" go in a `ref`. A local form of related fields goes in `reactive`. From a composable you more often return a `ref` or `toRefs`.

---

#### In detail

Both APIs connect data to the same reactive system (Proxy plus track/trigger). The difference is the **shape of storage** and how you **reassign** the value.

**`ref(T)`**

```ts
const count = ref(0)           // a primitive
const user = ref<User | null>(null) // the whole object

count.value++                  // a mutation through .value
user.value = await fetchUser() // replacing the whole value is fine, Vue sees it
```

- It works with primitives and with objects.
- The `ref` itself is a stable reference to the wrapper `{ value }`. What changes is the contents of `.value`.
- If you put an object inside a `ref`, Vue usually makes it deeply reactive, unless you used `shallowRef`.

**`reactive(object)`**

```ts
const form = reactive({
  name: '',
  email: '',
  remember: false,
})

form.name = 'Ann' // fine — the Proxy catches the set
```

- Only objects, arrays, and collections (`Map`, `Set`).
- You cannot do `form = { ... }` and keep that variable reactive. You replaced the local reference with a plain object. Mutate the fields, or use `Object.assign(form, next)`.

**Destructuring is the main `reactive` trap:**

```ts
const state = reactive({ count: 0 })

const { count } = state // count = 0 (a number). The link to the Proxy is gone
count++                 // the UI will not update

// correct:
const { count } = toRefs(state) // count is a Ref<number>
count.value++
```

With `ref`, you rarely need to destructure the wrapper. If you destructure `.value` of an object, you get the same lost-link story.

**Returning from a composable:**

```ts
// A predictable public API: refs
export const useCounter = (initial = 0) => {
  const count = ref(initial)
  const inc = () => { count.value++ }
  return { count, inc } // count stays reactive for the consumer
}

// If reactive is convenient inside, convert with toRefs on the way out
export const useForm = () => {
  const form = reactive({ name: '', email: '' })
  const reset = () => { form.name = ''; form.email = '' }
  return { ...toRefs(form), reset }
}
```

```
                    ┌─────────────┐
  primitive /       │     ref     │  .value = ...  → trigger
  "replace wholly"  └─────────────┘
                    ┌─────────────┐
  a related object  │  reactive   │  obj.field = … → trigger
  (a form, local    └─────────────┘
   state)
         │ return outward
         ▼
      toRefs / separate refs
```

**The interview rule:** a composable's public API is more often `ref`. A local form is often `reactive` plus `toRefs` on return. Do not mix them without a reason. One style is easier for the team to read.

---

#### React — a mental anchor

| | Vue | React |
|---|-----|--------|
| A primitive | `ref(0)` | `useState(0)` |
| An object | `ref(obj)` or `reactive(obj)` | `useState(obj)` plus a usually **immutable** update |
| Replace the whole value | `x.value = next` | `setX(next)` |
| Mutate a field | with `reactive`, that is fine | usually `setX(prev => ({ ...prev, field }))` |
| Destructure state | with `reactive`, it breaks reactivity | `const { n } = state` in render is fine (the next render brings a new value) |
| A custom hook's return | return `ref` / `toRefs` | return values plus setters |

In React, one `useState` covers both a primitive and an object. There is no "depth" of reactivity. There is only a new state reference, which causes a re-render. In Vue you choose the **shape** (`ref` vs `reactive`) and you have to remember the Proxy.

---

#### Autopilot phrase (1–2 sentences)

> `ref` is a wrapper with `.value` for anything, including replacing the whole value. `reactive` is an object Proxy, convenient for forms, but destructuring breaks reactivity, so from a composable you more often return `ref` or `toRefs`.

---

### Q3. Why does `ref` have `.value`?

**Short interview answer:**  
`ref` is a wrapper object `{ value: T }`, not the value itself. In script, without `.value` you are holding a reference to the wrapper, not the data. In the template, Vue automatically unwraps top-level refs, so you do not write `.value` there.

---

#### In detail

JavaScript cannot make a reactive primitive by itself. A number or a string is passed by value, and you cannot intercept `count = 1` on a local variable. So Vue puts the primitive **inside an object**:

```ts
// simplified
const count = ref(0)
// ≈ { value: 0 }, where get/set of value do track/trigger
```

**In `<script>`, always `.value`:**

```ts
const count = ref(0)

console.log(count)        // RefImpl, not a number
console.log(count.value)  // 0

count.value++             // correct → trigger
// count++                // pointless / a type error
```

**In the template, top-level refs unwrap:**

```vue
<script setup>
const count = ref(0)
const state = reactive({ n: 1 })
</script>

<template>
  <!-- unwrap: this is count.value -->
  <p>{{ count }}</p>
  <button @click="count++">+</button>

  <!-- reactive is already without .value -->
  <p>{{ state.n }}</p>
</template>
```

Unwrap works for refs that sit **at the top level** of setup, and in some other contexts. A nested ref inside a plain object, or inside `reactive`, can behave differently in the template. You often need an explicit `.value` in script, or you normalize the structure.

**A `ref` inside `reactive`:**

```ts
const count = ref(0)
const state = reactive({ count })

// Vue automatically unwraps a ref nested in reactive:
state.count++           // this is already a numeric field with auto-unwrap
// state.count.value++  // usually unnecessary, and wrong after unwrap
```

The idea: `.value` is the price of **one stable reference to the wrapper**. That reference can live in closures, composables, and Pinia, while only the inside changes. Without the wrapper, primitives could not be tracked.

```
script:   count.value  ──read/write──►  track / trigger
template: {{ count }}  ──compiler──►    count.value (unwrap)
```

---

#### React — a mental anchor

| | Vue `ref` | React `useState` |
|---|-----------|------------------|
| Storage | `{ value: T }` | the value `T` in the fiber, plus a setter |
| Reading in logic | `count.value` | `count` |
| Writing | `count.value = 1` | `setCount(1)` |
| In the UI | template unwrap / JSX `count` after destructure | `{count}` |
| Reference stability | the `count` wrapper is stable | `setCount` is stable; `count` changes every render |

In React you have a bare value plus a required setter. In Vue you have one `ref` entity, and `.value` is the explicit get/set that the system can intercept.

---

#### Autopilot phrase (1–2 sentences)

> `.value` exists because `ref` is a wrapper object. That is how Vue can track primitives. In script we write `.value`. In the template, top-level refs unwrap themselves.

---

### Q4. What is loss of reactivity? How do you fix it?

**Short interview answer:**  
Loss of reactivity is when you pull a field out of `reactive`, props, or a Pinia store with ordinary destructuring and get a raw value with no Proxy and no link. You fix it with `toRefs`, `toRef`, or `storeToRefs`. For props, know the classic approach and the Vue 3.5+ caveat about reactive props destructure.

---

#### In detail

Reactivity lives in **access through a Proxy or a ref**, not in a magic number. As soon as you copy a primitive into an ordinary variable, Vue no longer sees reads and writes of that variable.

```ts
const state = reactive({ count: 0, name: 'Ann' })

// ❌ a snapshot of the primitive
const { count } = state
count++ // state.count will not change, and the UI will not update

// ✅ each field is a separate ref linked to state
const { count, name } = toRefs(state)
count.value++

// ✅ one field
const name = toRef(state, 'name')
name.value = 'Bob'
```

**Pinia:**

```ts
const store = useCounterStore()

// ❌ state and getters lose reactivity
const { count } = store

// ✅
const { count } = storeToRefs(store)
// actions can be destructured directly — they are functions, not state
const { increment } = store
```

`storeToRefs` deliberately does **not** put actions in the result. Only state and getters.

**Props: the classic case, and Vue 3.5:**

```ts
// Classic (always a safe interview answer):
const props = defineProps<{ id: string }>()
watch(() => props.id, load)
// or
const id = toRef(props, 'id')
watch(id, load)

// Vue 3.5+ reactive props destructure:
// the compiler can turn the destructure into reactive local bindings
const { id } = defineProps<{ id: string }>()
// id stays linked to props — BUT this depends on the version and the flags.
// In an interview: "I know the 3.5 feature. In production I check the version. The classic answer is toRef or a getter."
```

**Typical places you lose it:**

1. Destructuring `reactive` or a store.
2. `const id = props.id`, then `watch(id)` with no getter (see Q10).
3. Returning bare fields from a composable instead of refs.
4. Passing the value into a third-party library that clones the object.

```
reactive/store ──destructure──► primitive / raw object ──► Vue goes blind
       │
       ├── toRefs / toRef / storeToRefs
       └── getter () => props.x
```

---

#### React — a mental anchor

| Situation | Vue | React |
|----------|-----|--------|
| `const { id } = props` | Before 3.5, or without the compiler magic, this is a risk. The classic fix is `toRef` | Normal: the next render brings a new `id` |
| `const { count } = store` | Breaks reactivity of Pinia state | Depends on the store. In Zustand the selector is often `useStore(s => s.count)` |
| The update model | A subscription to a field | A re-render of the component function |

In React, destructuring props is safe because "reactivity" means calling the function again. In Vue, reactivity is a subscription to a specific access. Pulling the value off the Proxy or the ref breaks that subscription.

---

#### Autopilot phrase (1–2 sentences)

> Loss of reactivity is destructuring `reactive`, a store, or props into a bare value. The cure is `toRefs`, `toRef`, or `storeToRefs`. For props, the reliable pattern is a getter or `toRef`. Vue 3.5 destructure is pleasant sugar, and you have to know which version you are on.

---

### Q5. `computed` vs `watch` vs `watchEffect`?

**Short interview answer:**  
`computed` is a pure derived value with a cache. `watch` is explicit sources plus a side effect. It is lazy, and it gives you old and new. `watchEffect` is an effect with automatic dependency tracking, and it runs immediately. For a UI value, use computed. For requests and localStorage, use watch or watchEffect.

---

#### In detail

| | `computed` | `watch` | `watchEffect` |
|---|------------|---------|---------------|
| Purpose | a derived **value** | an **effect** on sources | an **effect** with auto-deps |
| Return | `ComputedRef` (it has `.value`) | a stop handle | a stop handle |
| Cache | yes, until the deps change | no | no |
| When it runs | lazily, on the first read | by default **not** immediately (`immediate: true` runs it immediately) | **immediately** when it is created |
| old / new | no (only the current result) | yes | no |
| Deps | automatic, from the getter | an explicit source (a ref, a getter, an array) | automatic, from reads inside the callback |
| Typical case | `fullName`, a filtered list | fetch by `id`, sync into storage | simple "I read it, I did it" effects |

```ts
// computed — a pure value
const fullName = computed(() => `${first.value} ${last.value}`)

// watch — an explicit source, a side effect
watch(
  () => props.id,
  async (id, prevId, onCleanup) => {
    const data = await api.getUser(id)
    user.value = data
  },
  { immediate: true }, // like useEffect on mount, and again when it changes
)

// deep — when you need to watch nesting on an object
watch(
  form,
  () => { saveDraft(form) },
  { deep: true },
)

// watchEffect — the deps come from reads inside the callback
watchEffect(() => {
  document.title = title.value // read title → subscribed
})
```

**When to use which:**

- You need to **show** a derived value in the UI, or pass it on: `computed`.
- You need a **request, a subscription, or a write to the outside**, and the old value or the exact source list matters: `watch`.
- A short effect, the deps are obvious from the body, and you do not need the old value: `watchEffect`.
- `immediate: true` means "also run for the first value" (often a fetch by id).
- `deep: true` watches nested mutations of an object or array. It costs more. Sometimes it is better to watch a specific field, or to change the structure.

Do not put side effects in `computed`. That is an anti-pattern: the function is no longer pure, call order gets confusing, and debugging gets harder.

---

#### React — a mental anchor

| Vue | React (a close anchor) |
|-----|------------------------|
| `computed` | `useMemo` (a cached value) |
| `watch(source, cb)` | `useEffect(cb, [deps])` plus explicit deps |
| `watchEffect(cb)` | `useEffect` with no deps, or with the tracking done "in your head". In React the deps are still manual |
| `immediate: true` | the effect already runs after mount |
| `deep: true` | you usually compare the new objects yourself, with JSON, or with a deep-compare library |

The formula: **computed is a value**, **watch\* is an effect**. In React both often live in `useEffect` or `useMemo`, and the boundary between a value and an effect is developer discipline.

---

#### Autopilot phrase (1–2 sentences)

> `computed` is a cached derivation. `watch` is an effect on explicit sources, with old and new values and the `immediate` and `deep` options. `watchEffect` is an auto-tracked effect that starts immediately. For UI, use computed. For side effects, use watch.

---

### Q6. How do you clean up inside `watch`?

**Short interview answer:**  
From the `watch` or `watchEffect` callback, return a cleanup function. Vue calls it before the next run of the effect and when the watcher stops. The typical case is an `AbortController` for fetch. This does not replace `onUnmounted` for the whole component. It is cleanup of **this specific effect**.

---

#### In detail

The `watch` callback can return a teardown. In some forms you can also use the third argument, `onCleanup`:

```ts
watch(id, (newId) => {
  const ctrl = new AbortController()

  fetch(`/api/users/${newId}`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(data => { user.value = data })
    .catch(err => {
      if (err.name === 'AbortError') return
      // error handling
    })

  // called before the next watch run, and when the watcher stops or unmounts
  return () => ctrl.abort()
})
```

The equivalent with `onCleanup`:

```ts
watch(id, (newId, _prev, onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort())
  // fetch ...
})
```

**What the cleanup does:**

1. It cancels a stale request when `id` changes quickly (a race).
2. It removes listeners, timers, and WebSockets created by **this** run of the effect.

**Compared with `onUnmounted`:**

| | cleanup from `watch` | `onUnmounted` |
|---|-------------------|---------------|
| When | before the effect re-runs, and when the watch stops | only when the component unmounts |
| Scope | one effect / one subscription | the whole component |
| Typical use | abort a fetch when `id` changes | remove a global keydown listener, close a channel |

You often need **both**. Watch cleanup handles races when the deps change. `onUnmounted` handles resources that live for the whole life of the component. A `watch` created in a component stops itself on unmount, so its last cleanup runs too.

```
id: 1 → fetch#1
id: 2 → cleanup(abort #1) → fetch#2
unmount → cleanup(abort #2)
```

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| `return () => cleanup()` from `watch` | `useEffect(() => { ...; return () => cleanup() }, [id])` |
| abort when `id` changes | abort in the effect cleanup |
| `onUnmounted` | cleanup of that same `useEffect` with no deps, or a separate effect |

The model is almost one-to-one with React: the effect restarts, and the previous teardown runs first.

---

#### Autopilot phrase (1–2 sentences)

> In `watch` I return a cleanup function. Vue calls it before the next run of the effect and when the watcher stops. For fetch I use an `AbortController`. That is cleanup of the effect. It is not a full replacement for `onUnmounted`.

---

### Q7. `shallowRef` / `shallowReactive` — why?

**Short interview answer:**  
This is shallow reactivity. `shallowRef` tracks only replacement of `.value`. `shallowReactive` tracks only the first level of fields. Nested values are not wrapped in a Proxy. You want this for large data, for immutable updates, and for external libraries that a deep Proxy gets in the way of, or that a deep Proxy costs too much for.

---

#### In detail

**`shallowRef`**

```ts
const list = shallowRef<Item[]>(hugeArray)

// ❌ a mutation inside does NOT trigger the UI
list.value.push(newItem)

// ✅ the trigger is a new reference on .value
list.value = [...list.value, newItem]
// or
list.value = list.value.concat(newItem)
triggerRef(list) // rare: a force, if you mutated in place on purpose
```

**`shallowReactive`**

```ts
const state = shallowReactive({
  items: hugeArray, // the array itself is NOT deeply reactive
  page: 1,
})

state.page = 2           // ✅ trigger
state.items.push(x)      // ❌ the UI may not update
state.items = [...state.items, x] // ✅ replacing a top-level field
```

**When to use them:**

1. A huge JSON payload, or a table of thousands of rows. A deep Proxy is expensive in memory and at init.
2. The data already arrives immutable (a normalized store, Immer). You update by **replacing the root**.
3. External libraries (a map, CodeMirror, a graph) hold their own object. A Proxy breaks `instanceof`, private fields, and identity comparisons.
4. Integrating with an immutable pattern, the way React does it.

```
shallowRef:      trigger only on  .value = newRefValue
shallowReactive: trigger only on  obj.rootKey = ...
                 nesting stays raw
```

---

#### React — a mental anchor

| | Vue shallow* | React |
|---|--------------|--------|
| The model | opt-in shallow | state is **always** tracked by the root reference |
| An update | a new reference on `.value` or on a field | `setState(newRef)` |
| A deep mutation | does not trigger (same as in React) | does not trigger |
| Deep reactivity | `ref` / `reactive` by default | not available out of the box |

To a React developer, `shallowRef` often feels like `useState`: a trigger only when the reference is new. Deep `reactive` is the thing React does not have.

---

#### Autopilot phrase (1–2 sentences)

> `shallowRef` and `shallowReactive` give reactivity only at the root. For large structures and external libraries I update with a new reference, without a deep Proxy. Nested mutations will not wake the UI by themselves.

---

### Q8. What does `nextTick` do?

**Short interview answer:**  
Vue batches DOM updates asynchronously. `await nextTick()` waits until the DOM has applied the current reactive changes. You need it when, right after a state mutation, you read or touch the DOM (`focus`, `scrollHeight`).

---

#### In detail

When reactive data changes, Vue does not patch the DOM synchronously on every set. It queues a component update on the scheduler and flushes that queue as a microtask. Several changes in a row become one flush.

```ts
count.value++
count.value++
count.value++
// one batched re-render, not three
```

**`nextTick`** is a Promise and an API that means "run after the next DOM-update flush":

```ts
const box = ref<HTMLElement | null>(null)
const open = ref(false)

const handleOpen = async () => {
  open.value = true
  // the DOM may still not contain the expanded block
  await nextTick()
  // now v-if has rendered the element
  box.value?.focus()
  console.log(box.value?.scrollHeight)
}
```

Other cases: measure a size after the text or the list changes, scroll to a new element, or integrate with a third-party widget that needs an already mounted node.

```
state change → scheduler queue → DOM patch → nextTick callbacks
                     ↑
              batched updates
```

Without `nextTick` you often read the **old** DOM. With it, you read the DOM after the patch. Do not confuse it with `setTimeout(0)`. `nextTick` is tied to Vue's queue, not to "sometime later".

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| batched updates (the default) | batched updates (React 18+) |
| `await nextTick()` | `useEffect` after commit; `flushSync` when you need a synchronous DOM; sometimes `requestAnimationFrame` |
| focus after showing something | `useEffect` plus a ref, or a callback ref |

In React, "wait for the DOM" is usually an effect after paint or commit. In Vue, an explicit `nextTick` in the same async flow, right after the state change, is the usual pattern.

---

#### Autopilot phrase (1–2 sentences)

> `nextTick` waits until Vue flushes its batched DOM updates. After `open.value = true` I `await nextTick()`, and only then do I call `focus` or read `scrollHeight`.

---

### Q9. How does Vue 3 implement reactivity? (Proxy)

**Short interview answer:**  
`reactive()` wraps an object in a `Proxy`. On `get` it calls `track` (who read it). On `set` and `deleteProperty` it calls `trigger` (notify the subscribers). `ref` is a wrapper with a reactive `.value`. Objects stored inside it also enter reactivity. Vue 2 did this through `Object.defineProperty`, which is where the old limitations came from.

---

#### In detail

A simplified sketch:

```ts
// the idea, not a one-to-one copy of the source
function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      track(obj, key)          // the active effect subscribed
      const value = Reflect.get(obj, key, receiver)
      // nested objects are proxied too (deep)
      return isObject(value) ? reactive(value) : value
    },
    set(obj, key, value, receiver) {
      const result = Reflect.set(obj, key, value, receiver)
      trigger(obj, key)        // rerun computed / watch / render
      return result
    },
    deleteProperty(obj, key) {
      const result = Reflect.deleteProperty(obj, key)
      trigger(obj, key)
      return result
    },
  })
}
```

```
effect (render / computed / watch)
    │ reads obj.x
    ▼
  Proxy get → track(effect, obj.x)
    │
    │ later obj.x = 2
    ▼
  Proxy set → trigger → rerun effect
```

**Collections:** `Map`, `Set`, `WeakMap`, and `WeakSet` are supported by separate instrumentations. The methods `get`, `set`, `add`, `delete`, `has`, and `size` are tracked. A plain `{}` or `[]` goes through the standard Proxy traps.

**`ref`:** for primitives, `.value` is the reactive field. For objects, `.value` often already stores a `reactive` proxy.

**Vue 2 vs Vue 3, briefly:**

| | Vue 2 `defineProperty` | Vue 3 `Proxy` |
|---|------------------------|---------------|
| Adding a new key | you need `Vue.set` | seen immediately |
| Deleting a key | `Vue.delete` | seen |
| Arrays / index | hacks and limitations | covered by Proxy |
| Map / Set | poor, or not at all | yes |
| IE11 | yes | no (Proxy) |

In an interview it is enough to say: a Proxy on get and set does track and trigger; reactivity is deep by default; Map and Set are fine; Vue 2 ran into the limits of defineProperty.

---

#### React — a mental anchor

| | Vue | React |
|---|-----|--------|
| Watching the data | a Proxy on the user's state | none. It compares props and state by reference after setState |
| Who collects the deps | runtime track on read | you (the deps array) / the compiler (React Compiler) |
| The UI engine | reactivity plus a VDOM patch | Fiber reconciliation |

React does not wrap your object in a Proxy. Vue does. That is why mutations show up on their own.

---

#### Autopilot phrase (1–2 sentences)

> Vue 3 is a Proxy: get does track, and set or delete does trigger. That is how `reactive` and `ref` work, plus Map and Set support. Vue 2 used `defineProperty`, which had holes on new keys, and that is why `Vue.set` existed.

---

### Q10. Why `watch(() => props.id, ...)` and not `watch(props.id)`?

**Short interview answer:**  
At the moment of the call, `props.id` is already a primitive snapshot. `watch` receives a number or a string and does not know where to read it again later. You need a getter, a `ref`, or `toRef`, so that each run reads the current value and tracks the dependency.

---

#### In detail

```ts
const props = defineProps<{ id: string }>()

// ❌ snapshot: watch(props.id) ≈ watch('42') — the source is not reactive
watch(props.id, (id) => {
  load(id) // when props.id changes, the callback often is NOT called
})

// ✅ getter: on every track it reads props.id again
watch(() => props.id, (id) => {
  load(id)
})

// ✅ toRef — a ref linked to props.id
watch(toRef(props, 'id'), (id) => {
  load(id)
})

// ✅ if you already have a ref
watch(idRef, load)
```

**Why it works this way:** for a primitive source, `watch` cannot subscribe to "a variable". A subscription is possible on a **reactive object or a ref**, or on a **getter function**. Inside that getter, when the effect runs, the reads happen again, and that is track.

```
watch(props.id)       →  source = "42" (a dead snapshot)
watch(() => props.id) →  props.id is read every time → track → trigger on change
```

The same applies to `route.params.id`, to store fields, and to any primitive pulled into a local constant.

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| `watch(() => props.id, cb)` | `useEffect(cb, [props.id])` |
| `watch(props.id)` is a snapshot bug | in deps you still put an expression that is read again on every render |
| `toRef(props, 'id')` | there is no separate equivalent. It is the deps array |

In React the component function is called again, and the deps are compared again. In Vue, `setup` runs once, so the source for `watch` has to stay alive: a getter or a ref.

---

#### Autopilot phrase (1–2 sentences)

> `watch(props.id)` passes a snapshot of a primitive. To follow changes you need `watch(() => props.id)` or `toRef(props, 'id')`.

---

### Q11. `readonly` / `shallowReadonly`?

**Short interview answer:**  
`readonly` is a Proxy over an object or a ref that forbids mutations. In dev you get a warning. You hand state outward as read-only. `shallowReadonly` protects only the top level. Nested values can stay mutable.

---

#### In detail

```ts
const state = reactive({ user: { name: 'Ann' }, count: 0 })

const ro = readonly(state)
ro.count++           // no effect (plus a warning in dev)
ro.user.name = 'Bob' // also blocked with deep readonly

const sho = shallowReadonly(state)
sho.count++          // blocked
sho.user.name = 'Bob'// ⚠️ the nested object may still be writable
```

**The API surface:**

- `readonly(raw | reactive | ref)` returns a deep readonly proxy. For a ref, `.value` is readonly.
- `shallowReadonly(obj)` covers only the root.
- `isReadonly(x)` is the check.
- A common pair: `reactive` inside the module, and `readonly` outward as the public API of a composable or a store snapshot.

The analogy is `Object.freeze`, with two differences:

- `freeze` is shallow and hard (it throws in strict mode), and it is not deep by default;
- `readonly` is built for Vue. Reactive reads stay, tracking still works, and writes are silenced. The deep and shallow variants are explicit.

```ts
export const useUser = () => {
  const user = reactive({ name: '', role: 'guest' })
  const setName = (name: string) => { user.name = name }
  return {
    user: readonly(user), // outside, you can read. Writes go through the API
    setName,
  }
}
```

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| `readonly(state)` | the convention "do not mutate"; sometimes `Object.freeze` in dev |
| Language or runtime protection | almost none (TypeScript `Readonly<T>` is types only) |
| Public store API | readonly + actions | selectors + immutable updates |

React relies on discipline and on immutable updates. Vue can close writes **at runtime** through a readonly proxy.

---

#### Autopilot phrase (1–2 sentences)

> `readonly` is a reactive read-only Proxy, and it is deep. `shallowReadonly` covers only the root. It is handy for handing state outward with no right to mutate: a soft freeze that still keeps tracking.

---

### Q12. Mutability: a plus or a minus?

**Short interview answer:**  
A plus: better DX, and precise updates without copying trees. A minus: it is easier to mutate a shared object by accident and hit a bug. You need discipline. Agree on who owns the data, write Pinia state only in actions, and keep large external structures in a `shallowRef` that you replace.

---

#### In detail

**Pluses of Vue's mutable model:**

- `form.email = x` is short and local. The Proxy triggers that field's subscribers itself.
- Less boilerplate than `{ ...state, email: x }` on every step.
- Point updates fit track/trigger well. You do not have to clone the whole graph.

**Minuses:**

- A shared `reactive` object that leaked into two modules produces hidden side effects.
- A mutation that goes around the store API makes it hard to find who changed the data.
- An accidental nested mutation on a `shallowRef` leaves the UI silent.
- Time-travel debugging and immutable expectations get harder if the team came from React and has no rules.

**Discipline on a project:**

```ts
// Pinia: mutate state in actions, not directly from components (a team convention)
 const store = useCartStore()
// store.items.push(x)           // technically possible, but bad form
store.addItem(x)                  // an explicit contract

// Large data, or data from the outside world
const table = shallowRef(rows)
table.value = nextRows            // replace, do not deep-mutate

// Do not share one reactive object without a contract
// provide(readonly(state)) plus change methods is better than
// "here is the object, whoever wants can write to it"
```

The interview takeaway: mutability is a **tool**, not a religion. Vue gives you convenience. Safety comes from team agreements, the same way immutability in React is an agreement plus linters.

---

#### React — a mental anchor

| | Vue | React |
|---|-----|--------|
| Update style | mutations on a Proxy / `.value` | immutable updates |
| Protection from shared-mutation bugs | discipline, plus readonly, plus actions | immutability shrinks that class of bugs |
| The cost | the risk of a hidden mutation | verbosity, extra copies, and a need for Immer |
| Large data | `shallowRef` plus replace | the same idea: a new reference |

An honest senior take: in React, immutability insured you against a shared mutation. In Vue, the insurance is the boundary of the store or the composable, plus readonly. Both approaches work.

---

#### Autopilot phrase (1–2 sentences)

> Vue mutability is a plus for DX and for point updates. The minus is the risk of shared mutations. So Pinia writes go only through actions, outward state is `readonly`, and large structures are a `shallowRef` whose reference you replace.

---

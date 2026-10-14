---
order: 9
title: "9. Performance"
technology: vue
---

### Q43. Why is computed faster than a method in the template?

**Short interview answer:**  
`computed` is cached: it recalculates only when its dependencies change. A method or function in the template is called **on every** template re-render, even when the inputs are the same.

---

#### In detail

```vue
<!-- bad for heavy logic -->
<p>{{ heavy(items) }}</p>

<!-- good -->
<script setup>
const result = computed(() => heavy(items.value))
</script>
<p>{{ result }}</p>
```

For trivial things (`format(price)`) the difference is microscopic — no need to obsess. For filtering or sorting large arrays, use only computed (or move the work earlier, into the store).

`computed` is lazy: if nobody read the value, it did not compute.

---

#### React — a mental anchor

≈ `useMemo(() => heavy(items), [items])` versus calling `heavy(items)` directly in JSX. In React, without memo, it also recalculates on every render.

---

#### Autopilot phrase (1–2 sentences)

> Computed is cached by its dependencies; a method in the template runs on every render — keep heavy work in computed only.

---

### Q44. How do you optimize a large list?

**Short interview answer:**  
Virtualization, stable `key`s, `shallowRef` plus replacing the array instead of a deep Proxy over 10k objects, pagination or infinite scroll, and no heavy deep watchers on every item.

---

#### In detail

Checklist:
1. **Virtual scroll** (vue-virtual-scroller, tanstack virtual) — only what is visible is in the DOM.
2. **key = id**, not the index, on reorder or insert.
3. **`shallowRef(list)`** — you update `list.value = next` as a whole; nested fields are not reactive on their own.
4. Pagination, or a window of data from the server.
5. Do not attach `watch(item, ..., { deep: true })` inside a loop.
6. Use `v-once` / `v-memo` surgically, after a profile.
7. Images: lazy `loading="lazy"`, and fixed sizes to avoid layout shift.

---

#### React — a mental anchor

The same stack of ideas: react-window / tanstack-virtual, memoized rows, normalized data, pagination.

---

#### Autopilot phrase (1–2 sentences)

> A large list: virtualize, plus stable keys, plus shallowRef and replace — not a deep reactive over 10k objects.

---

### Q45. What is `v-memo`?

**Short interview answer:**  
`v-memo="[dep1, dep2]"` memoizes a piece of the VNode tree until the deps change. It is the analogue of a targeted `React.memo` inside the template. You need it rarely; profile first.

---

#### In detail

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <!-- a heavy row -->
</div>
```

The row rerenders only if `id` or `selected` changed. The item's other fields are ignored for this block.

Be careful: it is easy to "forget" a dependency and catch a stale UI. It is not a replacement for a normal list architecture.

---

#### React — a mental anchor

`<MemoRow item={item} />` with a custom `areEqual` / `React.memo`.

---

#### Autopilot phrase (1–2 sentences)

> `v-memo` memoizes a template fragment by its deps; it is a targeted tool, not the default.

---

### Q46. Extra updates — how do you debug them?

**Short interview answer:**  
Vue DevTools (the component inspector and the timeline), logs inside `watch`, a check for lost or extra dependencies, and caution with `deep: true` and with creating new objects in computed when you do not need them.

---

#### In detail

Algorithm:
1. DevTools → who re-renders on a click.
2. Put `watch(source, () => console.count('x'), { deep: true })` on a specific spot.
3. Check whether computed returns a new object or array with the same meaning every time → that triggers the children.
4. Use `shallowRef` where deep reactivity is not needed.
5. Make sure you are not watching the whole store.

A common cause of the "noise": `watch(() => ({ ...props }))`, or a deep watch of a huge state.

---

#### React — a mental anchor

The React DevTools Profiler plus why-did-you-render; compare props by reference.

---

#### Autopilot phrase (1–2 sentences)

> Extra updates: the DevTools timeline, then find an extra deep watch or a new object coming out of computed.

---

### Q47. `KeepAlive` — perf or UX?

**Short interview answer:**  
First of all it is **UX**: keep the state of tabs and forms while switching. Perf is a side effect (there is no remount). Memory grows → limit it with `max` and `include`/`exclude`.

---

#### In detail

```vue
<KeepAlive :max="5" :include="['UserForm', 'Filters']">
  <component :is="current" />
</KeepAlive>
```

The hooks are `onActivated` / `onDeactivated` (instead of a full unmount).  
Do not cache heavy screens that hold large subscriptions unless you deactivate the listeners.

With the router, a common shape is:

```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

---

#### React — a mental anchor

React has no built-in KeepAlive; people emulate it with a router cache, CSS hide, or third-party libraries — so in an interview this is a plus that shows you know Vue.

---

#### Autopilot phrase (1–2 sentences)

> KeepAlive is a UX cache of instances (the state stays alive); control memory with max and include, and do not cache everything.

---

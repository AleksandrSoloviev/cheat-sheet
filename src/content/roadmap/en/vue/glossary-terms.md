---
day: glossary-terms
title: "Terms"
questions: []
---

## Reactivity

### `ref`

A wrapper around a value: `{ value: T }`. In script you read and write `.value`. A top-level ref unwraps itself in the template. Similar to `useState`, but you mutate `.value` instead of calling a setter.

### `reactive`

A Proxy around an **object**. You change fields directly: `form.name = 'x'`. Do not put a primitive in it. Destructuring breaks reactivity → `toRefs`.

### `computed`

A cached derived value. It recomputes only when its dependencies change. Similar to `useMemo`. A value for the UI belongs in computed, not in a method called from the template.

### `watch`

A side effect on an explicit source: `watch(source, cb)`. You get old/new, `immediate`, and cleanup via `return () => ...`. Close to `useEffect(cb, [deps])`.

### `watchEffect`

An effect that tracks dependencies inside the callback and starts immediately. Like `useEffect` without a deps array, except Vue collects the dependencies.

### `toRef`

Takes one field of an object or of `props` as its own ref, without losing the link. `toRef(props, 'id')` or `toRef(() => props.id)`.

### `toRefs`

Turns every field of a `reactive` object into a ref. Use it so you can destructure without losing reactivity.

### `storeToRefs`

Like `toRefs`, but for a Pinia store: state and getters stay reactive after destructuring. Actions can be destructured without it.

### `shallowRef`

Reactive only when `.value` is replaced, not when something nested is mutated. For large arrays or JSON: `list.value = next`. Feels closer to React state-by-reference.

### `shallowReactive`

A Proxy only on the first level of an object's fields. Nested objects are not deeply reactive.

### `readonly`

A reactive object that is read-only. In dev, a mutation warns. Useful when you hand state out without write access.

### `nextTick`

Waits until Vue has applied the batched DOM updates. `await nextTick()` before `focus()` or measuring the DOM. Close to “after commit” in React (`useEffect`, sometimes `flushSync`).

### `toValue`

Reads the raw value from a `ref`, a getter, or a plain value. Inside a composable: accept the input, then `toValue(input)`. Vue 3.3+.

### `MaybeRefOrGetter<T>`

The input type of a composable: a plain `T`, a `Ref<T>`, or `() => T`. Callers can pass a string or a computed. Inside, read it with `toValue`.

## Components

### `props / defineProps`

Data passed into the component from the parent. In `<script setup>` you declare them with the `defineProps<{...}>()` macro. Do not mutate them. ≈ props in React.

### `emit / defineEmits`

An event upward, instead of a callback prop. The child does `emit('save', id)`, the parent writes `@save="onSave"`. ≈ `onSave` in React, but a separate channel.

### `withDefaults`

Defaults for props used with type-based `defineProps`. Arrays and objects need a factory: `tags: () => []`.

### `defineModel`

Vue 3.4+ sugar for `v-model` on a component. It declares the prop and the emit for you. You write `model.value = x`.

### `defineExpose`

Explicitly exposes methods to the parent through a template ref. ≈ `useImperativeHandle`.

### `v-model`

Sugar for a two-way binding. On an input it is value plus input. On a component it is `modelValue` plus `update:modelValue`. ≈ a controlled `value` plus `onChange`.

### `v-if / v-show`

`v-if` mounts and unmounts. `v-show` only toggles CSS `display`. A frequent toggle → show. A rare or heavy subtree → if.

### `v-for + key`

A list loop. Always use a stable `:key` (an id). Do not put `v-if` on the same node. Filter in a computed.

## Composition

### `provide / inject`

Pass a value down the tree without prop drilling. ≈ React Context. For TypeScript, use an `InjectionKey`.

### `onMounted / onUnmounted`

Lifecycle hooks. The DOM is ready → mounted. Cleanup → unmounted. ≈ the mount and cleanup of `useEffect`.

### `onActivated / onDeactivated`

Hooks for a component inside `KeepAlive`: shown again, or hidden into the cache, without a full destroy.

## Async / DOM

### `AbortController`

A browser API, not a Vue API. It cancels fetch. In `watch` you create a controller and call `abort()` in cleanup, so a stale response is not applied when the id changes. The same idea as React `useEffect` cleanup.

## State

### `defineStore (Pinia)`

Declares a Pinia store. A setup store ≈ a composable: refs, computed, and actions. The official Vue 3 store, closer to Zustand than to Redux.

### `Pinia vs Vuex`

Pinia is the current store (no mutations, good TypeScript). Vuex is legacy. Do not put ephemeral UI there, such as whether a modal is open.

## Router

### `createRouter / createWebHistory`

Creates a Vue Router 4 router. History mode ≈ BrowserRouter. Then `app.use(router)`.

### `useRoute / useRouter`

`useRoute()` is the current route (params, query). `useRouter()` navigates (`push`). ≈ `useParams` / `useNavigate`.

### `RouterView / RouterLink`

Where the matched component renders, and a link that does not reload the page. ≈ `Outlet` / `Link`.

## Built-ins

### `Teleport`

Renders a piece of UI into another DOM node, such as a modal in `body`. ≈ a React portal.

### `KeepAlive`

Caches instances of dynamic children (tabs or routes) so state survives. React has no 1:1 built-in.

### `Suspense`

A fallback while an async setup or an async component loads. The idea matches React Suspense.

## Nuxt

### `useFetch / useAsyncData`

Nuxt data fetching with SSR and a cache key. `useFetch` is sugar over `useAsyncData` plus `$fetch`. In role, ≈ Next fetch or React Query.

### `definePageMeta`

Page meta in Nuxt: middleware, layout, and so on. `definePageMeta({ middleware: 'auth' })`.

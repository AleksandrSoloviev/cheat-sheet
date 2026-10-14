---
order: 6
title: "6. Composables"
technology: vue
---

### Q31. What is a composable?

**Short interview answer:**  
A composable is a `useXxx()` function that encapsulates **stateful** logic on the Composition API (`ref`, `computed`, `watch`, lifecycle). It is the direct analogue of a **custom hook** in React. It is the main way to reuse logic in Vue 3 instead of mixins.

---

#### In detail

**Not just a utility.** A plain `formatDate()` is a helper. It is a composable when there is reactivity inside, and/or subscriptions to the component's lifetime:

```ts
// composable
export function useToggle(initial = false) {
  const on = ref(initial)
  const toggle = () => { on.value = !on.value }
  return { on, toggle }
}
```

**Rules (the same as for hooks):**
1. Call it synchronously in `setup` / `<script setup>` (not after `await` without understanding which instance you are on).
2. Do not call it conditionally, "sometimes yes, sometimes no," without a reason — you will break the order and the expectations.
3. Do cleanup (`onUnmounted`, the return from `watch`).
4. Accept `MaybeRef` / `MaybeRefOrGetter` and read them through `toValue` — so the caller can pass a `ref`, a string, or a getter.

A name with the `use` prefix is an ecosystem convention (and eslint likes it).

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| `useXxx()` composable | `useXxx()` custom hook |
| inside: `ref`/`watch`/`onMounted` | inside: `useState`/`useEffect` |
| mixins → composables | HOCs/classes → hooks |

---

#### Autopilot phrase (1–2 sentences)

> A composable is Vue's custom hook: `useXxx` with refs/watch/lifecycle, called in setup, with cleanup, and preferably `MaybeRefOrGetter` on the input.

---

### Q32. What does a typical "grown-up" composable look like?

**Short interview answer:**  
A "grown-up" composable accepts a reactive or static input (`MaybeRefOrGetter`), tracks it inside through `toValue`/`watchEffect`, does cleanup, and returns refs/methods — not raw mutable objects unless you need them.

---

#### In detail

**Pattern 1 — reacting to the input:**

```ts
import { watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

export const useDocumentTitle = (title: MaybeRefOrGetter<string>) => {
  watchEffect(() => {
    document.title = toValue(title)
  })
}

// calls:
useDocumentTitle('Static')
useDocumentTitle(computed(() => user.value.name))
```

**Pattern 2 — a subscription to the DOM/window:**

```ts
export const useMouse = () => {
  const x = ref(0)
  const y = ref(0)
  const onMove = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => window.addEventListener('mousemove', onMove))
  onUnmounted(() => window.removeEventListener('mousemove', onMove))
  return { x, y }
}
```

**Pattern 3 — async + abort:**

```ts
export const useUser = (id: MaybeRefOrGetter<string>) => {
  const user = ref<User | null>(null)
  const error = ref<unknown>(null)
  const loading = ref(false)

  watch(() => toValue(id), async (newId, _old, onCleanup) => {
    const ctrl = new AbortController()
    onCleanup(() => ctrl.abort())
    loading.value = true
    try {
      user.value = await fetchUser(newId, ctrl.signal)
    } catch (e) {
      if (!ctrl.signal.aborted) error.value = e
    } finally {
      loading.value = false
    }
  }, { immediate: true })

  return { user, error, loading }
}
```

Return `ref`/`computed`, not one big `reactive`, if the consumer is going to destructure.

---

#### React — a mental anchor

The structure is 1:1 with a hook:

```ts
function useMouse() {
  const [x, setX] = useState(0)
  useEffect(() => {
    const onMove = (e) => setX(e.pageX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return { x }
}
```

`MaybeRefOrGetter` ≈ "accept a value or a dependency", close to what React code often does with a `value` plus a separate `useEffect` on change.

---

#### Autopilot phrase (1–2 sentences)

> A grown-up composable: `MaybeRefOrGetter` + `toValue`, cleanup, and a return of refs; for async, abort in the watch `onCleanup`.

---

### Q33. Composable vs Pinia vs provide/inject?

**Short interview answer:**  
Three different scales of sharing: a **composable** is reusable logic (often local state per call); **Pinia** is a global domain store; **provide/inject** is a contract inside a branch of the tree (like Context), without being global.

---

#### In detail

| Tool | Scope | DevTools | Typical case |
|------------|-------|----------|----------------|
| Composable | Its own state on every call (usually) | No | `useMouse`, `useFetchLocal`, field validation |
| Pinia | One per application (by store id) | Yes | cart, session, feature-flags |
| provide/inject | The subtree from the provider | Weak | Theme, FormContext, design tokens |

**Antipattern:** shoving a modal UI flag into Pinia "just in case."  
**Antipattern:** dragging the whole user session through 10 levels via provide — Pinia is a better fit.  
**OK:** a `useAuth()` composable that reads Pinia on the inside — a facade for components.

`InjectionKey` + `Symbol` — so TypeScript works and name collisions do not happen.

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| composable | custom hook |
| Pinia | Zustand / Redux Toolkit |
| provide/inject | Context.Provider / useContext |

The same rule: Context ≠ a global store for the whole application.

---

#### Autopilot phrase (1–2 sentences)

> A composable is logic per call; Pinia is the global domain; provide/inject is Context for a branch. Do not mix the layers without a reason.

---

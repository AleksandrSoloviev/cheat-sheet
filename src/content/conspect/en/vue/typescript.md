---
order: 10
title: "10. TypeScript"
technology: vue
---

### Q48. How do you type props and emits?

**Short interview answer:**  
In `<script setup lang="ts">`: `defineProps<{...}>()` and `defineEmits<{ event: [payload] }>()`. Defaults go through `withDefaults`. Runtime `PropType` is for the object syntax and for legacy code.

---

#### In detail

```ts
const props = withDefaults(defineProps<{
  title: string
  count?: number
}>(), {
  count: 0,
})

const emit = defineEmits<{
  save: [id: number]
  'update:modelValue': [value: string]
}>()
```

Typed emits catch typos in event names at compile time.  
For public libraries, people sometimes also duplicate a runtime props object — better DX in JS without TS.

---

#### React — a mental anchor

`type Props = {...}` plus the props argument; callbacks `onSave?: (id: number) => void` instead of an emit map.

---

#### Autopilot phrase (1–2 sentences)

> TS: defineProps<>/defineEmits<> + withDefaults; event payloads are a tuple in the emits map.

---

### Q49. `InjectionKey`?

**Short interview answer:**  
`InjectionKey<T>` is a typed Symbol for provide/inject, so `inject` returns `T | undefined` without magic strings and without collisions.

---

#### In detail

```ts
import type { InjectionKey, Ref } from 'vue'

export const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')

// provider
provide(themeKey, theme)

// consumer
const theme = inject(themeKey)
if (!theme) throw new Error('theme not provided')
```

A string key `'theme'` works, but it is worse for TS and for the risk of collisions between libraries.

---

#### React — a mental anchor

`const ThemeContext = createContext<Theme | null>(null)` plus a null check — the same idea.

---

#### Autopilot phrase (1–2 sentences)

> InjectionKey = Symbol + a type for provide/inject; like createContext with a generic.

---

### Q50. Generic components in Vue 3.3+?

**Short interview answer:**  
In an SFC: `<script setup lang="ts" generic="T extends ...">` — a generic component, like `function List<T>()`. You need it for tables and selects whose item types differ.

---

#### In detail

```vue
<script setup lang="ts" generic="T extends { id: string }">
defineProps<{
  items: T[]
  selected?: T
}>()
defineEmits<{ select: [item: T] }>()
</script>
```

Limitations: complex inferred types sometimes misbehave — simplify the constraints. For very complex generics, people sometimes leave props as `unknown` plus external generic helpers.

---

#### React — a mental anchor

`function List<T extends {id: string}>(props: { items: T[] })` — the familiar React pattern.

---

#### Autopilot phrase (1–2 sentences)

> Vue 3.3+: generic on script setup — typed lists and tables, like generic functions in React.

---

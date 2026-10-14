---
order: 3
title: "3. Components, props, emits, v-model"
technology: vue
---

### Q17. How do you declare props and emits in `<script setup>` + TS? `withDefaults`

**Short interview answer:**  
`defineProps<T>()` and `defineEmits<T>()` are macros. Defaults go through `withDefaults(defineProps<...>(), { ... })`. You emit with `emit('event', payload)`. Event types use tuple syntax: `save: [id: number]`.

---

#### In detail

**Props (type-based):**

```ts
const props = withDefaults(
  defineProps<{
    title: string
    count?: number
    tags?: string[]
  }>(),
  {
    count: 0,
    tags: () => [], // factory for objects/arrays!
  }
)

props.title // string
props.count // number (no longer optional after the default)
```

**Important:** the default for an object or array is a **factory function** `() => []`. Otherwise one reference is shared across instances (same as Options `default: () => ({})`).

**Runtime declaration** (when you need runtime validation without full TS):

```ts
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
})
```

**Emits (type-based, Vue 3.3+):**

```ts
const emit = defineEmits<{
  save: [id: number]
  'update:modelValue': [value: string]
  close: [] // no payload
}>()

emit('save', 42)
emit('update:modelValue', 'hi')
emit('close')
```

The older call-signature style still shows up:

```ts
const emit = defineEmits<{
  (e: 'save', id: number): void
  (e: 'close'): void
}>()
```

**Destructuring props:** the classic case breaks reactivity; use `toRefs(props)` / `toRef(props, 'id')`. Vue 3.5+ reactive props destructure (the compiler) can keep reactivity. In an interview, mention both pictures.

**Props are readonly:** mutating `props.x = ...` is not allowed (a warning). Change the value through emit / v-model.

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| `defineProps<{ title: string }>()` | `type Props = { title: string }` + the argument |
| `defineEmits` + `emit('save', id)` | `onSave?: (id: number) => void` + a call |
| `withDefaults` | default params / `defaultProps` (rare) |
| Factory for array/object defaults | usually just `tags = []` in destructuring |

In React, callbacks are ordinary props. In Vue, events are a separate channel (`emit`), even though in the template you listen with `@save`.

---

#### Autopilot phrase (1–2 sentences)

> In script setup: `defineProps`/`defineEmits` with generics, defaults via `withDefaults`, and a factory `() => []` for arrays and objects. I do not mutate data on the way out. I only `emit`.

---

### Q18. One-way data flow in Vue?

**Short interview answer:**  
Props go **down**, events go **up**. The child **does not mutate** props (in dev you get a warning). To change something, `emit`, and the parent updates the source of truth. For two-way binding there is the `v-model` sugar, but underneath it is still a prop plus an emit.

---

#### In detail

```
Parent state ──props──► Child (read)
Parent state ◄──emit── Child (ask to change)
```

```vue
<!-- Parent -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <Child :count="count" @inc="count++" />
</template>
```

```vue
<!-- Child -->
<script setup lang="ts">
defineProps<{ count: number }>()
const emit = defineEmits<{ inc: [] }>()
</script>

<template>
  <button @click="emit('inc')">{{ count }}</button>
  <!-- bad: props.count++ -->
</template>
```

**Why you must not mutate props:** the source of truth gets smeared across components; the parent does not know the value changed; debugging gets hard; async and reuse produce surprises.

**Exceptions / gray areas:**

- Mutating a **nested** field of an object prop technically goes through the Proxy, but it is an anti-pattern (a side effect on the parent's object). Prefer an emit or a local copy.
- `v-model` does not break one-way flow. It is a convention: the `modelValue` prop plus `update:modelValue`.

**Deeper in the tree:** provide/inject and Pinia are other channels, but the principle of an explicit data flow stays the same.

---

#### React — a mental anchor

The same idea: props down, callbacks up. `props.count++` is also a bad idea in React (and often simply does not work with primitives). A controlled input is value plus onChange: the same one-way flow plus a request to update.

---

#### Autopilot phrase (1–2 sentences)

> One-way means props down and emit up; the child does not mutate props. `v-model` is only sugar over a prop plus `update:*`. It is not an exception to the rule.

---

### Q19. How does `v-model` work on a component? (`modelValue`, multiple v-models)

**Short interview answer:**  
`v-model` on a component is approximately `:modelValue` plus `@update:modelValue`. Multiple models: `v-model:title="title"` becomes the `title` prop plus an `update:title` emit. From Vue 3.4 onward, people often write this with `defineModel()`.

---

#### In detail

**One v-model (the default name):**

```vue
<Child v-model="text" />
<!-- compiles roughly to: -->
<Child
  :modelValue="text"
  @update:modelValue="text = $event"
/>
```

```vue
<!-- Child without defineModel -->
<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <input :value="modelValue" @input="onInput" />
</template>
```

**Several v-models:**

```vue
<UserForm
  v-model:firstName="first"
  v-model:lastName="last"
/>
```

The child:

```ts
defineProps<{ firstName: string; lastName: string }>()
defineEmits<{
  'update:firstName': [value: string]
  'update:lastName': [value: string]
}>()
```

**Modifiers:** `v-model.trim`, `.number`, and `.lazy` on native inputs. On your own components, the `modelModifiers` prop, or `defineModel({ local: true })` and its options. Know that the mechanism exists.

**The Vue 2 difference (often asked):** Vue 2's default was `value` plus `input`. Vue 3 is `modelValue` plus `update:modelValue`. The custom option `model: { prop: 'x', event: 'change' }` gave way to named v-models.

---

#### React — a mental anchor

In React you write it by hand every time: `<Input value={text} onChange={e => setText(e.target.value)} />`. Vue `v-model` is syntactic sugar over the same controlled pair. Several v-models are several value/onChange pairs with different names.

---

#### Autopilot phrase (1–2 sentences)

> `v-model` on a component is `modelValue` plus `update:modelValue`. `v-model:title` is the `title` prop plus `update:title`. It is a controlled value/onChange, just shorter.

---

### Q20. `defineModel` — what is it?

**Short interview answer:**  
A Vue 3.4+ macro that declares the prop and the emit for v-model in one line. You read and write `model.value`, and the compiler sends `update:*` itself. Less boilerplate for controlled components.

---

#### In detail

```vue
<script setup lang="ts">
// default v-model
const model = defineModel<string>({ required: true })

// named
const title = defineModel<string>('title', { default: '' })

// usage
model.value = 'hi' // ≈ emit('update:modelValue', 'hi')
</script>

<template>
  <input v-model="model" />
  <input v-model="title" />
</template>
```

**Options:** `required`, `default`, `type` (runtime), `local` (a local copy plus sync, handy for a semi-controlled component).

**The equivalent without defineModel:**

```ts
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
```

`defineModel` is that computed get/set plus the declarations.

**When you still use Options or a manual emit:** older codebases below 3.4, or you need custom logic before the emit (validation, normalization). You can put that in a setter or a `watch` around the model.

---

#### React — a mental anchor

There is no macro equivalent. The closest thing is a custom hook:

```ts
function useModel(value: string, onChange: (v: string) => void) {
  return [value, onChange] as const
}
```

or a controlled input with `value`/`onChange`. `defineModel` saves specifically the Vue boilerplate of a prop plus an emit.

---

#### Autopilot phrase (1–2 sentences)

> `defineModel` (3.4+) is sugar: a ref-like API, with a prop plus `update:*` under the hood. I write `model.value = x` instead of a manual `emit('update:modelValue', x)`.

---

### Q21. Controlled vs uncontrolled in Vue?

**Short interview answer:**  
**Controlled:** the parent holds the state, plus `v-model` / `:modelValue` plus `@update:...`. The child is fully driven from outside. **Uncontrolled:** an internal `ref`, and the result goes out through an emit on submit or through `defineExpose`. A hybrid is common: a local draft plus a `watch` on props to stay in sync.

---

#### In detail

**Controlled:**

```vue
<!-- Parent -->
<TextField v-model="name" />

<!-- Child: the value comes only from props, changes only through emit -->
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>
<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

The parent always knows the current value, so it is easy to validate the whole form, reset it, and sync the URL.

**Uncontrolled / local:**

```vue
<script setup lang="ts">
const draft = ref('')
const emit = defineEmits<{ submit: [value: string] }>()

const handleSubmit = () => emit('submit', draft.value)
</script>
```

The parent does not listen to every keystroke, only to the final result. Fewer parent rerenders, and simpler isolation.

**Hybrid (a common edit-dialog pattern):**

```ts
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string]; close: [] }>()

const draft = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => { draft.value = v },
)

const handleSave = () => {
  emit('update:modelValue', draft.value)
  emit('close')
}
```

You open the modal, keep a local draft, and Save pushes it up. It is not controlled on every keystroke.

**Native inputs in Vue:** `v-model` on an `<input>` inside an SFC is locally controlled by the framework. The controlled/uncontrolled question is usually about the **parent-to-child component boundary**.

---

#### React — a mental anchor

| | Vue | React |
|---|-----|--------|
| Controlled | `v-model` / modelValue+update | `value` + `onChange` |
| Uncontrolled | an internal `ref`, emit on submit | `defaultValue` + `ref` / internal state |
| Hybrid | draft + watch on props | `useState(props.x)` + sync (watch out for stale values) |

---

#### Autopilot phrase (1–2 sentences)

> Controlled means the state lives on the parent and you use v-model. Uncontrolled means a local ref and an emit outward when the user acts. For form modals, a draft plus a sync from props is common, so every keystroke does not travel up.

---

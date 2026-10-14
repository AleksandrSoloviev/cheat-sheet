---
order: 4
title: "4. Template: directives, slots, attrs"
technology: vue
---

### Q22. `v-if` vs `v-show`?

**Short interview answer:**  
`v-if` is a conditional **mount/unmount** (more expensive to toggle, cheaper while hidden, because the node is not in the DOM). `v-show` is only CSS `display`; the node is always in the DOM. Frequent toggling points to `v-show`. A rare toggle, a heavy tree, or a need for a full teardown points to `v-if`.

---

#### In detail

```vue
<div v-if="open">a heavy tab / chart</div>
<div v-show="open">a tooltip that flickers often</div>
```

| | `v-if` | `v-show` |
|---|--------|----------|
| DOM | no node when false | the node is always there |
| Toggle cost | high (create/destroy) | low (CSS) |
| Cost while hidden | low | you pay for the mount, plus possible work inside |
| Directives / lazy | you can pair `v-if` with an async child | the child is already mounted |
| `<template v-if>` | yes (no extra wrapper in the DOM) | the same pattern on template is pointless |

**`v-else` / `v-else-if`:** only immediately after `v-if` or `v-else-if` on a sibling node.

**With the lifecycle:** when `v-if="false"`, unmount runs, so watchers and timers get cleaned up. KeepAlive is a separate story. With `v-show`, `onMounted` has already run, and unmount hooks are not called when you hide the node.

**Accessibility:** `v-show` leaves the node in the DOM, so screen readers may still see it unless you also set `aria-hidden`, or the reverse. `v-if` removes it from the accessibility tree completely.

---

#### React — a mental anchor

`{cond && <X />}` or a ternary is roughly `v-if`.  
`style={{ display: cond ? 'block' : 'none' }}` is roughly `v-show`.  
React has no separate directive. The tradeoff is the same: mount versus hiding with CSS.

---

#### Autopilot phrase (1–2 sentences)

> `v-if` mounts and destroys. `v-show` only hides through CSS. Frequent flicker calls for `v-show`. Something rare and heavy calls for `v-if`.

---

### Q23. `v-for` and `key`; the `v-if` + `v-for` pitfall

**Short interview answer:**  
Always use a stable unique `:key` (the entity id, not the index, when the list is reordered or filtered). A `key` on a component forces a remount when it changes. **`v-if` and `v-for` on the same element is a bad idea:** in Vue 3, `v-if` has higher priority, which gets confusing. Filter through a `computed`.

---

#### In detail

```vue
<li v-for="user in users" :key="user.id">
  {{ user.name }}
</li>
```

**Why key exists:** Vue matches old and new vnodes during patch. A stable key reuses the DOM and the component correctly, so an input does not slide onto another row. An index as the key is fine only for **static** lists with no reorder, insert, or delete.

**key on a component:**

```vue
<UserForm :key="userId" :user-id="userId" />
```

When `userId` changes, the form fully remounts and local state resets. That is a useful trick.

**The v-if + v-for pitfall (Vue 3):**

```vue
<!-- bad: v-if has higher priority than v-for, so `item` may be unavailable -->
<li v-for="item in list" v-if="item.active" :key="item.id">
```

The correct version:

```vue
<li v-for="item in activeList" :key="item.id">
```

```ts
const activeList = computed(() => list.value.filter((i) => i.active))
```

Or `<template v-for>` plus an inner `v-if`:

```vue
<template v-for="item in list" :key="item.id">
  <li v-if="item.active">{{ item.name }}</li>
</template>
```

**What you can iterate:** arrays, objects (`v-for="(val, key) in obj"`), and ranges (`v-for="n in 5"`).

---

#### React — a mental anchor

The reconciliation semantics are the same: `key` inside `.map()`. Index-as-key is the same anti-pattern. Filtering the list before map is like a computed before v-for. React has no directive conflict between v-if and v-for. You simply avoid writing that kind of meaningless code in one expression.

---

#### Autopilot phrase (1–2 sentences)

> Use a stable `key` by id, not by index, when the list mutates. I keep `v-if` and `v-for` off the same node and filter in a `computed`, because in Vue 3 `v-if` has higher priority.

---

### Q24. Event modifiers?

**Short interview answer:**  
`@click.stop`, `.prevent`, `.self`, `.once`, `.capture`, `.passive`. For keys, `@keyup.enter` and `.esc`. You can chain them: `@submit.prevent`. In React you do the same by hand in the handler: `e.preventDefault()`, `e.stopPropagation()`.

---

#### In detail

| Modifier | Effect |
|-------------|--------|
| `.stop` | `stopPropagation` |
| `.prevent` | `preventDefault` |
| `.self` | only if `event.target === currentTarget` |
| `.once` | remove the listener after the first firing |
| `.capture` | the capture phase |
| `.passive` | a passive listener (scroll performance) |

**Keys:**

```vue
<input @keyup.enter="submit" @keyup.esc="cancel" />
<!-- system modifiers: .ctrl .alt .shift .meta -->
<button @click.ctrl.exact="onCtrlClick">Save</button>
```

`.exact` means no extra key modifiers are held.

**Mouse:** `.left`, `.right`, `.middle`.

**On components:** `@click` listens for the **native** click when that listener falls through as an attribute. For your own events, modifiers such as `.stop` apply to the component listener by Vue's rules. Native modifiers are for DOM events.

A form example:

```vue
<form @submit.prevent="handleSave">
  <input @keydown.enter.prevent="handleSave" />
</form>
```

---

#### React — a mental anchor

```tsx
onClick={(e) => {
  e.stopPropagation()
  e.preventDefault()
}}
```

Keys: `onKeyDown={(e) => e.key === 'Enter' && ...}`. Vue lifts this into declarative modifiers in the template.

---

#### Autopilot phrase (1–2 sentences)

> Modifiers are sugar over `preventDefault`, `stopPropagation`, once, and capture: `@click.stop.prevent`, `@keyup.enter`. In React I write the same thing in the handler body.

---

### Q25. Slots: default, named, scoped?

**Short interview answer:**  
**Default** is `<slot />`, or content with no name. **Named** is `<slot name="header" />` plus `#header` on the parent. **Scoped** is a slot with props such as `:item="row"`, and the parent destructures them with `#item="{ item }"`. A scoped slot is roughly render props in React.

---

#### In detail

**Child:**

```vue
<template>
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot>Default fallback text</slot>
  </main>
  <ul>
    <li v-for="row in rows" :key="row.id">
      <slot name="item" :item="row" :index="row.id">
        {{ row.name }}
      </slot>
    </li>
  </ul>
</template>
```

**Parent:**

```vue
<List :rows="rows">
  <template #header>
    <h2>Users</h2>
  </template>

  <!-- default slot -->
  <p>Intro</p>

  <template #item="{ item }">
    <strong>{{ item.name }}</strong>
  </template>
</List>
```

Shorthands: `v-slot:header` becomes `#header`. The default slot is `#default="{ ... }"`.

**Why scoped slots exist:** the child owns the data and the loop. The parent owns the **presentation** of the cell (a table, a menu, a design system).

**A conditional slot:**

```vue
<div v-if="$slots.footer" class="footer">
  <slot name="footer" />
</div>
```

In script setup: `useSlots()`, and `defineSlots<{ default: ... }>()` for TypeScript.

**Fallback:** the content inside `<slot>...</slot>` is used when the parent passed nothing.

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| default slot | `children` |
| named slot | a `header={...}` prop / `<HeaderSlot />` |
| scoped slot | a render prop `renderItem={(item) => ...}` or `children(item)` |

```tsx
<List renderItem={(item) => <strong>{item.name}</strong>} />
```

---

#### Autopilot phrase (1–2 sentences)

> Default and named slots are where the parent's markup goes. A scoped slot means the child passes data into the slot and the parent draws the UI. That is render props, Vue-style.

---

### Q26. `$attrs` / `inheritAttrs`?

**Short interview answer:**  
Attributes and listeners that are **not** declared as props or emits land in `$attrs` and, by default, on the **root** element. `inheritAttrs: false` plus `v-bind="$attrs"` forwards them onto an inner node, such as a wrapper around `<input>`. In Vue 3, listeners are part of attrs. There is no separate `$listeners`, unlike Vue 2.

---

#### In detail

```vue
<!-- Parent -->
<BaseInput class="w-full" placeholder="Name" @focus="onFocus" />
```

```vue
<!-- BaseInput.vue -->
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ modelValue: string }>()
// class, placeholder, onFocus → attrs, not props
</script>

<template>
  <div class="field">
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
```

Without `inheritAttrs: false`, `class` and `@focus` would land on the wrapper `<div>` instead of the `<input>`. That is a bug for accessibility and for styles.

**In script:** `useAttrs()` is not deeply reactive in every version, so do not destructure it blindly if you need tracking. For class and style it is often fine to read them in the template.

**class / style:** on fallthrough, Vue merges them intelligently with the root class and style.

**Vue 2 to Vue 3:** `$listeners` was merged into `$attrs`. `v-on="$listeners"` is no longer needed. `v-bind="$attrs"` carries listeners too.

**A multi-root template (a fragment):** fallthrough attrs are **not** applied automatically. You need an explicit `v-bind="$attrs"`, or you get a warning in dev.

---

#### React — a mental anchor

An explicit rest spread:

```tsx
function BaseInput({ value, onChange, ...rest }: Props) {
  return (
    <div className="field">
      <input value={value} onChange={onChange} {...rest} />
    </div>
  )
}
```

In Vue, fallthrough is automatic on a single root. You turn it off with `inheritAttrs: false` when the root is not the DOM node you want.

---

#### Autopilot phrase (1–2 sentences)

> Undeclared attrs and listeners go into `$attrs` and onto the root. For a wrapper input I set `inheritAttrs: false` and put `v-bind="$attrs"` on the inner `<input>`. In Vue 3, `$listeners` already lives inside attrs.

---

### Q27. `<Teleport>`, `<KeepAlive>`, `<Suspense>`?

**Short interview answer:**  
**Teleport** renders into another DOM node (modals into `body`). It is roughly a React portal. **KeepAlive** caches instances of dynamic children (`include` / `exclude` / `max`), with the `onActivated` and `onDeactivated` hooks. **Suspense** shows a fallback while async setup or an async component is loading.

---

#### In detail

**Teleport:**

```vue
<Teleport to="body">
  <div class="modal" v-if="open">…</div>
</Teleport>
```

The Vue logical tree stays in place, so provide/inject and props still work. The physical DOM is in `body`. The `disabled` prop leaves it in place, for example during SSR or on mobile. Several teleports into one target are fine.

**KeepAlive:**

```vue
<KeepAlive :include="['TabA', 'TabB']" :max="10">
  <component :is="current" />
</KeepAlive>
```

It keeps input state when you switch tabs. Components need **names** for `include` and `exclude`.  
Hooks: `onActivated` and `onDeactivated`, instead of mounting and unmounting again.  
It does not cache DOM nodes at random. It caches the **vnode / component instance**.

**Suspense:**

```vue
<Suspense>
  <RouterView />
  <template #fallback>
    <Spinner />
  </template>
</Suspense>
```

It works with async setup and `defineAsyncComponent`. Nested Suspense boundaries are independent loading boundaries. Error handling is separate (`onErrorCaptured` or an error component).

**A combo:** RouterView plus KeepAlive plus Transition is a common pattern in layouts.

---

#### React — a mental anchor

| Vue | React |
|-----|--------|
| Teleport | `createPortal(..., document.body)` |
| KeepAlive | no one-to-one match; react-router outlets plus a manual cache or a library |
| Suspense | React.Suspense (data and code) is a similar idea |

---

#### Autopilot phrase (1–2 sentences)

> Teleport is a portal into another DOM node. KeepAlive is an instance cache with activated and deactivated. Suspense is a fallback for async setup or an async component. KeepAlive out of the box is stronger than what React ships.

---

### Q28. The dynamic component `:is`?

**Short interview answer:**  
`<component :is="current" />` renders a component or an HTML tag by name or by object. It is often paired with `KeepAlive` and tabs. `current` is a string (a registered name or a tag) or the imported component itself.

---

#### In detail

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import TabA from './TabA.vue'
import TabB from './TabB.vue'

const tab = ref<'a' | 'b'>('a')
const current = computed(() => (tab.value === 'a' ? TabA : TabB))
</script>

<template>
  <button @click="tab = 'a'">A</button>
  <button @click="tab = 'b'">B</button>

  <KeepAlive>
    <component :is="current" :key="tab" />
  </KeepAlive>
</template>
```

**`:is` accepts:**

- a component object (preferred with `<script setup>` plus an import);
- a string naming a globally registered component;
- a native tag: `:is="'section'"`.

**Router:** a `<RouterView>` inside the page is essentially a dynamic outlet. You can wrap it in KeepAlive.

**Be careful:**

- without a `key`, Vue can reuse an instance too aggressively between different components of the same slot type, so people sometimes set `:key`;
- props should be compatible, or you forward only the shared subset;
- for async work: `defineAsyncComponent` plus Suspense.

**Compared with a v-if chain:**

```vue
<TabA v-if="tab === 'a'" />
<TabB v-else />
```

`:is` is more convenient with a registry or a map of N tabs:

```ts
const tabs = { a: TabA, b: TabB, c: TabC } as const
```

---

#### React — a mental anchor

```tsx
const map = { a: TabA, b: TabB }
const Comp = map[tab]
return <Comp />
```

Or `{tab === 'a' ? <TabA /> : <TabB />}`. The idea is the same: a variable stands in for the component type.

---

#### Autopilot phrase (1–2 sentences)

> `<component :is="comp" />` renders dynamically from a component reference or a tag. Paired with KeepAlive, it is the classic tabs pattern. In React that is `const Comp = map[tab]; return <Comp />`.

---

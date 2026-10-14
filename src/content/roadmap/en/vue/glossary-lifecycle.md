---
day: glossary-lifecycle
title: "Lifecycle"
questions: []
---

## Component lifecycle

When an instance is created, updated, and destroyed, and which hooks to call. The Composition API is the main style. The Options API is here so you can read legacy code.

### The whole picture

A component goes through **create → mount into the DOM → updates when reactive data changes → unmount**. Separately: if it is wrapped in `KeepAlive`, activate/deactivate can replace a full unmount.

```
create
  → setup() / <script setup>          (once per instance)
  → beforeMount
  → DOM inserted
  → mounted                            ← DOM, subscriptions
  → (data changed)
      → beforeUpdate
      → DOM patch
      → updated
  → beforeUnmount
  → unmounted                          ← cleanup
(+ KeepAlive: activated / deactivated)
```

### The important difference from React

In React the component function runs **on every render**. In Vue, `setup` / `<script setup>` runs **once** when the instance is created. After that the template updates from reactive dependencies. Put effects in `watch` / `onMounted`, not “at the bottom of setup” as if setup ran on every render.

| Phase | Composition API | Options API | What it is for | React anchor |
| --- | --- | --- | --- | --- |
| Init | setup() / the whole `<script setup>` | beforeCreate → data/created | Declare refs, computed, watch, functions. There is no DOM yet. | The first function call plus hook declarations |
| Before mount | onBeforeMount | beforeMount | Rarely needed. The template is compiled, the DOM is not inserted yet. | — |
| After mount | onMounted | mounted | The DOM exists: focus, measurements, third-party widgets, window subscriptions. | useEffect(() => {...}, []) |
| Before update | onBeforeUpdate | beforeUpdate | Before the DOM patch. Rare. You can read the DOM “as it was”. | closer to useLayoutEffect (not 1:1) |
| After update | onUpdated | updated | The DOM is already new. Be careful: do not trigger an infinite update. | an effect after render, with deps |
| Before unmount | onBeforeUnmount | beforeUnmount (Vue 3) / beforeDestroy (Vue 2) | Last chance while the instance is still alive. | — |
| Unmount | onUnmounted | unmounted / destroyed (Vue 2) | Remove listeners, timers, abort requests, dispose a map or chart. | cleanup in useEffect |
| KeepAlive: shown | onActivated | activated | The component was taken out of the cache (the tab is active again). | no direct equivalent |
| KeepAlive: hidden | onDeactivated | deactivated | It went into the cache, not an unmount. Pause subscriptions and timers. | no direct equivalent |
| Child error | onErrorCaptured | errorCaptured | Catch an error in the child tree (partly like an error boundary). | Error Boundary |
| SSR render | onServerPrefetch | serverPrefetch | Data on the server before HTML (Nuxt more often uses useAsyncData). | RSC / getServerSideProps / loaders |

### Short Composition API example

```
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const id = ref('1')
const data = ref(null)

// setup code: once, when the instance is created
watch(id, async (newId, _old, onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort()) // effect cleanup when id changes or on unmount
  data.value = await fetchItem(newId, ctrl.signal)
}, { immediate: true })

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() { /* ... */ }
</script>
```

### The same idea in the Options API (for reading legacy code)

```
<script>
export default {
  data() {
    return { id: '1', data: null }
  },
  watch: {
    id: {
      immediate: true,
      handler(newId) { this.load(newId) }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    async load(id) { this.data = await fetchItem(id) },
    onResize() {}
  }
}
</script>
```

### Where does fetch go: mounted or watch?

**Once, when the screen opens**, with no reactive dependency → `onMounted`.

**It depends on `props.id` / `route.params`** → `watch(..., { immediate: true })`, because the router often does **not remount** the component when a param changes. `onMounted` will not run again.

In React both cases are usually one `useEffect(..., [id])`.

### Order with nested components

Mount: parent `beforeMount` first, then the child mounts fully, then parent `mounted`. Simplified: children mount before the parent is considered mounted.

Unmount is the reverse: children unmount first, then the parent.

### What you almost always need

In an interview and in production, most of the time: `onMounted`, `onUnmounted`, `watch` / `watchEffect` with cleanup, sometimes `onActivated` / `onDeactivated` with KeepAlive. `beforeUpdate` / `updated` are rarer, and only when you really work with the DOM around the patch.

#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src" / "content" / "cards"

VUE = {
    "ref-vs-reactive": (
        "ref vs reactive",
        """- ref:
- primitive or object
- script: count.value
- template: {{ count }}
- replace the whole value: x.value = next
- reactive:
- object only (Proxy)
- state.x = 1 mutates a field
- destructuring breaks reactivity
- return from a composable:
- ref or toRefs()
- ≈ useState""",
    ),
    "value-unwrap": (
        ".value / unwrap",
        """- script: count.value++
- template: {{ count }}
- a top-level ref is unwrapped in the template
- a ref nested in reactive
- is usually read without .value in script
- when you access the field
- the wrapper is { value }""",
    ),
    "computed": (
        "computed",
        """- a pure derived value
- cached by its dependencies
- lazy: if nobody read it
- it did not run
- heavy work belongs in computed
- not in a method called from the template
- ≈ useMemo""",
    ),
    "watch": (
        "watch / watchEffect",
        """- watch(src, cb) takes an explicit source
- old/new, immediate, deep
- watchEffect collects dependencies itself
- and runs immediately
- cleanup: return () => {}
- a value for the UI belongs in computed
- ≈ useEffect""",
    ),
    "props": (
        "props ↓",
        """- defineProps<{...}>()
- withDefaults(..., { n: 0 })
- default for an array or object:
- () => [] is a factory
- props are read-only
- mutating props is a bad idea
- ≈ React props""",
    ),
    "emit": (
        "emit ↑",
        """- defineEmits<{ save: [id: number] }>()
- emit('save', id)
- parent: @save="onSave"
- the event name must match
- do not pass onSave down as a prop
- that is the idiomatic Vue style
- ≈ an onSave callback""",
    ),
    "v-model": (
        "v-model",
        """- on a component it is sugar for
- :modelValue +
- @update:modelValue
- v-model:title binds the title prop
- Vue 3.4+: defineModel()
- model.value = x
- value + onChange""",
    ),
    "reactivity-loss": (
        "losing reactivity",
        """- bad: const { n } = store
- good: storeToRefs(store)
- reactive → toRefs / toRef
- actions can be destructured
- watch a prop with a getter:
- () => props.id
- trap #1""",
    ),
    "watch-props": (
        "watch(() => props.id)",
        """- watch(props.id) captures a snapshot
- of the primitive at call time
- you need a live source:
- watch(() => props.id, cb)
- or toRef(props, 'id')
- setup runs once
- ≠ React deps""",
    ),
    "composable": (
        "composable useXxx",
        """- stateful logic on the Composition API
- call it synchronously in setup
- input: MaybeRefOrGetter
- read it with toValue(x)
- clean up on unmount
- replacement for mixins
- ≈ a custom hook""",
    ),
    "pinia": (
        "Pinia",
        """- defineStore('id', () => {
-   ref / computed / actions
-   return { ... }
- })
- read state through storeToRefs
- not for a UI modal
- ≈ Zustand""",
    ),
    "route-params": (
        "route.params",
        """- /users/1 → /users/2
- often WITHOUT a remount
- onMounted does not run again
- watch(() => route.params.id,
-   load, { immediate: true })
- or onBeforeRouteUpdate
- useEffect([id])""",
    ),
    "v-if-v-show-v-for": (
        "v-if / v-show / v-for",
        """- v-if mounts and unmounts
- v-show toggles CSS display
- frequent toggle → show; heavy subtree → if
- v-for: :key is an id, not the index
- do not combine v-if and v-for
- filter in a computed
- && / display / map""",
    ),
    "script-setup": (
        "script setup",
        """- top-level bindings are visible in the template
- no return {}
- macros: defineProps,
- defineEmits, defineModel,
- defineExpose
- the Vue 3 default
- ≈ a function component""",
    ),
    "provide-inject": (
        "provide / inject",
        """- a contract for one subtree
- not a global store
- InjectionKey for TypeScript
- theme / FormContext
- app-wide state → Pinia
- ≈ React Context
- Context vs store""",
    ),
    "fetch": (
        "where does fetch go?",
        """- depends on an id or the route →
- watch(..., { immediate })
- plus AbortController cleanup
- once, with no dependencies →
- onMounted
- Nuxt → useAsyncData
- useEffect([id])""",
    ),
    "abort-controller": (
        "AbortController",
        """- not a Vue API — it is the browser
- const c = new AbortController()
- fetch(..., { signal })
- in the watch cleanup:
- return () => c.abort()
- stops a race while searching
- effect cleanup""",
    ),
    "lifecycle": (
        "lifecycle, the ones that matter",
        """- setup runs once per instance
- onMounted — DOM and subscriptions
- onUnmounted — cleanup
- KeepAlive:
- onActivated / onDeactivated
- updated is rarely needed
- ≠ every render""",
    ),
    "shallow-ref": (
        "shallowRef",
        """- reactive only when
- you replace .value
- mutating a nested field does not update the UI
- large lists or JSON:
- list.value = nextList
- third-party objects (a map)
- React updates by reference""",
    ),
    "slots": (
        "slots",
        """- default: <slot />
- named: #header
- scoped: #item="{ row }"
- the child passes data
- the parent draws the UI
- more capable than children
- ≈ render props""",
    ),
}

JS = {
    "event-loop": (
        "Event Loop",
        """- Call stack runs synchronous code
- Web APIs run async work (timers, fetch)
- Microtasks: Promise.then,
- queueMicrotask, MutationObserver
- Macrotasks: setTimeout, I/O
- drain ALL microtasks, then one macrotask
- async ordering""",
    ),
    "promise-async": (
        "Promise / async",
        """- Promise: pending → fulfilled / rejected
- then / catch / finally
- an async function always returns a Promise
- await pauses inside an async function
- errors: try/catch around await
- Promise.all / allSettled / race
- microtasks""",
    ),
    "this-bind": (
        "this / bind",
        """- a plain function: this depends on the call
- obj.fn() sets this to obj
- an arrow function takes this from the enclosing scope
- call/apply invoke with a chosen this
- bind returns a new function with this fixed
- class methods are not arrows
- call-site context""",
    ),
    "closure": (
        "closure",
        """- a function remembers the scope where it was created
- even after that scope has returned
- privacy: a counter, a module
- trap: a loop plus var
- let/const each get their own binding
- the basis of hooks and composables
- lexical scope""",
    ),
    "prototypes": (
        "prototypes",
        """- [[Prototype]] / __proto__
- Object.create(proto)
- class is sugar over prototype
- property lookup walks up the chain
- hasOwn vs in
- Object.getPrototypeOf
- not class-only""",
    ),
    "solid": (
        "SOLID",
        """- S — one responsibility
- O — open for extension,
- closed for modification
- L — subtypes are substitutable
- I — narrow interfaces
- D — depend on abstractions
- design principles""",
    ),
    "singleton": (
        "Singleton",
        """- one instance for the whole app
- a global access point
- JS: a module export or Object.freeze
- or a lazy getInstance()
- plus: simple shared state
- minus: hidden dependencies, harder tests
- creational""",
    ),
    "factory-di": (
        "Factory / DI",
        """- Factory creates objects
- so the caller does not use new
- DI: dependencies arrive from outside
- not via new inside
- easier tests and replacement
- React Context / provide ≈ DI
- object creation""",
    ),
    "observer": (
        "Observer / PubSub",
        """- Subject notifies subscribers
- EventEmitter / addEventListener
- Vue reactivity and Redux share the idea
- PubSub: an event bus
- plus: loose coupling
- minus: leaks if you never off()
- subscription""",
    ),
    "http-rest": (
        "HTTP / REST",
        """- GET / POST / PUT / PATCH / DELETE
- idempotent: GET / PUT / DELETE
- statuses: 2xx ok, 4xx client,
- 5xx server
- REST: resources plus JSON
- headers: Auth, Content-Type
- client ↔ server""",
    ),
    "cors-cookies": (
        "CORS / cookies",
        """- the browser blocks cross-origin reads
- the server sends Access-Control-*
- preflight is OPTIONS
- credentials: cookies or Authorization
- SameSite / HttpOnly / Secure
- XSS: do not keep a token in JS
- security""",
    ),
    "browser-render": (
        "browser rendering",
        """- HTML → DOM, CSS → CSSOM
- Render tree → Layout → Paint
- Composite (layers / GPU)
- reflow costs more than repaint
- critical CSS, defer JS
- CLS / LCP / INP
- critical path""",
    ),
    "storage": (
        "Storage / cache",
        """- localStorage — string, synchronous
- sessionStorage — one tab
- a cookie is sent to the server
- IndexedDB — large and async
- Cache API / Service Worker
- memory: Map / WeakMap
- where to store data""",
    ),
    "typescript": (
        "TypeScript essentials",
        """- type vs interface
- union / intersection
- generics: <T>
- unknown is safer than any
- narrowing: typeof / in
- utilities: Partial, Pick, Omit
- types in an interview""",
    ),
    "a11y": (
        "a11y / semantics",
        """- a button is <button>, not a div
- label is tied to input
- aria-* only when the native element is not enough
- focus and keyboard
- alt on images
- contrast, not color alone
- accessibility""",
    ),
    "display": (
        "display",
        """- inline: in the line, no width/height
- inline has no vertical margin
- block: new line, width 100%
- inline-block: a block that sits in a line
- width, height, and every margin work as on a block
- absolute/fixed compute display as block
- the box""",
    ),
    "position": (
        "position",
        """- static: in flow, inset does nothing
- relative: stays in flow and becomes an anchor; inset shifts it
- absolute: out of flow, anchored to a non-static ancestor
- fixed: out of flow, usually anchored to the viewport
- sticky: stays in flow until top/left/right/bottom
- without an inset, sticky behaves like relative
- containing block""",
    ),
    "nesting-traps": (
        "nesting traps",
        """- absolute children do not give the parent height
- transform/filter break fixed positioning
- an ancestor with overflow breaks sticky
- sticky without top/left is relative
- a percentage height needs an explicit parent height
- inline plus relative: the anchor is the line box
- nesting""",
    ),
    "stacking-context": (
        "stacking context",
        """- an isolated painting layer
- the root is html
- created by position plus z-index other than auto
- also by opacity < 1, transform, filter
- isolation / will-change / fixed
- children cannot paint outside the parent's layer
- layers""",
    ),
    "z-index": (
        "z-index",
        """- compared inside one stacking context
- the elements do not have to be DOM siblings
- a grandchild with 9999 loses to 2 if its parent is a context
- ignored without position, except on flex/grid items
- a flex/grid item with z-index creates a context
- equal z-index: the later DOM node wins
- layer order""",
    ),
    "bfc": (
        "BFC",
        """- Block Formatting Context
- overflow auto/hidden, flex, grid
- display: flow-root
- a float does not escape the parent
- margin does not collapse with the parent
- a neighboring BFC lays out on its own
- formatting""",
    ),
}


def write(technology: str, slug: str, order: int, title: str, body: str) -> None:
    path = ROOT / "en" / technology / f"{slug}.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "\n".join(
            [
                "---",
                f"order: {order}",
                f"title: {json.dumps(title, ensure_ascii=False)}",
                f"technology: {technology}",
                "---",
                "",
                body.strip(),
                "",
            ]
        ),
        encoding="utf-8",
    )


def main() -> None:
    for order, slug in enumerate(VUE, start=1):
        title, body = VUE[slug]
        write("vue", slug, order, title, body)
    for order, slug in enumerate(JS, start=1):
        title, body = JS[slug]
        write("javascript", slug, order, title, body)


if __name__ == "__main__":
    main()

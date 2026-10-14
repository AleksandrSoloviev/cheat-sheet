---
order: 2
title: "2. Composition API / script setup"
technology: vue
---

### Q13. Options API vs Composition API — что выбрать и почему?

**Короткий ответ на собесесе:**  
Composition API (+ `<script setup>`) — стандарт Vue 3 для новой логики: лучше переиспользование через composables, TS, группировка кода **по фиче**, а не по типам опций. Options API жив в легаси и простых компонентах; уметь **читать** обязательно, писать новое — чаще Composition.

---

#### Подробно

**Options API** — классика Vue 2: `data`, `methods`, `computed`, `watch`, `mounted` и т.д. Логика одной фичи (например «поиск + debounce + fetch») размазана по разным секциям.

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

**Composition API** — функция `setup()` / `<script setup>`: объявляешь `ref`/`reactive`, `computed`, `watch`, lifecycle рядом. Одну фичу можно вынести в `useSearch()`.

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSearch } from '@/composables/useSearch'

const { query, results, hasResults } = useSearch()
</script>
```

| | Options | Composition |
|---|--------|-------------|
| Организация | по типу опции | по фиче / composable |
| Переиспользование | mixins (хрупко: коллизии имён) | composables (явный API) |
| TypeScript | слабее / шумнее | лучше (особенно `script setup`) |
| `this` | везде `this.` | нет `this` в setup |
| Когда ок | простые формы, легаси | почти всё новое в Vue 3 |

**Миксины vs composables:** mixin тихо мержит поля в компонент → конфликты имён, неочевидный источник данных. Composable возвращает явный объект — как custom hook.

**Правило для собеса:** в новом коде — Composition; Options читать и поддерживать; «оба валидны» — да, но экосистема Vue 3 (Pinia, VueUse, Nuxt) заточена под Composition.

---

#### React — для якоря в голове

| | Vue | React |
|---|-----|--------|
| Старый стиль | Options API (`data`/`methods`) | Class components |
| Новый стиль | Composition API / `<script setup>` | Function components + hooks |
| Переиспользование | composables `useXxx()` | custom hooks `useXxx()` |
| Антипаттерн | mixins | HOCs / сложные mixins-аналоги |

Переход Options → Composition ≈ переход class → hooks: та же мотивация (логика по фиче + переиспользование без наследования).

---

#### Фраза «на автомате» (1–2 предложения)

> Composition API — стандарт Vue 3: логика по фиче и composables вместо mixins; Options API уметь читать для легаси. Аналог перехода с class-компонентов на hooks в React.

---

### Q14. Что даёт `<script setup>`?

**Короткий ответ на собесесе:**  
Сахар над `setup()`: всё top-level автоматически доступно в template; макросы `defineProps` / `defineEmits` / `defineExpose` / `defineModel` / `defineOptions`; нет `return {}`; меньше бойлерплейта; лучше tree-shaking. Компилируется в обычный `setup()`.

---

#### Подробно

Без `<script setup>`:

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    const inc = () => count.value++
    return { count, inc } // обязательно!
  }
}
</script>
```

С `<script setup>`:

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
const inc = () => count.value++
// return не нужен — всё top-level видно в template
</script>

<template>
  <button @click="inc">{{ count }}</button>
</template>
```

**Макросы компилятора** (не runtime-импорты; `vue/macros` / глобально в IDE):

| Макрос | Зачем |
|--------|--------|
| `defineProps` | объявить props |
| `defineEmits` | объявить события |
| `defineModel` | v-model prop+emit (Vue 3.4+) |
| `defineExpose` | публичный API для parent ref |
| `defineOptions` | `name`, `inheritAttrs` и др. без второго `<script>` |
| `defineSlots` | типизация слотов (TS) |

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false, name: 'UserCard' })

const props = defineProps<{ id: number }>()
const emit = defineEmits<{ close: [] }>()
</script>
```

**Два `<script>`:** иногда нужен обычный `<script>` рядом с `<script setup>` (например, именованный export, редкие кейсы). `defineOptions` часто закрывает потребность в `name`/`inheritAttrs`.

**Импорты:** компоненты, импортированные в `<script setup>`, автоматически зарегистрированы в template — не пишешь `components: { Foo }`.

**Tree-shaking:** неиспользуемые bindings проще выкинуть; Options API тянет объект опций целиком.

---

#### React — для якоря в голове

`<script setup>` ≈ function-компонент: всё в замыкании сразу доступно в JSX/template. Макросы — «магия компилятора» (ближе к Svelte), в React такого нет: props — аргумент функции, ref API — `useImperativeHandle` руками.

---

#### Фраза «на автомате» (1–2 предложения)

> `<script setup>` — сахар: top-level bindings сразу в template, без `return`, плюс макросы `defineProps`/`defineEmits`/`defineExpose`/`defineModel`. По ощущению — как обычный function-компонент в React.

---

### Q15. Что такое `defineExpose`?

**Короткий ответ на собесесе:**  
По умолчанию из `<script setup>` наружу через template ref **ничего не торчит**. `defineExpose({ focus, validate })` — явный публичный API для родителя: `childRef.value.validate()`. Нужен редко: фокус, валидация формы, imperative API.

---

#### Подробно

```vue
<!-- Child.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const input = ref<HTMLInputElement | null>(null)
const value = ref('')

const focus = () => input.value?.focus()
const validate = () => value.value.trim().length > 0

defineExpose({ focus, validate })
// value / input снаружи недоступны, пока не expose
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

**Зачем дефолт «закрыто»:** инкапсуляция — родитель не цепляется к внутренней реализации. Expose только то, что реально контракт.

**Без `<script setup>`:** в Options/`setup()` return уже экспортирует в instance; `expose()` из setup ограничивает то же самое.

**Антипаттерн:** пробрасывать наружу половину state «на всякий случай» — ломает границы компонента. Предпочитай props/emits/v-model; expose — для императивных действий.

---

#### React — для якоря в голове

Прямой аналог: `forwardRef` + `useImperativeHandle(ref, () => ({ focus, validate }))`. В React тоже «по умолчанию ref на function-компонент пустой», пока не пробросишь handle.

---

#### Фраза «на автомате» (1–2 предложения)

> В `<script setup>` instance закрыт; `defineExpose` открывает явный API родителю через ref — как `useImperativeHandle` в React. Использую для focus/validate, не для обычного data flow.

---

### Q16. Можно ли async setup? + Suspense

**Короткий ответ на собесесе:**  
Да: top-level `await` в `<script setup>` делает компонент async → родитель (или выше) должен обернуть в `<Suspense>` с `#fallback`. Без Suspense — ошибка/предупреждение. В Nuxt часто прячут за `useAsyncData` / `useFetch`.

---

#### Подробно

```vue
<!-- AsyncUser.vue -->
<script setup lang="ts">
import { fetchUser } from '@/api'

// top-level await → компонент async
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

**Что происходит:** Vue ждёт промис setup, покажет fallback, потом смонтирует дерево с данными. Ошибки — через `onErrorCaptured` / error boundary паттерн / `#default` + обработка.

**Альтернативы без async setup:**

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

Так ты сам рисуешь loading/error — без Suspense. Часто проще и предсказуемее в SPA.

**Nuxt:** `const { data } = await useAsyncData('user', () => $fetch('/api/user'))` — SSR + hydration, не «голый» async setup.

**defineAsyncComponent** — ленивая подгрузка **кода** компонента (chunk). Async setup — ожидание **данных** внутри setup. Можно комбинировать.

---

#### React — для якоря в голове

Идея как у React Suspense: «компонент может приостановить рендер, пока промис не готов». В React data-Suspense чаще через библиотеки / RSC / loaders; во Vue 3 built-in для async setup/async component из коробки проще увидеть в docs.

---

#### Фраза «на автомате» (1–2 предложения)

> Top-level await в setup делает компонент async — нужен `<Suspense>` с fallback. Часто проще `onMounted` + локальный loading или Nuxt `useAsyncData`, чем тащить Suspense по всему дереву.

---

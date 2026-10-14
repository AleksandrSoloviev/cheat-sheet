---
order: 3
title: "3. Компоненты, props, emits, v-model"
technology: vue
---

### Q17. Как объявить props и emits в `<script setup>` + TS? `withDefaults`

**Короткий ответ на собесесе:**  
`defineProps<T>()` и `defineEmits<T>()` — макросы. Defaults — `withDefaults(defineProps<...>(), { ... })`. Emiteшь через `emit('event', payload)`. Типы событий — tuple-синтаксис: `save: [id: number]`.

---

#### Подробно

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
    tags: () => [], // фабрика для объектов/массивов!
  }
)

props.title // string
props.count // number (уже не optional после default)
```

**Важно:** default для объекта/массива — **функция-фабрика** `() => []`, иначе шарится одна ссылка между инстансами (как в Options `default: () => ({})`).

**Runtime-декларация** (если нужна валидация в runtime без полного TS):

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
  close: [] // без payload
}>()

emit('save', 42)
emit('update:modelValue', 'hi')
emit('close')
```

Старый call-сигнатурный стиль тоже встречается:

```ts
const emit = defineEmits<{
  (e: 'save', id: number): void
  (e: 'close'): void
}>()
```

**Деструктуризация props:** классика — ломает реактивность; `toRefs(props)` / `toRef(props, 'id')`. Vue 3.5+ reactive props destructure (компилятор) может сохранить реактивность — на собесесе упомяни обе картинки.

**Props — readonly:** мутировать `props.x = ...` нельзя (warning). Менять — через emit / v-model.

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| `defineProps<{ title: string }>()` | `type Props = { title: string }` + аргумент |
| `defineEmits` + `emit('save', id)` | `onSave?: (id: number) => void` + вызов |
| `withDefaults` | default params / `defaultProps` (редко) |
| Фабрика для array/object defaults | обычно просто `tags = []` в деструктуризации |

В React колбэки — обычные props; во Vue события — отдельный канал (`emit`), хотя в template слушаешь как `@save`.

---

#### Фраза «на автомате» (1–2 предложения)

> В script setup: `defineProps`/`defineEmits` с дженериками, defaults через `withDefaults`, для массивов/объектов — фабрика `() => []`. Наружу данные не мутирую — только `emit`.

---

### Q18. One-way data flow во Vue?

**Короткий ответ на собесесе:**  
Props **вниз**, события **вверх**. Дочерний **не мутирует** props (в dev — warning). Нужно изменить — `emit`, родитель обновляет источник правды. Для двусторонней связи — сахар `v-model`, но внутри всё равно prop + emit.

---

#### Подробно

```
Parent state ──props──► Child (читать)
Parent state ◄──emit── Child (просить изменить)
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
  <!-- плохо: props.count++ -->
</template>
```

**Почему нельзя мутировать props:** источник правды размазывается; родитель не знает, что значение изменилось; сложно дебажить; в async/reuse — сюрпризы.

**Исключения / серые зоны:**

- Мутация **вложенного** поля объекта-prop technically «пройдёт» в Proxy, но это антипаттерн (side effect на объект родителя). Лучше emit или локальная копия.
- `v-model` — не нарушение one-way, а соглашение: prop `modelValue` + `update:modelValue`.

**Глубже по дереву:** provide/inject, Pinia — другие каналы, но принцип «явный поток данных» тот же.

---

#### React — для якоря в голове

То же самое: props down, callbacks up. `props.count++` в React тоже плохо (и часто просто не сработает с примитивами). Controlled input = value + onChange — тот же one-way + просьба обновить.

---

#### Фраза «на автомате» (1–2 предложения)

> One-way: props вниз, emit вверх; дочка props не мутирует. `v-model` — только сахар над prop + `update:*`, не исключение из правила.

---

### Q19. Как работает `v-model` на компоненте? (`modelValue`, несколько v-model)

**Короткий ответ на собесесе:**  
`v-model` на компоненте ≈ `:modelValue` + `@update:modelValue`. Несколько моделей: `v-model:title="title"` → prop `title` + emit `update:title`. Vue 3.4+ часто пишут через `defineModel()`.

---

#### Подробно

**Один v-model (дефолтное имя):**

```vue
<Child v-model="text" />
<!-- компилируется примерно в: -->
<Child
  :modelValue="text"
  @update:modelValue="text = $event"
/>
```

```vue
<!-- Child без defineModel -->
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

**Несколько v-model:**

```vue
<UserForm
  v-model:firstName="first"
  v-model:lastName="last"
/>
```

Дочка:

```ts
defineProps<{ firstName: string; lastName: string }>()
defineEmits<{
  'update:firstName': [value: string]
  'update:lastName': [value: string]
}>()
```

**Модификаторы:** `v-model.trim`, `.number`, `.lazy` на нативных input; на своих компонентах — prop `modelModifiers` / через `defineModel({ local: true })` и опции (знать, что механизм есть).

**Vue 2 отличие (часто спрашивают):** Vue 2 default был `value` + `input`; Vue 3 — `modelValue` + `update:modelValue`. Кастом: `model: { prop: 'x', event: 'change' }` ушёл в пользу именованных v-model.

---

#### React — для якоря в голове

В React каждый раз руками: `<Input value={text} onChange={e => setText(e.target.value)} />`. Vue `v-model` — синтаксический сахар над той же controlled-парой. Несколько v-model ≈ несколько пар value/onChange с разными именами.

---

#### Фраза «на автомате» (1–2 предложения)

> `v-model` на компоненте — это `modelValue` + `update:modelValue`; `v-model:title` — prop `title` + `update:title`. По сути controlled value/onChange, только короче.

---

### Q20. `defineModel` — что это?

**Короткий ответ на собесесе:**  
Макрос Vue 3.4+: одной строкой объявляет prop + emit для v-model. Читаешь/пишешь `model.value` — компилятор сам шлёт `update:*`. Меньше бойлерплейта для controlled-компонентов.

---

#### Подробно

```vue
<script setup lang="ts">
// дефолтный v-model
const model = defineModel<string>({ required: true })

// именованный
const title = defineModel<string>('title', { default: '' })

// usage
model.value = 'hi' // ≈ emit('update:modelValue', 'hi')
</script>

<template>
  <input v-model="model" />
  <input v-model="title" />
</template>
```

**Опции:** `required`, `default`, `type` (runtime), `local` (локальная копия + sync — удобно для «полуcontrolled»).

**Эквивалент без defineModel:**

```ts
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
```

`defineModel` ≈ этот computed get/set + декларации.

**Когда ещё Options/ручной emit:** старые кодбейзы < 3.4; нужна нестандартная логика перед emit (валидация, нормализация) — можно писать в setter/`watch` вокруг model.

---

#### React — для якоря в голове

Аналога макроса нет. Ближе всего кастомный хук:

```ts
function useModel(value: string, onChange: (v: string) => void) {
  return [value, onChange] as const
}
```

или controlled input с `value`/`onChange`. `defineModel` экономит именно Vue-бойлерплейт prop+emit.

---

#### Фраза «на автомате» (1–2 предложения)

> `defineModel` (3.4+) — сахар: ref-like API, под капотом prop + `update:*`. Пишу `model.value = x` вместо ручного `emit('update:modelValue', x)`.

---

### Q21. Controlled vs uncontrolled во Vue?

**Короткий ответ на собесесе:**  
**Controlled:** родитель держит state + `v-model` / `:modelValue` + `@update:...` — дочка полностью управляема снаружи. **Uncontrolled:** внутренний `ref`, наружу результат через emit по submit или `defineExpose`. Часто гибрид: локальный draft + `watch` props для sync.

---

#### Подробно

**Controlled:**

```vue
<!-- Parent -->
<TextField v-model="name" />

<!-- Child: значение только из props, изменения только через emit -->
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>
<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

Родитель всегда знает актуальное значение → легко валидировать форму целиком, reset, синхронизировать URL.

**Uncontrolled / локальный:**

```vue
<script setup lang="ts">
const draft = ref('')
const emit = defineEmits<{ submit: [value: string] }>()

const handleSubmit = () => emit('submit', draft.value)
</script>
```

Родитель не слушает каждый keystroke — только финальный результат. Меньше ререндеров родителя, проще изоляция.

**Гибрид (частый паттерн «edit dialog»):**

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

Открыл модалку → локальный draft → Save пушит наверх. Не controlled на каждый ввод.

**Нативные input во Vue:** `v-model` на `<input>` внутри SFC — локально «controlled фреймворком»; вопрос controlled/uncontrolled обычно про **границу parent↔child component**.

---

#### React — для якоря в голове

| | Vue | React |
|---|-----|--------|
| Controlled | `v-model` / modelValue+update | `value` + `onChange` |
| Uncontrolled | внутренний `ref`, emit на submit | `defaultValue` + `ref` / внутренний state |
| Гибрид | draft + watch props | `useState(props.x)` + sync (осторожно с stale) |

---

#### Фраза «на автомате» (1–2 предложения)

> Controlled — state у родителя и v-model; uncontrolled — локальный ref и emit наружу по действию. Для форм-модалок часто draft + sync из props, а не каждый keystroke наверх.

---

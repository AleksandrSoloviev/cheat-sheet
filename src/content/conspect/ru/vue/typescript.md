---
order: 10
title: "10. TypeScript"
technology: vue
---

### Q48. Как типизировать props/emits?

**Короткий ответ на собесесе:**  
В `<script setup lang="ts">`: `defineProps<{...}>()` и `defineEmits<{ event: [payload] }>()`. Defaults — через `withDefaults`. Runtime `PropType` — для объектного синтаксиса/легаси.

---

#### Подробно

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

Typed emits ловят опечатки имён событий на compile time.  
Для публичных библиотек иногда дублируют runtime props object — лучше DX в JS без TS.

---

#### React — для якоря в голове

`type Props = {...}` + props аргумента; колбэки `onSave?: (id: number) => void` вместо emit-карты.

---

#### Фраза «на автомате» (1–2 предложения)

> TS: defineProps<>/defineEmits<> + withDefaults; payload событий — tuple в карте emits.

---

### Q49. `InjectionKey`?

**Короткий ответ на собесесе:**  
`InjectionKey<T>` — типизированный Symbol для provide/inject, чтобы `inject` вернул `T | undefined` без магических строк и коллизий.

---

#### Подробно

```ts
import type { InjectionKey, Ref } from 'vue'

export const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')

// provider
provide(themeKey, theme)

// consumer
const theme = inject(themeKey)
if (!theme) throw new Error('theme not provided')
```

Строковый ключ `'theme'` работает, но хуже для TS и рисков коллизий между либами.

---

#### React — для якоря в голове

`const ThemeContext = createContext<Theme | null>(null)` + проверка на null — та же идея.

---

#### Фраза «на автомате» (1–2 предложения)

> InjectionKey = Symbol + тип для provide/inject; как createContext с дженериком.

---

### Q50. Generic-компоненты Vue 3.3+?

**Короткий ответ на собесесе:**  
В SFC: `<script setup lang="ts" generic="T extends ...">` — компонент-дженерик, как `function List<T>()`. Нужен для таблиц/селектов с разными типами item.

---

#### Подробно

```vue
<script setup lang="ts" generic="T extends { id: string }">
defineProps<{
  items: T[]
  selected?: T
}>()
defineEmits<{ select: [item: T] }>()
</script>
```

Ограничения: сложные inferred типы иногда капризничают — упрощай constraints. Для очень сложной генерики иногда оставляют props как `unknown` + внешние generic helpers.

---

#### React — для якоря в голове

`function List<T extends {id: string}>(props: { items: T[] })` — привычный React-паттерн.

---

#### Фраза «на автомате» (1–2 предложения)

> Vue 3.3+: generic на script setup — типизированные списки/таблицы как generic-функции в React.

---

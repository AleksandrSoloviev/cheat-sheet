---
order: 4
title: "4. Template: директивы, слоты, attrs"
technology: vue
---

### Q22. `v-if` vs `v-show`?

**Короткий ответ на собесесе:**  
`v-if` — условный **mount/unmount** (дороже переключение, дешевле когда скрыт — нет в DOM). `v-show` — только CSS `display`, узел всегда в DOM. Частое переключение → `v-show`; редкое / тяжёлое дерево / нужен полный teardown → `v-if`.

---

#### Подробно

```vue
<div v-if="open">тяжёлый таб / чарт</div>
<div v-show="open">тултип, который мигает часто</div>
```

| | `v-if` | `v-show` |
|---|--------|----------|
| DOM | нет узла, если false | узел всегда есть |
| Стоимость toggle | высокая (create/destroy) | низкая (CSS) |
| Стоимость «скрыт» | низкая | платишь за mount + возможную работу внутри |
| Директивы/lazy | можно `v-if` + async child | child уже смонтирован |
| `<template v-if>` | да (без лишнего wrapper в DOM) | нет смысла на template так же |

**`v-else` / `v-else-if`:** только сразу после `v-if`/`v-else-if` на соседнем узле.

**С lifecycle:** при `v-if="false"` срабатывает unmount → cleanup watchers, таймеров, KeepAlive отдельно. При `v-show` — `onMounted` уже был, хуки unmount не зовутся при hide.

**Доступность:** `v-show` оставляет в DOM — скринридеры могут всё ещё видеть, если не доп. `aria-hidden` / наоборот. `v-if` убирает из a11y-дерева полностью.

---

#### React — для якоря в голове

`{cond && <X />}` или ternary ≈ `v-if`.  
`style={{ display: cond ? 'block' : 'none' }}` ≈ `v-show`.  
В React нет отдельной директивы — тот же tradeoff mount vs CSS hide.

---

#### Фраза «на автомате» (1–2 предложения)

> `v-if` монтирует/уничтожает, `v-show` только прячет через CSS. Частое мигание — `v-show`, редкое и тяжёлое — `v-if`.

---

### Q23. `v-for` и `key`; pitfall `v-if` + `v-for`

**Короткий ответ на собесесе:**  
Всегда стабильный уникальный `:key` (id сущности, не index, если список переставляется/фильтруется). `key` на компоненте форсирует remount при смене. **`v-if` + `v-for` на одном элементе — плохо:** в Vue 3 у `v-if` выше приоритет → путаница. Фильтруй через `computed`.

---

#### Подробно

```vue
<li v-for="user in users" :key="user.id">
  {{ user.name }}
</li>
```

**Зачем key:** Vue сопоставляет старые и новые vnode при patch. Стабильный key → переиспользует DOM/компонент правильно (input не «переезжает» на другую строку). Index как key ок только для **статических** списков без reorder/insert/delete.

**key на компоненте:**

```vue
<UserForm :key="userId" :user-id="userId" />
```

Сменился `userId` → полный remount формы (сброс локального state) — полезный трюк.

**Pitfall v-if + v-for (Vue 3):**

```vue
<!-- плохо: v-if имеет приоритет выше v-for → `item` может быть недоступен -->
<li v-for="item in list" v-if="item.active" :key="item.id">
```

Правильно:

```vue
<li v-for="item in activeList" :key="item.id">
```

```ts
const activeList = computed(() => list.value.filter((i) => i.active))
```

Или `<template v-for>` + внутренний `v-if`:

```vue
<template v-for="item in list" :key="item.id">
  <li v-if="item.active">{{ item.name }}</li>
</template>
```

**Итерация:** массивы, объекты (`v-for="(val, key) in obj"`), ranges (`v-for="n in 5"`).

---

#### React — для якоря в голове

Та же семантика reconciliation: `key` в `.map()`. Index-as-key — тот же антипаттерн. Фильтр списка до map ≈ computed до v-for. В React нет директивного конфликта v-if/v-for — просто не пишешь бессмысленный код в одном выражении.

---

#### Фраза «на автомате» (1–2 предложения)

> Стабильный `key` по id, не index при мутациях списка. `v-if` и `v-for` на одном узле не мешаю — фильтрую в `computed`, потому что в Vue 3 у `v-if` приоритет выше.

---

### Q24. Модификаторы событий?

**Короткий ответ на собесесе:**  
`@click.stop` `.prevent` `.self` `.once` `.capture` `.passive`; для клавиш `@keyup.enter` / `.esc`. Цепочки: `@submit.prevent`. В React то же руками в хендлере: `e.preventDefault()`, `e.stopPropagation()`.

---

#### Подробно

| Модификатор | Эффект |
|-------------|--------|
| `.stop` | `stopPropagation` |
| `.prevent` | `preventDefault` |
| `.self` | только если `event.target === currentTarget` |
| `.once` | снять слушатель после первого срабатывания |
| `.capture` | фаза capture |
| `.passive` | passive listener (scroll perf) |

**Клавиши:**

```vue
<input @keyup.enter="submit" @keyup.esc="cancel" />
<!-- системы: .ctrl .alt .shift .meta -->
<button @click.ctrl.exact="onCtrlClick">Save</button>
```

`.exact` — без «лишних» модификаторов клавиш.

**Мышь:** `.left` `.right` `.middle`.

**На компонентах:** `@click` слушает **нативный** click, если emit’ится как attr fallthrough; для собственных событий модификаторы `.stop` и т.д. работают на слушателе компонента по правилам Vue (нативные модификаторы — для DOM-событий).

Пример формы:

```vue
<form @submit.prevent="handleSave">
  <input @keydown.enter.prevent="handleSave" />
</form>
```

---

#### React — для якоря в голове

```tsx
onClick={(e) => {
  e.stopPropagation()
  e.preventDefault()
}}
```

Клавиши: `onKeyDown={(e) => e.key === 'Enter' && ...}`. Vue выносит это в декларативные модификаторы в template.

---

#### Фраза «на автомате» (1–2 предложения)

> Модификаторы — сахар над `preventDefault`/`stopPropagation`/once/capture: `@click.stop.prevent`, `@keyup.enter`. В React пишу то же в теле хендлера.

---

### Q25. Слоты: default, named, scoped?

**Короткий ответ на собесесе:**  
**Default** — `<slot />` / содержимое без имени. **Named** — `<slot name="header" />` + `#header` у родителя. **Scoped** — слот с пропсами `:item="row"`, родитель деструктурирует `#item="{ item }"`. Scoped slot ≈ render props в React.

---

#### Подробно

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

Сокращения: `v-slot:header` → `#header`; default `#default="{ ... }"`.

**Зачем scoped:** ребёнок владеет данными/циклом, родитель владеет **представлением** ячейки (таблица, меню, design system).

**Условный слот:**

```vue
<div v-if="$slots.footer" class="footer">
  <slot name="footer" />
</div>
```

В script setup: `useSlots()`, `defineSlots<{ default: ... }>()` для TS.

**Fallback:** контент внутри `<slot>...</slot>` — если родитель ничего не передал.

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| default slot | `children` |
| named slot | `header={...}` / `<HeaderSlot />` prop |
| scoped slot | render prop `renderItem={(item) => ...}` или `children(item)` |

```tsx
<List renderItem={(item) => <strong>{item.name}</strong>} />
```

---

#### Фраза «на автомате» (1–2 предложения)

> Default/named — куда вставить разметку родителя; scoped — ребёнок отдаёт данные в слот, родитель рисует UI. Это render props по-вьюшному.

---

### Q26. `$attrs` / `inheritAttrs`?

**Короткий ответ на собесесе:**  
Атрибуты и слушатели, **не** объявленные как props/emits, попадают в `$attrs` и по умолчанию на **корневой** элемент. `inheritAttrs: false` + `v-bind="$attrs"` — пробросить на внутренний узел (обёртка над `<input>`). В Vue 3 listeners — часть attrs (нет отдельного `$listeners` как в Vue 2).

---

#### Подробно

```vue
<!-- Parent -->
<BaseInput class="w-full" placeholder="Name" @focus="onFocus" />
```

```vue
<!-- BaseInput.vue -->
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ modelValue: string }>()
// class, placeholder, onFocus → attrs, не props
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

Без `inheritAttrs: false` `class`/`@focus` сели бы на обёртку `<div>`, а не на `<input>` — баг для a11y и стилей.

**В script:** `useAttrs()` (не реактивен глубоко во всех версиях — не деструктурируй слепо для трекинга; для class/style часто ок читать в template).

**class / style:** Vue мержит с корневыми class/style умно при fallthrough.

**Vue 2 → 3:** `$listeners` влит в `$attrs`; `v-on="$listeners"` больше не нужен — `v-bind="$attrs"` тащит и слушатели.

**Многокорневой template (fragment):** fallthrough attrs **не** применяются автоматически — нужно явное `v-bind="$attrs"` (иначе warning в dev).

---

#### React — для якоря в голове

Явный rest-spread:

```tsx
function BaseInput({ value, onChange, ...rest }: Props) {
  return (
    <div className="field">
      <input value={value} onChange={onChange} {...rest} />
    </div>
  )
}
```

Во Vue fallthrough автоматический на single root; выключаешь через `inheritAttrs: false`, когда корень — не тот DOM-узел.

---

#### Фраза «на автомате» (1–2 предложения)

> Необъявленные attrs/listeners летят в `$attrs` и на root; для wrapper-input ставлю `inheritAttrs: false` и `v-bind="$attrs"` на внутренний `<input>`. В Vue 3 `$listeners` уже внутри attrs.

---

### Q27. `<Teleport>`, `<KeepAlive>`, `<Suspense>`?

**Короткий ответ на собесесе:**  
**Teleport** — рендер в другой DOM-узел (модалки в `body`), ≈ React Portal. **KeepAlive** — кэш экземпляров динамических детей (`include`/`exclude`/`max`), хуки `onActivated`/`onDeactivated`. **Suspense** — fallback, пока async setup / async component грузится.

---

#### Подробно

**Teleport:**

```vue
<Teleport to="body">
  <div class="modal" v-if="open">…</div>
</Teleport>
```

Логическое дерево Vue остаётся на месте (provide/inject, props работают), физический DOM — в `body`. `disabled` prop — оставить in-place (например на SSR/мобилке). Несколько телепортов в один target — ок.

**KeepAlive:**

```vue
<KeepAlive :include="['TabA', 'TabB']" :max="10">
  <component :is="current" />
</KeepAlive>
```

Сохраняет state инпута при переключении табов. Нужны **имена** компонентов для include/exclude.  
Хуки: `onActivated` / `onDeactivated` (вместо повторного mount/unmount).  
Не кэширует DOM «наугад» — кэширует **экземпляр vnode/component**.

**Suspense:**

```vue
<Suspense>
  <RouterView />
  <template #fallback>
    <Spinner />
  </template>
</Suspense>
```

Работает с async setup и `defineAsyncComponent`. Вложенные Suspense — независимые границы загрузки. Error handling — отдельно (`onErrorCaptured` / error component).

**Комбо:** RouterView + KeepAlive + Transition — частый паттерн в layouts.

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| Teleport | `createPortal(..., document.body)` |
| KeepAlive | нет 1-в-1; react-router outlets + ручной кэш / libraries |
| Suspense | React.Suspense (data/code) — похожая идея |

---

#### Фраза «на автомате» (1–2 предложения)

> Teleport — портал в другой DOM; KeepAlive — кэш инстансов с activated/deactivated; Suspense — fallback для async setup/компонента. KeepAlive из коробки сильнее, чем в React.

---

### Q28. Динамический компонент `:is`?

**Короткий ответ на собесесе:**  
`<component :is="current" />` рендерит компонент или HTML-тег по имени/объекту. Часто с `KeepAlive` и табами. `current` — строка (зарегистрированное имя / тег) или сам импортированный компонент.

---

#### Подробно

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

**`:is` принимает:**

- объект компонента (предпочтительно с `<script setup>` + import);
- строку глобально зарегистрированного имени;
- нативный тег: `:is="'section'"`.

**Router:** `<RouterView>` внутри — по сути динамический outlet; можно обернуть KeepAlive.

**Осторожно:**

- без `key` Vue может переиспользовать инстанс «слишком агрессивно» между разными компонентами одного типа слота — иногда ставят `:key`;
- props должны быть совместимы или пробрасывать общее подмножество;
- async: `defineAsyncComponent` + Suspense.

**vs v-if цепочки:**

```vue
<TabA v-if="tab === 'a'" />
<TabB v-else />
```

`:is` удобнее при registry/map из N вкладок:

```ts
const tabs = { a: TabA, b: TabB, c: TabC } as const
```

---

#### React — для якоря в голове

```tsx
const map = { a: TabA, b: TabB }
const Comp = map[tab]
return <Comp />
```

Или `{tab === 'a' ? <TabA /> : <TabB />}`. Идея та же — переменная как тип компонента.

---

#### Фраза «на автомате» (1–2 предложения)

> `<component :is="comp" />` — динамический рендер по ссылке на компонент или тегу; с KeepAlive — классика табов. В React — переменная `const Comp = map[tab]; return <Comp />`.

---

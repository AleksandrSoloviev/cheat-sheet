---
day: glossary-terms
title: "Термины"
questions: []
---

РеактивностьКомпонентыCompositionAsync / DOMStateRouterBuilt-insNuxt
  
    

  
## Реактивность

  

  
### `ref`

  

Обёртка над значением: `{ value: T }`. В script читаешь/пишешь через `.value`, в template top-level ref разворачивается сам. Аналог `useState`, но мутируешь `.value`, а не вызываешь setter.

  
### `reactive`

  

Proxy вокруг **объекта**. Поля меняешь напрямую: `form.name = 'x'`. Примитив туда не кладут. Деструктуризация ломает реактивность → `toRefs`.

  
### `computed`

  

Кэшированное производное значение. Пересчитывается только если изменились зависимости. Аналог `useMemo`. Для UI-значения — computed, не метод в template.

  
### `watch`

  

Side effect на явный источник: `watch(source, cb)`. Есть old/new, `immediate`, cleanup через `return () => ...`. Близко к `useEffect(cb, [deps])`.

  
### `watchEffect`

  

Эффект с авто-трекингом зависимостей внутри колбэка, стартует сразу. Как `useEffect` без массива deps, но зависимости Vue собирает сам.

  
### `toRef`

  

Достаёт одно поле объекта/`props` как отдельный ref, не теряя связь. `toRef(props, 'id')` или `toRef(() => props.id)`.

  
### `toRefs`

  

Превращает все поля `reactive`-объекта в набор ref’ов. Нужен, чтобы безопасно деструктурировать и не потерять реактивность.

  
### `storeToRefs`

  

Как `toRefs`, но для Pinia store: state/getters останутся реактивными после деструктуризации. Actions деструктурить можно и без него.

  
### `shallowRef`

  

Реактивность только на замену `.value`, не на глубокие мутации внутри. Для больших массивов/JSON: `list.value = next`. По ощущению ближе к React state-по-ссылке.

  
### `shallowReactive`

  

Proxy только на первый уровень полей объекта. Вложенные объекты не глубоко реактивны.

  
### `readonly`

  

Реактивный объект только для чтения (в dev мутация предупредит). Удобно отдавать state наружу без права писать.

  
### `nextTick`

  

Ждёт, пока Vue применит batched DOM-обновления. `await nextTick()` перед `focus()` / измерением DOM. Близко к «после commit» в React (`useEffect` / иногда `flushSync`).

  
### `toValue`

  

Достаёт «голое» значение из `ref`, геттера или обычного значения. В composable: принял вход → `toValue(input)`. Vue 3.3+.

  
### `MaybeRefOrGetter<T>`

  

Тип входа composable: обычное `T`, или `Ref<T>`, или `() => T`. Снаружи удобно передать и строку, и computed. Внутри читай через `toValue`.

  
## Компоненты

  

  
### `props / defineProps`

  

Входные данные компонента (вниз от родителя). В `<script setup>` объявляют макросом `defineProps<{...}>()`. Не мутировать. ≈ props в React.

  
### `emit / defineEmits`

  

Событие наверх вместо колбэк-пропа. Ребёнок: `emit('save', id)`, родитель: `@save="onSave"`. ≈ `onSave` в React, но отдельный канал.

  
### `withDefaults`

  

Дефолты для props вместе с type-based `defineProps`. Для массивов/объектов — фабрика: `tags: () => []`.

  
### `defineModel`

  

Сахар Vue 3.4+ для v-model на компоненте: сам объявляет prop + emit. Пишешь `model.value = x`.

  
### `defineExpose`

  

Явно открывает методы наружу через template ref родителя. ≈ `useImperativeHandle`.

  
### `v-model`

  

Сахар двусторонней связи. На инпуте — value+input. На компоненте: `modelValue` + `update:modelValue`. ≈ controlled `value` + `onChange`.

  
### `v-if / v-show`

  

`v-if` — mount/unmount. `v-show` — только CSS `display`. Частое мигание → show; редкое/тяжёлое → if.

  
### `v-for + key`

  

Цикл списка. Всегда стабильный `:key` (id). Не мешай с `v-if` на одном узле — фильтруй в computed.

  
## Composition

  

  
### `provide / inject`

  

Прокинуть значение вниз по дереву без props drilling. ≈ React Context. Для TS — `InjectionKey`.

  
### `onMounted / onUnmounted`

  

Хуки жизненного цикла. DOM готов → mounted; cleanup → unmounted. ≈ mount/cleanup в `useEffect`.

  
### `onActivated / onDeactivated`

  

Хуки для компонента внутри `KeepAlive`: снова показали / спрятали в кэш, без полного destroy.

  
## Async / DOM

  

  
### `AbortController`

  

Стандарт браузера (не Vue): отмена fetch. В `watch` создаёшь controller, в cleanup зовёшь `abort()` — чтобы при смене id не применить устаревший ответ. То же в React `useEffect` cleanup.

  
## State

  

  
### `defineStore (Pinia)`

  

Объявление Pinia store. Setup-store ≈ composable: refs + computed + actions. Официальный стор Vue 3, ближе к Zustand, чем к Redux.

  
### `Pinia vs Vuex`

  

Pinia — современный стор (нет mutations, хороший TS). Vuex — легаси. Не клади туда эфемерный UI (открыта ли модалка).

  
## Router

  

  
### `createRouter / createWebHistory`

  

Создание роутера Vue Router 4. History mode ≈ BrowserRouter. Дальше `app.use(router)`.

  
### `useRoute / useRouter`

  

`useRoute()` — текущий route (params, query). `useRouter()` — навигация (`push`). ≈ `useParams` / `useNavigate`.

  
### `RouterView / RouterLink`

  

Куда рендерится matched-компонент / ссылка без перезагрузки. ≈ `Outlet` / `Link`.

  
## Built-ins

  

  
### `Teleport`

  

Рендер куска UI в другой DOM-узел (модалка в `body`). ≈ React Portal.

  
### `KeepAlive`

  

Кэш инстансов динамических детей (табы/роуты), state сохраняется. В React нет 1-в-1 из коробки.

  
### `Suspense`

  

Fallback, пока грузится async setup / async component. Идея как у React Suspense.

  
## Nuxt

  

  
### `useFetch / useAsyncData`

  

Nuxt: data-fetching с SSR и ключом кэша. `useFetch` = сахар над `useAsyncData` + `$fetch`. ≈ Next fetch / React Query по роли.

  
### `definePageMeta`

  

Мета страницы Nuxt: middleware, layout, и т.д. `definePageMeta({ middleware: 'auth' })`.

---
order: 1
title: "1. Реактивность"
technology: vue
---

### Q1. Что такое реактивность во Vue 3?

**Короткий ответ на собесесе:**  
Реактивность — это механизм Vue, который **сам** следит: «кто читал это поле» и «когда поле изменилось — кого уведомить». Тебе не нужно вручную говорить «перерисуй» или перечислять deps, как в `useEffect`.

---

#### Что такое «реактивная система» простыми словами

Обычный JS-объект «глухой»:

```js
let count = 0
count = 1 // никто не узнает, UI сам не обновится
```

**Реактивная система Vue** — слой вокруг данных (`ref` / `reactive`), который:

1. **При чтении** (`count.value` / `state.name`) запоминает: *«сейчас этот computed / watch / render зависит от этого поля»* → это **track** (подписка).
2. **При записи** (`count.value++`) находит всех подписчиков этого поля и запускает их → это **trigger** (уведомление).

Технически во Vue 3 данные оборачиваются в **`Proxy`**: перехватываются get/set.  
`ref` / `reactive` — это твой вход в эту систему. Без них Vue «не видит» изменения.

```
чтение поля  →  track(кто читал)
запись поля  →  trigger(уведомить подписчиков)
                    ↓
         computed / watch / обновление DOM
```

**Мини-пример:**

```ts
const count = ref(0)

// render / template читает count → Vue регистрирует зависимость
// {{ count }} в template

count.value++ // trigger → Vue знает: этот кусок UI зависит от count → обновить только его
```

Итог: меняешь данные → **автоматически** пересчитывается то, что от них зависело. Не весь мир, а подписчики конкретного поля.

---

#### React — для якоря в голове

| | Vue | React |
|---|-----|--------|
| Кто знает зависимости? | Фреймворк (track при чтении) | Ты (`useEffect(..., [deps])`, memo) |
| Что происходит при `setState` / изменении? | Trigger → только подписчики поля | Re-render **функции компонента** (и вниз по дереву, если нет memo) |
| Мутация `obj.x = 1` | У `reactive` — ок, Vue увидит | Обычно **не** увидит — нужен новый объект / `setState` |
| «Реактивная система» | Встроенная (Proxy + scheduler) | Нет аналога; есть reconciliation после render |

Формула React: **UI = f(state)** → вызвал `setState` → заново выполнил компонент.  
Формула Vue: **данные сами зовут своих подписчиков** → обновились только зависимые computed/watch/куски DOM.

---

#### Фраза «на автомате» (1–2 предложения)

> Реактивная система Vue — это Proxy вокруг state: при чтении поля регистрируется зависимость, при записи уведомляются подписчики (рендер, computed, watch). Поэтому UI обновляется сам, без ручного списка deps, как в React.

---

### Q2. `ref` vs `reactive` — когда что?

**Короткий ответ на собесесе:**  
`ref` — универсальная обёртка для любого значения (примитив или объект), доступ через `.value`. `reactive` — Proxy вокруг **объекта**; примитив туда не положишь. На практике: счётчики/флаги/«заменить целиком» → `ref`; локальная форма из связанных полей → `reactive`, а наружу из composable чаще отдаёшь `ref` или `toRefs`.

---

#### Подробно

Оба API подключают данные к одной реактивной системе (Proxy + track/trigger). Разница — в **форме хранения** и в том, как ты **переназначаешь** значение.

**`ref(T)`**

```ts
const count = ref(0)           // примитив
const user = ref<User | null>(null) // объект целиком

count.value++                  // мутация через .value
user.value = await fetchUser() // замена целиком — ок, Vue увидит
```

- Работает с примитивами и объектами.
- Сам `ref` — стабильная ссылка на обёртку `{ value }`; меняется содержимое `.value`.
- Если внутрь `ref` положить объект, Vue обычно делает его глубоко реактивным (если не `shallowRef`).

**`reactive(object)`**

```ts
const form = reactive({
  name: '',
  email: '',
  remember: false,
})

form.name = 'Ann' // ок — Proxy ловит set
```

- Только объекты / массивы / коллекции (`Map`, `Set`).
- **Нельзя** сделать `form = { ... }` и сохранить реактивность переменной: ты подменил локальную ссылку на обычный объект. Нужно мутировать поля или `Object.assign(form, next)`.

**Деструктуризация — главная ловушка `reactive`:**

```ts
const state = reactive({ count: 0 })

const { count } = state // count = 0 (число), связи с Proxy больше нет
count++                 // UI не обновится

// правильно:
const { count } = toRefs(state) // count — Ref<number>
count.value++
```

У `ref` деструктуризация обёртки реже нужна; если деструктуришь `.value` объекта — та же история с потерей связи.

**Return из composable:**

```ts
// Предсказуемый публичный API — refs
export const useCounter = (initial = 0) => {
  const count = ref(initial)
  const inc = () => { count.value++ }
  return { count, inc } // count остаётся реактивным у потребителя
}

// Если внутри удобен reactive — наружу toRefs
export const useForm = () => {
  const form = reactive({ name: '', email: '' })
  const reset = () => { form.name = ''; form.email = '' }
  return { ...toRefs(form), reset }
}
```

```
                    ┌─────────────┐
  примитив /        │     ref     │  .value = ...  → trigger
  «заменить целиком»└─────────────┘
                    ┌─────────────┐
  связанный объект  │  reactive   │  obj.field = … → trigger
  (форма, локальный └─────────────┘
   state)
         │ return наружу
         ▼
      toRefs / отдельные ref
```

**Правило для собеса:** в публичном API composable чаще `ref`; для локальной формы часто `reactive` + `toRefs` при return. Не смешивай без причины — команде проще читать один стиль.

---

#### React — для якоря в голове

| | Vue | React |
|---|-----|--------|
| Примитив | `ref(0)` | `useState(0)` |
| Объект | `ref(obj)` или `reactive(obj)` | `useState(obj)` + обычно **immutable** update |
| Замена целиком | `x.value = next` | `setX(next)` |
| Мутация поля | у `reactive` — ок | обычно `setX(prev => ({ ...prev, field }))` |
| Деструктур state | у `reactive` ломает реактивность | `const { n } = state` в render — ок (новый render даст новое) |
| Custom hook return | отдавай `ref` / `toRefs` | отдавай значения + setters |

В React один `useState` покрывает и примитив, и объект; «глубина» реактивности не существует — есть только новая ссылка state → re-render. Во Vue ты выбираешь **форму** (`ref` vs `reactive`) и должен помнить про Proxy.

---

#### Фраза «на автомате» (1–2 предложения)

> `ref` — обёртка с `.value` для чего угодно и для замены целиком; `reactive` — Proxy объекта, удобен для форм, но деструктуризация ломает реактивность, поэтому из composable наружу чаще `ref` или `toRefs`.

---

### Q3. Зачем `.value` у `ref`?

**Короткий ответ на собесесе:**  
`ref` — это объект-обёртка `{ value: T }`, а не само значение. В script без `.value` ты работаешь со ссылкой на обёртку, а не с данными. В template Vue автоматически unwrap’ит top-level refs, поэтому там `.value` не пишешь.

---

#### Подробно

В JS нельзя сделать «реактивный примитив» сам по себе: число/строка передаются по значению, перехватить `count = 1` у локальной переменной нельзя. Поэтому Vue кладёт примитив **внутрь объекта**:

```ts
// упрощённо
const count = ref(0)
// ≈ { value: 0 }, где get/set value делают track/trigger
```

**В `<script>` — всегда `.value`:**

```ts
const count = ref(0)

console.log(count)        // RefImpl, не число
console.log(count.value)  // 0

count.value++             // правильно → trigger
// count++                // бессмысленно / ошибка типов
```

**В template — unwrap top-level:**

```vue
<script setup>
const count = ref(0)
const state = reactive({ n: 1 })
</script>

<template>
  <!-- unwrap: это count.value -->
  <p>{{ count }}</p>
  <button @click="count++">+</button>

  <!-- reactive и так без .value -->
  <p>{{ state.n }}</p>
</template>
```

Unwrap работает для refs, которые лежат **на верхнем уровне** setup (и в части других контекстов). Вложенный ref внутри обычного объекта / `reactive` в template может вести себя иначе — часто нужно явно `.value` в script или нормализовать структуру.

**`ref` внутри `reactive`:**

```ts
const count = ref(0)
const state = reactive({ count })

// Vue автоматически unwrap'ит ref, вложенный в reactive:
state.count++           // это уже числовое поле с авто-unwrap
// state.count.value++  // обычно не нужно / неверно после unwrap
```

Идея: `.value` — цена за то, что **одна и та же ссылка на обёртку** может жить в замыканиях, composables, Pinia, а меняется только внутренность. Без обёртки нельзя было бы трекать примитивы.

```
script:   count.value  ──чтение/запись──►  track / trigger
template: {{ count }}  ──компилятор──►     count.value (unwrap)
```

---

#### React — для якоря в голове

| | Vue `ref` | React `useState` |
|---|-----------|------------------|
| Хранение | `{ value: T }` | значение `T` в fiber + setter |
| Чтение в логике | `count.value` | `count` |
| Запись | `count.value = 1` | `setCount(1)` |
| В UI | template unwrap / JSX `count` после destructure | `{count}` |
| Стабильность ссылки | обёртка `count` стабильна | `setCount` стабилен; `count` меняется каждый render |

В React «голое» значение + обязательный сеттер. Во Vue — одна сущность `ref`, а `.value` — явный get/set, который система может перехватить.

---

#### Фраза «на автомате» (1–2 предложения)

> `.value` нужен, потому что `ref` — объект-обёртка: так Vue может трекать примитивы. В script пишем `.value`, в template top-level refs разворачиваются сами.

---

### Q4. Что такое потеря реактивности? Как чинить?

**Короткий ответ на собесесе:**  
Потеря реактивности — когда из `reactive`, props или Pinia store достаёшь поле обычной деструктуризацией и получаешь «сырое» значение без Proxy/связи. Чинится через `toRefs` / `toRef` / `storeToRefs`; для props знать классику и оговорку Vue 3.5+ про reactive props destructure.

---

#### Подробно

Реактивность живёт в **доступе через Proxy/ref**, а не в «магическом числе». Как только ты скопировал примитив в обычную переменную — Vue больше не видит чтение/запись этой переменной.

```ts
const state = reactive({ count: 0, name: 'Ann' })

// ❌ снимок примитива
const { count } = state
count++ // state.count не изменится, UI не обновится

// ✅ каждое поле — отдельный ref, связанный со state
const { count, name } = toRefs(state)
count.value++

// ✅ одно поле
const name = toRef(state, 'name')
name.value = 'Bob'
```

**Pinia:**

```ts
const store = useCounterStore()

// ❌ state/getters потеряют реактивность
const { count } = store

// ✅
const { count } = storeToRefs(store)
// actions можно деструктурить напрямую — это функции, не state
const { increment } = store
```

`storeToRefs` специально **не** кладёт actions в результат — только state и getters.

**Props — классика и Vue 3.5:**

```ts
// Классика (всегда безопасный ответ на собесесе):
const props = defineProps<{ id: string }>()
watch(() => props.id, load)
// или
const id = toRef(props, 'id')
watch(id, load)

// Vue 3.5+ reactive props destructure:
// компилятор может превратить деструктуризацию в реактивные локальные bindings
const { id } = defineProps<{ id: string }>()
// id остаётся связанным с props — НО это зависит от версии/флагов;
// на собесесе: «знаю фичу 3.5, в проде проверяю версию; классика — toRef/getter»
```

**Типичные места потери:**

1. Деструктур `reactive` / store.
2. `const id = props.id` + потом `watch(id)` без геттера (см. Q10).
3. Return из composable «голых» полей вместо refs.
4. Передача в стороннюю либу, которая клонирует объект.

```
reactive/store ──деструктур──► примитив/сырой объект ──► Vue «слепнет»
       │
       ├── toRefs / toRef / storeToRefs
       └── getter () => props.x
```

---

#### React — для якоря в голове

| Ситуация | Vue | React |
|----------|-----|--------|
| `const { id } = props` | До 3.5 / без компиляторной магии — риск; классика `toRef` | Норма: следующий render принесёт новый `id` |
| `const { count } = store` | Ломает реактивность Pinia state | Зависит от стора; в Zustand селектор часто `useStore(s => s.count)` |
| Модель обновления | Подписка на поле | Re-render функции компонента |

В React деструктуризация props безопасна, потому что «реактивность» = повторный вызов функции. Во Vue реактивность = подписка на конкретный доступ; отрыв от Proxy/ref её рвёт.

---

#### Фраза «на автомате» (1–2 предложения)

> Потеря реактивности — деструктуризация `reactive`/store/props в «голое» значение. Лечится `toRefs`/`toRef`/`storeToRefs`; для props надёжный паттерн — getter или `toRef`, а Vue 3.5 destructure — приятный сахар, который надо осознавать по версии.

---

### Q5. `computed` vs `watch` vs `watchEffect`?

**Короткий ответ на собесесе:**  
`computed` — чистое производное значение с кэшем. `watch` — явные источники + side effect, ленивый, есть old/new. `watchEffect` — эффект с авто-трекингом зависимостей, бежит сразу. Для UI-значения — computed; для запросов/localStorage — watch/watchEffect.

---

#### Подробно

| | `computed` | `watch` | `watchEffect` |
|---|------------|---------|---------------|
| Назначение | производное **значение** | **эффект** по источникам | **эффект** с авто-deps |
| Возврат | `ComputedRef` (есть `.value`) | stop-handle | stop-handle |
| Кэш | да, пока deps не менялись | нет | нет |
| Запуск | лениво при первом чтении | по умолчанию **не** сразу (`immediate: true` — сразу) | **сразу** при создании |
| old / new | нет (только текущий результат) | да | нет |
| Deps | авто из геттера | явный source (ref, getter, массив) | авто из тела cb |
| Типичный кейс | `fullName`, фильтр списка | fetch по `id`, синхрон в storage | простые эффекты «прочитал — сделал» |

```ts
// computed — чистое значение
const fullName = computed(() => `${first.value} ${last.value}`)

// watch — явный источник, side effect
watch(
  () => props.id,
  async (id, prevId, onCleanup) => {
    const data = await api.getUser(id)
    user.value = data
  },
  { immediate: true }, // как useEffect при mount + при смене
)

// deep — когда нужна вложенность у объекта
watch(
  form,
  () => { saveDraft(form) },
  { deep: true },
)

// watchEffect — deps сами из чтения внутри
watchEffect(() => {
  document.title = title.value // прочитали title → подписались
})
```

**Когда что:**

- Нужно **показать** производное в UI / передать дальше → `computed`.
- Нужен **запрос / подписка / запись наружу**, важен old value или точный список источников → `watch`.
- Короткий эффект, deps очевидны из тела, не нужен old → `watchEffect`.
- `immediate: true` — «сделай и при первом значении» (часто fetch по id).
- `deep: true` — следить за вложенными мутациями объекта/массива (дороже; иногда лучше смотреть конкретное поле или заменить структуру).

Не пихай side effects в `computed` — это антипаттерн (нечистота, порядок вызовов, отладка).

---

#### React — для якоря в голове

| Vue | React (близкий якорь) |
|-----|------------------------|
| `computed` | `useMemo` (кэш значения) |
| `watch(source, cb)` | `useEffect(cb, [deps])` + явные deps |
| `watchEffect(cb)` | `useEffect` без deps / с автотрекингом «в голове» — но React deps вручную |
| `immediate: true` | эффект и так бежит после mount |
| `deep: true` | обычно сравниваешь новые объекты сам / JSON / deep lib |

Формула: **computed = значение**, **watch\* = эффект**. В React оба часто живут в `useEffect`/`useMemo`, и граница «значение vs эффект» дисциплина разработчика.

---

#### Фраза «на автомате» (1–2 предложения)

> `computed` — кэшированное производное; `watch` — эффект по явным источникам с old/new и опцией `immediate`/`deep`; `watchEffect` — эффект с авто-трекингом, который стартует сразу. Для UI — computed, для side effects — watch.

---

### Q6. Как сделать cleanup в `watch`?

**Короткий ответ на собесесе:**  
Из колбэка `watch`/`watchEffect` верни функцию cleanup — Vue вызовет её перед следующим запуском эффекта и при остановке вотчера. Типичный кейс — `AbortController` для fetch. Это не замена `onUnmounted` для всего компонента, а cleanup **конкретно этого эффекта**.

---

#### Подробно

Сигнатура колбэка `watch` позволяет вернуть teardown (также можно через третий аргумент `onCleanup` в некоторых формах):

```ts
watch(id, (newId) => {
  const ctrl = new AbortController()

  fetch(`/api/users/${newId}`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(data => { user.value = data })
    .catch(err => {
      if (err.name === 'AbortError') return
      // обработка ошибки
    })

  // вызовется: перед следующим watch-запуском и при stop/unmount вотчера
  return () => ctrl.abort()
})
```

Эквивалент с `onCleanup`:

```ts
watch(id, (newId, _prev, onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort())
  // fetch ...
})
```

**Что cleanup делает:**

1. Отменяет устаревший запрос при быстрой смене `id` (race).
2. Снимает слушатели, таймеры, WebSocket, созданные **этим** запуском эффекта.

**vs `onUnmounted`:**

| | cleanup из `watch` | `onUnmounted` |
|---|-------------------|---------------|
| Когда | перед re-run эффекта + при stop watch | только при размонтировании компонента |
| Scope | один эффект / одна подписка | весь компонент |
| Типично | abort fetch по `id` | снять global keydown, закрыть канал |

Часто нужны **оба**: watch-cleanup для гонок при смене deps, `onUnmounted` для ресурсов, живущих всю жизнь компонента. `watch` сам останавливается при unmount компонента, где был создан — его последний cleanup тоже отработает.

```
id: 1 → fetch#1
id: 2 → cleanup(abort #1) → fetch#2
unmount → cleanup(abort #2)
```

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| `return () => cleanup()` из `watch` | `useEffect(() => { ...; return () => cleanup() }, [id])` |
| abort на смене `id` | abort в cleanup эффекта |
| `onUnmounted` | cleanup того же `useEffect` без deps / отдельный effect |

Модель почти 1-в-1 с React: эффект перезапускается → сначала teardown предыдущего.

---

#### Фраза «на автомате» (1–2 предложения)

> В `watch` возвращаю cleanup-функцию — Vue вызовет её перед следующим тиком эффекта и при остановке; для fetch кладу `AbortController`. Это cleanup эффекта, а не полная замена `onUnmounted`.

---

### Q7. `shallowRef` / `shallowReactive` — зачем?

**Короткий ответ на собесесе:**  
Это «мелкая» реактивность: `shallowRef` трекает только замену `.value`, `shallowReactive` — только первый уровень полей. Вложенность не в Proxy. Нужны для больших данных, иммутабельных обновлений и внешних либ, которым глубокий Proxy мешает или дорог.

---

#### Подробно

**`shallowRef`**

```ts
const list = shallowRef<Item[]>(hugeArray)

// ❌ мутация внутри НЕ триггерит UI
list.value.push(newItem)

// ✅ триггер — новая ссылка на .value
list.value = [...list.value, newItem]
// или
list.value = list.value.concat(newItem)
triggerRef(list) // редко: форс, если мутировал inplace осознанно
```

**`shallowReactive`**

```ts
const state = shallowReactive({
  items: hugeArray, // сам массив НЕ глубоко реактивен
  page: 1,
})

state.page = 2           // ✅ trigger
state.items.push(x)      // ❌ UI может не обновиться
state.items = [...state.items, x] // ✅ замена поля верхнего уровня
```

**Когда использовать:**

1. Огромный JSON / таблица на тысячи строк — глубокий Proxy дорог по памяти и init.
2. Данные приходят уже иммутабельно (нормализованный стор, Immer) — обновляешь **заменой корня**.
3. Внешние либы (карта, CodeMirror, Graph) держат свой объект — Proxy ломает `instanceof`, приватные поля, сравнения по identity.
4. Интеграция с immutable-паттерном «как в React».

```
shallowRef:   trigger только на  .value = newRefValue
shallowReactive: trigger только на  obj.rootKey = ...
                 вложенность — «сырая»
```

---

#### React — для якоря в голове

| | Vue shallow* | React |
|---|--------------|--------|
| Модель | opt-in shallow | state **всегда** по ссылке корня |
| Update | новая ссылка `.value` / поля | `setState(newRef)` |
| Deep mutate | не триггерит (как и в React) | не триггерит |
| Deep reactive | `ref`/`reactive` по умолчанию | нет из коробки |

React-разработчику `shallowRef` часто «ощущается как useState»: триггер только при новой ссылке. Глубокий `reactive` — это то, чего в React нет.

---

#### Фраза «на автомате» (1–2 предложения)

> `shallowRef`/`shallowReactive` дают реактивность только на корне: для больших структур и внешних либ обновляю новой ссылкой, без глубокого Proxy. Вложенные мутации сами UI не разбудят.

---

### Q8. Что делает `nextTick`?

**Короткий ответ на собесесе:**  
Vue батчит обновления DOM асинхронно. `await nextTick()` ждёт, пока DOM применит текущие реактивные изменения. Нужен, когда сразу после мутации state читаешь или трогаешь DOM (`focus`, `scrollHeight`).

---

#### Подробно

При изменении реактивных данных Vue не патчит DOM синхронно на каждый set — ставит обновление компонента в очередь планировщика и сбрасывает её микротаской. Несколько изменений подряд → один flush.

```ts
count.value++
count.value++
count.value++
// один batched re-render, не три
```

**`nextTick`** — Promise/API «выполнить после следующего DOM-update flush»:

```ts
const box = ref<HTMLElement | null>(null)
const open = ref(false)

const handleOpen = async () => {
  open.value = true
  // DOM ещё может не содержать раскрытый блок
  await nextTick()
  // теперь v-if отрисовал элемент
  box.value?.focus()
  console.log(box.value?.scrollHeight)
}
```

Ещё кейсы: измерить размер после изменения текста/списка; проскроллить к новому элементу; интеграция с сторонним виджетом, которому нужен уже смонтированный узел.

```
state change → scheduler queue → DOM patch → nextTick callbacks
                     ↑
              batched updates
```

Без `nextTick` ты часто читаешь **старый** DOM. С ним — актуальный после patch. Не путать с `setTimeout(0)`: `nextTick` привязан к очереди Vue, не к «просто позже».

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| batched updates (по умолчанию) | batched updates (React 18+) |
| `await nextTick()` | `useEffect` после commit; `flushSync` если нужен sync DOM; иногда `requestAnimationFrame` |
| focus после показа | `useEffect` + ref, или callback ref |

В React «подождать DOM» обычно = effect после paint/commit. Во Vue явный `nextTick` в том же async-потоке после изменения state — привычный паттерн.

---

#### Фраза «на автомате» (1–2 предложения)

> `nextTick` ждёт, пока Vue сбросит batched DOM-обновления; после `open.value = true` делаю `await nextTick()` и только потом `focus`/`scrollHeight`.

---

### Q9. Как Vue 3 реализует реактивность? (Proxy)

**Короткий ответ на собесесе:**  
`reactive()` оборачивает объект в `Proxy`: на `get` — `track` (кто читал), на `set`/`deleteProperty` — `trigger` (уведомить подписчиков). `ref` — обёртка с реактивным `.value`; объекты внутри тоже уходят в реактивность. Vue 2 делал это через `Object.defineProperty` — отсюда старые ограничения.

---

#### Подробно

Упрощённая схема:

```ts
// идея, не исходники 1-в-1
function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      track(obj, key)          // активный effect подписался
      const value = Reflect.get(obj, key, receiver)
      // вложенные объекты тоже проксируются (deep)
      return isObject(value) ? reactive(value) : value
    },
    set(obj, key, value, receiver) {
      const result = Reflect.set(obj, key, value, receiver)
      trigger(obj, key)        // перезапуск computed/watch/render
      return result
    },
    deleteProperty(obj, key) {
      const result = Reflect.deleteProperty(obj, key)
      trigger(obj, key)
      return result
    },
  })
}
```

```
effect (render/computed/watch)
    │ читает obj.x
    ▼
  Proxy get → track(effect, obj.x)
    │
    │ позже obj.x = 2
    ▼
  Proxy set → trigger → rerun effect
```

**Коллекции:** `Map` / `Set` / `WeakMap` / `WeakSet` поддерживаются отдельными instrumentations (методы `get`/`set`/`add`/`delete`/`has`/`size` трекаются). Обычный `{}` / `[]` — через стандартные traps Proxy.

**`ref`:** для примитивов — реактивное поле `.value`; для объектов `.value` часто хранит уже `reactive`-прокси.

**Vue 2 vs Vue 3 (кратко):**

| | Vue 2 `defineProperty` | Vue 3 `Proxy` |
|---|------------------------|---------------|
| Добавление нового ключа | нужно `Vue.set` | видно сразу |
| Удаление ключа | `Vue.delete` | видно |
| Массивы / индекс | костыли/ограничения | покрыто Proxy |
| Map/Set | плохо / нет | да |
| IE11 | да | нет (Proxy) |

На собесесе достаточно: «Proxy на get/set → track/trigger; deep по умолчанию; Map/Set ок; Vue 2 упирался в defineProperty».

---

#### React — для якоря в голове

| | Vue | React |
|---|-----|--------|
| Наблюдение за данными | Proxy на state пользователя | Нет; сравнивает props/state по ссылке после setState |
| Кто собирает deps | runtime track при чтении | ты (deps) / compiler (React Compiler) |
| Движок UI | реактивность + VDOM patch | Fiber reconciliation |

React не оборачивает твой объект в Proxy. Vue — да; поэтому мутации видны «сами».

---

#### Фраза «на автомате» (1–2 предложения)

> Vue 3 — Proxy: get делает track, set/delete — trigger; так работают `reactive`/`ref`, плюс поддержка Map/Set. В Vue 2 был `defineProperty` с дырами на новых ключах — отсюда `Vue.set`.

---

### Q10. Почему `watch(() => props.id, ...)` а не `watch(props.id)`?

**Короткий ответ на собесесе:**  
`props.id` в момент вызова — уже примитивный снимок. `watch` получает число/строку и не знает, откуда его потом читать снова. Нужен геттер, `ref` или `toRef`, чтобы каждый раз читать актуальное значение и трекать зависимость.

---

#### Подробно

```ts
const props = defineProps<{ id: string }>()

// ❌ снимок: watch(props.id) ≈ watch('42') — источник не реактивный
watch(props.id, (id) => {
  load(id) // при смене props.id колбэк часто НЕ вызовется
})

// ✅ геттер: при каждом track заново читает props.id
watch(() => props.id, (id) => {
  load(id)
})

// ✅ toRef — ref, связанный с props.id
watch(toRef(props, 'id'), (id) => {
  load(id)
})

// ✅ если уже есть ref
watch(idRef, load)
```

**Почему так:** `watch` для источника-примитива не может подписаться на «переменную»; подписка возможна на **реактивный объект/ref** или на **функцию-геттер**, внутри которой при запуске эффекта заново идут чтения → track.

```
watch(props.id)     →  source = "42" (мертвый снимок)
watch(() => props.id) →  каждый раз props.id → track → при смене trigger
```

То же для `route.params.id`, полей store, любых примитивов, вытащенных в локальную константу.

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| `watch(() => props.id, cb)` | `useEffect(cb, [props.id])` |
| `watch(props.id)` — баг-снимок | в deps всё равно кладёшь выражение, которое читают заново каждый render |
| `toRef(props, 'id')` | отдельного аналога нет — deps массива |

В React функция компонента вызывается снова, и deps сравниваются заново. Во Vue `setup` один раз — поэтому источник для `watch` должен оставаться «живым» (getter/ref).

---

#### Фраза «на автомате» (1–2 предложения)

> `watch(props.id)` передаёт снимок примитива; чтобы следить за изменениями, нужен `watch(() => props.id)` или `toRef(props, 'id')`.

---

### Q11. `readonly` / `shallowReadonly`?

**Короткий ответ на собесесе:**  
`readonly` — Proxy поверх объекта/ref, который запрещает мутации (в dev — warning). Отдаёшь состояние наружу «только читать». `shallowReadonly` — защита только верхнего уровня; вложенность может остаться мутабельной.

---

#### Подробно

```ts
const state = reactive({ user: { name: 'Ann' }, count: 0 })

const ro = readonly(state)
ro.count++           // нет эффекта (+ warning в dev)
ro.user.name = 'Bob' // тоже блокируется у глубокого readonly

const sho = shallowReadonly(state)
sho.count++          // блок
sho.user.name = 'Bob'// ⚠️ вложенный объект может быть всё ещё writable
```

**API-поверхность:**

- `readonly(raw | reactive | ref)` → глубокий readonly-прокси (для ref — readonly `.value`).
- `shallowReadonly(obj)` → только корень.
- `isReadonly(x)` — проверка.
- Часто пара: внутри модуля `reactive`, наружу `readonly` как публичный API composable/store snapshot.

Аналогия: как `Object.freeze`, но:

- freeze — shallow и «жёсткий» (throw в strict), не глубокий по умолчанию;
- `readonly` — заточен под Vue (сохраняет реактивные чтения, трекинг работает, запись глушится), deep/shallow варианты явные.

```ts
export const useUser = () => {
  const user = reactive({ name: '', role: 'guest' })
  const setName = (name: string) => { user.name = name }
  return {
    user: readonly(user), // снаружи читать можно, писать — через API
    setName,
  }
}
```

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| `readonly(state)` | конвенция «не мутируй»; иногда `Object.freeze` в dev |
| Языковая/рантайм защита | почти нет (TypeScript `Readonly<T>` — только типы) |
| Публичный API стора | readonly + actions | селекторы + иммутабельные updates |

React полагается на дисциплину и иммутабельные обновления. Vue может **рантаймом** закрыть запись через readonly-прокси.

---

#### Фраза «на автомате» (1–2 предложения)

> `readonly` — реактивный Proxy только для чтения (deep), `shallowReadonly` — только корень; удобно отдавать state наружу без права мутировать, в духе мягкого freeze с сохранением трекинга.

---

### Q12. Мутабельность: это плюс или минус?

**Короткий ответ на собесесе:**  
Плюс — DX и точечные обновления без копирования деревьев. Минус — легче случайно мутировать shared-объект и словить баг. Нужна дисциплина: контракт владения данными, в Pinia писать в actions, большие внешние структуры — `shallowRef` + replace.

---

#### Подробно

**Плюсы мутабельной модели Vue:**

- `form.email = x` — коротко и локально; Proxy сам триггерит подписчиков поля.
- Меньше boilerplate, чем `{ ...state, email: x }` на каждом шаге.
- Точечные обновления хорошо стыкуются с track/trigger (не обязательно клонировать весь граф).

**Минусы:**

- Shared `reactive`-объект, уехавший в два модуля → скрытые side effects.
- Мутация «мимо» API стора → трудно искать, кто изменил.
- Случайная мутация вложенности у `shallowRef` → UI «молчит».
- Сложнее time-travel/иммутабельные ожидания, если команда из React без правил.

**Дисциплина на проекте:**

```ts
// Pinia: мутации state — в actions, не из компонентов напрямую (конвенция команды)
 const store = useCartStore()
// store.items.push(x)           // возможно технически, но плохой тон
store.addItem(x)                  // явный контракт

// Большие данные / внешний мир
const table = shallowRef(rows)
table.value = nextRows            // replace, не deep mutate

// Не шарить один reactive без контракта
// provide(readonly(state)) + методы изменения — лучше, чем «держите объект, пишите кто хотите»
```

Итог для собеса: мутабельность — **инструмент**, не религия. Vue даёт удобство; безопасность — соглашениями команды (как иммутабельность в React — тоже соглашение + линтеры).

---

#### React — для якоря в голове

| | Vue | React |
|---|-----|--------|
| Стиль обновления | мутации в Proxy / `.value` | иммутабельные updates |
| Защита от багов shared mutate | дисциплина + readonly + actions | иммутабельность снижает класс багов |
| Цена | риск скрытой мутации | verbosity, лишние копии, нужда в Immer |
| Большие данные | `shallowRef` + replace | та же идея новой ссылки |

Честный senior-тон: «В React иммутабельность страховала от shared mutate; во Vue страховка — границы стора/composables и readonly. Оба подхода рабочие».

---

#### Фраза «на автомате» (1–2 предложения)

> Мутабельность Vue — плюс к DX и точечным апдейтам, минус — риск shared-мутаций; поэтому Pinia только через actions, наружу `readonly`, большие структуры — `shallowRef` с заменой ссылки.

---

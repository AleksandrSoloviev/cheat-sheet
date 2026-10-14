---
order: 6
title: "6. Composables"
technology: vue
---

### Q31. Что такое composable?

**Короткий ответ на собесесе:**  
Composable — функция `useXxx()`, которая инкапсулирует **stateful**-логику на Composition API (`ref`, `computed`, `watch`, lifecycle). Прямой аналог **custom hook** в React. Это основной способ переиспользовать логику во Vue 3 вместо mixins.

---

#### Подробно

**Не просто утилита.** Обычная `formatDate()` — helper. Composable — когда внутри есть реактивность и/или подписки на жизнь компонента:

```ts
// composable
export function useToggle(initial = false) {
  const on = ref(initial)
  const toggle = () => { on.value = !on.value }
  return { on, toggle }
}
```

**Правила (как у hooks):**
1. Вызывать синхронно в `setup` / `<script setup>` (не после `await` без понимания инстанса).
2. Не вызывать условно «то да то нет» без нужды — сломаешь порядок/ожидания.
3. Делать cleanup (`onUnmounted`, return из `watch`).
4. Принимать `MaybeRef` / `MaybeRefOrGetter`, читать через `toValue` — чтобы снаружи можно было передать и `ref`, и строку, и геттер.

Имя с префикса `use` — конвенция экосистемы (и eslint это любит).

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| `useXxx()` composable | `useXxx()` custom hook |
| внутри `ref`/`watch`/`onMounted` | внутри `useState`/`useEffect` |
| mixins → composables | HOCs/classes → hooks |

---

#### Фраза «на автомате» (1–2 предложения)

> Composable — это custom hook Vue: `useXxx` с refs/watch/lifecycle, вызывается в setup, с cleanup и желательно `MaybeRefOrGetter` на входе.

---

### Q32. Как типичный composable выглядит «по-взрослому»?

**Короткий ответ на собесесе:**  
«Взрослый» composable: принимает реактивный/статический вход (`MaybeRefOrGetter`), внутри трекает через `toValue`/`watchEffect`, делает cleanup, возвращает refs/методы — не сырые мутабельные объекты без нужды.

---

#### Подробно

**Паттерн 1 — реакция на вход:**

```ts
import { watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

export const useDocumentTitle = (title: MaybeRefOrGetter<string>) => {
  watchEffect(() => {
    document.title = toValue(title)
  })
}

// вызовы:
useDocumentTitle('Static')
useDocumentTitle(computed(() => user.value.name))
```

**Паттерн 2 — подписка на DOM/window:**

```ts
export const useMouse = () => {
  const x = ref(0)
  const y = ref(0)
  const onMove = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => window.addEventListener('mousemove', onMove))
  onUnmounted(() => window.removeEventListener('mousemove', onMove))
  return { x, y }
}
```

**Паттерн 3 — async + abort:**

```ts
export const useUser = (id: MaybeRefOrGetter<string>) => {
  const user = ref<User | null>(null)
  const error = ref<unknown>(null)
  const loading = ref(false)

  watch(() => toValue(id), async (newId, _old, onCleanup) => {
    const ctrl = new AbortController()
    onCleanup(() => ctrl.abort())
    loading.value = true
    try {
      user.value = await fetchUser(newId, ctrl.signal)
    } catch (e) {
      if (!ctrl.signal.aborted) error.value = e
    } finally {
      loading.value = false
    }
  }, { immediate: true })

  return { user, error, loading }
}
```

Возвращай `ref`/`computed`, а не один большой `reactive`, если потребитель будет деструктурировать.

---

#### React — для якоря в голове

Структура 1-в-1 с хуком:

```ts
function useMouse() {
  const [x, setX] = useState(0)
  useEffect(() => {
    const onMove = (e) => setX(e.pageX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return { x }
}
```

`MaybeRefOrGetter` ≈ «принять value или зависимость», близко к тому, что в React часто делают через `value` + отдельный `useEffect` на смену.

---

#### Фраза «на автомате» (1–2 предложения)

> Взрослый composable: `MaybeRefOrGetter` + `toValue`, cleanup, возврат refs; async — abort в `onCleanup` у watch.

---

### Q33. Composable vs Pinia vs provide/inject?

**Короткий ответ на собесесе:**  
Три разных масштаба шаринга: **composable** — переиспользуемая логика (часто локальный state на вызов); **Pinia** — глобальный доменный store; **provide/inject** — контракт внутри ветки дерева (как Context), без глобальности.

---

#### Подробно

| Инструмент | Scope | DevTools | Типичный кейс |
|------------|-------|----------|----------------|
| Composable | На каждый вызов свой state (обычно) | Нет | `useMouse`, `useFetchLocal`, валидация поля |
| Pinia | Один на приложение (по id store) | Да | cart, session, feature-flags |
| provide/inject | Поддерево от provider | Слабо | Theme, FormContext, Design tokens |

**Антипаттерн:** пихать UI-флаг модалки в Pinia «на всякий».  
**Антипаттерн:** через provide таскать весь user session через 10 уровней — лучше Pinia.  
**Ок:** composable `useAuth()` внутри читает Pinia — фасад для компонентов.

`InjectionKey` + `Symbol` — чтобы TS и отсутствие коллизий имён.

---

#### React — для якоря в голове

| Vue | React |
|-----|--------|
| composable | custom hook |
| Pinia | Zustand / Redux Toolkit |
| provide/inject | Context.Provider / useContext |

Правило то же: Context ≠ глобальный стор всего приложения.

---

#### Фраза «на автомате» (1–2 предложения)

> Composable = логика на вызов; Pinia = глобальный домен; provide/inject = Context ветки. Не мешать слои без причины.

---

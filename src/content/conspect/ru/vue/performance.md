---
order: 9
title: "9. Performance"
technology: vue
---

### Q43. Почему computed быстрее метода в template?

**Короткий ответ на собесесе:**  
`computed` кэшируется: пересчёт только при изменении зависимостей. Метод/функция в template вызывается **на каждый** re-render шаблона, даже если входные данные те же.

---

#### Подробно

```vue
<!-- плохо для тяжёлой логики -->
<p>{{ heavy(items) }}</p>

<!-- хорошо -->
<script setup>
const result = computed(() => heavy(items.value))
</script>
<p>{{ result }}</p>
```

Для тривиальных вещей (`format(price)`) разница микроскопическая — не надо фанатеть. Для фильтрации/сортировки больших массивов — только computed (или вынести раньше в store).

`computed` ленивый: не трогали значение — не считал.

---

#### React — для якоря в голове

≈ `useMemo(() => heavy(items), [items])` vs вызов `heavy(items)` прямо в JSX. В React без memo тоже пересчёт на каждый render.

---

#### Фраза «на автомате» (1–2 предложения)

> Computed кэшируется по зависимостям; метод в template бежит каждый render — тяжёлое только в computed.

---

### Q44. Как оптимизировать большой список?

**Короткий ответ на собесесе:**  
Виртуализация, стабильные `key`, `shallowRef` + замена массива вместо глубокого Proxy на 10k объектов, пагинация/infinite scroll, без тяжёлых deep watchers на каждый item.

---

#### Подробно

Чеклист:
1. **Virtual scroll** (vue-virtual-scroller, tanstack virtual) — в DOM только видимое.
2. **key = id**, не index при reorder/insert.
3. **`shallowRef(list)`** — обновляешь `list.value = next` целиком; вложенные поля не реактивны по отдельности.
4. Пагинация / окно данных с сервера.
5. Не вешать `watch(item, ..., { deep: true })` в цикле.
6. Точечно `v-once` / `v-memo` после профиля.
7. Картинки: lazy `loading="lazy"`, фиксированные размеры против layout shift.

---

#### React — для якоря в голове

Тот же стек идей: react-window / tanstack-virtual, memo строк, нормализация данных, пагинация.

---

#### Фраза «на автомате» (1–2 предложения)

> Большой список: virtualize + stable keys + shallowRef/replace, не deep reactive на 10k объектов.

---

### Q45. Что такое `v-memo`?

**Короткий ответ на собесесе:**  
`v-memo="[dep1, dep2]"` — мемоизирует кусок VNode-дерева, пока deps не изменятся. Аналог точечного `React.memo` внутри template. Нужен редко; сначала профиль.

---

#### Подробно

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <!-- тяжёлый row -->
</div>
```

Перерисуется row только если изменились `id` или `selected`. Остальные поля item игнорируются для этого блока.

Осторожно: легко «забыть» зависимость и поймать stale UI. Не замена нормальной архитектуре списка.

---

#### React — для якоря в голове

`<MemoRow item={item} />` с кастомным `areEqual` / `React.memo`.

---

#### Фраза «на автомате» (1–2 предложения)

> v-memo мемоизирует фрагмент template по deps; инструмент точечный, не default.

---

### Q46. Лишние обновления — как дебажить?

**Короткий ответ на собесесе:**  
Vue DevTools (component inspector, timeline), логи в `watch`, проверка потери/лишних зависимостей, осторожность с `deep: true` и созданием новых объектов в computed без нужды.

---

#### Подробно

Алгоритм:
1. DevTools → кто re-render’ится при клике.
2. Поставить `watch(source, () => console.count('x'), { deep: true })` точечно.
3. Проверить: не возвращает ли computed каждый раз новый объект/массив с тем же смыслом → триггерит детей.
4. `shallowRef` там, где глубокая реактивность не нужна.
5. Убедиться, что не watch’ишь весь store целиком.

Частая причина «шума»: `watch(() => ({ ...props }))` или deep watch огромного state.

---

#### React — для якоря в голове

React DevTools Profiler + why-did-you-render; сравнение по ссылкам props.

---

#### Фраза «на автомате» (1–2 предложения)

> Лишние апдейты: DevTools timeline + найти лишний deep watch/новый объект из computed.

---

### Q47. `KeepAlive` — perf или UX?

**Короткий ответ на собесесе:**  
В первую очередь **UX**: сохранить state табов/форм при переключении. Perf — побочный эффект (нет remount). Память растёт → ограничивай `max`, `include`/`exclude`.

---

#### Подробно

```vue
<KeepAlive :max="5" :include="['UserForm', 'Filters']">
  <component :is="current" />
</KeepAlive>
```

Хуки: `onActivated` / `onDeactivated` (вместо полного unmount).  
Не кэшируй тяжёлые экраны с большими подписками без деактивации слушателей.

С роутером часто:

```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

---

#### React — для якоря в голове

В React нет встроенного KeepAlive; эмулируют кэшем роутера, css hide, или сторонними либами — поэтому на собесесе это плюс знания Vue.

---

#### Фраза «на автомате» (1–2 предложения)

> KeepAlive — UX-кэш инстансов (state жив); память контролируй max/include, не кэшируй всё.

---

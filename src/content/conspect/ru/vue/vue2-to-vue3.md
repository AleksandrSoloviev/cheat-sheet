---
order: 13
title: "13. Vue 2 → 3 / legacy"
technology: vue
---

### Q58. Главные breaking changes Vue 2 → 3?

**Короткий ответ на собесесе:**  
Главное: реактивность на Proxy, `createApp` вместо `new Vue`, удалены filters, `$listeners` влиты в `$attrs`, фрагменты разрешены, IE11 нет, экосистема Vuex→Pinia, event bus уходит.

---

#### Подробно

Список для собеса:
1. **Reactivity** — Proxy; больше не нужен `Vue.set` для новых полей (в большинстве случаев).
2. **createApp(App).mount('#app')** — изолированные инстансы приложений.
3. **Filters** удалены → `computed`/методы/функции.
4. **$listeners** объединены с **$attrs**.
5. **Multiple root nodes** (фрагменты) ок.
6. **v-model** API: `value`+`input` → `modelValue`+`update:modelValue`.
7. Глобальные API стали app-level (`app.component`, `app.use`).
8. **Vuex → Pinia**, event bus → mitt/Pinia/emits.
9. Нет поддержки IE11.

Миграционный билд `@vue/compat` помогает переезжать постепенно.

---

#### React — для якоря в голове

Как major migration React 17→18 / class→hooks: ломающие API + новый mindset, легаси ещё долго рядом.

---

#### Фраза «на автомате» (1–2 предложения)

> Vue 2→3: Proxy, createApp, нет filters, новый v-model, $attrs вместо $listeners, Pinia вместо Vuex.

---

### Q59. Mixins — почему плохо и чем заменить?

**Короткий ответ на собесесе:**  
Mixins неявно мержат поля → конфликты имён, неочевидный origin данных, сложно типизировать. Замена — **composables** (явный импорт и имена).

---

#### Подробно

Проблемы mixins:
- два mixin’а с `data().loading` — кто победил?
- неочевидно, откуда метод в компоненте;
- hard для tree-shaking/TS.

```ts
// было
mixins: [searchMixin, pagingMixin]

// стало
const { query, search } = useSearch()
const { page, next } = usePaging()
```

В Options API composables всё равно вызываются в `setup()`.

---

#### React — для якоря в голове

Class mixins / HOCs → hooks. Та же история эволюции.

---

#### Фраза «на автомате» (1–2 предложения)

> Mixins плохи неявным merge; замена — composables с явными именами, как hooks вместо HOCs.

---

### Q60. Умеешь читать Options API?

**Короткий ответ на собесесе:**  
Да — обязан на 3+. Маппинг: `data`→`ref/reactive`, `computed`→`computed`, `methods`→функции, `watch`→`watch`, `mounted`→`onMounted`. Легаси-код и половина статей всё ещё на Options.

---

#### Подробно

```js
export default {
  props: { id: String },
  data() { return { item: null } },
  computed: {
    title() { return this.item?.name ?? '' },
  },
  watch: {
    id: { immediate: true, handler(id) { this.load(id) } },
  },
  methods: {
    async load(id) { this.item = await api(id) },
  },
  mounted() { /* ... */ },
}
```

Эквивалент Composition — то, что ты уже учишь. На собесесе могут дать кусок Options и попросить объяснить/переписать.

---

#### React — для якоря в голове

Как читать class-компоненты, уже сидя на hooks: понимать оба диалекта.

---

#### Фраза «на автомате» (1–2 предложения)

> Options читать обязательно: data/computed/methods/watch/mounted ↔ Composition API аналоги.

---

---
order: 12
title: "12. Тесты и tooling"
technology: vue
---

### Q55. Чем тестировать Vue-компоненты?

**Короткий ответ на собесесе:**  
Стек по умолчанию: **Vitest** + **Vue Test Utils** и/или **Testing Library Vue**. Тестируй поведение (текст, роли, клики), не внутренности template. Router/Pinia подключай плагинами в `mount`.

---

#### Подробно

```ts
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(UserCard, {
  props: { name: 'Ada' },
  global: {
    plugins: [createTestingPinia(), router],
    stubs: { Teleport: true },
  },
})

expect(wrapper.text()).toContain('Ada')
await wrapper.get('button').trigger('click')
```

Testing Library Vue — тот же mindset, что RTL: `getByRole`, user-event.  
Unit на composable/store — отдельно, без DOM.  
E2E — Playwright/Cypress.

Не снапь весь HTML; не тестируй private state без нужды.

---

#### React — для якоря в голове

Jest/Vitest + Testing Library React — почти идентичный подход. VTU ≈ Enzyme-ish, TL Vue ≈ RTL.

---

#### Фраза «на автомате» (1–2 предложения)

> Vitest + VTU/TL Vue; пинить поведение, мокать Pinia/Router плагинами.

---

### Q56. Vite — почему?

**Короткий ответ на собесесе:**  
Vite — стандартный бандлер/dev-server для Vue 3: native ESM в dev → быстрый старт и HMR, production на Rollup. Простой конфиг, алиасы, отличная работа с SFC `.vue`.

---

#### Подробно

Почему вытеснил Vue CLI/Webpack на новых проектах:
- холодный старт секунды, не минуты;
- HMR точечный;
- из коробки TS, JSX, CSS modules;
- `import.meta.env` для env;
- plugin ecosystem (`@vitejs/plugin-vue`).

```ts
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

Знать на собесесе: dev ≠ prod pipeline (ESM serve vs Rollup bundle).

---

#### React — для якоря в голове

CRA устарел; Vite React / Next — норма. Ты уже в этой парадигме, если на Vite/Next.

---

#### Фраза «на автомате» (1–2 предложения)

> Vite = быстрый ESM-dev + Rollup-prod; де-факто стандарт Vue 3 вместо Vue CLI.

---

### Q57. Что смотрит eslint-plugin-vue?

**Короткий ответ на собесесе:**  
Плагин линтит SFC: порядок блоков, обязательный `key` в `v-for`, мутацию props, недоступность, стиль template/script. На проекте обычно `plugin:vue/vue3-recommended` + TS.

---

#### Подробно

Примеры правил:
- `vue/multi-word-component-names`
- `vue/no-mutating-props`
- `vue/require-v-for-key`
- `vue/no-unused-vars` в template
- порядок `<script>` / `<template>` / `<style>`

В CI — must. Вместе с `eslint-plugin-vue` часто Prettier и `vue-tsc --noEmit` для типов.

На собесесе достаточно: «держим recommended + typescript-eslint + vue-tsc в CI».

---

#### React — для якоря в голове

eslint-plugin-react / react-hooks — та же роль. `react-hooks/exhaustive-deps` ≈ дисциплина watch/deps во Vue (ручная).

---

#### Фраза «на автомате» (1–2 предложения)

> eslint-plugin-vue ловит SFC-ошибки (props mutate, keys, a11y); ставь vue3-recommended + vue-tsc.

---

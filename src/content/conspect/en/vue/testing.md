---
order: 12
title: "12. Tests and tooling"
technology: vue
---

### Q55. What do you test Vue components with?

**Short interview answer:**  
The default stack: **Vitest** + **Vue Test Utils** and/or **Testing Library Vue**. Test behavior (text, roles, clicks), not the internals of the template. Attach Router and Pinia as plugins in `mount`.

---

#### In detail

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

Testing Library Vue is the same mindset as RTL: `getByRole`, user-event.  
Unit tests of a composable or a store live separately, without the DOM.  
E2E is Playwright or Cypress.

Do not snapshot the entire HTML; do not test private state unless you need to.

---

#### React — a mental anchor

Jest/Vitest + Testing Library React — almost the same approach. VTU ≈ Enzyme-ish, TL Vue ≈ RTL.

---

#### Autopilot phrase (1–2 sentences)

> Vitest + VTU/TL Vue; pin the tests to behavior, mock Pinia/Router with plugins.

---

### Q56. Vite — why?

**Short interview answer:**  
Vite is the standard bundler and dev server for Vue 3: native ESM in dev means a fast start and HMR, and production runs on Rollup. Simple config, aliases, and excellent support for the SFC `.vue`.

---

#### In detail

Why it replaced Vue CLI and Webpack on new projects:
- a cold start takes seconds, not minutes;
- HMR is targeted;
- TS, JSX, and CSS modules out of the box;
- `import.meta.env` for env;
- a plugin ecosystem (`@vitejs/plugin-vue`).

```ts
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

Know this for the interview: the dev pipeline is not the prod pipeline (ESM serve vs a Rollup bundle).

---

#### React — a mental anchor

CRA is outdated; Vite React / Next is the norm. You are already in this paradigm if you work with Vite or Next.

---

#### Autopilot phrase (1–2 sentences)

> Vite = fast ESM dev + Rollup prod; the de facto Vue 3 standard instead of Vue CLI.

---

### Q57. What does eslint-plugin-vue check?

**Short interview answer:**  
The plugin lints SFCs: block order, a required `key` on `v-for`, prop mutation, accessibility, and template/script style. On a project it is usually `plugin:vue/vue3-recommended` plus TS.

---

#### In detail

Example rules:
- `vue/multi-word-component-names`
- `vue/no-mutating-props`
- `vue/require-v-for-key`
- `vue/no-unused-vars` in the template
- the order of `<script>` / `<template>` / `<style>`

In CI it is a must. Alongside `eslint-plugin-vue`, Prettier and `vue-tsc --noEmit` for types are common.

For the interview it is enough to say: "we keep recommended + typescript-eslint + vue-tsc in CI".

---

#### React — a mental anchor

eslint-plugin-react / react-hooks play the same role. `react-hooks/exhaustive-deps` ≈ watch/deps discipline in Vue (done by hand).

---

#### Autopilot phrase (1–2 sentences)

> eslint-plugin-vue catches SFC mistakes (props mutate, keys, a11y); use vue3-recommended + vue-tsc.

---

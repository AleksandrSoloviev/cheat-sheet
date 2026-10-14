---
order: 14
title: "14. Vue vs React"
technology: vue
---

### Q61. What is the main philosophical difference?

**Short interview answer:**  
Vue: reactive data + templates (the compiler optimizes them), "official batteries included." React: UI = f(state), an immutable rerender world, JSX, and a huge ecosystem. Both are component-based; composables ≈ hooks.

---

#### In detail

Vue bets on:
- automatic dependency tracking;
- the SFC as the unit of UI + styles;
- progressiveness (you can use it on a piece of a page).

React bets on:
- an explicit render flow;
- "assemble it yourself" flexibility;
- one model for Web/RN/RSC.

In an interview, avoid "X is better." Talk about trade-offs and being bilingual.

---

#### React — mental anchor

Seven years in React is a strength: you can compare deliberately, not religiously.

---

#### Autopilot phrase (1–2 sentences)

> Vue = reactivity + templates + batteries; React = UI=f(state) + JSX + ecosystem; both have hooks-like reuse.

---

### Q62. The "Vue ↔ React" table

**Short interview answer:**  
In an interview, keep the correspondence table in your head. It quickly shows that you are not learning Vue "from scratch," but transferring a model you already have.

---

#### In detail

| Vue | React |
|-----|--------|
| `ref` / `reactive` | `useState` / `useReducer` |
| `computed` | `useMemo` |
| `watch` / `watchEffect` | `useEffect` |
| composable `useX` | custom hook `useX` |
| props + `emit` | props + callbacks |
| `v-model` | `value` + `onChange` |
| slots / scoped slots | children / render props |
| provide/inject | Context |
| Pinia | Zustand / Redux Toolkit |
| Vue Router | React Router |
| Nuxt | Next |
| Teleport | Portal |
| KeepAlive | no direct equivalent |
| template refs | `useRef` |
| `defineExpose` | `useImperativeHandle` |
| SFC `.vue` | `.tsx` (+ CSS modules/styled) |

How to use it: for any question "what is X in Vue?" answer "it is like Y in React, with difference Z."

---

#### React — mental anchor

The table is your main bridge. Differences matter more than matches: mutability, template unwrap, emit vs callback.

---

#### Autopilot phrase (1–2 sentences)

> Answer through the bridge: Vue X ≈ React Y + the difference (mutations / emit / unwrap).

---

### Q63. When would you choose Vue, and when React?

**Short interview answer:**  
The team, hiring, and the product ecosystem matter more than religion. Vue gives fast, predictable DX on CRUD, admin, and mid-size products. React gives more libraries, RN, large ecosystems, and RSC. On the job, I follow the team's conventions.

---

#### In detail

**Vue fits when:** the design system is built on SFCs, there are many forms and admin screens, the team is already on Vue/Nuxt, and you need an "official path."  
**React fits when:** you need mobile RN, hiring and the market matter, rendering is heavily custom, or a React monorepo already exists.

Honest senior tone: "I write in both; the criterion is people and the product, not hype."

Do not say "Vue is easier for juniors." It sounds condescending. Better: "less ceremony for typical UI."

---

#### React — mental anchor

Your React experience is an argument for "I will get into a Vue codebase quickly," not "I will rewrite everything in React."

---

#### Autopilot phrase (1–2 sentences)

> The choice = team and product; Vue is strong on DX and batteries, React on ecosystem, RN, and RSC; on a project, follow the team's conventions.

---

### Q64. Both Vue and React have a virtual DOM — why Proxy, then?

**Short interview answer:**  
Both use a VDOM, but the strategies differ. Through Proxy, Vue knows **which** data changed and where to update; the template compiler adds patch flags. React by default walks downward from the component (with manual memoization).

---

#### In detail

Vue pipeline (simplified):
1. You changed a `ref` → trigger the subscribers.
2. The subscribing component is marked dirty.
3. The scheduler batches → render → VDOM diff with compiler hints.

React pipeline:
1. `setState` → schedule a render of the component function.
2. Compare the new tree with the previous one.
3. Memo, Pure, or the compiler reduce the work, manually or automatically.

Proxy is not "instead of" the VDOM. It exists "so you know whom to wake."

---

#### React — mental anchor

Signals and Solid often work without a VDOM. The React Compiler moves React closer to automatic optimization. Vue has long used fine-grained dependencies through reactivity.

---

#### Autopilot phrase (1–2 sentences)

> Proxy in Vue is precise dependency tracking; the VDOM still patches the DOM. React more often renders a wider tree and trims it with memo.

---

### Q65. Signals (Solid / Angular / the React compiler) vs Vue?

**Short interview answer:**  
Vue `ref` and `computed` are essentially a signal-like model, and have been for a long time. Solid is finer-grained (no VDOM). React is moving toward a compiler and auto-memo. In an interview: I understand the trend, and Vue is already in this paradigm.

---

#### In detail

A signal = a value cell + a list of subscribers.  
Vue: `ref` + dependency tracking inside render, computed, and watch.  
Solid: signals update the DOM at specific points, with no VDOM.  
Angular signals are an explicit move in that direction.  
React historically uses push-down render; the compiler reduces manual memo.

You do not need to say "Vue invented signals before everyone else" in a grandiose way. Accuracy of the model is enough.

---

#### React — mental anchor

Your experience with `useMemo` and `useEffect` dependency arrays is the manual analog of what Vue and Solid track on their own.

---

#### Autopilot phrase (1–2 sentences)

> Vue ref/computed ≈ signals; Solid without a VDOM is finer-grained; React is catching up with a compiler. Vue's model is already dependency-based.

---

---
order: 1
title: "ref vs reactive"
technology: vue
---

- ref:
- primitive or object
- script: count.value
- template: {{ count }}
- replace the whole value: x.value = next
- reactive:
- object only (Proxy)
- state.x = 1 mutates a field
- destructuring breaks reactivity
- return from a composable:
- ref or toRefs()
- ≈ useState

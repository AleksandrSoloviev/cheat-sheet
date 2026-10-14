---
order: 1
title: "ref vs reactive"
technology: vue
---

- ref:
- примитив / объект
- script: count.value
- template: {{ count }}
- замена: x.value = next
- reactive:
- только объект (Proxy)
- state.x = 1 — мутация
- деструкт → ломает
- composable наружу:
- ref или toRefs()
- ≈ useState

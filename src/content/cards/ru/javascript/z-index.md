---
order: 20
title: "z-index"
technology: javascript
---

- сравнивают в одном stacking context
- не обязательно DOM-соседи
- 9999 внука < 2, если отец — контекст
- без position игнор (кроме flex/grid)
- flex/grid item: z-index → контекст
- равный z-index → кто ниже в DOM
- порядок слоёв

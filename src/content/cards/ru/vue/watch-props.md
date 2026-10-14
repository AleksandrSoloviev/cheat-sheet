---
order: 9
title: "watch(() => props.id)"
technology: vue
---

- watch(props.id) = снимок
- примитива на момент вызова
- нужен живой источник:
- watch(() => props.id, cb)
- или toRef(props, 'id')
- setup бежит 1 раз!
- ≠ React deps

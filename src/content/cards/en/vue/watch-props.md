---
order: 9
title: "watch(() => props.id)"
technology: vue
---

- watch(props.id) captures a snapshot
- of the primitive at call time
- you need a live source:
- watch(() => props.id, cb)
- or toRef(props, 'id')
- setup runs once
- ≠ React deps

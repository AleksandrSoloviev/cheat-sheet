---
order: 6
title: "emit ↑"
technology: vue
---

- defineEmits<{ save: [id: number] }>()
- emit('save', id)
- parent: @save="onSave"
- the event name must match
- do not pass onSave down as a prop
- that is the idiomatic Vue style
- ≈ an onSave callback

---
order: 6
title: "emit ↑"
technology: vue
---

- defineEmits<{ save:[id:number] }>()
- emit('save', id)
- родитель: @save="onSave"
- имя события совпадает
- не передаём onSave пропом
- (идиоматичный Vue)
- ≈ onSave колбэк

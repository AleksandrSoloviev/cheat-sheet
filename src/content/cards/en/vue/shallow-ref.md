---
order: 19
title: "shallowRef"
technology: vue
---

- reactive only when
- you replace .value
- mutating a nested field does not update the UI
- large lists or JSON:
- list.value = nextList
- third-party objects (a map)
- React updates by reference

---
order: 12
title: "route.params"
technology: vue
---

- /users/1 → /users/2
- часто БЕЗ remount
- onMounted не повторится
- watch(() => route.params.id,
- load, { immediate: true })
- или onBeforeRouteUpdate
- useEffect([id])

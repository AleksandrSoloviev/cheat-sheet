---
order: 12
title: "route.params"
technology: vue
---

- /users/1 → /users/2
- often WITHOUT a remount
- onMounted does not run again
- watch(() => route.params.id,
-   load, { immediate: true })
- or onBeforeRouteUpdate
- useEffect([id])

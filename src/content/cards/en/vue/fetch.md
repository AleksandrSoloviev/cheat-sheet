---
order: 16
title: "where does fetch go?"
technology: vue
---

- depends on an id or the route →
- watch(..., { immediate })
- plus AbortController cleanup
- once, with no dependencies →
- onMounted
- Nuxt → useAsyncData
- useEffect([id])

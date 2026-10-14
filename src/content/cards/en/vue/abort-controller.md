---
order: 17
title: "AbortController"
technology: vue
---

- not a Vue API — it is the browser
- const c = new AbortController()
- fetch(..., { signal })
- in the watch cleanup:
- return () => c.abort()
- stops a race while searching
- effect cleanup

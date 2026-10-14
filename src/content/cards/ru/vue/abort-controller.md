---
order: 17
title: "AbortController"
technology: vue
---

- не API Vue — браузер
- const c = new AbortController()
- fetch(..., { signal })
- в cleanup watch:
- return () => c.abort()
- анти-race при поиске
- effect cleanup

---
order: 4
title: "watch / watchEffect"
technology: vue
---

- watch(src, cb) takes an explicit source
- old/new, immediate, deep
- watchEffect collects dependencies itself
- and runs immediately
- cleanup: return () => {}
- a value for the UI belongs in computed
- ≈ useEffect

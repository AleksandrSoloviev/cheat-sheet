---
order: 8
title: "losing reactivity"
technology: vue
---

- bad: const { n } = store
- good: storeToRefs(store)
- reactive → toRefs / toRef
- actions can be destructured
- watch a prop with a getter:
- () => props.id
- trap #1

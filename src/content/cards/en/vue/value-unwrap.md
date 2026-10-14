---
order: 2
title: ".value / unwrap"
technology: vue
---

- script: count.value++
- template: {{ count }}
- a top-level ref is unwrapped in the template
- a ref nested in reactive
- is usually read without .value in script
- when you access the field
- the wrapper is { value }

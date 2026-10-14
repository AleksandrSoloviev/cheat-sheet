---
order: 8
title: "потеря реактивности"
technology: vue
---

- плохо: const { n } = store
- хорошо: storeToRefs(store)
- reactive → toRefs / toRef
- actions можно деструктурить
- props.id в watch — геттер:
- () => props.id
- ЛОВУШКА #1

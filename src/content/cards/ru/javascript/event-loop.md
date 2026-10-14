---
order: 1
title: "Event Loop"
technology: javascript
---

- Call Stack → синхронный код
- Web APIs → async (timers, fetch)
- Microtasks: Promise.then,
- queueMicrotask, MutationObs
- Macrotasks: setTimeout, I/O
- Сначала ВСЕ micro, потом 1 macro
- порядок async

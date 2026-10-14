---
order: 1
title: "Event Loop"
technology: javascript
---

- Call stack runs synchronous code
- Web APIs run async work (timers, fetch)
- Microtasks: Promise.then,
- queueMicrotask, MutationObserver
- Macrotasks: setTimeout, I/O
- drain ALL microtasks, then one macrotask
- async ordering

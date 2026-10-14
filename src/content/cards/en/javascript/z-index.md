---
order: 20
title: "z-index"
technology: javascript
---

- compared inside one stacking context
- the elements do not have to be DOM siblings
- a grandchild with 9999 loses to 2 if its parent is a context
- ignored without position, except on flex/grid items
- a flex/grid item with z-index creates a context
- equal z-index: the later DOM node wins
- layer order

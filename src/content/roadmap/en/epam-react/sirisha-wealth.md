---
interview: sirisha-wealth
order: 1
title: "Sirisha Konchada — Wealth Management"
candidate: Sirisha Konchada
interviewer: Murali Kumar Adabala
initiative: Wealth Management
questions:
  - id: sirisha-wealth.1a
    label: "1a"
    topic: "Virtual DOM"
    title: "What is the Virtual DOM and how does it work?"
    body: |
      #### Short answer

      The Virtual DOM is a tree of plain JavaScript objects that React uses to describe the UI. A component returns elements. An element has a type, props, and children. Those objects are not browser nodes, and they are not the Shadow DOM.

      When you change state, React calls the component again and gets a new tree. Reconciliation compares it with the previous fiber tree. A fiber holds the component type, its state, and links to its child and sibling. Only the difference is recorded for the real DOM, and the commit phase applies that difference to browser nodes. React does not recreate a node that did not change.

      In a list you set a stable key. React matches items by that key. Without a key the match follows position, so a reorder can reuse the wrong DOM node and the state attached to it.

      The virtual tree does not promise to be faster than a hand-made update of a single node. It lets you describe what the UI should be: React batches updates and can discard a render that has not committed yet, for example inside startTransition. Until the React Compiler is enabled, that reconciliation does not by itself skip children.

      #### Phrase you can say

      The Virtual DOM is the object tree that describes the UI. After setState, React compares the new tree with the fiber tree and writes only the difference to the real DOM. A stable key lets React match the same list items instead of pairing them by position.
  - id: sirisha-wealth.1b
    label: "1b"
    topic: "Virtual DOM"
    title: "When a parent's state updates, does a child component re-render even if its own props/state haven't changed?"
    body: |
      #### Short answer

      By default, yes. A state update in the parent calls the parent function again, and React walks the children. The child function runs too, even when you did not pass new props and the child's own state did not change. The child's state is kept: it is the same instance.

      A re-render here means calling the function again. The real DOM changes only when reconciliation sees different output. The child can run, return the same tree, and leave its DOM nodes untouched.

      React.memo on the child stops the call when props are shallowly equal under Object.is. Without that memo, a child with no props is still called. In development, Strict Mode may run the render twice: that is a purity check, not a second user update.

      #### Code example

      ```jsx
      import { useState } from 'react';

      const Child = () => {
        console.log('Child render');
        return <p>static child</p>;
      };

      const Parent = () => {
        const [count, setCount] = useState(0);

        const handleClick = () => {
          setCount((value) => value + 1);
        };

        return (
          <div>
            <button type="button" onClick={handleClick}>
              {count}
            </button>
            <Child />
          </div>
        );
      };
      ```

      #### Phrase you can say

      Yes: by default React calls the child again even when its props and state are unchanged. That is another function call, and the DOM changes only if reconciliation sees a different result. React.memo can skip the call when the props are shallowly equal.
  - id: sirisha-wealth.1c
    label: "1c"
    topic: "Virtual DOM"
    title: "Is that behavior technically a \"re-render\" or a \"recreation\" of the component?"
    body: |
      #### Short answer

      It is a re-render while the same component type and the same key stay in that place in the tree. React calls the function again and keeps the fiber: state, the ref, and the DOM node live on. In the first example, tick updates the parent, and Editor with the same key keeps draft.

      A fresh instance is created when the component's identity changes for the reconciler. A different key, a different function type, or a branch that unmounted it first produces an unmount and a mount. State then starts from the initial value. Changing docId with key={docId} resets draft.

      A separate trap is declaring a component during render. Every pass of the parent creates a new function type, and React mounts it again. In the second example, local resets when you click parent, even though you did not edit local itself. Declare components outside the render.

      #### Code example

      ```jsx
      import { useState } from 'react';

      const Editor = () => {
        const [draft, setDraft] = useState('');

        const handleChange = (event) => {
          setDraft(event.target.value);
        };

        return <textarea value={draft} onChange={handleChange} aria-label="Draft" />;
      };

      const Screen = ({ docId, tick }) => {
        return (
          <section>
            <p>{tick}</p>
            <Editor key={docId} />
          </section>
        );
      };

      // Same key keeps Editor state when tick changes. A new docId remounts Editor.
      // Inline is a new type on every Parent render, so its state resets.

      const Parent = () => {
        const [n, setN] = useState(0);

        const handleClick = () => {
          setN((value) => value + 1);
        };

        const Inline = () => {
          const [local, setLocal] = useState(0);

          const handleLocal = () => {
            setLocal((value) => value + 1);
          };

          return (
            <button type="button" onClick={handleLocal}>
              local {local}
            </button>
          );
        };

        return (
          <div>
            <button type="button" onClick={handleClick}>
              parent {n}
            </button>
            <Inline />
          </div>
        );
      };
      ```

      #### Phrase you can say

      While the type and the key stay the same, it is a re-render: the function runs again and the state stays. A new key, a different type, or an unmount creates a new instance. A component declared inside render changes type on every pass.
  - id: sirisha-wealth.2a
    label: "2a"
    topic: "Rendering Behavior & Performance Optimization"
    title: "Ways to avoid unnecessary re-renders of a child component (e.g., React.memo, useCallback, useMemo, state colocation)"
    body: |
      #### Short answer

      You cut an unnecessary child re-render from two sides: do not wake the child, and if the parent does render, let the child skip the work.

      State colocation. A string that only the field needs lives in the field component. The neighboring list is then outside that render. Lift state to a shared parent only when the other neighbor actually reads it.

      React.memo compares props with Object.is. The child is not called when the props are shallowly equal. That benefit disappears when the parent passes a new function or a new object every time. useCallback keeps the callback the same until its dependencies change. useMemo keeps a computed value the same and skips the calculation when the deps are unchanged. useMemo does not cancel the render of the component that calls it. It helps memoized children that receive that array, and it helps the calculation itself.

      Do not memoize every node: the comparison costs time too. Wrap what the Profiler showed to be expensive. If the React Compiler is enabled, it inserts some of these wrappers itself. Until then, an unstable callback prop cancels React.memo.

      In the example, SearchBox owns query and does not render the list. ExpensiveList owns selectedId. The sort is inside useMemo on items, so choosing a row does not rebuild the array. handleSelect is stable, and selectedId is not passed to Row, so React.memo skips the row when only the selection changed. If every row needs the selected id, memo stops filtering them out: move the highlight into its own node.

      #### Code example

      ```jsx
      import React, { useCallback, useMemo, useState } from 'react';

      const SearchBox = () => {
        const [query, setQuery] = useState('');

        const handleChange = (event) => {
          setQuery(event.target.value);
        };

        return <input value={query} onChange={handleChange} aria-label="Search" />;
      };

      const Row = React.memo(({ item, onSelect }) => {
        return (
          <li>
            <button type="button" onClick={() => onSelect(item.id)}>
              {item.name}
            </button>
          </li>
        );
      });

      const ExpensiveList = ({ items }) => {
        const [selectedId, setSelectedId] = useState(null);

        const handleSelect = useCallback((id) => {
          setSelectedId(id);
        }, []);

        const sorted = useMemo(
          () => [...items].sort((left, right) => left.name.localeCompare(right.name)),
          [items],
        );

        return (
          <div>
            <p>{selectedId}</p>
            <ul>
              {sorted.map((item) => (
                <Row key={item.id} item={item} onSelect={handleSelect} />
              ))}
            </ul>
          </div>
        );
      };

      const Screen = ({ items }) => {
        return (
          <section>
            <SearchBox />
            <ExpensiveList items={items} />
          </section>
        );
      };
      ```

      #### Phrase you can say

      I keep the field's state in the field so the list does not wake up. I wrap an expensive child in React.memo, pass the callback through useCallback, and pass the array through useMemo. Otherwise memo sees new props and re-renders anyway. I memoize what the Profiler pointed at.
  - id: sirisha-wealth.2b
    label: "2b"
    topic: "Rendering Behavior & Performance Optimization"
    title: "General performance optimization techniques in React apps"
    body: |
      #### Short answer

      First find what is actually slow. The React Profiler shows which component took time and why it was included in that commit. Without a measurement, useMemo and React.memo are easy to put on a cold path, where you only pay for the comparison.

      Then remove extra renders. Keep state next to the component that reads it, so typing does not wake an expensive neighbor. Split the Context API by update frequency: theme apart from data that changes often. Wrap expensive UI in React.memo and keep props stable: a callback through useCallback, an object or array through useMemo. useMemo keeps a result between renders; it does not cancel the render of the component itself.

      Do not mount a long list in full. Windowing paints the visible rows. Give a row a stable key, not an index, when the order changes. Compute a derived value during render instead of storing it with a second setState.

      Mark non-urgent work with useTransition or useDeferredValue: typing stays urgent, and a heavy list can wait. Do not put heavy work in useLayoutEffect; it blocks paint. Do not declare a component inside another component, or the type changes and the children unmount on every pass.

      #### Phrase you can say

      I start with the Profiler, then the cause. It is usually state lifted too high, one context mixing frequent and rare data, unstable props on React.memo, or a long list without windowing. useTransition keeps typing urgent and lets the heavy render wait. I add memoization after the measurement.
  - id: sirisha-wealth.2c
    label: "2c"
    topic: "Rendering Behavior & Performance Optimization"
    title: "How would you improve performance if the initial load of a React app is slow? (code-splitting, lazy loading, bundle analysis, etc.)"
    body: |
      #### Short answer

      The first load is slow when the browser spends a long time downloading and running JavaScript. Start with a bundle report, for example webpack-bundle-analyzer. Look for duplicate libraries, locales that were included in full, and a heavy screen that is not needed on the first frame.

      Cut the initial chunk by route. Load a screen with React.lazy and import(): Webpack or the bundler puts it in a separate file that downloads on navigation. A Suspense boundary with a fallback has to sit around it, or the suspended render has nowhere to go. Load a rare heavy piece, an editor or a chart, the same way on click. Splitting every button hurts: you get too many requests. The lazy module needs a default export.

      Check tree-shaking. A full Lodash import often pulls in the whole library; a path import or lodash-es keeps one function. The production bundle should not contain dev-only packages. Serve chunks compressed, Brotli or gzip, and cache them for a long time by the hash in the file name.

      SSR sends HTML earlier, so the user sees markup earlier. Interaction still waits for JavaScript: hydration has to download and run the same UI. If the pain is the first click, the win is a smaller initial bundle, not only earlier HTML.

      #### Code example

      ```jsx
      import { lazy, Suspense } from 'react';

      const Reports = lazy(() => import('./Reports'));

      const App = () => {
        return (
          <Suspense fallback={<p>Loading</p>}>
            <Reports />
          </Suspense>
        );
      };
      ```

      #### Phrase you can say

      I read the bundle analyzer, move routes to React.lazy with Suspense, and load heavy libraries on click. I check that Lodash did not land in the initial file in full and that the chunks are compressed. SSR gives early HTML, but hydration still downloads JavaScript, so I shrink the initial bundle on its own.
  - id: sirisha-wealth.3a
    label: "3a"
    topic: "React Hooks"
    title: "Which hooks have you used, and for what purposes?"
    body: |
      #### Short answer

      Name the hooks you have actually written, and say in one sentence what each was for. Do not present someone else's list as your own experience. The set below covers ordinary UI and the questions in this round.

      useState holds the local state of a piece of the screen. useReducer updates several fields as one command. useEffect syncs the component with the outside world after paint: a subscription, a request, document.title. A value derived from props is computed during render, not in an effect. useLayoutEffect reads layout and adjusts the DOM before the frame the user sees. useRef holds a mutable cell without a re-render, and a reference to a DOM node. useMemo and useCallback keep a stable reference or skip an expensive calculation. useContext reads a Context API value. useId gives a stable id that ties a label to a field. useTransition and useDeferredValue keep urgent typing responsive and let a heavy render wait. A custom hook extracts a repeated bundle of state and effects.

      Call hooks at the top level, in the same order, and not inside a condition.

      #### Phrase you can say

      I name the hooks I have written: useState for local state, useEffect for syncing with the outside world after paint, useRef for a value that does not re-render, useMemo and useCallback for stable references, useContext for the Context API, and useReducer for related fields. A custom hook is for when that bundle is needed again. Calls stay at the top level and in a fixed order.
  - id: sirisha-wealth.3b
    label: "3b"
    topic: "React Hooks"
    title: "useState vs useEffect — dependency array behavior (no array vs. empty array vs. populated array)"
    body: |
      #### Short answer

      useState has no dependency array. It stores a value between renders of that instance. The useState argument is used as the initial value only on mount. The form useState(() => compute()) also calls the function once per mount: that is a lazy initializer, not deps.

      The dependency array is the second argument of useEffect. useLayoutEffect, useMemo, and useCallback use the same shape. Entries are compared with Object.is.

      With no array, the effect runs after every committed render. A setState inside it with no condition loops the component: render, effect, update, render again.

      An empty array [] runs the effect after mount, and the cleanup runs on unmount. In production that is once per instance lifetime. In development, Strict Mode mounts, cleans up, and mounts again so a missing cleanup shows up. An empty array does not watch props. If you read userId inside it, the closure stays on the first value. In production that is a bug: if you read a fresh value, put it in the array.

      An array with values runs the effect after mount and after a render where any entry changed. The previous run's cleanup is called before the next effect and on unmount. The array includes everything the effect reads that can change. The useState setter is stable, so you can omit it. An object or function created during render is new every time, and the effect runs again.

      #### Code example

      ```jsx
      import { useEffect, useState } from 'react';

      const Reporter = ({ userId }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
          console.log('no array', count);
        });

        useEffect(() => {
          console.log('mount', userId);
          return () => console.log('unmount');
        }, []);

        useEffect(() => {
          console.log('user changed', userId);
        }, [userId]);

        const handleClick = () => {
          setCount((value) => value + 1);
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };
      ```

      #### Phrase you can say

      useState has no dependency array: the initial value, including a lazy function, is used on mount. With useEffect, no array means after every render, [] means after mount and cleanup on unmount, and a filled array means when Object.is sees a change. If you read fresh props, put them in the array, or the closure goes stale. In Strict Mode an empty effect is also checked with a double mount in dev.
  - id: sirisha-wealth.3c
    label: "3c"
    topic: "React Hooks"
    title: "Does updating a useRef value trigger a re-render? Why or why not?"
    body: |
      #### Short answer

      No. useRef returns the same { current } object for every render of that instance. Writing ref.current changes the field and does not ask React to render the component again. The screen stays as it was until a render happens for another reason: setState, new props, or a new Context API value.

      So a ref holds a timer id, a previous value, and any draft that is not a source of markup. If a number has to appear on screen, that is useState.

      The other common case is the DOM. You pass a ref to an element, and React writes the node into current after commit. That write does not schedule a separate render either. JSX that read clicks.current sees the new number only on the next render. In the example, the "ref only" button accumulates clicks quietly, and the "re-render" button shows what has already accumulated.

      #### Code example

      ```jsx
      import { useRef, useState } from 'react';

      const Box = () => {
        const [, setTick] = useState(0);
        const clicks = useRef(0);

        const handleRefOnly = () => {
          clicks.current += 1;
        };

        const handleWithState = () => {
          setTick((value) => value + 1);
        };

        return (
          <div>
            <p>{clicks.current}</p>
            <button type="button" onClick={handleRefOnly}>
              ref only
            </button>
            <button type="button" onClick={handleWithState}>
              re-render
            </button>
          </div>
        );
      };
      ```

      #### Phrase you can say

      Updating a useRef does not re-render the component: current changes on a stable object, and React is not subscribed to that. If the number has to show up in the UI, you need useState. Writing a DOM node into a ref after commit does not schedule a render either.
  - id: sirisha-wealth.3d
    label: "3d"
    topic: "React Hooks"
    title: "useLayoutEffect vs useEffect — how do they differ and when would you use one over the other?"
    body: |
      #### Short answer

      Both hooks take a function, a dependency array, and a cleanup. The difference is when they run relative to paint.

      useEffect runs after the browser has painted the frame. You use it for a request, a subscription, a log, and document.title. It does not delay paint. The user can see the previous frame for a moment, which is fine for network work.

      useLayoutEffect runs after the DOM updates and before paint. You use it when you need to measure a node with getBoundingClientRect and write the position immediately, so the frame does not flash: a tooltip, a menu, scroll restoration. React applies a setState from this effect before the frame is shown. The cost is that you hold up painting, so the body stays short. Do not put network work or a heavy calculation here. In the example, the tooltip top is measured from the bottom of the anchor before the browser shows the span with position: fixed. The same code in useEffect would have time to paint a frame with top at zero.

      On the server there is no layout. useLayoutEffect does not measure a document there and logs a warning. For SSR, keep useEffect, or turn the measurement on only after the client mount.

      Default to useEffect. useLayoutEffect is a narrow tool against flicker, not an earlier effect you add just in case.

      #### Code example

      ```jsx
      import { useLayoutEffect, useRef, useState } from 'react';

      const Tooltip = ({ text }) => {
        const anchorRef = useRef(null);
        const [top, setTop] = useState(0);

        useLayoutEffect(() => {
          const rect = anchorRef.current.getBoundingClientRect();
          setTop(rect.bottom);
        }, [text]);

        return (
          <span ref={anchorRef}>
            {text}
            <span style={{ position: 'fixed', top }}>{text}</span>
          </span>
        );
      };
      ```

      #### Phrase you can say

      useEffect runs after paint, and useLayoutEffect runs after the DOM update and before paint. A request and a subscription go in useEffect so they do not hold the frame. Measuring and correcting position before a flicker goes in useLayoutEffect, and that body stays short. SSR has no layout, so on the server I keep useEffect.
  - id: sirisha-wealth.3e
    label: "3e"
    topic: "React Hooks"
    title: "useState vs useReducer — when is one preferred (complexity, nested state updates)?"
    body: |
      #### Short answer

      useState is the better fit when the fields are independent and the next value is obvious at the call site: a number, a string, a flag. React 18 batches several setState calls in one event handler into one render, including inside a timer and a promise. You do not pick useReducer for batching.

      useReducer is the better fit when the next state is one command over several fields. The edit action in the example writes draft, raises dirty, and clears error together. A mismatched combination that is easy to forget across three separate setState calls does not get assembled in the reducer. The function is pure, so you can test it without a component. dispatch is stable, so it is easy to pass down without useCallback.

      A nested update lives in the same place. A spread such as profile: { ...state.profile, name } is written once in the reducer, not copied across handlers. If the object is flat and the fields change independently, keep several useState calls: a reducer for a single toggle only makes the code longer.

      #### Code example

      ```jsx
      import { useReducer } from 'react';

      const initialState = { draft: '', dirty: false, saving: false, error: '' };

      const reducer = (state, action) => {
        switch (action.type) {
          case 'edit':
            return { ...state, draft: action.draft, dirty: true, error: '' };
          case 'save':
            return { ...state, saving: true, error: '' };
          case 'save-failed':
            return { ...state, saving: false, error: action.error };
          default:
            return state;
        }
      };

      const Composer = () => {
        const [state, dispatch] = useReducer(reducer, initialState);

        const handleChange = (event) => {
          dispatch({ type: 'edit', draft: event.target.value });
        };

        return (
          <textarea value={state.draft} onChange={handleChange} aria-label="Draft" />
        );
      };
      ```

      #### Phrase you can say

      I keep independent fields in useState. I put several related fields that change as one command in useReducer: the action assembles the whole state, dispatch is stable, and the transition can be tested on its own. In React 18 several setState calls are already batched, so I reach for a reducer because of state complexity, not because of extra renders.
  - id: sirisha-wealth.3f
    label: "3f"
    topic: "React Hooks"
    title: "Can a custom hook that wraps useReducer act as a shared/global store across components (like Redux)? If Component A updates state through it, will Component B see the update?"
    body: |
      #### Short answer

      No. A useReducer inside a hook creates state on the fiber of the component that called the hook. CounterA and CounterB both call useCounter and get two independent states. dispatch('inc') in A changes only A. B still shows its own zero. Two calls of the same hook in one component are two states as well.

      Redux is built differently: one store lives outside the components, and both subscribe to it. A wrapper whose name starts with use does not create that store.

      A shared cell appears only when the state lives in one place and the hook reads that place. Lift useReducer to a common parent and pass the value through the Context API, or keep the store in a module and subscribe the components with useSyncExternalStore. Calling useReducer in each component does not share data between them.

      #### Code example

      ```jsx
      import { useReducer } from 'react';

      const reducer = (count, action) => {
        if (action === 'inc') return count + 1;
        return count;
      };

      const useCounter = () => useReducer(reducer, 0);

      const CounterA = () => {
        const [count, dispatch] = useCounter();

        const handleClick = () => {
          dispatch('inc');
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };

      const CounterB = () => {
        const [count] = useCounter();
        return <span>{count}</span>;
      };
      ```

      #### Phrase you can say

      A hook that wraps useReducer is not a shared store. Each call gets its own state, so component B does not see component A's dispatch. Shared state appears when one useReducer lives in a Context API provider, or in an external store with a useSyncExternalStore subscription.
  - id: sirisha-wealth.3g
    label: "3g"
    topic: "React Hooks"
    title: "What are custom hooks, and how/why do you build one?"
    body: |
      #### Short answer

      A custom hook is a function whose name starts with use and that may call other hooks. You use it to extract logic that has state. You share markup with a component. The older way to pass behavior with a wrapper is a HOC: it adds a component around the outside. A hook is called inside and does not add an extra node to the tree.

      You write a hook when two components do the same bundle of state and effects, or when a component is already hard to read. The input is ordinary parameters, like initial on useToggle. You return values and handlers.

      Each call owns its own state. Two calls of useToggle are two independent flags; a shared store does not appear from that. The rules are the same as for the built-in hooks: top level, the same order, not under a condition. A hook can be built from other hooks.

      #### Code example

      ```jsx
      import { useState } from 'react';

      const useToggle = (initial) => {
        const [on, setOn] = useState(initial);

        const handleToggle = () => {
          setOn((value) => !value);
        };

        return { on, handleToggle };
      };

      const Panel = () => {
        const { on, handleToggle } = useToggle(false);

        return (
          <button type="button" onClick={handleToggle} aria-pressed={on}>
            {on ? 'on' : 'off'}
          </button>
        );
      };
      ```

      #### Phrase you can say

      A custom hook is a useSomething function that calls hooks and returns data and actions. You use it to share logic that has state, without an extra HOC and without copying. Each call keeps its own state; a shared store does not appear by itself.
  - id: sirisha-wealth.4a
    label: "4a"
    topic: "State Management — Redux & Context API"
    title: "What middleware have you used with Redux (Thunk, awareness of Saga), and what do middlewares do in Redux?"
    body: |
      #### Short answer

      Middleware in Redux is the layer between dispatch and the reducer. The shape is store => next => action. You see the action and getState, you can go to the network, write a log, stop the action, or call next(action) to pass it on. The reducer stays a pure function. Side effects live in middleware. applyMiddleware builds the chain, and the first middleware in the list sees the dispatch first.

      For async loading you rely on Thunk. It allows you to dispatch a function. The function receives dispatch and getState, runs fetch, and then dispatches plain objects: loading, loaded, or failed. In Redux Toolkit, thunk is already part of configureStore, and createAsyncThunk packs those same steps into one described request.

      You know Redux Saga at the level of the model, and you do not claim production ownership of it unless you actually ran it. It is middleware built on generators. A watcher does yield take, call for a promise, and put for the next action. The middleware executes those effect objects. Saga fits a long-running flow, cancellation, and racing requests. Ordinary data loading is covered by Thunk.

      #### Code example

      ```js
      const logger = (store) => (next) => (action) => {
        const result = next(action);
        console.log(action.type, store.getState());
        return result;
      };

      const thunk = (store) => (next) => (action) => {
        if (typeof action === 'function') {
          return action(store.dispatch, store.getState);
        }
        return next(action);
      };

      const fetchPosts = () => async (dispatch) => {
        dispatch({ type: 'posts/loading' });
        const response = await fetch('/api/posts');
        if (!response.ok) {
          dispatch({ type: 'posts/failed' });
          return;
        }
        const posts = await response.json();
        dispatch({ type: 'posts/loaded', posts });
      };

      // applyMiddleware(thunk, logger), then dispatch(fetchPosts())
      ```

      #### Phrase you can say

      Middleware sits between dispatch and the reducer: store => next => action. Effects live there, and the reducer stays pure. For requests I dispatch a thunk function: fetch inside, then plain loading, loaded, and failed actions. I know Saga as generators with take, call, and put, and I call it production experience only if I actually ran it.
  - id: sirisha-wealth.4b
    label: "4b"
    topic: "State Management — Redux & Context API"
    title: "Can Redux's behavior (including middleware) be replicated using the Context API?"
    body: |
      #### Short answer

      You can build the skeleton for a small application. It does not become a ready-made replacement for Redux.

      One useReducer lives in the provider, and the Context API passes state and dispatch down. You write the middleware yourself. A wrapper around dispatch checks whether the action is a function. You call that function as a thunk and pass it dispatch and getState. getState must not stay closed over the state of one render forever: you read it from a ref that you update on every pass. A plain action object goes to the reducer's inner dispatch.

      What the scheme does not give you: react-redux subscribes useSelector to the store and does not render the component when the selected piece is equal to the previous one. The Context API wakes everyone who read the value. DevTools, time travel, and a ready-made Saga would have to be written again: generators have their own effect runner, and one typeof function check does not reproduce it. A theme or a rare flag fits the Context API. For a large store with different subscriptions you keep Redux or another external store.

      #### Code example

      ```jsx
      import React, { useCallback, useMemo, useReducer, useRef } from 'react';

      const StoreContext = React.createContext(null);

      const reducer = (state, action) => {
        if (action.type === 'posts/loaded') {
          return { ...state, posts: action.posts };
        }
        return state;
      };

      const Provider = ({ children }) => {
        const [state, dispatch] = useReducer(reducer, { posts: [] });
        const stateRef = useRef(state);
        stateRef.current = state;

        const dispatchWithMiddleware = useCallback((action) => {
          if (typeof action === 'function') {
            action(dispatchWithMiddleware, () => stateRef.current);
            return;
          }
          dispatch(action);
        }, [dispatch]);

        const value = useMemo(
          () => ({ state, dispatch: dispatchWithMiddleware }),
          [state, dispatchWithMiddleware],
        );

        return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
      };
      ```

      #### Phrase you can say

      Yes, a narrow Redux skeleton fits on the Context API: a provider with useReducer and a dispatch wrapper that runs a thunk and reads getState from a ref. That is not a replacement for Redux. There is no selective useSelector subscription, no DevTools, and no ready-made Saga. A small state fits; I keep a large store in Redux.
  - id: sirisha-wealth.4c
    label: "4c"
    topic: "State Management — Redux & Context API"
    title: "Can Context API replace Redux for global state? When is Context preferred over Redux, and when not?"
    body: |
      #### Short answer

      The Context API can carry a global value, but it is not itself a store. The state still lives in useState or useReducer on the provider. Whoever called useContext is subscribed to the whole value, not to one field.

      Context fits when the value changes rarely and is read far from its owner: theme, locale, the current user, an API client. Props then do not travel through components that do not need that value, and a Redux dependency does not appear.

      Redux fits when updates are frequent, there are many slices, and different screens need different pieces. useSelector re-renders a component when its result changed, even if the rest of the store is noisy. Async middleware and DevTools belong there too. react-redux does put the store in context, and the selector subscription does the comparison of the selected piece. The Context API itself does not do that.

      Theme can live in the Context API, and domain data in Redux. Replace Redux with one context when you need neither frequent selective subscriptions nor middleware.

      #### Phrase you can say

      The Context API delivers a value; it is not a store. For theme, locale, and a rarely changing user it fits better than Redux. For frequent updates, different slices, middleware, and DevTools I keep Redux: useSelector watches a piece, while context wakes everyone who read the value. They live side by side without trouble.
  - id: sirisha-wealth.4d
    label: "4d"
    topic: "State Management — Redux & Context API"
    title: "What's a drawback of Context API? (e.g., consumers re-render on any context value change, even unrelated ones)"
    body: |
      #### Short answer

      The drawback is that the subscription is coarse. Everyone who called useContext on that context re-renders when the value changes under Object.is. A component that read theme still renders when user changed: the new value wakes it too. The Context API has no selector.

      The everyday form of the same cost is an object inline: value={{ user, theme, setUser, setTheme }}. That is a new object on every provider render. Subscribers wake up even when user and theme are the same and the provider rendered for another reason. useMemo on that object removes the false change of reference. It does not split the subscription: once user is actually new, the memoized object is new too, and ThemeLabel renders again.

      Split contexts by data: theme in its own provider, the user in its own. Move frequently changing state into the component that shows it, or into an external store whose subscription can compare a selected piece. React.memo on an intermediate parent does not stop a context consumer: the subscriber updates even if an ancestor bailed out through memo.

      #### Code example

      ```jsx
      import React, { useState } from 'react';

      const AppContext = React.createContext(null);

      const Provider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [theme, setTheme] = useState('light');

        return (
          <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
            {children}
          </AppContext.Provider>
        );
      };

      const ThemeLabel = () => {
        const { theme } = React.useContext(AppContext);
        return <span>{theme}</span>;
      };
      ```

      #### Phrase you can say

      A Context API subscriber re-renders on any new value, even when the field that changed is one it does not read. An inline value={{ ... }} on every provider render wakes everyone even without a data change. I split contexts and keep the value reference stable with useMemo.
  - id: sirisha-wealth.4e
    label: "4e"
    topic: "State Management — Redux & Context API"
    title: "If a custom hook can already maintain shared state across components, why use Context API at all?"
    body: |
      #### Short answer

      For a hook that itself calls useState or useReducer, the premise does not hold. That call creates state on the component that called the hook. IsolatedB, calling the same hook, gets another cell and does not see the click in IsolatedA. Sharing the function import does not merge the cells.

      The Context API is what keeps one cell for a subtree. useState lives in CounterProvider, the provider passes the value pair down, and useSharedCounter only calls useContext. The hook is then a convenient API, and context is the channel to one state. SharedA and SharedB see one number because they stand under one provider. A second provider would give a second number.

      An external module store can be shared too, and then context is not required. Components do not hear about a change on their own: they need a subscription, usually useSyncExternalStore. A module is one per page, it is hard to replace in a test, and you cannot honestly have two independent instances. Two providers give two scopes. That is why context stays next to hooks: the hook reads, and the provider owns one state and limits who sees it.

      #### Code example

      ```jsx
      import React, { useContext, useState } from 'react';

      const useIsolatedCounter = () => useState(0);

      const IsolatedA = () => {
        const [count, setCount] = useIsolatedCounter();

        const handleClick = () => {
          setCount(count + 1);
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };

      const IsolatedB = () => {
        const [count] = useIsolatedCounter();
        return <span>{count}</span>;
      };

      const CounterContext = React.createContext(null);

      const CounterProvider = ({ children }) => {
        const value = useState(0);
        return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
      };

      const useSharedCounter = () => useContext(CounterContext);

      const SharedA = () => {
        const [count, setCount] = useSharedCounter();

        const handleClick = () => {
          setCount(count + 1);
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };

      const SharedB = () => {
        const [count] = useSharedCounter();
        return <span>{count}</span>;
      };

      const Screen = () => {
        return (
          <CounterProvider>
            <SharedA />
            <SharedB />
          </CounterProvider>
        );
      };
      ```

      #### Phrase you can say

      A hook that calls useState or useReducer inside does not share state: each call has its own cell. The Context API is how one state lives in a provider while the hook only reads it through useContext. An external module shares data too, but then you need a useSyncExternalStore subscription, and you do not get a separate scope for one subtree.
  - id: sirisha-wealth.5a
    label: "5a"
    topic: "React Portals"
    title: "What are React Portals?"
    body: |
      #### Short answer

      A portal renders children into another DOM node and keeps them in the same React tree. That is createPortal(children, domNode) from react-dom. Often domNode is document.body or a separate root that is already in the HTML.

      For React, the portal's children stay children of the component that created it. The Context API is readable inside. An event bubbles through the React tree: a parent's onClick runs for a click inside the portal, even though the DOM parent is different.

      In the document the node sits where you passed the second argument, not inside the JSX parent. That is why the parent's overflow does not clip it. CSS inheritance follows the DOM. The portal picks up color and font from the body surroundings unless it sets them itself.

      On the server there is no document. You open the portal on the client, once the target node exists. You do not touch document.body during SSR.

      #### Code example

      ```jsx
      import { createPortal } from 'react-dom';

      const Modal = ({ children }) => {
        return createPortal(<div role="dialog">{children}</div>, document.body);
      };
      ```

      #### Phrase you can say

      A portal is createPortal(children, domNode). The markup lands in another DOM node and stays a child of its component in the React tree. Events and the Context API follow React, and styles inherit through the DOM. A modal can live in body and still be part of the component.
  - id: sirisha-wealth.5b
    label: "5b"
    topic: "React Portals"
    title: "What's a practical use case for them (e.g., modals, tooltips, dropdowns that need to escape parent overflow/z-index)?"
    body: |
      #### Short answer

      The practical case is a layer you cannot leave inside a card: a modal, a tooltip, a dropdown, a toast. The parent often has overflow: hidden. Transform, filter, and opacity create a new stacking context. A descendant with position and a large z-index is still clipped, or it ends up under a header that lives in another context. z-index is compared inside its own context, not against the whole page.

      createPortal to document.body takes the menu out of the card. The parent's clipping and its stacking context no longer apply to that node. The card's state decides whether the menu is open. A click on an item bubbles to the React parent, even if the menu's DOM node is attached to body.

      A portal is unnecessary for a popup whose ancestor does not clip and does not create its own layer. On the portal node itself you set the background, focus, and role: color and font will not inherit from the card.

      #### Code example

      ```jsx
      import { useState } from 'react';
      import { createPortal } from 'react-dom';

      const Menu = ({ open, children }) => {
        if (!open) return null;

        return createPortal(<div role="menu">{children}</div>, document.body);
      };

      const Card = () => {
        const [open, setOpen] = useState(false);

        const handleToggle = () => {
          setOpen((value) => !value);
        };

        return (
          <div style={{ overflow: 'hidden' }}>
            <button type="button" onClick={handleToggle}>
              Menu
            </button>
            <Menu open={open}>
              <button type="button">Edit</button>
            </Menu>
          </div>
        );
      };
      ```

      #### Phrase you can say

      I portal a modal, tooltip, or dropdown to document.body when the parent has overflow or its own stacking context and a z-index inside the card does not save them. Open state stays on the parent, and the click arrives through the React tree. A node in body compares its layer with the page, not with the clipped parent.
  - id: sirisha-wealth.6a
    label: "6a"
    topic: "Micro Frontends / Module Federation"
    title: "Experience with Module Federation"
    body: |
      #### Short answer

      You answer this question from your own experience. You do not drop in someone else's years, company, or numbers. In a minute you name four things, and if a point never happened, you say so.

      Role: you built the host, you wired a remote, or so far you have studied the shape. Stack: Webpack 5 and Module Federation, a host and one remote, shared React through shared and singleton, and Lodash the same way when you needed it. One project in your own words: a shell and a widget that the host loads from the remote entry URL, not from its own bundle. One result, only if it was yours: the widget shipped on its own, and the host was not rebuilt for every one of its releases.

      This text is the frame of what to say. It does not contain a particular person's biography.

      #### Phrase you can say

      I speak from my own Module Federation experience: the role, the host and one remote, and a shared singleton for React. If a widget really shipped in its own deploy, I name that result in my own words. What I did not do, I do not add.
  - id: sirisha-wealth.6b
    label: "6b"
    topic: "Micro Frontends / Module Federation"
    title: "What is a \"remote entry\" in Module Federation?"
    body: |
      #### Short answer

      A remote entry is the small container file that the remote build exposes. In ModuleFederationPlugin it corresponds to name and filename: 'remoteEntry.js'. The host does not put the widget code in its own bundle. It loads that script from the URL in remotes. The string catalog@https://cdn.example.com/catalog/remoteEntry.js means: the container named catalog lives at that address. The name before @ matches the remote build's name, or the host will not find the container.

      ProductList itself is not inside remoteEntry.js. The file holds the Module Federation runtime and the exposes map. The key ./ProductList points at the chunk where the module was built. The host loads the script, calls init with the shared share scope, and on demand calls get('./ProductList'). get returns a module factory, and calling the factory gives the export. The module chunk downloads at that moment, not necessarily together with the remote entry.

      In the host application that is a dynamic import of catalog/ProductList, usually through React.lazy. Until the remote entry script has loaded, or if the name does not match, the module is absent.

      #### Code example

      ```js
      const { ModuleFederationPlugin } = require('webpack').container;

      const remotePlugin = new ModuleFederationPlugin({
        name: 'catalog',
        filename: 'remoteEntry.js',
        exposes: {
          './ProductList': './src/ProductList',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      const hostPlugin = new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          catalog: 'catalog@https://cdn.example.com/catalog/remoteEntry.js',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      // remotePlugin goes into the remote webpack plugins array.
      // hostPlugin goes into the host webpack plugins array.

      const React = require('react');

      const ProductList = React.lazy(() => import('catalog/ProductList'));
      ```

      #### Phrase you can say

      A remote entry is remoteEntry.js, the container manifest, not the widget itself. The host loads it from the URL in remotes, and the name before @ matches the build name. The container then serves the module through exposes, and the host imports it as catalog/ProductList.
  - id: sirisha-wealth.6c
    label: "6c"
    topic: "Micro Frontends / Module Federation"
    title: "If multiple micro-frontends depend on the same library (e.g., Lodash), how do you ensure only a single shared instance loads?"
    body: |
      #### Short answer

      A single instance comes from shared, and the block has to be present on the host and on every remote. If Lodash is listed on only one side, the other side bakes its own copy into a chunk.

      On the package you set singleton: true. After init of the shared share scope, the Module Federation runtime does not load a second copy: the others use the instance that is already provided. requiredVersion sets the semver range this build treats as acceptable. If the loaded version misses the range, the console gets a warning, and there is still one instance. That can be a version the remote did not expect, so the ranges on the host and the remote stay compatible.

      Two copies of Lodash cost extra kilobytes and can diverge in behavior. Two copies of React break hooks: each instance has its own dispatcher. The setting is the same shared block. In code you import the library as a normal module, and you do not ship a second private copy past the plugin.

      #### Code example

      ```js
      const { ModuleFederationPlugin } = require('webpack').container;

      const remotePlugin = new ModuleFederationPlugin({
        name: 'catalog',
        filename: 'remoteEntry.js',
        exposes: {
          './ProductList': './src/ProductList',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      const hostPlugin = new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          catalog: 'catalog@https://cdn.example.com/catalog/remoteEntry.js',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      // remotePlugin goes into the remote webpack plugins array.
      // hostPlugin goes into the host webpack plugins array.

      const React = require('react');

      const ProductList = React.lazy(() => import('catalog/ProductList'));
      ```

      #### Phrase you can say

      I declare Lodash in shared on both the host and the remote, with singleton: true. The runtime keeps one instance in the shared share scope. requiredVersion fixes the expected range: if they disagree there is still one copy, but the console warns, so I align the versions. For React the same flag is what keeps hooks on one dispatcher.
  - id: sirisha-wealth.6d
    label: "6d"
    topic: "Micro Frontends / Module Federation"
    title: "How is this configured (shared, singleton: true, requiredVersion)?"
    body: |
      #### Short answer

      The setting is the shared object on ModuleFederationPlugin. You repeat it in the host build and in the remote build, or the remote ships its own copy. The key is the package name as you import it: lodash. Inside, singleton: true keeps one instance. requiredVersion is the semver range this build was built with, usually from dependencies, for example ^4.17.21. If you pass the package as a string, Webpack can read the version from package.json itself. The explicit object is what shows the three things in the question: shared, singleton, and requiredVersion.

      singleton alone, with a range that does not match, still yields one instance and a warning. strictVersion: true turns that warning into a refusal to accept the other version. You turn the flag on when silently running on another version is worse than stopping the load.

      Who actually ships the file depends on loading. eager: true on the host puts the library in the host's initial chunk, and the remote reuses it. For React you do that so the dispatcher is the host's and is ready before the remote initializes. For Lodash, eager is optional if the copy of whoever loaded first is acceptable. The example below has the fields the question asks about, the same way on remotePlugin and hostPlugin.

      #### Code example

      ```js
      const { ModuleFederationPlugin } = require('webpack').container;

      const remotePlugin = new ModuleFederationPlugin({
        name: 'catalog',
        filename: 'remoteEntry.js',
        exposes: {
          './ProductList': './src/ProductList',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      const hostPlugin = new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          catalog: 'catalog@https://cdn.example.com/catalog/remoteEntry.js',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      // remotePlugin goes into the remote webpack plugins array.
      // hostPlugin goes into the host webpack plugins array.

      const React = require('react');

      const ProductList = React.lazy(() => import('catalog/ProductList'));
      ```

      #### Phrase you can say

      In shared on the host and the remote I write lodash: { singleton: true, requiredVersion: '^4.17.21' }. singleton keeps one instance, and requiredVersion is the range the build requires. The same block is needed on both sides, or the remote brings its own copy of Lodash.
  - id: sirisha-wealth.7a
    label: "7a"
    topic: "Logic/Aptitude Puzzle (not React-specific, but included in the round)"
    title: "Deduce the 3-digit code from the placement/correctness clues."
    body: |
      #### Short answer

      This PDF item gives no clues. It does not list attempts, and it does not say which digit is correct or whether that digit stands in its place. A code cannot be deduced from an empty prompt, and a program cannot be written for it either: there is nothing to derive.

      #### Phrase you can say

      This PDF item has no clues about digits and positions, so I do not deduce a code from it and I do not write a solution.
  - id: sirisha-wealth.8a
    label: "8a"
    topic: "Live Coding Exercise"
    title: "Fetch posts from the JSONPlaceholder API and store them in state"
    body: |
      #### Short answer

      You fetch the posts once after mount: GET https://jsonplaceholder.typicode.com/posts. The response is an array, and each item has id, title, body, and userId. You put that array in useState.

      The request sits in a useEffect with an empty dependency array. Before response.json you check response.ok, or state receives something other than the post list. loading and error sit beside it: an empty array before the response does not mean there are no posts. The effect cleanup is an AbortController. On unmount the request is aborted, and setState of the removed instance is not called. In development Strict Mode runs the effect twice, and abort stops the first pass.

      The search field is not needed at this step. The task is to put the data in state and be able to show a load error.

      #### Code example

      This is a reconstruction of the task, not the candidate's screen: the PDF has no candidate code, so the example follows the written prompt.

      ```jsx
      import { useEffect, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <div>
            {posts.map((post) => (
              <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                {post.title}
              </div>
            ))}
          </div>
        );
      };
      ```

      #### Phrase you can say

      I fetch the JSONPlaceholder posts in a useEffect on mount, check response.ok, and put the array in useState. On unmount I abort the fetch with an AbortController. While the request is in flight the screen shows loading, not an empty list.
  - id: sirisha-wealth.8b
    label: "8b"
    topic: "Live Coding Exercise"
    title: "Implement search/filter on the title field"
    body: |
      #### Short answer

      Search is a controlled field and a filter over the array you already loaded. A new request does not go out on every character: in this task JSONPlaceholder returns the posts once, and title is cut on the client.

      query lives in its own useState. The visible posts are a filter on title. You trim the query and lowercase it, do the same to title, then includes. An empty query leaves every post: searching for an empty substring is true for any title. The letter case of the input does not change the result.

      The field shows query immediately. The list is built from visible, and a tile's key is post.id, not the index. loading and error are still rendered before the list. Hooks, including the useState for query, stay above any return. If no title matches, the list's place gets a short message, not a different data set.

      #### Code example

      This is a reconstruction of the task, not the candidate's screen: the PDF has no candidate code, so the example follows the written prompt.

      ```jsx
      import { useEffect, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        const needle = query.trim().toLowerCase();
        const visible = posts.filter((post) => post.title.toLowerCase().includes(needle));

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Phrase you can say

      I keep query in state and filter the posts already loaded by title: trim, lowercase, includes. An empty query shows every post. This is a client filter, not a new request, and the tile key is post.id.
  - id: sirisha-wealth.8c
    label: "8c"
    topic: "Live Coding Exercise"
    title: "Implement debouncing on the search input"
    body: |
      #### Short answer

      The debounce here is trailing. The field text updates on every character, or typing feels stuck. A different value, debouncedQuery, is what reaches the filter. A useEffect depends on query: it sets a setTimeout of 300 milliseconds and calls clearTimeout in the cleanup. If a character arrives sooner, the old timer is cleared, and state receives the string that survived the pause without changes.

      visible is computed from debouncedQuery, not from query. The list therefore updates after the pause, and the field updates immediately.

      On the hundred JSONPlaceholder posts the filter itself is cheap. You still add the pause: the task asks for it, and the same device is what you need if the filter later becomes a request or a heavy render. 300 milliseconds is a starting value for how the typing feels, not a platform constant.

      #### Code example

      This is a reconstruction of the task, not the candidate's screen: the PDF has no candidate code, so the example follows the written prompt.

      ```jsx
      import { useEffect, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');
        const [debouncedQuery, setDebouncedQuery] = useState('');

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        useEffect(() => {
          const id = setTimeout(() => setDebouncedQuery(query), 300);
          return () => clearTimeout(id);
        }, [query]);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        const needle = debouncedQuery.trim().toLowerCase();
        const visible = posts.filter((post) => post.title.toLowerCase().includes(needle));

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Phrase you can say

      I update the field immediately and pass a debounced string to the filter. A useEffect sets a timer of 300 milliseconds and clears it in the cleanup if query changed in time. The title cut runs on posts already loaded, using the delayed string, and the typing itself does not wait for the timer.
  - id: sirisha-wealth.8d
    label: "8d"
    topic: "Live Coding Exercise"
    title: "Extract the search and debounce logic into separate custom hooks"
    body: |
      #### Short answer

      You split the logic into two hooks, each with its own job. useDebouncedValue stores a delayed copy of the value: inside it, useState and a useEffect with setTimeout and clearTimeout. useFilteredPosts only filters posts by the string it was given. The filter is inside useMemo, so the same posts and the same string do not build a new array. On a hundred items the calculation is cheap; the hook still keeps the title rule in one place and leaves the result reference stable.

      PostSearch connects them and does not mix them. First debouncedQuery = useDebouncedValue(query, 300), then visible = useFilteredPosts(posts, debouncedQuery). The delay is not hidden inside the filter, and both hooks can be read on their own. Both calls are unconditional and stay above the return, next to the other hooks. Loading the posts stays in the component: it is not part of search or debounce.

      #### Code example

      This is a reconstruction of the task, not the candidate's screen: the PDF has no candidate code, so the example follows the written prompt.

      ```jsx
      import { useEffect, useMemo, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const useDebouncedValue = (value, delay) => {
        const [debounced, setDebounced] = useState(value);

        useEffect(() => {
          const id = setTimeout(() => setDebounced(value), delay);
          return () => clearTimeout(id);
        }, [value, delay]);

        return debounced;
      };

      const useFilteredPosts = (posts, query) => {
        return useMemo(() => {
          const needle = query.trim().toLowerCase();
          return posts.filter((post) => post.title.toLowerCase().includes(needle));
        }, [posts, query]);
      };

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');
        const debouncedQuery = useDebouncedValue(query, 300);
        const visible = useFilteredPosts(posts, debouncedQuery);

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Phrase you can say

      I extract two hooks. useDebouncedValue delays the string by 300 milliseconds, and useFilteredPosts filters title with the string that is already delayed. In PostSearch I call both at the top level. Loading the posts does not live in those hooks.
  - id: sirisha-wealth.8e
    label: "8e"
    topic: "Live Coding Exercise"
    title: "Display filtered results below the search box (as tiles/divs rather than a select)"
    body: |
      #### Short answer

      The filtered posts are shown as tiles under the field, not through a select. Under the input there is a container, and each post is its own div. The tile key is post.id, and the text is title. select and option do not meet this task: a native list hides the rows in a dropdown, and the prompt asks to see the results immediately under the field.

      The field is controlled: value is query, so the character is visible immediately. The tiles receive visible, that is the list after useDebouncedValue and useFilteredPosts. While the posts load, the screen shows loading. On a request error, it shows the error text. An empty filter result is not replaced with another control: there are no matching tiles, and their place gets the text No matches.

      The markup below is the same PostSearch, with the request, the pause, and the two hooks already assembled. A tile is an ordinary div with a border, not a select option.

      #### Code example

      This is a reconstruction of the task, not the candidate's screen: the PDF has no candidate code, so the example follows the written prompt.

      ```jsx
      import { useEffect, useMemo, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const useDebouncedValue = (value, delay) => {
        const [debounced, setDebounced] = useState(value);

        useEffect(() => {
          const id = setTimeout(() => setDebounced(value), delay);
          return () => clearTimeout(id);
        }, [value, delay]);

        return debounced;
      };

      const useFilteredPosts = (posts, query) => {
        return useMemo(() => {
          const needle = query.trim().toLowerCase();
          return posts.filter((post) => post.title.toLowerCase().includes(needle));
        }, [posts, query]);
      };

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');
        const debouncedQuery = useDebouncedValue(query, 300);
        const visible = useFilteredPosts(posts, debouncedQuery);

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Phrase you can say

      Under the search field I render a div for each filtered post, with key equal to post.id. I do not use a select: the rows have to be visible immediately, not hidden in a dropdown. The tiles receive the list after the debounce and the title filter.
---

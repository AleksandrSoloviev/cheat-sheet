---
interview: rafeeq-digibank
order: 5
title: "Rafeeq Ansari — DigiBank"
candidate: Rafeeq Ansari
interviewer: Dinakar Narasimha Battula, Satya Siva Sai Harshith Jyothula
initiative: DigiBank
questions:
  - id: "rafeeq-digibank.1a"
    label: "1a"
    topic: "Introduction & Experience"
    title: "Tell me about yourself and your experience."
    body: |
      #### Short answer

      This is a one-to-two minute speaking frame. Take years, the company, and numbers only from your own resume. Do not substitute a biography of a specific person.

      Four beats. Role: a front-end engineer, UI in React. Stack: name only what you have used, for example TypeScript, a state library, the bundler, and tests. One project: the domain and your area, one screen or one module. One measurable result: load time, bundle size, or defect count. If you have no number, name a fact you can defend, and do not invent a percentage.

      #### Phrase you can say

      I am a front-end engineer, and I build the main UI in React. On the last project I owned one module, and I will name the stack from my resume. The result I can show also comes from the resume: a number if I have one, or a fact I can defend. I can walk through how that module was built.
  - id: "rafeeq-digibank.1b"
    label: "1b"
    topic: "Introduction & Experience"
    title: "How much experience do you have in React?"
    body: |
      #### Short answer

      The number of years in React is the number that adds up from the projects on your resume. Do not round it up.

      Say the number, then what those years included: function components and hooks, routing, state, tests. Add one project and one result. If some of those years were class components, say so directly. PureComponent comes up later in the conversation, and a gap between the resume and the answer will show.

      #### Phrase you can say

      I have as many years of commercial React as I can break down by the projects on my resume. Those years included hooks and, if that is true, class components. I will name the last project and one result specifically, without rounding up.
  - id: "rafeeq-digibank.1c"
    label: "1c"
    topic: "Introduction & Experience"
    title: "I see Gulp and esbuild on your resume. Have you worked on the backend too?"
    body: |
      #### Short answer

      Gulp is a task runner: it runs front-end build steps. esbuild is a fast Go transformer and bundler for JavaScript and TypeScript. Builds call it directly. Earlier Vite also relied on esbuild during development. Both tools are about the client build. A server API does not follow from them.

      If you did have backend work, name it separately: the language or platform and one endpoint or service you owned. If you have no server experience, say that. The Gulp and esbuild lines on a resume do not fill that gap.

      #### Phrase you can say

      Gulp and esbuild on my resume are the front-end build, not the backend. I will name server experience separately if I had it: the platform and one task. If I did not, I will say so and come back to the client.
  - id: "rafeeq-digibank.1d"
    label: "1d"
    topic: "Introduction & Experience"
    title: "What is NgRx used for? Did you work in Angular?"
    body: |
      #### Short answer

      NgRx is Angular's state library, shaped like Redux. It has a store, actions, reducers, selectors, and effects. A reducer synchronously computes the next state. An effect listens for an action, does asynchronous work, usually HTTP, and dispatches a new action. A selector reads a slice of the store into the template.

      The packages are tied to Angular's dependency injection and to RxJS. You do not install NgRx in React or Next.js.

      Answer the Angular part from your resume. If it was there, name the years and one area where the store and effects were needed. If NgRx is on the resume, do not deny it and do not move it onto React projects.

      #### Code example

      ```ts
      import { Injectable } from "@angular/core";
      import { createAction, createReducer, on } from "@ngrx/store";
      import { Actions, createEffect, ofType } from "@ngrx/effects";
      import { Observable, map, switchMap } from "rxjs";

      type Client = { firstName: string };

      export const loadClient = createAction("[Client] Load");
      export const loadClientSuccess = createAction<Client>("[Client] Load Success");

      export const clientReducer = createReducer(
        { firstName: "" },
        on(loadClientSuccess, (state, { firstName }) => ({ ...state, firstName })),
      );

      @Injectable()
      export class ClientEffects {
        loadClient$ = createEffect(() =>
          this.actions$.pipe(
            ofType(loadClient),
            switchMap(() => this.api.loadClient()),
            map((client) => loadClientSuccess(client)),
          ),
        );

        constructor(
          private actions$: Actions,
          private api: { loadClient: () => Observable<Client> },
        ) {}
      }
      ```

      `on(loadClientSuccess, ...)` is the synchronous state transition. `createEffect` is the asynchronous call: it waits for the API and dispatches a new action.

      #### Phrase you can say

      NgRx is state for Angular: a store, synchronous reducers, effects for asynchronous calls, and selectors. I do not use it in React. On Angular I will say only what is on my resume: years and one module, or directly that I did not have that experience.
  - id: "rafeeq-digibank.1e"
    label: "1e"
    topic: "Introduction & Experience"
    title: "Do you use NgRx in React or Next.js? Why, and was it a client requirement or actually necessary?"
    body: |
      #### Short answer

      You do not use NgRx in React or Next.js. The library is built for Angular. A client request to "add NgRx" on a React project is usually a confused name. The need behind it is different: shared state and side effects.

      In React, Redux Toolkit covers that: slices, thunks, selectors. Next.js changes nothing. The client store is the same there, and Server Components do not run the `@ngrx/store` package.

      If the client insisted on the name, clarify the need and offer Redux Toolkit. Pulling NgRx into React is not useful as a contract requirement or as a technical decision.

      #### Phrase you can say

      I do not use NgRx in React or Next.js. It is for Angular. If I need shared state and asynchronous calls, on React I use Redux Toolkit. The name NgRx is not required for that, even if a requirement was worded that way.
  - id: "rafeeq-digibank.1f"
    label: "1f"
    topic: "Introduction & Experience"
    title: "So NgRx is used for asynchronous calls, meaning API calls or other async UI operations?"
    body: |
      #### Short answer

      NgRx effects are exactly where asynchronous calls run: they listen for an action, call the API, and dispatch success or failure. It is too early to reduce all of NgRx to that.

      The store holds state. A reducer synchronously moves from an action to the next state. A selector passes data into the template. HTTP lives in the effect, not in the reducer. The reducer stays pure: it does not make a request.

      The precise wording is this. Asynchronous UI calls are the job of effects. NgRx itself is the whole state container, and synchronous transitions belong in it along with the API.

      #### Code example

      ```ts
      import { Injectable } from "@angular/core";
      import { createAction, createReducer, on } from "@ngrx/store";
      import { Actions, createEffect, ofType } from "@ngrx/effects";
      import { Observable, map, switchMap } from "rxjs";

      type Client = { firstName: string };

      export const loadClient = createAction("[Client] Load");
      export const loadClientSuccess = createAction<Client>("[Client] Load Success");

      export const clientReducer = createReducer(
        { firstName: "" },
        on(loadClientSuccess, (state, { firstName }) => ({ ...state, firstName })),
      );

      @Injectable()
      export class ClientEffects {
        loadClient$ = createEffect(() =>
          this.actions$.pipe(
            ofType(loadClient),
            switchMap(() => this.api.loadClient()),
            map((client) => loadClientSuccess(client)),
          ),
        );

        constructor(
          private actions$: Actions,
          private api: { loadClient: () => Observable<Client> },
        ) {}
      }
      ```

      `clientReducer` is the synchronous transition on `loadClientSuccess`. `loadClient$` is the effect: it makes the request and dispatches that action. The effect does not replace the reducer.

      #### Phrase you can say

      Yes. API calls and other asynchronous UI operations in NgRx live in effects. Next to that, the reducer stays synchronous, and a selector reads the store. NgRx is the whole state, not only the HTTP layer.
  - id: "rafeeq-digibank.2a"
    label: "2a"
    topic: "React Component Lifecycle & Rendering"
    title: "Explain the React component lifecycle."
    body: |
      #### Short answer

      The lifecycle is the component appearing in the tree, later renders, and removal. A function component has no class methods. React calls the function itself on every render pass.

      Mounting: the first call, state initialization, DOM creation, then effects after commit. A re-render: the same component type in the same place is called again, stored state is kept, and the DOM is updated in place. That is not a new instance. Unmounting: the node is removed from the tree and effect cleanups run.

      The class names, if they are asked for: `constructor`, `render`, `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`. `render` corresponds to the function body. `componentDidMount` is closer in timing to `useLayoutEffect`: after the DOM write and before paint. `useEffect` with an empty array runs after paint. In concurrent mode React can call the function and discard that pass if a newer update arrives. Effects run only after commit, not after a discarded render.

      #### Phrase you can say

      A component mounts, then it can re-render many times, and at the end it unmounts. In a function component, render is the function body itself. State is initialized once. Calling the function again is a re-render, not a new mount. The effect cleanup runs on unmount.
  - id: "rafeeq-digibank.2b"
    label: "2b"
    topic: "React Component Lifecycle & Rendering"
    title: "You mentioned mount, unmount and render. How do you implement these in React, and what do you use?"
    body: |
      #### Short answer

      You do not call render yourself. The function component body is the render. It should be pure: no requests, no subscriptions, and no DOM writes.

      Mounting, for a side effect, is `useEffect` with an empty dependency array. The function the effect returns is the cleanup. On unmount, React calls it. With `[]`, development Strict Mode can mount the effect, clean it up, and mount it again to find a missing cleanup. That double cycle is not there in production.

      `componentDidMount` runs after the DOM write and before paint: a `setState` from it still makes the same frame. `useEffect` runs after paint. If you need to measure the DOM or adjust it before the frame, use `useLayoutEffect`. Server data is usually loaded in `useEffect`.

      There is no separate command to "turn on unmount". The component is removed when it leaves the tree, its `key` changes, or a different type takes that place. The cleanup is written in the effect.

      #### Code example

      ```tsx
      import { useEffect, useState } from "react";

      const connect = () => ({ close() {} });

      export const Panel = () => {
        const [open, setOpen] = useState(false);

        useEffect(() => {
          const socket = connect();
          return () => {
            socket.close();
          };
        }, []);

        return (
          <button type="button" onClick={() => setOpen(!open)}>
            {open ? "open" : "closed"}
          </button>
        );
      };
      ```

      The `Panel` body is the render. The effect with `[]` opens the connection after the first commit. The returned function closes it on unmount. `setOpen` causes another render and does not run this effect again.

      #### Phrase you can say

      Render is the component body. I do not call it myself. Mount, for an effect, is `useEffect` with an empty array. Unmount is the cleanup that effect returns. Before paint, when I need to make the frame, I use `useLayoutEffect`. `useEffect` runs after paint.
  - id: "rafeeq-digibank.2c"
    label: "2c"
    topic: "React Component Lifecycle & Rendering"
    title: "Conceptually, not just in code, how do you differentiate the mounting phase from the re-render phase?"
    body: |
      #### Short answer

      Mounting creates the component. A re-render calls the same function again and does not create the component from scratch.

      On mount, React runs the function for the first time, takes the initial state, and creates DOM nodes. The `useState(() => ...)` initializer runs only here. Effects start after commit.

      On a re-render the function runs again, so a calculation in the body runs again. Stored state already exists, and the `useState` argument is ignored. React compares the new tree with the previous one and changes the existing nodes. An effect with `[]` does not run again. An effect with dependencies runs its previous cleanup first, then the effect itself, if a dependency changed.

      This is not an unmount and not a new mount. A new mount happens if the `key` or the type in that place changes: state then starts over. A discarded concurrent pass is not a new generation either: effects do not run after it, and its state is not committed.

      #### Code example

      ```tsx
      import { useEffect, useState } from "react";

      export const Clock = () => {
        const [count, setCount] = useState(() => 0);

        useEffect(() => {
          document.title = String(count);
          return () => {
            document.title = "";
          };
        }, [count]);

        return (
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            {count}
          </button>
        );
      };
      ```

      The `() => 0` initializer runs on mount. Each click is a re-render: `count` grows from stored state, not from zero. The effect depends on `count`, so on an update the cleanup runs first, then the new title write. With `[]` this effect would not repeat on a click.

      #### Phrase you can say

      Mount is the first call: state and DOM are created. A re-render calls the same component again, the initial value is no longer read, and the DOM is updated in place. An effect with an empty array stays a mount effect. A new mount happens only when the key or the type changes.
  - id: "rafeeq-digibank.2d"
    label: "2d"
    topic: "React Component Lifecycle & Rendering"
    title: "What scenarios make a component re-render? Apart from props and state, is there anything else?"
    body: |
      #### Short answer

      A component renders again in four clear cases.

      Its own state: `setState` or `dispatch`, if the next value fails `Object.is` with the old one. React skips the same state. Its own props: the parent passed different values.

      Then what does not reduce to this component's props and state. The parent re-rendered: the child function runs again, even if the props are the same, unless the child is wrapped in `React.memo`. Context: `useContext` receives a new provider value. An external store: `useSelector` or a Zustand hook, if the selected snapshot changed by reference.

      `useRef` does not cause a render. Mutating a nested field without changing the reference and without `setState` does not either: the screen just goes stale. Changing `key` is an unmount and a new mount, not an ordinary re-render.

      #### Code example

      ```tsx
      import { createContext, useContext, useState } from "react";

      const ThemeContext = createContext("light");

      export const Child = () => {
        const theme = useContext(ThemeContext);
        return <p>{theme}</p>;
      };

      export const Parent = () => {
        const [tick, setTick] = useState(0);

        return (
          <ThemeContext.Provider value="light">
            <button type="button" onClick={() => setTick(tick + 1)}>
              {tick}
            </button>
            <Child />
          </ThemeContext.Provider>
        );
      };
      ```

      `Child` has no props of its own and no state of its own. A click on `tick` still calls `Child`, because `Parent` rendered. The string `"light"` is the same, so the cause is the parent, not context. A new provider value would be a separate cause. A store subscription works the same way: a change of the selected reference schedules the render.

      #### Phrase you can say

      Besides its own props and state, a component renders again when its parent renders, when its context value changes, and when `useSelector` or Zustand sees a new reference. `useRef` does not schedule a render. A key change is already a new mount.
  - id: "rafeeq-digibank.3a"
    label: "3a"
    topic: "Performance Hooks & Memoization"
    title: "What are the pros and cons of useCallback?"
    body: |
      #### Short answer

      `useCallback(fn, deps)` runs on every render and returns the same function until the dependencies change.

      The plus: a stable reference. A child in `React.memo` needs it, and so do `useEffect` dependencies and `useMemo` dependencies. Fewer extra effects, and fewer broken shallow comparisons.

      The minus: the hook does not cancel the render of the component that called it. The child renders again too if it is not memoized. An incomplete dependency list gives a stale closure. If a dependency is already new on every render, there is no cache, and the code is noisier.

      #### Code example

      ```tsx
      import { useCallback, useState } from "react";

      export const Parent = () => {
        const [count, setCount] = useState(0);
        const onPing = useCallback(() => {
          return "ping";
        }, []);

        return (
          <button type="button" onClick={() => setCount(count + 1)}>
            {count}
            {onPing()}
          </button>
        );
      };
      ```

      `onPing` stays the same function when `count` grows. `Parent` still runs again: the hook is called on every render and returns the cache.

      #### Phrase you can say

      `useCallback` keeps the same function until deps change. That is useful for a memoized child and for an effect's dependencies. The hook does not cancel the parent's render, and without memo on the child a stable reference skips nothing.
  - id: "rafeeq-digibank.3b"
    label: "3b"
    topic: "Performance Hooks & Memoization"
    title: "You said useCallback stops re-renders. Are you sure?"
    body: |
      #### Short answer

      No. `useCallback` does not stop re-renders. It stabilizes the function reference.

      The parent that called `setState` runs again, and the `useCallback` inside it runs too. The child skips a render when both conditions hold: it is wrapped in `React.memo`, or it is a `PureComponent`, and all of its props passed a shallow comparison. A stable callback helps the second condition. By itself it does not protect the child.

      If the other props are new objects every time, `memo` will not bail out even with a stable callback.

      #### Code example

      ```tsx
      import { memo, useCallback, useState } from "react";

      const PlainChild = ({ onPing }: { onPing: () => void }) => {
        return (
          <button type="button" onClick={onPing}>
            Ping
          </button>
        );
      };

      const MemoChild = memo(function MemoChild({ onPing }: { onPing: () => void }) {
        return (
          <button type="button" onClick={onPing}>
            Ping
          </button>
        );
      });

      export const Parent = () => {
        const [count, setCount] = useState(0);
        const onPing = useCallback(() => {
          return "ping";
        }, []);

        return (
          <>
            <button type="button" onClick={() => setCount(count + 1)}>
              {count}
            </button>
            <PlainChild onPing={onPing} />
            <MemoChild onPing={onPing} />
          </>
        );
      };
      ```

      On the click, `Parent` renders again. `PlainChild` does too, even though `onPing` is the same. `MemoChild` skips that render: it is in `memo`, and its only prop is equal to the previous one.

      #### Phrase you can say

      No, I am not sure of that wording. `useCallback` only keeps the function reference. The render is skipped by `React.memo` on the child, and only if that reference and the other props did not change.
  - id: "rafeeq-digibank.3c"
    label: "3c"
    topic: "Performance Hooks & Memoization"
    title: "What are the pros and cons of useCallback and useMemo?"
    body: |
      #### Short answer

      `useCallback` caches a function. `useMemo` caches the result of a calculation. `useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`.

      The shared plus: a stable reference and skipping expensive work while `deps` stay the same. The shared minus: neither hook cancels the render of the current component. Both need an honest dependency list. Both are useless if the dependencies change on every render.

      `useMemo` fits an expensive calculation and an object or array passed as a prop to a memoized child. `useCallback` fits a handler in the same case and a function in an effect's dependencies. Leave a cheap calculation and a normal child's handler without these hooks.

      #### Code example

      ```tsx
          import { useCallback, useMemo, useState } from "react";

          export const Search = ({ items }: { items: string[] }) => {
            const [query, setQuery] = useState("");

            const visible = useMemo(
              () => items.filter((item) => item.includes(query)),
              [items, query],
            );

      const onPick = useCallback((value: string) => {
        setQuery(value);
      }, []);

      return (
        <button type="button" onClick={() => onPick(visible[0] ?? "")}>
          {visible.length}
        </button>
      );
          };
      ```

      `visible` is recomputed when `items` or `query` changes. `onPick` is stable. `Search` itself still renders on `setQuery`. The win appears if `visible` or `onPick` go to a child under `React.memo`, or if the filter is expensive.

      #### Phrase you can say

      `useMemo` remembers a value, `useCallback` remembers a function, and the second is a special case of the first. Neither cancels the render of the component that called them. I put them on an expensive calculation or on a memoized child's prop, not on every handler.
  - id: "rafeeq-digibank.3d"
    label: "3d"
    topic: "Performance Hooks & Memoization"
    title: "So should you use more useCallbacks, or not?"
    body: |
      #### Short answer

      You should not use `useCallback` more often. By default a handler is an ordinary function in the component body.

      Add the hook in two cases. A child in `React.memo` or `PureComponent` receives the function. Or the function sits in the dependencies of `useEffect` or `useMemo`, and without a stable reference the effect would run on every render.

      If the dependencies already change every time, the hook stabilizes nothing. A habit of wrapping every handler makes the code harder to read and hides stale closures. The parent does not render less often because there are more `useCallback` calls.

      #### Phrase you can say

      No, not more often. I leave an ordinary handler as a function. I add `useCallback` when a child in `React.memo` will receive the reference, or when an effect depends on it. It does not change how often this component renders.
  - id: "rafeeq-digibank.3e"
    label: "3e"
    topic: "Performance Hooks & Memoization"
    title: "What are pure components?"
    body: |
      #### Short answer

      A pure component, given the same props and state, renders the same output and does no side effects during render.

      In the class API this is `React.PureComponent`. It implements `shouldComponentUpdate` and shallow-compares props and state. If the top-level references are the same, `render` is not called.

      Purity of the function is a separate requirement: the body does not write to the DOM, send requests, or change outside variables. `PureComponent` does not check that purity. It only skips an extra render by shallow comparison.

      #### Code example

      ```tsx
      import { PureComponent } from "react";

      type Props = { cents: number };

      export class Price extends PureComponent<Props> {
        render() {
          return <span>{this.props.cents}</span>;
        }
      }
      ```

      If the parent passed the same numeric `cents`, the field comparison passes and `render` is not called. React builds a new props object every time, and the fields are what get compared. If the prop itself is a new object with the same number inside, the comparison no longer passes: React does not look deeper.

      #### Phrase you can say

      A pure component, with the same props and state, produces the same output and does no effects in render. In classes that is `PureComponent`: it shallow-compares props and state and can skip render.
  - id: "rafeeq-digibank.3f"
    label: "3f"
    topic: "Performance Hooks & Memoization"
    title: "You worked with class components, which have PureComponent. How does that correlate with functional components?"
    body: |
      #### Short answer

      `PureComponent` is the class mechanism. `React.memo` is a wrapper for a function component. Both skip render by shallow comparison.

      `PureComponent` compares both the instance's props and its state. `React.memo` compares props. A function component's own `setState` still renders it: `memo` does not cut that path.

      You can pass `memo` your own comparison function. It returns `true` when the props are equal and render should be skipped. `shouldComponentUpdate` is the other way around: `true` means "render". `PureComponent` does not take a custom function. It only does a shallow compare, or you write `shouldComponentUpdate` on an ordinary `Component`.

      #### Code example

      ```tsx
      import { PureComponent, memo } from "react";

      export class ClassPrice extends PureComponent<{ cents: number }> {
        render() {
          return <span>{this.props.cents}</span>;
        }
      }

      export const FunctionPrice = memo(function FunctionPrice({ cents }: { cents: number }) {
        return <span>{cents}</span>;
      });
      ```

      #### Phrase you can say

      `PureComponent` for a class compares props and state. `React.memo` for a function compares props. Both comparisons are shallow. Its own setState still re-renders a memoized function. A custom `memo` comparator returns true when the props are equal and it should not render.
  - id: "rafeeq-digibank.3g"
    label: "3g"
    topic: "Performance Hooks & Memoization"
    title: "How do you make a functional component a pure component?"
    body: |
      #### Short answer

      You make a function component pure in two senses. The function body changes nothing outside: the same props produce the same JSX. You cut an extra render from the parent with a `React.memo` wrapper.

      For `memo` to work, the props have to pass a shallow comparison: primitives or stable references. A new object, array, or function on every parent render fails the comparison. Then the component is wrapped, and there is no skipped render.

      A pure body by itself does not cancel a render from the parent. `memo` without a pure body is dangerous the other way: a skipped render will hide an effect someone put in the body.

      #### Code example

      ```tsx
      import { memo } from "react";

      type Item = { id: string; label: string };

      export const List = memo(function List({ items }: { items: Item[] }) {
        return (
          <ul>
            {items.map((item) => (
              <li key={item.id}>{item.label}</li>
            ))}
          </ul>
        );
      });
      ```

      `List` renders only `items`. While the parent passes the same array, `memo` skips render. `items.filter(...)` directly in JSX creates a new array, and the comparison no longer passes.

      #### Phrase you can say

      I keep the body pure: the same input, the same JSX, no requests. On top I wrap it in `React.memo`. I keep props as primitives or stable references, otherwise the shallow comparison will not skip the render.
  - id: "rafeeq-digibank.3h"
    label: "3h"
    topic: "Performance Hooks & Memoization"
    title: "What is React.memo?"
    body: |
      #### Short answer

      `React.memo` is a function that takes a component and returns a component. Before rendering it shallow-compares the previous and next props: `Object.is` on each prop. If all are equal, the component function is not called, and the previous output stays.

      This is a first-level comparison, not a deep walk. Its own state, its own context, and a store subscription still cause a render. The second argument is your comparator: `true` means "the props are equal, do not render".

      #### Code example

      ```tsx
      import { memo } from "react";

      const Price = ({ cents }: { cents: number }) => {
        return <span>{cents}</span>;
      };

      export const MemoPrice = memo(Price);
      ```

      #### Phrase you can say

      `React.memo` wraps a component and shallow-compares props with `Object.is` before calling it. If they are the same, the function is not called. Its own state and context are not cancelled by that check.
  - id: "rafeeq-digibank.3i"
    label: "3i"
    topic: "Performance Hooks & Memoization"
    title: "A normal component also re-renders when a value changes. What does memo do extra?"
    body: |
      #### Short answer

      A normal component is called again when the parent renders, even if the prop values are the same. `memo` adds a check before the call: a shallow comparison of props. If they match, there is no call.

      Beyond that, `memo` does not do deep equality. A new object with the same fields counts as a change. A primitive such as a string is compared by value, so the same string skips the render.

      Its own `useState` inside a memoized component still re-renders it. So does `useContext`: `memo` does not block an update of the context the component subscribes to.

      #### Code example

      ```tsx
      import { memo, useState } from "react";

      const NameChild = memo(function NameChild({ name }: { name: string }) {
        return <p>{name}</p>;
      });

      const UserChild = memo(function UserChild({ user }: { user: { name: string } }) {
        return <p>{user.name}</p>;
      });

      export const Parent = () => {
        const [tick, setTick] = useState(0);

        return (
          <>
            <button type="button" onClick={() => setTick(tick + 1)}>
              {tick}
            </button>
            <NameChild name="Ada" />
            <UserChild user={{ name: "Ada" }} />
          </>
        );
      };
      ```

      On the click, `NameChild` skips render: the `name` prop is the same string. `UserChild` does not skip: `{{ name: "Ada" }}` is a new object on every parent render. The shallow comparison looks at the `user` reference, not the `name` field.

      #### Phrase you can say

      A normal child renders together with the parent. On top of that, `memo` compares props shallowly and skips the call if the references are the same. A new object with the same fields counts as a change. `memo` does not stop its own state or context.
  - id: "rafeeq-digibank.4a"
    label: "4a"
    topic: "JavaScript Fundamentals"
    title: "Do you know deep copy and shallow copy? What are they?"
    note: "He explained afterwards that memo uses a shallow comparison, which is how memo, pure components and shallow copy connect."
    body: |
      #### Short answer

      A shallow copy copies only the top level. The new object or array gets the same nested references. Spread, `Object.assign`, and `slice` work that way. If you change a nested field of the copy, the original changes too: the nested object is shared.

      A deep copy copies nested structures separately. `structuredClone` does that for values the structured clone algorithm can handle. `JSON.parse(JSON.stringify(...))` drops `undefined`, functions, and symbols, turns a `Date` into a string, and throws on cycles.

      The link to `memo` is direct, and that is what the interviewer explained. `React.memo` and pure components compare shallowly: `Object.is` on each top-level prop, with no walk inward. That is the same depth as a shallow copy. The same object reference counts as "nothing changed", even if a field inside was mutated. A new wrapper counts as a change, even if the data inside is the same. So memo, pure components, and shallow copy are one first-level mechanism. React does not do a deep comparison here.

      #### Code example

      ```ts
      const original = { user: { name: "Ada" }, tags: ["a"] };
      const deep = structuredClone(original);
      const shallow = { ...original };

      shallow.tags.push("b");
      shallow.user.name = "Grace";
      deep.user.name = "Lin";
      deep.tags.push("c");
      ```

      `deep` is taken before the mutations. After them, `original.tags` is `["a", "b"]` and `original.user.name` is `"Grace"`: the shallow copy shared those references. `deep.user.name` is `"Lin"`, `deep.tags` is `["a", "c"]`, and the original object does not change from those two assignments.

      #### Phrase you can say

      A shallow copy copies the first level and shares nested references. A deep copy, for example `structuredClone`, copies the nested data separately. `React.memo` and pure components compare shallowly in the same way: the same reference skips render, a new wrapper renders, even if the fields inside match.
  - id: "rafeeq-digibank.5a"
    label: "5a"
    topic: "State Management"
    title: "What are the types of state, and how do you use each one?"
    note: "He clarified he meant a single component, not state across MFEs."
    body: |
      #### Short answer

      The interviewer clarified this: he meant a single component. State across micro-frontends does not belong in this answer.

      One component has four working kinds. Local state is `useState`: this component owns the data, for example whether a panel is open. State with actions is `useReducer`: the next step depends on several fields, and it is convenient to describe it as an action. A derived value is computed in the render body from props and state and is not put in a second `useState`. A ref is `useRef`: a mutable value that should not cause a render by itself, for example a timer id.

      Props are input from the parent. The component reads them and does not store a copy until it needs its own editable value. An API response put into `useState` after a request stays local state of this component.

      #### Phrase you can say

      The question is about a single component, not about state across micro-frontends. I keep local data in `useState`, related transitions in `useReducer`, I compute derived values during render, and I put a timer in `useRef`. I do not copy props into state without a need.
  - id: "rafeeq-digibank.5b"
    label: "5b"
    topic: "State Management"
    title: "What do you use for local state?"
    body: |
      #### Short answer

      Local state is done with `useState`. The initial value is taken on mount. The setter changes state and schedules a render if the new value is not `Object.is` with the old one.

      Several related fields, where it is easy to update one and forget another, are better given to `useReducer`. While the fields are independent, a separate `useState` for each is simpler. Redux and Zustand are not connected for state that lives only in this component and is needed by nobody outside.

      #### Code example

      ```tsx
      import { useState } from "react";

      export const NameField = () => {
        const [name, setName] = useState("");

        return (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        );
      };
      ```

      #### Phrase you can say

      I do local state with `useState`. One field, one hook. If the transitions are related and it is easy to forget a piece, I use `useReducer`. I do not bring in Redux for one component's state.
  - id: "rafeeq-digibank.5c"
    label: "5c"
    topic: "State Management"
    title: "Have you used Zustand? Have you used Zod?"
    body: |
      #### Short answer

      Zustand and Zod solve different jobs. Answer from the resume and do not claim a library that was not there.

      Zustand is a small store. A hook subscribes a component to a selected piece. A Provider is not required. The state lives in the module.

      Zod is a schema library. It checks and parses unknown data at the boundary: an API response, a form, query parameters. A type is inferred from the schema. Zod does not store UI state.

      You put them side by side when that is needed: Zod parses the response, and the result goes into `useState` or Zustand. One library does not replace the other.

      #### Phrase you can say

      Zustand is a client store, if the project had it. Zod is schemas at the boundary: parse an API response and get a type. Those are different jobs. If I did not use one of them, I will say so.
  - id: "rafeeq-digibank.5d"
    label: "5d"
    topic: "State Management"
    title: "What's the difference between Zustand and Redux? Which is better, and what are the pros and cons?"
    body: |
      #### Short answer

      Zustand is shorter. The store is created with `create`, updates go through `set`, and the subscription is a hook with a selector. Several small stores are a normal shape. There are no separate actions and reducers. A Provider is not required.

      Redux is one store, actions, pure reducers, and a middleware chain. Redux Toolkit removes most of the boilerplate: `createSlice`, `configureStore`, `createAsyncThunk`. Its strength is an explicit action log, DevTools, and a convention for a large team. Zustand can take middleware too, but the set around Redux is wider and more familiar.

      There is no winner for every case. A small client store is faster to build with Zustand. Several domains, asynchronous flows, and a shared team style usually go to Redux Toolkit. Both can read a slice and avoid rendering a component because of an unrelated field, if the selector returns a stable reference.

      #### Code example

      ```ts
      import { create } from "zustand";
      import { configureStore, createSlice } from "@reduxjs/toolkit";

      type CounterState = { count: number; inc: () => void };

      export const useCounter = create<CounterState>((set) => ({
        count: 0,
        inc: () => set((state) => ({ count: state.count + 1 })),
      }));

      const counterSlice = createSlice({
        name: "counter",
        initialState: { count: 0 },
        reducers: {
          inc(state) {
            state.count += 1;
          },
        },
      });

      export const store = configureStore({
        reducer: { counter: counterSlice.reducer },
      });
      ```

      The upper store is Zustand: the state and `inc` sit together. The lower one is Redux Toolkit: `inc` is described as a reducer, and the store is assembled separately. Both increment `count` synchronously.

      #### Phrase you can say

      Zustand is a short store without a Provider, updated through `set`. Redux is one store, actions and reducers; with Toolkit that is slices and thunks. I take small state to Zustand and large team state to Redux Toolkit. Both read a slice with a selector.
  - id: "rafeeq-digibank.5e"
    label: "5e"
    topic: "State Management"
    title: "In your experience, which is better: Redux or Zustand? I'm asking about Zustand, not useContext."
    body: |
      #### Short answer

      The question is about Zustand and Redux. Do not put `useContext` into this answer.

      I choose by the size of the task. Redux Toolkit when there are many domains and you need slices, middleware, and an action trace in DevTools. Zustand when the store is small and a log of every action is not needed. A banking shell with several teams more often standardizes on Redux. An internal store of one screen more often fits in Zustand.

      "Better" here means fitting the size, not a slogan. Both choices can be defended on a concrete store.

      #### Phrase you can say

      On a large shell with several domains I use Redux Toolkit: slices, middleware, DevTools. On a small store I use Zustand. I do not put `useContext` here: the question is about Zustand.
  - id: "rafeeq-digibank.5f"
    label: "5f"
    topic: "State Management"
    title: "What do you use for synchronous operations?"
    body: |
      #### Short answer

      Synchronous transitions are done by a reducer in Redux and by `set` in Zustand. `dispatch` of a plain action runs the reducer immediately, before `dispatch` returns. `set` in Zustand also writes the next state immediately.

      An API request does not go in the reducer. A reducer is pure and synchronous: it receives the current state and an action and returns the next one. The asynchronous step lives outside, in a thunk or in a Zustand function, and only then calls a synchronous `dispatch` or `set` with the finished data.

      #### Code example

      ```ts
      import { createSlice, type Dispatch } from "@reduxjs/toolkit";
      import { create } from "zustand";

      const counterSlice = createSlice({
        name: "counter",
        initialState: { count: 0 },
        reducers: {
          inc(state) {
            state.count += 1;
          },
        },
      });

      export const bumpRedux = (dispatch: Dispatch) => {
        dispatch(counterSlice.actions.inc());
      };

      type Box = { count: number; inc: () => void };

      export const useBox = create<Box>((set) => ({
        count: 0,
        inc: () => set((state) => ({ count: state.count + 1 })),
      }));
      ```

      `bumpRedux` returns only after the reducer has written `count`. `useBox.inc` is synchronous too: the next `getState` already sees the new number. HTTP does not belong here.

      #### Phrase you can say

      I update state synchronously with a reducer or with `set` in Zustand. `dispatch` of a plain action finishes immediately. An API request lives outside and then dispatches data that is already ready.
  - id: "rafeeq-digibank.5g"
    label: "5g"
    topic: "State Management"
    title: "Do you use slices?"
    body: |
      #### Short answer

      Yes. In Redux Toolkit a domain is described by a slice. `createSlice` takes `name`, `initialState`, and `reducers`. The output is a reducer and action creators. Inside the reducer you can write assignments: Immer turns them into an immutable update. Outside, state is not mutated.

      Slices are assembled in `configureStore` by key. One slice is one area, for example `profile` or `accounts`. A component reads a slice through `useSelector`, not through a direct import of the state.

      #### Code example

      ```ts
      import { configureStore, createSlice } from "@reduxjs/toolkit";

      const profileSlice = createSlice({
        name: "profile",
        initialState: { firstName: "", city: "" },
        reducers: {
          rename(state, action: { payload: string }) {
            state.firstName = action.payload;
          },
        },
      });

      export const store = configureStore({
        reducer: { profile: profileSlice.reducer },
      });

      export const { rename } = profileSlice.actions;
      ```

      The `state.firstName` assignment is safe only inside the reducer: that is an Immer draft. `rename` is the action creator dispatched from a component.

      #### Phrase you can say

      Yes, I use Redux Toolkit slices. `createSlice` gives a name, initial state, reducers, and ready-made actions. In `configureStore` I put them under keys. In a component I read the key I need through `useSelector`.
  - id: "rafeeq-digibank.5h"
    label: "5h"
    topic: "State Management"
    title: "Is Redux synchronous or asynchronous?"
    body: |
      #### Short answer

      The Redux core is synchronous. A reducer is a pure synchronous function. `dispatch` of a plain action updates the store before `dispatch` returns.

      Asynchrony is added by middleware. A thunk lets you dispatch a function: inside it there is `await`, and plain `pending`, `fulfilled`, or `rejected` actions go out afterwards. The reducer handles those actions synchronously again. Saga and Observable are other middleware for streams. The core does not become asynchronous because of them.

      So the answer to "synchronous or asynchronous" is: Redux itself is synchronous, and asynchronous code lives in the middleware around it.

      #### Code example

      ```ts
      import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

      export const loadProfile = createAsyncThunk("profile/load", async (id: string) => {
        const response = await fetch("/api/profile/" + id);
        return response.json() as Promise<{ firstName: string }>;
      });

      const profileSlice = createSlice({
        name: "profile",
        initialState: { firstName: "", status: "idle" },
        reducers: {
          rename(state, action: { payload: string }) {
            state.firstName = action.payload;
          },
        },
        extraReducers: (builder) => {
          builder.addCase(loadProfile.fulfilled, (state, action) => {
            state.firstName = action.payload.firstName;
            state.status = "ready";
          });
        },
      });
      ```

      `rename` is synchronous: state changes inside `dispatch`. `loadProfile` is a thunk with `await`. The reducer for `fulfilled` is synchronous too; it only writes the name that has already arrived.

      #### Phrase you can say

      Redux is synchronous: the reducer finishes before `dispatch` returns. I put an asynchronous request in a thunk. When the data arrives, the thunk dispatches a plain action, and its reducer is synchronous again.
  - id: "rafeeq-digibank.5i"
    label: "5i"
    topic: "State Management"
    title: "How do you get data from Redux into your component?"
    body: |
      #### Short answer

      Data from Redux is read with `useSelector`. The selector receives state and returns the piece you need. The component subscribes to the store. By default the result is compared with `===`. A new reference schedules a render, the same reference does not.

      Writing to the store is `useDispatch` and the action creator from the slice. Do not select the whole state: replacing the root renders on any action. A selector that builds a new object or array on every call also always renders, because the result reference is new every time.

      #### Code example

      ```tsx
      import { useDispatch, useSelector } from "react-redux";

      type State = { counter: { count: number } };

      const inc = () => ({ type: "counter/inc" });

      export const Counter = () => {
        const count = useSelector((state: State) => state.counter.count);
        const dispatch = useDispatch();

        return (
          <button type="button" onClick={() => dispatch(inc())}>
            {count}
          </button>
        );
      };
      ```

      `count` is a number. Until the reducer replaces it, `===` matches and there is no extra render. If you return the whole `state.counter`, any field change inside that object that replaced the object will re-render the component.

      #### Phrase you can say

      In a component I take `useSelector` and return the field I need from it. I write to the store through `useDispatch`. If the selector creates a new object every time, the component will render on any action, even when the data is the same.
  - id: "rafeeq-digibank.5j"
    label: "5j"
    topic: "State Management"
    title: "What does useReducer do?"
    body: |
      #### Short answer

      `useReducer(reducer, initialState)` returns the current state and `dispatch`. `dispatch` sends an action to the reducer. The reducer synchronously returns the next state. React schedules a render if the result is not `Object.is` with the old one.

      This is a local mechanism of one component and of the children you passed `dispatch` to. A second `useReducer` call in another component gets its own state. There is no shared store here, as there is with Redux.

      You use it when there are several transitions and the next state depends on the whole previous state. One independent field is simpler left in `useState`.

      #### Code example

      ```tsx
      import { useReducer } from "react";

      type State = { count: number };
      type Action = { type: "inc" } | { type: "add"; amount: number };

      const reducer = (state: State, action: Action): State => {
        switch (action.type) {
          case "inc":
            return { count: state.count + 1 };
          case "add":
            return { count: state.count + action.amount };
          default:
            return state;
        }
      };

      export const Counter = () => {
        const [state, dispatch] = useReducer(reducer, { count: 0 });

        return (
          <button type="button" onClick={() => dispatch({ type: "inc" })}>
            {state.count}
          </button>
        );
      };
      ```

      #### Phrase you can say

      `useReducer` holds local state and changes it through `dispatch` and a pure reducer. It is not a shared Redux store: each call has its own state. I use it when there are several actions and one field in `useState` is already getting confused.
  - id: "rafeeq-digibank.6a"
    label: "6a"
    topic: "Application Performance Optimization"
    title: "What precautions or steps do you take while building an application to optimize it?"
    body: |
      #### Short answer

      At build time I check that the browser receives a production build: minification, tree shaking, and hashes in file names. I cut heavy routes and widgets into separate chunks with a dynamic `import` and `React.lazy`, so the first screen does not pull the whole account area.

      Then I look at the bundle with an analyzer and remove a second copy of a library and barrel imports that break tree shaking. I keep images at the size that is needed. Response compression, Brotli or gzip, is turned on at the server that serves the static files. I do not publish source maps outside.

      Render memoization is a separate layer. It does not shrink what was downloaded when the page opened.

      #### Code example

      ```tsx
      import { lazy, Suspense } from "react";

      const Statements = lazy(() => import("./Statements"));

      export const StatementsRoute = () => {
        return (
          <Suspense fallback={<p>Loading statements</p>}>
            <Statements />
          </Suspense>
        );
      };
      ```

      #### Phrase you can say

      I build a production bundle, split routes with `React.lazy`, check the contents with an analyzer, and do not ship second copies of libraries. The server serves compression. I do not put source maps outside.
  - id: "rafeeq-digibank.6b"
    label: "6b"
    topic: "Application Performance Optimization"
    title: "Which bundler do you use?"
    note: "You said Vite. He then asked whether it was already implemented in your project."
    body: |
      #### Short answer

      Name the bundler the project builds with today. In this conversation the candidate said Vite. The next question was different: whether it was already implemented in the project, not whether you know the tool.

      For a long time Vite worked like this: native ESM and transforms through esbuild in development, and Rollup built the production bundle. In Vite 8 both steps are replaced by Rolldown, and transforms by Oxc. Name the version from the repository.

      "I have used Vite" and "this repository already builds with Vite" are different answers. If the project is still on Webpack, Rsbuild, or a direct esbuild call, say that. Do not claim a migration that is not in the repository.

      #### Phrase you can say

      The bundler I will name is Vite. In development it is a fast dev server, and in Vite 8 production is built by Rolldown. I will also say whether it is already implemented in this project: if the build is still on another tool, I will name that tool, not a migration plan.
  - id: "rafeeq-digibank.6c"
    label: "6c"
    topic: "Application Performance Optimization"
    title: "Do you know Rsbuild? Do you know Rspack?"
    note: "These names are garbled in the transcript, but Rsbuild and Rspack fit the context."
    body: |
      #### Short answer

      The names in the transcript are garbled. Rsbuild and Rspack fit the context, and those are the ones to know.

      Rspack is a Rust bundler. The configuration is close to Webpack: loaders, plugins, including Module Federation. Rsbuild is the build tool on top of Rspack. It gives application defaults, a dev server, and official plugins, for example React, so you do not hand-write an Rspack config. Rspack is used in development and in production, so behavior is closer between those modes than with ESM in dev and a separate bundler in prod.

      Answer the question in two parts. Rspack is the bundler itself. Rsbuild is the wrapper an application usually uses.

      #### Code example

      ```ts
      import { defineConfig } from "@rsbuild/core";
      import { pluginReact } from "@rsbuild/plugin-react";

      export default defineConfig({
        plugins: [pluginReact()],
        tools: {
          rspack: {
            output: {
              filename: "[name].[contenthash].js",
            },
          },
        },
      });
      ```

      `defineConfig` and `pluginReact` are the Rsbuild layer. The `tools.rspack` object is configuration of the Rspack bundler itself.

      #### Phrase you can say

      If the names sound garbled, I check Rsbuild and Rspack. Rspack is a Rust bundler, close to Webpack. Rsbuild is the application build on top of it, with a dev server and plugins. In an app I usually sit on Rsbuild and extend the Rspack config when I need to.
  - id: "rafeeq-digibank.7a"
    label: "7a"
    topic: "Security"
    title: "What security concerns apply to React, and how do you handle them?"
    body: |
      #### Short answer

      The main risk of a React UI is XSS. React escapes text in JSX and puts it in a text node. HTML from a string that reaches the DOM by bypassing that is no longer escaped. Writing to `innerHTML` through a ref and a link with an unexpected protocol belong there too.

      Secrets and tokens do not go into the client bundle. Dependencies are pinned with a lockfile. If the session is in a cookie, the cookie has `HttpOnly` and `SameSite`, and API mutations are protected from CSRF on the server: React does not do that for the application. Page script can read `localStorage`, so the session does not go there when the threat model forbids it. Content-Security-Policy limits where a script can run from, and it stays a defense even if a string gets through somewhere.

      #### Phrase you can say

      In React I leave user text as text and do not put HTML into the DOM without sanitizing it. Secrets do not get into the bundle. I keep the session in an HttpOnly cookie, the server closes CSRF, and CSP sits on top.
  - id: "rafeeq-digibank.7b"
    label: "7b"
    topic: "Security"
    title: "How do you prevent XSS?"
    body: |
      #### Short answer

      XSS is running someone else's script in your site's origin. React already has the basic prevention: `{value}` in JSX becomes a text node, and `<` is not parsed as HTML.

      The holes appear where that is bypassed: `dangerouslySetInnerHTML`, `element.innerHTML` in a ref, CMS HTML without sanitizing. For such strings, a sanitizer comes first, for example DOMPurify, and only then a write to the DOM. In a link, keep the `http` and `https` protocols, and do not count on every React version cutting off `javascript:` by itself. A Content-Security-Policy with a tight `script-src` stops inline execution even if a string gets through.

      `HttpOnly` stops a script from reading the cookie. A successful XSS can still make requests as the user, so input is not executed as HTML.

      #### Code example

      ```tsx
      import DOMPurify from "dompurify";

      export const Comment = ({ comment }: { comment: string }) => {
        return <p>{comment}</p>;
      };

      export const CommentHtml = ({ html }: { html: string }) => {
        const clean = DOMPurify.sanitize(html);
        return <div dangerouslySetInnerHTML={{ __html: clean }} />;
      };
      ```

      `Comment` is safe for any string: tags stay text. `CommentHtml` already parses HTML. Without `DOMPurify.sanitize` that write would be direct XSS. If HTML is not needed, the second component is not written.

      #### Phrase you can say

      I render a user string as text in JSX: React escapes it. I put HTML into the DOM only after a sanitizer. I limit links to http and https, and I keep CSP on top.
  - id: "rafeeq-digibank.7c"
    label: "7c"
    topic: "Security"
    title: "Do you know dangerouslySetInnerHTML?"
    note: "He noted it should be avoided."
    body: |
      #### Short answer

      `dangerouslySetInnerHTML` is the prop that writes a string into `innerHTML`. React does not escape it and does not sanitize it. The name dangerous is literal.

      It should be avoided. The interviewer specifically noted that it should be avoided, and the answer should start there. User and editorial text is rendered as text, through `{value}`.

      If the product really requires HTML, the string goes through a sanitizer first, and the area is limited with CSP. Without sanitizing, the string can contain a handler or a `script`. The same risk sits on a `ref` if you manually write `element.innerHTML`.

      #### Code example

      ```tsx
      export const SafeText = ({ value }: { value: string }) => {
        return <p>{value}</p>;
      };

      export const RawHtml = ({ html }: { html: string }) => {
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      };
      ```

      `SafeText` is the normal path. `RawHtml` is the prop to avoid: React will insert `html` as markup. The answer names the refusal first, not ways to use it.

      #### Phrase you can say

      I know it. `dangerouslySetInnerHTML` writes a string into innerHTML and bypasses React's escaping. I avoid it and render data as text. I allow HTML only after a sanitizer and together with CSP.
  - id: "rafeeq-digibank.8a"
    label: "8a"
    topic: "TypeScript"
    title: "Do you know TypeScript?"
    body: |
      #### Short answer

      TypeScript is a type system on top of JavaScript. Take the years from your resume, do not invent them. Say where you use it: component props, API responses, slices.

      It is worth being able to show an interface and a `type`, a union and narrowing, a generic, utility types such as `Partial` and `Omit`, and `strictNullChecks`. Do not offer `any` as a way to silence an error. At the API boundary, do not assert a type with `as`: parse the data with a check or a schema, and get the type from that parse.

      #### Phrase you can say

      Yes, I use TypeScript on props, on API responses, and on state. I can show interfaces, unions, generics, `Partial`, and `Omit`. I will name the years from my resume. I do not offer `any` or a bare `as` on network data.
  - id: "rafeeq-digibank.8b"
    label: "8b"
    topic: "TypeScript"
    title: "A person object has personal details and job details, each with its own interface. Without creating a new duplicate type, how do you use both interfaces to type the person object?"
    note: "This points to intersection types (&) or extends."
    body: |
      #### Short answer

      A new type with the fields rewritten is not needed. Two existing interfaces are combined with an intersection or with `extends`.

      Intersection: `type Person = PersonalDetails & JobDetails`. A `Person` value must have the fields of both. `&` works for an `interface` and for a `type`.

      `extends`: `interface Person extends PersonalDetails, JobDetails {}`. For interfaces this is the same field merge, and the list is not written again. A type alias has no `extends` keyword, so `&` stays there. An interface cannot extend an arbitrary union, so a union uses an intersection.

      Both options are what the question points at. Do not offer a duplicate type where `firstName` and `title` are declared by hand a second time.

      #### Code example

      ```ts
      interface PersonalDetails {
        firstName: string;
        lastName: string;
      }

      interface JobDetails {
        title: string;
        department: string;
      }

      type Person = PersonalDetails & JobDetails;

      interface EmployedPerson extends PersonalDetails, JobDetails {}

      const person: Person = {
        firstName: "Ada",
        lastName: "Lovelace",
        title: "Engineer",
        department: "Payments",
      };
      ```

      `Person` through `&` and `EmployedPerson` through `extends` require the same four fields. Neither copies the field list into a new handwritten declaration.

      #### Phrase you can say

      I type the person object with the intersection `PersonalDetails & JobDetails`, or with an interface that `extends` both. I do not rewrite the fields. For a type alias I use `&`, and for an interface I can use `extends`.
  - id: "rafeeq-digibank.8c"
    label: "8c"
    topic: "TypeScript"
    title: "A personal-details type has first, middle and last name. You only want some of these fields, and middle name shouldn't be mandatory. How do you type that without marking fields optional, using utility types or generics?"
    note: "You mentioned Omit. He also pointed to Partial."
    body: |
      #### Short answer

      You do not write `middleName?:` by hand. Utility types keep the subset of fields, and `Partial` removes the requirement.

      `Omit` was the name given. `Omit<PersonalDetails, "lastName">` removes the last name and keeps first and middle, and both stay required. That answers "only some of the fields". `Omit` alone is not enough for the second half of the question: it does not make the middle name optional.

      The interviewer pointed at `Partial`. `Partial<PersonalDetails>` makes every field optional, including the middle name, and does not force you to write `?` by hand. It does not drop the last name while doing that.

      Together: `Partial<Omit<PersonalDetails, "lastName">>` removes the last name and lifts the requirement on what remains, so the middle name is not required. If first and last name must stay required and only the middle name is optional: `Omit<PersonalDetails, "middleName"> & Partial<Pick<PersonalDetails, "middleName">>`. Both constructions use `Omit` and `Partial`.

      #### Code example

      ```ts
      interface PersonalDetails {
        firstName: string;
        middleName: string;
        lastName: string;
      }

      type SomeNames = Partial<Omit<PersonalDetails, "lastName">>;

      type NameWithOptionalMiddle = Omit<PersonalDetails, "middleName"> &
        Partial<Pick<PersonalDetails, "middleName">>;

      const shortName: SomeNames = { firstName: "Ada" };
      const fullName: NameWithOptionalMiddle = {
        firstName: "Ada",
        lastName: "Lovelace",
      };
      ```

      `SomeNames` does not contain `lastName`, and `firstName` and `middleName` are optional in it. `NameWithOptionalMiddle` requires first and last name. The middle name can be omitted: it was added through `Partial`, not through a handwritten `middleName?:`.

      #### Phrase you can say

      I take some of the fields with `Omit`, and I lift the middle-name requirement with `Partial`, without a handwritten `?`. `Omit` alone is not enough: it drops keys, but it does not make a field optional. `Partial<Omit<PersonalDetails, "lastName">>` leaves the first name and an optional middle name.
  - id: "rafeeq-digibank.9a"
    label: "9a"
    topic: "Redux Re-render Optimization (scenario)"
    title: "You store an API response in Redux and read it with useSelector. Will the component re-render when the data changes?"
    body: |
      #### Short answer

      Yes, when what the selector returned changes. `useSelector` subscribes the component to the store and by default compares the previous and next result with `===`. A new response object in the store causes a render. Another field the selector does not return does not cause a render, while the result reference stays the same.

      If the selector creates an object or array on every call, the reference is always new. Then the component renders on any `dispatch`, even when the data you need is the same. Selecting the whole API response means: any change of that response that replaced its object will re-render the component.

      #### Code example

      ```tsx
      import { useSelector } from "react-redux";

      type State = {
        profile: {
          personal: { firstName: string };
          address: { city: string };
        };
      };

      export const PersonalCard = () => {
        const personal = useSelector((state: State) => state.profile.personal);
        return <p>{personal.firstName}</p>;
      };
      ```

      Replacing `personal` with a new object re-renders the card. Replacing `address` does not, if the `personal` reference stayed the same. The selector `state => state.profile` loses that distinction: any new `profile` becomes a new reference.

      #### Phrase you can say

      It re-renders if the selector returned a new reference. I select the piece the component needs, not the whole response. A new object from the selector on every call forces a render even when the data is the same.
  - id: "rafeeq-digibank.9b"
    label: "9b"
    topic: "Redux Re-render Optimization (scenario)"
    title: "You filter and sort that data, and the component only uses one part of it, such as personal details. How do you stop it re-rendering when other parts change, like bank details or address? Use Redux Toolkit or any other way."
    note: "His hint was that Redux Toolkit has a function for this, which points to createSelector and memoized selectors."
    body: |
      #### Short answer

      The component needs a stable selector result. A filter and a sort inside a plain `useSelector` return a new array on every call, and the reference comparison always fails. The component renders even when bank details or the address changed.

      Redux Toolkit has `createSelector` for this. These are memoized selectors. The interviewer's hint about a Toolkit function points here. Input selectors read pieces of state. The result function runs again only when those inputs changed by reference. While `personal` is the same object, `createSelector` returns the previous array, `useSelector` sees the same reference, and no render is scheduled. A change to `address` or `bank` that did not replace `personal` does not render the personal-details component.

      `createSelector` has a cache for one argument set. For a selector with no parameters, one function per module fits. A new object written directly in `useSelector` bypasses that memory.

      #### Code example

      ```tsx
      import { createSelector } from "@reduxjs/toolkit";
      import { useSelector } from "react-redux";

      type State = {
        profile: {
          personal: { firstName: string; lastName: string };
          bank: { iban: string };
          address: { city: string };
        };
      };

      const selectPersonal = (state: State) => state.profile.personal;

      const selectPersonalView = createSelector([selectPersonal], (personal) => {
        return [personal.lastName, personal.firstName].sort();
      });

      export const PersonalCard = () => {
        const view = useSelector(selectPersonalView);
        return <p>{view.join(", ")}</p>;
      };
      ```

      `sort` runs on a new two-string array and does not mutate state. While `selectPersonal` returns the same reference, `selectPersonalView` returns the previous array. A change to `bank` or `address` does not reach this card.

      #### Phrase you can say

      I move the filter and the sort into `createSelector` from Redux Toolkit. That is a memoized selector: a new array is computed only when the inputs change, for example the personal details. An address change with the same `personal` keeps the same reference, and `useSelector` does not schedule a render.
  - id: "rafeeq-digibank.9c"
    label: "9c"
    topic: "Redux Re-render Optimization (scenario)"
    title: "If not Redux Toolkit, how would you solve it with plain React concepts?"
    body: |
      #### Short answer

      Without Redux Toolkit, the render is cut off at the subscription, before the component is called.

      The selector returns the personal-details object already stored in the store: `(state) => state.profile.personal`. Until the reducer replaces `personal`, the reference is the same, and an address change does not render the component. If you need to build an object from fields, pass `shallowEqual` from `react-redux` as the second argument of `useSelector`. It compares the result's keys. The same `firstName` and `lastName` means no render.

      `useMemo` does not replace this subscription: it runs already inside the render. `React.memo` on this component does not unsubscribe it from the store either. The subscription is inside it, and the parent has nothing to do with it.

      #### Code example

      ```tsx
      import { shallowEqual, useSelector } from "react-redux";

      type State = {
        profile: {
          personal: { firstName: string; lastName: string };
          address: { city: string };
        };
      };

      export const FromStore = () => {
        const personal = useSelector((state: State) => state.profile.personal);
        return <p>{personal.firstName}</p>;
      };

      export const Picked = () => {
        const name = useSelector(
          (state: State) => ({
            firstName: state.profile.personal.firstName,
            lastName: state.profile.personal.lastName,
          }),
          shallowEqual,
        );

        return <p>{name.firstName}</p>;
      };
      ```

      `FromStore` compares the `personal` reference. `Picked` creates an object every time, and `shallowEqual` looks at the fields. An `address` change skips both components. `React.memo` around them does not affect this subscription.

      #### Phrase you can say

      Without Toolkit the selector returns the `personal` object from the store itself. While the reference is the same, the address does not render the component. If I build a new object from fields, I pass `shallowEqual` as the second argument of `useSelector`. `useMemo` after the subscription no longer cancels the render.
  - id: "rafeeq-digibank.9d"
    label: "9d"
    topic: "Redux Re-render Optimization (scenario)"
    title: "You suggested useMemo, but you're getting the data from the selector, so hasn't it already re-rendered by then?"
    body: |
      #### Short answer

      Yes. By the time `useMemo` runs, the component is already rendering. `useSelector` is called in the function body. If it returned a new reference, React is already running this render. `useMemo` can skip recomputing a value, but it does not cancel the component call.

      Skipping the render happens earlier. The selector result has to be the same reference as last time, or it has to pass an equality function such as `shallowEqual`. Otherwise `useMemo` sits too late. A narrow selector or a memoized `createSelector` keeps a render caused by the address out of this component.

      #### Code example

      ```tsx
      import { useMemo } from "react";
      import { useSelector } from "react-redux";

      type State = {
        profile: {
          personal: { firstName: string };
          address: { city: string };
        };
      };

      export const PersonalCard = () => {
        const profile = useSelector((state: State) => state.profile);
        const firstName = useMemo(() => profile.personal.firstName, [profile]);

        return <p>{firstName}</p>;
      };
      ```

      An `address` change replaces `profile`. `useSelector` sees a new reference and calls the component. `useMemo` runs already inside that call. It does not go back in time to the decision "do not render".

      #### Phrase you can say

      Yes, by `useMemo` the component has already re-rendered. `useSelector` returned a new reference, and the function call is already running. `useMemo` only skips recomputing a value inside. For there to be no render, the selector has to return the same reference or pass its own equality function.
  - id: "rafeeq-digibank.10a"
    label: "10a"
    topic: "APIs"
    title: "Do you work with REST, SOAP or other API types?"
    body: |
      #### Short answer

      REST is the main kind: resources, HTTP methods, JSON, status codes. SOAP is an XML envelope and an operation from a WSDL, more often on older banking services. GraphQL is a query in which the client names the fields. gRPC and WebSocket sit nearby when the contract is binary or it is a stream.

      Name what you actually integrated. For a DigiBank UI the usual answer is REST, and GraphQL separately if the project had it. Do not call reading a WSDL daily work if it was not.

      #### Phrase you can say

      I mostly work with REST. I have dealt with SOAP when a service returned XML from a WSDL. I use GraphQL when the client chooses the fields. I will name gRPC or WebSocket only if they were in the project.
  - id: "rafeeq-digibank.10b"
    label: "10b"
    topic: "APIs"
    title: "With lots of data, is there an API type that lets you fetch only the fields you need? What is it?"
    note: "The answer he wanted was GraphQL. He pointed out that pagination is a different thing."
    body: |
      #### Short answer

      The expected answer is GraphQL. The client sends a query with a set of fields and receives only those, including nested objects. That is the API kind that fetches the fields you need, not the whole resource the way a typical REST response does. SOAP also returns the message described in the WSDL, not an arbitrary set of fields.

      Pagination is a different topic. The interviewer said separately that it is a different thing. It limits how many records come back: a page, `limit` and `offset`, a cursor with `first` and `after`. It does not choose which fields of each record come back. Pagination exists in REST and in GraphQL. You do not answer "fetch only the fields you need" with pagination.

      Some REST services have their own `fields` parameter. That is a private trick of a particular API. The kind expected here is GraphQL.

      #### Code example

      ```graphql
      query ClientPersonal($id: ID!) {
        client(id: $id) {
          personal {
            firstName
            lastName
          }
        }
      }
      ```

      ```graphql
      query ClientPage($after: String) {
        clients(first: 20, after: $after) {
          edges {
            node {
              id
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
      ```

      The first query selects the `firstName` and `lastName` fields. That is the answer to the question. The second limits the page with the `first` and `after` arguments. That is already pagination, even though it also has a field set inside. `GET /clients?page=2&limit=20` in REST is pagination too: the server still defines the resource fields.

      #### Phrase you can say

      This is GraphQL: in the query I list the fields I need and receive only those. Pagination is a separate topic. It cuts the number of records, not the set of fields. `limit` and a page do not answer this question.
  - id: "rafeeq-digibank.11a"
    label: "11a"
    topic: "Micro-Frontends / Module Federation"
    title: "DBS mainly uses Module Federation and MFE architecture. How many years have you worked with it, and on how many projects?"
    body: |
      #### Short answer

      Again, a one-to-two minute frame. Take the years and the number of projects only from your resume. Do not claim someone else's tenure or someone else's numbers.

      Say how many years you worked with Module Federation and on how many projects. In one sentence: that was the host, a remote, or both. One result: an independent module release, a smaller shell, or a separate team on a domain. If there were no such projects, say that.

      You can still name the model in your own words. The host loads `remoteEntry`, the remote exposes a module, and React is shared as one instance. That is the structure, not a biography.

      #### Phrase you can say

      I worked with Module Federation for as many years and on as many projects as I can show from my resume. I will name the role directly: host, remote, or both. One result comes from the resume too. If there was no rollout, I will say so and walk through the host, remoteEntry, and shared React as the model.
  - id: "rafeeq-digibank.11b"
    label: "11b"
    topic: "Micro-Frontends / Module Federation"
    title: "Did you work on the host application or a remote application?"
    body: |
      #### Short answer

      The host is the shell application. It owns the document, the navigation, and the slots where other modules are inserted. A remote is a separately built application. It exposes one or more modules and does not own the page as a whole.

      Answer from your role and do not invent a project. If you wrote a widget that was plugged into the shell, that is a remote. If you built the shell and registered other modules, that is the host. If you did both, say which was primary, and one responsibility of each.

      The host lists `remotes` in its config and the `remoteEntry.js` URL. The remote names the public module name and the file behind it in `exposes`.

      #### Phrase you can say

      I worked on a remote if I exposed a module into the shell, or on the host if I connected other `remoteEntry` files. If both sides were mine, I will name the primary one. I will take the project and the years from my resume, not from someone else's story.
  - id: "rafeeq-digibank.11c"
    label: "11c"
    topic: "Micro-Frontends / Module Federation"
    title: "Why did you create a separate MFE for your project, and how did you integrate it with the host?"
    body: |
      #### Short answer

      A separate micro-frontend is created when a domain has its own release and its own team. The shell is not rebuilt for every change of that domain. A typical area is cards, transfers, statements: something that lives apart from the frame. Take the concrete domain from your project. If you did not build a separate MFE, describe the scheme as the structure and do not invent a system name.

      Integration works like this. The remote names the module and the entry file in `exposes`, and the build publishes `remoteEntry.js`. The host points at the name and the URL of that file in `remotes`. On a route, the host lazily imports the module and renders it in its own tree. Shared React is set in `shared`, otherwise the shell and the module get two Reacts.

      If the remote itself calls `createRoot` on a node it was given, that is already a second root. Then props or the store are passed into the mount function, and you do not count on the shell's Provider.

      #### Code example

      ```js
      new ModuleFederationPlugin({
        name: "cards",
        filename: "remoteEntry.js",
        exposes: { "./CardsApp": "./src/CardsApp" },
      });

      new ModuleFederationPlugin({
        name: "shell",
        remotes: { cards: "cards@https://cdn.example.com/cards/remoteEntry.js" },
      });
      ```

      #### Phrase you can say

      A separate micro-frontend is needed when a team has its own release and the shell should not rebuild with it. The remote publishes `remoteEntry` and `exposes`, the host points at it in `remotes` and renders a lazy import in a slot. React is shared through `shared`. I will name the domain only if it was mine.
  - id: "rafeeq-digibank.11d"
    label: "11d"
    topic: "Micro-Frontends / Module Federation"
    title: "How is it configured: how does the host pick up the remote, and how does the remote expose modules?"
    body: |
      #### Short answer

      The host picks up a remote through `remotes`: the key is the name, the value is `name@URL` of `remoteEntry.js`. The name before `@` matches the remote's `name`. Then the host does `import("cards/CardsApp")`. `cards` is the remote name, `CardsApp` is the key from `exposes`.

      The remote sets `name`, `filename: "remoteEntry.js"`, and `exposes`: the public module name and the local file. Both configs list `shared`. For React that is `singleton`, so one copy is loaded.

      The same fields — `name`, `remotes`, `exposes`, `shared` — exist on Webpack's `ModuleFederationPlugin` and on the Module Federation plugin for Rsbuild. The wrapper changes, not the meaning.

      #### Code example

      ```js
      const { ModuleFederationPlugin } = require("webpack").container;

      new ModuleFederationPlugin({
        name: "cards",
        filename: "remoteEntry.js",
        exposes: {
          "./CardsApp": "./src/CardsApp",
        },
        shared: {
          react: { singleton: true, requiredVersion: "^17.0.2" },
          "react-dom": { singleton: true, requiredVersion: "^17.0.2" },
        },
      });

      new ModuleFederationPlugin({
        name: "shell",
        remotes: {
          cards: "cards@https://cdn.example.com/cards/remoteEntry.js",
        },
        shared: {
          react: { singleton: true, requiredVersion: "^17.0.2" },
          "react-dom": { singleton: true, requiredVersion: "^17.0.2" },
        },
      });
      ```

      ```tsx
      import { lazy } from "react";

      const CardsApp = lazy(() => import("cards/CardsApp"));

      export const CardsSlot = () => {
        return <CardsApp />;
      };
      ```

      The upper call is the remote, the lower call is the host. The string `cards@https://...` connects the name in `import("cards/CardsApp")` to the `remoteEntry.js` URL.

      #### Phrase you can say

      The remote exposes a module through `exposes` and the `remoteEntry.js` file. The host writes it in `remotes` as `cards@url` and imports `cards/CardsApp`. Both put React and react-dom in `shared` with `singleton`, so there is one instance.
  - id: "rafeeq-digibank.11e"
    label: "11e"
    topic: "Micro-Frontends / Module Federation"
    title: "Did your MFE expose only one feature, or multiple features or routes?"
    body: |
      #### Short answer

      Both are possible. One key in `exposes` is one feature, for example a cards widget. Several keys, or one routes module, are several features or routes. A remote does not have to be exactly one screen.

      Say how it was for you, and do not invent a screen count. If you exposed one entry, name it. If you exposed a set of routes, say that the shell mounted a routes module and the transitions lived inside the remote.

      #### Code example

      ```js
      const oneFeature = {
        "./CardsApp": "./src/CardsApp",
      };

      const severalFeatures = {
        "./CardsApp": "./src/CardsApp",
        "./Routes": "./src/Routes",
      };
      ```

      `oneFeature` is one entry. `severalFeatures` is a widget and routes separately. The shell imports the key it needs.

      #### Phrase you can say

      My remote exposed one feature if `exposes` had one module, or several if it had a set of keys or a routes module. I will say how the project actually was, without an invented screen count.
  - id: "rafeeq-digibank.11f"
    label: "11f"
    topic: "Micro-Frontends / Module Federation"
    title: "How would you share data between the host and remote applications? Would you use Zustand or Redux?"
    body: |
      #### Short answer

      You can share data through Zustand or through Redux. The condition is the same: the store instance has to be shared. Two stores do not sync themselves.

      A narrow contract is simpler as props. The host passes `userId`, locale, and callbacks into the exposed component. The remote does not reach into someone else's store.

      If the state is already in the shell, the store module is what you share. Zustand: mark the module with `create` as a shared singleton, and the host and the remote import one hook. Redux: one store, and the remote has to see the same `Provider`. For that, `react` and `react-redux` are singletons too. Otherwise the remote will not see the Provider context.

      If the remote starts its own `createRoot`, the shell's Provider does not wrap it. Then `mount` receives props or that same store object, and the Provider is placed inside the remote. Events on `window` are a spare channel for a rare signal, not for a standing copy of the profile.

      #### Code example

      ```tsx
      export const CardsApp = ({ userId }: { userId: string }) => {
        return <p>{userId}</p>;
      };
      ```

      ```ts
      import { create } from "zustand";

      type SessionState = {
        userId: string;
        setUserId: (userId: string) => void;
      };

      export const useSession = create<SessionState>((set) => ({
        userId: "",
        setUserId: (userId) => set({ userId }),
      }));
      ```

      `CardsApp` receives data as an argument and does not need a store. `useSession` shares state only if the host and the remote loaded this module as one singleton. A second `create` in another copy of the file is already another store.

      #### Phrase you can say

      I pass a narrow contract as props from the host into the remote. If a shared store is needed, I take one Zustand or Redux instance and share the module as a singleton, together with `react` and `react-redux`. Two separate stores will not share the data by themselves.
  - id: "rafeeq-digibank.11g"
    label: "11g"
    topic: "Micro-Frontends / Module Federation"
    title: "Which approach did you use in your last or current project, and how did the host and MFE communicate?"
    body: |
      #### Short answer

      Name the channel from the last or current project, and one piece of data. Do not invent a system.

      Three working options. The host passes data as props into the remote module and receives actions as a callback. Both import one singleton store, Redux or Zustand, and read their own selectors. A rare signal, for example "the session expired", goes as an event. Standing data is not driven through an event.

      If there was no micro-frontend project, say so. Then name the option you would choose: props for a narrow contract, a shared store if the shell is already on Redux.

      #### Code example

      ```tsx
      type CardsProps = {
        userId: string;
        onOpen: (cardId: string) => void;
      };

      export const CardsApp = ({ userId, onOpen }: CardsProps) => {
        return (
          <button type="button" onClick={() => onOpen(userId)}>
            {userId}
          </button>
        );
      };
      ```

      The host renders `<CardsApp userId={id} onOpen={openCard} />`. Data goes down, the action comes back as a callback. That is the host and the micro-frontend talking without a second store.

      #### Phrase you can say

      On the last project I will name the actual channel: props, a shared store, or a rare event, and what was passed, for example userId. If there was no such project, I would choose props for a narrow contract and a shared Redux store if the shell already owns one.
  - id: "rafeeq-digibank.11h"
    label: "11h"
    topic: "Micro-Frontends / Module Federation"
    title: "If the host is on React 17 and a remote is upgraded to React 19, will there be conflicts?"
    body: |
      #### Short answer

      Yes, there will be conflicts. A host on React 17 and a remote built on React 19 diverge both in the instance and in the API. Hooks are tied to the React that rendered. A second copy gives an invalid hook call and two contexts. Code built for React 19 calls APIs that React 17 does not have.

      You remove that with a singleton and strict version alignment together, not with one of the two. `singleton: true` on `react` and `react-dom` loads one copy. `requiredVersion` and `strictVersion: true` stop an incompatible version from being substituted quietly: the load fails instead of rendering broken hooks. While the remote is built against React 19 and React 17 sits in shared, a singleton does not turn 19 code into code for 17. The remote is rebuilt on the host's version, or both move to one major version.

      #### Code example

      ```js
      const shared = {
        react: {
          singleton: true,
          requiredVersion: "^17.0.2",
          strictVersion: true,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^17.0.2",
          strictVersion: true,
        },
      };
      ```

      `^17.0.2` does not accept a build that needs React 19. `strictVersion` turns that mismatch into a load error. One React 17 instance appears only after the remote is built on 17 too.

      #### Phrase you can say

      There will be a conflict: React 19 inside a host on React 17 breaks hooks, even if two copies happened to load. I set `singleton` for `react` and `react-dom`, put one `requiredVersion` and `strictVersion`, and keep one major version on both sides. I do not upgrade only one side to 19.
  - id: "rafeeq-digibank.11i"
    label: "11i"
    topic: "Micro-Frontends / Module Federation"
    title: "You mentioned singleton. What does it do, how do you configure it, and is it set in the host or the remote?"
    body: |
      #### Short answer

      `singleton` in `shared` makes Module Federation keep one instance of the module. A second request for `react` takes the copy already loaded, not the remote's nested copy. That is how hooks and context match. `requiredVersion` sets the allowed semver. `strictVersion: true` does not allow a version outside that range to be used quietly.

      It is set in `shared` on both the host and the remote. If the flag is only on one side, the other can bundle its own React. The host provides the instance: it has `singleton`, `requiredVersion`, `strictVersion`, and usually `eager: true`, so React is in the shared scope before the remote runs. The remote declares the same `singleton` and `requiredVersion` without `eager`, so it does not pull a second copy into its initial chunk.

      `react-dom` is marked the same way next to `react`. Otherwise the renderer and the hooks drift apart. The key name is the package name, not a file path.

      #### Code example

      ```js
      const hostShared = {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: "^17.0.2",
          strictVersion: true,
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: "^17.0.2",
          strictVersion: true,
        },
      };

      const remoteShared = {
        react: { singleton: true, requiredVersion: "^17.0.2", strictVersion: true },
        "react-dom": { singleton: true, requiredVersion: "^17.0.2", strictVersion: true },
      };
      ```

      `hostShared` goes in the host plugin. `eager` puts React in the shell's initial chunk. `remoteShared` goes in the remote plugin, without `eager`, so the module takes the host's copy.

      #### Phrase you can say

      Singleton keeps one `react` instance in the shared scope, so a remote does not bring its own copy. I set it in `shared` on the host and on the remote. On the host I add `eager`, `requiredVersion`, and `strictVersion`. On the remote, the same `singleton` and version, without `eager`. I mark `react-dom` the same way.
  - id: "rafeeq-digibank.11j"
    label: "11j"
    topic: "Micro-Frontends / Module Federation"
    title: "With around 10 MFEs, if one fails, how do you stop it from breaking the rest of the app?"
    note: "The expected answers were fallback mechanisms and error boundaries."
    body: |
      #### Short answer

      The expected answers are fallback and error boundaries. About ten micro-frontends sit in shell slots, and each slot has its own boundary and its own fallback. When one fails, that slot's boundary catches it and renders the fallback. The shell and the other nine stay on the screen. Without its own boundary, the error climbs and can unmount the tree up to the root: the shell goes blank.

      An error boundary is a class component with `getDerivedStateFromError`. In `render` it returns the fallback. `componentDidCatch` writes the log. A rejected `import()` from `React.lazy`, including a failed `remoteEntry`, also lands in this boundary. The `Suspense` fallback is the loading screen. It does not replace the error fallback. Both are needed: one while the module is on the way, the second when it fails.

      The boundary does not catch an error in a click handler or in an arbitrary promise. Those get their own `try/catch`. For "one of ten broke the shell", the answer is a boundary and a fallback on every remote.

      #### Code example

      ```tsx
      import { Component, lazy, Suspense, type ReactNode } from "react";

      type BoundaryProps = { children: ReactNode; fallback: ReactNode };
      type BoundaryState = { hasError: boolean };

      class MfeBoundary extends Component<BoundaryProps, BoundaryState> {
        state: BoundaryState = { hasError: false };

        static getDerivedStateFromError(): BoundaryState {
          return { hasError: true };
        }

        componentDidCatch(error: Error) {
          console.error(error);
        }

        render() {
          if (this.state.hasError) return this.props.fallback;
          return this.props.children;
        }
      }

      const Cards = lazy(() => import("cards/CardsApp"));

      export const CardsSlot = () => {
        return (
          <MfeBoundary fallback={<p>Cards is unavailable</p>}>
            <Suspense fallback={<p>Loading cards</p>}>
              <Cards />
            </Suspense>
          </MfeBoundary>
        );
      };
      ```

      `MfeBoundary` sits around one slot. Nine sibling slots outside this boundary do not unmount. The outer fallback is the error, the inner one is loading.

      #### Phrase you can say

      Each of the ten slots has its own error boundary and its own fallback. A failed micro-frontend shows the fallback in its slot, and the shell and the rest stay. The `Suspense` fallback is only loading. A render error and a failed `remoteEntry` are caught by the boundary.
---

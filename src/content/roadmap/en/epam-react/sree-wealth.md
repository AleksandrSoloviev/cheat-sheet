---
interview: sree-wealth
order: 2
title: "Sree Mouli Chinta — Wealth Management"
candidate: Sree Mouli Chinta
interviewer: Murali Kumar Adabala
initiative: Wealth Management
questions:
  - id: "sree-wealth.1a"
    label: "1a"
    topic: "Background & Frameworks"
    title: "Tell me about yourself."
    body: |
      #### Short answer

      A one-to-two minute frame: role, stack, one project, one measurable result. Do not drop in a named person's biography, employer, or life story. Fill the slots in square brackets with your own facts.

      "I am a front-end developer. In production I write React and TypeScript, I style with modern CSS, and I load data over REST. On the last project I built the client side of [one product in your own words: an account screen, a transaction list, or a form]. That was the screen people opened most, and it was my area.

      One measurable result: [a number you actually remember]. The sentence sounds like this: the first load of that screen dropped from X seconds to Y, because a heavy block moved into its own chunk and the first request got smaller. Take the number and the system name from your own work.

      In this conversation I care about first load and predictable state. That continues the work I have already been doing."

      If the project took twenty seconds, add one detail: who the user is and what the main action on the screen is. Four beats fit into two minutes, without retelling the whole résumé.

      #### Phrase you can say

      I am a front-end developer. My stack is React and TypeScript. On the last project I built [one screen in your own words]. The measurable result was [your own number, for example first load from X to Y by moving a block into its own chunk]. I want to keep working on first load and careful state.
  - id: "sree-wealth.1b"
    label: "1b"
    topic: "Background & Frameworks"
    title: "You only have React experience — do you know any other frameworks like Angular or Vue?"
    body: |
      #### Short answer

      In production your work is React. You can compare Angular and Vue without writing them into delivery experience if you did not ship on them for years.

      Angular is built from components and templates, with its own dependency injection, and a typical app keeps RxJS beside that. It is a different application shape: modules and injection, rather than JSX and updates through setState.

      Vue puts a screen in a single-file component with a template. Its reactivity remembers which field was read during a calculation. In React you call setState, the component function runs again, and you opt out of extra work with React.memo and stable props.

      That is enough to read someone else's component and talk about moving a screen. Name years of Angular or Vue only when those years were real delivery.

      #### Phrase you can say

      In production I use React. I can compare Angular and Vue: Angular has templates, DI, and usually RxJS; Vue has a template and tracks reads; React has an explicit setState and runs the component function again. I do not count them as commercial experience unless I shipped features on them.
  - id: "sree-wealth.1c"
    label: "1c"
    topic: "Background & Frameworks"
    title: "What is the benefit of using Next.js?"
    body: |
      #### Short answer

      Next.js gives you file-based routes and server rendering. The first response can be HTML that already contains data, instead of an empty root that then calls the API itself.

      In the App Router a Server Component runs on the server. Its own JavaScript does not enter the client bundle. The component can be async and read data before the browser paints the page. The client receives the interactive parts: forms, local state, event handlers.

      For an account screen that means the summary is already in the first HTML, and a heavy chart does not have to sit in the shared bundle. The cost is a server and the framework's conventions. If the first HTML does not need the data, a plain client-side React app is simpler.

      #### Phrase you can say

      The benefit of Next.js is that the first response is already HTML with data, and the Server Component's code stays out of the client bundle. Interactivity stays on the client. Routes come from files. If you do not need server HTML, client-side React is enough.
  - id: "sree-wealth.2a"
    label: "2a"
    topic: "Virtual DOM"
    title: "Can you explain virtual DOM and how it works in React?"
    body: |
      #### Short answer

      The virtual DOM in React is a description of the UI in memory, not the browser's nodes. A component returns elements: a type, props, and children. Those are plain objects. When state changes, React calls the component again and gets a new tree.

      Reconciliation compares the new tree with the previous one and decides which real DOM nodes to create, update, or delete. The browser tree is not rebuilt from scratch. The expensive part is writing to the document, not allocating objects.

      In current React that tree is stored as fibers. A node has a type, props, state, and links to its child and sibling. In an interview, the virtual DOM means that tree and the diff. You describe the UI from state, and React applies a patch to the real DOM.

      #### Code example

      ```tsx
      const nextTree = {
        type: 'div',
        props: {
          children: [{ type: 'button', props: { children: 'Save' } }],
        },
      };

      // React diffs nextTree against the previous tree, then patches the real DOM.
      ```

      #### Phrase you can say

      The virtual DOM is a tree of React elements in memory. After a state update the component returns a new tree, reconciliation compares it with the previous one, and React changes only the real DOM nodes that need it. In React that tree is fibers: type, props, and state on each node.
  - id: "sree-wealth.2b"
    label: "2b"
    topic: "Virtual DOM"
    title: "(Scenario) Component A returns a div and renders Component B inside it. Component A holds state that changes from false to true, causing the div to become a p. What happens to Component B — does it re-render, or does it unmount and remount?"
    body: |
      #### Short answer

      Component B unmounts and mounts again. The state of that instance is lost.

      In A, state goes from false to true, and the element in the same position changes from `div` to `p`. The fiber's type changes with it: the host component `div` and the host component `p` are different types. Reconciliation goes by type and by position. The position is the same, a single child in that slot, and the type does not match. React deletes the old fiber together with its whole subtree and creates a new fiber for `p`.

      Component B sits inside that node, so its fiber is destroyed too. The new B mounts with its initial state. A local counter or typed text returns to the starting value. This is a new instance, not an update of the same B.

      If the parent's type stays `div` and only props or text change, B's type and position still match. B's fiber is kept, its state survives, and B re-renders.

      A stable `key` on B does not preserve it. A key matches siblings under one parent. The parent host node was deleted, and its children are deleted with it. React never gets as far as comparing B's key.

      #### Code example

      ```tsx
      import { useState } from 'react';

      function ComponentB() {
        const [count, setCount] = useState(0);

        return (
          <span onClick={() => setCount((value) => value + 1)}>{count}</span>
        );
      }

      function ComponentA() {
        const [asParagraph, setAsParagraph] = useState(false);
        const Parent = asParagraph ? 'p' : 'div';

        return (
          <>
            <button type="button" onClick={() => setAsParagraph(true)}>
              Switch
            </button>
            <Parent>
              <ComponentB />
            </Parent>
          </>
        );
      }
      ```

      #### Phrase you can say

      Changing `div` to `p` changes the fiber type in the same position. Reconciliation compares type and position: the type did not match, so the old subtree unmounts, Component B mounts again, and its state is gone. The same type in the same position would update in place and keep state. A key on B does not survive a parent whose type changed.
  - id: "sree-wealth.3a"
    label: "3a"
    topic: "Hooks: useEffect / useLayoutEffect"
    title: "What is the difference between useEffect and useLayoutEffect?"
    body: |
      #### Short answer

      Both hooks run an effect after commit, and both take a dependency array and a cleanup. The difference is when they run relative to the browser painting a frame.

      useLayoutEffect runs after React has written the DOM and before the browser paints. It blocks paint. Use it to read geometry and apply a synchronous correction the user should not see as an intermediate frame.

      useEffect runs after paint. Use it for a request, a subscription, a log, and writing `document.title`. Do not put slow work in useLayoutEffect: the frame waits until the effect finishes.

      The server has no geometry, so useLayoutEffect is a client hook. During server rendering React warns if it runs in a pass where layout does not exist yet.

      #### Code example

      ```tsx
      import { useEffect, useLayoutEffect, useRef } from 'react';

      function Box() {
        const ref = useRef(null);

        useLayoutEffect(() => {
          ref.current.style.opacity = '1';
        }, []);

        useEffect(() => {
          document.title = 'ready';
        }, []);

        return <div ref={ref} style={{ opacity: 0 }} />;
      }
      ```

      #### Phrase you can say

      useLayoutEffect runs after the DOM write and before paint, so I use it to measure layout and correct it without a flash. useEffect runs after paint: requests, subscriptions, logs. Dependencies and cleanup are the same. I do not put heavy work in useLayoutEffect, and there is no layout for it on the server.
  - id: "sree-wealth.3b"
    label: "3b"
    topic: "Hooks: useEffect / useLayoutEffect"
    title: "If you can just write logic directly inside a function that runs before render, why would you use useLayoutEffect instead? Is there a specific use case?"
    body: |
      #### Short answer

      The component function runs before commit. The DOM for this frame has not been written yet, and render has to stay pure: the same props and state produce the same JSX, without reading fresh geometry and without setState as a correction.

      A ref to a node is often still empty at that moment, or it still points at the previous frame. In Strict Mode render can run twice, so a side effect inside it is especially bad.

      useLayoutEffect runs once React has written the new nodes and the browser has not painted yet. You read the current geometry. If that reading needs a setState, React applies the correction before paint.

      A concrete case is a tooltip. The anchor is already in the document, and the hint has to sit under it without a frame at coordinates 0,0. In useLayoutEffect you read both rectangles. If there is no room below, you place the hint above the anchor. `top` is written before paint.

      If the number comes only from props and state, with no DOM, compute it directly in render. An effect is not needed there.

      #### Code example

      ```tsx
      import { useLayoutEffect, useRef, useState } from 'react';

      function Tooltip({ anchorRef }) {
        const tipRef = useRef(null);
        const [top, setTop] = useState(0);

        useLayoutEffect(() => {
          const anchorBox = anchorRef.current.getBoundingClientRect();
          const tipBox = tipRef.current.getBoundingClientRect();
          const fitsBelow = anchorBox.bottom + 8 + tipBox.height < window.innerHeight;

          setTop(fitsBelow ? anchorBox.bottom + 8 : anchorBox.top - tipBox.height - 8);
        }, [anchorRef]);

        return (
          <div ref={tipRef} style={{ position: 'fixed', top }}>
            Hint
          </div>
        );
      }
      ```

      #### Phrase you can say

      The component body runs before this commit's DOM exists, and render has to stay pure. useLayoutEffect reads the nodes that were just written and can correct state before paint. Example: place a tooltip under its anchor, or above it if it does not fit, so it never flashes at zero coordinates. If I do not need the DOM, I leave the math in render.
  - id: "sree-wealth.4a"
    label: "4a"
    topic: "Hooks: useState / useReducer"
    title: "You know useState — why was useReducer introduced when you could already maintain state with useState?"
    body: |
      #### Short answer

      useState stores a value and gives you a setter. That fits when the fields are independent: whether a panel is open, a search string, a counter.

      useReducer was introduced for a transition that touches several related fields at once. The event "add a line" both appends to the list and clears the error. Those rules live in one pure function, not scattered across handlers. The component sends an action, and the reducer returns the next state.

      The dispatch from useReducer is stable across renders. You can call the reducer apart from the component and check that a state-and-action pair produces the object you expect.

      Leave independent fields in useState. Put a related transition in a reducer so you cannot update one field and forget the second.

      #### Code example

      ```tsx
      import { useReducer } from 'react';

      function reducer(state, action) {
        switch (action.type) {
          case 'add':
            return {
              ...state,
              items: [...state.items, action.item],
              error: null,
            };
          case 'fail':
            return { ...state, error: action.message };
          default:
            return state;
        }
      }

      function Cart() {
        const [state, dispatch] = useReducer(reducer, { items: [], error: null });

        return (
          <button type="button" onClick={() => dispatch({ type: 'add', item: 'AAPL' })}>
            {state.items.length}
          </button>
        );
      }
      ```

      #### Phrase you can say

      useState is for independent values. useReducer is for one action that changes several related fields: the rules live in a pure function, the component sends an action, and dispatch is stable. I can test that function without rendering.
  - id: "sree-wealth.4b"
    label: "4b"
    topic: "Hooks: useState / useReducer"
    title: "If you still have to write the same update logic somewhere (just moved into the reducer), what's the actual benefit of useReducer over useState?"
    body: |
      #### Short answer

      The benefit is not that there are fewer lines. The benefit is that the transition sees the whole state and one action.

      Two setters can update the status and forget to clear the error. The screen then shows "saving" and the old error text at the same time. A reducer on `submit` writes both fields in one return, so the impossible pair is not assembled piecemeal in different handlers.

      Second: a reducer is a pure function. You call `reducer(state, action)` in a test with no React tree. The same logic spread across onClick handlers can only be checked through a render.

      Third: one dispatch instead of several setters, and the dispatch identity does not change from render to render. You can pass it down calmly.

      React already groups several setState calls in one handler. Grouping does not replace shared rules. It only batches updates in time.

      #### Code example

      ```tsx
      function reducer(state, action) {
        switch (action.type) {
          case 'submit':
            return { ...state, status: 'saving', error: null };
          default:
            return state;
        }
      }

      // reducer({ status: 'idle', error: 'Try again' }, { type: 'submit' })
      // => { status: 'saving', error: null }
      ```

      #### Phrase you can say

      The code does not disappear. It gathers into one pure function. One action sees the whole state and changes the related fields together, and I can call that in a test without rendering. Several useState setters can update one field and forget the second. A stable dispatch is easy to pass down.
  - id: "sree-wealth.4c"
    label: "4c"
    topic: "Hooks: useState / useReducer"
    title: "What exactly do you mean by \"complex state\" in this context?"
    body: |
      #### Short answer

      Complex state here means related fields that have to change in one transition. The next value depends on the previous shape, and a partial update produces an impossible combination.

      Example: a wizard step, a draft, and a list of errors. The event "submit" moves the step, clears the errors, and sets a status. If you update only the step, the previous step's error stays on the screen.

      A nested update belongs here too: toggle an item inside a list and, together with that, clear the selection when the filter changes.

      This is not a single modal boolean, a counter, or one input string. A large object that you replace as a whole, whose fields do not affect each other, does not become complex just because it is large. Many useState calls do not by themselves make state complex if the values are independent.

      #### Code example

      ```tsx
      type EditorState = {
        step: 'draft' | 'review';
        draft: string;
        errors: string[];
      };
      ```

      #### Phrase you can say

      Complex state means related fields of one transition: a step, a draft, and errors that you cannot update separately. An independent boolean, a counter, and a single string stay in useState. The size of the object does not create the complexity by itself.
  - id: "sree-wealth.5a"
    label: "5a"
    topic: "Hooks: useRef"
    title: "Do you know useRef? How does it differ from state?"
    body: |
      #### Short answer

      useRef returns an object `{ current }` that lives from render to render. Writing to `current` does not schedule a new render. State, when updated, does schedule a render, and the UI reads the new value on the next pass.

      A ref is for a DOM node, a timer id, a previous value, and any cell the UI should not update from by itself. You can increment a render counter in a ref during render: that write does not redraw the screen.

      Keep a value the user must see in state. Reading a ref during render in order to build JSX draws data whose change React will not hear about.

      #### Code example

      ```tsx
      import { useRef, useState } from 'react';

      function SearchBox() {
        const inputRef = useRef(null);
        const [query, setQuery] = useState('');
        const renders = useRef(0);

        renders.current += 1;

        return (
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        );
      }
      ```

      #### Phrase you can say

      useRef is a `{ current }` cell that survives renders. Writing it does not cause a render. State does. I put a DOM node, a timer, and anything the UI should not update from into a ref. What is visible on the screen stays in state.
  - id: "sree-wealth.5b"
    label: "5b"
    topic: "Hooks: useRef"
    title: "Can useRef be used to behave like useState? Is that possible?"
    body: |
      #### Short answer

      As a replacement for useState, no. Writing `ref.current` does not schedule an update. The screen stays as it was until something else starts a render.

      You can keep a useState beside it and call the setter after writing the ref. The render is then started by state, and the ref only stores the number. That is already useState plus an extra cell. React has no contract that the UI depends on the ref. Reading `current` during render easily drifts from what React treats as the screen's data.

      In Strict Mode render can run twice, and a side-effect write to a ref during render shows that up. A timer, a node, and a "previous value for comparison" in a ref are still normal uses. Imitating state through a ref and a manual re-render is not.

      #### Code example

      ```tsx
      import { useRef, useState } from 'react';

      function ForcedCounter() {
        const count = useRef(0);
        const [, setTick] = useState(0);

        return (
          <button
            type="button"
            onClick={() => {
              count.current += 1;
              setTick((value) => value + 1);
            }}
          >
            {count.current}
          </button>
        );
      }
      ```

      #### Phrase you can say

      A ref does not schedule a render by itself, so it does not work as useState. I can call a setter after the write, but then state causes the render and the ref just sits beside it. For the screen I use useState. I leave the ref for a node, a timer, and a value the UI does not update from.
  - id: "sree-wealth.6a"
    label: "6a"
    topic: "Context API"
    title: "Can you explain the Context API?"
    body: |
      #### Short answer

      The Context API passes a value down a subtree without threading props through every level. createContext defines the context and a default value. Provider puts in the current value. useContext, in a component below, reads it.

      When the Provider's value changes, components that called useContext for that context render again. A component outside the Provider sees the default value and does not receive updates.

      This is how you usually pass a theme, a locale, and a session: data needed far below that changes rarely. Context does not replace a screen's local state. Avoid building a new Provider value object inline in JSX without a reason: every render of the parent produces a new reference, and every consumer wakes up again.

      #### Code example

      ```tsx
      import { createContext, useContext, useState } from 'react';

      const ThemeContext = createContext('light');

      function App() {
        const [theme, setTheme] = useState('light');

        return (
          <ThemeContext.Provider value={theme}>
            <Toolbar onToggle={() => setTheme('dark')} />
          </ThemeContext.Provider>
        );
      }

      function Toolbar({ onToggle }) {
        const theme = useContext(ThemeContext);

        return (
          <button type="button" onClick={onToggle}>
            {theme}
          </button>
        );
      }
      ```

      #### Phrase you can say

      Context passes a value down without prop drilling. The Provider publishes value, and useContext reads it. When value changes, consumers of that context render again. Outside the Provider you keep the default. For theme, locale, and session that is enough.
  - id: "sree-wealth.6b"
    label: "6b"
    topic: "Context API"
    title: "So Context API is used to maintain global state, and you can subscribe to it wherever needed?"
    body: |
      #### Short answer

      Almost, with two boundaries.

      "Global" means shared by the subtree of a particular Provider. If the Provider sits at the root, the value is available to the whole app. A component outside that Provider is not subscribed to updates and sees the default.

      "Wherever" means in any component under that Provider: call useContext and you read the same value. The subscription is to the whole context value. A single field does not filter consumers by itself. A new value wakes everyone who reads that context.

      A component that only passes `children` through and does not call useContext does not render again from a value change, if it was created by a parent that did not render. A component created inside the Provider's render renders along with it.

      For rare whole values, a theme or a session, this model is fine. For a frequent update of one field inside a large object, Context without splitting becomes wide.

      #### Code example

      ```tsx
      import { createContext, useContext, useState } from 'react';

      const SessionContext = createContext(null);

      function SessionProvider({ children }) {
        const [session, setSession] = useState(null);

        return (
          <SessionContext.Provider value={{ session, setSession }}>
            {children}
          </SessionContext.Provider>
        );
      }

      function Avatar() {
        const { session } = useContext(SessionContext);

        return <span>{session ? session.name : 'Guest'}</span>;
      }
      ```

      #### Phrase you can say

      Context is shared by the Provider's subtree, not automatically by the whole process. You can subscribe in any component under it through useContext. The subscription is to the whole value: a field you do not need still wakes the consumer if value is new. Outside the Provider you keep the default.
  - id: "sree-wealth.6c"
    label: "6c"
    topic: "Context API"
    title: "(Scenario) In nested components A, B, C, if C doesn't use the state passed through B (prop drilling), and state changes in A, will B re-render even though it's just a pass-through?"
    body: |
      #### Short answer

      Yes. B will re-render. By default, setState in A calls A again, and React calls the children A returned again. B in this tree only forwards a prop. There is no special exception for "just passing it through".

      C will be called again too, because B returned it. The fact that C does not read the value in JSX does not by itself cancel the render: the function C still runs.

      React.memo on B skips the render only when B's props are unchanged. If the changing state arrives at B as a prop, memo sees a new value and B still runs. Memo helps when you do not pass that state into B and the other props are stable.

      If only C needs the value, keep it in C, not in A. Then the update does not start at A, and B is not part of that render.

      #### Code example

      ```tsx
      import { useState } from 'react';

      function A() {
        const [value, setValue] = useState(0);

        return (
          <>
            <button type="button" onClick={() => setValue((item) => item + 1)}>
              Update
            </button>
            <B value={value} />
          </>
        );
      }

      function B({ value }) {
        return <C value={value} />;
      }

      function C() {
        return <p>Static child</p>;
      }
      ```

      #### Phrase you can say

      Yes, B re-renders: setState in A renders its children again, and forwarding a prop is not a special case. C is called too, even if it does not read the value. React.memo skips B's render only when the props are the same. If only C needs the state, store it in C.
  - id: "sree-wealth.6d"
    label: "6d"
    topic: "Context API"
    title: "Can I implement Redux-like behavior using Context API?"
    body: |
      #### Short answer

      The basic loop, yes. useReducer holds the transition, and Context publishes `{ state, dispatch }` downward. Any component under the Provider reads state and sends an action. One store for the subtree, actions instead of direct writes, a reducer as a pure function. That is the shape of Redux without the library.

      Out of the box you do not get a middleware chain, Redux DevTools, or a subscription to one slice. Dispatch here goes straight into the reducer. Every consumer of that value renders on any new state, not when one selected field changes.

      For a small piece of shared state this loop is enough. As soon as you need async actions, an action log, and precise subscriptions, you start building what Redux already has.

      #### Code example

      ```tsx
      import { createContext, useContext, useReducer } from 'react';

      const StoreContext = createContext(null);

      function reducer(state, action) {
        switch (action.type) {
          case 'increment':
            return { ...state, count: state.count + 1 };
          default:
            return state;
        }
      }

      function StoreProvider({ children }) {
        const [state, dispatch] = useReducer(reducer, { count: 0 });

        return (
          <StoreContext.Provider value={{ state, dispatch }}>
            {children}
          </StoreContext.Provider>
        );
      }

      function Counter() {
        const { state, dispatch } = useContext(StoreContext);

        return (
          <button type="button" onClick={() => dispatch({ type: 'increment' })}>
            {state.count}
          </button>
        );
      }
      ```

      #### Phrase you can say

      Yes, the basic behavior is useReducer plus Context: one state, dispatch, and a read anywhere under the Provider. Middleware, DevTools, and a slice subscription are not part of Context. Dispatch goes straight into the reducer, and a new state wakes every consumer of that value.
  - id: "sree-wealth.6e"
    label: "6e"
    topic: "Context API"
    title: "If Redux's basic behavior can be implemented using useReducer + Context, what can't you implement with Context that Redux provides?"
    body: |
      #### Short answer

      Context publishes a value and makes you read it. Three working parts of Redux are not in that mechanism.

      Middleware. In Redux an action passes through a chain before the reducer: a log, a check, a thunk, a saga. A context's dispatch is the reducer's dispatch. You can wrap it yourself. There is no ready-made chain.

      A slice subscription. useSelector takes a piece of state and compares it. The component renders when the selected piece changed. useContext subscribes you to the whole value. Any new value wakes every consumer of that context. Several contexts, one per slice, approximate the same idea. That is already a manual build.

      DevTools. An action log, time travel, and a state diff are part of the Redux ecosystem. Context does not record them.

      A Redux store also lives outside the React tree: a module can dispatch without a component. A Context value exists while its Provider is mounted.

      You can add each piece yourself. Context does not contain it.

      #### Phrase you can say

      Context does not give you middleware between dispatch and the reducer, a subscription to one slice like useSelector, or DevTools with an action log. A consumer is subscribed to the whole value. A Redux store also lives outside the tree, while context exists while the Provider is mounted. You can build that. It is not in Context itself.
  - id: "sree-wealth.6f"
    label: "6f"
    topic: "Context API"
    title: "(Scenario) I have a project using Redux with no middleware currently — can I replace Redux with Context directly, since I don't want the extra module/dependency?"
    body: |
      #### Short answer

      Yes, if the store is small and there really is no middleware. One Provider, one useReducer, and the Redux dependency goes away. Calls to useDispatch and useSelector are replaced with useContext. That is a rewrite of the call sites, not a change of import.

      The cost of the replacement is the subscription. Any consumer renders on any change of value. A theme and a session will survive that. A screen with several independent slices will get extra renders that useSelector did not do.

      DevTools and the action log leave with the library too. If async actions show up later, you will have to write the middleware chain again.

      It makes sense to drop the module when there are few subscribers and updates are rare. In a large tree with different slices, the dependency is cheaper than wide renders and rebuilding the tools.

      #### Code example

      ```tsx
      import { createContext, useContext, useReducer } from 'react';

      const StoreContext = createContext(null);

      function reducer(state, action) {
        switch (action.type) {
          case 'setTheme':
            return { ...state, theme: action.theme };
          default:
            return state;
        }
      }

      export function AppStore({ children }) {
        const [state, dispatch] = useReducer(reducer, { theme: 'light' });

        return (
          <StoreContext.Provider value={{ state, dispatch }}>
            {children}
          </StoreContext.Provider>
        );
      }

      export function useAppStore() {
        return useContext(StoreContext);
      }
      ```

      #### Phrase you can say

      Without middleware, a small store can be replaced with Context and useReducer, and the dependency can go. That replaces useSelector with useContext: the subscription becomes the whole value, and DevTools go away. For a theme and a session that is fine. For many slices the extra renders cost more than the module.
  - id: "sree-wealth.6g"
    label: "6g"
    topic: "Context API"
    title: "What exactly determines that \"complexity\" that decides between Context and Redux? Can you explain further?"
    body: |
      #### Short answer

      Complexity here is not "the object is large" and not the line count of the reducer. It is four practical questions.

      How far the data travels. One screen is fine with useState or useReducer. Dozens of distant screens need a shared place.

      How often the value changes. A locale changes rarely. A quote can update every second. Context hands out a rare whole value just fine. A frequent update of one field inside a large value wakes every consumer.

      How coupled the transitions are. Many fields of one event are convenient to describe with a reducer. That is not yet a reason to install Redux: the reducer can live in one component.

      Whether you need an action log, async middleware, and one team convention. If you do, that is Redux territory. If you do not, Context or local state is simpler.

      A twenty-field form on one screen stays useReducer. A three-field session that every screen reads and that almost never changes stays Context. Take Redux when there are many slices, updates are frequent, and subscribers need their own piece.

      #### Phrase you can say

      Complexity is sharing distance, update frequency, how coupled the transitions are, and whether you need middleware and DevTools. A large local form is useReducer. A rare session for the whole app is Context. Many frequent slices with a subscription to one field are Redux.
  - id: "sree-wealth.6h"
    label: "6h"
    topic: "Context API"
    title: "If useReducer already handles multiple state updates, why would I go for Redux at all?"
    body: |
      #### Short answer

      useReducer handles the transition: from state and an action it produces the next state. It does that inside the component that called it, or inside a value you yourself put into Context.

      It does not hand that state to distant components, it does not subscribe a component to one field, and it does not run an action through middleware. Several fields on one screen are fully covered by useReducer. Redux is not required for that.

      Redux is that same kind of reducer plus a store around it. Dispatch is available to subscribers across the tree and from a module outside React. useSelector picks a slice. Middleware sits between dispatch and the reducer. DevTools keep a log.

      If the updates stay in one component, you stop at useReducer. You add Redux when the same transition is needed in many places and you need a subscription, middleware, and tools around it.

      #### Phrase you can say

      useReducer is the transition function. It already knows how to change several fields. Redux adds a store, dispatch across the tree, a slice subscription, middleware, and DevTools. While state lives in one component, useReducer is enough.
  - id: "sree-wealth.7a"
    label: "7a"
    topic: "Micro-frontends"
    title: "Do you have any experience with micro-frontends?"
    body: |
      #### Short answer

      Answer from your own experience, without someone else's biography. If you did this in production, four beats are enough: role, stack, one project, one result.

      "I built a shell host and one remote. Builds and releases were independent, and shared React or Lodash went through Module Federation as a singleton so the library was not downloaded twice. The measurable result: [your own number — for example, the second copy of the library left the network]."

      If you did not do this in production, say so. You can still walk through the shape: the host loads a remote entry, renders the exposed module, and shared dependencies are declared in shared. Knowing the shape and having shipped it are different things. Do not claim the second.

      #### Phrase you can say

      If I have done it: a host and a remote, independent releases, a shared library through Module Federation, and one result of my own such as a single copy of Lodash on the network. If I have not: I have not shipped it, and I can walk through host, remote entry, and shared.
  - id: "sree-wealth.7b"
    label: "7b"
    topic: "Micro-frontends"
    title: "Can you explain the basic architecture of micro-frontends?"
    body: |
      #### Short answer

      The page is assembled from separately built applications. The host, also called the shell, holds the frame: authentication, navigation, layout. A remote is a separate build with its own release cycle. At runtime the host loads the remote entry and renders the module the remote exposed, for example a portfolio widget on its own route.

      The contract between them is the props of the exposed component and the events you agreed on, not the other team's internal store. Shared libraries are declared in shared. Otherwise each remote brings its own copy of React.

      Teams release on their own. The cost is the contract, the shared versions, and debugging at the seam between builds. The gain is an independent release of one piece of the product.

      #### Code example

      ```js
      const host = {
        name: 'host',
        remotes: {
          portfolio: 'portfolio@https://portfolio.example/remoteEntry.js',
        },
      };

      const remote = {
        name: 'portfolio',
        filename: 'remoteEntry.js',
        exposes: {
          './Widget': './src/Widget',
        },
      };
      ```

      #### Phrase you can say

      The host holds the frame and loads the remote entry at runtime. The remote exposes a module, and the host renders it on a route. The contract is that module's props. Shared libraries go through shared, and the builds are released separately.
  - id: "sree-wealth.7c"
    label: "7c"
    topic: "Micro-frontends"
    title: "How does inter-micro-frontend communication happen?"
    body: |
      #### Short answer

      The first way is props and a callback from the host. The host knows the user and the navigation and passes them into the exposed component. A remote does not import its neighbor's internals.

      The second is an event on window, when two remotes are siblings and should not know each other's imports. The event name and the shape of detail are their contract.

      The third is a small shared module, a bus or a store, loaded as a shared singleton. You pin its version the same way you pin a library version. Otherwise the teams end up with two buses.

      The fourth is the URL and the query string. The id of the selected position lives in the address, and each microfrontend reads it itself.

      A direct import of another remote's internal store breaks independent release: you start depending on files the other team did not promise as a public surface.

      #### Code example

      ```js
      window.dispatchEvent(
        new CustomEvent('mfe:portfolio-selected', { detail: { id: 'p-1' } }),
      );

      window.addEventListener('mfe:portfolio-selected', (event) => {
        openDetails(event.detail.id);
      });
      ```

      #### Phrase you can say

      Props and a callback from the host are the best fit. Siblings that do not import each other I connect with an event on window, or with a small shared module at a fixed version. The URL is another option. I do not import another remote's internal store.
  - id: "sree-wealth.7d"
    label: "7d"
    topic: "Micro-frontends"
    title: "(Scenario) I have 3 micro-frontends all using the Lodash library — how do I avoid downloading Lodash three times (i.e., share dependencies)?"
    body: |
      #### Short answer

      Declare Lodash as shared in Module Federation, on the host and on every remote. `singleton: true` tells the runtime to keep one instance. `requiredVersion` sets the semver range that instance must satisfy. The browser fetches the library once. The other builds use the shared module instead of putting a second copy in their own bundle.

      If you do not mark it shared, each build vendors Lodash and the user downloads it three times. The same move is required for React and react-dom: two copies of React break hooks. The question is about Lodash. The mechanism is the same.

      The ranges have to overlap. If one remote requires 4 and another requires 5, one singleton cannot satisfy both. The runtime warns, or refuses to share the module, depending on the settings.

      #### Code example

      ```js
      const shared = {
        lodash: {
          singleton: true,
          requiredVersion: '^4.17.21',
        },
      };
      ```

      #### Phrase you can say

      On the host and on every remote I put lodash in shared with singleton: true and requiredVersion. One copy is downloaded, and the other builds reuse it. Without shared, each bundle carries its own. React is shared the same way. The version ranges have to overlap.
  - id: "sree-wealth.7e"
    label: "7e"
    topic: "Micro-frontends"
    title: "What is the \"required version\" field for in Module Federation's shared config?"
    body: |
      #### Short answer

      `requiredVersion` is the semver range this build is willing to accept from the shared copy of a module. For Lodash that can be `^4.17.21`. At runtime Module Federation checks the version of the shared module that is already loaded against that range.

      The field installs nothing. The package is installed from package.json. If you list shared as an array of strings, the plugin often fills requiredVersion from the dependency itself. If you pass an object, you write the range.

      The point of the check: a remote built for Lodash 4 must not silently receive Lodash 5 that a neighbor provided. An incompatible instance cannot count as that shared copy. `singleton: true` requires one instance, and requiredVersion says which version that instance must be.

      #### Code example

      ```js
      const shared = {
        lodash: {
          singleton: true,
          requiredVersion: '^4.17.21',
        },
      };
      ```

      #### Phrase you can say

      requiredVersion is the semver range the build expects from the shared module. The runtime checks the shared copy's version against it. The field does not install the package. package.json does. That way a remote on Lodash 4 does not silently get Lodash 5.
  - id: "sree-wealth.7f"
    label: "7f"
    topic: "Micro-frontends"
    title: "What is that versioning convention? Do you know semantic versioning? What is it?"
    body: |
      #### Short answer

      The convention is semantic versioning, SemVer. A version number has three numbers: MAJOR.MINOR.PATCH.

      You bump MAJOR when the contract changes and an old consumer breaks. MINOR is for a new capability while old code still works. PATCH is for a fix that does not change the contract. Example: `4.17.21`, then a fix `4.17.22`, a new capability `4.18.0`, a breaking change `5.0.0`.

      requiredVersion is written as a range, not a single point. `^4.17.21` accepts a version at or above `4.17.21` and below `5.0.0`. `~4.17.21` accepts only a patch: at or above `4.17.21` and below `4.18.0`.

      A shared library in Module Federation needs exactly that kind of range: compatible 4.x releases share one singleton, and major 5 is a different contract.

      #### Phrase you can say

      Semantic versioning is MAJOR.MINOR.PATCH. A major breaks consumers, a minor adds something compatible, a patch fixes. `^4.17.21` allows compatible 4.x and stops before 5. requiredVersion holds that range, not one rigid point.
  - id: "sree-wealth.8a"
    label: "8a"
    topic: "Performance Optimization"
    title: "How do you increase initial load performance (not runtime performance)?"
    body: |
      #### Short answer

      Initial load is bytes and blocking before the first useful frame. React.memo and cutting extra renders do not shrink that. They are about an application that is already open.

      Split code by route. React.lazy and dynamic import move a heavy screen out of the first bundle. Suspense shows fallback UI while the chunk is in flight. Look at what is in the bundle and remove a library that arrived whole because of one call. Serve Brotli or gzip, and a long cache on files whose names contain a hash.

      Take extra fonts and third-party scripts off the critical path. Put useful markup in the first HTML, with SSR or static output, so the user does not see an empty root before JavaScript.

      Import specific functions from Lodash, not the whole package, or do not ship Lodash on the first screen at all.

      #### Code example

      ```tsx
      import { lazy, Suspense } from 'react';

      const Holdings = lazy(() => import('./Holdings'));

      function App() {
        return (
          <Suspense fallback={<p>Loading…</p>}>
            <Holdings />
          </Suspense>
        );
      }
      ```

      #### Phrase you can say

      I speed up the first load by shrinking the first bundle: route-level code splitting, a look at the bundle, Brotli, and cache by hash, with fewer blocking fonts. Useful HTML arrives immediately. React.memo does not fix this. It is about an app that is already open.
  - id: "sree-wealth.8b"
    label: "8b"
    topic: "Performance Optimization"
    title: "(Follow-up, redirected) How do you improve API performance, given that lazy loading still has to wait for the API to resolve before rendering the DOM?"
    body: |
      #### Short answer

      Lazy loading defers the component's JavaScript. The request often starts only after that component has mounted. You get a queue: download the chunk, run it, call the API, and only then draw the data. The chunk is not the wait. The network is.

      Start the request before the client mounts. The server, or a route loader, starts it before the browser has finished downloading the interactive code. Independent calls travel in parallel through Promise.all, not in a chain where the second waits for the first.

      Cut the response down to the fields and the page the first screen needs. Pagination shrinks the JSON. A return visit should not block the frame if cache headers, an ETag, or a client cache let you show data you already know.

      You can paint the page shell before the JSON. That removes the rule "no DOM until the API returns". The response itself does not get faster from that. It gets faster from an earlier start, parallelism, a smaller body, and a cache.

      #### Code example

      ```tsx
      async function loadFirstScreen() {
        const [holdings, quotes] = await Promise.all([
          fetch('/api/holdings').then((response) => response.json()),
          fetch('/api/quotes').then((response) => response.json()),
        ]);

        return { holdings, quotes };
      }
      ```

      #### Phrase you can say

      Lazy waits for a chunk, and the API often starts even later, after mount. Start the request earlier, gather independent calls in Promise.all, cut the body down to the first screen, and cache the repeat. A shell can paint before the JSON, but that does not make the response itself faster.
  - id: "sree-wealth.8c"
    label: "8c"
    topic: "Performance Optimization"
    title: "We can improve this using SSR — can you explain how?"
    body: |
      #### Short answer

      With SSR the server runs the React tree, fetches the data itself, and returns HTML that already contains the list. The browser paints that HTML without waiting for the client bundle and without a second request from the browser. The waterfall "empty root, then fetch, then a frame" disappears on the client: the network wait moves to the server and lands in the first response.

      In the App Router a Server Component can be async and read the API directly. That component's code does not enter the client bundle. Interactive children stay on the client and later go through hydration.

      If the server waits on a slow API, time to first byte grows. Streaming sends the shell earlier and appends the data in a later chunk. SSR does not make the API itself faster. It removes an extra browser round trip and puts the result in the first HTML.

      #### Code example

      ```tsx
      export default async function HoldingsPage() {
        const holdings = await fetch('https://api.example/holdings', {
          cache: 'no-store',
        }).then((response) => response.json());

        return (
          <ul>
            {holdings.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        );
      }
      ```

      #### Phrase you can say

      SSR renders the tree on the server together with the data and returns finished HTML. The browser does not wait for its bundle and a second fetch to show the list. The Server Component's code does not travel to the client. A slow API is still slow. The wait just sits in the first response, and streaming can send the shell earlier.
  - id: "sree-wealth.8d"
    label: "8d"
    topic: "Performance Optimization"
    title: "After the initial HTML loads via SSR, how does the rest of the page get loaded/made interactive? What is that process called? (Hydration)"
    body: |
      #### Short answer

      That process is called hydration.

      The browser has already shown the HTML from the server. Next it downloads the client JavaScript and runs it. React walks the existing DOM, builds fibers to match that markup, and attaches event handlers. It does not create the nodes a second time when the client markup matches the server markup.

      Until hydration has finished, the page looks ready and clicks still do nothing. If the client render does not match the server HTML, React reports a hydration mismatch.

      In the App Router this is how Client Components come alive. A Server Component does not become interactive on a second pass: its result is HTML, and the handlers live in client children that are hydrated. In a Next app you do not call hydrateRoot yourself for the page. The runtime does. The meaning of the process is the same: attach React to DOM that already exists.

      #### Code example

      ```tsx
      import { hydrateRoot } from 'react-dom/client';
      import App from './App';

      hydrateRoot(document.getElementById('root'), <App />);
      ```

      #### Phrase you can say

      The process is called hydration. After the HTML, the browser downloads the client JS, React walks the DOM that already exists, builds fibers, and attaches handlers without creating the nodes again. Until hydration finishes, clicks do nothing. In the App Router this is how Client Components come alive.
  - id: "sree-wealth.8e"
    label: "8e"
    topic: "Performance Optimization"
    title: "What lifecycle methods are used in Next.js to do this?"
    body: |
      #### Short answer

      In the Next.js App Router, hydration does not go through class lifecycle methods. A question about `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` belongs to React class components. That framing does not map onto the App Router.

      A Server Component renders on the server into the RSC payload and HTML. It has no class instance and no lifecycle methods. A Client Component marked `"use client"` is hydrated by React itself, by the same mechanism as hydrateRoot. There is no Next method on the page that "turns hydration on".

      After hydration, useEffect runs on the client. That is where you put work that needs window and subscriptions. It is a hook, not a class method. useLayoutEffect also runs on the client, after the DOM write and before paint. It is not what hydrates the page.

      You can place a class component inside a client boundary, and React will call `componentDidMount` on it after mount. The App Router does not arrange hydration that way. Pages are written as functions. If the interviewer wants the name of a method, the honest answer is that the App Router has no such method. Client work after hydration lives in useEffect.

      #### Code example

      ```tsx
      'use client';

      import { useEffect } from 'react';

      export function HoldingsTable() {
        useEffect(() => {
          const onPointer = () => {};

          window.addEventListener('pointerdown', onPointer);

          return () => window.removeEventListener('pointerdown', onPointer);
        }, []);

        return <table />;
      }
      ```

      #### Phrase you can say

      The App Router does not hydrate the page with class methods. The componentDidMount framing does not map onto it: Server Components have no instance, and React hydrates Client Components. After hydration, client work sits in useEffect. Next has no separate lifecycle method for hydration.
  - id: "sree-wealth.9a"
    label: "9a"
    topic: "Higher-Order Components"
    title: "Can you give one real-world use case for higher-order components (HOCs)?"
    body: |
      #### Short answer

      An HOC is a function that takes a component and returns a component. One case that still shows up: a shared session gate for many routes, including a class component or a third-party widget you are not rewriting.

      `withAuth` reads the session. If there is none, it renders a link to sign in. If there is one, it renders the wrapped component and passes it `session`. In a route table the wrapper sits outside the screen: `withAuth(Holdings)`. A hook is called inside a function, so it cannot wrap the component from the outside.

      In a new function component you usually write the same check with a hook inside the tree. Keep an HOC when the wrapper has to sit above a component you do not open.

      #### Code example

      ```tsx
      // useSession stands in for the app's session hook. Holdings is the screen being wrapped.

      function withAuth(Wrapped) {
        return function AuthBoundary(props) {
          const session = useSession();

          if (!session) {
            return <a href="/login">Sign in</a>;
          }

          return <Wrapped {...props} session={session} />;
        };
      }

      const PrivateHoldings = withAuth(Holdings);
      ```

      #### Phrase you can say

      An HOC takes a component and returns a component. A real case is withAuth around a route or a third-party widget: no session, show sign-in; there is a session, render the original component and pass session. In new function code a hook usually does the same thing. An HOC is what you want when the wrapper sits outside.
  - id: "sree-wealth.10a"
    label: "10a"
    topic: "SSR Follow-up"
    title: "You said you've only done SSR as a personal project, not hands-on professionally — is that correct?"
    body: |
      #### Short answer

      If that is what you said, confirm it plainly and do not upgrade it to production. At work you did not ship SSR. In a personal project the page was assembled on the server, the first HTML already contained the data, and the browser ran hydration. Do not invent a repository name, a company, or a metric.

      One sentence about the personal project is enough: what was rendered on the server, and how that differed from an empty client root. After that you can explain the shape without calling it commercial experience.

      If there was no personal project either, say that. Understanding how a server returns HTML is not the same as experience maintaining it.

      #### Phrase you can say

      Yes. At work I did not run SSR in production. In a personal project the server returned HTML that already had the data, and the browser ran hydration. That was not a production system. If there was no personal project either, I say so.
  - id: "sree-wealth.11a"
    label: "11a"
    topic: "Logic Puzzle"
    title: "Solve the number puzzle: given the clues (682 one correct and correctly placed; 614 one correct and wrongly placed; 206 two correct, both wrongly placed; 738 nothing correct; 780 one correct and wrongly placed), determine the 3-digit number."
    body: |
      #### Short answer

      The three-digit number is `042`.

      The deduction:

      1. `738` contains no correct digits, so 7, 3, and 8 are eliminated.
      2. `780` leaves 7, 8, and 0. After the previous step only 0 is still alive, and it is not in its place. The third position is eliminated for 0.
      3. In `206`, two of the digits 2, 0, and 6 are correct, and both are in the wrong place. 0 is one of them, and in this clue it stands second, so it is not second. Together with the previous step, 0 is first. The number has the shape `0 _ _`.
      4. In `682`, one digit is correct and stands in its place. 8 is already eliminated. 6 cannot stand first: the first place is taken by 0, and the clue says the correct digit is placed correctly. So the digit that is correct and well placed is 2 in the third position.
      5. Then the two correct digits in `206` are 2 and 0, and 6 is eliminated. The number has the shape `0 _ 2`.
      6. In `614`, one digit is correct, and it is not in its place. 6 is eliminated. If 1 were the correct digit, the only place left for it would be second: the first is taken by 0 and the third is taken by 2. 1 is shown in exactly the second position, so it would be placed correctly, but the clue calls it wrongly placed. 4 is the correct digit. In the clue it is third, so it is not third, and the second position is what remains.

      The result is `042`.

      Check:

      - `682`: only 2, and it is in the third place.
      - `614`: only 4, and it is not in the third place.
      - `206`: 2 and 0, both in the wrong place. 6 is not in the number.
      - `738`: no correct digit.
      - `780`: only 0, and it is not in the third place.

      #### Phrase you can say

      First I cross out 7, 3, and 8 from 738. In 780 that leaves 0, and it is not third, so it is first. In 682 the digit that is in its place is 2, so 2 is third. 6 drops out. In 614 the correct digit is 4, and it is second, because first and third are already taken. The number is 042.
  - id: "sree-wealth.12a"
    label: "12a"
    topic: "Live Coding Exercise"
    title: "Build a React app that: calls the JSONPlaceholder API to fetch posts; renders the posts as a list; implements client-side pagination using a custom hook; includes a dropdown to select items per page (10/20/30); displays \"Showing X–Y of 100 posts\"; and includes Previous/Next and numbered page buttons (with Previous disabled on page 1 and Next disabled on the last page)."
    body: |
      #### Short answer

      The example below is a reconstruction of the task, not a transcript of the candidate's screen.

      One GET to `https://jsonplaceholder.typicode.com/posts`. The response has 100 posts, and they go into state. The `usePagedPosts` hook slices the array on the client: the network is called once, and the pages are computed in the browser. The page size is 10, 20, or 30. The screen shows `Showing X–Y of 100 posts`, the buttons `Previous` and `Next`, and page numbers. `Previous` is disabled on the first page. `Next` is disabled on the last page.

      The page index is clamped into the new range when the size grows. Otherwise page 10 at size 10, after a switch to 20, points past the end of the array, and the slice is empty.

      #### Code example

      ```tsx
      // Reconstruction of the task. Not a transcript of the candidate's screen.

      import { useEffect, useState } from 'react';

      type Post = {
        id: number;
        title: string;
      };

      const PAGE_SIZES = [10, 20, 30];

      function usePagedPosts() {
        const [posts, setPosts] = useState<Post[]>([]);
        const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(10);

        useEffect(() => {
          const controller = new AbortController();

          fetch('https://jsonplaceholder.typicode.com/posts', {
            signal: controller.signal,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Request failed');
              }

              return response.json();
            })
            .then((data: Post[]) => {
              setPosts(data);
              setStatus('ready');
            })
            .catch((error: { name?: string }) => {
              if (error.name === 'AbortError') {
                return;
              }

              setStatus('error');
            });

          return () => controller.abort();
        }, []);

        const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
        const safePage = Math.min(page, pageCount);
        const start = (safePage - 1) * pageSize;
        const pageItems = posts.slice(start, start + pageSize);
        const from = pageItems.length === 0 ? 0 : start + 1;
        const to = start + pageItems.length;

        const handlePageSize = (nextSize: number) => {
          const nextCount = Math.max(1, Math.ceil(posts.length / nextSize));

          setPageSize(nextSize);
          setPage((current) => Math.min(current, nextCount));
        };

        return {
          status,
          pageItems,
          page: safePage,
          pageCount,
          pageSize,
          from,
          to,
          setPage,
          handlePageSize,
        };
      }

      export default function PostsPage() {
        const {
          status,
          pageItems,
          page,
          pageCount,
          pageSize,
          from,
          to,
          setPage,
          handlePageSize,
        } = usePagedPosts();

        if (status === 'loading') {
          return <p>Loading…</p>;
        }

        if (status === 'error') {
          return <p>Failed to load posts</p>;
        }

        return (
          <section>
            <label htmlFor="page-size">Items per page</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(event) => handlePageSize(Number(event.target.value))}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <p>{`Showing ${from}–${to} of 100 posts`}</p>

            <ul>
              {pageItems.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>

            <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>

            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1;

              return (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  aria-current={number === page ? 'page' : undefined}
                >
                  {number}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page === pageCount}
            >
              Next
            </button>
          </section>
        );
      }
      ```

      #### Phrase you can say

      One fetch of the JSONPlaceholder posts, a list from state, and a custom hook that slices them on the client. The size is 10, 20, or 30, the line is Showing X–Y of 100 posts, and the controls are Previous, Next, and page numbers. Previous is disabled on the first page, Next on the last. When the size changes, the page index is clamped into the new range.
  - id: "sree-wealth.12b"
    label: "12b"
    topic: "Live Coding Exercise"
    title: "(During/after coding) Walk-through questions: Can I use Axios — can I install it? Explain what you've built so far. (Live testing) Click on page 2, page 10, page 9, click Next, then select 20 in the dropdown — why is there an error? Is it a logic problem?"
    body: |
      #### Short answer

      You can install Axios if the environment allows `npm install axios`. JSONPlaceholder only needs `fetch`: one GET and JSON, with no new dependency. Ask before you run the install. With Axios the body sits on `response.data`. With fetch you still have to read it through `response.json()`. Pagination does not depend on the client.

      What is already built: a request to `https://jsonplaceholder.typicode.com/posts`, posts in state, a custom hook that slices the array on the client, a page size of 10, 20, or 30, the line `Showing X–Y of 100 posts`, and the buttons `Previous`, `Next`, and page numbers. `Previous` is disabled on the first page. `Next` is disabled on the last page.

      The live check starts at size 10. There are 100 posts, so there are 10 pages. Clicks on page 2, then 10, then 9, then `Next` leave the index at 10. That index is legal at size 10: it is the last page, items 91–100.

      Then the dropdown selects 20. The page count becomes 5, because 100 / 20 = 5. Index 10 is now outside the range 1–5.

      If the index is not clamped, the start is `(10 - 1) * 20 = 180`. The array indexes are 0–99, so `slice(180, 200)` is empty. The label becomes nonsense: `Showing 181–180 of 100 posts`. Reading `posts[180]` throws. The `Next` button, compared as `page === pageCount` (`10 === 5`), stays enabled.

      This is a logic error. The page index survived the size change and points at a page that no longer exists. After the size changes, clamp it to the new page count: `Math.min(page, pageCount)`. Resetting to 1 also removes the error.

      The example is a reconstruction of the task, not the candidate's screen.

      #### Code example

      ```tsx
      // Reconstruction of the task. Not a transcript of the candidate's screen.

      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = await response.json();

      let page = 10;
      let pageSize = 20;
      const pageCount = Math.ceil(posts.length / pageSize);
      const start = (page - 1) * pageSize;
      const pageItems = posts.slice(start, start + pageSize);
      const from = start + 1;
      const to = start + pageItems.length;
      // pageCount === 5, start === 180, pageItems is empty.
      // Showing ${from}–${to} of 100 posts => Showing 181–180 of 100 posts

      const safePage = Math.min(page, pageCount);
      const safeStart = (safePage - 1) * pageSize;
      const safeItems = posts.slice(safeStart, safeStart + pageSize);
      ```

      #### Phrase you can say

      Axios can be installed if npm install is allowed; fetch is enough for this GET. What I built is one posts request, a client-side slice, sizes 10, 20, and 30, the Showing line, and Previous and Next. After page 10 at size 10, choosing 20 leaves the index at 10, while there are only 5 pages. Start 180 is past the array. That is logic: the index was not clamped with Math.min(page, pageCount).
---

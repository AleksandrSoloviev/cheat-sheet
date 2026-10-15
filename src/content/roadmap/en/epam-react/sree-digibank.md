---
interview: sree-digibank
order: 3
title: "Sree Mouli Chinta — DigiBank"
candidate: "Sree Mouli Chinta"
interviewer: "Srujan Dasa ADITYA"
initiative: "DigiBank"
questions:
  - id: "sree-digibank.1a"
    label: "1a"
    topic: "Introduction & Project Experience"
    title: "Can you introduce yourself and walk through your experience?"
    body: |
      #### Short answer

      This is a one-to-two minute frame. You name your role, your stack, one project, and one measurable result. Do not drop in a biography of a specific person: years, companies, and numbers come only from your own work.

      The role is frontend developer. The stack is React and TypeScript, plus what you actually used on that project: API calls, client state, the build. The project is one user flow you owned, for example a list or a form in an application that was already running. The result is one number you can defend: page load time, first-bundle size, or a drop in extra requests.

      #### Phrase you can say

      I am a frontend developer, and my day-to-day stack is React and TypeScript. On the last project I owned one user flow in an application that was already running. I will name a measurable result only when the number comes from my own work: which metric moved, and by how much.
  - id: "sree-digibank.1b"
    label: "1b"
    topic: "Introduction & Project Experience"
    title: "You said you worked on performance optimization for one of your pages. What approaches did you use to bring the load time down?"
    body: |
      #### Short answer

      You start with the metric you measured: time to a useful screen, or the amount of JavaScript on the first load. Then you name two or three approaches that move that metric. A borrowed figure such as "eight seconds down to two" does not belong here.

      You move a heavy piece of the page into its own chunk with `React.lazy` and `Suspense`, so it stays out of the first bundle. You serve images at the size that is actually painted. Requests the screen cannot render without start in parallel, rather than as a chain of effects where each one waits for the previous one. You add memoization after a profile shows an expensive render. You close by coming back to the same metric.

      #### Code example

      ```tsx
      import { lazy, Suspense } from 'react';

      const HeavyChart = lazy(() => import('./HeavyChart'));

      function Page() {
        return (
          <Suspense fallback={<p>Loading</p>}>
            <HeavyChart />
          </Suspense>
        );
      }
      ```

      `HeavyChart` lands in a separate chunk. While that chunk is in flight the user sees the fallback text, and the page's first bundle does not carry this module.

      #### Phrase you can say

      On that page I measured the first load. I moved the heavy block into its own chunk with `React.lazy`, so it stayed out of the first bundle, and I requested the screen's data in parallel. I will quote a before-and-after number only if I measured it myself.
  - id: "sree-digibank.2a"
    label: "2a"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "You mentioned debouncing. Did you use a library, or did you write your own hook?"
    body: |
      #### Short answer

      Both are fine. A library `debounce`, for example from lodash, already delays a call and can cancel it. In this round you write the hook yourself, so the timer is visible and you can walk through it out loud.

      You keep the timer id in a `useRef`. Writing it with `useState` would re-render the component, and the id has to survive that re-render and still be the same id on the next character. The sample below is a walkthrough of the task, not a transcript of the candidate's screen.

      #### Code example

      ```tsx
      import { useEffect, useRef } from 'react';

      function useDebouncedCallback(callback, delay) {
        const timeoutIdRef = useRef(null);
        const callbackRef = useRef(callback);

        useEffect(() => {
          callbackRef.current = callback;
        }, [callback]);

        useEffect(() => {
          return () => {
            clearTimeout(timeoutIdRef.current);
          };
        }, []);

        const debounced = (value) => {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            callbackRef.current(value);
          }, delay);
        };

        return debounced;
      }
      ```

      The hook takes a function and a delay and returns a function. Each new timer clears the previous one. On unmount, a pending timer is cleared too.

      #### Phrase you can say

      I could have used a library debounce. For this task I write the hook myself so the timer is visible. I keep the id in a `useRef`: writing it with `useState` would re-render the component, and the id has to survive that re-render.
  - id: "sree-digibank.2b"
    label: "2b"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "Write a custom debounce hook for a search input, so the app doesn't call the API on every keystroke. Sample code is enough."
    body: |
      #### Short answer

      You write a `useDebouncedCallback` hook: it takes the search function and a delay, and it keeps the timer id in a `useRef`. On every character the previous timeout is cleared, and `fetch` goes out once, after the pause. Writing the id with `useState` would re-render the component, and the id has to survive the re-render from `setQuery`.

      The input lives in the component. `handleChange` reads `event.target.value` and passes that string into the function the hook returned. The timer closes over that argument and then calls `search`. The sample below is a walkthrough of the task, not a transcript of the candidate's screen.

      #### Code example

      ```tsx
      import { useEffect, useRef, useState } from 'react';

      function useDebouncedCallback(callback, delay) {
        const timeoutIdRef = useRef(null);
        const callbackRef = useRef(callback);

        useEffect(() => {
          callbackRef.current = callback;
        }, [callback]);

        useEffect(() => {
          return () => {
            clearTimeout(timeoutIdRef.current);
          };
        }, []);

        const debounced = (value) => {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            callbackRef.current(value);
          }, delay);
        };

        return debounced;
      }

      function SearchInput() {
        const [query, setQuery] = useState('');

        const search = (value) => {
          const url = `/api/search?q=${encodeURIComponent(value)}`;
          return fetch(url);
        };

        const debouncedSearch = useDebouncedCallback(search, 300);

        const handleChange = (event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          debouncedSearch(nextValue);
        };

        return (
          <input
            type="search"
            value={query}
            aria-label="Search"
            onChange={handleChange}
          />
        );
      }
      ```

      `setQuery` updates what the field shows, immediately. `debouncedSearch` delays `fetch` until 300 ms of quiet. `callbackRef` holds the latest `search`, and the request receives the string passed as the argument.

      #### Phrase you can say

      The hook takes the search function and a delay, and the timer id lives in a `useRef`. On every character I clear the previous timeout and schedule a new one. The string from the field reaches the API, and only after the pause.
  - id: "sree-digibank.2c"
    label: "2c"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "Why did you use useRef instead of useState for the timer?"
    body: |
      #### Short answer

      You keep the timer id in a `useRef`. Writing it through `useState` would re-render the component, and the id has to survive that re-render.

      The field already calls `setQuery` on every character, so `SearchInput` renders again. A ref is the same object across those renders. Assigning `timeoutIdRef.current` is visible immediately, and the next character reads that same id at call time. The id is not painted, so it does not need its own state update.

      In the `useState` version the handler closes over the `timeoutId` from the render that created the function. `setTimeoutId` only schedules a commit. A second call before that commit still sees the old id. The ref is read at keystroke time, so `clearTimeout` reaches the timer the previous character stored.

      #### Code example

      ```tsx
      function useDebouncedCallback(callback, delay) {
        const timeoutIdRef = useRef(null);
        const callbackRef = useRef(callback);

        const debounced = (value) => {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            callbackRef.current(value);
          }, delay);
        };

        return debounced;
      }
      ```

      That id survives the render from `setQuery`. The version you are leaving behind:

      ```tsx
      function useDebouncedCallback(callback, delay) {
        const [timeoutId, setTimeoutId] = useState(null);

        const debounced = (value) => {
          clearTimeout(timeoutId);
          const nextId = setTimeout(() => {
            callback(value);
          }, delay);
          setTimeoutId(nextId);
        };

        return debounced;
      }
      ```

      `setTimeoutId` by itself schedules an extra re-render, and `clearTimeout(timeoutId)` looks at the id closed over from that render.

      #### Phrase you can say

      I keep the timer id in a `useRef`. Writing it with `useState` would re-render the component, and the id has to survive the re-render from the field. On the next character I read `ref.current` and clear that same timeout.
  - id: "sree-digibank.2d"
    label: "2d"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "Your hook takes a function and a delay. Where do you handle the search input itself, and how is it connected to the hook?"
    body: |
      #### Short answer

      You handle the input itself in the component: the visible string lives in `useState`. The hook takes `search` and `300` and returns `debouncedSearch`.

      The connection is this. `SearchInput` keeps the visible string in `useState`. `handleChange` reads `event.target.value`, stores it in state, and calls `debouncedSearch` with the same value. When the pause has elapsed, the hook calls `search` with that string, and `search` performs the `fetch`. The sample below is a walkthrough of the task.

      #### Code example

      ```tsx
      import { useEffect, useRef, useState } from 'react';

      function useDebouncedCallback(callback, delay) {
        const timeoutIdRef = useRef(null);
        const callbackRef = useRef(callback);

        useEffect(() => {
          callbackRef.current = callback;
        }, [callback]);

        useEffect(() => {
          return () => {
            clearTimeout(timeoutIdRef.current);
          };
        }, []);

        const debounced = (value) => {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            callbackRef.current(value);
          }, delay);
        };

        return debounced;
      }

      function SearchInput() {
        const [query, setQuery] = useState('');

        const search = (value) => {
          const url = `/api/search?q=${encodeURIComponent(value)}`;
          return fetch(url);
        };

        const debouncedSearch = useDebouncedCallback(search, 300);

        const handleChange = (event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          debouncedSearch(nextValue);
        };

        return (
          <input
            type="search"
            value={query}
            aria-label="Search"
            onChange={handleChange}
          />
        );
      }
      ```

      `useDebouncedCallback(search, 300)` is the joint. The `nextValue` argument is what the user just typed.

      #### Phrase you can say

      The hook takes only the search function and the delay. The input itself lives in the component: state for the visible string, and `onChange`. In the handler I pass the field's value into the function the hook returned.
  - id: "sree-digibank.2e"
    label: "2e"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "Write the whole chunk, including the component that uses the hook."
    body: |
      #### Short answer

      The whole chunk you write is the hook and the component side by side. `useDebouncedCallback` keeps the timer id in a `useRef`, so writing it with `useState` does not re-render the component for the sake of the id, and so the id survives the re-render. `SearchInput` owns the field, updates the visible string on every character, and passes that string into the returned function. The string reaches the API as an argument: the timer calls `search(value)`, and `search` builds the URL and calls `fetch`.

      While typing has not stopped, each new call clears the previous timeout. The sample below is a walkthrough of the task, not a transcript of the candidate's screen.

      #### Code example

      ```tsx
      import { useEffect, useRef, useState } from 'react';

      function useDebouncedCallback(callback, delay) {
        const timeoutIdRef = useRef(null);
        const callbackRef = useRef(callback);

        useEffect(() => {
          callbackRef.current = callback;
        }, [callback]);

        useEffect(() => {
          return () => {
            clearTimeout(timeoutIdRef.current);
          };
        }, []);

        const debounced = (value) => {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            callbackRef.current(value);
          }, delay);
        };

        return debounced;
      }

      function SearchInput() {
        const [query, setQuery] = useState('');

        const search = (value) => {
          const url = `/api/search?q=${encodeURIComponent(value)}`;
          return fetch(url);
        };

        const debouncedSearch = useDebouncedCallback(search, 300);

        const handleChange = (event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          debouncedSearch(nextValue);
        };

        return (
          <input
            type="search"
            value={query}
            aria-label="Search"
            onChange={handleChange}
          />
        );
      }
      ```

      The effect cleanup clears the timer if the component goes away before the pause ends.

      #### Phrase you can say

      The hook stores the timeout in a `useRef` and returns a delayed function. The component owns the field, writes the string into state in `onChange`, and passes that same string into the debounced function. After the pause, that string reaches `fetch`.
  - id: "sree-digibank.2f"
    label: "2f"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "If the user types \"ABC\", how do you avoid three API calls (A, AB, ABC) when the search term updates?"
    body: |
      #### Short answer

      Three calls do not go out, because you clear the previous timeout before you start a new one. The letters A and AB only manage to schedule a timer and then have it cleared. One string, ABC, reaches the API once the pause is longer than the delay.

      The id lives in a `useRef`, so it survives the re-render from `setQuery`. The next letter reads that same id and calls `clearTimeout`. Writing the id with `useState` would re-render the component for a value that is never painted.

      - A: the ref stores timer T1 for the string `A`.
      - B before 300 ms elapses: `clearTimeout` kills T1, and the ref stores T2 for the string `AB`.
      - C: T2 is killed, and the ref stores T3 for the string `ABC`.
      - The pause: only T3 fires, and `fetch` receives `ABC`.

      #### Code example

      ```tsx
      const debounced = (value) => {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
          callbackRef.current(value);
        }, delay);
      };
      ```

      On the third call, `value` is already `ABC`. The closures for T1 and T2 never run: their timers were cleared.

      #### Phrase you can say

      On every new letter I clear the previous timeout through the id in the `useRef`. While the user types ABC, the timers for A and AB are cleared. One request goes out with the string ABC, once typing goes quiet.
  - id: "sree-digibank.2g"
    label: "2g"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "The link between the input's keystrokes and the debounced function is missing. Where does the typed value get wired in?"
    body: |
      #### Short answer

      The typed value is wired in `handleChange`. You read `event.target.value` into `nextValue`, put it into the field's state immediately, and call `debouncedSearch(nextValue)`. The hook does not listen to the input itself: the link is the argument of the returned function.

      `debouncedSearch` comes from `useDebouncedCallback(search, 300)`. The timer id stays in a `useRef`, so a `useState` update is not how you store the timeout, and so the id survives the re-render from `setQuery`. The sample below is a walkthrough of the task.

      #### Code example

      ```tsx
      import { useEffect, useRef, useState } from 'react';

      function useDebouncedCallback(callback, delay) {
        const timeoutIdRef = useRef(null);
        const callbackRef = useRef(callback);

        useEffect(() => {
          callbackRef.current = callback;
        }, [callback]);

        useEffect(() => {
          return () => {
            clearTimeout(timeoutIdRef.current);
          };
        }, []);

        const debounced = (value) => {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            callbackRef.current(value);
          }, delay);
        };

        return debounced;
      }

      function SearchInput() {
        const [query, setQuery] = useState('');

        const search = (value) => {
          const url = `/api/search?q=${encodeURIComponent(value)}`;
          return fetch(url);
        };

        const debouncedSearch = useDebouncedCallback(search, 300);

        const handleChange = (event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          debouncedSearch(nextValue);
        };

        return (
          <input
            type="search"
            value={query}
            aria-label="Search"
            onChange={handleChange}
          />
        );
      }
      ```

      The line `debouncedSearch(nextValue)` is the missing link between the keystroke and the delayed call.

      #### Phrase you can say

      The value is wired in `onChange`: I take `event.target.value` and pass it as the argument to the debounced function. The hook does not read the field. It receives the string ready-made.
  - id: "sree-digibank.2h"
    label: "2h"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "How does the typed string actually reach the API call?"
    body: |
      #### Short answer

      You get the typed string to the API as the argument you pass into the debounced function.

      1. `handleChange` takes `event.target.value` into `nextValue`.
      2. `debouncedSearch(nextValue)` clears the previous timeout and schedules a new one. That `nextValue` sits in the timer's closure.
      3. After the pause, the timer calls `callbackRef.current(value)`. That is the current `search`.
      4. `search` builds `/api/search?q=` with `encodeURIComponent(value)` and calls `fetch`.

      While the user types ABC, the previous timeout is cleared, so one string, `ABC`, arrives at `fetch`. The timer id lives in a `useRef`: it survives the re-render from `setQuery`, and a `useState` write is not needed for the id. `callbackRef` lets the timer call the latest `search`, while the string stays the one passed into that particular call.

      #### Code example

      ```tsx
      import { useEffect, useRef, useState } from 'react';

      function useDebouncedCallback(callback, delay) {
        const timeoutIdRef = useRef(null);
        const callbackRef = useRef(callback);

        useEffect(() => {
          callbackRef.current = callback;
        }, [callback]);

        useEffect(() => {
          return () => {
            clearTimeout(timeoutIdRef.current);
          };
        }, []);

        const debounced = (value) => {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            callbackRef.current(value);
          }, delay);
        };

        return debounced;
      }

      function SearchInput() {
        const [query, setQuery] = useState('');

        const search = (value) => {
          const url = `/api/search?q=${encodeURIComponent(value)}`;
          return fetch(url);
        };

        const debouncedSearch = useDebouncedCallback(search, 300);

        const handleChange = (event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          debouncedSearch(nextValue);
        };

        return (
          <input
            type="search"
            value={query}
            aria-label="Search"
            onChange={handleChange}
          />
        );
      }
      ```

      The path is `event.target.value` → `debouncedSearch(nextValue)` → the `setTimeout` argument → `search(value)` → `fetch`.

      #### Phrase you can say

      In `onChange` I pass the string from the field into the debounced function. The timer closes over that argument and, after the pause, calls `search`. `search` puts the string on the query and calls `fetch`. The previous timers are already cleared by then.
  - id: "sree-digibank.3a"
    label: "3a"
    topic: "React Hooks"
    title: "Have you worked with hooks? What's the difference between useEffect and useLayoutEffect?"
    body: |
      #### Short answer

      Yes. Hooks are how you keep state and side effects in a component you write today. The difference between `useEffect` and `useLayoutEffect` is when they run.

      Both hooks take a function and a dependency array, and both can return a cleanup. `useLayoutEffect` runs after the changes have been written to the DOM and before the browser paints the frame. You use it to measure an element and adjust the DOM so the user does not see a flash. `useEffect` runs after paint. You use it for the network, event subscriptions, and timers.

      `useLayoutEffect` holds the paint for as long as its function runs, so the work there stays short. On the server there is no layout, and React warns about that call. You leave data fetching in `useEffect`.

      #### Code example

      ```tsx
      import { useEffect, useLayoutEffect, useRef, useState } from 'react';

      function Panel() {
        const ref = useRef(null);
        const [width, setWidth] = useState(0);

        useLayoutEffect(() => {
          setWidth(ref.current.getBoundingClientRect().width);
        }, []);

        useEffect(() => {
          const controller = new AbortController();
          fetch('/api/panel', { signal: controller.signal });

          return () => controller.abort();
        }, []);

        return <div ref={ref}>{width}</div>;
      }
      ```

      The width is read before the frame. The request leaves after the frame, and the cleanup aborts it on unmount.

      #### Phrase you can say

      I work with hooks. `useLayoutEffect` runs after the DOM update and before paint, and I use it to measure layout. `useEffect` runs after paint, and I use it for the network and subscriptions. I keep slow work out of the layout effect: it delays the frame.
  - id: "sree-digibank.4a"
    label: "4a"
    topic: "State Management: Redux"
    title: "Have you worked with Redux or Redux tooling?"
    body: |
      #### Short answer

      Yes, when that is actually your experience: you say so, without invented years. Redux was the shared client state for screens that sit far apart in the tree.

      You name the parts you used. The store holds state. An action describes what happened. A reducer returns the next state. In a component, reading goes through `useSelector` and sending goes through `useDispatch`. From the tooling around it, you name only yours: Redux DevTools, to see the action chain, and Redux Thunk, so dispatch can take a function for a request. Redux Toolkit is worth naming if you built the slices and the store with it.

      #### Phrase you can say

      Yes, I have worked with Redux: shared client state, actions, reducers, `useSelector`, and `useDispatch`. From the tooling I used Redux DevTools and Redux Thunk for async work. I name only what was actually in the project.
  - id: "sree-digibank.4b"
    label: "4b"
    topic: "State Management: Redux"
    title: "Why did you use Redux in that application? What was its main purpose, and how did you manage state?"
    body: |
      #### Short answer

      The main job of Redux in that application was one client state for data that different screens both read and update. You take the domain name from the project you already described. Someone else's application does not get substituted in.

      You managed state like this. A domain, accounts for example, lives in its own reducer under the `accounts` key. A screen dispatches an action. The reducer returns the next state for that action type: the request started, or the list arrived. The screen reads a slice through `useSelector` and does not drag the whole store into the markup. The transition stays in the reducer, and the component stays thin.

      A server response that one screen needs and nobody else does can stay out of this store. What stays in Redux is the state the client actually shares.

      #### Code example

      ```tsx
      import { combineReducers } from 'redux';
      import { useSelector } from 'react-redux';

      const initialState = {
        items: [],
        status: 'idle',
      };

      function accountsReducer(state = initialState, action) {
        if (action.type === 'accounts/requested') {
          return { ...state, status: 'loading' };
        }

        if (action.type === 'accounts/received') {
          return {
            ...state,
            status: 'ready',
            items: action.payload,
          };
        }

        return state;
      }

      const rootReducer = combineReducers({
        accounts: accountsReducer,
      });

      function AccountList() {
        const items = useSelector((state) => state.accounts.items);

        return (
          <ul>
            {items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        );
      }
      ```

      `rootReducer` mounts the reducer under the `accounts` key. The list reads only `state.accounts.items`.

      #### Phrase you can say

      Redux held the shared client state for screens that read the same data. I split it by domain: an action describes the event, the reducer returns the next state, and the screen reads it through `useSelector`.
  - id: "sree-digibank.4c"
    label: "4c"
    topic: "State Management: Redux"
    title: "Did you use Redux Thunk? Why did you need middleware, and for what operations?"
    body: |
      #### Short answer

      Yes. Redux Thunk is the middleware you used for asynchronous operations. Middleware sits between `dispatch` and the reducer. It sees everything that was sent, and it can pass an action on, swallow it, or dispatch other actions later.

      A plain `dispatch` expects a plain object, and the reducer runs synchronously. Thunk changes that rule: if you dispatched a function, the middleware calls it and passes `dispatch` and `getState`. The reducer still receives only plain actions.

      You need this for operations that finish later: load accounts, save a form, store a token after the response. Inside the function you dispatch an action that the request started, you wait for `fetch`, then you dispatch an action with the data or with the error. Flipping a flag that is already known can be a plain action, with no middleware.

      #### Code example

      ```js
      function thunkMiddleware({ dispatch, getState }) {
        return (next) => (action) => {
          if (typeof action === 'function') {
            return action(dispatch, getState);
          }

          return next(action);
        };
      }

      function fetchAccounts() {
        return async function thunk(dispatch) {
          dispatch({ type: 'accounts/requested' });

          const response = await fetch('/api/accounts');
          const accounts = await response.json();

          dispatch({ type: 'accounts/received', payload: accounts });
        };
      }
      ```

      `dispatch(fetchAccounts())` reaches the middleware as a function. Two plain actions around the request are what arrive at the reducer.

      #### Phrase you can say

      Yes, I used Redux Thunk. Middleware sits between dispatch and the reducer. I needed Thunk for async operations: the function receives dispatch, waits for the response, and only then dispatches plain actions with the data or the error.
  - id: "sree-digibank.5a"
    label: "5a"
    topic: "State Management: Context API"
    title: "Do you know about state management with the Context API?"
    body: |
      #### Short answer

      Yes. The Context API passes a value down a subtree without threading props through every level. You create a context with `createContext`, put the value on a `Provider`, and read it lower down with `useContext`.

      The value is usually state owned by a parent: the session user, the locale, the theme. When that value changes, the components that read it update. Context has no actions, no middleware, and no separate viewer for the event chain. A large object that changes often pulls every reader with it, including readers that did not care about the field that changed.

      #### Code example

      ```tsx
      import { createContext, useContext, useState } from 'react';

      const SessionContext = createContext(null);

      function SessionProvider({ children }) {
        const [user, setUser] = useState(null);

        return (
          <SessionContext.Provider value={{ user, setUser }}>
            {children}
          </SessionContext.Provider>
        );
      }

      function Header() {
        const session = useContext(SessionContext);

        return <span>{session?.user ? session.user.name : ''}</span>;
      }
      ```

      `Header` reads the session even when several layers of markup sit between it and the provider.

      #### Phrase you can say

      Yes. Context is `createContext`, a `Provider`, and `useContext`. That is how I pass a small shared value, such as the session, down the subtree without threading props. When the value changes, the components that read it update. Context has no actions and no middleware.
  - id: "sree-digibank.5b"
    label: "5b"
    topic: "State Management: Context API"
    title: "For a school admin dashboard with attendance, student details and results, would you choose the Context API or Redux? Why would you pick one over the other?"
    body: |
      #### Short answer

      For this admin dashboard you choose Redux. Attendance, student records, and results are many entities, many screens, and frequent updates. A list, a detail view, and a form all read the same data.

      A store gives you a reducer per domain, a `useSelector` for the slice you need, and middleware for loading. The attendance table can read its own slice and skip an update caused by editing one grade, when the selector returns the same data. The action chain is visible in DevTools.

      One Context for the whole dashboard behaves differently: any field in the shared value updates every reader. Several contexts, one per domain, repeat a store without middleware and without a proper action trace. You keep Context for a small value that almost the whole tree reads and that changes rarely: the interface language, or the theme.

      #### Phrase you can say

      For attendance, students, and results I would take Redux: a lot of shared data and frequent updates, so I want slices and loading through middleware. I would keep Context for a rare value such as the theme. One context for the whole dashboard would update every reader on any edit.
  - id: "sree-digibank.5c"
    label: "5c"
    topic: "State Management: Context API"
    title: "A new requirement comes in after the dashboard is built: a light/dark theme toggle. Write pseudo code using Context with useReducer to implement it."
    note: "The transcript says \"use Redux\" here, but from context he means useReducer."
    body: |
      #### Short answer

      The transcript says "use Redux" at this point. The tool you write here is `useReducer`. Redux is a separate store, actions for the whole application, and middleware. A toggle that arrives after the dashboard is already built is smaller: one string, `light` or `dark`, and one `toggle` action.

      `useReducer` holds that string and knows how to flip it. Context hands `theme` and `toggleTheme` to any screen, so you do not thread props through the header and the pages. You do not stand up a separate Redux store for this pair: the theme has no domains, no requests, and no middleware chain. The pseudocode below is a walkthrough of the requirement.

      #### Code example

      ```tsx
      import { createContext, useContext, useReducer } from 'react';

      const ThemeContext = createContext(null);

      function themeReducer(state, action) {
        if (action.type === 'toggle') {
          return state === 'light' ? 'dark' : 'light';
        }

        return state;
      }

      function ThemeProvider({ children }) {
        const [theme, dispatch] = useReducer(themeReducer, 'light');

        const toggleTheme = () => {
          dispatch({ type: 'toggle' });
        };

        return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
          </ThemeContext.Provider>
        );
      }

      function ThemeToggle() {
        const { theme, toggleTheme } = useContext(ThemeContext);

        return (
          <button type="button" aria-label="Toggle theme" onClick={toggleTheme}>
            {theme}
          </button>
        );
      }
      ```

      The button dispatches `{ type: 'toggle' }`. The reducer returns the other theme. The provider publishes the new value, and context readers render with it.

      #### Phrase you can say

      The transcript says "use Redux", and the requirement is Context plus `useReducer`. The theme is one value, `light` or `dark`. The reducer flips it on a `toggle` action, and the provider passes down the theme and the toggle function. I do not stand up a separate Redux store for this.
  - id: "sree-digibank.6a"
    label: "6a"
    topic: "TypeScript with React"
    title: "Do you have experience with TypeScript?"
    body: |
      #### Short answer

      Yes, if you have written components in it. This is a frame again, without invented years. You say where the types sat in your code: component props, a union for state such as the theme, the shape of an API response. One result you can name: a wrong field or a foreign status string is caught before the app runs, at the data boundary.

      If TypeScript was only something you read in someone else's code, you say that and show the types on the task in front of you.

      #### Phrase you can say

      Yes, I use TypeScript in components: prop types, a union for state, and a type for the API response. The practical result is that a wrong field fails the build at the data boundary, before it fails in the browser. I name only my own years and projects.
  - id: "sree-digibank.6b"
    label: "6b"
    topic: "TypeScript with React"
    title: "Add TypeScript types wherever possible to the component and provider you just wrote."
    body: |
      #### Short answer

      You type the theme provider and the button you just built with Context and `useReducer`. The theme is the union `'light' | 'dark'`. The action is an object with `type: 'toggle'`. The context value is `theme` and `toggleTheme`. The reducer accepts and returns `Theme`. The provider props are `children` of type `ReactNode`.

      The context is created as `ThemeContextValue | null`, because there is no value until the provider is there. The `useTheme` hook narrows away `null` and throws if the button renders outside the provider. After that, `ThemeToggle` sees `theme` and `toggleTheme` without optional chaining. The sample below is a walkthrough of that same provider, not a frame from the candidate's screen.

      #### Code example

      ```tsx
      import { createContext, useContext, useReducer, type ReactNode } from 'react';

      type Theme = 'light' | 'dark';

      type ThemeAction = {
        type: 'toggle';
      };

      type ThemeContextValue = {
        theme: Theme;
        toggleTheme: () => void;
      };

      type ThemeProviderProps = {
        children: ReactNode;
      };

      const ThemeContext = createContext<ThemeContextValue | null>(null);

      function themeReducer(state: Theme, action: ThemeAction): Theme {
        if (action.type === 'toggle') {
          return state === 'light' ? 'dark' : 'light';
        }

        return state;
      }

      function ThemeProvider({ children }: ThemeProviderProps) {
        const [theme, dispatch] = useReducer(themeReducer, 'light');

        const toggleTheme = () => {
          dispatch({ type: 'toggle' });
        };

        return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
          </ThemeContext.Provider>
        );
      }

      function useTheme(): ThemeContextValue {
        const value = useContext(ThemeContext);

        if (value === null) {
          throw new Error('useTheme must be used within ThemeProvider');
        }

        return value;
      }

      function ThemeToggle() {
        const { theme, toggleTheme } = useTheme();

        return (
          <button type="button" aria-label="Toggle theme" onClick={toggleTheme}>
            {theme}
          </button>
        );
      }
      ```

      `dispatch({ type: 'toggle' })` typechecks. A random string in `type`, or in the theme state, is a type error.

      #### Phrase you can say

      I type the theme as `'light' | 'dark'`, the action as `{ type: 'toggle' }`, and the context value as the theme plus the toggle function. The reducer is annotated on the way in and on the way out. The provider's `children` are typed. The context reader narrows `null`, so the button sees finished fields.
  - id: "sree-digibank.6c"
    label: "6c"
    topic: "TypeScript with React"
    title: "How would you type the useState on line 38?"
    body: |
      #### Short answer

      Line 38 is not in the PDF. It was a line on the candidate's screen, and that screen is not in the file. What follows is a reconstruction: this is how you type `useState` for a theme union, if that line held the theme state.

      `useState('light')` infers the type from the initial value, and that type is the literal `'light'`. `setTheme('dark')` does not fit. You set the type argument yourself: `useState<Theme>('light')`, where `Theme` is `'light' | 'dark'`. The initial value is checked against the union, and `setTheme` accepts only those two strings, or a function of the previous theme.

      #### Code example

      ```tsx
      import { useState } from 'react';

      type Theme = 'light' | 'dark';

      function ThemeControl() {
        const [theme, setTheme] = useState<Theme>('light');

        const handleToggle = () => {
          setTheme(theme === 'light' ? 'dark' : 'light');
        };

        return (
          <button type="button" aria-label="Toggle theme" onClick={handleToggle}>
            {theme}
          </button>
        );
      }
      ```

      This is a reconstruction of the task, not a transcription of line 38. The same type argument can be written inline: `useState<'light' | 'dark'>('light')`.

      #### Phrase you can say

      Line 38 is not in the PDF. That was the candidate's screen. If the `useState` there holds the theme, I type it as a union: `useState<'light' | 'dark'>('light')`. Then `setTheme` accepts only those two strings, rather than the type of the single initial literal.
  - id: "sree-digibank.7a"
    label: "7a"
    topic: "JavaScript Promises & Async Handling"
    title: "What's the difference between Promises and async/await?"
    body: |
      #### Short answer

      You describe a promise as a value for a future result. It has three states: pending, fulfilled, and rejected. `async/await` is syntax on top of a promise, not a second way to make a request.

      A function marked `async` always returns a promise. `await` inside it reads the fulfillment value and throws the rejection into the nearest `catch`. Until the promise settles, that function is paused, and the JavaScript thread is not blocked: other tasks keep running. Calling `loadWithAwait()` without `await` on the outside gives you a promise of the same kind as a `.then` chain.

      You catch a chain's error with `.catch`. In an `async` function you catch the same error with `try/catch`. `fetch` returns a promise in both forms.

      #### Code example

      ```js
      function loadWithThen() {
        return fetch('/api/news').then((response) => response.json());
      }

      async function loadWithAwait() {
        const response = await fetch('/api/news');
        return response.json();
      }
      ```

      Both functions return a promise of the parsed JSON. The second one reads top to bottom, because `await` unwraps the `fetch` promise.

      #### Phrase you can say

      A promise is a value for a future result: pending, fulfilled, or rejected. `async/await` is syntax on top of it. An `async` function returns a promise, and `await` reads the success and throws the rejection into `catch`. The thread is not blocked while that happens.
  - id: "sree-digibank.7b"
    label: "7b"
    topic: "JavaScript Promises & Async Handling"
    title: "Scenario: three APIs fetch news articles from different sources in parallel. Any of them can fail or be slow. If all fail, show an error. If one or two succeed, show or merge those results. If all three succeed, merge everything. How would you handle this?"
    body: |
      #### Short answer

      You start the three requests in parallel and wait for them with `Promise.allSettled`. It settles when every input has settled, and it returns an array of `fulfilled` or `rejected` statuses. You merge the successful article arrays. If none succeeded, you show an error. One success, two, or all three take the same path: the screen gets what actually arrived.

      `Promise.all` rejects the whole group on the first rejection, so articles that already arrived from the other sources never reach the screen. `Promise.any` returns only the first success and does not collect the rest. This scenario needs the full report from `Promise.allSettled`.

      #### Code example

      ```js
      async function fetchNews(url) {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      }

      async function loadNews() {
        const results = await Promise.allSettled([
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ]);

        const articles = [];

        for (const result of results) {
          if (result.status === 'fulfilled') {
            articles.push(...result.value);
          }
        }

        if (articles.length === 0) {
          throw new Error('All news sources failed');
        }

        return articles;
      }
      ```

      Each source returns an array of articles. A rejection stays on `result.reason` and stays out of the list.

      #### Phrase you can say

      I start the three sources in parallel and collect them with `Promise.allSettled`. I merge the successful lists. If none succeeded, I show an error. If one, two, or all three succeeded, the screen shows their merge. `Promise.all` would hide the successful responses behind the first rejection.
  - id: "sree-digibank.7c"
    label: "7c"
    topic: "JavaScript Promises & Async Handling"
    title: "If API 1 succeeds in one second, will Promise.any wait for the other two? What exactly does Promise.any do?"
    body: |
      #### Short answer

      No. You do not wait for the other two. If API 1 fulfills in one second, `Promise.any` fulfills in that same second with API 1's value. The results of API 2 and API 3 are not part of that value. The requests themselves may still be in flight: the combinator does not cancel them.

      `Promise.any` waits for the first fulfillment. It skips rejections while a promise is still pending and might still fulfill. If every one rejects, `Promise.any` rejects with an `AggregateError`, and the reasons of every rejection are inside it. That is a different combinator from `Promise.race`: a race settles on the first settlement of any kind, including the first rejection.

      #### Code example

      ```js
      const firstArticles = await Promise.any([
        fetchNews('/api/news/a'),
        fetchNews('/api/news/b'),
        fetchNews('/api/news/c'),
      ]);
      ```

      If `/api/news/a` fulfills at the first second, `await` resumes at the first second, and `firstArticles` holds the response of that source only.

      #### Phrase you can say

      No. If API 1 succeeds in one second, `Promise.any` settles with that value and does not wait for the other two. It takes the first success, skips rejections, and if all of them fail it rejects with an `AggregateError`. It does not cancel the requests still in flight.
  - id: "sree-digibank.7d"
    label: "7d"
    topic: "JavaScript Promises & Async Handling"
    title: "Promise.any settles as soon as one call succeeds, but you need all the successful results. How do you handle that?"
    body: |
      #### Short answer

      You take `Promise.allSettled` and keep every `fulfilled` status. `Promise.any` would already have settled on the first success, and later successful responses are not part of its result.

      `allSettled` waits for all three and returns one record per call. You walk the array, take `result.value` from the successes, and merge the articles. An empty success list is the error screen: they all failed. One, two, or three successes produce one merged list. The rejection reason sits on `result.reason` if you need to log it.

      #### Code example

      ```js
      async function fetchNews(url) {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      }

      async function loadNews() {
        const results = await Promise.allSettled([
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ]);

        const articles = [];

        for (const result of results) {
          if (result.status === 'fulfilled') {
            articles.push(...result.value);
          }
        }

        if (articles.length === 0) {
          throw new Error('All news sources failed');
        }

        return articles;
      }
      ```

      `articles` receives every successful array, including the ones that arrived after the first.

      #### Phrase you can say

      `Promise.any` returns only the first success, so I switch to `Promise.allSettled`. I wait for all three, take every `fulfilled` result, and merge the articles. If none succeeded, I show an error.
  - id: "sree-digibank.7e"
    label: "7e"
    topic: "JavaScript Promises & Async Handling"
    title: "Say API 1 takes 2 seconds, API 2 fails after 1 second, and API 3 takes 15 seconds. What happens with Promise.allSettled? You already have results at 2 seconds, so why wait for all three?"
    body: |
      #### Short answer

      You wait for `Promise.allSettled` until 15 seconds, together with the slowest call. At 2 seconds only two outcomes are ready, and the combinator's promise is still pending, because API 3 has not settled.

      - 1 second: API 2 is rejected. The group is still waiting.
      - 2 seconds: API 1 is fulfilled. The group is still waiting.
      - 15 seconds: API 3 is fulfilled. `allSettled` returns three records: success, rejection, success.

      You wait because the contract of `Promise.allSettled` is a full report for every input. The success at 15 seconds is part of that report. The two outcomes you already know live inside their own promises, and the one array comes out only when the third has settled too.

      A separate cap of 5 seconds on one call is a timeout around that call. `allSettled` itself does not set that cap: it waits for the actual settlement.

      #### Code example

      ```js
      const results = await Promise.allSettled([
        fetchNews('/api/news/a'),
        fetchNews('/api/news/b'),
        fetchNews('/api/news/c'),
      ]);
      ```

      With the layout of 2 seconds, a failure at 1 second, and 15 seconds, this `await` resumes at 15 seconds. `results[0].status` is `'fulfilled'`, `results[1].status` is `'rejected'`, and `results[2].status` is `'fulfilled'`.

      #### Phrase you can say

      `Promise.allSettled` waits for API 3 and settles at 15 seconds. At 2 seconds the success of API 1 and the failure of API 2 are already known, and the combinator is still pending. It waits because it returns a full report for all three, including the slow success.
  - id: "sree-digibank.7f"
    label: "7f"
    topic: "JavaScript Promises & Async Handling"
    title: "An API call can take anywhere from 2 to 15 seconds, but you should wait at most 5 seconds and then cancel it. How would you do that? Write it quickly."
    body: |
      #### Short answer

      You cancel the request itself with an `AbortController`. Next to it you set a `setTimeout` of 5 seconds. If the response arrives sooner, `finally` clears the timer, and `abort` never fires. If there is still no response at 5 seconds, the timer calls `controller.abort()`. `fetch` with that `signal` rejects, usually with an `AbortError`, and a 15-second call does not keep the wait open.

      This cancels the work. It does more than stop waiting: the browser stops the request because of the signal. The sample below is a walkthrough of the task.

      #### Code example

      ```js
      async function fetchNews(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 5000);

        try {
          const response = await fetch(url, { signal: controller.signal });
          return await response.json();
        } finally {
          clearTimeout(timeoutId);
        }
      }
      ```

      A success at 2 seconds returns JSON and clears the timer. Silence longer than 5 seconds becomes a `fetch` rejection at the moment of `abort`.

      #### Phrase you can say

      I create an `AbortController` and pass its `signal` to `fetch`. After 5 seconds I call `abort`, and if the response arrived earlier I clear the timer. The request is cancelled, and the `fetch` promise rejects.
  - id: "sree-digibank.7g"
    label: "7g"
    topic: "JavaScript Promises & Async Handling"
    title: "Is there another way to do this without AbortController?"
    body: |
      #### Short answer

      Yes. You can build the waiting limit out of promises: you pass the request, and a second promise that rejects after 5 seconds, to `Promise.race`. The race settles with whichever outcome happens first. A response at 2 seconds becomes the race's result. Silence until 5 seconds becomes the timeout's rejection, and `await` does not stay hanging, even if the API would have answered at 15 seconds.

      This is a different mechanism from `AbortController`. `Promise.race` stops the wait. The race does not cancel `fetch` itself: the request can still finish in the background, and nobody reads that result anymore. Cancelling the connection is still the abort signal. `finally` here only clears the `setTimeout`, so the timer does not reject a promise nobody is waiting on after a success.

      #### Code example

      ```js
      function fetchWithRace(url) {
        let timeoutId;

        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Timed out'));
          }, 5000);
        });

        const request = fetch(url).then((response) => response.json());

        return Promise.race([request, timeout]).finally(() => {
          clearTimeout(timeoutId);
        });
      }
      ```

      The race has two participants. The winner is whichever one settles first, by fulfillment or by rejection.

      #### Phrase you can say

      Yes. I put `fetch` and a promise that rejects after 5 seconds into `Promise.race`. Whichever outcome comes first becomes the result. That is how I stop waiting at five seconds. The race does not cancel the HTTP request. `AbortController` does that.
  - id: "sree-digibank.7h"
    label: "7h"
    topic: "JavaScript Promises & Async Handling"
    title: "Hint: use a Promise concept. How would you solve it that way?"
    note: "This leads to Promise.race."
    body: |
      #### Short answer

      The hint to use a promise concept leads to `Promise.race`. That is the combinator, not a label you repeat. `Promise.race` takes several promises and settles with the one that settles first. The first fulfillment fulfills the race, and the first rejection rejects the race. The other participants no longer affect the race's result.

      You race the request against a second promise that calls `reject` after 5 seconds. If the JSON arrives at 2 seconds, the race fulfills with that data, and the five-second rejection never reaches it. If the request would answer only at 15 seconds, the timeout wins at 5 seconds, and the wait ends with the `Timed out` error. If the request itself rejects at 1 second, the race rejects at 1 second too: unlike `Promise.any`, the first rejection is already final for `Promise.race`.

      A race limits the wait. It does not cancel HTTP. You can still cut the connection separately: call `controller.abort()` inside the timeout, and keep that same five-second promise in the race. The hint leads to `Promise.race` as the way to set the limit with promises.

      #### Code example

      ```js
      function fetchWithRace(url) {
        let timeoutId;

        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Timed out'));
          }, 5000);
        });

        const request = fetch(url).then((response) => response.json());

        return Promise.race([request, timeout]).finally(() => {
          clearTimeout(timeoutId);
        });
      }
      ```

      `Promise.race([request, timeout])` is the whole idea behind the hint. `clearTimeout` in `finally` kills the timer if the request settled first.

      #### Phrase you can say

      The hint leads to `Promise.race`. I race the request against a promise that rejects after 5 seconds. The race settles on the first outcome: the data, if the response is earlier, or the timeout error, if the cap fires first. The request's own first rejection settles the race too. The request itself is not cancelled.
  - id: "sree-digibank.8a"
    label: "8a"
    topic: "JavaScript Generators"
    title: "Have you worked with generator functions in JavaScript?"
    body: |
      #### Short answer

      Yes, at the language level: you can write a generator and drive it by hand. A star function, `function*`, returns a generator. The body does not run when you call it. Each `next` runs the body until the nearest `yield`, returns `{ value, done }`, and pauses the function. The next `next` continues from that pause. When there are no more `yield`s, you get `{ value: undefined, done: true }`.

      Redux Saga is built on this same mechanism, conceptually. The middleware runs the generator, and on each `yield` it receives a description of an effect, performs it, and wakes the generator with the result through `next`. That is the library's model. Whether you wired it into a project is a separate fact about your experience, and an invented project does not get filled in.

      #### Code example

      ```js
      function* countTo(limit) {
        for (let current = 1; current <= limit; current += 1) {
          yield current;
        }
      }

      const sequence = countTo(3);

      sequence.next();
      sequence.next();
      sequence.next();
      sequence.next();
      ```

      Calling `countTo(3)` only creates the generator. Four `next` calls in a row produce `{ value: 1, done: false }`, then 2, then 3, then `{ value: undefined, done: true }`.

      #### Phrase you can say

      Yes. A generator is `function*` and `yield`. The call returns a generator, the body starts on `next`, and it pauses on `yield`. Redux Saga conceptually runs functions like that: the middleware performs the effect from `yield` and continues the generator with the result.
  - id: "sree-digibank.8b"
    label: "8b"
    topic: "JavaScript Generators"
    title: "Have you worked with these hands-on?"
    note: "He followed up by confirming that you know Redux Saga conceptually but haven't used it in a project."
    body: |
      #### Short answer

      You work with a generator hands-on: you write `function*`, you `yield`, and you pull values with `next`. That is a small piece of code you can type in the round, and it does not need someone else's biography.

      The interviewer then draws the line around Redux Saga. You know it conceptually, and you have not used it in a project. The concept is this. Saga middleware runs a generator. `yield call(fn, arg)` does not call `fn` by itself: it hands back an effect object. The middleware runs `fn`, then calls `next` with its result, and the generator continues as if the code were sequential. `yield put(action)` hands back an effect that makes the middleware `dispatch`. `take` pauses the generator until the action you asked for.

      This sketch is the model you explain. It is not a saga you shipped. If the project had no Saga, you say so.

      #### Code example

      ```js
      function* countTo(limit) {
        for (let current = 1; current <= limit; current += 1) {
          yield current;
        }
      }

      const sequence = countTo(2);
      sequence.next();
      sequence.next();
      ```

      ```js
      import { call, put } from 'redux-saga/effects';

      function fetchUserApi(id) {
        return fetch(`/api/users/${id}`).then((response) => response.json());
      }

      function* fetchUser(action) {
        const user = yield call(fetchUserApi, action.id);
        yield put({ type: 'user/received', payload: user });
      }
      ```

      The first snippet is a generator you write by hand. The second is the conceptual shape of Redux Saga: `call` and `put` describe effects, and the middleware performs them.

      #### Phrase you can say

      I write a generator by hand: `function*`, `yield`, and `next`. I know Redux Saga conceptually: the middleware performs the `call` and `put` effects and wakes the generator with the result. I have not wired Redux Saga into a project.
  - id: "sree-digibank.9a"
    label: "9a"
    topic: "Micro-Frontends"
    title: "Do you have experience with micro-frontends?"
    note: "He asked this in response to your question about the project's architecture."
    body: |
      #### Short answer

      He asked this in response to your question about the project's architecture. The interviewer turned a question about how the system is put together into a question about your experience. You answer with a one-to-two minute frame and then explain the architecture. You do not invent a biography of a specific person.

      The frame. The role is frontend developer. The stack is React, TypeScript, and a build that can load a separately built UI. One project is a shell and one business area that ships on its own deploy. One measurable result is only yours: that area shipped without rebuilding the shell, or the shell's first bundle no longer contained its code. If you have not had that project, you say so.

      The architecture worth describing after "how is the project put together". The product in the browser is composed of parts with separate releases. The shell owns the document, sign-in, and the top-level routes, and it mounts the piece it needs. A remote owns one area and exposes an entry point. The usual loading mechanism is Module Federation: the shell reads a remote entry, and shared React plus the UI kit load as one instance, on one agreed version, because hooks break across two copies of React. The contract is narrow: the route, the input props, and events going out. Screen state stays inside the remote. A shared mutable store across remotes ties their versions and releases together. You ask the interviewer where their host boundary is and which dependencies they share.

      #### Phrase you can say

      I asked about the project's architecture, and micro-frontends are exactly how that architecture is put together. If I have shipped them, I name the shell, one remote, and the result: the remote went out on its own, without rebuilding the shell. The shell owns sign-in and routes, the remote owns its area, React is one shared instance, and the contract is the route, props, and events. Where is your host boundary, and which libraries are shared?
---

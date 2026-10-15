---
interview: aravind-digibank
order: 4
title: "Aravind Keelapatta — DigiBank"
candidate: Aravind Keelapatta
interviewer: Srujan Dasa ADITYA
initiative: DigiBank
questions:
  - id: aravind-digibank.1a
    label: "1a"
    topic: "Introduction & Project Experience"
    title: "Start with your introduction while I go through your resume."
    body: |
      #### Short answer

      This is a one-to-two minute speaking frame. Do not drop in a biography of a particular person: you supply the name, the years, the employer, and the project title from your own resume.

      Four slots, in this order. Role: frontend, and which layer of the interface you own. Stack: React and what actually sits next to it for you. One project: the domain and your area, in one or two sentences. One measurable result: a number you can explain. If you do not have your own number, leave that slot empty.

      #### Phrase you can say

      I am a frontend developer, and React is what I use day to day. I name the stack that was on the project, not a generic list from the job post. Then I take one project and say which part of the interface I owned. I finish with one measurable result in my own words, and I can walk through how it came about.
  - id: aravind-digibank.1b
    label: "1b"
    topic: "Introduction & Project Experience"
    title: "Which project did you work on at EPAM?"
    note: "He then confirmed your stack: React, Cypress for tests, Agile/Scrum, 3+ years with React."
    body: |
      #### Short answer

      You name the project with facts you can say out loud: the domain, the kind of product, and what you did in it. You do not reveal a secret client name or an internal codename, and you do not replace them with an invented client story. The formula is enough: a product in a given domain, and your area was these screens.

      In the same answer you confirm the stack that already came up in this conversation. React is the interface. Cypress is browser tests for screen scenarios, not a replacement for unit tests. Agile/Scrum is how the team ran iterations: a plan, a short cycle, a demo. More than three years is your time with React, and you state it separately from the name of one project.

      #### Phrase you can say

      At EPAM I name the project by domain and by my area, without a secret client name and without an invented client story. I confirm the stack like this: React, Cypress for tests, Agile/Scrum, and more than three years with React.
  - id: aravind-digibank.1c
    label: "1c"
    topic: "Introduction & Project Experience"
    title: "Have you faced any particular challenge in React, and how did you solve it? This could be performance, SEO, or anything else."
    body: |
      #### Short answer

      Take one challenge you actually closed, and walk through the mechanism. Do not drop in someone else's project or someone else's percentage.

      A common performance case: the input and a heavy list live in one component. Every character changes state, and React draws the list again even though the rows do not need that text. You move the list into its own component, wrap it in `memo`, and do not pass the field text into it. The parent still holds the search string. The list has no props that change with that string, so `memo` skips that render. If there are a great many rows, the next step is to draw only the visible window.

      SEO is a different mechanism. A page that appears only after JavaScript runs in the browser ships empty HTML. You send the public screen as an already built document: server render or prerender that route. Interaction that needs the browser stays on the client.

      #### Code example

      ```jsx
      import { memo, useState } from 'react';

      const rows = [
        { id: '1', title: 'Alpha' },
        { id: '2', title: 'Beta' },
      ];

      const HeavyList = memo(function HeavyList() {
        return (
          <ul>
            {rows.map((row) => (
              <li key={row.id}>{row.title}</li>
            ))}
          </ul>
        );
      });

      export default function SearchPage() {
        const [query, setQuery] = useState('');

        return (
          <>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <HeavyList />
          </>
        );
      }
      ```

      `query` lives in `SearchPage`. `HeavyList` does not receive that string, so a change to the text does not fail the list's props check.

      #### Phrase you can say

      The search field lived next to a heavy list, and every character re-rendered the list. I moved the list into `memo` and did not pass it the field text. If the question is SEO, I send the public page as ready HTML, not as an empty root after the script loads.
  - id: aravind-digibank.2a
    label: "2a"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "Implement a debounce hook for a search input that calls an API as the user types. A sample hook and an App.js usage at the bottom are enough, with a placeholder function instead of a real API."
    body: |
      #### Short answer

      The hook `useDebounce(value, delay)` takes the current text and the delay in milliseconds. Both values come in as arguments. Inside, `useEffect` sets a `setTimeout`, and the cleanup calls `clearTimeout` with that timer's id. The previous input does not survive long enough to fire the call. `delay` is a parameter of the hook, and the effect closes over that number.

      `App` at the bottom calls the hook during render: `useDebounce(inputValue, 300)`. A second effect watches the debounced string and calls `searchApi`. That function is a placeholder: it returns the string through `Promise.resolve` and does not hit the network. While the debounced string is empty, the placeholder is not called.

      Lines 12 and 17 are not in the PDF: the interviewer is looking at the candidate's editor. The example below is a walkthrough of the prompt, a reconstruction of the hook and `App.js`, not a copy of that screen.

      #### Code example

      ```jsx
      import { useEffect, useState } from 'react';

      function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
          const timerId = setTimeout(() => {
            setDebouncedValue(value);
          }, delay);

          return () => {
            clearTimeout(timerId);
          };
        }, [value, delay]);

        return debouncedValue;
      }

      function searchApi(query) {
        return Promise.resolve(query);
      }

      export default function App() {
        const [inputValue, setInputValue] = useState('');
        const debouncedQuery = useDebounce(inputValue, 300);

        useEffect(() => {
          if (debouncedQuery === '') {
            return;
          }

          searchApi(debouncedQuery);
        }, [debouncedQuery]);

        return (
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        );
      }
      ```

      #### Phrase you can say

      `useDebounce` takes a value and a delay. In the effect I set a `setTimeout` and call `clearTimeout` in the cleanup. In `App` I pass the field text and 300 ms, and I call the `searchApi` placeholder with the debounced string.
  - id: aravind-digibank.2b
    label: "2b"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "What about clearing the timer? Won't the interval keep running?"
    body: |
      #### Short answer

      Without cleanup the previous timer still finishes and applies the delayed update. In this hook that is not `setInterval`. It is a new `setTimeout` on every input. The word "interval" here means the old callbacks keep living if you do not cancel them.

      You keep the id that `setTimeout` returned, and in the effect cleanup you call `clearTimeout(timerId)`. Cleanup runs before the next effect run and on unmount. A new character changes `value`, the old id is cleared, and the new timer closes over the new text. The placeholder sees a pause of `delay`, not every character.

      If the code really called `setInterval`, `clearInterval` would stop it. Debounce needs `clearTimeout`.

      The example below is a walkthrough of the prompt: the cleanup of the same hook, not a line from the PDF.

      #### Code example

      ```jsx
      useEffect(() => {
        const timerId = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        return () => {
          clearTimeout(timerId);
        };
      }, [value, delay]);
      ```

      #### Phrase you can say

      I keep the id from `setTimeout` and call `clearTimeout` in the effect cleanup. Without that, the old timers still apply the update. This is not an interval: I clear the specific timer from the previous input.
  - id: aravind-digibank.2c
    label: "2c"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "You use a timer, but where are you passing values in, and how will the hook actually be invoked?"
    body: |
      #### Short answer

      The value and the delay go in as arguments at the moment you call the hook. The call sits in the component body and runs during render: `useDebounce(inputValue, 300)`. You cannot call the hook from the `setTimeout` callback. The rules of hooks require the same order at the top level of the component.

      After that, `value` lives in the effect's closure. `value` and `delay` are in the dependency array. When the field changes, React clears the previous timer first, then sets a new one and closes over the new text. The hook returns the debounced string. A second effect passes that string to the placeholder.

      The example below is a walkthrough of the prompt. The screen with this call is not in the PDF.

      #### Code example

      ```jsx
      function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
          const timerId = setTimeout(() => {
            setDebouncedValue(value);
          }, delay);

          return () => {
            clearTimeout(timerId);
          };
        }, [value, delay]);

        return debouncedValue;
      }

      const debouncedQuery = useDebounce(inputValue, 300);
      ```

      #### Phrase you can say

      I call the hook from the component during render: `useDebounce(inputValue, 300)`. The text and the delay go in as arguments, the timer inside the effect closes over them, and `clearTimeout` clears it.
  - id: aravind-digibank.2d
    label: "2d"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "On line 12 you only declared the input value. How will you use it in the program? Write it out."
    body: |
      #### Short answer

      Line 12 is not in the PDF. It is a line from the candidate's screen. A lone `useState` is not enough: the declared string is not connected to anything yet.

      You make the field controlled. `value` reads `inputValue`, and `onChange` writes `event.target.value` back into state. You pass that same `inputValue` into `useDebounce` together with the delay. The debounced result is in the dependency list of a second effect, and that effect calls the `searchApi` placeholder. Until the chain "field, state, hook, placeholder" is wired, the declaration does not take part in the program.

      The example below is a walkthrough of the prompt, a reconstruction of how this value is used.

      #### Code example

      ```jsx
      const [inputValue, setInputValue] = useState('');
      const debouncedQuery = useDebounce(inputValue, 300);

      useEffect(() => {
        if (debouncedQuery === '') {
          return;
        }

        searchApi(debouncedQuery);
      }, [debouncedQuery]);

      return (
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      );
      ```

      #### Phrase you can say

      `inputValue` is the field's `value` and the first argument of `useDebounce`. `onChange` writes the input, and the placeholder receives the debounced string.
  - id: aravind-digibank.2e
    label: "2e"
    topic: "Custom Hooks & Debouncing (live coding)"
    title: "Your useDebounce takes only the input value, but at the bottom you return the debounce method from line 17 with a delay. Won't that delay be undefined every time?"
    body: |
      #### Short answer

      Line 17 is not in the PDF. It is a line from the candidate's screen. Yes: in that shape `delay` is `undefined` every time.

      `useDebounce` takes only the field value and returns a method. The method has `delay` as its own parameter, but the call `debounce(fn)` does not pass a second argument. The hook has no `delay` of its own, so the returned function does not close over a number. `setTimeout` receives `undefined`, and the browser reads that delay as `0`. The search fires immediately.

      If the name `delay` is not declared anywhere, strict mode throws a `ReferenceError`, not a silent `undefined`. The wording "undefined every time" matches the missing argument: the parameter exists on the returned method, and nothing passed a value into it.

      The fix: `delay` becomes a parameter of the hook. The returned function closes over that number, and the call is `useDebounce(inputValue, 300)`. For a search field the same fix is a value hook: the effect sets a timer with that `delay`, the hook returns the debounced string, and the placeholder is called with it.

      The example below is a walkthrough of the prompt, a reconstruction, not line 17 from the PDF.

      #### Code example

      ```javascript
      const inputValue = '';

      function useDebounce(value) {
        const debounce = (fn, delay) => {
          const timerId = setTimeout(() => fn(value), delay);
          return () => clearTimeout(timerId);
        };

        return debounce;
      }

      const debounce = useDebounce(inputValue);
      debounce((query) => {
        console.log(query);
      });
      ```

      ```javascript
      const inputValue = '';

      function useDebounce(value, delay) {
        const debounce = (fn) => {
          const timerId = setTimeout(() => fn(value), delay);
          return () => clearTimeout(timerId);
        };

        return debounce;
      }

      const debounce = useDebounce(inputValue, 300);
      debounce((query) => {
        console.log(query);
      });
      ```

      ```jsx
      import { useEffect, useState } from 'react';

      function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
          const timerId = setTimeout(() => {
            setDebouncedValue(value);
          }, delay);

          return () => {
            clearTimeout(timerId);
          };
        }, [value, delay]);

        return debouncedValue;
      }
      ```

      In the first snippet the method's second parameter is not passed, so `delay` is `undefined`. In the second, the method closes over the hook's `delay`, and the timer receives `300`. The third snippet is the search-field hook: the delay is a parameter there too, and the timer is cleared with `clearTimeout`.

      #### Phrase you can say

      Yes, `delay` was `undefined`: the hook took only the text and returned a method that had not closed over a number. I add `delay` to the parameters of `useDebounce`, and `setTimeout` waits for that number, not for zero.
  - id: aravind-digibank.3a
    label: "3a"
    topic: "State Management: Context API vs Redux"
    title: "What's the difference between the Context API and Redux, and which would you use for which kind of application?"
    body: |
      #### Short answer

      The Context API passes a value down the tree without threading props through every level. The provider holds the value, and a descendant reads it with `useContext`. This is not a store with actions and reducers. A new context value updates the components that read that context.

      Redux keeps state outside the tree. A change goes through an action and a reducer, middleware takes the side effect, and a component subscribes to a slice through a selector. That gives you an action log and a way to leave alone the components that do not need that slice.

      You take Context for rare values across the tree: theme, locale, the current user. You take Redux when there are many slices, updates are frequent, and you need middleware. A small screen with a couple of flags does not get moved from Context to Redux in advance.

      #### Phrase you can say

      Context passes rare values down the tree, and consumers update together with that value. Redux is a store: an action, a reducer, middleware, and a selector for a slice. I keep theme and session in Context, and frequent entities and requests in Redux.
  - id: aravind-digibank.3b
    label: "3b"
    topic: "State Management: Context API vs Redux"
    title: "For something like an admin dashboard, how do you decide whether the Context API or Redux is the better approach?"
    body: |
      #### Short answer

      Look at how often the state changes and who re-renders because of it. The label "admin" does not pick the library.

      Context fits when the shared values are few and they change rarely: who signed in, locale, theme. One large value that holds filters, table rows, and selected ids updates every consumer, including a screen that shows a different slice.

      Redux fits when there are many entities, the filter and the selection live apart, requests go through middleware, and a component needs one slice. A selector limits the subscription.

      You can split both on one dashboard: Context for session and theme, Redux for tables and the cache. The criteria are update frequency, the number of independent slices, and whether a component needs a subscription to part of the data.

      #### Phrase you can say

      In an admin app I put session and theme in Context, and frequent table slices and the cache in Redux, so typing in a filter does not re-render the whole tree. Update frequency decides it, and whether the component reads one slice.
  - id: aravind-digibank.3c
    label: "3c"
    topic: "State Management: Context API vs Redux"
    title: "Have you worked with any Redux middlewares?"
    note: "You mentioned Redux Observable and Redux Thunk."
    body: |
      #### Short answer

      Yes. Two middlewares worth naming properly here: Redux Thunk and Redux Observable.

      Redux Thunk sits on the `dispatch` chain and lets you dispatch a function, not only an action object. The function receives `dispatch` and `getState`. Inside it you make the request and then dispatch plain actions. That is how async APIs are shaped in classic Redux: the reducer stays synchronous, and the side effect lives in the thunk.

      Redux Observable is middleware too, but its side effect is an RxJS stream. An epic takes a stream of actions and returns a stream of actions. That is how you compose cancellation of the previous request, debounce, and retry when the flow is longer than one `then`. A new action cancels the stale request with an operator such as `switchMap`.

      You name Thunk for an ordinary request. You name Observable when actions are easier to handle as a stream.

      #### Phrase you can say

      With Redux I have used Redux Thunk and Redux Observable. Thunk dispatches a function: a request inside, then a plain action. Observable handles actions as an RxJS stream and can cancel the previous request with `switchMap`.
  - id: aravind-digibank.3d
    label: "3d"
    topic: "State Management: Context API vs Redux"
    title: "What is the main use of this middleware?"
    body: |
      #### Short answer

      The main use of Redux Thunk is an async side effect. You dispatch a function `(dispatch, getState) => { ... }`. It reads the store, calls the API, and then dispatches a plain object. That object is what reaches the reducer. The reducer does not perform the request.

      The main use of Redux Observable is the same side effect as a stream. The epic listens for `user/load` actions. `switchMap` unsubscribes from the previous request when a new action arrives and subscribes to the new one. The epic emits a `user/loaded` action. Debounce, retry, and cancellation live in stream operators.

      Both intercept `dispatch` before the reducer. Thunk accepts a function. Observable accepts a stream of actions and returns a stream of actions.

      #### Code example

      ```javascript
      const fetchUser = (id) => (dispatch, getState) => {
        if (getState().users.byId[id]) {
          return;
        }

        return fetch(`/api/users/${id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(String(response.status));
            }
            return response.json();
          })
          .then((user) => {
            dispatch({ type: 'user/loaded', payload: user });
          });
      };

      dispatch(fetchUser('4'));
      ```

      ```javascript
      import { ajax } from 'rxjs/ajax';
      import { filter, map, switchMap } from 'rxjs';

      const loadUserEpic = (action$) =>
        action$.pipe(
          filter((action) => action.type === 'user/load'),
          switchMap((action) =>
            ajax.getJSON(`/api/users/${action.id}`).pipe(
              map((user) => ({ type: 'user/loaded', payload: user })),
            ),
          ),
        );
      ```

      In the thunk, `getState().users.byId` is a slice that is already in the store. If the user is there, the request is not repeated. On every new `user/load`, the epic cancels the previous `ajax` with `switchMap`.

      #### Phrase you can say

      Thunk is for dispatching a function: it makes the request and then a plain action. Observable is for when the request is a stream: a new action cancels the previous request, and the result is what goes into the store.
  - id: aravind-digibank.3e
    label: "3e"
    topic: "State Management: Context API vs Redux"
    title: "Theme toggle scenario: the app is already built with the Context API, and a new light/dark theme requirement comes in. Without worrying about CSS, how would you toggle and maintain the theme state across the whole app with Context?"
    body: |
      #### Short answer

      There is no CSS in this answer. The theme is the string `light` or `dark` in the provider's state, plus a function that toggles that string.

      `createContext(null)` creates the channel. `ThemeProvider` holds `useState('light')`. `toggleTheme` looks at the current value: `light` becomes `dark`, and `dark` becomes `light`. The provider's `value` holds both the string and the function. The provider wraps the tree, so there is one piece of state for the app, not a copy on every screen.

      Any descendant reads the same pair through `useContext(ThemeContext)`. The button calls `toggleTheme` and shows the string itself. The button does not keep its own `useState` for the theme: the toggle and the rest of the tree would drift apart.

      #### Code example

      ```jsx
      import { createContext, useContext, useState } from 'react';

      const ThemeContext = createContext(null);

      function ThemeProvider({ children }) {
        const [theme, setTheme] = useState('light');

        const toggleTheme = () => {
          setTheme((current) => (current === 'light' ? 'dark' : 'light'));
        };

        return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
          </ThemeContext.Provider>
        );
      }

      function ThemeToggle() {
        const value = useContext(ThemeContext);

        return (
          <button type="button" onClick={value.toggleTheme}>
            {value.theme}
          </button>
        );
      }

      export default function App() {
        return (
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        );
      }
      ```

      #### Phrase you can say

      The theme is `light` or `dark` in the provider's state. `toggleTheme` changes the string, the provider puts the string and the function into Context, and any descendant reads them with `useContext`. I do not describe CSS.
  - id: aravind-digibank.3f
    label: "3f"
    topic: "State Management: Context API vs Redux"
    title: "Write the basic code for it."
    body: |
      #### Short answer

      The basic code is a provider, the context value, and a button that changes that value. There is no CSS: the button shows the string `light` or `dark` itself.

      State lives in `ThemeProvider`. `toggleTheme` flips the string. `Provider` passes `{ theme, toggleTheme }` to the whole tree inside `App`. `ThemeToggle` reads that object with `useContext` and puts `toggleTheme` on the click.

      The example below is a walkthrough of the prompt, a minimal working version, not a recording of a screen.

      #### Code example

      ```jsx
      import { createContext, useContext, useState } from 'react';

      const ThemeContext = createContext(null);

      function ThemeProvider({ children }) {
        const [theme, setTheme] = useState('light');

        const toggleTheme = () => {
          setTheme((current) => (current === 'light' ? 'dark' : 'light'));
        };

        return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
          </ThemeContext.Provider>
        );
      }

      function ThemeToggle() {
        const value = useContext(ThemeContext);

        return (
          <button type="button" onClick={value.toggleTheme}>
            {value.theme}
          </button>
        );
      }

      export default function App() {
        return (
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        );
      }
      ```

      #### Phrase you can say

      `ThemeProvider` holds the theme and `toggleTheme` in Context. The button inside the provider calls `toggleTheme` and shows the current string. The button has no state of its own.
  - id: aravind-digibank.3g
    label: "3g"
    topic: "State Management: Context API vs Redux"
    title: "I only need the toggle functionality and how you maintain it through the Context API."
    body: |
      #### Short answer

      The toggle is one function over one piece of state. `theme` lives in the provider, and the start value is `'light'`. `toggleTheme` passes `setTheme` a function of the current value: `light` becomes `dark`, and `dark` becomes `light`.

      Context holds it like this. `ThemeContext.Provider` receives `value={{ theme, toggleTheme }}`. Descendants do not create a second `useState` for the theme. They read that pair. While the provider wraps the tree, a click changes the same string for the whole app.

      Button markup and CSS are outside this answer. You need the state, the function, and the provider value.

      The example below is a walkthrough of the prompt: the provider and the toggle only.

      #### Code example

      ```jsx
      import { createContext, useState } from 'react';

      const ThemeContext = createContext(null);

      function ThemeProvider({ children }) {
        const [theme, setTheme] = useState('light');

        const toggleTheme = () => {
          setTheme((current) => (current === 'light' ? 'dark' : 'light'));
        };

        return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
          </ThemeContext.Provider>
        );
      }
      ```

      #### Phrase you can say

      One `useState` in the provider and `toggleTheme`, which switches `light` and `dark`. Context receives `{ theme, toggleTheme }`. Components do not keep their own copy of the theme.
  - id: aravind-digibank.3h
    label: "3h"
    topic: "State Management: Context API vs Redux"
    title: "How would you consume it in any component?"
    body: |
      #### Short answer

      In any component under the provider you call `useContext(ThemeContext)`. You get back what the provider put in `value`: the `theme` string and the `toggleTheme` function.

      `createContext(null)` sets the default. Outside the provider the hook returns `null`, and you cannot read fields on `null`: check first. Under the provider the check passes. The button shows the string and calls `toggleTheme` on click. Styles are not needed.

      There is one channel. `ThemeContext` in the provider and in the consumer is the same object. A second `createContext` without a shared import is a different channel, and it stays `null`.

      #### Code example

      ```jsx
      import { createContext, useContext, useState } from 'react';

      const ThemeContext = createContext(null);

      function ThemeProvider({ children }) {
        const [theme, setTheme] = useState('light');

        const toggleTheme = () => {
          setTheme((current) => (current === 'light' ? 'dark' : 'light'));
        };

        return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
          </ThemeContext.Provider>
        );
      }

      function AnyComponent() {
        const value = useContext(ThemeContext);

        if (value === null) {
          return null;
        }

        return (
          <button type="button" onClick={value.toggleTheme}>
            {value.theme}
          </button>
        );
      }

      export default function App() {
        return (
          <ThemeProvider>
            <AnyComponent />
          </ThemeProvider>
        );
      }
      ```

      #### Phrase you can say

      Any descendant of the provider calls `useContext(ThemeContext)` and takes `theme` and `toggleTheme`. Outside the provider that value is `null`, so I check it first. The context in the provider and in the component is the same one.
  - id: aravind-digibank.4a
    label: "4a"
    topic: "JavaScript Promises & Async Handling"
    title: "Scenario: three APIs return news articles and run in parallel. If all three fail, show \"something went wrong\". If any succeed, merge and show their results, ignoring the failures. How would you handle this?"
    body: |
      #### Short answer

      You start the three calls immediately, as the arguments of `Promise.allSettled`. While the array is evaluated, all three `fetchNews` calls have already started. `allSettled` waits for every outcome and does not reject because of the first failure. The array keeps the argument order.

      In this walkthrough a fulfilled `value` is an array of articles. You merge outcomes with `status: 'fulfilled'`. You skip an outcome with `status: 'rejected'`. If the list is empty after the filter, the screen shows the string `something went wrong`. If there is an article from at least one API, you show the merge and you do not surface the errors.

      `fetch` itself does not reject on status 404 or 500. You turn that response into a rejection through `response.ok`, otherwise it lands in the successes. `Promise.all` on this condition rejects the whole set on the first error, and the successful lists are not kept in its result.

      #### Code example

      ```javascript
      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      function show(value) {
        console.log(value);
      }

      async function loadNews() {
        const results = await Promise.allSettled([
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ]);

        const articles = results
          .filter((result) => result.status === 'fulfilled')
          .flatMap((result) => result.value);

        if (articles.length === 0) {
          show('something went wrong');
          return;
        }

        show(articles);
      }
      ```

      #### Phrase you can say

      I start the three requests immediately and wait for them with `Promise.allSettled`. I merge the successful lists and skip the rejections. If there are no successes, I show `something went wrong`.
  - id: aravind-digibank.4b
    label: "4b"
    topic: "JavaScript Promises & Async Handling"
    title: "But what happens if one API rejects?"
    body: |
      #### Short answer

      One rejection does not cancel the other calls and does not reject the `Promise.allSettled` promise. The failed API is an object `{ status: 'rejected', reason }` in the array. You skip it. A success is `{ status: 'fulfilled', value }`, and you add `value` to the shared list.

      The string `something went wrong` is for when no fulfilled outcomes remain, meaning all three rejected. One rejection next to live responses is ignored, and you show the merged articles.

      `Promise.all` on the same set rejects on that one rejection. Its `await` does not reach the merge of the successful lists unless you caught each call yourself.

      #### Code example

      ```javascript
      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      function show(value) {
        console.log(value);
      }

      async function loadNews() {
        const results = await Promise.allSettled([
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ]);

        const articles = [];

        for (const result of results) {
          if (result.status === 'rejected') {
            continue;
          }
          articles.push(...result.value);
        }

        if (articles.length === 0) {
          show('something went wrong');
          return;
        }

        show(articles);
      }
      ```

      #### Phrase you can say

      One `reject` inside `allSettled` is a `rejected` outcome. I skip it and merge the lists that arrived. I show `something went wrong` only when there are no successes.
  - id: aravind-digibank.4c
    label: "4c"
    topic: "JavaScript Promises & Async Handling"
    title: "Promise.allSettled waits for everything to finish. If API 1 takes 2 seconds, API 2 fails after 1 second, and API 3 takes 20 seconds, what happens?"
    body: |
      #### Short answer

      `Promise.allSettled` waits for all three calls, including the one that takes 20 seconds. The failure at one second and the success at two seconds are not handed out yet.

      At 1 second API 2 rejects. The `rejected` outcome is stored internally, and the wait continues. At 2 seconds API 1 fulfills, the `fulfilled` outcome is stored too, and the `await` is still pending. At 20 seconds API 3 settles, and only then `allSettled` fulfills. The array has three outcomes. The order matches the arguments, not the finish order: index 1 is API 2, even though it finished first.

      Waiting 20 seconds is what `allSettled` does. The rejection at 1 second does not finish the set and does not reject the whole call.

      #### Code example

      ```javascript
      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      async function loadNews() {
        const results = await Promise.allSettled([
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ]);

        return results;
      }
      ```

      One `await` covers all three promises. The array appears after the slowest call, here after 20 seconds.

      #### Phrase you can say

      `allSettled` returns the array only after the slowest call, together with the API that takes 20 seconds. The failure at 1 second and the success at 2 seconds do not come out before that. One rejection does not reject the whole `allSettled`.
  - id: aravind-digibank.4d
    label: "4d"
    topic: "JavaScript Promises & Async Handling"
    title: "You already have a result from API 1 at 2 seconds, so why wait 20 seconds for everything? How would you handle that?"
    body: |
      #### Short answer

      To show the first success sooner, `Promise.allSettled` is the wrong tool. It does not fulfill at 2 seconds while the third call takes 20 seconds. API 1's result is already there, but a single `await` on `allSettled` holds it until the longest call finishes.

      You show results as each promise settles. On success you append to the list and draw it immediately. On failure you skip that source. When every call has settled and the list is empty, you show `something went wrong`. API 1's success appears at 2 seconds. API 3 is appended at 20 seconds. The screen is not silent for that whole time.

      `Promise.any` covers the first success separately from collecting the rest. It fulfills on the first success, skips an early rejection, and does not wait 20 seconds. If every call rejects, `any` rejects with an `AggregateError`. You collect the other results with your own `then` handlers on the same promises: `any` shows the first success, and the handlers append the later ones. You do not put `allSettled` in charge of the early screen: it is the call that withholds the first success until the 20 second call finishes.

      #### Code example

      ```javascript
      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      function show(value) {
        console.log(value);
      }

      function showIncrementally(calls) {
        const articles = [];
        let settledCount = 0;

        for (const call of calls) {
          call
            .then((items) => {
              articles.push(...items);
              show(articles);
            })
            .catch(() => undefined)
            .finally(() => {
              settledCount += 1;
              if (settledCount === calls.length && articles.length === 0) {
                show('something went wrong');
              }
            });
        }
      }

      function showFirstSuccess(calls) {
        return Promise.any(calls).then((first) => {
          show(first);
          return first;
        });
      }

      function loadNews() {
        const calls = [
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ];

        showFirstSuccess(calls).catch(() => undefined);
        showIncrementally(calls);
      }
      ```

      `showFirstSuccess` draws the first success, here API 1 at 2 seconds. `showIncrementally` appends the other lists on the same promises and keeps the string `something went wrong` for the case with no successes. This snippet does not use `allSettled`: it would not hand out the first success before second 20.

      #### Phrase you can say

      I do not use `allSettled` for the early success: it also waits for the 20 second call. I show the first result with `Promise.any`, and I append the other successes with separate `then` handlers. `something went wrong` is only for when every call has settled and the list is empty.
  - id: aravind-digibank.4e
    label: "4e"
    topic: "JavaScript Promises & Async Handling"
    title: "With async/await, if API 1 takes 15 seconds, the next call only starts after it finishes. Isn't that sequential rather than parallel, and therefore slower?"
    body: |
      #### Short answer

      Yes, if each next call is written after an `await`. That code is sequential, and for independent requests it is slower. `await` does not start the request. The request starts when you call `fetchNews`. `await` pauses this async function until the promise settles.

      If API 1 takes 15 seconds, the line with the second call starts running after those 15 seconds. The total time is the sum of the durations.

      The parallel form: you call all three functions before the first `await`. Three promises are already running. Then one `await` waits for the promises that have already started. For a merge that keeps failures, that wait is `Promise.allSettled`. The start does not depend on `await`. The word `async` by itself neither parallelizes the calls nor stops them.

      #### Code example

      ```javascript
      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      async function loadSequential() {
        const first = await fetchNews('/api/news/a');
        const second = await fetchNews('/api/news/b');
        const third = await fetchNews('/api/news/c');

        return [first, second, third];
      }

      async function loadParallel() {
        const firstCall = fetchNews('/api/news/a');
        const secondCall = fetchNews('/api/news/b');
        const thirdCall = fetchNews('/api/news/c');

        return Promise.allSettled([firstCall, secondCall, thirdCall]);
      }
      ```

      In `loadSequential` the second `fetchNews` comes after `await`, so when the first API takes 15 seconds it starts only afterwards. In `loadParallel` the three calls are already made, and `allSettled` only waits for them.

      #### Phrase you can say

      Yes. `await` between the calls makes them sequential: the second starts after the first has taken 15 seconds. I call all three functions first, then I wait once for the promises that have already started.
  - id: aravind-digibank.4f
    label: "4f"
    topic: "JavaScript Promises & Async Handling"
    title: "Promise.race ignores the other two once the first one settles, but we need all three results. How do you solve that?"
    body: |
      #### Short answer

      You do not use `Promise.race` when you need three results. Its promise settles on the first finish, fulfillment or rejection. The other two outcomes never arrive on that promise. `race` does not cancel the other requests: it stops being the place you read them from.

      `Promise.allSettled` gives you all three results: the array has an outcome for each call, and one rejection does not drop someone else's success. If you need to show the first success immediately and still collect the rest, you attach your own `then` to each promise.

      `Promise.any` does not collect the trio either. It returns the first success and settles there. You use it when you need one winner, and you run the full merge separately.

      #### Code example

      ```javascript
      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      async function firstSettlementOnly() {
        return Promise.race([
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ]);
      }

      async function everyResult() {
        return Promise.allSettled([
          fetchNews('/api/news/a'),
          fetchNews('/api/news/b'),
          fetchNews('/api/news/c'),
        ]);
      }
      ```

      `firstSettlementOnly` returns one outcome. `everyResult` returns three.

      #### Phrase you can say

      `race` returns only the first settlement, and the other two results are not on that promise. I read all three outcomes from `Promise.allSettled`, or from my own `then` on each call.
  - id: aravind-digibank.4g
    label: "4g"
    topic: "JavaScript Promises & Async Handling"
    title: "You said parallel calls. How exactly?"
    body: |
      #### Short answer

      Parallel means the three requests start before you wait. You call `fetchNews` three times in a row and you do not put `await` between those lines. Each function returns a promise immediately, and the network is already in flight.

      Then `Promise.all` receives those already started promises and waits for them. `Promise.all` does not start the requests. It waits for what you already called. If one promise rejects, `Promise.all` rejects as a whole.

      When you need to skip one source's rejection and keep the other lists, you pass those same already started promises to `Promise.allSettled`. An empty merge is shown with the string `something went wrong`. Choosing `all` or `allSettled` does not change the parallelism: that came from starting the three calls with no `await` between them.

      #### Code example

      ```javascript
      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      async function loadInParallel() {
        const firstCall = fetchNews('/api/news/a');
        const secondCall = fetchNews('/api/news/b');
        const thirdCall = fetchNews('/api/news/c');

        return Promise.all([firstCall, secondCall, thirdCall]);
      }
      ```

      #### Phrase you can say

      I call all three functions first and get three promises, then I pass them to `Promise.all`. There is no `await` between the starts. The requests are already running by then.
  - id: aravind-digibank.4h
    label: "4h"
    topic: "JavaScript Promises & Async Handling"
    title: "Three different calls, how?"
    note: "You suggested splitting them into separate methods called from useEffect."
    body: |
      #### Short answer

      Three different calls are three separate functions, and you call them from `useEffect`. `loadFirst`, `loadSecond`, and `loadThird` each return their request's promise immediately.

      In the effect you write the three calls in a row, with no `await` between them. All three requests start in one pass of the effect. Then `Promise.all` waits for the promises that have already started and puts the three lists into state. If you write `await loadFirst()` and only then call `loadSecond()`, the second method starts after the first, and the calls are no longer parallel.

      One rejection rejects this `Promise.all`. To keep the other two answers when one method fails, you use `Promise.allSettled` on the same three promises and keep the string `something went wrong` for an empty success. That does not change the start from `useEffect`: the methods are still called separately, with no wait between the calls.

      #### Code example

      ```jsx
      import { useEffect, useState } from 'react';

      function fetchNews(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      function loadFirst() {
        return fetchNews('/api/news/a');
      }

      function loadSecond() {
        return fetchNews('/api/news/b');
      }

      function loadThird() {
        return fetchNews('/api/news/c');
      }

      export default function News() {
        const [articles, setArticles] = useState([]);

        useEffect(() => {
          const firstCall = loadFirst();
          const secondCall = loadSecond();
          const thirdCall = loadThird();

          Promise.all([firstCall, secondCall, thirdCall]).then((lists) => {
            setArticles(lists.flat());
          });
        }, []);

        return <p>{articles.length}</p>;
      }
      ```

      #### Phrase you can say

      I split the requests into `loadFirst`, `loadSecond`, and `loadThird`, and I call all three from `useEffect` with no `await` between them. `Promise.all` waits for the promises that have already started. The methods start in one pass of the effect.
  - id: aravind-digibank.4i
    label: "4i"
    topic: "JavaScript Promises & Async Handling"
    title: "Timeout scenario: an API might take 5, 10, 15 or 20 seconds, but you should wait at most 5 seconds and then abort or cancel the request. How would you do that? Write sample code."
    body: |
      #### Short answer

      You wait at most 5 seconds, even if the API itself would have answered in 5, 10, 15, or 20. `AbortController` does the cancellation. `setTimeout` decides when.

      You create the controller and pass `controller.signal` to `fetch`. A timer of 5000 ms calls `controller.abort()`. A request that has not finished is cut off, and `fetch` rejects with an `AbortError`. A call that would take 10, 15, or 20 seconds does not hold the interface: the wait ends at 5 seconds.

      `clearTimeout` in `finally` clears the timer if the response arrived earlier. Otherwise the timer fires on a request that already finished. Clearing the timer does not cancel the network. `abort()` cancels the network. The short platform call is `AbortSignal.timeout(5000)`. The sample shows the controller and the timer explicitly.

      The example below is a walkthrough of the prompt.

      #### Code example

      ```javascript
      async function loadWithinFiveSeconds(url) {
        const controller = new AbortController();
        const timerId = setTimeout(() => {
          controller.abort();
        }, 5000);

        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return await response.json();
        } finally {
          clearTimeout(timerId);
        }
      }
      ```

      If the timer managed to call `abort()`, `fetch` rejects with `AbortError` before the body is read. `finally` clears the timer in either outcome.

      #### Phrase you can say

      I create an `AbortController`, pass `signal` to `fetch`, and call `abort()` after 5 seconds. The request is cut off with an `AbortError`. If the response arrived earlier, I clear the timer in `finally`.
  - id: aravind-digibank.5a
    label: "5a"
    topic: "Micro-Frontends"
    title: "Do you have experience with micro-frontends?"
    body: |
      #### Short answer

      Experience here is the architecture, not the answer "yes". A micro-frontend is a separate UI application with its own build and its own release. A shell, the host, composes them on the page. The usual loading mechanism is Module Federation: the host pulls in a remote at runtime, and a team ships its piece without rebuilding the neighbors.

      The boundary is narrow. A piece owns a route or a fragment of the screen. Outward it offers a contract: a route, an event, or a thin shared UI library. A shared mutable store across every team ties the releases together: shipping one piece starts breaking someone else's state. You limit what is shared to a versioned contract and to what you can pass as a prop or an event.

      In the answer you name three parts you actually built or wired: the shell, one independent piece, and the contract between them. You state years and project counts only when they are yours.

      #### Phrase you can say

      I compose micro-frontends as a shell plus independently shipped pieces, usually through Module Federation. Between them I keep a contract of a route, an event, or a thin UI library. I do not use a shared mutable store as the glue between teams.
---

---
interview: suryateja-digibank
order: 6
title: "Suryateja Kandukuri — DigiBank"
candidate: Suryateja Kandukuri
interviewer: Lekha Adada, Satya Siva Sai Harshith Jyothula
initiative: DigiBank
questions:
  - id: suryateja-digibank.1a
    label: "1a"
    topic: "Introduction"
    title: "Describe your current role and your experience with React."
    body: |
      #### Short answer

      This is a one-to-two minute speaking frame. Do not drop in a biography of a particular person: you supply the name, the years, the employer, and the project title from your own resume.

      Four slots, in this order. Current role: what you do and which part of the interface you own. Stack: React and what actually sits next to it for you, for example TypeScript, the build, and data loading. One project: what the product is and what you did in it, in one or two sentences. One measurable result: a number you can explain, rather than a list of technologies.

      If they do not ask about a specific episode, the frame ends there.

      #### Phrase you can say

      I am a frontend developer, and React is what I use day to day. Next to the stack I name what I actually use on the project: TypeScript, state, requests, and the build. Then I take one project and say which part of the interface I owned. I finish with one measurable result in my own words, and I can walk through how it came about.
  - id: suryateja-digibank.2a
    label: "2a"
    topic: "State management"
    title: "What techniques have you used for state management?"
    body: |
      #### Short answer

      Name the techniques you have used, and say which scale each one is for. Local component state is `useState`, and when updates branch you use `useReducer`. Rare values shared down the tree, such as a theme, are the Context API. Lists and entities that many screens read are Redux: an action, a reducer, and a selector.

      Keep the product names as your own. This answer only needs the map: local, through context, through the store.

      #### Phrase you can say

      Locally I keep state with `useState`, and I gather branching updates in `useReducer`. I put the theme and other rare values in the Context API. Shared lists that several screens need go into Redux, and I read them with a selector. In the interview I name the set I actually had on my project.
  - id: suryateja-digibank.2b
    label: "2b"
    topic: "State management"
    title: "What are the drawbacks of the Context API? Why did you choose Redux over it?"
    body: |
      #### Short answer

      The Context API passes a value down the tree. A subscriber reads it with `useContext`. The drawback is the subscription: a new context value re-renders everyone who reads that context. If one object holds the user and the task list, a change to the tasks also re-renders the component that only needs the name.

      The second place this breaks is a new value on every render of the provider. An object built inline in JSX is a different reference every time, and subscribers update again even when the fields are the same.

      The Context API has no built-in action log, no middleware, and no separate place for an async flow. It handles a rare value such as a theme comfortably. You choose Redux when many components read the same data in parts: `useSelector` subscribes the component to the selector result, the update goes through an action and a reducer, and the side effect lives in middleware.

      #### Code example

      ```jsx
      const AppContext = createContext(null);

      function UserName() {
        const value = useContext(AppContext);
        return <span>{value.user.name}</span>;
      }

      function App() {
        const user = { name: 'Ada' };
        const tasks = [{ id: '1' }];

        return (
          <AppContext.Provider value={{ user, tasks }}>
            <UserName />
          </AppContext.Provider>
        );
      }
      ```

      ```jsx
      const name = useSelector((state) => state.user.name);
      ```

      In the first snippet `value` is a new object on every render of `App`, so `UserName` updates even when only `tasks` change. The selector in the second snippet returns the name: a component that reads only that is not subscribed to the other fields of the store.

      #### Phrase you can say

      I use the Context API for rare values such as a theme. Its weak spot is the subscription to the whole value: any new context object re-renders every consumer, even when the component needs one field. For lists that many screens read, I choose Redux: I take the slice with `useSelector`, and the update goes through an action and a reducer.
  - id: suryateja-digibank.2c
    label: "2c"
    topic: "State management"
    title: "In Redux, how do you get a value from the store?"
    body: |
      #### Short answer

      In a function component you read a value from the store with the `useSelector` hook. You pass it a function: the current state in, the slice the component needs out. The hook subscribes the component to the store. After an update it runs the selector again and compares the result with the previous one using `Object.is`. If the reference or the primitive is the same, that selector does not cause an extra render.

      A one-off snapshot with no subscription is `store.getState()`. For a screen that should stay in step with the data, you use `useSelector`. In class code you pass the same selector to `mapStateToProps`.

      #### Code example

      ```jsx
      const users = useSelector((state) => state.users.items);
      ```

      #### Phrase you can say

      I read a value from the store with `useSelector`. I pass a function that pulls out the slice I need, and the component is subscribed to the store. After an action the selector runs again, and the component re-renders when the selector result has changed.
  - id: suryateja-digibank.2d
    label: "2d"
    topic: "State management"
    title: "Are you aware of Redux Saga?"
    body: |
      #### Short answer

      Yes. Redux Saga is middleware for side effects. A saga is a generator. It intercepts an action, runs an effect, and dispatches the next action into the store. The usual chain is `takeEvery` or `takeLatest` listening for an action type, `call` invoking the API, and `put` dispatching the result.

      The reducer stays a pure function and does not perform the request itself. You connect the saga to the store as middleware, alongside the rest of the chain.

      This is the shape of the tool, not a story of a particular rollout. If the project used a thunk or the listener from Redux Toolkit, say that, and show that you know Saga by this scheme.

      #### Code example

      ```javascript
      function* loadUsers(action) {
        const users = yield call(fetchUsers, action.payload);
        yield put({ type: 'users/loaded', payload: users });
      }

      function* usersSaga() {
        yield takeEvery('users/fetch', loadUsers);
      }
      ```

      #### Phrase you can say

      I know Redux Saga as middleware for side effects. A saga is a generator: `takeEvery` listens for an action, `call` hits the API, and `put` puts the result back in the store. The reducer stays pure, and the request lives in the saga.
  - id: suryateja-digibank.2e
    label: "2e"
    topic: "State management"
    title: "Explain the flow of dispatching an action and getting data back."
    body: |
      #### Short answer

      The path is this. The component calls `dispatch` with an action: a type and, if needed, a payload. The store runs that action through the middleware chain. A thunk or Redux Saga can call the API at that step. When the response is in, the middleware dispatches the next action, now carrying the data or the error.

      The action then reaches the reducer. The reducer is a pure function: previous state and the action in, the next state out. You do not put the request inside the reducer. The store saves the new state and notifies subscribers. `useSelector` returns the new slice, and the component renders it.

      Data comes back to the component as new state read by the selector, not as the return value of `dispatch`.

      #### Code example

      ```javascript
      dispatch({ type: 'users/fetch' });

      function usersReducer(state = { items: [] }, action) {
        if (action.type === 'users/loaded') {
          return { items: action.payload };
        }

        return state;
      }
      ```

      ```jsx
      const users = useSelector((state) => state.users.items);
      ```

      The first action starts the load in middleware. The `users/loaded` action already carries the list, the reducer puts it in state, and the selector hands the list to the component.

      #### Phrase you can say

      I `dispatch` an action. Middleware can call the API and dispatch the next action with the data. The reducer computes the next state as a pure function, the store saves it, and the component reads the slice with `useSelector`. Data comes back as new state, not as the return value of `dispatch`.
  - id: suryateja-digibank.2f
    label: "2f"
    topic: "State management"
    title: "Scenario: make an API call to get a list of users or tasks, store it in the Redux store, and use it in several components. Explain how you'd structure this (Redux/Flux pattern)."
    body: |
      #### Short answer

      In Redux/Flux the flow is one way. For a list of users or tasks I keep one slice of the store: the items themselves and a loading status. The view dispatches a "load" action. A side effect, a thunk or a saga, calls the API and then dispatches an action with the array. The reducer replaces the items in the slice. Several components read the same selector, so they see one list.

      A task list uses the same structure: a different state key, and the same roles for the action, the effect, the reducer, and the selector. Components do not cache the list in their own `useState`, or the screens drift apart.

      #### Code example

      ```jsx
      function usersReducer(state = { items: [], status: 'idle' }, action) {
        switch (action.type) {
          case 'users/loading':
            return { ...state, status: 'loading' };
          case 'users/loaded':
            return { items: action.payload, status: 'ready' };
          default:
            return state;
        }
      }

      const fetchUsers = () => async (dispatch) => {
        dispatch({ type: 'users/loading' });
        const response = await fetch('/api/users');
        const users = await response.json();
        dispatch({ type: 'users/loaded', payload: users });
      };

      const selectUsers = (state) => state.users.items;

      function UserList() {
        const users = useSelector(selectUsers);
        return <p>{users.length}</p>;
      }

      function UserCount() {
        const users = useSelector(selectUsers);
        return <p>{users.length}</p>;
      }
      ```

      `UserList` and `UserCount` subscribe to one selector. After `users/loaded` both see the same array. A tasks slice is the same four roles.

      #### Phrase you can say

      I put the list of users or tasks in one Redux slice. The component dispatches the load, a thunk or a saga calls the API and dispatches the data, and the reducer stores the array. Several components read one selector, so the list is shared. For tasks I repeat the same Flux shape: action, effect, reducer, selector.
  - id: suryateja-digibank.3a
    label: "3a"
    topic: "Hooks"
    title: "Have you ever created custom hooks?"
    body: |
      #### Short answer

      Yes, if you had repeated logic that uses hooks. A custom hook is a function whose name starts with `use`, and it calls other hooks. You write one to lift state and an effect out of a component: input delay, a subscription, a form field.

      Each call of the hook keeps its own state. Two components that call the same hook do not get a shared store. Shared data still lives in a parent, in the Context API, or in Redux.

      In the spoken answer, name one hook you wrote: which arguments it takes and what it returns. Do not invent a project name or a biography.

      #### Phrase you can say

      Yes, I have written custom hooks. It is a function named with `use`, it calls ordinary hooks, and I move repeated logic into it. I will name one hook of mine: what I pass in and what it returns. Each call has its own state, and the hook by itself does not become a shared store.
  - id: suryateja-digibank.3b
    label: "3b"
    topic: "Hooks"
    title: "Which hooks have you used most often?"
    body: |
      #### Short answer

      Most often it is the basic set. `useState` is a local value. `useEffect` is synchronization with the outside world after render: a request, a subscription, a timer. `useRef` is a mutable cell that does not re-render the component: a timer id, a DOM node. `useMemo` is a remembered calculation. `useCallback` is a remembered function, when its reference must not change on every render. `useReducer` is for when the next state depends on which action branch ran.

      With Redux you add `useSelector` and `useDispatch`. In the answer, list the ones you used, and say in one clause what each was for.

      #### Phrase you can say

      Most often I use `useState`, `useEffect`, and `useRef`. I take `useMemo` and `useCallback` when I need to keep a calculation or a function reference. Branching updates go to `useReducer`. I work with the store through `useSelector` and `useDispatch`.
  - id: suryateja-digibank.4a
    label: "4a"
    topic: "Debouncing (live coding)"
    title: "What is debouncing?"
    body: |
      #### Short answer

      Debounce postpones an action while events arrive in a burst. Each new event resets the wait. The action runs once, when the pause lasts for the given delay.

      For a search box it looks like this. While the person is typing, the timer starts over every time. The request goes out once, 500 ms after the input stops. Intermediate values are not sent to the API.

      You pick the delay for the task. In this search prompt the delay is 500 ms.

      #### Phrase you can say

      Debounce means wait until the events go quiet, then run the action once. On search, every keystroke resets the timer, and I call the API 500 ms after the user stops typing.
  - id: suryateja-digibank.4b
    label: "4b"
    topic: "Debouncing (live coding)"
    title: "Live coding: write a useDebounce custom hook that takes a delay. For a search box, call the API only 500ms after the user stops typing."
    body: |
      #### Short answer

      The `useDebounce` hook takes a value and a delay and returns a value that updates only after a pause. Inside, `useEffect` schedules `setTimeout`. The effect cleanup calls `clearTimeout`, so fast typing does not pile up several firings.

      The search box keeps the text in its own state and calls the hook with a delay of 500. A second `useEffect` depends on the delayed text and only then calls `/api/users`. While the person types, the raw text changes, and the request waits for 500 ms of quiet.

      The example below is a walkthrough of the prompt. It is a minimal working version of the question, not a transcript of someone else's screen.

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

      function UserSearch() {
        const [query, setQuery] = useState('');
        const debouncedQuery = useDebounce(query, 500);

        useEffect(() => {
          if (debouncedQuery === '') {
            return;
          }

          const controller = new AbortController();

          fetch(`/api/users?q=${encodeURIComponent(debouncedQuery)}`, {
            signal: controller.signal,
          });

          return () => {
            controller.abort();
          };
        }, [debouncedQuery]);

        return (
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        );
      }
      ```

      #### Phrase you can say

      `useDebounce` takes a value and a delay. In the effect I set a timer and call `clearTimeout` in the cleanup. For search I pass 500 ms. The request depends on the delayed value, so it goes out once, when the user has stopped typing.
  - id: suryateja-digibank.4c
    label: "4c"
    topic: "Debouncing (live coding)"
    title: "Why are you calling clearTimeout inside the hook?"
    body: |
      #### Short answer

      `clearTimeout` cancels the previous timer. Every change of `value` runs the effect again: first the cleanup of the previous run, then a new `setTimeout`. Without the cancel, each keystroke would leave its own timer, and after 500 ms they would all fire, including the intermediate strings.

      The same cleanup runs on unmount. A late timer then does not call `setDebouncedValue` on a component that is already gone.

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

      I call `clearTimeout` to drop the timer from the previous input. While the person is typing, the old firings are cancelled, and the delayed value updates once after the pause. On unmount the cleanup clears the timer too.
  - id: suryateja-digibank.4d
    label: "4d"
    topic: "Debouncing (live coding)"
    title: "Does the useEffect run every time the value changes?"
    body: |
      #### Short answer

      Yes, if `value` is in the dependency array. After the render in which `value` changed, React first calls the cleanup of the previous effect, then the effect body again. In debounce that is exactly what schedules a new timer for the new value.

      The effect body and the timer callback are different moments. The effect runs on every change of `value`. `setDebouncedValue` inside the timer runs only if that timer survives until the end of the delay and `clearTimeout` does not clear it.

      An empty dependency array would leave the effect as a single run after mount. With no array, the effect would run after every render of the component.

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

      Yes. `value` is in the dependencies, so `useEffect` runs after every change of `value`. The previous timer is cleared first, then a new one is set. The delayed value itself changes only if the pause lasts to the end of the delay.
  - id: suryateja-digibank.4e
    label: "4e"
    topic: "Debouncing (live coding)"
    title: "What happens if there's no timer and the API call sits directly inside useEffect?"
    body: |
      #### Short answer

      If `fetch` sits directly in the effect and the dependency is the current input, a request goes out on every change of the value. A five-character word makes five requests. Responses can arrive out of order, and an earlier response overwrites a newer input.

      The screen jitters as well: the loading status flashes on every character, and the server receives intermediate text the user has already deleted. The timer is what collapses those changes into one call after the pause.

      #### Code example

      ```jsx
      useEffect(() => {
        fetch(`/api/users?q=${encodeURIComponent(value)}`);
      }, [value]);
      ```

      #### Phrase you can say

      Without a timer, an effect with `value` in the dependencies calls the API on every input. You get as many requests as there are changes, responses can overtake each other, and the screen can show a stale result. Debounce leaves one request after the pause.
  - id: suryateja-digibank.5a
    label: "5a"
    topic: "Data fetching and async JavaScript"
    title: "Inside the useEffect, write a simple API call (e.g. /api/users) that passes the typed input as a query parameter."
    body: |
      #### Short answer

      The effect depends on the typed text. The text goes into a query parameter, and `fetch` calls `/api/users`. `URLSearchParams` encodes the string, so spaces and special characters do not break the URL.

      The example is a walkthrough of the prompt: the minimal call inside `useEffect`, as the wording asks.

      #### Code example

      ```jsx
      useEffect(() => {
        const params = new URLSearchParams({ q: query });

        fetch(`/api/users?${params.toString()}`);
      }, [query]);
      ```

      #### Phrase you can say

      In `useEffect` I build a query parameter from the typed text and call `fetch` on `/api/users`. The effect depends on that text, so new input makes a new request. I use `URLSearchParams` to encode it.
  - id: suryateja-digibank.5b
    label: "5b"
    topic: "Data fetching and async JavaScript"
    title: "How do you handle the response? Are you aware of promises?"
    body: |
      #### Short answer

      Yes. `fetch` returns a promise. The promise settles with the server response or with a rejection. With `fetch`, an HTTP error such as 404 still fulfills the promise, so you check the status with `response.ok`. You read the body with `response.json()`: that is a second promise, now with the parsed data.

      A `.then` chain handles the steps in order. A rejection is caught by `.catch`. The same order can be written with `async`/`await`.

      #### Code example

      ```jsx
      fetch(`/api/users?q=${encodeURIComponent(query)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }

          return response.json();
        })
        .then((users) => {
          setUsers(users);
        })
        .catch((error) => {
          setStatus('error');
        });
      ```

      #### Phrase you can say

      Yes, I use promises. `fetch` returns a promise of a `Response`. I check `response.ok`, then `response.json()` gives a second promise with the data, and that is what I put in state. I take the error in `.catch`, or in `try/catch` around `await`.
  - id: suryateja-digibank.5c
    label: "5c"
    topic: "Data fetching and async JavaScript"
    title: "If you render the user list before the API has responded, will it throw an error? How do you handle the loading state?"
    body: |
      #### Short answer

      It throws if you render `users.map` while `users` is still `null` or `undefined`: that value has no `map` method, and this is a `TypeError`. If the initial value is an empty array, `map` does not throw, but until the response the screen shows an empty list, and that is easy to read as "there are no users".

      Keep the loading state separate from the list. While the status is `loading`, render a loading message and do not reach `map`. After a successful response the status becomes `ready`, and the list renders from the array. A separate `error` branch covers rejection, so the screen does not stay on loading forever.

      #### Code example

      ```jsx
      const [users, setUsers] = useState(null);
      const [status, setStatus] = useState('loading');

      useEffect(() => {
        let ignore = false;

        fetch('/api/users')
          .then((response) => response.json())
          .then((data) => {
            if (!ignore) {
              setUsers(data);
              setStatus('ready');
            }
          })
          .catch(() => {
            if (!ignore) {
              setStatus('error');
            }
          });

        return () => {
          ignore = true;
        };
      }, []);

      if (status === 'loading') {
        return <p>Loading</p>;
      }

      if (status === 'error' || users === null) {
        return <p>Error</p>;
      }

      return (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      );
      ```

      #### Phrase you can say

      If you call `map` before the response, while the list is still missing, you get a `TypeError`. An empty array does not throw, but it looks like there is no data. I keep a loading status and render the list only when the status is `ready` and state already holds an array.
  - id: suryateja-digibank.5d
    label: "5d"
    topic: "Data fetching and async JavaScript"
    title: "Store the fetch result in a const response. Which keyword is missing (expected answer: await)? How would you add try/catch?"
    note: "Expected answer: await."
    body: |
      #### Short answer

      The missing keyword is `await`. The line `const response = fetch(...)` stores a promise in `response`, not a `Response` object. `response.ok` and `response.json` are not available on the promise the way they are on the response. `await` pauses the `async` function until the promise settles, and `const response` then holds the `Response`.

      `try/catch` wraps that wait. In `try` you put `await fetch`, the `response.ok` check, and `await response.json()`. `catch` receives both a network rejection and a `throw` after a bad status. `await` by itself does not hide the error: a rejected promise still rejects the `async` function.

      #### Code example

      ```jsx
      async function loadUsers(query) {
        try {
          const response = await fetch(
            `/api/users?q=${encodeURIComponent(query)}`,
          );

          if (!response.ok) {
            throw new Error(String(response.status));
          }

          return await response.json();
        } catch (error) {
          setStatus('error');
          return [];
        }
      }
      ```

      #### Phrase you can say

      The missing keyword is `await`: without it `const response` holds a promise, not a `Response`. I mark the function `async` and write `const response = await fetch(...)`. That whole call sits in `try`, and in `catch` I move the screen to an error. I `throw` on a bad HTTP status myself, so it lands in `catch` too.
  - id: suryateja-digibank.5e
    label: "5e"
    topic: "Data fetching and async JavaScript"
    title: "If there's a second API call later in the code, does it wait for the first one or run independently?"
    body: |
      #### Short answer

      It depends on whether the second `fetch` started after an `await` of the first. If the second line begins only once the first one is already `await`ed, the second call waits: execution reaches it only after the first promise settles. That is sequential order.

      If both `fetch` calls run before you wait for their results, the second one goes on its own. Both requests are already on the network, and each settles on its own time. An `await` on the second line then waits only for the second promise. It does not start that request after the first one.

      #### Code example

      ```javascript
      const usersResponse = await fetch('/api/users');
      const tasksResponse = await fetch('/api/tasks');

      const usersPromise = fetch('/api/users');
      const tasksPromise = fetch('/api/tasks');
      ```

      The first pair is sequential: `/api/tasks` starts after `/api/users` settles. The second pair is parallel: both calls are made at once, and each promise lives on its own.

      #### Phrase you can say

      The second call waits for the first only if I start it after `await` on the first. If I call both `fetch`es back to back and only then wait, they run independently and at the same time. `await` does not start the request. It waits for a promise that already exists.
  - id: suryateja-digibank.5f
    label: "5f"
    topic: "Data fetching and async JavaScript"
    title: "If the second call depends on the first call's response, how do you handle it?"
    body: |
      #### Short answer

      Start the second request after the first response has been read. First `await fetch` and `await response.json()` on the first call. A field from that data, for example `id`, goes into the URL of the second call, and you wait for that one with `await` too. Until the first result exists, there is nothing to build the second URL from.

      That gives you a sequence: the second promise is created only after the first data. A parallel `Promise.all` does not fit here, because the second address needs the first response.

      #### Code example

      ```javascript
      const userResponse = await fetch('/api/users/1');
      const user = await userResponse.json();
      const tasksResponse = await fetch(`/api/users/${user.id}/tasks`);
      const tasks = await tasksResponse.json();
      ```

      #### Phrase you can say

      If the second call depends on the first, I `await` the first `fetch` and the `json` first. I take the field I need from the response and only then build the second URL. The second request starts when the first data is already there.
  - id: suryateja-digibank.5g
    label: "5g"
    topic: "Data fetching and async JavaScript"
    title: "Which keyword makes the code wait for the API call (async/await)?"
    body: |
      #### Short answer

      `await` is what makes the code wait. It stands in front of a promise, inside a function marked `async`. Until the `fetch` promise settles, the following lines of that function do not run. An `async` function still returns a promise to its caller.

      The word `async` by itself does not stop the request. Without `await`, the `fetch` call returns a promise immediately, and the next line continues without waiting for the response.

      #### Code example

      ```javascript
      async function loadUsers() {
        const response = await fetch('/api/users');
        return response.json();
      }
      ```

      #### Phrase you can say

      The code waits for the API call because of `await`. The function is marked `async`, otherwise `await` is not allowed inside it. `await` stands in front of the `fetch` promise, and the next line runs after that promise settles.
  - id: suryateja-digibank.5h
    label: "5h"
    topic: "Data fetching and async JavaScript"
    title: "Are you aware of Promise.all and Promise.allSettled?"
    body: |
      #### Short answer

      Yes. `Promise.all` takes a list of promises, waits for all of them, and returns an array of results in the same order. If one promise rejects, `Promise.all` rejects too, and the other results do not arrive in that assignment. The other requests on the network are not cancelled by that.

      `Promise.allSettled` waits until every promise settles, and it does not reject because of one failure. The output is an array of the same length: a success has `status` `fulfilled` and a `value`, a failure has `status` `rejected` and a `reason`. You use it when you need both outcomes, not only the case where every call succeeded.

      #### Code example

      ```javascript
      async function readJson(url) {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(String(response.status));
        }

        return response.json();
      }

      const [users, tasks] = await Promise.all([
        readJson('/api/users'),
        readJson('/api/tasks'),
      ]);

      const results = await Promise.allSettled([
        readJson('/api/users'),
        readJson('/api/tasks'),
      ]);
      ```

      #### Phrase you can say

      I use `Promise.all` when I need every response: one rejection rejects the whole `Promise.all`. I use `Promise.allSettled` when I want to wait for every call. It returns a status of `fulfilled` or `rejected` for each promise, and it does not fail because of one rejection.
  - id: suryateja-digibank.5i
    label: "5i"
    topic: "Data fetching and async JavaScript"
    title: "What can you use instead of fetch? Which other libraries?"
    body: |
      #### Short answer

      The direct stand-in for `fetch` in application code is axios. The call returns a promise as well. Axios parses JSON itself and puts it on `data`. An unsuccessful HTTP status makes axios reject the promise. `fetch` fulfills on a 404, and you check the status separately.

      You pass query parameters as a `params` object, and you configure headers and interceptors on an axios instance. A thin wrapper such as ky also sits on top of `fetch`. The platform API is still `fetch` itself: a library is for when the team wants JSON parsing, status errors, and interceptors already built.

      #### Code example

      ```javascript
      const { data } = await axios.get('/api/users', {
        params: { q: query },
      });
      ```

      #### Phrase you can say

      Instead of `fetch` I can use axios. It is promise-based too, it parses JSON into `data` itself, and it rejects the promise on a bad HTTP status. I pass the search parameter through `params`. `fetch` is still a fine choice when you do not need a wrapper.
  - id: suryateja-digibank.6a
    label: "6a"
    topic: "TanStack Query (React Query)"
    title: "You mention TanStack on your resume. How would you implement this API call with it? (Explaining the structure was enough.)"
    body: |
      #### Short answer

      TanStack Query, also called React Query, takes the manual "status, effect, data" cycle out of the component. This call only needs one `useQuery`. A full app, a router, and a provider tree are not required here: `QueryClientProvider` sits once higher in the tree, and the shape of the request is visible in the hook itself.

      `queryKey` is the cache key. It includes the resource name and the search text, so a new input is a different entry. `queryFn` runs the request and returns the data; if it throws, the query moves to an error. `status` shows the progress: `pending` while there is no data yet, `error` if `queryFn` rejected, `success` when `data` is ready to render. In TanStack Query v5 the waiting status is `pending`. In earlier React Query that same status was called `loading`.

      #### Code example

      ```jsx
      import { useQuery } from '@tanstack/react-query';

      function UserSearch({ query }) {
        const usersQuery = useQuery({
          queryKey: ['users', query],
          queryFn: async () => {
            const response = await fetch(
              `/api/users?q=${encodeURIComponent(query)}`,
            );

            if (!response.ok) {
              throw new Error(String(response.status));
            }

            return response.json();
          },
        });

        if (usersQuery.status === 'pending') {
          return <p>Loading</p>;
        }

        if (usersQuery.status === 'error') {
          return <p>{usersQuery.error.message}</p>;
        }

        return <p>{usersQuery.data.length}</p>;
      }
      ```

      #### Phrase you can say

      I describe this call with `useQuery`, without building the whole app. `queryKey` is `['users', query]`, so the search text is part of the key. `queryFn` does the `fetch` and returns JSON. From `status` I see `pending`, `error`, or `success`, and I render loading, the error, or `data`.
  - id: suryateja-digibank.7a
    label: "7a"
    topic: "Performance optimization"
    title: "Your resume says you cut load time from 30 seconds to 2 seconds. What was the situation, which techniques did you use, and how did you implement them?"
    body: |
      #### Short answer

      The PDF has the numbers, 30 seconds and 2 seconds, and no description of an incident. Do not fill in a specific project story, a cause, or a date. This is a speaking frame: a slow first load, then the techniques and how you put them in.

      The techniques that close a gap like that. Code splitting: routes and heavy screens move into separate chunks, not one startup file. Compression: the server sends static files compressed, and for modern traffic that is Brotli. Route-level loading: `lazy` and `Suspense` attach a page when the user opens it, not on the first byte.

      Implementation looks like this. You put `import()` boundaries on the routes. The startup chunk stays with the shell. Compression is turned on at the server or the CDN that serves those files. You compare size and first-load time before and after. You say 30 and 2 as the resume claim and then list these techniques. You do not add an invented story about which bundle and which day.

      #### Code example

      ```jsx
      import { lazy, Suspense } from 'react';
      import { Route, Routes } from 'react-router-dom';

      const TasksPage = lazy(() => import('./TasksPage'));

      function App() {
        return (
          <Suspense fallback={<p>Loading</p>}>
            <Routes>
              <Route path="/tasks" element={<TasksPage />} />
            </Routes>
          </Suspense>
        );
      }
      ```

      #### Phrase you can say

      I take "from 30 seconds to 2" as the resume claim and I do not invent an incident story. Then I name the techniques: code splitting, compression on the server, and loading pages at the route level. The implementation is `lazy` and `Suspense` on the route, a startup chunk only for the shell, and Brotli on the side that serves the static files.
  - id: suryateja-digibank.7b
    label: "7b"
    topic: "Performance optimization"
    title: "Did you configure Brotli compression on the server side or the client side?"
    body: |
      #### Short answer

      You configure Brotli on the server. The browser tells the request that it can accept the compression with the `Accept-Encoding: br` header. The server or the CDN compresses the bytes of JS, CSS, and other static files and responds with `Content-Encoding: br`. A React component does not compress those bytes.

      A build step can write already compressed files next to the originals. The server is still what sends them: it chooses the compressed variant and sets the header. The setting lives in the server or CDN config, not in client interface code.

      #### Phrase you can say

      I configure Brotli on the server. The client only says, through `Accept-Encoding`, that it accepts `br`. The server or the CDN compresses the static files and sets `Content-Encoding: br`. There is no such setting in React components.
  - id: suryateja-digibank.7c
    label: "7c"
    topic: "Performance optimization"
    title: "How do you reduce bundle size, and how do you load only the pages needed at first?"
    body: |
      #### Short answer

      You reduce bundle size by splitting it and by letting a chunk contain only the code it needs. A dynamic `import()` moves a screen into its own file. The bundler drops an unused export when libraries are imported by the piece, not as a whole. A heavy library stays out of the startup module if only one route needs it.

      What loads immediately is the shell and the current page. The other pages are declared with `lazy`: their chunk downloads when that route opens. `Suspense` shows a wait while that chunk arrives. The first load then does not include the code of other pages.

      #### Code example

      ```jsx
      import { lazy, Suspense } from 'react';
      import { Route, Routes } from 'react-router-dom';
      import Shell from './Shell';

      const TasksPage = lazy(() => import('./pages/TasksPage'));
      const UsersPage = lazy(() => import('./pages/UsersPage'));

      function App() {
        return (
          <Shell>
            <Suspense fallback={<p>Loading</p>}>
              <Routes>
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Routes>
            </Suspense>
          </Shell>
        );
      }
      ```

      #### Phrase you can say

      I split the bundle by route: a dynamic `import()` moves a page into its own chunk. The first download is the shell and the page that is open. The other pages connect through `lazy` when the user navigates to them. I do not put libraries that only one screen needs into the startup file.
  - id: suryateja-digibank.8a
    label: "8a"
    topic: "Memoization and re-renders (code review)"
    title: "Code shown on screen: a parent with a counter state passes a handleClick to a React.memo child. What would you improve for performance? (Expected answer: useCallback.)"
    note: "Expected answer: useCallback."
    body: |
      #### Short answer

      The improvement is `useCallback`. That screen is not in the PDF. Below is a walkthrough of the prompt from the description: the parent has counter state, and it passes `handleClick` to a child wrapped in `React.memo`.

      `React.memo` skips the child render when props match by `Object.is`. A function declared in the parent body is created again on every render. A new `handleClick` is not equal to the previous one, the `memo` comparison fails, and the child renders again even though the handler means the same thing. The counter re-renders the parent on every click, so without a stable reference `memo` saves nothing.

      `useCallback` returns the same function while the dependency array is unchanged. Here the handler updates state with the functional form and does not read `count`, so the dependencies are empty. The child receives the same `onClick` reference, and `React.memo` can skip it when only the parent's counter changes.

      #### Code example

      ```jsx
      import { memo, useCallback, useState } from 'react';

      const Child = memo(function Child({ onClick }) {
        return (
          <button type="button" onClick={onClick}>
            Add
          </button>
        );
      });

      function Parent() {
        const [count, setCount] = useState(0);

        const handleClick = useCallback(() => {
          setCount((value) => value + 1);
        }, []);

        return (
          <>
            <p>{count}</p>
            <Child onClick={handleClick} />
          </>
        );
      }
      ```

      #### Phrase you can say

      I wrap `handleClick` in `useCallback`. A new `handleClick` on every parent render breaks `React.memo`: the reference is different, and the child renders again. `useCallback` with an empty dependency list keeps one function, because the update goes through the functional form of `setCount`. Then `memo` skips the child when only the counter changes.
  - id: suryateja-digibank.9a
    label: "9a"
    topic: "JavaScript fundamentals"
    title: "How are references stored in heap vs. stack memory? Explain primitives vs. objects and functions."
    body: |
      #### Short answer

      In the language model a primitive is stored as the value itself in the binding. A local binding lives in the call record on the stack. Primitives are number, boolean, `null`, `undefined`, `bigint`, `symbol`, and string. Assigning a primitive copies the value: the two variables then live apart.

      An object is allocated on the heap. The binding on the stack holds a reference to that object. Assigning an object copies the reference, so two names point at one object on the heap. A field changed through one name is visible through the other.

      A function is an object. The function itself lives on the heap, and the function name stores a reference. A closure keeps an environment record, and that record also stays on the heap so it can outlive the return from the call.

      Engines may optimize placement, for example by keeping string data on the heap. What the interview wants is this model: a primitive by value, an object and a function by a reference from the stack into the heap.

      #### Code example

      ```javascript
      let count = 1;
      let nextCount = count;
      nextCount = 2;

      const user = { name: 'Ada' };
      const sameUser = user;
      sameUser.name = 'Bea';

      function greet() {
        return user.name;
      }
      ```

      `count` stays `1`, because a number is copied. `user.name` becomes `'Bea'`, because `sameUser` is the same reference. `greet` is a reference to a function on the heap, and that function reads the same `user` object.

      #### Phrase you can say

      I describe a primitive as a value in a binding on the stack: assignment copies it. An object lives on the heap, and the variable stores a reference, so two names share one object. A function is an object on the heap too, and the name holds a reference to it. Copying the reference does not copy the object.
  - id: suryateja-digibank.9b
    label: "9b"
    topic: "JavaScript fundamentals"
    title: "Output question: a snippet with console.log, setTimeout(0) and a Promise. What is the output order, and what concept explains it? (Event loop: microtask queue vs. task queue.)"
    note: "Event loop: microtask queue vs. task queue."
    body: |
      #### Short answer

      This is the event loop: the microtask queue versus the task queue. The PDF did not include the exact snippet, so the order below is the standard pattern for `console.log`, a Promise, and `setTimeout(0)`, not a quotation from the file.

      The current synchronous code runs first, including `console.log`. A promise callback goes to the microtask queue. A `setTimeout(0)` callback goes to the task queue, also called the macrotask queue. When the call stack is empty, the event loop drains every microtask and only then takes one task.

      In the standard pattern the output is: the synchronous `console.log` first, then the promise microtask, then the `setTimeout(0)` task. A zero delay in `setTimeout` does not mean "immediately after this line": the timer waits until the synchronous turn and the microtask queue are finished.

      #### Code example

      ```javascript
      console.log('sync');

      Promise.resolve().then(() => {
        console.log('microtask');
      });

      setTimeout(() => {
        console.log('task');
      }, 0);
      ```

      The print order is `sync`, then `microtask`, then `task`.

      #### Phrase you can say

      The idea that explains it is the event loop: the microtask queue and the task queue. The PDF did not include the exact snippet, so I use the standard order for `console.log`, a Promise, and `setTimeout(0)`. First the synchronous log, then the promise microtask, then the timer task. `setTimeout(0)` waits until the synchronous turn and the microtasks are done.
  - id: suryateja-digibank.10a
    label: "10a"
    topic: "Micro-frontends and Module Federation"
    title: "What have you worked on with micro-frontends? Was it the host app, a remote app, or both, and how did you link them?"
    body: |
      #### Short answer

      Answer with the role you actually had: host, remote, or both. Do not invent which role a particular person owned from this question.

      The link in Module Federation is one shape. The host is the shell. In `remotes` it says where to load `remoteEntry.js`. The remote serves that file and publishes modules in `exposes`, for example a tasks screen. At runtime the host loads the remote container and takes the module from it. Shared libraries, React first of all, are agreed through `shared`, so you do not end up with two copies.

      If you owned both sides, say so: on the host you configured loading remotes, on the remote you configured `exposes` and the container name.

      #### Code example

      ```javascript
      remotes: {
        tasks: 'tasks@https://tasks.example/remoteEntry.js',
      },

      exposes: {
        './Tasks': './src/Tasks',
      },
      ```

      The first entry is the host side: where to get the container. The second is the remote side: which module to expose.

      #### Phrase you can say

      I say which side I owned: the host, a remote, or both. The host is linked to the remote through Module Federation: `remotes` points at `remoteEntry.js`, and the remote exposes a module in `exposes`. Shared React is agreed through `shared`, so the shell and the micro-frontend sit on one instance.
  - id: suryateja-digibank.10b
    label: "10b"
    topic: "Micro-frontends and Module Federation"
    title: "How did you configure the host and the remotes?"
    body: |
      #### Short answer

      Both configs are `ModuleFederationPlugin`. The remote has a container name, a file name of `remoteEntry.js`, and an `exposes` map: the public module name and the file path. The host has the shell name and a `remotes` map: a local name and an address of the form `name@url` pointing at `remoteEntry.js`.

      `shared` on both sides lists React and `react-dom`. `singleton: true` keeps one instance. `requiredVersion` sets the accepted range. On the host those libraries are `eager: true`, so the shell puts its copy into the shared scope before a remote loads.

      In the app the host imports the module as a remote import, for example `tasks/Tasks`, and renders it on its route.

      #### Code example

      ```javascript
      new ModuleFederationPlugin({
        name: 'tasks',
        filename: 'remoteEntry.js',
        exposes: {
          './Tasks': './src/Tasks',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        },
      });

      new ModuleFederationPlugin({
        name: 'shell',
        remotes: {
          tasks: 'tasks@https://tasks.example/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0', eager: true },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0',
            eager: true,
          },
        },
      });
      ```

      #### Phrase you can say

      I configure the remote with `ModuleFederationPlugin`: `name`, `filename: 'remoteEntry.js'`, and `exposes`. The host points `remotes` at `tasks@https://tasks.example/remoteEntry.js`. React and `react-dom` are in `shared` as a `singleton` with one `requiredVersion`, and on the host they are also `eager`, so the shell provides the instance.
  - id: suryateja-digibank.10c
    label: "10c"
    topic: "Micro-frontends and Module Federation"
    title: "Can the host app expose anything?"
    body: |
      #### Short answer

      Yes. The host is a Module Federation container too. It can have its own `filename` and an `exposes` map, for example a module that reads the shell session. The remote then lists the host in its own `remotes` and imports that module.

      The limit is practical. If at startup the host waits for the remote and the remote waits for the host at the same moment, loading cycles. What the host exposes is something needed after both containers are up. A library such as React is shared through `shared`, not through that reverse `exposes`.

      #### Code example

      ```javascript
      new ModuleFederationPlugin({
        name: 'shell',
        filename: 'remoteEntry.js',
        exposes: {
          './Auth': './src/Auth',
        },
        remotes: {
          tasks: 'tasks@https://tasks.example/remoteEntry.js',
        },
      });
      ```

      #### Phrase you can say

      Yes, the host can expose a module: it is a container too, and it can have `filename` and `exposes`. The remote lists the host as a remote and imports that module. At startup I do not make a ring where the host and the remote wait for each other, and I leave shared React in `shared`.
  - id: suryateja-digibank.10d
    label: "10d"
    topic: "Micro-frontends and Module Federation"
    title: "If the host and a remote use different versions of a shared library, which version is used? What problems does that cause, and how do you fix it?"
    body: |
      #### Short answer

      With `singleton: true`, one instance stays in the shared scope. The version that is used is the one that registered first. If the host loads `react` with `eager: true`, that is the host version, and the remote reuses it. When the remote's `requiredVersion` does not accept that instance, the runtime prints a warning. It does not bring up a second copy of React next to the singleton.

      Without singleton, each build can load its own version. Two copies of React are the usual result of that mismatch.

      The problems: a warning about an unsatisfied version, `Invalid hook call`, shell context the remote cannot see, and the extra bytes of a second copy. The fix: the same major range in both builds, `singleton: true` and the same `requiredVersion` for `react` and `react-dom`, plus `eager: true` on the host so the shell provides the instance.

      #### Code example

      ```javascript
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: true,
        },
      },
      ```

      #### Phrase you can say

      With `singleton`, one version is used, the one that entered the shared scope first. With `eager` on the host, that is the shell version, and the remote sits on it. If the range does not match, you get a warning, and without singleton you get two copies of React and `Invalid hook call`. I fix it with the same `requiredVersion`, `singleton: true`, and `eager` on the host for `react` and `react-dom`.
  - id: suryateja-digibank.10e
    label: "10e"
    topic: "Micro-frontends and Module Federation"
    title: "What errors or conflicts have you run into with micro-frontends, and how did you fix them?"
    body: |
      #### Short answer

      This is a frame, not an invented incident with a date and a service name. Name the class of conflict you actually fixed, and the way you fixed it. Three classes come up constantly.

      Different versions of a shared library. The sign is a shared-module warning and `Invalid hook call`. The fix is one `singleton`, one `requiredVersion`, and `eager` on the host for `react` and `react-dom`.

      The remote did not load: a wrong `remoteEntry.js` URL, the network, or CORS. That micro-frontend's slot shows a fallback screen, and the shell and the other remotes stay up.

      The remote loaded and crashed during render. Wrap that remote in an error boundary so the exception does not take down the whole base app.

      #### Code example

      ```javascript
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: true,
        },
      },
      ```

      #### Phrase you can say

      I fix a shared-library version conflict through `shared`: `singleton`, one `requiredVersion`, and `eager` on the host. If `remoteEntry` does not open, I leave a fallback screen in that slot, and the shell keeps working. If a remote crashes in render, its own error boundary holds it, and the other micro-frontends stay mounted.
  - id: suryateja-digibank.10f
    label: "10f"
    topic: "Micro-frontends and Module Federation"
    title: "If one of 10 micro-frontends fails, how do you keep it from breaking the whole base app? (Expected answer: error boundaries.)"
    note: "Expected answer: error boundaries."
    body: |
      #### Short answer

      The answer is error boundaries, one boundary per micro-frontend. An error boundary is a class component with `static getDerivedStateFromError` and `componentDidCatch`. It catches a render error in its children, writes that into its own state, and renders a replacement only in its own place.

      One boundary around the whole app would replace the entire screen. Ten separate boundaries leave the shell and the other nine micro-frontends mounted: the slot that threw is the one that fails. A boundary is not the handler for a click or for an arbitrary `async` outside render. You put it on a remote that fails while rendering, and on a `lazy` rejection that surfaces during render.

      #### Code example

      ```jsx
      import { Component } from 'react';

      class RemoteBoundary extends Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false };
        }

        static getDerivedStateFromError() {
          return { hasError: true };
        }

        componentDidCatch(error) {
          console.error(error);
        }

        render() {
          if (this.state.hasError) {
            return <section>This section is unavailable.</section>;
          }

          return this.props.children;
        }
      }

      function Shell() {
        return (
          <main>
            <RemoteBoundary>
              <TasksRemote />
            </RemoteBoundary>
            <RemoteBoundary>
              <UsersRemote />
            </RemoteBoundary>
          </main>
        );
      }
      ```

      If `TasksRemote` throws during render, the first boundary draws the replacement. `UsersRemote` and `main` stay.

      #### Phrase you can say

      I put an error boundary around each micro-frontend. `getDerivedStateFromError` moves only that boundary into an error, and it draws the replacement in its own slot. The shell and the rest of the ten stay mounted. One boundary for the whole app does not fit here: it would blank the entire screen.
  - id: suryateja-digibank.10g
    label: "10g"
    topic: "Micro-frontends and Module Federation"
    title: "Apart from error boundaries, how else can you keep the rest of the app working when one micro-frontend fails? (Expected answer: a fallback screen.)"
    note: "Expected answer: a fallback screen."
    body: |
      #### Short answer

      Apart from error boundaries, you keep a fallback screen in the slot of the micro-frontend that failed. That is a separate view in place of the broken remote: a short message where it stood, while the shell, the navigation, and the other micro-frontends keep working as before.

      When the module did not load, `import()` rejects before the remote renders normally. You catch that rejection on the load promise and substitute a fallback-screen component. The slot stays filled by that screen, and the base app is not torn down. A retry can sit on a button that calls the load of the same module again.

      `Suspense` with the text "Loading" is the screen while a chunk is pending, not the error fallback screen. The fallback screen is what you show when this micro-frontend could not be loaded or drawn.

      #### Code example

      ```jsx
      import { lazy, Suspense } from 'react';

      const Tasks = lazy(() =>
        import('tasks/Tasks').catch(() => ({
          default: function TasksFallback() {
            return <section>This section is unavailable.</section>;
          },
        })),
      );

      function Shell() {
        return (
          <main>
            <Suspense fallback={<p>Loading</p>}>
              <Tasks />
            </Suspense>
            <UsersRemote />
          </main>
        );
      }
      ```

      #### Phrase you can say

      Apart from error boundaries, I put a fallback screen in that micro-frontend's slot. If the remote `import()` fails, `catch` returns a replacement component, and the section shows that it is unavailable. The shell and the other micro-frontends stay usable. That is a separate error screen, not the pending text on `Suspense`.
---

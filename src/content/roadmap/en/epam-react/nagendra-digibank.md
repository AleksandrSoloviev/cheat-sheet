---
interview: nagendra-digibank
order: 7
title: "Nagendra Burra — DigiBank"
candidate: Nagendra Burra
interviewer: Srujan Dasa, Soumya Ranjan Mishra
initiative: DigiBank
questions:
  - id: nagendra-digibank.1a
    label: 1a
    topic: Introduction and project experience
    title: "Give your intro and your work experience."
    body: |
      #### Short answer

      A one-to-two minute frame. Four slots, and you fill all four from your own CV: role, stack, one project, one measurable result. A person's name, years, and a project title are not filled in here.

      Role is what you do now and which part of the UI you own. Stack is React plus what you actually used: TypeScript, state, requests, the build, tests. One project is what the product did and what your area was, under its real name if that name is yours. One result is what changed and how you measured it. You say a number only if you measured it yourself.

      #### Phrase you can say

      I am a frontend developer, and my main stack is React and TypeScript. On the last project I owned [area]. For state and requests I used [what is actually in your stack]. The result I can show is [a before-and-after metric, only your own].
  - id: nagendra-digibank.1b
    label: 1b
    topic: Introduction and project experience
    title: "How many years of React experience do you have overall?"
    body: |
      #### Short answer

      The number comes from your CV. It is not written here, and someone else's years do not get substituted. In one sentence you separate total time in development from years specifically with React, when those differ. In a second sentence you say what those years cover: function components and hooks, state, API requests, splitting the bundle. You do not round up, and you do not count a tutorial as a year of commercial work.

      #### Phrase you can say

      I have worked with React for [N] years, and my overall experience is [M] years. In that time I built interfaces with hooks, kept state with [a tool from your experience], and called APIs with [fetch or the client you actually used].
  - id: nagendra-digibank.1c
    label: 1c
    topic: Introduction and project experience
    title: "Have you worked on any project at EPAM yet?"
    body: |
      #### Short answer

      The answer is a fact about your assignment, not the name of this round's initiative. An EPAM project is not invented here, and DigiBank cannot be called your past project: it is the interview initiative.

      If you have already been staffed, the frame is: yes, [the real name from the assignment], your role, the stack, one measurable result. You say the name only if it is yours.

      If you have not been staffed, you say that. Then you say what you are ready to take on the frontend: React, TypeScript, state, requests, and micro-frontends if they are in the team's stack.

      #### Phrase you can say

      If I was already staffed, I say: yes, the project is [name from the assignment], I owned [area], and the result was [my own metric]. If I was not: I have not worked on an EPAM project yet, and I will not invent a name. I am ready to join on React and TypeScript.
  - id: nagendra-digibank.1d
    label: 1d
    topic: Introduction and project experience
    title: "Share a use case where you faced a challenge and how you handled it."
    body: |
      #### Short answer

      A story frame, with no invented company. Four steps: the situation, what the constraint was, what you did, how you measured the outcome. The project name stays a slot from your experience.

      The situation is which screen it was and what hurt for the user. The challenge is a constraint, not "it was hard": for example responses arrived out of order and overwrote the newest input, or the initial bundle pulled in screens that are not needed immediately. The action is yours: you separated input from the request, cancelled the stale request, split the route, measured again. The result is your own number, or an honest qualitative outcome if you did not measure one.

      #### Phrase you can say

      On [project] the constraint was [constraint]. I did [a concrete action], rather than working around the symptom. The outcome was [my own metric, or an honest account of what I measured].
  - id: nagendra-digibank.2a
    label: 2a
    topic: "Architecture: micro-frontends and rendering"
    title: "You said you worked on Module Federation in React. Can you explain?"
    body: |
      #### Short answer

      Module Federation builds one application from parts that have separate builds and separate deploys. A remote publishes `remoteEntry.js` and, in `exposes`, serves modules such as a screen or a widget. The host lists that entry's URL in `remotes` and loads the module at runtime, usually through `lazy` and a dynamic `import`. The host is not rebuilt when a remote ships a new compatible entry.

      Shared libraries, first of all `react` and `react-dom`, go in `shared` with `singleton: true`. Otherwise the page gets two copies of React and hooks break. `requiredVersion` records which version counts as acceptable.

      This is the mechanism. The product name, and whether you were the host, a remote, or both, comes from your project. It is not invented here.

      #### Phrase you can say

      Module Federation is a runtime composition: a remote serves `remoteEntry.js` and exposed modules, and the host loads them by URL and deploys on its own. I keep React in `shared` as a `singleton`, so the page has one copy.
  - id: nagendra-digibank.2b
    label: 2b
    topic: "Architecture: micro-frontends and rendering"
    title: "If the apps are deployed independently, what's the purpose? Do they serve one requirement or several, and are they on different portals or one host?"
    body: |
      #### Short answer

      The point of an independent deploy is several requirements with different release rhythms, composed into one product. That is usually one host and several remotes, not a pile of unrelated portals. The host is the shell: chrome, navigation, shared dependencies. Each remote covers its own capability and ships with its own team when the module contract is ready.

      Splitting one requirement only to get a separate deploy is a weak reason. A remote's own URL exists so it can be built and opened in development. For the user, the composition lives on the host. Before you answer about a specific system, you look at how many exposed modules there are and how many teams actually release a `remoteEntry` on their own.

      #### Phrase you can say

      An independent deploy is for several requirements that ship separately. For the user it is one host: the shell loads remote capabilities, and each piece is not opened as someone else's portal.
  - id: nagendra-digibank.2c
    label: 2c
    topic: "Architecture: micro-frontends and rendering"
    title: "How does the architecture work? If you build and deploy three features separately, how do you bring them together into one app?"
    body: |
      #### Short answer

      Three features are three remotes. Each has its own repository or its own build, its own `exposes`, and its own deployed `remoteEntry.js`. The host lists all three in `remotes` and renders them on its routes. The host build does not inline the remote sources: at runtime it loads the entry and takes the exposed module.

      What you check in the config, not by guessing: the names in `exposes`, the URLs in `remotes`, `shared` with `singleton` and `requiredVersion` for React, and `publicPath` or the full address of `remoteEntry`. The addresses in the sample below are placeholders. You read the real ones from the build.

      #### Code example

      ```js
      const { container } = require('webpack');

      new container.ModuleFederationPlugin({
        name: 'featureA',
        filename: 'remoteEntry.js',
        exposes: {
          './Search': './src/Search',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        },
      });

      new container.ModuleFederationPlugin({
        name: 'host',
        remotes: {
          featureA: 'featureA@https://features.example/a/remoteEntry.js',
          featureB: 'featureB@https://features.example/b/remoteEntry.js',
          featureC: 'featureC@https://features.example/c/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        },
      });
      ```

      ```tsx
      import { lazy, Suspense } from 'react';

      const FeatureA = lazy(() => import('featureA/Search'));
      const FeatureB = lazy(() => import('featureB/Search'));
      const FeatureC = lazy(() => import('featureC/Search'));

      export function Home() {
        return (
          <Suspense fallback={null}>
            <FeatureA />
            <FeatureB />
            <FeatureC />
          </Suspense>
        );
      }
      ```

      #### Phrase you can say

      Three features are three remotes, each with its own `remoteEntry`. The host keeps them in `remotes` and loads the exposed modules on its routes. Shared React is a `singleton`. I take the URLs from the build config, not from memory.
  - id: nagendra-digibank.2d
    label: 2d
    topic: "Architecture: micro-frontends and rendering"
    title: "How do the separate apps communicate with each other (sessions, cookies, shared data)?"
    body: |
      #### Short answer

      A session and a cookie are a weak mechanism for shared UI data. The session on the server identifies the user. The browser sends the session cookie, and that can carry authentication when the apps sit on a domain the cookie is allowed to see: `Domain`, `SameSite`, `Secure`. It is not a state bus. You do not put the selected account, a list of articles, or other UI into a cookie: the limit is about 4 KB, the cookie goes out on every request, there are no subscribers, without `HttpOnly` a script can read it, and on different sites `SameSite` cuts it off.

      Shared data lives on the server: each remote calls the same APIs, and the cookie is only a credential. Between modules on one page the contract stays thin: a `CustomEvent` on `window`, or a small shared module in Module Federation, one singleton for the page. State that should survive a refresh goes in the URL. You do not read another remote's Redux store from the outside. If the pieces are split across iframes and origins, the channel is `postMessage` with an origin check.

      What you check: in the network panel, the cookie's `Domain`, `Path`, and `SameSite`, whether the remotes are same-site, and whether a shared package is actually in `shared`, instead of an agreement to write `document.cookie`.

      #### Code example

      ```js
      document.cookie = 'accountId=42';

      window.addEventListener('account-changed', (event) => {
        const accountId = event.detail.accountId;
        return accountId;
      });

      window.dispatchEvent(
        new CustomEvent('account-changed', {
          detail: { accountId: '42' },
        }),
      );
      ```

      #### Phrase you can say

      Cookies and the session carry authentication, not screen state. I take data from the API, and between remotes on one page I send an event or use a shared singleton module. I will not write UI into a cookie: that channel is weak.
  - id: nagendra-digibank.2e
    label: 2e
    topic: "Architecture: micro-frontends and rendering"
    title: "Is this a server-side rendered React app? Are the React pages served from a Spring Boot application?"
    body: |
      #### Short answer

      Server rendering and Spring Boot are two different questions. Neither follows from a repository name, and this walkthrough does not declare the project a Spring Boot application.

      Server rendering means the server builds the HTML of the React tree, and the browser hydrates it. Client rendering means the document arrives with an empty root, and the browser paints it.

      Spring Boot serves the React pages only if that was the architecture. Often Java is the API, and the HTML is a static file from a CDN or nginx. Spring serving `index.html` as a file is not server-rendered React.

      Before you say yes, you check three things. Is there a server entry: `renderToString`, `renderToPipeableStream`, or a framework that renders on the server. Does the document response already contain the page text, or only an empty root. Does Java sit on the path of the HTML, or only on `/api`. Until you have seen that, you do not call the app server-rendered React, and you do not call Spring Boot the source of the pages.

      #### Code example

      ```tsx
      import { renderToString } from 'react-dom/server';

      const html = renderToString(<App />);
      ```

      ```html
      <div id="root"></div>
      ```

      #### Phrase you can say

      SSR is HTML built on the server, and then hydration. I call Spring Boot the source of the pages only if I see that Java actually returns that HTML, not only an API or a static file. Until I have checked the document and the render entry, I do not claim it.
  - id: nagendra-digibank.2f
    label: 2f
    topic: "Architecture: micro-frontends and rendering"
    title: "Are the apps deployed on different host names? Do you use hydration?"
    body: |
      #### Short answer

      Different host names are a deployment choice, not a required part of Module Federation. A remote often lives on its own host because that is what the `remoteEntry` URL says. The host and a remote can also sit on one name, on different paths. You look at the `remotes` map and at the `remoteEntry` response, including CORS, and only then say whether the names differ.

      Hydration is used only if the HTML was already built before the browser and React attaches to that DOM through `hydrateRoot`. `createRoot().render` into an empty node is a client mount, not hydration. A markup-mismatch warning means hydration was attempted. A client-only Module Federation setup often has no hydration. That too is a check of the entry file, not a conclusion drawn from Spring Boot.

      #### Code example

      ```tsx
      import { createRoot, hydrateRoot } from 'react-dom/client';

      const node = document.getElementById('root');

      hydrateRoot(node, <App />);

      createRoot(node).render(<App />);
      ```

      #### Phrase you can say

      I confirm different hosts from the remote URL, and I do not assume them. Hydration is there only if the entry uses `hydrateRoot` and the server already sent markup. `createRoot` into an empty root is a client mount.
  - id: nagendra-digibank.3a
    label: 3a
    topic: Promises and async/await
    title: "How have you worked with promises and async/await? What's the difference between them?"
    body: |
      #### Short answer

      A promise is an object for a future value: `pending`, then `fulfilled` or `rejected`. `async`/`await` is syntax on top of promises, not a second runtime. An `async` function always returns a promise. `await` pauses that function until the promise settles, and on rejection it throws, so you write `try/catch` next to it. A `.then` and `.catch` chain is the same control flow, more nested.

      `await` does not take a second thread and does not make JavaScript multithreaded. Two `await`s in a row wait one after the other. You set concurrency yourself: `Promise.all`, `Promise.allSettled`, `Promise.any`, `Promise.race`. In requests I have used both chains and `async` functions: `fetch` returns a promise, and `await` takes the `Response` out of it.

      #### Code example

      ```js
      function loadWithThen(url) {
        return fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        });
      }

      async function loadWithAwait(url) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(String(response.status));
        }
        return response.json();
      }
      ```

      #### Phrase you can say

      A promise is a value later. `async`/`await` is that same promise, with `try/catch` and without a ladder of `then`. `await` does not parallelize code by itself: I build concurrency with `Promise.all`, `allSettled`, `any`, or `race`.
  - id: nagendra-digibank.3b
    label: 3b
    topic: Promises and async/await
    title: "Scenario: an API takes 15–20 seconds to respond, but you can only wait 5 seconds and must then cancel or ignore it. How would you handle this?"
    body: |
      #### Short answer

      You may wait five seconds, and the request lives for 15–20. "Cancel" and "ignore" are different actions.

      Cancellation without libraries: `AbortController` and `setTimeout`. After five seconds the timer calls `abort()`, `fetch` was given the `signal`, the browser aborts the request, and the promise rejects with `AbortError`. You do not apply a late JSON body. In `finally` you clear the timer, so a successful response is not aborted afterwards.

      Ignoring without cancellation: `Promise.race` between `fetch` and a promise that rejects after five seconds. The race ends at five seconds, but the network request stays open. When the requirement is to cancel, you take the controller. When the requirement is not to wait longer than five seconds, the race only ends the wait in your code.

      #### Code example

      ```js
      const TIMEOUT_MS = 5000;

      async function fetchWithTimeout(url) {
        const controller = new AbortController();
        const timer = setTimeout(() => {
          controller.abort();
        }, TIMEOUT_MS);

        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return await response.json();
        } catch (error) {
          if (error.name === 'AbortError') {
            throw new Error('Timed out after 5 seconds');
          }
          throw error;
        } finally {
          clearTimeout(timer);
        }
      }
      ```

      #### Phrase you can say

      For five seconds I use `AbortController` and `setTimeout`: the timer calls `abort()`, `fetch` receives the `signal`, and the request is cancelled. `Promise.race` only stops waiting. The request itself is not cancelled.
  - id: nagendra-digibank.3c
    label: 3c
    topic: Promises and async/await
    title: "Do it without any library, using only your own logic in a lightweight app. Write sample code (expected answer: AbortController with setTimeout)."
    note: "Expected answer: AbortController with setTimeout."
    body: |
      #### Short answer

      The expected answer is `AbortController` together with `setTimeout`, without axios and without any other client. In a small app one function is enough. The controller creates a signal. `setTimeout` at 5000 ms calls `controller.abort()`. That signal was passed to `fetch`, so the browser cancels the request instead of leaving it running for 15–20 seconds. The promise rejects, the error's name is `AbortError`, and you separate that branch from a network failure and from a bad status. `clearTimeout` in `finally` clears the timer if the response arrived earlier.

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```js
      const TIMEOUT_MS = 5000;

      async function fetchWithTimeout(url) {
        const controller = new AbortController();
        const timer = setTimeout(() => {
          controller.abort();
        }, TIMEOUT_MS);

        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return await response.json();
        } catch (error) {
          if (error.name === 'AbortError') {
            throw new Error('Timed out after 5 seconds');
          }
          throw error;
        } finally {
          clearTimeout(timer);
        }
      }
      ```

      #### Phrase you can say

      Without libraries I combine `AbortController` and `setTimeout` at five seconds. `abort()` on the timer cancels `fetch` through the `signal`. If I get an `AbortError`, that is the timeout, and I no longer read the response body.
  - id: nagendra-digibank.3d
    label: 3d
    topic: Promises and async/await
    title: "Would you use Promise.race or AbortController, and why?"
    body: |
      #### Short answer

      I take `AbortController` together with `setTimeout` when the request must be cancelled. I take `Promise.race` only when it is enough to stop waiting and the live request can stay open.

      `Promise.race` settles with the first promise. A five-second timeout wins the race, your `await` moves on, but the `fetch` underneath is not cancelled: the browser keeps the connection, the server keeps working, and a late response can still arrive. If that promise still has another `then`, it runs after the UI has already forgotten the request. The race does not call `abort()`, and it does not cancel the underlying request.

      `AbortController` passes a `signal` into `fetch`. `setTimeout` calls `abort()`, the browser cancels the request, and the promise rejects with `AbortError`. A late body has nowhere to be written if you do not read it after the abort.

      You can combine them: the race limits the wait in code, and `abort()` is still what cancels. The race by itself does not cancel.

      #### Code example

      ```js
      function rejectAfter(ms) {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timed out after 5 seconds'));
          }, ms);
        });
      }

      async function fetchWithRace(url) {
        const response = await Promise.race([fetch(url), rejectAfter(5000)]);
        return response.json();
      }
      ```

      #### Phrase you can say

      To cancel at five seconds I take `AbortController` and `setTimeout`. `Promise.race` does not cancel the underlying request: it only releases the `await` earlier, and `fetch` keeps going. The controller's signal is what cancels it.
  - id: nagendra-digibank.3e
    label: 3e
    topic: Promises and async/await
    title: "Scenario: three news-article APIs run in parallel. Show data as soon as any one responds, and show \"Something went wrong\" only if all three fail. How would you handle this?"
    body: |
      #### Short answer

      What you need here is the first success, and the string `Something went wrong` only when all three have failed. That is `Promise.any`, not `Promise.all`.

      `Promise.any` fulfills on the first success and rejects with `AggregateError` only if all of them reject. `Promise.all` waits for every success and fails on the first error, so one dead feed hides two live ones. `Promise.race` settles on the first completion, and that first completion can be an error while another API would still respond. `Promise.allSettled` waits for the slowest one and does not show the article at the moment of the first success.

      `fetch` does not reject on status 404 or 500. You turn that response into a rejection yourself, otherwise `Promise.any` treats it as a success. In the UI the string stays exactly `Something went wrong`.

      #### Code example

      ```tsx
      import { useState } from 'react';

      const NEWS_URLS = ['/api/news/a', '/api/news/b', '/api/news/c'];

      export function NewsPanel() {
        const [view, setView] = useState(null);

        async function loadNews() {
          try {
            const article = await Promise.any(
              NEWS_URLS.map(async (url) => {
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(String(response.status));
                }
                return response.json();
              }),
            );
            setView(article);
          } catch {
            setView('Something went wrong');
          }
        }

        return <button type="button" onClick={loadNews}>{String(view)}</button>;
      }
      ```

      #### Phrase you can say

      I start the three feeds with `Promise.any`: the screen gets the first successful response. I show `Something went wrong` only if all three fail. `Promise.all` does not fit here: it fails on the first error and does not give you the first success.
  - id: nagendra-digibank.3f
    label: 3f
    topic: Promises and async/await
    title: "If API 1 takes 2s, API 2 fails at 1s and API 3 takes 15s, when will Promise.allSettled show the results?"
    body: |
      #### Short answer

      `Promise.allSettled` shows the result when every promise has settled. With these times that is 15 seconds, the time of the slowest one, API 3. At one second, API 2's rejection is only recorded. At two seconds, API 1's success is recorded too. The array is not given out yet, because the third promise is still `pending`.

      A rejection does not cut `allSettled` short and does not reject the whole call. The final array is in input order: the first is `fulfilled`, the second is `rejected`, the third is `fulfilled`. For "show the article on the first success", those 15 seconds are too late.

      #### Code example

      ```js
      const results = await Promise.allSettled([
        fetchApi1(),
        fetchApi2(),
        fetchApi3(),
      ]);
      ```

      #### Phrase you can say

      `Promise.allSettled` shows the array at 15 seconds, when the slowest call finishes. The failure at one second and the success at two seconds land in the array, but it comes out only together with the third. One rejection does not reject the whole `allSettled`.
  - id: nagendra-digibank.3g
    label: 3g
    topic: Promises and async/await
    title: "How would you show data as soon as the first success arrives, instead of waiting 15 seconds? Write a snippet."
    body: |
      #### Short answer

      The first success comes from `Promise.any`. With these times API 2 fails at one second, API 1 succeeds at two seconds, and API 3 takes 15 seconds. `any` ignores the early rejection, fulfills at two seconds with API 1's data, and does not wait for the third call. The wait for the result does not include those fifteen seconds.

      If there is no success at all, `Promise.any` rejects, and that is the place for `Something went wrong`. The slow request is still on the network until you separately call `abort()` on the losers. That does not change when the data is shown.

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```js
      const article = await Promise.any([
        fetchApi1(),
        fetchApi2(),
        fetchApi3(),
      ]);
      ```

      #### Phrase you can say

      To avoid waiting 15 seconds, I take `Promise.any`. It skips the rejection at one second, returns the first success at two seconds, and does not hold the screen for the third API.
  - id: nagendra-digibank.3h
    label: 3h
    topic: Promises and async/await
    title: "How do you track successes and failures so you know when all three have failed?"
    body: |
      #### Short answer

      You count two numbers: how many promises have settled, and how many of those succeeded. On the first success you show the data. When all three have settled and the success count is zero, you show `Something went wrong`. You learn about the total failure at the moment of the last rejection, and you do not wait an extra second after it.

      The rejection of `Promise.any` is the same signal: it happens only if all of them rejected, and `AggregateError.errors` has one entry per rejection. `Promise.allSettled` can also count `status === 'rejected'`, but the array appears only when the slowest one settles — in the 15-second scenario, at the end. For the first success, and for an early "all of them failed", a counter along the way is the tighter tool.

      #### Code example

      ```js
      function trackAll(tasks, onFirstSuccess, onAllFailed) {
        let settled = 0;
        let successes = 0;
        const total = tasks.length;

        tasks.forEach((task) => {
          Promise.resolve(task)
            .then((data) => {
              successes += 1;
              settled += 1;
              if (successes === 1) {
                onFirstSuccess(data);
              }
            })
            .catch(() => {
              settled += 1;
              if (settled === total && successes === 0) {
                onAllFailed('Something went wrong');
              }
            });
        });
      }
      ```

      #### Phrase you can say

      I count how many calls have settled and how many of them succeeded. I show the first success immediately. `Something went wrong` only when all three have settled and there are no successes. `Promise.any` rejects at that same moment, while `allSettled` makes that count wait for the slowest one.
  - id: nagendra-digibank.3i
    label: 3i
    topic: Promises and async/await
    title: "What does fetch return? What is the response object (a promise), and how do you resolve it?"
    body: |
      #### Short answer

      `fetch` returns a promise that fulfills with a `Response` object. The `Response` itself is not a promise. You unwrap the promise with `await` or `.then` and get the response: `status`, `ok`, `headers`, and a body stream. Status 404 or 500 does not reject the promise. Rejection is a network failure, a CORS failure, or `abort`.

      The body does not fall out of the response by itself. `response.json()`, `response.text()`, and `response.blob()` return a second promise, because the body still has to be read. You wait for that too. Two steps: wait for the `Response`, then wait for the body to be parsed.

      #### Code example

      ```js
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const data = await response.json();
      ```

      #### Phrase you can say

      `fetch` returns a promise of a `Response`, not ready-made JSON. I `await fetch`, check `response.ok`, and separately `await response.json()`, because the body is a second promise. The response object is not a promise. The promise fulfills with it.
  - id: nagendra-digibank.4a
    label: 4a
    topic: Debouncing and custom hooks (live coding)
    title: "Write a custom debounce hook for a search box: call the API as the user types (the API call itself can be skipped)."
    body: |
      #### Short answer

      The hook delays a value. It does not call the network. The field changes `query` on every character, and the hook publishes `debouncedValue` only when the pause is longer than `delay`. The previous timer is cleared in cleanup, so fast typing does not produce a pile of updates. The API call stays outside on purpose in this exercise: the hook can be reused for search and for any other value.

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```tsx
      import { useEffect, useState } from 'react';

      function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
          const timer = setTimeout(() => {
            setDebouncedValue(value);
          }, delay);

          return () => {
            clearTimeout(timer);
          };
        }, [value, delay]);

        return debouncedValue;
      }
      ```

      #### Phrase you can say

      `useDebounce` stores a value and updates it with `setTimeout` after a pause. On every new input I clear the previous timer. I do not put the API in the hook: the hook only returns the value that has settled.
  - id: nagendra-digibank.4b
    label: 4b
    topic: Debouncing and custom hooks (live coding)
    title: "Write the full component. How would you reuse the hook, and where exactly would you make the API call for best performance?"
    body: |
      #### Short answer

      You reuse the hook by calling `useDebounce(query, 500)` inside the component. The network does not move into the hook, or every consumer would be tied to one URL.

      The API is called in a `useEffect` whose dependency is the settled value. A character the user deleted before the pause does not produce a request: the effect does not see the intermediate `query`. The effect cleanup calls `abort()`, so a slow previous response does not overwrite the new one.

      The empty string is the initial value. You cannot cut it off with `if (!debouncedValue)`: that guard is exactly what always returns early. A `touched` flag allows the request: before the first input the effect sends nothing, and after input an empty settled value is a clear, not "we have not started".

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```tsx
      import { useEffect, useState } from 'react';

      function SearchBox() {
        const [query, setQuery] = useState('');
        const [touched, setTouched] = useState(false);
        const debouncedQuery = useDebounce(query, 500);
        const [results, setResults] = useState([]);

        useEffect(() => {
          if (!touched) {
            return;
          }

          if (debouncedQuery === '') {
            setResults([]);
            return;
          }

          const controller = new AbortController();

          async function load() {
            const response = await fetch(
              `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
              { signal: controller.signal },
            );
            const data = await response.json();
            setResults(data);
          }

          load();

          return () => {
            controller.abort();
          };
        }, [debouncedQuery, touched]);

        function handleChange(event) {
          setTouched(true);
          setQuery(event.target.value);
        }

        return (
          <input value={query} onChange={handleChange} />
        );
      }
      ```

      #### Phrase you can say

      I call the hook in the component and reuse it as a delay on the value. The API sits in a `useEffect` on the debounced value: one request per pause, not per character, and the previous request can be cancelled in cleanup.
  - id: nagendra-digibank.4c
    label: 4c
    topic: Debouncing and custom hooks (live coding)
    title: "Your check if (!debouncedValue) will always return early. Fix it."
    body: |
      #### Short answer

      `if (!debouncedValue) return` returns early on the empty string, because `''` is falsy. The empty string is also the initial `useState` value, so the effect's first pass always hits that `return` and never proceeds.

      If you cut off the path that is supposed to schedule the debounced update, the timer is never set, state stays `''`, and every later pass returns early again. The first legitimate request is blocked: the text the user typed never becomes a value the effect is willing to work with.

      Even when the guard sits only around `fetch`, it does not distinguish the empty string. The initial "not searching yet" and a field the user cleared are the same `''`. You cannot handle a clear on its own. The check is also true for any other falsy value, not only for `''`. Treating the empty string as "not ready yet" is the mistake that blocks the first legitimate search.

      The fix is a `touched` flag. Until the field has been touched, the effect returns, and that return is on the flag, not on the empty string. After input, an empty debounced value is a real case: results are cleared, and the request is not treated as an error. A non-empty string goes to the API.

      The second form of the same idea: react when the debounced value changed, and handle the empty string only when that is appropriate, which means not on the very first pass. The initial `''` is skipped once. Later, an empty string clears the results, and the first non-empty value still searches.

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```tsx
      useEffect(() => {
        if (!debouncedValue) {
          return;
        }
        load(debouncedValue);
      }, [debouncedValue]);
      ```

      ```tsx
      import { useEffect, useState } from 'react';

      function SearchBox() {
        const [query, setQuery] = useState('');
        const [touched, setTouched] = useState(false);
        const debouncedQuery = useDebounce(query, 500);
        const [results, setResults] = useState([]);

        useEffect(() => {
          if (!touched) {
            return;
          }

          if (debouncedQuery === '') {
            setResults([]);
            return;
          }

          const controller = new AbortController();

          async function load() {
            const response = await fetch(
              `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
              { signal: controller.signal },
            );
            const data = await response.json();
            setResults(data);
          }

          load();

          return () => {
            controller.abort();
          };
        }, [debouncedQuery, touched]);

        function handleChange(event) {
          setTouched(true);
          setQuery(event.target.value);
        }

        return <input value={query} onChange={handleChange} />;
      }
      ```

      ```tsx
      import { useEffect, useRef, useState } from 'react';

      function SearchBox() {
        const [query, setQuery] = useState('');
        const debouncedQuery = useDebounce(query, 500);
        const [results, setResults] = useState([]);
        const skipInitialEmpty = useRef(true);

        useEffect(() => {
          if (skipInitialEmpty.current) {
            skipInitialEmpty.current = false;
            if (debouncedQuery === '') {
              return;
            }
          }

          if (debouncedQuery === '') {
            setResults([]);
            return;
          }

          const controller = new AbortController();

          async function load() {
            const response = await fetch(
              `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
              { signal: controller.signal },
            );
            const data = await response.json();
            setResults(data);
          }

          load();

          return () => {
            controller.abort();
          };
        }, [debouncedQuery]);

        return (
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        );
      }
      ```

      #### Phrase you can say

      `if (!debouncedValue)` returns on the empty string. The empty string is the initial value, so the effect never proceeds, and a cleared field cannot be told apart from "not searching yet". If that same guard blocks writing the next value, the first legitimate search never happens. I use a `touched` flag, or I skip only the starting empty pass, and after that an empty string is a meaningful change of its own.
  - id: nagendra-digibank.4d
    label: 4d
    topic: Debouncing and custom hooks (live coding)
    title: "Why wait for a useEffect on the debounced value? Can't we call the API directly in the onChange handler? Is there a better way?"
    body: |
      #### Short answer

      A `useEffect` on the debounced value starts the request after commit, once per settled value. The dependency is not every character. It is the value after the pause. The cleanup function cancels the previous `fetch` when the value changes or the component unmounts.

      You can call the API in `onChange`, but the handler fires on every input. Without its own timer that is a request per character. With a timer inside the handler, the delay duplicates the hook, the closure easily captures stale text, and cancellation on unmount does not appear by itself: you have to attach it separately.

      For this exercise the better place is the hook plus the effect. In an app with many responses, a data layer such as React Query keyed by the debounced string is better still: cache, status, and cancellation are already there, and you do not copy the effect onto every screen.

      #### Code example

      ```tsx
      useEffect(() => {
        const controller = new AbortController();

        async function load() {
          await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
            signal: controller.signal,
          });
        }

        load();

        return () => {
          controller.abort();
        };
      }, [debouncedQuery]);
      ```

      ```tsx
      function handleChange(event) {
        const next = event.target.value;
        setQuery(next);
        fetch(`/api/search?q=${encodeURIComponent(next)}`);
      }
      ```

      #### Phrase you can say

      An effect on the debounced value waits for the pause and gives you cleanup so you can abort the previous request. In `onChange` without a timer I would hit the API on every character. A timer in the handler is possible, and it is the weaker split: the delay and the unmount cancellation live apart from the value.
  - id: nagendra-digibank.4e
    label: 4e
    topic: Debouncing and custom hooks (live coding)
    title: "Can you call the API inside the change handler as well? How would you avoid calling it too often?"
    body: |
      #### Short answer

      Yes, you can call the API from the change handler. To avoid calling it too often, on every input you clear the previous `setTimeout` and set a new one for 500 ms. Only the last value after the pause goes out. At the same time you cancel the previous `fetch`, or a slow response overtakes a newer request.

      This works. It is weaker than an effect on the debounced value because you assemble the timer, the abort, and unmount by hand: a ref for the timer, a ref for the controller, and a separate cleanup. The hook plus `useEffect` splits the same scheme into a delay on the value and one request for the text that settled.

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```tsx
      import { useEffect, useRef, useState } from 'react';

      function SearchBox() {
        const [query, setQuery] = useState('');
        const timerRef = useRef(null);
        const controllerRef = useRef(null);

        useEffect(() => {
          return () => {
            clearTimeout(timerRef.current);
            controllerRef.current?.abort();
          };
        }, []);

        function handleChange(event) {
          const next = event.target.value;
          setQuery(next);
          clearTimeout(timerRef.current);
          controllerRef.current?.abort();

          timerRef.current = setTimeout(() => {
            const controller = new AbortController();
            controllerRef.current = controller;
            fetch(`/api/search?q=${encodeURIComponent(next)}`, {
              signal: controller.signal,
            });
          }, 500);
        }

        return <input value={query} onChange={handleChange} />;
      }
      ```

      #### Phrase you can say

      You can call the API from `onChange`. I cut the frequency like this: on every character I clear the timer and the previous `AbortController`, and I start `fetch` only after 500 ms of silence. An effect on the debounced value does the same more cleanly, because cleanup is tied to the value.
  - id: nagendra-digibank.4f
    label: 4f
    topic: Debouncing and custom hooks (live coding)
    title: "What does a custom hook do? Isn't a custom hook React-only? What about Angular?"
    body: |
      #### Short answer

      A custom hook is a function whose name starts with `use` and that calls other hooks. It extracts state and effects so components can share behavior. The state is not shared: each call gets its own `useState` and `useEffect`. This is a React convention and the rules of hooks, not a language feature. You call a hook at the top level of a component function or of another hook.

      Angular does not have hooks. Reuse there is a service: a class the injector creates, often one for the app or for a component. It is not called on every render pass. Input delay in Angular is usually built as a stream, not as a hook: `valueChanges` and `debounceTime`. HTTP goes in a service. There is nothing in Angular to write `useDebounce` with.

      #### Code example

      ```tsx
      function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
          const timer = setTimeout(() => {
            setDebouncedValue(value);
          }, delay);
          return () => {
            clearTimeout(timer);
          };
        }, [value, delay]);

        return debouncedValue;
      }
      ```

      ```ts
      @Injectable({ providedIn: 'root' })
      export class SearchApi {
        search(query: string) {
          return this.http.get('/api/search', { params: { q: query } });
        }
      }
      ```

      #### Phrase you can say

      A custom hook is a React convention: a `use*` function that hides state and an effect. Each call has its own state. In Angular the replacement is a service through DI, and debouncing input is RxJS, for example `debounceTime`, not a hook.
  - id: nagendra-digibank.5a
    label: 5a
    topic: Memoization hooks
    title: "Have you heard of memoization / useMemo? Should you use useMemo here?"
    body: |
      #### Short answer

      Memoization remembers the result of a pure calculation between renders while the dependencies stay the same. That is what `useMemo` is for. An API call is a side effect, and it does not belong here. React may throw away the remembered value, and the function inside must stay pure. `fetch` inside `useMemo` starts during render, with no cleanup and no proper cancellation.

      The settled search string is already cheap. Wrapping it in `useMemo` does nothing useful. `useMemo` fits when you filter a heavy list from articles you already have. The API call itself stays in a `useEffect` or in a data layer.

      #### Code example

      ```tsx
      const visible = useMemo(() => {
        return articles.filter((article) => article.title.includes(debouncedQuery));
      }, [articles, debouncedQuery]);
      ```

      ```tsx
      const data = useMemo(() => {
        return fetch(`/api/search?q=${debouncedQuery}`);
      }, [debouncedQuery]);
      ```

      #### Phrase you can say

      `useMemo` remembers a pure calculation, not a request. I do not call the API with it for this search: that is an effect during render. What you can memoize here is a heavy filter of data already in memory. The network stays in an effect or in React Query.
  - id: nagendra-digibank.5b
    label: 5b
    topic: Memoization hooks
    title: "Can't we use useCallback? What does useCallback do? Finish your explanation."
    body: |
      #### Short answer

      `useCallback` remembers the function reference, not the result of calling it and not the API response. While the dependencies stay the same, you get the same function. That is so a child in `memo` does not render again because of a new `onClick`, and so an effect that lists this function as a dependency does not restart for nothing. `useCallback(fn, deps)` is `useMemo(() => fn, deps)`.

      The callback does not call anything by itself. It does not store JSON. It does not debounce. Passing the debounced string in only means the function is created again when the string changes.

      #### Code example

      ```tsx
      const load = useCallback(() => {
        return fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      }, [debouncedQuery]);
      ```

      #### Phrase you can say

      `useCallback` memoizes the function, not the result of the call. While `debouncedQuery` is the same, the `load` reference is the same. The request does not run because of that, and the response is not cached. It is a stable function for `memo` and for dependencies, not a data layer.
  - id: nagendra-digibank.5c
    label: 5c
    topic: Memoization hooks
    title: "Why not use useCallback, pass it the debounced value, and memoize the API call instead of using useEffect?"
    body: |
      #### Short answer

      Passing the debounced value into `useCallback` creates the function again when the value changes. That does not memoize the API call: what is cached is the function, not the `Response` and not the JSON. Until something calls `load`, there is no network.

      Calling it straight from render is a side effect during render: extra requests in Strict Mode, and no cleanup. If you wrap the call in `useEffect`, the effect does the work, and `useCallback` only holds the reference. Cancellation also lives in the effect cleanup, and the signal still has to be passed into `fetch`. Removing the effect and "remembering the call" leaves the request unmade.

      `useCallback` does not replace `useEffect` for an API, and it does not remember the result of the call.

      #### Code example

      ```tsx
      const load = useCallback(() => {
        return fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      }, [debouncedQuery]);

      useEffect(() => {
        const controller = new AbortController();
        load();
        return () => {
          controller.abort();
        };
      }, [load]);
      ```

      #### Phrase you can say

      `useCallback` with the debounced value stores the function, not the result of the request. Without `useEffect` nothing makes that call, and you cannot call it from render. The response cache and the cleanup come from the effect or from a data library, not from `useCallback`.
  - id: nagendra-digibank.5d
    label: 5d
    topic: Memoization hooks
    title: "Is there a better modern way to handle or memoize API calls in a React app?"
    body: |
      #### Short answer

      The modern data layer is React Query, also called TanStack Query. The server cache lives by query key, not in `useMemo`. The same key means one request and one stored result. `staleTime` decides when the data is stale. `queryFn` receives a `signal`, and that cancels the request. Loading and error arrive with the result. You do not assemble them by hand in an effect.

      `useMemo` and `useCallback` do not replace this layer: the first memoizes a pure calculation, the second a function reference. Neither stores an API response across mounts the way a query cache does.

      For search, the key includes the debounced string. `enabled` does not send the request while the field is untouched, and it does not send it while the string is empty. The initial empty `''` does not become a search.

      #### Code example

      ```tsx
      const debouncedQuery = useDebounce(query, 500);
      const [touched, setTouched] = useState(false);

      const news = useQuery({
        queryKey: ['search', debouncedQuery],
        enabled: touched && debouncedQuery !== '',
        queryFn: async ({ signal }) => {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
            { signal },
          );
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        },
      });
      ```

      #### Phrase you can say

      I give API calls to React Query: the key caches the result, `signal` cancels the request, and the loading status is already on the hook result. I do not use `useMemo` for this. It is for a pure calculation, not for server data.
  - id: nagendra-digibank.5e
    label: 5e
    topic: Memoization hooks
    title: "Could you use React Query for this?"
    body: |
      #### Short answer

      Yes. React Query is what takes this search. The key `['search', debouncedQuery]` tells one string from another and returns a result that is already stored when the key is the same. `queryFn` does the `fetch` and receives a `signal`. `enabled: touched && debouncedQuery !== ''` does not let a request out on the initial empty string, and it does not confuse that string with a search. After the user clears the text, the query is disabled, instead of falling into `if (!debouncedValue)` inside an effect.

      The component reads `data`, `isPending`, and `isError`. It does not keep a second copy of the response in its own `useState` when the cache is the server state.

      #### Code example

      ```tsx
      const debouncedQuery = useDebounce(query, 500);
      const [touched, setTouched] = useState(false);

      const news = useQuery({
        queryKey: ['search', debouncedQuery],
        enabled: touched && debouncedQuery !== '',
        queryFn: async ({ signal }) => {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
            { signal },
          );
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        },
      });
      ```

      #### Phrase you can say

      Yes, I would give this search to React Query. The key is the debounced string, and the query is enabled once the field has been touched and the string is not empty. Cache, cancellation, and loading status stay in the library, not in a hand-written `useEffect`.
  - id: nagendra-digibank.5f
    label: 5f
    topic: Memoization hooks
    title: "Is it good practice to always use useEffect for this? Is there a downside to using useCallback instead?"
    body: |
      #### Short answer

      `useEffect` is the right primitive when you write the side effect yourself: it runs after commit and returns cleanup. Doing every API only as an effect is a weak practice for an app. There is no cache, races are easy to leave in, and loading flags get copied onto every screen. Server state is better off in React Query or a neighboring data layer.

      The downside of `useCallback` instead of the effect: React does not call the callback. It does not memoize the result of the call. There is no commit phase and no cleanup from `return`. The request either never happens, or you call the function from render or from `onChange` and lose cancellation on unmount yourself. A new function when the debounced value changes is not the same as "go to the network once after paint".

      #### Code example

      ```tsx
      const load = useCallback(() => {
        return fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      }, [debouncedQuery]);
      ```

      #### Phrase you can say

      `useEffect` fits when you write the effect yourself, and it is not the only way to call an API: the cache and the races stay on you. `useCallback` instead of the effect is worse because it does not run the request and does not remember the response. It also has no cleanup that an effect returns on its own.
  - id: nagendra-digibank.6a
    label: 6a
    topic: Cross-cutting concerns (headers / interceptors)
    title: "Scenario: every API call in every app needs a new request header. With minimal code change and without breaking existing code, how would you add it?"
    body: |
      #### Short answer

      The header is added in one place that calls already go through, not on every line of `fetch` or `axios`.

      If the app goes through a shared axios instance, the small change is a request interceptor on that instance. Every request on the instance gets the header. Call sites stay as they are.

      If they go through one wrapper over `fetch`, the header is set in the wrapper. If there is no wrapper and calls hit global `fetch`, one patch of `window.fetch` at app startup is still one place, not two hundred calls. Existing URL and method arguments stay. You add the header to `Headers` and pass the rest of `init` on.

      #### Code example

      ```ts
      import axios from 'axios';

      axios.interceptors.request.use((config) => {
        config.headers.set('X-Channel', 'web');
        return config;
      });
      ```

      ```ts
      export async function apiFetch(url, init = {}) {
        const headers = new Headers(init.headers);
        headers.set('X-Channel', 'web');
        return fetch(url, { ...init, headers });
      }
      ```

      #### Phrase you can say

      I add the header once on the shared client: an axios interceptor, or a wrapper over `fetch`. I do not touch the call sites. The current URLs and bodies stay as they were.
  - id: nagendra-digibank.6b
    label: 6b
    topic: Cross-cutting concerns (headers / interceptors)
    title: "Follow-up: you can't change existing code. There are 10–15 repos and micro-frontends, some using axios, some using fetch, and some may be Angular or Vue. What mechanism would work across all of them?"
    body: |
      #### Short answer

      You cannot patch each call site: the code cannot change, there are 10–15 repositories, and the clients differ. An axios interceptor sees only axios. A `fetch` wrapper sees only callers that go through it. Angular's `HttpInterceptor` sees only `HttpClient`, and it still requires a change in the Angular app. Vue has no HTTP layer of its own. None of those patches covers all four stacks if the files cannot be touched.

      The cross-cutting mechanism does not depend on the library inside the repository:

      A gateway or reverse proxy in front of the API adds the header for everyone who passes through it. Axios, fetch, Angular, and Vue look the same to it.

      A service worker installed by the shell or by a platform script, not by each micro-frontend, intercepts requests from the page it controls, both `fetch` and XHR, and adds the header. The feature repositories are not edited. On every origin that must be covered, the page has to be controlled by that worker.

      A platform HTTP client works only when the apps already send traffic through it. Then the change is one change, in that client. If they call axios and `fetch` directly, introducing a new client means changing call sites, and that is what this follow-up forbids.

      #### Code example

      ```js
      self.addEventListener('fetch', (event) => {
        const headers = new Headers(event.request.headers);
        headers.set('X-Channel', 'web');
        event.respondWith(fetch(new Request(event.request, { headers })));
      });
      ```

      #### Phrase you can say

      Because the repository code cannot change, I do not patch axios, fetch, Angular, and Vue at each call site. The shared mechanism is a gateway, a service worker on the shell, or a platform HTTP client that is already on the path. An interceptor from one stack does not see the other three.
  - id: nagendra-digibank.6c
    label: 6c
    topic: Cross-cutting concerns (headers / interceptors)
    title: "What exactly is an interceptor?"
    body: |
      #### Short answer

      An interceptor is a function registered on an HTTP client. It runs for every request or response that goes through that client, and it can read or change the message before the next step. That is how a header, a token, a log, and shared error handling live in one place.

      In axios that is `interceptors.request` and `interceptors.response`. In Angular the same role is `HttpInterceptor` on `HttpClient`. A wrapper over `fetch` is the same idea without that name. A call that bypassed the client never enters the interceptor. It is not a React hook and not Redux middleware.

      #### Code example

      ```ts
      axios.interceptors.request.use((config) => {
        config.headers.set('X-Channel', 'web');
        return config;
      });

      axios.interceptors.response.use((response) => response);
      ```

      #### Phrase you can say

      An interceptor is a function on an HTTP client that runs for every request or response of that client and can change the message. In axios that is `interceptors`. In Angular it is `HttpInterceptor`. A call that misses the client goes through without it.
  - id: nagendra-digibank.7a
    label: 7a
    topic: "Performance: blocking work"
    title: "JavaScript is single-threaded. How would you handle heavy, UI-blocking work, such as complex calculations over many items?"
    body: |
      #### Short answer

      The main thread is one thread for JavaScript, layout, and paint. A long synchronous loop does not yield, so clicks and frames stall. Waiting on the network is not this problem: `fetch` is already asynchronous and does not hold the thread with a calculation.

      First, chunk the work and yield. You process a batch of items, then give the thread back through `setTimeout`, `requestAnimationFrame`, or `scheduler.yield()`, so the browser can handle input and a frame. `await` on an already fulfilled promise yields to the microtask queue and may not reach paint. A task boundary through a timer or the scheduler does reach paint.

      Second, the scheduler. `scheduler.yield()` and `scheduler.postTask` split a long task by priority. React's `startTransition` marks an update as interruptible, but it does not take a tight loop off the main thread.

      Third, a Web Worker for CPU work. The UI thread stays free, the DOM stays on the main thread, and the result comes back as a message.

      #### Code example

      ```js
      function yieldToMain() {
        if (globalThis.scheduler?.yield) {
          return scheduler.yield();
        }
        return new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
      }

      async function sumInChunks(items) {
        let total = 0;
        const size = 1000;

        for (let index = 0; index < items.length; index += size) {
          const slice = items.slice(index, index + size);
          for (const value of slice) {
            total += value;
          }
          await yieldToMain();
        }

        return total;
      }
      ```

      #### Phrase you can say

      I do not keep a heavy calculation as one loop on the main thread. I either chunk it and yield through the scheduler or `setTimeout`, or I move the CPU work to a Web Worker. The network does not block the thread anyway, and `startTransition` does not take a tight loop off the thread.
  - id: nagendra-digibank.7b
    label: 7b
    topic: "Performance: blocking work"
    title: "Can Web Workers help with this kind of requirement?"
    body: |
      #### Short answer

      Yes, when the work is CPU-bound: a large calculation, parsing, sorting, cryptography, processing data without the DOM. A worker is another thread. The main thread stays on clicks and frames. Data goes through `postMessage`: structured clone, or transferring an `ArrayBuffer`. A worker has no DOM access, so it will not read layout or write into the document.

      A worker does not speed up `fetch`: waiting on the network does not block the main thread anyway. On tiny work, the message round trip costs more than the calculation. If the result has to be computed on the main thread because it is tied to the DOM immediately, what remains is chunking and the scheduler, not a worker.

      #### Code example

      ```js
      const worker = new Worker(new URL('./calc.worker.js', import.meta.url));

      worker.postMessage({ items });

      worker.onmessage = (event) => {
        setTotal(event.data.total);
      };
      ```

      ```js
      self.onmessage = (event) => {
        const total = event.data.items.reduce((sum, value) => sum + value, 0);
        self.postMessage({ total });
      };
      ```

      #### Phrase you can say

      A Web Worker helps here when the CPU is busy for a long time, not when we are waiting on the network. I send it the array through `postMessage`, the UI stays on the main thread, and the worker does not touch the DOM.
  - id: nagendra-digibank.8a
    label: 8a
    topic: "State management: Redux and Context"
    title: "Which state management tools have you used with Redux?"
    body: |
      #### Short answer

      You name only what you have used. Someone else's project and someone else's set do not get substituted. These are the tools that usually sit with Redux, and they are what you will be recognized by.

      Redux Toolkit: `configureStore` and `createSlice`, which is how Redux is written now. `react-redux`: `Provider`, `useSelector`, `useDispatch`. Thunk is in the RTK middleware by default and is there for async actions. RTK Query is an API cache next to the store. `createSelector` from Reselect is memoized selectors. Redux Saga and Redux Observable are separate models for side effects. You name them if you actually ran a flow through them. Otherwise you say you know the model and they were not in the project.

      The Context API is not Redux middleware. It is often kept beside Redux for theme or locale, not instead of a reducer.

      #### Phrase you can say

      With Redux I name tools from my own stack, and I do not claim anyone else's. That is usually Redux Toolkit, `react-redux`, and thunk. I mention RTK Query, Saga, or Observable only if they were actually in my work.
  - id: nagendra-digibank.8b
    label: 8b
    topic: "State management: Redux and Context"
    title: "Briefly explain Redux and its uses."
    body: |
      #### Short answer

      Redux keeps client state in one store. State is read, and it changes by an action: `dispatch` sends an action, a pure reducer returns the next state, and subscribers render again. Middleware, for example thunk, sits between dispatch and the reducer and takes the async work. The history of actions is predictable: the same action from the same state produces the same next state.

      You use it when distant screens read one piece of client state and you want the updates to be traceable. A local toggle stays in `useState`. A cache of server responses is more at home in RTK Query or React Query than in a slice you fill by hand.

      #### Code example

      ```tsx
      const counterSlice = createSlice({
        name: 'counter',
        initialState: { value: 0 },
        reducers: {
          incremented(state) {
            state.value += 1;
          },
        },
      });

      const store = configureStore({
        reducer: { counter: counterSlice.reducer },
      });

      store.dispatch(counterSlice.actions.incremented());
      ```

      #### Phrase you can say

      Redux is one store, and changes go only through an action and a pure reducer. It is for shared client state that you need to trace. I do not move local state and the server cache into it out of habit.
  - id: nagendra-digibank.8c
    label: 8c
    topic: "State management: Redux and Context"
    title: "Design question: how would you build a student dashboard (attendance, results) with data from APIs?"
    body: |
      #### Short answer

      The shell is a header and a route outlet. Routes split overview, attendance, and results, so one screen does not wait for both APIs. The student id comes from the route.

      Attendance and results are server state. Each resource has its own request and its own key: `['attendance', studentId]` and `['results', studentId]`. While one response is in flight, the other screen can already show its own. Loading and error live on their own request. Copying those same rows into a Redux slice as well creates two sources. You do not do that.

      What stays in Redux or in local state is client state: the selected term, a filter, something that is not in the API response. If the same student appears in both responses, you normalize by id when you need to, and you do not glue the raw arrays together in one component forever.

      #### Code example

      ```tsx
      function AttendancePage() {
        const { studentId } = useParams();
        const attendance = useQuery({
          queryKey: ['attendance', studentId],
          queryFn: () => fetchJson(`/api/students/${studentId}/attendance`),
        });

        return <AttendanceTable rows={attendance.data} />;
      }

      function ResultsPage() {
        const { studentId } = useParams();
        const results = useQuery({
          queryKey: ['results', studentId],
          queryFn: () => fetchJson(`/api/students/${studentId}/results`),
        });

        return <ResultsTable rows={results.data} />;
      }
      ```

      #### Phrase you can say

      I would build the dashboard as a shell with routes. Attendance and results are separate requests keyed by student id, and one does not block the other. I put only a client filter in Redux, if it is actually shared, and not the API responses themselves.
  - id: nagendra-digibank.8d
    label: 8d
    topic: "State management: Redux and Context"
    title: "The dashboard has a few routes and uses a light theme. How would you add a header toggle to switch between light and dark themes and keep the chosen value (ignore the CSS)?"
    body: |
      #### Short answer

      CSS stays out of this: no classes, no variables, no styles on `body`. What you need is the chosen value and a toggle in the header.

      The value lives in context state. `ThemeProvider` wraps the router, so a route change does not unmount the provider and does not reset the choice. The header is the consumer: it reads the theme and calls the toggle from a button. The starting value is the light theme.

      While the provider is mounted, the choice is already kept in that state, and the header and any page see it. To keep the choice across a reload, you read `localStorage` when you create the state and write it when the theme changes. `localStorage` is only that way to hold the value after reload. For the tree, the source is context state.

      #### Phrase you can say

      I put the theme toggle in the header, and I keep the value in context state above the routes, so moving between pages does not wipe it. Light is the start. A reload survives because of a write to `localStorage`, but the UI still reads the state. I do not add CSS.
  - id: nagendra-digibank.8e
    label: 8e
    topic: "State management: Redux and Context"
    title: "Write the code for the theme toggle (Context: provider and consumer)."
    body: |
      #### Short answer

      The provider holds `'light' | 'dark'` and a toggle function. The consumer in the header reads the context and calls `toggleTheme` on click. The provider sits above the routes, so the value is one value for the dashboard.

      The choice is kept in context state. The state initializer reads `localStorage`, and an effect writes the theme back: that is how the value survives a reload. For components the source is the context. Browser storage only holds the choice. The starting value is light. There is no CSS in the sample.

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```tsx
      import { createContext, useContext, useEffect, useMemo, useState } from 'react';

      const ThemeContext = createContext(null);

      function readTheme() {
        if (typeof window === 'undefined') {
          return 'light';
        }
        const saved = window.localStorage.getItem('theme');
        return saved === 'dark' ? 'dark' : 'light';
      }

      export function ThemeProvider({ children }) {
        const [theme, setTheme] = useState(readTheme);

        useEffect(() => {
          window.localStorage.setItem('theme', theme);
        }, [theme]);

        const value = useMemo(() => {
          return {
            theme,
            toggleTheme() {
              setTheme((current) => (current === 'light' ? 'dark' : 'light'));
            },
          };
        }, [theme]);

        return (
          <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
        );
      }

      export function ThemeToggle() {
        const { theme, toggleTheme } = useContext(ThemeContext);

        return (
          <button type="button" onClick={toggleTheme}>
            {theme}
          </button>
        );
      }

      export function App() {
        return (
          <ThemeProvider>
            <header>
              <ThemeToggle />
            </header>
          </ThemeProvider>
        );
      }
      ```

      #### Phrase you can say

      The provider keeps the theme in state and passes `toggleTheme`. The header reads the context and renders a button. The choice lives in context across routes, and I use `localStorage` only so a reload does not drop it. There are no styles in this code.
  - id: nagendra-digibank.9a
    label: 9a
    topic: TypeScript
    title: "Do you have TypeScript experience?"
    body: |
      #### Short answer

      Yes or no comes from your CV. Years and a project are not invented here. If you have the experience, one sentence shows what you actually typed: component props, hook arguments, an API response, a generic on a value. If you do not, you say so, and you show that you can still read a hook signature: the value parameter, the delay parameter, and the return type.

      #### Phrase you can say

      With TypeScript I [have worked in production / have not yet — as the CV says]. I can type a hook: a generic for the value, `delay: number`, and an explicit return type, without an invented project.
  - id: nagendra-digibank.9b
    label: 9b
    topic: TypeScript
    title: "Add type checks to the useDebounce hook and useEffect code you wrote (parameter types, generics, return types)."
    body: |
      #### Short answer

      `useDebounce` gets three explicit checks. The generic `T` is the value type, the same `T` on the argument, on state, and on the return, so a string in stays a string out. `delay` is `number`. The hook's return type is `T`.

      `useState<T>` fixes the state. The effect returns a cleanup `() => void`. Inside the effect the loader is declared as `Promise<void>`: it returns nothing to the caller, it waits for `fetch`, and it checks the status. `query` is `string`, `touched` is `boolean`, and the field event is `ChangeEvent<HTMLInputElement>`.

      After `touched`, the empty string is still its own path, not `if (!debouncedQuery)`. The initial empty state does not become a search.

      The snippet below is a walkthrough of the prompt, not a transcript of a screen.

      #### Code example

      ```tsx
      import { useEffect, useState, type ChangeEvent } from 'react';

      function useDebounce<T>(value: T, delay: number): T {
        const [debouncedValue, setDebouncedValue] = useState<T>(value);

        useEffect(() => {
          const timer = window.setTimeout(() => {
            setDebouncedValue(value);
          }, delay);

          return () => {
            window.clearTimeout(timer);
          };
        }, [value, delay]);

        return debouncedValue;
      }

      function SearchBox() {
        const [query, setQuery] = useState<string>('');
        const [touched, setTouched] = useState<boolean>(false);
        const debouncedQuery = useDebounce<string>(query, 500);

        useEffect(() => {
          if (!touched) {
            return;
          }

          if (debouncedQuery === '') {
            return;
          }

          const controller = new AbortController();

          const load = async (): Promise<void> => {
            const response = await fetch(
              `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
              { signal: controller.signal },
            );
            if (!response.ok) {
              throw new Error(String(response.status));
            }
            await response.json();
          };

          void load();

          return () => {
            controller.abort();
          };
        }, [debouncedQuery, touched]);

        return (
          <input
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTouched(true);
              setQuery(event.target.value);
            }}
          />
        );
      }
      ```

      #### Phrase you can say

      `useDebounce` takes a generic `T` for the value, `delay` as `number`, and returns `T`. The effect returns a cleanup of type `void`, and the inner `load` is marked `Promise<void>`, because it does not hand a value back out.
  - id: nagendra-digibank.9c
    label: 9c
    topic: TypeScript
    title: "Why does this function need a return type when it has no return statement?"
    body: |
      #### Short answer

      A function with no `return` statement still returns `undefined`. In JavaScript, execution that reaches the end of the body finishes with the value `undefined`. For an `async` function that is a promise that fulfills with `undefined`. An annotation of `void` or `Promise<void>` writes that down. It is there not because the body is required to contain the word `return`, but because there is a result and it has to be named. `void` tells the caller not to use the value. A missing keyword is normal for that result.

      The checker looks at the signature, not at the missing `return` alone. Under `noImplicitReturns`, every path has to satisfy the declared type. A path with no `return` produces `undefined`, and that `undefined` is checked against the signature. If the signature is `void` or `Promise<void>`, the path fits. If the signature is `string` or `Promise<string>`, the same path with no keyword is an error: a value was promised, and the path finishes with `undefined`. The contract in the annotation decides. The checker has no separate rule that "there is no word return, so there is no type".

      Both parts at once: at runtime a function with no `return` returns `undefined`, and an explicit `void` or `Promise<...>` annotation says whether that `undefined` is allowed. `load` from the hook is exactly that function, with no `return` of its own and with `Promise<void>`, because it only performs the request.

      #### Code example

      ```tsx
      function onSettled(): void {
        console.log('settled');
      }

      async function loadNews(): Promise<void> {
        await fetch('/api/news');
      }

      function label(ok: boolean): string {
        if (ok) {
          return 'ok';
        }
      }

      async function loadTitle(): Promise<string> {
        await fetch('/api/news');
      }
      ```

      #### Phrase you can say

      Without `return`, the function still returns `undefined`, and an `async` function returns a promise of `undefined`. The type `void` or `Promise<void>` documents that. Under `noImplicitReturns`, and with a declared `Promise` or `void` annotation, the checker checks paths against the signature: for `void` a missing `return` is valid, and for `Promise<string>` the same path does not fit. The annotation decides, not the missing keyword by itself.
---

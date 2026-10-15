---
day: catalog
title: "Next.js questions"
questions:
  - id: "1"
    title: "How do Server Components differ from Client Components?"
    body: |
      #### Short answer

      In the App Router a component is a Server Component by default until it falls under a client boundary. A Server Component runs on the server, at build time or during a request. Its own JavaScript is not part of the client bundle. It can be `async` and can talk directly to a database, files, and secrets. It cannot use `useState`, `useEffect`, or browser APIs.

      Data returned in JSX can still appear in the HTML or in the RSC response. A Server Component does not by itself mean that every piece of data is protected.

      `"use client"` creates a client module-graph boundary. Modules imported statically from that file enter the graph and can land in the client bundle. A Client Component can use state, effects, event handlers, and browser APIs such as `window`, `document`, and `localStorage` in a suitable context. An ordinary Client Component cannot be `async`. It has no direct database access: that needs a server layer.

      A Client Component does not mean rendering only in the browser. On the first load Next.js usually prerenders it to HTML on the server, and then React hydrates it in the browser.

      A tree that is visually inside a Client Component does not become client-side as a whole. A Server Component can pass JSX that was already created on the server through `children`.

      Use Server Components by default for pages, data loading, database reads, and content that does not need client interactivity. Add a Client Component for forms, modals, local state, event handlers, or browser APIs. A Client Component can also render static text, but there is no reason to make it client-side without a need. Permission checks run on the server, and they do not have to live inside the component itself: a service, a DAL, or an API can own them.

      On an account page, the balance and the history are Server Components. A modal button and a transfer form with its own state are Client Components. The permission check and the transfer itself stay server logic.

      | | Server Component | Client Component |
      | --- | --- | --- |
      | Where it runs | On the server | In the browser; the first render can also run on the server |
      | `useState` / `useEffect` | No | Yes |
      | Event handlers | No | Yes |
      | Direct database access | Yes | No, a server layer is required |
      | Component code in the client bundle | No | Yes |
      | `async` component | Yes | No |
      | Default in the App Router | Yes | No |

      #### Code example

      ```tsx
      export default async function UsersPage() {
        const users = await db.user.findMany();

        return (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        );
      }
      ```

      ```tsx
      'use client';

      import { useState } from 'react';

      export default function Counter() {
        const [count, setCount] = useState(0);

        return (
          <button type="button" onClick={() => setCount(count + 1)}>
            Count: {count}
          </button>
        );
      }
      ```

      A server page can import the client `Counter` and keep loading the user on the server.

      #### Phrase to recite

      In the App Router everything is server by default. A Server Component runs on the server, can be `async`, can reach the database and secrets, and its JS does not enter the client bundle. State, effects, and browser APIs are not available there. `"use client"` is a module boundary: a static import from that file can enter the client bundle. A Client Component is also prerendered to HTML and then hydrated. Put interactivity on the client, keep permission checks on the server, and do not treat data in JSX as a secret by itself.
  - id: "2"
    title: "Can you import a Server Component into a Client Component?"
    body: |
      #### Short answer

      Not directly. If a Client Component statically imports a Server Component, that module enters the client graph. Database access does not stay a server execution.

      Pass JSX that was already created on the server through `children` or another prop. This is the holes pattern: the Client Component leaves a slot, and the Server Component passes the finished result. The shell does not call the server component itself. As a prop it looks like `content={<ServerList />}`. You can pass values the RSC protocol supports, not an arbitrary server value.

      The other direction is allowed. A Server Component can import a Client Component directly, for example an interactive button.

      A client shell cannot, on a button click, call that Server Component again and reach the database. `children` already holds the result of the server render. This write-up does not specify how to request the data again.

      #### Code example

      ```tsx
      'use client';

      import ServerList from './ServerList';

      export default function ClientShell() {
        return <ServerList />;
      }
      ```

      That import makes `ServerList` part of the client graph. The server page builds the result itself and passes it into the shell:

      ```tsx
      import ClientShell from './ClientShell';
      import ServerList from './ServerList';

      export default function Page() {
        return (
          <ClientShell>
            <ServerList />
          </ClientShell>
        );
      }
      ```

      ```tsx
      'use client';

      export default function ClientShell({ children }: { children: React.ReactNode }) {
        return <div className="shell">{children}</div>;
      }
      ```

      The same result can be passed as a prop: `<ClientShell content={<ServerList />} />`.

      #### Phrase to recite

      An import defines the module graph: a Server Component imported into a Client Component becomes client-side. Pass JSX that was already created on the server through `children` or a prop, and the shell does not call that component itself. A Server Component can still import a Client Component directly. A button cannot reach the database again through the same `children`: that value is already a render result.
  - id: "3"
    title: "What can you pass from an RSC to a Client Component through props?"
    body: |
      #### Short answer

      A Server Component and a Client Component can run in different environments, so a value crosses the RSC protocol. That is not `JSON.stringify()`.

      You can pass primitives: `string`, `number`, `boolean`, `null`, `undefined`, and `bigint`. You can pass arrays and plain objects, `Date`, `Map`, `Set`, a `Promise` the client reads with `use()`, JSX, and Server Actions, which are functions marked `"use server"`.

      An ordinary function cannot be passed. It lives in the memory of the server process, and the browser does not receive a callable reference to it. An instance of an arbitrary class cannot be passed either: it can hold methods and internal state the protocol does not restore. Pass `{ name: "Alex" }` instead of `new User("Alex")`. The client creates any extra logic on its own side. The exact limits depend on the value type and the React version.

      A Server Action is different. The client receives a special reference. The call makes a request, the function runs on the server, and its code is not sent to the browser. `"use server"` does not by itself make the call safe: the action checks authorization and the input.

      Serializable means the value can be passed, not that it is safe to reveal. A plain object with `passwordHash` serializes, and the hash reaches the browser if it is included in props. Choose the fields the client needs. A plain object also fails to serialize when it contains an unsupported value, such as an ordinary function.

      `isAdmin: true` in a Client Component's props does not protect an admin page. A client flag can be changed. The permission check stays on the server.

      | Value | Can be passed |
      | --- | --- |
      | Primitives, arrays, plain objects | Yes |
      | `Date`, `Map`, `Set`, `Promise`, JSX | Yes |
      | Server Action with `"use server"` | Yes, as a reference to a server call |
      | Ordinary function | No |
      | Instance of an arbitrary class | No |

      #### Code example

      ```ts
      'use server';

      export async function updateUser(name: string) {
        await db.user.update({ name });
      }
      ```

      ```tsx
      return (
        <UserProfile
          user={{ id: user.id, name: user.name }}
          action={updateUser}
        />
      );
      ```

      `passwordHash` and other private fields do not go in that object. `<ClientComponent onClick={() => console.log('Hello')} />` does not work: that is an ordinary function of the server process.

      #### Phrase to recite

      RSC props can carry primitives, plain objects, arrays, `Date`, `Map`, `Set`, `Promise`, JSX, and Server Actions. Ordinary functions and class instances cannot. The protocol is not `JSON.stringify()` and it is not permission to reveal data: a `passwordHash` in a serializable object still reaches the browser. `"use server"` does not replace a permission check. A client `isAdmin` does not protect a page.
  - id: "4"
    title: "Why server-only and client-only?"
    body: |
      #### Short answer

      `server-only` marks a module as server-only. If it is imported from the client graph, the build fails. That catches an accidental import of a database, secret keys, server logic, and internal services. The package does not replace a check of which data the server sends to the client, and it does not catch a secret you passed through props yourself.

      `client-only` is the opposite boundary. A module that uses `window`, `document`, `localStorage`, or a browser library cannot be imported into the server graph: the build reports that too.

      These are marker packages that Next.js recognizes at build time. They are not protection for every React application, and they do not find every leak.

      A server module entering the client graph can be a security problem, but not every such module reveals secrets by itself. It depends on the contents and on the build. With correct Next.js handling the build can fail, or the server functionality does not become available to the client. If a secret is explicitly inlined into client code, it can end up in the JS bundle and be visible in DevTools. If it did not enter the bundle, that particular leak may not happen, but the boundary mistake remains.

      Environment variables without the `NEXT_PUBLIC_` prefix are usually not inlined into the client bundle by themselves. Do not rely on that alone: a secret can be passed through props, returned from an API, or written into client code.

      If the module's code does land in the bundle, the user may be able to read the logic, the bundle can grow, and server dependencies may not work in the browser. Revealing logic is not always a vulnerability.

      The working shape is: a Client Component calls HTTP or a Server Action, the server layer checks permissions and input, and only then it reaches the database. Secrets stay on the server.

      | | `server-only` | `client-only` |
      | --- | --- | --- |
      | Purpose | Server boundary | Client boundary |
      | What it catches | Import of a server module into the client graph | Import of a client module into the server graph |
      | Typical module | Database, secrets, server services | `localStorage`, browser APIs |

      #### Code example

      ```ts
      import 'server-only';

      export async function getUsers() {
        return db.user.findMany();
      }
      ```

      ```ts
      import 'client-only';

      export function getTheme() {
        return localStorage.getItem('theme');
      }
      ```

      Importing `getUsers` from a file with `"use client"` should stop the build. That still does not stop a separate pass of a secret into a Client Component through props.

      #### Phrase to recite

      `server-only` fails the build if a server module enters the client graph. `client-only` fails it in the other direction. These are boundary markers, not complete secret protection: a non-`NEXT_PUBLIC_` variable is not inlined into the client bundle by itself, but a secret can still be sent through props, an API, or client code. Secrets and permission checks stay on the server behind HTTP or a Server Action.
  - id: "5"
    title: "App Router special files"
    body: |
      #### Short answer

      In the App Router, special files define pages, navigation, loading, errors, and HTTP handlers. Next.js recognizes a file by its name and wires up the behavior itself.

      - `page.tsx` makes a route reachable. Folders match the URL. It is a Server Component by default. It can read `params` and `searchParams` and use server resources. It does not define the shared layout.
      - `layout.tsx` wraps `children`. During ordinary navigation inside the same layout instance it does not remount, so shell state usually stays. It can still render again: saying “a layout never re-renders” is inaccurate. A layout is a Server Component by default.
      - A child page can have its own `layout.tsx`. Shells nest: `/dashboard/settings` gets the root layout, the dashboard layout, and the settings layout. A nested layout does not cancel its parent.
      - A shell without the parent layout means separate root layouts through route groups. The full group explanation is question 6. Navigation between different root layouts is a full document load, not ordinary client navigation. If a shared `app/layout.tsx` already exists, group layouts stay nested inside it.
      - `template.tsx` also wraps `children`, but it creates a new instance when the matching segment changes. That is not every navigation in the app. Remounting clears local state, runs effects again, and creates the DOM again. Use a template for an entrance animation, resetting state, or mount logic. Do not use it instead of a layout without a reason. Parent layout state can remain. Resetting one small component is often a `key`. Splitting whole site shells is route groups, not a template.
      - `loading.tsx` is the segment fallback, in the sense of a React Suspense boundary, not a literal wrap of the whole app in one JSX tree. It is a skeleton, spinner, or placeholder. It does not cover every wait: Suspense boundaries, the segment, the navigation, and when Next can show a fallback all matter. A layout that is already on screen can stay there.
      - `route.ts` exports HTTP method functions and returns a `Response`, not page JSX. Only exported methods are handled. `page.tsx` and `route.ts` conflict in the same segment.
      - On a route such as `/dashboard/settings` the files do not all run at once. Success shows `page`. Waiting on async content can show `loading`. A caught segment error shows `error`. `notFound()` shows the not-found UI.
      - `generateStaticParams()` predefines dynamic route params for static generation. How static rendering differs from dynamic rendering is question 7.
      - The roles of `error.tsx`, `global-error.tsx`, and `not-found.tsx` are only named here. How to handle errors and 404 is question 20, and that answer is not a pointer back here.

      A Server Component and a Client Component share one screen. An RSC runs on the server, does not handle browser events, and does not mean a click is sent to the server. Local `setState` updates the UI in the browser with no request. A request is needed when data must be saved on the server: `fetch` to a Route Handler, a Server Action, or another server mechanism the app already has. A Server Action is a network call. Real code also needs errors, a loading state, and an authorization check on the server. Server-rendered UI data can be refreshed with `revalidatePath()` or `revalidateTag()` when that fits the case.

      The first open of a URL is usually rendered on the server: HTML and an RSC payload. Client Component JavaScript loads separately. A database call from server code is a driver call, not necessarily a separate HTTP request from the app. A client transition through an App Router link usually requests the RSC payload for the new route and does not have to reload the whole HTML document. Layouts that persist usually stay. Prefetch and cache can skip repeating work. Re-rendering an already loaded Client Component does not by itself run a Server Component. A database query inside a Server Component runs again when Next executes that component again and the result is not reused from cache.

      #### Code example

      ```tsx
      // app/products/page.tsx — Server Component
      import FavoriteButton from './FavoriteButton';

      export default async function ProductsPage() {
        const products = await db.product.findMany();

        return (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name}
                <FavoriteButton productId={product.id} />
              </li>
            ))}
          </ul>
        );
      }
      ```

      ```tsx
      // app/products/FavoriteButton.tsx
      'use client';

      import { useState } from 'react';

      export default function FavoriteButton({ productId }: { productId: string }) {
        const [favorite, setFavorite] = useState(false);

        return (
          <button type="button" onClick={() => setFavorite(!favorite)}>
            {favorite ? 'saved' : 'save'}
          </button>
        );
      }
      ```

      A click on this button changes state in the browser. To store the favorite on the server, call a Server Action from the Client Component:

      ```tsx
      // app/products/actions.ts
      'use server';

      export async function toggleFavorite(productId: string) {
        // Check the user and write the change.
      }
      ```

      A dynamic `page.tsx` in the current App Router awaits `params`. Why the API is async is question 7.

      ```tsx
      // app/products/[id]/page.tsx
      export default async function ProductPage({
        params,
      }: {
        params: Promise<{ id: string }>;
      }) {
        const { id } = await params;
        return <h1>Product: {id}</h1>;
      }
      ```

      | Property | layout.tsx | template.tsx |
      | --- | --- | --- |
      | Shared shell | Yes | Yes |
      | Instance while navigating inside the segment | Usually kept | New when the segment instance changes |
      | Local state | Can stay | Cleared on remount |
      | Effects | Do not have to rerun on every navigation | Run again on remount |
      | Purpose | Persistent UI | A shell with a new lifecycle |

      | Action | Network request? |
      | --- | --- |
      | `setState` in a Client Component | No |
      | A click that only changes local UI | No |
      | Calling a Server Action | Yes |
      | `fetch('/api/...')` | Yes |
      | First open of the page | Usually yes, to the app server |
      | Navigation to a new RSC route | Usually a route payload; prefetch and cache are possible |
      | Re-render of an already loaded Client Component | Not necessarily |

      #### Phrase to recite

      App Router special files are names Next wires into the route: `page` draws the UI, `layout` usually keeps its instance, `template` remounts when the segment changes, `loading` is the segment Suspense fallback, and `route` answers HTTP. An RSC does not send every click to the server: local `setState` stays in the browser, while a Server Action and `fetch` go over the network.

      `middleware.ts`, and in newer Next.js versions the developing `proxy.ts` model as well, is logic before the route is handled, not a segment UI file. `generateMetadata()` sets page metadata such as title and description.
  - id: "6"
    title: "Route groups, parallel and intercepting routes"
    body: |
      #### Short answer

      These are three different mechanisms. A route group organizes files and layouts and does not enter the URL. A parallel route shows several UI branches in one layout through `@` slots. An intercepting route shows an existing route in the context of the current navigation, for example a photo in a modal when you move from the gallery, and a full page when you open that same URL directly.

      `(group)` does not create a route and does not replace authorization. Two groups that produce the same URL conflict. If there is no shared `app/layout.tsx`, a group layout can be a root layout and must return `<html>` and `<body>`. If a shared root layout exists, group layouts are nested inside it.

      `@slot` is a named slot, not a URL segment. Next passes it to the layout as a prop next to `children`. A slot can have its own `loading.tsx` and `error.tsx`. That is not absolute isolation of every server operation, and it does not guarantee that data requests run in parallel. Parallel routes organize independent UI branches. Parallel data fetching also depends on the data-loading code.

      `default.tsx` is the spare UI for a slot when a direct open or a full reload cannot restore its active state. It is not the loading screen. Loading uses `loading.tsx`. During client navigation Next can keep the slot’s active content even when the URL does not reflect it.

      An intercepting route does not draw a modal by itself. You build the modal in the slot UI. The markers count URL segments, not `@slot` folders.

      | Marker | Meaning |
      | --- | --- |
      | `(.)` | The current route level |
      | `(..)` | One level up |
      | `(..)(..)` | Two levels up |
      | `(...)` | From the `app` root |

      Soft navigation intercepts the transition and can show the same URL in another context, such as a photo over the list. Hard navigation — pasting the URL or reloading — shows the full page. The URL is real and can be copied. The address itself does not mean the UI is always modal.

      #### Code example

      ```text
      app/
      ├── (public)/
      │   ├── layout.tsx
      │   └── page.tsx
      └── (private)/
          ├── layout.tsx
          └── dashboard/page.tsx
      ```

      Names in parentheses are not part of the URL: `/` uses the public layout, `/dashboard` uses the private layout.

      ```tsx
      // app/dashboard/layout.tsx
      export default function DashboardLayout({
        children,
        analytics,
        notifications,
      }: {
        children: React.ReactNode;
        analytics: React.ReactNode;
        notifications: React.ReactNode;
      }) {
        return (
          <div>
            <main>
              {children}
              {analytics}
            </main>
            <aside>{notifications}</aside>
          </div>
        );
      }
      ```

      The slots live in `app/dashboard/@analytics` and `app/dashboard/@notifications`. Each can have its own `page.tsx`, `loading.tsx`, and `error.tsx`.

      ```tsx
      // app/dashboard/@analytics/default.tsx
      export default function DefaultAnalytics() {
        return null;
      }
      ```

      A modal over a gallery:

      ```text
      app/photos/
      ├── layout.tsx
      ├── page.tsx
      ├── [id]/page.tsx
      └── @modal/
          ├── default.tsx
          └── (.)[id]/page.tsx
      ```

      `(.)[id]` intercepts `/photos/[id]` at the same level. The slot `default.tsx` can return `null` when there is no modal. The layout renders `{children}` and `{modal}`.

      #### Phrase to recite

      A route group does not enter the URL and does not check access. An `@slot` is a separate UI branch with its own loading and error, and `default.tsx` fills the slot when its state cannot be restored. An intercepting route shows the route in the current context on soft navigation, and the full page of the same URL on hard navigation. The levels `(.)`, `(..)`, and `(...)` count URL segments.
  - id: "7"
    title: "What changed in Next.js 15 for params and searchParams?"
    body: |
      #### Short answer

      In Next.js 15, `params` and `searchParams` became Promises. In a Server Component you read them with `await`. In a Client Component you unwrap a Promise prop with `React.use()`, not by making the component `async` and not with `useEffect` as a stand-in for render. If the Promise is not resolved yet, `use()` can suspend rendering, so the component needs a suitable Suspense boundary.

      `await` is here because of the API contract. An already resolved Promise does not mean a long wait and does not mean a network request. Next can manage request-time data and avoid blocking rendering where those values are not needed yet.

      `params` are URL segments. `searchParams` are the query string. Query values are usually strings: `page` is `"2"`, not the number `2`. Convert a number explicitly and check it. Reading the query can keep the route from being statically rendered.

      `cookies()`, `headers()`, and `draftMode()` from `next/headers` are also called with `await`. They are server APIs and are not for arbitrary use inside a Client Component. Using them can make rendering dynamic, because the response depends on the specific request.

      Next.js 15 had a transition period: synchronous access could still work with a warning. Current code uses the async API. The same applies in `generateMetadata`, `generateStaticParams`, and a Route Handler: `params` is a Promise there too.

      Dynamic rendering means the page is built on the server during the request, not entirely ahead of time at build. Static rendering prepares the result at build and lets it be reused. `async` by itself does not make a page dynamic.

      A dynamic route (`[id]`) and dynamic rendering are different. `[id]` can be generated statically with `generateStaticParams()`. A plain `/profile` can be dynamic because of `cookies()`.

      Dynamic rendering does not mean every request hits the database again. Page rendering, the data cache, and the cache of the finished result are different mechanisms. Even with dynamic rendering, some data can come from cache. A static result usually does less work per request, can be served from a CDN, and is easier to scale when the content is shared. Dynamic rendering is needed when the response depends on the specific request: authorization, cookies, or personal data.

      #### Code example

      ```tsx
      export default async function ProductPage({
        params,
        searchParams,
      }: {
        params: Promise<{ id: string }>;
        searchParams: Promise<{ tab?: string; page?: string }>;
      }) {
        const { id } = await params;
        const { tab, page } = await searchParams;
        const pageNumber = Number(page);

        return (
          <div>
            Product: {id}, tab: {tab}, page: {Number.isFinite(pageNumber) ? pageNumber : 1}
          </div>
        );
      }
      ```

      ```tsx
      'use client';

      import { use } from 'react';

      export default function ProductPage({
        params,
      }: {
        params: Promise<{ id: string }>;
      }) {
        const { id } = use(params);
        return <h1>Product {id}</h1>;
      }
      ```

      ```tsx
      import { cookies, headers, draftMode } from 'next/headers';

      export default async function Page() {
        const cookieStore = await cookies();
        const headersList = await headers();
        const { isEnabled } = await draftMode();
        const theme = cookieStore.get('theme')?.value ?? 'light';
        const userAgent = headersList.get('user-agent');

        return <div className={theme}>{userAgent} / draft: {String(isEnabled)}</div>;
      }
      ```

      ```tsx
      export async function GET(
        _request: Request,
        { params }: { params: Promise<{ id: string }> },
      ) {
        const { id } = await params;
        return Response.json({ id });
      }
      ```

      | Context | How to read |
      | --- | --- |
      | Server Component `page.tsx` | `await params` |
      | Server Component `layout.tsx` | `await params` |
      | `searchParams` | `await searchParams` |
      | Client Component with a Promise prop | `use(params)` |
      | `cookies()` | `await cookies()` |
      | `headers()` | `await headers()` |
      | `draftMode()` | `await draftMode()` |

      | Idea | Example | What it means |
      | --- | --- | --- |
      | Dynamic route | `app/products/[id]/page.tsx` | The URL has a parameter |
      | Dynamic rendering | The page reads `cookies()` | HTML is built during the request |
      | Static rendering | The page was built at `next build` | The finished result can be reused |

      A products page that `fetch`es with `next: { revalidate: 3600 }` does not become dynamic only because it is `async`. If the other conditions allow it, Next can build it ahead of time and refresh the data on the cache policy.

      #### Phrase to recite

      In the current App Router, `params` and `searchParams` are Promises: `await` on the server, `use()` on the client. `cookies()`, `headers()`, and `draftMode()` are async too and can make rendering dynamic because the response depends on the request. A dynamic `[id]` route is not the same thing as dynamic rendering, and `await` here does not mean a network request.
  - id: "8"
    title: "How is fetch cached in Next.js 15?"
    body: |
      #### Short answer

      In Next.js 15 a server `fetch` does not store its result in the Data Cache by default. In Next.js 14 the typical behavior was `force-cache`. That does not mean every call must go to the network.

      Turn the cache on explicitly. `cache: 'force-cache'` uses a matching Data Cache entry. `next: { revalidate: 60, tags: ['boards'] }` sets how long the result can be reused and the tags. `revalidate: 60` does not guarantee a refresh exactly 60 seconds later: revalidation can happen on the next request, and the details depend on the cache mechanism. A tag can invalidate related entries, for example through `revalidateTag('boards')`.

      These are three different mechanisms. Request Memoization deduplicates identical GETs in one render pass, even when the Data Cache is off: the second identical call does not have to hit the external API again. The Data Cache stores a `fetch` result across requests. The Full Route Cache stores the HTML and RSC payload of a static route. The full route cache is tied to data caching and to whether rendering is dynamic.

      Two calls to the same `getBoards()` in one server render, with no extra settings, are deduplicated. The same two calls in two different HTTP requests to the app are two renders. Without a Data Cache, each of them can perform a network request.

      On a segment, `export const revalidate = 60` sets the route revalidation interval. `export const dynamic = 'force-static'` forces static behavior for the route. That is not the cache of one `fetch`. `export const fetchCache = 'default-cache'` changes the `fetch` default in the segment: a request without its own cache setting uses `force-cache`.

      #### Code example

      ```ts
      const response = await fetch('https://api.example.com/boards', {
        cache: 'force-cache',
      });
      ```

      ```ts
      const response = await fetch('https://api.example.com/boards', {
        next: {
          revalidate: 60,
          tags: ['boards'],
        },
      });
      ```

      ```ts
      export const revalidate = 60;
      export const dynamic = 'force-static';
      export const fetchCache = 'default-cache';
      ```

      | Mechanism | Where it lives |
      | --- | --- |
      | Request Memoization | One render, identical GETs |
      | Data Cache | Server, across requests. In 15 you turn it on explicitly |
      | Full Route Cache | HTML and RSC payload of a static route |

      #### Phrase to recite

      In Next.js 15 `fetch` does not write its result to the Data Cache by default. Turn the cache on with `cache: 'force-cache'` or with `next.revalidate` and `next.tags`. A segment can set `revalidate`, `dynamic = 'force-static'`, and `fetchCache = 'default-cache'`. Identical GETs in one render are deduplicated by Request Memoization even without a persistent cache. In two different HTTP requests, without a Data Cache, each render can go to the network itself.
  - id: "9"
    title: "Name the Next.js caching layers"
    body: |
      #### Short answer

      There are four layers. They differ in scope, lifetime, and invalidation.

      Request Memoization deduplicates identical `fetch` calls in one server render. For an ORM and other functions in that same server context, use `React.cache`.

      The Data Cache stores results of a cacheable `fetch` on the server across requests. Entries can survive deploys, but whether they actually do depends on the environment: a local file or in-memory cache is not necessarily shared by every instance. Invalidation goes through `revalidate`, `revalidateTag`, and `revalidatePath`.

      The Full Route Cache stores the HTML and RSC payload of static routes. It can be filled at build time and during later generation or revalidation.

      The Router Cache stores the RSC payload in the browser and speeds up client navigation without a full document reload. In Next.js 15 `staleTimes.dynamic` defaults to 0: page segments of dynamic routes are not reused on ordinary client navigation the way they used to be. Shared layouts are still reused. Loading segments keep their own cache behavior.

      A full page reload in the browser clears the Router Cache. The Data Cache lives on the server and can keep data across different HTTP requests.

      `"use cache"` in Next.js 15 is an experimental direction, not a fifth classic layer. The directive caches functions, components, and routes. `cacheLife` sets the lifetime, and `cacheTag` sets revalidation tags. `dynamicIO` belongs to the experimental handling of dynamic input and caching. Do not mix these APIs with the four layers.

      | Layer | Where | What it stores |
      | --- | --- | --- |
      | Request Memoization | One server render | Identical `fetch` calls; otherwise `React.cache` |
      | Data Cache | Server, across requests | A cacheable `fetch` result. A deploy does not guarantee a shared cache in every environment |
      | Full Route Cache | Server | HTML and RSC payload of a static route |
      | Router Cache | Browser | RSC payload for client navigation. In 15 `staleTimes.dynamic` defaults to 0 |

      #### Code example

      ```ts
      import { cache } from 'react';

      export const getBoard = cache(async (id: string) => {
        return db.board.findUnique({ where: { id } });
      });
      ```

      `React.cache` reuses the function result within one server request. It is not the Data Cache and not the Router Cache.

      #### Phrase to recite

      Four layers: Request Memoization for one render, the Data Cache for `fetch` across requests, the Full Route Cache for static HTML and RSC payload, and the Router Cache for payload in the browser. In Next.js 15 the defaults are less aggressive: `fetch` is not cached on its own, and `staleTimes.dynamic` is 0, while layouts are still reused. A full reload clears the client Router Cache. The Data Cache can live across HTTP requests, but a shared cache after a deploy depends on the environment. `"use cache"`, `cacheLife`, `cacheTag`, and `dynamicIO` are experimental, not a fifth layer.
  - id: "11"
    title: "Static versus dynamic rendering"
    body: |
      #### Short answer

      Static rendering prepares a page ahead of time, for example at build, and reuses the result for many users. That fits a landing page, documentation, and a public product page. Dynamic rendering builds the page on the server during the request, when the result depends on that request: a profile, personal data, or a response that accounts for cookies.

      Dynamic APIs can make rendering dynamic: `cookies()`, `headers()`, the page's current `searchParams`, and `connection()`. In Next.js 15 `cookies()` and `headers()` are async. `export const dynamic = 'force-dynamic'` explicitly forces the route to render dynamically.

      An uncached `fetch` is also listed among the causes. In Next.js 15 `fetch` is uncached by default, but the absence of a Data Cache does not automatically make a route dynamic in every configuration. Context, other APIs, and segment settings matter.

      `generateStaticParams` predefines known values of a dynamic segment, such as `[slug]`. Having the function does not guarantee the whole route is static if another part needs dynamic rendering.

      PPR, Partial Prerendering, is experimental in Next.js 15 and needs its own configuration. It is a static shell plus dynamic holes in `Suspense`. `Suspense` by itself does not enable PPR. A product name, description, and image can be static, while a personal price read from cookies sits in `Suspense` with a fallback.

      #### Code example

      ```tsx
      export async function generateStaticParams() {
        return [{ slug: 'react' }, { slug: 'nextjs' }];
      }

      export default async function BlogPost({
        params,
      }: {
        params: Promise<{ slug: string }>;
      }) {
        const { slug } = await params;

        return <article>Post: {slug}</article>;
      }
      ```

      ```tsx
      export default function ProductPage() {
        return (
          <>
            <ProductInfo />
            <Suspense fallback={<PriceSkeleton />}>
              <PersonalizedPrice />
            </Suspense>
          </>
        );
      }
      ```

      `ProductInfo` can be static. `PersonalizedPrice` reads cookies and stays a dynamic hole when PPR is enabled by configuration.

      #### Phrase to recite

      Static rendering prepares a page ahead of time and reuses the result. Dynamic rendering builds it on the request. Dynamic APIs (`cookies()`, `headers()`, `searchParams`, `connection()`), segment settings, and `dynamic = 'force-dynamic'` make a route dynamic. An uncached `fetch` in Next.js 15 does not by itself always mean dynamic rendering. Generate a `[slug]` ahead of time with `generateStaticParams` when the rest of the route allows it. PPR is experimental in 15: a static shell and dynamic holes in `Suspense`, but `Suspense` alone does not enable PPR.
  - id: "16"
    title: "What is the RSC payload?"
    body: |
      #### Short answer

      The RSC payload is a serialized representation of the React Server Component render result. It is not HTML and it is not component source code.

      It holds the server render result in a format React understands, references to Client Components and the information needed to load them, the props of those components, and how to join the server and client parts of the tree. The source of a Client Component is not in the payload: the client loads its JavaScript separately when it is needed.

      From the payload the client reconciles and updates the React tree without a full document reload. On soft navigation Next.js usually requests the RSC payload of the next page instead of a new full HTML document. The exact behavior depends on the navigation and the cache. Shared layouts can stay, already loaded Client Components can be reused, and the needed parts can update.

      The first load is different. Next.js usually sends HTML for a fast first paint and the data React needs for the rest of the work and for hydration.

      A payload that already contains a rendered Server Component does not replace the JavaScript of a Client Component. A counter button reacts to a click only when the client code runs.

      | Format | What it is for |
      | --- | --- |
      | HTML | The first paint in the browser |
      | RSC payload | The server result structure for the first load and later updates |
      | Client JavaScript | Running Client Components and interactivity |

      #### Code example

      ```tsx
      export default async function Page() {
        const user = await getUser();

        return (
          <>
            <h1>{user.name}</h1>
            <Counter initialCount={user.count} />
          </>
        );
      }
      ```

      ```tsx
      'use client';

      export default function Counter({ initialCount }: { initialCount: number }) {
        return <button type="button">{initialCount}</button>;
      }
      ```

      The payload carries the heading and the props for `Counter`. The code of `Counter` is not placed in the payload.

      #### Phrase to recite

      The RSC payload is the serialized result of the Server Component tree: server output, references to Client Components, and their props. Client source is not inside it. On soft navigation the app usually requests the payload and updates the tree without a full document reload, not "without HTML" as a universal rule. On the first open the browser receives HTML and the data for hydration. A button still needs client JavaScript.
  - id: "17"
    title: "Middleware: what can it do, and what should it not do?"
    body: |
      #### Short answer

      Middleware is code that runs before a request reaches its final handler. It decides what to do with the request. It does not replace the main business logic of the application.

      By default, middleware runs on the Edge runtime. That is a lightweight environment aimed at fast work close to the user. It does not support every Node.js API. Next.js 15.2 added experimental support for the Node.js runtime in middleware. Later versions may have changed the capabilities and the names.

      Middleware can redirect and rewrite, change request or response headers, read or write cookies, detect a language and send the user to a localized page, pick an A/B variant, and run a coarse authorization check.

      A redirect tells the browser to go to another URL, and the address bar changes. An unauthenticated user opens `/dashboard` and lands on `/login`. A rewrite serves the request from another route internally, and the URL in the browser stays the same. The user opens `/en/products`, and the application serves the content of another route.

      `matcher` lists the URLs that run middleware. If it is only needed for an account area, it does not have to run on every page of the site.

      Do not put heavy business logic, heavy computation, or database queries in middleware when you can do without them. It can run on every matching request, extra work adds latency, and heavy dependencies may not fit the runtime. Checking that a token cookie exists is a suitable job. Loading dozens of related records and performing the whole permission check usually is not.

      Authorization cannot live only in middleware. Data can be requested through separate APIs, Server Actions, and other routes. A configuration mistake or a middleware vulnerability bypasses the page check. An authenticated user does not automatically have the right to read someone else's data. The check belongs on the server where data is read or changed, in the Data Access Layer.

      CVE-2025-29927, disclosed in March 2025, could in certain conditions and in certain Next.js versions bypass an authorization check implemented in middleware by using a crafted `x-middleware-subrequest` header. Patched versions were released. Middleware cannot be treated as the only protection layer: you need a patched Next.js version and a permission check next to the protected data.

      #### Code example

      ```ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';

      export function middleware(request: NextRequest) {
        const path = request.nextUrl.pathname;

        if (path.startsWith('/dashboard') && !request.cookies.has('session')) {
          return NextResponse.redirect(new URL('/login', request.url));
        }

        if (path === '/en/products') {
          return NextResponse.rewrite(new URL('/products', request.url));
        }

        return NextResponse.next();
      }

      export const config = {
        matcher: ['/dashboard/:path*', '/en/products'],
      };
      ```

      This `matcher` limits the run to `/dashboard` with nested routes and to `/en/products`.

      | Action | What the browser sees |
      | --- | --- |
      | Redirect to `/login` | The address bar changes |
      | Rewrite of `/en/products` | The bar still shows `/en/products`, while another route serves the request internally |

      #### Phrase to recite

      Middleware runs before the route. The default is the Edge runtime, and the Node.js runtime for middleware arrived as an experiment in Next.js 15.2. It can redirect, rewrite, set headers, use cookies, pick a locale, run an A/B test, and do a coarse sign-in check. `matcher` limits the paths. Do not put heavy logic or database queries there. Authorization cannot stay only in middleware: the check belongs in the DAL next to the data. CVE-2025-29927 showed a middleware bypass through the `x-middleware-subrequest` header, so middleware is not the only protection layer.
  - id: "18"
    title: "Metadata API: metadata and generateMetadata"
    body: |
      #### Short answer

      The Metadata API manages the metadata of an HTML page. Search engines, the browser, and social networks use it to understand the page. `title` is the tab title and the search result title. `description` is the short search description. `openGraph` is the link-preview data. `robots` is the instruction for crawlers. `icons` are the site icons. Next.js turns these fields into the matching tags.

      When the metadata is known ahead of time and does not depend on the user or on a dynamic route, export a `metadata` object.

      When each page needs its own title, use the async function `generateMetadata({ params })`. `params` holds the dynamic route parameters. In current Next.js it is a Promise, so you read it with `await`. The function can load data on the server and return the metadata for that page.

      One segment cannot export both `metadata` and `generateMetadata`. Choose the object or the function. Both exports are supported in Server Components. They are not supported in a Client Component. If the page is interactive, keep the metadata in the server shell and move the interactive part into a separate Client Component.

      The same `fetch` with the same arguments in `generateMetadata` and in the page component can be deduplicated within one render. The second call does not necessarily go to the network. This reuses the result for that render. It is not a permanent store between visits. The arguments and the conditions of the request have to match. If the data is loaded through an ORM or another function, the behavior depends on that function's cache or memoization.

      `opengraph-image.tsx` generates the preview image for social networks and messengers. `sitemap.ts` generates an XML list of URLs that search engines can discover. That is useful when there are many dynamic pages. `robots.ts` generates crawler rules published at `/robots.txt`, including sections that should not be crawled. `robots.txt` by itself does not protect private data.

      The Metadata API helps produce the title, description, and Open Graph tags. Having metadata does not by itself guarantee a high search ranking.

      #### Code example

      ```tsx
      import type { Metadata } from 'next';

      export const metadata: Metadata = {
        title: 'My Shop',
        description: 'Discover our products',
      };

      export default function ProductsPage() {
        return <h1>Products</h1>;
      }
      ```

      A product page title depends on `id`. That same file does not also export the static `metadata` object.

      ```tsx
      import type { Metadata } from 'next';

      type Props = {
        params: Promise<{ id: string }>;
      };

      export async function generateMetadata({ params }: Props): Promise<Metadata> {
        const { id } = await params;
        const product = await getProduct(id);

        return {
          title: `${product.name} | My Shop`,
          description: product.description,
        };
      }
      ```

      If `getProduct` calls the same `fetch` and the page calls it again, Next.js can reuse the first result in that render.

      #### Phrase to recite

      Static metadata is `export const metadata`. Dynamic metadata is `generateMetadata({ params })`, and `params` is read with `await`. A segment exports only one of them, and only from a Server Component. The same `fetch` can be deduplicated between metadata and the page in one render. That is not a permanent cache. `opengraph-image.tsx`, `sitemap.ts`, and `robots.ts` cover the preview image, the sitemap, and the crawler rules. `robots.txt` does not by itself protect data.
  - id: "19"
    title: "next/image, next/font, and next/script"
    body: |
      #### Short answer

      `next/image`, `next/font`, and `next/script` are built-in Next.js tools for images, fonts, and third-party scripts.

      `next/image` adds optimization on top of showing a picture. It can serve a file of a suitable size instead of sending the huge original to every device. With the matching setup it can serve WebP or AVIF when the browser supports them. Ordinary images load as they approach the viewport, rather than all at once.

      `width` and `height` let the browser reserve space ahead of time. That reduces CLS, Cumulative Layout Shift: unexpected movement of elements while the page loads. If an image takes no space at first and then pushes the text down, the user sees a jump.

      `sizes` tells the browser the expected width for the screen size. An image can be full width on a phone and 800 pixels on a desktop. The browser picks a suitable file from the set. An adaptive image with `fill` and no `sizes` can make the browser pick a file that is too large.

      LCP, Largest Contentful Paint, measures the time until the largest visible element is shown. If that element is a large image at the top of the page, a late load hurts LCP. In Next.js versions that have the `priority` prop, use it to raise the priority of that image. In current versions the same job is recommended through `preload`, and only where preloading is actually needed. Do not give a high priority to every image.

      `next/font` loads a font and hosts its files on your own domain. Google fonts are downloaded at build time and served with the application, so the browser does not call Google Fonts while the site is running. `display: 'swap'` sets the behavior until the font has loaded. Suitable fallback metrics reduce the text shift when the font changes. That does not guarantee zero shift: if the fallback font differs a lot in its metrics, a shift is still possible. Files that already live in the project are loaded through `next/font/local`.

      `next/script` controls how third-party code loads: analytics, ads, a support widget, an SDK. Without that control the script occupies the main thread, slows interactivity, and hurts loading.

      `beforeInteractive` runs before the page's main interactivity is available. It is for scripts that truly need to run early, and those scripts belong in the root layout. `afterInteractive` runs after hydration starts and fits many ordinary third-party scripts. `lazyOnload` runs later, when the browser is idle, and fits non-critical widgets and analytics. Pick the strategy from what the script is for, not from a wish to load everything as early as possible.

      Images affect size, format, CLS, and LCP. Fonts affect external requests and the stability of text. Scripts affect loading and interactivity.

      #### Code example

      ```tsx
      import Image from 'next/image';

      export default function Product() {
        return (
          <Image
            src="/product.jpg"
            alt="Product"
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        );
      }
      ```

      An image that fills its container uses `fill` and still passes `sizes`.

      ```tsx
      import { Inter } from 'next/font/google';

      const inter = Inter({
        subsets: ['latin'],
        display: 'swap',
      });
      ```

      Put `inter.className` on `body` in the root layout.

      ```tsx
      import Script from 'next/script';

      export default function Page() {
        return (
          <Script src="https://example.com/widget.js" strategy="afterInteractive" />
        );
      }
      ```

      | Strategy | When it loads |
      | --- | --- |
      | `beforeInteractive` | Before the main interactivity. For scripts that truly need to run early. Place them in the root layout |
      | `afterInteractive` | After hydration starts. Ordinary third-party scripts |
      | `lazyOnload` | Later, while the browser is idle. Non-critical widgets and analytics |

      #### Phrase to recite

      `next/image` serves a suitable size and, when configured, modern formats. Ordinary images load lazily, and `width` and `height` reduce CLS. For an image that affects LCP, versions with `priority` raise its priority. Current versions recommend `preload` for that job, and only where it is needed. `sizes` keeps the browser from picking a file that is too large. `next/font` self-hosts fonts, including Google fonts, with no request to Google while the site is running, but it does not guarantee zero shift. `next/script` chooses `beforeInteractive`, `afterInteractive`, or `lazyOnload` according to how early the script is actually needed.
  - id: "20"
    title: "How do you handle errors and 404 in RSC?"
    body: |
      #### Short answer

      `error.tsx` is a Client Component. It must use `'use client'`, because it shows the error state and reruns the segment through `reset()`. The boundary catches an error in the child content of the segment and does not catch an error in the `layout.tsx` of that same segment. An error in the layout itself needs a boundary one level up.

      The `error` prop is the object the boundary caught. It can have a `digest`. In production Next.js may not send the client the original server error message or stack: the text can reveal internal structure, SQL details, service names, and other technical information. The client receives a generic message and a `digest`. The `digest` is an identifier for matching that error to the server logs. It is not the error text and it is not a way to fix the error. Do not rely on the full text or the stack.

      `reset()` asks to render that segment again. It is not a reset of the whole app and it does not fix the cause. If the cause is still there, the error happens again.

      `global-error.tsx` is for an error in the root layout that a normal `app/error.tsx` does not catch. It returns `<html>` and `<body>` itself, because the root layout is replaced by the fallback UI. It is also a Client Component with `error` and `reset`. It is not a stronger error boundary for every error.

      `not-found.tsx` covers two cases. The route does not exist, and Next shows the not-found UI. The route exists, but the data does not: calling `notFound()` from `next/navigation` stops rendering the segment and shows the matching not-found UI. For one shared UI you usually add `app/not-found.tsx`. Next can use the file at the matching segment level. `notFound()` also sets `noindex` for search engines.

      A 404 status is set when the response stage allows it. If streaming has already started, the status can stay 200 while the user still sees the 404 UI.

      An expected error is returned, not thrown. A bad email, a password that fails the rules, a product that is out of stock, or an operation that is not allowed is an ordinary result. Return it as a value from a Server Action, and the form shows that state. An unexpected failure is still thrown, and an error boundary catches it. Validating the form on the client does not remove the server check of the input and of the user's permissions.

      #### Code example

      ```tsx
      // app/dashboard/error.tsx
      'use client';

      import { useEffect } from 'react';

      export default function ErrorPage({
        error,
        reset,
      }: {
        error: Error & { digest?: string };
        reset: () => void;
      }) {
        useEffect(() => {
          console.error(error);
        }, [error]);

        return (
          <div>
            <h2>Something went wrong</h2>
            <button type="button" onClick={() => reset()}>
              Try again
            </button>
          </div>
        );
      }
      ```

      ```text
      app/
      ├── layout.tsx
      └── dashboard/
          ├── layout.tsx
          ├── error.tsx
          └── page.tsx
      ```

      `dashboard/error.tsx` handles an error in `dashboard/page.tsx` and is not meant for an error in `dashboard/layout.tsx`.

      ```tsx
      // app/global-error.tsx
      'use client';

      export default function GlobalError({
        error,
        reset,
      }: {
        error: Error & { digest?: string };
        reset: () => void;
      }) {
        return (
          <html>
            <body>
              <h1>Application error</h1>
              <button type="button" onClick={() => reset()}>
                Try again
              </button>
            </body>
          </html>
        );
      }
      ```

      ```tsx
      import { notFound } from 'next/navigation';

      export default async function ProductPage({
        params,
      }: {
        params: Promise<{ id: string }>;
      }) {
        const { id } = await params;
        const product = await getProduct(id);

        if (!product) {
          notFound();
        }

        return <h1>{product.name}</h1>;
      }
      ```

      A validation error comes back in the action's form state.

      ```tsx
      'use server';

      type FormState = {
        error?: string;
        success?: boolean;
      };

      export async function createProduct(
        _prevState: FormState,
        formData: FormData,
      ): Promise<FormState> {
        const name = formData.get('name');

        if (typeof name !== 'string' || !name.trim()) {
          return { error: 'Product name is required' };
        }

        return { success: true };
      }
      ```

      | File | What it catches |
      | --- | --- |
      | `error.tsx` | An error in the child content of its segment, not an error in the layout of that same segment |
      | `global-error.tsx` | An error in the root layout; it replaces the root UI and returns `html` and `body` itself |
      | `not-found.tsx` | A missing route, or `notFound()` when the data is missing |

      #### Phrase to recite

      `error.tsx` is a client boundary for the child segment: `reset()` renders again, but it does not fix the cause and it does not catch the layout at the same level. In production the client receives a `digest` for the logs, not the full server error text. `global-error.tsx` replaces the root layout and draws `html` and `body` itself. `notFound()` shows the 404 UI and sets `noindex`; the HTTP status is 404 only if the response has not already started streaming, otherwise the status can stay 200. Return an expected validation error as a value from a Server Action instead of throwing it.
  - id: "21"
    title: "How do you organize authentication in the App Router?"
    body: |
      #### Short answer

      The session is stored in a cookie. After sign-in the server sends it to the browser, for example `Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/`. `HttpOnly` stops JavaScript from reading the cookie through `document.cookie` and lowers the risk of session theft through XSS. `Secure` sends the cookie only over HTTPS. `SameSite=Lax` helps against CSRF. `Path=/` makes the cookie available for the site's paths. The cookie holds a server session id or a signed token. Server session data is usually stored in a database or another server store. `HttpOnly` does not stop every effect of XSS: a malicious script can still act as the user.

      Middleware does an optimistic check and a redirect. On `/dashboard` it looks for a session cookie and, without one, redirects to `/login`. A cookie being present does not prove the user is authenticated: the cookie can be expired, forged, or point at a deleted session. Middleware helps navigation and is not the only protection layer.

      The safe check lives in the DAL, the data access layer. `verifySession` reads the cookie on the server, finds the session in the store, and checks the expiry. Mark the module `server-only` so it cannot be imported into client code by accident. `React.cache` reuses the result for the same arguments within one server request. It is not a permanent session cache across requests. A real application also accounts for revocation, expiry, and the user's current permissions.

      Call `verifySession` at every protected entry: the page, the Server Action, and the Route Handler. A user can call an action or an API directly, past the interface and past middleware. Besides authentication, meaning who the user is, check authorization, meaning what they are allowed to do. A valid session for an ordinary user does not allow deleting someone else's account.

      Send the client a DTO, only the fields it needs. Do not send a password hash, secrets, internal tokens, or other private fields.

      Auth.js helps with OAuth sign-in, sessions, and other sign-in mechanisms. Your own sessions mean the server stores the session and the browser receives a random id in a cookie. A JWT is a signed token that can be checked without a store on every request, but revocation and expiry need a separate design. Do not write your own cryptography: use a proven library.

      Even if middleware is bypassed, the DAL still checks the session and the permissions before data is accessed.

      #### Code example

      ```ts
      import 'server-only';
      import { cache } from 'react';
      import { cookies } from 'next/headers';

      export const verifySession = cache(async () => {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('session')?.value;

        if (!sessionId) {
          return null;
        }

        const session = await getSessionFromDatabase(sessionId);

        if (!session || session.expiresAt < new Date()) {
          return null;
        }

        return {
          userId: session.userId,
          role: session.role,
        };
      });
      ```

      `getSessionFromDatabase` is the lookup in your own session store.

      ```tsx
      import { redirect } from 'next/navigation';

      export default async function DashboardPage() {
        const session = await verifySession();

        if (!session) {
          redirect('/login');
        }

        return <h1>Dashboard</h1>;
      }
      ```

      ```ts
      'use server';

      export async function updateProfile() {
        const session = await verifySession();

        if (!session) {
          throw new Error('Unauthorized');
        }
      }
      ```

      ```ts
      export async function GET() {
        const session = await verifySession();

        if (!session) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return Response.json({ userId: session.userId });
      }
      ```

      The server user can contain `passwordHash` and internal flags. The client receives a DTO, for example `id` and `email`.

      #### Phrase to recite

      Keep the session in an HttpOnly cookie with `Secure`, `SameSite=Lax`, and `Path=/`. Middleware only optimistically checks that the cookie exists and redirects. The reliable check is `verifySession` in the server DAL: `server-only` and `React.cache` for one request, not a cache across requests. Call it in the protected page, Server Action, and Route Handler, and check permission on the resource separately. The client receives a DTO without secrets. Auth.js, your own sessions, or a JWT can do the job. Do not write your own cryptography.
  - id: "22"
    title: "What is Turbopack, and what is new in Next.js 15?"
    body: |
      #### Short answer

      Turbopack is a JavaScript and TypeScript bundler from Vercel, written in Rust and aimed at large projects. In Next.js it can be used instead of Webpack. The command `next dev --turbo` in Next.js 15 starts the dev server with Turbopack. For development that mode is stable in 15: a faster server start and faster module updates through incremental builds. A dev build and a production build are different. For the production build in Next.js 15, Turbopack was not stable. This write-up does not record how the production status changed in later versions.

      Next.js 15 added support for React 19. Stable support shipped in Next.js 15.1. From React 19, this write-up names Actions, `useActionState`, `useOptimistic`, and improved forms and error handling.

      Some APIs that depend on the current HTTP request became async: `cookies()`, `headers()`, `draftMode()`, and also `params` and `searchParams`. You read them with `await`. That separates work that can be done ahead of time from work that depends on a specific user's request. The contract of `params` and `searchParams`, and the difference between a dynamic route and dynamic rendering, are covered in question 7. Here they are a Next.js 15 change, and this answer does not stop at a pointer to that question.

      In Next.js 15, some data that used to be cached by default is no longer cached on its own. `fetch()` does not cache the response by default. GET Route Handlers are not cached by default. The client Router Cache changed its default behavior for certain kinds of data and navigations. Caching in Next.js did not disappear: when you need it, you set it explicitly for the version and the job.

      `after()` from `next/server` runs secondary work after the response has already been sent: logs, analytics, events to outside systems. Without that, the work can delay the response. In early Next.js 15 the API was experimental and named `unstable_after`. In Next.js 15.1 it is stable and imported as `after`.

      `<Form>` from `next/form` extends the ordinary `form` element. On submit, Next.js can use client navigation and preload the target page, for example a search at `/search?query=react`. That is not the same thing as an ordinary `<form>`, and it is not the same thing as a Server Action.

      `instrumentation.ts` runs code when the server environment starts. The `register()` export is used to connect monitoring, for example OpenTelemetry. In Next.js 15 this API is stable.

      Next.js 15 added support for ESLint 9. That is a static-analysis tool for JavaScript and TypeScript. The change is about development and code quality, not about rendering the page.

      #### Code example

      ```tsx
      import { after } from 'next/server';

      export default function Page() {
        after(() => {
          console.log('Page was rendered');
        });

        return <h1>Hello</h1>;
      }
      ```

      ```tsx
      import Form from 'next/form';

      export default function SearchPage() {
        return (
          <Form action="/search">
            <input name="query" />
            <button type="submit">Search</button>
          </Form>
        );
      }
      ```

      | Change in Next.js 15 | What to remember |
      | --- | --- |
      | Turbopack | `next dev --turbo` is stable for dev. It was not stable for the version 15 production build |
      | React 19 | Support in 15, stable in 15.1. Actions, `useActionState`, `useOptimistic` |
      | Async Request APIs | `await` for `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` |
      | Cache defaults | `fetch` and GET Route Handlers are not cached by default. Set the cache explicitly |
      | `after()` | Secondary work after the response. Stable import since 15.1, previously `unstable_after` |
      | `<Form>` from `next/form` | Client navigation and prefetch of the target. This is not a Server Action |
      | `instrumentation.ts` | Stable `register()` for monitoring |
      | ESLint 9 | A development tool, not page rendering |

      #### Phrase to recite

      Turbopack is an incremental bundler written in Rust. In Next.js 15, `next dev --turbo` is stable for dev and was not stable for the production build. Next.js 15 also brought React 19, with stable support in 15.1, async request APIs such as `cookies()`, `headers()`, and `params`, and new cache defaults: `fetch` and GET Route Handlers are no longer cached on their own. `after()` runs work after the response and is stable since 15.1. `<Form>` from `next/form` improves navigation through a form. `instrumentation.ts` is stable for monitoring. ESLint 9 belongs to the development tools.
---

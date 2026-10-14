---
day: catalog
title: "Вопросы Next.js"
questions:
  - id: "5"
    title: "Специальные файлы App Router"
    body: |
      #### Короткий ответ

      В App Router специальные файлы задают страницы, навигацию, загрузку, ошибки и HTTP-обработчики. Next.js узнаёт файл по имени и подключает поведение сам.

      - `page.tsx` делает маршрут доступным. Папки совпадают с URL. По умолчанию это Server Component. Он может читать `params` и `searchParams` и ходить в серверные ресурсы. Общий layout он не задаёт.
      - `layout.tsx` оборачивает `children`. При обычной навигации внутри того же экземпляра layout не перемонтируется, поэтому состояние оболочки обычно сохраняется. Повторный рендер при этом возможен: фраза «layout вообще не перерендеривается» неверна. Layout по умолчанию серверный.
      - У дочерней страницы может быть свой `layout.tsx`. Оболочки складываются: `/dashboard/settings` получает корневой layout, layout dashboard и layout settings. Вложенный layout родительский не отменяет.
      - Отдельная оболочка без родительского layout — это отдельные корневые layouts через route groups. Полный разбор групп — вопрос 6. Переход между разными корневыми layouts — полная загрузка документа, не обычная клиентская навигация. Если общий `app/layout.tsx` уже есть, группы остаются вложенными в него.
      - `template.tsx` тоже оборачивает `children`, но создаёт новый экземпляр, когда меняется соответствующий сегмент. Это не любая навигация в приложении. При перемонтировании сбрасывается локальное состояние, заново бегут эффекты и заново создаётся DOM. Template нужен для анимации входа, сброса состояния и логики на mount. Без причины его не ставят вместо layout. Состояние родительского layout при этом может сохраниться. Сброс одного маленького компонента чаще делают через `key`. Полное разделение оболочек сайта — route groups, не template.
      - `loading.tsx` — fallback сегмента, по смыслу граница React Suspense, но не буквальная обёртка всего приложения в один JSX. Это skeleton, spinner или placeholder. Он не покрывает любое ожидание: зависят границы Suspense, сегмент, способ навигации и момент, когда fallback вообще можно показать. Уже показанный layout может оставаться на экране.
      - `route.ts` экспортирует функции HTTP-методов и возвращает `Response`, не JSX страницы. Обрабатываются только экспортированные методы. `page.tsx` и `route.ts` в одном сегменте конфликтуют.
      - На маршруте вроде `/dashboard/settings` файлы не исполняются все сразу. Успех показывает `page`. Ожидание асинхронного содержимого может показать `loading`. Перехваченная ошибка сегмента показывает `error`. `notFound()` показывает not-found UI.
      - `generateStaticParams()` заранее задаёт параметры динамических маршрутов для статической генерации. Чем статический рендеринг отличается от динамического, разобрано в вопросе 7.
      - Роли `error.tsx`, `global-error.tsx` и `not-found.tsx` здесь только названы. Как обрабатывать ошибки и 404, разобрано в вопросе 20, и тот ответ не сводится к отсылке сюда.

      Server Component и Client Component живут на одном экране. RSC выполняется на сервере, не обрабатывает браузерные события и не означает, что клик уходит на сервер. Локальный `setState` обновляет UI в браузере без запроса. Запрос нужен, когда данные надо сохранить на сервере: `fetch` к Route Handler, Server Action или другой уже существующий серверный механизм. Server Action — это сетевой вызов. В реальном коде нужны ошибки, состояние загрузки и проверка прав на сервере. Обновить серверные данные интерфейса можно через `revalidatePath()` или `revalidateTag()`, если сценарий этого требует.

      Первое открытие URL обычно рендерится на сервере: HTML и RSC payload. JavaScript клиентских компонентов грузится отдельно. Обращение к базе из серверного кода — вызов драйвера, не обязательно отдельный HTTP-запрос приложения. Клиентский переход через ссылку App Router обычно запрашивает RSC payload нового маршрута и не обязан заново загружать весь HTML-документ. Сохраняющиеся layouts обычно остаются. Prefetch и кеш могут снять повторное выполнение. Повторный рендер уже загруженного Client Component сам по себе Server Component не выполняет. Запрос к базе из Server Component повторяется, когда Next снова выполняет этот компонент и результат не переиспользован кешем.

      #### Пример кода

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
            {favorite ? 'в избранном' : 'добавить'}
          </button>
        );
      }
      ```

      Клик по этой кнопке меняет состояние в браузере. Чтобы сохранить избранное на сервере, из Client Component вызывают Server Action:

      ```tsx
      // app/products/actions.ts
      'use server';

      export async function toggleFavorite(productId: string) {
        // Проверить пользователя и записать изменение.
      }
      ```

      `page.tsx` динамического маршрута в актуальном App Router ждёт `params`. Зачем API стал асинхронным, разобрано в вопросе 7.

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

      | Свойство | layout.tsx | template.tsx |
      | --- | --- | --- |
      | Общая оболочка | Да | Да |
      | Экземпляр при навигации внутри сегмента | Обычно сохраняется | Новый, когда меняется экземпляр сегмента |
      | Локальное состояние | Может сохраняться | Сбрасывается при перемонтировании |
      | Эффекты | Не обязаны запускаться заново при каждой навигации | Запускаются заново при перемонтировании |
      | Назначение | Постоянный интерфейс | Оболочка с новым жизненным циклом |

      | Действие | Нужен сетевой запрос? |
      | --- | --- |
      | `setState` в Client Component | Нет |
      | Клик, который меняет только локальный UI | Нет |
      | Вызов Server Action | Да |
      | `fetch('/api/...')` | Да |
      | Первое открытие страницы | Обычно да, к серверу приложения |
      | Переход на новый RSC-маршрут | Обычно запрашивается payload маршрута; возможны prefetch и кеш |
      | Повторный рендер уже загруженного Client Component | Не обязательно |

      #### Фраза на автомате

      Специальные файлы App Router — это имена, которые Next сам включает в маршрут: `page` рисует UI, `layout` обычно сохраняет экземпляр, `template` перемонтируется при смене сегмента, `loading` — fallback Suspense сегмента, `route` отвечает HTTP. RSC не отправляет каждый клик на сервер: локальный `setState` остаётся в браузере, а Server Action и `fetch` идут в сеть.

      `middleware.ts`, а в новых версиях Next.js ещё и развивающаяся модель `proxy.ts`, — это логика до обработки маршрута, не UI-файл сегмента. `generateMetadata()` задаёт метаданные страницы, например title и description.
  - id: "6"
    title: "Route groups, parallel и intercepting routes"
    body: |
      #### Короткий ответ

      Это три разных механизма. Route group организует файлы и layouts и не попадает в URL. Parallel route показывает несколько ветвей UI в одном layout через слоты `@`. Intercepting route показывает существующий маршрут в контексте текущей навигации, например фото в модалке при переходе из галереи и полную страницу при прямом открытии того же URL.

      `(group)` не создаёт маршрут и не заменяет авторизацию. Две группы с одним и тем же URL конфликтуют. Если общего `app/layout.tsx` нет, layout группы может быть корневым и обязан вернуть `<html>` и `<body>`. Если общий корневой layout есть, layouts групп вложены в него.

      `@slot` — именованный слот, не сегмент URL. Next передаёт его в layout как prop рядом с `children`. У слота могут быть свои `loading.tsx` и `error.tsx`. Это не абсолютная изоляция всех серверных операций и не гарантия, что запросы к данным выполнятся параллельно. Parallel routes организуют независимые ветви интерфейса. Параллельное выполнение запросов зависит ещё и от кода загрузки данных.

      `default.tsx` — запасной UI слота, когда при прямом открытии или полной перезагрузке нельзя восстановить его активное состояние. Это не экран загрузки. Для загрузки нужен `loading.tsx`. При клиентской навигации Next может сохранять активное содержимое слота, даже если URL его не отражает.

      Intercepting route не рисует модалку сам. Её собирают в UI слота. Обозначения считаются по сегментам URL, не по папкам `@slot`.

      | Обозначение | Значение |
      | --- | --- |
      | `(.)` | Текущий уровень маршрута |
      | `(..)` | На один уровень выше |
      | `(..)(..)` | На два уровня выше |
      | `(...)` | От корня `app` |

      Soft navigation перехватывает переход и может показать тот же URL в другом контексте, например фото поверх списка. Hard navigation — вставка URL или обновление страницы — показывает полную страницу. URL при этом настоящий, его можно скопировать. Сам адрес не означает, что интерфейс всегда модальный.

      #### Пример кода

      ```text
      app/
      ├── (public)/
      │   ├── layout.tsx
      │   └── page.tsx
      └── (private)/
          ├── layout.tsx
          └── dashboard/page.tsx
      ```

      Имена в скобках не входят в URL: `/` использует public layout, `/dashboard` — private layout.

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

      Слоты лежат в `app/dashboard/@analytics` и `app/dashboard/@notifications`. У каждого могут быть свои `page.tsx`, `loading.tsx` и `error.tsx`.

      ```tsx
      // app/dashboard/@analytics/default.tsx
      export default function DefaultAnalytics() {
        return null;
      }
      ```

      Модалка поверх галереи:

      ```text
      app/photos/
      ├── layout.tsx
      ├── page.tsx
      ├── [id]/page.tsx
      └── @modal/
          ├── default.tsx
          └── (.)[id]/page.tsx
      ```

      `(.)[id]` перехватывает `/photos/[id]` на том же уровне. `default.tsx` слота может вернуть `null`, когда модалки нет. Layout рисует `{children}` и `{modal}`.

      #### Фраза на автомате

      Route group не попадает в URL и не проверяет доступ. `@slot` — отдельная ветвь UI со своими loading и error, а `default.tsx` подставляет слот, когда его состояние нельзя восстановить. Intercepting route при soft navigation показывает маршрут в текущем контексте, а при hard navigation того же URL — полную страницу. Уровни `(.)`, `(..)` и `(...)` считаются по сегментам URL.
  - id: "7"
    title: "Что изменилось в Next.js 15 с params и searchParams?"
    body: |
      #### Короткий ответ

      В Next.js 15 `params` и `searchParams` стали Promise. В Server Component их читают через `await`. В Client Component Promise-проп разворачивают через `React.use()`, а не через `async`-компонент и не через `useEffect` как замену рендера. Если Promise ещё не разрешён, `use()` может приостановить рендер, поэтому компоненту нужен подходящий Suspense.

      `await` здесь из-за контракта API. Уже разрешённый Promise не означает долгое ожидание и не означает сетевой запрос. Так Next лучше управляет динамическими данными запроса и не заставляет рендеринг ждать их там, где они ещё не нужны.

      `params` — сегменты URL. `searchParams` — query string. Значения query обычно строки: `page` будет `"2"`, а не числом `2`. Число преобразуют явно и проверяют. Чтение query может лишить маршрут статического рендеринга.

      `cookies()`, `headers()` и `draftMode()` из `next/headers` тоже вызываются через `await`. Они серверные и не предназначены для произвольного Client Component. Их использование может сделать рендер динамическим, потому что ответ зависит от конкретного запроса.

      В Next.js 15 был переходный период: синхронный доступ ещё мог работать с предупреждением. В актуальном коде пишут асинхронный API. То же учитывают в `generateMetadata`, `generateStaticParams` и Route Handler: `params` там тоже Promise.

      Динамический рендеринг — страница собирается на сервере во время запроса, а не целиком заранее на сборке. Статический рендеринг готовит результат на сборке и позволяет его переиспользовать. `async` сам по себе страницу динамической не делает.

      Динамический маршрут (`[id]`) и динамический рендеринг — разные вещи. `[id]` может быть статически сгенерирован через `generateStaticParams()`. Обычный `/profile` может быть динамическим из-за `cookies()`.

      Динамический рендеринг не означает, что каждый запрос заново идёт в базу. Рендер страницы, кеш данных и кеш готового результата — разные механизмы. Даже при динамическом рендеринге часть данных может браться из кеша. Статический результат обычно меньше нагружает сервер, его можно отдать с CDN и проще масштабировать, когда содержимое общее. Динамический нужен, когда ответ зависит от конкретного запроса: авторизация, cookies, персональные данные.

      #### Пример кода

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

      | Контекст | Как читать |
      | --- | --- |
      | Server Component `page.tsx` | `await params` |
      | Server Component `layout.tsx` | `await params` |
      | `searchParams` | `await searchParams` |
      | Client Component с Promise-пропом | `use(params)` |
      | `cookies()` | `await cookies()` |
      | `headers()` | `await headers()` |
      | `draftMode()` | `await draftMode()` |

      | Понятие | Пример | Что означает |
      | --- | --- | --- |
      | Динамический маршрут | `app/products/[id]/page.tsx` | В URL есть параметр |
      | Динамический рендеринг | Страница читает `cookies()` | HTML собирается во время запроса |
      | Статический рендеринг | Страница собрана на `next build` | Готовый результат можно переиспользовать |

      Страница товаров с `fetch` и `next: { revalidate: 3600 }` не становится динамической только из-за `async`. Если остальные условия позволяют, Next может собрать её заранее и обновлять данные по политике кеша.

      #### Фраза на автомате

      В актуальном App Router `params` и `searchParams` — Promise: на сервере `await`, в клиенте `use()`. `cookies()`, `headers()` и `draftMode()` тоже асинхронные и могут сделать рендер динамическим, потому что ответ зависит от запроса. Динамический маршрут `[id]` — это не то же самое, что динамический рендеринг, а `await` здесь не означает сетевой запрос.
  - id: "17"
    title: "Middleware: что умеет и чего не стоит делать?"
    body: |
      #### Короткий ответ

      Middleware — код, который выполняется до того, как запрос попадёт к конечному обработчику. Он решает, что сделать с запросом, и не заменяет основную бизнес-логику приложения.

      По умолчанию middleware работает в Edge runtime. Это облегчённая среда, рассчитанная на быстрые операции рядом с пользователем. Она поддерживает не все API Node.js. В Next.js 15.2 появилась экспериментальная поддержка Node.js runtime для middleware. В более новых версиях возможности и названия могли измениться.

      Middleware умеет сделать redirect и rewrite, изменить заголовки запроса или ответа, прочитать или записать cookies, определить язык и направить на локализованную страницу, выбрать вариант для A/B-теста и выполнить грубую проверку авторизации.

      Redirect заставляет браузер перейти на другой URL, адрес в строке меняется. Неавторизованный пользователь открывает `/dashboard` и попадает на `/login`. Rewrite внутренне обслуживает запрос другим маршрутом, а URL в браузере остаётся прежним. Пользователь открывает `/en/products`, а приложение отдаёт содержимое другого маршрута.

      `matcher` задаёт URL, для которых middleware запускается. Если он нужен только личному кабинету, его не выполняют на каждой странице сайта.

      Тяжёлую бизнес-логику, сложные вычисления и запросы к базе в middleware не кладут, если без них можно обойтись. Он может выполняться на каждом подходящем запросе, лишняя работа увеличивает задержку ответа, а тяжёлые зависимости могут не подходить runtime. Проверить наличие токена в cookie — подходящая задача. Загрузить десятки связанных сущностей и выполнить всю проверку прав — обычно нет.

      Авторизацию нельзя проверять только в middleware. Данные могут запрашиваться через отдельные API, Server Actions и другие маршруты. Ошибка конфигурации или уязвимость middleware обходит проверку страницы. Даже авторизованный пользователь не обязательно имеет право читать чужие данные. Проверку выполняют на сервере там, где данные извлекают или изменяют, в Data Access Layer.

      CVE-2025-29927, раскрытая в марте 2025 года, при определённых условиях и в определённых версиях Next.js позволяла обойти проверку авторизации в middleware специально сформированным заголовком `x-middleware-subrequest`. Выходили исправленные версии. Middleware нельзя считать единственным уровнем защиты: нужна исправленная версия Next.js и проверка прав непосредственно у защищённых данных.

      #### Пример кода

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

      `matcher` здесь ограничивает запуск путями `/dashboard` с вложенными маршрутами и `/en/products`.

      | Действие | Что видит браузер |
      | --- | --- |
      | Redirect на `/login` | Адрес в строке меняется |
      | Rewrite `/en/products` | В строке остаётся `/en/products`, внутри обслуживается другой маршрут |

      #### Фраза на автомате

      Middleware выполняется до маршрута. По умолчанию это Edge runtime, а Node.js runtime для него появился как эксперимент в Next.js 15.2. Он умеет redirect, rewrite, заголовки, cookies, локаль, A/B и грубую проверку входа, а `matcher` ограничивает пути. Тяжёлую логику и запросы к базе туда не кладут. Авторизацию нельзя оставлять только в middleware: проверка нужна в DAL рядом с данными. CVE-2025-29927 показала обход middleware заголовком `x-middleware-subrequest`, поэтому это не единственный уровень защиты.
  - id: "18"
    title: "Metadata API: metadata и generateMetadata"
    body: |
      #### Короткий ответ

      Metadata API управляет метаданными HTML-страницы. По ним поисковые системы, браузер и социальные сети понимают страницу. `title` — заголовок вкладки и результата поиска. `description` — краткое описание для поиска. `openGraph` — данные предпросмотра ссылки. `robots` — инструкции роботам. `icons` — значки сайта. Next.js собирает из этих полей соответствующие теги.

      Если метаданные известны заранее и не зависят от пользователя или динамического маршрута, экспортируют объект `metadata`.

      Если у каждой страницы свой заголовок, используют асинхронную `generateMetadata({ params })`. `params` содержит параметры динамического маршрута. В актуальном Next.js это Promise, его читают через `await`. Функция может получить данные с сервера и вернуть метаданные конкретной страницы.

      В одном сегменте нельзя экспортировать и `metadata`, и `generateMetadata`. Выбирают объект или функцию. Оба экспорта поддерживаются в Server Components. В Client Component их нет. Если страница интерактивная, метаданные оставляют в серверной оболочке, а интерактивную часть выносят в отдельный Client Component.

      Одинаковый `fetch` с теми же аргументами в `generateMetadata` и в компоненте страницы Next.js может дедуплицировать в рамках одного рендера. Второй такой запрос не обязательно уходит в сеть. Это повторное использование результата в соответствующем рендере, а не постоянное хранение между визитами. Аргументы и условия запроса должны совпадать. Если данные загружают через ORM или другую функцию, поведение зависит от её кеша или мемоизации.

      `opengraph-image.tsx` генерирует картинку предпросмотра для соцсетей и мессенджеров. `sitemap.ts` генерирует XML-карту URL, которые поисковые системы могут обнаружить. Это полезно, когда динамических страниц много. `robots.ts` генерирует правила для роботов по адресу `/robots.txt`, в том числе разделы, которые не следует обходить. Сам `robots.txt` не защищает приватные данные.

      Metadata API помогает сформировать заголовок, описание и Open Graph. Само наличие метаданных не гарантирует высокие позиции в поиске.

      #### Пример кода

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

      Для страницы товара заголовок зависит от `id`. В том же файле статический `metadata` уже не экспортируют.

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

      Если `getProduct` внутри вызывает один и тот же `fetch` и страница вызывает его ещё раз, Next.js может взять результат первого вызова в этом рендере.

      #### Фраза на автомате

      Статические метаданные — это `export const metadata`. Динамические — `generateMetadata({ params })`, где `params` читают через `await`. В одном сегменте экспортируют что-то одно, и только из Server Component. Одинаковый `fetch` может дедуплицироваться между метаданными и страницей в одном рендере, это не постоянный кеш. `opengraph-image.tsx`, `sitemap.ts` и `robots.ts` закрывают картинку предпросмотра, карту сайта и правила роботов. `robots.txt` сам по себе данные не защищает.
  - id: "19"
    title: "next/image, next/font и next/script"
    body: |
      #### Короткий ответ

      `next/image`, `next/font` и `next/script` — встроенные инструменты Next.js для изображений, шрифтов и сторонних скриптов.

      `next/image` добавляет оптимизацию поверх показа картинки. Он может отдать файл подходящего размера, а не огромный оригинал всем устройствам. При соответствующей настройке может отдать WebP или AVIF, если браузер их поддерживает. Обычные изображения загружаются по мере приближения к области видимости, а не все сразу.

      `width` и `height` позволяют браузеру заранее зарезервировать место. Это уменьшает CLS, Cumulative Layout Shift: неожиданные сдвиги элементов во время загрузки. Если картинка сначала не занимает места, а потом сдвигает текст, пользователь видит скачок.

      `sizes` сообщает браузеру предполагаемую ширину в зависимости от экрана. Картинка может занимать всю ширину на мобильном и 800 пикселей на десктопе. Браузер выбирает подходящий файл из набора. У адаптивной картинки с `fill` без `sizes` браузер может выбрать слишком большой файл.

      LCP, Largest Contentful Paint, измеряет время до самого крупного видимого элемента. Если это большая картинка в верхней части страницы, поздняя загрузка ухудшает LCP. В версиях Next.js, где есть проп `priority`, им поднимают приоритет такой картинки. В современных версиях для этой задачи рекомендуют `preload`, и только там, где предварительная загрузка действительно нужна. Высокий приоритет всем изображениям подряд не назначают.

      `next/font` подключает шрифт и размещает его файлы на своём домене. Шрифты Google загружаются на этапе сборки и отдаются вместе с приложением, поэтому во время работы сайта браузер не обращается к Google Fonts. `display: 'swap'` задаёт поведение, пока шрифт ещё не загрузился. Подходящие резервные метрики уменьшают сдвиг текста при смене шрифта. Полного отсутствия сдвига это не гарантирует: если резервный шрифт сильно отличается по метрикам, сдвиг всё ещё возможен. Файлы, которые уже лежат в проекте, подключают через `next/font/local`.

      `next/script` управляет загрузкой стороннего кода: аналитика, реклама, виджет поддержки, SDK. Без контроля такой скрипт занимает главный поток, замедляет интерактивность и ухудшает загрузку.

      `beforeInteractive` выполняется до того, как основная интерактивность страницы станет доступна. Это для скриптов, которым действительно нужно раннее выполнение, и их размещают в корневом layout. `afterInteractive` выполняется после начала гидратации и подходит многим обычным сторонним скриптам. `lazyOnload` выполняется позже, когда браузер простаивает, и подходит некритичным виджетам и аналитике. Стратегию выбирают по назначению скрипта, а не из желания загрузить всё как можно раньше.

      Картинки влияют на размер, формат, CLS и LCP. Шрифты влияют на внешние запросы и стабильность текста. Скрипты влияют на загрузку и интерактивность.

      #### Пример кода

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

      Для картинки на весь контейнер используют `fill` и обязательно передают `sizes`.

      ```tsx
      import { Inter } from 'next/font/google';

      const inter = Inter({
        subsets: ['latin'],
        display: 'swap',
      });
      ```

      Класс `inter.className` вешают на `body` в корневом layout.

      ```tsx
      import Script from 'next/script';

      export default function Page() {
        return (
          <Script src="https://example.com/widget.js" strategy="afterInteractive" />
        );
      }
      ```

      | Стратегия | Когда загружается |
      | --- | --- |
      | `beforeInteractive` | До основной интерактивности. Для скриптов, которым правда нужно раннее выполнение. Размещают в корневом layout |
      | `afterInteractive` | После начала гидратации. Обычные сторонние скрипты |
      | `lazyOnload` | Позже, в простое браузера. Некритичные виджеты и аналитика |

      #### Фраза на автомате

      `next/image` отдаёт подходящий размер и при настройке современные форматы, обычные картинки грузит лениво, а `width` и `height` уменьшают CLS. Для картинки, которая влияет на LCP, в версиях с `priority` поднимают приоритет, в современных версиях для этого рекомендуют `preload`, и только где он нужен. `sizes` не даёт браузеру взять слишком большой файл. `next/font` self-host'ит шрифты, в том числе Google Fonts, без запроса к Google во время работы сайта, но нулевой сдвиг не гарантирует. `next/script` выбирает `beforeInteractive`, `afterInteractive` или `lazyOnload` по тому, насколько рано скрипт действительно нужен.
  - id: "20"
    title: "Как обрабатывать ошибки и 404 в RSC?"
    body: |
      #### Короткий ответ

      `error.tsx` — Client Component. Он обязателен с `'use client'`, потому что показывает состояние ошибки и заново запускает сегмент через `reset()`. Граница ловит ошибку дочернего содержимого сегмента и не ловит ошибку `layout.tsx` того же сегмента. Для ошибки самого layout нужна граница уровнем выше.

      Проп `error` — объект, который поймала boundary. У него может быть `digest`. В production Next.js может не отдать клиенту исходное сообщение и stack серверной ошибки: текст может раскрыть внутреннюю структуру, детали SQL, имена сервисов и другую техническую информацию. Клиент получает обобщённое сообщение и `digest`. `digest` — идентификатор, чтобы сопоставить эту ошибку с серверными логами. Это не текст ошибки и не способ её исправить. На полный текст и stack полагаться нельзя.

      `reset()` просит повторить рендер соответствующего сегмента. Это не сброс всего приложения и не исправление причины. Если причина осталась, ошибка возникнет снова.

      `global-error.tsx` нужен для ошибки корневого layout, которую не берёт обычный `app/error.tsx`. Он сам возвращает `<html>` и `<body>`, потому что корневой layout в этом случае заменён fallback-интерфейсом. Это тоже Client Component с `error` и `reset`. Это не более сильный error boundary для любой ошибки.

      `not-found.tsx` покрывает два случая. Маршрут не существует, и Next показывает not-found UI. Маршрут существует, но данных нет: вызов `notFound()` из `next/navigation` прерывает рендер сегмента и показывает подходящий not-found UI. Для единого UI обычно создают `app/not-found.tsx`. Next может взять файл на подходящем уровне сегмента. `notFound()` также ставит `noindex` для поисковых систем.

      Статус 404 ставится, когда стадия ответа это позволяет. Если streaming уже начался, статус может остаться 200, а пользователь всё равно видит интерфейс 404.

      Ожидаемую ошибку не бросают. Неверный email, пароль, который не проходит требования, закончившийся товар или недопустимая операция — обычный результат работы. Его возвращают значением из Server Action, и форма показывает это состояние. Неожиданный сбой по-прежнему бросают, и его ловит граница ошибки. Проверка формы на клиенте не отменяет повторную проверку ввода и прав на сервере.

      #### Пример кода

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

      `dashboard/error.tsx` обрабатывает ошибку `dashboard/page.tsx` и не предназначен для ошибки `dashboard/layout.tsx`.

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

      Ошибку валидации action возвращает в состоянии формы.

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

      | Файл | Что перехватывает |
      | --- | --- |
      | `error.tsx` | Ошибку дочернего содержимого своего сегмента, не ошибку layout того же сегмента |
      | `global-error.tsx` | Ошибку корневого layout и заменяет корневой UI, сам возвращает `html` и `body` |
      | `not-found.tsx` | Несуществующий маршрут или `notFound()`, когда данных нет |

      #### Фраза на автомате

      `error.tsx` — клиентская граница дочернего сегмента: `reset()` повторяет рендер, но не чинит причину и не ловит layout того же уровня. В production клиенту приходит `digest` для поиска в логах, а не полный текст серверной ошибки. `global-error.tsx` заменяет корневой layout и сам рисует `html` и `body`. `notFound()` показывает 404 UI и ставит `noindex`; HTTP-статус будет 404, только если ответ ещё не ушёл в streaming, иначе статус может остаться 200. Ожидаемую ошибку валидации возвращают значением из Server Action, а не бросают.
  - id: "21"
    title: "Как организовать аутентификацию в App Router?"
    body: |
      #### Короткий ответ

      Сессию хранят в cookie. После входа сервер отправляет её браузеру, например `Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/`. `HttpOnly` не даёт JavaScript прочитать cookie через `document.cookie` и снижает риск кражи сессии через XSS. `Secure` передаёт cookie только по HTTPS. `SameSite=Lax` помогает защищаться от CSRF. `Path=/` делает cookie доступной для путей сайта. В cookie лежит идентификатор серверной сессии или подписанный токен. Данные серверной сессии обычно хранят в базе или другом серверном хранилище. `HttpOnly` не защищает от всех последствий XSS: вредоносный скрипт всё ещё может выполнять действия от имени пользователя.

      Middleware делает оптимистичную проверку и redirect. На `/dashboard` он смотрит, есть ли сессионная cookie, и без неё перенаправляет на `/login`. Наличие cookie ещё не доказывает, что пользователь авторизован: cookie может быть просрочена, подделана или указывать на удалённую сессию. Middleware помогает с навигацией и не является единственным уровнем защиты.

      Безопасная проверка живёт в DAL, слое доступа к данным. `verifySession` на сервере читает cookie, находит сессию в хранилище и проверяет срок. Модуль помечают `server-only`, чтобы его нельзя было случайно импортировать в клиентский код. `React.cache` переиспользует результат при одинаковых аргументах в рамках одного серверного запроса. Это не постоянный кеш сессий между запросами. В реальном приложении учитывают отзыв сессии, срок действия и актуальные права.

      `verifySession` вызывают в каждой защищённой точке: страница, Server Action и Route Handler. Пользователь может обратиться к action или API напрямую, минуя интерфейс и middleware. Кроме аутентификации, то есть кто это, проверяют авторизацию, то есть что ему разрешено. Действительная сессия обычного пользователя не даёт удалить чужой аккаунт.

      На клиент передают DTO, только нужные поля. Хеш пароля, секреты, внутренние токены и другие закрытые поля не передают.

      Auth.js помогает организовать вход через OAuth, сессии и другие механизмы. Свои сессии означают, что сервер хранит сессию, а браузер получает случайный идентификатор в cookie. JWT — подписанный токен, его можно проверить без обращения к хранилищу на каждом запросе, но отзыв и срок требуют отдельного решения. Свою криптографию не пишут: берут проверенные библиотеки.

      Даже если middleware обойдут, DAL всё равно проверяет сессию и права перед доступом к данным.

      #### Пример кода

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

      `getSessionFromDatabase` — обращение к своему хранилищу сессий.

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

      Серверный пользователь может содержать `passwordHash` и внутренние флаги. На клиент уходит только DTO, например `id` и `email`.

      #### Фраза на автомате

      Сессию держат в HttpOnly cookie с `Secure`, `SameSite=Lax` и `Path=/`. Middleware только оптимистично проверяет наличие cookie и делает redirect. Надёжная проверка — `verifySession` в серверном DAL: `server-only` и `React.cache` на один запрос, не кеш между запросами. Её вызывают в защищённой странице, Server Action и Route Handler и отдельно проверяют права на ресурс. На клиент уходит DTO без секретов. Подойдут Auth.js, свои сессии или JWT. Свою криптографию не пишут.
  - id: "22"
    title: "Что такое Turbopack и что нового в Next.js 15?"
    body: |
      #### Короткий ответ

      Turbopack — сборщик JavaScript и TypeScript от Vercel, написанный на Rust и рассчитанный на большие проекты. В Next.js он может использоваться вместо Webpack. Команда `next dev --turbo` в Next.js 15 запускает dev-сервер с Turbopack. Для разработки этот режим в 15 стабилен: быстрее старт сервера и обновление модулей за счёт инкрементальной сборки. Dev-сборка и production-сборка — разное. Для production-сборки в Next.js 15 Turbopack стабильным не был. Как изменился статус production в более поздних версиях, этот разбор не фиксирует.

      Next.js 15 добавил поддержку React 19. Стабильная поддержка вышла в Next.js 15.1. В этом разборе из React 19 названы Actions, `useActionState`, `useOptimistic` и улучшенная работа с формами и обработкой ошибок.

      Часть API, которые зависят от текущего HTTP-запроса, стали асинхронными: `cookies()`, `headers()`, `draftMode()`, а также `params` и `searchParams`. Их читают через `await`. Так отделяют работу, которую можно выполнить заранее, от работы конкретного запроса пользователя. Контракт `params`, `searchParams` и отличие динамического маршрута от динамического рендеринга подробно разобраны в вопросе 7. Здесь это пункт изменений Next.js 15, и ответ не заменяется отсылкой туда.

      В Next.js 15 часть данных, которые раньше кешировались по умолчанию, больше не кешируется сама. `fetch()` не кеширует ответ по умолчанию. GET Route Handlers не кешируются по умолчанию. У клиентского Router Cache изменилось поведение по умолчанию для определённых типов данных и переходов. Кеширование в Next.js не исчезло: если оно нужно, его задают явно под версию и задачу.

      `after()` из `next/server` выполняет второстепенную работу после того, как ответ уже отправлен: логи, аналитика, события во внешние системы. Без этого такая работа может задержать ответ. В раннем Next.js 15 API был экспериментальным и назывался `unstable_after`. В Next.js 15.1 он стабилен и импортируется как `after`.

      `<Form>` из `next/form` расширяет обычный элемент `form`. При отправке Next.js может использовать клиентскую навигацию и предварительную загрузку целевой страницы, например поиска на `/search?query=react`. Это не то же самое, что обычный `<form>`, и не то же самое, что Server Action.

      `instrumentation.ts` запускает код при инициализации серверного окружения. Экспорт `register()` используют, чтобы подключить мониторинг, например OpenTelemetry. В Next.js 15 этот API стабилен.

      Next.js 15 добавил поддержку ESLint 9. Это инструмент статического анализа JavaScript и TypeScript. Изменение касается разработки и качества кода, а не рендеринга страницы.

      #### Пример кода

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

      | Изменение в Next.js 15 | Что запомнить |
      | --- | --- |
      | Turbopack | `next dev --turbo` стабилен для dev. Для production-сборки 15 стабильным не был |
      | React 19 | Поддержка в 15, стабильная в 15.1. Actions, `useActionState`, `useOptimistic` |
      | Async Request APIs | `await` для `cookies()`, `headers()`, `draftMode()`, `params` и `searchParams` |
      | Дефолты кеша | `fetch` и GET Route Handler не кешируются по умолчанию. Кеш задают явно |
      | `after()` | Второстепенная работа после ответа. Стабильный импорт с 15.1, раньше `unstable_after` |
      | `<Form>` из `next/form` | Клиентская навигация и prefetch цели. Это не Server Action |
      | `instrumentation.ts` | Стабильный `register()` для мониторинга |
      | ESLint 9 | Инструмент разработки, не рендеринг страницы |

      #### Фраза на автомате

      Turbopack — инкрементальный сборщик на Rust. В Next.js 15 `next dev --turbo` стабилен для dev и не был стабилен для production-сборки. Вместе с этим в 15 пришли React 19 со стабильной поддержкой в 15.1, асинхронные request API вроде `cookies()`, `headers()` и `params`, и новые дефолты кеша: `fetch` и GET Route Handlers сами больше не кешируются. `after()` делает работу после ответа и стабилен с 15.1. `<Form>` из `next/form` улучшает навигацию через форму. `instrumentation.ts` стабилен для мониторинга. ESLint 9 относится к инструментам разработки.
---

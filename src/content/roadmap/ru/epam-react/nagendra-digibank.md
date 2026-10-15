---
interview: nagendra-digibank
order: 7
title: "Nagendra Burra — DigiBank"
candidate: Nagendra Burra
interviewer: "Srujan Dasa, Soumya Ranjan Mishra"
initiative: DigiBank
questions:
  - id: nagendra-digibank.1a
    label: "1a"
    topic: "Знакомство и опыт по проектам"
    title: "Расскажи о себе и опыте работы."
    body: |
      #### Короткий ответ

      Каркас на одну-две минуты. Четыре слота, и все четыре ты заполняешь из своего резюме: роль, стек, один проект, один измеримый результат. Имя человека, годы и название проекта здесь не подставляются.

      Роль — кем ты работаешь сейчас и за какой слой интерфейса отвечаешь. Стек — React и то, чем ты реально пользовался: TypeScript, состояние, запросы, сборка, тесты. Один проект — что делал продукт и какая была твоя зона, настоящим именем, если оно твоё. Один результат — что изменилось и как ты это измерил. Цифру называешь только если сам её снимал.

      #### Фраза на автомате

      Я фронтенд-разработчик, основной стек — React и TypeScript. На последнем проекте я отвечал за [зона]. Из инструментов состояния и запросов я использовал [то, что есть в твоём стеке]. Результат, который могу показать: [метрика до и после, только своя].
  - id: nagendra-digibank.1b
    label: "1b"
    topic: "Знакомство и опыт по проектам"
    title: "Сколько всего лет опыта с React?"
    body: |
      #### Короткий ответ

      Число берёшь из резюме. Здесь его нет, и чужой стаж подставлять нельзя. Одной фразой отделяешь общий стаж в разработке и годы именно с React, если они не совпадают. Второй фразой говоришь, что эти годы покрывают: функциональные компоненты и хуки, состояние, запросы к API, разбиение бандла. Не округляешь вверх и не считаешь учебный пример за год коммерческой работы.

      #### Фраза на автомате

      С React я работаю [N] лет, общий стаж — [M] лет. За это время я собирал интерфейсы на хуках, вёл состояние через [инструмент из твоего опыта] и ходил в API через [fetch или клиент, которым ты пользовался].
  - id: nagendra-digibank.1c
    label: "1c"
    topic: "Знакомство и опыт по проектам"
    title: "Уже работал на каком-нибудь проекте в EPAM?"
    body: |
      #### Короткий ответ

      Ответ — факт твоего назначения, а не название инициативы этого раунда. Проект EPAM здесь не выдумывается, и DigiBank нельзя называть своим прошлым проектом: это инициатива собеседования.

      Если тебя уже ставили на проект, каркас такой: да, [настоящее имя из назначения], твоя роль, стек, один измеримый результат. Имя произносишь только если оно твоё.

      Если ещё не ставили, так и говоришь. Дальше — чем ты готов закрыть фронтенд: React, TypeScript, состояние, запросы, и микрофронтенды, если они есть в стеке команды.

      #### Фраза на автомате

      Если назначение уже было, говорю: да, проект [имя из назначения], я делал [зона], результат [своя метрика]. Если нет: на проекте EPAM я ещё не работал и имя не выдумаю. К выходу готов на React и TypeScript.
  - id: nagendra-digibank.1d
    label: "1d"
    topic: "Знакомство и опыт по проектам"
    title: "Приведи случай, где была сложность, и как ты с ней справился."
    body: |
      #### Короткий ответ

      Каркас истории, без выдуманной компании. Четыре шага: ситуация, в чём была сложность, что сделал ты, чем измерил итог. Название проекта остаётся слотом из твоего опыта.

      Ситуация — какой экран и что болело у пользователя. Сложность — ограничение, а не «было трудно»: например ответы приходили не по порядку и затирали свежий ввод, или начальный бандл тянул экраны, которые не нужны сразу. Действие — твоё: отделил ввод от запроса, отменял устаревший запрос, разрезал маршрут, замерил ещё раз. Результат — своя цифра или честный качественный итог, если цифры не снимал.

      #### Фраза на автомате

      На [проект] сложность была в том, что [ограничение]. Я сделал [конкретное действие], а не обошёл симптом. Итог: [своя метрика или честное «замерил так-то»].
  - id: nagendra-digibank.2a
    label: "2a"
    topic: "Архитектура: микрофронтенды и рендер"
    title: "Ты сказал, что работал с Module Federation в React. Можешь объяснить?"
    body: |
      #### Короткий ответ

      Module Federation собирает одно приложение из частей, у которых отдельные сборки и отдельные выкладки. Remote публикует `remoteEntry.js` и в `exposes` отдаёт модули, например экран или виджет. Host в `remotes` указывает URL этого входа и подгружает модуль в рантайме, обычно через `lazy` и динамический `import`. Host не пересобирается, когда remote выкатил новую совместимую версию входа.

      Общие библиотеки, в первую очередь `react` и `react-dom`, кладут в `shared` с `singleton: true`, иначе на странице окажутся две копии React и хуки сломаются. `requiredVersion` фиксирует, какая версия считается подходящей.

      Это объяснение механизма. Имя продукта и то, был ли ты host, remote или обоими, берётся из твоего проекта, а не придумывается здесь.

      #### Фраза на автомате

      Module Federation — это runtime-сборка: remote отдаёт `remoteEntry.js` и exposed-модули, host подключает их по URL и выкладывается отдельно. React держу в `shared` как `singleton`, чтобы на странице был один экземпляр.
  - id: nagendra-digibank.2b
    label: "2b"
    topic: "Архитектура: микрофронтенды и рендер"
    title: "Если приложения выкатываются независимо, в чём смысл? Они закрывают одно требование или несколько, и это разные порталы или один host?"
    body: |
      #### Короткий ответ

      Смысл независимой выкладки — несколько требований с разным ритмом релизов, собранные в один продукт. Обычно это один host и несколько remote, а не пачка несвязанных порталов. Host — оболочка: каркас, навигация, общие зависимости. Каждый remote закрывает свою возможность и выкатывается своей командой, когда готов контракт модуля.

      Делить одно требование только ради отдельного деплоя — слабая причина. Отдельный URL remote нужен, чтобы его собрать и открыть в разработке, а для пользователя композиция живёт на host. Прежде чем ответить про конкретную систему, ты смотришь, сколько exposed-модулей и сколько команд реально выпускают `remoteEntry` отдельно.

      #### Фраза на автомате

      Независимая выкладка нужна, когда требований несколько и их выпускают отдельно. Для пользователя это один host: оболочка подгружает remote-возможности, а не открывает каждый кусок как чужой портал.
  - id: nagendra-digibank.2c
    label: "2c"
    topic: "Архитектура: микрофронтенды и рендер"
    title: "Как устроена архитектура? Если три возможности собираются и выкатываются отдельно, как собрать их в одно приложение?"
    body: |
      #### Короткий ответ

      Три возможности — три remote. У каждого свой репозиторий или своя сборка, свой `exposes` и свой задеплоенный `remoteEntry.js`. Host перечисляет все три в `remotes` и рисует их на своих маршрутах. Сборка host не вшивает исходники remote: в рантайме он загружает вход и забирает exposed-модуль.

      Что ты проверяешь по конфигу, а не по догадке: имена в `exposes`, URL в `remotes`, `shared` с `singleton` и `requiredVersion` для React, `publicPath` или полный адрес `remoteEntry`. Адреса в примере ниже — плейсхолдеры. Настоящие ты читаешь из сборки.

      #### Пример кода

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

      #### Фраза на автомате

      Три фичи — три remote со своим `remoteEntry`. Host держит их в `remotes` и подгружает exposed-модули на маршрутах. Общий React — `singleton`. URL я беру из конфига сборки, не из памяти.
  - id: nagendra-digibank.2d
    label: "2d"
    topic: "Архитектура: микрофронтенды и рендер"
    title: "Как отдельные приложения общаются: сессии, куки, общие данные?"
    body: |
      #### Короткий ответ

      Сессия и кука — слабый механизм для общих данных интерфейса. Сессия на сервере узнаёт пользователя. Браузер посылает session cookie, и это может передать аутентификацию, если приложения на домене, которому кука видна: `Domain`, `SameSite`, `Secure`. Это не шина состояния. В куку не кладут выбранный счёт, список статей и прочий UI: лимит около 4 КБ, кука уходит с каждым запросом, подписчиков нет, без `HttpOnly` её читает скрипт, а на разных сайтах `SameSite` её отрежет.

      Общие данные живут на сервере: каждый remote ходит в одни API, а куку использует только как удостоверение. Между модулями на одной странице контракт тонкий: `CustomEvent` на `window`, либо маленький shared-модуль в Module Federation, один singleton на страницу. Состояние, которое должно пережить обновление, кладут в URL. Чужой Redux store снаружи не читают. Если куски разведены по iframe и origin, канал — `postMessage` с проверкой origin.

      Проверка: в сети смотришь `Domain`, `Path` и `SameSite` куки, same-site ли remote, и есть ли общий пакет в `shared`, а не «мы договорились писать в document.cookie».

      #### Пример кода

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

      #### Фраза на автомате

      Куки и сессия передают аутентификацию, а не состояние экрана. Данные я беру с API, а между remote на одной странице шлю событие или общий singleton-модуль. Писать UI в cookie я не буду: это слабый канал.
  - id: nagendra-digibank.2e
    label: "2e"
    topic: "Архитектура: микрофронтенды и рендер"
    title: "Это React с серверным рендером? Страницы React отдаёт приложение на Spring Boot?"
    body: |
      #### Короткий ответ

      Серверный рендер и Spring Boot — два разных вопроса. Ни один не следует из названия репозитория, и этот разбор не объявляет проект приложением на Spring Boot.

      Серверный рендер значит, что сервер собирает HTML дерева React, а браузер делает hydration. Клиентский рендер значит, что документ приходит с пустым корнем, и рисует его браузер.

      Spring Boot отдаёт страницы React только если архитектура такая. Часто Java — это API, а HTML — статический файл с CDN или nginx. То, что Spring раздаёт `index.html` как файл, ещё не серверный рендер React.

      Прежде чем сказать «да», ты проверяешь три вещи. Есть ли серверный вход: `renderToString`, `renderToPipeableStream` или фреймворк, который рендерит на сервере. В ответе документа уже есть текст страницы или только пустой root. Java стоит на пути HTML или только на `/api`. Пока этого нет, ты не называешь приложение серверным React и не называешь источник страниц Spring Boot.

      #### Пример кода

      ```tsx
      import { renderToString } from 'react-dom/server';

      const html = renderToString(<App />);
      ```

      ```html
      <div id="root"></div>
      ```

      #### Фраза на автомате

      SSR — это HTML, собранный на сервере, и потом hydration. Spring Boot я назову источником страниц только если увижу, что Java реально отдаёт этот HTML, а не только API или статический файл. Пока не проверил документ и вход рендера, я этого не утверждаю.
  - id: nagendra-digibank.2f
    label: "2f"
    topic: "Архитектура: микрофронтенды и рендер"
    title: "Приложения на разных именах хостов? Используется hydration?"
    body: |
      #### Короткий ответ

      Разные имена хостов — выбор выкладки, не обязательная часть Module Federation. Remote часто живёт на своём host, потому что так записан URL `remoteEntry`. Host и remote могут стоять и на одном имени, на разных путях. Ты смотришь карту `remotes` и ответ `remoteEntry`, включая CORS, и только потом говоришь, разные ли имена.

      Hydration используется только если HTML уже собран до браузера и React подключается к этому DOM через `hydrateRoot`. `createRoot().render` в пустой узел — монтаж на клиенте, не hydration. Предупреждение о несовпадении разметки значит, что hydration пытались сделать. У клиентского Module Federation hydration часто нет. Это тоже проверка входного файла, а не вывод из Spring Boot.

      #### Пример кода

      ```tsx
      import { createRoot, hydrateRoot } from 'react-dom/client';

      const node = document.getElementById('root');

      hydrateRoot(node, <App />);

      createRoot(node).render(<App />);
      ```

      #### Фраза на автомате

      Разные хосты я подтверждаю по URL remote, а не предполагаю. Hydration есть, только если во входе стоит `hydrateRoot` и сервер уже отдал разметку. `createRoot` в пустой root — это клиентский монтаж.
  - id: nagendra-digibank.3a
    label: "3a"
    topic: "Промисы и async/await"
    title: "Как ты работал с промисами и async/await? В чём между ними разница?"
    body: |
      #### Короткий ответ

      Промис — объект будущего значения: `pending`, затем `fulfilled` или `rejected`. `async`/`await` — запись поверх промисов, а не второй рантайм. Функция `async` всегда возвращает промис. `await` приостанавливает эту функцию, пока промис не осядет, и при отказе бросает исключение, поэтому рядом пишут `try/catch`. Цепочка `.then` и `.catch` делает тот же поток управления, только вложеннее.

      `await` не занимает второй поток и не делает JavaScript многопоточным. Два `await` подряд ждут по очереди. Параллельность ты задаёшь сам: `Promise.all`, `Promise.allSettled`, `Promise.any`, `Promise.race`. В запросах я пользовался и цепочками, и `async`-функциями: `fetch` возвращает промис, `await` достаёт из него `Response`.

      #### Пример кода

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

      #### Фраза на автомате

      Промис — это значение позже. `async`/`await` — тот же промис, только с `try/catch` и без лестницы из `then`. `await` не параллелит код сам: параллельность я собираю через `Promise.all`, `allSettled`, `any` или `race`.
  - id: nagendra-digibank.3b
    label: "3b"
    topic: "Промисы и async/await"
    title: "Сценарий. API отвечает 15–20 секунд, а ждать можно только 5, после чего запрос нужно отменить или проигнорировать. Как это сделать?"
    body: |
      #### Короткий ответ

      Ждать можно пять секунд, а запрос живёт 15–20. «Отменить» и «проигнорировать» — разные действия.

      Отмена без библиотек: `AbortController` и `setTimeout`. Через пять секунд таймер вызывает `abort()`, в `fetch` передан `signal`, браузер обрывает запрос, промис отклоняется с `AbortError`. Поздний JSON ты не применяешь. В `finally` таймер снимается, чтобы успешный ответ не оборвался следом.

      Игнор без отмены: `Promise.race` между `fetch` и промисом, который через пять секунд отклоняется. Гонка заканчивается на пятой секунде, но сетевой запрос остаётся. Для требования «отменить» берёшь контроллер. Для требования «не ждать дольше пяти» гонка закрывает только ожидание в коде.

      #### Пример кода

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

      #### Фраза на автомате

      На пять секунд ставлю `AbortController` и `setTimeout`: таймер вызывает `abort()`, `fetch` получает `signal`, запрос отменяется. `Promise.race` только перестаёт ждать, сам запрос при этом не отменяется.
  - id: nagendra-digibank.3c
    label: "3c"
    topic: "Промисы и async/await"
    title: "Сделай без библиотек, только своей логикой, в небольшом приложении. Напиши пример кода."
    note: "Ожидаемый ответ — AbortController вместе с setTimeout."
    body: |
      #### Короткий ответ

      Ожидаемый ответ — `AbortController` вместе с `setTimeout`, без axios и без прочих клиентов. В небольшом приложении хватает одной функции. Контроллер создаёт сигнал. `setTimeout` на 5000 мс вызывает `controller.abort()`. Этот сигнал передан в `fetch`, поэтому браузер отменяет запрос, а не оставляет его на 15–20 секунд. Промис отклоняется, у ошибки имя `AbortError`, и эту ветку ты отделяешь от сетевой ошибки и от плохого статуса. `clearTimeout` в `finally` гасит таймер, если ответ пришёл раньше.

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      Без библиотек я соединяю `AbortController` и `setTimeout` на пять секунд. `abort()` по таймеру отменяет `fetch` через `signal`. Если пришёл `AbortError`, это таймаут, и тело ответа я уже не читаю.
  - id: nagendra-digibank.3d
    label: "3d"
    topic: "Промисы и async/await"
    title: "Возьмёшь Promise.race или AbortController, и почему?"
    body: |
      #### Короткий ответ

      Беру `AbortController` вместе с `setTimeout`, когда запрос нужно отменить. `Promise.race` беру только если достаточно перестать ждать и живой запрос можно оставить.

      `Promise.race` оседает вместе с первым промисом. Таймаут на пять секунд выигрывает гонку, твой `await` идёт дальше, но `fetch` под ним не отменён: браузер держит соединение, сервер продолжает работу, а поздний ответ всё ещё может прийти. Если у этого промиса остался другой `then`, он выполнится уже после того, как интерфейс «забыл» запрос. Гонка не вызывает `abort()` и не отменяет нижележащий запрос.

      `AbortController` передаёт `signal` в `fetch`. `setTimeout` вызывает `abort()`, браузер отменяет запрос, промис отклоняется с `AbortError`. Позднему телу некуда записаться, если ты не читаешь его после отмены.

      Соединить их можно: гонка ограничивает ожидание в коде, а отменяет всё равно `abort()`. Сама по себе гонка отмены не делает.

      #### Пример кода

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

      #### Фраза на автомате

      Для отмены на пятой секунде я беру `AbortController` и `setTimeout`. `Promise.race` не отменяет нижележащий запрос: он только раньше отпускает `await`, а `fetch` продолжает идти. Отменяет сигнал контроллера.
  - id: nagendra-digibank.3e
    label: "3e"
    topic: "Промисы и async/await"
    title: "Сценарий. Три API новостных статей идут параллельно. Покажи данные, как только ответит любой из них, и покажи Something went wrong, только если упали все три. Как это сделать?"
    body: |
      #### Короткий ответ

      Здесь нужен первый успех, а строка `Something went wrong` — только когда отказали все три. Это `Promise.any`, не `Promise.all`.

      `Promise.any` выполняется на первом успехе и отклоняется с `AggregateError`, только если отклонились все. `Promise.all` ждёт каждый успех и падает на первой ошибке, поэтому одна упавшая лента спрячет две живые. `Promise.race` оседает на первом завершении, и первой может быть ошибка, пока другой API ещё ответит. `Promise.allSettled` дождётся самого медленного и не покажет статью в момент первого успеха.

      `fetch` не отклоняется на статусе 404 или 500. Такой ответ ты сам превращаешь в отказ, иначе `Promise.any` сочтёт его успехом. В интерфейсе строка остаётся точно `Something went wrong`.

      #### Пример кода

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

      #### Фраза на автомате

      Три ленты я запускаю через `Promise.any`: на экране первый успешный ответ. `Something went wrong` показываю, только если упали все три. `Promise.all` здесь не подходит: он падает на первой ошибке и не отдаёт первый успех.
  - id: nagendra-digibank.3f
    label: "3f"
    topic: "Промисы и async/await"
    title: "API 1 занимает 2 секунды, API 2 падает на 1 секунде, API 3 занимает 15 секунд. Когда Promise.allSettled покажет результаты?"
    body: |
      #### Короткий ответ

      `Promise.allSettled` показывает результат, когда осел каждый промис. В этих временах это 15 секунд, время самого медленного, API 3. На первой секунде отказ API 2 только записывается. На второй секунде успех API 1 тоже записывается. Наружу массив ещё не отдан, потому что третий промис `pending`.

      Отказ не обрывает `allSettled` и не отвергает весь вызов. Итоговый массив в порядке входа: первый `fulfilled`, второй `rejected`, третий `fulfilled`. Для «показать статью на первом успехе» эти 15 секунд слишком поздно.

      #### Пример кода

      ```js
      const results = await Promise.allSettled([
        fetchApi1(),
        fetchApi2(),
        fetchApi3(),
      ]);
      ```

      #### Фраза на автомате

      `Promise.allSettled` покажет массив в 15 секунд, когда закончится самый долгий вызов. Падение на первой секунде и успех на второй в массив попадут, но наружу он выйдет только вместе с третьим. Один отказ весь `allSettled` не отвергает.
  - id: nagendra-digibank.3g
    label: "3g"
    topic: "Промисы и async/await"
    title: "Как показать данные сразу после первого успеха, не дожидаясь 15 секунд? Напиши фрагмент."
    body: |
      #### Короткий ответ

      Первый успех отдаёт `Promise.any`. В этих временах API 2 падает на первой секунде, API 1 успевает на второй, API 3 тянется 15 секунд. `any` игнорирует ранний отказ, выполняется на второй секунде данными API 1 и не ждёт третий вызов. Пятнадцати секунд в ожидании результата нет.

      Если успехов не будет совсем, `Promise.any` отклонится, и это место для `Something went wrong`. Медленный запрос при этом всё ещё в сети, пока ты отдельно не вызовешь `abort()` у проигравших. На время показа данных это не влияет.

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

      ```js
      const article = await Promise.any([
        fetchApi1(),
        fetchApi2(),
        fetchApi3(),
      ]);
      ```

      #### Фраза на автомате

      Чтобы не ждать 15 секунд, я беру `Promise.any`. Отказ на первой секунде он пропускает, на второй секунде отдаёт первый успех и не держит экран ради третьего API.
  - id: nagendra-digibank.3h
    label: "3h"
    topic: "Промисы и async/await"
    title: "Как считать успехи и ошибки, чтобы понять, что упали все три?"
    body: |
      #### Короткий ответ

      Считаешь два числа: сколько промисов осело и сколько из них успешны. На первом успехе показываешь данные. Когда осели все три и успехов ноль, показываешь `Something went wrong`. Так ты узнаёшь общий провал в момент последнего отказа и не ждёшь лишнюю секунду после него.

      Тот же сигнал даёт отказ `Promise.any`: он случается, только если отказали все, а `AggregateError.errors` содержит по записи на каждый отказ. `Promise.allSettled` тоже умеет посчитать `status === 'rejected'`, но массив появится лишь когда осядет самый медленный, в сценарии с 15 секундами — в конце. Для первого успеха и для раннего «упали все» счётчик по ходу точнее.

      #### Пример кода

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

      #### Фраза на автомате

      Я считаю, сколько вызовов осело и сколько из них успешны. Первый успех сразу показываю. `Something went wrong` — только когда осели все три и успехов нет. `Promise.any` отклоняется в тот же момент, а `allSettled` для этого счёта заставляет ждать самый медленный.
  - id: nagendra-digibank.3i
    label: "3i"
    topic: "Промисы и async/await"
    title: "Что возвращает fetch? Что такое объект ответа и как его получить из промиса?"
    body: |
      #### Короткий ответ

      `fetch` возвращает промис, который выполняется объектом `Response`. Сам `Response` промисом не является. Промис ты раскрываешь через `await` или `.then` и получаешь ответ: `status`, `ok`, `headers`, тело-поток. Статус 404 или 500 промис не отклоняет. Отказ — это сеть, CORS-сбой или `abort`.

      Тело из ответа само не выпадает. `response.json()`, `response.text()` и `response.blob()` возвращают второй промис, потому что тело ещё нужно прочитать. Его тоже ждут. Два шага: дождаться `Response`, потом дождаться разбор тела.

      #### Пример кода

      ```js
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const data = await response.json();
      ```

      #### Фраза на автомате

      `fetch` возвращает промис `Response`, не готовый JSON. Я делаю `await fetch`, проверяю `response.ok`, и отдельно `await response.json()`, потому что тело — второй промис. Объект ответа — это не промис, промис в него выполняется.
  - id: nagendra-digibank.4a
    label: "4a"
    topic: "Debounce и кастомные хуки (лайвкодинг)"
    title: "Напиши кастомный debounce-хук для поля поиска: вызывай API по мере ввода. Сам вызов API в этом упражнении можно не писать."
    body: |
      #### Короткий ответ

      Хук задерживает значение, а не ходит в сеть. Поле на каждый символ меняет `query`, хук публикует `debouncedValue` только когда пауза дольше `delay`. Предыдущий таймер в cleanup сбрасывается, поэтому быстрый ввод не порождает пачку обновлений. Вызов API в этом упражнении сознательно снаружи: хук можно переиспользовать и для поиска, и для любого другого значения.

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      `useDebounce` хранит значение и обновляет его по `setTimeout` после паузы. На каждый новый ввод я очищаю прошлый таймер. Сам API в хук не кладу: хук только отдаёт устоявшееся значение.
  - id: nagendra-digibank.4b
    label: "4b"
    topic: "Debounce и кастомные хуки (лайвкодинг)"
    title: "Напиши компонент целиком. Как переиспользовать хук и где именно вызывать API, чтобы это было лучше по производительности?"
    body: |
      #### Короткий ответ

      Хук переиспользуется вызовом `useDebounce(query, 500)` внутри компонента. Сеть в хук не переезжает, иначе каждый потребитель будет привязан к одному URL.

      API вызывается в `useEffect`, у которого в зависимостях устоявшееся значение. Символ, который пользователь стёр до паузы, запрос не порождает: эффект не видит промежуточный `query`. Cleanup эффекта делает `abort()`, поэтому медленный прошлый ответ не затирает новый.

      Пустая строка — начальное значение. Её нельзя отсечь через `if (!debouncedValue)`: этот страж как раз всегда выходит рано. Запрос разрешает флаг `touched`: до первого ввода эффект ничего не шлёт, после ввода пустое устоявшееся значение — это очистка, а не «ещё не начали».

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      Хук я вызываю в компоненте и переиспользую как задержку значения. API стоит в `useEffect` по debounced-значению: так запрос один на паузу, а не на символ, и прошлый запрос можно отменить в cleanup.
  - id: nagendra-digibank.4c
    label: "4c"
    topic: "Debounce и кастомные хуки (лайвкодинг)"
    title: "Проверка if (!debouncedValue) всегда выходит раньше времени. Исправь."
    body: |
      #### Короткий ответ

      `if (!debouncedValue) return` выходит раньше на пустой строке, потому что `''` ложно. Пустая строка — это ещё и начальное значение `useState`, поэтому первый проход эффекта всегда попадает в этот `return` и не идёт дальше.

      Если так отсечь путь, который должен запланировать обновление debounced-значения, таймер не ставится, state остаётся `''`, и каждый следующий проход снова выходит рано. Первый настоящий запрос блокируется: введённый текст не становится значением, с которым эффект согласен работать.

      Даже когда страж стоит только вокруг `fetch`, пустую строку он не различает. Начальное «ещё не искали» и поле, которое пользователь стёр, — одна и та же `''`. Очистку нельзя обработать отдельно. Проверка истинна и для любого другого ложного значения, не только для `''`. Обращаться с пустой строкой как с «ещё не готово» — как раз та ошибка, которая не пускает первый настоящий поиск.

      Починка — флаг `touched`. Пока поля не касались, эффект выходит, и это выход по флагу, а не по пустой строке. После ввода пустое debounced-значение — нормальный случай: результаты сбрасываются, запрос не считается ошибкой. Непустая строка уходит в API.

      Второй вариант той же идеи: реагировать, когда debounced-значение изменилось, и пустую строку обрабатывать только когда это уместно, то есть не на самом первом проходе. Начальный `''` пропускается один раз. Позже пустая строка чистит результаты, а первая непустая всё равно ищет.

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      `if (!debouncedValue)` выходит на пустой строке. Пустая строка — начальное значение, поэтому эффект не идёт дальше, а стёртое поле от «ещё не искали» не отличить. Если этим же стражем блокировать запись нового значения, первый настоящий поиск не случится. Я ставлю флаг `touched` или пропускаю только стартовый пустой проход, а дальше пустая строка — отдельное осмысленное изменение.
  - id: nagendra-digibank.4d
    label: "4d"
    topic: "Debounce и кастомные хуки (лайвкодинг)"
    title: "Зачем ждать useEffect на debounced-значении? Нельзя ли вызвать API прямо в onChange? Есть способ лучше?"
    body: |
      #### Короткий ответ

      `useEffect` по debounced-значению запускает запрос после коммита, один раз на устоявшееся значение. Зависимость — не каждый символ, а значение после паузы. Функция cleanup отменяет прошлый `fetch`, когда значение сменилось или компонент размонтировался.

      В `onChange` вызвать API можно, но обработчик стреляет на каждый ввод. Без своего таймера это запрос на символ. С таймером внутри обработчика задержка дублирует хук, замыкание легко берёт старый текст, а отмена при размонтировании сама не появляется: её приходится вешать отдельно.

      Для этого упражнения лучше хук плюс эффект. В приложении, где ответов много, ещё лучше слой данных вроде React Query с ключом из debounced-строки: кэш, статус и отмена уже там, а эффект ты не копируешь на каждый экран.

      #### Пример кода

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

      #### Фраза на автомате

      Эффект на debounced-значении ждёт паузу и даёт cleanup, чтобы оборвать прошлый запрос. В `onChange` без таймера я попаду в API на каждый символ. Таймер в обработчике возможен, но хуже: задержка и отмена при размонтировании живут отдельно от значения.
  - id: nagendra-digibank.4e
    label: "4e"
    topic: "Debounce и кастомные хуки (лайвкодинг)"
    title: "Можно ли вызвать API и внутри обработчика изменения? Как не вызывать его слишком часто?"
    body: |
      #### Короткий ответ

      Да, API можно вызвать из обработчика изменения. Чтобы не звать его слишком часто, на каждый ввод сбрасываешь предыдущий `setTimeout` и ставишь новый на 500 мс. Уходит только последнее значение после паузы. Параллельно отменяешь прошлый `fetch`, иначе медленный ответ обгонит более новый запрос.

      Это рабочий вариант. Слабее эффекта на debounced-значении он тем, что таймер, аборт и размонтирование ты собираешь руками: ref на таймер, ref на контроллер и отдельный cleanup. Хук плюс `useEffect` делит ту же схему на задержку значения и один запрос на устоявшийся текст.

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      Из `onChange` звать API можно. Частоту я режу так: на каждый символ очищаю таймер и прошлый `AbortController`, а `fetch` старю только через 500 мс тишины. Эффект на debounced-значении делает то же чище, потому что cleanup привязан к значению.
  - id: nagendra-digibank.4f
    label: "4f"
    topic: "Debounce и кастомные хуки (лайвкодинг)"
    title: "Что делает кастомный хук? Хук есть только в React? А как в Angular?"
    body: |
      #### Короткий ответ

      Кастомный хук — функция, имя которой начинается с `use`, и которая вызывает другие хуки. Он выносит состояние и эффекты, чтобы компоненты делили поведение. Состояние при этом не общее: каждый вызов получает свои `useState` и `useEffect`. Это соглашение React и правила хуков, а не возможность языка. Хук вызывают на верхнем уровне функции компонента или другого хука.

      В Angular хуков нет. Повторное использование там делает сервис: класс, который создаёт инжектор, часто один на приложение или на компонент. Его не вызывают на каждый проход рендера. Задержку ввода в Angular обычно собирают не хуком, а потоком: `valueChanges` и `debounceTime`. HTTP кладут в сервис. Писать `useDebounce` в Angular не из чего.

      #### Пример кода

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

      #### Фраза на автомате

      Кастомный хук — соглашение React: функция `use*`, которая прячет состояние и эффект. У каждого вызова своё состояние. В Angular вместо хука сервис через DI, а debounce ввода — это RxJS, например `debounceTime`, не хук.
  - id: nagendra-digibank.5a
    label: "5a"
    topic: "Хуки мемоизации"
    title: "Слышал про мемоизацию и useMemo? Стоит ли здесь использовать useMemo?"
    body: |
      #### Короткий ответ

      Мемоизация запоминает результат чистого вычисления между рендерами, пока зависимости те же. `useMemo` для этого и есть. Запрос к API — побочный эффект, ему здесь не место. React вправе выбросить запомненное значение, а функция внутри должна оставаться чистой. `fetch` внутри `useMemo` стартует во время рендера, без cleanup и без нормальной отмены.

      Устоявшаяся строка поиска и так дешёвая, оборачивать её в `useMemo` незачем. `useMemo` уместен, если из уже полученных статей ты фильтруешь тяжёлый список. Сам вызов API остаётся в `useEffect` или в слое данных.

      #### Пример кода

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

      #### Фраза на автомате

      `useMemo` запоминает чистый расчёт, не запрос. Для поиска я им API не вызываю: это эффект во время рендера. Мемоизировать здесь можно тяжёлый фильтр уже лежащих в памяти данных, а сеть — в эффекте или в React Query.
  - id: nagendra-digibank.5b
    label: "5b"
    topic: "Хуки мемоизации"
    title: "А useCallback нельзя? Что делает useCallback? Договори объяснение."
    body: |
      #### Короткий ответ

      `useCallback` запоминает ссылку на функцию, не результат её вызова и не ответ API. Пока зависимости те же, ты получаешь ту же функцию. Это нужно, чтобы ребёнок в `memo` не рисовался заново из-за нового `onClick` и чтобы эффект с этой функцией в зависимостях не перезапускался зря. `useCallback(fn, deps)` — это `useMemo(() => fn, deps)`.

      Сам по себе колбэк ничего не вызывает. JSON он не хранит. Debounce он не делает. Передать туда debounced-строку значит лишь заново создать функцию, когда строка сменилась.

      #### Пример кода

      ```tsx
      const load = useCallback(() => {
        return fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      }, [debouncedQuery]);
      ```

      #### Фраза на автомате

      `useCallback` мемоизирует функцию, а не результат вызова. Пока `debouncedQuery` тот же, ссылка `load` та же. Запрос от этого не выполняется и ответ не кэшируется. Это стабильная функция для `memo` и зависимостей, не слой данных.
  - id: nagendra-digibank.5c
    label: "5c"
    topic: "Хуки мемоизации"
    title: "Почему не передать в useCallback debounced-значение и не мемоизировать вызов API вместо useEffect?"
    body: |
      #### Короткий ответ

      Передача debounced-значения в `useCallback` заново создаёт функцию, когда значение сменилось. Вызов API от этого не мемоизируется: кэшируется функция, не `Response` и не JSON. Пока кто-то не вызовет `load`, сети нет.

      Вызов прямо из рендера — побочный эффект в рендере: лишние запросы в Strict Mode и нет cleanup. Если обернуть вызов в `useEffect`, работу делает эффект, а `useCallback` только держит ссылку. Отмена тоже живёт в cleanup эффекта, и сигнал ещё нужно прокинуть в `fetch`. Убрать эффект и «запомнить вызов» значит оставить запрос несделанным.

      `useCallback` не заменяет `useEffect` для API и не запоминает результат вызова.

      #### Пример кода

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

      #### Фраза на автомате

      `useCallback` с debounced-значением хранит функцию, а не результат запроса. Без `useEffect` этот вызов никто не делает, а из рендера его звать нельзя. Кэш ответа и cleanup даёт эффект или библиотека данных, не `useCallback`.
  - id: nagendra-digibank.5d
    label: "5d"
    topic: "Хуки мемоизации"
    title: "Есть ли более современный способ обрабатывать или мемоизировать вызовы API в React?"
    body: |
      #### Короткий ответ

      Современный слой данных — React Query, он же TanStack Query. Серверный кэш живёт по ключу запроса, а не в `useMemo`. Одинаковый ключ — один запрос и один сохранённый результат. `staleTime` решает, когда данные устарели. В `queryFn` приходит `signal`, им запрос отменяется. Загрузка и ошибка приходят вместе с результатом, руками их из эффекта не собирают.

      `useMemo` и `useCallback` этот слой не заменяют: первый мемоизирует чистый расчёт, второй — ссылку на функцию. Ни один не хранит ответ API между монтированиями так, как кэш запроса.

      Для поиска ключ включает debounced-строку. `enabled` не даёт послать запрос, пока поле не трогали или строка пустая: пустой начальный `''` не становится поиском.

      #### Пример кода

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

      #### Фраза на автомате

      Вызовы API я отдаю React Query: ключ кэширует результат, `signal` отменяет запрос, статус загрузки уже в ответе хука. `useMemo` для этого не использую, он про чистый расчёт, не про серверные данные.
  - id: nagendra-digibank.5e
    label: "5e"
    topic: "Хуки мемоизации"
    title: "Можно ли взять для этого React Query?"
    body: |
      #### Короткий ответ

      Да. React Query как раз забирает этот поиск. Ключ `['search', debouncedQuery]` отличает одну строку от другой и отдаёт уже лежащий результат, если ключ тот же. `queryFn` делает `fetch` и получает `signal`. `enabled: touched && debouncedQuery !== ''` не пускает запрос на начальной пустой строке и не путает её с запросом. После того как пользователь стёр текст, запрос выключен, а не падает в `if (!debouncedValue)` внутри эффекта.

      Компонент читает `data`, `isPending`, `isError` и не хранит второй копией ответ в своём `useState`, если кэш и есть состояние сервера.

      #### Пример кода

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

      #### Фраза на автомате

      Да, этот поиск я бы отдал React Query. Ключ — debounced-строка, запрос включён, когда поле уже трогали и строка не пустая. Кэш, отмена и статус загрузки остаются в библиотеке, а не в ручном `useEffect`.
  - id: nagendra-digibank.5f
    label: "5f"
    topic: "Хуки мемоизации"
    title: "Хорошая ли практика всегда делать это через useEffect? Есть ли минус у useCallback вместо него?"
    body: |
      #### Короткий ответ

      `useEffect` — верный примитив, если побочный эффект ты пишешь сам: он бежит после коммита и возвращает cleanup. Делать каждый API только эффектом — слабая практика для приложения. Кэша нет, гонки легко оставить, флаги загрузки копируются на каждый экран. Серверное состояние лучше жить в React Query или соседнем слое данных.

      Минус `useCallback` вместо эффекта: React колбэк не вызывает. Результат вызова он не мемоизирует. Нет фазы коммита и нет cleanup из `return`. Запрос либо не случится, либо ты вызовешь функцию из рендера или из `onChange` и сам потеряешь отмену при размонтировании. Новая функция при смене debounced-значения не равна «сходить в сеть один раз после отрисовки».

      #### Пример кода

      ```tsx
      const load = useCallback(() => {
        return fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      }, [debouncedQuery]);
      ```

      #### Фраза на автомате

      `useEffect` уместен, когда эффект пишешь сам, но не как единственный способ ходить в API: кэш и гонки останутся на тебе. `useCallback` вместо эффекта хуже тем, что он не вызывает запрос и не запоминает ответ. Нет и cleanup, который эффект возвращает сам.
  - id: nagendra-digibank.6a
    label: "6a"
    topic: "Сквозные заголовки и interceptors"
    title: "Сценарий. Каждому вызову API в каждом приложении нужен новый заголовок запроса. Как добавить его небольшой правкой и не сломав текущий код?"
    body: |
      #### Короткий ответ

      Заголовок добавляется в одном месте, через которое уже идут вызовы, а не в каждой строке `fetch` или `axios`.

      Если приложение ходит через общий экземпляр axios, небольшая правка — request interceptor на этом экземпляре. Каждый запрос экземпляра получает заголовок, места вызова не меняются.

      Если ходят через одну обёртку над `fetch`, заголовок ставится в обёртке. Если обёртки нет и вызовы бьют в глобальный `fetch`, один патч `window.fetch` на старте приложения тоже одно место, а не двести вызовов. Существующие аргументы URL и метода сохраняются, ты добавляешь заголовок к `Headers` и передаёшь остальной `init` дальше.

      #### Пример кода

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

      #### Фраза на автомате

      Заголовок я добавляю один раз на общем клиенте: interceptor у axios или обёртка над `fetch`. Места вызова не трогаю, текущие URL и тела остаются как были.
  - id: nagendra-digibank.6b
    label: "6b"
    topic: "Сквозные заголовки и interceptors"
    title: "Уточнение. Существующий код менять нельзя. Репозиториев и микрофронтендов 10–15: часть на axios, часть на fetch, часть может быть на Angular или Vue. Какой механизм сработает для всех?"
    body: |
      #### Короткий ответ

      Обойти каждый вызов нельзя: код менять запрещено, репозиториев 10–15, и клиенты разные. Interceptor axios видит только axios. Обёртка `fetch` видит только тех, кто через неё ходит. Angular `HttpInterceptor` видит только `HttpClient` и тоже требует правки Angular-приложения. У Vue своего HTTP-слоя нет. Ни один из этих патчей не покрывает все четыре стека, если файлы трогать нельзя.

      Сквозной механизм, который не зависит от библиотеки в репозитории:

      Шлюз или обратный прокси перед API дописывает заголовок всем, кто через него проходит: axios, fetch, Angular и Vue для него одинаковы.

      Service worker, который ставит оболочка или платформенный скрипт, а не каждый микрофронтенд, перехватывает запросы контролируемой страницы, и `fetch`, и XHR, и добавляет заголовок. Фичевые репозитории при этом не редактируют. На каждом origin, который должен быть покрыт, страница должна быть под этим worker.

      Платформенный HTTP-клиент работает, только если приложения уже шлют трафик через него. Тогда правка одна, в этом клиенте. Если они зовут axios и `fetch` напрямую, ввести новый клиент значит менять места вызова, а это как раз запрещено.

      #### Пример кода

      ```js
      self.addEventListener('fetch', (event) => {
        const headers = new Headers(event.request.headers);
        headers.set('X-Channel', 'web');
        event.respondWith(fetch(new Request(event.request, { headers })));
      });
      ```

      #### Фраза на автомате

      Раз код репозиториев менять нельзя, я не патчу axios, fetch, Angular и Vue по местам вызова. Общий механизм — шлюз, service worker на оболочке или уже стоящий платформенный HTTP-клиент. Interceptor одного стека остальные три не увидит.
  - id: nagendra-digibank.6c
    label: "6c"
    topic: "Сквозные заголовки и interceptors"
    title: "Что такое interceptor?"
    body: |
      #### Короткий ответ

      Interceptor — функция, зарегистрированная на HTTP-клиенте. Она выполняется на каждом запросе или ответе, который идёт через этот клиент, и может прочитать или изменить сообщение до следующего шага. Так в одном месте живут заголовок, токен, журнал и общая обработка ошибки.

      У axios это `interceptors.request` и `interceptors.response`. В Angular ту же роль выполняет `HttpInterceptor` на `HttpClient`. Обёртка над `fetch` — та же идея без этого имени. Вызов, который обошёл клиент, в interceptor не попадёт. Это не хук React и не middleware Redux.

      #### Пример кода

      ```ts
      axios.interceptors.request.use((config) => {
        config.headers.set('X-Channel', 'web');
        return config;
      });

      axios.interceptors.response.use((response) => response);
      ```

      #### Фраза на автомате

      Interceptor — функция на HTTP-клиенте, которая бежит для каждого его запроса или ответа и может изменить сообщение. У axios это `interceptors`, в Angular — `HttpInterceptor`. Мимо клиента вызов проходит без него.
  - id: nagendra-digibank.7a
    label: "7a"
    topic: "Производительность: блокирующая работа"
    title: "JavaScript однопоточный. Как обработать тяжёлую работу, которая блокирует интерфейс, например сложные расчёты по большому числу элементов?"
    body: |
      #### Короткий ответ

      Главный поток один на JavaScript, раскладку и отрисовку. Длинный синхронный цикл не отдаёт управление, поэтому клики и кадры стоят. Ожидание сети сюда не относится: `fetch` и так асинхронный и поток расчётом не держит.

      Первое — резать работу на куски и уступать поток. Считаешь пачку элементов, потом отдаёшь управление через `setTimeout`, `requestAnimationFrame` или `scheduler.yield()`, чтобы браузер успел обработать ввод и кадр. `await` на уже выполненном промисе уступает очередь микрозадач и может не дойти до отрисовки. Граница задачи через таймер или scheduler до отрисовки доходит.

      Второе — scheduler. `scheduler.yield()` и `scheduler.postTask` дробят длинную задачу по приоритету. `startTransition` в React помечает обновление как прерываемое, но плотный цикл на главном потоке он с потока не снимает.

      Третье — Web Worker для процессорной работы. Поток интерфейса остаётся свободным, DOM остаётся на главном потоке, результат приходит сообщением.

      #### Пример кода

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

      #### Фраза на автомате

      Тяжёлый расчёт я не держу одним циклом на главном потоке. Либо режу его на куски и уступаю через scheduler или `setTimeout`, либо уношу CPU-работу в Web Worker. Сеть и так не блокирует поток, а `startTransition` плотный цикл с потока не снимает.
  - id: nagendra-digibank.7b
    label: "7b"
    topic: "Производительность: блокирующая работа"
    title: "Помогут ли здесь Web Workers?"
    body: |
      #### Короткий ответ

      Да, если работа процессорная: большой расчёт, разбор, сортировка, криптография, обработка данных без DOM. Worker — другой поток. Главный поток остаётся на кликах и кадрах. Данные уходят через `postMessage`: структурированное клонирование или перевод `ArrayBuffer`. Доступа к DOM у worker нет, поэтому читать вёрстку и писать в документ он не будет.

      Worker не ускоряет `fetch`: ожидание сети главный поток и так не блокирует. На мелкой работе сообщение туда-обратно дороже самого расчёта. Если посчитать нужно на главном потоке, потому что результат сразу связан с DOM, остаётся нарезка на куски и scheduler, а не worker.

      #### Пример кода

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

      #### Фраза на автомате

      Web Worker здесь помогает, когда долго считается CPU, а не когда мы ждём сеть. Я отдам ему массив через `postMessage`, интерфейс останется на главном потоке, DOM worker не трогает.
  - id: nagendra-digibank.8a
    label: "8a"
    topic: "Управление состоянием: Redux и Context"
    title: "Какие инструменты управления состоянием ты использовал вместе с Redux?"
    body: |
      #### Короткий ответ

      Называешь только то, чем пользовался. Чужой проект и чужой набор сюда не подставляются. Рядом с Redux обычно живут такие инструменты, и по ним тебя будут узнавать.

      Redux Toolkit: `configureStore` и `createSlice`, так Redux пишут сейчас. `react-redux`: `Provider`, `useSelector`, `useDispatch`. Thunk входит в middleware RTK по умолчанию и нужен для асинхронных действий. RTK Query — кэш API рядом со store. `createSelector` из Reselect — мемоизированные селекторы. Redux Saga и Redux Observable — отдельные модели побочных эффектов; их называешь, если реально проводил через них поток, иначе говоришь, что знаешь модель, но в проекте не стояли.

      Context API — не middleware Redux. Его часто держат рядом для темы или языка, не вместо редюсера.

      #### Фраза на автомате

      С Redux я беру инструменты из своего стека, чужие не приписываю. Обычно это Redux Toolkit, `react-redux` и thunk. RTK Query, Saga или Observable назову только если они правда были в моей работе.
  - id: nagendra-digibank.8b
    label: "8b"
    topic: "Управление состоянием: Redux и Context"
    title: "Коротко объясни Redux и зачем он нужен."
    body: |
      #### Короткий ответ

      Redux держит клиентское состояние в одном store. Состояние читают, а меняют действием: `dispatch` отправляет action, чистый reducer возвращает следующее состояние, подписчики рисуются заново. Middleware, например thunk, встаёт между отправкой и редюсером и забирает асинхронность. История действий предсказуема: одно и то же действие из одного состояния даёт одно следующее.

      Он нужен, когда одно клиентское состояние читают далёкие экраны и обновления хочется трассировать. Локальный переключатель остаётся в `useState`. Кэш ответов сервера удобнее в RTK Query или React Query, чем в слайсе, который ты наполняешь руками.

      #### Пример кода

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

      #### Фраза на автомате

      Redux — один store, изменения только через action и чистый reducer. Он нужен для общего клиентского состояния, которое надо трассировать. Локальный state и серверный кэш я в него не переношу по привычке.
  - id: nagendra-digibank.8c
    label: "8c"
    topic: "Управление состоянием: Redux и Context"
    title: "Как бы ты собрал студенческий дашборд с посещаемостью и результатами, если данные приходят из API?"
    body: |
      #### Короткий ответ

      Оболочка: шапка и выход маршрутов. Маршруты разделяют обзор, посещаемость и результаты, чтобы один экран не ждал оба API. Идентификатор студента берётся из маршрута.

      Посещаемость и результаты — серверное состояние. На каждый ресурс свой запрос со своим ключом: `['attendance', studentId]` и `['results', studentId]`. Пока один ответ в пути, второй экран уже может показать своё. Загрузка и ошибка живут у своего запроса. Копировать те же строки ещё и в слайс Redux незачем: получится два источника.

      В Redux или в локальном state остаётся клиентское: выбранный семестр, фильтр, то, чего нет в ответе API. Общего студента из двух ответов при необходимости нормализуют по id, а не склеивают сырые массивы в одном компоненте навсегда.

      #### Пример кода

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

      #### Фраза на автомате

      Дашборд я соберу как оболочку с маршрутами. Посещаемость и результаты — отдельные запросы по ключу со student id, один не блокирует другой. В Redux положу только клиентский фильтр, если он правда общий, а не сами ответы API.
  - id: nagendra-digibank.8d
    label: "8d"
    topic: "Управление состоянием: Redux и Context"
    title: "У дашборда несколько маршрутов и светлая тема. Как добавить в шапку переключатель светлой и тёмной темы и сохранить выбранное значение? CSS не учитывать."
    body: |
      #### Короткий ответ

      CSS не трогаем: ни классов, ни переменных, ни стилей на `body`. Нужно только выбранное значение и переключатель в шапке.

      Значение живёт в state контекста. `ThemeProvider` оборачивает маршрутизатор, поэтому смена маршрута провайдер не размонтирует и выбор не сбрасывается. Шапка — потребитель: читает тему и по кнопке вызывает переключение. Стартовое значение — светлая тема.

      Пока провайдер смонтирован, выбор уже сохранён в этом state, его видят шапка и любая страница. Чтобы выбор пережил перезагрузку, при создании state читаешь `localStorage` и записываешь его, когда тема меняется. `localStorage` — только этот способ удержать значение после reload. Для дерева источник — state контекста.

      #### Фраза на автомате

      Переключатель темы я кладу в шапку, а значение держу в state контекста над маршрутами, чтобы переход по страницам его не стирал. Светлая тема — старт. Перезагрузку переживёт запись в `localStorage`, но читает интерфейс всё равно state. CSS я не добавляю.
  - id: nagendra-digibank.8e
    label: "8e"
    topic: "Управление состоянием: Redux и Context"
    title: "Напиши код переключателя темы через Context: provider и тот, кто это значение читает."
    body: |
      #### Короткий ответ

      Провайдер хранит `'light' | 'dark'` и функцию переключения. Потребитель в шапке читает контекст и по клику вызывает `toggleTheme`. Провайдер стоит выше маршрутов, поэтому значение одно на дашборд.

      Выбор сохранён в state контекста. Инициализатор state читает `localStorage`, эффект записывает тему обратно: так значение переживает перезагрузку. Для компонентов источник — контекст, хранилище браузера только удерживает выбор. Стартовое значение светлое. CSS в примере нет.

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      Провайдер держит тему в state и отдаёт `toggleTheme`. Шапка читает контекст и рисует кнопку. Выбор живёт в контексте между маршрутами, а `localStorage` я использую только чтобы не потерять его после перезагрузки. Стилей в этом коде нет.
  - id: nagendra-digibank.9a
    label: "9a"
    topic: "TypeScript"
    title: "Есть опыт с TypeScript?"
    body: |
      #### Короткий ответ

      Да или нет — из твоего резюме, годы и проект здесь не выдумываются. Если опыт есть, одной фразой показываешь, что именно типизировал: пропсы компонента, аргументы хука, ответ API, дженерик на значение. Если опыта нет, так и говоришь и показываешь, что подпись хука прочитать можешь: параметр, параметр задержки, тип возврата.

      #### Фраза на автомате

      С TypeScript я [работал / пока не работал в проде — как в резюме]. Могу типизировать хук: дженерик на значение, `delay: number` и явный тип возврата, без выдуманного проекта.
  - id: nagendra-digibank.9b
    label: "9b"
    topic: "TypeScript"
    title: "Добавь проверки типов в хук useDebounce и в код useEffect, который написал: типы параметров, дженерики, типы возврата."
    body: |
      #### Короткий ответ

      У `useDebounce` три явные проверки. Дженерик `T` — тип значения, одна и та же `T` у аргумента, у state и у возврата, поэтому строка на входе остаётся строкой на выходе. `delay` — `number`. Тип возврата хука — `T`.

      `useState<T>` фиксирует state. Эффект возвращает cleanup `() => void`. Внутри эффекта загрузчик объявлен как `Promise<void>`: он ничего не возвращает вызывающему, он ждёт `fetch` и проверяет статус. `query` — `string`, `touched` — `boolean`, событие поля — `ChangeEvent<HTMLInputElement>`.

      Пустая строка после `touched` по-прежнему отдельный путь, а не `if (!debouncedQuery)`. Начальный пустой state поиском не становится.

      Фрагмент ниже — разбор условия, а не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      `useDebounce` получает дженерик `T` на значение, `delay` как `number` и возвращает `T`. Эффект возвращает cleanup типа `void`, а внутренний `load` помечен `Promise<void>`, потому что наружу он значение не отдаёт.
  - id: nagendra-digibank.9c
    label: "9c"
    topic: "TypeScript"
    title: "Зачем этой функции тип возврата, если в ней нет return?"
    body: |
      #### Короткий ответ

      Функция без оператора `return` всё равно возвращает `undefined`. В JavaScript выполнение, которое дошло до конца тела, завершается значением `undefined`. У `async`-функции это промис, который выполняется в `undefined`. Аннотация `void` или `Promise<void>` это и записывает. Она нужна не потому, что в теле обязано стоять слово `return`, а потому что результат есть и его надо назвать. `void` говорит вызывающему не использовать значение. Отсутствие ключевого слова для такого результата нормально.

      Проверяющий смотрит на подпись, а не на одно лишь отсутствие `return`. При `noImplicitReturns` каждый путь должен удовлетворять объявленному типу. Путь без `return` даёт `undefined`, и это `undefined` сравнивается с подписью. Если подпись `void` или `Promise<void>`, путь подходит. Если подпись `string` или `Promise<string>`, тот же путь без ключевого слова уже ошибка: обещано значение, а путь завершается `undefined`. Решает контракт в аннотации. Отдельного правила «нет слова return — значит, типа нет» у проверяющего нет.

      Обе части сразу: в рантайме функция без `return` возвращает `undefined`, а явная аннотация `void` или `Promise<...>` говорит, допустим ли этот `undefined`. `load` из хука как раз без своего `return` и с `Promise<void>`, потому что он только делает запрос.

      #### Пример кода

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

      #### Фраза на автомате

      Без `return` функция всё равно возвращает `undefined`, а `async` — промис с `undefined`. Тип `void` или `Promise<void>` это документирует. При `noImplicitReturns` и при объявленном `Promise` или `void` проверяющий сверяет пути с подписью: для `void` отсутствующий `return` законен, для `Promise<string>` тот же путь уже не подходит. Решает аннотация, а не само отсутствие ключевого слова.
---

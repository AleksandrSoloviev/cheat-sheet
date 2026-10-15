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
    topic: "Знакомство и опыт"
    title: "Расскажи о себе и своём опыте."
    body: |
      #### Короткий ответ

      Это устный каркас на одну-две минуты. Годы, компанию и цифры бери только из своего резюме. Биографию конкретного человека не подставляй.

      Четыре опоры. Роль: фронтенд-инженер, интерфейс на React. Стек: назови только то, чем ты пользовался, например TypeScript, библиотеку состояния, сборщик и тесты. Один проект: домен и твоя зона, один экран или один модуль. Один измеримый результат: время загрузки, размер бандла или число дефектов. Если цифры нет, назови факт, который можешь защитить, и не выдумывай процент.

      #### Фраза на автомате

      Я фронтенд-инженер, основной интерфейс пишу на React. На последнем проекте я отвечал за один модуль, стек назову по резюме. Результат, который могу показать, тоже беру из резюме: цифра, если она есть, или факт, который защищу. Могу сразу разобрать, как этот модуль был собран.
  - id: "rafeeq-digibank.1b"
    label: "1b"
    topic: "Знакомство и опыт"
    title: "Сколько у тебя опыта в React?"
    body: |
      #### Короткий ответ

      Число лет в React — то, которое складывается из проектов в резюме. Вверх его не округляй.

      Назови число, затем что в эти годы входило: функциональные компоненты и хуки, маршруты, состояние, тесты. Добавь один проект и один результат. Если часть лет была на классовых компонентах, скажи это прямо. Дальше в разговоре будет PureComponent, и разрыв между резюме и ответом будет заметен.

      #### Фраза на автомате

      Коммерческого React у меня столько лет, сколько я могу разложить по проектам в резюме. В них входили хуки и, если это правда, классовые компоненты. Последний проект и один результат назову конкретно, без округления.
  - id: "rafeeq-digibank.1c"
    label: "1c"
    topic: "Знакомство и опыт"
    title: "В резюме вижу Gulp и esbuild. Работал и с бэкендом?"
    body: |
      #### Короткий ответ

      Gulp — раннер задач: он гоняет шаги сборки фронтенда. esbuild — быстрый трансформер и бандлер JavaScript и TypeScript на Go. Его вызывают напрямую из сборки. Раньше Vite на этапе разработки тоже опирался на esbuild. Оба инструмента про клиентскую сборку. Серверное API из них не следует.

      Бэкенд, если он был, называй отдельно: язык или платформа и одна ручка или сервис, которыми ты владел. Если серверного опыта нет, так и скажи. Строки Gulp и esbuild в резюме этот пробел не закрывают.

      #### Фраза на автомате

      Gulp и esbuild в резюме — это сборка фронтенда, не бэкенд. Серверный опыт я назову отдельно, если он был: платформа и одна задача. Если его не было, так и скажу и вернусь к клиенту.
  - id: "rafeeq-digibank.1d"
    label: "1d"
    topic: "Знакомство и опыт"
    title: "Для чего NgRx? Ты работал на Angular?"
    body: |
      #### Короткий ответ

      NgRx — библиотека состояния для Angular, по устройству близкая к Redux. В ней store, actions, reducers, selectors и effects. Reducer синхронно считает следующее состояние. Effect слушает action, делает асинхронную работу, чаще HTTP, и диспатчит новый action. Selector читает кусок store в шаблон.

      Пакеты завязаны на внедрение зависимостей Angular и на RxJS. В React и Next.js NgRx не ставят.

      Про Angular отвечай по резюме. Если он был, назови годы и одну зону, где нужны были store и effects. Если NgRx есть в резюме, не отказывайся от него и не переноси его на React-проекты.

      #### Пример кода

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

      `on(loadClientSuccess, ...)` — синхронный переход состояния. `createEffect` — асинхронный вызов: он дожидается API и диспатчит новый action.

      #### Фраза на автомате

      NgRx — состояние для Angular: store, синхронные reducers, effects для асинхронных вызовов и selectors. В React я его не использую. По Angular скажу только то, что есть в резюме: годы и один модуль, либо прямо что этого опыта не было.
  - id: "rafeeq-digibank.1e"
    label: "1e"
    topic: "Знакомство и опыт"
    title: "Используешь NgRx в React или Next.js? Зачем, и это было требование заказчика или реально нужно?"
    body: |
      #### Короткий ответ

      NgRx в React и Next.js не используют. Библиотека рассчитана на Angular. Просьба заказчика «поставить NgRx» на React-проект обычно путает имя. Потребность за ним другая: общее состояние и побочные эффекты.

      В React это закрывает Redux Toolkit: слайсы, thunks, селекторы. Next.js ничего не меняет. Клиентский store там тот же, а серверные компоненты пакет `@ngrx/store` не исполняют.

      Если заказчик настаивал на имени, уточни потребность и предложи Redux Toolkit. Тащить NgRx в React не нужно ни как требование контракта, ни как техническое решение.

      #### Фраза на автомате

      NgRx в React и Next.js я не использую, он для Angular. Если нужно общее состояние и асинхронные вызовы, на React я беру Redux Toolkit. Само имя NgRx для этого не требуется, даже если так было написано в требовании.
  - id: "rafeeq-digibank.1f"
    label: "1f"
    topic: "Знакомство и опыт"
    title: "То есть NgRx нужен для асинхронных вызовов: API или других асинхронных операций в интерфейсе?"
    body: |
      #### Короткий ответ

      Effects в NgRx как раз выполняют асинхронные вызовы: слушают action, ходят в API и диспатчат успех или ошибку. Сводить весь NgRx к этому рано.

      Store хранит состояние. Reducer синхронно переходит от action к новому состоянию. Selector отдаёт данные в шаблон. HTTP живёт в effect, не в reducer. Reducer остаётся чистым: он не делает запрос.

      Точная формулировка такая. Асинхронные вызовы интерфейса — работа effects. Сам NgRx — контейнер состояния целиком, и синхронные переходы в него входят наравне с API.

      #### Пример кода

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

      `clientReducer` — синхронный переход на `loadClientSuccess`. `loadClient$` — effect: он делает запрос и диспатчит этот action. Effect не заменяет reducer.

      #### Фраза на автомате

      Да, API и другие асинхронные операции интерфейса в NgRx живут в effects. Рядом reducer остаётся синхронным, а selector читает store. NgRx — это всё состояние, не только слой HTTP.
  - id: "rafeeq-digibank.2a"
    label: "2a"
    topic: "Жизненный цикл компонента и рендер"
    title: "Объясни жизненный цикл компонента React."
    body: |
      #### Короткий ответ

      Жизненный цикл — появление компонента в дереве, повторные рендеры и удаление. У функционального компонента нет методов класса. React вызывает саму функцию на каждый проход render.

      Монтирование: первый вызов функции, инициализация state, создание DOM, затем эффекты после коммита. Повторный рендер: тот же тип компонента на том же месте вызывается снова, хранимый state сохраняется, DOM обновляется точечно. Это не новый экземпляр. Размонтирование: узел убирают из дерева и выполняют очистки эффектов.

      Классовые имена, если их просят: `constructor`, `render`, `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`. `render` соответствует телу функции. `componentDidMount` по времени ближе к `useLayoutEffect`: после записи DOM и до paint. `useEffect` с пустым массивом срабатывает уже после отрисовки. В concurrent-режиме React может вызвать функцию и выбросить этот проход, если пришло более новое обновление. Эффекты бегут только после коммита, не после отменённого render.

      #### Фраза на автомате

      Компонент монтируется, потом может много раз перерисоваться и в конце размонтируется. В функциональном компоненте render — это само тело функции. State инициализируется один раз. Повторный вызов функции — это re-render, не новый mount. Очистка эффекта выполняется на unmount.
  - id: "rafeeq-digibank.2b"
    label: "2b"
    topic: "Жизненный цикл компонента и рендер"
    title: "Ты назвал mount, unmount и render. Как это делается в React и чем?"
    body: |
      #### Короткий ответ

      Render ты не вызываешь сам. Тело функционального компонента и есть render. Оно должно быть чистым: без запросов, подписок и записей в DOM.

      Монтирование для побочного эффекта — `useEffect` с пустым массивом зависимостей. Функция, которую эффект возвращает, — очистка. При размонтировании React её вызывает. С массивом `[]` в разработке Strict Mode может смонтировать эффект, снять его и смонтировать снова, чтобы найти пропущенную очистку. В продакшене этого двойного цикла нет.

      `componentDidMount` выполняется после записи DOM и до paint: `setState` из него ещё успевает в тот же кадр. `useEffect` выполняется после paint. Если нужно измерить DOM или поправить его до кадра, бери `useLayoutEffect`. Данные с сервера обычно грузят в `useEffect`.

      Отдельной команды «включить unmount» нет. Компонент снимается, когда его убирают из дерева, меняется `key` или на этом месте оказывается другой тип. Очистку пишут в эффекте.

      #### Пример кода

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

      Тело `Panel` — render. Эффект с `[]` после первого коммита открывает соединение. Возвращённая функция закрывает его на unmount. `setOpen` вызывает повторный render и этот эффект заново не гоняет.

      #### Фраза на автомате

      Render — тело компонента, я его сам не вызываю. Mount для эффекта — `useEffect` с пустым массивом. Unmount — очистка, которую этот эффект возвращает. До paint, если нужно успеть к кадру, беру `useLayoutEffect`. `useEffect` срабатывает после отрисовки.
  - id: "rafeeq-digibank.2c"
    label: "2c"
    topic: "Жизненный цикл компонента и рендер"
    title: "Концептуально, не только в коде: чем фаза монтирования отличается от фазы повторного рендера?"
    body: |
      #### Короткий ответ

      Монтирование создаёт компонент. Повторный рендер вызывает ту же функцию заново и компонент с нуля не создаёт.

      На монтировании React в первый раз выполняет функцию, берёт начальный state и создаёт DOM-узлы. Инициализатор `useState(() => ...)` выполняется только здесь. После коммита запускаются эффекты.

      На повторном рендере функция выполняется снова, поэтому расчёт в теле идёт заново. Хранимый state уже есть, аргумент `useState` игнорируется. React сравнивает новое дерево с предыдущим и меняет существующие узлы. Эффект с `[]` повторно не запускается. Эффект с зависимостями сначала вызывает прошлую очистку, потом сам эффект, если зависимость изменилась.

      Это не unmount и не новый mount. Новый mount будет, если сменился `key` или тип на этом месте: state тогда начнётся заново. Отменённый concurrent-проход тоже не считается сменой поколения: эффекты после него не бегут, state от него не коммитится.

      #### Пример кода

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

      Инициализатор `() => 0` выполняется на mount. Каждый клик — re-render: `count` растёт из хранимого state, а не с нуля. Эффект зависит от `count`, поэтому на обновлении сначала идёт очистка, потом новая запись title. С `[]` этот эффект на клик бы не повторился.

      #### Фраза на автомате

      Mount — первый вызов: создаётся state и DOM. Re-render — тот же компонент вызывается снова, начальное значение уже не читается, DOM обновляется на месте. Эффект с пустым массивом остаётся монтажным. Новый mount будет только при смене key или типа.
  - id: "rafeeq-digibank.2d"
    label: "2d"
    topic: "Жизненный цикл компонента и рендер"
    title: "В каких случаях компонент перерисовывается? Кроме props и state, есть ли что-то ещё?"
    body: |
      #### Короткий ответ

      Компонент рисуется снова в четырёх понятных случаях.

      Свой state: `setState` или `dispatch`, если следующее значение не проходит `Object.is` со старым. Тот же state React пропускает. Свои props: родитель передал другие значения.

      Дальше то, что к props и state этого компонента не сводится. Родитель перерисовался: дочерняя функция вызывается снова, даже если props те же, пока ребёнок не обёрнут в `React.memo`. Контекст: `useContext` получает новое значение провайдера. Внешний store: `useSelector` или хук Zustand, если выбранный снимок изменился по ссылке.

      `useRef` рендер не вызывает. Мутация вложенного поля без смены ссылки и без `setState` тоже не вызывает: экран просто устареет. Смена `key` — это размонтирование и новое монтирование, не обычный re-render.

      #### Пример кода

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

      У `Child` нет своих props и нет своего state. Клик по `tick` всё равно вызывает `Child`, потому что рендерится `Parent`. Строка `"light"` при этом та же, так что причина — родитель, не контекст. Новое значение провайдера было бы отдельной причиной. Подписка на store работает так же: рендер ставит смена выбранной ссылки.

      #### Фраза на автомате

      Кроме своих props и state компонент рисуется снова, когда рендерится родитель, когда меняется значение его контекста и когда `useSelector` или Zustand видит новую ссылку. `useRef` рендер не ставит. Смена key — это уже новый mount.
  - id: "rafeeq-digibank.3a"
    label: "3a"
    topic: "Хуки производительности и мемоизация"
    title: "Какие плюсы и минусы у useCallback?"
    body: |
      #### Короткий ответ

      `useCallback(fn, deps)` на каждом рендере вызывается, а наружу отдаёт ту же функцию, пока зависимости не изменились.

      Плюс: стабильная ссылка. Она нужна ребёнку в `React.memo`, зависимости `useEffect` и зависимости `useMemo`. Меньше лишних эффектов и меньше сорванных поверхностных сравнений.

      Минус: хук не отменяет рендер компонента, который его вызвал. Ребёнок тоже рисуется снова, если он не мемоизирован. Неполный список зависимостей даёт устаревшее замыкание. Если зависимость и так новая на каждом рендере, кэша нет, а шум в коде есть.

      #### Пример кода

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

      `onPing` остаётся той же функцией, когда растёт `count`. Компонент `Parent` при этом всё равно выполняется заново: хук вызывается на каждом рендере и возвращает кэш.

      #### Фраза на автомате

      `useCallback` держит одну и ту же функцию, пока deps не изменились. Это полезно для memo-ребёнка и для зависимостей эффекта. Сам рендер родителя хук не отменяет, а без memo у ребёнка стабильная ссылка ничего не пропускает.
  - id: "rafeeq-digibank.3b"
    label: "3b"
    topic: "Хуки производительности и мемоизация"
    title: "Ты сказал, что useCallback останавливает перерисовки. Уверен?"
    body: |
      #### Короткий ответ

      Нет. `useCallback` не останавливает перерисовки. Он стабилизирует ссылку на функцию.

      Родитель, который вызвал `setState`, выполняется заново, и `useCallback` внутри него тоже. Дочерний компонент пропускает рендер, когда выполнены оба условия: он обёрнут в `React.memo` или это `PureComponent`, и все его props прошли поверхностное сравнение. Стабильный callback помогает второму условию. Сам по себе он ребёнка не защищает.

      Если остальные props каждый раз новые объекты, `memo` не сработает даже со стабильным callback.

      #### Пример кода

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

      На клике `Parent` рендерится снова. `PlainChild` тоже, хотя `onPing` тот же. `MemoChild` этот рендер пропускает: он в `memo`, и единственный prop равен прошлому.

      #### Фраза на автомате

      Нет, не уверен в той формулировке. `useCallback` только сохраняет ссылку на функцию. Рендер останавливает `React.memo` у ребёнка, и только если эта ссылка и остальные props не изменились.
  - id: "rafeeq-digibank.3c"
    label: "3c"
    topic: "Хуки производительности и мемоизация"
    title: "Какие плюсы и минусы у useCallback и useMemo?"
    body: |
      #### Короткий ответ

      `useCallback` кэширует функцию. `useMemo` кэширует результат вычисления. `useCallback(fn, deps)` — то же самое, что `useMemo(() => fn, deps)`.

      Общий плюс: стабильная ссылка и пропуск дорогой работы, пока `deps` те же. Общий минус: ни один из хуков не отменяет рендер текущего компонента. Оба требуют честный список зависимостей. Оба бесполезны, если зависимости меняются на каждом рендере.

      `useMemo` уместен для дорогого расчёта и для объекта или массива, который уходит пропом в мемоизированного ребёнка. `useCallback` уместен для обработчика в том же случае и для функции в зависимостях эффекта. Дешёвый расчёт и обработчик обычного ребёнка оставляй без этих хуков.

      #### Пример кода

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

      `visible` пересчитывается, когда меняются `items` или `query`. `onPick` стабилен. Сам `Search` при `setQuery` всё равно рендерится. Выигрыш появится, если `visible` или `onPick` уйдут в ребёнка под `React.memo`, либо если фильтр дорогой.

      #### Фраза на автомате

      `useMemo` помнит значение, `useCallback` помнит функцию, и второй — частный случай первого. Оба не отменяют рендер того, кто их вызвал. Я ставлю их на дорогой расчёт или на prop мемоизированного ребёнка, а не на каждый обработчик.
  - id: "rafeeq-digibank.3d"
    label: "3d"
    topic: "Хуки производительности и мемоизация"
    title: "Значит, useCallback нужно ставить чаще или нет?"
    body: |
      #### Короткий ответ

      Чаще ставить `useCallback` не нужно. По умолчанию обработчик — обычная функция в теле компонента.

      Хук добавляют в двух случаях. Функцию получает ребёнок в `React.memo` или `PureComponent`. Либо функция стоит в зависимостях `useEffect` или `useMemo`, и без стабильной ссылки эффект срабатывал бы на каждый рендер.

      Если зависимости и так меняются каждый раз, хук ничего не стабилизирует. Привычка обернуть каждый обработчик ухудшает чтение и прячет устаревшие замыкания. Рендер родителя от количества `useCallback` не становится реже.

      #### Фраза на автомате

      Нет, чаще не нужно. Обычный обработчик оставляю функцией. `useCallback` добавляю, когда ссылку получит ребёнок в `React.memo` или когда от неё зависит эффект. На рендер самого компонента это не влияет.
  - id: "rafeeq-digibank.3e"
    label: "3e"
    topic: "Хуки производительности и мемоизация"
    title: "Что такое pure components?"
    body: |
      #### Короткий ответ

      Pure component при тех же props и state рисует тот же вывод и во время render не делает побочных эффектов.

      В классовом API это `React.PureComponent`. Он реализует `shouldComponentUpdate` и поверхностно сравнивает props и state. Если ссылки верхнего уровня те же, `render` не вызывается.

      Чистота функции — отдельное требование: тело не пишет в DOM, не шлёт запросы и не меняет внешние переменные. `PureComponent` эту чистоту не проверяет. Он только пропускает лишний render по поверхностному сравнению.

      #### Пример кода

      ```tsx
      import { PureComponent } from "react";

      type Props = { cents: number };

      export class Price extends PureComponent<Props> {
        render() {
          return <span>{this.props.cents}</span>;
        }
      }
      ```

      Если родитель передал тот же числовой `cents`, сравнение поля проходит и `render` не вызывается. React каждый раз собирает новый объект props, сравниваются поля. Если сам prop — новый объект с тем же числом внутри, сравнение уже не проходит: вглубь React не смотрит.

      #### Фраза на автомате

      Pure component при тех же props и state даёт тот же вывод и не делает эффектов в render. В классах это `PureComponent`: он поверхностно сравнивает props и state и может пропустить render.
  - id: "rafeeq-digibank.3f"
    label: "3f"
    topic: "Хуки производительности и мемоизация"
    title: "Ты работал с классовыми компонентами, у них есть PureComponent. Как это соотносится с функциональными компонентами?"
    body: |
      #### Короткий ответ

      `PureComponent` — классовый механизм. `React.memo` — обёртка функционального компонента. Оба пропускают render по поверхностному сравнению.

      `PureComponent` сравнивает и props, и state экземпляра. `React.memo` сравнивает props. Свой `setState` у функционального компонента всё равно вызывает его рендер: `memo` этот путь не режет.

      У `memo` можно передать свою функцию сравнения. Она возвращает `true`, когда props равны и render надо пропустить. `shouldComponentUpdate` устроен наоборот: `true` значит «рисовать». У `PureComponent` свою функцию не передают. Там только shallow compare, либо ты пишешь `shouldComponentUpdate` в обычном `Component`.

      #### Пример кода

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

      #### Фраза на автомате

      `PureComponent` для класса сравнивает props и state. `React.memo` для функции сравнивает props. Оба сравнения поверхностные. Свой setState мемоизированную функцию всё равно перерисует. Свой компаратор у `memo` возвращает true, если props равны и рисовать не надо.
  - id: "rafeeq-digibank.3g"
    label: "3g"
    topic: "Хуки производительности и мемоизация"
    title: "Как сделать функциональный компонент чистым?"
    body: |
      #### Короткий ответ

      Функциональный компонент делают чистым в двух смыслах. Тело функции ничего не меняет снаружи: те же props дают тот же JSX. Лишний render от родителя отсекают обёрткой `React.memo`.

      Чтобы `memo` сработал, props должны пройти поверхностное сравнение: примитивы или стабильные ссылки. Новый объект, массив или функция на каждом рендере родителя сравнение проваливают. Тогда компонент обёрнут, а пропуска рендера нет.

      Чистое тело само по себе рендер от родителя не отменяет. `memo` без чистого тела опасно в другую сторону: пропущенный render спрячет эффект, который кто-то положил в тело.

      #### Пример кода

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

      `List` рисует только `items`. Пока родитель передаёт тот же массив, `memo` пропускает render. `items.filter(...)` прямо в JSX создаёт новый массив, и сравнение уже не проходит.

      #### Фраза на автомате

      Тело оставляю чистым: тот же вход, тот же JSX, без запросов. Сверху оборачиваю в `React.memo`. Props держу примитивами или стабильными ссылками, иначе поверхностное сравнение не пропустит рендер.
  - id: "rafeeq-digibank.3h"
    label: "3h"
    topic: "Хуки производительности и мемоизация"
    title: "Что такое React.memo?"
    body: |
      #### Короткий ответ

      `React.memo` — функция, которая принимает компонент и возвращает компонент. Перед рендером она поверхностно сравнивает прошлые и новые props: `Object.is` по каждому prop. Если все равны, функция компонента не вызывается, остаётся прошлый вывод.

      Это сравнение первого уровня, не глубокий обход. Свой state, свой контекст и подписка на store по-прежнему вызывают рендер. Второй аргумент — свой компаратор: `true` значит «props равны, не рисовать».

      #### Пример кода

      ```tsx
      import { memo } from "react";

      const Price = ({ cents }: { cents: number }) => {
        return <span>{cents}</span>;
      };

      export const MemoPrice = memo(Price);
      ```

      #### Фраза на автомате

      `React.memo` оборачивает компонент и перед вызовом поверхностно сравнивает props через `Object.is`. Если они те же, функция не вызывается. Свой state и контекст эта проверка не отменяет.
  - id: "rafeeq-digibank.3i"
    label: "3i"
    topic: "Хуки производительности и мемоизация"
    title: "Обычный компонент тоже перерисовывается, когда значение меняется. Что memo делает сверх этого?"
    body: |
      #### Короткий ответ

      Обычный компонент вызывается снова, когда рендерится родитель, даже если значения props те же. `memo` добавляет проверку до вызова: поверхностное сравнение props. Совпали — вызова нет.

      Сверх этого `memo` не делает глубокого равенства. Новый объект с теми же полями считается изменением. Примитив вроде строки сравнивается по значению, поэтому та же строка рендер пропускает.

      Свой `useState` внутри мемоизированного компонента всё равно его перерисует. `useContext` тоже: `memo` не блокирует обновление контекста, на который компонент подписан.

      #### Пример кода

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

      На клике `NameChild` пропускает render: prop `name` — та же строка. `UserChild` не пропускает: `{{ name: "Ada" }}` — новый объект на каждом рендере родителя. Поверхностное сравнение смотрит ссылку `user`, не поле `name`.

      #### Фраза на автомате

      Обычный ребёнок рисуется вместе с родителем. `memo` сверх этого сравнивает props поверхностно и пропускает вызов, если ссылки те же. Новый объект с теми же полями считается изменением. Свой state и контекст `memo` не останавливает.
  - id: "rafeeq-digibank.4a"
    label: "4a"
    topic: "Основы JavaScript"
    title: "Знаешь deep copy и shallow copy? Что это?"
    note: "Потом он объяснил, что memo сравнивает поверхностно, и этим memo, pure components и shallow copy связаны."
    body: |
      #### Короткий ответ

      Shallow copy копирует только верхний уровень. Новый объект или массив получает те же вложенные ссылки. Так работают spread, `Object.assign` и `slice`. Если изменить вложенное поле копии, изменится и оригинал: вложенный объект общий.

      Deep copy копирует вложенные структуры отдельно. `structuredClone` делает это для значений, которые умеет structured clone. `JSON.parse(JSON.stringify(...))` теряет `undefined`, функции и символы, превращает `Date` в строку и падает на циклах.

      Связь с `memo` прямая, её интервьюер и объяснил. `React.memo` и pure components сравнивают поверхностно: `Object.is` по каждому prop верхнего уровня, без обхода вглубь. Это та же глубина, что у shallow copy. Та же ссылка на объект считается «ничего не изменилось», даже если поле внутри уже мутировали. Новая обёртка считается изменением, даже если внутри те же данные. Поэтому memo, pure components и shallow copy — один механизм первого уровня. Глубокого сравнения React здесь не делает.

      #### Пример кода

      ```ts
      const original = { user: { name: "Ada" }, tags: ["a"] };
      const deep = structuredClone(original);
      const shallow = { ...original };

      shallow.tags.push("b");
      shallow.user.name = "Grace";
      deep.user.name = "Lin";
      deep.tags.push("c");
      ```

      `deep` снят до мутаций. После них `original.tags` равен `["a", "b"]`, а `original.user.name` равен `"Grace"`: shallow делил эти ссылки. `deep.user.name` равен `"Lin"`, `deep.tags` равен `["a", "c"]`, и исходный объект от этих двух присваиваний не меняется.

      #### Фраза на автомате

      Shallow copy копирует первый уровень и делит вложенные ссылки. Deep copy, например `structuredClone`, копирует вложенное отдельно. `React.memo` и pure components сравнивают так же поверхностно: та же ссылка — пропускают render, новая обёртка — рисуют, даже если поля внутри совпали.
  - id: "rafeeq-digibank.5a"
    label: "5a"
    topic: "Управление состоянием"
    title: "Какие бывают виды state и как каждый использовать?"
    note: "Он уточнил, что речь об одном компоненте, а не о state между микрофронтендами."
    body: |
      #### Короткий ответ

      Интервьюер уточнил: речь об одном компоненте. State между микрофронтендами в этот ответ не входит.

      У одного компонента четыре рабочих вида. Локальный state — `useState`: данными владеет этот компонент, например открыта ли панель. Состояние с действиями — `useReducer`: следующий шаг зависит от нескольких полей, и его удобно описать action. Производное значение считают в теле render из props и state и не кладут во второй `useState`. Ref — `useRef`: мутабельная величина, которая сама не должна вызывать рендер, например id таймера.

      Props — вход от родителя. Компонент их читает и не хранит копию, пока ему не нужно своё редактируемое значение. Ответ API, положенный в `useState` после запроса, остаётся локальным state этого компонента.

      #### Фраза на автомате

      Вопрос про один компонент, не про state между микрофронтендами. Локальные данные держу в `useState`, связанные переходы в `useReducer`, производные значения считаю при рендере, таймер кладу в `useRef`. Props не копирую в state без нужды.
  - id: "rafeeq-digibank.5b"
    label: "5b"
    topic: "Управление состоянием"
    title: "Чем ты делаешь локальный state?"
    body: |
      #### Короткий ответ

      Локальный state делают `useState`. Начальное значение берётся на монтировании. Сеттер меняет state и ставит рендер, если новое значение не `Object.is` со старым.

      Несколько связанных полей, где легко обновить одно и забыть другое, удобнее отдать `useReducer`. Пока поля независимы, отдельный `useState` на каждое проще. Redux и Zustand для состояния, которое живёт только в этом компоненте и никому снаружи не нужно, не подключают.

      #### Пример кода

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

      #### Фраза на автомате

      Локальный state я делаю через `useState`. Одно поле — один хук. Если переходы связаны и легко забыть кусок, беру `useReducer`. Redux для состояния одного компонента не поднимаю.
  - id: "rafeeq-digibank.5c"
    label: "5c"
    topic: "Управление состоянием"
    title: "Использовал Zustand? Использовал Zod?"
    body: |
      #### Короткий ответ

      Zustand и Zod решают разные задачи. Отвечай по факту резюме и не приписывай библиотеку, которой не было.

      Zustand — небольшой store. Хук подписывает компонент на выбранный кусок. Provider не обязателен. Состояние живёт в модуле.

      Zod — библиотека схем. Она проверяет и разбирает неизвестные данные на границе: ответ API, форма, query-параметры. Из схемы выводится тип. Состояние интерфейса Zod не хранит.

      Их ставят рядом, когда это нужно: Zod разбирает ответ, результат кладётся в `useState` или в Zustand. Одна библиотека другую не заменяет.

      #### Фраза на автомате

      Zustand — клиентский store, если он был в проекте. Zod — схемы на входе: разобрать ответ API и получить тип. Это разные задачи. Если какой-то из них я не использовал, так и скажу.
  - id: "rafeeq-digibank.5d"
    label: "5d"
    topic: "Управление состоянием"
    title: "В чём разница между Zustand и Redux? Что лучше и какие плюсы и минусы?"
    body: |
      #### Короткий ответ

      Zustand короче. Store создаётся `create`, обновление идёт через `set`, подписка — хук с селектором. Несколько маленьких store — нормальная форма. Отдельных action и reducer нет. Provider не нужен.

      Redux — один store, actions, чистые reducers и цепочка middleware. Redux Toolkit снимает большую часть шаблона: `createSlice`, `configureStore`, `createAsyncThunk`. Сильная сторона — явный журнал действий, DevTools и договорённость для большой команды. Middleware у Zustand тоже можно добавить, но набор вокруг Redux шире и привычнее.

      Лучшего на все случаи нет. Маленький клиентский store быстрее собрать на Zustand. Несколько доменов, асинхронные потоки и общий стиль команды обычно ведут на Redux Toolkit. Оба умеют читать срез и не рисовать компонент из-за чужого поля, если селектор возвращает стабильную ссылку.

      #### Пример кода

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

      Верхний store — Zustand: состояние и `inc` лежат рядом. Нижний — Redux Toolkit: `inc` описан как reducer, store собирается отдельно. Оба увеличивают `count` синхронно.

      #### Фраза на автомате

      Zustand — короткий store без Provider, обновление через `set`. Redux — один store, actions и reducers, с Toolkit это слайсы и thunks. Маленькое состояние я беру на Zustand, большое командное — на Redux Toolkit. Оба читают срез селектором.
  - id: "rafeeq-digibank.5e"
    label: "5e"
    topic: "Управление состоянием"
    title: "По твоему опыту, что лучше: Redux или Zustand? Вопрос про Zustand, не про useContext."
    body: |
      #### Короткий ответ

      Вопрос про Zustand и Redux. `useContext` в этот ответ не подставляй.

      По размеру задачи выбираю так. Redux Toolkit — когда доменов много, нужны слайсы, middleware и разбор действий в DevTools. Zustand — когда store небольшой и журнал каждого action не нужен. На банковском shell с несколькими командами чаще фиксируют Redux. На внутреннем store одного экрана чаще хватает Zustand.

      «Лучше» здесь — попадание в размер, не лозунг. Оба варианта можно защитить на конкретном store.

      #### Фраза на автомате

      На большом shell с несколькими доменами я беру Redux Toolkit: слайсы, middleware, DevTools. На небольшом store беру Zustand. `useContext` я сюда не ставлю: вопрос про Zustand.
  - id: "rafeeq-digibank.5f"
    label: "5f"
    topic: "Управление состоянием"
    title: "Чем ты делаешь синхронные операции?"
    body: |
      #### Короткий ответ

      Синхронные переходы делают reducer в Redux и `set` в Zustand. `dispatch` обычного action выполняет reducer сразу, до возврата из `dispatch`. `set` в Zustand тоже записывает следующее состояние сразу.

      Запрос к API в reducer не кладут. Reducer чистый и синхронный: он получает текущее состояние и action и возвращает следующее. Асинхронный шаг живёт снаружи, в thunk или в функции Zustand, и уже потом вызывает синхронный `dispatch` или `set` с готовыми данными.

      #### Пример кода

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

      `bumpRedux` возвращается только после того, как reducer записал `count`. `useBox.inc` тоже синхронный: следующий `getState` уже видит новое число. HTTP сюда не входит.

      #### Фраза на автомате

      Синхронно я обновляю состояние reducer-ом или `set` в Zustand. `dispatch` обычного action завершается сразу. Запрос к API живёт снаружи и потом диспатчит уже готовые данные.
  - id: "rafeeq-digibank.5g"
    label: "5g"
    topic: "Управление состоянием"
    title: "Используешь слайсы?"
    body: |
      #### Короткий ответ

      Да, в Redux Toolkit домен описывают слайсом. `createSlice` принимает `name`, `initialState` и `reducers`. На выходе — reducer и создатели actions. Внутри reducer можно писать присваивания: Immer превращает их в неизменяемое обновление. Снаружи state не мутируют.

      Слайсы собирают в `configureStore` по ключам. Один слайс — одна зона, например `profile` или `accounts`. Компонент читает слайс через `useSelector`, не через прямой импорт состояния.

      #### Пример кода

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

      Присваивание `state.firstName` безопасно только внутри reducer: это черновик Immer. `rename` — создатель action, который диспатчат из компонента.

      #### Фраза на автомате

      Да, использую слайсы Redux Toolkit. `createSlice` даёт имя, начальное состояние, reducers и готовые actions. В `configureStore` я кладу их по ключам. В компоненте читаю нужный ключ через `useSelector`.
  - id: "rafeeq-digibank.5h"
    label: "5h"
    topic: "Управление состоянием"
    title: "Redux синхронный или асинхронный?"
    body: |
      #### Короткий ответ

      Ядро Redux синхронное. Reducer — чистая синхронная функция. `dispatch` обычного action обновляет store до того, как `dispatch` вернулся.

      Асинхронность добавляет middleware. Thunk позволяет диспатчить функцию: внутри неё `await`, а наружу потом уходят обычные action `pending`, `fulfilled` или `rejected`. Эти action reducer снова обрабатывает синхронно. Saga и Observable — другие middleware для потоков. Ядро от них асинхронным не становится.

      Поэтому ответ на вопрос «синхронный или асинхронный»: сам Redux синхронный, асинхронный код живёт в middleware вокруг него.

      #### Пример кода

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

      `rename` синхронный: состояние меняется внутри `dispatch`. `loadProfile` — thunk с `await`. Reducer на `fulfilled` тоже синхронный, он только записывает уже пришедшее имя.

      #### Фраза на автомате

      Redux синхронный: reducer отрабатывает до возврата из `dispatch`. Асинхронный запрос я кладу в thunk. Когда данные пришли, thunk диспатчит обычный action, и его reducer снова синхронный.
  - id: "rafeeq-digibank.5i"
    label: "5i"
    topic: "Управление состоянием"
    title: "Как данные из Redux попадают в компонент?"
    body: |
      #### Короткий ответ

      Данные из Redux читает `useSelector`. Селектор получает state и возвращает нужный кусок. Компонент подписывается на store. По умолчанию результат сравнивается через `===`. Новая ссылка ставит рендер, та же ссылка — нет.

      Писать в store — `useDispatch` и создатель action из слайса. Выбирать весь state не стоит: замена корня даст рендер на любой action. Селектор, который каждый вызов собирает новый объект или массив, тоже даёт рендер всегда, потому что ссылка результата каждый раз новая.

      #### Пример кода

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

      `count` — число. Пока reducer не заменил его, `===` совпадает и лишнего рендера нет. Если вернуть `state.counter` целиком, любая смена поля внутри этого объекта, которая заменила объект, перерисует компонент.

      #### Фраза на автомате

      В компоненте я беру `useSelector` и возвращаю из него нужное поле. В store пишу через `useDispatch`. Если селектор каждый раз создаёт новый объект, компонент будет рисоваться на любой action, даже когда данные те же.
  - id: "rafeeq-digibank.5j"
    label: "5j"
    topic: "Управление состоянием"
    title: "Что делает useReducer?"
    body: |
      #### Короткий ответ

      `useReducer(reducer, initialState)` возвращает текущее состояние и `dispatch`. `dispatch` отдаёт action в reducer. Reducer синхронно возвращает следующее состояние. React ставит рендер, если результат не `Object.is` со старым.

      Это локальный механизм одного компонента и тех детей, которым передан `dispatch`. Второй вызов `useReducer` в другом компоненте получает свой state. Общего store, как у Redux, здесь нет.

      Его берут, когда переходов несколько и следующий state зависит от предыдущего целиком. Одно независимое поле проще оставить в `useState`.

      #### Пример кода

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

      #### Фраза на автомате

      `useReducer` хранит локальный state и меняет его через `dispatch` и чистый reducer. Это не общий Redux-store: у каждого вызова своё состояние. Беру его, когда действий несколько и одно поле в `useState` уже путается.
  - id: "rafeeq-digibank.6a"
    label: "6a"
    topic: "Оптимизация приложения"
    title: "Какие меры ты принимаешь при сборке приложения, чтобы его оптимизировать?"
    body: |
      #### Короткий ответ

      На сборке я проверяю, что в браузер уезжает продакшен-сборка: минификация, tree shaking и хеши в именах файлов. Тяжёлые маршруты и виджеты режу на отдельные чанки через динамический `import` и `React.lazy`, чтобы первый экран не тянул весь кабинет.

      Дальше смотрю состав бандла анализатором и убираю вторую копию библиотеки и бочковые импорты, которые ломают tree shaking. Картинки держу в нужном размере. Сжатие ответа, Brotli или gzip, включается на сервере, который отдаёт статику. Source maps наружу не публикую.

      Мемоизация рендера — отдельный слой. Она не уменьшает то, что скачалось при открытии страницы.

      #### Пример кода

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

      #### Фраза на автомате

      Собираю production-бандл, режу маршруты через `React.lazy`, проверяю состав анализатором и не тащу вторые копии библиотек. Сжатие отдаёт сервер. Source maps наружу не кладу.
  - id: "rafeeq-digibank.6b"
    label: "6b"
    topic: "Оптимизация приложения"
    title: "Какой сборщик используешь?"
    note: "Кандидат сказал Vite. Затем спросили, было ли это уже внедрено в проекте."
    body: |
      #### Короткий ответ

      Сборщик называй тот, которым проект собирается сейчас. В этом разговоре кандидат сказал Vite. Следующий вопрос был другим: внедрено ли это уже в проекте, а не знаком ли ты с инструментом.

      Долго Vite работал так: в разработке нативные ESM и трансформы через esbuild, продакшен-бандл собирал Rollup. В Vite 8 оба шага заменены на Rolldown, трансформы — на Oxc. Назови версию из репозитория.

      «Я пользовался Vite» и «этот репозиторий уже собирается Vite» — разные ответы. Если в проекте ещё Webpack, Rsbuild или прямой вызов esbuild, так и скажи. Миграцию, которой в репозитории нет, не записывай.

      #### Фраза на автомате

      Сборщик, который я назову, — Vite. В разработке это быстрый dev-сервер, в Vite 8 прод собирает Rolldown. Отдельно скажу, внедрён ли он уже в этом проекте: если сборка ещё на другом инструменте, назову его, а не план миграции.
  - id: "rafeeq-digibank.6c"
    label: "6c"
    topic: "Оптимизация приложения"
    title: "Знаешь Rsbuild? Знаешь Rspack?"
    note: "Эти названия в расшифровке испорчены, но по контексту подходят Rsbuild и Rspack."
    body: |
      #### Короткий ответ

      В расшифровке названия испорчены. По контексту подходят Rsbuild и Rspack, их и стоит знать.

      Rspack — бандлер на Rust. Конфигурация близка к Webpack: loaders, plugins, в том числе Module Federation. Rsbuild — инструмент сборки поверх Rspack. Он даёт настройки приложения, dev-сервер и официальные плагины, например React, чтобы не собирать конфиг Rspack вручную. Rspack используют и в разработке, и в проде, поэтому поведение ближе между этими режимами, чем у связки ESM в dev и отдельного бандлера в проде.

      На вопрос отвечай раздельно. Rspack — сам бандлер. Rsbuild — обвязка, которой обычно пользуются в приложении.

      #### Пример кода

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

      `defineConfig` и `pluginReact` — слой Rsbuild. Объект `tools.rspack` — уже настройка самого бандлера Rspack.

      #### Фраза на автомате

      Если названия звучат смазанно, я проверяю Rsbuild и Rspack. Rspack — бандлер на Rust, близкий к Webpack. Rsbuild — сборка приложения поверх него, с dev-сервером и плагинами. В приложении я обычно сижу на Rsbuild и при необходимости дописываю конфиг Rspack.
  - id: "rafeeq-digibank.7a"
    label: "7a"
    topic: "Безопасность"
    title: "Какие вопросы безопасности относятся к React и как ты их закрываешь?"
    body: |
      #### Короткий ответ

      Главный риск интерфейса на React — XSS. Текст в JSX React экранирует и кладёт текстовым узлом. HTML из строки, который попадает в DOM в обход этого, уже не экранируется. Туда же относятся запись в `innerHTML` через ref и ссылка с неожиданным протоколом.

      Секреты и токены не кладут в клиентский бандл. Зависимости фиксируют lock-файлом. Если сессия в cookie, у cookie стоят `HttpOnly` и `SameSite`, а мутации API защищены от CSRF на сервере: React это за приложение не сделает. `localStorage` скрипт страницы читает, поэтому сессию туда не кладут, если модель угроз это запрещает. Content-Security-Policy ограничивает, откуда можно выполнить скрипт, и остаётся защитой, даже если строка где-то проскочила.

      #### Фраза на автомате

      В React я оставляю пользовательский текст текстом и не кладу HTML в DOM без очистки. Секреты не попадают в бандл. Сессию держу в HttpOnly cookie, CSRF закрывает сервер, сверху стоит CSP.
  - id: "rafeeq-digibank.7b"
    label: "7b"
    topic: "Безопасность"
    title: "Как предотвратить XSS?"
    body: |
      #### Короткий ответ

      XSS — выполнение чужого скрипта в контексте твоего сайта. В React базовое предотвращение уже есть: `{value}` в JSX становится текстовым узлом, и `<` не разбирается как HTML.

      Дыры появляются там, где это обходят: `dangerouslySetInnerHTML`, `element.innerHTML` в ref, HTML из CMS без очистки. Для таких строк сначала санитайзер, например DOMPurify, и только потом запись в DOM. В ссылке оставляй протоколы `http` и `https` и не рассчитывай, что любая версия React сама отрежет `javascript:`. Content-Security-Policy с узким `script-src` не даёт выполниться инлайну, даже если строка проскочила.

      `HttpOnly` не даёт скрипту прочитать cookie. Запросы от имени пользователя успешный XSS всё равно сможет сделать, поэтому ввод как HTML не исполняют.

      #### Пример кода

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

      `Comment` безопасен для любой строки: теги останутся текстом. `CommentHtml` уже разбирает HTML. Без `DOMPurify.sanitize` эта запись была бы прямым XSS. Если HTML не нужен, второй компонент не пишут.

      #### Фраза на автомате

      Пользовательскую строку я вывожу как текст в JSX: React её экранирует. HTML в DOM кладу только после санитайзера. Ссылки ограничиваю http и https, сверху держу CSP.
  - id: "rafeeq-digibank.7c"
    label: "7c"
    topic: "Безопасность"
    title: "Знаешь dangerouslySetInnerHTML?"
    note: "Он отметил, что этого стоит избегать."
    body: |
      #### Короткий ответ

      `dangerouslySetInnerHTML` — prop, который записывает строку в `innerHTML`. React её не экранирует и не очищает. Имя dangerous буквальное.

      Его избегают. Интервьюер отдельно отметил, что этого стоит избегать, и с этого стоит начать ответ. Пользовательский и редакционный текст выводят как текст, через `{value}`.

      Если продукт правда требует HTML, строку сначала пропускают через санитайзер, и зону ограничивают CSP. Без очистки в строке может быть обработчик или `script`. Тот же риск у `ref`, если вручную записать `element.innerHTML`.

      #### Пример кода

      ```tsx
      export const SafeText = ({ value }: { value: string }) => {
        return <p>{value}</p>;
      };

      export const RawHtml = ({ html }: { html: string }) => {
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      };
      ```

      `SafeText` — обычный путь. `RawHtml` — тот prop, которого избегают: React подставит `html` как разметку. В ответе первым называют отказ от него, не способы им пользоваться.

      #### Фраза на автомате

      Знаю. `dangerouslySetInnerHTML` пишет строку в innerHTML и обходит экранирование React. Я его избегаю и вывожу данные текстом. HTML допущу только после санитайзера и вместе с CSP.
  - id: "rafeeq-digibank.8a"
    label: "8a"
    topic: "TypeScript"
    title: "Знаешь TypeScript?"
    body: |
      #### Короткий ответ

      TypeScript — система типов поверх JavaScript. Годы бери из резюме, не выдумывай. Скажи, где он стоит у тебя: props компонентов, ответы API, слайсы.

      Имеет смысл уметь показать интерфейс и `type`, union и сужение, дженерик, utility types вроде `Partial` и `Omit`, `strictNullChecks`. `any` как способ замолчать ошибку не предлагай. На границе с API тип не утверждают через `as`: данные разбирают проверкой или схемой, и тип получают из этого разбора.

      #### Фраза на автомате

      Да, TypeScript использую на props, на ответах API и на состоянии. Могу показать интерфейсы, union, дженерики, `Partial` и `Omit`. Годы назову по резюме. `any` и голое `as` на данных сети не предлагаю.
  - id: "rafeeq-digibank.8b"
    label: "8b"
    topic: "TypeScript"
    title: "У объекта человека есть личные данные и данные о работе, у каждых свой интерфейс. Как типизировать объект человека обоими интерфейсами, не создавая новый дублирующий тип?"
    note: "Это указывает на пересечение типов через & или на extends."
    body: |
      #### Короткий ответ

      Новый тип с переписанными полями не нужен. Два готовых интерфейса объединяют пересечением или `extends`.

      Пересечение: `type Person = PersonalDetails & JobDetails`. Значение `Person` обязано иметь поля обоих. `&` работает и для `interface`, и для `type`.

      `extends`: `interface Person extends PersonalDetails, JobDetails {}`. Для интерфейсов это то же объединение полей, список заново не пишется. У type alias ключевого слова `extends` нет, там остаётся `&`. Интерфейс не может расширить произвольный union, поэтому для union берут пересечение.

      Оба варианта — то, на что указывает вопрос. Дублирующий тип, где `firstName` и `title` объявлены вручную ещё раз, не предлагай.

      #### Пример кода

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

      `Person` через `&` и `EmployedPerson` через `extends` требуют одни и те же четыре поля. Ни один из них не копирует список полей в новое рукописное объявление.

      #### Фраза на автомате

      Объект человека типизирую пересечением `PersonalDetails & JobDetails` или интерфейсом `extends` от обоих. Поля заново не переписываю. Для type alias беру `&`, для interface могу взять `extends`.
  - id: "rafeeq-digibank.8c"
    label: "8c"
    topic: "TypeScript"
    title: "В типе личных данных есть имя, отчество и фамилия. Нужна только часть полей, и отчество не должно быть обязательным. Как типизировать это, не помечая поля необязательными вручную, через utility types или дженерики?"
    note: "Был назван Omit. Интервьюер также указал на Partial."
    body: |
      #### Короткий ответ

      Вручную `middleName?:` не ставят. Часть полей оставляют utility types, обязательность снимает `Partial`.

      Был назван `Omit`. `Omit<PersonalDetails, "lastName">` убирает фамилию и оставляет имя и отчество, при этом оба остаются обязательными. Это ответ на «только часть полей». Одного `Omit` мало для второй половины вопроса: он не делает отчество необязательным.

      Интервьюер указал на `Partial`. `Partial<PersonalDetails>` делает все поля необязательными, включая отчество, и не заставляет писать `?` руками. Фамилию он при этом не выкидывает.

      Вместе: `Partial<Omit<PersonalDetails, "lastName">>` убирает фамилию и снимает обязательность с оставшихся, так что отчество не обязательно. Если имя и фамилия должны остаться обязательными, а необязательно только отчество: `Omit<PersonalDetails, "middleName"> & Partial<Pick<PersonalDetails, "middleName">>`. Оба построения используют `Omit` и `Partial`.

      #### Пример кода

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

      `SomeNames` не содержит `lastName`, а `firstName` и `middleName` в нём необязательны. `NameWithOptionalMiddle` требует имя и фамилию. Отчество можно не передавать: его добавили через `Partial`, не через рукописный `middleName?:`.

      #### Фраза на автомате

      Часть полей беру через `Omit`, обязательность отчества снимаю через `Partial`, без ручного `?`. Одного `Omit` мало: он выкидывает ключи, но не делает поле необязательным. `Partial<Omit<PersonalDetails, "lastName">>` оставляет имя и необязательное отчество.
  - id: "rafeeq-digibank.9a"
    label: "9a"
    topic: "Оптимизация перерисовок Redux"
    title: "Ты кладёшь ответ API в Redux и читаешь его через useSelector. Перерисуется ли компонент, когда данные изменятся?"
    body: |
      #### Короткий ответ

      Да, когда меняется то, что вернул селектор. `useSelector` подписывает компонент на store и по умолчанию сравнивает прошлый и новый результат через `===`. Новый объект ответа в store даст рендер. Другое поле, которое селектор не возвращает, рендер не даст, пока ссылка результата та же.

      Если селектор каждый вызов создаёт объект или массив, ссылка всегда новая. Тогда компонент рисуется на любой `dispatch`, даже когда нужные данные те же. Выбор всего ответа API означает: любое изменение этого ответа, которое заменило его объект, перерисует компонент.

      #### Пример кода

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

      Замена `personal` новым объектом перерисует карточку. Замена `address` не перерисует, если ссылка `personal` осталась той же. Селектор `state => state.profile` потеряет это различие: любой новый `profile` станет новой ссылкой.

      #### Фраза на автомате

      Перерисуется, если селектор вернул новую ссылку. Я выбираю кусок, который компоненту нужен, а не весь ответ. Новый объект из селектора на каждый вызов заставит рисоваться даже при тех же данных.
  - id: "rafeeq-digibank.9b"
    label: "9b"
    topic: "Оптимизация перерисовок Redux"
    title: "Ты фильтруешь и сортируешь эти данные, а компонент использует только часть, например личные данные. Как не дать ему перерисовываться, когда меняются другие части, вроде банковских данных или адреса? Через Redux Toolkit или иначе."
    note: "Подсказка интервьюера: в Redux Toolkit есть функция для этого. Имеются в виду createSelector и мемоизированные селекторы."
    body: |
      #### Короткий ответ

      Компоненту нужен стабильный результат селектора. Фильтр и сортировка внутри обычного `useSelector` возвращают новый массив на каждый вызов, и сравнение по ссылке всегда проигрывает. Компонент рисуется, даже когда изменились банковские данные или адрес.

      В Redux Toolkit для этого есть `createSelector`. Это мемоизированные селекторы. Подсказка интервьюера про функцию Toolkit указывает сюда. Входные селекторы читают куски state. Функция результата считается заново только когда эти входы изменились по ссылке. Пока `personal` тот же объект, `createSelector` возвращает прошлый массив, `useSelector` видит ту же ссылку и рендер не ставит. Изменение `address` или `bank`, которое не заменило `personal`, компонент с личными данными не рисует.

      У `createSelector` кэш на один набор аргументов. Для селектора без параметров одна функция на модуль подходит. Новый объект прямо в `useSelector` эту память обходит.

      #### Пример кода

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

      `sort` идёт по новому массиву из двух строк, state он не мутирует. Пока `selectPersonal` возвращает ту же ссылку, `selectPersonalView` отдаёт прошлый массив. Смена `bank` или `address` до этой карточки не доходит.

      #### Фраза на автомате

      Фильтр и сортировку выношу в `createSelector` из Redux Toolkit. Это мемоизированный селектор: новый массив считается, только когда изменились входные данные, например личные. Смена адреса при том же `personal` оставляет ту же ссылку, и `useSelector` рендер не ставит.
  - id: "rafeeq-digibank.9c"
    label: "9c"
    topic: "Оптимизация перерисовок Redux"
    title: "Если не Redux Toolkit, как решить это обычными средствами React?"
    body: |
      #### Короткий ответ

      Без Redux Toolkit рендер отсекают на подписке, до вызова компонента.

      Селектор возвращает уже лежащий в store объект личных данных: `(state) => state.profile.personal`. Пока reducer не заменил `personal`, ссылка та же, и смена адреса компонент не рисует. Если нужно собрать объект из полей, вторым аргументом `useSelector` передают `shallowEqual` из `react-redux`. Он сравнивает ключи результата. Те же `firstName` и `lastName` — рендера нет.

      `useMemo` эту подписку не заменяет: он выполняется уже внутри рендера. `React.memo` на этом компоненте тоже не отписывает его от store. Подписка внутри него, родитель ни при чём.

      #### Пример кода

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

      `FromStore` сравнивает ссылку `personal`. `Picked` каждый раз создаёт объект, и `shallowEqual` смотрит поля. Смена `address` оба компонента пропускает. `React.memo` вокруг них на эту подписку не влияет.

      #### Фраза на автомате

      Без Toolkit селектор возвращает сам объект `personal` из store. Пока ссылка та же, адрес компонент не рисует. Если я собираю новый объект из полей, передаю в `useSelector` вторым аргументом `shallowEqual`. `useMemo` после подписки рендер уже не отменяет.
  - id: "rafeeq-digibank.9d"
    label: "9d"
    topic: "Оптимизация перерисовок Redux"
    title: "Предложен useMemo, но данные приходят из селектора. Разве компонент к этому моменту уже не перерисовался?"
    body: |
      #### Короткий ответ

      Да. К моменту `useMemo` компонент уже рендерится. `useSelector` вызывается в теле функции. Если он вернул новую ссылку, React уже выполняет этот рендер. `useMemo` может не пересчитывать значение, но вызов компонента он не отменяет.

      Пропуск рендера делается раньше. Результат селектора должен быть той же ссылкой, что в прошлый раз, либо пройти функцию равенства вроде `shallowEqual`. Иначе `useMemo` стоит слишком поздно. Узкий селектор или мемоизированный `createSelector` не пускает в этот компонент рендер из-за адреса.

      #### Пример кода

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

      Смена `address` заменяет `profile`. `useSelector` видит новую ссылку и вызывает компонент. `useMemo` выполняется уже в этом вызове. Он не возвращает время назад к решению «не рендерить».

      #### Фраза на автомате

      Да, к `useMemo` компонент уже перерисовался. `useSelector` вернул новую ссылку, и вызов функции уже идёт. `useMemo` только не пересчитывает значение внутри. Чтобы рендера не было, селектор должен вернуть ту же ссылку или пройти свою функцию равенства.
  - id: "rafeeq-digibank.10a"
    label: "10a"
    topic: "API"
    title: "Работаешь с REST, SOAP или другими видами API?"
    body: |
      #### Короткий ответ

      REST — основной вид: ресурсы, методы HTTP, JSON, коды статуса. SOAP — XML-конверт и операция по WSDL, чаще на старых банковских сервисах. GraphQL — запрос, в котором клиент сам называет поля. Рядом бывают gRPC и WebSocket, если контракт бинарный или это поток.

      Назови то, что реально интегрировал. Для UI DigiBank обычный ответ — REST, и отдельно GraphQL, если он был на проекте. Чтение WSDL не называй ежедневной работой, если его не было.

      #### Фраза на автомате

      В основном я работаю с REST. SOAP разбирал, когда сервис отдавал XML по WSDL. GraphQL беру, когда клиент сам выбирает поля. gRPC или WebSocket назову только если они были в проекте.
  - id: "rafeeq-digibank.10b"
    label: "10b"
    topic: "API"
    title: "Когда данных много, есть ли вид API, который позволяет забрать только нужные поля? Что это?"
    note: "Ответ, которого он ждал, — GraphQL. Он отдельно сказал, что пагинация — это другое."
    body: |
      #### Короткий ответ

      Ожидаемый ответ — GraphQL. Клиент посылает запрос с набором полей и получает только их, включая вложенные объекты. Это вид API, который забирает нужные поля, а не весь ресурс, как типичный REST. SOAP тоже отдаёт сообщение, описанное в WSDL, а не произвольный набор полей.

      Пагинация — другая тема. Интервьюер отдельно сказал, что это другое. Она ограничивает число записей: страница, `limit` и `offset`, курсор `first` и `after`. Она не выбирает, какие поля у каждой записи вернутся. Пагинация есть и у REST, и у GraphQL. На вопрос «забрать только нужные поля» пагинацией не отвечают.

      У части REST-сервисов бывает свой параметр `fields`. Это частный приём конкретного API. Тип, которого ждали здесь, — GraphQL.

      #### Пример кода

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

      Первый запрос выбирает поля `firstName` и `lastName`. Это ответ на вопрос. Второй ограничивает страницу аргументами `first` и `after`. Это уже пагинация, даже хотя внутри него тоже есть набор полей. `GET /clients?page=2&limit=20` в REST тоже только пагинация: поля ресурса по-прежнему задаёт сервер.

      #### Фраза на автомате

      Это GraphQL: в запросе я перечисляю нужные поля и получаю только их. Пагинация — отдельная тема, она режет число записей, а не состав полей. `limit` и страница на этот вопрос не отвечают.
  - id: "rafeeq-digibank.11a"
    label: "11a"
    topic: "Микрофронтенды / Module Federation"
    title: "В DBS в основном Module Federation и архитектура микрофронтендов. Сколько лет ты с этим работал и на скольких проектах?"
    body: |
      #### Короткий ответ

      Снова каркас на одну-две минуты. Годы и число проектов бери только из резюме. Чужой стаж и чужие цифры не присваивай.

      Скажи, сколько лет ты работал с Module Federation и на скольких проектах. Одной фразой: это был host, remote или оба. Один результат: независимый релиз модуля, меньший shell или отдельная команда на домене. Если таких проектов не было, так и скажи.

      Модель всё равно можно назвать своими словами. Host грузит `remoteEntry`, remote отдаёт модуль, React делят одним экземпляром. Это устройство, не биография.

      #### Фраза на автомате

      С Module Federation я работал столько лет и на стольких проектах, сколько могу показать по резюме. Роль назову прямо: host, remote или оба. Один результат тоже из резюме. Если внедрения не было, так и скажу и разберу host, remoteEntry и общий React как модель.
  - id: "rafeeq-digibank.11b"
    label: "11b"
    topic: "Микрофронтенды / Module Federation"
    title: "Ты работал над host-приложением или над remote?"
    body: |
      #### Короткий ответ

      Host — приложение-оболочка. Ему принадлежит документ, навигация и слоты, куда подставляются чужие модули. Remote — отдельно собранное приложение. Оно отдаёт один или несколько модулей и страницей целиком не владеет.

      Отвечай по своей роли и не выдумывай проект. Если писал виджет, который подключали в shell, это remote. Если собирал shell и регистрировал чужие модули, это host. Если делал оба, скажи, что было основным, и одну обязанность каждого.

      Host в конфиге указывает `remotes` и адрес `remoteEntry.js`. Remote в `exposes` называет публичное имя модуля и файл, который за ним стоит.

      #### Фраза на автомате

      Я работал на remote, если отдавал модуль в shell, или на host, если подключал чужие `remoteEntry`. Если были обе стороны, назову основную. Проект и годы возьму из резюме, не из чужого рассказа.
  - id: "rafeeq-digibank.11c"
    label: "11c"
    topic: "Микрофронтенды / Module Federation"
    title: "Зачем для проекта сделали отдельный микрофронтенд и как его встроили в host?"
    body: |
      #### Короткий ответ

      Отдельный микрофронтенд делают, когда у домена свой релиз и своя команда. Shell не пересобирают из-за каждого изменения этого домена. Типичная зона — карты, переводы, выписки: то, что живёт отдельно от каркаса. Конкретный домен бери из своего проекта. Если отдельного MFE не делал, опиши схему как устройство и не придумывай имя системы.

      Встройка устроена так. Remote в `exposes` называет модуль и файл входа, сборка публикует `remoteEntry.js`. Host в `remotes` указывает имя и адрес этого файла. В маршруте host лениво импортирует модуль и рисует его в своём дереве. Общий React задают в `shared`, иначе у shell и модуля будут два React.

      Если remote сам вызывает `createRoot` на переданном узле, это уже второй корень. Тогда props или store передают в функцию монтирования, а не рассчитывают на Provider оболочки.

      #### Пример кода

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

      #### Фраза на автомате

      Отдельный микрофронтенд нужен, когда у команды свой релиз и shell не должен пересобираться вместе с ней. Remote публикует `remoteEntry` и `exposes`, host указывает его в `remotes` и рисует ленивый импорт в слоте. React делят через `shared`. Домен назову только если он был моим.
  - id: "rafeeq-digibank.11d"
    label: "11d"
    topic: "Микрофронтенды / Module Federation"
    title: "Как это настроено: как host подхватывает remote и как remote отдаёт модули?"
    body: |
      #### Короткий ответ

      Host забирает remote через `remotes`: ключ — имя, значение — `имя@URL` до `remoteEntry.js`. Имя до `@` совпадает с `name` у remote. Дальше host делает `import("cards/CardsApp")`. `cards` — имя remote, `CardsApp` — ключ из `exposes`.

      Remote задаёт `name`, `filename: "remoteEntry.js"` и `exposes`: публичное имя модуля и локальный файл. Оба конфига перечисляют `shared`. Для React это `singleton`, чтобы загрузилась одна копия.

      Те же поля — `name`, `remotes`, `exposes`, `shared` — есть у `ModuleFederationPlugin` в Webpack и у плагина Module Federation для Rsbuild. Меняется обвязка, не смысл.

      #### Пример кода

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

      Верхний вызов — remote, нижний — host. Строка `cards@https://...` связывает имя в `import("cards/CardsApp")` с адресом `remoteEntry.js`.

      #### Фраза на автомате

      Remote отдаёт модуль через `exposes` и файл `remoteEntry.js`. Host пишет его в `remotes` как `cards@url` и импортирует `cards/CardsApp`. React и react-dom оба кладут в `shared` с `singleton`, чтобы экземпляр был один.
  - id: "rafeeq-digibank.11e"
    label: "11e"
    topic: "Микрофронтенды / Module Federation"
    title: "Микрофронтенд отдавал одну возможность или несколько возможностей или маршрутов?"
    body: |
      #### Короткий ответ

      Оба варианта возможны. Один ключ в `exposes` — одна возможность, например виджет карт. Несколько ключей или один модуль маршрутов — несколько возможностей или маршрутов. Remote не обязан быть ровно одним экраном.

      Скажи, как было у тебя, и не выдумывай число экранов. Если отдавал один вход, назови его. Если отдавал набор маршрутов, скажи, что shell монтировал модуль маршрутов, а переходы жили внутри remote.

      #### Пример кода

      ```js
      const oneFeature = {
        "./CardsApp": "./src/CardsApp",
      };

      const severalFeatures = {
        "./CardsApp": "./src/CardsApp",
        "./Routes": "./src/Routes",
      };
      ```

      `oneFeature` — один вход. `severalFeatures` — виджет и отдельно маршруты. Shell импортирует тот ключ, который ему нужен.

      #### Фраза на автомате

      Мой remote отдавал одну возможность, если в `exposes` был один модуль, или несколько, если там был набор ключей или модуль маршрутов. Как было в проекте, так и скажу, без выдуманного числа экранов.
  - id: "rafeeq-digibank.11f"
    label: "11f"
    topic: "Микрофронтенды / Module Federation"
    title: "Как разделить данные между host и remote? Zustand или Redux?"
    body: |
      #### Короткий ответ

      Делить данные можно и через Zustand, и через Redux. Условие одно: экземпляр store должен быть общим. Два store сами не синхронизируются.

      Узкий контракт проще пропом. Host передаёт в экспортированный компонент `userId`, локаль и колбэки. Remote в чужой store не лезет.

      Если состояние уже в shell, общим делают модуль store. Zustand: модуль с `create` помечают shared singleton, host и remote импортируют один хук. Redux: один store, и remote должен видеть тот же `Provider`. Для этого `react` и `react-redux` тоже singleton. Иначе контекст Provider remote не увидит.

      Если remote поднимает свой `createRoot`, Provider оболочки его не оборачивает. Тогда в `mount` передают props или тот же объект store и ставят Provider уже внутри remote. События на `window` — запасной канал для редкого сигнала, не для постоянной копии профиля.

      #### Пример кода

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

      `CardsApp` получает данные аргументом, store ему не нужен. `useSession` делит состояние только если host и remote загрузили этот модуль одним singleton. Второй `create` в другой копии файла — уже другой store.

      #### Фраза на автомате

      Узкий контракт я передаю пропом из host в remote. Если нужен общий store, беру один экземпляр Zustand или Redux и шарю модуль как singleton, вместе с `react` и `react-redux`. Два отдельных store данные сами не разделят.
  - id: "rafeeq-digibank.11g"
    label: "11g"
    topic: "Микрофронтенды / Module Federation"
    title: "Какой подход был в последнем или текущем проекте и как host и микрофронтенд общались?"
    body: |
      #### Короткий ответ

      Назови канал, который был в последнем или текущем проекте, и один кусок данных. Систему не выдумывай.

      Три рабочих варианта. Host передаёт данные пропом в модуль remote и получает действия колбэком. Оба импортируют один singleton-store, Redux или Zustand, и читают свои селекторы. Редкий сигнал, например «сессия истекла», идёт событием. Постоянные данные через событие не гоняют.

      Если проекта с микрофронтендами не было, так и скажи. Затем назови вариант, который выберешь: props для узкого контракта, общий store если shell уже на Redux.

      #### Пример кода

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

      Host рендерит `<CardsApp userId={id} onOpen={openCard} />`. Данные идут вниз, действие возвращается колбэком. Это и есть разговор host и микрофронтенда без второго store.

      #### Фраза на автомате

      В последнем проекте я назову фактический канал: props, общий store или редкое событие, и что именно передавалось, например userId. Если такого проекта не было, выберу props для узкого контракта и общий Redux-store, если shell им уже владеет.
  - id: "rafeeq-digibank.11h"
    label: "11h"
    topic: "Микрофронтенды / Module Federation"
    title: "Если host на React 17, а remote обновили до React 19, будут ли конфликты?"
    body: |
      #### Короткий ответ

      Да, конфликты будут. Host на React 17 и remote, собранный на React 19, расходятся и по экземпляру, и по API. Хуки привязаны к тому React, который сделал рендер. Вторая копия даёт invalid hook call и два контекста. Код, собранный под React 19, вызывает API, которых в React 17 нет.

      Это снимают вместе singleton и строгим выравниванием версии, не одним из двух. `singleton: true` на `react` и `react-dom` загружает одну копию. `requiredVersion` и `strictVersion: true` не дают молча подставить несовместимую версию: загрузка падает, а не рисует сломанные хуки. Пока remote собран против React 19, а в shared лежит React 17, singleton не превращает код 19 в код для 17. Remote пересобирают на версии host, либо оба переводят на одну мажорную версию.

      #### Пример кода

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

      `^17.0.2` не принимает сборку, которой нужен React 19. `strictVersion` превращает это несовпадение в ошибку загрузки. Один экземпляр React 17 появляется только после того, как remote тоже собран на 17.

      #### Фраза на автомате

      Конфликт будет: React 19 внутри host на React 17 ломает хуки, даже если случайно загрузились две копии. Я задаю `singleton` для `react` и `react-dom`, ставлю один `requiredVersion` и `strictVersion`, и держу одну мажорную версию на обеих сторонах. Одну сторону до 19 не поднимаю.
  - id: "rafeeq-digibank.11i"
    label: "11i"
    topic: "Микрофронтенды / Module Federation"
    title: "Ты упомянул singleton. Что он делает, как его настроить и где он задаётся: в host или в remote?"
    body: |
      #### Короткий ответ

      `singleton` в `shared` заставляет Module Federation держать один экземпляр модуля. Второй запрос `react` берёт уже загруженную копию, а не вложенную копию remote. Так хуки и контекст совпадают. `requiredVersion` задаёт допустимый semver. `strictVersion: true` не разрешает тихо использовать версию вне этого диапазона.

      Задаётся в `shared` и у host, и у remote. Если флаг стоит только на одной стороне, вторая может забандлить свой React. Host отдаёт экземпляр: у него `singleton`, `requiredVersion`, `strictVersion` и обычно `eager: true`, чтобы React попал в общую область до выполнения remote. Remote объявляет те же `singleton` и `requiredVersion` без `eager`, чтобы не утащить вторую копию в свой стартовый чанк.

      Рядом с `react` так же помечают `react-dom`. Иначе разъедутся рендерер и хуки. Имя ключа — имя пакета, не путь к файлу.

      #### Пример кода

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

      `hostShared` кладут в plugin host. `eager` включает React в стартовый чанк оболочки. `remoteShared` кладут в plugin remote, без `eager`, чтобы модуль взял копию host.

      #### Фраза на автомате

      Singleton держит один экземпляр `react` в общей области, чтобы remote не привёз свою копию. Я задаю его в `shared` на host и на remote. На host добавляю `eager`, `requiredVersion` и `strictVersion`. На remote те же `singleton` и версия, без `eager`. Так же помечаю `react-dom`.
  - id: "rafeeq-digibank.11j"
    label: "11j"
    topic: "Микрофронтенды / Module Federation"
    title: "Если микрофронтендов около десяти и один падает, как не дать ему сломать остальные?"
    note: "Ожидаемые ответы — механизмы fallback и error boundaries."
    body: |
      #### Короткий ответ

      Ожидаемые ответы — fallback и error boundaries. Около десяти микрофронтендов сажают в слоты оболочки, и у каждого слота своя граница и свой fallback. Падение одного ловит граница этого слота и рисует fallback. Оболочка и остальные девять остаются на экране. Без своей границы ошибка поднимается выше и может снять дерево до корня: shell станет пустым.

      Error boundary — классовый компонент с `getDerivedStateFromError`. В `render` он возвращает fallback. `componentDidCatch` пишет лог. Отклонённый `import()` у `React.lazy`, в том числе упавший `remoteEntry`, тоже попадает в эту границу. `Suspense` fallback — экран загрузки, он не заменяет fallback ошибки. Нужны оба: один, пока модуль едет, второй, когда он упал.

      Граница не ловит ошибку в обработчике клика и в произвольном промисе. Там свой `try/catch`. Для «один из десяти сломал shell» отвечают границей и fallback на каждый remote.

      #### Пример кода

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

      `MfeBoundary` стоит вокруг одного слота. Девять таких же слотов снаружи этой границы не размонтируются. Верхний fallback — ошибка, внутренний — загрузка.

      #### Фраза на автомате

      У каждого из десяти слотов свой error boundary и свой fallback. Упавший микрофронтенд показывает fallback в своём слоте, оболочка и остальные остаются. `Suspense` fallback — только загрузка. Ошибку рендера и срыв `remoteEntry` ловит граница.
---

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
    topic: "Знакомство и опыт по проектам"
    title: "Начни с представления, пока я смотрю резюме."
    body: |
      #### Короткий ответ

      Это каркас устного ответа на одну-две минуты. Биографию конкретного человека сюда не подставляют: имя, годы, работодателя и название проекта говоришь ты по своему резюме.

      Четыре слота, в этом порядке. Роль: фронтенд и какой слой интерфейса ты ведёшь. Стек: React и то, что рядом с ним у тебя на самом деле. Один проект: домен и твоя зона, одним-двумя предложениями. Один измеримый результат: цифра, которую ты можешь объяснить. Нет своей цифры — не занимай слот чужой.

      #### Фраза на автомате

      Я фронтенд-разработчик, в ежедневной работе у меня React. Стек назову тот, что был на проекте, а не общий список из вакансии. Дальше беру один проект и говорю, за какую часть интерфейса отвечал я. В конце называю один измеримый результат своими словами и могу сразу разобрать, как он получился.
  - id: aravind-digibank.1b
    label: "1b"
    topic: "Знакомство и опыт по проектам"
    title: "Над каким проектом ты работал в EPAM?"
    note: "Затем он подтвердил стек: React, Cypress для тестов, Agile/Scrum, больше трёх лет с React."
    body: |
      #### Короткий ответ

      Проект ты называешь фактами, которые можно сказать вслух: домен, тип продукта и что в нём делал ты. Секретное имя заказчика и внутренний коднейм ты не раскрываешь и не заменяешь выдуманной историей клиента. Хватает формулы «продукт в таком-то домене, моя зона — такие-то экраны».

      В том же ответе подтверждаешь стек, который на этом разговоре уже прозвучал. React — интерфейс. Cypress — тесты в браузере по сценариям экранов, не замена модульным тестам. Agile/Scrum — как команда вела итерации: план, короткий цикл, демо. Больше трёх лет — срок работы с React, его называешь отдельно от названия одного проекта.

      #### Фраза на автомате

      Проект в EPAM я называю по домену и своей зоне, без секретного имени заказчика и без выдуманной истории клиента. Стек подтверждаю так: React, Cypress для тестов, Agile/Scrum, с React больше трёх лет.
  - id: aravind-digibank.1c
    label: "1c"
    topic: "Знакомство и опыт по проектам"
    title: "Была ли в React конкретная сложность и как ты её решил? Это может быть производительность, SEO или что-то ещё."
    body: |
      #### Короткий ответ

      Берёшь одну сложность, которую ты реально закрывал, и разбираешь механизм. Чужой проект и чужой процент сюда не подставляют.

      Частый случай по производительности: поле ввода и тяжёлый список живут в одном компоненте. Каждый символ меняет state, и React заново рисует список, хотя строкам этот текст не нужен. Список ты выносишь в отдельный компонент, оборачиваешь в `memo` и не передаёшь туда текст поля. Родитель по-прежнему хранит строку поиска. У списка нет пропсов, которые меняются вместе с ней, поэтому `memo` пропускает этот рендер. Если строк очень много, следующим шагом ты рисуешь только видимое окно.

      Для SEO механизм другой. Страница, которая появляется только после JavaScript в браузере, отдаёт пустой HTML. Публичный экран ты отдаёшь уже собранным документом: серверный рендер или пререндер этого маршрута. Интерактив, которому нужен браузер, остаётся на клиенте.

      #### Пример кода

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

      `query` живёт в `SearchPage`. `HeavyList` не получает эту строку, поэтому смена текста не проходит проверку пропсов списка.

      #### Фраза на автомате

      Поле поиска жило рядом с тяжёлым списком, и каждый символ перерисовывал список. Я вынес список в `memo` и не передал ему текст поля. Если вопрос про SEO, публичную страницу я отдаю готовым HTML, а не пустым корнем после загрузки скрипта.
  - id: aravind-digibank.2a
    label: "2a"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Сделай debounce-хук для поля поиска, который вызывает API по мере ввода. Достаточно примера хука и использования в App.js внизу, с функцией-заглушкой вместо настоящего API."
    body: |
      #### Короткий ответ

      Хук `useDebounce(value, delay)` принимает текущий текст и задержку в миллисекундах. Оба значения приходят аргументами. Внутри `useEffect` ставит `setTimeout`, а в cleanup вызывает `clearTimeout` с id этого таймера. Предыдущий ввод не доживает до запроса. `delay` — параметр хука, эффект замыкает это число.

      `App` внизу вызывает хук на рендере: `useDebounce(inputValue, 300)`. Второй эффект смотрит уже на отложенную строку и вызывает `searchApi`. Это заглушка: она возвращает строку через `Promise.resolve` и не ходит в сеть. Пока отложенная строка пустая, заглушка не вызывается.

      Строк 12 и 17 в PDF нет: интервьюер смотрит в редактор кандидата. Пример ниже — разбор условия, реконструкция хука и `App.js`, а не копия того экрана.

      #### Пример кода

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

      #### Фраза на автомате

      `useDebounce` принимает значение и задержку. В эффекте я ставлю `setTimeout` и в cleanup вызываю `clearTimeout`. В `App` передаю текст поля и 300 мс, а заглушку `searchApi` вызываю уже с отложенной строкой.
  - id: aravind-digibank.2b
    label: "2b"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "А очистка таймера? Интервал ведь продолжит работать?"
    body: |
      #### Короткий ответ

      Без очистки предыдущий таймер доработает и вызовет отложенное обновление. В этом хуке это не `setInterval`, а новый `setTimeout` на каждый ввод. Слово «интервал» здесь про то, что старые срабатывания продолжают жить, если их не отменить.

      Ты сохраняешь id, который вернул `setTimeout`, и в cleanup эффекта вызываешь `clearTimeout(timerId)`. Cleanup идёт перед следующим запуском эффекта и при размонтировании. Новый символ меняет `value`, старый id снимается, новый таймер замыкает уже новый текст. До заглушки доходит пауза длиной `delay`, а не каждый символ.

      Если код правда вызвал `setInterval`, его останавливает `clearInterval`. Для debounce нужен `clearTimeout`.

      Пример ниже — разбор условия: cleanup того же хука, не строка из PDF.

      #### Пример кода

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

      #### Фраза на автомате

      Я храню id от `setTimeout` и в cleanup эффекта вызываю `clearTimeout`. Без этого старые таймеры доходят до обновления. Это не интервал: снимается конкретный таймер прошлого ввода.
  - id: aravind-digibank.2c
    label: "2c"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Таймер есть, но куда передаются значения и как хук вообще будет вызываться?"
    body: |
      #### Короткий ответ

      Значение и задержка входят аргументами в момент вызова хука. Вызов стоит в теле компонента и происходит на рендере: `useDebounce(inputValue, 300)`. Из колбэка `setTimeout` хук вызывать нельзя: правила хуков требуют один и тот же порядок на верхнем уровне компонента.

      Дальше `value` живёт в замыкании эффекта. `value` и `delay` стоят в массиве зависимостей. Когда поле меняется, React сначала снимает прошлый таймер, потом ставит новый и замыкает новый текст. Наружу хук отдаёт отложенную строку. Уже её второй эффект передаёт в заглушку.

      Пример ниже — разбор условия. Экрана с этим вызовом в PDF нет.

      #### Пример кода

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

      #### Фраза на автомате

      Хук я вызываю из компонента на рендере: `useDebounce(inputValue, 300)`. Текст и задержка входят аргументами, таймер внутри эффекта замыкает их и снимается через `clearTimeout`.
  - id: aravind-digibank.2d
    label: "2d"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "На строке 12 ты только объявил значение поля. Как оно будет использоваться в программе? Допиши."
    body: |
      #### Короткий ответ

      Строки 12 в PDF нет. Это строка с экрана кандидата. Одного `useState` мало: объявленная строка ещё ни к чему не подключена.

      Поле ты делаешь контролируемым. `value` читает `inputValue`, `onChange` пишет `event.target.value` обратно в state. Ту же `inputValue` ты передаёшь в `useDebounce` вместе с задержкой. Отложенный результат стоит в зависимостях второго эффекта, и уже этот эффект вызывает заглушку `searchApi`. Пока цепочка «поле → state → хук → заглушка» не собрана, объявление в программе не участвует.

      Пример ниже — разбор условия, реконструкция использования этого значения.

      #### Пример кода

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

      #### Фраза на автомате

      `inputValue` — это `value` поля и первый аргумент `useDebounce`. `onChange` записывает ввод, а заглушка получает уже отложенную строку.
  - id: aravind-digibank.2e
    label: "2e"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "useDebounce принимает только значение поля, а внизу ты возвращаешь метод debounce со строки 17 вместе с delay. Не будет ли delay каждый раз undefined?"
    body: |
      #### Короткий ответ

      Строки 17 в PDF нет. Это строка с экрана кандидата. Да: в той форме `delay` каждый раз `undefined`.

      `useDebounce` принимает только значение поля и возвращает метод. У метода `delay` есть как собственный параметр, но вызов `debounce(fn)` второй аргумент не передаёт. Хук своего `delay` не имеет, поэтому возвращаемая функция не замыкает число. В `setTimeout` уходит `undefined`, а браузер читает такую задержку как `0`. Поиск срабатывает сразу.

      Если имя `delay` вообще нигде не объявлено, в строгом режиме будет `ReferenceError`, не тихий `undefined`. Формулировка «каждый раз undefined» совпадает с пропущенным аргументом: параметр есть у возвращаемого метода, а значения ему не передали.

      Починка: `delay` становится параметром хука. Возвращаемая функция замыкает это число, вызов выглядит как `useDebounce(inputValue, 300)`. Для поля поиска та же починка — хук значения: эффект ставит таймер с этим `delay`, наружу идёт отложенная строка, заглушка вызывается уже с ней.

      Пример ниже — разбор условия, реконструкция, не строка 17 из PDF.

      #### Пример кода

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

      В первом фрагменте второй параметр метода не передан, поэтому `delay` равен `undefined`. Во втором метод замыкает `delay` хука, в таймер попадает `300`. Третий фрагмент — хук для поля поиска: задержка тоже параметр, таймер снимается через `clearTimeout`.

      #### Фраза на автомате

      Да, `delay` был `undefined`: хук принимал только текст и возвращал метод без замкнутого числа. Я добавляю `delay` в параметры `useDebounce`, и `setTimeout` ждёт это число, а не ноль.
  - id: aravind-digibank.3a
    label: "3a"
    topic: "Управление состоянием: Context API и Redux"
    title: "В чём разница между Context API и Redux и что для какого приложения выбирать?"
    body: |
      #### Короткий ответ

      Context API передаёт значение вниз по дереву без прокидывания пропсов через каждый уровень. Провайдер держит value, потомок читает его через `useContext`. Это не store с действиями и редюсерами. Новое значение контекста обновляет компоненты, которые этот контекст читают.

      Redux держит состояние вне дерева. Изменение идёт действием через редюсер, побочный эффект забирает middleware, компонент подписывается на срез через селектор. Отсюда журнал действий и возможность не будить тех, кому этот срез не нужен.

      Context ты берёшь для редких значений на всё дерево: тема, локаль, текущий пользователь. Redux ты берёшь, когда срезов много, обновления частые и нужны middleware. Маленький экран с парой флагов на Context в Redux не переносят заранее.

      #### Фраза на автомате

      Context передаёт редкие значения вниз по дереву, и потребители обновляются вместе с этим значением. Redux — store: действие, редюсер, middleware и селектор на срез. Тему и сессию я держу в Context, частые сущности и запросы — в Redux.
  - id: aravind-digibank.3b
    label: "3b"
    topic: "Управление состоянием: Context API и Redux"
    title: "Для админского дашборда как решить, лучше Context API или Redux?"
    body: |
      #### Короткий ответ

      Смотри, как часто состояние меняется и кто из-за этого перерисуется. Надпись «админка» сама библиотеку не выбирает.

      Context уместен, если общих значений мало и они меняются редко: кто вошёл, локаль, тема. Одно большое value на фильтры, строки таблиц и выбранные id обновляет всех потребителей, даже тот экран, который показывает другой срез.

      Redux уместен, когда сущностей много, фильтр и выборка живут отдельно, запросы идут через middleware, а компоненту нужен один срез. Селектор ограничивает подписку.

      Оба можно развести на одном дашборде: Context для сессии и темы, Redux для таблиц и кэша. Критерий — частота обновлений, число независимых срезов и нужна ли подписка на часть данных.

      #### Фраза на автомате

      В админке я кладу в Context сессию и тему, а частые срезы таблиц и кэш — в Redux, чтобы ввод в фильтр не перерисовывал всё дерево. Решает частота обновлений и то, читает ли компонент один срез.
  - id: aravind-digibank.3c
    label: "3c"
    topic: "Управление состоянием: Context API и Redux"
    title: "Работал с какими-нибудь middleware для Redux?"
    note: "Названы Redux Observable и Redux Thunk."
    body: |
      #### Короткий ответ

      Да. Два middleware, которые здесь называют по делу: Redux Thunk и Redux Observable.

      Redux Thunk стоит в цепочке `dispatch` и разрешает диспатчить функцию, а не только объект действия. Функция получает `dispatch` и `getState`. Внутри ты делаешь запрос и по результату диспатчишь обычные действия. Так в классическом Redux устроены асинхронные API: редюсер остаётся синхронным, побочный эффект живёт в thunk.

      Redux Observable тоже middleware, но побочный эффект у него — поток RxJS. Epic принимает поток действий и возвращает поток действий. Так собирают отмену предыдущего запроса, debounce и повтор, когда сценарий длиннее одного `then`. Новое действие отменяет устаревший запрос оператором вроде `switchMap`.

      Thunk ты называешь для обычного запроса. Observable — когда действия удобнее обрабатывать как поток.

      #### Фраза на автомате

      С Redux я работал через Redux Thunk и Redux Observable. Thunk диспатчит функцию: внутри запрос, потом обычное действие. Observable обрабатывает действия как поток RxJS и может отменить предыдущий запрос через `switchMap`.
  - id: aravind-digibank.3d
    label: "3d"
    topic: "Управление состоянием: Context API и Redux"
    title: "Для чего в основном этот middleware?"
    body: |
      #### Короткий ответ

      У Redux Thunk основная работа — асинхронный побочный эффект. Ты диспатчишь функцию `(dispatch, getState) => { ... }`. Она читает store, ходит в API и затем диспатчит обычный объект. Этот объект уже попадает в редюсер. Редюсер запрос не выполняет.

      У Redux Observable основная работа — тот же побочный эффект как поток. Epic слушает действия `user/load`. `switchMap` на новое действие отписывается от предыдущего запроса и подписывается на новый. Наружу epic отдаёт действие `user/loaded`. Debounce, повтор и отмена живут операторами потока.

      Оба перехватывают `dispatch` до редюсера. Thunk принимает функцию. Observable принимает поток действий и возвращает поток действий.

      #### Пример кода

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

      В thunk `getState().users.byId` — срез, который уже лежит в store. Если пользователь есть, запрос не повторяется. Epic на каждый новый `user/load` отменяет предыдущий `ajax` через `switchMap`.

      #### Фраза на автомате

      Thunk нужен, чтобы диспатчить функцию: она делает запрос и потом обычное действие. Observable нужен, когда запрос — поток: новое действие отменяет предыдущий запрос, а в store уходит уже результат.
  - id: aravind-digibank.3e
    label: "3e"
    topic: "Управление состоянием: Context API и Redux"
    title: "Сценарий с темой. Приложение уже собрано на Context API, и приходит требование светлой и тёмной темы. Не думая о CSS, как переключать тему и хранить её на всё приложение через Context?"
    body: |
      #### Короткий ответ

      CSS в этом ответе нет. Тема — строка `light` или `dark` в state провайдера, плюс функция, которая эту строку переключает.

      `createContext(null)` создаёт канал. `ThemeProvider` держит `useState('light')`. `toggleTheme` смотрит на текущее значение: `light` становится `dark`, `dark` становится `light`. В `value` провайдера лежат и строка, и функция. Провайдер оборачивает дерево, поэтому состояние одно на приложение, а не копия в каждом экране.

      Любой потомок читает ту же пару через `useContext(ThemeContext)`. Кнопка вызывает `toggleTheme` и показывает саму строку. Своего `useState` для темы у кнопки нет: иначе переключатель и остальное дерево разойдутся.

      #### Пример кода

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

      #### Фраза на автомате

      Тема — это `light` или `dark` в state провайдера. `toggleTheme` меняет строку, провайдер кладёт строку и функцию в Context, любой потомок читает их через `useContext`. CSS я не описываю.
  - id: aravind-digibank.3f
    label: "3f"
    topic: "Управление состоянием: Context API и Redux"
    title: "Напиши для этого базовый код."
    body: |
      #### Короткий ответ

      Базовый код — провайдер, значение контекста и кнопка, которая это значение меняет. CSS нет: на кнопке видна сама строка `light` или `dark`.

      State живёт в `ThemeProvider`. `toggleTheme` переключает строку. `Provider` отдаёт `{ theme, toggleTheme }` всему дереву внутри `App`. `ThemeToggle` читает этот объект через `useContext` и вешает `toggleTheme` на клик.

      Пример ниже — разбор условия, минимальный рабочий вариант, не запись с экрана.

      #### Пример кода

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

      #### Фраза на автомате

      `ThemeProvider` держит тему и `toggleTheme` в Context. Кнопка внутри провайдера вызывает `toggleTheme` и показывает текущую строку. Своего state у кнопки нет.
  - id: aravind-digibank.3g
    label: "3g"
    topic: "Управление состоянием: Context API и Redux"
    title: "Нужны только переключение и то, как ты держишь это через Context API."
    body: |
      #### Короткий ответ

      Переключение — одна функция над одним state. `theme` живёт в провайдере, старт — `'light'`. `toggleTheme` передаёт в `setTheme` функцию от текущего значения: `light` меняется на `dark`, `dark` на `light`.

      Через Context это держится так. `ThemeContext.Provider` получает `value={{ theme, toggleTheme }}`. Потомки не заводят второй `useState` для темы и читают эту пару. Пока провайдер оборачивает дерево, клик меняет одну и ту же строку для всего приложения.

      Разметка кнопки и CSS к ответу не относятся. Нужны state, функция и value провайдера.

      Пример ниже — разбор условия: только провайдер и переключение.

      #### Пример кода

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

      #### Фраза на автомате

      Один `useState` в провайдере и `toggleTheme`, который меняет `light` и `dark`. В Context уходит `{ theme, toggleTheme }`. Компоненты свою копию темы не хранят.
  - id: aravind-digibank.3h
    label: "3h"
    topic: "Управление состоянием: Context API и Redux"
    title: "Как это читать в любом компоненте?"
    body: |
      #### Короткий ответ

      В любом компоненте под провайдером ты вызываешь `useContext(ThemeContext)`. Назад приходит то, что провайдер положил в `value`: строка `theme` и функция `toggleTheme`.

      `createContext(null)` задаёт значение по умолчанию. Вне провайдера хук вернёт `null`, и поля у `null` читать нельзя: сначала проверка. Под провайдером проверка проходит. Кнопка показывает строку и по клику вызывает `toggleTheme`. Стили не нужны.

      Канал один. `ThemeContext` в провайдере и в потребителе — один и тот же объект. Второй `createContext` без общего импорта — уже другой канал, он останется `null`.

      #### Пример кода

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

      #### Фраза на автомате

      Любой потомок провайдера делает `useContext(ThemeContext)` и берёт `theme` и `toggleTheme`. Вне провайдера там `null`, поэтому я сначала проверяю значение. Контекст в провайдере и в компоненте один и тот же.
  - id: aravind-digibank.4a
    label: "4a"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Сценарий. Три API возвращают новости и идут параллельно. Если все три упали, показать something went wrong. Если какой-то успешен, слить и показать их результаты, проигнорировав ошибки. Как это сделать?"
    body: |
      #### Короткий ответ

      Три вызова ты запускаешь сразу, аргументами `Promise.allSettled`. Пока вычисляется массив, все три `fetchNews` уже стартовали. `allSettled` ждёт каждый исход и не отклоняется из-за первого отказа. В массиве порядок как у аргументов.

      Успешный `value` в этом разборе — массив статей. Исходы со `status: 'fulfilled'` ты склеиваешь. Исход со `status: 'rejected'` пропускаешь. Если после фильтра список пустой, на экран идёт строка `something went wrong`. Если статья есть хотя бы из одного API, показываешь склейку и ошибки не выводишь.

      `fetch` сам не отклоняется на статусе 404 или 500. Такой ответ ты превращаешь в отказ через `response.ok`, иначе он попадёт в успехи. `Promise.all` для этого условия отдаёт отказ всего набора на первой ошибке, и успешные списки в его результате не сохраняются.

      #### Пример кода

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

      #### Фраза на автомате

      Три запроса я запускаю сразу и жду их через `Promise.allSettled`. Успешные списки сливаю, отказы пропускаю. Если успехов нет, показываю `something went wrong`.
  - id: aravind-digibank.4b
    label: "4b"
    topic: "Промисы и асинхронность в JavaScript"
    title: "А что, если один API завершится с ошибкой?"
    body: |
      #### Короткий ответ

      Один отказ не отменяет остальные вызовы и не отклоняет промис `Promise.allSettled`. У упавшего API в массиве объект `{ status: 'rejected', reason }`. Ты его пропускаешь. У успешного — `{ status: 'fulfilled', value }`, и `value` добавляешь в общий список.

      Строка `something went wrong` нужна, когда успешных исходов не осталось, то есть отказали все три. Один отказ при живых ответах ты игнорируешь и показываешь слитые статьи.

      `Promise.all` на том же наборе отклонится на этом одном отказе. До склейки успешных списков его `await` не доходит, если ты не поймал каждый вызов отдельно.

      #### Пример кода

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

      #### Фраза на автомате

      Один `reject` в `allSettled` — это исход `rejected`. Я его пропускаю и сливаю списки, которые пришли. `something went wrong` показываю, только если успехов нет.
  - id: aravind-digibank.4c
    label: "4c"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Promise.allSettled ждёт, пока всё закончится. API 1 занимает 2 секунды, API 2 падает через 1 секунду, API 3 занимает 20 секунд. Что происходит?"
    body: |
      #### Короткий ответ

      `Promise.allSettled` ждёт все три вызова, включая тот, что занимает 20 секунд. Отказ на первой секунде и успех на второй наружу ещё не отдаются.

      На 1-й секунде API 2 отклоняется. Исход `rejected` копится внутри, ожидание продолжается. На 2-й секунде API 1 выполняется, исход `fulfilled` тоже копится, а `await` всё ещё стоит. На 20-й секунде завершается API 3, и только тогда `allSettled` выполняется. В массиве три исхода. Порядок как у аргументов, не как у финиша: индекс 1 — это API 2, хотя он закончился первым.

      Ждать 20 секунд — это поведение `allSettled`. Отказ на 1-й секунде набор не завершает и весь вызов не отклоняет.

      #### Пример кода

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

      Один `await` покрывает все три промиса. Массив появляется после самого медленного, здесь после 20 секунд.

      #### Фраза на автомате

      `allSettled` отдаст массив только после самого медленного вызова, вместе с API на 20 секунд. Отказ на 1-й секунде и успех на 2-й до этого наружу не выходят. Один отказ весь `allSettled` не отклоняет.
  - id: aravind-digibank.4d
    label: "4d"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Результат API 1 уже есть на второй секунде. Зачем ждать 20 секунд? Как это обработать?"
    body: |
      #### Короткий ответ

      Чтобы показать первый успех раньше, `Promise.allSettled` не подходит. Он не выполняется на 2-й секунде, пока третий вызов занимает 20 секунд. Результат API 1 уже есть, но один `await` на `allSettled` держит его до конца самого долгого вызова.

      Ранний показ делается по каждому промису. На успех ты сразу дополняешь список и рисуешь его. На отказ этот источник пропускаешь. Когда осели все и список пуст, показываешь `something went wrong`. Успех API 1 появляется на 2-й секунде. API 3 дописывается на 20-й. Экран не молчит всё это время.

      `Promise.any` закрывает первый успех отдельно от сборки остальных. Он выполняется на первом успехе, ранний отказ пропускает и 20 секунд не ждёт. Если откажут все, `any` отклонится с `AggregateError`. Остальные результаты ты собираешь своими `then` на тех же промисах: `any` показывает первый успех, обработчики дописывают следующие. Для раннего экрана `allSettled` сюда не ставят: он как раз не отдаёт первый успех, пока не закончится вызов на 20 секунд.

      #### Пример кода

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

      `showFirstSuccess` рисует первый успех, здесь API 1 на 2-й секунде. `showIncrementally` на тех же промисах дописывает остальные списки и оставляет строку `something went wrong` для случая, когда успехов нет. `allSettled` в этом фрагменте нет: он не отдал бы первый успех до 20-й секунды.

      #### Фраза на автомате

      Для раннего успеха `allSettled` я не беру: он ждёт и вызов на 20 секунд. Первый результат показываю через `Promise.any`, а остальные успехи дописываю отдельными `then`. `something went wrong` — только когда осели все и список пуст.
  - id: aravind-digibank.4e
    label: "4e"
    topic: "Промисы и асинхронность в JavaScript"
    title: "С async/await, если API 1 занимает 15 секунд, следующий вызов начнётся только после него. Это последовательно, а не параллельно, и поэтому медленнее?"
    body: |
      #### Короткий ответ

      Да, если каждый следующий вызов написан после `await`. Такой код последовательный, и при независимых запросах он медленнее. `await` запрос не запускает. Запрос запускается в момент вызова `fetchNews`. `await` приостанавливает эту async-функцию, пока промис не завершится.

      При 15 секундах на API 1 строка со вторым вызовом начнёт выполняться после этих 15 секунд. Общее время — сумма длительностей.

      Параллельный вариант: ты вызываешь все три функции до первого `await`. Три промиса уже идут. Потом один `await` ждёт уже начатые промисы. Для склейки с отказами это `Promise.allSettled`. Старт от `await` не зависит. Слово `async` само по себе вызовы не распараллеливает и не останавливает.

      #### Пример кода

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

      В `loadSequential` второй `fetchNews` стоит после `await`, поэтому при 15 секундах на первый API он стартует только потом. В `loadParallel` три вызова уже сделаны, `allSettled` их только дожидается.

      #### Фраза на автомате

      Да. `await` между вызовами делает их последовательными: второй стартует после 15 секунд первого. Я сначала вызываю все три функции, потом один раз жду уже начатые промисы.
  - id: aravind-digibank.4f
    label: "4f"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Promise.race перестаёт смотреть на остальные два, как только первый завершился, а нужны все три результата. Как решить?"
    body: |
      #### Короткий ответ

      `Promise.race` для трёх результатов не берут. Его промис завершается первым финишем, успехом или отказом. Остальные два исхода в этот промис не попадут. Сами запросы `race` не отменяет: он перестаёт быть местом, откуда ты их читаешь.

      Все три результата даёт `Promise.allSettled`: в массиве исход каждого вызова, один отказ не выкидывает чужой успех. Если первый успех надо показать сразу, а остальные всё равно собрать, на каждый промис ты вешаешь свой `then`.

      `Promise.any` тоже не собирает тройку. Он отдаёт первый успех и на этом завершается. Его берут, когда нужен один победитель, а полную склейку ты ведёшь отдельно.

      #### Пример кода

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

      `firstSettlementOnly` возвращает один исход. `everyResult` возвращает три.

      #### Фраза на автомате

      `race` отдаёт только первый финиш, остальные два результата в этот промис не входят. Все три исхода я читаю из `Promise.allSettled` или из своего `then` на каждом вызове.
  - id: aravind-digibank.4g
    label: "4g"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Ты сказал, что вызовы параллельные. Как именно?"
    body: |
      #### Короткий ответ

      Параллельно значит, что три запроса стартуют до ожидания. Ты вызываешь `fetchNews` три раза подряд и не ставишь `await` между этими строками. Каждая функция сразу возвращает промис, сеть уже идёт.

      Дальше `Promise.all` получает эти уже начатые промисы и ждёт их. `Promise.all` запросы не запускает. Он ждёт то, что ты уже вызвал. Если один промис отклонится, `Promise.all` отклонится целиком.

      Когда отказ одного источника надо пропустить и оставить остальные списки, те же уже начатые промисы ты передаёшь в `Promise.allSettled`. Пустую склейку показываешь строкой `something went wrong`. Параллельность от выбора `all` или `allSettled` не меняется: её сделал старт трёх вызовов без `await` между ними.

      #### Пример кода

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

      #### Фраза на автомате

      Я сначала вызываю все три функции и получаю три промиса, потом передаю их в `Promise.all`. Между стартами `await` нет. Запросы к этому моменту уже идут.
  - id: aravind-digibank.4h
    label: "4h"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Три разных вызова. Как?"
    note: "Предложение было разнести их по отдельным методам и вызвать из useEffect."
    body: |
      #### Короткий ответ

      Три разных вызова — это три отдельные функции, и вызываешь ты их из `useEffect`. `loadFirst`, `loadSecond` и `loadThird` каждая сразу возвращает промис своего запроса.

      В эффекте ты пишешь три вызова подряд, без `await` между ними. Все три запроса стартуют в одном проходе эффекта. Потом `Promise.all` ждёт уже начатые промисы и кладёт три списка в state. Если написать `await loadFirst()` и только потом вызвать `loadSecond()`, второй метод стартует после первого, и параллельности нет.

      Один отказ отклонит этот `Promise.all`. Чтобы отказ одного метода не спрятал ответы двух других, на те же три промиса ты ставишь `Promise.allSettled` и для пустого успеха оставляешь строку `something went wrong`. На старт из `useEffect` это не влияет: методы по-прежнему вызваны отдельно и без ожидания между вызовами.

      #### Пример кода

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

      #### Фраза на автомате

      Я разношу запросы по `loadFirst`, `loadSecond` и `loadThird` и вызываю все три из `useEffect` без `await` между ними. `Promise.all` ждёт уже начатые промисы. Методы стартуют в одном проходе эффекта.
  - id: aravind-digibank.4i
    label: "4i"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Сценарий с таймаутом. API может занять 5, 10, 15 или 20 секунд, но ждать нужно не больше 5 секунд, а потом прервать или отменить запрос. Как это сделать? Напиши пример кода."
    body: |
      #### Короткий ответ

      Ждать нужно не дольше 5 секунд, даже если сам API ответил бы за 5, 10, 15 или 20. Отмену делает `AbortController`. Момент отмены задаёт `setTimeout`.

      Ты создаёшь контроллер и передаёшь `controller.signal` в `fetch`. Таймер на 5000 мс вызывает `controller.abort()`. Запрос, который ещё не завершился, обрывается, и `fetch` отклоняется с `AbortError`. Вызов на 10, 15 или 20 секунд не держит интерфейс: ожидание кончается на 5-й секунде.

      `clearTimeout` в `finally` снимает таймер, если ответ пришёл раньше. Иначе таймер сработает по уже завершённому запросу. Снять таймер — не значит отменить сеть. Сеть отменяет `abort()`. Короткий вызов платформы — `AbortSignal.timeout(5000)`. В примере явно видны контроллер и таймер.

      Пример ниже — разбор условия.

      #### Пример кода

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

      Если таймер успел вызвать `abort()`, `fetch` отклоняется с `AbortError` до чтения тела. `finally` в обоих исходах снимает таймер.

      #### Фраза на автомате

      Я создаю `AbortController`, передаю `signal` в `fetch` и через 5 секунд вызываю `abort()`. Запрос обрывается с `AbortError`. Если ответ пришёл раньше, таймер снимаю в `finally`.
  - id: aravind-digibank.5a
    label: "5a"
    topic: "Микрофронтенды"
    title: "Есть опыт с микрофронтендами?"
    body: |
      #### Короткий ответ

      Опыт здесь — схема, а не ответ «да». Микрофронтенд — отдельное UI-приложение со своей сборкой и своим релизом. На странице их собирает оболочка, host. Частый механизм загрузки — Module Federation: host в рантайме подтягивает remote, и команда выкладывает свой кусок, не пересобирая соседей.

      Граница узкая. Кусок владеет маршрутом или фрагментом экрана. Наружу он отдаёт контракт: маршрут, событие или тонкую общую библиотеку UI. Общий мутабельный store на все команды связывает релизы: выкладка одного куска начинает ломать чужой state. Общее ограничивают версией контракта и тем, что можно передать пропсом или событием.

      В ответе ты называешь три части, которые сам собирал или подключал: оболочка, один независимый кусок и контракт между ними. Годы и число проектов говоришь только свои.

      #### Фраза на автомате

      Микрофронтенды я собираю как оболочку и независимо выложенные куски, обычно через Module Federation. Между ними контракт маршрута, события или тонкой UI-библиотеки. Общий мутабельный store между командами я не делаю склейкой.
---

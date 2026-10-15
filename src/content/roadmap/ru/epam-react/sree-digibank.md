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
    topic: "Знакомство и опыт по проектам"
    title: "Представься и пройдись по своему опыту."
    body: |
      #### Короткий ответ

      Это каркас на одну-две минуты. Ты называешь роль, стек, один проект и один измеримый результат. Биографию конкретного человека сюда не подставляют: годы, компании и цифры берутся только из твоей работы.

      Роль — фронтенд-разработчик. Стек — React и TypeScript и то, чем ты правда пользовался на этом проекте: запросы к API, состояние клиента, сборка. Проект — один пользовательский сценарий, который ты вёл, например список или форма в уже работающем приложении. Результат — одна цифра, которую ты можешь защитить: время загрузки страницы, размер первого бандла или число лишних запросов.

      #### Фраза на автомате

      Я фронтенд-разработчик, в ежедневном стеке React и TypeScript. На последнем проекте вёл один пользовательский сценарий в уже работающем приложении. Измеримый результат назову своим: какая метрика сдвинулась и на сколько, только если эта цифра из моей работы.
  - id: "sree-digibank.1b"
    label: "1b"
    topic: "Знакомство и опыт по проектам"
    title: "Ты сказал, что оптимизировал загрузку одной из страниц. Какие подходы снизили время загрузки?"
    body: |
      #### Короткий ответ

      Ты начинаешь с метрики, которую мерил: время до полезного экрана или объём JavaScript на первой загрузке. Потом называешь два-три приёма, которые двигают именно её. Чужую цифру «было восемь секунд, стало две» не выдумывают.

      Тяжёлый кусок страницы ты выносишь в отдельный чанк через `React.lazy` и `Suspense`, чтобы он не входил в первый бандл. Картинки отдаёшь в размере, который реально рисуется. Запросы, без которых экран не собрать, стартуют параллельно, а не цепочкой эффектов, где каждый ждёт предыдущий. Мемоизацию подключаешь после профайлера, когда видна дорогая отрисовка. В конце ты возвращаешься к той же метрике.

      #### Пример кода

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

      `HeavyChart` попадает в отдельный чанк. Пока чанк едет, пользователь видит запасной текст, а первый бандл страницы этот модуль не тащит.

      #### Фраза на автомате

      На той странице я мерил первую загрузку. Тяжёлый блок вынес в отдельный чанк через `React.lazy`, чтобы он не ехал в первом бандле, а данные экрана запрашивал параллельно. Цифру до и после назову только ту, которую сам снимал.
  - id: "sree-digibank.2a"
    label: "2a"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Ты упомянул debounce. Брали библиотеку или писали свой хук?"
    body: |
      #### Короткий ответ

      Годятся оба пути. Библиотечная `debounce`, например из lodash, уже умеет откладывать вызов и отменять его. В этом раунде ты пишешь свой хук: таймер тогда виден, и его можно разобрать вслух.

      Id таймера ты хранишь в `useRef`. Запись в `useState` перерисовала бы компонент, а id должен пережить перерисовку и остаться тем же на следующий символ. Пример ниже — разбор условия, а не расшифровка экрана кандидата.

      #### Пример кода

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

      Хук принимает функцию и задержку и возвращает функцию. Перед новым таймером предыдущий сбрасывается. При размонтировании висящий таймер тоже сбрасывается.

      #### Фраза на автомате

      Библиотечную debounce я тоже мог взять, а в этом задании пишу хук сам, чтобы таймер был виден. Id храню в `useRef`: запись в `useState` перерисовала бы компонент, а id должен пережить эту перерисовку.
  - id: "sree-digibank.2b"
    label: "2b"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Напиши кастомный debounce-хук для поля поиска, чтобы приложение не ходило в API на каждый символ. Достаточно примера кода."
    body: |
      #### Короткий ответ

      Ты пишешь хук `useDebouncedCallback`: он принимает функцию поиска и задержку, а id таймера держит в `useRef`. На каждый символ предыдущий `timeout` очищается, и `fetch` уходит один раз, после паузы. Запись id в `useState` перерисовала бы компонент, а id должен пережить перерисовку от `setQuery`.

      Поле живёт в компоненте. `handleChange` читает `event.target.value` и передаёт эту строку в функцию, которую вернул хук. Таймер замыкает именно этот аргумент и потом вызывает `search`. Пример ниже — разбор условия, а не расшифровка экрана кандидата.

      #### Пример кода

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

      `setQuery` обновляет то, что видно в поле, сразу. `debouncedSearch` откладывает `fetch` на 300 мс тишины. `callbackRef` хранит свежую `search`, а в запрос попадает строка, переданная аргументом.

      #### Фраза на автомате

      Хук принимает функцию поиска и задержку, id таймера лежит в `useRef`. На каждый символ я очищаю предыдущий timeout и ставлю новый. В API уходит строка из поля, и только после паузы.
  - id: "sree-digibank.2c"
    label: "2c"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Почему для таймера взял useRef, а не useState?"
    body: |
      #### Короткий ответ

      Id таймера ты хранишь в `useRef`. Запись через `useState` перерисовала бы компонент, а id должен пережить перерисовку.

      Поле и так вызывает `setQuery` на каждый символ, поэтому `SearchInput` рендерится заново. Ref — это один и тот же объект между этими рендерами. Присваивание `timeoutIdRef.current` видно сразу, и следующий символ читает тот же id в момент вызова. Id не рисуется на экране, отдельное обновление state ради него не нужно.

      У версии на `useState` обработчик замыкает `timeoutId` того рендера, который создал функцию. `setTimeoutId` только планирует коммит. Повторный вызов до этого коммита всё ещё видит старый id. Ref читается в момент нажатия, поэтому `clearTimeout` достаёт таймер, записанный предыдущим символом.

      #### Пример кода

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

      Так id переживает рендер от `setQuery`. Вариант, от которого ты уходишь:

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

      `setTimeoutId` сам по себе планирует лишнюю перерисовку, а `clearTimeout(timeoutId)` смотрит в id из замыкания рендера.

      #### Фраза на автомате

      Id таймера я держу в `useRef`. Запись в `useState` перерисовала бы компонент, а id должен пережить перерисовку от поля. В момент следующего символа я читаю `ref.current` и очищаю тот же timeout.
  - id: "sree-digibank.2d"
    label: "2d"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Хук принимает функцию и задержку. Где обрабатывается само поле поиска и как оно связано с хуком?"
    body: |
      #### Короткий ответ

      Само поле ты обрабатываешь в компоненте: видимая строка живёт в `useState`. Хук принимает `search` и `300` и возвращает `debouncedSearch`.

      Связь такая. `SearchInput` держит видимую строку в `useState`. `handleChange` читает `event.target.value`, кладёт её в state и тем же значением вызывает `debouncedSearch`. Когда пауза выдержана, хук вызывает `search` с этой строкой, а `search` делает `fetch`. Пример ниже — разбор условия.

      #### Пример кода

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

      `useDebouncedCallback(search, 300)` — это стык. Аргумент `nextValue` — это то, что пользователь только что ввёл.

      #### Фраза на автомате

      Хук принимает только функцию поиска и задержку. Само поле живёт в компоненте: state для видимой строки и `onChange`. В обработчике я передаю значение поля в функцию, которую хук вернул.
  - id: "sree-digibank.2e"
    label: "2e"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Напиши весь кусок, включая компонент, который использует хук."
    body: |
      #### Короткий ответ

      Весь кусок, который ты пишешь, — хук и компонент рядом. Хук `useDebouncedCallback` хранит id таймера в `useRef`, чтобы запись в `useState` не перерисовывала компонент ради id и чтобы id пережил перерисовку. Компонент `SearchInput` владеет полем, на каждый символ обновляет видимую строку и передаёт её в возвращённую функцию. До API строка доходит аргументом: таймер вызывает `search(value)`, а `search` собирает URL и вызывает `fetch`.

      Пока ввод не остановился, каждый новый вызов очищает предыдущий timeout. Пример ниже — разбор условия, а не расшифровка экрана кандидата.

      #### Пример кода

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

      Очистка в эффекте сбрасывает таймер, если компонент исчез раньше паузы.

      #### Фраза на автомате

      Хук хранит timeout в `useRef` и возвращает функцию с задержкой. Компонент держит поле, в `onChange` пишет строку в state и передаёт ту же строку в debounced-функцию. После паузы эта строка попадает в `fetch`.
  - id: "sree-digibank.2f"
    label: "2f"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Если пользователь вводит ABC, как не сделать три запроса A, AB и ABC, когда поисковая строка обновляется?"
    body: |
      #### Короткий ответ

      Три запроса не уходят, потому что перед новым таймером ты очищаешь предыдущий timeout. Буквы A и AB успевают только поставить таймер и тут же его сбросить. В API уходит одна строка ABC, когда пауза длиннее задержки.

      Id лежит в `useRef`, поэтому он переживает перерисовку от `setQuery`. Следующая буква читает тот же id и вызывает `clearTimeout`. Запись id в `useState` как раз перерисовала бы компонент ради значения, которое на экран не выводится.

      - A: в ref записывается таймер T1 со строкой `A`.
      - B до конца 300 мс: `clearTimeout` гасит T1, в ref записывается T2 со строкой `AB`.
      - C: T2 гасится, в ref записывается T3 со строкой `ABC`.
      - Пауза: срабатывает только T3, `fetch` получает `ABC`.

      #### Пример кода

      ```tsx
      const debounced = (value) => {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
          callbackRef.current(value);
        }, delay);
      };
      ```

      `value` на третьем вызове уже равен `ABC`. Замыкания T1 и T2 не вызываются: их таймеры очищены.

      #### Фраза на автомате

      На каждую новую букву я очищаю предыдущий timeout через id в `useRef`. Пока пользователь вводит ABC, таймеры A и AB сбрасываются. Один запрос уходит со строкой ABC, когда ввод замолкает.
  - id: "sree-digibank.2g"
    label: "2g"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Связи между нажатиями в поле и debounced-функцией не хватает. Куда подключается введённое значение?"
    body: |
      #### Короткий ответ

      Введённое значение подключается в `handleChange`. Ты читаешь `event.target.value` в `nextValue`, сразу кладёшь его в state поля и вызываешь `debouncedSearch(nextValue)`. Хук сам поле не слушает: связь — это аргумент возвращённой функции.

      `debouncedSearch` приходит из `useDebouncedCallback(search, 300)`. Id таймера остаётся в `useRef`, чтобы обновление `useState` не было способом хранить timeout и чтобы id пережил перерисовку от `setQuery`. Пример ниже — разбор условия.

      #### Пример кода

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

      Строка `debouncedSearch(nextValue)` и есть недостающая связь между нажатием и отложенным вызовом.

      #### Фраза на автомате

      Значение подключается в `onChange`: я беру `event.target.value` и передаю его аргументом в debounced-функцию. Хук поле не читает, он получает уже готовую строку.
  - id: "sree-digibank.2h"
    label: "2h"
    topic: "Кастомные хуки и debounce (лайвкодинг)"
    title: "Как введённая строка на самом деле доходит до вызова API?"
    body: |
      #### Короткий ответ

      Введённую строку ты доводишь до API аргументом, который передаёшь в debounced-функцию.

      1. `handleChange` берёт `event.target.value` в `nextValue`.
      2. `debouncedSearch(nextValue)` очищает прежний timeout и ставит новый. В замыкании таймера лежит эта `nextValue`.
      3. После паузы таймер вызывает `callbackRef.current(value)`. Это текущая `search`.
      4. `search` собирает `/api/search?q=` через `encodeURIComponent(value)` и вызывает `fetch`.

      Пока пользователь вводит ABC, предыдущий timeout очищается, поэтому до `fetch` доезжает одна строка `ABC`. Id таймера лежит в `useRef`: он переживает перерисовку от `setQuery`, и запись в `useState` для id не нужна. `callbackRef` нужен, чтобы таймер вызвал свежую `search`, а строка при этом осталась той, которую передали в этот конкретный вызов.

      #### Пример кода

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

      Путь такой: `event.target.value` → `debouncedSearch(nextValue)` → аргумент `setTimeout` → `search(value)` → `fetch`.

      #### Фраза на автомате

      В `onChange` я передаю строку из поля в debounced-функцию. Таймер замыкает этот аргумент и после паузы вызывает `search`. `search` подставляет строку в query и делает `fetch`. Предыдущие таймеры к этому моменту уже очищены.
  - id: "sree-digibank.3a"
    label: "3a"
    topic: "Хуки React"
    title: "Работал с хуками? В чём разница между useEffect и useLayoutEffect?"
    body: |
      #### Короткий ответ

      Да. Хуки — способ, которым ты держишь state и побочные эффекты в компоненте, который пишешь сейчас. Разница `useEffect` и `useLayoutEffect` в моменте запуска.

      Оба хука принимают функцию и массив зависимостей, у обоих есть очистка. `useLayoutEffect` выполняется после того, как изменения попали в DOM, и до того, как браузер нарисовал кадр. Им ты измеряешь элемент и правишь DOM, чтобы пользователь не увидел вспышку. `useEffect` выполняется после отрисовки. Им ты ходишь в сеть, подписываешься на события и ставишь таймеры.

      `useLayoutEffect` задерживает отрисовку на время своей функции, поэтому работа там короткая. На сервере у него нет layout, и React предупреждает о таком вызове. Запрос данных ты оставляешь в `useEffect`.

      #### Пример кода

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

      Ширина читается до кадра. Запрос уходит после кадра, а очистка отменяет его при размонтировании.

      #### Фраза на автомате

      С хуками работаю. `useLayoutEffect` выполняется после DOM-обновления и до отрисовки, им я измеряю layout. `useEffect` выполняется после отрисовки, им я хожу в сеть и подписываюсь на события. Тяжёлую работу в layout-эффект не кладу: он задерживает кадр.
  - id: "sree-digibank.4a"
    label: "4a"
    topic: "Управление состоянием: Redux"
    title: "Работал с Redux или инструментами вокруг Redux?"
    body: |
      #### Короткий ответ

      Да, если это правда твой опыт: ты так и говоришь, без выдуманных лет. Redux у тебя был общим клиентским state для экранов, которые далеко друг от друга в дереве.

      Ты называешь части, которыми пользовался. Store держит state. Action описывает, что произошло. Reducer возвращает следующее state. В компоненте чтение идёт через `useSelector`, отправка через `useDispatch`. Из инструментов вокруг ты называешь только свои: Redux DevTools, чтобы видеть цепочку action, и Redux Thunk, чтобы dispatch принимал функцию для запроса. Redux Toolkit имеет смысл назвать, если срезы и store ты собирал им.

      #### Фраза на автомате

      Да, с Redux работал: общий клиентский state, action, reducer, `useSelector` и `useDispatch`. Из инструментов пользовался Redux DevTools и Redux Thunk для асинхронных операций. Называю только то, что реально было в проекте.
  - id: "sree-digibank.4b"
    label: "4b"
    topic: "Управление состоянием: Redux"
    title: "Зачем в том приложении был Redux? Какая у него была главная задача и как ты вёл state?"
    body: |
      #### Короткий ответ

      Главная задача Redux в том приложении — одно клиентское state для данных, которые читают и меняют разные экраны. Имя домена ты берёшь из проекта, о котором уже сказал. Сюда не подставляется чужое приложение.

      Ты вёл state так. Домен, например счета, лежит в своём reducer под ключом `accounts`. Экран отправляет action. Reducer по типу action возвращает следующее state: запрос начался или список приехал. Экран читает кусок через `useSelector` и не тащит весь store в разметку. Переход остаётся в reducer, компонент остаётся тонким.

      Ответ сервера, который нужен одному экрану и больше никому, можно не класть в этот store. В Redux остаётся то, что правда общее для клиента.

      #### Пример кода

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

      `rootReducer` кладёт reducer под ключ `accounts`. Список читает только `state.accounts.items`.

      #### Фраза на автомате

      Redux держал общее клиентское state для экранов, которые читают одни и те же данные. Я резал его по доменам: action описывает событие, reducer возвращает следующее state, экран читает его через `useSelector`.
  - id: "sree-digibank.4c"
    label: "4c"
    topic: "Управление состоянием: Redux"
    title: "Использовал Redux Thunk? Зачем был нужен middleware и для каких операций?"
    body: |
      #### Короткий ответ

      Да, Redux Thunk — тот middleware, которым ты закрывал асинхронные операции. Middleware стоит между `dispatch` и reducer. Он видит всё, что отправили, и может пропустить action дальше, проглотить его или отправить другие action позже.

      Обычный `dispatch` ждёт plain object, и reducer отрабатывает синхронно. Thunk меняет это правило: если отправили функцию, middleware вызывает её и передаёт `dispatch` и `getState`. Reducer по-прежнему получает только plain action.

      Тебе это нужно для операций, которые заканчиваются позже: загрузить счета, сохранить форму, записать токен после ответа. Внутри функции ты отправляешь action «запрос начался», ждёшь `fetch`, потом отправляешь action с данными или с ошибкой. Переключить готовый флаг в state можно и обычным action, без middleware.

      #### Пример кода

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

      `dispatch(fetchAccounts())` попадает в middleware как функция. До reducer доезжают уже два plain action вокруг запроса.

      #### Фраза на автомате

      Да, Redux Thunk использовал. Middleware стоит между dispatch и reducer. Thunk нужен был для асинхронных операций: функция получает dispatch, дожидается ответа и уже потом отправляет обычные action с данными или ошибкой.
  - id: "sree-digibank.5a"
    label: "5a"
    topic: "Управление состоянием: Context API"
    title: "Знаешь управление состоянием через Context API?"
    body: |
      #### Короткий ответ

      Да. Context API передаёт значение поддереву без прокидывания props через каждый уровень. Ты создаёшь контекст через `createContext`, кладёшь значение в `Provider` и читаешь его внизу через `useContext`.

      Значение обычно держит state родителя: пользователь сессии, локаль, тема. Когда это значение меняется, обновляются компоненты, которые его читают. У контекста нет action, middleware и отдельного просмотрщика цепочки событий. Большой объект, который меняется часто, тащит за собой всех читателей, даже тех, кому изменившееся поле не нужно.

      #### Пример кода

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

      `Header` читает сессию, даже если между ним и provider несколько уровней разметки.

      #### Фраза на автомате

      Да. Context — это `createContext`, `Provider` и `useContext`. Так я раздаю поддереву небольшое общее значение, например сессию, без прокидывания props. При смене значения обновляются те, кто его читает. Action и middleware у Context нет.
  - id: "sree-digibank.5b"
    label: "5b"
    topic: "Управление состоянием: Context API"
    title: "Для школьной админки с посещаемостью, данными учеников и результатами выберешь Context API или Redux? Почему одно, а не другое?"
    body: |
      #### Короткий ответ

      Для этой админки ты выбираешь Redux. Посещаемость, карточки учеников и результаты — это много сущностей, много экранов и частые обновления. Одни и те же данные читают список, карточка и форма.

      Store даёт reducer на домен, `useSelector` на нужный кусок и middleware для загрузки. Таблица посещаемости может читать свой срез и не обновляться из-за правки одной оценки, если селектор вернул те же данные. Цепочку action видно в DevTools.

      Один Context на весь дашборд устроен иначе: любое поле в общем value обновляет каждого читателя. Несколько контекстов по доменам повторяют store, только без middleware и без нормальной трассы action. Context ты оставляешь для маленького значения, которое читает почти всё дерево и которое меняется редко: язык интерфейса или тема.

      #### Фраза на автомате

      Для посещаемости, учеников и результатов я возьму Redux: много общих данных и частые обновления, нужны срезы и загрузка через middleware. Context оставлю для редкого значения вроде темы. Один контекст на весь дашборд обновлял бы всех читателей на любую правку.
  - id: "sree-digibank.5c"
    label: "5c"
    topic: "Управление состоянием: Context API"
    title: "После того как дашборд собран, приходит новое требование: переключатель светлой и тёмной темы. Напиши псевдокод на Context и useReducer."
    note: "В расшифровке сказано «use Redux», но по контексту имеется в виду useReducer."
    body: |
      #### Короткий ответ

      В расшифровке этого места ты слышишь «use Redux». Инструмент, который ты здесь пишешь, — `useReducer`. Redux — это отдельный store, action на всё приложение и middleware. Переключатель, который приходит к уже собранному дашборду, меньше: одна строка `light` или `dark` и одно действие `toggle`.

      `useReducer` держит эту строку и умеет её перевернуть. Context раздаёт `theme` и `toggleTheme` любому экрану, чтобы не тащить props через шапку и страницы. Отдельный Redux store ради этой пары ты не собираешь: у темы нет доменов, запросов и цепочки middleware. Псевдокод ниже — разбор требования.

      #### Пример кода

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

      Кнопка отправляет `{ type: 'toggle' }`. Reducer возвращает вторую тему. Provider публикует новое value, и читатели контекста рисуются с ним.

      #### Фраза на автомате

      В расшифровке звучит «use Redux», а по требованию это Context и `useReducer`. Тема — одно значение `light` или `dark`. Reducer переключает его по action `toggle`, provider раздаёт тему и функцию переключения. Отдельный store Redux для этого не поднимаю.
  - id: "sree-digibank.6a"
    label: "6a"
    topic: "TypeScript в React"
    title: "Есть опыт с TypeScript?"
    body: |
      #### Короткий ответ

      Да, если ты писал на нём компоненты. Это снова каркас, без выдуманных лет. Ты говоришь, где типы стояли в твоём коде: props компонента, объединение для state вроде темы, форма ответа API. Один результат, который можно назвать: неверное поле или чужая строка статуса ловятся до запуска, на границе данных.

      Если TypeScript был только в чтении чужого кода, ты так и говоришь и показываешь типы на текущем задании.

      #### Фраза на автомате

      Да, TypeScript использую в компонентах: типы props, объединение для state и тип ответа API. Практический результат — неверное поле ломает сборку на границе данных, а не уже в браузере. Годы и проекты назову только свои.
  - id: "sree-digibank.6b"
    label: "6b"
    topic: "TypeScript в React"
    title: "Добавь типы TypeScript везде, где можно, в компонент и provider, которые только что написал."
    body: |
      #### Короткий ответ

      Ты типизируешь provider темы и кнопку, которые только что собрал на Context и `useReducer`. Тема — объединение `'light' | 'dark'`. Action — объект с полем `type: 'toggle'`. Значение контекста — `theme` и `toggleTheme`. Reducer принимает и возвращает `Theme`. Props provider — `children` типа `ReactNode`.

      Контекст создаётся как `ThemeContextValue | null`, потому что до provider значения нет. Хук `useTheme` сужает `null` и кидает ошибку, если кнопку отрисовали снаружи provider. После этого `ThemeToggle` видит `theme` и `toggleTheme` без optional-цепочки. Пример ниже — разбор того же provider, а не кадр с экрана кандидата.

      #### Пример кода

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

      `dispatch({ type: 'toggle' })` проходит проверку. Случайная строка в `type` или в state темы — уже ошибка типа.

      #### Фраза на автомате

      Я типизирую тему как `'light' | 'dark'`, action как `{ type: 'toggle' }`, а значение контекста как тему плюс функцию переключения. Reducer аннотирован на входе и на выходе. У provider типизированы `children`. Читатель контекста сужает `null`, чтобы кнопка видела готовые поля.
  - id: "sree-digibank.6c"
    label: "6c"
    topic: "TypeScript в React"
    title: "Как типизировать useState на строке 38?"
    body: |
      #### Короткий ответ

      Строки 38 в PDF нет. Это была строка на экране кандидата, и этого экрана в файле нет. Ниже восстановление: так ты типизируешь `useState` для объединения темы, если на той строке был state темы.

      `useState('light')` выводит тип из начального значения, и это литерал `'light'`. `setTheme('dark')` тогда не подходит. Ты задаёшь параметр типа сам: `useState<Theme>('light')`, где `Theme` — это `'light' | 'dark'`. Начальное значение проверяется против объединения, а `setTheme` принимает только эти две строки или функцию от предыдущей темы.

      #### Пример кода

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

      Это восстановление условия, а не расшифровка строки 38. Тот же параметр можно записать на месте: `useState<'light' | 'dark'>('light')`.

      #### Фраза на автомате

      Строки 38 в PDF нет, это был экран кандидата. Если там `useState` для темы, я типизирую его объединением: `useState<'light' | 'dark'>('light')`. Тогда `setTheme` принимает только эти две строки, а не тип одного начального литерала.
  - id: "sree-digibank.7a"
    label: "7a"
    topic: "Промисы и асинхронность в JavaScript"
    title: "В чём разница между промисами и async/await?"
    body: |
      #### Короткий ответ

      Промис для тебя — это значение будущего результата. У него три состояния: ожидание, успех, отказ. `async/await` — синтаксис поверх промиса, а не второй механизм запроса.

      Функция с `async` всегда возвращает промис. `await` внутри неё достаёт значение успеха и бросает отказ в ближайший `catch`. Пока промис не завершился, эта функция стоит на паузе, а поток JavaScript не блокируется: остальные задачи живут своей жизнью. Вызов `loadWithAwait()` без `await` снаружи даёт промис того же рода, что и цепочка `.then`.

      Ошибку в цепочке ты ловишь через `.catch`. В `async`-функции ту же ошибку ты ловишь через `try/catch`. `fetch` в обоих вариантах возвращает промис.

      #### Пример кода

      ```js
      function loadWithThen() {
        return fetch('/api/news').then((response) => response.json());
      }

      async function loadWithAwait() {
        const response = await fetch('/api/news');
        return response.json();
      }
      ```

      Обе функции отдают промис с разобранным JSON. Вторая читается сверху вниз, потому что `await` разворачивает промис `fetch`.

      #### Фраза на автомате

      Промис — это значение будущего результата: ожидание, успех или отказ. `async/await` — синтаксис поверх него. `async`-функция возвращает промис, `await` достаёт успех и кидает отказ в `catch`. Поток при этом не блокируется.
  - id: "sree-digibank.7b"
    label: "7b"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Сценарий. Три API параллельно забирают новости из разных источников. Любой может упасть или отвечать медленно. Если упали все, показать ошибку. Если удались один или два, показать или слить эти результаты. Если удались все три, слить всё. Как это сделать?"
    body: |
      #### Короткий ответ

      Ты запускаешь три запроса параллельно и ждёшь их через `Promise.allSettled`. Он завершается, когда завершился каждый, и отдаёт массив статусов `fulfilled` или `rejected`. Успешные массивы статей ты сливаешь. Если успешных нет, показываешь ошибку. Один успех, два или все три проходят по этой же ветке: на экран попадает то, что реально приехало.

      `Promise.all` на первом отказе отклоняет всю связку, и уже готовые статьи других источников до экрана не доходят. `Promise.any` отдаёт только первый успех и не копит остальные. Для этого сценария нужен полный отчёт `Promise.allSettled`.

      #### Пример кода

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

      Каждый источник возвращает массив статей. Отказ остаётся в `result.reason` и в список не попадает.

      #### Фраза на автомате

      Три источника я запускаю параллельно и собираю через `Promise.allSettled`. Успешные списки сливаю. Если успешных нет, показываю ошибку. Если успешен один, два или все три, на экране их объединение. `Promise.all` спрятал бы удачные ответы за первым отказом.
  - id: "sree-digibank.7c"
    label: "7c"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Если API 1 успешен за одну секунду, будет ли Promise.any ждать остальные два? Что именно делает Promise.any?"
    body: |
      #### Короткий ответ

      Нет. Остальные два вызова ты не ждёшь. Если API 1 успешно завершился за одну секунду, `Promise.any` в эту же секунду успешно завершается значением API 1. Результаты API 2 и API 3 в это значение не входят. Сами запросы в фоне могут ещё ехать: комбинатор их не отменяет.

      `Promise.any` ждёт первый успех. Отказы он пропускает, пока есть живой промис, который ещё может завершиться успехом. Если отказали все, `Promise.any` отклоняется с `AggregateError`, и внутри лежат причины всех отказов. Это другой комбинатор, чем `Promise.race`: гонка завершается первым завершением вообще, в том числе первым отказом.

      #### Пример кода

      ```js
      const firstArticles = await Promise.any([
        fetchNews('/api/news/a'),
        fetchNews('/api/news/b'),
        fetchNews('/api/news/c'),
      ]);
      ```

      Если `/api/news/a` успешен на первой секунде, `await` продолжается на первой секунде, и в `firstArticles` лежит ответ только этого источника.

      #### Фраза на автомате

      Нет. Если API 1 успешен за секунду, `Promise.any` завершается его значением и остальные два не ждёт. Он берёт первый успех, отказы пропускает, а если упали все — отклоняется с `AggregateError`. Запросы в фоне он не отменяет.
  - id: "sree-digibank.7d"
    label: "7d"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Promise.any завершается, как только один вызов успешен, а нужны все успешные результаты. Как это обработать?"
    body: |
      #### Короткий ответ

      Ты берёшь `Promise.allSettled` и оставляешь каждый статус `fulfilled`. `Promise.any` здесь уже завершился бы на первом успехе, и более поздние успешные ответы в его результат не входят.

      `allSettled` дожидается всех трёх и отдаёт по записи на каждый вызов. Ты проходишь массив, забираешь `result.value` у успешных и склеиваешь статьи. Пустой список успехов — это экран ошибки: упали все. Один, два или три успеха дают один слитый список. Причина отказа лежит в `result.reason`, если её нужно залогировать.

      #### Пример кода

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

      В `articles` попадают все успешные массивы, в том числе те, что приехали позже первого.

      #### Фраза на автомате

      `Promise.any` отдаёт только первый успех, поэтому я перехожу на `Promise.allSettled`. Дожидаюсь всех трёх, забираю каждый `fulfilled` и сливаю статьи. Если успешных нет, показываю ошибку.
  - id: "sree-digibank.7e"
    label: "7e"
    topic: "Промисы и асинхронность в JavaScript"
    title: "API 1 занимает 2 секунды, API 2 падает через 1 секунду, API 3 занимает 15 секунд. Что будет с Promise.allSettled? Результаты уже есть на второй секунде, зачем ждать все три?"
    body: |
      #### Короткий ответ

      Ты дожидаешься `Promise.allSettled` до 15-й секунды, вместе с самым медленным вызовом. На второй секунде готовы только два исхода, а промис комбинатора всё ещё pending, потому что API 3 не завершился.

      - 1 секунда: API 2 rejected. Связка ещё ждёт.
      - 2 секунды: API 1 fulfilled. Связка всё ещё ждёт.
      - 15 секунд: API 3 fulfilled. `allSettled` отдаёт три записи: успех, отказ, успех.

      Ты ждёшь, потому что контракт `Promise.allSettled` — полный отчёт по каждому аргументу. Успех на 15-й секунде входит в этот отчёт. Два уже известных исхода лежат внутри своих промисов, но наружу один массив выходит только когда третий тоже завершился.

      Отдельный потолок в 5 секунд на один вызов — это уже таймаут вокруг этого вызова. Сам `allSettled` такой потолок не ставит: он ждёт фактическое завершение.

      #### Пример кода

      ```js
      const results = await Promise.allSettled([
        fetchNews('/api/news/a'),
        fetchNews('/api/news/b'),
        fetchNews('/api/news/c'),
      ]);
      ```

      При раскладе 2 с, отказ на 1 с и 15 с этот `await` продолжается на 15-й секунде. `results[0].status` равен `'fulfilled'`, `results[1].status` равен `'rejected'`, `results[2].status` равен `'fulfilled'`.

      #### Фраза на автомате

      `Promise.allSettled` дождётся API 3 и завершится на 15-й секунде. На второй секунде успех API 1 и отказ API 2 уже известны, но комбинатор ещё pending. Он ждёт, потому что отдаёт полный отчёт по всем трём, включая медленный успех.
  - id: "sree-digibank.7f"
    label: "7f"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Вызов API может занять от 2 до 15 секунд, но ждать нужно не больше 5 секунд, а потом отменить его. Как это сделать? Напиши быстро."
    body: |
      #### Короткий ответ

      Ты отменяешь сам запрос через `AbortController`. Рядом ставишь `setTimeout` на 5 секунд. Если ответ пришёл раньше, таймер очищается в `finally`, и `abort` уже не стреляет. Если к пятой секунде ответа нет, таймер вызывает `controller.abort()`. `fetch` со `signal` отклоняется, обычно с `AbortError`, и 15-секундный вызов не держит ожидание.

      Это отмена работы, а не только отказ ждать: браузер прекращает запрос по сигналу. Пример ниже — разбор условия.

      #### Пример кода

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

      Успех на 2-й секунде возвращает JSON и снимает таймер. Тишина дольше 5 секунд превращается в отказ `fetch` в момент `abort`.

      #### Фраза на автомате

      Я создаю `AbortController` и передаю его `signal` в `fetch`. Через 5 секунд вызываю `abort`, а если ответ пришёл раньше — очищаю таймер. Запрос отменяется, и промис `fetch` отклоняется.
  - id: "sree-digibank.7g"
    label: "7g"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Есть ли другой способ без AbortController?"
    body: |
      #### Короткий ответ

      Да. Потолок ожидания собирается из промисов: запрос и второй промис, который через 5 секунд отклоняется, ты передаёшь в `Promise.race`. Гонка завершается тем исходом, который наступил раньше. Ответ на 2-й секунде становится результатом гонки. Тишина до 5-й секунды становится отказом таймаута, и `await` дальше не висит, даже если API ответил бы на 15-й.

      Это другой механизм, чем `AbortController`. `Promise.race` перестаёт ждать. Сам `fetch` гонка не отменяет: запрос может доехать в фоне, просто его результат уже никто не читает. Отмену соединения по-прежнему делает сигнал abort. `finally` здесь только снимает `setTimeout`, чтобы таймер не отклонил уже никому не нужный промис после успеха.

      #### Пример кода

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

      В гонке два участника. Победитель — тот, кто завершился первым, успехом или отказом.

      #### Фраза на автомате

      Да. Я ставлю `fetch` и промис, который отклоняется через 5 секунд, в `Promise.race`. Чей исход раньше, тот и становится результатом. Так я перестаю ждать на пятой секунде. Сам HTTP-запрос гонка не отменяет, это делает `AbortController`.
  - id: "sree-digibank.7h"
    label: "7h"
    topic: "Промисы и асинхронность в JavaScript"
    title: "Подсказка: используй идею из промисов. Как решить так?"
    note: "Это выводит на Promise.race."
    body: |
      #### Короткий ответ

      Подсказка «идея из промисов» выводит на `Promise.race`. Это не ярлык, а конкретный комбинатор. `Promise.race` принимает несколько промисов и завершается вместе с тем, который завершился первым. Успех первого даёт успех гонки, отказ первого даёт отказ гонки. Остальные участники на результат гонки уже не влияют.

      Ты ставишь в гонку запрос и второй промис, который через 5 секунд вызывает `reject`. Если JSON приехал на 2-й секунде, гонка успешно завершается этими данными, а пятисекундный отказ до неё не дотягивается. Если запрос ответил бы только на 15-й, на 5-й побеждает таймаут, и ожидание кончается ошибкой `Timed out`. Если сам запрос отклонился на 1-й секунде, гонка тоже отклоняется на 1-й: в отличие от `Promise.any`, первый отказ для `Promise.race` уже финал.

      Гонка ограничивает ожидание. Она не отменяет HTTP. Соединение можно оборвать отдельно: в таймауте вызвать `controller.abort()`, а в гонке оставить тот же пятисекундный промис. Подсказка ведёт именно к `Promise.race` как к способу решить предел через промисы.

      #### Пример кода

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

      `Promise.race([request, timeout])` — вся идея подсказки. `clearTimeout` в `finally` гасит таймер, если запрос завершился раньше.

      #### Фраза на автомате

      Подсказка выводит на `Promise.race`. Я гоняю запрос с промисом, который отклоняется через 5 секунд. Гонка завершается первым исходом: данные, если ответ раньше, или ошибка таймаута, если раньше сработала отсечка. Первый отказ запроса тоже завершает гонку. Сам запрос при этом не отменяется.
  - id: "sree-digibank.8a"
    label: "8a"
    topic: "Генераторы в JavaScript"
    title: "Работал с функциями-генераторами в JavaScript?"
    body: |
      #### Короткий ответ

      Да, на уровне языка: генератор ты можешь написать и прогнать руками. Функция со звёздочкой `function*` возвращает генератор. Тело не выполняется в момент вызова. Каждый `next` крутит тело до ближайшего `yield`, отдаёт `{ value, done }` и ставит функцию на паузу. Следующий `next` продолжает с места паузы. Когда `yield` больше нет, приходит `{ value: undefined, done: true }`.

      Redux Saga концептуально устроена на этом же механизме. Middleware запускает генератор и на каждом `yield` получает описание эффекта, выполняет его и будит генератор результатом через `next`. Это модель библиотеки. Подключал ли ты её в проекте — отдельный факт про твой опыт, и выдуманный проект сюда не подставляется.

      #### Пример кода

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

      Вызов `countTo(3)` только создаёт генератор. Четыре `next` по очереди дают `{ value: 1, done: false }`, потом 2, потом 3, потом `{ value: undefined, done: true }`.

      #### Фраза на автомате

      Да. Генератор — это `function*` и `yield`. Вызов возвращает генератор, тело стартует на `next` и замирает на `yield`. Redux Saga концептуально гоняет такие функции: middleware выполняет эффект с `yield` и продолжает генератор результатом.
  - id: "sree-digibank.8b"
    label: "8b"
    topic: "Генераторы в JavaScript"
    title: "Работал с ними руками, не только в теории?"
    note: "Дальше интервьюер уточнил, что Redux Saga известна концептуально, но в проекте не использовалась."
    body: |
      #### Короткий ответ

      С генератором ты работаешь руками: пишешь `function*`, ставишь `yield` и забираешь значения через `next`. Это маленький код, который можно набрать в раунде, и он не требует чужой биографии.

      Дальше интервьюер как раз уточняет границу Redux Saga. Ты знаешь её концептуально и в проекте не использовал. Концепция такая. Saga middleware запускает генератор. `yield call(fn, arg)` не вызывает `fn` сам по себе: он отдаёт объект эффекта. Middleware выполняет `fn`, потом вызывает `next` с её результатом, и генератор идёт дальше как последовательный код. `yield put(action)` отдаёт эффект, по которому middleware делает `dispatch`. `take` останавливает генератор до нужного action.

      Этот набросок — модель, которую ты объясняешь. Это не сага, которую ты выкатывал. Если в проекте Saga не было, ты так и говоришь.

      #### Пример кода

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

      Первый фрагмент — генератор, который ты пишешь руками. Второй — концептуальная форма Redux Saga: `call` и `put` описывают эффекты, middleware их выполняет.

      #### Фраза на автомате

      Генератор я пишу руками: `function*`, `yield` и `next`. Redux Saga я знаю концептуально: middleware выполняет эффекты `call` и `put` и будит генератор результатом. В проекте я Redux Saga не подключал.
  - id: "sree-digibank.9a"
    label: "9a"
    topic: "Микрофронтенды"
    title: "Есть опыт с микрофронтендами?"
    note: "Вопрос прозвучал в ответ на вопрос кандидата об архитектуре проекта."
    body: |
      #### Короткий ответ

      Вопрос прозвучал в ответ на твой вопрос об архитектуре проекта. Интервьюер перевёл разговор об устройстве системы в вопрос о твоём опыте. Ты отвечаешь каркасом на одну-две минуты и сразу поясняешь архитектуру. Биографию конкретного человека не выдумывают.

      Каркас. Роль — фронтенд-разработчик. Стек — React, TypeScript и сборка, которая умеет подгружать отдельно собранный UI. Один проект — shell и одна предметная область, которая выезжает своим деплоем. Один измеримый результат — только твой: эта область вышла без пересборки shell, или первый бандл shell больше не содержал её код. Если такого проекта не было, ты так и говоришь.

      Архитектура, про которую стоит говорить после вопроса «как устроен проект». Продукт в браузере собран из частей с отдельным выпуском. Shell держит документ, вход в систему и верхние маршруты и монтирует нужный кусок. Remote закрывает одну область и отдаёт точку входа. Обычный механизм такой загрузки — Module Federation: shell читает remote entry, а общие React и UI-кит поднимаются одним экземпляром, с одной согласованной версией, иначе хуки ломаются на двух копиях React. Контракт узкий: маршрут, входные props и события наружу. State экранов остаётся внутри remote. Общий изменяемый store между remote связывает их версии и релизы. У собеседника ты уточняешь, где у них граница host и какие зависимости общие.

      #### Фраза на автомате

      Я спросил про архитектуру проекта, и микрофронтенды как раз про то, как она собрана. Если они были в моей работе, назову shell, один remote и результат: remote выходил отдельно, без пересборки shell. Shell держит вход и маршруты, remote — свою область, React общий один экземпляр, контракт — маршрут, props и события. Где у вас граница host и какие библиотеки общие?
---

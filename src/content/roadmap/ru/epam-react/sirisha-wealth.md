---
interview: sirisha-wealth
order: 1
title: "Sirisha Konchada — Wealth Management"
candidate: Sirisha Konchada
interviewer: Murali Kumar Adabala
initiative: Wealth Management
questions:
  - id: sirisha-wealth.1a
    label: "1a"
    topic: "Virtual DOM"
    title: "Что такое Virtual DOM и как он работает?"
    body: |
      #### Короткий ответ

      Virtual DOM — это дерево обычных JavaScript-объектов, которым React описывает UI. Компонент возвращает элементы. У элемента есть тип, props и children. Это не узлы браузера и не Shadow DOM.

      Когда ты меняешь state, React заново вызывает компонент и получает новое дерево. Reconciliation сравнивает его с предыдущим деревом fiber. У fiber есть тип компонента, его state и связи с ребёнком и соседом. В список правок для реального DOM попадает разница, а фаза commit применяет её к узлам браузера. Узел, который не изменился, React не создаёт заново.

      В списке ты ставишь стабильный key. React сопоставляет пункты по key. Без key сопоставление идёт по позиции, и после перестановки легко переиспользовать не тот DOM-узел вместе с его state.

      Виртуальное дерево не обещает, что оно быстрее ручной правки одного узла. Оно нужно, чтобы ты описал, каким UI должен быть: React пакетирует обновления и может выбросить ещё не закоммиченную отрисовку, например внутри startTransition. Пока React Compiler не включён, эта сверка сама по себе не пропускает детей.

      #### Фраза на автомате

      Virtual DOM — это объекты, которые описывают UI. После setState React сверяет новое дерево с fiber и в настоящий DOM пишет только разницу. Стабильный key в списке нужен, чтобы сопоставить те же пункты, а не перепутать их по позиции.
  - id: sirisha-wealth.1b
    label: "1b"
    topic: "Virtual DOM"
    title: "Если обновилось состояние родителя, дочерний компонент перерисуется, даже если его собственные props и state не менялись?"
    body: |
      #### Короткий ответ

      По умолчанию да. Обновление state родителя заново вызывает функцию родителя, и React обходит детей. Функция ребёнка тоже вызывается, даже если ты не передал новые props и его собственный state не менялся. State ребёнка при этом сохраняется: это тот же экземпляр.

      Перерисовка здесь — повторный вызов функции. До реального DOM дело доходит, только если сверка увидела другую разметку. Ребёнок может вызваться, вернуть то же дерево, и его DOM-узлы останутся на месте.

      React.memo на ребёнке останавливает вызов, если props поверхностно равны по Object.is. Без мемоизации даже ребёнок без props всё равно вызывается. В разработке Strict Mode может вызвать рендер дважды: это проверка чистоты рендера, а не второе пользовательское обновление.

      #### Пример кода

      ```jsx
      import { useState } from 'react';

      const Child = () => {
        console.log('Child render');
        return <p>static child</p>;
      };

      const Parent = () => {
        const [count, setCount] = useState(0);

        const handleClick = () => {
          setCount((value) => value + 1);
        };

        return (
          <div>
            <button type="button" onClick={handleClick}>
              {count}
            </button>
            <Child />
          </div>
        );
      };
      ```

      #### Фраза на автомате

      Да: по умолчанию React снова вызывает ребёнка, даже если его props и state те же. Это повторный вызов функции, и DOM меняется только если результат сверки другой. React.memo может пропустить вызов, когда props поверхностно равны.
  - id: sirisha-wealth.1c
    label: "1c"
    topic: "Virtual DOM"
    title: "Это технически «перерисовка» или «пересоздание» компонента?"
    body: |
      #### Короткий ответ

      Это перерисовка, пока на этом месте дерева тот же тип компонента и тот же key. React снова вызывает функцию и оставляет fiber: state, ref и DOM-узел живут дальше. В первом примере tick меняет родителя, а Editor с прежним key хранит draft.

      Заново экземпляр создаётся, когда для сверщика меняется личность компонента. Другой key, другой тип функции или ветка, которая сначала размонтировала его, дают unmount и mount. State тогда стартует с начального. Смена docId при key={docId} как раз сбрасывает draft.

      Отдельная ловушка — объявить компонент внутри рендера. Каждый проход родителя создаёт новую функцию-тип, и React монтирует её заново. Во втором примере local сбрасывается на клик по parent, хотя сам local ты не трогал. Компоненты объявляют снаружи.

      #### Пример кода

      ```jsx
      import { useState } from 'react';

      const Editor = () => {
        const [draft, setDraft] = useState('');

        const handleChange = (event) => {
          setDraft(event.target.value);
        };

        return <textarea value={draft} onChange={handleChange} aria-label="Draft" />;
      };

      const Screen = ({ docId, tick }) => {
        return (
          <section>
            <p>{tick}</p>
            <Editor key={docId} />
          </section>
        );
      };

      // Same key keeps Editor state when tick changes. A new docId remounts Editor.
      // Inline is a new type on every Parent render, so its state resets.

      const Parent = () => {
        const [n, setN] = useState(0);

        const handleClick = () => {
          setN((value) => value + 1);
        };

        const Inline = () => {
          const [local, setLocal] = useState(0);

          const handleLocal = () => {
            setLocal((value) => value + 1);
          };

          return (
            <button type="button" onClick={handleLocal}>
              local {local}
            </button>
          );
        };

        return (
          <div>
            <button type="button" onClick={handleClick}>
              parent {n}
            </button>
            <Inline />
          </div>
        );
      };
      ```

      #### Фраза на автомате

      Пока тип и key те же, это перерисовка: функцию вызвали снова, state на месте. Новый key, другой тип или размонтирование создают экземпляр заново. Компонент, объявленный внутри рендера, меняет тип на каждом проходе.
  - id: sirisha-wealth.2a
    label: "2a"
    topic: "Поведение рендера и оптимизация производительности"
    title: "Как избежать лишних перерисовок дочернего компонента (например, React.memo, useCallback, useMemo, размещение state рядом с тем, кто его использует)?"
    body: |
      #### Короткий ответ

      Лишнюю перерисовку ребёнка убирают с двух сторон: не будить его и, если родитель всё же рисуется, дать ребёнку пропустить работу.

      Размещение state. Строка, которая нужна только полю, живёт в компоненте поля. Соседний список тогда не входит в этот рендер. Поднимать state к общему родителю стоит, только если второй сосед его читает.

      React.memo сравнивает props через Object.is. Ребёнок не вызывается, если props поверхностно те же. Польза пропадает, когда родитель каждый раз передаёт новую функцию или новый объект. useCallback держит колбэк тем же, пока не изменились его зависимости. useMemo держит вычисленное значение тем же и не повторяет расчёт при тех же deps. useMemo не отменяет рендер того компонента, где он вызван. Он спасает мемоизированных детей, которым передан этот массив, и сам расчёт.

      Мемоизировать каждый узел не нужно: сравнение тоже стоит времени. Оборачиваешь то, что Profiler показал дорогим. Если включён React Compiler, часть обёрток он ставит сам. Пока его нет, нестабильный колбэк в props отменяет React.memo.

      В примере SearchBox держит query и не рисует список. У ExpensiveList свой selectedId. Сортировка закрыта useMemo по items, поэтому выбор строки не пересобирает массив. handleSelect стабилен, и в Row не передаётся selectedId, так что React.memo пропускает строку, когда изменился только выбор. Если каждой строке понадобится выбранный id, memo перестанет их отсеивать: подсветку тогда выносят в отдельный узел.

      #### Пример кода

      ```jsx
      import React, { useCallback, useMemo, useState } from 'react';

      const SearchBox = () => {
        const [query, setQuery] = useState('');

        const handleChange = (event) => {
          setQuery(event.target.value);
        };

        return <input value={query} onChange={handleChange} aria-label="Search" />;
      };

      const Row = React.memo(({ item, onSelect }) => {
        return (
          <li>
            <button type="button" onClick={() => onSelect(item.id)}>
              {item.name}
            </button>
          </li>
        );
      });

      const ExpensiveList = ({ items }) => {
        const [selectedId, setSelectedId] = useState(null);

        const handleSelect = useCallback((id) => {
          setSelectedId(id);
        }, []);

        const sorted = useMemo(
          () => [...items].sort((left, right) => left.name.localeCompare(right.name)),
          [items],
        );

        return (
          <div>
            <p>{selectedId}</p>
            <ul>
              {sorted.map((item) => (
                <Row key={item.id} item={item} onSelect={handleSelect} />
              ))}
            </ul>
          </div>
        );
      };

      const Screen = ({ items }) => {
        return (
          <section>
            <SearchBox />
            <ExpensiveList items={items} />
          </section>
        );
      };
      ```

      #### Фраза на автомате

      State поля я оставляю в поле, чтобы не будить список. Дорогого ребёнка оборачиваю в React.memo, колбэк даю через useCallback, массив — через useMemo. Иначе memo видит новые props и всё равно перерисовывает. Мемоизирую то, что показал Profiler.
  - id: sirisha-wealth.2b
    label: "2b"
    topic: "Поведение рендера и оптимизация производительности"
    title: "Общие приёмы оптимизации производительности React-приложений."
    body: |
      #### Короткий ответ

      Сначала смотришь, что именно медленно. React Profiler показывает, какой компонент долго считался и почему он попал в этот commit. Пока замера нет, useMemo и React.memo легко поставить на холодный путь и потратить время на сравнение.

      Дальше убираешь лишние рендеры. State держишь рядом с тем, кто его читает, чтобы ввод не будил тяжёлого соседа. Context API делишь по частоте обновлений: тема отдельно, данные, которые меняются часто, отдельно. Дорогую вёрстку оборачиваешь в React.memo и держишь props стабильными: колбэк через useCallback, объект и массив через useMemo. useMemo сохраняет результат между рендерами, сам рендер компонента он не отменяет.

      Длинный список не монтируешь целиком. Windowing рисует видимые строки. У строки стабильный key, не индекс, если порядок меняется. Производное значение считаешь во время рендера, а не кладёшь вторым setState.

      Несрочную работу помечаешь через useTransition или useDeferredValue: ввод остаётся срочным, тяжёлый список может подождать. В useLayoutEffect не кладёшь тяжёлую работу, он блокирует paint. Компонент не объявляешь внутри другого компонента, иначе тип меняется и дети размонтируются на каждом проходе.

      #### Фраза на автомате

      Сначала Profiler, потом причина. Чаще всего это слишком высокий state, один context на частые и редкие данные, нестабильные props у React.memo и длинный список без windowing. useTransition оставляет ввод срочным, а тяжёлую отрисовку откладывает. Мемоизацию ставлю после замера.
  - id: sirisha-wealth.2c
    label: "2c"
    topic: "Поведение рендера и оптимизация производительности"
    title: "Как ускорить первую загрузку, если React-приложение стартует медленно (code-splitting, lazy loading, разбор бандла и тому подобное)?"
    body: |
      #### Короткий ответ

      Первая загрузка тормозит, когда браузер долго качает и выполняет JavaScript. Сначала открываешь разбор бандла, например webpack-bundle-analyzer. Ищешь дубли библиотек, локали, попавшие целиком, и тяжёлый экран, который не нужен на первом кадре.

      Начальный чанк режешь по маршрутам. Экран грузится через React.lazy и import(): Webpack или сборщик кладёт его в отдельный файл, который скачивается при переходе. Рядом нужен Suspense с fallback, иначе приостановленный рендер некуда показать. Редкий тяжёлый кусок, редактор или график, грузишь так же по клику. Дробить каждую кнопку вредно: запросов становится слишком много. У ленивого модуля должен быть default export.

      Проверяешь tree-shaking. Полный импорт Lodash часто забирает библиотеку целиком, точечный путь или lodash-es оставляет одну функцию. В прод-бандле не должно быть dev-only пакетов. Чанки отдаёшь со сжатием, Brotli или gzip, и с долгим кэшем по хэшу в имени файла.

      SSR отдаёт HTML раньше, пользователь раньше видит разметку. Интерактивность всё равно ждёт JavaScript: hydration должна скачать и выполнить тот же UI. Если болит ответ на первый клик, выигрыш даёт меньший начальный бандл, а не только ранний HTML.

      #### Пример кода

      ```jsx
      import { lazy, Suspense } from 'react';

      const Reports = lazy(() => import('./Reports'));

      const App = () => {
        return (
          <Suspense fallback={<p>Loading</p>}>
            <Reports />
          </Suspense>
        );
      };
      ```

      #### Фраза на автомате

      Смотрю анализатор бандла и выношу маршруты в React.lazy с Suspense, тяжёлые библиотеки гружу по клику. Проверяю, что Lodash не попал в стартовый файл целиком и что чанки сжаты. SSR даёт ранний HTML, но hydration всё равно качает JavaScript, поэтому начальный бандл уменьшаю отдельно.
  - id: sirisha-wealth.3a
    label: "3a"
    topic: "Хуки React"
    title: "Какие хуки ты использовал и для чего?"
    body: |
      #### Короткий ответ

      Называешь хуки, которые сам писал, и одним предложением зачем. Чужой список своим стажем не называешь. Ниже рабочий набор, которым закрывают обычный UI и вопросы этого раунда.

      useState хранит локальный state куска экрана. useReducer собирает несколько полей одной командой. useEffect синхронизирует компонент с внешним миром после paint: подписка, запрос, document.title. Значение, которое выводится из props, считаешь в рендере, а не в эффекте. useLayoutEffect читает layout и правит DOM до кадра, который увидит пользователь. useRef держит mutable-ячейку без перерисовки и ссылку на DOM-узел. useMemo и useCallback держат стабильную ссылку или пропускают дорогой расчёт. useContext читает значение Context API. useId даёт стабильный id для связи label и поля. useTransition и useDeferredValue оставляют срочный ввод отзывчивым и позволяют отложить тяжёлую отрисовку. Кастомный хук выносит повторяющуюся связку state и эффектов.

      Хуки вызываешь на верхнем уровне, в одном и том же порядке, не внутри условия.

      #### Фраза на автомате

      Я называю хуки, которые сам писал: useState для локального state, useEffect для связи с внешним миром после paint, useRef для значения без перерисовки, useMemo и useCallback для стабильных ссылок, useContext для Context API, useReducer для связанных полей. Кастомный хук — когда эта связка нужна ещё раз. Вызов на верхнем уровне и в постоянном порядке.
  - id: sirisha-wealth.3b
    label: "3b"
    topic: "Хуки React"
    title: "useState и useEffect: как ведёт себя массив зависимостей, если массива нет, если он пустой и если в нём есть значения?"
    body: |
      #### Короткий ответ

      У useState нет массива зависимостей. Он хранит значение между рендерами этого экземпляра. Аргумент useState используется как начальное значение только на mount. Форма useState(() => compute()) тоже вызывает функцию один раз на mount: это ленивый инициализатор, а не deps.

      Массив зависимостей — второй аргумент useEffect. Так же устроены useLayoutEffect, useMemo и useCallback. Элементы сравниваются через Object.is.

      Без массива эффект выполняется после каждого зафиксированного рендера. setState внутри без условия зацикливает компонент: рендер, эффект, обновление, снова рендер.

      Пустой массив [] запускает эффект после монтирования, а cleanup — при размонтировании. В продакшене это один раз на жизнь экземпляра. В разработке Strict Mode монтирует, снимает и монтирует снова, чтобы проявился пропущенный cleanup. Пустой массив не следит за props. Если внутри прочитать userId, замыкание останется на первом значении. Для продакшена это ошибка: читаешь свежее значение — кладёшь его в массив.

      Массив со значениями запускает эффект после mount и после рендера, где изменился любой элемент. Cleanup предыдущего запуска вызывается перед следующим эффектом и при unmount. В массив входит всё, что эффект читает и что может измениться. Сеттер useState стабилен, его можно не указывать. Объект или функция, созданные прямо в рендере, новые каждый раз, и эффект срабатывает снова.

      #### Пример кода

      ```jsx
      import { useEffect, useState } from 'react';

      const Reporter = ({ userId }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
          console.log('no array', count);
        });

        useEffect(() => {
          console.log('mount', userId);
          return () => console.log('unmount');
        }, []);

        useEffect(() => {
          console.log('user changed', userId);
        }, [userId]);

        const handleClick = () => {
          setCount((value) => value + 1);
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };
      ```

      #### Фраза на автомате

      У useState массива зависимостей нет: начальное значение, и ленивая функция тоже, берётся на mount. У useEffect без массива эффект идёт после каждого рендера, с [] — после mount и cleanup на unmount, со значениями — когда Object.is видит изменение. Читаешь свежий props — кладёшь его в массив, иначе замыкание устареет. В Strict Mode пустой эффект в dev ещё и проверяют двойным mount.
  - id: sirisha-wealth.3c
    label: "3c"
    topic: "Хуки React"
    title: "Вызывает ли обновление значения useRef перерисовку? Почему?"
    body: |
      #### Короткий ответ

      Нет. useRef возвращает один и тот же объект { current } на все рендеры этого экземпляра. Запись в ref.current меняет поле и не просит React нарисовать компонент снова. Экран остаётся прежним, пока рендер не случится по другой причине: setState, новые props или новое значение Context API.

      Поэтому в ref кладут id таймера, прошлое значение и любой черновик, который не является источником разметки. Если число должно появиться на экране, это useState.

      Второй обычный случай — DOM. Ты передаёшь ref на элемент, React записывает узел в current после commit. Эта запись тоже не планирует отдельный рендер. JSX, который прочитал clicks.current, увидит новое число только на следующем рендере. Кнопка «ref only» в примере копит клики молча, кнопка «re-render» показывает уже накопленное.

      #### Пример кода

      ```jsx
      import { useRef, useState } from 'react';

      const Box = () => {
        const [, setTick] = useState(0);
        const clicks = useRef(0);

        const handleRefOnly = () => {
          clicks.current += 1;
        };

        const handleWithState = () => {
          setTick((value) => value + 1);
        };

        return (
          <div>
            <p>{clicks.current}</p>
            <button type="button" onClick={handleRefOnly}>
              ref only
            </button>
            <button type="button" onClick={handleWithState}>
              re-render
            </button>
          </div>
        );
      };
      ```

      #### Фраза на автомате

      Обновление useRef не перерисовывает компонент: меняется current у стабильного объекта, и React на это не подписан. Чтобы число появилось в UI, нужен useState. Запись DOM-узла в ref после commit тоже не планирует рендер.
  - id: sirisha-wealth.3d
    label: "3d"
    topic: "Хуки React"
    title: "Чем useLayoutEffect отличается от useEffect и когда что выбирать?"
    body: |
      #### Короткий ответ

      Оба хука принимают функцию, массив зависимостей и cleanup. Разница во времени относительно paint.

      useEffect запускается после того, как браузер нарисовал кадр. Им пользуешься для запроса, подписки, лога и document.title. Paint он не задерживает. На мгновение пользователь может увидеть предыдущий кадр, для сети это нормально.

      useLayoutEffect запускается после правок DOM и до paint. Им пользуешься, когда нужно измерить узел через getBoundingClientRect и сразу записать позицию, чтобы кадр не мигнул: тултип, меню, восстановление скролла. setState из этого эффекта React применит до показа кадра. Цена в том, что ты держишь отрисовку, поэтому тело короткое. Сеть и тяжёлый расчёт сюда не кладут. В примере top тултипа считается от низа якоря до того, как браузер покажет span с position: fixed. Тот же код в useEffect успел бы нарисовать кадр с top, равным нулю.

      На сервере layout нет. useLayoutEffect там не измеряет документ и пишет предупреждение. Для SSR оставляешь useEffect либо включаешь измерение только после монтирования на клиенте.

      По умолчанию бери useEffect. useLayoutEffect — точечный инструмент против мигания, а не более ранний эффект на всякий случай.

      #### Пример кода

      ```jsx
      import { useLayoutEffect, useRef, useState } from 'react';

      const Tooltip = ({ text }) => {
        const anchorRef = useRef(null);
        const [top, setTop] = useState(0);

        useLayoutEffect(() => {
          const rect = anchorRef.current.getBoundingClientRect();
          setTop(rect.bottom);
        }, [text]);

        return (
          <span ref={anchorRef}>
            {text}
            <span style={{ position: 'fixed', top }}>{text}</span>
          </span>
        );
      };
      ```

      #### Фраза на автомате

      useEffect бежит после paint, useLayoutEffect — после обновления DOM и до paint. Запрос и подписка идут в useEffect, чтобы не держать кадр. Измерение и поправка позиции до мигания — в useLayoutEffect, и тело там короткое. На SSR layout нет, для сервера оставляю useEffect.
  - id: sirisha-wealth.3e
    label: "3e"
    topic: "Хуки React"
    title: "useState или useReducer: когда что предпочтительнее, если учитывать сложность и вложенные обновления state?"
    body: |
      #### Короткий ответ

      useState предпочтителен, когда поля независимы и следующее значение читается на месте: число, строка, флаг. Несколько setState в одном обработчике React 18 собирает в один рендер, в том числе в таймере и в промисе. Ради батчинга useReducer не выбирают.

      useReducer предпочтителен, когда следующий state — одна команда над несколькими полями. Action edit в примере сразу пишет draft, поднимает dirty и снимает error. Разъехавшаяся комбинация, которую легко забыть в трёх отдельных setState, в редьюсере не собирается. Функция чистая, её можно проверить без компонента. dispatch стабилен, его удобно передать вниз без useCallback.

      Вложенное обновление живёт там же. Развёртка вроде profile: { ...state.profile, name } написана в редьюсере один раз, а не скопирована по обработчикам. Если объект плоский и поля меняются по отдельности, оставляешь несколько useState: редьюсер на один toggle только удлиняет код.

      #### Пример кода

      ```jsx
      import { useReducer } from 'react';

      const initialState = { draft: '', dirty: false, saving: false, error: '' };

      const reducer = (state, action) => {
        switch (action.type) {
          case 'edit':
            return { ...state, draft: action.draft, dirty: true, error: '' };
          case 'save':
            return { ...state, saving: true, error: '' };
          case 'save-failed':
            return { ...state, saving: false, error: action.error };
          default:
            return state;
        }
      };

      const Composer = () => {
        const [state, dispatch] = useReducer(reducer, initialState);

        const handleChange = (event) => {
          dispatch({ type: 'edit', draft: event.target.value });
        };

        return (
          <textarea value={state.draft} onChange={handleChange} aria-label="Draft" />
        );
      };
      ```

      #### Фраза на автомате

      Независимые поля оставляю в useState. Несколько связанных полей одной командой кладу в useReducer: action собирает целый state, dispatch стабилен, переход можно проверить отдельно. В React 18 несколько setState и так батчатся, редьюсер я беру из-за сложности state, а не из-за лишних рендеров.
  - id: sirisha-wealth.3f
    label: "3f"
    topic: "Хуки React"
    title: "Может ли кастомный хук-обёртка над useReducer быть общим хранилищем для компонентов, как Redux? Если компонент A обновит state через него, увидит ли это компонент B?"
    body: |
      #### Короткий ответ

      Нет. useReducer внутри хука создаёт state на fiber того компонента, который этот хук вызвал. CounterA и CounterB оба вызывают useCounter и получают два независимых state. dispatch('inc') в A меняет только A. B по-прежнему показывает свой ноль. Два вызова одного хука в одном компоненте — тоже два state.

      Redux устроен иначе: один store живёт снаружи компонентов, и оба на него подписаны. Обёртка с префиксом use этого store не создаёт.

      Общая ячейка появляется, только если state живёт в одном месте, а хук это место читает. Поднимаешь useReducer в общего родителя и отдаёшь значение через Context API, либо держишь store модулем и подписываешь компоненты через useSyncExternalStore. Вызов useReducer на каждом компоненте между ними данными не делится.

      #### Пример кода

      ```jsx
      import { useReducer } from 'react';

      const reducer = (count, action) => {
        if (action === 'inc') return count + 1;
        return count;
      };

      const useCounter = () => useReducer(reducer, 0);

      const CounterA = () => {
        const [count, dispatch] = useCounter();

        const handleClick = () => {
          dispatch('inc');
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };

      const CounterB = () => {
        const [count] = useCounter();
        return <span>{count}</span>;
      };
      ```

      #### Фраза на автомате

      Хук-обёртка над useReducer — не общий store. Каждый вызов получает свой state, поэтому компонент B не видит dispatch компонента A. Общий state появляется, если один useReducer живёт в провайдере Context API или во внешнем store с подпиской useSyncExternalStore.
  - id: sirisha-wealth.3g
    label: "3g"
    topic: "Хуки React"
    title: "Что такое кастомные хуки и зачем их пишут?"
    body: |
      #### Короткий ответ

      Кастомный хук — функция, имя которой начинается с use и которая может вызывать другие хуки. Им выносят логику с состоянием. Разметку шарят компонентом. Прежний способ передать поведение обёрткой — HOC: он добавляет компонент вокруг. Хук вызывается внутри и лишний узел в дерево не кладёт.

      Пишешь хук, когда два компонента делают одну связку state и эффектов, или когда компонент уже трудно читать. Вход — обычные параметры, как initial у useToggle. Наружу отдаёшь значения и обработчики.

      Каждый вызов владеет своим state. Два вызова useToggle — два независимых флага, общий store от этого не появляется. Правила те же, что у встроенных хуков: верхний уровень, один и тот же порядок, не под условием. Хук можно собирать из других хуков.

      #### Пример кода

      ```jsx
      import { useState } from 'react';

      const useToggle = (initial) => {
        const [on, setOn] = useState(initial);

        const handleToggle = () => {
          setOn((value) => !value);
        };

        return { on, handleToggle };
      };

      const Panel = () => {
        const { on, handleToggle } = useToggle(false);

        return (
          <button type="button" onClick={handleToggle} aria-pressed={on}>
            {on ? 'on' : 'off'}
          </button>
        );
      };
      ```

      #### Фраза на автомате

      Кастомный хук — это функция useSomething, которая вызывает хуки и возвращает данные и действия. Им шарят логику с состоянием, без лишнего HOC и без копирования. Каждый вызов держит свой state, общий store сам собой так не появляется.
  - id: sirisha-wealth.4a
    label: "4a"
    topic: "Управление состоянием: Redux и Context API"
    title: "Какие middleware ты использовал с Redux (Thunk, знакомство с Saga) и что middleware делают в Redux?"
    body: |
      #### Короткий ответ

      Middleware в Redux — прослойка между dispatch и редьюсером. Форма такая: store => next => action. Ты видишь action и getState, можешь сходить в сеть, записать лог, остановить action или вызвать next(action), чтобы пустить его дальше. Редьюсер остаётся чистой функцией. Побочные эффекты живут в middleware. applyMiddleware собирает цепочку, и первый middleware в списке видит dispatch первым.

      Для асинхронной загрузки опираешься на Thunk. Он разрешает диспатчить функцию. Функция получает dispatch и getState, делает fetch и потом диспатчит обычные объекты: loading, loaded или failed. В Redux Toolkit thunk уже входит в configureStore, а createAsyncThunk собирает те же шаги в один описанный запрос.

      Redux Saga разбираешь на уровне модели и не приписываешь себе прод, если сам её не вёл. Это middleware на генераторах. Вотчер делает yield take, call для промиса и put для следующего action. Сами объекты эффектов исполняет middleware. Saga удобна для длинного сценария, отмены и гонки запросов. Обычную загрузку данных закрывает Thunk.

      #### Пример кода

      ```js
      const logger = (store) => (next) => (action) => {
        const result = next(action);
        console.log(action.type, store.getState());
        return result;
      };

      const thunk = (store) => (next) => (action) => {
        if (typeof action === 'function') {
          return action(store.dispatch, store.getState);
        }
        return next(action);
      };

      const fetchPosts = () => async (dispatch) => {
        dispatch({ type: 'posts/loading' });
        const response = await fetch('/api/posts');
        if (!response.ok) {
          dispatch({ type: 'posts/failed' });
          return;
        }
        const posts = await response.json();
        dispatch({ type: 'posts/loaded', posts });
      };

      // applyMiddleware(thunk, logger), then dispatch(fetchPosts())
      ```

      #### Фраза на автомате

      Middleware стоит между dispatch и редьюсером: store => next => action. Эффекты живут там, редьюсер чистый. Для запросов я диспатчу thunk-функцию: внутри fetch и обычные action loading, loaded, failed. Saga знаю как генераторы с take, call и put и называю её прод-опытом только если сам её вёл.
  - id: sirisha-wealth.4b
    label: "4b"
    topic: "Управление состоянием: Redux и Context API"
    title: "Можно ли повторить поведение Redux, включая middleware, через Context API?"
    body: |
      #### Короткий ответ

      Каркас можно собрать для небольшого приложения. Готовой заменой Redux это не становится.

      Один useReducer живёт в провайдере, Context API раздаёт state и dispatch вниз. Middleware пишешь сам. Обёртка над dispatch смотрит, функция ли action. Функцию вызываешь как thunk и передаёшь ей dispatch и getState. getState нельзя замыкать на state текущего рендера навсегда: его читают из ref, который обновляют на каждом проходе. Обычный объект action уходит во внутренний dispatch редьюсера.

      Чего схема не даёт. react-redux подписывает useSelector на store и не рисует компонент, если выбранный кусок равен предыдущему. Context API будит каждого, кто прочитал value. DevTools, time travel и готовую Saga пришлось бы писать заново: у генераторов свой исполнитель эффектов, одна проверка typeof function его не повторяет. Для темы и редкого флага хватает Context API. Для большого стора с разными подписками оставляешь Redux или другой внешний store.

      #### Пример кода

      ```jsx
      import React, { useCallback, useMemo, useReducer, useRef } from 'react';

      const StoreContext = React.createContext(null);

      const reducer = (state, action) => {
        if (action.type === 'posts/loaded') {
          return { ...state, posts: action.posts };
        }
        return state;
      };

      const Provider = ({ children }) => {
        const [state, dispatch] = useReducer(reducer, { posts: [] });
        const stateRef = useRef(state);
        stateRef.current = state;

        const dispatchWithMiddleware = useCallback((action) => {
          if (typeof action === 'function') {
            action(dispatchWithMiddleware, () => stateRef.current);
            return;
          }
          dispatch(action);
        }, [dispatch]);

        const value = useMemo(
          () => ({ state, dispatch: dispatchWithMiddleware }),
          [state, dispatchWithMiddleware],
        );

        return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
      };
      ```

      #### Фраза на автомате

      Да, узкий каркас Redux на Context API собирается: провайдер с useReducer и обёртка dispatch, которая выполняет thunk и читает getState из ref. Это не замена Redux. Нет выборочной подписки useSelector, DevTools и готовой Saga. Для маленького state хватает, большой стор я оставляю в Redux.
  - id: sirisha-wealth.4c
    label: "4c"
    topic: "Управление состоянием: Redux и Context API"
    title: "Может ли Context API заменить Redux для глобального state? Когда Context уместнее Redux, а когда нет?"
    body: |
      #### Короткий ответ

      Context API может донести глобальное значение, но сам store-ом не является. State всё равно живёт в useState или useReducer у провайдера. Кто вызвал useContext, подписан на value целиком, а не на одно поле.

      Context уместен, когда значение меняется редко и его читают далеко от владельца: тема, локаль, текущий пользователь, клиент API. Props тогда не идут через компоненты, которым это значение не нужно, и зависимость Redux не появляется.

      Redux уместен, когда обновления частые, срезов много и разным экранам нужны разные куски. useSelector перерисует компонент, если изменился его результат, даже когда остальной store шумный. Туда же ложатся middleware для асинхронных сценариев и DevTools. react-redux как раз кладёт store в context, а сравнение выбранного куска делает подписка селектора. Сам Context API так не умеет.

      Тема может жить в Context API, а доменные данные в Redux. Менять Redux на один context стоит, когда тебе не нужны ни частые точечные подписки, ни middleware.

      #### Фраза на автомате

      Context API доставляет value, это не store. Для темы, локали и редкого пользователя он уместнее Redux. Для частых обновлений, разных срезов, middleware и DevTools я оставляю Redux: useSelector следит за куском, а context будит всех, кто прочитал value. Рядом они спокойно живут.
  - id: sirisha-wealth.4d
    label: "4d"
    topic: "Управление состоянием: Redux и Context API"
    title: "В чём недостаток Context API? Например, подписчики перерисовываются при любом изменении значения контекста, даже если оно им не нужно."
    body: |
      #### Короткий ответ

      Недостаток в том, что подписка крупная. Все, кто вызвал useContext на этот контекст, перерисовываются, когда value меняется по Object.is. Компоненту, который прочитал theme, всё равно, что изменился user: новое value будит и его. Селектора у Context API нет.

      Бытовая форма той же цены — объект на месте: value={{ user, theme, setUser, setTheme }}. Это новый объект на каждом рендере провайдера. Подписчики просыпаются, даже если user и theme те же и провайдер перерисовался по другой причине. useMemo на этом объекте убирает ложную смену ссылки. Он не делит подписку: как только user реально новый, мемоизированный объект тоже новый, и ThemeLabel рисуется снова.

      Делишь контексты по данным: тема своим провайдером, пользователь своим. Часто меняющееся state уносишь в компонент, который его показывает, или во внешний store, где подписка умеет сравнивать выбранный кусок. React.memo на промежуточном родителе потребителя контекста не останавливает: подписчик обновится, даже если предок вышел из рендера через memo.

      #### Пример кода

      ```jsx
      import React, { useState } from 'react';

      const AppContext = React.createContext(null);

      const Provider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [theme, setTheme] = useState('light');

        return (
          <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
            {children}
          </AppContext.Provider>
        );
      };

      const ThemeLabel = () => {
        const { theme } = React.useContext(AppContext);
        return <span>{theme}</span>;
      };
      ```

      #### Фраза на автомате

      Подписчик Context API перерисовывается на любое новое value, даже если изменилось поле, которое он не читает. Объект value={{ ... }} на каждом рендере провайдера будит всех ещё и без смены данных. Я делю контексты и держу ссылку value стабильной через useMemo.
  - id: sirisha-wealth.4e
    label: "4e"
    topic: "Управление состоянием: Redux и Context API"
    title: "Если кастомный хук уже умеет держать общее состояние между компонентами, зачем тогда Context API?"
    body: |
      #### Короткий ответ

      Для хука, который сам вызывает useState или useReducer, посылка не выполняется. Такой вызов создаёт state на компоненте, который хук вызвал. IsolatedB, вызвав тот же хук, получает другую ячейку и не видит клик в IsolatedA. Общий импорт функции ячейки не объединяет.

      Context API как раз держит одну ячейку на поддерево. useState живёт в CounterProvider, провайдер отдаёт пару value вниз, useSharedCounter только вызывает useContext. Хук тогда удобный API, context — канал к одному state. SharedA и SharedB видят одно число, потому что стоят под одним провайдером. Второй провайдер дал бы второе число.

      Модульный store снаружи тоже умеет быть общим, и тогда context не обязателен. Компоненты сами об изменении не узнают: нужна подписка, обычно useSyncExternalStore. Модуль один на страницу, его трудно подменить в тесте и нельзя честно иметь два независимых экземпляра. Два провайдера дают две области. Поэтому context остаётся рядом с хуками: хук читает, провайдер владеет одним state и ограничивает, кто его видит.

      #### Пример кода

      ```jsx
      import React, { useContext, useState } from 'react';

      const useIsolatedCounter = () => useState(0);

      const IsolatedA = () => {
        const [count, setCount] = useIsolatedCounter();

        const handleClick = () => {
          setCount(count + 1);
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };

      const IsolatedB = () => {
        const [count] = useIsolatedCounter();
        return <span>{count}</span>;
      };

      const CounterContext = React.createContext(null);

      const CounterProvider = ({ children }) => {
        const value = useState(0);
        return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
      };

      const useSharedCounter = () => useContext(CounterContext);

      const SharedA = () => {
        const [count, setCount] = useSharedCounter();

        const handleClick = () => {
          setCount(count + 1);
        };

        return (
          <button type="button" onClick={handleClick}>
            {count}
          </button>
        );
      };

      const SharedB = () => {
        const [count] = useSharedCounter();
        return <span>{count}</span>;
      };

      const Screen = () => {
        return (
          <CounterProvider>
            <SharedA />
            <SharedB />
          </CounterProvider>
        );
      };
      ```

      #### Фраза на автомате

      Хук с useState или useReducer внутри не шарит state: у каждого вызова своя ячейка. Context API нужен, чтобы один state жил в провайдере, а хук только читал его через useContext. Внешний модуль тоже шарит данные, но тогда нужна подписка useSyncExternalStore, и нет отдельной области одного поддерева.
  - id: sirisha-wealth.5a
    label: "5a"
    topic: "Порталы React"
    title: "Что такое порталы React?"
    body: |
      #### Короткий ответ

      Портал рендерит детей в другой DOM-узел и оставляет их в том же дереве React. Это createPortal(children, domNode) из react-dom. Часто domNode — document.body или отдельный корень, который уже есть в HTML.

      Для React дети портала остаются детьми компонента, который его создал. Context API внутри читается. Событие всплывает по дереву React: onClick родителя сработает на клик внутри портала, хотя в DOM родитель другой.

      В документе узел лежит там, куда ты передал второй аргумент, а не внутри JSX-родителя. Поэтому overflow родителя его не обрезает. Наследование CSS идёт по DOM. Цвет и шрифт портал возьмёт от окружения body, если сам их не задал.

      На сервере document нет. Портал открываешь на клиенте, когда целевой узел уже есть. К document.body на SSR не обращаются.

      #### Пример кода

      ```jsx
      import { createPortal } from 'react-dom';

      const Modal = ({ children }) => {
        return createPortal(<div role="dialog">{children}</div>, document.body);
      };
      ```

      #### Фраза на автомате

      Портал — это createPortal(children, domNode). Разметка встаёт в другой DOM-узел, а в дереве React остаётся ребёнком своего компонента. События и Context API идут по React, стили наследуются по DOM. Модалка может жить в body и всё ещё быть частью компонента.
  - id: sirisha-wealth.5b
    label: "5b"
    topic: "Порталы React"
    title: "Какой практический случай для них, например модалки, тултипы и дропдауны, которым нужно выйти из overflow и z-index родителя?"
    body: |
      #### Короткий ответ

      Практический случай — слой, который нельзя оставлять внутри карточки: модалка, тултип, дропдаун, тост. У родителя часто стоит overflow: hidden. Transform, filter и opacity создают новый stacking context. Потомок с position и большим z-index всё равно обрежется или окажется под шапкой, которая лежит в другом контексте. z-index сравнивается внутри своего контекста, а не со всей страницей.

      createPortal в document.body вынимает меню из карточки. Обрезка родителя и его stacking context на этот узел больше не действуют. Открыто меню или нет, решает state карточки. Клик по пункту всплывёт к React-родителю, даже если DOM-узел меню подвешен к body.

      Портал не нужен всплывашке, чей предок и так не обрезает и не создаёт свой слой. На самом портальном узле задаёшь фон, фокус и роль: от карточки цвет и шрифт по наследству не придут.

      #### Пример кода

      ```jsx
      import { useState } from 'react';
      import { createPortal } from 'react-dom';

      const Menu = ({ open, children }) => {
        if (!open) return null;

        return createPortal(<div role="menu">{children}</div>, document.body);
      };

      const Card = () => {
        const [open, setOpen] = useState(false);

        const handleToggle = () => {
          setOpen((value) => !value);
        };

        return (
          <div style={{ overflow: 'hidden' }}>
            <button type="button" onClick={handleToggle}>
              Menu
            </button>
            <Menu open={open}>
              <button type="button">Edit</button>
            </Menu>
          </div>
        );
      };
      ```

      #### Фраза на автомате

      Модалку, тултип и дропдаун я порталю в document.body, когда у родителя overflow или свой stacking context и z-index внутри карточки их не спасает. Открытие остаётся state родителя, клик доходит по дереву React. Узел в body уже сравнивает слой со страницей, а не с обрезанным родителем.
  - id: sirisha-wealth.6a
    label: "6a"
    topic: "Микрофронтенды / Module Federation"
    title: "Какой у тебя опыт с Module Federation?"
    body: |
      #### Короткий ответ

      На этот вопрос отвечают своим опытом. Чужие годы, компанию и цифры сюда не подставляют. За минуту называешь четыре вещи, а если пункта не было, так и говоришь.

      Роль: собирал хост, подключал remote или пока разбирал схему. Стек: Webpack 5 и Module Federation, хост и один remote, общий React через shared и singleton, при необходимости так же Lodash. Один проект своими словами: оболочка и виджет, который хост грузит по URL файла remote entry, а не из своего бандла. Один результат, только если он был у тебя: виджет выкатывался отдельно, и хост не пересобирали на каждый его релиз.

      Этот текст — каркас того, что сказать. Биографии конкретного человека в нём нет.

      #### Фраза на автомате

      Говорю по своему опыту с Module Federation: роль, хост и один remote, общий singleton для React. Если виджет выезжал отдельным деплоем, называю этот результат своими словами. Чего не делал, не добавляю.
  - id: sirisha-wealth.6b
    label: "6b"
    topic: "Микрофронтенды / Module Federation"
    title: "Что такое remote entry в Module Federation?"
    body: |
      #### Короткий ответ

      remote entry — это небольшой файл-контейнер, который сборка remote отдаёт наружу. В ModuleFederationPlugin ему соответствуют name и filename: 'remoteEntry.js'. Хост не кладёт код виджета в свой бандл. Он грузит этот скрипт по URL из remotes. Строка catalog@https://cdn.example.com/catalog/remoteEntry.js значит: контейнер с именем catalog лежит по этому адресу. Имя до @ совпадает с name удалённой сборки, иначе хост не найдёт контейнер.

      В самом remoteEntry.js нет компонента ProductList. Там runtime Module Federation и карта exposes. Ключ ./ProductList указывает на чанк, в котором модуль собран. Хост загружает скрипт, вызывает init с общим share scope и по требованию get('./ProductList'). get возвращает фабрику модуля, вызов фабрики даёт экспорт. Чанк модуля скачивается в этот момент, а не обязательно вместе с remote entry.

      В приложении хоста это динамический импорт catalog/ProductList, обычно через React.lazy. Пока скрипт remote entry не загрузился или имя не совпало, модуля нет.

      #### Пример кода

      ```js
      const { ModuleFederationPlugin } = require('webpack').container;

      const remotePlugin = new ModuleFederationPlugin({
        name: 'catalog',
        filename: 'remoteEntry.js',
        exposes: {
          './ProductList': './src/ProductList',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      const hostPlugin = new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          catalog: 'catalog@https://cdn.example.com/catalog/remoteEntry.js',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      // remotePlugin goes into the remote webpack plugins array.
      // hostPlugin goes into the host webpack plugins array.

      const React = require('react');

      const ProductList = React.lazy(() => import('catalog/ProductList'));
      ```

      #### Фраза на автомате

      remote entry — это remoteEntry.js, манифест контейнера, а не сам виджет. Хост грузит его по URL из remotes, и имя до @ совпадает с name сборки. Дальше контейнер по exposes отдаёт модуль, и хост импортирует его как catalog/ProductList.
  - id: sirisha-wealth.6c
    label: "6c"
    topic: "Микрофронтенды / Module Federation"
    title: "Если несколько микрофронтендов зависят от одной библиотеки, например Lodash, как добиться, чтобы загрузился один общий экземпляр?"
    body: |
      #### Короткий ответ

      Один экземпляр получается через shared, и блок должен стоять и на хосте, и на каждом remote. Если Lodash указан только с одной стороны, вторая зашьёт свою копию в чанк.

      У пакета ставят singleton: true. Runtime Module Federation после init общего share scope не грузит вторую копию: экземпляр, который уже предоставлен, используют остальные. requiredVersion задаёт semver-диапазон, который эта сборка считает подходящим. Если загруженная версия в диапазон не попала, в консоли будет предупреждение, а экземпляр всё равно останется один. Это может быть не та версия, на которую рассчитывал remote, поэтому диапазоны на хосте и remote держат совместимыми.

      Две копии Lodash стоят лишних килобайт и могут разойтись в поведении. Две копии React ломают хуки: у каждого экземпляра свой dispatcher. Настраивается это тем же shared. В коде библиотеку импортируют как обычный модуль, а вторую приватную копию мимо плагина не кладут.

      #### Пример кода

      ```js
      const { ModuleFederationPlugin } = require('webpack').container;

      const remotePlugin = new ModuleFederationPlugin({
        name: 'catalog',
        filename: 'remoteEntry.js',
        exposes: {
          './ProductList': './src/ProductList',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      const hostPlugin = new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          catalog: 'catalog@https://cdn.example.com/catalog/remoteEntry.js',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      // remotePlugin goes into the remote webpack plugins array.
      // hostPlugin goes into the host webpack plugins array.

      const React = require('react');

      const ProductList = React.lazy(() => import('catalog/ProductList'));
      ```

      #### Фраза на автомате

      Lodash я объявляю в shared и на хосте, и на remote, с singleton: true. Runtime оставляет один экземпляр на общий share scope. requiredVersion фиксирует ожидаемый диапазон: при расхождении копия всё равно одна, но в консоли будет предупреждение, поэтому версии я согласовываю. Для React тот же флаг нужен, чтобы хуки видели один dispatcher.
  - id: sirisha-wealth.6d
    label: "6d"
    topic: "Микрофронтенды / Module Federation"
    title: "Как это настраивается: shared, singleton: true, requiredVersion?"
    body: |
      #### Короткий ответ

      Настройка — объект shared у ModuleFederationPlugin. Его повторяют в сборке хоста и в сборке remote, иначе remote увезёт свою копию. Ключ — имя пакета, как его импортируют: lodash. Внутри singleton: true оставляет один экземпляр. requiredVersion — semver-диапазон, с которым собран этот билд, обычно из dependencies, например ^4.17.21. Если отдать пакет строкой, Webpack может прочитать версию из package.json сам. Явный объект как раз показывает три вещи из вопроса: shared, singleton и requiredVersion.

      Один singleton при несовпавшем диапазоне даёт один экземпляр и предупреждение. strictVersion: true превращает это предупреждение в отказ принять чужую версию. Флаг включаешь, когда молча работать на другой версии опаснее, чем остановить загрузку.

      Кто физически привозит файл, зависит от загрузки. eager: true на хосте кладёт библиотеку в начальный чанк хоста, и remote переиспользует её. Для React так делают, чтобы dispatcher был хостовый и готов до инициализации remote. Для Lodash eager необязателен, если устраивает копия того, кто загрузился первым. В примере ниже стоят поля, о которых спрашивают, одинаково у remotePlugin и hostPlugin.

      #### Пример кода

      ```js
      const { ModuleFederationPlugin } = require('webpack').container;

      const remotePlugin = new ModuleFederationPlugin({
        name: 'catalog',
        filename: 'remoteEntry.js',
        exposes: {
          './ProductList': './src/ProductList',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      const hostPlugin = new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          catalog: 'catalog@https://cdn.example.com/catalog/remoteEntry.js',
        },
        shared: {
          lodash: { singleton: true, requiredVersion: '^4.17.21' },
        },
      });

      // remotePlugin goes into the remote webpack plugins array.
      // hostPlugin goes into the host webpack plugins array.

      const React = require('react');

      const ProductList = React.lazy(() => import('catalog/ProductList'));
      ```

      #### Фраза на автомате

      В shared у хоста и у remote я пишу lodash: { singleton: true, requiredVersion: '^4.17.21' }. singleton оставляет один экземпляр, requiredVersion — диапазон, который билд требует. Один и тот же блок нужен с обеих сторон, иначе remote привезёт свою копию Lodash.
  - id: sirisha-wealth.7a
    label: "7a"
    topic: "Логическая задача (не про React, но была в раунде)"
    title: "Выведи трёхзначный код по подсказкам о том, какая цифра верная и стоит ли она на своём месте."
    body: |
      #### Короткий ответ

      В этом пункте PDF подсказок нет. Не даны попытки и не сказано, какая цифра верная и стоит ли она на своём месте. Из пустого условия трёхзначный код не выводится, и программу по нему написать нельзя: выводить не из чего.

      #### Фраза на автомате

      В PDF у этого пункта нет подсказок про цифры и позиции, поэтому код я отсюда не вывожу и решение не пишу.
  - id: sirisha-wealth.8a
    label: "8a"
    topic: "Лайвкодинг"
    title: "Забери посты из JSONPlaceholder API и сохрани их в state."
    body: |
      #### Короткий ответ

      Посты забираешь один раз после монтирования: GET https://jsonplaceholder.typicode.com/posts. Ответ — массив, у элемента есть id, title, body и userId. Массив кладёшь в useState.

      Запрос стоит в useEffect с пустым массивом зависимостей. Перед response.json проверяешь response.ok, иначе в state попадёт не список постов. Рядом лежат loading и error: пустой массив до ответа не означает, что постов нет. Cleanup эффекта — AbortController. На размонтировании запрос обрывается, и setState снятого экземпляра не вызывается. В разработке Strict Mode прогоняет эффект дважды, abort гасит первый проход.

      Поле поиска на этом шаге ещё не нужно. Задача — положить данные в state и уметь показать ошибку загрузки.

      #### Пример кода

      Это разбор условия, а не экран кандидата: в PDF нет его кода, пример собран по формулировке задачи.

      ```jsx
      import { useEffect, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <div>
            {posts.map((post) => (
              <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                {post.title}
              </div>
            ))}
          </div>
        );
      };
      ```

      #### Фраза на автомате

      Посты JSONPlaceholder я забираю в useEffect на mount, проверяю response.ok и кладу массив в useState. На размонтировании обрываю fetch через AbortController. Пока запрос идёт, на экране loading, а не пустой список.
  - id: sirisha-wealth.8b
    label: "8b"
    topic: "Лайвкодинг"
    title: "Сделай поиск и фильтр по полю title."
    body: |
      #### Короткий ответ

      Поиск — контролируемое поле и фильтр уже загруженного массива. На каждый символ новый запрос не уходит: JSONPlaceholder в этой задаче отдаёт посты один раз, title режется на клиенте.

      query живёт в своём useState. Видимые посты — filter по title. Строку запроса обрезаешь и приводишь к нижнему регистру, то же делаешь с title, дальше includes. Пустой запрос оставляет все посты: поиск пустой подстроки для любой title истинен. Регистр ввода на результат не влияет.

      Поле сразу показывает query. Список строится из visible, и у плитки key равен post.id, не индексу. loading и error по-прежнему рисуются раньше списка. Хуки, включая useState для query, стоят выше любого return. Если ни один title не совпал, на месте списка короткая надпись, а не другой набор данных.

      #### Пример кода

      Это разбор условия, а не экран кандидата: в PDF нет его кода, пример собран по формулировке задачи.

      ```jsx
      import { useEffect, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        const needle = query.trim().toLowerCase();
        const visible = posts.filter((post) => post.title.toLowerCase().includes(needle));

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Фраза на автомате

      query я держу в state и фильтрую уже загруженные посты по title: trim, нижний регистр, includes. Пустой запрос показывает все посты. Это клиентский фильтр, не новый запрос, и key плитки — post.id.
  - id: sirisha-wealth.8c
    label: "8c"
    topic: "Лайвкодинг"
    title: "Добавь debounce на поле поиска."
    body: |
      #### Короткий ответ

      Debounce здесь хвостовой. Текст в поле обновляется на каждый символ, иначе ввод залипает. В фильтр уходит другое значение, debouncedQuery. useEffect зависит от query: ставит setTimeout на 300 миллисекунд и в cleanup вызывает clearTimeout. Если символ пришёл раньше, старый таймер снят, и в state попадёт строка, которая прожила паузу без изменений.

      visible считается из debouncedQuery, не из query. Список поэтому обновляется после паузы, поле — сразу.

      На ста постах JSONPlaceholder сам filter дешёвый. Паузу всё равно ставят: задача её просит, и тот же приём нужен, если фильтр позже станет запросом или тяжёлой отрисовкой. 300 миллисекунд — стартовая величина под ощущение от ввода, не константа платформы.

      #### Пример кода

      Это разбор условия, а не экран кандидата: в PDF нет его кода, пример собран по формулировке задачи.

      ```jsx
      import { useEffect, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');
        const [debouncedQuery, setDebouncedQuery] = useState('');

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        useEffect(() => {
          const id = setTimeout(() => setDebouncedQuery(query), 300);
          return () => clearTimeout(id);
        }, [query]);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        const needle = debouncedQuery.trim().toLowerCase();
        const visible = posts.filter((post) => post.title.toLowerCase().includes(needle));

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Фраза на автомате

      Поле я обновляю сразу, а в фильтр отдаю строку с debounce. useEffect ставит таймер на 300 миллисекунд и снимает его в cleanup, если query успел измениться. Режется title уже загруженных постов по отложенной строке, сам ввод таймер не ждёт.
  - id: sirisha-wealth.8d
    label: "8d"
    topic: "Лайвкодинг"
    title: "Вынеси логику поиска и debounce в отдельные кастомные хуки."
    body: |
      #### Короткий ответ

      Логику делишь на два хука, у каждого своя работа. useDebouncedValue хранит отложенную копию значения: внутри useState и useEffect с setTimeout и clearTimeout. useFilteredPosts только фильтрует posts по строке, которую ему передали. Фильтр закрыт useMemo, чтобы при тех же posts и той же строке не собирать новый массив. На ста элементах расчёт дешёвый, хук всё равно держит правило title в одном месте и оставляет ссылку на результат стабильной.

      PostSearch их соединяет и не смешивает. Сначала debouncedQuery = useDebouncedValue(query, 300), затем visible = useFilteredPosts(posts, debouncedQuery). Задержка не спрятана внутри фильтра, оба хука читаются отдельно. Оба вызова безусловные и стоят выше return, рядом с остальными хуками. Загрузка постов остаётся в компоненте: к поиску и к debounce она не относится.

      #### Пример кода

      Это разбор условия, а не экран кандидата: в PDF нет его кода, пример собран по формулировке задачи.

      ```jsx
      import { useEffect, useMemo, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const useDebouncedValue = (value, delay) => {
        const [debounced, setDebounced] = useState(value);

        useEffect(() => {
          const id = setTimeout(() => setDebounced(value), delay);
          return () => clearTimeout(id);
        }, [value, delay]);

        return debounced;
      };

      const useFilteredPosts = (posts, query) => {
        return useMemo(() => {
          const needle = query.trim().toLowerCase();
          return posts.filter((post) => post.title.toLowerCase().includes(needle));
        }, [posts, query]);
      };

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');
        const debouncedQuery = useDebouncedValue(query, 300);
        const visible = useFilteredPosts(posts, debouncedQuery);

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Фраза на автомате

      Выношу два хука. useDebouncedValue откладывает строку на 300 миллисекунд, useFilteredPosts фильтрует title по уже отложенной строке. В PostSearch вызываю оба на верхнем уровне. Загрузка постов в этих хуках не живёт.
  - id: sirisha-wealth.8e
    label: "8e"
    topic: "Лайвкодинг"
    title: "Покажи отфильтрованные результаты под полем поиска плитками div, а не через select."
    body: |
      #### Короткий ответ

      Отфильтрованное показывают плитками под полем, а не через select. Под input стоит контейнер, внутри на каждый пост свой div. key плитки — post.id, текст — title. select и option эту задачу не закрывают: нативный список прячет строки в дропдаун, а условие просит видеть результаты сразу под полем.

      Поле контролируемое: value равен query, поэтому символ виден сразу. В плитки попадает visible, то есть список после useDebouncedValue и useFilteredPosts. Пока посты грузятся, на экране loading. При ошибке запроса — текст ошибки. Пустой ответ фильтра не подменяется другим контролом: подходящих плиток нет, на их месте надпись No matches.

      Разметка ниже — тот же PostSearch, в котором запрос, пауза и два хука уже собраны. Плитка — обычный div с рамкой, не пункт select.

      #### Пример кода

      Это разбор условия, а не экран кандидата: в PDF нет его кода, пример собран по формулировке задачи.

      ```jsx
      import { useEffect, useMemo, useState } from 'react';

      const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

      const useDebouncedValue = (value, delay) => {
        const [debounced, setDebounced] = useState(value);

        useEffect(() => {
          const id = setTimeout(() => setDebounced(value), delay);
          return () => clearTimeout(id);
        }, [value, delay]);

        return debounced;
      };

      const useFilteredPosts = (posts, query) => {
        return useMemo(() => {
          const needle = query.trim().toLowerCase();
          return posts.filter((post) => post.title.toLowerCase().includes(needle));
        }, [posts, query]);
      };

      const PostSearch = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const [query, setQuery] = useState('');
        const debouncedQuery = useDebouncedValue(query, 300);
        const visible = useFilteredPosts(posts, debouncedQuery);

        useEffect(() => {
          const controller = new AbortController();

          fetch(POSTS_URL, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setPosts(data);
              setError('');
              setLoading(false);
            })
            .catch((fetchError) => {
              if (fetchError.name === 'AbortError') return;
              setError(fetchError.message);
              setPosts([]);
              setLoading(false);
            });

          return () => controller.abort();
        }, []);

        const handleQueryChange = (event) => {
          setQuery(event.target.value);
        };

        if (loading) return <p>Loading posts</p>;
        if (error) return <p>{error}</p>;

        return (
          <section>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Filter by title"
              placeholder="Filter by title"
            />
            <div>
              {visible.length === 0 ? (
                <p>No matches</p>
              ) : (
                visible.map((post) => (
                  <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
                    {post.title}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      };
      ```

      #### Фраза на автомате

      Под полем поиска я рисую div на каждый отфильтрованный пост, key равен post.id. select не использую: строки должны быть видны сразу, а не спрятаны в дропдауне. В плитки попадает список после debounce и фильтра по title.
---

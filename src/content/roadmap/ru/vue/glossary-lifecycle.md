---
day: glossary-lifecycle
title: "Жизненный цикл"
questions: []
---

## Жизненный цикл компонента

    

Когда создаётся/обновляется/умирает инстанс, и какие хуки звать. Composition API — основной стиль; Options — чтобы читать легаси.
  

  
    
### Картина целиком

    

Компонент проходит фазы: **создание → mount в DOM → обновления при реактивных изменениях → unmount**. Отдельно: если обёрнут в `KeepAlive`, вместо полного unmount могут быть activate/deactivate.
    

```
create
  → setup() / <script setup>          (один раз на инстанс)
  → beforeMount
  → DOM вставлен
  → mounted                            ← можно трогать DOM, подписки
  → (данные изменились)
      → beforeUpdate
      → DOM patch
      → updated
  → beforeUnmount
  → unmounted                          ← cleanup
(+ KeepAlive: activated / deactivated)
```

  

  
    
### Важное отличие от React

    

В React тело функции компонента бежит **на каждый render**. Во Vue `setup` / `<script setup>` выполняется **один раз** при создании инстанса; дальше обновляется template по реактивным зависимостям. Поэтому «эффекты» кладут в `watch`/`onMounted`, а не «просто внизу setup» как побочный эффект на каждый render.
  

  
    
      
        
          
          
          
          
          
        
      
      
        
          
          ````
          ``````
          
          
        
        
          
          ``
          ``
          
          
        
        
          
          ``
          ``
          
          ``
        
        
          
          ``
          ``
          
          ``
        
        
          
          ``
          ``
          
          
        
        
          
          ``
          ````
          
          
        
        
          
          ``
          ````
          
          ``
        
        
          
          ``
          ``
          
          
        
        
          
          ``
          ``
          
          
        
        
          
          ``
          ``
          
          
        
        
          
          ``
          ``
          ``
          
        
      
    

| Фаза | Composition API | Options API | Зачем / что можно | React-якорь |
| --- | --- | --- | --- | --- |
| Инициализация | setup() / весь <script setup> | beforeCreate → data/created | Объявить refs, computed, watch, функции. DOM ещё нет. | Первый вызов функции + объявление hooks |
| До mount | onBeforeMount | beforeMount | Редко нужен. Template скомпилирован, DOM ещё не вставлен. | — |
| После mount | onMounted | mounted | DOM есть: focus, измерения, сторонние виджеты, подписки на window. | useEffect(() => {...}, []) |
| До update | onBeforeUpdate | beforeUpdate | Перед патчем DOM. Редко; можно прочитать DOM «как было». | ближе к useLayoutEffect (но не 1-в-1) |
| После update | onUpdated | updated | DOM уже новый. Осторожно: не триггерь бесконечные апдейты. | effect после render с deps |
| До unmount | onBeforeUnmount | beforeUnmount (Vue 3) / beforeDestroy (Vue 2) | Последний шанс что-то сделать, инстанс ещё жив. | — |
| Unmount | onUnmounted | unmounted / destroyed (Vue 2) | Снять listeners, таймеры, abort запросов, dispose карты/чарта. | cleanup в useEffect |
| KeepAlive: показали | onActivated | activated | Компонент достали из кэша (вкладка снова активна). | нет прямого аналога |
| KeepAlive: спрятали | onDeactivated | deactivated | Ушли в кэш, не unmount. Пауза подписок/таймеров. | нет прямого аналога |
| Ошибка потомка | onErrorCaptured | errorCaptured | Поймать ошибку в дочернем дереве (частично как error boundary). | Error Boundary |
| SSR render | onServerPrefetch | serverPrefetch | Данные на сервере до HTML (Nuxt чаще через useAsyncData). | RSC / getServerSideProps / loaders |

  

  
    
### Мини-пример Composition API

    

```
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const id = ref('1')
const data = ref(null)

// setup-код: один раз при создании инстанса
watch(id, async (newId, _old, onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort()) // cleanup эффекта при смене id / unmount
  data.value = await fetchItem(newId, ctrl.signal)
}, { immediate: true })

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() { /* ... */ }
</script>
```

  

  
    
### Тот же смысл в Options API (читать легаси)

    

```
<script>
export default {
  data() {
    return { id: '1', data: null }
  },
  watch: {
    id: {
      immediate: true,
      handler(newId) { this.load(newId) }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    async load(id) { this.data = await fetchItem(id) },
    onResize() {}
  }
}
</script>
```

  

  
    
### Куда класть fetch: mounted или watch?

    

**Один раз при открытии экрана**, без реактивной зависимости → `onMounted`.
    

**Зависит от `props.id` / `route.params`** → `watch(..., { immediate: true })`, потому что роутер часто **не remount**’ит компонент при смене param — `onMounted` не вызовется снова.
    

В React оба случая обычно закрывает один `useEffect(..., [id])`.
  

  
    
### Порядок при вложенных компонентах

    

Mount: сначала parent `beforeMount`, потом child mount целиком, потом parent `mounted` (упрощённо: дети монтируются до того, как parent считается mounted).
    

Unmount: наоборот — сначала children unmount, потом parent.
  

  
    
### Шпаргалка «что почти всегда нужно»

    

На собесесе и в проде чаще всего: `onMounted`, `onUnmounted`, `watch`/`watchEffect` с cleanup, иногда `onActivated`/`onDeactivated` с KeepAlive. `beforeUpdate`/`updated` — реже, только если реально работаешь с DOM вокруг патча.

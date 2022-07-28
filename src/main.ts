import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useStore } from './store'

import './assets/index.css'
import './assets/transitions.css'

import App from './App.vue'

const pinia = createPinia()

createApp(App).use(pinia).mount('#app')

const store = useStore()

store.initializeStore()



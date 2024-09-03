import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: routes => setupLayouts(routes),
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

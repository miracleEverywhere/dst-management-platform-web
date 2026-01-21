import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import directives from "@/directives"

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'

// Create vue app
const app = createApp(App)


// Register plugins
registerPlugins(app)
app.use(directives)

// 在挂载前确保index.html中的loading样式还在
const loadingStyle = document.createElement('style')

loadingStyle.textContent = `
#loading-bg {
  display: none !important;
}
`
document.head.appendChild(loadingStyle)

// Mount vue app
app.mount('#app')

/**********************************
 * @Description: 入口文件
 * @FilePath: main.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:41:32
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'
import i18n from './lang'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupNaiveDiscreteApi } from './utils'
import '@/styles/global.scss'
import '@/styles/reset.css'
import 'uno.css'
import { GridLayout, GridItem } from 'grid-layout-plus'

async function bootstrap() {
  const app = createApp(App)
  setupStore(app)
  setupDirectives(app)
  await setupRouter(app)
  app.use(i18n)
  app
    .component('GridLayout', GridLayout)
    .component('GridItem', GridItem)
  app.mount('#app')
  setupNaiveDiscreteApi()
}

bootstrap().then()

import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { themes } from './theme'
import { zhHans, en } from "vuetify/locale"
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { getInitialThemeName } from '@/utils/theme'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'


export default function (app) {
  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults,
    icons,
    components: {
      VFileUpload,
    },
    theme: {
      // 首次渲染前就按持久化偏好（或系统偏好）确定主题，避免深色用户首屏闪白
      defaultTheme: getInitialThemeName(),
      themes,
    },
    locale: {
      locale: 'zhHans',
      messages: { zhHans, en },
    },
  })

  app.use(vuetify)
}

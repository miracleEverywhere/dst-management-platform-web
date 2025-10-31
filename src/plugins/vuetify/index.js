import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { themes } from './theme'
import { zhHans, en } from "vuetify/locale"

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
    theme: {
      defaultTheme: 'light',
      themes,
    },
    locale: {
      locale: 'zhHans',
      messages: { zhHans, en },
    },
  })

  app.use(vuetify)
}

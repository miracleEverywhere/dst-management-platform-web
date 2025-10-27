import { createI18n } from "vue-i18n"
import zh from "@/languages/zh.js"
import en from "@/languages/en.js"
import { getBrowserLang } from "@/utils/tools.js"

const i18n = createI18n({
  // Use Composition API, Set to false
  allowComposition: true,
  legacy: false,
  locale: getBrowserLang(),
  messages: {
    zh,
    en,
  },
})

export default i18n
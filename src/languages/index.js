import { createI18n } from "vue-i18n"
import zh from "@/languages/zh"
import en from "@/languages/en"
import { getBrowserLang } from "@/utils/tools"

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
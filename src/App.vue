<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      transition="slide-y-transition"
      :location="location"
      variant="flat"
      color="#FFFFFF00"
    >
      <v-card>
        <v-alert
          :color="color"
          :icon="icon"
          variant="text"
          density="compact"
        >
          {{ text }}
        </v-alert>
      </v-card>
    </v-snackbar>
    <router-view />
  </v-app>
</template>

<script setup>
import useGlobalStore from '@store/global'
import { useI18n } from "vue-i18n"
import { useSnackbar } from './utils/snackbar'
import { getBrowserLang } from "@/utils/tools.js"
import {useLocale} from "vuetify/framework";


const i18n = useI18n()
const globalStore = useGlobalStore()
const { current } = useLocale()

const { snackbar, color, text, location, icon, timeout } = useSnackbar()

onMounted(() => {
  initI18n()
})

const initI18n = () => {
  let language
  if (globalStore.language === "") {
    language = getBrowserLang()
    i18n.locale.value = language
    globalStore.language = language
    current.value = language
  } else {
    i18n.locale.value = globalStore.language
    switch (globalStore.language) {
      case 'zh':
        current.value = 'zhHans'
        break
      case 'en':
        current.value = 'en'
        break
      default:
        current.value = 'zhHans'
    }
  }
}

const initTheme = () => {

}
</script>



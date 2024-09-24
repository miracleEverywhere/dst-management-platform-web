<template>
  <n-dropdown trigger="hover" :options="generateLanguageList()" @select="changeLanguage">
    <i class="i-cil:language cursor-pointer mr-16"/>
  </n-dropdown>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useAppStore } from '@/store'

const i18n = useI18n()
const appStore = useAppStore()

const generateLanguageList = () => {
  return [
    { label: "简体中文", key: "zh", disabled: appStore.language==='zh' },
    { label: "English", key: "en", disabled: appStore.language==='en' }
  ]
}

const changeLanguage = (lang) => {
  i18n.locale.value = lang
  appStore.language = lang
}
</script>

<style scoped></style>

<template>
  <v-btn
    v-tooltip="t('global.github')"
    icon="ri-github-line"
    color="default"
    variant="text"
    href="https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free"
    target="_blank"
    rel="noopener noreferrer"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>


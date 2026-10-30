<template>
  <v-btn
    v-tooltip="IsLite ? '点击访问Github源码' : t('global.github')"
    icon="ri-github-line"
    color="default"
    variant="text"
    href="https://github.com/miracleEverywhere/dst-management-platform-api"
    target="_blank"
    rel="noopener noreferrer"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { IsLite } from '@/config'

const { t } = useI18n()
</script>


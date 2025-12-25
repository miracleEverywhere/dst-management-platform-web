<template>
  <v-btn @click="downloadLog">
    下载
  </v-btn>
</template>

<script setup>
import logsApi from "@/api/logs"
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"


const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const downloadLog = () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  logsApi.download.download(reqForm, "logs.zip")
}
</script>


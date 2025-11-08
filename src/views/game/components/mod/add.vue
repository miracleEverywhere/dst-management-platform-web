<template>
</template>

<script setup>
import modApi from "@/api/mod"
import useGlobalStore from "@/plugins/store/global.js";

const globalStore = useGlobalStore()
const getDownloadedMods = () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }
  modApi.downloaded.get(reqForm)
}


onMounted(() => {
  getDownloadedMods()
})
</script>

<style scoped>
</style>
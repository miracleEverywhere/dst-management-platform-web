<template>
  <log :content="content"/>
</template>

<script setup>
import Log from "@/views/logs/components/log.vue";
import logsApi from "@/api/logs.js";
import useGlobalStore from "@/plugins/store/global.js";


const globalStore = useGlobalStore()
const content = ref('')
const getLogContent = () => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 79,
    logType: 'game',
    lines: 40,
  }
  logsApi.content.get(reqForm).then(response => {
    content.value = response.data.join("\n")
  })
}

onMounted(() => {
  getLogContent()
})
</script>

<style scoped>
</style>
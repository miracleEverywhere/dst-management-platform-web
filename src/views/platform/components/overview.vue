<template>
  {{ overviewData }}
  <runtime-display :seconds="overviewData.runningTime" />
  <div>
    {{ formatBytes(overviewData.memory) }}
  </div>
</template>

<script setup>
import platformApi from "@/api/platform.js"
import RuntimeDisplay from "@/views/platform/components/runtimeDisplay.vue"
import { formatBytes } from "@/utils/tools.js"

const overviewData = ref({})
const overviewDataLoading = ref(false)

const getOverviewData = () => {
  overviewDataLoading.value = true
  platformApi.overview.get().then(response => {
    overviewData.value = response.data
  }).finally(() => {
    overviewDataLoading.value = false
  })
}

onMounted(() => {
  getOverviewData()
})
</script>


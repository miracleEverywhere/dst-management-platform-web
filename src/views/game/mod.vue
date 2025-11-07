<template>
  <v-tabs
    v-model="activeTabName"
    align-tabs="start"
    color="primary"
    show-arrows
    @update:model-value="handleTabClick"
  >
    <v-tab value="Download">
      下载模组
    </v-tab>
    <v-tab value="Add">
      添加模组
    </v-tab>
    <v-tab value="Setting">
      配置模组
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="activeTabName">
    <v-tabs-window-item value="Download">
      <v-container
        fluid
        :height="calculateContainerSize()"
        width="100%"
        class="w-100"
        style="overflow-y: auto"
      >
        <download />
      </v-container>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import externalApi from '@/api/external'
import { showSnackbar } from "@/utils/snackbar"
import { debounce } from "@/utils/tools.js"
import Download from "@/views/game/components/mod/download.vue"

onMounted(async () => {
  // 添加事件监听
  window.addEventListener('resize', handleResize)
})

// 防抖处理resize事件
const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

// 在组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const activeTabName = ref('Download')

const handleTabClick = tab => {
  if (tab === "Add") {
    // handleGetDownloadedMod()
  }
  if (tab=== "Setting") {
    // handleGetModSetting()
  }
}

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const windowHeight = ref(window.innerHeight)
</script>


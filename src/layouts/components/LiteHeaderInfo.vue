<template>
  <div
    class="d-flex align-center"
    style="user-select: none;"
  >
    <v-chip
      :color="getColor()"
      class="mr-4"
      prepend-icon="ri-game-2-line"
    >
      <v-tooltip activator="parent">
        当前版本: {{ gameVersion.local }}
        <br>
        最新版本: {{ gameVersion.server }}
      </v-tooltip>
      游戏版本: {{ gameVersion.local }}
    </v-chip>
  </div>
</template>

<script setup>
import liteApi from '@/api/lite'
import useGlobalStore from '@store/global'

const globalStore = useGlobalStore()

// 优先使用 store 中持久化的版本，接口失败时仍能展示上次结果
const gameVersion = ref({
  local: globalStore.gameVersion?.local || 0,
  server: globalStore.gameVersion?.server || 0,
})

const getColor = () => {
  if (gameVersion.value.local === 0) {
    return 'error'
  }
  if (gameVersion.value.local !== gameVersion.value.server) {
    return 'warning'
  }

  return 'success'
}

const getGameVersion = async () => {
  try {
    const response = await liteApi.gameVersion.get()
    const data = response.data || {}

    gameVersion.value = {
      local: data.local || 0,
      server: data.server || 0,
    }
    globalStore.gameVersion = gameVersion.value
  } catch {
    // 请求拦截器已给出提示
  }
}

onMounted(getGameVersion)
</script>

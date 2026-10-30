<template>
  <div>
    <v-tabs
      v-model="activeWorld"
      color="primary"
      class="mb-4"
    >
      <v-tab value="ground">
        地面
      </v-tab>
      <v-tab value="cave">
        洞穴
      </v-tab>
    </v-tabs>

    <result
      v-if="!loaded && !loadError"
      type="info"
      title="拼命加载中"
      :height="panelHeight"
    />
    <result
      v-else-if="loadError"
      type="error"
      title="加载失败"
      sub-title="请检查后端服务是否正常，然后重试。"
      :height="panelHeight"
    >
      <v-btn
        class="mt-4"
        color="primary"
        @click="loadWorlds"
      >
        重试
      </v-btn>
    </result>
    <log-viewer
      v-else
      :world-name="activeWorldName"
      log-type="game"
      title="游戏日志"
      :height="panelHeight"
    />
  </div>
</template>

<script setup>
import liteApi from '@/api/lite'
import LogViewer from '@/views/lite/components/LogViewer.vue'
import { debounce } from '@/utils/tools'

const windowHeight = ref(window.innerHeight)

// 页面可用高度：其他 lite 页面统一扣 150，这里再扣掉 tabs 的 48 和 16 间距
const otherHeight = 214

const activeWorld = ref('ground')

const worlds = reactive({
  ground: '',
  cave: '',
})

const loaded = ref(false)
const loadError = ref(false)

const activeWorldName = computed(() => worlds[activeWorld.value] || '')
const panelHeight = computed(() => Math.max(320, Math.floor(windowHeight.value - otherHeight)))

const loadWorlds = async () => {
  loadError.value = false

  try {
    // 日志接口的 worldName 必须与数据库里配置的世界名一致，不能传 ground / cave
    const [ground, cave] = await Promise.all([
      liteApi.ground.get(),
      liteApi.cave.get(),
    ])

    worlds.ground = ground.data?.name || ''
    worlds.cave = cave.data?.name || ''
    if (!worlds.ground && worlds.cave) {
      activeWorld.value = 'cave'
    }
    loaded.value = true
  } catch {
    loadError.value = true
  }
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

onMounted(() => {
  loadWorlds()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div>
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
      :world-name="chatWorldName"
      log-type="chat"
      title="聊天日志"
      :height="panelHeight"
    />
  </div>
</template>

<script setup>
import liteApi from '@/api/lite'
import LogViewer from '@/views/lite/components/LogViewer.vue'
import { debounce } from '@/utils/tools'

const windowHeight = ref(window.innerHeight)
const otherHeight = 150

const worlds = reactive({
  ground: '',
  cave: '',
})

const loaded = ref(false)
const loadError = ref(false)

// 聊天日志由主世界写入，接口用 worldName 做世界名校验，地面没配置时退回洞穴
const chatWorldName = computed(() => worlds.ground || worlds.cave)
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

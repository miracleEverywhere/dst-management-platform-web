<template>
  <v-card :height="calculateHeight()">
    <v-card-title class="my-2">
      <div class="card-header">
        <span>游戏日志</span>
        <div class="fcc">
          <v-switch
            v-model="autoPull"
            color="info"
            hide-details
          >
            <template #prepend>
              <v-chip color="info">
                自动刷新
              </v-chip>
            </template>
          </v-switch>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <log
        :content="content"
        :height="calculateHeight()-150"
      />
      <v-row class="my-4">
        <v-spacer />
        <v-col
          cols="6"
          md="2"
          class="fcc"
        >
          <v-number-input
            v-model="lines"
            label="行"
            hide-details
            density="compact"
            class="mr-4"
          />
          <v-btn @click="getLogContent">
            刷新
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import Log from "@/views/logs/components/log.vue"
import useGlobalStore from "@store/global.js"
import logsApi from "@/api/logs.js"
import { debounce } from "@/utils/tools.js"

const globalStore = useGlobalStore()
const content = ref('')
const autoPull= ref(true)
const lines = ref(0)

const getLogContent = () => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 0,
    logType: 'chat',
    lines: lines.value,
  }

  logsApi.content.get(reqForm).then(response => {
    content.value = response.data.join("\n")
  })
}

let intervalId = null

const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value) {
      getLogContent()
    }
  }, 2000)
}

const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const calculateLines = () => {
  const other = 390

  // 只返回计算的行数，不设置 lines.value
  return Math.round(Math.max(2, Math.floor(windowHeight.value - other)) / 22.5)
}

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - 160))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  lines.value = calculateLines()
}, 200)

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  lines.value = calculateLines()
  startRequests()
})

onBeforeUnmount(() => {
  cancelRequests()
  window.removeEventListener('beforeunload', cancelRequests)
  window.removeEventListener('resize', handleResize)
})
</script>


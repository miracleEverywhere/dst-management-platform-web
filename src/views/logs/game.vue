<template>
  <check
    :category="['game', 'room']"
    :other-height="otherHeight"
  >
    <v-tabs
      v-model="activeTabName"
      align-tabs="start"
      color="primary"
      show-arrows
    >
      <v-tab value="current">
        {{ t('logs.current') }}
      </v-tab>
      <v-tab value="history">
        {{ t('logs.history') }}
      </v-tab>
    </v-tabs>
    <v-tabs-window
      v-model="activeTabName"
      class="mt-4"
    >
      <v-tabs-window-item value="current">
        <v-card :height="calculateHeight()">
          <v-card-title class="my-2">
            <div class="card-header">
              <span>
                {{ t('logs.current') }}
              </span>
              <div class="fcc">
                <v-select
                  v-model="selectedWorldID"
                  :items="worlds"
                  item-title="worldName"
                  item-value="id"
                  :label="t('logs.world')"
                  density="compact"
                  class="mr-4"
                  @update:model-value="handleWorldChange"
                />
                <v-switch
                  v-model="autoPull"
                  color="info"
                  hide-details
                >
                  <template #prepend>
                    <v-chip color="info">
                      {{ t('logs.autoPull') }}
                    </v-chip>
                  </template>
                </v-switch>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <template v-if="firstPullFinished">
              <log
                v-if="content"
                :content="content"
                :height="calculateHeight()-150"
              />
              <result
                v-else
                type="info"
                :height="calculateHeight()-150"
                :title="t('logs.noContent')"
              />
            </template>
            <template v-else>
              <result
                type="info"
                :title="t('logs.fetching')"
                :height="calculateHeight()-150"
              />
            </template>
            <v-row class="my-4">
              <v-spacer v-if="!mobile" />
              <v-col
                class="d-flex align-center justify-end"
                @focusout="applyLines"
                @keydown.enter="applyLines"
              >
                <v-number-input
                  v-model="lines"
                  :label="t('logs.line')"
                  hide-details
                  density="compact"
                  class="mr-4"
                  max-width="120"
                />
                <v-btn @click="reloadLog">
                  {{ t('logs.pull') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
      <v-tabs-window-item value="history">
        <v-card :height="calculateHeight()">
          <v-card-title class="my-2">
            <div class="card-header">
              <span>
                {{ t('logs.history') }}
              </span>
              <div class="fcc">
                <v-select
                  v-model="selectedWorldID"
                  :items="worlds"
                  item-title="worldName"
                  item-value="id"
                  :label="t('logs.world')"
                  density="compact"
                  class="mr-4"
                  min-width="100px"
                  @update:model-value="handleHistoryWorldChange"
                />
                <v-select
                  v-model="selectedFilename"
                  :items="list"
                  :disabled="getHistoryFileContentLoading"
                  :loading="getHistoryFileContentLoading"
                  :label="t('logs.logFile')"
                  density="compact"
                  min-width="100px"
                  @update:model-value="getHistoryFileContent"
                />
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <template v-if="selectedFilename">
              <log
                v-if="!getHistoryFileContentLoading&&historyContent"
                :content="historyContent"
                :height="calculateHeight()-150"
              />
              <result
                v-if="getHistoryFileContentLoading"
                type="info"
                :title="t('logs.fetching')"
                :height="calculateHeight()-150"
              />
              <result
                v-if="!getHistoryFileContentLoading&&!historyContent"
                type="info"
                :height="calculateHeight()-150"
                :title="t('logs.noContent')"
              />
            </template>
            <template v-else>
              <result
                type="info"
                :height="calculateHeight()-150"
                :title="t('logs.noLogFile')"
              />
            </template>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </check>
</template>

<script setup>
import Log from "@/views/logs/components/log.vue"
import logsApi from "@/api/logs.js"
import roomApi from "@/api/room.js"
import useGlobalStore from "@store/global.js"
import { debounce } from "@/utils/tools.js"
import { useLogStream } from "@/utils/logStream.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"


const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const activeTabName = ref('current')
const otherHeight = 197

const selectedWorldID = ref(0)
const autoPull = ref(true)
const lines = ref(0)

// 只有停留在“当前日志”页且自动刷新开启时才保持 SSE 连接
const streamEnabled = computed(() => autoPull.value && activeTabName.value === 'current')

const stream = useLogStream({
  autoRefresh: streamEnabled,
  getParams: () => {
    if (globalStore.room.id === 0 || selectedWorldID.value === 0) {
      return null
    }

    return {
      roomID: globalStore.room.id,
      worldID: selectedWorldID.value,
      logType: 'game',
      lines: resolveLines(),
    }
  },
})

const { content, firstPullFinished } = stream

const reloadLog = debounce(() => {
  if (activeTabName.value === 'current') {
    stream.reload()
  }
}, 300)

const handleWorldChange = () => {
  stream.reset()
  stream.reload()
}

const handleHistoryWorldChange = () => {
  historyContent.value = ''
  getList()
}

const worlds = ref([])

const getWorlds = async () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  const response = await roomApi.worlds.get(reqForm)

  worlds.value = response.data
  selectedWorldID.value = worlds.value[0]?.id || 0
}

const list = ref([])

const getList = () => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldID.value,
    logType: 'game',
  }

  logsApi.history.list.get(reqForm).then(response => {
    list.value = response.data || []
  })
}

const selectedFilename = ref('')
const historyContent = ref('')
const getHistoryFileContentLoading = ref(false)

const getHistoryFileContent = () => {
  getHistoryFileContentLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldID.value,
    logType: 'game',
    logFile: selectedFilename.value,
  }

  logsApi.history.content.get(reqForm).then(response => {
    historyContent.value = ""
    historyContent.value = response.data
  }).finally(() => {
    getHistoryFileContentLoading.value = false
  })
}

const calculateLines = () => {
  const other = 390 + 37

  // 只返回计算的行数，不设置 lines.value
  return Math.round(Math.max(2, Math.floor(windowHeight.value - other)) / 22.5)
}

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
}

const windowHeight = ref(window.innerHeight)

// 行数输入框被清空时回退到按窗口高度算出的行数：后端把 0 行当成“不返回任何行”
const resolveLines = () => (lines.value > 0 ? lines.value : calculateLines())

// 已经生效的行数，用来避免失焦/回车与下面的 watcher 重复重连
let appliedLines = 0

// 行数真正变化才重连：失焦、回车立即生效，输入过程中由 applyLinesLater 兜底
const applyLines = () => {
  const next = resolveLines()

  if (next === appliedLines) return

  appliedLines = next
  reloadLog()
}

// 输入框每敲一个字符都会改 lines，等编辑停下来再重连，避免半截的数字触发重连
const applyLinesLater = debounce(applyLines, 800)

watch(lines, applyLinesLater)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  lines.value = calculateLines()
}, 200)

onMounted(async () => {
  if (globalStore.room.id === 0) {
    return
  }
  window.addEventListener('resize', handleResize)
  await getWorlds()
  getList()
  lines.value = calculateLines()

  // 首次挂载由 stream.start() 建立连接，先记下当前行数，避免 watcher 再触发一次
  appliedLines = resolveLines()
  stream.start()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

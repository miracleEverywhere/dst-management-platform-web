<template>
  <v-card
    :height="calculateHeight()"
    flat
  >
    <v-card-title class="my-2">
      <div class="card-header">
        <span v-if="props.chat">
          {{ t('logs.current') }}
        </span>
        <span v-else>
          {{ t(`logs.${props.type}`) }}
        </span>
        <div class="fcc">
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
</template>

<script setup>
import Log from "@/views/logs/components/log.vue"
import useGlobalStore from "@store/global.js"
import { useLogStream } from "@/utils/logStream.js"
import { debounce } from "@/utils/tools.js"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify/framework"

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  chat: {
    type: Boolean,
    default: false,
  },
})

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const autoPull = ref(true)
const lines = ref(0)

// 当前日志走 SSE 实时推送，自动刷新开关控制是否保持连接
const stream = useLogStream({
  autoRefresh: autoPull,
  getParams: () => ({
    roomID: globalStore.room.id,
    worldID: 0,
    logType: props.type,
    lines: resolveLines(),
  }),
})

const { content, firstPullFinished } = stream

const reloadLog = debounce(() => stream.reload(), 300)

const windowHeight = ref(window.innerHeight)

const calculateLines = () => {
  let other = 390

  if (props.chat) {
    other = other + 37
  }

  // 只返回计算的行数，不设置 lines.value
  return Math.round(Math.max(2, Math.floor(windowHeight.value - other)) / 22.5)
}

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

const calculateHeight = () => {
  let other = 0

  if (props.chat) {
    other = 37
  }

  return Math.max(2, Math.floor(windowHeight.value - 160 - other))
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  lines.value = calculateLines()
}, 200)

onMounted(() => {
  window.addEventListener('resize', handleResize)
  lines.value = calculateLines()

  // 首次挂载由 stream.start() 建立连接，先记下当前行数，避免 watcher 再触发一次
  appliedLines = resolveLines()
  stream.start()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

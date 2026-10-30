<template>
  <v-card
    class="d-flex flex-column"
    :height="height"
  >
    <v-card-title class="flex-none d-flex align-center ga-2 py-2 pr-2">
      <span class="text-subtitle-1 font-weight-medium">{{ title }}</span>
      <span class="text-caption text-medium-emphasis d-none d-sm-inline">最近 100 行</span>
      <v-spacer />
      <v-switch
        v-model="autoRefresh"
        color="primary"
        density="compact"
        hide-details
        label="自动刷新"
        class="flex-none"
      />
      <v-btn
        icon="ri-refresh-line"
        size="small"
        variant="text"
        :loading="manualLoading"
        aria-label="刷新日志"
        @click="refresh"
      />
    </v-card-title>

    <v-divider />

    <v-card-text class="flex-grow-1 overflow-hidden pa-0 position-relative">
      <div
        ref="scrollerRef"
        class="log-scroll"
        @scroll.passive="handleScroll"
      >
        <div
          v-if="!worldName"
          class="log-state"
        >
          <v-icon
            icon="ri-information-2-fill"
            size="48"
            color="info"
          />
          <span>世界尚未配置，暂时无法读取日志</span>
        </div>
        <div
          v-else-if="loading"
          class="log-state"
        >
          <v-progress-circular
            color="primary"
            indeterminate
            size="24"
            width="2"
          />
          <span>加载中</span>
        </div>
        <result
          v-else-if="loadError"
          type="error"
          title="日志加载失败"
          sub-title="请检查后端服务是否正常，然后重试。"
          :height="stateHeight"
        >
          <v-btn
            class="mt-4"
            color="primary"
            @click="retry"
          >
            重试
          </v-btn>
        </result>
        <result
          v-else-if="!content"
          type="info"
          title="暂无日志"
          sub-title="世界运行后，这里会显示最新日志。"
          :height="stateHeight"
        />
        <pre
          v-else
          class="log-text"
          :class="{ 'log-text--paused': autoRefresh && !follow }"
        >{{ content }}</pre>
      </div>

      <v-btn
        v-if="autoRefresh && !follow && !loading && !loadError && content"
        class="follow-btn"
        color="primary"
        elevation="4"
        prepend-icon="ri-arrow-down-line"
        size="small"
        @click="resumeFollow"
      >
        继续跟随
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import liteApi from '@/api/lite'

const props = defineProps({
  logType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '日志',
  },
  worldName: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 600,
  },
})

// 后端固定只返回文件尾部 100 行，前端不做行数选择
const POLL_INTERVAL = 2000

const content = ref('')
const loading = ref(true)
const loadError = ref(false)
const requesting = ref(false)
const manualLoading = ref(false)
const autoRefresh = ref(true)
const follow = ref(true)
const scrollerRef = ref()

// 用于丢弃切换世界后返回的过期响应
let requestId = 0

// 内容被清空/替换时，浏览器会把 scrollTop 夹回顶部并异步派发 scroll 事件。
// 这种结构性回弹不是用户操作，不能据此暂停跟随，否则切换世界后会误停在顶部。
let suppressScrollUntil = 0

const markContentChanged = () => {
  suppressScrollUntil = performance.now() + 120
}

const stateHeight = computed(() => Math.max(220, props.height - 60))

const scrollToBottom = () => {
  nextTick(() => {
    const scroller = scrollerRef.value

    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight
    }
  })
}

const fetchLog = async () => {
  if (!props.worldName) {
    return
  }

  const currentId = ++requestId

  requesting.value = true
  try {
    const response = await liteApi.log.get({
      logType: props.logType,
      worldName: props.worldName,
    })

    if (currentId !== requestId) {
      return
    }

    const lines = Array.isArray(response.data) ? response.data : []

    markContentChanged()
    content.value = lines.join('\n')
    loadError.value = false
  } catch {
    if (currentId !== requestId) {
      return
    }

    // 轮询失败后暂停刷新，避免每 2 秒弹一次错误提示，由用户手动重试
    markContentChanged()
    loadError.value = true
  } finally {
    if (currentId === requestId) {
      requesting.value = false
      loading.value = false
    }
  }
}

let pollTimer = null

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

const startPolling = () => {
  stopPolling()
  pollTimer = setInterval(() => {
    if (!autoRefresh.value || !follow.value || loadError.value || requesting.value || document.hidden) {
      return
    }

    fetchLog()
  }, POLL_INTERVAL)
}

const handleScroll = () => {
  if (performance.now() < suppressScrollUntil) {
    return
  }

  const scroller = scrollerRef.value

  if (scroller) {
    follow.value = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 16
  }
}

const resumeFollow = () => {
  follow.value = true
  scrollToBottom()
  fetchLog()
}

const refresh = async () => {
  loadError.value = false
  manualLoading.value = true
  await fetchLog()
  manualLoading.value = false
}

const retry = () => {
  loadError.value = false
  loading.value = true
  markContentChanged()
  fetchLog()
}

const handleVisibilityChange = () => {
  if (!document.hidden && autoRefresh.value && follow.value && !loadError.value) {
    fetchLog()
  }
}

// 内容或加载态变化后，等 DOM 真正渲染出 <pre> 再滚动。
// 首次加载时模板停在加载态、并未读取 content，仅靠 content 触发不了渲染，
// 直接在响应回调里 nextTick 会读到还没出现的 <pre>，于是首屏停在顶部。
watch([content, loading], ([, isLoading]) => {
  if (!isLoading && follow.value && content.value) {
    scrollToBottom()
  }
}, { flush: 'post' })

watch(() => props.worldName, () => {
  markContentChanged()
  content.value = ''
  loadError.value = false
  loading.value = true
  follow.value = true
  fetchLog()
})

watch(autoRefresh, enabled => {
  if (!enabled) {
    return
  }

  // 重新打开自动刷新视为回到实时跟随
  follow.value = true
  scrollToBottom()
  loadError.value = false
  fetchLog()
})

onMounted(() => {
  fetchLog()
  startPolling()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  stopPolling()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.log-scroll {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.log-text {
  margin: 0;
  padding: 12px 16px;
  color: rgba(var(--v-theme-on-surface), 0.87);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  tab-size: 4;
}

/* 上滚暂停时给悬浮的「继续跟随」按钮留出空间，避免遮住最后几行 */
.log-text--paused {
  padding-bottom: 64px;
}

.log-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  padding: 24px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  text-align: center;
}

.follow-btn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
}
</style>

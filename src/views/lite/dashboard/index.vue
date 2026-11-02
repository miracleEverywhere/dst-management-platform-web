<template>
  <div class="lite-dashboard">
    <v-alert
      v-if="hasError"
      type="warning"
      variant="tonal"
      class="mb-5"
    >
      <div class="d-flex flex-wrap align-center justify-space-between ga-3">
        <span>部分数据加载失败，请点击刷新重试。</span>
        <v-btn
          color="warning"
          size="small"
          variant="text"
          prepend-icon="ri-refresh-line"
          @click="refreshAll"
        >
          重试
        </v-btn>
      </div>
    </v-alert>

    <v-row>
      <v-col cols="12">
        <room-overview-card
          :room="room"
          :address="address"
          :loaded="roomLoaded"
          :mod-count="modCount"
          :players="players"
          @refresh="refreshAll"
          @update="handleUpdate"
        />
      </v-col>

      <v-col
        v-for="metric in metrics"
        :key="metric.title"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <system-metric-card
          v-bind="metric"
          class="flex-grow-1"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="d-flex"
      >
        <world-overview-card
          type="ground"
          :world="worlds.ground.data"
          :loaded="worlds.ground.loaded"
          :action="worldActions.ground"
          class="flex-grow-1"
          @start="handleWorldExec('ground', 'start')"
          @stop="handleWorldExec('ground', 'stop')"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="d-flex"
      >
        <world-overview-card
          type="cave"
          :world="worlds.cave.data"
          :loaded="worlds.cave.loaded"
          :action="worldActions.cave"
          class="flex-grow-1"
          @start="handleWorldExec('cave', 'start')"
          @stop="handleWorldExec('cave', 'stop')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import liteApi from '@/api/lite'
import { formatBytes } from '@/utils/tools'
import RoomOverviewCard from './components/RoomOverviewCard.vue'
import SystemMetricCard from './components/SystemMetricCard.vue'
import WorldOverviewCard from './components/WorldOverviewCard.vue'
import { showSnackbar } from '@/utils/snackbar.js'

const sysInfo = ref({
  dmpMem: 0,
  cpu: 0,
  memory: 0,
})

const sysLoaded = ref(false)
const sysError = ref(false)
const sysLoading = ref(false)
const lastUpdated = ref(null)

const room = ref({})
const roomLoaded = ref(false)
const roomError = ref(false)
const address = ref('-')
const players = ref([])

// 模组数量：null 表示尚未取到（加载中或接口失败），卡片显示「—」
const modCount = ref(null)
const modError = ref(false)

const worlds = reactive({
  ground: {
    data: {},
    loaded: false,
    error: false,
  },
  cave: {
    data: {},
    loaded: false,
    error: false,
  },
})

const manualRefreshing = ref(false)

// 记录每个世界正在执行的操作，用于按钮 loading 与防重复点击
const worldActions = reactive({
  ground: '',
  cave: '',
})

const HISTORY_LIMIT = 30

const dmpMemHistory = ref([])
const cpuHistory = ref([])
const memoryHistory = ref([])

const appendHistory = (history, value) => {
  if (!Number.isFinite(value)) return

  // 首次采样补一个点，让曲线立即出现而不是等下一次轮询
  if (history.value.length === 0) history.value.push(value)

  history.value.push(value)

  if (history.value.length > HISTORY_LIMIT) {
    history.value.splice(0, history.value.length - HISTORY_LIMIT)
  }
}

const getSysInfo = async () => {
  if (sysLoading.value) return

  sysLoading.value = true

  try {
    const response = await liteApi.sys.get()
    const data = response.data || {}

    const next = {
      dmpMem: Number(data.dmpMem) || 0,
      cpu: Number(data.cpu) || 0,
      memory: Number(data.memory) || 0,
    }

    sysInfo.value = next
    sysLoaded.value = true
    sysError.value = false
    lastUpdated.value = new Date()

    appendHistory(dmpMemHistory, Number((next.dmpMem / 1024 / 1024).toFixed(1)))
    appendHistory(cpuHistory, Number(next.cpu.toFixed(1)))
    appendHistory(memoryHistory, Number(next.memory.toFixed(1)))
  } catch {
    sysError.value = true
  } finally {
    sysLoading.value = false
  }
}

const loadRoom = async () => {
  try {
    const response = await liteApi.room.get()

    room.value = response.data || {}
    roomError.value = false
  } catch {
    roomError.value = true
  } finally {
    roomLoaded.value = true
  }
}

const loadWorld = async type => {
  try {
    const response = await liteApi[type].get()

    worlds[type].data = response.data || {}
    worlds[type].error = false
  } catch {
    worlds[type].error = true
  } finally {
    worlds[type].loaded = true
  }
}

const loadCC = () => {
  liteApi.cc.get().then(response => {
    address.value = response.data
  }).catch(() => {
    // 错误提示由 axios 拦截器统一处理
  })
}

const loadMod = async () => {
  try {
    const response = await liteApi.mod.get()
    const content = typeof response.data === 'string' ? response.data : ''

    // 与后端 extractWorkshopIDs 保持一致，统计 modoverrides.lua 中的 ["workshop-<ID>"] 配置项
    modCount.value = (content.match(/\["workshop-\d+"\]/g) || []).length
    modError.value = false
  } catch {
    modError.value = true
    modCount.value = null
  }
}

const loadPlayers = async () => {
  liteApi.players.get().then(response => {
    players.value = response.data || []
  }).catch(() => {
    // 错误提示由 axios 拦截器统一处理
  })
}

const handleExec = async (cmdType, worldName) => {
  const form = {
    cmdType: cmdType,
    worldName: worldName,
  }

  const response = await liteApi.exec.post(form)

  showSnackbar(response.message)

  return response
}

const handleUpdate = async () => {
  try {
    await handleExec('update', '')
  } catch {
    // 错误提示由 axios 拦截器统一处理
  }
}

const handleWorldExec = async (type, cmdType) => {
  if (worldActions[type]) return

  worldActions[type] = cmdType

  try {
    await handleExec(cmdType, worlds[type].data.name || '')

    // 执行后重新拉取状态，让卡片上的运行状态立即更新
    await loadWorld(type)
  } catch {
    // 错误提示由 axios 拦截器统一处理
  } finally {
    worldActions[type] = ''
  }
}

const refreshAll = async () => {
  manualRefreshing.value = true

  try {
    await Promise.all([
      getSysInfo(),
      loadRoom(),
      loadWorld('ground'),
      loadWorld('cave'),
      // eslint-disable-next-line sonarjs/no-use-of-empty-return-value
      loadCC(),
      loadMod(),
      loadPlayers(),
    ])
  } finally {
    manualRefreshing.value = false
  }
}

const hasError = computed(() => sysError.value || roomError.value || worlds.ground.error || worlds.cave.error || modError.value)

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return '--:--:--'

  return lastUpdated.value.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
})

const liveLabel = computed(() => {
  if (sysError.value) return '连接中断'
  if (!sysLoaded.value) return '连接中'

  return '实时'
})

const livePillClass = computed(() => ({
  'live-pill--muted': !sysLoaded.value && !sysError.value,
  'live-pill--error': sysError.value,
}))

const dmpMemParts = computed(() => {
  if (!sysLoaded.value || !sysInfo.value.dmpMem) {
    return {
      value: '—',
      unit: '',
    }
  }

  const [value, unit] = formatBytes(sysInfo.value.dmpMem).split(' ')

  return { value, unit }
})

// 数据几乎不变时给曲线一个居中的比例尺，避免退化成一条贴底的横线
const getSparklineBounds = history => {
  const values = history.value

  if (values.length < 2) return {}

  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = max - min

  if (spread > Math.max(0.3, Math.abs(max) * 0.01)) return {}

  const pad = Math.max(Math.abs(max) * 0.2, 1)

  return {
    min: Math.max(0, Number((min - pad).toFixed(1))),
    max: Number((max + pad).toFixed(1)),
  }
}

const getLoadStatus = percent => {
  if (!sysLoaded.value) {
    return {
      label: '等待数据',
      color: 'secondary',
    }
  }

  if (percent >= 90) {
    return {
      label: '过高',
      color: 'error',
    }
  }

  if (percent >= 75) {
    return {
      label: '偏高',
      color: 'warning',
    }
  }

  return {
    label: '正常',
    color: 'success',
  }
}

const dmpMemStatus = computed(() => {
  if (!sysLoaded.value) {
    return {
      label: '等待数据',
      color: 'secondary',
    }
  }

  if (sysInfo.value.dmpMem > 0) {
    return {
      label: '运行中',
      color: 'success',
    }
  }

  return {
    label: '等待数据',
    color: 'secondary',
  }
})

const metrics = computed(() => {
  const cpuStatus = getLoadStatus(sysInfo.value.cpu)
  const memoryStatus = getLoadStatus(sysInfo.value.memory)

  return [
    {
      icon: 'ri-database-2-line',
      title: 'DMP Lite 内存',
      hint: '平台进程常驻内存',
      value: dmpMemParts.value.value,
      unit: dmpMemParts.value.unit,
      caption: '进程 RSS',
      status: dmpMemStatus.value.label,
      statusColor: dmpMemStatus.value.color,
      accent: 'primary',
      lineColor: '#8C57FF',
      gradient: ['rgba(140, 87, 255, 0.22)', 'rgba(140, 87, 255, 0)'],
      soft: 'rgba(140, 87, 255, 0.12)',
      history: dmpMemHistory.value,
      ...getSparklineBounds(dmpMemHistory),
    },
    {
      icon: 'ri-cpu-line',
      title: 'CPU 使用率',
      hint: '系统 CPU 占用',
      value: sysLoaded.value ? sysInfo.value.cpu.toFixed(1) : '—',
      unit: sysLoaded.value ? '%' : '',
      caption: '系统占用',
      status: cpuStatus.label,
      statusColor: cpuStatus.color,
      accent: 'info',
      lineColor: '#16B1FF',
      gradient: ['rgba(22, 177, 255, 0.20)', 'rgba(22, 177, 255, 0)'],
      soft: 'rgba(22, 177, 255, 0.10)',
      history: cpuHistory.value,
      ...getSparklineBounds(cpuHistory),
    },
    {
      icon: 'ri-ram-2-line',
      title: '内存使用率',
      hint: '系统内存占用',
      value: sysLoaded.value ? sysInfo.value.memory.toFixed(1) : '—',
      unit: sysLoaded.value ? '%' : '',
      caption: '系统内存',
      status: memoryStatus.label,
      statusColor: memoryStatus.color,
      accent: 'success',
      lineColor: '#56CA00',
      gradient: ['rgba(86, 202, 0, 0.20)', 'rgba(86, 202, 0, 0)'],
      soft: 'rgba(86, 202, 0, 0.09)',
      history: memoryHistory.value,
      ...getSparklineBounds(memoryHistory),
    },
  ]
})

let refreshTimer = null

onMounted(async () => {
  await refreshAll()

  refreshTimer = setInterval(refreshAll, 10000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
.lite-dashboard {
  position: relative;
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.8rem;
  border-radius: 999px;
  background: rgba(var(--v-theme-success), 0.1);
  color: rgb(var(--v-theme-success));
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.live-pill--muted {
  background: rgba(var(--v-theme-on-surface), 0.05);
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.live-pill--error {
  background: rgba(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
}

.live-dot {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  inline-size: 6px;
  block-size: 6px;
  border-radius: 50%;
  background: currentColor;
}

.live-dot::after {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: currentColor;
  content: '';
  animation: live-ring 2s ease-out infinite;
}

.live-time {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-variant-numeric: tabular-nums;
  font-weight: 400;
}

.dash-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: none;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.hover-lift:hover {
  border-color: rgba(var(--v-border-color), calc(var(--v-border-opacity) * 1.6));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.09);
  transform: translateY(-2px);
}

@keyframes live-ring {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }

  80%,
  100% {
    opacity: 0;
    transform: scale(3.2);
  }
}

@media (max-width: 599px) {
  .live-time {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .live-dot::after {
    animation: none;
  }

  .dash-card,
  .hover-lift:hover {
    transition: none;
    transform: none;
  }
}
</style>

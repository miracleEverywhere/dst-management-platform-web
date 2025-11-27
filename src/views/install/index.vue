<template>
  <transition name="fade">
    <v-container
      v-if="!installing"
      fluid
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-text>
              <div
                class="d-flex align-center justify-start"
                :style="{height: `${calculateContainerSize()-64}px`}"
              >
                <div class=" w-100">
                  <v-row>
                    <v-col
                      cols="12"
                      class="fcc"
                    >
                      <v-rating
                        v-model="rating"
                        :item-labels="ratingLabels"
                        density="default"
                        readonly
                      >
                        <template #item-label="props">
                          <span style="font-size: 0.66rem">
                            {{ t(`install.prepare.left.rating.${props.label}`) }}
                          </span>
                        </template>
                      </v-rating>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.Architecture') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.Architecture }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.CPUModel') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.CPUModel }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.CPUCores') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.CPUCores }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.MemorySize') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ formatBytes(osInfo.MemorySize) }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.OS') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.OS }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.Platform') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.Platform }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.PlatformVersion') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.PlatformVersion }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.Uptime') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      <time-running :seconds="osInfo.Uptime" />
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-text>
              <result
                :height="calculateContainerSize()-64"
                type="info"
                :title="globalStore.gameVersion.local===0?t('install.prepare.right.title'):t('install.prepare.right.varTitle')"
                :sub-title="t('install.prepare.right.subTitle')"
              >
                <v-btn
                  v-if="globalStore.gameVersion.local===0"
                  color="info"
                  class="mt-4"
                  @click="handleInstall"
                >
                  {{ t('install.prepare.right.install') }}
                </v-btn>
                <v-btn
                  v-if="globalStore.gameVersion.local!==0"
                  color="warning"
                  class="mt-4"
                  @click="handleInstall"
                >
                  {{ t('install.prepare.right.reinstall') }}
                </v-btn>
                <v-btn
                  v-if="globalStore.gameVersion.local!==0"
                  color="primary"
                  class="mt-4"
                  @click="handleUpdate"
                >
                  {{ t('install.prepare.right.update') }}
                </v-btn>
              </result>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div v-else>
      <v-alert
        type="warning"
        theme="dark"
        density="compact"
        class="mb-4"
      >
        {{ t('install.install.alert') }}
      </v-alert>
      <div
        ref="terminalEl"
        class="terminal"
        :style="{height: `${calculateContainerSize()-78}px`}"
      />
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { formatBytes, getToken } from "@/utils/tools.js"
import useGlobalStore from "@store/global.js"
import platformApi from "@/api/platform.js"
import { sleep } from "@antfu/utils"
import { useI18n } from "vue-i18n"

// 响应式数据
const terminalContainer = ref(null)
const terminalEl = ref(null)
const term = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const customCommand = ref('')
const globalStore = useGlobalStore()
const { t } = useI18n()

const theme = computed(() => globalStore.theme)

const installing = ref(false)

const osInfo = ref({
  Architecture: "",
  OS: "",
  CPUModel: "",
  CPUCores: 2,
  MemorySize: 0,
  Platform: "",
  PlatformVersion: "",
  Uptime: 0,
})

const getOSInfo = () => {
  platformApi.osInfo.get().then(response => {
    osInfo.value = response.data
  })
}

const rating = computed(() => {
  let r = 5

  // 小于4核
  if (osInfo.value.CPUCores < 4) {
    r--
  }

  // 小于2核
  if (osInfo.value.CPUCores < 2) {
    r--
  }

  // 小于8G
  if (osInfo.value.MemorySize < 1750000000 * 4) {
    r--
  }

  // 小于4G
  if (osInfo.value.MemorySize < 1750000000 * 2) {
    r--
  }

  // 小于2G
  if (osInfo.value.MemorySize < 1750000000) {
    r--
  }

  return r
})

const ratingLabels = ref(['hell', 'bad', 'ok', 'good', 'great'])

const handleInstall = async () => {
  installing.value = true
  await initTerminal()
  await connectWebSocket()

  await sleep(2000)
  await sendCommand('bash manual_install.sh')
}

const handleUpdate = async () => {
  installing.value = true
  await initTerminal()
  await connectWebSocket()

  await sleep(2000)
  await sendCommand('cd ~/steamcmd ; ./steamcmd.sh +login anonymous +force_install_dir ~/dst +app_update 343050 validate +quit')
}

const windowHeight = ref(window.innerHeight)

// 初始化终端
const initTerminal = async () => {
  term.value = new Terminal({
    cursorBlink: true,
    fontSize: 15,
    theme: {
      background: theme.value === 'dark' ? '#1e1e1e' : '#ffffff',
      foreground: theme.value === 'dark' ? '#ffffff' : '#1e1e1e',
      cursor: theme.value === 'dark' ? '#ffffff' : '#000000', // 根据主题设置光标颜色
      cursorAccent: theme.value === 'dark' ? '#1e1e1e' : '#ffffff', // 光标聚焦色
    },
    cols: 120,
    rows: 30,
    convertEol: true,
    disableStdin: false,
    cursorStyle: 'block',
    scrollback: 1000,
    tabStopWidth: 8,
    bellStyle: 'none',
  })

  fitAddon.value = new FitAddon()
  term.value.loadAddon(fitAddon.value)

  await nextTick()
  term.value.open(terminalEl.value)
  fitAddon.value.fit()

  // 添加窗口大小调整监听
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小调整
const handleResize = () => {
  windowHeight.value = window.innerHeight
  if (fitAddon.value) {
    fitAddon.value.fit()
    sendResizeMessage()
  }
}

const calculateContainerSize = () => {
  // 64(navbar) + 72(step header) + 54(step action) + 24(card margins) = 304
  const other = 120

  return Math.max(2, Math.floor(windowHeight.value - other))
}

// 发送终端大小信息
const sendResizeMessage = () => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return

  const dimensions = {
    cols: term.value.cols,
    rows: term.value.rows,
    type: 'resize',
  }

  ws.value.send(JSON.stringify(dimensions))
}

// 发送命令到终端
const sendCommand = command => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    console.error('WebSocket未连接')
    
    return
  }

  // 在命令末尾添加回车符来执行
  const commandToSend = command + '\r'

  // 发送命令到WebSocket
  ws.value.send(commandToSend)

  // 可选：在终端界面上也显示输入的命令（视觉反馈）
  // term.value.write(`\r\n$ ${command}\r\n`)
}

// 执行自定义命令
const executeCustomCommand = () => {
  if (customCommand.value.trim()) {
    sendCommand(customCommand.value.trim())
    customCommand.value = '' // 清空输入框
  }
}

// 连接WebSocket
const connectWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const token = getToken()
  const wsUrl = `${protocol}//${window.location.host}/v3/platform/webssh?token=${token}`

  ws.value = new WebSocket(wsUrl)

  ws.value.onopen = () => {
    connected.value = true
    sendResizeMessage()
    term.value.focus()
    term.value.write('\r\n\x1b[0m') // 重置终端样式
  }

  ws.value.onmessage = event => {
    if (event.data instanceof Blob) {
      const reader = new FileReader()

      reader.onload = () => {
        term.value.write(reader.result)
      }
      reader.readAsText(event.data)
    } else {
      term.value.write(event.data)
    }
  }

  ws.value.onclose = event => {
    connected.value = false
    if (!event.wasClean) {
      term.value.write('\r\n\x1b[31m连接异常关闭，5秒后尝试重新连接...\x1b[0m\r\n')
      setTimeout(reconnect, 5000)
    } else {
      term.value.write('\r\n\x1b[33m连接已关闭\x1b[0m\r\n')
    }
  }

  ws.value.onerror = error => {
    console.error('WebSocket error:', error)
    connected.value = false
  }

  // 终端输入处理
  term.value.onData(data => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(data)
    }
  })

  term.value.onBinary(data => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(data)
    }
  })
}

// 重新连接
const reconnect = () => {
  cleanup()
  setTimeout(() => {
    connectWebSocket()
  }, 1000)
}

// 清理资源
const cleanup = () => {
  if (ws.value) {
    ws.value.close()
  }
  if (term.value) {
    term.value.dispose()
  }
  window.removeEventListener('resize', handleResize)
}

// 生命周期
onMounted(async () => {
  window.addEventListener('resize', handleResize)
  getOSInfo()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cleanup()
})
</script>

<style scoped>
.terminal {
  width: 100%;
}

:deep(.xterm) * {
  letter-spacing: normal !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
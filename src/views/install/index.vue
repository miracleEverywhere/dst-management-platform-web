<template>
  <transition name="fade">
    <v-container
      v-if="!installing"
      fluid
    >
      <v-alert
        v-if="blocked"
        color="warning"
        density="compact"
        variant="tonal"
        class="mb-4"
      >
        {{ t('install.install.busy') }}
      </v-alert>
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
                      <v-dialog :width="mobile?'90%':'50%'">
                        <template #activator="{ props: activatorProps }">
                          <span
                            v-bind="activatorProps"
                            class="cursor-pointer text-primary hover-highlight-primary"
                          >
                            {{ osInfo.CPUModel }}
                          </span>
                        </template>
                        <v-card>
                          <v-card-title>
                            {{ t('install.prepare.left.CPUDetail.title') }}
                          </v-card-title>
                          <v-card-text>
                            <v-tabs v-model="cpu">
                              <v-tab
                                v-for="(_, index) in osInfo.CPUDetail"
                                :key="index"
                                :value="index"
                              >
                                <v-icon
                                  icon="ri-cpu-line"
                                  class="mr-2"
                                />
                                {{ index }}
                              </v-tab>
                            </v-tabs>
                            <v-tabs-window
                              v-model="cpu"
                              class="my-8"
                            >
                              <v-tabs-window-item
                                v-for="(cpuDetail, index) in osInfo.CPUDetail"
                                :value="index"
                              >
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.physicalId') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.physicalId }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.coreId') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.coreId }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.cpu') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.cpu }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.vendorId') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.vendorId }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.family') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.family }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.modelName') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.modelName }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.mhz') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.mhz }} MHz
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.cacheSize') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.cacheSize / 1024 }} MiB
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.stepping') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.stepping }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col
                                    cols="6"
                                    class="d-flex justify-end"
                                  >
                                    <v-chip
                                      color="primary"
                                      label
                                    >
                                      {{ t('install.prepare.left.CPUDetail.microcode') }}
                                    </v-chip>
                                  </v-col>
                                  <v-col
                                    cols="6"
                                    class="d-flex align-center"
                                  >
                                    {{ cpuDetail.microcode }}
                                  </v-col>
                                </v-row>
                              </v-tabs-window-item>
                            </v-tabs-window>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
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
                  :disabled="blocked"
                  @click="handleInstall"
                >
                  {{ t('install.prepare.right.install') }}
                </v-btn>
                <v-btn
                  v-if="globalStore.gameVersion.local!==0"
                  color="warning"
                  class="mt-4"
                  :disabled="blocked"
                  @click="handleInstall"
                >
                  {{ t('install.prepare.right.reinstall') }}
                </v-btn>
                <v-btn
                  v-if="globalStore.gameVersion.local!==0"
                  color="primary"
                  class="mt-4"
                  :disabled="blocked"
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
    <div
      v-else
      class="install-log-wrapper"
    >
      <v-alert
        color="warning"
        density="compact"
        class="mt-2 mb-2"
      >
        {{ t('install.install.alert') }}
      </v-alert>
      <div
        ref="logEl"
        class="install-log"
        :style="{height: `${calculateContainerSize()-78}px`}"
      >
        <div
          v-if="lines.length===0"
          class="install-log-empty"
        >
          {{ t('install.install.waiting') }}
        </div>
        <div
          v-for="(line, index) in lines"
          :key="index"
          class="install-log-line"
        >
          {{ line }}
        </div>
      </div>
      <div
        v-if="disconnected"
        class="install-log-retry"
      >
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          @click="restore"
        >
          {{ t('install.install.retry') }}
        </v-btn>
      </div>
    </div>
  </transition>
  <confirm-box
    v-model="installSuccessDialog"
    type="success"
    :title="t('install.install.success')"
    :content="t('install.install.success')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
  <confirm-box
    v-model="installErrorDialog"
    type="error"
    :title="t('install.install.fail')"
    :content="t('install.install.fail')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
  <confirm-box
    v-model="updateSuccessDialog"
    type="success"
    :title="t('install.install.updateSuccess')"
    :content="t('install.install.updateSuccess')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
  <confirm-box
    v-model="updateErrorDialog"
    type="error"
    :title="t('install.install.updateFail')"
    :content="t('install.install.updateFail')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify/framework'
import { formatBytes, getToken } from '@/utils/tools.js'
import useGlobalStore from '@store/global.js'
import platformApi, { gameInstallStreamURL } from '@/api/platform.js'
import { openSSE } from '@/utils/sse.js'
import { showSnackbar } from '@/utils/snackbar.js'

// 日志面板最多保留的行数，安装输出可能有上千行
const MAX_LINES = 2000

// 断线自动重连次数，超过后交给「重新连接日志」按钮
const MAX_RETRY = 3

// 外部任务（定时更新、控制台、诊断修复）占用安装锁时，轮询状态的间隔
const BUSY_POLL_INTERVAL = 10000

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

// 准备页上展示「外部任务进行中」的提示条，并禁用三颗按钮
const blocked = ref(false)

// 是否处于日志视图
const installing = ref(false)

const lines = ref([])
const logEl = ref(null)
const disconnected = ref(false)

// install / update，用于选择结果弹窗文案
const runningAction = ref('')

// 已收到的输出字节偏移，续传时作为 after 传给后端
let offset = 0
let abort = null
let busyTimer = null

// 组件卸载后不再建立新连接（恢复流程里有 await，可能晚于卸载返回）
let disposed = false

const installSuccessDialog = ref(false)
const installErrorDialog = ref(false)
const updateSuccessDialog = ref(false)
const updateErrorDialog = ref(false)

const osInfo = ref({
  Architecture: "",
  OS: "",
  CPUModel: "",
  CPUCores: 2,
  MemorySize: 0,
  Platform: "",
  PlatformVersion: "",
  Uptime: 0,
  CPUDetail: [],
})

const getOSInfo = () => {
  platformApi.osInfo.get().then(response => {
    osInfo.value = response.data
  })
}

const rating = computed(() => {
  let r = 5

  if (osInfo.value.CPUCores < 4) {
    r--
  }

  if (osInfo.value.CPUCores < 2) {
    r--
  }

  if (osInfo.value.MemorySize < 1750000000 * 4) {
    r--
  }

  if (osInfo.value.MemorySize < 1750000000 * 2) {
    r--
  }

  if (osInfo.value.MemorySize < 1750000000) {
    r--
  }

  return r
})

const ratingLabels = ref(['hell', 'bad', 'ok', 'good', 'great'])

const windowHeight = ref(window.innerHeight)

const handleInstall = () => start('install')
const handleUpdate = () => start('update')

// 一次 GET 请求既是启动也是订阅：action 有值表示启动新任务，为空表示接回已有任务
const start = async action => {
  if (action === 'install') {
    showSnackbar(t('install.prepare.right.tip'))
  }
  resetLog(action)
  await attach({ action })
}

// 手动重连：从上次收到的偏移继续订阅，不会重启任务
const restore = async () => {
  disconnected.value = false
  await attach({})
}

const fetchState = async () => {
  try {
    const response = await platformApi.gameInstall.state.get()

    return response?.data || null
  } catch {
    // 查不到状态不影响安装本身，按空闲处理
    return null
  }
}

const resetLog = action => {
  runningAction.value = action || ''
  lines.value = []
  offset = 0
  disconnected.value = false
  installing.value = true
}

const attach = async ({ action } = {}) => {
  if (disposed) return

  abort?.abort()

  const current = new AbortController()

  abort = current

  let finished = false

  try {
    await openSSE(gameInstallStreamURL({ action, after: offset }), {
      token: getToken(),
      lang: globalStore.language,
      lastEventID: offset,
      signal: current.signal,
      maxRetries: MAX_RETRY,

      // 续传参数走查询串（after 是字节偏移），重连时用最新偏移重拼地址
      buildURL: lastEventID => gameInstallStreamURL({ action, after: lastEventID }),

      // 指数退避：1s、2s、4s
      retryDelay: count => 1000 * 2 ** (count - 1),
      onRetry: () => {
        showSnackbar(t('install.install.reconnecting'), 'warning')
      },
      onEvent: ({ type, data, id }) => {
        if (type === 'chunk') {
          offset = Number(id) || offset
          appendText(data?.c)

          return
        }
        if (type === 'done') {
          finished = true
          finish(data || {})

          // 终止事件，不再重连
          return false
        }
      },
    })

    // 重试到上限仍未收到 done：留一个手动重连入口
    if (!finished && !disposed && current === abort) {
      disconnected.value = true
    }
  } catch (error) {
    if (disposed || error?.name === 'AbortError') return

    await handleStreamError(error)
  }
}

const handleStreamError = async error => {
  const code = Number(error?.code) || 0

  // 已有任务在跑：改为只订阅现有任务
  if (code === 5068) {
    showSnackbar(error.message || t('install.install.busy'), 'warning')

    const state = await fetchState()

    if (state?.running && state.streamed) {
      resetLog(state.action)
      await attach({})

      return
    }
    installing.value = false
    if (state?.running) {
      blocked.value = true
      startBusyPolling()
    }

    return
  }

  // 没有可订阅的任务 / 脚本缺失：提示后回到准备页
  if (code === 5069 || code === 5070) {
    showSnackbar(error.message || t('install.install.fail'), 'error')
    installing.value = false

    return
  }

  // 420 已由 sse.js 清理登录态并跳转，这里不再重复提示
  if (code === 420) return

  // 传输层故障：自动重连已到上限，交给「重新连接日志」按钮
  if (error?.transport) {
    disconnected.value = true

    return
  }

  showSnackbar(error?.message || t('install.install.reconnecting'), 'error')
  disconnected.value = true
}

// 后端保证每段输出都以换行结尾，按行拆开追加（保留内容里的空行，只去掉末尾那次换行）
const appendText = text => {
  if (!text) return

  const incoming = text.replace(/\n$/, '').split('\n')
  const next = lines.value.concat(incoming)

  lines.value = next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()

  const el = logEl.value

  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

const finish = data => {
  const action = data.action || runningAction.value

  if (action === 'update') {
    if (data.success) {
      updateSuccessDialog.value = true
    } else {
      updateErrorDialog.value = true
    }

    return
  }

  if (data.success) {
    installSuccessDialog.value = true
  } else {
    installErrorDialog.value = true
  }
}

const stopBusyPolling = () => {
  if (busyTimer) {
    clearInterval(busyTimer)
    busyTimer = null
  }
}

// 外部任务没有输出流，只能轮询状态等它结束；期间若换成网页发起的任务则接回日志
const startBusyPolling = () => {
  stopBusyPolling()
  busyTimer = setInterval(async () => {
    const state = await fetchState()

    if (disposed) {
      stopBusyPolling()

      return
    }
    if (!state?.running) {
      blocked.value = false
      stopBusyPolling()

      return
    }
    if (state.streamed) {
      blocked.value = false
      stopBusyPolling()
      resetLog(state.action)
      await attach({})
    }
  }, BUSY_POLL_INTERVAL)
}

// 处理窗口大小调整
const handleResize = () => {
  windowHeight.value = window.innerHeight
}

const calculateContainerSize = () => {
  let other = 120

  if (blocked.value) {
    other = other + 42 + 24
  }

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const reloadPage = () => {
  window.location.reload()
}

const cpu = ref(0)

const cleanup = () => {
  disposed = true
  stopBusyPolling()
  abort?.abort()
  abort = null
  window.removeEventListener('resize', handleResize)
}

// 生命周期
onMounted(async () => {
  window.addEventListener('resize', handleResize)
  getOSInfo()

  // 刷新页面后若任务还在跑，直接接回日志视图；不是网页发起的任务没有输出流，只能提示等待
  const state = await fetchState()

  // 状态回来之前用户可能已经点了按钮，此时不要再重置一遍日志视图
  if (disposed || installing.value || !state?.running) return

  if (state.streamed) {
    resetLog(state.action)
    await attach({})

    return
  }

  blocked.value = true
  startBusyPolling()
})

onUnmounted(cleanup)
</script>

<style scoped>
.install-log {
  width: 100%;
  overflow-y: auto;
  padding: 12px;
  border-radius: 4px;
  background: rgba(var(--v-theme-surface-variant), 0.4);
  font-family: Menlo, Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.install-log-line {
  min-height: 1.5em;
}

.install-log-empty {
  opacity: 0.6;
}

.install-log-retry {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hover-highlight-primary {
  transition: color 0.2s ease, opacity 0.2s ease;
}

.hover-highlight-primary:hover {
  color: rgb(var(--v-theme-primary));
  opacity: 0.8;
}
</style>

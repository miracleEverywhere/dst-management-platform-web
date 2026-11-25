<template>
  <v-dialog
    v-model="open"
    :max-width="dialogWidth"
    :persistent="busy"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon
          :icon="titleIcon"
          :color="titleColor"
          class="mr-2"
        />
        <span>{{ title }}</span>
        <v-spacer />
        <v-chip
          v-if="targetVersion && step !== 'confirm'"
          color="primary"
          size="small"
          variant="tonal"
        >
          {{ targetVersion }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <!-- 确认页：版本对比 + 更新说明 + 加速节点 -->
        <template v-if="step === 'confirm'">
          <v-row
            dense
            class="mt-2"
          >
            <v-col
              cols="6"
              sm="4"
              class="d-flex align-center"
            >
              <v-chip
                size="small"
                class="mr-2"
              >
                {{ t('selfUpdate.current') }}
              </v-chip>
              {{ currentVersion || '--' }}
            </v-col>
            <v-col
              cols="6"
              sm="4"
              class="d-flex align-center"
            >
              <v-chip
                size="small"
                color="primary"
                class="mr-2"
              >
                {{ t('selfUpdate.latest') }}
              </v-chip>
              {{ targetVersion || '--' }}
            </v-col>
          </v-row>
          <v-alert
            class="mt-4"
            color="warning"
            density="compact"
            variant="tonal"
            :text="t('selfUpdate.confirmTip')"
          />
          <div class="mt-4 text-subtitle-2">
            {{ t('selfUpdate.notes') }}
          </div>
          <div class="update-notes">
            {{ notes || t('selfUpdate.noNotes') }}
          </div>
          <v-text-field
            v-model="proxy"
            class="mt-4"
            clearable
            density="compact"
            :label="t('selfUpdate.proxy')"
            :hint="t('selfUpdate.proxyTip')"
            persistent-hint
            :placeholder="defaultProxy"
          />
          <v-alert
            v-if="errorMessage"
            class="mt-4"
            color="error"
            density="compact"
            variant="tonal"
            :text="errorMessage"
          />
        </template>
        <!-- 更新中：阶段进度 + 输出日志 -->
        <template v-else-if="step === 'running'">
          <div class="d-flex align-center justify-space-between mt-2 mb-2">
            <span class="text-subtitle-1">{{ phaseText }}</span>
            <span>{{ percent }}%</span>
          </div>
          <v-progress-linear
            :model-value="percent"
            color="primary"
            height="8"
            rounded
          />
          <div class="mt-4 text-subtitle-2">
            {{ t('selfUpdate.log') }}
          </div>
          <div
            ref="logEl"
            class="update-log"
          >
            <div
              v-if="lines.length === 0"
              class="update-log-empty"
            >
              {{ t('selfUpdate.waiting') }}
            </div>
            <div
              v-for="(line, index) in lines"
              :key="index"
              class="update-log-line"
            >
              {{ line }}
            </div>
          </div>
        </template>
        <!-- 重启中：进程被新镜像替换，连接一定会断，改为轮询版本 -->
        <template v-else-if="step === 'waiting'">
          <div class="d-flex flex-column align-center py-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="48"
            />
            <div class="mt-4 text-center">
              {{ t('selfUpdate.waitingTip') }}
            </div>
            <div class="mt-2 text-medium-emphasis">
              {{ t('selfUpdate.waitingElapsed', { seconds: waitingElapsed }) }}
            </div>
          </div>
        </template>
        <!-- 结果页 -->
        <template v-else>
          <v-alert
            v-if="step === 'success'"
            color="success"
            variant="tonal"
            :text="t('selfUpdate.successTip', { version: targetVersion || currentVersion, seconds: reloadSeconds })"
          />
          <v-alert
            v-else-if="step === 'failed'"
            color="error"
            variant="tonal"
          >
            <div v-if="failureReason">
              {{ failureReason }}
            </div>
            <div class="mt-2">
              {{ rollback ? t('selfUpdate.rolledBackTip', { version: currentVersion || '--' }) : t('selfUpdate.failedTip') }}
            </div>
          </v-alert>
          <v-alert
            v-else
            color="warning"
            variant="tonal"
            :text="t('selfUpdate.timeoutTip')"
          />
        </template>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <template v-if="step === 'confirm'">
          <v-btn
            variant="text"
            @click="close"
          >
            {{ t('selfUpdate.cancel') }}
          </v-btn>
          <v-btn
            color="warning"
            variant="elevated"
            :loading="submitting"
            @click="start"
          >
            {{ t('selfUpdate.start') }}
          </v-btn>
        </template>
        <template v-else-if="step === 'success'">
          <v-btn
            color="primary"
            variant="elevated"
            @click="reloadPage"
          >
            {{ t('selfUpdate.reloadNow') }}
          </v-btn>
        </template>
        <template v-else-if="!busy">
          <v-btn
            variant="text"
            @click="close"
          >
            {{ t('selfUpdate.close') }}
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { getToken } from '@/utils/tools.js'
import { showSnackbar } from '@/utils/snackbar.js'
import { openSSE } from '@/utils/sse.js'
import platformApi, { selfUpdateStreamURL } from '@/api/platform.js'
import { dmpVersion, fetchDmpVersion, selfUpdateDialog } from '@/utils/selfUpdate.js'
import useGlobalStore from '@store/global.js'
import useUserStore from '@store/user.js'

// 日志面板最多保留的行数
const MAX_LOG_LINES = 500

// 等待服务恢复：1 秒轮询一次，最多等 120 秒（与后端守护的健康检查超时一致）
const WAIT_POLL_INTERVAL = 1000
const WAIT_TIMEOUT = 120000

// 重启后服务已经响应但仍是旧版本，连续命中这么多次就判定为已回滚
const ROLLBACK_HIT_LIMIT = 3
const ROLLBACK_MIN_ELAPSED = 10

// 更新完成后自动刷新的倒计时
const RELOAD_DELAY = 3

// 默认加速节点，留空表示直连 GitHub
const DEFAULT_PROXY = 'https://ghfast.top/'

const PROXY_PATTERN = /^https?:\/\/[^\s?#]+$/i

// 已有更新任务在跑
const CODE_UPDATE_BUSY = 5081

// 已是最新版本
const CODE_UPDATE_NOT_NEEDED = 5084

const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t, te } = useI18n()

// confirm：确认更新；running：下载/校验/替换；waiting：等待服务恢复；
// success / failed / timeout：结束状态
const step = ref('confirm')

const proxy = ref(DEFAULT_PROXY)
const targetVersion = ref('')
const fromVersion = ref('')
const phase = ref('checking')
const percent = ref(0)
const phaseMessage = ref('')
const lines = ref([])
const logEl = ref(null)
const errorMessage = ref('')
const failureReason = ref('')
const rollback = ref(false)
const waitingElapsed = ref(0)
const reloadSeconds = ref(RELOAD_DELAY)
const submitting = ref(false)

let abort = null
let waitTimer = null
let elapsedTimer = null
let reloadTimer = null

// 组件卸载后不再建立新连接（恢复流程里有 await，可能晚于卸载返回）
let disposed = false

const open = computed({
  get: () => selfUpdateDialog.open,
  set: value => {
    selfUpdateDialog.open = value
  },
})

const busy = computed(() => step.value === 'running' || step.value === 'waiting')

const dialogWidth = computed(() => (mobile.value ? '92%' : '640px'))

const currentVersion = computed(() => dmpVersion.current || fromVersion.value)
const notes = computed(() => dmpVersion.notes || '')
const defaultProxy = DEFAULT_PROXY

const title = computed(() => {
  switch (step.value) {
    case 'confirm':
      return t('selfUpdate.confirmTitle')
    case 'running':
      return t('selfUpdate.progressTitle')
    case 'waiting':
      return t('selfUpdate.waitingTitle')
    case 'success':
      return t('selfUpdate.successTitle')
    case 'timeout':
      return t('selfUpdate.timeoutTitle')
    default:
      return t('selfUpdate.failedTitle')
  }
})

const titleIcon = computed(() => {
  switch (step.value) {
    case 'success':
      return 'ri-checkbox-circle-line'
    case 'failed':
      return 'ri-close-circle-line'
    case 'timeout':
      return 'ri-time-line'
    case 'confirm':
      return 'ri-restart-line'
    default:
      return 'ri-download-cloud-line'
  }
})

const titleColor = computed(() => {
  switch (step.value) {
    case 'success':
      return 'success'
    case 'failed':
      return 'error'
    case 'timeout':
      return 'warning'
    default:
      return 'primary'
  }
})

// 阶段文案由前端本地化；没有对应阶段时退回后端给的阶段说明
const phaseText = computed(() => {
  const key = `selfUpdate.phase.${phase.value}`

  return te(key) ? t(key) : phaseMessage.value
})

const stopWaiting = () => {
  if (waitTimer) {
    clearTimeout(waitTimer)
    waitTimer = null
  }
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
}

const stopReload = () => {
  if (reloadTimer) {
    clearInterval(reloadTimer)
    reloadTimer = null
  }
}

const stopStream = () => {
  abort?.abort()
  abort = null
}

const resetDialog = () => {
  step.value = 'confirm'
  proxy.value = DEFAULT_PROXY
  targetVersion.value = dmpVersion.latest || ''
  fromVersion.value = dmpVersion.current || ''
  phase.value = 'checking'
  percent.value = 0
  phaseMessage.value = ''
  lines.value = []
  errorMessage.value = ''
  failureReason.value = ''
  rollback.value = false
  waitingElapsed.value = 0
  reloadSeconds.value = RELOAD_DELAY
}

const close = () => {
  stopReload()
  selfUpdateDialog.open = false
}

const reloadPage = () => {
  window.location.reload()
}

const scrollToBottom = async () => {
  await nextTick()

  const el = logEl.value

  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

// 后端保证每段输出都以换行结尾，按行拆开追加
const appendText = text => {
  if (!text) return

  const incoming = text.replace(/\n$/, '').split('\n')
  const next = lines.value.concat(incoming)

  lines.value = next.length > MAX_LOG_LINES ? next.slice(next.length - MAX_LOG_LINES) : next
  scrollToBottom()
}

const applyProgress = data => {
  phase.value = data?.phase || phase.value
  percent.value = Number(data?.percent) || 0
  phaseMessage.value = data?.message || ''
}

const finishSuccess = () => {
  stopReload()
  step.value = 'success'
  reloadSeconds.value = RELOAD_DELAY

  // 更新完成后页面里的资源还是旧版本，自动刷新一次；用户可以点按钮立即刷新
  reloadTimer = setInterval(() => {
    reloadSeconds.value -= 1
    if (reloadSeconds.value <= 0) {
      stopReload()
      reloadPage()
    }
  }, 1000)
}

const fail = (message, rolledBack = false) => {
  stopWaiting()
  stopReload()
  step.value = 'failed'
  rollback.value = rolledBack
  failureReason.value = message || ''
}

// 进程被新镜像替换后连接一定会断，改成轮询版本接口等新版本上线
const startWaiting = () => {
  stopWaiting()

  step.value = 'waiting'
  waitingElapsed.value = 0

  const startedAt = Date.now()
  let oldVersionHits = 0

  elapsedTimer = setInterval(() => {
    waitingElapsed.value = Math.floor((Date.now() - startedAt) / 1000)
  }, 1000)

  // 用 setTimeout 串行轮询：服务重启期间请求可能很慢，避免请求叠加
  const poll = async () => {
    if (disposed || step.value !== 'waiting') return

    if (Date.now() - startedAt > WAIT_TIMEOUT) {
      stopWaiting()
      step.value = 'timeout'

      return
    }

    const info = await fetchDmpVersion({ quiet: true })

    if (disposed || step.value !== 'waiting') return

    // 服务还没起来（连接被拒），继续等
    if (!info) {
      waitTimer = setTimeout(poll, WAIT_POLL_INTERVAL)

      return
    }

    if (targetVersion.value && info.current === targetVersion.value) {
      stopWaiting()
      finishSuccess()

      return
    }

    // 重启后服务已经响应，但版本仍是旧版本：多半是回滚守护把旧程序拉回来了
    const rollbackDetected = info.current
      && fromVersion.value
      && info.current === fromVersion.value
      && Date.now() - startedAt >= ROLLBACK_MIN_ELAPSED * 1000

    if (rollbackDetected) {
      oldVersionHits += 1
      if (oldVersionHits >= ROLLBACK_HIT_LIMIT) {
        fail(t('selfUpdate.rollbackDetected', { version: info.current }), true)

        return
      }
    } else {
      oldVersionHits = 0
    }

    waitTimer = setTimeout(poll, WAIT_POLL_INTERVAL)
  }

  waitTimer = setTimeout(poll, WAIT_POLL_INTERVAL)
}

const finish = data => {
  // 更新成功也统一走轮询确认版本，避免在进程真正替换前就提示成功
  if (data?.success) {
    if (data.to) targetVersion.value = data.to
    startWaiting()

    return
  }

  fail(data?.message, data?.rollback === true)
}

const attach = async after => {
  if (disposed) return

  stopStream()

  const current = new AbortController()

  abort = current

  let terminal = false

  try {
    await openSSE(selfUpdateStreamURL({ after }), {
      token: getToken(),
      lang: globalStore.language,
      lastEventID: after,
      signal: current.signal,
      maxRetries: 2,

      // 续传参数走查询串（after 是事件序号），重连时用最新序号重拼地址
      buildURL: lastEventID => selfUpdateStreamURL({ after: lastEventID }),
      retryDelay: count => 1500 * count,
      onEvent: ({ type, data }) => {
        if (type === 'chunk') {
          appendText(data?.c)

          return
        }
        if (type === 'progress') {
          applyProgress(data)

          // 收到 restarting 后连接一定会断：主动断开并切到「等待服务恢复」
          if (data?.phase === 'restarting') {
            terminal = true
            startWaiting()

            return false
          }

          return
        }
        if (type === 'done') {
          terminal = true
          finish(data || {})

          return false
        }
      },
    })

    // 没有收到终止事件就断了：多半是进程已经重启，直接等新版本上线
    if (!terminal && !disposed && current === abort) {
      startWaiting()
    }
  } catch (error) {
    // 主动断开（重新订阅、组件卸载）不是故障
    if (disposed || error?.name === 'AbortError' || current !== abort) return

    const code = Number(error?.code) || 0

    // 420 已由 sse.js 清理登录态并跳转
    if (code === 420) return

    // 更新过程中的流中断（传输层故障、5082 重启后任务状态被清空）都不代表更新失败：
    // 进程可能已经在重启，交给轮询版本确认最终结果
    if (step.value === 'running') {
      startWaiting()

      return
    }

    fail(error?.message || t('selfUpdate.failedTip'))
  }
}

const fetchState = async () => {
  try {
    const response = await platformApi.selfUpdate.state.get(undefined, { silent: true })

    return response?.data || null
  } catch {
    return null
  }
}

// 刷新页面或已有任务时恢复进度：从 0 重放事件，进度与日志都能补齐
const resume = async state => {
  const data = state || await fetchState()

  if (disposed || !data?.running) return false

  fromVersion.value = data.from || dmpVersion.current || ''
  targetVersion.value = data.to || ''
  phase.value = data.phase || 'checking'
  percent.value = Number(data.percent) || 0
  step.value = data.phase === 'restarting' ? 'waiting' : 'running'
  selfUpdateDialog.open = true

  if (step.value === 'waiting') {
    startWaiting()

    return true
  }

  attach(0)

  return true
}

const start = async () => {
  const value = (proxy.value || '').trim()

  if (value && !PROXY_PATTERN.test(value)) {
    errorMessage.value = t('selfUpdate.proxyInvalid')

    return
  }

  submitting.value = true
  errorMessage.value = ''
  failureReason.value = ''
  rollback.value = false
  lines.value = []
  percent.value = 0
  phase.value = 'checking'

  try {
    const response = await platformApi.selfUpdate.post({ proxy: value }, { silent: true })
    const state = response?.data || {}

    fromVersion.value = state.from || dmpVersion.current || ''
    targetVersion.value = state.to || dmpVersion.latest || ''
    applyProgress(state)
    step.value = 'running'
    attach(0)
  } catch (error) {
    const code = Number(error?.code) || 0

    // 已有更新任务：直接接回它的进度
    if (code === CODE_UPDATE_BUSY && await resume()) {
      showSnackbar(error?.message || t('selfUpdate.busyRetry'), 'warning')

      return
    }

    // 已是最新：刷新版本信息后关掉弹窗
    if (code === CODE_UPDATE_NOT_NEEDED) {
      await fetchDmpVersion({ refresh: true })
      showSnackbar(error?.message || t('selfUpdate.upToDate'), 'info')
      close()

      return
    }

    errorMessage.value = error?.message || t('selfUpdate.startFailed')
  } finally {
    submitting.value = false
  }
}

const cleanup = () => {
  disposed = true
  stopStream()
  stopWaiting()
  stopReload()
}

watch(open, value => {
  if (!value) return

  // 已有任务在跑（自动恢复）时不要重置界面
  if (step.value === 'running' || step.value === 'waiting') return

  resetDialog()

  // 版本信息还没查到（例如接口失败后重开弹窗），补查一次
  if (!dmpVersion.loaded) fetchDmpVersion()
})

onMounted(async () => {
  // 只查一次状态：后台正在更新时自动接回进度
  if (userStore.userInfo.role !== 'admin') return

  await resume()
})

onUnmounted(cleanup)
</script>

<style scoped>
.update-notes {
  max-height: 180px;
  overflow-y: auto;
  padding: 8px 12px;
  border-radius: 4px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.update-log {
  height: 220px;
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

.update-log-line {
  min-height: 1.5em;
}

.update-log-empty {
  opacity: 0.6;
}
</style>

import { onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { logsStreamURL } from '@/api/logs'
import { getToken } from '@/utils/tools'
import { showSnackbar } from '@/utils/snackbar'
import { openSSE } from '@/utils/sse'
import useGlobalStore from '@store/global'

const LOG_EVENT = 'log'

// 网络中断、网关错误等按断线处理，间隔一段时间后静默重连
const RETRY_DELAY = 5000

// 业务错误码（含 420）说明请求本身不合法，重连没有意义；HTTP 状态码可能只是网关临时故障
const isTerminalError = error => {
  const code = Number(error?.code) || 0

  return code === 420 || code >= 1000
}

const trimLines = (lines, limit) => (lines.length > limit ? lines.slice(-limit) : lines)

// 当前日志的实时流：先收到尾部快照（initial 为 true，替换已展示内容），
// 之后收到新增的完整行（追加到末尾），并按请求的行数裁剪，避免长开页面内容无限增长。
// 自动刷新开启时保持长连接；关闭时断开并保留现有内容，此时手动刷新走一次性连接，
// 收到尾部快照后立即断开，不再使用 HTTP 拉取接口。
// getParams 返回 null 表示当前没有可读取的日志（例如未选择房间），此时清空内容。
export const useLogStream = ({ getParams, autoRefresh }) => {
  const { t } = useI18n()
  const globalStore = useGlobalStore()

  const content = ref('')
  const firstPullFinished = ref(false)

  let controller = null
  let retryTimer = null
  let lostNotified = false

  // 本地裁剪上限，0 表示不裁剪：请求里的行数为空或 0 时不要退回“只留 1 行”。
  let lineLimit = 0

  // 组件卸载后不再建立新连接（刷新按钮的 debounce 定时器可能晚于卸载触发）。
  let disposed = false

  // 当前连接是否是一次性刷新（关闭自动刷新时点刷新）
  let oneShot = false

  const stopRetry = () => {
    if (retryTimer) {
      clearTimeout(retryTimer)
      retryTimer = null
    }
  }

  const stop = () => {
    stopRetry()
    if (controller) {
      controller.abort()
      controller = null
    }
  }

  // 返回 true 表示收到了尾部快照（一次性刷新可以据此断开）
  const applyEvent = event => {
    if (event.type !== LOG_EVENT) return false

    const data = event.data || {}
    const lines = Array.isArray(data.lines) ? data.lines : []

    if (data.initial) {
      content.value = trimLines(lines, lineLimit).join('\n')
      firstPullFinished.value = true
      lostNotified = false
      stopRetry()

      return true
    }

    if (!lines.length) return false

    const merged = content.value ? content.value.split('\n').concat(lines) : lines

    content.value = trimLines(merged, lineLimit).join('\n')
    firstPullFinished.value = true
  }

  const showLost = () => {
    if (lostNotified) return

    lostNotified = true
    showSnackbar(t('logs.streamLost'), 'error')
  }

  const scheduleRetry = () => {
    stopRetry()
    retryTimer = setTimeout(() => {
      retryTimer = null
      if (autoRefresh.value) connect()
    }, RETRY_DELAY)
  }

  const handleError = error => {
    if (isTerminalError(error)) {
      lostNotified = true
      firstPullFinished.value = true

      // 420 已由 sse.js 统一清理登录态并跳转，这里不再重复提示
      if (Number(error?.code) !== 420) {
        showSnackbar(error.message || t('logs.streamLost'), 'error')
      }

      return
    }

    // 一次性刷新失败时不再重连，保留上一次的内容，由用户手动重试
    if (oneShot) {
      firstPullFinished.value = true
      showSnackbar(t('logs.refreshFailed'), 'error')

      return
    }

    showLost()
    scheduleRetry()
  }

  const connect = ({ once = false } = {}) => {
    if (disposed) return

    stop()

    oneShot = once

    const params = getParams?.()

    if (!params) {
      content.value = ''
      firstPullFinished.value = false

      return
    }

    // 行数为空（输入框被清空）时保持上一次的上限，避免把内容裁到只剩 1 行
    const requestedLines = Math.floor(Number(params.lines))

    if (Number.isFinite(requestedLines) && requestedLines > 0) lineLimit = requestedLines

    const current = new AbortController()

    controller = current

    openSSE(logsStreamURL(params), {
      token: getToken(),
      lang: globalStore.language,
      signal: current.signal,
      onEvent: event => {
        if (controller !== current) return false

        const initial = applyEvent(event)

        // 一次性刷新收到尾部快照后主动结束连接
        if (oneShot && initial) return false
      },
    }).then(() => {
      if (controller !== current) return

      // 一次性刷新收到快照后正常结束，不算断线
      if (oneShot) return

      // 服务端主动结束流（正常不会发生），按断线处理
      showLost()
      scheduleRetry()
    }).catch(error => {
      if (current.signal.aborted || error?.name === 'AbortError') return
      if (controller !== current) return

      handleError(error)
    })
  }

  // 手动刷新：自动刷新开启时重连保持实时更新，关闭时用一次性连接取快照后断开
  const reload = () => connect({ once: !autoRefresh.value })

  const start = () => {
    if (!autoRefresh.value) return
    connect()
  }

  const reset = () => {
    content.value = ''
    firstPullFinished.value = false
  }

  watch(autoRefresh, enabled => {
    if (enabled) {
      lostNotified = false
      connect()
    } else {
      stop()
      if (!content.value) firstPullFinished.value = true
    }
  })

  onBeforeUnmount(() => {
    disposed = true
    stop()
  })

  return { content, firstPullFinished, start, stop, reload, reset }
}

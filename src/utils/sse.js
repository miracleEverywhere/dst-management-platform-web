import { showSnackbar } from '@/utils/snackbar'
import { getToken } from '@/utils/tools'
import useUserStore from '@store/user'

// 诊断接口使用 SSE 推送，必须携带 X-DMP-TOKEN，因此不能使用 EventSource，
// 这里基于 fetch + ReadableStream 手写一个最小可用的 SSE 客户端。

export class SSEError extends Error {
  constructor(message, code = 0, retryable = false) {
    super(message)
    this.name = 'SSEError'
    this.code = Number(code) || 0
    this.retryable = retryable
  }
}

// 诊断业务错误码（10001-10999）与 420 都不应该重试。
const shouldStopRetry = code => {
  const value = Number(code) || 0

  return value === 420 || (value >= 10000 && value < 11000)
}

const handleAuthExpired = async message => {
  const userStore = useUserStore()

  showSnackbar(message || '登录已过期', 'error')
  await userStore.clearStore()
  if (window.location.hash !== '#/login') {
    window.location.href = '/#/login'
  }
}

const readErrorPayload = async response => {
  const contentType = response.headers.get('content-type') || ''

  try {
    if (contentType.includes('application/json')) {
      return await response.json()
    }
    const text = await response.text()

    try {
      return JSON.parse(text)
    } catch {
      return { message: text }
    }
  } catch {
    return null
  }
}

const buildHTTPError = async response => {
  const payload = await readErrorPayload(response)
  const code = Number(payload?.code ?? payload?.status) || response.status
  const rawMessage = typeof payload?.message === 'string' ? payload.message.trim() : ''

  // 非 JSON 响应（例如网关返回 HTML 错误页）不直接展示整页内容。
  const message = rawMessage && rawMessage.length <= 300 ? rawMessage : `SSE HTTP ${response.status}`

  if (code === 420) {
    await handleAuthExpired(message)
  }

  return new SSEError(message, code, false)
}

const parseBlock = (block, fallbackID) => {
  let id = fallbackID
  let type = 'message'
  const dataLines = []

  for (const rawLine of block.split('\n')) {
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine

    if (!line || line.startsWith(':')) continue
    if (line.startsWith('id:')) {
      const value = Number(line.slice(3).trim())

      if (Number.isFinite(value)) id = value
      continue
    }
    if (line.startsWith('event:')) {
      type = line.slice(6).trim()
      continue
    }
    if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
  }

  if (!dataLines.length) return { id, type, data: null }

  const raw = dataLines.join('\n')

  try {
    return { id, type, data: JSON.parse(raw) }
  } catch {
    return { id, type, data: { raw } }
  }
}

const wait = (ms, signal) => new Promise(resolve => {
  if (signal?.aborted) {
    resolve()

    return
  }

  const cleanup = () => {
    clearTimeout(timer)
    signal?.removeEventListener('abort', cleanup)
    resolve()
  }

  const timer = setTimeout(cleanup, ms)

  signal?.addEventListener('abort', cleanup, { once: true })
})

// 连接一次 SSE，直到服务端关闭或 onEvent 返回 false（表示这是终止事件）。
export async function connectSSE(url, { token, lang, lastEventID = 0, signal, onEvent }) {
  const headers = {
    'Accept': 'text/event-stream',
    'X-DMP-TOKEN': token || getToken(),
  }

  if (lang) headers['X-I18n-Lang'] = lang
  if (lastEventID) headers['Last-Event-ID'] = String(lastEventID)

  const response = await fetch(url, {
    method: 'GET',
    headers,
    signal,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw await buildHTTPError(response)
  }

  const contentType = response.headers.get('content-type') || ''

  // 服务端在开始流之前会用普通 JSON 返回错误，按 JSON 处理。
  if (!contentType.includes('text/event-stream')) {
    throw await buildHTTPError(response)
  }
  if (!response.body) {
    throw new SSEError('SSE response body is not readable')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let eventID = Number(lastEventID) || 0

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break
      buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, '\n')

      let boundary = buffer.indexOf('\n\n')

      while (boundary !== -1) {
        const block = buffer.slice(0, boundary)

        buffer = buffer.slice(boundary + 2)

        const { id, type, data } = parseBlock(block, eventID)

        eventID = id
        if (data !== null) {
          try {
            const result = onEvent?.({ id: eventID, type, data })

            if (result === false) {
              await reader.cancel().catch(() => {})

              return eventID
            }
          } catch (error) {
            await reader.cancel().catch(() => {})
            throw error
          }
        }
        boundary = buffer.indexOf('\n\n')
      }
    }

    // 兼容服务端最后一块没有空行结束的情况。
    if (buffer.trim()) {
      const { id, type, data } = parseBlock(buffer, eventID)

      eventID = id
      if (data !== null) onEvent?.({ id: eventID, type, data })
    }

    return eventID
  } finally {
    reader.releaseLock?.()
  }
}

// 在 connectSSE 之上增加 Last-Event-ID 断线重连，最多重连 maxRetries 次。
// onEvent 返回 false 表示已经收到终止事件，不再重连。
export async function openSSE(url, {
  token,
  lang,
  lastEventID = 0,
  signal,
  onEvent,
  onRetry,
  maxRetries = 3,
  retryDelay = 2000,
}) {
  let eventID = Number(lastEventID) || 0
  let retries = 0
  let terminal = false

  const handleEvent = event => {
    const result = onEvent?.(event)

    if (result === false) terminal = true

    return result
  }

  while (!signal?.aborted) {
    try {
      eventID = await connectSSE(url, {
        token,
        lang,
        lastEventID: eventID,
        signal,
        onEvent: handleEvent,
      })

      if (terminal || signal?.aborted) return eventID

      // 服务端正常关闭但未收到终止事件，按断线处理。
      if (retries >= maxRetries) {
        throw new SSEError('SSE connection lost')
      }
      retries += 1
      onRetry?.(retries)
    } catch (error) {
      if (signal?.aborted || error?.name === 'AbortError') return eventID
      if (shouldStopRetry(error?.code) || retries >= maxRetries) throw error
      retries += 1
      onRetry?.(retries)
    }

    await wait(retryDelay * retries, signal)
  }

  return eventID
}

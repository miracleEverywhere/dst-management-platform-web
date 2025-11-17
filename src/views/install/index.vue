<template>
  <div class="web-terminal-container">
    <div class="status-bar">
      <span :class="['status-indicator', { connected: connected }]">
        {{ connected ? '已连接' : '未连接' }}
      </span>
      <button @click="reconnect" class="reconnect-btn">重新连接</button>

      <!-- 命令按钮区域 -->
      <div class="command-buttons">
        <button @click="sendCommand('ls -la')" class="cmd-btn">ls -la</button>
        <button @click="sendCommand('pwd')" class="cmd-btn">pwd</button>
        <button @click="sendCommand('df -h')" class="cmd-btn">df -h</button>
        <button @click="sendCommand('docker ps')" class="cmd-btn">docker ps</button>

        <!-- 自定义命令输入 -->
        <div class="custom-command">
          <input
              v-model="customCommand"
              @keyup.enter="executeCustomCommand"
              placeholder="输入自定义命令"
              class="command-input"
          >
          <button @click="executeCustomCommand" class="cmd-btn">执行</button>
        </div>
      </div>
    </div>
    <div ref="terminalContainer" class="terminal-wrapper">
      <div ref="terminalEl" class="terminal"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import {getToken} from "@/utils/tools.js";

// 响应式数据
const terminalContainer = ref(null)
const terminalEl = ref(null)
const term = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const customCommand = ref('')

// 初始化终端
const initTerminal = async () => {
  term.value = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: '"Cascadia Code", "Courier New", monospace',
    theme: {
      background: '#1e1e1e',
      foreground: '#ffffff'
    },
    cols: 120,
    rows: 30,
    convertEol: true,
    disableStdin: false,
    cursorStyle: 'block',
    scrollback: 1000,
    tabStopWidth: 8,
    bellStyle: 'none'
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
  if (fitAddon.value) {
    fitAddon.value.fit()
    sendResizeMessage()
  }
}

// 发送终端大小信息
const sendResizeMessage = () => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return

  const dimensions = {
    cols: term.value.cols,
    rows: term.value.rows,
    type: 'resize'
  }

  ws.value.send(JSON.stringify(dimensions))
}

// 发送命令到终端
const sendCommand = (command) => {
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

  ws.value.onmessage = (event) => {
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

  ws.value.onclose = (event) => {
    connected.value = false
    if (!event.wasClean) {
      term.value.write('\r\n\x1b[31m连接异常关闭，5秒后尝试重新连接...\x1b[0m\r\n')
      setTimeout(reconnect, 5000)
    } else {
      term.value.write('\r\n\x1b[33m连接已关闭\x1b[0m\r\n')
    }
  }

  ws.value.onerror = (error) => {
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
  await initTerminal()
  connectWebSocket()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.web-terminal-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.status-bar {
  padding: 8px 16px;
  background: #2d2d2d;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #f56565;
}

.status-indicator.connected {
  background: #48bb78;
}

.reconnect-btn {
  padding: 4px 8px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.reconnect-btn:hover {
  background: #3182ce;
}

.command-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cmd-btn {
  padding: 4px 8px;
  background: #38a169;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.cmd-btn:hover {
  background: #2f855a;
}

.custom-command {
  display: flex;
  align-items: center;
  gap: 4px;
}

.command-input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  width: 150px;
}

.command-input:focus {
  outline: none;
  border-color: #4299e1;
}

.terminal-wrapper {
  flex: 1;
  padding: 8px;
}

.terminal {
  width: 100%;
  height: 100%;
}

:deep(.xterm) * {
  letter-spacing: normal !important;
}
</style>
<template>
  <div class="webssh-container">
    <div ref="terminal" class="terminal"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import {getToken} from "@/utils/storage.ts";
import {AesEncrypt} from "@/utils/tools.js";

const terminal = ref(null)
const term = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const initialCols = ref(120)
const initialRows = ref(30)

const goBack = () => {
  console.log('go back')
}

const initTerminal = () => {
  term.value = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Consolas, monospace',
    cols: initialCols.value,
    rows: initialRows.value,
    theme: {
      background: '#1e1e1e',
      foreground: '#ffffff'
    }
  })

  fitAddon.value = new FitAddon()
  term.value.loadAddon(fitAddon.value)
  term.value.open(terminal.value)

  // 初始适配
  fitAddon.value.fit()

  // 发送初始尺寸
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({
      type: 'resize',
      cols: term.value.cols,
      rows: term.value.rows
    }))
  }
}

const connect = () => {
  const password = AesEncrypt("dMP_aES_2pvvD_gO", "Edison10.")
  const wsUrl = `ws://8.137.107.46:80/v1/tools/webssh?ip=${encodeURIComponent('162.14.116.81')}&port=22&username=root&password=${encodeURIComponent(password)}`

  ws.value = new WebSocket(wsUrl)

  ws.value.onopen = () => {
    connected.value = true
    term.value.focus()
    // 连接成功后立即发送终端尺寸
    ws.value.send(JSON.stringify({
      type: 'resize',
      cols: term.value.cols,
      rows: term.value.rows
    }))
  }

  ws.value.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (msg.type === 'output') {
      term.value.write(msg.data)
    }
  }

  ws.value.onclose = () => {
    connected.value = false
    term.value.write('\r\n连接已关闭\r\n')
  }

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    term.value.write('\r\n连接发生错误\r\n')
  }

  term.value.onData(data => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({type: 'input', data: data}))
    }
  })
}

const handleResize = () => {
  if (fitAddon.value) {
    const oldCols = term.value.cols
    const oldRows = term.value.rows

    fitAddon.value.fit()

    // 只有在尺寸变化时才发送resize消息
    if (ws.value && ws.value.readyState === WebSocket.OPEN &&
      (oldCols !== term.value.cols || oldRows !== term.value.rows)) {
      ws.value.send(JSON.stringify({
        type: 'resize',
        cols: term.value.cols,
        rows: term.value.rows
      }))
    }
  }
}

onMounted(() => {
  initTerminal()
  window.addEventListener('resize', handleResize)
  connect()
})

onBeforeUnmount(() => {
  if (ws.value) {
    ws.value.close()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.webssh-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #1e1e1e;
}

.terminal {
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  text-align: left;
}

.xterm {
  padding: 10px;
}

.xterm-screen {
  width: 100% !important;
}

.xterm-viewport {
  width: 100% !important;
  overflow-y: auto !important;
}
</style>
<template>
  <div class="page-div">
    <div v-if="!ssh">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ t('tools.webssh.title') }}</span>
          </div>
        </template>
        <el-alert :closable="false" :effect="isDark?'light':'dark'" type="warning">
          {{t('tools.webssh.tip')}}
        </el-alert>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" @keyup.enter="startWebSSh"
                 label-width="120" style="margin-top: 20px">
          <el-form-item label="IP" prop="ip">
            <el-input v-model="loginForm.ip"></el-input>
          </el-form-item>
          <el-form-item :label="t('tools.webssh.port')" prop="port">
            <el-input v-model="loginForm.port"></el-input>
          </el-form-item>
          <el-form-item :label="t('tools.webssh.username')" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item :label="t('tools.webssh.password')" prop="password">
            <el-input v-model="loginForm.password" autocomplete="new-password" show-password></el-input>
          </el-form-item>
          <div style="display: flex; justify-content: flex-end; padding-top: 10px">
            <el-button @click="startWebSSh">{{t('tools.webssh.connect')}}</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
    <div v-if="ssh" class="webssh-container">
      <div ref="terminal" class="terminal"></div>
    </div>
  </div>
</template>

<script setup>
import {ref, onBeforeUnmount, nextTick, computed} from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import {getToken} from "@/utils/storage.ts";
import {EncryptAES} from "@/utils/tools.js";
import useGlobalStore from "@/stores/modules/global.ts";
import {useI18n} from "vue-i18n";


const {t} = useI18n()
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const terminal = ref(null)
const term = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const initialCols = ref(120)
const initialRows = ref(30)

const initTerminal = () => {
  term.value = new Terminal({
    cursorBlink: true,
    fontSize: 18,
    // fontFamily: 'Consolas, monospace',
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
  const password = EncryptAES(loginForm.value.password)
  const token = getToken()
  const wsUrl = `ws://${window.location.host}/v1/tools/webssh?ip=${encodeURIComponent(loginForm.value.ip)}&port=${loginForm.value.port}&username=${encodeURIComponent(loginForm.value.username)}&password=${encodeURIComponent(password)}&token=${encodeURIComponent(token)}`

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

const ssh = ref(false)
const loginFormRef = ref()
const loginForm = ref({
  ip: window.location.hostname,
  port: "22",
  username: "",
  password: "",
})
const loginFormRules = {
  ip: [
    {required: true, message: t('tools.webssh.rules.ip')},
  ],
  port: [
    {required: true, message: t('tools.webssh.rules.port')},
  ],
  username: [
    {required: true, message: t('tools.webssh.rules.username')},
  ],
  password: [
    {required: true, message: t('tools.webssh.rules.password')},
  ],
}

const startWebSSh = () => {
  loginFormRef.value.validate(async valid => {
    if (valid) {
      ssh.value = true
      await nextTick()
      initTerminal()
      window.addEventListener('resize', handleResize)
      connect()
    }
  })
}

onBeforeUnmount(() => {
  if (ws.value) {
    ws.value.close()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.webssh-container {
  width: 100%;
  height: 100%;
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

:deep(.xterm) * {
  letter-spacing: normal !important;
}


</style>
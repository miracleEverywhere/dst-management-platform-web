import { reactive } from 'vue'
import platformApi from '@/api/platform.js'

// 平台版本信息与自更新弹窗的共享状态。
// 版本信息由后端 GET /platform/version 提供（后端缓存 10 分钟，避免触发 GitHub 未认证限流），
// 前端不再直连 GitHub；顶部版本 chip、平台总览卡片与自更新弹窗共用这一份数据。

// 查询 GitHub 失败时后端返回的错误码，此时响应里仍带本地信息（current/os/arch/reason）
const CODE_UPDATE_CHECK_FAIL = 5074

export const dmpVersion = reactive({
  // 当前运行版本，一律以接口返回的 current 为准，不再使用 @/config 里构建期写死的 Version
  current: '',
  latest: '',
  notes: '',
  checkedAt: 0,
  updatable: false,
  canSelfUpdate: false,
  reason: '',
  asset: '',
  os: '',
  arch: '',
  inContainer: false,
  checkFailed: false,
  loading: false,
  loaded: false,
})

// 弹窗开关放在模块级状态里：顶部版本 chip 与平台总览卡片都要能打开同一个弹窗，
// 而弹窗本体只挂在 HeaderMain 中（lite 不渲染 HeaderMain，也就不含自更新入口）。
export const selfUpdateDialog = reactive({
  open: false,
})

export const openSelfUpdateDialog = () => {
  selfUpdateDialog.open = true
}

const applyVersionInfo = data => {
  if (!data) return

  dmpVersion.current = data.current || dmpVersion.current
  dmpVersion.latest = data.latest || ''
  dmpVersion.notes = data.notes || ''
  dmpVersion.checkedAt = Number(data.checkedAt) || 0
  dmpVersion.updatable = data.updatable === true
  dmpVersion.canSelfUpdate = data.canSelfUpdate === true
  dmpVersion.reason = data.reason || ''
  dmpVersion.asset = data.asset || ''
  dmpVersion.os = data.os || ''
  dmpVersion.arch = data.arch || ''
  dmpVersion.inContainer = data.inContainer === true
  dmpVersion.checkFailed = data.checkFailed === true
}

// 重启轮询期间服务可能已经停机，连接会被拒绝或挂住，这里用更短的超时避免轮询卡死
const QUIET_REQUEST_TIMEOUT = 5000

// 查询平台版本。
// refresh=true 让后端忽略缓存重新查询 GitHub，只在用户手动点「重新检查」时使用。
// quiet=true 用于更新重启期间的轮询：不改动 loading 标记，连接失败也不标记检查失败。
export async function fetchDmpVersion({ refresh = false, quiet = false } = {}) {
  if (dmpVersion.loading) return dmpVersion

  if (!quiet) dmpVersion.loading = true

  try {
    const config = quiet ? { silent: true, timeout: QUIET_REQUEST_TIMEOUT } : { silent: true }
    const response = await platformApi.version.get(refresh ? { refresh: 1 } : undefined, config)

    applyVersionInfo(response?.data)

    return dmpVersion
  } catch (error) {
    if (Number(error?.code) === CODE_UPDATE_CHECK_FAIL && error?.data?.data) {
      applyVersionInfo(error.data.data)

      return dmpVersion
    }

    // 网络中断、权限不足等：保留上一次的结果，只标记检查失败
    if (!quiet) dmpVersion.checkFailed = true

    return null
  } finally {
    if (!quiet) {
      dmpVersion.loading = false
      dmpVersion.loaded = true
    }
  }
}

// Release 说明是 Markdown 原文，tooltip 里去控制字符并按行截断（弹窗里按原文展示）
export const releaseNoteLines = notes => {
  const lines = (notes || '')
    .replace(/\r/g, '')
    .replace(/[#`*]+/g, '')
    .split('\n')
    .map(line => line.trimEnd())

  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()

  return lines
}

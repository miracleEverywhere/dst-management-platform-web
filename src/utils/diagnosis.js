import { PiniaPrefix } from '@/config'

// 工具名来自后端 tool 字段，映射到前端文案；未识别的工具回退为通用文案。
const TOOL_LABEL_KEYS = new Map([
  ['get_system_metrics', 'diagnosis.tool.systemMetrics'],
  ['get_room_summary', 'diagnosis.tool.roomSummary'],
  ['get_world_status', 'diagnosis.tool.worldStatus'],
  ['get_logs', 'diagnosis.tool.logs'],
  ['get_mods', 'diagnosis.tool.mods'],
  ['get_game_version', 'diagnosis.tool.gameVersion'],
  ['get_scheduler', 'diagnosis.tool.scheduler'],
  ['get_backups', 'diagnosis.tool.backups'],
  ['search_kb', 'diagnosis.tool.searchKB'],
  ['propose_action', 'diagnosis.tool.proposeAction'],
  ['finish_diagnosis', 'diagnosis.tool.finish'],
])

const ACTION_TITLE_KEYS = new Map([
  ['start_world', 'diagnosis.action.startWorld'],
  ['restart_world', 'diagnosis.action.restartWorld'],
  ['restart_room', 'diagnosis.action.restartRoom'],
  ['clean_logs', 'diagnosis.action.cleanLogs'],
  ['use_default_token', 'diagnosis.action.useDefaultToken'],
  ['disable_mod', 'diagnosis.action.disableMod'],
  ['enable_mod', 'diagnosis.action.enableMod'],
  ['delete_snapshot', 'diagnosis.action.deleteSnapshot'],
  ['restore_backup', 'diagnosis.action.restoreBackup'],
  ['update_game', 'diagnosis.action.updateGame'],
])

const SEVERITY_COLORS = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'deep-orange-darken-4',
}

const RISK_COLORS = {
  low: 'success',
  medium: 'warning',
  high: 'error',
}

const STATUS_COLORS = {
  proposed: 'default',
  running: 'info',
  succeeded: 'success',
  failed: 'error',
  skipped: 'default',
  canceled: 'default',
  partial: 'warning',
  interrupted: 'warning',
}

const APPLY_STATUS_TEXT_KEYS = {
  running: 'diagnosis.apply.status.running',
  succeeded: 'diagnosis.apply.status.succeeded',
  failed: 'diagnosis.apply.status.failed',
  partial: 'diagnosis.apply.status.partial',
}

// 高风险且不可逆、执行前会自动备份的动作。
const BACKUP_ACTION_IDS = new Set(['delete_snapshot', 'restore_backup'])

export const diagnosisToolLabel = (t, tool) => {
  const key = TOOL_LABEL_KEYS.get(tool)

  return key ? t(key) : t('diagnosis.tool.unknown', { tool: tool || '-' })
}

export const actionTitle = (t, action) => {
  if (!action) return ''

  const key = ACTION_TITLE_KEYS.get(action.actionID)

  if (key) return t(key)

  return action.titleKey || action.actionID
}

export const actionTitleByID = (t, actionID) => actionTitle(t, { actionID })

export const severityColor = severity => SEVERITY_COLORS[severity] || 'default'

export const riskColor = risk => RISK_COLORS[risk] || 'default'

export const statusColor = status => STATUS_COLORS[status] || 'default'

export const applyStatusText = (t, status) => {
  const key = APPLY_STATUS_TEXT_KEYS[status]

  return key ? t(key) : status || ''
}

export const isBackupAction = action => !!action && BACKUP_ACTION_IDS.has(action.actionID)

// 把 apply.results 合并进 report.actions（DB 回退的历史记录里两者是分开存的）。
export const mergeApplyResults = snapshot => {
  if (!snapshot || !snapshot.report) return snapshot

  const results = snapshot.apply?.results || []

  if (!results.length) return snapshot

  const resultMap = new Map(results.map(result => [result.actionID, result]))

  snapshot.report.actions = (snapshot.report.actions || []).map(action => {
    const result = resultMap.get(action.actionID)

    if (!result) return action

    return {
      ...action,
      status: result.status || action.status,
      applyResult: result,
    }
  })

  return snapshot
}

// 报告正文在 report_end 之后才有，这里把 report_meta 与正文、用量拆开。
export const splitReport = report => {
  const { markdown = '', usage = null, ...meta } = report || {}

  return {
    meta: {
      ...meta,
      findings: meta.findings || [],
      actions: meta.actions || [],
      references: meta.references || [],
    },
    markdown: markdown || '',
    usage: usage || null,
  }
}

// typed 确认的期望文本：update_game 固定为 UPDATE，其余为房间名。
// 平台级动作的 confirmationHint 里带有房间名，作为兜底提取。
export const typedConfirmationText = (action, roomName) => {
  if (!action || action.confirmationLevel !== 'typed') return ''
  if (action.actionID === 'update_game') return 'UPDATE'
  if (roomName) return roomName

  const match = /房间名(.+?)以确认/.exec(action.confirmationHint || '')

  return match ? match[1].trim() : ''
}

export const formatDuration = ms => {
  const value = Number(ms) || 0

  if (value < 1000) return `${Math.max(0, Math.round(value))}ms`

  const totalSeconds = Math.floor(value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes <= 0) return `${seconds}s`

  return `${minutes}m ${seconds}s`
}

export const formatDateTime = (value, locale) => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 诊断会话 ID 存在 sessionStorage：关闭弹窗不会取消诊断，重新打开可继续查看。
// 使用 Pinia 前缀保持与项目其他本地存储一致，并按范围区分，避免房间/平台串会话。
export const diagnosisStorageKey = (scope, roomID) => {
  const suffix = scope === 'platform' ? 'platform' : `room-${roomID || 0}`

  return `${PiniaPrefix}diagnosis-${suffix}`
}

export const parseStoredDiagnosis = (scope, roomID) => {
  try {
    const raw = window.sessionStorage.getItem(diagnosisStorageKey(scope, roomID))

    if (!raw) return null

    const parsed = JSON.parse(raw)

    if (!parsed?.diagnosisID) return null

    return parsed
  } catch {
    return null
  }
}

export const storeDiagnosis = (scope, roomID, diagnosisID) => {
  try {
    window.sessionStorage.setItem(diagnosisStorageKey(scope, roomID), JSON.stringify({
      diagnosisID,
      savedAt: Date.now(),
    }))
  } catch {
    // sessionStorage 不可用时忽略，仅影响刷新后的恢复能力。
  }
}

export const clearStoredDiagnosis = (scope, roomID) => {
  try {
    window.sessionStorage.removeItem(diagnosisStorageKey(scope, roomID))
  } catch {
    // 同上。
  }
}

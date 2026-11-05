// 云同步结果文案：只列出有变化的项，避免每次登录都显示一串 0
export const cloudSyncSummary = (t, data) => {
  if (!data) return ''

  const fields = [
    ['uploaded', 'cloud.sync.uploaded'],
    ['updated', 'cloud.sync.updated'],
    ['deleted', 'cloud.sync.deleted'],
    ['downloaded', 'cloud.sync.downloaded'],
    ['skipped', 'cloud.sync.skipped'],
  ]

  const parts = []

  for (const [field, key] of fields) {
    if (data[field]) {
      parts.push(`${t(key)} ${data[field]}`)
    }
  }

  if (parts.length === 0) {
    return t('cloud.sync.noChange')
  }

  return t('cloud.sync.result', { stats: parts.join(t('cloud.sync.separator')) })
}

// Axios 拦截器可能以字符串或 Error 形式 reject，统一转成可展示的文案
export const cloudErrorText = (err, fallback) => {
  if (typeof err === 'string' && err) return err
  if (err?.message) return err.message

  return fallback
}

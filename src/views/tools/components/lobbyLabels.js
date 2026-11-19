// 游戏大厅展示用的文案映射：优先取 i18n，未配置时回退到原始值，
// 避免 Klei 新增模式/区域时页面出现空白。

export const lobbyRegionLabel = (t, region) => {
  if (!region) return '-'

  const key = `tools.lobby.regionName.${region}`
  const label = t(key)

  return label === key ? region : label
}

export const lobbyIntentLabel = (t, intent) => {
  if (!intent) return '-'

  const key = `tools.lobby.intent.${intent}`
  const label = t(key)

  return label === key ? intent : label
}

const knownSeasons = ['spring', 'summer', 'autumn', 'winter']

export const lobbySeasonLabel = (t, season) => {
  if (!knownSeasons.includes(season)) return t('tools.lobby.season.unknown')

  return t(`tools.lobby.season.${season}`)
}

export const lobbySeasonIcon = season => {
  const icons = {
    autumn: 'ri-leaf-line',
    winter: 'ri-snowflake-line',
    spring: 'ri-seedling-line',
    summer: 'ri-sun-line',
  }

  return icons[season] || 'ri-calendar-line'
}

export const lobbyIntentColor = intent => {
  const colors = {
    survival: 'warning',
    endless: 'success',
    relaxed: 'info',
    wilderness: 'error',
    oceanfishing: 'primary',
  }

  return colors[intent] || 'secondary'
}

export const lobbySeasonColor = season => {
  const colors = {
    autumn: 'warning',
    winter: 'info',
    spring: 'success',
    summer: 'error',
  }

  return colors[season] || 'secondary'
}

// 大厅里的颜色是 6 位十六进制（可能带 #），非法值回退成灰色
export const normalizeLobbyColour = colour => {
  if (!colour) return 'grey'

  const value = colour.startsWith('#') ? colour.slice(1) : colour

  return /^[0-9a-f]{6}$/i.test(value) ? `#${value}` : 'grey'
}

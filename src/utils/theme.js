// 主题偏好：system 跟随系统，light / dark 为用户手动选择的固定主题
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { PiniaPrefix } from '@/config'
import useGlobalStore from '@store/global'

export const THEME_SYSTEM = 'system'
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'

// 系统当前的明暗偏好，处于 system 模式时以它为准
const darkQuery = typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)')

export const systemTheme = ref(darkQuery?.matches ? THEME_DARK : THEME_LIGHT)

if (darkQuery) {
  const onSystemThemeChange = event => {
    systemTheme.value = event.matches ? THEME_DARK : THEME_LIGHT
  }

  if (darkQuery.addEventListener) {
    darkQuery.addEventListener('change', onSystemThemeChange)
  } else {
    // 旧版 Safari 只支持 addListener
    darkQuery.addListener(onSystemThemeChange)
  }
}

// 把任意存储值归一化为三种合法偏好之一，非法值（含旧版本的空字符串）按跟随系统处理
export const normalizeThemeMode = mode => {
  if (mode === THEME_LIGHT || mode === THEME_DARK) {
    return mode
  }

  return THEME_SYSTEM
}

// 把偏好解析为实际生效的明暗主题
export const resolveTheme = mode => {
  const normalized = normalizeThemeMode(mode)

  return normalized === THEME_SYSTEM ? systemTheme.value : normalized
}

// 读取持久化的主题偏好，用于在 Vuetify 创建之前确定初始主题，避免首屏闪色
export const getStoredThemeMode = () => {
  try {
    const raw = localStorage.getItem(PiniaPrefix + 'global')
    const stored = raw ? JSON.parse(raw) : null

    return normalizeThemeMode(stored?.theme)
  } catch {
    return THEME_SYSTEM
  }
}

export const getInitialThemeName = () => resolveTheme(getStoredThemeMode())

// 在组件中读写主题偏好：mode 是偏好，resolvedTheme 是实际生效的明暗主题
export const useThemeMode = () => {
  const globalStore = useGlobalStore()
  const theme = useTheme()

  const mode = computed(() => normalizeThemeMode(globalStore.theme))
  const resolvedTheme = computed(() => resolveTheme(mode.value))

  // 同步 Vuetify 主题与文档根节点上的明暗标记
  const applyResolvedTheme = value => {
    if (theme.global.name.value !== value) {
      theme.change(value)
    }

    const root = document.documentElement

    root.classList.toggle(THEME_DARK, value === THEME_DARK)
    root.classList.toggle(THEME_LIGHT, value === THEME_LIGHT)
  }

  const setMode = value => {
    globalStore.theme = normalizeThemeMode(value)
  }

  return { mode, resolvedTheme, setMode, applyResolvedTheme }
}

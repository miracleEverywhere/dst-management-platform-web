<template>
  <v-btn
    v-tooltip="t('global.' + mode)"
    :icon="currentTheme.icon"
    color="default"
    variant="text"
    @click="cycleTheme"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { resolveTheme, useThemeMode } from '@/utils/theme'

const props = defineProps({
  themes: {
    type: Array,
    required: true,
  },
})

const { t } = useI18n()

const { mode, resolvedTheme, setMode, applyResolvedTheme } = useThemeMode()

const currentTheme = computed(() => props.themes.find(theme => theme.name === mode.value) ?? props.themes[0])

// 按 themes 的顺序循环：跟随系统 → 明亮 → 黑暗 → 跟随系统，点击进入下一项
const nextTheme = computed(() => {
  const index = props.themes.findIndex(theme => theme.name === mode.value)

  return props.themes[(index + 1) % props.themes.length] ?? props.themes[0]
})

// 先写入偏好，再等一次视图更新后同步主题，保证视图过渡捕获到切换后的画面
const applyNextTheme = async name => {
  setMode(name)

  await nextTick()

  applyResolvedTheme(resolvedTheme.value)
}

const cycleTheme = async () => {
  const name = nextTheme.value.name

  // 明暗没有实际变化（如从跟随系统切到与系统一致的固定主题）时不需要过渡动画
  // 浏览器不支持视图过渡时同样直接切换
  if (resolveTheme(name) === resolvedTheme.value || !document.startViewTransition) {
    await applyNextTheme(name)

    return
  }

  const transition = document.startViewTransition(() => applyNextTheme(name))

  // 过渡被浏览器跳过（例如连续快速切换）时 ready 会 reject，此时主题已经应用，不用继续播动画
  try {
    await transition.ready
  } catch {
    return
  }

  // 执行淡入淡出动画
  document.documentElement.animate(
    {
      opacity: [0, 1],
    },
    {
      duration: 300,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    },
  )

  // 同时为旧视图添加淡出动画
  document.documentElement.animate(
    {
      opacity: [1, 0],
    },
    {
      duration: 300,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-old(root)',
    },
  )
}
</script>

<style>
/* 确保视图过渡容器覆盖整个屏幕 */
::view-transition-old(root),
::view-transition-new(root) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
}
</style>

<template>
  <v-menu
    v-model="menuOpen"
    location="bottom end"
    :offset="8"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-tooltip="t('global.' + mode)"
        v-bind="{ ...$attrs, ...activatorProps }"
        :icon="currentTheme.icon"
        color="default"
        variant="text"
      />
    </template>

    <v-list
      density="compact"
      class="pa-1"
    >
      <v-list-item
        v-for="theme in props.themes"
        :key="theme.name"
        :value="theme.name"
        :active="theme.name === mode"
        color="primary"
        rounded="sm"
        @click="changeTheme(theme.name)"
      >
        <template #prepend>
          <v-icon
            :icon="theme.icon"
            size="20"
          />
        </template>

        <v-list-item-title>{{ t('global.' + theme.name) }}</v-list-item-title>

        <template #append>
          <v-icon
            v-if="theme.name === mode"
            icon="ri-check-line"
            size="18"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
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

// v-menu 渲染的是 fragment（激活器 + Teleport），无法自动继承 class 等属性，改为手动透传给激活按钮
defineOptions({ inheritAttrs: false })

const { t } = useI18n()

const { mode, resolvedTheme, setMode, applyResolvedTheme } = useThemeMode()

const menuOpen = ref(false)

const currentTheme = computed(() => props.themes.find(theme => theme.name === mode.value) ?? props.themes[0])

// 先写入偏好，再等一次视图更新后同步主题，保证视图过渡捕获到切换后的画面
const applyNextTheme = async name => {
  setMode(name)

  await nextTick()

  applyResolvedTheme(resolvedTheme.value)
}

const changeTheme = async name => {
  menuOpen.value = false

  // 偏好未变化，或明暗没有实际变化（如切回跟随系统但系统与当前一致）时不需要过渡动画
  if (name === mode.value || resolveTheme(name) === resolvedTheme.value) {
    setMode(name)

    return
  }

  // 浏览器不支持视图过渡时直接切换
  if (!document.startViewTransition) {
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

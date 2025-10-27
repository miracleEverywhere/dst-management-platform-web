<template>
  <IconBtn @click="changeTheme">
    <VIcon :icon="props.themes[currentThemeIndex].icon" />
    <VTooltip
        activator="parent"
        open-delay="1000"
        scroll-strategy="close"
    >
      <span class="text-capitalize">{{ zhCurrentThemeNameMap[currentThemeName] }}</span>
    </VTooltip>
  </IconBtn>
</template>

<script setup>
import { useTheme } from 'vuetify'
import useGlobalStore from "@/plugins/store/global";

const globalStore = useGlobalStore()

const props = defineProps({
  themes: {
    type: Array,
    required: true,
  },
})

const {
  name: themeName,
  global: globalTheme,
} = useTheme()

const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(props.themes.map(t => t.name), { initialValue: globalStore.theme })

const zhCurrentThemeNameMap = {
  light: '明亮',
  dark: '黑暗'
}

onMounted(() => {
  globalTheme.name.value = globalStore.theme
  document.documentElement.className = globalStore.theme
})

const changeTheme = async (event) => {
  // 定义主题切换逻辑
  const updateTheme = () => {
    const nextTheme = getNextThemeName();
    globalTheme.name.value = nextTheme;
    globalStore.theme = nextTheme;
    document.documentElement.className = nextTheme;
  };

  // 启动视图过渡
  if (!document.startViewTransition) {
    updateTheme();
    return;
  }

  const transition = document.startViewTransition(updateTheme);
  await transition.ready;

  // 执行淡入淡出动画
  document.documentElement.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 300,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)"
      }
  );

  // 同时为旧视图添加淡出动画
  document.documentElement.animate(
      {
        opacity: [1, 0],
      },
      {
        duration: 300,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-old(root)"
      }
  );
};

watch(() => globalTheme.name.value, val => {
  currentThemeName.value = val
})
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
<template>
  <div class="hover:bg-[rgba(0,0,0,0.06)] w-32px h-100% flex flex-justify-center flex-items-center" @click="handleSwitchDark">
    <el-icon class="koi-icon" :size="size" v-if="!globalStore.isDark">
      <Sunny />
    </el-icon>
    <el-icon class="koi-icon" :size="size" v-if="globalStore.isDark">
      <Moon />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "@/utils/theme.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();
const { switchDark } = useTheme();

defineProps({
  size: {
    type: Number,
    default: 22
  }
});

// 暗黑主题和明亮主题切换
const handleSwitchDark = async (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  // 画圆
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-ignore
  if (document.startViewTransition == undefined) {
    /** 明亮和暗黑模式核心逻辑 */
    // 定义图标切换变量(true-月亮，false-太阳)
    globalStore.setGlobalState("isDark", !globalStore.isDark);
    switchDark();
    /** 明亮和暗黑模式核心逻辑 */
  } else {
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      /** 明亮和暗黑模式核心逻辑 */
      // 定义图标切换变量(true-月亮，false-太阳)
      globalStore.setGlobalState("isDark", !globalStore.isDark);
      switchDark();
      /** 明亮和暗黑模式核心逻辑 */
    });
    await transition.ready;
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: globalStore.isDark ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 300,
        easing: "ease-in",
        pseudoElement: globalStore.isDark ? "::view-transition-new(root)" : "::view-transition-old(root)"
      }
    );
  }
};
// 暗黑主题和明亮主题切换
// const handleDark = () => {
//   // 定义图标切换变量(true-月亮，false-太阳)
//   globalStore.setGlobalState("isDark", !globalStore.isDark);
//   // 获取HTML根节点
//   let html = document.documentElement;
//   // 判断HTML标签是否有类名dark
//   if (!globalStore.isDark) {
//     // 太阳
//     html.className = "";
//   } else {
//     // 月亮
//     html.className = "dark";
//   }
// };
</script>

<style lang="scss" scoped></style>
<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}
::view-transition-old(root) {
  z-index: 9999;
}
::view-transition-new(root) {
  z-index: 1;
}
.dark::view-transition-old(root) {
  z-index: 1;
}
.dark::view-transition-new(root) {
  z-index: 9999;
}
</style>

<template>
  <!-- 刷新 -->
  <div
    class="hover:bg-[rgba(0,0,0,0.06)] w-32px h-100% flex flex-justify-center flex-items-center"
    @click="handleRefresh"
  >
    <el-tooltip :content="$t('header.refreshCache')">
      <el-icon class="koi-icon" :size="20">
        <RefreshRight />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { koiMsgSuccess } from "@/utils/koi.ts";
import { LOGIN_URL } from "@/config";
import { koiSessionStorage, koiLocalStorage } from "@/utils/storage.ts";

// 刷新路由
const handleRefresh = () => {
  koiSessionStorage.clear();
  koiLocalStorage.clear();
  koiMsgSuccess("刷新本地缓存成功");
  // 必须使用这个把页面缓存刷掉
  window.location.replace(LOGIN_URL);
};
</script>

<style lang="scss" scoped></style>

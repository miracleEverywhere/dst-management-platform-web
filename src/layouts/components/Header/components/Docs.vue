<template>
  <div id="tourDocs" class="search-menu hover:bg-[rgba(0,0,0,0.06)] w-32px h-100% flex flex-justify-center" @click="handleGithub">
    <el-icon :size="20" class="koi-icon">
      <ColdDrink />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
const handleGithub = () => {
  window.open('https://miraclesses.top', '_blank')
}
</script>

<style scoped>
.search-menu {
  display: flex;
  align-items: center;

  :deep(.el-dialog) {
    border-radius: 4px;
  }
}
</style>
<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <log type="runtime"/>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import log from "./components/log.vue"
</script>

<style scoped>
</style>

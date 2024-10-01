<template>
  <el-row :gutter="10" style="margin-top: 5px">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
      <el-card shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'">
        <el-result
          icon="success"
          title="Success Tip"
          sub-title="Please follow the instructions"
          style="margin-top: 20%"
        >
        </el-result>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
      <el-card shadow="never">
        <div style="display: flex; justify-content: flex-end;">
          <el-button type="primary">重启世界</el-button>
          <el-button type="warning">生成新世界</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {useScreenStore} from "@/hooks/screen/index.ts";

const { isMobile } = useScreenStore();
</script>

<style scoped>
</style>
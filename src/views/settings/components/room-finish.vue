<template>
  <el-row :gutter="10" style="margin-top: 20px">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 10px">
      <el-card :style="isMobile?'min-height: 400px':'min-height: 800px'">
        <el-result
          icon="success"
          title="Success Tip"
          sub-title="Please follow the instructions"
          style="margin-top: 150px"
        >
        </el-result>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 2px">
      <el-card>
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
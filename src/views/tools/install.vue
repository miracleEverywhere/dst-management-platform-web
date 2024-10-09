<template>
  <div class="page-div">
    <el-row :gutter="20">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 500px'" >
          <template #header>
            <span class="card-header">系统信息</span>
          </template>
          <el-descriptions border :column="1">
            <el-descriptions-item label="架构">{{osInfo.Architecture}}</el-descriptions-item>
            <el-descriptions-item label="系统类型">{{osInfo.OS}}</el-descriptions-item>
            <el-descriptions-item label="系统名">{{osInfo.Platform}}</el-descriptions-item>
            <el-descriptions-item label="系统版本">{{osInfo.PlatformVersion}}</el-descriptions-item>
            <el-descriptions-item label="CPU">{{osInfo.CPUModel}}</el-descriptions-item>
            <el-descriptions-item label="核心数">{{osInfo.CPUCores}}</el-descriptions-item>
            <el-descriptions-item label="内存">{{(osInfo.MemorySize / (1024 ** 3)).toFixed(2)}} GB</el-descriptions-item>
            <el-descriptions-item label="运行时间">{{osInfo.Uptime}}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" :style="isMobile?'margin-top: 20px':'margin-top: 0px'">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 500px'" >
          <template #header>
            <span class="card-header">开始安装</span>
          </template>
          <el-result
            icon="success"
            title="Success Tip"
            sub-title="Please follow the instructions"
          >
          </el-result>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 20px">
        <el-card shadow="never" style="min-height: 250px" >
          <template #header>
            <span class="card-header">安装进度</span>
          </template>
          <el-progress :percentage="30" :stroke-width="15" striped striped-flow/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {useScreenStore} from "@/hooks/screen/index.ts";
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {seconds2Time} from "@/utils/tools.js";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";

const { t } = useI18n()
const globalStore = useGlobalStore()
const language = computed(() => globalStore.language)
const { isMobile } = useScreenStore();

const installing = ref(false)

const osInfo = ref({})

const getOSInfo = () => {
  toolsApi.osInfo.get().then(response => {
    osInfo.value = response.data
    osInfo.value.Uptime = seconds2Time(response.data.Uptime, language.value)
  })
}

onMounted(() => {
  getOSInfo()
})
</script>

<style scoped>
</style>
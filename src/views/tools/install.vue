<template>
  <div class="page-div">
    <el-row :gutter="20">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 500px'" >
          <template #header>
            <span class="card-header">{{t('tools.install.systemInfo')}}</span>
          </template>
          <el-descriptions border :column="1">
            <el-descriptions-item :label="$t('tools.install.architecture')">{{osInfo.Architecture}}</el-descriptions-item>
            <el-descriptions-item :label="$t('tools.install.osType')">{{osInfo.OS}}</el-descriptions-item>
            <el-descriptions-item :label="$t('tools.install.osName')">{{osInfo.Platform}}</el-descriptions-item>
            <el-descriptions-item :label="$t('tools.install.osVersion')">{{osInfo.PlatformVersion}}</el-descriptions-item>
            <el-descriptions-item label="CPU">{{osInfo.CPUModel}}</el-descriptions-item>
            <el-descriptions-item :label="$t('tools.install.memory')">{{(osInfo.MemorySize / (1024 ** 3)).toFixed(2)}} GB</el-descriptions-item>
            <el-descriptions-item :label="$t('tools.install.uptime')">{{osInfo.Uptime}}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" :style="isMobile?'margin-top: 20px':'margin-top: 0px'">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 500px'" >
          <template #header>
            <span class="card-header">{{$t('tools.install.installCheck')}}</span>
          </template>
          <el-result v-if="osInfo.Platform==='ubuntu'||osInfo.Platform==='centos'||osInfo.Platform==='rocky'"
            icon="success"
            :title="$t('tools.install.checkPass')"
            :sub-title="$t('tools.install.checkPassDesc')"
          >
            <template #extra>
              <el-button type="primary" :loading="installing" @click="handleInstall">{{t('tools.install.install')}}</el-button>
            </template>
          </el-result>
          <el-result v-else
                     icon="warning"
                     :title="$t('tools.install.checkNotPass')"
                     :sub-title="$t('tools.install.checkNotPassDesc')"
          >
            <template #extra>
              <el-button type="warning" :loading="installing" @click="handleInstall">{{t('tools.install.install')}}</el-button>
            </template>
          </el-result>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="installing">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 20px">
        <el-card shadow="never" style="min-height: 250px" >
          <template #header>
            <div class="card-header">
              <span>{{t('tools.install.installProgress')}}</span>
              <el-tag type="warning" style="font-weight: lighter">{{t('tools.install.noClose')}}</el-tag>
            </div>

          </template>
          <el-progress :percentage="percentage" :status="percentage===100?'success':''"
                       :stroke-width="15" striped striped-flow/>
          <div style="margin-top: 10px">
            <span v-if="language==='zh'">{{installInfo.zh}}</span>
            <span v-if="language==='en'">{{installInfo.en}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {useScreenStore} from "@/hooks/screen/index.ts";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {seconds2Time} from "@/utils/tools.js";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgSuccess} from "@/utils/koi.ts";

const { t } = useI18n()
const globalStore = useGlobalStore()
const language = computed(() => globalStore.language)
const { isMobile } = useScreenStore();

const installing = ref(false)
const percentage = ref(0)
const installInfo = ref({
  zh: '',
  en: '',
})

const osInfo = ref({})

const getOSInfo = () => {
  toolsApi.osInfo.get().then(response => {
    osInfo.value = response.data
    osInfo.value.Uptime = seconds2Time(response.data.Uptime, language.value)
  })
}

const handleInstall = () => {
  toolsApi.install.post().then(response => {
    koiMsgSuccess(response.message)
    installing.value = true
    startRequests()
  })
}

const handleGetStatus = () => {
  toolsApi.installStatus.get().then(response => {
    const data = response.data
    percentage.value = data.process
    installInfo.value.zh = data.zh
    installInfo.value.en = data.en
    if (percentage.value === 100) {
      cancelRequests()
    } else if (percentage.value === 0) {
      cancelRequests()
    }
  })
}

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    handleGetStatus()
  }, 1000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  getOSInfo()
})
onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>

<style scoped>
</style>
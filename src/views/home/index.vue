<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 250px">
          <template #header>
            <div class="card-header">
              room info
            </div>
          </template>
          <el-descriptions :column="isMobile?1:2">
            <el-descriptions-item label="Room Name">
              {{roomInfo.roomSettingBase.name}}
            </el-descriptions-item>
            <el-descriptions-item label="cycles">
              <el-tag>
                {{roomInfo.seasonInfo.cycles}}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="phase">
              <el-tag>
                {{roomInfo.seasonInfo.phase}}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="season">
              <el-tag>{{roomInfo.seasonInfo.season}} {{getSeasonDays(roomInfo.seasonInfo.season)}}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 250px">
          <template #header>
            <div class="card-header">
              sys info
            </div>
          </template>
          <div class="fcc">
            <el-progress type="dashboard" :percentage="sysInfo.cpu" :color="progressColors">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                <span class="percentage-label">CPU</span>
              </template>
            </el-progress>
            <el-progress type="dashboard" :percentage="sysInfo.memory" :color="progressColors" style="margin-left: 10%">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                <span class="percentage-label">Mem</span>
              </template>
            </el-progress>
          </div>

        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 400px'">
          <template #header>
            <div class="card-header">
              control
            </div>
          </template>
          <div>
            <el-form size="large" inline>
              <el-form-item label="master">
                <el-switch v-model="clusterStatus.master" :active-value="1" :inactive-value="0"
                           inline-prompt active-text="运行中" inactive-text="已关闭"/>
              </el-form-item>
              <el-form-item label="caves">
                <el-switch v-model="clusterStatus.caves" :active-value="1" :inactive-value="0"
                           inline-prompt active-text="运行中" inactive-text="已关闭"/>
              </el-form-item>
            </el-form>
            <el-form size="large">
              <el-form-item label="rollback">
                <el-col v-if="isMobile">
                  <el-button link type="primary" @click="handleExec('rollback', 1)">1day</el-button>
                  <el-button link type="primary" @click="handleExec('rollback', 2)">2days</el-button>
                  <el-button link type="primary" @click="handleExec('rollback', 3)">3days</el-button>
                </el-col>
                <el-col v-if="isMobile">
                  <el-button link type="primary" @click="handleExec('rollback', 4)">4days</el-button>
                  <el-button link type="primary" @click="handleExec('rollback', 5)">5days</el-button>
                </el-col>
                <el-col v-if="!isMobile">
                  <el-button link type="primary" @click="handleExec('rollback', 1)">1day</el-button>
                  <el-button link type="primary" @click="handleExec('rollback', 2)">2days</el-button>
                  <el-button link type="primary" @click="handleExec('rollback', 3)">3days</el-button>
                  <el-button link type="primary" @click="handleExec('rollback', 4)">4days</el-button>
                  <el-button link type="primary" @click="handleExec('rollback', 5)">5days</el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <el-form size="large">
              <el-form-item>
                <el-button type="primary" size="default" @click="handleExec('restart', 0)">restart</el-button>
                <el-button type="warning" size="default" @click="handleExec('update', 0)">update</el-button>

              </el-form-item>
              <el-form-item>
                <el-button type="danger" size="default" @click="handleExec('reset', 0)">reset</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 400px'">
          <template #header>
            <div class="card-header">
              interface
            </div>
          </template>
          <div>
            <el-form label-position="top">
              <el-form-item label="announcement">
                <el-input>
                  <template #append>
                    <el-button>send</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="console">
                <el-input>
                  <template #append>
                    <el-button>execute</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import homeApi from "@/api/home"
import {useI18n} from "vue-i18n";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";


onMounted(() => {
  getRoomInfo()
  startRequests()
})

const { t } = useI18n()
const { isMobile } = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const loading = ref(false)

const roomInfo = ref({
  roomSettingBase: {

  },
  seasonInfo: {
    season: '',
    cycles: 0,
    elapsedDays: 0,
    seasonLength: {
      summer: 15,
      autumn: 20,
      spring: 20,
      winter: 15
    }
  }
})
const getRoomInfo = () => {
  homeApi.roomInfo.get().then(response => {
    roomInfo.value = response.data
  })
}

const getSeasonDays = (season) => {
  if (roomInfo.value.seasonInfo.elapsedDays) {
    return `(${roomInfo.value.seasonInfo.elapsedDays}/${roomInfo.value.seasonInfo.seasonLength[season]})`
  } else {
    return ''
  }

}

const sysInfo = ref({
  cpu: 0,
  memory: 0,
})
const getSysInfo = () => {
  homeApi.sysInfo.get().then(response =>{
    sysInfo.value = response.data
  })
}
const progressColors = [
  { color: '#5cb87a', percentage: 20 },
  { color: '#1989fa', percentage: 40 },
  { color: '#e6a23c', percentage: 60 },
  { color: '#f56c6c', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    getSysInfo()
  }, 2000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const clusterStatus  = ref({
  master: 1,
  caves: 1,
})

const handleExec = (type, info) => {

}


onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>

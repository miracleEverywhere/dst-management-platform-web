<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.statistics.player.title') }}
              <el-button @click="handleRefreshPlayer">{{ t('tools.statistics.player.refresh') }}</el-button>
            </div>
          </template>
          <sc-echarts ref="playerChartRef" :option="option" height="300px"></sc-echarts>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="8" :md="8" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.statistics.max.title') }}
            </div>
          </template>
          <div class="flex justify-between">
            <span class="text-sm">{{ t('tools.statistics.max.maxPlayer') }}</span>
            <el-tag type="success">{{ t('tools.statistics.max.day') }}</el-tag>
          </div>
          <div class="text-2xl">
            <CountTo :startVal="0" :endVal="playerStatisticsResult.num" :duration="2000"/>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="8" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.statistics.max.maxPlayerTimestamp') }}
            </div>
          </template>
          <div class="flex justify-between">
            <span class="text-sm">{{ t('tools.statistics.max.time') }}</span>
          </div>
          <div class="text-2xl">
            {{timestamp2time(playerStatisticsResult.timestamp)}}
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="8" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.statistics.data.title') }}
            </div>
          </template>
          <div class="flex justify-between">
            <span class="text-sm">{{ t('tools.statistics.data.dataNum') }}</span>
          </div>
          <div class="text-2xl">
            <CountTo :startVal="0" :endVal="playerStatisticsResult.dataVolume" :duration="2000"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="toolsStatistics" setup>
import {computed, onMounted, ref, watch} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import ScEcharts from "@/components/scEcharts/index.vue";
import {timestamp2time} from "@/utils/tools.js";
import {koiMsgSuccess} from "@/utils/koi.ts";
import { CountTo } from "vue3-count-to";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getInfo()
})

const getInfo = (refresh=false) => {
  toolsApi.statistics.get().then(response => {
    for (let item of response.data) {
      option.value.xAxis.data.push(timestamp2time(item.timestamp))
      option.value.series[0].data.push(item.num)
      if (item.num > playerStatisticsResult.value.num) {
        playerStatisticsResult.value = item
      }
    }
    playerStatisticsResult.value.dataVolume = response.data.length
    if (refresh) {
      koiMsgSuccess(t('tools.statistics.player.refreshSuccess'))
    }
  })
}

const playerStatisticsResult = ref({
  num: 0,
  timestamp: 0,
  dataVolume: 0
})

const handleRefreshPlayer = () => {
  option.value.xAxis.data = []
  option.value.series[0].data = []
  getInfo(true)
  playerChartRef.value.redraw(option.value)
}

const playerChartRef = ref()
const option = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'line',
    }
  ]
})
</script>

<style scoped>
</style>

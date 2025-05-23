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
            <CountTo :duration="2000" :endVal="playerStatisticsResult.num" :startVal="0"/>
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
            {{ timestamp2time(playerStatisticsResult.timestamp) }}
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
            <CountTo :duration="2000" :endVal="playerStatisticsResult.dataVolume" :startVal="0"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="toolsStatistics" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import ScEcharts from "@/components/scEcharts/index.vue";
import {timestamp2time} from "@/utils/tools.js";
import {koiMsgSuccess} from "@/utils/koi.ts";
import {CountTo} from "vue3-count-to";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getInfo()
})

const getInfo = (refresh = false) => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  toolsApi.statistics.get(reqForm).then(response => {
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
  num: -1,
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
      smooth: true,
      areaStyle: {
        color: {
          //线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(1, 255, 255, 0.8)', // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(1, 255, 255,0)', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    }
  ]
})

const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.name);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name);
      refreshCurrentPage(true);
    });
  }, 0);
};

watch(() => globalStore.selectedDstCluster, (newValue) => {
  if (newValue) {
    nextTick(() => {
      handleRefresh()
    })
  }
}, {immediate: false})
</script>

<style scoped>
</style>

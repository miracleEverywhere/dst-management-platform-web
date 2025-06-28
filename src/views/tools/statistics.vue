<template>
  <div class="page-div">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane :label="t('tools.statistics.player.title')" name="statistics">
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
      </el-tab-pane>
      <el-tab-pane :label="t('tools.statistics.player.title2')" name="gantt">
        <el-card shadow="never" style="margin-top: 10px">
          <template #header>
            <div class="card-header">
              {{ t('tools.statistics.player.gantCardTitle') }}
              <el-button @click="handleRefreshPlayer">{{ t('tools.statistics.player.refresh') }}</el-button>
            </div>
          </template>
          <el-scrollbar>
            <div style="display: flex; width: fit-content; padding-bottom: 30px">
              <g-gantt-chart
                :chart-end="lastTime"
                :chart-start="firstTime"
                bar-end="myEndDate"
                bar-start="myBeginDate"
                :color-scheme="isDark?'dark':'sky'"
                precision="hour"
                width="3900px"
              >
                <g-gantt-row v-for="row in ganttRows" :bars="row.barList" :label="row.nickname" highlight-on-hover/>
              </g-gantt-chart>
            </div>
          </el-scrollbar>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="t('tools.statistics.pie.tabName')" name="pie">
        <el-card shadow="never" style="margin-top: 10px">
          <template #header>
            <div class="card-header">
              <div class="fcc">
                {{ t('tools.statistics.pie.title') }}
                <el-tooltip :content="t('tools.statistics.pie.tip')" effect="light" placement="top">
                  <el-icon size="14" style="margin-left: 2px">
                    <QuestionFilled/>
                  </el-icon>
                </el-tooltip>
              </div>

              <el-button @click="handleRefreshPlayer">{{ t('tools.statistics.player.refresh') }}</el-button>
            </div>
            <sc-echarts ref="pieChartRef" :option="optionPie" height="75vh" width="75vw"></sc-echarts>
          </template>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script name="toolsStatistics" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import ScEcharts from "@/components/scEcharts/index.vue";
import {sleep, timestamp2time} from "@/utils/tools.js";
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

const formatTimeToGantt = (ts) => {
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，补0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const getInfo = (refresh = false) => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  toolsApi.statistics.get(reqForm).then(response => {
    for (let item of response.data.stats) {
      option.value.xAxis.data.push(timestamp2time(item.timestamp))
      option.value.series[0].data.push(item.num)
      if (item.num > playerStatisticsResult.value.num) {
        playerStatisticsResult.value = item
      }
    }
    playerStatisticsResult.value.dataVolume = response.data.stats.length

    let first = response.data.stats[0].timestamp
    let last = response.data.stats[response.data.stats.length - 1].timestamp
    firstTime.value = formatTimeToGantt(parseInt(first) - 3600000)
    lastTime.value = formatTimeToGantt(parseInt(last) + 3600000)
    ganttRows.value = []
    // let unit
    // if (language.value === 'zh') {
    //   unit = '分钟'
    // } else {
    //   unit = 'mins'
    // }
    for (const key in response.data.gantt) {
      let barList = []
      for (let arr of response.data.gantt[key]) {
        barList.push({
          myBeginDate: arr.beginDate,
          myEndDate: arr.endDate,
          ganttBarConfig: {
            id: arr.id,
            label: arr.label,
            immobile: true,
            style: {
              background: '#409effaa',
              color: 'white',
              borderRadius: '5px'
            }
          }
        })
      }
      ganttRows.value.push({
        nickname: key,
        barList: barList
      })
    }

    if (response.data.pie != null) {
      optionPie.value.series[0].data = Object.entries(response.data.pie)
        .sort((a, b) => b[1] - a[1])  // 按值降序排序
        .slice(0, 10)                 // 只取前10项
        .map(([name, value]) => ({    // 转换为目标格式
          value: (value / 8).toFixed(0),
          name: name
        }))
      pieChartRef.value.redraw(optionPie.value)
    }

    if (refresh) {
      koiMsgSuccess(t('tools.statistics.player.refreshSuccess'))
    }
  })
}

const firstTime = ref('')
const lastTime = ref('')
const ganttRows = ref([])

const activeTab = ref('statistics')
const handleTabClick = async (tab, event) => {
  await sleep(10)
  option.value.xAxis.data = []
  option.value.series[0].data = []
  await getInfo()
  playerChartRef.value.redraw(option.value)
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

const pieChartRef = ref()
const optionPie = ref({
  tooltip: {
    trigger: 'item',
    formatter: `[{b}]: {c}${language.value==='zh'?'天':'Days'} ${language.value==='zh'?'占比':'Percentage'} {d}%`
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
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

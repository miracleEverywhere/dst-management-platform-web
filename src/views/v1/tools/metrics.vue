<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              系统信息
              <div>
                <el-select v-model="timeRange" style="font-weight: lighter;width: 100px" @change="getMetrics(timeRange, false)">
                  <el-option
                    v-for="item in selectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button size="default" style="margin-left: 5px" @click="getMetrics(timeRange, true)">
                  {{ t('setting.refresh') }}
                </el-button>
              </div>
            </div>
          </template>
          <div>
            <sc-echarts ref="cpuChartRef" :option="cpuOption" height="25vh"></sc-echarts>
            <sc-echarts ref="memoryChartRef" :option="memoryOption" height="25vh" style="margin-top: 20px"></sc-echarts>
            <sc-echarts ref="netUplinkChartRef" :option="netUplinkOption" height="25vh" style="margin-top: 20px"></sc-echarts>
            <sc-echarts ref="netDownlinkChartRef" :option="netDownlinkOption" height="25vh" style="margin-top: 20px"></sc-echarts>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="toolsMetrics" setup>
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgSuccess} from "@/utils/koi.ts";
import ScEcharts from "@/components/scEcharts/index.vue";
import {timestamp2timeWithoutDate} from "@/utils/tools.js";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const timeRange = ref(30)

onMounted(() => {
  getMetrics(timeRange.value, false)
})

const selectOptions = [
  {
    label: language.value === 'zh' ? '30分钟' : '30 Minutes',
    value: 30
  },
  {
    label: language.value === 'zh' ? '60分钟' : '60 Minutes',
    value: 60
  },
  {
    label: language.value === 'zh' ? '3小时' : '3 Hours',
    value: 180
  },
  {
    label: language.value === 'zh' ? '6小时' : '6 Hours',
    value: 360
  },
  {
    label: language.value === 'zh' ? '12小时' : '12 Hours',
    value: 720
  },
  {
    label: language.value === 'zh' ? '24小时' : '24 Hours',
    value: 1440
  },
  {
    label: language.value === 'zh' ? '全部' : 'All Time',
    value: 0
  },
]

const getMetrics = (timeRange, tip) => {
  const reqForm = {
    timeRange: timeRange
  }
  toolsApi.metrics.get(reqForm).then(response => {
    cpuOption.value.xAxis.data = []
    memoryOption.value.xAxis.data = []
    netUplinkOption.value.xAxis.data = []
    netDownlinkOption.value.xAxis.data = []
    cpuOption.value.series[0].data = []
    memoryOption.value.series[0].data = []
    netUplinkOption.value.series[0].data = []
    netDownlinkOption.value.series[0].data = []
    for (let i of response.data) {
      cpuOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      memoryOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      netUplinkOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      netDownlinkOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))

      cpuOption.value.series[0].data.push(i.cpu.toFixed(2))
      memoryOption.value.series[0].data.push(i.memory.toFixed(2))
      netUplinkOption.value.series[0].data.push(i.netUplink.toFixed(2))
      netDownlinkOption.value.series[0].data.push(i.netDownlink.toFixed(2))
    }
    if (tip) {
      koiMsgSuccess(language.value === 'zh' ? '刷新成功' : 'Refresh Success')
    }
  })
}

const cpuChartRef = ref()
const memoryChartRef = ref()
const netUplinkChartRef = ref()
const netDownlinkChartRef = ref()

const cpuOption = ref({
  title: {
    text: 'CPU',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#409EFF', // 改变折线点的颜色
          lineStyle: {
            color: '#409EFF' // 改变折线颜色
          }
        }
      },
      areaStyle: {
        color: {
          //线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#409EFF', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    }
  ]
})

const memoryOption = ref({
  title: {
    text: 'Memory',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#67C23A', // 改变折线点的颜色
          lineStyle: {
            color: '#67C23A' // 改变折线颜色
          }
        }
      },
      areaStyle: {
        color: {
          //线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#67C23A', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    }
  ]
})

const netUplinkOption = ref({
  title: {
    text: 'Net ↑',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} KiB/s'
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#E6A23C', // 改变折线点的颜色
          lineStyle: {
            color: '#E6A23C' // 改变折线颜色
          }
        }
      },
      areaStyle: {
        color: {
          //线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#E6A23C', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    }
  ]
})

const netDownlinkOption = ref({
  title: {
    text: 'Net ↓',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} KiB/s'
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#F56C6C', // 改变折线点的颜色
          lineStyle: {
            color: '#F56C6C' // 改变折线颜色
          }
        }
      },
      areaStyle: {
        color: {
          //线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#F56C6C', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    }
  ]
})

</script>

<style scoped>
</style>
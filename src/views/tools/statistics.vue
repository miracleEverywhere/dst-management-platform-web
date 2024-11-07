<template>
  <div class="page-div">
    <el-card shadow="never">
      <sc-echarts ref="playerChartRef" :option="option" height="300px"></sc-echarts>
    </el-card>

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

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getInfo()
})

watch(language, () => {
  option.value.title.text = t('tools.statistics.player.title')
  option.value.title.subtext = t('tools.statistics.player.subtitle')
  playerChartRef.value.setOption(option.value)
})

const getInfo = () => {
  toolsApi.statistics.get().then(response => {
    for (let item of response.data) {
      option.value.xAxis.data.push(timestamp2time(item.timestamp))
      option.value.series[0].data.push(item.num)
    }
  })
}

const playerChartRef = ref()
const option = ref({
  title: {
    text: t('tools.statistics.player.title'),
    subtext: t('tools.statistics.player.subtitle'),
    textStyle: {
      fontFamily: 'KoiFont',
    },
  },
  grid: {
    top: '80px'
  },
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

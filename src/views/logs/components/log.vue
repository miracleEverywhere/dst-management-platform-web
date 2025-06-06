<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        {{ t('logs.logs') }}
        <div v-if="props.historical" class="fcc">
          <span v-if="props.type==='world'||props.type==='chat'"
                style="font-weight: lighter; font-size: smaller">{{language==='zh'?'世界选择':'World'}}：</span>
          <el-select v-if="props.type==='world'||props.type==='chat'"
                     v-model="historicalLogsForm.worldName" @change="historicalWorldChange"
                     style="width: 10vw; margin-right: 10px; font-weight: lighter">
            <el-option v-for="world in globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster).worlds"
                       :label="world" :value="world"></el-option>
          </el-select>
          <span style="font-weight: lighter; font-size: smaller">{{language==='zh'?'日志文件':'File'}}：</span>
          <el-select v-model="selectedFile" size="default" style="width: 15vw;font-weight: lighter" @change="getFileConnect">
            <el-option v-for="item in fileList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div v-if="!props.historical" class="fcc">
          <span v-if="props.type==='world'||props.type==='chat'"
                style="font-weight: lighter; font-size: smaller">{{language==='zh'?'世界选择':'World'}}：</span>
          <el-select v-if="props.type==='world'||props.type==='chat'"
                     v-model="logsForm.worldName" @change="logsValue=''"
                     style="width: 10vw; margin-right: 10px; font-weight: lighter">
            <el-option v-for="world in globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster).worlds" :label="world" :value="world"></el-option>
          </el-select>
          <span style="font-weight: lighter; font-size: smaller">{{ t('logs.autoPull') }}</span>
          <el-switch v-model="autoPull" :active-value="1" :inactive-value="0"/>
        </div>
      </div>
    </template>
    <sc-code-editor ref="editor" v-model="logsValue" v-loading="historicalLogLoading" :height="isMobile?'55vh':'67vh'"
                    :theme="isDark?'darcula':'idea'"
                    mode="javascript" style="width: 100%"></sc-code-editor>
    <template v-if="!props.historical" #footer>
      <div class="card-footer">
        <el-input-number v-model="logsForm.line" controls-position="right"
                         @focus="manualLine=true" style="width: 100px;"/>
        <el-tooltip :content="t('logs.manualPullTips')" effect="light" placement="top">
          <el-button style="margin-left: 10px" type="primary" @click="handlePullLogs">{{ t('logs.manualPull') }}</el-button>
        </el-tooltip>
      </div>
    </template>
  </el-card>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import logsApi from "@/api/logs"

const props = defineProps({
  type: String,
  historical: Boolean,
})

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);


onMounted(() => {
  if (props.historical) {
    handleGetLogFile();
  } else {
    init();
    startRequests();
  }

  windowHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    windowHeight.value = window.innerHeight;
  });
});

const init = () => {
  if (!globalStore.dstClusters || !globalStore.selectedDstCluster) return;

  logsForm.value.worldName =
    globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster)?.worlds?.[0] ??
    null;
};

const windowHeight = ref(0);
const manualLine = ref(false);

const line = computed(() => {
  if (!manualLine.value) {
    return isMobile.value
      ? Math.floor((windowHeight.value * 0.55) / 21) - 1
      : Math.floor((windowHeight.value * 0.67) / 21) - 1;
  } else {
    return logsForm.value.line; // 手动模式，直接返回表单值
  }
});

// 同步 line computed 到 logsForm.value.line


const autoPull = ref(1);
const logsForm = ref({
  line: line.value, // 初始化为 computed 的当前值
  type: props.type,
  clusterName: globalStore.selectedDstCluster,
  worldName: null, // 先设为 null，init() 会更新
});
const logsValue = ref('')
const handlePullLogs = () => {
  if (!logsForm.value.worldName && (logsForm.value.type !== 'runtime' && logsForm.value.type !== 'access')) {
    return
  }
  logsApi.logValue.get(logsForm.value).then(response => {
    if (response.data !== null) {
      logsValue.value = response.data.join("\n")
    }
  })
}

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value === 1) {
      handlePullLogs()
    }
  }, 2000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const fileList = ref([])
const selectedFile = ref('')
const historicalLogsForm = ref({
  clusterName: globalStore.selectedDstCluster,
  worldName: globalStore.dstClusters?.find(cluster => cluster.clusterName === globalStore.selectedDstCluster)?.worlds?.[0] ?? null,
  type: props.type
})
const handleGetLogFile = () => {
  logsApi.historical.logFile.get(historicalLogsForm.value).then(response => {
    fileList.value = response.data
  })
}
const historicalLogLoading = ref(false)
const historicalWorldChange = () => {
  handleGetLogFile()
  selectedFile.value = ''
}
const getFileConnect = () => {
  historicalLogLoading.value = true
  const reqForm = {
    file: selectedFile.value
  }
  logsApi.historical.log.get(reqForm).then(response => {
    logsValue.value = response.data
  }).finally(() => {
    historicalLogLoading.value = false
  })
}

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})

defineExpose({
  cancelRequests,
  startRequests
});

watch([line, manualLine], ([newLine, isManual]) => {
  if (!isManual) {
    logsForm.value.line = newLine;
  }
}, { immediate: true });
</script>

<style scoped>
</style>

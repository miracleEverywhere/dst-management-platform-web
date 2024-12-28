<template>
  <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
    <template #header>
      <div class="card-header">
        {{t('logs.logs')}}
        <div v-if="props.historical">
          <el-select v-model="selectedFile" @change="getFileConnect" size="default" style="width: 10vw;font-weight: lighter">
            <el-option v-for="item in fileList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div v-if="!props.historical">
          <span style="font-weight: lighter;">{{t('logs.autoPull')}}</span>
          <el-switch v-model="autoPull" :active-value="1" :inactive-value="0" />
        </div>
      </div>
    </template>
    <sc-code-editor ref="editor" v-model="logsValue" v-loading="historicalLogLoading" mode="javascript" :theme="isDark?'darcula':'idea'"
                    :height="isMobile?420:600" style="width: 100%"></sc-code-editor>
    <template v-if="!props.historical" #footer>
      <div class="card-footer">
        <el-input-number v-model="logsForm.line" controls-position="right" style="width: 100px;"/>
        <el-tooltip effect="light" :content="$t('logs.manualPullTips')" placement="top">
          <el-button type="primary" @click="handlePullLogs" style="margin-left: 10px">{{t('logs.manualPull')}}</el-button>
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
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import logsApi from "@/api/logs"

const props = defineProps({
  type: String,
  historical: Boolean
})

const { t } = useI18n()
const { isMobile } = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  if (props.historical) {
    handleGetLogFile()
  } else {
    startRequests()
    init()
  }
})

const init = () => {
  if (isMobile.value) {
    logsForm.value.line = 20
  } else {
    logsForm.value.line = 25
  }
}

const autoPull = ref(1)
const logsForm = ref({
  line: 25,
  type: props.type
})
const logsValue = ref('')
const handlePullLogs = () => {
  logsApi.logValue.get(logsForm.value).then(response => {
    logsValue.value = response.data.join("\n")
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

const fileList = ref([

])
const selectedFile = ref('')
const handleGetLogFile = () => {
  const reqForm = {
    type: props.type
  }
  logsApi.historical.logFile.get(reqForm).then(response => {
    fileList.value = response.data
  })
}
const historicalLogLoading = ref(false)
const getFileConnect = () =>{
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

</script>

<style scoped>
</style>

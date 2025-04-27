<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('logs.clean.title') }}
              <div class="fcc">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" size="large"
                             style="margin-right: 10px" @change="handleCheckAllChange">
                  {{ t('logs.clean.selectAll') }}
                </el-checkbox>
                <el-button @click="handleGetLogsInfo">{{ t('logs.clean.refresh') }}</el-button>
                <el-button :loading="cleanButtonLoading" type="danger"
                           @click="handleCleanLogs">
                  {{ t('logs.clean.button') }}
                </el-button>
              </div>
            </div>
          </template>
          <div>
            <el-checkbox-group v-model="cleanLogFileTypes" @change="handleCleanLogFileTypesChange">
              <el-checkbox v-for="logFileType in logFileTypes" :key="logFileType" :label="logFileType" :value="logFileType">
                {{ logFileTypeMap[logFileType][language === 'zh' ? 'zh' : 'en'] }}
              </el-checkbox>
            </el-checkbox-group>
            <el-table ref="tableRef" v-loading="tableLoading" :data="logsInfo"
                      border style="margin-top: 20px">
              <el-table-column :label="t('logs.clean.type')" prop="name">
                <template #default="scope">
                  <el-tag type="primary">{{ scope.row.name }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="t('logs.clean.size')" prop="size">
                <template #default="scope">
                  <el-tag type="success">{{ formatBytes(scope.row.size) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="t('logs.clean.num')" prop="num">
                <template #default="scope">
                  <el-tag type="info">{{ scope.row.num }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import logsApi from "@/api/logs"
import {formatBytes} from "@/utils/tools.js";
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
  handleGetLogsInfo()
})

const logsInfo = ref([])
const tableLoading = ref(false)
const handleGetLogsInfo = () => {
  tableLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  logsApi.clean.status.get(reqForm).then(response => {
    logsInfo.value = response.data
  }).finally(() => {
    tableLoading.value = false
  })
}

const logFileTypes = ['World', 'Chat', 'Access', 'Runtime']
const cleanLogFileTypes = ref([])
const handleCleanLogFileTypesChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === logFileTypes.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < logFileTypes.length
}
const checkAll = ref(false)
const isIndeterminate = ref(false)
const handleCheckAllChange = (val) => {
  cleanLogFileTypes.value = val ? logFileTypes : []
  isIndeterminate.value = false
}
const logFileTypeMap = {
  World: {
    zh: '世界日志',
    en: 'World',
  },
  Chat: {
    zh: '聊天日志',
    en: 'Chat',
  },
  Access: {
    zh: '请求日志',
    en: 'Access',
  },
  Runtime: {
    zh: '运行日志',
    en: 'Runtime',
  },
}

const cleanButtonLoading = ref(false)
const handleCleanLogs = () => {
  if (cleanLogFileTypes.value.length === 0) {
    koiMsgError(language.value === "zh" ? "请至少选择一种日志" : "Please select at least one type of log")
    return
  }
  cleanButtonLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    logTypes: cleanLogFileTypes.value
  }
  logsApi.clean.clean.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    cleanButtonLoading.value = false
    handleGetLogsInfo()
  })
}

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
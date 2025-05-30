<template>
  <div class="page-div">
    <div class="tip_warning">
      {{ t('clusters.tip1') }}
    </div>
    <el-table :data="clustersInfo" v-loading="loading" border>
      <el-table-column :label="t('clusters.table.name')">
        <template #default="scope">
          <el-tag type="primary">
            {{ scope.row.clusterName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('clusters.table.displayName')">
        <template #default="scope">
          <el-tag type="success">
            {{ scope.row.clusterDisplayName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('clusters.table.world')">
        <template #default="scope">
          <el-tag type="info">
            {{ scope.row.worlds?.length || 0 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('clusters.table.actions')">
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleClusterDelete(scope.row.clusterName)">
            {{t('clusters.table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="tip_success" style="margin-top: 20px">
      {{ t('clusters.tip2') }}
    </div>
    <el-alert v-if="uniquePortNum!==allPortNum" :effect="isDark?'light':'dark'"
              type="error" :closable="false" style="margin-bottom: 10px">
      <template #title>
        <div class="fcc" style="font-size: 20px">
          {{ t('clusters.tip3') }}
        </div>
      </template>
    </el-alert>
    <el-table :data="clustersWorldPort" v-loading="loading" border>
      <el-table-column :label="t('clusters.table.name')">
        <template #default="scope">
          <el-tag type="primary">
            {{ scope.row.clusterName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('clusters.table.displayName')">
        <template #default="scope">
          <el-tag type="success">
            {{ scope.row.clusterDisplayName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('clusters.table.port')">
        <template #default="scope">
          <span v-if="scope.row.worldPort">{{ scope.row.worldPort.join(', ') }}</span>
          <el-tag v-else type="info">{{t('clusters.table.none')}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script name="Clusters" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import settingApi from "@/api/setting/index.js";
import {ElMessageBox} from "element-plus";
import {koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";

onMounted(() => {
  getClustersInfo()
  getClustersWorldPort()
})

const {t} = useI18n()
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const infoLoading = ref(false)
const portLoading = ref(false)
const loading = computed(() => {
  return infoLoading.value || portLoading.value
})


const clustersInfo = ref([])
const getClustersInfo = () => {
  infoLoading.value = true
  settingApi.clusters.get().then(response => {
    clustersInfo.value = response.data
  }).finally(() => {
    infoLoading.value = false
  })
}

const clustersWorldPort = ref([])
const allPortNum = ref(0)
const uniquePortNum = ref(0)
const getClustersWorldPort = () => {
  portLoading.value = true
  settingApi.clustersWorldPort.get().then(response => {
    clustersWorldPort.value = response.data
    let ports = []
    for (let cluster of clustersWorldPort.value) {
      if (cluster.worldPort === null) {
        continue
      }
      for (let port of cluster.worldPort) {
        ports.push(port)
      }
    }
    allPortNum.value = ports.length
    uniquePortNum.value = new Set(ports).size
  }).finally(() => {
    portLoading.value = false
  })
}

const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
    if (globalStore.selectedDstCluster === null && globalStore.dstClusters !== null) {
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  })
}

const handleClusterDelete = (clusterName) => {
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 删除集群 操作，是否继续？` : `The cluster DELETE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            clusterName: clusterName
          }
          settingApi.cluster.delete(reqForm).then(async response => {
            koiMsgSuccess(response.message)
            await getClustersInfo()
            await getClustersWorldPort()
            await getClusters()
            if (globalStore.selectedDstCluster === clusterName && globalStore.dstClusters !== null) {
              globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
            }
            done()
          }).catch(() => {
          }).finally(() => {
            instance.confirmButtonLoading = false
          })
        } else {
          done()
        }
      }
    }
  ).then(() => {
  }).catch(() => {
    koiMsgInfo(t('home.canceled'))
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
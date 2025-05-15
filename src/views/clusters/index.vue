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
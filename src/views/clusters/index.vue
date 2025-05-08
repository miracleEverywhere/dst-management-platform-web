<template>
  <div class="page-div">
    <div class="tip_warning">
      {{t('clusters.tip')}}
    </div>
    <el-table :data="clusters" border>
      <el-table-column :label="t('clusters.table.name')">
        <template #default="scope">
          <el-tag type="primary">
            {{scope.row.clusterName}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('clusters.table.displayName')">
        <template #default="scope">
          <el-tag type="success">
            {{scope.row.clusterDisplayName}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('clusters.table.world')">
        <template #default="scope">
          <el-tag v-for="world in scope.row.worlds" type="info">
            {{world}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script name="Clusters" setup>
import {inject, nextTick, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import settingApi from "@/api/setting/index.js";

onMounted(() => {
  getClusters()
})

const {t} = useI18n()
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")

const clusters = ref([])
const getClusters = () => {
  settingApi.clusters.get().then(response => {
    clusters.value = response.data
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
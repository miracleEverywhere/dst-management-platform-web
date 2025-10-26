<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-tabs v-model="activeTabName" @tab-change="handleTabChange">
          <el-tab-pane :label="t('logs.current')" name="current">
            <log ref="logRef" type="chat"/>
          </el-tab-pane>
          <el-tab-pane :label="t('logs.historical')" :lazy="true" name="historical">
            <log ref="HistoricalLogRef" :historical="true" type="chat"/>
          </el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import log from "./components/log.vue"
import {inject, nextTick, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";

const {t} = useI18n()
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")

const activeTabName = ref('current')
const handleTabChange = (name) => {
  if (activeTabName.value === 'current' && logRef.value) {
    logRef.value.startRequests()
  }
  if (activeTabName.value === 'historical' && logRef.value) {
    logRef.value.cancelRequests()
  }
  activeTabName.value = name
}

const logRef = ref()
const HistoricalLogRef = ref()

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

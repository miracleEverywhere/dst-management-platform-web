<template>
  <div>
    <el-select v-model="globalStore.selectedDstCluster" size="small" style="width: 100px">
      <el-option v-for="cluster in globalStore.dstClusters" :label="cluster.clusterName"
                 :value="cluster.clusterName"/>
      <el-option label="新建" value="new"/>
    </el-select>
  </div>
</template>

<script setup>
import {computed, onMounted} from "vue";
import settingApi from '@/api/setting'
import useGlobalStore from "@/stores/modules/global.ts";


onMounted(async () => {
  getClusters()
})

const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);


const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
  })
}
</script>

<style scoped>
</style>
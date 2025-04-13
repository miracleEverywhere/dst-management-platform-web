<template>
  <div>
    <el-select v-model="globalStore.selectedDstCluster" @change="handleClusterChange" size="small" style="width: 100px">
      <el-option v-for="cluster in globalStore.dstClusters" :label="cluster.clusterName"
                 :value="cluster.clusterName"/>
      <el-option label="新建" :value="null" @click="handleClusterNew"/>
    </el-select>
    <el-dialog v-model="newClusterDialog">
      <template #header>
        新建集群
      </template>
      <el-form>
        <el-form-item label="集群名">
          <el-input>

          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
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

const handleClusterChange = () => {
  if (globalStore.selectedDstCluster !== null) {

  }
}

const handleClusterNew = () => {
  newClusterDialog.value = true
}

const newClusterDialog = ref(false)
</script>

<style scoped>
</style>
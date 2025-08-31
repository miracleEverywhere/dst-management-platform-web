<template>
  <el-image :src="'data:image/png;base64,'+imageData.image" alt="Base64图片" :style="'width: '+imageData.width*2+'px; height: '+imageData.height*2+'px'"/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import useGlobalStore from "@/stores/modules/global.ts";


const globalStore = useGlobalStore();

onMounted(() => {
  getSummary()
})

const imageData = ref({
  height: 0,
  width: 0,
  image: ''
})
const getSummary = () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    worldName: "World1"
  }
  toolsApi.summary.get(reqForm).then(response => {
    imageData.value = response.data
  })
}
</script>

<style scoped>
</style>
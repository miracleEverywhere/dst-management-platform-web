<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>世界统计</span>
        <el-select v-model="world" @change="getSummary"
                   style="width: 10vw; margin-right: 10px; font-weight: lighter">
          <el-option v-for="world in globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster).worlds"
                     :label="world" :value="world"></el-option>
        </el-select>
      </div>
    </template>
    <div>
      <canvas ref="canvas"></canvas>
      {{Data.count}}
    </div>
  </el-card>

</template>

<script setup>
import {onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import useGlobalStore from "@/stores/modules/global.ts";


const globalStore = useGlobalStore();

onMounted(async () => {
  await getSummary()
})

const Data = ref({
  image: {
    height: 0,
    width: 0,
    image: '',
  },
  prefabs: [],
  count: []
})

const canvas = ref()
const world = ref(globalStore.dstClusters?.find(cluster => cluster.clusterName === globalStore.selectedDstCluster)?.worlds?.[0] ?? null)

const getSummary = async () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    worldName: world.value
  }
  toolsApi.summary.get(reqForm).then(async response => {
    Data.value = response.data
    await generateImage()
  })
}



const generateImage = async () => {
  const mainImage = new Image();
  mainImage.src = 'data:image/png;base64,' + Data.value.image.image;

  const stickerImages = []

  for (let item of Data.value.prefabs) {
    const image = new Image()
    image.src = new URL(`./images/${item.name}.png`, import.meta.url).href
    stickerImages.push(image)
  }

  // 等待所有图片加载完成
  await Promise.all([
    new Promise((resolve) => { mainImage.onload = resolve; }),
    Promise.all(stickerImages.map(image =>
      new Promise(resolve => {
        image.onload = resolve
      })
    ))
  ]);

  const ctx = canvas.value.getContext('2d');

  // 使用实际图片尺寸
  canvas.value.width = Data.value.image.width;
  canvas.value.height = Data.value.image.height;

  // 绘制主图（使用实际尺寸）
  await ctx.drawImage(mainImage, 0, 0, Data.value.image.width, Data.value.image.height);

  for (let index = 0; index < stickerImages.length; index++) {
    await ctx.drawImage(stickerImages[index], Data.value.prefabs[index].x-8, Data.value.prefabs[index].y-8, 16, 16);
  }
}


</script>

<style scoped>
</style>
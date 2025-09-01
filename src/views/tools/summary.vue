<template>
  <el-card style="min-height: 70vh">
    <template #header>
      <div class="card-header">
        <span>世界统计</span>
        <el-select :disabled="loading" v-model="world" @change="getSummary"
                   style="width: 10vw; margin-right: 10px; font-weight: lighter">
          <el-option v-for="world in globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster).worlds"
                     :label="world" :value="world"></el-option>
        </el-select>
      </div>
    </template>
    <el-row v-loading="loading" style="overflow-x: auto; overflow-y: auto">
      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" >
        <canvas ref="canvas" :style="'width: '+Data.image.width*2+'px; height: '+Data.image.height*2+'px'"></canvas>
      </el-col>

      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24">
        <div style="height: 50%">
          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#000000', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">未定义</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#546E7A', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">边缘等</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#A1887F', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">卵石路</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#FFEFD5', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">矿区</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#F5DEB3', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">没有地皮</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#FFFACD', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">热带草原</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#66CDAA', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">长草</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#2E8B57', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">森林</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#4A148C', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">沼泽</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#B2EBF2', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">蝙蝠</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#0091EA', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">蓝蘑菇</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#66BB6A', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">楼梯普通</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#8D6E63', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">圆石笋</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#9E9D24', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">荧光果普通</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#BA68C8', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">迷宫</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#E040FB', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">远古</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#E57373', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">红蘑菇</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#C8E6C9', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">绿蘑菇</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#FFA07A', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">落叶林</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#FFF9C4', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">沙漠</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#96CDCD', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">月岛</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#FFB6C1', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">奶奶岛</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#FFB300', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">档案馆</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#4DB6AC', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">月亮蘑菇林</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#1E88E5', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">浅海</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#1976D2', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">浅海</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#1565C0', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">中海</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#0D47A1', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">深海</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#F5FFFA', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">海盐</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{ boxShadow: 'var(--el-box-shadow)', backgroundColor: '#00897B', borderRadius: '10px'}"/>
              <span ml="1">:</span>
              <span ml="4">水中木</span>
            </el-col>
          </el-row>
        </div>
        <div style="height: 50%">
          <el-row>
            <el-col v-for="item in Data.count" :span="12" mb="8" class="flex items-center">
              <span v-if="language==='zh'">{{item.cnName}}</span>
              <span v-if="language==='en'">{{item.enName}}</span>
              <span ml="1">:</span>
              <el-tag size="large" ml="4">{{item.count}}</el-tag>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import useGlobalStore from "@/stores/modules/global.ts";


const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const loading = ref(false)

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
  loading.value = true
  toolsApi.summary.get(reqForm).then(async response => {
    Data.value = response.data
    await generateImage()
  }).finally(() => {
    loading.value = false
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
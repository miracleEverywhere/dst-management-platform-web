<template>
  <el-card style="min-height: 70vh; overflow-y: auto">
    <template #header>
      <div class="card-header">
        <span>{{t('tools.location.title')}}</span>
        <div>
          <el-button :loading="loading" @click="getSummary" class="mr2">{{t('tools.location.titleButton')}}</el-button>
          <el-select :disabled="loading" v-model="world" @change="getSummary"
                     style="width: 10vw; margin-right: 10px; font-weight: lighter">
            <el-option v-for="world in globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster).worlds"
                       :label="world" :value="world"></el-option>
          </el-select>
        </div>

      </div>
    </template>
    <el-row v-loading="loading" class="mx4" style="overflow-x: auto; overflow-y: auto;">
      <el-col :span="24" class="flex justify-center">
        <canvas
          ref="canvas"
          @mousemove="getPixelColor"
          :width="Data.image.width * 2"
          :height="Data.image.height * 2"
          :style="{
            width: Data.image.width * 2 + 'px',
            height: Data.image.height * 2 + 'px',
            imageRendering: 'pixelated'
          }"
        />
      </el-col>
      <el-col :span="24" class="mt16">
        <div>
          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#000000' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#000000',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#000000')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#546E7A' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#546E7A',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#546E7A')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#A1887F' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#A1887F',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#A1887F')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#FFEFD5' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#FFEFD5',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#FFEFD5')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#F5DEB3' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#F5DEB3',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#F5DEB3')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#FFFACD' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#FFFACD',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#FFFACD')}}</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#66CDAA' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#66CDAA',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#66CDAA')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#2E8B57' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#2E8B57',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#2E8B57')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#4A148C' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#4A148C',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#4A148C')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#B2EBF2' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#B2EBF2',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#B2EBF2')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#0091EA' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#0091EA',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#0091EA')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#66BB6A' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#66BB6A',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#66BB6A')}}</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#8D6E63' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#8D6E63',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#8D6E63')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#9E9D24' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#9E9D24',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#9E9D24')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#BA68C8' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#BA68C8',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#BA68C8')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#E040FB' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#E040FB',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#E040FB')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#E57373' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#E57373',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#E57373')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#C8E6C9' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#C8E6C9',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#C8E6C9')}}</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#FFA07A' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#FFA07A',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#FFA07A')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#FFF9C4' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#FFF9C4',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#FFF9C4')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#96CDCD' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#96CDCD',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#96CDCD')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#FFB6C1' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#FFB6C1',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#FFB6C1')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#FFB300' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#FFB300',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#FFB300')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#4DB6AC' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#4DB6AC',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#4DB6AC')}}</span>
            </el-col>
          </el-row>

          <el-row mb="4">
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#1E88E5' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#1E88E5',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#1E88E5')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#1976D2' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#1976D2',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#1976D2')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#1565C0' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#1565C0',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#1565C0')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#0D47A1' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#0D47A1',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#0D47A1')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#F5FFFA' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#F5FFFA',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#F5FFFA')}}</span>
            </el-col>
            <el-col :span="4" class="flex items-center">
              <div class="inline-flex" h="8" w="20" :style="{
                  boxShadow: currentColor === '#00897B' ? '0 0 10px 2px gold' : 'var(--el-box-shadow)',
                  backgroundColor: '#00897B',
                  borderRadius: '10px',
                  transition: 'box-shadow 0.3s'
                }"/>
              <span ml="1">:</span>
              <span ml="4">{{t('tools.location.colorScheme.#00897B')}}</span>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="24" class="flex mt16">
        <div v-for="item in Data.count"  class="flex items-center mr12">
          <span v-if="language==='zh'">{{item.cnName}}</span>
          <span v-if="language==='en'">{{item.enName}}</span>
          <span ml="1">:</span>
          <el-tag size="large" ml="4">{{item.count}}</el-tag>
        </div>

      </el-col>
      <el-col :span="24" class="mt16">
        <div class="flex mb16">
          <div v-for="player in Data.players" class="flex items-center">
            <el-image :src="getPlayerImageSrc(player.prefab)" style="height: 32px; width: 32px"></el-image>
            <el-tag class="ml4" size="large">{{player.nickName}}</el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import useGlobalStore from "@/stores/modules/global.ts";
import {useI18n} from "vue-i18n";


const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);
const {t} = useI18n()

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
  count: [],
  players: [],
})

const canvas = ref()
const world = ref(globalStore.dstClusters?.find(cluster => cluster.clusterName === globalStore.selectedDstCluster)?.worlds?.[0] ?? null)

const getSummary = async () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    worldName: world.value
  }
  loading.value = true
  toolsApi.location.get(reqForm).then(async response => {
    Data.value = response.data
    await generateImage()
  }).finally(() => {
    loading.value = false
  })
}

const getPlayerImageSrc = (name) => {
  if (name) {
    return new URL(`./images/${name}.png`, import.meta.url).href
  } else {
    return new URL(`./images/undefined.png`, import.meta.url).href
  }
}

const ctx = ref()

const generateImage = async () => {
  const mainImage = new Image();
  mainImage.src = 'data:image/png;base64,' + Data.value.image.image;

  const stickerImages = []

  for (let item of Data.value.prefabs) {
    const image = new Image()
    image.src = new URL(`./images/${item.name}.png`, import.meta.url).href
    stickerImages.push(image)
  }

  const playerImages = {
    'undefined': (() => {
      const img = new Image();
      img.src = new URL(`./images/undefined.png`, import.meta.url).href;
      return img;
    })(),
    waxwell: (() => {
      const img = new Image();
      img.src = new URL(`./images/waxwell.png`, import.meta.url).href;
      return img;
    })(),
    walter: (() => {
      const img = new Image();
      img.src = new URL(`./images/walter.png`, import.meta.url).href;
      return img;
    })(),
    wanda: (() => {
      const img = new Image();
      img.src = new URL(`./images/wanda.png`, import.meta.url).href;
      return img;
    })(),
    warly: (() => {
      const img = new Image();
      img.src = new URL(`./images/warly.png`, import.meta.url).href;
      return img;
    })(),
    wathgrithr: (() => {
      const img = new Image();
      img.src = new URL(`./images/wathgrithr.png`, import.meta.url).href;
      return img;
    })(),
    webber: (() => {
      const img = new Image();
      img.src = new URL(`./images/webber.png`, import.meta.url).href;
      return img;
    })(),
    wendy: (() => {
      const img = new Image();
      img.src = new URL(`./images/wendy.png`, import.meta.url).href;
      return img;
    })(),
    wes: (() => {
      const img = new Image();
      img.src = new URL(`./images/wes.png`, import.meta.url).href;
      return img;
    })(),
    wickerbottom: (() => {
      const img = new Image();
      img.src = new URL(`./images/wickerbottom.png`, import.meta.url).href;
      return img;
    })(),
    willow: (() => {
      const img = new Image();
      img.src = new URL(`./images/willow.png`, import.meta.url).href;
      return img;
    })(),
    wilson: (() => {
      const img = new Image();
      img.src = new URL(`./images/wilson.png`, import.meta.url).href;
      return img;
    })(),
    winona: (() => {
      const img = new Image();
      img.src = new URL(`./images/winona.png`, import.meta.url).href;
      return img;
    })(),
    wolfgang: (() => {
      const img = new Image();
      img.src = new URL(`./images/wolfgang.png`, import.meta.url).href;
      return img;
    })(),
    wonkey: (() => {
      const img = new Image();
      img.src = new URL(`./images/wonkey.png`, import.meta.url).href;
      return img;
    })(),
    woodie: (() => {
      const img = new Image();
      img.src = new URL(`./images/woodie.png`, import.meta.url).href;
      return img;
    })(),
    wormwood: (() => {
      const img = new Image();
      img.src = new URL(`./images/wormwood.png`, import.meta.url).href;
      return img;
    })(),
    wortox: (() => {
      const img = new Image();
      img.src = new URL(`./images/wortox.png`, import.meta.url).href;
      return img;
    })(),
    wurt: (() => {
      const img = new Image();
      img.src = new URL(`./images/wurt.png`, import.meta.url).href;
      return img;
    })(),
    wx78: (() => {
      const img = new Image();
      img.src = new URL(`./images/wx78.png`, import.meta.url).href;
      return img;
    })(),
  }

  // 等待所有图片加载完成
  await Promise.all([
    new Promise((resolve) => { mainImage.onload = resolve; }),
    Promise.all(stickerImages.map(image =>
      new Promise(resolve => {
        image.onload = resolve
      })
    )),
    Promise.all(Object.values(playerImages).map(image =>
      new Promise(resolve => {
        image.onload = resolve;
      })
    )),
  ]);

  ctx.value = canvas.value.getContext('2d');

  ctx.value = canvas.value.getContext('2d');

  // 修改为使用放大后的尺寸
  canvas.value.width = Data.value.image.width * 2;
  canvas.value.height = Data.value.image.height * 2;

  // 绘制主图（使用放大后的尺寸）
  await ctx.value.drawImage(
    mainImage,
    0, 0,
    Data.value.image.width * 2,
    Data.value.image.height * 2
  );

  // 修改贴图位置和尺寸（乘以2倍）
  for (let index = 0; index < stickerImages.length; index++) {
    await ctx.value.drawImage(
      stickerImages[index],
      Data.value.prefabs[index].x * 2 - 16,
      Data.value.prefabs[index].y * 2 - 16,
      32,
      32
    );
  }

  for (let player of Data.value.players) {
    let image = playerImages.hasOwnProperty(player.prefab)
      ? player.prefab
      : 'undefined';

    await ctx.value.drawImage(
      playerImages[image],
      player.coordinate.x * 2 - 16,
      player.coordinate.y * 2 - 16,
      32,
      32
    );
    await drawTextWithBg(
      ctx.value,
      player.nickName,
      player.coordinate.x * 2 + 16,
      player.coordinate.y * 2
    );
  }
}

const drawRoundedRect  = (ctx, x, y, width, height, radius, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

const drawTextWithBg = async (ctx, text, x, y, options = {}) => {
  // 默认选项
  const defaults = {
    font: '8px Arial',
    textColor: '#080808',
    bgColor: '#ffffff',
    padding: 5,
    borderRadius: 5,
    textBaseline: 'top'
  };

  // 合并选项
  const opts = { ...defaults, ...options };

  // 设置字体
  ctx.font = opts.font;
  ctx.textBaseline = opts.textBaseline;

  // 测量文字
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = parseInt(opts.font, 10); // 简单估算高度

  // 计算背景尺寸
  const bgWidth = textWidth + opts.padding * 2;
  const bgHeight = textHeight + opts.padding * 2;

  // 绘制圆角背景
  if (opts.borderRadius > 0) {
    await drawRoundedRect(ctx, x, y, bgWidth, bgHeight, opts.borderRadius, opts.bgColor);
  } else {
    ctx.fillStyle = opts.bgColor;
    ctx.fillRect(x, y, bgWidth, bgHeight);
  }

  // 绘制文字
  ctx.fillStyle = opts.textColor;
  ctx.fillText(text, x + opts.padding, y + opts.padding);
}

const currentColor = ref()
const getPixelColor = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  // 计算缩放比例
  const scaleX = canvas.value.width / rect.width;
  const scaleY = canvas.value.height / rect.height;

  // 考虑缩放比例计算坐标
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  const pixel = ctx.value.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  currentColor.value = rgbToHex(pixel[0], pixel[1], pixel[2]);
}

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}


</script>

<style scoped>
</style>
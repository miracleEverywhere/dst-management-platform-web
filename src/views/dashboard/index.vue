<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            房间概览
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-chip label>房间名</v-chip>
                <span>{{baseInfo?.room?.gameName}}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            系统信息
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            房间控制
          </v-card-title>
          <v-card-text class="mx-4">
            <v-row class="mt-4">
              <v-btn class="mr-4 mb-4" color="success">
                启动游戏
              </v-btn>
              <v-btn class="mr-4 mb-4" color="error">
                关闭游戏
              </v-btn>
              <v-btn class="mr-4 mb-4" color="warning">
                重启游戏
              </v-btn>
              <v-btn class="mr-4 mb-4" color="info">
                更新游戏
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="mr-4 mb-4" :color="colors.purple.base">
                重置世界
              </v-btn>
              <v-btn class="mr-4 mb-4" :color="colors.blueGrey.base">
                清空世界
              </v-btn>
              <v-btn class="mr-4 mb-4" :color="colors.cyan.darken1">
                玩家指令
              </v-btn>
              <v-btn class="mr-4 mb-4" :color="colors.teal.base">
                世界指令
              </v-btn>
            </v-row>
            <v-row>
              <v-chip class="mr-4">回档</v-chip>
              <v-btn
                v-for="i in mobile?[1, 2, 3, 4]:[1, 2, 3, 4, 5, 6, 7, 8, 9]"
                color="default"
                size="x-small"
                class="mr-4 mb-4"
              >
                {{i}}
              </v-btn>

            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            游戏指令
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
      >
        <v-card>
          <v-card-title>
            世界信息
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-chip label>房间名</v-chip>
                <span>{{baseInfo?.room?.gameName}}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import {debounce} from "@/utils/tools.js";
import dashboardApi from "@/api/dashboard.js"
import useGlobalStore from "@/plugins/store/global.js";
import colors from 'vuetify/lib/util/colors'
import {useDisplay} from "vuetify/framework";
import {useI18n} from "vue-i18n";

const windowHeight = ref(window.innerHeight)
const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const baseInfo = ref()

const getBaseInfo = () => {
  const reqForm = {
    roomID: globalStore.room.id
  }
  dashboardApi.info.base.get(reqForm).then(response => {
    baseInfo.value = response.data
  })
}

onMounted(async () => {
  // 添加事件监听
  window.addEventListener('resize', handleResize)
  getBaseInfo()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>




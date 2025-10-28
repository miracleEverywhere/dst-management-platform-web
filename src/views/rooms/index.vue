<template>
  <div class="fcc">
    <v-text-field v-model="reqForm.name"
                  label="搜索"
                  placeholder="请输入房间名或房间昵称搜索"
                  append-inner-icon="ri-search-line"
                  class="mr-4"
                  :loading="getRoomsLoading"
                  @click:append-inner="getRooms"
                  @keyup.enter="getRooms"
    ></v-text-field>
    <v-btn v-if="!mobile" prepend-icon="ri-add-line" variant="elevated" size="large" class="mr-4">新建房间</v-btn>
    <v-btn v-if="!mobile" prepend-icon="ri-refresh-line" color="default" variant="elevated" size="large" @click="getRooms">刷新</v-btn>
    <v-btn v-if="mobile" icon="ri-add-line" class="mr-4"></v-btn>
    <v-btn v-if="mobile" icon="ri-refresh-line" color="default" @click="getRooms"></v-btn>
  </div>
  <v-row class="mt-8">
    <v-row>
      <v-col v-for="room in rooms" :cols="mobile?12:6">
        <v-hover v-slot="{ isHovering, props }">
        <v-card variant="flat" :height="mobile?'600px':'300px'" v-bind="props"
                :elevation="isHovering ? 6 : 0">
          <v-card-title>
            <div class="card-header">
              <span>
                {{room.name}}
              </span>
              <div class="fcc">
                <v-switch
                    v-model="room.status"
                    :indeterminate="getRoomsLoading||roomStatusLoading"
                    :disabled="getRoomsLoading||roomStatusLoading"
                    color="success"
                    hide-details
                    @update:model-value="handleOpenSwitchDialog"
                ></v-switch>
                <v-btn icon="ri-delete-bin-line" variant="text" class="ml-2">

                </v-btn>
              </div>
            </div>

          </v-card-title>
          <v-card-text v-ripple @click="console.log(room.name)" class="cursor-pointer">
            <v-row>
              <v-col :cols="mobile?12:6">
                我是房间配置
              </v-col>
              <v-col :cols="mobile?12:6">
                <v-card
                    class="mx-auto"
                    color="surface-light"
                    max-width="600"
                >
                  <template v-slot:prepend>
                    <v-icon
                        color="primary"
                        class="me-8"
                        icon="ri-line-chart-line"
                        size="64"
                    ></v-icon>
                  </template>

                  <template v-slot:title>
                    <div class="text-caption text-grey">
                      最大玩家数
                    </div>
                    <span
                        class="text-h3 font-weight-black"
                        v-text="0"
                    ></span>
                    <strong>人</strong>
                  </template>

<!--                  <template v-slot:append>-->
<!--                    <v-btn-->
<!--                        class="align-self-start"-->
<!--                        icon="ri-line-chart-line"-->
<!--                        size="34"-->
<!--                        variant="text"-->
<!--                    ></v-btn>-->
<!--                  </template>-->

                  <v-sheet color="transparent">
                    <v-sparkline
                        :gradient="['#f72047', '#ffd200', '#1feaea']"
                        :line-width="3"
                        :model-value="[0,1,4,2,6,2,3,5,7,9,0,1,9]"
                        :smooth="true"
                        stroke-linecap="round"
                        auto-draw
                    ></v-sparkline>
                  </v-sheet>
                </v-card>

<!--                玩家在线概览-->
<!--                <v-sparkline-->
<!--                    :auto-line-width="false"-->
<!--                    :fill="false"-->
<!--                    :gradient="gradients[5]"-->
<!--                    gradient-direction="top"-->
<!--                    :line-width="2"-->
<!--                    :model-value="Array.from({length: 15}, () => Math.floor(Math.random() * 11))"-->
<!--                    :smooth="true"-->
<!--                    stroke-linecap="round"-->
<!--                    type="trend"-->
<!--                    auto-draw-->
<!--                ></v-sparkline>-->
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-row>
  <v-pagination
      v-if="total > reqForm.pageSize"
      v-model="reqForm.page"
      :length="Math.max(1, Math.ceil(total/reqForm.pageSize))"
      @update:modelValue="getRooms"
      class="mt-8"
  ></v-pagination>
  <div v-if="rooms.length===0&&reqForm.name!==''">
    没有找到对应的集群哦
  </div>
  <div v-if="rooms.length===0&&reqForm.name===''">
    没有发现房间，点击右上角新建房间按钮新建一个吧
  </div>

  <v-dialog v-model="switchDialog" width="400px">
    <v-card>
      <div v-if="!x">
        是否关闭
      </div>
      <div v-else>
        是否开启
      </div>
    </v-card>
  </v-dialog>
</template>


<script setup>
import roomApi from "@/api/room"
import {useDisplay} from "vuetify";


onMounted(() => {
  // 初始获取房间
  getRooms()

  // 计算初始pageSize
  reqForm.value.pageSize = calculatePageSize()

  // 防抖处理resize事件
  const handleResize = debounce(() => {
    windowHeight.value = window.innerHeight
    reqForm.value.pageSize = calculatePageSize()
  }, 200)

  // 添加事件监听
  window.addEventListener('resize', handleResize)

  // 在组件卸载时移除监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

const {mobile} = useDisplay()

const windowHeight = ref(window.innerHeight)

const calculatePageSize = () => {
  // 64(navbar) + 48(margin) + 44(pagination) + 24 * 2(card margins) = 204
  const usedHeight = 204
  const cardHeight = 300
  return Math.max(2, Math.floor((windowHeight.value - usedHeight) / cardHeight) * 2)
}

const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}


const x = ref(false)

const reqForm = ref({
  name: "",
  page: 1,
  pageSize: 6,
})
const rooms = ref([])
const total = ref(0)
const getRoomsLoading = ref(false)

const getRooms = () => {
  getRoomsLoading.value = true
  roomApi.list.get(reqForm.value).then(response => {
    rooms.value = response.data.rows || []
    total.value = response.data.total
  }).finally(() => {
    getRoomsLoading.value = false
  })
}

const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
]
const switchDialog = ref(false)
const roomStatusLoading = ref(false)
const handleOpenSwitchDialog = () => {
  if (getRoomsLoading.value) {
    return
  }
  roomStatusLoading.value = true
  switchDialog.value = true
}

const handleRoomStatusSwitch = () => {
  roomStatusLoading.value = false
  switchDialog.value = false
  getRooms()
}

watch(windowHeight, () => {
  getRooms()
}, { immediate: true });

</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>
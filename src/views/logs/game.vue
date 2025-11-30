<template>
  <v-card :height="calculateHeight()">
    <v-card-title class="my-2">
      <div class="card-header">
        <span>游戏日志</span>
        <div class="fcc">
          <v-select
              v-model="selectedWorldID"
              :items="worlds"
              item-title="worldName"
              item-value="id"
              label="世界"
              density="compact"
              class="mr-4"
              @update:model-value="content=''"
          >
          </v-select>
          <v-switch
              v-model="autoPull"
              color="info"
              hide-details
          >
            <template #prepend>
              <v-chip color="info">
                自动刷新
              </v-chip>
            </template>
          </v-switch>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <log :content="content" :height="calculateHeight()-150"/>
      <v-row class="my-4">
        <v-spacer/>
        <v-col cols="6" md="2" class="fcc">
          <v-number-input
              v-model="lines"
              hide-details
              density="compact"
              class="mr-4"
          />
          <v-btn @click="getLogContent">
            刷新
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

</template>

<script setup>
import Log from "@/views/logs/components/log.vue";
import logsApi from "@/api/logs.js";
import roomApi from "@/api/room.js";
import useGlobalStore from "@/plugins/store/global.js";
import {debounce} from "@/utils/tools.js";
import {MdPreview} from "md-editor-v3";


const globalStore = useGlobalStore()
const content = ref('')
const selectedWorldID = ref(0)
const autoPull= ref(true)
const lines = ref(0)

const getLogContent = () => {
  if (selectedWorldID.value === 0) {
    return
  }
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldID.value,
    logType: 'game',
    lines: lines.value,
  }
  logsApi.content.get(reqForm).then(response => {
    content.value = response.data.join("\n")
  })
}

const worlds = ref([])

const getWorlds = async () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }
  const response = await roomApi.worlds.get(reqForm)
  worlds.value = response.data
  selectedWorldID.value = worlds.value[0]?.id || 0
}

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value) {
      getLogContent()
    }
  }, 2000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const calculateLines = () => {
  const other = 380
  // 只返回计算的行数，不设置 lines.value
  return Math.round(Math.max(2, Math.floor(windowHeight.value - other)) / 22.5)
}

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - 160))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  lines.value = calculateLines()
}, 200)

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  await getWorlds()
  lines.value = calculateLines()
  startRequests()
})

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
  window.removeEventListener('resize', handleResize)
})

</script>

<style scoped>
</style>
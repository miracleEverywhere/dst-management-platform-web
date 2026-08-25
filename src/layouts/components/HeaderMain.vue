<template>
  <div
    v-if="mobile"
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <chip-select
        v-model="globalStore.room.id"
        :items="roomBasic"
        :max-width="200"
        color="primary"
        prepend-icon="ri-honour-line"
        class="mr-4"
        @change="handleRoomChange"
      />
    </div>
  </div>
  <div
    v-else
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <chip-select
        v-model="globalStore.room.id"
        :items="roomBasic"
        :max-width="300"
        color="primary"
        prepend-icon="ri-honour-line"
        class="mr-4"
        @change="handleRoomChange"
      >
        <span class="mr-2">
          {{ t('global.room') }}
        </span>
      </chip-select>
    </div>
    <div>
      <v-chip
        :color="getColor()"
        class="mr-4"
        prepend-icon="ri-game-2-line"
      >
        <v-tooltip activator="parent">
          {{ t('global.current') + gameVersion.local }}
          <br>
          {{ t('global.latest') + gameVersion.server }}
        </v-tooltip>
        {{ t('global.gameVersion') + gameVersion.local }}
      </v-chip>
    </div>
    <div>
      <template v-if="dmpVersionGap&&!globalStore.dmpVersion.noTip">
        <v-badge
          v-tooltip="latestVersion"
          location="top right"
          color="error"
          offset-x="24"
          class="cursor-pointer"
        >
          <template #badge>
            <div class="fcc">
              <span @click="noTip">
                New
              </span>
            </div>
          </template>
          <v-chip
            color="info"
            class="mr-4"
            prepend-icon="ri-medal-2-line"
          >
            {{ t('global.dmpVersion') + Version }}
          </v-chip>
        </v-badge>
      </template>
      <template v-else>
        <v-chip
          color="info"
          class="mr-4"
          prepend-icon="ri-medal-2-line"
        >
          {{ t('global.dmpVersion') + Version }}
        </v-chip>
      </template>
    </div>
  </div>
</template>

<script setup>
import { Version } from "@/config/index"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify"
import { truncateString } from "@/utils/tools.js"
import useGlobalStore from "@store/global"
import platformApi from "@/api/platform.js"
import roomApi from "@/api/room.js"
import ChipSelect from "./ChipSelect.vue"


const { t } = useI18n()
const { mobile } = useDisplay()
const globalStore = useGlobalStore()
const refresh = inject('refresh')

const roomBasic = ref([])

const gameVersion = ref({
  local: 0,
  server: 0,
})

const getGameVersion = async () => {
  try {
    const response = await platformApi.gameVersion.get()

    gameVersion.value = response.data
    globalStore.gameVersion = gameVersion.value
  } catch {

  }
}

const getRoomPermittedBasic = () => {
  roomApi.permittedBasic.get().then(response => {
    roomBasic.value = response.data || []
    for (let room of roomBasic.value) {
      if (room.roomID === globalStore.room.id && room.roomName === globalStore.room.gameName) {
        return
      }
    }
    globalStore.room.id = 0
    globalStore.room.gameName = ""
  })
}

const getColor = () => {
  if (gameVersion.value.local === 0) {
    return 'error'
  }
  if (gameVersion.value.local !== gameVersion.value.server) {
    return 'warning'
  }
  
  return 'success'
}

const dmpVersionGap = ref(false)
const latestVersion = ref('')

const getLatestVersion = async () => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/miracleEverywhere/dst-management-platform-api/releases/latest',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      },
    )

    if (!response.ok) {
      dmpVersionGap.value = false
      
      return
    }

    const releases = await response.json()

    latestVersion.value = releases.tag_name
    dmpVersionGap.value = releases.tag_name !== Version
    if (releases.tag_name !== globalStore.dmpVersion.closeVersion) {
      globalStore.dmpVersion.noTip = false
    }

    // dmpVersionGap.value = true
  } catch {
    dmpVersionGap.value = false
  }
}

const noTip = () => {
  globalStore.dmpVersion.noTip = true
  globalStore.dmpVersion.closeVersion = latestVersion.value
}

const handleRoomChange = async () => {
  await refresh()
}

onMounted(async () => {
  await getGameVersion()
  getRoomPermittedBasic()
  await getLatestVersion()
})
</script>


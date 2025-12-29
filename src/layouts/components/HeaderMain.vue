<template>
  <div
    v-if="mobile"
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <v-chip
        v-if="globalStore.room.id"
        label
        color="primary"
        prepend-icon="ri-honour-line"
      >
        {{ truncateString(globalStore.room.gameName, 8) }}
      </v-chip>
      <v-chip
        v-else
        label
        color="primary"
        prepend-icon="ri-honour-line"
      >
        {{ t('global.noRoom') }}
      </v-chip>
    </div>
  </div>
  <div
    v-else
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <v-chip
        v-if="globalStore.room.id"
        color="primary"
        class="mr-4"
        prepend-icon="ri-honour-line"
      >
        {{ t('global.room') + truncateString(globalStore.room.gameName, 15) }}
      </v-chip>
      <v-chip
        v-else
        color="primary"
        class="mr-4"
        prepend-icon="ri-honour-line"
      >
        {{ t('global.room') + t('global.noRoom') }}
      </v-chip>
    </div>
    <div>
      <v-chip
        :color="getColor()"
        class="mr-4"
        prepend-icon="ri-game-2-line"
      >
        {{ t('global.gameVersion') + gameVersion.local }}
      </v-chip>
    </div>
    <div>
      <template v-if="dmpVersionGap!==0">
        <v-badge location="top right" color="error" :content="dmpVersionGap" offset-x="24">
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


const { t } = useI18n()
const { mobile } = useDisplay()
const globalStore = useGlobalStore()

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

const getRoomBasic = () => {
  roomApi.basic.get().then(response => {
    const roomBasic = response.data || []
    for (let room of roomBasic) {
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

const dmpVersionGap = ref(0)

const getLatestVersion = async () => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/miracleEverywhere/dst-management-platform-api/releases',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )
    if (!response.ok) {
      dmpVersionGap.value = 0
      return
    }

    const releases = await response.json()

    // 使用 findIndex 找到当前版本的索引
    const currentVersionIndex = releases.findIndex(release =>
      release.tag_name === Version
    )

    if (currentVersionIndex === -1) {
      // 当前版本不在列表中
      dmpVersionGap.value = releases.length
    } else {
      // 当前版本是第几个（索引值）
      dmpVersionGap.value = currentVersionIndex
    }
  } catch (err) {
    dmpVersionGap.value = 0
  }
}

onMounted(async () => {
  await getGameVersion()
  getRoomBasic()
  await getLatestVersion()
})
</script>


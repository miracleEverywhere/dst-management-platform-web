<template>
  <div
    v-if="mobile"
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <chip-select
        v-model="globalStore.room.id"
        :items="globalStore.roomBasic"
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
        :items="globalStore.roomBasic"
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
      <v-badge
        :model-value="showUpdateBadge"
        location="top right"
        color="error"
        offset-x="24"
      >
        <template #badge>
          <div class="fcc cursor-pointer">
            <span @click="dismissUpdateTip">
              New
            </span>
          </div>
        </template>
        <v-chip
          color="info"
          class="mr-4"
          prepend-icon="ri-medal-2-line"
        >
          <v-tooltip
            activator="parent"
            interactive
            location="bottom"
          >
            <div style="max-width: 340px;">
              <span class="mr-4">
                {{ t('global.current') + (dmpVersion.current || '--') }}
              </span>
              <span v-if="dmpVersion.latest">
                {{ t('global.latest') + dmpVersion.latest }}
              </span>
              <div
                v-if="dmpVersion.checkFailed"
                class="mt-1"
              >
                {{ t('selfUpdate.checkFailed') }}
              </div>
              <template v-else>
                <div class="mt-2">
                  {{ t('selfUpdate.notes') }}
                </div>
                <v-container style="max-height: 200px; overflow: auto;">
                  <div
                    v-for="(line, index) in notesLines"
                    :key="index"
                  >
                    {{ line }}
                  </div>
                </v-container>
              </template>
              <div
                v-if="reasonText"
                class="mt-1"
              >
                {{ reasonText }}
              </div>
              <div class="d-flex align-center my-4">
                <v-btn
                  v-if="canUpdate"
                  size="small"
                  color="primary"
                  variant="tonal"
                  @click="openUpdateDialog"
                >
                  {{ t('selfUpdate.updateNow') }}
                </v-btn>
                <v-btn
                  v-else-if="dmpVersion.updatable"
                  size="small"
                  variant="tonal"
                  disabled
                >
                  {{ t('selfUpdate.updateNow') }}
                </v-btn>
                <v-btn
                  v-else
                  size="small"
                  variant="tonal"
                  :loading="dmpVersion.loading"
                  @click="checkVersion(true)"
                >
                  {{ t('selfUpdate.checkNow') }}
                </v-btn>
              </div>
            </div>
          </v-tooltip>
          {{ t('global.dmpVersion') + (dmpVersion.current || '--') }}
        </v-chip>
      </v-badge>
    </div>
  </div>
  <dmp-update-dialog />
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify"
import useGlobalStore from "@store/global"
import useUserStore from "@store/user"
import platformApi from "@/api/platform.js"
import roomApi from "@/api/room.js"
import { dmpVersion, fetchDmpVersion, openSelfUpdateDialog, releaseNoteLines } from "@/utils/selfUpdate.js"
import ChipSelect from "./ChipSelect.vue"


const { t, te } = useI18n()
const { mobile } = useDisplay()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const refresh = inject('refresh')

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
    globalStore.roomBasic = response.data || []
    for (let room of globalStore.roomBasic) {
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

const isAdmin = computed(() => userStore.userInfo.role === 'admin')

// 服务端最新 Release 的说明，tooltip 里去掉 Markdown 控制字符并截断
const notesLines = computed(() => releaseNoteLines(dmpVersion.notes))

// 有更新且当前环境能在网页上升级，才允许点「立即更新」
const canUpdate = computed(() => dmpVersion.updatable && dmpVersion.canSelfUpdate && isAdmin.value)

const reasonText = computed(() => {
  if (!dmpVersion.updatable) return ''
  if (!isAdmin.value) return t('selfUpdate.notAdmin')
  if (dmpVersion.canSelfUpdate) return ''

  const key = `selfUpdate.reason.${dmpVersion.reason || 'unsupported'}`

  return te(key) ? t(key) : t('selfUpdate.reason.unsupported')
})

// New 角标的显示与关闭规则：关掉后只在出现更新的版本时再提醒
const showUpdateBadge = computed(() => {
  if (!dmpVersion.updatable) return false
  if (!globalStore.dmpVersion.noTip) return true

  return dmpVersion.latest !== globalStore.dmpVersion.closeVersion
})

const dismissUpdateTip = () => {
  globalStore.dmpVersion.noTip = true
  globalStore.dmpVersion.closeVersion = dmpVersion.latest
}

const checkVersion = refresh => {
  fetchDmpVersion({ refresh })
}

const openUpdateDialog = () => {
  openSelfUpdateDialog()
}

const handleRoomChange = async () => {
  globalStore.room.gameName = globalStore.roomBasic.find(item => item.roomID === globalStore.room.id)?.roomName
  await refresh()
}

onMounted(async () => {
  await getGameVersion()
  getRoomPermittedBasic()
  fetchDmpVersion()
})
</script>

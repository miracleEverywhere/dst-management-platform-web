<template>
  <template v-if="globalStore.room.name===''">
    <result
      type="error"
      :title="t('global.result.title')"
      :sub-title="t('global.result.subTitle')"
      :height="windowHeight"
    />
  </template>
  <template v-else>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item
          :color="step > 0 ? 'success' : ''"
          :complete="step > 0"
          :value="0"
          title="房间设置"
        >
          <template #icon>
            <v-icon
              icon="ri-number-1"
              size="12"
            />
          </template>
        </v-stepper-item>
        <v-divider />

        <v-stepper-item
          :color="step > 1 ? 'success' : ''"
          :complete="step > 1"
          :value="1"
          title="世界设置"
        >
          <template #icon>
            <v-icon
              icon="ri-number-2"
              size="12"
            />
          </template>
        </v-stepper-item>
        <v-divider />

        <v-stepper-item
          :color="step > 2 ? 'success' : ''"
          :complete="step > 2"
          :value="2"
          title="模组设置"
        >
          <template #icon>
            <v-icon
              icon="ri-number-3"
              size="12"
            />
          </template>
        </v-stepper-item>
        <v-divider />

        <v-stepper-item
          :color="step > 3 ? 'success' : ''"
          :complete="step > 3"
          :value="3"
          title="系统设置"
        >
          <template #icon>
            <v-icon
              icon="ri-number-4"
              size="12"
            />
          </template>
        </v-stepper-item>
        <v-divider />

        <v-stepper-item
          :color="step > 4 ? 'success' : ''"
          :complete="step > 4"
          :value="4"
          title="设置完成"
        >
          <template #icon>
            <v-icon
              icon="ri-number-5"
              size="12"
            />
          </template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window
        v-model="step"
        class="mt-4"
      >
        <v-stepper-window-item :value="0">
          <v-container
            v-if="dataGot"
            :height="calculateContainerSize()"
            style="overflow-y: auto"
          >
            <room
              ref="roomRef"
              :last-room-i-d="lastRoomID"
              :form-data="roomData"
            />
          </v-container>
          <result
            v-else
            type="info"
            :title="t('game.base.loading')"
            :height="calculateContainerSize()"
          />
        </v-stepper-window-item>
        <v-stepper-window-item :value="1">
          <v-container
            v-if="dataGot"
            :height="calculateContainerSize()"
            style="overflow-y: auto"
          >
            <world
              ref="worldRef"
              :last-room-i-d="lastRoomID"
              :form-data="worldData"
              :game-mode="roomData.gameMode"
              :theme="globalStore.theme"
              :tab-window-height="calculateContainerSize()-300"
            />
          </v-container>
          <result
            v-else
            type="info"
            :title="t('game.base.loading')"
            :height="calculateContainerSize()"
          />
        </v-stepper-window-item>
        <v-stepper-window-item :value="2">
          <v-container
            v-if="dataGot"
            :height="calculateContainerSize()"
            style="overflow-y: auto"
          >
            <mod
              ref="modRef"
              :worlds="worldData"
              :mod="roomData.modData"
              :mod-in-one="roomData.modInOne"
              :theme="globalStore.theme"
              :tab-window-height="calculateContainerSize()-110"
            />
          </v-container>
          <result
            v-else
            type="info"
            :title="t('game.base.loading')"
            :height="calculateContainerSize()"
          />
        </v-stepper-window-item>
        <v-stepper-window-item :value="3">
          <v-container
            v-if="dataGot"
            :height="calculateContainerSize()"
            style="overflow-y: auto"
          >
            <room-setting ref="roomSettingRef" />
          </v-container>
          <result
            v-else
            type="info"
            :title="t('game.base.loading')"
            :height="calculateContainerSize()"
          />
        </v-stepper-window-item>
        <v-stepper-window-item :value="4">
          <result
            type="success"
            :height="calculateContainerSize()"
            :title="t('game.base.step5.title')"
            :sub-title="t('game.base.step5.subTitle')"
          />
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions class="mx-8">
        <template #prev>
          <v-btn
            :disabled="step===0"
            color="grey-lighten-3"
            variant="elevated"
            @click="handlePrev"
          >
            {{ t('game.prev') }}
          </v-btn>
        </template>
        <template #next>
          <v-btn
            v-if="step!==4"
            color="primary"
            variant="elevated"
            @click="handleNext"
          >
            {{ t('game.next.button') }}
          </v-btn>
          <v-btn
            v-if="step===4"
            color="success"
            :disabled="false"
            :loading="saveButtonLoading"
            variant="elevated"
            @click="handleSave"
          >
            {{ t('game.next.save') }}
          </v-btn>
        </template>
      </v-stepper-actions>
    </v-stepper>
  </template>
</template>

<script setup>
import { debounce } from "@/utils/tools.js"
import useUserStore from "@store/user.js"
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import room from "@/views/game/components/room.vue"
import world from "@/views/game/components/world.vue"
import mod from "@/views/game/components/mod.vue"
import roomSetting from "@/views/game/components/roomSetting.vue"
import roomApi from "@/api/room.js"
import { showSnackbar } from "@/utils/snackbar.js"
import {useRouter} from "vue-router";


onMounted(async () => {
  await Promise.all([getRoomLastID(), getRoomTotalInfo()])
  dataGot.value = true

  // 添加事件监听
  window.addEventListener('resize', handleResize)
})

// 防抖处理resize事件
const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

// 在组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const windowHeight = ref(window.innerHeight)
const userStore = useUserStore()
const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const router = useRouter()
const { t } = useI18n()


// 判断是否获取到接口数据，为了component回显
const dataGot = ref(false)
// 不重复的生成相关端口
const lastRoomID = ref(0)

const getRoomTotalInfo = async () => {
  if (globalStore.room.id !== 0) {
    const response = await roomApi.base.get({ id: globalStore.room.id })
    roomData.value = response.data.roomData
    worldData.value = response.data.worldData
    DBToRoomSetting(response.data.roomSettingData)
  }
}

const getRoomLastID = async () => {
  const response = await roomApi.lastID.get()
  lastRoomID.value = response.data
}

const step = ref(0)

const calculateContainerSize = () => {
  // 64(navbar) + 72(step header) + 54(step action) + 24(card margins) = 304
  const other = 304

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const handlePrev = () => {
  step.value--
}

const handleNext = async () => {
  if (step.value === 0) {
    if (roomRef.value) {
      const result = await roomRef.value.validate()
      if (result.validate) {
        roomData.value = result.formData
        step.value++
      }
    }
  }
  if (step.value === 1) {
    if (worldRef.value) {
      const result = await worldRef.value.validate()
      if (result.validate) {
        worldData.value = result.formData
        step.value++
      }
    }
  }
  if (step.value === 2) {
    if (modRef.value) {
      const result = await modRef.value.validate()
      if (result.validate) {
        modData.value = result.formData
        step.value++
      }
    }
  }
  if (step.value === 3) {
    if (roomSettingRef.value) {
      const result = await roomSettingRef.value.validate()

      console.log(result)
      if (result.validate) {
        roomSettingData.value = result.formData
        step.value++
      }
    }
  }
}

const roomRef = ref()

const roomData = ref({

})

const worldRef = ref()
const worldData = ref([])

const modRef = ref()
const modData = ref()

const roomSettingRef = ref()
const roomSettingData = ref({})

const roomSettingToDB = () => {
  return {
    roomID: 0,
    backupEnable: roomSettingData.value.backup.enable,
    backupSetting: JSON.stringify(roomSettingData.value.backup.setting),
    backupCleanEnable: roomSettingData.value.backupClean.enable,
    backupCleanSetting: roomSettingData.value.backupClean.setting,
    restartEnable: roomSettingData.value.restart.enable,
    restartSetting: roomSettingData.value.restart.setting,
    keepaliveEnable: roomSettingData.value.keepalive.enable,
    keepaliveSetting: roomSettingData.value.keepalive.setting,
    scheduledStartStopEnable: roomSettingData.value.scheduledStartStop.enable,
    scheduledStartStopSetting: JSON.stringify(roomSettingData.value.scheduledStartStop.setting),
    tickRate: roomSettingData.value.tickRate,
    bit64: roomSettingData.value.bit64,
  }
}

const DBToRoomSetting = data => {
  roomSettingData.value = {
    backup: {
      enable: data.backupEnable,
      setting: JSON.parse(data.backupSetting),
    },
    backupClean: {
      enable: data.backupCleanEnable,
      setting: data.backupCleanSetting,
    },
    restart: {
      enable: data.restartEnable,
      setting: data.restartSetting,
    },
    keepalive: {
      enable: data.keepaliveEnable,
      setting: data.keepaliveSetting,
    },
    scheduledStartStop: {
      enable: data.scheduledStartStopEnable,
      setting: JSON.parse(data.scheduledStartStopSetting),
    },
    tickRate: data.tickRate,
    bit64: data.bit64,
  }
}

const saveButtonLoading = ref(false)

const handleSave = () => {
  const reqForm = {
    roomData: roomData.value,
    worldData: worldData.value,
    roomSettingData: roomSettingToDB(),
  }

  if (globalStore.room.id) {
    // 修改
  } else {
    // 创建
    for (let i = 0; i < reqForm.worldData.length; i++) {
      if (modData.value.modInOne) {
        reqForm.roomData.modInOne = true
        reqForm.roomData.modData = modData.value.modData
      } else {
        reqForm.worldData[i]['id'] = 0
        reqForm.worldData[i].modData = modData.value.worlds[i].modData
        delete reqForm.worldData[i].name
      }
    }
    saveButtonLoading.value = true
    roomApi.base.post(reqForm).then(response => {
      showSnackbar(response.message)
      globalStore.room = {
        id: response.data.id,
        gameName: response.data.gameName,
      }
      router.push('/dashboard')
    }).finally(() => {
      saveButtonLoading.value = false
    })
  }
}
</script>


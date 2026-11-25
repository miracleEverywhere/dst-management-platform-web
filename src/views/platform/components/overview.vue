<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.memoryTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-ram-2-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.memory') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ formatBytes(overviewData.memory) }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.runningTimeTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-time-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.runningTime') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <time-running :seconds="overviewData.runningTime" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.roomCountTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-instance-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.roomCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.roomCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.worldCountTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-gamepad-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.worldCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.worldCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.userCountTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-group-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.userCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.userCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.uidCountTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-id-card-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.uidCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.uidCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.maxCpuTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-cpu-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxCpu') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxCpu?overviewData.maxCpu.toFixed(2):overviewData.maxCpu }} %
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.maxMemoryTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-ram-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxMemory') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxMemory?overviewData.maxMemory.toFixed(2):overviewData.maxMemory }} %
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.maxNetUpTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-upload-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxNetUp') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxNetUp?overviewData.maxNetUp.toFixed(2):overviewData.maxNetUp }} KB/s
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.maxNetDownTip')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-download-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxNetDown') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxNetDown?overviewData.maxNetDown.toFixed(2):overviewData.maxNetDown }} KB/s
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.gameVersionServer')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-bank-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.gameVersionServer') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ globalStore.gameVersion.server }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card v-tooltip="t('platform.overview.gameVersionLocal')">
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-government-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.gameVersionLocal') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ globalStore.gameVersion.local }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-restart-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.dmpVersion') }}
          </span>
        </template>
        <template #append>
          <v-btn
            v-if="canUpdate"
            color="warning"
            size="small"
            variant="text"
            @click="openSelfUpdateDialog"
          >
            {{ t('selfUpdate.updateNow') }}
          </v-btn>
          <v-btn
            v-else-if="dmpVersion.updatable"
            size="small"
            variant="text"
            disabled
          >
            {{ t('selfUpdate.updateNow') }}
          </v-btn>
          <v-btn
            v-else
            size="small"
            variant="text"
            :loading="dmpVersion.loading"
            @click="checkVersion"
          >
            {{ t('selfUpdate.checkNow') }}
          </v-btn>
        </template>
        <v-card-text class="d-flex align-center justify-end ga-2">
          <span>{{ dmpVersion.current || '--' }}</span>
          <v-chip
            v-if="dmpVersion.updatable"
            color="success"
            size="x-small"
            variant="tonal"
          >
            {{ dmpVersion.latest }}
          </v-chip>
          <v-icon
            v-if="statusText"
            v-tooltip="statusText"
            class="text-medium-emphasis"
            icon="ri-information-line"
            size="16"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import platformApi from "@/api/platform"
import { formatBytes } from "@/utils/tools"
import { CountTo } from "vue3-count-to"
import { useI18n } from "vue-i18n"
import useGlobalStore from "@store/global"
import useUserStore from "@store/user"
import { dmpVersion, fetchDmpVersion, openSelfUpdateDialog } from "@/utils/selfUpdate.js"


const globalStore = useGlobalStore()
const userStore = useUserStore()

const { t, te } = useI18n()

const canUpdate = computed(() => dmpVersion.updatable && dmpVersion.canSelfUpdate && userStore.userInfo.role === 'admin')

const reasonText = computed(() => {
  if (!dmpVersion.updatable) return ''
  if (userStore.userInfo.role !== 'admin') return t('selfUpdate.notAdmin')
  if (dmpVersion.canSelfUpdate) return ''

  const key = `selfUpdate.reason.${dmpVersion.reason || 'unsupported'}`

  return te(key) ? t(key) : t('selfUpdate.reason.unsupported')
})

// 状态说明收进 tooltip，避免卡片比同行其它卡片多出一行
const statusText = computed(() => {
  if (reasonText.value) return reasonText.value
  if (dmpVersion.checkFailed) return t('selfUpdate.checkFailed')
  if (dmpVersion.loaded && !dmpVersion.updatable) return t('selfUpdate.upToDate')

  return ''
})

const checkVersion = () => {
  fetchDmpVersion({ refresh: true })
}

const overviewData = ref({
  runningTime: undefined,
  memory: undefined,
  roomCount: undefined,
  worldCount: undefined,
  userCount: undefined,
  uidCount: undefined,
  maxCpu: undefined,
  maxMemory: undefined,
  maxNetUp: undefined,
  maxNetDown: undefined,
})

const overviewDataLoading = ref(false)

const getOverviewData = () => {
  overviewDataLoading.value = true
  platformApi.overview.get().then(response => {
    overviewData.value = response.data
  }).finally(() => {
    overviewDataLoading.value = false
  })
}

onMounted(() => {
  getOverviewData()

  // 顶部版本 chip 通常已经查过，这里只补一次
  if (!dmpVersion.loaded) fetchDmpVersion()
})
</script>


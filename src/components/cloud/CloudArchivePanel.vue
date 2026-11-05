<template>
  <v-sheet
    border
    rounded
  >
    <v-toolbar flat>
      <v-toolbar-title>
        <v-icon
          icon="ri-cloud-line"
          start
        />
        <span v-if="!mobile">{{ t('cloud.archives.title') }}</span>
      </v-toolbar-title>
      <v-chip
        v-if="!loading && !error"
        label
        color="primary"
        variant="tonal"
      >
        {{ t('cloud.archives.quota', { used: quota.used, quota: quota.quota }) }}
      </v-chip>
      <v-btn
        v-tooltip="t('cloud.archives.uploadTip')"
        class="ml-2"
        prepend-icon="ri-upload-cloud-2-line"
        color="success"
        :disabled="quota.quota === 0"
        :loading="uploading"
        @click="handleUpload"
      >
        {{ t('cloud.archives.upload') }}
      </v-btn>
      <v-btn
        prepend-icon="ri-refresh-line"
        color="default"
        class="ml-2"
        :loading="loading"
        @click="getArchives"
      >
        {{ t('cloud.common.refresh') }}
      </v-btn>
    </v-toolbar>

    <v-alert
      v-if="quota.quota === 0 && !loading && !error"
      type="warning"
      variant="tonal"
      class="ma-4"
    >
      {{ t('cloud.archives.ultimateOnly') }}
    </v-alert>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="ma-4"
    >
      <div class="d-flex align-center flex-wrap">
        <span class="mr-4">{{ error }}</span>
        <v-btn
          to="/profile"
          color="primary"
          variant="text"
        >
          {{ t('cloud.common.goBind') }}
        </v-btn>
      </div>
    </v-alert>

    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      :loading="loading"
    >
      <template #loading>
        <v-skeleton-loader type="table-row@5" />
      </template>
      <template #item.name="{ item }">
        <div class="text-truncate font-weight-medium">
          {{ item.name || '-' }}
        </div>
      </template>
      <template #item.remark="{ item }">
        <div
          class="text-truncate"
          :title="item.remark"
        >
          <span v-tooltip="item.remark || '-'">
            {{ item.remark || '-' }}
          </span>
        </div>
      </template>
      <template #item.sizeBytes="{ item }">
        <v-chip label>
          {{ formatBytes(item.sizeBytes || 0) }}
        </v-chip>
      </template>
      <template #item.createdAt="{ item }">
        {{ unix2time(item.createdAt) }}
      </template>
      <template #item.downloadCount="{ item }">
        <v-chip
          color="info"
          label
        >
          {{ item.downloadCount || 0 }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          v-if="canImport"
          v-tooltip="t('cloud.archives.importTip')"
          color="success"
          variant="text"
          prepend-icon="ri-import-line"
          :loading="importingId === item.id"
          @click="handleImport(item)"
        >
          {{ t('cloud.archives.import') }}
        </v-btn>
        <v-btn
          color="info"
          variant="text"
          prepend-icon="ri-download-line"
          :loading="downloadingId === item.id"
          @click="handleDownload(item)"
        >
          {{ t('cloud.archives.download') }}
        </v-btn>
      </template>
      <template #no-data>
        <div class="d-flex flex-column align-center py-10">
          <v-icon
            icon="ri-hard-drive-2-line"
            size="48"
            color="grey"
            class="mb-4"
          />
          <div class="text-subtitle-1">
            {{ t('cloud.archives.empty.title') }}
          </div>
          <div class="text-body-2 text-medium-emphasis mt-2">
            {{ t('cloud.archives.empty.subTitle') }}
          </div>
        </div>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import cloudApi from "@/api/cloud"
import roomApi from "@/api/room"
import { cloudErrorText } from "@/utils/cloud"
import useGlobalStore from "@store/global"
import useUserStore from "@store/user"
import { showSnackbar } from "@/utils/snackbar"
import { formatBytes, unix2time } from "@/utils/tools"

const { t } = useI18n()
const { mobile } = useDisplay()
const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()

const loading = ref(false)
const error = ref('')
const items = ref([])

const quota = ref({
  quota: 0,
  used: 0,
  maxBytes: 0,
})

const headers = computed(() => [
  { title: t('cloud.archives.columns.name'), key: 'name', sortable: false },
  { title: t('cloud.archives.columns.remark'), key: 'remark', sortable: false, maxWidth: 220 },
  { title: t('cloud.archives.columns.size'), key: 'sizeBytes', sortable: false, align: 'center' },
  { title: t('cloud.archives.columns.createdAt'), key: 'createdAt', sortable: false, align: 'center', minWidth: 220 },
  { title: t('cloud.archives.columns.downloadCount'), key: 'downloadCount', sortable: false, align: 'center', minWidth: 120 },
  { title: t('cloud.archives.columns.actions'), key: 'actions', sortable: false, align: 'center', minWidth: 220 },
])

const getArchives = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await cloudApi.archives.get()

    items.value = response.data?.items || []
    quota.value = {
      quota: response.data?.quota || 0,
      used: response.data?.used || 0,
      maxBytes: response.data?.maxBytes || 0,
    }
  } catch (err) {
    error.value = cloudErrorText(err, t('cloud.archives.unlinkedTip'))
    items.value = []
  } finally {
    loading.value = false
  }
}

const uploading = ref(false)

const handleUpload = async () => {
  if (!globalStore.room.id) {
    showSnackbar(t('cloud.archives.noRoom'), 'error')

    return
  }

  uploading.value = true
  try {
    const response = await cloudApi.archives.upload.post({ roomID: globalStore.room.id })

    showSnackbar(response.message)
    await getArchives()
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    uploading.value = false
  }
}

const downloadingId = ref('')

const handleDownload = async item => {
  downloadingId.value = item.id
  try {
    await cloudApi.archives.download(item.id, item.fileName || `${item.name || 'archive'}.zip`)
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    downloadingId.value = ''
  }
}

// 导入会创建一个新房间，仅管理员或有建房权限的账号可用
const canImport = computed(() => {
  return userStore.userInfo.role === 'admin' || Boolean(userStore.userInfo.roomCreation)
})

const importingId = ref('')

const refreshRooms = async room => {
  try {
    const response = await roomApi.permittedBasic.get()

    globalStore.roomBasic = response.data || []
  } catch {
    // 刷新房间列表失败不阻断导入后的跳转
  }

  if (!room.id) return

  globalStore.room.id = room.id
  globalStore.room.gameName = room.gameName || ''
  if (!globalStore.roomBasic.some(item => item.roomID === room.id)) {
    globalStore.roomBasic.push({
      roomID: room.id,
      roomName: room.gameName,
      status: true,
    })
  }
}

const handleImport = async item => {
  importingId.value = item.id
  try {
    const response = await cloudApi.archives.importArchive(item.id)
    const room = response.data || {}

    await refreshRooms(room)
    showSnackbar(response.message)

    if (room.id) {
      await router.push('/game/base')
    }
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    importingId.value = ''
  }
}

onMounted(() => {
  getArchives()
})
</script>

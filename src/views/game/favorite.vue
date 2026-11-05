<template>
  <check
    :category="['game']"
    :other-height="otherHeight"
  >
    <v-tabs
      v-model="activeTab"
      class="mt-2"
      color="primary"
      align-tabs="start"
    >
      <v-tab value="local">
        {{ t('cloud.favorite.localTab') }}
      </v-tab>
      <v-tab value="cloud">
        {{ t('cloud.favorite.cloudTab') }}
      </v-tab>
    </v-tabs>
    <v-tabs-window
      v-model="activeTab"
      class="mt-2"
    >
      <v-tabs-window-item value="local">
        <v-sheet
          border
          rounded
        >
          <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="pageSize"
            class="favorite-table"
            :headers="headers"
            :items="items"
            :items-length="total"
            :items-per-page-options="[10, 20, 50]"
            :loading="loading"
            @update:options="getFavorites"
          >
            <template #loading>
              <v-skeleton-loader type="table-row@10" />
            </template>
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>
                  <v-icon
                    icon="ri-bookmark-3-line"
                    start
                  />
                  <span v-if="!mobile">{{ t('game.favorite.title') }}</span>
                </v-toolbar-title>
                <v-chip
                  v-if="cloudStatus.linked"
                  color="primary"
                  variant="tonal"
                  prepend-icon="ri-cloud-line"
                  label
                  class="mr-2 my-1"
                >
                  {{ t('cloud.favorite.linkedChip', { plan: planLabel, used: cloudStatus.favoriteCount, quota: cloudStatus.favoriteQuota }) }}
                </v-chip>
                <v-chip
                  v-else
                  color="warning"
                  variant="tonal"
                  prepend-icon="ri-cloud-off-line"
                  class="mr-2 my-1"
                  @click="goProfile"
                >
                  {{ t('cloud.common.unlinked') }}
                </v-chip>
                <v-btn
                  v-tooltip="t('cloud.sync.now')"
                  icon="ri-refresh-line"
                  size="small"
                  color="primary"
                  variant="text"
                  :disabled="!cloudStatus.linked"
                  :loading="syncLoading === 'both'"
                  @click="handleSync('both')"
                />
                <v-btn
                  v-tooltip="canUpload ? t('cloud.sync.upload') : t('cloud.sync.quotaTip')"
                  icon="ri-upload-2-line"
                  size="small"
                  color="info"
                  variant="text"
                  :disabled="!cloudStatus.linked || !canUpload"
                  :loading="syncLoading === 'upload'"
                  @click="handleSync('upload')"
                />
                <v-btn
                  v-tooltip="t('cloud.sync.download')"
                  icon="ri-download-2-line"
                  size="small"
                  color="success"
                  variant="text"
                  :disabled="!cloudStatus.linked"
                  :loading="syncLoading === 'download'"
                  @click="handleSync('download')"
                />
                <v-btn
                  prepend-icon="ri-bookmark-3-line"
                  color="primary"
                  :disabled="!globalStore.room.id"
                  @click="openSaveDialog"
                >
                  {{ t('game.favorite.save.title') }}
                </v-btn>
                <v-btn
                  prepend-icon="ri-refresh-line"
                  color="default"
                  class="ml-2"
                  :loading="loading"
                  @click="getFavorites"
                >
                  {{ t('game.favorite.refresh') }}
                </v-btn>
              </v-toolbar>
            </template>
            <template #item.gameName="{ item }">
              <div
                class="text-truncate font-weight-medium"
                :title="favoriteName(item)"
              >
                {{ favoriteName(item) }}
              </div>
            </template>
            <template #item.remark="{ item }">
              <div class="text-truncate">
                <span
                  v-if="item.remark"
                  v-tooltip="item.remark"
                >
                  {{ item.remark }}
                </span>
                <span
                  v-else
                  class="text-medium-emphasis"
                >
                  {{ t('game.favorite.noRemark') }}
                </span>
              </div>
            </template>
            <template #item.gameMode="{ item }">
              <div
                class="text-truncate"
                :title="gameModeName(item)"
              >
                <v-chip
                  label
                  color="info"
                  style="max-width: 100%"
                >
                  {{ gameModeName(item) }}
                </v-chip>
              </div>
            </template>
            <template #item.worlds="{ item }">
              <v-chip label>
                {{ worldCount(item) }}
              </v-chip>
            </template>
            <template #item.mods="{ item }">
              <v-chip label>
                {{ modCount(item) }}
              </v-chip>
            </template>
            <template #item.createdAt="{ item }">
              {{ timestamp2time(item.createdAt) }}
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex align-center justify-end flex-nowrap">
                <v-tooltip :text="t('game.favorite.actions.apply')">
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      icon="ri-play-line"
                      size="small"
                      color="success"
                      variant="text"
                      :disabled="!canCreate"
                      @click="openApply(item)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="t('game.favorite.actions.viewMods')">
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      icon="ri-rocket-2-line"
                      size="small"
                      color="primary"
                      variant="text"
                      class="ml-1"
                      :disabled="modCount(item) === 0"
                      @click="openMods(item)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="t('game.favorite.actions.rename')">
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      icon="ri-price-tag-3-line"
                      size="small"
                      color="info"
                      variant="text"
                      class="ml-1"
                      @click="openRename(item)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="t('game.favorite.actions.delete')">
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      icon="ri-delete-bin-line"
                      size="small"
                      color="error"
                      variant="text"
                      class="ml-1"
                      @click="openDelete(item)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </template>
            <template #no-data>
              <div class="d-flex flex-column align-center py-10">
                <v-icon
                  icon="ri-star-smile-line"
                  size="48"
                  color="grey"
                  class="mb-4"
                />
                <div class="text-subtitle-1">
                  {{ t('game.favorite.empty.title') }}
                </div>
                <div class="text-body-2 text-medium-emphasis mt-2">
                  {{ t('game.favorite.empty.subTitle') }}
                </div>
              </div>
            </template>
          </v-data-table-server>
        </v-sheet>
      </v-tabs-window-item>
      <v-tabs-window-item value="cloud">
        <v-sheet
          border
          rounded
        >
          <cloud-favorites-table
            ref="cloudTableRef"
            :linked="cloudStatus.linked"
          />
        </v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>

    <v-dialog
      v-model="applyVisible"
      :max-width="mobile?'90%':'40%'"
      persistent
    >
      <v-card :title="t('game.favorite.apply.title')">
        <v-card-text>
          <v-form
            ref="applyFormRef"
            @submit.prevent="applyFavorite"
          >
            <v-text-field
              v-model="applyForm.gameName"
              :label="t('game.favorite.apply.name')"
              :placeholder="t('game.favorite.apply.namePlaceholder')"
              :rules="[nameRule]"
              persistent-placeholder
              autofocus
            />
          </v-form>
          <div class="mt-6">
            {{ t('game.favorite.apply.tip') }}
          </div>
          <div class="mt-2">
            {{ t('game.favorite.gameMode') }}: {{ gameModeName(applyTarget) }}
            · {{ t('game.favorite.worlds') }}: {{ worldCount(applyTarget) }}
            · {{ t('game.favorite.mods') }}: {{ modCount(applyTarget) }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="applyVisible=false"
          >
            {{ t('game.favorite.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="applyLoading"
            @click="applyFavorite"
          >
            {{ t('game.favorite.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="renameVisible"
      :max-width="mobile?'90%':'40%'"
      persistent
    >
      <v-card :title="t('game.favorite.rename.title')">
        <v-card-text>
          <v-text-field
            v-model="renameForm.remark"
            :label="t('game.favorite.rename.label')"
            :placeholder="t('game.favorite.save.remarkPlaceholder')"
            maxlength="100"
            persistent-placeholder
            counter
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="renameVisible=false"
          >
            {{ t('game.favorite.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="renameLoading"
            @click="renameFavorite"
          >
            {{ t('game.favorite.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="saveVisible"
      :max-width="mobile?'90%':'40%'"
      persistent
    >
      <v-card :title="t('game.favorite.save.title')">
        <v-card-text>
          <v-text-field
            :model-value="globalStore.room.gameName"
            :label="t('game.favorite.save.gameName')"
            readonly
            variant="outlined"
            density="compact"
          />
          <v-text-field
            v-model="saveForm.remark"
            :label="t('game.favorite.save.remark')"
            :placeholder="t('game.favorite.save.remarkPlaceholder')"
            maxlength="100"
            persistent-placeholder
            counter
            class="mt-4"
          />
          <div>
            {{ t('game.favorite.save.tip') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="saveVisible=false"
          >
            {{ t('game.favorite.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="saveLoading"
            @click="createFavorite"
          >
            {{ t('game.favorite.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="modsVisible"
      :width="mobile ? '90%' : '60%'"
    >
      <v-card :title="t('game.favorite.actions.viewMods')">
        <v-card-text v-if="!modsLoading">
          <v-sheet
            border
            rounded
            class="mt-4"
          >
            <v-data-table
              :headers="modHeaders"
              :items="modList"
            >
              <template #item.preview_url="{ value }">
                <v-img
                  :src="value"
                  :width="100"
                  cover
                  rounded
                  aspect-ratio="1"
                  class="ma-2"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                      />
                    </div>
                  </template>
                </v-img>
              </template>
              <template #item.name="{ value }">
                <v-chip
                  label
                  color="info"
                >
                  {{ value || '-' }}
                </v-chip>
              </template>
              <template #item.serverSize="{ value }">
                <v-chip
                  label
                  color="primary"
                >
                  {{ formatBytes(parseInt(value) || 0) }}
                </v-chip>
              </template>
              <template #item.id="{ value }">
                <v-chip label>
                  {{ value }}
                </v-chip>
              </template>
              <template #no-data>
                <div class="text-medium-emphasis py-6">
                  {{ t('game.favorite.noMods') }}
                </div>
              </template>
            </v-data-table>
          </v-sheet>
        </v-card-text>
        <v-card-text v-else>
          <result
            type="info"
            :title="t('game.base.loading')"
            :height="200"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <confirm-box
      v-model="deleteVisible"
      type="error"
      :title="t('game.favorite.delete.title')"
      :content="deleteContent"
      :confirm-text="t('game.favorite.confirm')"
      :cancel-text="t('game.favorite.cancel')"
      :confirm-loading="deleteLoading"
      @confirm="deleteFavorite"
      @cancel="deleteVisible=false"
    />
  </check>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import roomApi from "@/api/room"
import modApi from "@/api/mod"
import cloudApi from "@/api/cloud"
import CloudFavoritesTable from "@/components/cloud/CloudFavoritesTable.vue"
import useUserStore from "@store/user"
import useGlobalStore from "@store/global"
import { formatBytes, parseModLua, timestamp2time } from "@/utils/tools"
import { cloudSyncSummary } from "@/utils/cloud"
import { showSnackbar } from "@/utils/snackbar"

const { mobile } = useDisplay()
const { t } = useI18n()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const router = useRouter()

const otherHeight = 150
const loading = ref(false)
const items = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const activeTab = ref('local')
const cloudTableRef = ref()

const cloudStatus = ref({
  linked: false,
  favoriteCount: 0,
  favoriteQuota: 0,
})

const syncLoading = ref('')

const planLabel = computed(() => {
  const key = `cloud.plan.${cloudStatus.value.plan}`
  const name = t(key)

  return name === key ? (cloudStatus.value.planName || cloudStatus.value.plan || '-') : name
})

const canUpload = computed(() => {
  const quota = cloudStatus.value.favoriteQuota

  if (!quota || quota <= 0) return true

  return (cloudStatus.value.favoriteCount || 0) < quota
})

const deleteContent = computed(() => {
  if (!cloudStatus.value.linked) return t('game.favorite.delete.content')

  return `${t('game.favorite.delete.content')} ${t('cloud.favorite.deleteTip')}`
})

const getCloudStatus = async () => {
  try {
    const response = await cloudApi.status.get()

    cloudStatus.value = response.data || { linked: false }
  } catch {
    cloudStatus.value = { linked: false }
  }
}

const goProfile = () => {
  router.push('/profile')
}

const handleSync = async direction => {
  if (!cloudStatus.value.linked) {
    showSnackbar(t('cloud.sync.notLinkedTip'), 'warning')

    return
  }

  syncLoading.value = direction
  try {
    const response = await cloudApi.sync.post({ direction })

    showSnackbar(cloudSyncSummary(t, response.data))
    await Promise.all([getCloudStatus(), getFavorites()])
    cloudTableRef.value?.refresh()
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    syncLoading.value = ''
  }
}

const canCreate = computed(() => {
  return userStore.userInfo.role === 'admin' || Boolean(userStore.userInfo.roomCreation)
})

const headers = computed(() => {
  if (mobile.value) {
    return [
      { title: t('game.favorite.columns.gameName'), key: 'gameName', sortable: false, width: 120 },
      { title: t('game.favorite.columns.remark'), key: 'remark', sortable: false, width: 150 },
      { title: t('game.favorite.columns.createdAt'), key: 'createdAt', sortable: false, align: 'center', width: 240 },
      { title: t('game.favorite.columns.actions'), key: 'actions', sortable: false, align: 'end', width: 210 },
    ]
  }

  return [
    { title: t('game.favorite.columns.gameName'), key: 'gameName', sortable: false, width: 180 },
    { title: t('game.favorite.columns.remark'), key: 'remark', sortable: false, width: 220 },
    { title: t('game.favorite.columns.gameMode'), key: 'gameMode', sortable: false, align: 'center', width: 110 },
    { title: t('game.favorite.columns.worlds'), key: 'worlds', sortable: false, align: 'center', width: 100 },
    { title: t('game.favorite.columns.mods'), key: 'mods', sortable: false, align: 'center', width: 100 },
    { title: t('game.favorite.columns.createdAt'), key: 'createdAt', sortable: false, align: 'center', width: 240 },
    { title: t('game.favorite.columns.actions'), key: 'actions', sortable: false, align: 'end', width: 210 },
  ]
})

const favoriteName = item => {
  return item?.data?.roomData?.gameName || '-'
}

const worldCount = item => {
  return item?.data?.worldData?.length || 0
}

const gameModeName = item => {
  const roomData = item?.data?.roomData

  if (!roomData?.gameMode) {
    return '-'
  }
  if (roomData.gameMode === 'custom') {
    return roomData.customGameMode || t('game.base.step1.gameMode.modes.custom.name')
  }

  const key = `game.base.step1.gameMode.modes.${roomData.gameMode}`
  const name = t(key)

  return name === key ? roomData.gameMode : name
}

const favoriteModData = item => {
  const data = item?.data

  if (!data) {
    return ''
  }

  return data.roomData?.modInOne
    ? data.roomData?.modData
    : data.worldData?.[0]?.modData
}

const modCount = item => {
  return parseModLua(favoriteModData(item) || '').length
}

const favoriteModIDs = item => {
  const ids = parseModLua(favoriteModData(item) || '')
    .map(mod => Number(String(mod).replace(/^workshop-/, '')))
    .filter(id => Number.isInteger(id) && id > 0)

  return [...new Set(ids)]
}

const modsVisible = ref(false)
const modsLoading = ref(false)
const modList = ref([])
let modsRequestToken = 0

const modHeaders = computed(() => [
  { key: 'preview_url', title: t('game.mod.add.preview') },
  { key: 'name', title: t('game.mod.add.name') },
  { key: 'serverSize', title: t('game.mod.add.size') },
  { key: 'id', title: 'ID' },
])

const openMods = async item => {
  const token = ++modsRequestToken
  const modIDs = favoriteModIDs(item)

  modList.value = []
  modsVisible.value = true
  modsLoading.value = true

  try {
    if (modIDs.length === 0) {
      return
    }

    const response = await modApi.info.post({ modIDs })

    if (token === modsRequestToken) {
      modList.value = response.data || []
    }
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    if (token === modsRequestToken) {
      modsLoading.value = false
    }
  }
}

const getFavorites = async () => {
  loading.value = true

  try {
    const response = await roomApi.favorite.base.get({
      page: page.value,
      pageSize: pageSize.value,
    })

    items.value = response.data?.rows || []
    total.value = response.data?.total || 0

    if (items.value.length === 0 && total.value > 0 && page.value > 1) {
      page.value--
    }
  } finally {
    loading.value = false
  }
}

const applyFormRef = ref()
const applyVisible = ref(false)
const applyLoading = ref(false)
const applyTarget = ref(null)

const applyForm = ref({
  gameName: '',
})

const nameRule = value => {
  return Boolean(value?.trim()) || t('game.favorite.apply.nameRequired')
}

const openApply = item => {
  applyTarget.value = item
  applyForm.value.gameName = item?.data?.roomData?.gameName || ''
  applyVisible.value = true
}

const applyFavorite = async () => {
  if (applyLoading.value) {
    return
  }

  const result = await applyFormRef.value?.validate()

  if (!result?.valid) {
    return
  }

  applyLoading.value = true

  try {
    const response = await roomApi.favorite.apply.post({
      id: applyTarget.value.id,
      gameName: applyForm.value.gameName.trim(),
    })

    if (!globalStore.roomBasic.some(item => item.roomID === response.data.id)) {
      globalStore.roomBasic.push({
        roomID: response.data.id,
        roomName: response.data.gameName,
        status: true,
      })
    }
    applyVisible.value = false
    showSnackbar(response.message)
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    applyLoading.value = false
  }
}

const renameVisible = ref(false)
const renameLoading = ref(false)
const renameTarget = ref(null)

const renameForm = ref({
  remark: '',
})

const openRename = item => {
  renameTarget.value = item
  renameForm.value.remark = item.remark || ''
  renameVisible.value = true
}

const renameFavorite = () => {
  renameLoading.value = true

  roomApi.favorite.base.put({
    id: renameTarget.value.id,
    remark: renameForm.value.remark,
  }).then(response => {
    const item = items.value.find(favorite => favorite.id === response.data.id)

    if (item) {
      item.remark = response.data.remark
    }
    renameVisible.value = false
    showSnackbar(response.message)
  }).finally(() => {
    renameLoading.value = false
  })
}

const saveVisible = ref(false)
const saveLoading = ref(false)

const saveForm = ref({
  remark: '',
})

const openSaveDialog = () => {
  saveForm.value.remark = ''
  saveVisible.value = true
}

const createFavorite = () => {
  saveLoading.value = true

  roomApi.favorite.base.post({
    roomID: globalStore.room.id,
    remark: saveForm.value.remark,
  }).then(response => {
    saveVisible.value = false
    showSnackbar(response.message)

    if (page.value === 1) {
      getFavorites()
    } else {
      page.value = 1
    }
  }).finally(() => {
    saveLoading.value = false
  })
}

const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteTarget = ref(null)

const openDelete = item => {
  deleteTarget.value = item
  deleteVisible.value = true
}

const deleteFavorite = () => {
  deleteLoading.value = true

  roomApi.favorite.base.delete({
    id: deleteTarget.value.id,
  }).then(response => {
    deleteVisible.value = false
    showSnackbar(response.message)
    getFavorites()
  }).finally(() => {
    deleteLoading.value = false
  })
}

onMounted(() => {
  getCloudStatus()
})
</script>

<style scoped>
.favorite-table :deep(.v-table__wrapper > table) {
  table-layout: fixed;
}
</style>

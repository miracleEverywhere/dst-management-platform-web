<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
    transition="dialog-bottom-transition"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card
      class="d-flex flex-column"
      color="background"
      rounded="0"
    >
      <v-toolbar
        color="surface"
        density="comfortable"
        class="flex-grow-0"
      >
        <v-btn
          v-tooltip="t('tools.lobby.detailPage.back')"
          icon="ri-arrow-left-line"
          variant="text"
          @click="close"
        />
        <v-toolbar-title class="text-truncate">
          {{ detail?.name || room?.name || t('tools.lobby.detailPage.title') }}
        </v-toolbar-title>
        <v-chip
          v-if="regionName"
          size="small"
          variant="tonal"
          color="primary"
          class="mr-2"
        >
          {{ regionName }}
        </v-chip>
        <v-btn
          v-tooltip="t('tools.lobby.detailPage.refresh')"
          icon="ri-refresh-line"
          variant="text"
          :loading="loading"
          @click="loadDetail"
        />
      </v-toolbar>
      <v-divider />
      <div class="flex-grow-1 overflow-y-auto">
        <v-container
          class="py-6"
          style="max-width: 1200px"
        >
          <v-skeleton-loader
            v-if="loading && !detail"
            type="article, table-row@3"
          />
          <template v-else-if="detail">
            <div class="d-flex flex-wrap align-center ga-3">
              <span style="font-size: 1.5rem;">{{ detail.name || '-' }}</span>
              <v-chip
                size="small"
                :color="lobbyIntentColor(detail.intent)"
                variant="tonal"
              >
                {{ lobbyIntentLabel(t, detail.intent) }}
              </v-chip>
              <v-chip
                size="small"
                :color="lobbySeasonColor(detail.season)"
                variant="tonal"
                :prepend-icon="lobbySeasonIcon(detail.season)"
              >
                {{ lobbySeasonLabel(t, detail.season) }}
              </v-chip>
              <v-chip
                v-if="detail.password"
                size="small"
                color="warning"
                variant="tonal"
                prepend-icon="ri-lock-line"
              >
                {{ t('tools.lobby.detailPage.info.password') }}
              </v-chip>
            </div>
            <div class="mt-2 font-weight-thin">
              {{ detail.desc || t('tools.lobby.detailPage.descEmpty') }}
            </div>

            <v-sheet
              border
              rounded
              class="pa-4 mt-4"
            >
              <div class="card-header">
                <v-chip label>
                  <span style="font-size: 1rem;">
                    {{ t('tools.lobby.detailPage.connectionCode') }}
                  </span>
                </v-chip>

                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  prepend-icon="ri-file-copy-line"
                  :disabled="!detail.connectionCode"
                  class="text-none"
                  @click="copy(detail.connectionCode)"
                >
                  {{ detail.connectionCode || '-' }}
                </v-btn>
              </div>
            </v-sheet>

            <v-row
              dense
              class="mt-2"
            >
              <v-col
                v-for="item in statItems"
                :key="item.label"
                cols="6"
                md="4"
              >
                <v-sheet
                  border
                  rounded
                  class="pa-3 h-100"
                >
                  <v-chip label>
                    <span style="font-size: 1rem;">
                      {{ item.label }}
                    </span>
                  </v-chip>
                  <div class="mt-2 text-right">
                    <v-chip color="info">
                      {{ item.value }}
                    </v-chip>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>

            <v-alert
              variant="tonal"
              color="info"
              class="my-4"
            >
              <div class="d-flex align-center justify-space-between">
                <div>
                  {{ t('tools.lobby.detailPage.players.title') }}
                </div>
                <v-chip
                  color="info"
                  size="small"
                  variant="elevated"
                >
                  {{ (detail.players || []).length }} / {{ detail.maxConnections || '-' }}
                </v-chip>
              </div>
            </v-alert>

            <v-alert
              v-if="detail.playersParsed === false"
              type="warning"
              variant="tonal"
              :text="t('tools.lobby.detailPage.players.parseFail')"
            />
            <v-data-table
              v-else
              :headers="playerHeaders"
              :items="detail.players || []"
              :items-per-page="-1"
              :no-data-text="t('tools.lobby.detailPage.players.empty')"
              hide-default-footer
              class="elevation-0"
            >
              <template #item.prefab="{ value }">
                <div class="d-flex align-center ga-2">
                  <v-chip
                    color="info"
                    label
                  >
                    {{ getDstRoleName(value, language) || value || '-' }}
                  </v-chip>
                </div>
              </template>
              <template #item.colour="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-icon
                    icon="ri-circle-fill"
                    :color="normalizeLobbyColour(item.colour)"
                    size="18"
                  />
                  <span class="text-caption text-medium-emphasis">{{ item.colour || '-' }}</span>
                </div>
              </template>
            </v-data-table>

            <v-alert
              variant="tonal"
              color="info"
              class="my-4"
            >
              <div class="d-flex align-center justify-space-between">
                <div>
                  {{ t('tools.lobby.detailPage.mods.title') }}
                </div>
                <v-chip
                  color="info"
                  size="small"
                  variant="elevated"
                >
                  {{ modRows.length }}
                </v-chip>
              </div>
            </v-alert>
            <v-alert
              v-if="modInfoFailed"
              type="warning"
              variant="tonal"
              class="mb-3"
              :text="t('tools.lobby.detailPage.mods.loadFail')"
            />
            <v-data-table
              :headers="modHeaders"
              :items="modRows"
              :items-per-page="-1"
              :loading="modLoading"
              :no-data-text="t('tools.lobby.detailPage.mods.empty')"
              hide-default-footer
              class="elevation-0"
            >
              <template #loading>
                <v-skeleton-loader type="table-row@3" />
              </template>
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
              <template #item.name="{ item }">
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-decoration-none"
                >
                  {{ item.name }}
                </a>
                <div
                  v-if="item.version"
                  class="text-caption text-medium-emphasis"
                >
                  v{{ item.version }}
                </div>
              </template>
              <template #item.sizeText="{ item }">
                {{ item.sizeText }}
              </template>
            </v-data-table>
          </template>
          <v-alert
            v-else
            type="error"
            variant="tonal"
            :text="t('tools.lobby.detailPage.title')"
          />
        </v-container>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import modApi from '@/api/mod.js'
import toolsApi from '@/api/tools.js'
import useGlobalStore from '@store/global.js'
import { formatBytes, getDstRoleName } from '@/utils/tools.js'
import { showSnackbar } from '@/utils/snackbar'
import { playerImageUrl } from '@/views/tools/world-map/worldMapImages.js'
import {
  lobbyIntentColor,
  lobbyIntentLabel,
  lobbyRegionLabel,
  lobbySeasonColor,
  lobbySeasonIcon,
  lobbySeasonLabel,
  normalizeLobbyColour,
} from '@/views/tools/components/lobbyLabels.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  room: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const globalStore = useGlobalStore()

const detail = ref(null)
const loading = ref(false)
const modLoading = ref(false)
const modInfoFailed = ref(false)
const modInfoMap = ref({})
const requestSeq = ref(0)

const language = computed(() => globalStore.language)

const regionName = computed(() => lobbyRegionLabel(t, detail.value?.region || props.room?.region))

const secondaries = computed(() => detail.value?.secondaries || [])

const playerHeaders = computed(() => [
  {
    title: t('tools.lobby.detailPage.players.columns.name'),
    key: 'name',
    sortable: false,
    minWidth: 160,
  },
  {
    title: t('tools.lobby.detailPage.players.columns.prefab'),
    key: 'prefab',
    sortable: false,
    minWidth: 160,
  },
  {
    title: t('tools.lobby.detailPage.players.columns.colour'),
    key: 'colour',
    sortable: false,
    width: 180,
  },
])

const modHeaders = computed(() => [
  {
    title: t('tools.lobby.detailPage.mods.columns.image'),
    key: 'preview_url',
    sortable: false,
    minWidth: 100,
  },
  {
    title: t('tools.lobby.detailPage.mods.columns.name'),
    key: 'name',
    sortable: false,
    minWidth: 220,
  },
  {
    title: t('tools.lobby.detailPage.mods.columns.id'),
    key: 'id',
    sortable: false,
    minWidth: 150,
  },
  {
    title: t('tools.lobby.detailPage.mods.columns.size'),
    key: 'sizeText',
    sortable: false,
    align: 'end',
    minWidth: 160,
  },
])

const statItems = computed(() => {
  const room = detail.value
  if (!room) return []

  return [
    {
      label: t('tools.lobby.detailPage.info.days'),
      value: room.days > 0 ? String(room.days) : '-',
    },
    {
      label: t('tools.lobby.detailPage.info.season'),
      value: lobbySeasonLabel(t, room.season),
    },
    {
      label: t('tools.lobby.detailPage.info.mode'),
      value: lobbyIntentLabel(t, room.intent),
    },
    {
      label: t('tools.lobby.detailPage.info.players'),
      value: `${room.connected ?? 0} / ${room.maxConnections ?? 0}`,
    },
    {
      label: t('tools.lobby.detailPage.info.dedicated'),
      value: room.dedicated
        ? t('tools.lobby.detailPage.dedicatedYes')
        : t('tools.lobby.detailPage.dedicatedNo'),
    },
    {
      label: t('tools.lobby.detailPage.info.pvp'),
      value: room.pvp ? t('tools.lobby.yes') : t('tools.lobby.no'),
    },
    {
      label: t('tools.lobby.detailPage.info.password'),
      value: room.password ? t('tools.lobby.yes') : t('tools.lobby.no'),
    },
    {
      label: t('tools.lobby.detailPage.info.allowNewPlayers'),
      value: room.allowNewPlayers ? t('tools.lobby.yes') : t('tools.lobby.no'),
    },
    {
      label: t('tools.lobby.detailPage.info.version'),
      value: room.version ? String(room.version) : '-',
    },
    {
      label: t('tools.lobby.detailPage.info.tick'),
      value: room.tick ? String(room.tick) : '-',
    },
    {
      label: t('tools.lobby.detailPage.info.addr'),
      value: room.addr ? `${room.addr}:${room.port}` : '-',
    },
  ]
})

const modRows = computed(() => (detail.value?.mods || []).map(mod => {
  const info = modInfoMap.value[String(mod.id)] || {}
  const size = Number(info.serverSize)

  return {
    id: mod.id,
    name: info.name || mod.name || mod.id,
    enabled: mod.enabled,
    version: mod.version1 || mod.version2 || '',
    // eslint-disable-next-line camelcase
    preview_url: info.preview_url || '',
    sizeText: Number.isFinite(size) && size > 0 ? formatBytes(size) : '-',
    url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`,
  }
}))

const loadMods = async (modIDs, seq) => {
  modLoading.value = true
  try {
    const response = await modApi.info.post({ modIDs })
    if (seq !== requestSeq.value) return

    const infoMap = {}
    for (const item of response.data || []) {
      infoMap[String(item.id)] = item
    }
    modInfoMap.value = infoMap
  } catch {
    if (seq === requestSeq.value) {
      modInfoFailed.value = true
    }
  } finally {
    if (seq === requestSeq.value) {
      modLoading.value = false
    }
  }
}

const loadDetail = async () => {
  const room = props.room
  if (!room?.rowID) return

  const seq = ++requestSeq.value

  loading.value = true
  modInfoFailed.value = false

  try {
    const response = await toolsApi.lobby.detail.post({
      rowID: room.rowID,
      region: room.region,
    })

    if (seq !== requestSeq.value) return

    detail.value = response.data || null
    modInfoMap.value = {}

    const modIDs = detail.value?.modIDs || []
    if (modIDs.length > 0) {
      await loadMods(modIDs, seq)
    }
  } catch {
    // 错误提示由 axios 统一处理，这里保留上一次成功的数据
  } finally {
    if (seq === requestSeq.value) {
      loading.value = false
    }
  }
}

const reset = () => {
  requestSeq.value++
  detail.value = null
  loading.value = false
  modLoading.value = false
  modInfoFailed.value = false
  modInfoMap.value = {}
}

const close = () => emit('update:modelValue', false)

const copy = async text => {
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    showSnackbar(t('tools.lobby.detailPage.copySuccess'))
  } catch {
    showSnackbar(t('tools.lobby.detailPage.copyFail'), 'error')
  }
}

watch(
  () => props.modelValue,
  visible => {
    if (visible) {
      loadDetail()
    } else {
      reset()
    }
  },
)
</script>

<style scoped>
.connection-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  word-break: break-all;
}
</style>

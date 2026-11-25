<template>
  <v-card
    class="d-flex flex-column"
    :height="calculateContainerSize()"
  >
    <div class="d-flex flex-wrap align-center ga-3 pa-4 pb-3">
      <v-icon
        v-tooltip="t('tools.lobby.tip')"
        icon="ri-radar-line"
      />
      <span>{{ t('tools.lobby.title') }}</span>
      <v-chip
        v-if="!mobile"
        variant="tonal"
        color="primary"
      >
        {{ t('tools.lobby.total', { total }) }}
      </v-chip>
      <span
        v-if="updatedAtText && !mobile"
        class="text-caption text-medium-emphasis"
      >
        {{ updatedAtText }}
      </span>
      <v-spacer />
      <v-btn
        v-tooltip="t('tools.lobby.refreshTip')"
        icon="ri-refresh-line"
        variant="text"
        color="primary"
        :loading="loading"
        @click="refresh"
      />
      <div class="d-flex flex-wrap align-center ga-2 lobby-controls">
        <v-text-field
          v-model="keyword"
          class="lobby-search"
          :label="t('tools.lobby.search.label')"
          prepend-inner-icon="ri-search-line"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          maxlength="64"
          :placeholder="t('placeholders.tools.lobbySearch')"
          @keyup.enter="applyFilters"
          @click:clear="applyFilters"
        />
        <v-select
          v-model="selectedRegions"
          class="lobby-regions"
          :label="t('tools.lobby.region.label')"
          :items="regionItems"
          item-title="title"
          item-value="value"
          multiple
          chips
          density="compact"
          variant="outlined"
          hide-details
        />
      </div>
    </div>
    <v-divider />
    <v-alert
      v-if="failedRegions.length > 0"
      type="warning"
      variant="tonal"
      density="compact"
      class="mx-4 mt-4"
      :text="t('tools.lobby.failedRegions', { regions: failedRegionText })"
    />
    <v-card-text class="d-flex flex-column flex-grow-1 overflow-hidden pa-4">
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="pageSize"
        class="lobby-table"
        :headers="headers"
        :items="rows"
        :items-length="total"
        :items-per-page-options="[10, 20, 50, 100]"
        :loading="loading"
        hover
        @update:options="load"
        @click:row="openDetail"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@8" />
        </template>
        <template #no-data>
          <div class="d-flex flex-column align-center ga-2 py-10">
            <v-icon
              icon="ri-radar-line"
              size="34"
            />
            <div class="text-subtitle-1">
              {{ t('tools.lobby.empty.title') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('tools.lobby.empty.subTitle') }}
            </div>
          </div>
        </template>
        <template #item.name="{ item }">
          <div class="font-weight-medium">
            {{ item.name }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.addr }}:{{ item.port }}
          </div>
        </template>
        <template #item.region="{ item }">
          <v-chip
            variant="tonal"
            color="info"
            label
          >
            {{ lobbyRegionLabel(t, item.region) }}
          </v-chip>
        </template>
        <template #item.connected="{ item }">
          <span class="font-weight-medium">{{ item.connected }}</span>
          <span class="text-medium-emphasis"> / {{ item.maxConnections }}</span>
        </template>
        <template #item.intent="{ item }">
          <v-chip
            variant="tonal"
            label
            :color="lobbyIntentColor(item.intent)"
          >
            {{ lobbyIntentLabel(t, item.intent) }}
          </v-chip>
        </template>
        <template #item.season="{ item }">
          <v-icon
            :icon="lobbySeasonIcon(item.season)"
            :color="lobbySeasonColor(item.season)"
            size="18"
            class="mr-1"
          />

          <span :class="'text-'+lobbySeasonColor(item.season)">
            {{ lobbySeasonLabel(t, item.season) }}
          </span>
        </template>
        <template #item.dedicated="{ item }">
          <v-icon
            :icon="item.dedicated ? 'ri-server-line' : 'ri-computer-line'"
            :color="item.dedicated ? 'success' : 'secondary'"
            size="18"
          />
        </template>
        <template #item.mods="{ item }">
          <v-icon
            :icon="item.mods ? 'ri-puzzle-2-line' : 'ri-close-line'"
            :color="item.mods ? 'success' : 'secondary'"
            size="18"
          />
        </template>
        <template #item.password="{ item }">
          <v-icon
            :icon="item.password ? 'ri-lock-line' : 'ri-lock-unlock-line'"
            :color="item.password ? 'warning' : 'secondary'"
            size="18"
          />
        </template>
        <template #item.status="{ item }">
          <div class="d-flex flex-wrap justify-center ga-1">
            <v-chip
              v-if="item.serverPaused"
              color="error"
              label
              variant="tonal"
            >
              {{ t('tools.lobby.status.paused') }}
            </v-chip>
            <v-chip
              v-else-if="item.allowNewPlayers"
              color="success"
              label
              variant="tonal"
            >
              {{ t('tools.lobby.status.allowNewPlayers') }}
            </v-chip>
            <v-chip
              v-else
              color="warning"
              label
              variant="tonal"
            >
              {{ t('tools.lobby.status.noNewPlayers') }}
            </v-chip>
          </div>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            variant="text"
            color="primary"
            append-icon="ri-arrow-right-up-line"
            @click.stop="openDetail($event, { item })"
          >
            {{ t('tools.lobby.detail') }}
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card-text>

    <lobby-detail
      v-model="detailVisible"
      :room="selectedRoom"
    />
  </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify/framework'
import toolsApi from '@/api/tools.js'
import LobbyDetail from '@/views/tools/components/LobbyDetail.vue'
import { debounce, timestamp2time } from '@/utils/tools.js'
import {
  lobbyIntentColor,
  lobbyIntentLabel,
  lobbyRegionLabel,
  lobbySeasonColor,
  lobbySeasonIcon,
  lobbySeasonLabel,
} from '@/views/tools/components/lobbyLabels.js'

const { t } = useI18n()
const { mobile } = useDisplay()

const allRegions = ['ap-east-1', 'ap-southeast-1', 'us-east-1', 'eu-central-1']
const defaultRegions = ['ap-east-1', 'ap-southeast-1']
const defaultPageSize = 20

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  const other = 112

  return Math.max(320, Math.floor(windowHeight.value - other))
}

const keyword = ref('')
const selectedRegions = ref([...defaultRegions])
const supportedRegions = ref([...allRegions])
const page = ref(1)
const pageSize = ref(defaultPageSize)
const total = ref(0)
const rows = ref([])
const loading = ref(false)
const failedRegions = ref([])
const updatedAt = ref(0)
const requestSeq = ref(0)

const detailVisible = ref(false)
const selectedRoom = ref(null)

const regionItems = computed(() => supportedRegions.value.map(region => ({
  title: lobbyRegionLabel(t, region),
  value: region,
})))

const updatedAtText = computed(() => {
  if (!updatedAt.value) return ''

  return t('tools.lobby.updatedAt', { time: timestamp2time(updatedAt.value * 1000) })
})

const failedRegionText = computed(() => failedRegions.value
  .map(region => lobbyRegionLabel(t, region))
  .join(', '))

const headers = computed(() => {
  const all = [
    {
      title: t('tools.lobby.columns.name'),
      key: 'name',
      sortable: false,
      minWidth: 220,
    },
    {
      title: t('tools.lobby.columns.region'),
      key: 'region',
      sortable: false,
      align: 'center',
      width: 120,
    },
    {
      title: t('tools.lobby.columns.players'),
      key: 'connected',
      sortable: false,
      align: 'center',
      minWidth: 110,
    },
    {
      title: t('tools.lobby.columns.mode'),
      key: 'intent',
      sortable: false,
      align: 'center',
      width: 100,
    },
    {
      title: t('tools.lobby.columns.season'),
      key: 'season',
      sortable: false,
      align: 'center',
      minWidth: 120,
    },
    {
      title: t('tools.lobby.columns.dedicated'),
      key: 'dedicated',
      sortable: false,
      align: 'center',
      width: 90,
    },
    {
      title: t('tools.lobby.columns.mods'),
      key: 'mods',
      sortable: false,
      align: 'center',
      width: 80,
    },
    {
      title: t('tools.lobby.columns.password'),
      key: 'password',
      sortable: false,
      align: 'center',
      width: 80,
    },
    {
      title: t('tools.lobby.columns.status'),
      key: 'status',
      sortable: false,
      align: 'center',
      width: 130,
    },
    {
      title: t('tools.lobby.columns.actions'),
      key: 'actions',
      sortable: false,
      align: 'end',
      width: 110,
    },
  ]

  if (!mobile.value) return all

  // 移动端只保留最关键的三列，其余信息在详情页查看
  return all.filter(column => ['name', 'connected', 'actions'].includes(column.key))
})

const load = async (options = {}) => {
  if (typeof options.page === 'number') page.value = options.page
  if (typeof options.itemsPerPage === 'number') pageSize.value = options.itemsPerPage

  const seq = ++requestSeq.value

  loading.value = true

  try {
    const response = await toolsApi.lobby.search.post({
      keyword: keyword.value.trim(),
      regions: [...selectedRegions.value],
      page: page.value,
      pageSize: pageSize.value,
      refresh: options.refresh === true,
    })

    if (seq !== requestSeq.value) return

    const data = response.data || {}

    rows.value = data.rows || []
    total.value = data.total || 0
    failedRegions.value = data.failedRegions || []
    updatedAt.value = data.updatedAt || 0

    if (Array.isArray(data.regions) && data.regions.length > 0) {
      supportedRegions.value = data.regions
    }
  } catch {
    if (seq === requestSeq.value) {
      rows.value = []
      total.value = 0
    }
  } finally {
    if (seq === requestSeq.value) {
      loading.value = false
    }
  }
}

const applyFilters = () => {
  page.value = 1
  load()
}

const debouncedApplyFilters = debounce(applyFilters, 400)

watch(keyword, () => {
  debouncedApplyFilters()
})

watch(
  selectedRegions,
  value => {
    if (!value || value.length === 0) {
      selectedRegions.value = [...defaultRegions]

      return
    }
    applyFilters()
  },
  { deep: true },
)

const refresh = () => {
  load({ page: page.value, itemsPerPage: pageSize.value, refresh: true })
}

const openDetail = (event, { item }) => {
  selectedRoom.value = item
  detailVisible.value = true
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.lobby-controls {
  min-width: 0;
}

.lobby-search {
  width: 220px;
}

.lobby-regions {
  width: 260px;
}

.lobby-table {
  height: 100%;
}

.lobby-table :deep(.v-table__wrapper) {
  overflow: auto;
}

.lobby-table :deep(tbody tr) {
  cursor: pointer;
}

@media (max-width: 960px) {
  .lobby-controls {
    width: 100%;
  }

  .lobby-search,
  .lobby-regions {
    width: 100%;
  }
}
</style>

<template>
  <div>
    <template v-if="linked">
      <v-toolbar flat>
        <v-toolbar-title>
          <v-icon
            icon="ri-cloud-line"
            start
          />
          <span v-if="!mobile">{{ t('cloud.favorite.tab') }}</span>
        </v-toolbar-title>
        <v-text-field
          v-model="keyword"
          class="mr-2"
          density="compact"
          hide-details
          :label="t('cloud.favorite.keyword')"
          prepend-inner-icon="ri-search-line"
          variant="outlined"
          style="max-width: 240px"
          clearable
          @keyup.enter="handleSearch"
          @click:clear="handleSearch"
        />
        <v-btn
          prepend-icon="ri-refresh-line"
          color="default"
          :loading="loading"
          @click="getFavorites"
        >
          {{ t('cloud.common.refresh') }}
        </v-btn>
      </v-toolbar>
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="pageSize"
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
        <template #item.name="{ item }">
          <div
            class="text-truncate font-weight-medium"
            :title="favoriteName(item)"
          >
            {{ favoriteName(item) }}
          </div>
        </template>
        <template #item.remark="{ item }">
          <div
            class="text-truncate"
            :title="item.remark"
          >
            {{ item.remark || '-' }}
          </div>
        </template>
        <template #item.gameMode="{ item }">
          <v-chip
            label
            color="info"
          >
            {{ gameModeName(item) }}
          </v-chip>
        </template>
        <template #item.worlds="{ item }">
          <v-chip label>
            {{ item.meta?.worldCount ?? 0 }}
          </v-chip>
        </template>
        <template #item.mods="{ item }">
          <v-chip label>
            {{ item.meta?.modCount ?? 0 }}
          </v-chip>
        </template>
        <template #item.local="{ item }">
          <v-chip
            v-if="item.localFavoriteId"
            label
            color="success"
            variant="tonal"
          >
            {{ t('cloud.favorite.inLocal') }}
          </v-chip>
          <v-chip
            v-else
            label
            color="warning"
            variant="tonal"
          >
            {{ t('cloud.favorite.onlyCloud') }}
          </v-chip>
        </template>
        <template #item.updatedAt="{ item }">
          {{ unix2time(item.updatedAt) }}
        </template>
        <template #no-data>
          <div class="d-flex flex-column align-center py-10">
            <v-icon
              icon="ri-cloud-off-line"
              size="48"
              color="grey"
              class="mb-4"
            />
            <div class="text-subtitle-1">
              {{ t('cloud.favorite.empty.title') }}
            </div>
            <div class="text-body-2 text-medium-emphasis mt-2">
              {{ t('cloud.favorite.empty.subTitle') }}
            </div>
          </div>
        </template>
      </v-data-table-server>
    </template>

    <result
      v-else
      type="info"
      :title="t('cloud.common.unlinked')"
      :sub-title="t('cloud.sync.notLinkedTip')"
      :height="260"
    >
      <v-btn
        to="/profile"
        class="mt-4"
        color="primary"
      >
        {{ t('cloud.common.goBind') }}
      </v-btn>
    </result>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import cloudApi from "@/api/cloud"
import { unix2time } from "@/utils/tools"

const props = defineProps({
  linked: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const { mobile } = useDisplay()

const loading = ref(false)
const items = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')

const headers = computed(() => [
  { title: t('cloud.favorite.columns.name'), key: 'name', sortable: false },
  { title: t('cloud.favorite.columns.remark'), key: 'remark', sortable: false },
  { title: t('cloud.favorite.columns.gameMode'), key: 'gameMode', sortable: false, align: 'center' },
  { title: t('cloud.favorite.columns.worlds'), key: 'worlds', sortable: false, align: 'center' },
  { title: t('cloud.favorite.columns.mods'), key: 'mods', sortable: false, align: 'center' },
  { title: t('cloud.favorite.columns.local'), key: 'local', sortable: false, align: 'center' },
  { title: t('cloud.favorite.columns.updatedAt'), key: 'updatedAt', sortable: false, align: 'center' },
])

const favoriteName = item => {
  return item?.name || item?.meta?.roomName || '-'
}

const gameModeName = item => {
  const mode = item?.meta?.gameMode

  if (!mode) return '-'

  const key = `game.base.step1.gameMode.modes.${mode}`
  const name = t(key)

  return name === key ? mode : name
}

const getFavorites = async () => {
  if (!props.linked) return

  loading.value = true
  try {
    const response = await cloudApi.favorites.get({
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value || '',
    })

    const data = response.data || {}

    items.value = (data.items || []).filter(item => !item.deleted)
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  getFavorites()
}

watch(() => props.linked, linked => {
  if (linked) {
    getFavorites()
  }
}, { immediate: true })

defineExpose({
  refresh: getFavorites,
})
</script>

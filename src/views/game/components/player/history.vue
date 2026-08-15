<template>
  <v-card
    border
    flat
    class="mt-4"
  >
    <!-- 卡片头部（包含标题 + 右侧搜索框） -->
    <v-card-title class="py-4">
      <div class="d-flex align-center justify-space-between w-100 ga-2">
        <!-- 左侧图标与标题（仅在非移动端或有标题时渲染） -->
        <div
          v-if="!mobile"
          class="d-flex align-center ga-2 flex-shrink-0"
        >
          <v-icon icon="ri-contacts-line" />
          <v-card-title class="pa-0">
            {{ t('game.player.history.tabName') }}
          </v-card-title>
        </div>

        <!-- 移动端保留一个独立图标（可选，如果移动端完全不需要图标可删掉此块） -->
        <v-icon
          v-else
          icon="ri-contacts-line"
          class="flex-shrink-0"
        />

        <!-- 右侧搜索区域：移动端自动占满剩余空间 -->
        <div class="d-flex align-center ga-2 flex-grow-1 flex-sm-grow-0 min-w-0">
          <v-text-field
            v-model="search"
            :label="t('game.player.history.search.label')"
            :placeholder="t('game.player.history.search.placeholder')"
            persistent-placeholder
            clearable
            density="compact"
            hide-details
            variant="outlined"
            prepend-inner-icon="ri-search-line"
            class="flex-grow-1"
            :style="{ width: mobile ? 'auto' : '280px' }"
            @keyup.enter="searchUidmap"
            @click:clear="searchUidmap"
          />
          <v-btn
            color="primary"
            class="flex-shrink-0"
            @click="searchUidmap"
          >
            {{ t('game.player.history.search.label') }}
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <v-divider />

    <!-- 表格区域 -->
    <v-data-table-server
      v-model:page="uidmapData.page"
      v-model:items-per-page="uidmapData.pageSize"
      :headers="headers"
      :items="uidmapData.rows"
      :items-length="uidmapData.total"
      :loading="getUidmapLoading"
      @update:options="getUidmap"
    >
      <template #loading>
        <v-skeleton-loader type="table-row@10" />
      </template>
      <template #item.uid="{value}">
        <v-chip label>
          {{ value }}
        </v-chip>
      </template>
      <template #item.nickname="{value}">
        <v-chip
          label
          color="primary"
        >
          {{ value }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          color="info"
          append-icon="ri-arrow-drop-down-line"
          variant="text"
          :loading="actionsLoading"
        >
          {{ t('platform.user.table.actions') }}
          <v-menu activator="parent">
            <v-list>
              <v-list-item
                class="text-info"
                @click="handleList(item.uid, 'adminlist', 'add')"
              >
                <template #prepend>
                  <v-icon
                    icon="ri-user-star-line"
                    size="22"
                  />
                </template>
                <v-list-item-title>
                  {{ t('game.player.online.actions.admin') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="text-error"
                @click="handleList(item.uid, 'blocklist', 'add')"
              >
                <template #prepend>
                  <v-icon
                    icon="ri-user-forbid-line"
                    size="22"
                  />
                </template>
                <v-list-item-title>
                  {{ t('game.player.online.actions.block') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="text-success"
                @click="handleList(item.uid, 'whitelist', 'add')"
              >
                <template #prepend>
                  <v-icon
                    icon="ri-user-heart-line"
                    size="22"
                  />
                </template>
                <v-list-item-title>
                  {{ t('game.player.online.actions.white') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup>
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import playerApi from "@/api/player.js"
import { showSnackbar } from "@/utils/snackbar.js"

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const search = ref('')

const uidmapData = ref({
  rows: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const getUidmapLoading = ref(false)

const getUidmap = ({ page, itemsPerPage }) => {
  const reqForm = {
    roomID: globalStore.room.id,
    q: search.value || '',
    page,
    pageSize: itemsPerPage,
  }

  getUidmapLoading.value = true
  playerApi.uidmap.get(reqForm).then(response => {
    uidmapData.value = response.data
  }).finally(() => {
    getUidmapLoading.value = false
  })
}

const searchUidmap = () => {
  getUidmap({
    page: 1,
    itemsPerPage: uidmapData.value.pageSize,
  })
}

const headers = [
  { key: 'uid', title: t('game.player.online.header.uid') },
  { key: 'nickname', title: t('game.player.online.header.nickname') },
  { key: 'actions', title: t('game.player.online.header.actions') },
]

const actionsLoading = ref(false)

const handleList = (uid, listType, actionType) => {
  actionsLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    uids: [uid],
    listType: listType,
    actionType: actionType,
  }

  playerApi.list.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    actionsLoading.value = false
  })
}
</script>

<template>
  <v-sheet
    border
    rounded
    class="mt-4"
  >
    <v-data-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="files"
      :loading="getSnapshotLoading"
    >
      <template #loading>
        <v-skeleton-loader type="table-row@10" />
      </template>
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              icon="ri-contacts-line"
              start
            />
            <span v-if="!mobile">{{ t('game.player.history.tabName') }}</span>
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template #item.name="{value}">
        <v-chip
          label
          color="primary"
        >
          {{ value }}
        </v-chip>
      </template>
      <template #item.size="{value}">
        <v-chip
          label
          color="primary"
        >
          {{ formatBytes(value) }}
        </v-chip>
      </template>
      <template #item.modTime="{value}">
        <v-chip
          label
          color="primary"
        >
          {{ isoTime2time(value) }}
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
    </v-data-table>
  </v-sheet>
</template>

<script setup>
import toolsApi from "@/api/tools.js"
import useGlobalStore from "@/plugins/store/global.js";
import useUserStore from "@/plugins/store/user.js";
import {useDisplay} from "vuetify/framework";
import {useI18n} from "vue-i18n";
import {formatBytes, isoTime2time} from "@/utils/tools.js";

const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const files = ref([])
const getSnapshotLoading = ref(false)

const getSnapshot = () => {
  getSnapshotLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  toolsApi.snapshot.get(reqForm).then(response => {
    files.value = response.data || []
  }).finally(() => {
    getSnapshotLoading.value = false
  })
}

const sortBy = ref([{ key: 'name', order: 'desc' }])

const headers = [
  { key: 'name', title: 'name' },
  { key: 'size', title: 'size' },
  { key: 'modTime', title: 'modTime' },
  { key: 'actions', title: t('game.player.online.header.actions') },
]

onMounted(() => {
  getSnapshot()
})
</script>

<style scoped>
</style>
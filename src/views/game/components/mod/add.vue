<template>
  <v-card>
    <v-card-title>
      {{t('game.mod.add.tabName')}}
    </v-card-title>
    <v-card-text class="mt-4">
      <v-text-field
          v-model="downloadedModSearch"
          :loading="downloadedModsLoading"
          :label="t('game.mod.add.search')"
          variant="outlined"
          hide-details
          single-line
      >
        <template #append>
          <v-btn
              :loading="downloadedModsLoading"
              prepend-icon="ri-refresh-line"
              color="default"
              variant="elevated"
              size="large"
              @click="getDownloadedMods"
          >
            {{t('game.mod.add.refresh')}}
          </v-btn>
        </template>
      </v-text-field>
      <v-sheet border rounded class="mt-4">
        <v-data-table
            v-model="selectedMods"
            show-select
            :headers="headers"
            :items="downloadedMods"
            :search="downloadedModSearch"
            :loading="downloadedModsLoading"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>

          <template v-slot:item.preview_url="{ value }">
            <v-img
                :width="100"
                :src="value"
                class="ma-2"
            ></v-img>
          </template>
          <template v-slot:item.name="{ value }">
            <v-chip
                label
                color="info"
            >{{value}}</v-chip>
          </template>
          <template v-slot:item.serverSize="{ value }">
            <v-chip
                label
                color="primary"
            >{{formatBytes(parseInt(value))}}</v-chip>
          </template>
          <template v-slot:item.id="{ value }">
            <v-chip
                label
            >{{value}}</v-chip>
          </template>
          <template v-slot:item.update="{ item }">
            <v-chip
                v-if="item.serverSize===item.localSize"
                label
                color="success"
            >{{t('game.mod.add.needNoUpdate')}}</v-chip>
            <v-chip
                v-if="item.serverSize!==item.localSize"
                label
                color="error"
            >{{t('game.mod.add.needUpdate')}}</v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
                color="primary"
                variant="text"
            >
              {{t('game.mod.add.actions')}}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item
                      @click="handleModAction('enable', item)"
                  >
                    <v-list-item-title>
                      {{t('game.mod.add.enable')}}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </template>
        </v-data-table>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup>
import modApi from "@/api/mod"
import useGlobalStore from "@/plugins/store/global.js";
import {formatBytes} from "@/utils/tools.js";
import {showSnackbar} from "@/utils/snackbar.js";
import {useI18n} from "vue-i18n";

const globalStore = useGlobalStore()
const { t } = useI18n()

const downloadedMods = ref([])
const downloadedModsLoading = ref(false)
const getDownloadedMods = () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }
  downloadedModsLoading.value = true
  modApi.downloaded.get(reqForm).then(response => {
    downloadedMods.value = response.data
  }).finally(() => {
    downloadedModsLoading.value = false
  })
}

const downloadedModSearch = ref('')

const headers = [
  { key: 'preview_url', title: t('game.mod.add.preview') },
  { key: 'name', title: t('game.mod.add.name') },
  { key: 'serverSize', title: t('game.mod.add.size') },
  { key: 'id', title: 'ID' },
  { key: 'update', title: t('game.mod.add.update') },
  { key: 'actions', title: t('game.mod.add.actions') },
]

const selectedMods = ref([])

const handleModAction = (action, mod) => {
  switch (action) {
    case "enable":
      modEnable(mod)
      break
    default:
      showSnackbar("牛哇", "error")
  }
}

const modEnable = (mod) => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 0,
    id: mod.id,
    file_url: mod.file_url,
  }
  modApi.add.enable.post(reqForm).then(response => {
    showSnackbar(response.message)
  })
}


onMounted(() => {
  getDownloadedMods()
})
</script>

<style scoped>
</style>
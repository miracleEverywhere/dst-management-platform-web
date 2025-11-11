<template>
  <v-card>
    <v-card-title>
      添加模组
    </v-card-title>
    <v-card-text class="mt-4">
      <v-text-field
          v-model="downloadedModSearch"
          :loading="downloadedModsLoading"
          label="Search"
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
            刷新
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
            >最新版本</v-chip>
            <v-chip
                v-if="item.serverSize!==item.localSize"
                label
                color="error"
            >需要更新</v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
                color="primary"
                variant="text"
            >
              操作
              <v-menu activator="parent">
                <v-list>
                  <v-list-item
                      @click="handleModAction('enable', item)"
                  >
                    <v-list-item-title>启用</v-list-item-title>
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

const globalStore = useGlobalStore()

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
  { key: 'preview_url', title: 'preview_url' },
  { key: 'name', title: 'name' },
  { key: 'serverSize', title: 'serverSize' },
  { key: 'id', title: 'ID' },
  { key: 'update', title: 'update' },
  { key: 'actions', title: 'actions' },
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
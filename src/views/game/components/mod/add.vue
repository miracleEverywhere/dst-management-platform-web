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
        </v-data-table>
      </v-sheet>

    </v-card-text>


  </v-card>
</template>

<script setup>
import modApi from "@/api/mod"
import useGlobalStore from "@/plugins/store/global.js";
import {formatBytes} from "@/utils/tools.js";

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
]

const selectedMods = ref([])


onMounted(() => {
  getDownloadedMods()
})
</script>

<style scoped>
</style>
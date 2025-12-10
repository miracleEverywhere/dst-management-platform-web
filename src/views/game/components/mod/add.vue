<template>
  <v-card>
    <v-card-title>
      <div class="card-header">
        {{ t('game.mod.add.tabName') }}
        <div>
          <v-btn
            append-icon="ri-arrow-drop-down-line"
            :loading="preDownloadLoading||multiEnableLoading"
            color="primary"
          >
            {{ t('game.mod.add.headerMenuButton') }}
            <v-menu activator="parent">
              <v-list>
                <v-list-item
                  :disabled="preDownloadLoading"
                  class="text-info"
                  @click="preDownload"
                >
                  <template #prepend>
                    <v-icon
                      icon="ri-download-2-line"
                      size="22"
                    />
                  </template>
                  <v-list-item-title>
                    {{ t('game.mod.add.preDownload') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="selectedMods.length===0||multiEnableLoading"
                  class="text-success"
                  @click="multiEnable"
                >
                  <template #prepend>
                    <v-icon
                      icon="ri-list-check-3"
                      size="22"
                    />
                  </template>
                  <v-list-item-title>
                    {{ t('game.mod.add.enableMulti') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="multiEnableLoading"
                  class="text-warning"
                  @click="handleModAction('enable', {id: 0, file_url: ''})"
                >
                  <template #prepend>
                    <v-icon
                      icon="ri-add-line"
                      size="22"
                    />
                  </template>
                  <v-list-item-title>
                    {{ t('game.mod.add.addClientModsDisabled') }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>
      </div>
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
            {{ t('game.mod.add.refresh') }}
          </v-btn>
        </template>
      </v-text-field>
      <v-sheet
        border
        rounded
        class="mt-4"
      >
        <v-data-table
          v-model="selectedMods"
          show-select
          return-object
          :headers="headers"
          :items="downloadedMods"
          :search="downloadedModSearch"
          :loading="downloadedModsLoading"
        >
          <template #loading>
            <v-skeleton-loader type="table-row@10" />
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
          <template #item.name="{ value }">
            <v-chip
              label
              color="info"
            >
              {{ value }}
            </v-chip>
          </template>
          <template #item.serverSize="{ value }">
            <v-chip
              label
              color="primary"
            >
              {{ formatBytes(parseInt(value)) }}
            </v-chip>
          </template>
          <template #item.id="{ value }">
            <v-chip label>
              {{ value }}
            </v-chip>
          </template>
          <template #item.update="{ item }">
            <v-chip
              v-if="item.file_url!==''"
              label
            >
              {{ t('game.mod.add.notUGC') }}
            </v-chip>
            <v-chip
              v-if="item.file_url===''&&item.serverSize===item.localSize"
              label
              color="success"
            >
              {{ t('game.mod.add.needNoUpdate') }}
            </v-chip>
            <v-chip
              v-if="item.file_url===''&&item.serverSize!==item.localSize"
              label
              color="error"
            >
              {{ t('game.mod.add.needUpdate') }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              color="info"
              append-icon="ri-arrow-drop-down-line"
              variant="text"
            >
              {{ t('game.mod.add.actions') }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item
                    :disabled="modEnableLoading"
                    class="text-success"
                    @click="handleModAction('enable', item)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-file-check-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('game.mod.add.enable') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :disabled="modUpdateLoading"
                    class="text-info"
                    @click="handleModAction('update', item)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-arrow-up-circle-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('game.mod.add.updateMod') }}
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
import useGlobalStore from "@store/global.js"
import { formatBytes } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"
import { useI18n } from "vue-i18n"
import roomApi from "@/api/room.js"
import { ref } from "vue"

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
    downloadedMods.value = response.data || []
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
  case "update":
    modUpdate(mod)
    break
  default:
    showSnackbar("牛哇", "error")
  }
}

const modEnableLoading = ref(false)

const modEnable = mod => {
  modEnableLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 0,
    id: mod.id,
    file_url: mod.file_url,
  }

  modApi.add.enable.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    modEnableLoading.value = false
  })
}

const modUpdateLoading = ref(false)

const modUpdate = mod => {
  modUpdateLoading.value = true

  const reqFrom = {
    roomID: globalStore.room.id,
    id: mod.id,
    file_url: mod.file_url,
    update: true,
  }

  modApi.download.post(reqFrom).then(response => {
    showSnackbar(response.message)
    getDownloadedMods()
  }).finally(() => {
    modUpdateLoading.value = false
  })
}

const multiEnableLoading = ref(false)

const multiEnable = async () => {
  let allSuccess = true
  multiEnableLoading.value = true
  console.log(selectedMods.value)
  for (let mod of selectedMods.value) {
    const reqForm = {
      roomID: globalStore.room.id,
      worldID: 0,
      id: mod.id,
      file_url: mod.file_url,
    }

    try {
      await modApi.add.enable.post(reqForm)
    } catch {
      allSuccess = false
      showSnackbar(`${mod.name} ${t('game.mod.add.enableMultiFail')}`, 'error')
    }
  }

  if (allSuccess) {
    selectedMods.value = []
    showSnackbar(t('game.mod.add.enableMultiSuccess'))
  }

  multiEnableLoading.value = false
}

const preDownloadLoading = ref(false)

const preDownload = async () => {
  preDownloadLoading.value = true

  const response = await roomApi.base.get({ id: globalStore.room.id })
  let worlds = response.data.worldData || []
  if (worlds.length===0) {
    showSnackbar(t('game.mod.add.preDownloadFail'), 'error')
    
    return
  }

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: worlds[0]?.id || 0,
  }

  modApi.setting.enabledMods.get(reqForm).then(async response => {
    for (let mod of response.data) {
      const reqFrom = {
        roomID: globalStore.room.id,
        id: mod.id,
        file_url: mod.file_url,
        update: true,
      }

      try {
        const res = await modApi.download.post(reqFrom)

        showSnackbar(`${mod.name} ${t('game.mod.add.preDownloadSuccess')}`)
      } catch {
        showSnackbar(`${mod.name} ${t('game.mod.add.preDownloadFail')}`, 'error')
      }
    }
  }).finally(() => {
    preDownloadLoading.value = false
  })
}


onMounted(() => {
  getDownloadedMods()
})
</script>


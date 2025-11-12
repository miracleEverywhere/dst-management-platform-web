<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <v-card
        :disabled="leftLoading"
        :loading="leftLoading"
      >
        <v-card-title>
          <div class="card-header">
            <span>Enabled Mods</span>
            <v-btn
              prepend-icon="ri-refresh-line"
              color="default"
              variant="text"
              :loading="leftLoading"
              @click="getEnabledMods"
            >
              刷新
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container :height="props.height" style="overflow-y: auto">
            <div v-for="(mod, idx) in enabledMods" style="height: 120px;">
              <v-divider
                v-if="idx!==0"
              />
              <div class="fcc cursor-pointer" v-ripple @click="getModConfig(mod.id, 24, mod.file_url, mod.name)">
                <div class="w-33">
                  <v-img
                    :width="100"
                    :height="100"
                    aspect-ratio="1/1"
                    :src="mod.preview_url"
                    class="ma-2"
                  ></v-img>
                </div>
                <div class="w-66 d-flex justify-start align-center ml-2">
                  <v-chip
                    color="info"
                    label
                  >
                    {{mod.name}}
                  </v-chip>
                </div>
              </div>

            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <div>
        <setting-form
          v-if="dataGot&&!rightLoading"
          :fields="modStruct"
          :initial-data="modValue"
          :height="props.height"
          :title="modName"
          @change="handleFormChange"
        />
        <v-card
          v-if="dataGot&&rightLoading"
        >
          <v-card-text>
            <result type="info" title="正在获取中" :height="props.height+24">

            </result>
          </v-card-text>
        </v-card>
        <v-card
          v-if="!dataGot&&!rightLoading"
        >
          <v-card-text>
            <result type="info" title="请选择一个模组进行配置" :height="props.height+34">

            </result>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'
import SettingForm from '@/views/game/components/mod/settingForm.vue'
import modApi from "@/api/mod"
import { showSnackbar } from "@/utils/snackbar.js"
import useGlobalStore from "@/plugins/store/global.js";
import {truncateString} from "@/utils/tools.js";

const globalStore = useGlobalStore()
const dataGot = ref(false)
const leftLoading = ref(false)
const rightLoading = ref(false)

const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
})

const getEnabledMods = async () => {
  leftLoading.value = true
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 24,
  }
  const response = await modApi.setting.enabledMods.get(reqForm)
  enabledMods.value = response.data
  leftLoading.value = false
}

const getModConfig = async (id, worldID, file_url, name) => {
  dataGot.value = true
  rightLoading.value = true
  modName.value = ""
  await Promise.all([
    getModStruct(id, worldID, file_url),
    getModValue(id, worldID, file_url)
  ])
  modName.value = name
  rightLoading.value = false
}

const getModStruct = async (id, worldID, file_url) => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: worldID,
    id: id,
    file_url: file_url,
  }
  const response = await modApi.setting.modConfigStruct.get(reqForm)
  modStruct.value = response.data || []
}

const getModValue = async (id, worldID, file_url) => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: worldID,
    id: id,
    file_url: file_url,
  }
  const response = await modApi.setting.modConfigValue.get(reqForm)
  modValue.value = response.data?.configuration_options || {}
}

const enabledMods = ref([])
const modStruct = ref([])
const modValue = ref([])
const modName = ref("")

const handleFormChange = (event) => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 24,
    id: 2371484058,
    modORConfig: {
      configuration_options: event.formData,
      enabled: true,
    },
  }
  modApi.setting.modConfigValue.put(reqForm).then(response => {
    showSnackbar(response.message)
  })
}

onMounted(async () => {
  await getEnabledMods()
})
</script>
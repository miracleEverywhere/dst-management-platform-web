<template>
  <div class="page-div">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="Setting" name="Setting">
        <el-row :gutter="10">
          <el-col :lg="8" :md="8" :sm="24" :span="8" :xs="24">
            <el-card v-loading="modSettingFormatLoading" :style="isMobile?'height: 50vh':'height: 70vh'" shadow="never">
              <el-scrollbar :max-height="isMobile?'45vh':'65vh'">
                <template v-for="(mod, index) in modSettingFormat">
                  <div style="display: flex">
                    <div>
                      <el-image :src="mod.preview_url" fit="fill" @click="handleModClick(mod.id)" style="width: 75px; height: 75px"/>
                    </div>
                    <div style="display: flex;margin-left: 5px;flex-direction: column;justify-content: center">
                      <el-button link type="primary" @click="handleModClick(mod.id)">{{ mod.name }}</el-button>
                      <div>
                        <el-tag v-if="mod.enable" type="success">启用</el-tag>
                        <el-tag v-if="!mod.enable" type="info">禁用</el-tag>
                      </div>
                    </div>
                  </div>
                  <el-divider v-if="index !== (modSettingFormat.length - 1)" />
                </template>
              </el-scrollbar>
            </el-card>
          </el-col>
          <el-col :lg="16" :md="16" :sm="24" :span="16" :xs="24">
            <el-card :style="isMobile?'height: 50vh; margin-top: 10px':'height: 70vh'" shadow="never">
              <template v-if="clickedModID!==0">
                <el-scrollbar :max-height="isMobile?'45vh':'65vh'">
                  <el-form ref="modSettingFormRef" :size="isMobile?'small':'large'"
                           :label-position="isMobile?'top':'left'" :label-width="isMobile?'70':'auto'">
                    <el-form-item label="ID">
                      <el-tag>{{modConfigurations.id}}</el-tag>
                    </el-form-item>
                    <el-form-item label="Name">
                      <el-tag type="info">{{modSettingFormat[modSettingFormat.findIndex(item => item.id === clickedModID)].name}}</el-tag>
                    </el-form-item>
                    <template v-for="item in modConfigurations.configOptions">
                      <el-tooltip :show-after="500" effect="light" :content="item.hover" placement="top">
                        <el-form-item :label="item.label">
                          <el-select v-model="modSettingFormat[modSettingFormat.findIndex(item => item.id === clickedModID)].configurationOptions[item.name]">
                            <template v-for="i in item.options">
                              <el-option :label="i.description" :value="i.data"/>
                            </template>
                          </el-select>
                        </el-form-item>
                      </el-tooltip>
                    </template>
                  </el-form>
                  <el-result v-if="modConfigurations.configOptions.length===0"
                             icon="info" title="该模组无配置项"/>
                </el-scrollbar>
              </template>
              <template v-if="clickedModID===0">
                <el-result icon="info" title="请选择一个模组进行配置"/>
              </template>
            </el-card>
          </el-col>

        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Download" name="Download">
      </el-tab-pane>
      <el-tab-pane label="Subscribe" name="Subscribe">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script name="mod" setup>
import modApi from "@/api/mod"
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";


onMounted(async () => {
  await handleGetModSetting()
})

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const activeTabName = ref('Setting')

const modSettingFormat = ref([])
const modSettingFormatLoading = ref(false)
const handleGetModSetting = () => {
  modSettingFormatLoading.value = true
  modApi.settingFormat.get().then(response => {
    modSettingFormat.value = response.data
  }).finally(() => {
    modSettingFormatLoading.value = false
  })
}

const clickedModID = ref(0)
// const clickedModSetting = ref({})
const handleModClick = (modID) => {
  clickedModID.value = modID
  // clickedModSetting.value = modSettingFormat.value.find(item => item.id === clickedModID.value).configurationOptions
  handleGetModConfigurations()
}

const modConfigurationsLoading = ref(false)
const modConfigurations = ref({})
const handleGetModConfigurations = () => {
  modConfigurationsLoading.value = true
  modApi.configOptions.get({id: clickedModID.value}).then(response => {
    modConfigurations.value = response.data
  }).finally(() => {
    modConfigurationsLoading.value = false
  })
}

</script>

<style scoped>
</style>

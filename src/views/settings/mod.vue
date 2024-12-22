<template>
  <div class="page-div">
    <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane label="Download" name="Download">
        <el-card v-loading="modSearchLoading" style="height: 78vh" shadow="never">
          <div>
            <el-form ref="modSearchFormRef" :model="modSearchForm" :inline="true" @keyup.enter="handleModSearch">
              <el-form-item>
                <el-input v-model="modSearchForm.searchText" style="width: 40vw;"></el-input>
                <el-button type="primary" @click="handleModSearch" style="margin-left: 10px">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-scrollbar max-height="60vh">
              <div class="item-container">
                <template v-for="mod in modSearchData.rows">
                  <mod-info :mod="mod"/>
                </template>
              </div>
            </el-scrollbar>
          </div>
          <div class="card-footer" style="margin-top: 20px">
            <el-pagination v-model:current-page="modSearchForm.page" v-model:page-size="modSearchForm.pageSize"
                           :page-sizes="[10, 20, 30, 40, 50, 100]"
                           layout="total, sizes, prev, pager, next" :total="modSearchData.total"
                           @size-change="handlePageSizeChange(modSearchForm.pageSize)"
                           @current-change="handlePageChange(modSearchForm.page)"
            />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Add" name="Add">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-card v-loading="downloadedModLoading" style="height: 70vh" shadow="never">
              <template #header>
                <div class="card-header">
                  <span>已下载的模组</span>
                  <el-tooltip effect="light" :show-after="500" content="该页面只展示手动下载的模组，点击此按钮将同步自动下载的模组到此页面" placement="top">
                    <el-button type="primary" :loading="syncModLoading" @click="handleSyncMod">
                      同步
                    </el-button>
                  </el-tooltip>
                </div>
              </template>
              <el-table :data="downloadedMod" border style="height: 55vh">
                <el-table-column label="name" prop="name"/>
                <el-table-column label="id" prop="id"/>
                <el-table-column label="size">
                  <template #default="scope">
                    {{formatBytes(scope.row.size)}}
                  </template>
                </el-table-column>
                <el-table-column label="action">
                  <template #default="scope">
                    <el-dropdown @command="handleCommand" trigger="click">
                      <el-button type="primary" link :loading="actionsLoading">
                        {{t('setting.button.actions')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{cmd: 'enable', row: scope.row}">启用</el-dropdown-item>
                          <el-dropdown-item :command="{cmd: 'disable', row: scope.row}">禁用</el-dropdown-item>
                          <el-dropdown-item :command="{cmd: 'delete', row: scope.row}">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
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
                  <template v-if="modConfigurations.configOptions.length!==0">
                    <el-form ref="modSettingFormRef" :size="isMobile?'small':'large'"
                             :label-position="isMobile?'top':'left'" :label-width="isMobile?'70':'auto'">
                      <el-form-item label="ID">
                        <el-tag>{{modConfigurations.id}}</el-tag>
                        <el-button @click="aaa">aaa</el-button>
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
                  </template>
                  <template v-if="modConfigurations.configOptions.length===0">
                    <el-result icon="info" title="该模组无配置项"/>
                  </template>

                </el-scrollbar>
              </template>
              <template v-if="clickedModID===0">
                <el-result icon="info" title="请选择一个模组进行配置"/>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script name="settingsMod" setup>
import settingsApi from "@/api/setting/index.js"
import externalApi from "@/api/externalApi/index.js"
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import modInfo from "./components/modInfo.vue"
import {formatBytes} from "../../utils/tools.js";
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts"


onMounted(async () => {
  await handleModSearch()
})

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const activeTabName = ref('Download')
const handleTabClick = (tab, event) => {
  if (tab.paneName === "Add") {
    handleGetDownloadedMod()
  }
  if (tab.paneName === "Setting") {
    handleGetModSetting()
  }
}

const modSettingFormat = ref([])
const modSettingFormatLoading = ref(false)
const handleGetModSetting = () => {
  modSettingFormatLoading.value = true
  settingsApi.mod.settingFormat.get().then(response => {
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
const modConfigurations = ref({
  id: '',
  configOptions: []
})
const handleGetModConfigurations = () => {
  modConfigurationsLoading.value = true
  settingsApi.mod.configOptions.get({id: clickedModID.value}).then(response => {
    modConfigurations.value = response.data
  }).finally(() => {
    modConfigurationsLoading.value = false
  })
}

const aaa = () => {
  settingsApi.mod.test.post({modFormattedData: modSettingFormat.value})
}

const modSearchLoading = ref(false)
const modSearchData = ref({
  total: 0,
  rows: [],
})
const modSearchFormRef = ref()
const modSearchForm = ref({
  page: 1,
  pageSize: 30,
  searchText: "",
})

const handleModSearch = () => {
  modSearchLoading.value = true
  externalApi.modSearch.get(modSearchForm.value).then(response => {
    modSearchData.value.rows = response.data.rows
    modSearchData.value.total = response.data.total
  }).finally(() => {
    modSearchLoading.value = false
  })
}

const handlePageSizeChange = (pageSize) => {
  handleModSearch()
}
const handlePageChange = (page) => {
  handleModSearch()
}

const downloadedMod = ref([])
const downloadedModLoading = ref(false)
const handleGetDownloadedMod = () => {
  downloadedModLoading.value = true
  externalApi.modInfoDownloaded.get().then(response => {
    downloadedMod.value = response.data
  }).finally(() => {
    downloadedModLoading.value = false
  })
}

const syncModLoading = ref(false)
const handleSyncMod = () => {
  syncModLoading.value = true
  settingsApi.mod.sync.post().then(response => {
    koiMsgSuccess(response.message)
    handleGetDownloadedMod()
  }).finally(() => {
    syncModLoading.value = false
  })
}

const actionsLoading = ref(false)
const handleCommand = (actions) => {
  let cmd = actions.cmd
  let row = actions.row
  actionsLoading.value = true
  switch(cmd) {
    case 'enable':
      handleDownload(row)
      break;
    case 'disable':
      handleRestore(row)
      break;
    case 'delete':
      handleDelete(row)
      break;
    default:
      actionsLoading.value = false
      koiMsgError('error')
  }
}

</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}
</style>

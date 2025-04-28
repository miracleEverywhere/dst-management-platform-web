<template>
  <div class="page-div">
    <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane :label="t('setting.mod.tab.download')" name="Download">
        <el-card v-loading="modSearchLoading" shadow="never" style="height: 78vh">
          <div>
            <el-form ref="modSearchFormRef" :inline="true"
                     :model="modSearchForm" @keyup.enter="handleModSearch">
              <el-form-item>
                <el-input v-model="modSearchForm.searchText" :style="isMobile?'width: 75vw;':'width: 50vw;'">
                  <template #prepend>
                    <el-select v-model="modSearchForm.searchType" style="width: 85px">
                      <el-option :label="$t('setting.mod.download.searchTypeText')" value="text"/>
                      <el-option :label="$t('setting.mod.download.searchTypeId')" value="id"/>
                    </el-select>
                  </template>
                  <template #append>
                    <el-button type="primary" @click="handleModSearch">{{ t('setting.mod.download.search') }}</el-button>
                  </template>
                </el-input>
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
                           :total="modSearchData.total" layout="total, sizes, prev, pager, next"
                           @size-change="handlePageSizeChange(modSearchForm.pageSize)"
                           @current-change="handlePageChange(modSearchForm.page)"
            />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="t('setting.mod.tab.add')" name="Add">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-card v-loading="downloadedModLoading" shadow="never" style="height: 75vh">
              <template #header>
                <div class="card-header">
                  <span>{{ t('setting.mod.add.header.title') }}</span>
                  <div>
                    <el-button @click="handleGetDownloadedMod">{{ t('setting.mod.add.header.refresh') }}</el-button>
                    <el-tooltip :content="t('setting.mod.add.header.syncTooltip')" :show-after="500" effect="light"
                                placement="top">
                      <el-button :loading="syncModLoading" type="primary" @click="handleSyncMod">
                        {{ t('setting.mod.add.header.sync') }}
                      </el-button>
                    </el-tooltip>
                    <el-button :loading="addClientModsDisabledConfigButtonLoading"
                               type="danger"
                               :disabled="addClientModsDisabledConfigButtonDisable"
                               @click="handleAddClientModsDisabledConfig"
                    >
                      {{ t('setting.mod.add.header.addClientDisabled') }}
                    </el-button>
                    <el-button v-if="OSPlatform==='darwin'" :loading="macOSExportButtonLoading" type="success"
                               @click="handleMacOSExport">{{ t('setting.mod.add.header.export') }}
                    </el-button>
                  </div>
                </div>
              </template>
              <el-alert :closable="false" :effect="isDark?'light':'dark'" type="warning">{{
                  t('setting.mod.add.alert')
                }}
              </el-alert>
              <el-table :data="downloadedMod" border style="height: 51vh; margin-top: 10px">
                <el-table-column :label="t('setting.mod.add.table.name')" prop="name"/>
                <el-table-column label="ID" prop="id"/>
                <!--el-table-column label="UGC">
                  <template #default="scope">
                    <el-tag v-if="scope.row.file_url===''" type="primary">
                      {{t('setting.mod.add.table.ugc.yes')}}
                    </el-tag>
                    <el-tag v-else type="info">
                      {{t('setting.mod.add.table.ugc.no')}}
                    </el-tag>
                  </template>
                </el-table-column-->
                <el-table-column :label="t('setting.mod.add.table.size')">
                  <template #default="scope">
                    {{ formatBytes(scope.row.size) }}
                  </template>
                </el-table-column>
                <el-table-column :label="t('setting.mod.add.table.downloadedReady.title')">
                  <template #default="scope">
                    <template v-if="scope.row.downloadedReady">
                      <el-text size="small" type="success">
                        {{ t('setting.mod.add.table.downloadedReady.ready') }}
                      </el-text>
                    </template>
                    <template v-if="!scope.row.downloadedReady">
                      <el-text v-if="scope.row.file_url!==''" size="small" type="info">
                        {{ t('setting.mod.add.table.downloadedReady.notUGC') }}
                      </el-text>
                      <el-text v-else size="small" type="warning">
                        {{ t('setting.mod.add.table.downloadedReady.notReady') }}
                      </el-text>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column :label="t('setting.mod.add.table.action')">
                  <template #default="scope">
                    <el-dropdown trigger="click" @command="handleModCommand">
                      <el-button :loading="actionsLoading" link type="primary">
                        {{ t('setting.mod.add.table.action') }}
                        <el-icon class="el-icon--right">
                          <arrow-down/>
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{cmd: 'enable', row: scope.row}">{{ t('setting.mod.add.table.enable') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{cmd: 'delete', row: scope.row}">{{ t('setting.mod.add.table.delete') }}
                          </el-dropdown-item>
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
      <el-tab-pane v-if="!(OSPlatform==='darwin')" :label="t('setting.mod.tab.setting')" name="Setting">
        <el-row :gutter="10">
          <el-col :lg="8" :md="8" :sm="24" :span="8" :xs="24">
            <el-card v-loading="modSettingFormatLoading" :style="isMobile?'height: 50vh':'height: 70vh'" shadow="never">
              <el-scrollbar :max-height="isMobile?'45vh':'65vh'">
                <template v-if="modSettingFormat">
                  <template v-for="(mod, index) in modSettingFormat">
                    <template v-if="mod.id===1">
                      <div style="display: flex">
                        <div>
                          <el-image :src="imageClientModsDisabled" fit="fill" style="width: 75px; height: 75px"
                                    @click="handleModClick(mod.id, mod.file_url)"/>
                        </div>
                        <div style="display: flex;margin-left: 5px;flex-direction: column;justify-content: center">
                          <el-button link type="primary" @click="handleModClick(mod.id, mod.file_url)">{{ t('setting.mod.setting.right.clientModsDisabled') }}</el-button>
                          <div>
                            <el-tag v-if="mod.enable" type="success">{{ t('setting.mod.setting.left.enable') }}</el-tag>
                            <el-tag v-if="!mod.enable" type="info">{{ t('setting.mod.setting.left.disable') }}</el-tag>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div style="display: flex">
                        <div>
                          <el-image :src="mod.preview_url" fit="fill" style="width: 75px; height: 75px"
                                    @click="handleModClick(mod.id, mod.file_url)"/>
                        </div>
                        <div style="display: flex;margin-left: 5px;flex-direction: column;justify-content: center">
                          <el-button link type="primary" @click="handleModClick(mod.id, mod.file_url)">{{ mod.name }}</el-button>
                          <div>
                            <el-tag v-if="mod.enable" type="success">{{ t('setting.mod.setting.left.enable') }}</el-tag>
                            <el-tag v-if="!mod.enable" type="info">{{ t('setting.mod.setting.left.disable') }}</el-tag>
                          </div>
                        </div>
                      </div>
                    </template>
                    <el-divider v-if="index !== (modSettingFormat.length - 1)"/>
                  </template>
                </template>
                <template v-else>
                  <div :style="isMobile?'height: 50vh':'height: 70vh'" class="fcc">
                    <el-result :title="t('setting.mod.setting.left.result')" icon="warning"/>
                  </div>
                </template>
              </el-scrollbar>
            </el-card>
          </el-col>
          <el-col :lg="16" :md="16" :sm="24" :span="16" :xs="24">
            <el-card v-loading="modConfigurationsLoading" :style="isMobile?'height: 50vh; margin-top: 10px':'height: 70vh'"
                     shadow="never">
              <template #header>
                <div class="card-header">
                  <span>{{ t('setting.mod.setting.right.header.title') }}</span>
                  <div>
                    <el-button :disabled="clickedModID<2" :loading="modUpdateButtonLoading"
                               type="primary" @click="handleModUpdate">
                      {{ t('setting.mod.setting.right.header.update') }}
                    </el-button>
                    <el-button :disabled="clickedModID===0" :loading="buttonDisableModLoading" type="danger"
                               @click="handleModDisable">{{ t('setting.mod.setting.right.header.disable') }}
                    </el-button>
                  </div>
                </div>
              </template>
              <template v-if="clickedModID>1">
                <el-scrollbar :max-height="isMobile?'37vh':'57vh'">
                  <template v-if="modConfigurations.configOptions">
                    <el-form ref="modSettingFormRef" :label-position="isMobile?'top':'left'"
                             :label-width="isMobile?'70':'auto'" :size="isMobile?'small':'large'">
                      <el-form-item label="ID">
                        <el-tag>{{ modConfigurations.id }}</el-tag>
                      </el-form-item>
                      <el-form-item :label="t('setting.mod.setting.right.name')">
                        <el-tag type="info">
                          {{ modSettingFormat[modSettingFormat.findIndex(item => item.id === clickedModID)].name }}
                        </el-tag>
                      </el-form-item>
                      <template v-for="item in modConfigurations.configOptions">
                        <el-tooltip :content="item.hover" :show-after="500" effect="light" placement="top">
                          <el-form-item :label="item.label">
                            <el-select
                              v-model="modSettingFormat[modSettingFormat.findIndex(item => item.id === clickedModID)].configurationOptions[item.name]"
                              @change="handleModConfigChange">
                              <template v-for="i in item.options">
                                <el-option :label="i.description" :value="i.data"/>
                              </template>
                            </el-select>
                          </el-form-item>
                        </el-tooltip>
                      </template>
                    </el-form>
                  </template>
                  <template v-else>
                    <div :style="isMobile?'height: 40vh; margin-top: 10px':'height: 60vh'" class="fcc">
                      <el-result :title="t('setting.mod.setting.right.result')" icon="info"/>
                    </div>
                  </template>
                </el-scrollbar>
              </template>
              <template v-if="clickedModID===1">
                <div>
                  <div v-if="language==='zh'" class="tip custom-block">如果启用此配置，则会禁用玩家的本地模组</div>
                  <div v-else class="tip custom-block">If enable this configuration option, the game server will Disable player's client mods</div>
                </div>

              </template>
              <template v-if="clickedModID===0">
                <div :style="isMobile?'height: 40vh; margin-top: 10px':'height: 60vh'" class="fcc">
                  <el-result :title="t('setting.mod.setting.right.result2')" icon="info"/>
                </div>
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
import toolsApi from "@/api/tools/index.js"
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import modInfo from "./components/modInfo.vue"
import {formatBytes} from "@/utils/tools.js";
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts"


onMounted(async () => {
  await handleModSearch()
  await handleGetModSetting()
  handleGetOSPlatform()
})

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

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
  clickedModID.value = 0
  clickedModFileUrl.value = ""
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingsApi.mod.settingFormat.get(reqForm).then(response => {
    modSettingFormat.value = response.data
    for (let i of modSettingFormat.value) {
      if (i.id === 1) {
        addClientModsDisabledConfigButtonDisable.value = true
      }
    }
  }).finally(() => {
    modSettingFormatLoading.value = false
  })
}

const clickedModID = ref(0)
const clickedModFileUrl = ref("")
// const clickedModSetting = ref({})
const handleModClick = (modID, modFileUrl) => {
  clickedModID.value = modID
  clickedModFileUrl.value = modFileUrl
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
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    id: clickedModID.value
  }
  settingsApi.mod.configOptions.get(reqForm).then(response => {
    modConfigurations.value = response.data
  }).finally(() => {
    modConfigurationsLoading.value = false
  })
}

const handleModConfigChange = () => {
  modConfigurationsLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    modFormattedData: modSettingFormat.value
  }
  settingsApi.mod.configChange.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    modConfigurationsLoading.value = false
  })
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
  searchType: "text",
})

const handleModSearch = (resetPage = true) => {
  if (resetPage) {
    modSearchForm.value.page = 1;
  }
  modSearchLoading.value = true
  externalApi.modSearch.get(modSearchForm.value).then(response => {
    modSearchData.value.rows = response.data.rows
    modSearchData.value.total = response.data.total
    if (modSearchForm.value.searchType === "id") {
      koiMsgInfo(language.value === 'zh' ? 'ID搜索不显示评分' : 'Search by ID will not display the vote data')
    }
  }).finally(() => {
    modSearchLoading.value = false
  })
}

const handlePageSizeChange = (pageSize) => {
  handleModSearch(false)
}
const handlePageChange = (page) => {
  handleModSearch(false)
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
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingsApi.mod.sync.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    handleGetDownloadedMod()
  }).finally(() => {
    syncModLoading.value = false
  })
}

const actionsLoading = ref(false)
const handleModCommand = (actions) => {
  let cmd = actions.cmd
  let row = actions.row
  actionsLoading.value = true
  switch (cmd) {
    case 'enable':
      handleModEnable(row)
      break;
    case 'delete':
      handleModDelete(row)
      break;
    default:
      actionsLoading.value = false
      koiMsgError('error')
  }
}
const handleModEnable = (row) => {
  const isUgc = row.file_url === "";
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    isUgc: isUgc,
    id: row.id
  }
  settingsApi.mod.enable.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    actionsLoading.value = false
  })
}

const handleModDelete = (row) => {
  const isUgc = row.file_url === "";
  const reqForm = {
    isUgc: isUgc,
    id: row.id
  }
  settingsApi.mod.delete.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    handleGetDownloadedMod()
  }).finally(() => {
    actionsLoading.value = false
  })
}

const buttonDisableModLoading = ref(false)
const handleModDisable = () => {
  if (clickedModID.value === 1) {
    buttonDisableModLoading.value = true
    const reqForm = {
      clusterName: globalStore.selectedDstCluster,
    }
    settingsApi.mod.deleteClintModsDisabled.post(reqForm).then(response => {
      koiMsgSuccess(response.message)
      handleGetModSetting()
      addClientModsDisabledConfigButtonDisable.value = false
    }).finally(() => {
      buttonDisableModLoading.value = false
    })
  } else {
    buttonDisableModLoading.value = true
    const isUgc = clickedModFileUrl.value === "";
    const reqForm = {
      clusterName: globalStore.selectedDstCluster,
      isUgc: isUgc,
      id: clickedModID.value
    }
    settingsApi.mod.disable.post(reqForm).then(response => {
      koiMsgSuccess(response.message)
      handleGetModSetting()
    }).finally(() => {
      buttonDisableModLoading.value = false
    })
  }
}

const OSPlatform = ref("")
const handleGetOSPlatform = () => {
  toolsApi.osInfo.get().then(response => {
    OSPlatform.value = response.data.Platform
  })
}
const macOSExportButtonLoading = ref(false)
const handleMacOSExport = () => {
  macOSExportButtonLoading.value = true
  settingsApi.mod.macosExport.post().then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    macOSExportButtonLoading.value = false
  })
}

const modUpdateButtonLoading = ref(false)
const handleModUpdate = () => {
  modUpdateButtonLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    isUgc: clickedModFileUrl.value === "",
    id: clickedModID.value,
    fileURL: clickedModFileUrl.value
  }
  settingsApi.mod.update.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    modUpdateButtonLoading.value = false
  })
}

const imageClientModsDisabled = new URL('./images/clientModsDisabled.svg', import.meta.url).href
const updateClientModsDisabledLoading = ref(false)
const handleUpdateClientModsDisabled = () => {

}

const addClientModsDisabledConfigButtonDisable = ref(false)
const addClientModsDisabledConfigButtonLoading = ref(false)
const handleAddClientModsDisabledConfig = () => {
  addClientModsDisabledConfigButtonLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingsApi.mod.addClintModsDisabled.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    addClientModsDisabledConfigButtonLoading.value = false
    addClientModsDisabledConfigButtonDisable.value = true
  })
}

</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}
</style>

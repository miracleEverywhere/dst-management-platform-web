<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane :label="t('setting.players')" name="players">
            <el-card style="height: 78vh" shadow="never">
              <template #header>
                <div class="card-header">
                  {{ t('setting.players') }}
                  <div>
                    <el-button size="default" @click="getPlayerList(true)">{{ t('setting.refresh') }}</el-button>
                  </div>
                </div>
              </template>
              <el-table v-if="playersData" :data="playersData" border size="small" style="width: 100%">
                <el-table-column :label="t('setting.nickName')" prop="nickName"/>
                <el-table-column :label="t('setting.role')" prop="prefab">
                  <template #default="scope">
                    <span v-if="scope.row.prefab===''">{{ t('setting.roleFail') }}</span>
                    <span v-else>{{ scope.row.prefab }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="t('setting.age')" prop="age">
                  <template #default="scope">
                    <el-tag v-if="scope.row.age" type="success">{{ scope.row.age }}</el-tag>
                    <el-tag v-else type="warning">{{ t('setting.roleFail') }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="UID" prop="uid"/>
                <el-table-column :label="t('setting.button.actions')" prop="actions">
                  <template #default="scope">
                    <el-dropdown trigger="hover" @command="handleCommand">
                      <el-button link type="primary">
                        {{ t('setting.button.actions') }}
                        <el-icon class="el-icon--right">
                          <arrow-down/>
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{type: 'admin',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)">{{ t('setting.addAdmin') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'block',uid: scope.row.uid}"
                                            :disabled="blockDisable(scope.row.uid)">{{ t('setting.addBlock') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'white',uid: scope.row.uid}"
                                            :disabled="whiteDisable(scope.row.uid)">{{ t('setting.addWhite') }}
                          </el-dropdown-item>

                          <el-dropdown-item :command="{type: 'kick',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)" divided>
                            {{ t('setting.kick') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'kill',uid: scope.row.uid}">
                            {{ t('setting.kill') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'respawn',uid: scope.row.uid}">
                            {{ t('setting.respawn') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'despawn',uid: scope.row.uid}">
                            {{ t('setting.despawn') }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <el-result v-else :title="t('setting.noPlayersFound')" icon="warning" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="t('setting.adminList')" name="adminList">
            <el-card style="height: 78vh" shadow="never">
              <template #header>
                <div class="card-header">
                  {{ t('setting.adminList') }}
                  <div>
                    <el-button size="default" type="primary" @click="manualAddListDialogVisible=true">
                      {{ t('setting.manualAdd') }}
                    </el-button>
                    <el-button size="default" @click="getPlayerList(true)">{{ t('setting.refresh') }}</el-button>
                  </div>
                </div>
              </template>
              <div v-if="adminListData.length > 0">
                <el-alert :closable="false" :effect="isDark?'light':'dark'" type="success">{{ t('setting.tagCloseTip') }}
                </el-alert>
                <div style="margin-top: 20px">
                  <template v-for="uid in adminListData">
                    <el-tag :effect="isDark?'light':'dark'" closable size="large" style="margin-right: 5px; margin-top: 5px"
                            @close="handlePlayerChange('admin','delete',uid)">
                      {{ uid + getNickname(uid) }}
                    </el-tag>
                  </template>
                  <el-input
                    v-if="InputVisible"
                    ref="InputRef"
                    v-model="InputValue"
                    size="default"
                    class="w-32"
                    style="margin: 5px 5px 0 0"
                    @keyup.enter="handleInputConfirm('admin')"
                    @blur="handleInputConfirm('admin')"
                  />
                  <el-button v-else @click="showInput" style="margin: 5px 5px 0 0">
                    {{language==='zh'?'+ 新增':'+ New'}}
                  </el-button>
                </div>
              </div>
              <el-result v-else :title="t('setting.noAdminFound')" icon="warning" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="t('setting.blockList')" name="blockList">
            <el-card style="height: 78vh" shadow="never">
              <template #header>
                <div class="card-header">
                  {{ t('setting.blockList') }}
                  <div>
                    <el-button size="default" type="primary" @click="manualAddListDialogVisible=true">
                      {{ t('setting.manualAdd') }}
                    </el-button>
                    <el-button type="success" @click="openBlockListDialog">{{t('setting.blockListItems.uploadButton')}}</el-button>
                    <el-button size="default" @click="getPlayerList(true)">{{ t('setting.refresh') }}</el-button>
                  </div>
                </div>
              </template>
              <div v-if="blockListData.length > 0">
                <el-alert :closable="false" :effect="isDark?'light':'dark'" type="success">{{ t('setting.tagCloseTip') }}
                </el-alert>
                <div style="margin-top: 20px">
                  <template v-for="uid in blockListData">
                    <el-tag :effect="isDark?'light':'dark'" closable size="large" style="margin-right: 5px; margin-top: 5px"
                            @close="handlePlayerChange('block','delete',uid)">
                      {{ uid + getNickname(uid) }}
                    </el-tag>
                  </template>
                  <el-input
                    v-if="InputVisible"
                    ref="InputRef"
                    v-model="InputValue"
                    size="default"
                    class="w-32"
                    style="margin: 5px 5px 0 0"
                    @keyup.enter="handleInputConfirm('block')"
                    @blur="handleInputConfirm('block')"
                  />
                  <el-button v-else @click="showInput" style="margin: 5px 5px 0 0">
                    {{language==='zh'?'+ 新增':'+ New'}}
                  </el-button>
                </div>
              </div>
              <el-result v-else :title="$t('setting.noBlockFound')" icon="warning" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="t('setting.whiteList')" name="whiteList">
            <el-card style="height: 78vh" shadow="never">
              <template #header>
                <div class="card-header">
                  {{ t('setting.whiteList') }}
                  <div>
                    <el-button size="default" type="primary" @click="manualAddListDialogVisible=true">
                      {{ t('setting.manualAdd') }}
                    </el-button>
                    <el-button size="default" @click="getPlayerList(true)">{{ t('setting.refresh') }}</el-button>
                  </div>
                </div>
              </template>
              <div v-if="whiteListData.length > 0">
                <el-alert :closable="false" :effect="isDark?'light':'dark'" type="success">{{ t('setting.tagCloseTip') }}
                </el-alert>
                <div style="margin-top: 20px;">
                  <template v-for="uid in whiteListData">
                    <el-tag :effect="isDark?'light':'dark'" closable size="large" style="margin-right: 5px; margin-top: 5px"
                            @close="handlePlayerChange('white','delete',uid)">
                      {{ uid + getNickname(uid) }}
                    </el-tag>
                  </template>
                  <el-input
                    v-if="InputVisible"
                    ref="InputRef"
                    v-model="InputValue"
                    size="default"
                    class="w-32"
                    style="margin: 5px 5px 0 0"
                    @keyup.enter="handleInputConfirm('white')"
                    @blur="handleInputConfirm('white')"
                  />
                  <el-button v-else @click="showInput" style="margin: 5px 5px 0 0">
                    {{language==='zh'?'+ 新增':'+ New'}}
                  </el-button>
                </div>
              </div>
              <el-result v-else :title="$t('setting.noWhiteFound')" icon="warning" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="t('setting.historyPlayer')" name="history">
            <el-card style="height: 78vh" shadow="never">
              <template #header>
                <div class="card-header">
                  <el-tooltip :content="t('setting.historyPlayerTip')" effect="light" placement="top">
                    <div class="fcc">
                      {{ t('setting.historyPlayer') }}
                      <el-icon>
                        <QuestionLine/>
                      </el-icon>
                    </div>

                  </el-tooltip>
                  <div>
                    <el-button size="default" type="danger" @click="handleCleanHistoryPlayer">
                      {{ t('setting.historyClean') }}
                    </el-button>
                    <el-button size="default" @click="handleGetHistoryPlayer(true)">
                      {{ t('setting.refresh') }}
                    </el-button>
                  </div>
                </div>
              </template>
              <el-table ref="tableRef" v-loading="tableLoading" :data="uids" :max-height="isMobile?450:550"
                        border>
                <el-table-column :label="$t('setting.nickName')" prop="nickname"/>
                <el-table-column :label="$t('setting.role')" prop="prefab">
                  <template #default="scope">
                    <el-tag v-if="scope.row.prefab" type="success">{{ scope.row.prefab }}</el-tag>
                    <el-tag v-else type="warning">{{ t('setting.roleFail') }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('setting.age')" prop="age">
                  <template #default="scope">
                    <el-tag v-if="scope.row.age" type="success">{{ scope.row.age }}</el-tag>
                    <el-tag v-else type="warning">{{ t('setting.roleFail') }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="UID" prop="uid"/>
                <el-table-column :label="$t('setting.button.actions')" prop="actions">
                  <template #default="scope">
                    <el-dropdown trigger="hover" @command="handleCommand">
                      <el-button link type="primary">
                        {{ t('setting.button.actions') }}
                        <el-icon class="el-icon--right">
                          <arrow-down/>
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{type: 'admin',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)">{{ t('setting.addAdmin') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'block',uid: scope.row.uid}"
                                            :disabled="blockDisable(scope.row.uid)">{{ t('setting.addBlock') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'white',uid: scope.row.uid}"
                                            :disabled="whiteDisable(scope.row.uid)">{{ t('setting.addWhite') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'kick',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)" divided>{{ t('setting.kick') }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog v-model="blockListUploadVisible" :close-on-click-modal="!uploadLoading"
               :close-on-press-escape="!uploadLoading" :show-close="!uploadLoading" :title="t('setting.blockListItems.uploadButton')"
               width="45%">
      <el-upload ref="uploadRef" v-loading="uploadLoading" :before-upload="checkUploadFile" :http-request="handleUpload"
                 :limit="1" drag>
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          {{ t('setting.import.dialog.text1') }} <em>{{ t('setting.import.dialog.text2') }}</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ t('setting.blockListItems.tips') }}
          </div>
        </template>
      </el-upload>
    </el-dialog>
    <el-dialog v-model="manualAddListDialogVisible" :title="t('setting.manualAdd')" width="60%">
      <el-form style="margin: 30px 20px">
        <el-form-item>
          <el-input v-model="manualAddListUid" :placeholder="t('setting.uidPlaceholder')" style="width: 100%" />
        </el-form-item>
        <div style="display: flex; justify-content: flex-end; padding-top: 10px">
          <el-button type="primary" @click="handleManualAddList">
            {{ t('users.submit') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script name="settingsPlayer" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import settingApi from "@/api/setting"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {QuestionLine} from "@/assets/icons/index.js"
import {UploadFilled} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getPlayerList()
})

const getPlayerList = (tip = false) => {
  settingApi.player.list.get({clusterName: globalStore.selectedDstCluster}).then(response => {
    playersData.value = response.data.players
    uidMap.value = response.data.uidMap
    adminListData.value = []
    if ((response.data.adminList?.length || 0 ) > 0) {
      for (let i of response.data.adminList) {
        if (i !== '') {
          adminListData.value.push(i)
        }
      }
    }
    blockListData.value = []
    if ((response.data.blockList?.length || 0 ) > 0) {
      for (let i of response.data.blockList) {
        if (i !== '') {
          blockListData.value.push(i)
        }
      }
    }

    whiteListData.value = []
    if ((response.data.whiteList?.length || 0 ) > 0) {
      for (let i of response.data.whiteList) {
        if (i !== '') {
          whiteListData.value.push(i)
        }
      }
    }

    if (tip) {
      let message
      if (language.value === 'zh') {
        message = '刷新成功'
      } else {
        message = 'Refresh Success'
      }
      koiMsgSuccess(message)
    }
  })
}

const activeTab = ref('players')

const playersData = ref([])
const uidMap = ref({})
const adminListData = ref([])
const blockListData = ref([])
const whiteListData = ref([])

const adminDisable = (uid) => {
  for (let i of adminListData.value) {
    if (i === uid) {
      return true
    }
  }
}

const blockDisable = (uid) => {
  for (let i of blockListData.value) {
    if (i === uid) {
      return true
    }
  }
}

const whiteDisable = (uid) => {
  for (let i of whiteListData.value) {
    if (i === uid) {
      return true
    }
  }
}

const handleCommand = (cmd) => {
  switch (cmd.type) {
    case 'admin':
      handlePlayerChange(cmd.type,'add', cmd.uid)
      break;
    case 'block':
      handlePlayerChange(cmd.type,'add', cmd.uid)
      break;
    case 'white':
      handlePlayerChange(cmd.type,'add', cmd.uid)
      break;
    case 'kick':
      handleAction(cmd.type, cmd.uid)
      break;
  }
}

const handlePlayerChange = (listName, type, uid) => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    listName: listName,
    type: type,
    uid: uid
  }
  settingApi.player.change.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleAction = (type, uid) => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    uid: uid,
    type: type
  }
  settingApi.player.action.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  })
}

const getNickname = (uid) => {
  if (uid in uidMap.value) {
    return ' [' + uidMap.value[uid] + ']'
  } else {
    if (language.value === 'zh') {
      return ' [暂未获取到]'
    } else {
      return ' [Not yet obtained]'
    }
  }
}

const handleTabClick = (tab, event) => {
  if (tab.paneName === "history") {
    handleGetHistoryPlayer()
  }
}

const uids = ref([])
const tableLoading = ref(false)
const handleGetHistoryPlayer = (tip = false) => {
  tableLoading.value = true
  uids.value = []
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingApi.player.history.get(reqForm).then(response => {
    for (let i of response.data) {
      if (i.uid.length === 11) {
        uids.value.push(i)
      }
    }
    if (tip) {
      let message
      if (language.value === 'zh') {
        message = '刷新成功'
      } else {
        message = 'Refresh Success'
      }
      koiMsgSuccess(message)
    }
  }).finally(() => {
    tableLoading.value = false
  })
}

const uploadRef = ref()
const blockListUploadVisible = ref(false)
const uploadLoading = ref(false)
const openBlockListDialog = () => {
  if (uploadRef.value) {
    // 清空上次上传的文件
    uploadRef.value.clearFiles()
  }
  blockListUploadVisible.value = true
  uploadLoading.value = false
}
const checkUploadFile = (param) => {
  const zipPattern = /\.xls|xlsx$/i;
  if (zipPattern.test(param.name)) {
    return true
  } else {
    koiMsgError(language.value === 'zh' ? '请上传Excel文件' : 'Please upload a Excel file')
    return false
  }
}
const handleUpload = (param) => {
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', param.file)
  settingApi.player.addBlockUpload.post(formData).then(response => {
    getPlayerList()
    koiMsgSuccess(response.message)
  }).finally(() => {
    blockListUploadVisible.value = false
    uploadLoading.value = false
  })
}

const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.name);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name);
      refreshCurrentPage(true);
    });
  }, 0);
};

const InputVisible = ref(false)
const InputRef = ref()
const InputValue = ref('')

const showInput = () => {
  InputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = (listName) => {
  if (InputValue.value) {
    handlePlayerChange(listName, 'add', InputValue.value)
  }
  InputVisible.value = false
  InputValue.value = ''
}

const manualAddListDialogVisible = ref(false)
const manualAddListUid = ref("")
const handleManualAddList = async () => {
  let cmdType = ""
  if (activeTab.value === "adminList") {
    cmdType = "admin"
  }
  if (activeTab.value === "blockList") {
    cmdType = "block"
  }
  if (activeTab.value === "whiteList") {
    cmdType = "white"
  }

  if (cmdType === "") {
    koiMsgError(language.value === 'zh' ? '非法请求' : 'Invalid Request')
    return
  }
  if (manualAddListUid.value === "") {
    koiMsgError(language.value === 'zh' ? '请输入玩家UID' : 'Please enter the player UID')
    return
  }
  if (!(/^KU_/.test(manualAddListUid.value))) {
    koiMsgError(language.value === 'zh' ? '请输入正确的玩家UID' : 'Please enter the correct player UID')
    return
  }

  await handlePlayerChange(cmdType, 'add', manualAddListUid.value)

  manualAddListUid.value = ""
  manualAddListDialogVisible.value = false
}

const handleCleanHistoryPlayer = () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingApi.player.historyClean.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    handleGetHistoryPlayer(false)
  })
}

watch(() => globalStore.selectedDstCluster, (newValue) => {
  if (newValue) {
    nextTick(() => {
      handleRefresh()
    })
  }
}, {immediate: false})
</script>

<style scoped>
</style>
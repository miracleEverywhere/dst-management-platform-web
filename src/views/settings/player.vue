<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('setting.players')" name="players">
            <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
              <template #header>
                <div class="card-header">
                  {{t('setting.players')}}
                  <div>
                    <el-button size="default" @click="getPlayerList(true)">{{t('setting.refresh')}}</el-button>
                  </div>
                </div>
              </template>
              <el-table v-if="playersData" :data="playersData" border style="width: 100%" size="small">
                <el-table-column prop="nickName" :label="$t('setting.nickName')"/>
                <el-table-column prop="prefab" :label="$t('setting.role')">
                  <template #default="scope">
                    <span v-if="scope.row.prefab===''">{{t('setting.roleFail')}}</span>
                    <span v-else>{{scope.row.prefab}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="age" :label="$t('setting.age')">
                  <template #default="scope">
                    <el-tag v-if="scope.row.age" type="success">{{scope.row.age}}</el-tag>
                    <el-tag v-else type="warning">{{t('setting.roleFail')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="uid" label="UID"/>
                <el-table-column prop="actions" :label="$t('setting.button.actions')">
                  <template #default="scope">
                    <el-dropdown @command="handleCommand" trigger="hover">
                      <el-button link type="primary">
                        {{t('setting.button.actions')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{type: 'admin',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)">{{t('setting.addAdmin')}}</el-dropdown-item>
                          <el-dropdown-item :command="{type: 'block',uid: scope.row.uid}"
                                            :disabled="blockDisable(scope.row.uid)">{{t('setting.addBlock')}}</el-dropdown-item>
                          <el-dropdown-item :command="{type: 'white',uid: scope.row.uid}"
                                            :disabled="whiteDisable(scope.row.uid)">{{t('setting.addWhite')}}</el-dropdown-item>
                          <el-dropdown-item :command="{type: 'kick',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)" divided>{{t('setting.kick')}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <el-result v-else icon="warning" :title="$t('setting.noPlayersFound')" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="$t('setting.adminList')" name="adminList">
            <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
              <template #header>
                <div class="card-header">
                  {{t('setting.adminList')}}
                  <div>
                    <el-button size="default" @click="getPlayerList(true)">{{t('setting.refresh')}}</el-button>
                  </div>
                </div>
              </template>
              <div v-if="adminListData.length > 0">
                <el-alert :effect="isDark?'light':'dark'" type="success" :closable="false">{{t('setting.tagCloseTip')}}</el-alert>
                <div style="margin-top: 20px">
                  <template v-for="uid in adminListData">
                    <el-tag size="large" closable @close="handleDeleteAdmin(uid)" :effect="isDark?'light':'dark'"
                            style="margin-right: 5px; margin-top: 5px">
                      {{uid + getNickname(uid)}}
                    </el-tag>
                  </template>
                </div>
              </div>
              <el-result v-else icon="warning" :title="$t('setting.noAdminFound')" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="$t('setting.blockList')" name="blockList">
            <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
              <template #header>
                <div class="card-header">
                  {{t('setting.blockList')}}
                  <div>
                    <el-button size="default" @click="getPlayerList(true)">{{t('setting.refresh')}}</el-button>
                  </div>
                </div>
              </template>
              <div v-if="blockListData.length > 0">
                <el-alert :effect="isDark?'light':'dark'" type="success" :closable="false">{{t('setting.tagCloseTip')}}</el-alert>
                <div style="margin-top: 20px">
                  <template v-for="uid in blockListData">
                    <el-tag size="large" closable @close="handleDeleteBlock(uid)" :effect="isDark?'light':'dark'"
                            style="margin-right: 5px; margin-top: 5px">
                      {{uid + getNickname(uid)}}
                    </el-tag>
                  </template>
                </div>
              </div>
              <el-result v-else icon="warning" :title="$t('setting.noBlockFound')" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="$t('setting.whiteList')" name="whiteList">
            <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
              <template #header>
                <div class="card-header">
                  {{t('setting.whiteList')}}
                  <div>
                    <el-button size="default" @click="getPlayerList(true)">{{t('setting.refresh')}}</el-button>
                  </div>
                </div>
              </template>
              <div v-if="whiteListData.length > 0">
                <el-alert :effect="isDark?'light':'dark'" type="success" :closable="false">{{t('setting.tagCloseTip')}}</el-alert>
                <div style="margin-top: 20px">
                  <template v-for="uid in whiteListData">
                    <el-tag size="large" closable @close="handleDeleteWhite(uid)" :effect="isDark?'light':'dark'"
                            style="margin-right: 5px; margin-top: 5px">
                      {{uid + getNickname(uid)}}
                    </el-tag>
                  </template>
                </div>
              </div>
              <el-result v-else icon="warning" :title="$t('setting.noWhiteFound')" style="margin-top: 10%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="t('setting.historyPlayer')" name="history">
            <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
              <template #header>
                <div class="card-header">
                  <el-tooltip effect="light" :content="t('setting.historyPlayerTip')" placement="top">
                    <div class="fcc">
                      {{t('setting.historyPlayer')}}
                      <el-icon><QuestionLine/></el-icon>
                    </div>

                  </el-tooltip>
                  <el-button size="default" @click="handleGetHistoryPlayer(true)">{{t('setting.refresh')}}</el-button>
                </div>
              </template>
              <el-table ref="tableRef" :data="uids" border v-loading="tableLoading"
                        :max-height="isMobile?450:550">
                <el-table-column :label="$t('setting.nickName')" prop="nickname"/>
                <el-table-column :label="$t('setting.role')" prop="prefab">
                  <template #default="scope">
                    <el-tag v-if="scope.row.prefab" type="success">{{scope.row.prefab}}</el-tag>
                    <el-tag v-else type="warning">{{t('setting.roleFail')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('setting.age')" prop="age">
                  <template #default="scope">
                    <el-tag v-if="scope.row.age" type="success">{{scope.row.age}}</el-tag>
                    <el-tag v-else type="warning">{{t('setting.roleFail')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="UID" prop="uid"/>
                <el-table-column prop="actions" :label="$t('setting.button.actions')">
                  <template #default="scope">
                    <el-dropdown  @command="handleCommand" trigger="hover">
                      <el-button link type="primary">
                        {{t('setting.button.actions')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{type: 'admin',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)">{{t('setting.addAdmin')}}</el-dropdown-item>
                          <el-dropdown-item :command="{type: 'block',uid: scope.row.uid}"
                                            :disabled="blockDisable(scope.row.uid)">{{t('setting.addBlock')}}</el-dropdown-item>
                          <el-dropdown-item :command="{type: 'white',uid: scope.row.uid}"
                                            :disabled="whiteDisable(scope.row.uid)">{{t('setting.addWhite')}}</el-dropdown-item>
                          <el-dropdown-item :command="{type: 'kick',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)" divided>{{t('setting.kick')}}</el-dropdown-item>
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
  </div>
</template>

<script name="settingsPlayer" setup>
import {computed, onMounted, ref} from "vue";
import settingApi from "@/api/setting"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgSuccess} from "@/utils/koi.ts";
import {QuestionLine} from "@/assets/icons/index.js"

const { t } = useI18n()
const { isMobile } = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getPlayerList()
})

const getPlayerList = (tip=false) => {
  settingApi.player.list.get().then(response => {
    playersData.value = response.data.players
    uidMap.value = response.data.uidMap
    adminListData.value = []
    for (let i of response.data.adminList) {
      if (i !== '') {
        adminListData.value.push(i)
      }
    }
    blockListData.value = []
    for (let i of response.data.blockList) {
      if (i !== '') {
        blockListData.value.push(i)
      }
    }
    whiteListData.value = []
    for (let i of response.data.whiteList) {
      if (i !== '') {
        whiteListData.value.push(i)
      }
    }
    if (tip) {
      let message
      if (language.value==='zh') {
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
  switch(cmd.type)
  {
    case 'admin':
      handleAddAdmin(cmd.uid)
      break;
    case 'block':
      handleAddBlock(cmd.uid)
      break;
    case 'white':
      handleAddWhite(cmd.uid)
      break;
    case 'kick':
      handleKick(cmd.uid)
      break;
  }
}

const handleAddAdmin = (uid) => {
  settingApi.player.addAdmin.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleDeleteAdmin = (uid) => {
  settingApi.player.deleteAdmin.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleAddBlock = (uid) => {
  settingApi.player.addBlock.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleDeleteBlock = (uid) => {
  settingApi.player.deleteBlock.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleAddWhite = (uid) => {
  settingApi.player.addWhite.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleDeleteWhite = (uid) => {
  settingApi.player.deleteWhite.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleKick = (uid) => {
  settingApi.player.kick.post({uid: uid}).then(response => {
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
const handleGetHistoryPlayer = (tip=false) => {
  tableLoading.value = true
  uids.value = []
  settingApi.player.history.get().then(response => {
    for (let i of response.data) {
      if (i.uid.length === 11) {
        uids.value.push(i)
      }
    }
    if (tip) {
      let message
      if (language.value==='zh') {
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
</script>

<style scoped>
</style>
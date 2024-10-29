<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="players" name="players">
            <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
              <template #header>
                <div class="card-header">
                  Player List
                  <div>
                    <el-button size="default" @click="getPlayerList(true)">Refresh</el-button>
                  </div>
                </div>
              </template>
              <el-table v-if="playersData" :data="playersData" border style="width: 100%" size="small">
                <el-table-column prop="nickName" label="Nickname"/>
                <el-table-column prop="uid" label="UID"/>
                <el-table-column prop="address" label="Action">
                  <template #default="scope">
                    <el-dropdown @command="handleCommand" trigger="click">
                      <el-button link type="primary">
                        {{t('setting.button.actions')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{type: 'admin',uid: scope.row.uid}"
                                            :disabled="adminDisable(scope.row.uid)">Admin List</el-dropdown-item>
                          <el-dropdown-item command="black">Black List</el-dropdown-item>
                          <el-dropdown-item command="white">White List</el-dropdown-item>
                          <el-dropdown-item command="kick" divided>Kick</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <el-result v-else icon="warning" title="No players found" style="margin-top: 20%"></el-result>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="adminList" name="adminList">Config</el-tab-pane>
          <el-tab-pane label="blockList" name="blockList">Role</el-tab-pane>
          <el-tab-pane label="whiteList" name="whiteList">Task</el-tab-pane>
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
    adminListData.value = response.data.adminList
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
const adminListData = ref([])

const adminDisable = (uid) => {
  for (let i of adminListData.value) {
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
    case 'black':

      break;
    case 'white':

      break;
    case 'kick':

      break;
  }
}
const handleAddAdmin = (uid) => {
  settingApi.player.addAdmin.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
  })
}
</script>

<style scoped>
</style>
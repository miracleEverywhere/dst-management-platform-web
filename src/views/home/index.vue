<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 250px">
          <template #header>
            <div class="card-header">
              {{ t('home.roomInfo') }}
            </div>
          </template>
          <template v-if="roomInfo.roomSettingBase.name!==''">
            <el-descriptions :column="isMobile?1:2">
              <el-descriptions-item :label="t('home.roomName')">
                <el-button v-copy="roomInfo.roomSettingBase.name" link type="primary">
                  {{ roomInfo.roomSettingBase.name }}
                  <el-icon style="margin-left: 3px">
                    <DocumentCopy/>
                  </el-icon>
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item :label="t('home.connectionCode')">
                <el-tooltip :content="connectionCode" effect="light" placement="top">
                  <el-button v-copy="connectionCode" :disabled="connectionCode===''" :loading="connectionCodeLoading" link
                             type="primary">{{ t('home.copy') }}
                  </el-button>
                </el-tooltip>
              </el-descriptions-item>
              <el-descriptions-item :label="t('home.cycles')">
                <el-tag :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                  {{ roomInfo.seasonInfo.cycles }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item :label="t('home.phase')">
                <el-tag v-if="language==='en'" :type="roomInfo.seasonInfo.phase.en==='Failed to retrieve'?'danger':'success'">
                  {{ roomInfo.seasonInfo.phase.en }}
                </el-tag>
                <el-tag v-if="language==='zh'" :type="roomInfo.seasonInfo.phase.zh==='获取失败'?'danger':'success'">
                  {{ roomInfo.seasonInfo.phase.zh }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item :label="t('home.season')">
                <el-tag v-if="language==='en'" :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                  {{ roomInfo.seasonInfo.season.en }} {{ getSeasonDays(roomInfo.seasonInfo.season.en) }}
                </el-tag>
                <el-tag v-if="language==='zh'" :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                  {{ roomInfo.seasonInfo.season.zh }} {{ getSeasonDays(roomInfo.seasonInfo.season.en) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item :label="t('home.mods')">
                <el-tag>{{ roomInfo.modsCount }}</el-tag>
                <el-button link style="margin-left: 10px" type="primary" @click="handleOpenModDialog">{{ t('home.modsButton') }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item :label="t('home.version')">
                <el-tag v-loading="versionLoading" :type="version.local===version.server?'success':'danger'">
                  ({{ version.local }}/{{ version.server }})
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item :label="t('home.playerNum')">
                <el-tag type="primary">{{ roomInfo.playerNum }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </template>
          <template v-if="roomInfo.roomSettingBase.name===''">
            <div class="fcc" style="height: 150px">
              <el-result :title="t('home.noServer')" icon="warning"/>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 250px">
          <template #header>
            <div class="card-header">
              {{ t('home.sysInfo') }}
            </div>
          </template>
          <div class="fcc">
            <el-progress :color="progressColors" :percentage="sysInfo.cpu" type="dashboard">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                <span class="percentage-label">CPU</span>
              </template>
            </el-progress>
            <el-progress :color="progressColors" :percentage="sysInfo.memory" style="margin-left: 10%" type="dashboard">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                <span class="percentage-label">{{ t('home.mem') }}</span>
              </template>
            </el-progress>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 300px':'min-height: 400px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('home.control') }}
            </div>
          </template>
          <div>
            <el-form inline size="large">
              <el-form-item :label="$t('home.master')">
                <el-switch v-model="sysInfo.master" :active-text="$t('home.running')" :active-value="1"
                           :inactive-text="$t('home.terminated')" :inactive-value="0"
                           :loading="masterLoading" inline-prompt @change="masterCavesChange('master')"/>
              </el-form-item>
              <el-form-item :label="$t('home.caves')">
                <el-switch v-model="sysInfo.caves" :active-text="$t('home.running')" :active-value="1"
                           :inactive-text="$t('home.terminated')" :inactive-value="0"
                           :loading="cavesLoading" inline-prompt @change="masterCavesChange('caves')"/>
              </el-form-item>
            </el-form>
            <el-form size="large">
              <el-form-item :label="$t('home.rollback')">
                <el-col v-if="isMobile">
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 1)">1{{ t('home.day') }}
                  </el-button>
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 2)">
                    2{{ t('home.days') }}
                  </el-button>
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 3)">
                    3{{ t('home.days') }}
                  </el-button>
                </el-col>
                <el-col v-if="isMobile">
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 4)">
                    4{{ t('home.days') }}
                  </el-button>
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 5)">
                    5{{ t('home.days') }}
                  </el-button>
                </el-col>
                <el-col v-if="isMobile">

                </el-col>
                <el-col v-if="!isMobile">
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 1)">1{{ t('home.day') }}
                  </el-button>
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 2)">
                    2{{ t('home.days') }}
                  </el-button>
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 3)">
                    3{{ t('home.days') }}
                  </el-button>
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 4)">
                    4{{ t('home.days') }}
                  </el-button>
                  <el-button :disabled="sysInfo.master===0" size="small" @click="handleExec('rollback', 5)">
                    5{{ t('home.days') }}
                  </el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <el-form size="large">
              <el-form-item>
                <el-button size="default" type="success" @click="handleExec('startup', 0)">{{ t('home.startup') }}</el-button>
                <el-button size="default" type="primary" @click="handleExec('restart', 0)">{{ t('home.restart') }}</el-button>
                <el-button size="default" type="warning" @click="handleExec('update', 0)">{{ t('home.update') }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button size="default" type="warning" @click="handleExec('shutdown', 0)">{{ t('home.shutdown') }}</el-button>
                <el-button size="default" type="danger" @click="handleExec('reset', 0)">{{ t('home.reset') }}</el-button>
                <el-tooltip :content="$t('home.deleteTips')" effect="light" placement="top">
                  <el-button color="#626aef" size="default" @click="handleExec('delete', 0)">{{ t('home.delete') }}</el-button>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 300px':'min-height: 400px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('home.interface') }}
            </div>
          </template>
          <div>
            <el-form label-position="top">
              <el-form-item :label="$t('home.announcement')">
                <el-input v-model="announceForm.message" @keyup.enter="handleAnnounce">
                  <template #append>
                    <el-button :loading="announceLoading" @click="handleAnnounce">{{ t('home.send') }}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="Console">
                <el-input v-model="consoleForm.cmd" @keyup.enter="handleConsole">
                  <template #prepend>
                    <el-select v-model="consoleForm.world" style="width: 115px">
                      <el-option :disabled="sysInfo.master===0" :label="$t('home.master')" value="master"/>
                      <el-option :disabled="sysInfo.caves===0" :label="$t('home.caves')" value="caves"/>
                    </el-select>
                  </template>
                  <template #append>
                    <el-button :loading="consoleLoading" @click="handleConsole">{{ t('home.execute') }}</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="modInfoDialogVisible" :close-on-click-modal="false" :title="t('home.modsTable.title')" width="80%">
      <el-table v-loading="modInfoLoading" :data="modInfoList" border height="70vh"
                size="small" style="width: 100%" tooltip-effect="light">
        <el-table-column :label="t('home.modsTable.name')" prop="name">
        </el-table-column>
        <el-table-column :label="t('home.modsTable.pics')" prop="preview_url" width="120px">
          <template #default="scope">
            <el-image :src="scope.row.preview_url" fit="fill" style="width: 100px; height: 100px"/>
          </template>
        </el-table-column>
        <el-table-column :label="t('home.modsTable.size')" prop="size">
          <template #default="scope">
            {{ formatBytes(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('home.modsTable.id')" prop="id"/>
        <el-table-column :label="t('home.modsTable.tags')" prop="tags">
          <template #default="scope">
            <el-tag v-for="item in scope.row.tags" style="margin: 0 5px 5px 0;">{{ item.display_name }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import homeApi from "@/api/home"
import externalApi from "@/api/externalApi"
import {useI18n} from "vue-i18n";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {ElMessageBox, ElNotification} from 'element-plus'
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";
import {formatBytes} from "@/utils/tools.js"


onMounted(() => {
  checkPassword()
  getRoomInfo()
  getVersion()
  getConnectionCode()
  startRequests()
})

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const checkPassword = () => {
  if (globalStore.needUpdatePassword) {
    ElNotification({
      title: t('home.updatePasswordTitle'),
      message: t('home.updatePassword'),
      type: 'warning',
    })
    globalStore.needUpdatePassword = false
  }
}

const loading = ref(false)
const versionLoading = ref(false)
const connectionCodeLoading = ref(false)

const version = ref({
  server: 0,
  local: 0
})
const connectionCode = ref('')

const getVersion = () => {
  versionLoading.value = true
  externalApi.dstVersion.get().then(response => {
    version.value = response.data
  }).finally(() => {
    versionLoading.value = false
  })
}

const getConnectionCode = () => {
  connectionCodeLoading.value = true
  externalApi.connectionCode.get().then(response => {
    connectionCode.value = response.data
  }).finally(() => {
    connectionCodeLoading.value = false
  })
}

const roomInfo = ref({
  roomSettingBase: {},
  seasonInfo: {
    season: {},
    cycles: 0,
    elapsedDays: 0,
    seasonLength: {
      summer: 15,
      autumn: 20,
      spring: 20,
      winter: 15
    },
    phase: {}
  },
  modsCount: 0,
  playerNum: 0,
})
const getRoomInfo = () => {
  homeApi.roomInfo.get().then(response => {
    roomInfo.value = response.data
  })
}

const getSeasonDays = (season) => {
  if (roomInfo.value.seasonInfo.cycles > -1) {
    return `(${roomInfo.value.seasonInfo.elapsedDays}/${roomInfo.value.seasonInfo.seasonLength[season]})`
  } else {
    return ''
  }
}

const sysInfo = ref({
  cpu: 0,
  memory: 0,
  master: 0,
  caves: 0,
})
const getSysInfo = () => {
  homeApi.sysInfo.get().then(response => {
    sysInfo.value = response.data
  })
}
const progressColors = [
  {color: '#5cb87a', percentage: 20},
  {color: '#1989fa', percentage: 40},
  {color: '#e6a23c', percentage: 60},
  {color: '#f56c6c', percentage: 80},
  {color: '#6f7ad3', percentage: 100},
]

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (!masterLoading.value && !cavesLoading.value) {
      getSysInfo()
    }
  }, 2000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const masterLoading = ref(false)
const cavesLoading = ref(false)
const masterCavesChange = (world) => {
  const reqForm = {
    type: 'masterSwitch',
    info: sysInfo.value.master
  }
  if (world === 'master') {
    const reqForm = {
      type: 'masterSwitch',
      info: sysInfo.value.master
    }
    masterLoading.value = true
    homeApi.exec.post(reqForm).finally(() => {
      masterLoading.value = false
    })
  } else {
    const reqForm = {
      type: 'cavesSwitch',
      info: sysInfo.value.caves
    }
    cavesLoading.value = true
    homeApi.exec.post(reqForm).finally(() => {
      cavesLoading.value = false
    })
  }
}

const handleExec = (type, info) => {
  const typeMap = {
    startup: {
      en: 'STARTUP',
      zh: '启动'
    },
    rollback: {
      en: 'ROLLBACK',
      zh: '回档'
    },
    shutdown: {
      en: 'SHUTDOWN',
      zh: '关闭'
    },
    restart: {
      en: 'RESTART',
      zh: '重启'
    },
    update: {
      en: 'UPDATE GAME',
      zh: '更新游戏'
    },
    reset: {
      en: 'RESET GAME',
      zh: '重置游戏'
    },
    delete: {
      en: 'DELETE GAME',
      zh: '删除世界'
    },
  }
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 ${typeMap[type]['zh']} 操作，是否继续？` : `The ${typeMap[type]['en']} operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            type: type,
            info: info
          }
          homeApi.exec.post(reqForm).then(response => {
            koiMsgSuccess(response.message)
            done()
          }).catch(() => {
          }).finally(() => {
            instance.confirmButtonLoading = false
          })
        } else {
          done()
        }
      }
    }
  ).then(() => {
  }).catch(() => {
    koiMsgInfo(t('home.canceled'))
  })
}

const announceLoading = ref(false)
const announceForm = ref({
  message: ''
})
const handleAnnounce = () => {
  if (announceForm.value.message === '') {
    koiMsgError(language.value === 'zh' ? '请输入要宣告的内容' : 'Please enter the content to be announced')
    return
  }
  announceLoading.value = true
  homeApi.interface.announce.post(announceForm.value).then(response => {
    koiMsgSuccess(response.message)
    announceForm.value.message = ''
  }).finally(() => {
    announceLoading.value = false
  })
}

const consoleLoading = ref(false)
const consoleForm = ref({
  cmd: '',
  world: ''
})
const handleConsole = () => {
  if (consoleForm.value.world === '') {
    koiMsgError(language.value === 'zh' ? '请选择地面或洞穴' : 'Please select a world from ground and cave')
    return
  }
  if (consoleForm.value.cmd === '') {
    koiMsgError(language.value === 'zh' ? '请输入要执行的命令' : 'Please enter the command to execute')
    return
  }
  consoleLoading.value = true
  homeApi.interface.console.post(consoleForm.value).then(response => {
    koiMsgSuccess(response.message)
    consoleForm.value.cmd = ''
  }).finally(() => {
    consoleLoading.value = false
  })
}

const modInfoDialogVisible = ref(false)
const modInfoLoading = ref(false)
const modInfoList = ref([])
const handleOpenModDialog = () => {
  modInfoDialogVisible.value = true
  modInfoLoading.value = true
  externalApi.modInfo.get().then(response => {
    modInfoList.value = response.data
  }).finally(() => {
    modInfoLoading.value = false
  })
}

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>

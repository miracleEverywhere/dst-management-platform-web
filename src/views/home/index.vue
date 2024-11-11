<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 250px">
          <template #header>
            <div class="card-header">
              {{t('home.roomInfo')}}
            </div>
          </template>
          <el-descriptions :column="isMobile?1:2">
            <el-descriptions-item :label="$t('home.roomName')">
              <el-button link type="primary" v-copy="roomInfo.roomSettingBase.name">
                {{roomInfo.roomSettingBase.name}}
                <el-icon style="margin-left: 3px"><DocumentCopy /></el-icon>
              </el-button>

            </el-descriptions-item>
            <el-descriptions-item :label="$t('home.connectionCode')">
              <el-tooltip effect="light" :content="roomInfo.connectionCode" placement="top">
              <el-button link v-copy="roomInfo.connectionCode" type="primary">{{t('home.copy')}}</el-button>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('home.cycles')">
              <el-tag :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                {{roomInfo.seasonInfo.cycles}}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('home.phase')">
              <el-tag v-if="language==='en'" :type="roomInfo.seasonInfo.phase.en==='Failed to retrieve'?'danger':'success'">
                {{roomInfo.seasonInfo.phase.en}}
              </el-tag>
              <el-tag v-if="language==='zh'" :type="roomInfo.seasonInfo.phase.zh==='获取失败'?'danger':'success'">
                {{roomInfo.seasonInfo.phase.zh}}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('home.season')">
              <el-tag v-if="language==='en'" :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                {{roomInfo.seasonInfo.season.en}} {{getSeasonDays(roomInfo.seasonInfo.season.en)}}
              </el-tag>
              <el-tag v-if="language==='zh'" :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                {{roomInfo.seasonInfo.season.zh}} {{getSeasonDays(roomInfo.seasonInfo.season.en)}}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('home.mods')">
              <el-tag>{{roomInfo.modsCount}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('home.version')">
              <el-tag :type="roomInfo.version.local===roomInfo.version.server?'success':'danger'">({{roomInfo.version.local}}/{{roomInfo.version.server}})</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 250px">
          <template #header>
            <div class="card-header">
              {{t('home.sysInfo')}}
            </div>
          </template>
          <div class="fcc">
            <el-progress type="dashboard" :percentage="sysInfo.cpu" :color="progressColors">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                <span class="percentage-label">CPU</span>
              </template>
            </el-progress>
            <el-progress type="dashboard" :percentage="sysInfo.memory" :color="progressColors" style="margin-left: 10%">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                <span class="percentage-label">{{t('home.mem')}}</span>
              </template>
            </el-progress>
          </div>

        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 400px'">
          <template #header>
            <div class="card-header">
              {{t('home.control')}}
            </div>
          </template>
          <div>
            <el-form size="large" inline>
              <el-form-item :label="$t('home.master')">
                <el-switch v-model="sysInfo.master" :active-value="1" :inactive-value="0"
                           @change="masterCavesChange('master')" :loading="masterLoading"
                           inline-prompt :active-text="$t('home.running')" :inactive-text="$t('home.terminated')"/>
              </el-form-item>
              <el-form-item :label="$t('home.caves')">
                <el-switch v-model="sysInfo.caves" :active-value="1" :inactive-value="0"
                           @change="masterCavesChange('caves')" :loading="cavesLoading"
                           inline-prompt :active-text="$t('home.running')" :inactive-text="$t('home.terminated')"/>
              </el-form-item>
            </el-form>
            <el-form size="large">
              <el-form-item :label="$t('home.rollback')">
                <el-col v-if="isMobile">
                  <el-button size="small" @click="handleExec('rollback', 1)">1{{t('home.day')}}</el-button>
                  <el-button size="small" @click="handleExec('rollback', 2)">2{{t('home.days')}}</el-button>
                  <el-button size="small" @click="handleExec('rollback', 3)">3{{t('home.days')}}</el-button>
                </el-col>
                <el-col v-if="isMobile">
                  <el-button size="small" @click="handleExec('rollback', 4)">4{{t('home.days')}}</el-button>
                  <el-button size="small" @click="handleExec('rollback', 5)">5{{t('home.days')}}</el-button>
                </el-col>
                <el-col v-if="isMobile">

                </el-col>
                <el-col v-if="!isMobile">
                  <el-button size="small" @click="handleExec('rollback', 1)">1{{t('home.days')}}</el-button>
                  <el-button size="small" @click="handleExec('rollback', 2)">2{{t('home.days')}}</el-button>
                  <el-button size="small" @click="handleExec('rollback', 3)">3{{t('home.days')}}</el-button>
                  <el-button size="small" @click="handleExec('rollback', 4)">4{{t('home.days')}}</el-button>
                  <el-button size="small" @click="handleExec('rollback', 5)">5{{t('home.days')}}</el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <el-form size="large">
              <el-form-item>
                <el-button type="success" size="default" @click="handleExec('startup', 0)">{{t('home.startup')}}</el-button>
                <el-button type="primary" size="default" @click="handleExec('restart', 0)">{{t('home.restart')}}</el-button>
                <el-button type="warning" size="default" @click="handleExec('update', 0)">{{t('home.update')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" size="default" @click="handleExec('shutdown', 0)">{{t('home.shutdown')}}</el-button>
                <el-button type="danger" size="default" @click="handleExec('reset', 0)">{{t('home.reset')}}</el-button>
                <el-tooltip effect="light" :content="$t('home.deleteTips')" placement="top">
                  <el-button color="#626aef" size="default" @click="handleExec('delete', 0)">{{t('home.delete')}}</el-button>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" :style="isMobile?'min-height: 300px':'min-height: 400px'">
          <template #header>
            <div class="card-header">
              {{t('home.interface')}}
            </div>
          </template>
          <div>
            <el-form label-position="top">
              <el-form-item :label="$t('home.announcement')">
                <el-input v-model="announceForm.message" @keyup.enter="handleAnnounce">
                  <template #append>
                    <el-button :loading="announceLoading" @click="handleAnnounce">{{t('home.send')}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="Console">
                <el-input v-model="consoleForm.cmd" @keyup.enter="handleConsole">
                  <template #prepend>
                    <el-select v-model="consoleForm.world" style="width: 115px">
                      <el-option :label="$t('home.master')" value="master" />
                      <el-option :label="$t('home.caves')" value="caves" />
                    </el-select>
                  </template>
                  <template #append>
                    <el-button :loading="consoleLoading" @click="handleConsole">{{t('home.execute')}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import homeApi from "@/api/home"
import {useI18n} from "vue-i18n";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {ElMessageBox, ElNotification} from 'element-plus'
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";


onMounted(() => {
  checkPassword()
  getRoomInfo()
  startRequests()
})

const { t } = useI18n()
const { isMobile } = useScreenStore();
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

const roomInfo = ref({
  roomSettingBase: {

  },
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
  version: {
    server: 0,
    local: 0
  },
  connectionCode: '',
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
  homeApi.sysInfo.get().then(response =>{
    sysInfo.value = response.data
  })
}
const progressColors = [
  { color: '#5cb87a', percentage: 20 },
  { color: '#1989fa', percentage: 40 },
  { color: '#e6a23c', percentage: 60 },
  { color: '#f56c6c', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
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
    language.value==='zh'?`将执行 ${typeMap[type]['zh']} 操作，是否继续？`:`The ${typeMap[type]['en']} operation will be performed. Do you want to continue?`,
    language.value==='zh'?'请确认您的操作':'Please confirm your operation',
    {
      confirmButtonText: language.value==='zh'?'确定':'confirm',
      cancelButtonText: language.value==='zh'?'取消':'cancel',
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
    koiMsgError(language.value==='zh'?'请输入要宣告的内容':'Please enter the content to be announced')
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
  world: 'master'
})
const handleConsole = () => {
  if (consoleForm.value.cmd === '') {
    koiMsgError(language.value==='zh'?'请输入要执行的命令':'Please enter the command to execute')
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

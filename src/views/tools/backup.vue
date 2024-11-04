<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="12" :md="12" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.backup.title1') }}
            </div>
          </template>
          <div>
            <el-progress :percentage="parseFloat(diskUsage.toFixed(1))">
              <template #default="{ percentage }">
                <span>{{t('tools.backup.processBar')}}{{percentage}}%</span>
              </template>
            </el-progress>
          </div>
          <div style="margin-top: 20px">
            <div style="line-height: 50px;">
              <span>{{ t('tools.backup.text1') }}</span>
              <el-time-picker v-model="backupSetting.time" :loading="loadingTime"
                              style="width: 120px;margin: 0 8px" :clearable="false"
                              value-format="HH:mm:ss" @change="handleUpdate"/>
              <span>{{ t('tools.backup.text2') }}</span>
            </div>
            <div style="line-height: 50px;">
              <span>{{ t('tools.backup.text3') }}</span>
              <el-switch v-model="backupSetting.enable" :loading="loadingEnable" :active-text="$t('tools.backup.switchEnable')" :inactive-text="$t('tools.backup.switchDisable')"
                         inline-prompt @change="handleUpdate"
                         style="margin: 0 8px;--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"/>
            </div>
            <div style="line-height: 50px;">
              <span>{{ t('tools.backup.text4') }}</span>
            </div>
            <div style="line-height: 50px;">
              <span>{{ t('tools.backup.text5') }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.backup.title2') }}
              <el-button type="danger" @click="handleMultiDelete">{{ t('tools.backup.multiDelete') }}</el-button>
            </div>
          </template>
          <div>
            <el-row>
              <el-table ref="tableRef" :data="backupFiles" border @selection-change="handleSelectionChange"
                        :max-height="isMobile?'min-height: 450px':'min-height: 650px'">
                <el-table-column type="selection" width="55" />
                <el-table-column :label="$t('tools.backup.tableName')" prop="name"></el-table-column>
                <el-table-column :label="$t('tools.backup.tableCreateTime')" prop="createTime"/>
                <el-table-column prop="actions" :label="$t('setting.button.actions')" width="150">
                  <template #default="scope">
                    <el-button link type="warning" @click="handleRestore(scope.row)">{{ t('tools.backup.restore') }}</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">{{ t('tools.backup.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="toolsBackup">
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";
import {ElMessageBox} from "element-plus";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getInfo()
})

const loadingTime = ref(false)
const loadingEnable = ref(false)

const backupFiles = ref([])
const backupSetting = ref({
  enable: false,
  time: '00:00:00'
})
const diskUsage = ref(0)

const getInfo = () => {
  toolsApi.backup.get().then(response => {
    backupFiles.value = response.data.backupFiles
    backupSetting.value = response.data.backupSetting
    diskUsage.value = response.data.diskUsage
  })
}

const handleUpdate = () => {
  if (!backupSetting.value.time) {
    koiMsgError(t('tools.backup.timeChangeTip'))
    return
  }
  loadingTime.value = true
  loadingEnable.value = true
  const backupForm = {
    time: backupSetting.value.time,
    enable: backupSetting.value.enable
  }
  toolsApi.backup.put(backupForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    loadingTime.value = false
    loadingEnable.value = false
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    language.value==='zh'?`将执行删除操作，是否继续？`:`The DELETE operation will be performed. Do you want to continue?`,
    language.value==='zh'?'请确认您的操作':'Please confirm your operation',
    {
      confirmButtonText: language.value==='zh'?'确定':'confirm',
      cancelButtonText: language.value==='zh'?'取消':'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            name: row.name
          }
          toolsApi.backup.delete(reqForm).then(response => {
            koiMsgSuccess(response.message)
            done()
          }).catch(() => {
          }).finally(() => {
            instance.confirmButtonLoading = false
            getInfo()
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

const handleRestore = (row) => {
  ElMessageBox.confirm(
    language.value==='zh'?`将执行恢复操作，是否继续？`:`The RESTORE operation will be performed. Do you want to continue?`,
    language.value==='zh'?'请确认您的操作':'Please confirm your operation',
    {
      confirmButtonText: language.value==='zh'?'确定':'confirm',
      cancelButtonText: language.value==='zh'?'取消':'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            name: row.name
          }
          toolsApi.backupRestore.post(reqForm).then(response => {
            koiMsgSuccess(response.message)
            done()
          }).catch(() => {
          }).finally(() => {
            instance.confirmButtonLoading = false
            getInfo()
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

const handleMultiDelete = () => {
  if (multipleSelection.value.length === 0) {
    koiMsgError(t('tools.backup.deleteTip'))
    return
  }
  ElMessageBox.confirm(
    language.value==='zh'?`将执行删除操作，是否继续？`:`The DELETE operation will be performed. Do you want to continue?`,
    language.value==='zh'?'请确认您的操作':'Please confirm your operation',
    {
      confirmButtonText: language.value==='zh'?'确定':'confirm',
      cancelButtonText: language.value==='zh'?'取消':'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {

          instance.confirmButtonLoading = true
          const reqForm = {
            names: []
          }
          for (let file of multipleSelection.value) {
            reqForm.names.push(file.name)
          }
          toolsApi.multiDelete.delete(reqForm).then(response => {
            koiMsgSuccess(response.message)
            done()
          }).catch(() => {
          }).finally(() => {
            instance.confirmButtonLoading = false
            getInfo()
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

const tableRef = ref()
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}


</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>

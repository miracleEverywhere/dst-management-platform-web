<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card style="min-height: 70vh" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.backup.title2') }}
              <div>
                <el-button type="warning" @click="openUploadDialog">
                  <div class="fcc">
                    {{ t('tools.backup.ImportBackup') }}
                    <el-tooltip :content="t('tools.backup.ImportBackupTip')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </el-button>
                <el-button :loading="manualBackupLoading" type="primary" @click="handleManualBackup">
                  {{ t('tools.backup.BackupImmediately') }}
                </el-button>
                <el-button type="danger" @click="handleMultiDelete">{{ t('tools.backup.multiDelete') }}</el-button>
              </div>
            </div>
          </template>
          <div>
            <el-progress stroke-width="20" text-inside style="margin-bottom: 20px"
              :percentage="parseFloat(diskUsage.toFixed(1))">
              <template #default="{ percentage }">
                <span>{{ t('tools.backup.processBar') }}{{ percentage }}%</span>
              </template>
            </el-progress>
          </div>
          <div>
            <el-row>
              <el-table ref="tableRef" :data="backupFiles" :max-height="isMobile?450:550" border
                        @selection-change="handleSelectionChange">
                <el-table-column fixed="left" type="selection" width="55"/>
                <el-table-column :label="t('tools.backup.tableCreateTime')" prop="createTime"/>
                <el-table-column :label="t('tools.backup.cycles')" prop="cycles">
                  <template #default="scope">
                    <el-tag type="info">{{scope.row.cycles}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('tools.backup.size')" prop="size">
                  <template #default="scope">
                    {{ formatBytes(scope.row.size) }}
                  </template>
                </el-table-column>
                <el-table-column :label="t('setting.button.actions')" prop="actions" width="120px">
                  <template #default="scope">
                    <el-dropdown trigger="click" @command="handleCommand">
                      <el-button :loading="actionsLoading" link type="primary">
                        {{ t('setting.button.actions') }}
                        <el-icon class="el-icon--right">
                          <arrow-down/>
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{cmd: 'download', row: scope.row}">{{
                              t('tools.backup.download')
                            }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{cmd: 'restore', row: scope.row}">{{
                              t('tools.backup.restore')
                            }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{cmd: 'delete', row: scope.row}">{{
                              t('tools.backup.delete')
                            }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="uploadDialogVisible" :close-on-click-modal="!uploadLoading"
               :close-on-press-escape="!uploadLoading" :show-close="!uploadLoading" :title="t('tools.backup.ImportDialog.title')"
               width="45%">
      <el-upload ref="uploadRef" v-loading="uploadLoading" :before-upload="checkUploadFile" :http-request="handleUpload"
                 :limit="1" drag>
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          {{ t('tools.backup.ImportDialog.text1') }} <em>{{ t('tools.backup.ImportDialog.text2') }}</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ t('tools.backup.ImportDialog.tip') }}
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script name="toolsBackup" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";
import {ElMessageBox} from "element-plus";
import {formatBytes} from "@/utils/tools.js";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import {getToken} from "@/utils/storage.ts";
import {UploadFilled} from "@element-plus/icons-vue";
import settingApi from "@/api/setting/index.js";

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
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  toolsApi.backup.get(reqForm).then(response => {
    backupFiles.value = response.data.backupFiles
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
    language.value === 'zh' ? `将执行删除操作，是否继续？` : `The DELETE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            clusterName: globalStore.selectedDstCluster,
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
  }).finally(() => {
    actionsLoading.value = false
  })
}

const handleRestore = (row) => {
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行恢复操作，是否继续？` : `The RESTORE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            clusterName: globalStore.selectedDstCluster,
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
  }).finally(() => {
    actionsLoading.value = false
  })
}

const handleMultiDelete = () => {
  if (multipleSelection.value.length === 0) {
    koiMsgError(t('tools.backup.deleteTip'))
    return
  }
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行删除操作，是否继续？` : `The DELETE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            clusterName: globalStore.selectedDstCluster,
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

const handleDownload = (row) => {
  let url = `${import.meta.env.VITE_WEB_BASE_API}/download/backup/${globalStore.selectedDstCluster}/${row.name}?authorization=${getToken()}&&clusterName=${globalStore.selectedDstCluster}&&lang=${globalStore.language}`
  window.open(url, '_blank')
  actionsLoading.value = false
}

const actionsLoading = ref(false)
const handleCommand = (actions) => {
  let cmd = actions.cmd
  let row = actions.row
  actionsLoading.value = true
  switch (cmd) {
    case 'download':
      handleDownload(row)
      break;
    case 'restore':
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

const manualBackupLoading = ref(false)
const handleManualBackup = () => {
  manualBackupLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  toolsApi.backup.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    manualBackupLoading.value = false
    getInfo()
  })
}

const uploadLoading = ref(false)
const uploadDialogVisible = ref(false)
const uploadRef = ref()
const openUploadDialog = () => {
  if (uploadRef.value) {
    // 清空上次上传的文件
    uploadRef.value.clearFiles()
  }
  uploadDialogVisible.value = true
}
const checkUploadFile = (param) => {
  const zipPattern = /\.tgz$/i;
  if (zipPattern.test(param.name)) {
    return true
  } else {
    koiMsgError(language.value === 'zh' ? '请上传tgz文件' : 'Please upload a tgz file')
    return false
  }
}
const handleUpload = (param) => {
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', param.file)
  formData.append('clusterName', globalStore.selectedDstCluster)
  toolsApi.backupImport.post(formData).then(response => {
    getInfo()
    koiMsgSuccess(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
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

watch(() => globalStore.selectedDstCluster, (newValue) => {
  if (newValue) {
    nextTick(() => {
      handleRefresh()
    })
  }
}, {immediate: false})
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>

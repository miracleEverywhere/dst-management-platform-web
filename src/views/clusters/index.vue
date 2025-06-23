<template>
  <div class="page-div">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="t('clusters.tab.pane1')" name="info">
        <div class="tip_warning">
          {{ t('clusters.tip1') }}
        </div>
        <el-table :data="clustersInfo" v-loading="loading" border>
          <el-table-column :label="t('clusters.table.name')">
            <template #default="scope">
              <el-tag type="primary">
                {{ scope.row.clusterName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('clusters.table.displayName')">
            <template #default="scope">
              <el-tag type="success">
                {{ scope.row.clusterDisplayName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('clusters.table.status')">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success">
                {{language==='zh'?'激活':'Activated'}}
              </el-tag>
              <el-tag v-else type="info">
                {{language==='zh'?'关闭':'Deactivated'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('clusters.table.world')">
            <template #default="scope">
              <el-tag type="info">
                {{ scope.row.worlds?.length || 0 }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('clusters.table.actions')">
            <template #default="scope">
              <el-dropdown trigger="hover" @command="handleCommand">
                <el-button link type="primary">
                  {{ t('clusters.table.actions') }}
                  <el-icon class="el-icon--right">
                    <arrow-down/>
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{type: 'activate',row: scope.row}">
                      {{ t('clusters.table.action.activate') }}
                    </el-dropdown-item>
                    <el-dropdown-item :command="{type: 'deactivate',row: scope.row}">
                      {{ t('clusters.table.action.deactivate') }}
                    </el-dropdown-item>
                    <el-dropdown-item :command="{type: 'update',row: scope.row}" divided>
                      {{ t('clusters.table.action.update') }}
                    </el-dropdown-item>
                    <el-dropdown-item :command="{type: 'delete',row: scope.row}">
                      {{ t('clusters.table.action.delete') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="t('clusters.tab.pane2')" name="port">
        <div class="tip_success" style="margin-top: 20px">
          {{ t('clusters.tip2') }}
        </div>
        <el-alert v-if="uniquePortNum!==allPortNum" :effect="isDark?'light':'dark'"
                  type="error" :closable="false" style="margin-bottom: 10px">
          <template #title>
            <div class="fcc" style="font-size: 20px">
              {{ t('clusters.tip3') }}
            </div>
          </template>
        </el-alert>
        <el-table :data="clustersWorldPort" v-loading="loading" border>
          <el-table-column :label="t('clusters.table.name')">
            <template #default="scope">
              <el-tag type="primary">
                {{ scope.row.clusterName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('clusters.table.displayName')">
            <template #default="scope">
              <el-tag type="success">
                {{ scope.row.clusterDisplayName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('clusters.table.port')">
            <template #default="scope">
              <template v-if="scope.row.worldPort" v-for="port in scope.row.worldPort">
                <el-text :tag="conflictPorts.includes(port)?'mark':'span'">{{port}}</el-text>
                <span v-if="scope.row.worldPort.indexOf(port) !== scope.row.worldPort.length - 1 ">,</span>
              </template>
              <el-tag v-else type="info">{{t('clusters.table.none')}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="updateDialogVisible" width="65%">
      <template #header>
        {{t('clusters.updateDialog.title')}}
      </template>
      <div class="tip">{{t('clusters.updateDialog.tip1')}}</div>
      <div style="margin: 20px">
        <el-form :model="updateDialogForm">
          <el-form-item :label="t('clusters.updateDialog.clusterName')">
            <el-input disabled v-model="updateDialogForm.clusterName"/>
          </el-form-item>
          <el-form-item :label="t('clusters.updateDialog.newDisplayName')">
            <el-input v-model="updateDialogForm.clusterDisplayName"/>
          </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: flex-end; padding-top: 10px">
          <el-button type="primary" @click="handleClusterUpdate" :loading="updateDialogLoading">
            {{language==='zh'?'更新':'Update'}}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script name="Clusters" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import settingApi from "@/api/setting/index.js";
import {ElMessageBox} from "element-plus";
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";

onMounted(() => {
  getClustersInfo()
  getClustersWorldPort()
})

const {t} = useI18n()
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const activeTab = 'info'

const infoLoading = ref(false)
const portLoading = ref(false)
const loading = computed(() => {
  return infoLoading.value || portLoading.value
})


const clustersInfo = ref([])
const getClustersInfo = () => {
  infoLoading.value = true
  settingApi.clusters.get().then(response => {
    clustersInfo.value = response.data
  }).finally(() => {
    infoLoading.value = false
  })
}

const clustersWorldPort = ref([])
const allPortNum = ref(0)
const uniquePortNum = ref(0)
const conflictPorts = ref([])

const getClustersWorldPort = () => {
  portLoading.value = true
  settingApi.clustersWorldPort.get().then(response => {
    clustersWorldPort.value = response.data
    let ports = []
    for (let cluster of clustersWorldPort.value) {
      if (cluster.worldPort === null) {
        continue
      }
      for (let port of cluster.worldPort) {
        ports.push(port)
      }
    }
    allPortNum.value = ports.length
    uniquePortNum.value = new Set(ports).size
    conflictPorts.value = ports.filter((item, index) => ports.indexOf(item) !== index)
  }).finally(() => {
    portLoading.value = false
  })
}

const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
    if (globalStore.selectedDstCluster === null && globalStore.dstClusters !== null) {
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  })
}

const updateDialogVisible = ref(false)
const updateDialogLoading = ref(false)
const updateDialogForm = ref({
  clusterName: '',
  clusterDisplayName: '',
})

const handleOpenClusterUpdateDialog = (row) => {
  console.log(row)
  updateDialogForm.value = {
    clusterName: row.clusterName,
    clusterDisplayName: '',
  }
  updateDialogVisible.value = true
}

const handleClusterUpdate = () => {
  if (updateDialogForm.value === '') {
    koiMsgError(language.value==='zh'?'请输入集群昵称':'cluster nickname is required')
    return
  }
  updateDialogLoading.value = true
  settingApi.cluster.put(updateDialogForm.value).then(response => {
    settingApi.clusters.get().then(x => {
      clustersInfo.value = x.data
      globalStore.dstClusters = x.data
    })
    koiMsgSuccess(response.message)
    updateDialogVisible.value = false
  }).finally(() => {
    updateDialogLoading.value = false
  })

}

const handleClusterDelete = (row) => {
  const clusterName = row.clusterName
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 删除集群 操作，是否继续？` : `The cluster DELETE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            clusterName: clusterName
          }
          settingApi.cluster.delete(reqForm).then(async response => {
            koiMsgSuccess(response.message)
            await getClustersInfo()
            await getClustersWorldPort()
            await getClusters()
            if (globalStore.selectedDstCluster === clusterName && globalStore.dstClusters !== null) {
              globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
            }
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

const handleClusterActivate = (row) => {
  const clusterName = row.clusterName
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 激活集群 操作，是否继续？` : `The cluster ACTIVATE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            clusterName: clusterName,
            status: true,
          }
          settingApi.cluster.status.put(reqForm).then(async response => {
            koiMsgSuccess(response.message)
            await getClustersInfo()
            await getClustersWorldPort()
            await getClusters()
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

const handleClusterDeactivate = (row) => {
  const clusterName = row.clusterName
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 关闭集群 操作，是否继续？` : `The cluster DEACTIVATE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            clusterName: clusterName,
            status: false,
          }
          settingApi.cluster.status.put(reqForm).then(async response => {
            koiMsgSuccess(response.message)
            await getClustersInfo()
            await getClustersWorldPort()
            await getClusters()
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

const handleCommand = (cmd) => {
  switch (cmd.type) {
    case 'activate':
      handleClusterActivate(cmd.row)
      break;
    case 'deactivate':
      handleClusterDeactivate(cmd.row)
      break;
    case 'update':
      handleOpenClusterUpdateDialog(cmd.row)
      break;
    case 'delete':
      handleClusterDelete(cmd.row)
      break;
  }
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
</style>
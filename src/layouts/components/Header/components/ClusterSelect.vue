<template>
  <div>
    <el-select v-model="globalStore.selectedDstCluster" size="small"
               @visible-change="saveLastCluster" :empty-values="[null]"
               style="width: 100px">
      <el-option v-for="cluster in globalStore.dstClusters"
                 v-if="globalStore.dstClusters" :label="cluster.clusterDisplayName"
                 :value="cluster.clusterName">
      </el-option>
      <el-option value="" label="新建" @click="handleClusterNew"/>
    </el-select>
    <el-dialog v-model="newClusterDialog" width="60%" @closed="handleDialogClose">
      <template #header>
        新建集群
      </template>
      <el-form ref="clusterFormRef" :model="clusterForm" label-position="top"
               :rules="clusterFormRules" :validate-on-rule-change="false">
        <el-form-item :label="t('header.clusters.clusterName')" prop="clusterName">
          <el-input v-model="clusterForm.clusterName"
                    :placeholder="t('header.clusters.validateClusterName')">
          </el-input>
          <div class="el-form-item-msg" style="color: #909399">
            {{ t('header.clusters.tipClusterName') }}
          </div>
        </el-form-item>
        <el-form-item :label="t('header.clusters.clusterDisplayName')" prop="clusterDisplayName">
          <el-input v-model="clusterForm.clusterDisplayName"
                    :placeholder="t('header.clusters.validateClusterDisplayName')">
          </el-input>
          <div class="el-form-item-msg" style="color: #909399">
            {{ t('header.clusters.tipClusterDisplayName') }}
          </div>
        </el-form-item>
        <div style="display: flex; justify-content: flex-end; padding-top: 10px">
          <el-button type="primary" :loading="createLoading" @click="handleCreate">
            {{ t('profile.submit') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import settingApi from '@/api/setting'
import useGlobalStore from "@/stores/modules/global.ts";
import {useI18n} from "vue-i18n";
import setting from "@/api/setting";
import {koiMsgSuccess} from "@/utils/koi.ts";
import {useRouter} from "vue-router";


onMounted(async () => {
  getClusters()
})

const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);
const {t} = useI18n()
const router = useRouter();

const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
    if (globalStore.selectedDstCluster === null && globalStore.dstClusters !== null) {
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  })
}

const lastClusterName = ref("")

const saveLastCluster = (visible) => {
  if (visible) {
    lastClusterName.value = globalStore.selectedDstCluster
  }
}

const handleClusterNew = () => {
  newClusterDialog.value = true
}

const newClusterDialog = ref(false)
const clusterFormRef = ref()
const clusterForm = ref({
  clusterName: "",
  clusterDisplayName: "",
})
const clusterFormRules = {
  clusterName: [
    {required: true, message: t('header.clusters.validateClusterName')}
  ],
}
const createLoading = ref(false)
const handleCreate = () => {
  clusterFormRef.value.validate(valid => {
    if (valid) {
      const reqForm = {
        clusterName: clusterForm.value.clusterName,
        clusterDisplayName: clusterForm.value.clusterDisplayName?clusterForm.value.clusterDisplayName:clusterForm.value.clusterName
      }
      createLoading.value = true
      setting.cluster.post(reqForm).then(async response => {
        newClusterDialog.value = false
        koiMsgSuccess(response.message)
        await getClusters()
        globalStore.selectedDstCluster = clusterForm.value.clusterName
      }).finally(() => {
        createLoading.value = false
      })
    }
  })
}

const handleDialogClose = () => {
  if (globalStore.selectedDstCluster) {
    return
  }
  globalStore.selectedDstCluster = lastClusterName.value
}
</script>

<style scoped>
</style>
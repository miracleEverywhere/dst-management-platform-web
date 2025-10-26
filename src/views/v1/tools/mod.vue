<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.mod.title') }}
            </div>
          </template>
          <div>
            <el-alert :closable="false" :effect="isDark?'light':'dark'" type="warning">{{ t('tools.mod.alert') }}</el-alert>
            <el-result v-if="!installed" :title="t('tools.mod.resultInfo.title')" icon="info">
              <template #sub-title>
                <p>{{ t('tools.mod.resultInfo.subtitle') }}</p>
              </template>
              <template #extra>
                <el-button :loading="loading" type="primary" @click="handleInstall">{{ t('tools.mod.resultInfo.button') }}
                </el-button>
              </template>
            </el-result>
            <el-result v-if="installed" :sub-title="t('tools.mod.resultSuccess.subtitle')" :title="t('tools.mod.resultSuccess.title')"
                       icon="success">
              <template #extra>

              </template>
            </el-result>
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="toolsMod" setup>
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

onMounted(() => {

})

const installed = ref(false)
const loading = ref(false)
const handleInstall = () => {
  loading.value = true
  toolsApi.mod.install.all.post().then(() => {
    installed.value = true
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style scoped>
</style>
<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.update.title') }}
            </div>
          </template>
          <div>
            <div style="line-height: 50px;">
              <span>{{t('tools.update.text1')}}</span>
              <el-time-picker v-model="checkTime" :loading="loadingTime"
                              style="width: 120px;margin: 0 8px" :clearable="false" :editable="false"
                              value-format="HH:mm:ss" @change="handleUpdate"/>
              <span>{{t('tools.update.text2')}}</span>
            </div>
            <div style="line-height: 50px;">
              <span>{{t('tools.update.text3')}}</span>
              <el-switch v-model="checkEnable" :loading="loadingEnable" :active-text="$t('tools.update.switchEnable')" :inactive-text="$t('tools.update.switchDisable')"
                         inline-prompt @change="handleUpdate"
                         style="margin: 0 8px;--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"/>
              <span>{{t('tools.update.text4')}}</span>
            </div>
            <div style="line-height: 50px;">
              <span>{{t('tools.update.text5')}}</span>
              <el-tag :type="localVersion===serverVersion?'success':'warning'" style="margin: 0 8px">{{ localVersion }}</el-tag>
              <span>{{t('tools.update.text6')}}</span>
              <el-tag type="primary" style="margin: 0 8px">{{ serverVersion }}</el-tag>
              <span v-if="localVersion===serverVersion">{{t('tools.update.text7')}}</span>
              <span v-if="localVersion!==serverVersion">{{t('tools.update.text8')}}</span>
            </div>

          </div>
          <el-alert :effect="isDark?'light':'dark'" type="warning" :closable="false" style="margin-top: 20px">{{t('tools.backup.alert')}}</el-alert>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="toolsUpdate" setup>
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";

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

const checkTime = ref("")
const checkEnable = ref(false)
const localVersion = ref(0)
const serverVersion = ref(0)

const getInfo = () => {
  toolsApi.update.get().then(response => {
    checkTime.value = response.data.updateSetting.time
    checkEnable.value = response.data.updateSetting.enable
    localVersion.value = response.data.version.local
    serverVersion.value = response.data.version.server
  })
}

const handleUpdate = () => {
  if (!checkTime.value) {
    koiMsgError(t('tools.backup.timeChangeTip'))
    return
  }
  loadingTime.value = true
  loadingEnable.value = true
  const updateForm = {
    time: checkTime.value,
    enable: checkEnable.value
  }
  toolsApi.update.put(updateForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    loadingTime.value = false
    loadingEnable.value = false
  })
}

</script>

<style scoped>
</style>

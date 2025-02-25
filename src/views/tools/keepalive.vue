<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('tools.keepalive.title') }}
            </div>
          </template>
          <div>
            <div style="line-height: 50px;">
              <span>{{ t('tools.keepalive.text1') }}</span>
            </div>
            <div style="line-height: 50px;">
              <span>{{ t('tools.keepalive.text2') }}</span>
            </div>
            <div style="line-height: 50px;">
              <span>{{ t('tools.keepalive.text3') }}</span>
              <el-switch v-model="keepaliveEnable" :active-text="$t('tools.update.switchEnable')" :inactive-text="$t('tools.update.switchDisable')"
                         :loading="loadingEnable"
                         inline-prompt style="margin: 0 8px;--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                         @change="handleUpdate"/>
              <span>{{ t('tools.keepalive.text4') }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgSuccess} from "@/utils/koi.ts";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getInfo()
})


const loadingEnable = ref(false)
const keepaliveEnable = ref(false)

const getInfo = () => {
  toolsApi.keepalive.get().then(response => {
    keepaliveEnable.value = response.data.enable

  })
}

const handleUpdate = () => {
  loadingEnable.value = true
  const updateForm = {
    enable: keepaliveEnable.value
  }
  toolsApi.keepalive.put(updateForm).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    loadingEnable.value = false
  })
}
</script>

<style scoped>
</style>

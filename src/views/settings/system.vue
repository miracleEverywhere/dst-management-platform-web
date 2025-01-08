<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card style="min-height: 80vh" shadow="never">
          <template #header>
            <div class="card-header">
              系统设置
            </div>
          </template>
          <div>
            {{systemSettingForm}}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="settingsSystem" setup>
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
  handleGetSystemSetting()
})

const systemSettingForm = ref({
  keepaliveFrequency: undefined,
  playerGetFrequency: undefined,
  UIDMaintain: {
    disable: undefined,
    frequency: undefined,
  },
  sysMetricsGet: {
    disable: undefined,
    frequency: undefined,
  },
  bit64: undefined,
})
const handleGetSystemSetting = () => {
  settingApi.system.setting.get().then(response => {
    systemSettingForm.value = response.data
  })
}
</script>

<style scoped>
</style>
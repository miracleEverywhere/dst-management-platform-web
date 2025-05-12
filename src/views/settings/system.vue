<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 80vh">
          <template #header>
            <div class="card-header">
              {{ t('setting.system.title') }}
              <el-button :loading="submitButtonLoading" type="primary"
                         @click="handleSubmit">{{ t('setting.system.titleButton') }}
              </el-button>
            </div>
          </template>
          <div>
            <el-form ref="systemSettingFormRef" :hide-required-asterisk="true"
                     :model="systemSettingForm" :rules="systemSettingFormRules"
                     :size="isMobile?'small':'large'" v-loading="loading"
                     label-position="top">
              <div class="tip_error" style="font-size: 24px; padding: 20px 0 20px 20px">
                {{t('setting.system.tip1')}}
              </div>
              <el-alert :closable="false" type="error"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                    {{ t('setting.system.playerList.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.playerList.title')"
                            prop="schedulerSetting.playerGetFrequency">
                <el-row>
                  <el-col :span="24">
                    <el-input-number v-model="systemSettingForm.schedulerSetting.playerGetFrequency"
                                     controls-position="right" :disabled="userInfo.role!=='admin'">
                      <template #suffix>
                        <span v-if="language==='zh'">秒</span>
                        <span v-else>Second</span>
                      </template>
                    </el-input-number>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.playerList.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-alert :closable="false" type="error"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.uidMap.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.uidMap.title')"
                            prop="schedulerSetting.UIDMaintain.disable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.schedulerSetting.UIDMaintain.disable"
                                    :disabled="userInfo.role!=='admin'">
                      <el-radio :value="false">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="true">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.uidMap.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.uidMap.title2')"
                            prop="schedulerSetting.UIDMaintain.frequency">
                <el-row>
                  <el-col :span="24">
                    <el-input-number v-model="systemSettingForm.schedulerSetting.UIDMaintain.frequency"
                                     controls-position="right" :disabled="userInfo.role!=='admin'">
                      <template #suffix>
                        <span v-if="language==='zh'">分钟</span>
                        <span v-else>Minute</span>
                      </template>
                    </el-input-number>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.uidMap.msg2') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-alert :closable="false" type="error"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.metrics.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.metrics.title')"
                            prop="schedulerSetting.sysMetricsGet.disable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.schedulerSetting.sysMetricsGet.disable"
                                    :disabled="userInfo.role!=='admin'">
                      <el-radio :value="false">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="true">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.metrics.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-alert :closable="false" type="error"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.autoUpdate.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.autoUpdate.title')"
                            prop="schedulerSetting.autoUpdate.enable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.schedulerSetting.autoUpdate.enable"
                                    :disabled="userInfo.role!=='admin'">
                      <el-radio :value="true">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="false">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.autoUpdate.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.autoUpdate.title2')"
                            prop="schedulerSetting.autoUpdate.time">
                <el-row>
                  <el-col :span="24">
                    <el-time-picker v-model="systemSettingForm.schedulerSetting.autoUpdate.time" :clearable="false"
                                    :editable="false" style="width: 120px;margin: 0 8px" :disabled="userInfo.role!=='admin'"
                                    value-format="HH:mm:ss"/>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.autoUpdate.msg2') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-alert :closable="false" type="error"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.playerUpdateMod.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.uidMap.title')"
                            prop="schedulerSetting.playerUpdateMod.disable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.schedulerSetting.playerUpdateMod.disable"
                                    :disabled="userInfo.role!=='admin'">
                      <el-radio :value="false">{{ t('setting.system.playerUpdateMod.enable') }}</el-radio>
                      <el-radio :value="true">{{ t('setting.system.playerUpdateMod.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.playerUpdateMod.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.playerUpdateMod.title2')"
                            prop="schedulerSetting.playerUpdateMod.frequency">
                <el-row>
                  <el-col :span="24">
                    <el-input-number v-model="systemSettingForm.schedulerSetting.playerUpdateMod.frequency"
                                     controls-position="right" :disabled="userInfo.role!=='admin'">
                      <template #suffix>
                        <span v-if="language==='zh'">分钟</span>
                        <span v-else>Minute</span>
                      </template>
                    </el-input-number>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.playerUpdateMod.msg2') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <div class="tip_success" style="font-size: 24px; padding: 20px 0 20px 20px">
                {{t('setting.system.tip2')}}
              </div>
              <el-alert :closable="false" type="success"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.autoRestart.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.autoRestart.title')"
                            prop="sysSetting.autoRestart.enable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.sysSetting.autoRestart.enable">
                      <el-radio :value="true">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="false">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.autoRestart.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.autoRestart.title2')"
                            prop="sysSetting.autoRestart.time">
                <el-row>
                  <el-col :span="24">
                    <el-time-picker v-model="systemSettingForm.sysSetting.autoRestart.time" :clearable="false"
                                    :editable="false" style="width: 120px;margin: 0 8px"
                                    value-format="HH:mm:ss"/>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.autoUpdate.msg2') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-alert :closable="false" type="success"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.autoBackup.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.autoBackup.title')"
                            prop="sysSetting.autoBackup.enable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.sysSetting.autoBackup.enable">
                      <el-radio :value="true">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="false">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.autoBackup.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.autoBackup.title2')"
                            prop="sysSetting.autoBackup.time">
                <el-row>
                  <el-col :span="24">
                    <el-time-picker v-model="systemSettingForm.sysSetting.autoBackup.time" :clearable="false"
                                    :editable="false" style="width: 120px;margin: 0 8px"
                                    value-format="HH:mm:ss"/>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.autoBackup.msg2') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-alert :closable="false" type="success"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.keepalive.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.keepalive.title0')" prop="sysSetting.keepalive.enable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.sysSetting.keepalive.enable">
                      <el-radio :value="true">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="false">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.keepalive.msg0') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.keepalive.title')" prop="sysSetting.keepalive.frequency">
                <el-row>
                  <el-col :span="24">
                    <el-input-number v-model="systemSettingForm.sysSetting.keepalive.frequency" controls-position="right">
                      <template #suffix>
                        <span v-if="language==='zh'">分钟</span>
                        <span v-else>Minute</span>
                      </template>
                    </el-input-number>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.keepalive.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-alert :closable="false" type="success"  :effect="isDark?'light':'dark'" style="margin-bottom: 10px">
                <template #title>
                  <div class="fcc" style="font-size: 20px">
                {{ t('setting.system.bit64.divider') }}
                  </div>
                </template>
              </el-alert>
              <el-form-item :label="t('setting.system.bit64.title')" prop="sysSetting.bit64">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.sysSetting.bit64" :disabled="OSPlatform==='darwin'">
                      <el-radio :value="true">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="false">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.bit64.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="Tick Rate" prop="sysSetting.tickRate">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.sysSetting.tickRate">
                      <el-radio :value="15">15</el-radio>
                      <el-radio :value="30">30</el-radio>
                      <el-radio :value="45">45</el-radio>
                      <el-radio :value="60">60</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.tickRate.msg') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="settingsSystem" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import settingApi from "@/api/setting"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgInfo, koiMsgSuccess, koiNoticeInfo} from "@/utils/koi.ts";
import _ from 'lodash'
import {deepCopy} from "@/utils/tools.js";
import toolsApi from "@/api/tools/index.js";
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import useAuthStore from "@/stores/modules/auth.ts";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const authStore = useAuthStore()
const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);
const userInfo = authStore.userInfo

onMounted(() => {
  handleGetSystemSetting()
  handleGetOSPlatform()
})

const systemSettingFormRef = ref()
const systemSettingFormOld = ref({
  sysSetting: {
    autoRestart: {
      enable: false,
      time: "",
    },
    autoBackup: {
      enable: false,
      time: "",
    },
    keepalive: {
      enable: false,
      frequency: 0,
    },
    bit64: false,
    tickRate: 15,
  },
  schedulerSetting: {
    playerGetFrequency: 30,
    UIDMaintain: {
      disable: false,
      frequency: 0,
    },
    sysMetricsGet: {
      disable: undefined,
      frequency: undefined,
    },
    autoUpdate: {
      enable: false,
      time: "",
    },
    playerUpdateMod: {
      disable: false,
      frequency: 0,
    }
  },
})
const systemSettingForm = ref({
  sysSetting: {
    autoRestart: {
      enable: false,
      time: "",
    },
    autoBackup: {
      enable: false,
      time: "",
    },
    keepalive: {
      enable: false,
      frequency: 0,
    },
    bit64: false,
    tickRate: 15,
  },
  schedulerSetting: {
    playerGetFrequency: 30,
    UIDMaintain: {
      disable: false,
      frequency: 0,
    },
    sysMetricsGet: {
      disable: undefined,
      frequency: undefined,
    },
    autoUpdate: {
      enable: false,
      time: "",
    },
    playerUpdateMod: {
      disable: false,
      frequency: 0,
    }
  },
})
const checkFrequency = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(language.value === 'zh' ? '此条目为必填项' : 'Please input this item'))
  }
  if (!Number.isInteger(value)) {
    return callback(new Error(language.value === 'zh' ? '只允许输入整数' : 'Please input integer'))
  }
  if (value <= 0) {
    return callback(new Error(language.value === 'zh' ? '必须大于0' : 'Must be greater than 0'))
  }
  callback()
}
const systemSettingFormRules = {
  sysSetting: {
    autoRestart: {
      enable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
      time: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    },
    autoBackup: {
      enable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
      time: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    },
    keepalive: {
      enable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
      frequency: [{validator: checkFrequency, trigger: 'blur'}],
    },
    bit64: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    tickRate: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
  },
  schedulerSetting: {
    playerGetFrequency: [{validator: checkFrequency, trigger: 'blur'}],
    UIDMaintain: {
      disable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
      frequency: [{validator: checkFrequency, trigger: 'blur'}]
    },
    sysMetricsGet: {
      disable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    },
    autoUpdate: {
      enable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
      time: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    }
  },
}

const loading = ref(false)
const handleGetSystemSetting = () => {
  loading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingApi.system.setting.get(reqForm).then(response => {
    systemSettingForm.value = response.data
    systemSettingFormOld.value = deepCopy(systemSettingForm.value)
  }).finally(() => {
    loading.value = false
  })
}

const submitButtonLoading = ref(false)
const handleSubmit = () => {
  systemSettingFormRef.value.validate(valid => {
    if (valid) {
      if (_.isEqual(systemSettingFormOld.value, systemSettingForm.value)) {
        koiMsgInfo(language.value === 'zh' ? '配置未修改' : 'System settings not changes')
      } else {
        submitButtonLoading.value = true
        const reqForm = {
          clusterName: globalStore.selectedDstCluster,
          settings: systemSettingForm.value,
        }
        settingApi.system.setting.put(reqForm).then(response => {
          handleGetSystemSetting()
          koiMsgSuccess(response.message)
          if (systemSettingFormOld.value.bit64 !== systemSettingForm.value.bit64) {
            const message = language.value === 'zh' ? '正在后台切换32/64，可依据CPU使用率判断是否执行完毕，执行完毕后重启游戏即可。' : 'The background switching 32-bit/64-bit task is in progress, and you can determine if it has completed based on the CPU usage. Once it\'s completed, you can restart the game.'
            const title = language.value === 'zh' ? '系统提示' : 'Tip'
            koiNoticeInfo(message, title, 10000)
          }
        }).finally(() => {
          submitButtonLoading.value = false
        })
      }
    }
  })
}

const OSPlatform = ref("")
const handleGetOSPlatform = () => {
  toolsApi.osInfo.get().then(response => {
    OSPlatform.value = response.data.Platform
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
</style>
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
                     :size="isMobile?'small':'large'"
                     label-position="top">
              <el-divider content-position="left">{{ t('setting.system.keepalive.divider') }}</el-divider>
              <el-form-item :label="t('setting.system.keepalive.title0')" prop="keepaliveDisable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.keepaliveDisable">
                      <el-radio :value="false">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="true">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.keepalive.msg0') }}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.keepalive.title')" prop="keepaliveFrequency">
                <el-row>
                  <el-col :span="24">
                    <el-input-number v-model="systemSettingForm.keepaliveFrequency" controls-position="right">
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
              <el-divider content-position="left">{{ t('setting.system.playerList.divider') }}</el-divider>
              <el-form-item :label="t('setting.system.playerList.title')" prop="playerGetFrequency">
                <el-row>
                  <el-col :span="24">
                    <el-input-number v-model="systemSettingForm.playerGetFrequency" controls-position="right">
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
              <el-divider content-position="left">{{ t('setting.system.uidMap.divider') }}</el-divider>
              <el-form-item :label="t('setting.system.uidMap.title')" prop="UIDMaintain.disable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.UIDMaintain.disable">
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
              <el-form-item :label="t('setting.system.uidMap.title2')" prop="UIDMaintain.frequency">
                <el-row>
                  <el-col :span="24">
                    <el-input-number v-model="systemSettingForm.UIDMaintain.frequency" controls-position="right">
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
              <el-divider content-position="left">{{ t('setting.system.metrics.divider') }}</el-divider>
              <el-form-item :label="t('setting.system.metrics.title')" prop="sysMetricsGet.disable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.sysMetricsGet.disable">
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
              <el-divider content-position="left">{{ t('setting.system.bit64.divider') }}</el-divider>
              <el-form-item :label="t('setting.system.bit64.title')" prop="bit64">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.bit64" :disabled="OSPlatform==='darwin'">
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
              <el-divider content-position="left">{{ t('setting.system.tickRate.title') }}</el-divider>
              <el-form-item label="Tick Rate" prop="tickRate">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.tickRate">
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
              <el-divider content-position="left">{{ t('setting.system.encodeUserPath.divider') }}</el-divider>
              <el-form-item :label="t('setting.system.encodeUserPath.ground')" prop="encodeUserPath.ground">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.encodeUserPath.ground">
                      <el-radio :value="true">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="false">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="t('setting.system.encodeUserPath.cave')" prop="encodeUserPath.cave">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.encodeUserPath.cave">
                      <el-radio :value="true">{{ t('setting.system.uidMap.enable') }}</el-radio>
                      <el-radio :value="false">{{ t('setting.system.uidMap.disable') }}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{ t('setting.system.encodeUserPath.msg') }}
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
import {computed, onMounted, ref} from "vue";
import settingApi from "@/api/setting"
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgInfo, koiMsgSuccess, koiNoticeInfo} from "@/utils/koi.ts";
import _ from 'lodash'
import {deepCopy} from "@/utils/tools.js";
import toolsApi from "@/api/tools/index.js";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  handleGetSystemSetting()
  handleGetOSPlatform()
})

const systemSettingFormRef = ref()
const systemSettingFormOld = ref({
  keepaliveDisable: undefined,
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
  tickRate: undefined,
  encodeUserPath: {
    ground: false,
    cave: false,
  }
})
const systemSettingForm = ref({
  keepaliveDisable: undefined,
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
  tickRate: undefined,
  encodeUserPath: {
    ground: false,
    cave: false,
  }
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
  keepaliveDisable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
  keepaliveFrequency: [
    {validator: checkFrequency, trigger: 'blur'}
  ],
  playerGetFrequency: [{validator: checkFrequency, trigger: 'blur'}],
  UIDMaintain: {
    disable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    frequency: [{validator: checkFrequency, trigger: 'blur'}]
  },
  sysMetricsGet: {
    disable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
  },
  bit64: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
  tickRate: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
  encodeUserPath: {
    ground: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    cave: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
  }
}

const handleGetSystemSetting = () => {
  settingApi.system.setting.get().then(response => {
    systemSettingForm.value = response.data
    systemSettingFormOld.value = deepCopy(systemSettingForm.value)
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
        settingApi.system.setting.put(systemSettingForm.value).then(response => {
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
</script>

<style scoped>
</style>
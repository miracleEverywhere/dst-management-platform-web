<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card style="min-height: 80vh" shadow="never">
          <template #header>
            <div class="card-header">
              {{t('setting.system.title')}}
              <el-button :loading="submitButtonLoading" type="primary"
                         @click="handleSubmit">{{t('setting.system.titleButton')}}</el-button>
            </div>
          </template>
          <div>
            <el-form ref="systemSettingFormRef" label-position="top"
                     :model="systemSettingForm" :rules="systemSettingFormRules"
                     :hide-required-asterisk="true"
                     :size="isMobile?'small':'large'">
              <el-divider content-position="left">{{t('setting.system.keepalive.divider')}}</el-divider>
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
                      {{t('setting.system.keepalive.msg')}}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-divider content-position="left">{{t('setting.system.playerList.divider')}}</el-divider>
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
                      {{t('setting.system.playerList.msg')}}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-divider content-position="left">{{t('setting.system.uidMap.divider')}}</el-divider>
              <el-form-item :label="t('setting.system.uidMap.title')" prop="UIDMaintain.disable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.UIDMaintain.disable">
                      <el-radio :value="false">{{t('setting.system.uidMap.enable')}}</el-radio>
                      <el-radio :value="true">{{t('setting.system.uidMap.disable')}}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{t('setting.system.uidMap.msg')}}
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
                      {{t('setting.system.uidMap.msg2')}}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-divider content-position="left">{{t('setting.system.metrics.divider')}}</el-divider>
              <el-form-item :label="t('setting.system.metrics.title')" prop="sysMetricsGet.disable">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.sysMetricsGet.disable">
                      <el-radio :value="false">{{t('setting.system.uidMap.enable')}}</el-radio>
                      <el-radio :value="true">{{t('setting.system.uidMap.disable')}}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{t('setting.system.metrics.msg')}}
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-divider content-position="left">{{t('setting.system.bit64.divider')}}</el-divider>
              <el-form-item :label="t('setting.system.bit64.title')" prop="bit64">
                <el-row>
                  <el-col :span="24">
                    <el-radio-group v-model="systemSettingForm.bit64">
                      <el-radio :value="true">{{t('setting.system.uidMap.enable')}}</el-radio>
                      <el-radio :value="false">{{t('setting.system.uidMap.disable')}}</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24">
                    <div class="el-form-item-msg" style="color: #A8ABB2">
                      {{t('setting.system.bit64.msg')}}
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
import {koiMsgSuccess, koiMsgInfo} from "@/utils/koi.ts";
import _ from 'lodash'
import {deepCopy} from "@/utils/tools.js";

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  handleGetSystemSetting()
})

const systemSettingFormRef = ref()
const systemSettingFormOld = ref({
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
const checkFrequency = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(language.value==='zh'?'此条目为必填项':'Please input this item'))
  }
  if (!Number.isInteger(value)) {
    return callback(new Error(language.value==='zh'?'只允许输入整数':'Please input integer'))
  }
  if (value <= 0) {
    return callback(new Error(language.value==='zh'?'必须大于0':'Must be greater than 0'))
  }
  callback()
}
const systemSettingFormRules = {
  keepaliveFrequency: [
    { validator: checkFrequency, trigger: 'blur' }
  ],
  playerGetFrequency: [{ validator: checkFrequency, trigger: 'blur' }],
  UIDMaintain: {
    disable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
    frequency: [{ validator: checkFrequency, trigger: 'blur' }]
  },
  sysMetricsGet: {
    disable: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
  },
  bit64: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'change'}],
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
        koiMsgInfo(language.value==='zh'?'配置未修改':'System settings not changes')
      } else {
        submitButtonLoading.value = true
        settingApi.system.setting.put(systemSettingForm.value).then(response => {
          handleGetSystemSetting()
          koiMsgSuccess(response.message)
        }).finally(() => {
          submitButtonLoading.value = false
        })
      }
    }
  })
}
</script>

<style scoped>
</style>
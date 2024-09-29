<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card>
          <div style="font-size: 28px;">{{ userInfo.nickname }}</div>
          <div style="font-size: 14px; color: #73767a; margin-top: 5px">{{ userInfo.username }}</div>
        </el-card>

      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card>
          <el-form ref="updatePasswordFormRef" :model="updatePasswordForm" :rules="updatePasswordRules" label-width="80">
            <el-form-item :label="$t('profile.password')" prop="password">
              <el-input v-model="updatePasswordForm.password" show-password></el-input>
              <sc-password-strength v-model="updatePasswordForm.password"></sc-password-strength>
              <div class="el-form-item-msg">{{t('profile.suggestedPassword')}}</div>
            </el-form-item>
            <el-form-item :label="$t('profile.passwordTwice')" prop="passwordTwice">
              <el-input v-model="updatePasswordForm.passwordTwice" show-password></el-input>
            </el-form-item>
            <div style="display: flex; justify-content: flex-end; padding-top: 40px">
              <el-button type="primary" @click="handleUpdatePassword">修改</el-button>
            </div>
          </el-form>
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script setup>

import {reactive, ref} from "vue";
import useAuthStore from "@/stores/modules/auth.ts";
import {useI18n} from "vue-i18n";
import scPasswordStrength from "@/components/scPasswordStrength/index.vue";
import systemApi from "@/api/system"
import {SHA512, sleep} from "@/utils/tools.js";
import {koiMsgSuccess, koiNoticeWarning} from "@/utils/koi.ts";
import {koiLocalStorage, koiSessionStorage} from "@/utils/storage.ts";
import {LOGIN_URL} from "@/config/index.ts";

const authStore = useAuthStore()
const { t } = useI18n()
const userInfo = authStore.userInfo

const updatePasswordFormRef = ref()
const updatePasswordForm = reactive({
  password: '',
  passwordTwice: ''
})
const updatePasswordRules = {
  password: [
    { required: true, message: t('profile.plzInput')+' '+t('profile.password')}
  ],
  passwordTwice: [
    { required: true, message: t('profile.plzInputAgain')+' '+t('profile.password')},
    { validator: (rule, value, callback) => {
        if (value !== updatePasswordForm.password) {
          callback(new Error(t('profile.passwordNotMatch')));
        }else{
          callback();
        }
      }}
  ],
}

const handleUpdatePassword = () => {
  updatePasswordFormRef.value.validate(valid => {
    if (valid) {
      systemApi.updatePassword.post({password: SHA512(updatePasswordForm.password)}).then(async response => {
        koiMsgSuccess(response.message)
        await sleep(1000)
        koiNoticeWarning(t('profile.passwordUpdated'), t('profile.passwordUpdatedTitle'), 3000)
        await sleep(3000)
        koiSessionStorage.clear();
        // 如果不想要保存上次登录设置的全局颜色、布局等，则将下方第一行清空全部代码打开。
        // koiLocalStorage.clear();
        koiLocalStorage.remove("user");
        koiLocalStorage.remove("keepAlive");
        koiLocalStorage.remove("tabs");
        // 退出登录。必须使用replace把页面缓存刷掉。
        window.location.replace(LOGIN_URL);
      })
    }
  })

}
</script>

<style scoped>
.centered-content {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 填充 el-aside 的高度 */
}

.line-break {
  display: flex;
  flex-direction: column; /* 设置为垂直方向的列布局 */
  align-items: center; /* 水平居中内部元素 */
  text-align: center; /* 文字内容居中对齐 */
}
</style>
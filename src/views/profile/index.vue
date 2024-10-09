<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card style="min-height: 400px">
          <template #header>
            <div class="card-header">
              {{t('profile.cardHeaderInfo')}}
            </div>
          </template>
          <div class="parent">
            <div class="child" style="font-size: 28px;">{{ language==='zh'?userInfo.nickname:'Admin' }}</div>
            <div class="child" style="font-size: 14px; color: #73767a; margin-top: 5px">{{ userInfo.username }}</div>
          </div>
        </el-card>

      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card style="min-height: 400px">
          <template #header>
            <div class="card-header">
              {{t('profile.cardHeaderPassword')}}
            </div>
          </template>
          <el-form ref="updatePasswordFormRef" :model="updatePasswordForm" :rules="updatePasswordRules" label-width="150" label-position="top" style="margin-top: 20px">
            <el-form-item :label="$t('profile.password')" prop="password">
              <el-input v-model="updatePasswordForm.password" show-password></el-input>
              <sc-password-strength v-model="updatePasswordForm.password"></sc-password-strength>
              <div class="el-form-item-msg">{{t('profile.suggestedPassword')}}</div>
            </el-form-item>
            <el-form-item :label="$t('profile.passwordTwice')" prop="passwordTwice">
              <el-input v-model="updatePasswordForm.passwordTwice" show-password></el-input>
            </el-form-item>
            <div style="display: flex; justify-content: flex-end; padding-top: 80px">
              <el-button type="primary" @click="handleUpdatePassword">修改</el-button>
            </div>
          </el-form>
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script setup>

import {computed, reactive, ref} from "vue";
import useAuthStore from "@/stores/modules/auth.ts";
import {useI18n} from "vue-i18n";
import scPasswordStrength from "@/components/scPasswordStrength/index.vue";
import systemApi from "@/api/system"
import {SHA512, sleep} from "@/utils/tools.js";
import {koiMsgSuccess, koiNoticeWarning} from "@/utils/koi.ts";
import {koiLocalStorage, koiSessionStorage} from "@/utils/storage.ts";
import {LOGIN_URL} from "@/config/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const authStore = useAuthStore()
const { t } = useI18n()
const userInfo = authStore.userInfo
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const updatePasswordFormRef = ref()
const updatePasswordForm = reactive({
  password: '',
  passwordTwice: ''
})
const updatePasswordRules = {
  password: [
    { required: true, message: t('profile.plzInputPassword')}
  ],
  passwordTwice: [
    { required: true, message: t('profile.plzInputAgainPassword')},
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
.parent {
  display: flex;
  flex-direction: column; /* 使子元素纵向排列 */
  align-items: center; /* 子元素水平居中 */
  justify-content: center; /* 子元素垂直居中 */
  margin-top: 50px;
}
.child {
  width: 80%; /* 子元素的宽度 */
  margin: 10px 0; /* 子元素之间的间距 */
  text-align: center; /* 文本居中 */
}
</style>
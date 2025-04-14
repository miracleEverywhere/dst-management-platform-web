<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 70vh">
          <template #header>
            <div class="card-header">
                  <span>
                    {{t('profile.cardHeaderInfo')}}
                  </span>
            </div>
          </template>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh">
            <div  style="height: 12vh; width: 35vh">
              <el-image :src="logo" fit="contain"></el-image>
            </div>
            <div style="font-size: 32px; font-weight: 800;">
              {{userInfo.nickname}}
            </div>
            <div style="font-size: 24px; color: #909399; margin-top: 10px">
              {{userInfo.username}}
            </div>
            <div style="font-size: 24px; color: #606266; margin-top: 10px">
              {{userInfo.role}}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 70vh">
          <template #header>
            <div class="card-header">
              <span>
                {{t('profile.cardHeaderPassword')}}
              </span>
            </div>
          </template>
          <el-form ref="updatePasswordFormRef" :model="updatePasswordForm" :rules="updatePasswordRules" label-position="top"
                   label-width="150" style="margin-top: 20px">
            <el-form-item :label="$t('profile.oldPassword')" prop="oldPassword">
              <el-input v-model="updatePasswordForm.oldPassword" show-password></el-input>
            </el-form-item>
            <el-form-item :label="$t('profile.password')" prop="password">
              <el-input v-model="updatePasswordForm.password" show-password></el-input>
              <sc-password-strength v-model="updatePasswordForm.password"></sc-password-strength>
              <div class="el-form-item-msg">{{ t('profile.suggestedPassword') }}</div>
            </el-form-item>
            <el-form-item :label="$t('profile.passwordTwice')" prop="passwordTwice">
              <el-input v-model="updatePasswordForm.passwordTwice" show-password></el-input>
            </el-form-item>
            <div style="display: flex; justify-content: flex-end; padding-top: 10px">
              <el-button type="primary" @click="handleUpdatePassword">{{ t('profile.update') }}</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="profile" setup>
import ScPasswordStrength from "@/components/scPasswordStrength/index.vue"
import {computed, reactive, ref} from "vue";
import useAuthStore from "@/stores/modules/auth.ts";
import {useI18n} from "vue-i18n";
import systemApi from "@/api/system"
import {deepCopy, SHA512, sleep} from "@/utils/tools.js";
import {koiMsgInfo, koiMsgSuccess, koiNoticeWarning} from "@/utils/koi.ts";
import {koiLocalStorage, koiSessionStorage} from "@/utils/storage.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {ElMessageBox} from "element-plus";

const authStore = useAuthStore()
const {t} = useI18n()
const userInfo = authStore.userInfo
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const updatePasswordFormRef = ref()
const updatePasswordForm = reactive({
  oldPassword: '',
  password: '',
  passwordTwice: ''
})
const updatePasswordRules = {
  oldPassword: [
    {required: true, message: t('profile.plzInputOldPassword')}
  ],
  password: [
    {required: true, message: t('profile.plzInputPassword')}
  ],
  passwordTwice: [
    {required: true, message: t('profile.plzInputAgainPassword')},
    {
      validator: (rule, value, callback) => {
        if (value !== updatePasswordForm.password) {
          callback(new Error(t('profile.passwordNotMatch')));
        } else {
          callback();
        }
      }
    }
  ],
}

const handleUpdatePassword = () => {
  updatePasswordFormRef.value.validate(valid => {
    if (valid) {
      const reqForm = {
        username: userInfo.username,
        oldPassword: SHA512(updatePasswordForm.oldPassword),
        password: SHA512(updatePasswordForm.password),
      }
      systemApi.updatePassword.post(reqForm).then(async response => {
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
        window.location.replace('/')
      })
    }
  })
}

const logo = new URL('./images/logo.svg', import.meta.url).href
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

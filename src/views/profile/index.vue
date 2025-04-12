<template>
  <div class="page-div">
    <el-tabs v-model="activeTabName" @tab-change="handleTabChange">
      <el-tab-pane :label="t('profile.cardHeaderInfo')" name="me">
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
      </el-tab-pane>
      <el-tab-pane :label="t('profile.accounts')" name="users">
        <el-row :gutter="10">
          <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
            <el-card shadow="never" style="min-height: 70vh">
              <template #header>
                <div class="card-header">
                  <span>
                    {{t('profile.accountTitle')}}
                  </span>
                  <el-button type="success" :disabled="userInfo.role!=='admin'"
                             @click="handleOpenUserCreateDialog"
                  >
                    {{ t('profile.actions.create') }}
                  </el-button>
                </div>
              </template>
              <div class="tip">
                <div>
                  {{t('profile.tip_1')}}
                </div>
                <div style="margin-top: 5px">
                  {{t('profile.tip_2')}}
                </div>
              </div>
              <el-table :data="userList" border>
                <el-table-column :label="t('profile.username')" prop="username"/>
                <el-table-column :label="t('profile.nickname')" prop="nickname"/>
                <el-table-column :label="t('profile.role')" prop="role">
                  <template #default="scope">
                    <el-tag type="primary">
                      {{scope.row.role}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('profile.disabled')">
                  <template #default="scope">
                    <el-tag v-if="!scope.row.disabled" type="success">
                      {{language==='zh'?'启用':'Enabled'}}
                    </el-tag>
                    <el-tag v-if="scope.row.disabled" type="danger">
                      {{language==='zh'?'禁用':'Disabled'}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('setting.button.actions')" prop="actions">
                  <template #default="scope">
                    <el-dropdown trigger="hover" @command="handleCommand"
                                 :disabled="userInfo.role!=='admin'"
                    >
                      <el-button link type="primary" :disabled="userInfo.role!=='admin'">
                        {{ t('setting.button.actions') }}
                        <el-icon class="el-icon--right">
                          <arrow-down/>
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{type: 'update', data: scope.row}"
                          >
                            {{ t('profile.actions.update') }}
                          </el-dropdown-item>
                          <el-dropdown-item :command="{type: 'delete', data: scope.row}"
                                            :disabled="scope.row.role==='admin'"
                          >
                            {{ t('profile.actions.delete') }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="userDialogVisible" width="60%" @closed="clearUserForm">
      <el-form ref="userDialogFormRef" :model="userDialogForm" label-width="100"
               :rules="userDialogFormRules" :validate-on-rule-change="false"
               style="margin-top: 20px"
      >
        <el-form-item v-if="dialogCreate" :label="t('profile.username')" prop="username">
          <el-input v-model="userDialogForm.username"></el-input>
        </el-form-item>
        <el-form-item :label="t('profile.nickname')" prop="nickname">
          <el-input v-model="userDialogForm.nickname"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogCreate" :label="t('profile.password')" prop="password">
          <el-input v-model="userDialogForm.password" autocomplete="new-password" show-password></el-input>
          <sc-password-strength v-model="userDialogForm.password"></sc-password-strength>
          <div class="el-form-item-msg">{{ t('profile.suggestedPassword') }}</div>
        </el-form-item>
        <el-form-item :label="t('profile.disabled')" prop="disabled">
          <el-switch v-model="userDialogForm.disabled" :active-value="false" :inactive-value="true"
                     :active-text="language==='zh'?'启用':'Enable'" inline-prompt
                     :inactive-text="language==='zh'?'禁用':'Disable'"
                     style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949">
          </el-switch>
        </el-form-item>
        <div style="display: flex; justify-content: flex-end; padding-top: 10px">
          <el-button v-if="dialogCreate" type="primary" :loading="dialogSubmitLoading" @click="handleCreateUser">
            {{ t('profile.submit') }}
          </el-button>
          <el-button v-if="!dialogCreate" type="primary" :loading="dialogSubmitLoading" @click="handleUpdateUser">
            {{ t('profile.submit') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
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

const activeTabName = ref('me')
const handleTabChange = (name) => {
  if (activeTabName.value === 'me') {

  }
  if (activeTabName.value === 'users') {
    handleGetUserList()
  }
  activeTabName.value = name
}

const userList = ref([])
const handleGetUserList = () => {
  systemApi.userList.get().then(response => {
    userList.value = response.data
  })
}

const handleCommand = (cmd) => {
  if (cmd.type === 'update') {
    handleOpenUpdateUserDialog(deepCopy(cmd.data))
    return
  }
  if (cmd.type === 'delete') {
    handleDeleteUser(deepCopy(cmd.data))
  }
}

const userDialogFormRef = ref()
const userDialogForm = ref({
  username: '',
  nickname: '',
  password: '',
  disabled: false,
})
const userDialogFormRules = {
  username: [
    {required: true, message: t('profile.formValidateMsg.username')}
  ],
  nickname: [
    {required: true, message: t('profile.formValidateMsg.nickname')}
  ],
  password: [
    {required: true, message: t('profile.formValidateMsg.password')}
  ],
  disabled: [
    {required: true, message: t('profile.formValidateMsg.disabled')}
  ],
}
const userDialogVisible = ref(false)
const dialogSubmitLoading = ref(false)
const dialogCreate = ref(false)
const handleOpenUserCreateDialog = () => {
  if (userDialogFormRef.value) {
    userDialogFormRef.value.clearValidate()
  }
  dialogCreate.value = true
  userDialogVisible.value = true
}
const handleCreateUser = () => {
  userDialogFormRef.value.validate(valid => {
    if (valid) {
      dialogSubmitLoading.value = true
      const reqForm = {
        username: userDialogForm.value.username,
        nickname: userDialogForm.value.nickname,
        password: SHA512(userDialogForm.value.password),
        disabled: userDialogForm.value.disabled,
      }
      systemApi.user.post(reqForm).then(response => {
        userDialogVisible.value = false
        koiMsgSuccess(response.message)
        handleGetUserList()
      }).finally(() => {
        dialogSubmitLoading.value = false
      })
    }
  })
}
const handleOpenUpdateUserDialog = (row) => {
  userDialogForm.value = row
  dialogCreate.value = false
  userDialogVisible.value = true
}
const handleUpdateUser = () => {
  userDialogFormRef.value.validate(valid => {
    if (valid) {
      dialogSubmitLoading.value = true
      const reqForm = {
        username: userDialogForm.value.username,
        nickname: userDialogForm.value.nickname,
        password: SHA512('nicai'),
        disabled: userDialogForm.value.disabled,
      }
      systemApi.user.put(reqForm).then(response => {
        userDialogVisible.value = false
        if (userDialogFormRef.value) {
          userDialogFormRef.value.resetFields()
        }
        koiMsgSuccess(response.message)
        handleGetUserList()
      }).finally(() => {
        dialogSubmitLoading.value = false
      })
    }
  })
}
const handleDeleteUser = (row) => {
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 删除 操作，是否继续？` : `The DELETE operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            username: row.username,
            nickname: row.nickname,
            password: SHA512('nicai'),
            disabled: row.disabled,
          }
          systemApi.user.delete(reqForm).then(response => {
            koiMsgSuccess(response.message)
            handleGetUserList()
            done()
          }).finally(() => {
            instance.confirmButtonLoading = false
          })
        } else {
          done()
        }
      }
    }
  ).then(() => {
  }).catch(() => {
    koiMsgInfo(t('home.canceled'))
  })
}

const clearUserForm = () => {
  userDialogForm.value = {
    username: '',
    nickname: '',
    password: '',
    disabled: false,
  }
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

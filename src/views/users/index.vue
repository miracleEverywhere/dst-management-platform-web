<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 70vh">
          <template #header>
            <div class="card-header">
              <span>
                {{ t('users.accountTitle') }}
              </span>
              <el-button :disabled="userInfo.role!=='admin'" type="success"
                         @click="handleOpenUserCreateDialog"
              >
                {{ t('users.actions.create') }}
              </el-button>
            </div>
          </template>
          <el-collapse>
            <el-collapse-item title="Tips">
              <div class="tip">
                <div>
                  {{ t('users.tip_1') }}
                </div>
                <div style="margin-top: 5px">
                  {{ t('users.tip_2') }}
                </div>
                <div style="margin-top: 5px">
                  {{ t('users.tip_3') }}
                </div>
              </div>
              <div class="tip">
                <div>
                  {{ t('users.tip_4') }}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>

          <el-table :data="userList" border style="margin-top: 10px">
            <el-table-column :label="t('users.username')" prop="username"/>
            <el-table-column :label="t('users.nickname')" prop="nickname"/>
            <el-table-column :label="t('users.role')" prop="role">
              <template #default="scope">
                <el-tag :type="scope.row.role==='admin'?'primary':'info'">
                  {{ scope.row.role }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="t('users.disabled')">
              <template #default="scope">
                <el-tag v-if="!scope.row.disabled" type="success">
                  {{ language === 'zh' ? '启用' : 'Enabled' }}
                </el-tag>
                <el-tag v-if="scope.row.disabled" type="danger">
                  {{ language === 'zh' ? '禁用' : 'Disabled' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="t('users.clusterCreationProhibited')">
              <template #default="scope">
                <el-tag v-if="!scope.row.clusterCreationProhibited" type="success">
                  {{ language === 'zh' ? '可创建' : 'Y' }}
                </el-tag>
                <el-tag v-if="scope.row.clusterCreationProhibited" type="danger">
                  {{ language === 'zh' ? '不可创建' : 'N' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <div style="display: flex; align-items: center">
                  <span>{{t('users.maxWorldsPerCluster')}}</span>
                  <el-tooltip :content="t('users.maxWorldsPerClusterTip')" effect="light" placement="top">
                    <el-icon size="14" style="margin-left: 2px">
                      <QuestionFilled/>
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
              <template #default="scope">
                <el-tag v-if="scope.row.role==='admin'" type="primary">
                  {{language==='zh'?'不限制':'No Limits'}}
                </el-tag>
                <el-tag v-else type="primary">
                  {{scope.row.maxWorldsPerCluster}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="t('setting.button.actions')" prop="actions">
              <template #default="scope">
                <el-dropdown :disabled="userInfo.role!=='admin'" trigger="hover"
                             @command="handleCommand"
                >
                  <el-button :disabled="userInfo.role!=='admin'" link type="primary">
                    {{ t('setting.button.actions') }}
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{type: 'update', data: scope.row}"
                      >
                        {{ t('users.actions.update') }}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{type: 'delete', data: scope.row}"
                                        :disabled="scope.row.role==='admin'"
                      >
                        {{ t('users.actions.delete') }}
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
    <el-dialog v-model="userDialogVisible" width="60%" @closed="clearUserForm">
      <el-form ref="userDialogFormRef" :model="userDialogForm" :rules="userDialogFormRules"
               :validate-on-rule-change="false" label-width="150"
               style="margin: 20px 50px 0 0"
      >
        <el-form-item v-if="dialogCreate" :label="t('users.username')" prop="username">
          <el-input v-model="userDialogForm.username"></el-input>
        </el-form-item>
        <el-form-item :label="t('users.nickname')" prop="nickname">
          <el-input v-model="userDialogForm.nickname"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogCreate" :label="t('users.password')" prop="password">
          <el-input v-model="userDialogForm.password" autocomplete="new-password" show-password></el-input>
          <sc-password-strength v-model="userDialogForm.password"></sc-password-strength>
          <div class="el-form-item-msg">{{ t('users.suggestedPassword') }}</div>
        </el-form-item>
        <el-form-item :label="t('users.clusterPermission')" prop="clusterPermission">
          <el-select v-model="userDialogForm.clusterPermission"
                     multiple
                     collapse-tags
                     collapse-tags-tooltip
                     :max-collapse-tags="3"
                     :disabled="userDialogForm.role==='admin'">
            <el-option v-for="i in globalStore.dstClusters"
                       :label="i.clusterDisplayName"
                       :value="i.clusterName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('users.maxWorldsPerCluster')" prop="maxWorldsPerCluster">
          <el-slider v-model="userDialogForm.maxWorldsPerCluster" :max="64" :min="0" show-input size="small"/>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="t('users.disabled')" prop="disabled">
              <el-switch v-model="userDialogForm.disabled" :active-text="language==='zh'?'启用':'Enable'" :active-value="false"
                         :inactive-text="language==='zh'?'禁用':'Disable'" :inactive-value="true"
                         inline-prompt
                         style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('users.admin')" prop="role">
              <el-switch v-model="userDialogForm.role" :active-text="language==='zh'?'是':'Enable'" :inactive-text="language==='zh'?'否':'Disable'"
                         active-value="admin" inactive-value="Non-admin"
                         inline-prompt
                         style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('users.clusterCreationProhibited')" prop="role">
              <el-switch v-model="userDialogForm.clusterCreationProhibited" :active-text="language==='zh'?'可创建':'Y'" :active-value="false"
                         :inactive-text="language==='zh'?'不可创建':'Y'" :inactive-value="true"
                         inline-prompt :disabled="userDialogForm.role==='admin'"
                         style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="display: flex; justify-content: flex-end; padding-top: 10px">
          <el-button v-if="dialogCreate" :loading="dialogSubmitLoading" type="primary" @click="handleCreateUser">
            {{ t('users.submit') }}
          </el-button>
          <el-button v-if="!dialogCreate" :loading="dialogSubmitLoading" type="primary" @click="handleUpdateUser">
            {{ t('users.submit') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script name="Users" setup>
import useGlobalStore from "@/stores/modules/global.ts";
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import systemApi from "@/api/system/index.js";
import {deepCopy, SHA512} from "@/utils/tools.js";
import {koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";
import {ElMessageBox} from "element-plus";
import ScPasswordStrength from "@/components/scPasswordStrength/index.vue";
import useAuthStore from "@/stores/modules/auth.ts";


onMounted(() => {
  handleGetUserList()
})

const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);
const authStore = useAuthStore()
const {t} = useI18n()
const userInfo = authStore.userInfo

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
  role: 'Non-admin',
  clusterPermission: null,
  clusterCreationProhibited: false,
  maxWorldsPerCluster: 2,
})
const userDialogFormRules = {
  username: [
    {required: true, message: t('users.formValidateMsg.username')}
  ],
  nickname: [
    {required: true, message: t('users.formValidateMsg.nickname')}
  ],
  password: [
    {required: true, message: t('users.formValidateMsg.password')}
  ],
  disabled: [
    {required: true, message: t('users.formValidateMsg.disabled')}
  ],
  maxWorldsPerCluster: [
    {required: true, message: t('users.formValidateMsg.maxWorldsPerCluster')}
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
        role: userDialogForm.value.role,
        clusterPermission: userDialogForm.value.clusterPermission,
        clusterCreationProhibited: userDialogForm.value.clusterCreationProhibited,
        maxWorldsPerCluster: userDialogForm.value.maxWorldsPerCluster,
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
        role: userDialogForm.value.role,
        clusterPermission: userDialogForm.value.clusterPermission,
        clusterCreationProhibited: userDialogForm.value.clusterCreationProhibited,
        maxWorldsPerCluster: userDialogForm.value.maxWorldsPerCluster,
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
    role: 'Non-admin',
    clusterPermission: null,
    clusterCreationProhibited: false,
  }
}
</script>

<style scoped>
</style>
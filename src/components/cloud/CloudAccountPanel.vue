<template>
  <div>
    <div
      v-if="loading"
      class="d-flex justify-center py-10"
    >
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>

    <template v-else-if="!status.linked">
      <v-alert
        type="info"
        variant="tonal"
        class="mb-4"
      >
        {{ t('cloud.account.unlinkedTip') }}
      </v-alert>
      <v-btn
        color="primary"
        prepend-icon="ri-cloud-line"
        @click="openBindDialog"
      >
        {{ t('cloud.account.bind') }}
      </v-btn>
    </template>

    <template v-else>
      <div class="d-flex flex-wrap align-center mb-4">
        <v-chip
          color="success"
          variant="tonal"
          prepend-icon="ri-links-line"
        >
          {{ t('cloud.account.linked') }}
        </v-chip>
        <v-chip
          class="ml-2"
          color="primary"
          variant="tonal"
        >
          {{ planLabel }}
        </v-chip>
        <v-chip
          class="ml-2"
          variant="tonal"
        >
          {{ t('cloud.account.autoSync') }}: {{ status.autoSync ? t('cloud.account.enabled') : t('cloud.account.disabled') }}
        </v-chip>
        <v-spacer />
        <v-btn
          class="mt-2 mt-sm-0"
          color="primary"
          prepend-icon="ri-refresh-line"
          :loading="syncLoading"
          @click="handleSync"
        >
          {{ t('cloud.sync.now') }}
        </v-btn>
        <v-btn
          class="mt-2 mt-sm-0 ml-sm-2"
          color="info"
          prepend-icon="ri-link"
          @click="openBindDialog"
        >
          {{ t('cloud.account.rebind') }}
        </v-btn>
        <v-btn
          class="mt-2 mt-sm-0 ml-sm-2"
          color="error"
          prepend-icon="ri-link-unlink"
          @click="openUnbindDialog"
        >
          {{ t('cloud.account.unbind') }}
        </v-btn>
      </div>

      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :model-value="status.cloudUsername"
            :label="t('cloud.account.cloudUsername')"
            prepend-inner-icon="ri-user-line"
            readonly
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :model-value="status.cloudEmail || '-'"
            :label="t('cloud.account.cloudEmail')"
            prepend-inner-icon="ri-mail-line"
            readonly
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col
          v-for="quota in quotas"
          :key="quota.key"
          cols="6"
          sm="4"
          lg="2"
        >
          <v-card
            variant="tonal"
            :color="quota.color"
            height="100%"
          >
            <v-card-text class="pa-3">
              <div class="text-caption">
                {{ quota.label }}
              </div>
              <div class="text-h6">
                {{ quota.used === null ? quota.limit : `${quota.used} / ${quota.limit}` }}
              </div>
              <v-progress-linear
                v-if="quota.percent !== null"
                class="mt-2"
                :model-value="quota.percent"
                :color="quota.color"
                height="4"
                rounded
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="text-body-2 text-medium-emphasis mt-4">
        {{ t('cloud.account.lastSync') }}: {{ lastSyncText }}
        <span class="mx-2">·</span>
        {{ t('cloud.account.linkedAt') }}: {{ unix2time(status.linkedAt) }}
      </div>
    </template>

    <!-- 绑定 / 重新绑定 -->
    <v-dialog
      v-model="bindDialog"
      :max-width="mobile?'90%':'48%'"
      persistent
    >
      <v-card :title="status.linked ? t('cloud.account.rebind') : t('cloud.account.bind')">
        <v-card-text>
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('cloud.account.bindTip') }}
          </v-alert>
          <v-form
            ref="bindFormRef"
            @submit.prevent="handleBind"
          >
            <v-text-field
              v-model="bindForm.identity"
              :label="t('cloud.account.identity')"
              :rules="identityRules"
              prepend-inner-icon="ri-user-line"
              autocomplete="username"
              clearable
            />
            <v-text-field
              v-model="bindForm.password"
              :append-inner-icon="passwordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="current-password"
              :label="t('cloud.account.password')"
              :rules="passwordRules"
              prepend-inner-icon="ri-lock-line"
              @click:append-inner="passwordVisible = !passwordVisible"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="bindDialog = false"
          >
            {{ t('cloud.common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="bindLoading"
            @click="handleBind"
          >
            {{ t('cloud.account.bind') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 解除绑定 -->
    <v-dialog
      v-model="unbindDialog"
      :max-width="mobile?'90%':'48%'"
      persistent
    >
      <v-card :title="t('cloud.account.unbindTitle')">
        <v-card-text>
          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('cloud.account.unbindTip') }}
          </v-alert>
          <v-text-field
            v-model="unbindForm.password"
            :append-inner-icon="passwordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="current-password"
            :label="t('cloud.account.unbindPasswordLabel')"
            :rules="unbindPasswordRules"
            prepend-inner-icon="ri-lock-line"
            @click:append-inner="passwordVisible = !passwordVisible"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="unbindDialog = false"
          >
            {{ t('cloud.common.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            :loading="unbindLoading"
            @click="handleUnbind"
          >
            {{ t('cloud.account.unbind') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import cloudApi from "@/api/cloud"
import { showSnackbar } from "@/utils/snackbar"
import { unix2time } from "@/utils/tools"
import { cloudSyncSummary } from "@/utils/cloud"

const { t } = useI18n()
const { mobile } = useDisplay()

const loading = ref(true)
const status = ref({ linked: false })

const passwordVisible = ref(false)

const planLabel = computed(() => {
  const key = `cloud.plan.${status.value.plan}`
  const name = t(key)

  return name === key ? (status.value.planName || status.value.plan || '-') : name
})

const lastSyncText = computed(() => {
  return status.value.lastSyncAt ? unix2time(status.value.lastSyncAt) : t('cloud.account.neverSynced')
})

const percent = (used, limit) => {
  if (!limit || limit <= 0) return null

  return Math.min(100, Math.round(((used || 0) / limit) * 100))
}

const quotas = computed(() => [
  {
    key: 'favorite',
    label: t('cloud.account.favoriteQuota'),
    used: status.value.favoriteCount ?? 0,
    limit: status.value.favoriteQuota ?? 0,
    percent: percent(status.value.favoriteCount, status.value.favoriteQuota),
    color: 'primary',
  },
  {
    key: 'token',
    label: t('cloud.account.tokenQuota'),
    used: null,
    limit: status.value.tokenQuota ?? 0,
    percent: null,
    color: 'info',
  },
  {
    key: 'admin',
    label: t('cloud.account.adminQuota'),
    used: null,
    limit: status.value.gameAdminQuota ?? 0,
    percent: null,
    color: 'success',
  },
  {
    key: 'slot',
    label: t('cloud.account.slotQuota'),
    used: null,
    limit: status.value.gameSlotQuota ?? 0,
    percent: null,
    color: 'warning',
  },
  {
    key: 'archive',
    label: t('cloud.account.archiveQuota'),
    used: null,
    limit: status.value.archiveQuota ?? 0,
    percent: null,
    color: 'secondary',
  },
])

const getStatus = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true
  }

  try {
    const response = await cloudApi.status.get()

    status.value = response.data || { linked: false }
  } catch {
    status.value = { linked: false }
  } finally {
    loading.value = false
  }
}

const syncLoading = ref(false)

const handleSync = async () => {
  syncLoading.value = true
  try {
    const response = await cloudApi.sync.post({ direction: 'both' })

    showSnackbar(cloudSyncSummary(t, response.data))
    await getStatus(false)
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    syncLoading.value = false
  }
}

const bindDialog = ref(false)
const bindLoading = ref(false)
const bindFormRef = ref()

const bindForm = ref({
  identity: '',
  password: '',
})

const identityRules = [
  value => Boolean(value?.trim()) || t('cloud.account.identityRule'),
]

const passwordRules = [
  value => Boolean(value) || t('cloud.account.passwordRule'),
]

const openBindDialog = () => {
  bindForm.value = {
    identity: '',
    password: '',
  }
  passwordVisible.value = false
  bindDialog.value = true
}

const handleBind = async () => {
  const result = await bindFormRef.value?.validate()

  if (!result?.valid) return

  bindLoading.value = true
  try {
    const response = await cloudApi.link.post({
      identity: bindForm.value.identity.trim(),
      password: bindForm.value.password,
    })

    status.value = response.data
    bindDialog.value = false
    showSnackbar(response.message)
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    bindLoading.value = false
  }
}

const unbindDialog = ref(false)
const unbindLoading = ref(false)

const unbindForm = ref({
  password: '',
})

const unbindPasswordRules = [
  value => Boolean(value) || t('cloud.account.unbindPasswordRequired'),
]

const openUnbindDialog = () => {
  unbindForm.value.password = ''
  passwordVisible.value = false
  unbindDialog.value = true
}

const handleUnbind = async () => {
  if (!unbindForm.value.password) {
    showSnackbar(t('cloud.account.unbindPasswordRequired'), 'error')

    return
  }

  unbindLoading.value = true
  try {
    const response = await cloudApi.unlink.post({ password: unbindForm.value.password })

    status.value = { linked: false }
    unbindDialog.value = false
    showSnackbar(response.message)
  } catch {
    // 接口异常由 Axios 拦截器统一提示
  } finally {
    unbindLoading.value = false
  }
}

onMounted(() => {
  getStatus()
})
</script>

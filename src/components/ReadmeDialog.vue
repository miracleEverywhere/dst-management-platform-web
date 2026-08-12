<template>
  <v-dialog
    v-model="dialogVisible"
    persistent
    max-width="520"
  >
    <v-card :title="t('global.readme.title')">
      <v-card-text>
        {{ t('global.readme.content') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="submitting"
          @click="acknowledge"
        >
          {{ t('global.readme.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import platformApi from '@/api/platform'
import useUserStore from '@store/user'

const { t } = useI18n()
const userStore = useUserStore()

const dialogVisible = ref(false)
const submitting = ref(false)
let checked = false

const checkReadme = async token => {
  if (!token) {
    checked = false
    dialogVisible.value = false

    return
  }
  if (checked) return

  checked = true
  try {
    const response = await platformApi.readme.get()
    const value = response?.data ?? response?.value ?? response

    if (value === false || value === 'false') {
      dialogVisible.value = true
    }
  } catch (error) {
    // The regular Axios interceptor reports request failures.
  }
}

const acknowledge = async () => {
  submitting.value = true
  try {
    await platformApi.readme.post()
    dialogVisible.value = false
  } finally {
    submitting.value = false
  }
}

watch(() => userStore.token, checkReadme, { immediate: true })
</script>

<template>
  <v-card variant="flat">
    <v-card-text>
      <v-skeleton-loader
        v-if="loading"
        type="article, actions"
      />

      <template v-else>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>

        <v-alert
          v-if="source === 'none'"
          type="warning"
          variant="tonal"
          class="mb-4"
        >
          {{ t('diagnosis.settings.missing') }}
        </v-alert>

        <v-alert
          color="info"
          variant="tonal"
          class="mb-8"
        >
          {{ t('diagnosis.settings.tip') }}
        </v-alert>

        <v-form @submit.prevent="save">
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.chatBaseURL"
                :label="t('diagnosis.settings.form.baseURL')"
                density="comfortable"
                clearable
                :placeholder="t('placeholders.tools.diagnosisBaseURL')"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.chatModel"
                :label="t('diagnosis.settings.form.model')"
                density="comfortable"
                clearable
                :placeholder="t('placeholders.tools.diagnosisModel')"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.chatApiKey"
                :label="t('diagnosis.settings.form.apiKey')"
                type="password"
                autocomplete="off"
                density="comfortable"
                clearable
                :placeholder="t('placeholders.tools.diagnosisApiKey')"
              />
            </v-col>
          </v-row>

          <div class="d-flex align-center flex-wrap ga-2 my-4">
            <v-btn
              color="primary"
              type="submit"
              :loading="saving"
              prepend-icon="ri-save-2-line"
            >
              {{ t('diagnosis.settings.actions.save') }}
            </v-btn>
            <v-btn
              variant="text"
              :loading="saving"
              :disabled="!configured"
              @click="clear"
            >
              {{ t('diagnosis.settings.actions.clear') }}
            </v-btn>
            <span>
              {{ t('diagnosis.settings.actions.clearTip') }}
            </span>
          </div>
        </v-form>

        <v-alert
          variant="tonal"
          class="mt-2"
        >
          {{ t('diagnosis.settings.effectiveTip') }}
        </v-alert>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { showSnackbar } from '@/utils/snackbar'
import diagnosisApi from '@/api/diagnosis'

const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const source = ref('none')
const configured = ref(false)

const form = ref({
  chatBaseURL: '',
  chatApiKey: '',
  chatModel: '',
})

const applyData = data => {
  source.value = data?.source || 'none'
  configured.value = !!data?.configured

  const setting = data?.setting || {}

  form.value = {
    chatBaseURL: setting.chatBaseURL || '',
    chatApiKey: setting.chatApiKey || '',
    chatModel: setting.chatModel || '',
  }
}

const load = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await diagnosisApi.setting.get()

    applyData(response.data || {})
  } catch (error) {
    errorMessage.value = error?.message || t('diagnosis.settings.loadFailed')
  } finally {
    loading.value = false
  }
}

const save = async () => {
  saving.value = true
  errorMessage.value = ''

  try {
    const response = await diagnosisApi.setting.put({
      chatBaseURL: form.value.chatBaseURL?.trim() || '',
      chatApiKey: form.value.chatApiKey?.trim() || '',
      chatModel: form.value.chatModel?.trim() || '',
    })

    showSnackbar(response?.message || t('diagnosis.settings.saved'))
    await load()
  } catch (error) {
    errorMessage.value = error?.message || t('diagnosis.settings.saveFailed')
  } finally {
    saving.value = false
  }
}

const clear = async () => {
  form.value = {
    chatBaseURL: '',
    chatApiKey: '',
    chatModel: '',
  }
  await save()
}

onMounted(load)
</script>

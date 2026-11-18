<template>
  <v-card variant="flat">
    <v-toolbar flat>
      <v-toolbar-title>
        <v-icon
          icon="ri-settings-4-line"
          start
        />
        {{ t('diagnosis.settings.title') }}
      </v-toolbar-title>
      <v-btn
        icon="ri-refresh-line"
        variant="text"
        :loading="loading"
        @click="load"
      />
    </v-toolbar>
    <v-divider />

    <v-card-text class="pt-6">
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

        <div class="d-flex align-center flex-wrap ga-2 mb-4">
          <span class="text-body-2">{{ t('diagnosis.settings.sourceLabel') }}：</span>
          <v-chip
            size="small"
            label
            :color="sourceColor"
          >
            {{ sourceText }}
          </v-chip>
        </div>

        <div class="text-caption text-medium-emphasis mb-4">
          {{ t('diagnosis.settings.tip') }}
        </div>

        <v-form @submit.prevent="save">
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.chatBaseURL"
                :label="t('diagnosis.settings.form.baseURL')"
                placeholder="https://api.example.com/v1"
                density="comfortable"
                clearable
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
              />
            </v-col>
          </v-row>

          <div class="d-flex align-center flex-wrap ga-2">
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
            <span class="text-caption text-medium-emphasis">
              {{ t('diagnosis.settings.actions.clearTip') }}
            </span>
          </div>
        </v-form>

        <v-divider class="my-6" />

        <div class="text-subtitle-1 mb-2">
          {{ t('diagnosis.settings.effective') }}
        </div>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :model-value="effective.chatBaseURL || ''"
              :label="t('diagnosis.settings.form.baseURL')"
              density="compact"
              readonly
              hide-details
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :model-value="effective.chatModel || ''"
              :label="t('diagnosis.settings.form.model')"
              density="compact"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <div class="d-flex align-center flex-wrap ga-2">
              <span class="text-body-2">{{ t('diagnosis.settings.form.apiKey') }}：</span>
              <v-chip
                size="small"
                label
                :color="effective.chatApiKey ? 'success' : 'default'"
              >
                {{ effective.chatApiKey ? t('diagnosis.settings.apiKeyConfigured') : t('diagnosis.settings.apiKeyMissing') }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
        <div class="text-caption text-medium-emphasis mt-2">
          {{ t('diagnosis.settings.effectiveTip') }}
        </div>
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
const effective = ref({})

const form = ref({
  chatBaseURL: '',
  chatApiKey: '',
  chatModel: '',
})

const sourceText = computed(() => t(`diagnosis.settings.source.${source.value}`))

const sourceColor = computed(() => {
  if (source.value === 'diagnosis') return 'primary'

  return 'warning'
})

const applyData = data => {
  source.value = data?.source || 'none'
  configured.value = !!data?.configured
  effective.value = data?.effective || {}

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

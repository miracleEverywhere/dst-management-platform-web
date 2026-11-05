<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="mobile?'95%':'640'"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>{{ t('cloud.token.title') }}</span>
        <v-spacer />
        <v-chip
          v-if="!loading && !error"
          label
          color="primary"
          variant="tonal"
        >
          {{ t('cloud.token.quota', { used: quota.used, quota: quota.tokenQuota }) }}
        </v-chip>
      </v-card-title>
      <v-divider />
      <v-card-text style="min-height: 200px">
        <div
          v-if="loading"
          class="d-flex justify-center py-10"
        >
          <v-progress-circular
            color="primary"
            indeterminate
          />
        </div>
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
        >
          {{ error }}
        </v-alert>
        <v-list
          v-else-if="items.length > 0"
          lines="two"
          class="my-4"
        >
          <v-list-item
            v-for="item in items"
            :key="item.id"
            :title="item.name"
            :subtitle="item.remark || '-'"
            rounded
            variant="outlined"
            class="mt-2"
            @click="handleSelect(item)"
          >
            <template #prepend>
              <v-icon
                icon="ri-key-2-line"
                color="primary"
              />
            </template>
            <template #append>
              <div class="d-flex align-center">
                <span class="text-caption text-medium-emphasis mr-4">{{ maskToken(item.token) }}</span>
                <v-icon
                  icon="ri-arrow-right-s-line"
                  size="20"
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
        <div
          v-else
          class="d-flex flex-column align-center py-10"
        >
          <v-icon
            icon="ri-key-2-line"
            size="40"
            color="grey"
            class="mb-2"
          />
          <div class="text-medium-emphasis">
            {{ t('cloud.token.empty') }}
          </div>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="mt-2">
        <span class="text-caption text-medium-emphasis">{{ t('cloud.token.tip') }}</span>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          {{ t('cloud.common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import cloudApi from "@/api/cloud"
import { cloudErrorText } from "@/utils/cloud"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

const { t } = useI18n()
const { mobile } = useDisplay()

const loading = ref(false)
const error = ref('')
const items = ref([])

const quota = ref({
  tokenQuota: 0,
  used: 0,
})

const maskToken = token => {
  if (!token) return '-'
  if (token.length <= 12) return token

  return `${token.slice(0, 6)}••••${token.slice(-4)}`
}

const getTokens = async () => {
  loading.value = true
  error.value = ''
  items.value = []
  try {
    const response = await cloudApi.tokens.get()

    items.value = response.data?.items || []
    quota.value = {
      tokenQuota: response.data?.tokenQuota || 0,
      used: response.data?.used || 0,
    }
  } catch (err) {
    error.value = cloudErrorText(err, t('cloud.token.unlinkedTip'))
  } finally {
    loading.value = false
  }
}

const handleSelect = item => {
  emit('select', item)
  emit('update:modelValue', false)
}

watch(() => props.modelValue, visible => {
  if (visible) {
    getTokens()
  }
})
</script>

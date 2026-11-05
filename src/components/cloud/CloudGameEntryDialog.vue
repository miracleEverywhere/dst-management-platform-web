<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="mobile?'95%':'720'"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>{{ title }}</span>
        <v-spacer />
        <v-chip
          v-if="!loading && !error"
          label
          color="primary"
          variant="tonal"
        >
          {{ t('cloud.gameEntry.quota', { used: quota.used, quota: quota.quota }) }}
        </v-chip>
      </v-card-title>
      <v-divider />
      <v-card-text style="min-height: 260px">
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
        <v-data-table
          v-else
          v-model="selected"
          item-value="uid"
          show-select
          return-object
          :headers="headers"
          :items="items"
          :no-data-text="t('cloud.gameEntry.empty')"
        >
          <template #item.status="{ item }">
            <v-chip
              v-if="existing.includes(item.uid)"
              label
              color="success"
              variant="tonal"
            >
              {{ t('cloud.gameEntry.existing') }}
            </v-chip>
            <span
              v-else
              class="text-medium-emphasis"
            >-</span>
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <span class="text-caption text-medium-emphasis">
          {{ t('cloud.gameEntry.selected', { count: validSelected.length }) }}
        </span>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          {{ t('cloud.common.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          :disabled="validSelected.length === 0"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ t('cloud.gameEntry.add') }}
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
  kind: {
    type: String,
    default: 'admin',
    validator: value => ['admin', 'slot'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  existing: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const { t } = useI18n()
const { mobile } = useDisplay()

const loadingData = ref(false)
const error = ref('')
const items = ref([])
const selected = ref([])

const quota = ref({
  quota: 0,
  used: 0,
})

const headers = computed(() => [
  { title: t('cloud.gameEntry.uid'), key: 'uid' },
  { title: t('cloud.gameEntry.nickname'), key: 'nickname' },
  { title: t('cloud.gameEntry.remark'), key: 'remark' },
  { title: '', key: 'status', sortable: false },
])

const validSelected = computed(() => {
  return selected.value.filter(item => !props.existing.includes(item.uid))
})

const getEntries = async () => {
  loadingData.value = true
  error.value = ''
  items.value = []
  selected.value = []
  try {
    const response = props.kind === 'slot'
      ? await cloudApi.gameReservedSlots.get()
      : await cloudApi.gameAdmins.get()

    items.value = (response.data?.items || []).map(item => ({
      ...item,
      nickname: item.nickname || '-',
      remark: item.remark || '-',
    }))
    quota.value = {
      quota: response.data?.quota || 0,
      used: response.data?.used || 0,
    }
  } catch (err) {
    error.value = cloudErrorText(err, t('cloud.gameEntry.unlinkedTip'))
  } finally {
    loadingData.value = false
  }
}

const handleConfirm = () => {
  emit('confirm', validSelected.value.map(item => item.uid))
  emit('update:modelValue', false)
}

watch(() => props.modelValue, visible => {
  if (visible) {
    getEntries()
  }
})
</script>

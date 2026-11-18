<template>
  <v-card
    :variant="selected ? 'tonal' : 'outlined'"
    :color="selected ? 'primary' : undefined"
    class="mb-3"
  >
    <v-card-title class="d-flex align-center flex-wrap ga-2">
      <v-checkbox-btn
        v-if="selectable"
        :model-value="selected"
        :disabled="action.available === false"
        color="primary"
        @update:model-value="emit('toggle', action.actionID)"
      />
      <v-icon :icon="riskIcon" />
      <span class="text-body-1">{{ title }}</span>
      <v-chip
        size="small"
        label
        :color="riskColor(action.risk)"
      >
        {{ riskText }}
      </v-chip>
      <v-chip
        size="small"
        label
        :color="action.reversible ? 'success' : 'warning'"
      >
        {{ action.reversible ? t('diagnosis.actionCard.reversible') : t('diagnosis.actionCard.irreversible') }}
      </v-chip>
      <v-chip
        v-if="action.adminOnly"
        size="small"
        label
        color="warning"
      >
        {{ t('diagnosis.actionCard.adminOnly') }}
      </v-chip>
      <v-chip
        v-if="action.status && action.status !== 'proposed'"
        size="small"
        label
        :color="statusColor(action.status)"
      >
        {{ statusText }}
      </v-chip>
    </v-card-title>

    <v-card-text class="pt-0">
      <div class="text-body-2 mb-2">
        {{ action.preview }}
      </div>
      <div
        v-if="action.reason"
        class="text-caption text-medium-emphasis mb-2"
      >
        {{ t('diagnosis.actionCard.reason') }}：{{ action.reason }}
      </div>

      <v-alert
        v-if="action.available === false"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-2"
      >
        {{ t('diagnosis.actionCard.unavailable') }}：{{ action.unavailableReason || '-' }}
      </v-alert>

      <v-expansion-panels
        v-if="evidence.length || hasParams"
        variant="accordion"
        class="mt-2"
      >
        <v-expansion-panel
          v-if="evidence.length"
          :title="`${t('diagnosis.actionCard.evidence')} (${evidence.length})`"
        >
          <v-expansion-panel-text>
            <div
              v-for="item in evidence"
              :key="item.evidenceID"
              class="mb-4"
            >
              <div class="d-flex align-center flex-wrap ga-2 mb-1">
                <v-chip
                  size="x-small"
                  label
                  color="info"
                >
                  {{ item.tool }}
                </v-chip>
                <span class="text-caption text-medium-emphasis">{{ item.source }}</span>
                <v-chip
                  v-if="item.truncated"
                  size="x-small"
                  label
                  color="warning"
                >
                  {{ t('diagnosis.report.truncated') }}
                </v-chip>
              </div>
              <div class="text-body-2 mb-1">
                {{ item.summary }}
              </div>
              <pre class="diagnosis-evidence">{{ item.detail }}</pre>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel
          v-if="hasParams"
          :title="t('diagnosis.actionCard.params')"
        >
          <v-expansion-panel-text>
            <pre class="diagnosis-evidence">{{ paramsText }}</pre>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-alert
        v-if="action.applyResult"
        :type="resultType"
        variant="tonal"
        density="compact"
        class="mt-3"
      >
        <div class="d-flex align-center flex-wrap ga-2">
          <v-chip
            size="small"
            label
            :color="statusColor(action.applyResult.status)"
          >
            {{ t(`diagnosis.actionStatus.${action.applyResult.status}`) }}
          </v-chip>
          <v-chip
            v-if="action.applyResult.status === 'succeeded'"
            size="small"
            label
            :color="action.applyResult.verified ? 'success' : 'warning'"
          >
            {{ action.applyResult.verified ? t('diagnosis.actionCard.verified') : t('diagnosis.actionCard.verifyFailed') }}
          </v-chip>
          <span
            v-if="action.applyResult.durationMs"
            class="text-caption"
          >
            {{ t('diagnosis.actionCard.duration') }}：{{ formatDuration(action.applyResult.durationMs) }}
          </span>
        </div>
        <div
          v-if="resultMessage"
          class="text-body-2 mt-1"
        >
          {{ resultMessage }}
        </div>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import {
  actionTitle,
  formatDuration,
  riskColor,
  statusColor,
} from '@/utils/diagnosis'

const props = defineProps({
  action: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  evidence: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['toggle'])

const { t } = useI18n()

const title = computed(() => actionTitle(t, props.action))

const riskText = computed(() => {
  const key = `diagnosis.risk.${props.action.risk}`

  return props.action.risk ? t(key) : '-'
})

const statusText = computed(() => t(`diagnosis.actionStatus.${props.action.status}`))

const riskIcon = computed(() => {
  if (props.action.risk === 'high') return 'ri-alert-line'
  if (props.action.risk === 'medium') return 'ri-error-warning-line'

  return 'ri-information-line'
})

const hasParams = computed(() => {
  const params = props.action.params || {}

  return Object.keys(params).length > 0
})

const paramsText = computed(() => JSON.stringify(props.action.params || {}, null, 2))

const resultType = computed(() => {
  if (!props.action.applyResult) return 'info'
  if (props.action.applyResult.status !== 'succeeded') return 'error'

  return props.action.applyResult.verified ? 'success' : 'warning'
})

const resultMessage = computed(() => props.action.applyResult?.verifyMessage || props.action.applyResult?.message || '')
</script>

<style scoped>
.diagnosis-evidence {
  max-height: 320px;
  margin: 0;
  padding: 8px 12px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-radius: 6px;
}
</style>

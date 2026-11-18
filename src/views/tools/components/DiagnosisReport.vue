<template>
  <div>
    <v-card
      v-if="report.markdown || streaming"
      variant="outlined"
      class="mb-4"
    >
      <v-card-title class="d-flex align-center flex-wrap ga-2">
        <span>{{ t('diagnosis.report.title') }}</span>
        <v-chip
          v-if="streaming"
          size="small"
          label
          color="info"
        >
          {{ t('diagnosis.report.streaming') }}
        </v-chip>
        <v-spacer />
        <v-chip
          v-if="report.model"
          size="small"
          label
        >
          {{ t('diagnosis.report.model') }}：{{ report.model }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          v-if="streaming"
          indeterminate
          color="primary"
          class="mb-4"
        />
        <md-preview
          v-if="report.markdown"
          :model-value="report.markdown"
          :theme="editorTheme"
          :language="editorLanguage"
          :sanitize="sanitizeMarkdown"
          preview-theme="github"
          class="diagnosis-markdown"
        />
        <div
          v-else
          class="text-body-2 text-medium-emphasis"
        >
          {{ t('diagnosis.report.waiting') }}
        </div>
      </v-card-text>
    </v-card>

    <template v-if="complete && structured">
      <div class="d-flex align-center flex-wrap ga-2 mt-6 mb-3">
        <v-icon
          icon="ri-clipboard-check-line"
          color="primary"
        />
        <span class="text-h6">{{ t('diagnosis.report.results') }}</span>
        <v-chip
          v-if="report.severity"
          :color="severityColor(report.severity)"
          size="small"
          label
        >
          {{ t(`diagnosis.severity.${report.severity}`) }}
        </v-chip>
      </div>

      <v-alert
        v-if="report.summary"
        :type="summaryType"
        variant="tonal"
        class="mb-4"
      >
        <span class="font-weight-medium">{{ report.summary }}</span>
      </v-alert>

      <template v-if="findings.length">
        <div class="d-flex align-center flex-wrap ga-2 mb-2">
          <v-icon icon="ri-search-eye-line" />
          <span class="text-subtitle-1">{{ t('diagnosis.report.findings') }}</span>
          <v-chip
            size="small"
            label
          >
            {{ findings.length }}
          </v-chip>
        </div>
        <v-card
          v-for="finding in findings"
          :key="finding.findingID"
          variant="outlined"
          class="mb-3"
        >
          <v-card-title class="d-flex align-center flex-wrap ga-2">
            <v-chip
              :color="severityColor(finding.severity)"
              size="small"
              label
            >
              {{ t(`diagnosis.severity.${finding.severity}`) }}
            </v-chip>
            <span class="text-body-1">{{ finding.title }}</span>
            <v-chip
              v-if="finding.confidence"
              size="small"
              label
            >
              {{ t('diagnosis.report.confidence') }}：{{ Math.round(finding.confidence * 100) }}%
            </v-chip>
            <v-chip
              v-if="finding.kbID"
              size="small"
              label
              color="info"
            >
              {{ finding.kbID }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pt-0">
            <div
              v-if="finding.cause"
              class="text-body-2 mb-2"
            >
              {{ t('diagnosis.report.cause') }}：{{ finding.cause }}
            </div>
            <template v-if="finding.solutions?.length">
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('diagnosis.report.solutions') }}
              </div>
              <ul class="text-body-2 mb-2">
                <li
                  v-for="(solution, index) in finding.solutions"
                  :key="index"
                >
                  {{ solution }}
                </li>
              </ul>
            </template>
            <v-expansion-panels
              v-if="finding.evidence?.length"
              variant="accordion"
            >
              <v-expansion-panel :title="`${t('diagnosis.report.evidence')} (${finding.evidence.length})`">
                <v-expansion-panel-text>
                  <div
                    v-for="item in finding.evidence"
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
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </template>

      <template v-if="actions.length">
        <div class="d-flex align-center flex-wrap ga-2 mb-2 mt-2">
          <v-icon icon="ri-tools-line" />
          <span class="text-subtitle-1">{{ t('diagnosis.report.actions') }}</span>
          <v-chip
            size="small"
            label
          >
            {{ actions.length }}
          </v-chip>
        </div>
        <diagnosis-action-card
          v-for="action in actions"
          :key="action.actionID"
          :action="action"
          :selected="selection.includes(action.actionID)"
          :selectable="selectable"
          :evidence="actionEvidence(action)"
          @toggle="emit('toggle', $event)"
        />
      </template>
      <v-alert
        v-else
        type="info"
        variant="tonal"
        class="mb-4"
      >
        {{ t('diagnosis.report.noActions') }}
      </v-alert>

      <template v-if="references.length">
        <div class="d-flex align-center flex-wrap ga-2 mb-2 mt-2">
          <v-icon icon="ri-links-line" />
          <span class="text-subtitle-1">{{ t('diagnosis.report.references') }}</span>
        </div>
        <v-list
          density="compact"
          class="pa-0"
        >
          <v-list-item
            v-for="reference in references"
            :key="reference.url"
            :href="reference.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="reference.title"
          >
            <template #prepend>
              <v-icon icon="ri-external-link-line" />
            </template>
          </v-list-item>
        </v-list>
      </template>

      <v-sheet
        v-if="report.usage?.totalTokens"
        rounded
        border
        class="mt-4 pa-4"
      >
        <div class="d-flex align-center flex-wrap ga-2 mb-2">
          <v-icon
            icon="ri-coin-line"
            color="primary"
          />
          <span class="text-subtitle-1">{{ t('diagnosis.report.usage') }}</span>
        </div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            size="small"
            label
          >
            {{ t('diagnosis.report.usagePrompt') }}：{{ report.usage.promptTokens }}
          </v-chip>
          <v-chip
            size="small"
            label
          >
            {{ t('diagnosis.report.usageCompletion') }}：{{ report.usage.completionTokens }}
          </v-chip>
          <v-chip
            size="small"
            label
            color="info"
          >
            {{ t('diagnosis.report.usageTotal') }}：{{ report.usage.totalTokens }}
          </v-chip>
        </div>
      </v-sheet>
    </template>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import useGlobalStore from '@store/global'
import { getEditorLang } from '@/utils/tools'
import { resolveTheme } from '@/utils/theme'
import { sanitizeMarkdown } from '@/utils/sanitize'
import { severityColor } from '@/utils/diagnosis'
import DiagnosisActionCard from './DiagnosisActionCard.vue'

const props = defineProps({
  report: {
    type: Object,
    required: true,
  },
  selection: {
    type: Array,
    default: () => [],
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  streaming: {
    type: Boolean,
    default: false,
  },

  // 报告正文输出完成后才渲染结构化结果与动作。
  complete: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['toggle'])

const { t } = useI18n()
const globalStore = useGlobalStore()

const editorTheme = computed(() => resolveTheme(globalStore.theme))
const editorLanguage = computed(() => getEditorLang(globalStore.language))

const findings = computed(() => props.report.findings || [])
const actions = computed(() => props.report.actions || [])
const references = computed(() => props.report.references || [])

const structured = computed(() => (
  !!props.report.summary ||
  findings.value.length > 0 ||
  actions.value.length > 0 ||
  references.value.length > 0 ||
  !!props.report.usage?.totalTokens
))

const summaryType = computed(() => {
  const map = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error',
  }

  return map[props.report.severity] || 'info'
})

const evidenceByID = computed(() => {
  const map = new Map()

  for (const finding of findings.value) {
    for (const item of finding.evidence || []) {
      map.set(item.evidenceID, item)
    }
  }

  return map
})

const actionEvidence = action => (action.evidenceIDs || [])
  .map(id => evidenceByID.value.get(id))
  .filter(Boolean)
</script>

<style scoped>
.diagnosis-markdown :deep(.md-editor-preview-wrapper) {
  padding: 0;
}

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

<template>
  <v-card
    class="diagnosis-card"
    :height="height > 0 ? height : undefined"
  >
    <v-toolbar
      flat
      color="transparent"
    >
      <v-toolbar-title class="d-flex align-center flex-wrap ga-2">
        <v-icon icon="ri-stethoscope-line" />
        <span class="mr-4">{{ t('diagnosis.title') }}</span>
        <template v-if="!mobile">
          <v-chip
            v-if="scope === 'platform'"
            size="small"
            color="warning"
            label
            class="mr-4"
          >
            {{ t('diagnosis.scope.platform') }}
          </v-chip>
          <v-chip
            v-else
            size="small"
            label
            class="mr-4"
          >
            {{ session.roomName || roomName || t('diagnosis.scope.room') }}
          </v-chip>
        </template>
        <v-chip
          v-if="phase !== 'idle'"
          size="small"
          label
          :color="phaseColor"
          class="mr-4"
        >
          {{ t(`diagnosis.status.${phase}`) }}
        </v-chip>
      </v-toolbar-title>
      <v-btn
        v-if="closable"
        icon="ri-close-line"
        variant="text"
        @click="closePanel"
      />
    </v-toolbar>

    <v-tabs
      v-model="tab"
      class="flex-shrink-0"
      color="primary"
      align-tabs="start"
      show-arrows
    >
      <v-tab value="diagnosis">
        {{ t('diagnosis.tabs.diagnosis') }}
      </v-tab>
      <v-tab value="history">
        {{ t('diagnosis.tabs.history') }}
      </v-tab>
      <v-tab
        v-if="isAdmin"
        value="settings"
      >
        {{ t('diagnosis.tabs.settings') }}
      </v-tab>
    </v-tabs>

    <v-card-text
      ref="scrollContainer"
      class="diagnosis-card-body"
      @wheel="handleScrollWheel"
      @touchstart.passive="handleScrollTouchStart"
      @touchmove.passive="handleScrollTouchMove"
      @scroll.passive="handleScroll"
    >
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="diagnosis">
          <v-textarea
            v-model="description"
            :label="t('diagnosis.start.description.label')"
            :hint="t('diagnosis.start.description.hint')"
            :counter="DESCRIPTION_MAX"
            :maxlength="DESCRIPTION_MAX"
            rows="2"
            auto-grow
            clearable
            variant="outlined"
            density="comfortable"
            persistent-hint
            class="my-4"
            :disabled="busy"
          />

          <v-row
            align="center"
            class="mb-2"
          >
            <v-col
              v-if="isAdmin"
              cols="12"
              md="5"
            >
              <v-radio-group
                v-model="scope"
                :label="t('diagnosis.scope.label')"
                color="primary"
                inline
                hide-details
                density="compact"
                :disabled="busy"
                class="diagnosis-scope-group"
              >
                <v-radio
                  value="room"
                  class="mr-4"
                >
                  <template #label>
                    <span class="d-inline-flex align-center">
                      <v-icon
                        icon="ri-home-4-line"
                        size="18"
                        class="me-1"
                      />
                      {{ t('diagnosis.scope.room') }}
                    </span>
                  </template>
                </v-radio>
                <v-radio value="platform">
                  <template #label>
                    <span class="d-inline-flex align-center">
                      <v-icon
                        icon="ri-server-line"
                        size="18"
                        class="me-1"
                      />
                      {{ t('diagnosis.scope.platform') }}
                    </span>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              :md="isAdmin ? 7 : 12"
            >
              <div class="d-flex align-center flex-wrap justify-end ga-2">
                <v-btn
                  color="primary"
                  prepend-icon="ri-sparkling-2-line"
                  :loading="phase === 'starting'"
                  :disabled="busy || !canStart"
                  @click="startDiagnosis"
                >
                  {{ hasResult ? t('diagnosis.start.restart') : t('diagnosis.start.button') }}
                </v-btn>
                <v-btn
                  v-if="running"
                  color="warning"
                  variant="tonal"
                  prepend-icon="ri-stop-circle-line"
                  :loading="cancelLoading"
                  @click="cancelDialog = true"
                >
                  {{ t('diagnosis.cancel.button') }}
                </v-btn>
                <v-btn
                  v-if="canReconnect"
                  color="info"
                  variant="tonal"
                  prepend-icon="ri-refresh-line"
                  @click="reconnect"
                >
                  {{ t('diagnosis.progress.reconnect') }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div class="text-caption text-medium-emphasis mb-4">
            {{ t('diagnosis.start.tip') }}
          </div>

          <v-alert
            v-if="scope === 'room' && !roomId"
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            {{ t('diagnosis.roomRequired') }}
          </v-alert>

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="errorMessage = ''"
          >
            <div class="d-flex align-center flex-wrap ga-2">
              <span>{{ errorMessage }}</span>
              <v-btn
                v-if="[10061, 10063].includes(errorCode) && isAdmin"
                size="small"
                variant="text"
                color="primary"
                @click="openSettingsTab"
              >
                {{ t('diagnosis.error.goAISetting') }}
              </v-btn>
            </div>
          </v-alert>
          <v-alert
            v-if="connectionLost"
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            {{ t('diagnosis.error.sseLost') }}
          </v-alert>
          <v-alert
            v-if="restored"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            {{ t('diagnosis.report.restoreHint') }}
          </v-alert>

          <v-alert
            v-for="(notice, index) in visibleNotices"
            :key="index"
            :type="noticeType(notice.level)"
            variant="tonal"
            density="compact"
            class="mb-2"
          >
            {{ noticeText(notice.message) }}
          </v-alert>

          <v-sheet
            v-if="running || steps.length"
            rounded
            border
            class="mb-4 pa-4"
          >
            <div class="d-flex align-center flex-wrap ga-2 mb-2">
              <span class="text-subtitle-1">{{ t('diagnosis.progress.title') }}</span>
              <v-chip
                size="small"
                label
              >
                {{ formatDuration(elapsedMs) }}
              </v-chip>
              <v-chip
                v-if="reconnecting"
                size="small"
                label
                color="warning"
              >
                {{ t('diagnosis.progress.reconnecting', { num: reconnecting }) }}
              </v-chip>
            </div>
            <v-list
              density="compact"
              class="pa-0"
            >
              <v-list-item
                v-for="step in steps"
                :key="step.index"
                class="px-0"
              >
                <template #prepend>
                  <v-progress-circular
                    v-if="step.status === 'running'"
                    indeterminate
                    size="18"
                    width="2"
                    color="primary"
                    class="mr-3"
                  />
                  <v-icon
                    v-else-if="step.status === 'error'"
                    icon="ri-close-circle-line"
                    color="error"
                    class="mr-3"
                  />
                  <v-icon
                    v-else
                    icon="ri-checkbox-circle-line"
                    color="success"
                    class="mr-3"
                  />
                </template>
                <v-list-item-title class="text-body-2">
                  {{ diagnosisToolLabel(t, step.tool) }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="step.error">
                  {{ step.error }}
                </v-list-item-subtitle>
                <template #append>
                  <span
                    v-if="step.status !== 'running'"
                    class="text-caption text-medium-emphasis"
                  >
                    {{ formatStepDuration(step.durationMs) }}
                  </span>
                </template>
              </v-list-item>
              <v-list-item
                v-if="running && !steps.length"
                class="px-0"
              >
                <template #prepend>
                  <v-progress-circular
                    indeterminate
                    size="18"
                    width="2"
                    color="primary"
                    class="mr-3"
                  />
                </template>
                <v-list-item-title class="text-body-2">
                  {{ t('diagnosis.progress.waiting') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <div
              v-if="running"
              class="text-caption text-medium-emphasis mt-2"
            >
              {{ t('diagnosis.progress.detachedHint') }}
            </div>
          </v-sheet>

          <v-alert
            v-if="phase === 'streaming'"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            {{ t('diagnosis.report.pendingDetails') }}
          </v-alert>

          <diagnosis-report
            v-if="report"
            :report="report"
            :selection="selectedActionIDs"
            :selectable="canApply"
            :streaming="phase === 'streaming'"
            :complete="detailsReady"
            @toggle="toggleAction"
          />

          <v-alert
            v-else-if="phase === 'report_ready'"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            {{ t('diagnosis.report.empty') }}
          </v-alert>

          <v-sheet
            v-if="phase === 'report_ready' && actions.length"
            rounded
            border
            class="diagnosis-apply-bar mt-4 pa-4"
          >
            <div class="d-flex align-center flex-wrap ga-2">
              <v-icon icon="ri-play-list-2-line" />
              <span class="text-subtitle-1">{{ t('diagnosis.apply.selectTitle') }}</span>
              <v-chip
                size="small"
                label
              >
                {{ t('diagnosis.apply.selected', { num: selectedActionIDs.length }) }}
              </v-chip>
              <v-spacer />
              <v-btn
                color="primary"
                prepend-icon="ri-play-circle-line"
                :disabled="!canApply || !selectedActionIDs.length || multipleTyped"
                :loading="phase === 'applying'"
                @click="openConfirm"
              >
                {{ t('diagnosis.apply.button') }}
              </v-btn>
            </div>
            <div
              v-if="applyBlockReason"
              class="text-caption text-warning mt-2"
            >
              {{ applyBlockReason }}
            </div>
            <div
              v-else-if="phase === 'report_ready' && !session.canApply"
              class="text-caption text-medium-emphasis mt-2"
            >
              {{ t('diagnosis.apply.cannotApply') }}
            </div>
          </v-sheet>

          <v-sheet
            v-if="applyState"
            rounded
            border
            class="mt-4 pa-4"
          >
            <div class="d-flex align-center flex-wrap ga-2">
              <span class="text-subtitle-1">{{ t('diagnosis.apply.resultTitle') }}</span>
              <v-chip
                size="small"
                label
                :color="statusColor(applyState.status)"
              >
                {{ applyStatusText(t, applyState.status) }}
              </v-chip>
              <v-spacer />
              <span
                v-if="applyState.finishedAt"
                class="text-caption text-medium-emphasis"
              >
                {{ formatDateTime(applyState.finishedAt, locale) }}
              </span>
            </div>
            <v-list
              v-if="applyState.results?.length"
              density="compact"
              class="pa-0 mt-2"
            >
              <v-list-item
                v-for="result in applyState.results"
                :key="result.actionID"
                class="px-0"
              >
                <template #prepend>
                  <v-icon
                    :icon="resultIcon(result.status)"
                    :color="statusColor(result.status)"
                    class="mr-3"
                  />
                </template>
                <v-list-item-title class="text-body-2">
                  {{ actionTitleByID(t, result.actionID) }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="actionResultText(result)">
                  {{ actionResultText(result) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-sheet>

          <v-sheet
            v-if="phase === 'idle'"
            rounded
            border
            class="pa-8 text-center"
          >
            <v-icon
              icon="ri-stethoscope-line"
              size="56"
              color="primary"
              class="mb-4"
            />
            <div class="text-subtitle-1 mb-2">
              {{ t('diagnosis.empty.title') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('diagnosis.empty.tip') }}
            </div>
          </v-sheet>
        </v-tabs-window-item>

        <v-tabs-window-item value="history">
          <diagnosis-history />
        </v-tabs-window-item>
        <v-tabs-window-item
          v-if="isAdmin"
          value="settings"
        >
          <diagnosis-settings />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>

    <v-dialog
      v-model="confirmDialog"
      max-width="640"
      persistent
    >
      <v-card>
        <v-card-title>
          {{ t('diagnosis.apply.confirmTitle') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('diagnosis.apply.confirmHint') }}
          </v-alert>
          <v-alert
            v-if="needsBackup"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('diagnosis.apply.backupHint') }}
          </v-alert>
          <v-alert
            v-if="multipleTyped"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ t('diagnosis.apply.multipleTyped') }}
          </v-alert>
          <v-list
            density="compact"
            class="pa-0"
          >
            <v-list-item
              v-for="action in selectedActions"
              :key="action.actionID"
              class="px-0"
            >
              <v-list-item-title class="text-body-2">
                {{ actionTitle(t, action) }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ action.preview }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-text-field
            v-if="selectedTyped.length"
            v-model="confirmationText"
            class="mt-4"
            :label="typedHint"
            :error="!!confirmationError"
            :error-messages="confirmationError"
            autofocus
          />
          <v-alert
            v-if="confirmError"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-4"
          >
            {{ confirmError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="elevated"
            @click="confirmDialog = false"
          >
            {{ t('diagnosis.apply.cancel') }}
          </v-btn>
          <v-btn
            variant="elevated"
            color="error"
            :loading="applyLoading"
            :disabled="!confirmationValid"
            @click="submitApply"
          >
            {{ t('diagnosis.apply.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="cancelDialog"
      max-width="460"
    >
      <v-card>
        <v-card-title>
          {{ t('diagnosis.cancel.title') }}
        </v-card-title>
        <v-card-text>
          {{ t('diagnosis.cancel.confirm') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="elevated"
            @click="cancelDialog = false"
          >
            {{ t('global.confirm.cancel') }}
          </v-btn>
          <v-btn
            variant="elevated"
            color="warning"
            :loading="cancelLoading"
            @click="handleCancel"
          >
            {{ t('diagnosis.cancel.button') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { showSnackbar } from '@/utils/snackbar'
import { getToken } from '@/utils/tools'
import useGlobalStore from '@store/global'
import useUserStore from '@store/user'
import { useDisplay } from 'vuetify/framework'
import diagnosisApi, { diagnosisApplyEventsURL, diagnosisEventsURL } from '@/api/diagnosis'
import { openSSE } from '@/utils/sse'
import {
  actionTitle,
  actionTitleByID,
  applyStatusText,
  clearStoredDiagnosis,
  diagnosisToolLabel,
  formatDateTime,
  formatDuration,
  formatStepDuration,
  isBackupAction,
  parseStoredDiagnosis,
  splitReport,
  statusColor,
  storeDiagnosis,
  typedConfirmationText,
} from '@/utils/diagnosis'
import DiagnosisReport from './DiagnosisReport.vue'
import DiagnosisHistory from './DiagnosisHistory.vue'
import DiagnosisSettings from './DiagnosisSettings.vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 0,
  },
  roomId: {
    type: Number,
    default: 0,
  },
  roomName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'applied'])

const { t } = useI18n()
const globalStore = useGlobalStore()
const userStore = useUserStore()

const { mobile } = useDisplay()

const locale = computed(() => globalStore.language)
const isAdmin = computed(() => userStore.userInfo.role === 'admin')

const emptySession = () => ({
  diagnosisID: '',
  scope: 'room',
  roomID: props.roomId || 0,
  roomName: props.roomName || '',
  description: '',
  status: 'idle',
  createdAt: '',
  finishedAt: '',
  canApply: false,
  error: '',
})

const tab = ref('diagnosis')
const DESCRIPTION_MAX = 1000
const description = ref('')
const scope = ref(props.roomId > 0 || userStore.userInfo.role !== 'admin' ? 'room' : 'platform')
const phase = ref('idle')
const session = ref(emptySession())
const steps = ref([])
const notices = ref([])
const reportMeta = ref(null)
const reportMarkdown = ref('')
const reportUsage = ref(null)
const applyState = ref(null)
const selectedActionIDs = ref([])
const errorCode = ref(0)
const errorMessage = ref('')
const connectionLost = ref(false)
const reconnecting = ref(0)
const restored = ref(false)
const cancelLoading = ref(false)
const cancelDialog = ref(false)
const confirmDialog = ref(false)
const confirmationText = ref('')
const confirmationError = ref('')
const confirmError = ref('')
const applyLoading = ref(false)
const now = ref(Date.now())
const scrollContainer = ref(null)
const autoScroll = ref(true)

const PHASE_COLORS = {
  starting: 'info',
  running: 'info',
  streaming: 'info',
  'report_ready': 'success',
  applying: 'warning',
  applied: 'success',
  'apply_partial': 'warning',
  'apply_failed': 'error',
  failed: 'error',
  canceled: 'default',
  idle: 'default',
}

const phaseColor = computed(() => PHASE_COLORS[phase.value] || 'default')
const running = computed(() => ['starting', 'running', 'streaming'].includes(phase.value))
const busy = computed(() => running.value || phase.value === 'applying')
const hasResult = computed(() => phase.value !== 'idle' && !running.value)

const canReconnect = computed(() => (
  connectionLost.value &&
  !!session.value.diagnosisID &&
  (running.value || phase.value === 'applying')
))

const canStart = computed(() => scope.value !== 'room' || props.roomId > 0)

const report = computed(() => {
  if (!reportMeta.value) return null

  return {
    ...reportMeta.value,
    markdown: reportMarkdown.value,
    usage: reportUsage.value || reportMeta.value.usage || null,
  }
})

const actions = computed(() => report.value?.actions || [])

const canApply = computed(() => (
  phase.value === 'report_ready' &&
  session.value.canApply
))

// 报告正文输出完成（或诊断已终止）后，才展示结构化结论、修复建议、Token 用量与动作选择。
const detailsReady = computed(() => (
  !!report.value &&
  !['idle', 'starting', 'running', 'streaming'].includes(phase.value)
))

const selectedActions = computed(() => actions.value.filter(action => selectedActionIDs.value.includes(action.actionID)))
const selectedTyped = computed(() => selectedActions.value.filter(action => action.confirmationLevel === 'typed'))
const multipleTyped = computed(() => selectedTyped.value.length > 1)
const needsBackup = computed(() => selectedActions.value.some(isBackupAction))

const typedExpected = computed(() => {
  const action = selectedTyped.value[0]

  if (!action) return ''

  return typedConfirmationText(action, session.value.scope === 'room' ? (session.value.roomName || props.roomName) : '')
})

const typedHint = computed(() => {
  const action = selectedTyped.value[0]

  if (!action) return ''

  if (typedExpected.value) return t('diagnosis.apply.typedHint', { text: typedExpected.value })

  return action.confirmationHint || t('diagnosis.apply.typedPlaceholder')
})

const confirmationValid = computed(() => {
  if (!selectedActions.value.length || multipleTyped.value) return false
  if (!selectedTyped.value.length) return true
  if (!confirmationText.value) return false
  if (typedExpected.value && confirmationText.value !== typedExpected.value) return false

  return true
})

const applyBlockReason = computed(() => {
  if (multipleTyped.value) return t('diagnosis.apply.multipleTyped')

  return ''
})

const visibleNotices = computed(() => notices.value.slice(-5))

const elapsedMs = computed(() => {
  if (!session.value.createdAt) return 0

  const start = new Date(session.value.createdAt).getTime()

  if (Number.isNaN(start)) return 0

  const finished = session.value.finishedAt ? new Date(session.value.finishedAt).getTime() : 0
  const end = finished && !Number.isNaN(finished) ? finished : now.value

  return Math.max(0, end - start)
})

let ticker = null
let controller = null
let deltaBuffer = ''
let deltaTimer = null
let restoreToken = 0
const bottomThreshold = 16
let lastTouchY = null
let scrollTimer = null

// 标记本次诊断是刚刚完成（而不是恢复历史报告），完成时才强制滚到底部。
let completeScrollPending = false

const getScrollElement = () => scrollContainer.value?.$el || scrollContainer.value

const getScrollMetrics = element => {
  const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight)
  const scrollTop = Math.min(Math.max(element.scrollTop, 0), maxScrollTop)

  return {
    distanceToBottom: maxScrollTop - scrollTop,
  }
}

const handleScrollWheel = event => {
  if (event.deltaY < 0 && getScrollMetrics(event.currentTarget).distanceToBottom > bottomThreshold) {
    autoScroll.value = false
  }
}

const handleScrollTouchStart = event => {
  lastTouchY = event.touches[0]?.clientY ?? null
}

const handleScrollTouchMove = event => {
  const currentTouchY = event.touches[0]?.clientY
  if (currentTouchY === undefined || lastTouchY === null) return

  const isMovingDown = currentTouchY > lastTouchY + 2
  const { distanceToBottom } = getScrollMetrics(event.currentTarget)

  if (isMovingDown && distanceToBottom > bottomThreshold) {
    autoScroll.value = false
  }

  lastTouchY = currentTouchY
}

const handleScroll = event => {
  if (getScrollMetrics(event.currentTarget).distanceToBottom <= bottomThreshold) {
    autoScroll.value = true
  }
}

const scrollToBottom = () => {
  if (!autoScroll.value || tab.value !== 'diagnosis' || scrollTimer) return

  scrollTimer = setTimeout(() => {
    scrollTimer = null
    if (!autoScroll.value || tab.value !== 'diagnosis') return

    const element = getScrollElement()
    if (!element) return

    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    })
  }, 100)
}

const scrollOnContentChange = () => {
  if (!autoScroll.value || tab.value !== 'diagnosis') return
  nextTick(scrollToBottom)
}

watch(reportMarkdown, scrollOnContentChange)
watch(reportMeta, scrollOnContentChange, { deep: true })
watch(steps, scrollOnContentChange, { deep: true })
watch(notices, scrollOnContentChange, { deep: true })
watch(applyState, scrollOnContentChange, { deep: true })
watch(detailsReady, ready => {
  if (!ready || !completeScrollPending) return

  // 报告输出完成后，等结构化结果渲染到 DOM，再把滚动条移到最下方。
  completeScrollPending = false
  autoScroll.value = true
  nextTick(scrollToBottom)
})
watch(phase, value => {
  if (value === 'running' || value === 'streaming') scrollOnContentChange()
})
watch(tab, value => {
  if (value === 'diagnosis') scrollOnContentChange()
})

const startTicker = () => {
  stopTicker()
  ticker = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

const stopTicker = () => {
  if (ticker) {
    clearInterval(ticker)
    ticker = null
  }
}

const closeStream = () => {
  if (controller) {
    controller.abort()
    controller = null
  }
}

const flushMarkdown = () => {
  if (deltaTimer) {
    clearTimeout(deltaTimer)
    deltaTimer = null
  }
  if (deltaBuffer) {
    reportMarkdown.value += deltaBuffer
    deltaBuffer = ''
  }
}

const resetMarkdown = () => {
  flushMarkdown()
  reportMarkdown.value = ''
}

const appendMarkdown = delta => {
  if (!delta) return

  deltaBuffer += delta
  if (deltaTimer) return

  deltaTimer = setTimeout(() => {
    deltaTimer = null
    if (!deltaBuffer) return

    reportMarkdown.value += deltaBuffer
    deltaBuffer = ''
  }, 80)
}

const setError = error => {
  errorCode.value = Number(error?.code) || 0
  errorMessage.value = error?.message || t('diagnosis.error.unknown')
  if ([10041, 10042].includes(errorCode.value)) {
    clearStoredDiagnosis(scope.value, props.roomId)
  }
}

const upsertStep = step => {
  const index = steps.value.findIndex(item => item.index === step.index)

  if (index >= 0) {
    steps.value[index] = { ...steps.value[index], ...step }
  } else {
    steps.value.push(step)
    steps.value.sort((a, b) => (a.index || 0) - (b.index || 0))
  }
}

const setReportMeta = data => {
  const { meta } = splitReport(data)

  reportMeta.value = meta
  if (!reportMarkdown.value) reportMarkdown.value = ''
}

const updateActionStatus = (actionID, status) => {
  const action = reportMeta.value?.actions?.find(item => item.actionID === actionID)

  if (action) action.status = status
}

const updateActionResult = result => {
  if (!applyState.value) {
    applyState.value = {
      applyID: '',
      status: 'running',
      startedAt: '',
      finishedAt: null,
      results: [],
    }
  }

  const action = reportMeta.value?.actions?.find(item => item.actionID === result.actionID)

  if (action) {
    action.status = result.status || action.status
    action.applyResult = result
  }

  const index = applyState.value.results.findIndex(item => item.actionID === result.actionID)

  if (index >= 0) applyState.value.results[index] = result
  else applyState.value.results.push(result)
}

const handleDiagnosisEvent = event => {
  const data = event?.data || {}

  switch (event?.type) {
    case 'session':
      if (data.diagnosisID) session.value.diagnosisID = data.diagnosisID
      if (data.scope) session.value.scope = data.scope
      if (data.roomID) session.value.roomID = data.roomID
      if (typeof data.description === 'string') session.value.description = data.description
      if (data.description && !description.value) description.value = data.description
      if (!session.value.createdAt && data.startedAt) session.value.createdAt = data.startedAt
      if (data.status) session.value.status = data.status
      if (['starting', 'idle'].includes(phase.value)) phase.value = 'running'
      break
    case 'step':
      upsertStep(data)
      if (phase.value === 'starting') phase.value = 'running'
      break
    case 'notice':
      if (data.message) notices.value.push({ level: data.level || 'info', message: data.message })
      break
    case 'report_meta':
      setReportMeta(data)
      break
    case 'report_start':
      resetMarkdown()
      reportMeta.value = reportMeta.value || { findings: [], actions: [], references: [] }
      if (data.model) reportMeta.value.model = data.model
      phase.value = 'streaming'
      break
    case 'report_delta':
      appendMarkdown(data.delta || '')
      break
    case 'report_end':
      flushMarkdown()
      if (typeof data.report === 'string') reportMarkdown.value = data.report
      if (data.usage) reportUsage.value = data.usage
      break
    case 'done':
      flushMarkdown()
      session.value.status = data.status || session.value.status
      session.value.finishedAt = data.finishedAt || new Date().toISOString()
      if (data.usage) reportUsage.value = data.usage
      if (data.status === 'succeeded') {
        session.value.canApply = actions.value.length > 0
        completeScrollPending = true
        phase.value = 'report_ready'
      } else if (data.status === 'canceled') {
        clearStoredDiagnosis(scope.value, props.roomId)
        phase.value = 'canceled'
      } else {
        phase.value = 'failed'
      }

      return false
    case 'error':
      flushMarkdown()
      setError({ code: data.code, message: data.message })
      session.value.finishedAt = new Date().toISOString()
      connectionLost.value = false
      phase.value = 'failed'

      return false
    default:
      break
  }
}

const handleApplyEvent = event => {
  const data = event?.data || {}

  switch (event?.type) {
    case 'apply_start':
      applyState.value = {
        applyID: data.applyID || applyState.value?.applyID || '',
        status: 'running',
        startedAt: data.startedAt || new Date().toISOString(),
        finishedAt: null,
        results: [],
      }
      break
    case 'action_start':
      updateActionStatus(data.actionID, 'running')
      break
    case 'action_done':
      updateActionResult(data)
      break
    case 'apply_end':
      applyState.value = {
        applyID: applyState.value?.applyID || '',
        status: data.status || 'failed',
        startedAt: applyState.value?.startedAt || '',
        finishedAt: data.finishedAt || new Date().toISOString(),
        results: data.results || [],
      }
      for (const result of applyState.value.results) updateActionResult(result)
      session.value.canApply = false
      session.value.finishedAt = data.finishedAt || session.value.finishedAt
      if (data.status === 'succeeded') {
        phase.value = 'applied'
        emit('applied')
      } else if (data.status === 'partial') {
        phase.value = 'apply_partial'
        emit('applied')
      } else {
        phase.value = 'apply_failed'
      }

      return false
    case 'error':
      setError({ code: data.code, message: data.message })
      session.value.finishedAt = new Date().toISOString()
      connectionLost.value = false
      phase.value = 'apply_failed'

      return false
    default:
      break
  }
}

const refreshSnapshot = async (reconnect = true) => {
  const diagnosisID = session.value.diagnosisID

  if (!diagnosisID) return

  try {
    const response = await diagnosisApi.snapshot.get(diagnosisID)

    // 请求期间用户可能已经重新诊断，丢弃过期响应。
    if (diagnosisID !== session.value.diagnosisID) return

    applySnapshot(response.data, reconnect)
  } catch (error) {
    if (diagnosisID !== session.value.diagnosisID) return
    if ([10021, 10041, 10042].includes(Number(error?.code))) {
      setError(error)
      phase.value = 'failed'
    }
  }
}

const applySnapshot = (data, reconnect = true, markRestored = false) => {
  if (!data) return

  const snapshotScope = data.scope === 'platform' ? 'platform' : 'room'

  session.value = {
    diagnosisID: data.diagnosisID || '',
    scope: snapshotScope,
    roomID: data.roomID || 0,
    roomName: data.roomName || (snapshotScope === 'room' ? props.roomName : ''),
    description: data.description || '',
    status: data.status || 'idle',
    createdAt: data.createdAt || '',
    finishedAt: data.finishedAt || '',
    canApply: !!data.canApply,
    error: data.error || '',
  }
  if (data.description && !description.value) description.value = data.description
  steps.value = [...(data.steps || [])].sort((a, b) => (a.index || 0) - (b.index || 0))
  applyState.value = data.apply || null
  selectedActionIDs.value = []
  notices.value = []
  errorCode.value = 0
  errorMessage.value = data.error || ''
  connectionLost.value = false
  reconnecting.value = 0
  if (markRestored) restored.value = true

  if (data.report) {
    const { meta, markdown, usage } = splitReport(data.report)

    reportMeta.value = meta
    reportMarkdown.value = markdown
    reportUsage.value = usage
  } else {
    reportMeta.value = null
    reportMarkdown.value = ''
    reportUsage.value = null
  }

  const apply = applyState.value

  if (apply?.status === 'running') {
    phase.value = 'applying'
    if (reconnect) connectApplyStream(diagnosisApplyEventsURL(session.value.diagnosisID))
  } else if (apply) {
    if (apply.status === 'succeeded') phase.value = 'applied'
    else if (apply.status === 'partial') phase.value = 'apply_partial'
    else phase.value = 'apply_failed'
  } else if (data.status === 'running') {
    phase.value = 'running'
    if (reconnect) connectDiagnosisStream(diagnosisEventsURL(session.value.diagnosisID))
  } else if (data.status === 'succeeded') {
    // 后端先置 succeeded 再流式生成正文，此时快照里 markdown 为空；
    // 重放 SSE 才能拿到 report_start/report_delta/report_end。
    const reportStreaming = !data.report?.markdown

    // 报告正文仍在流式生成时，快照里的 finishedAt 已经落下，清空以继续显示实时耗时。
    if (reportStreaming) session.value.finishedAt = ''
    phase.value = reportStreaming ? 'running' : 'report_ready'
    if (reportStreaming && reconnect) {
      connectDiagnosisStream(diagnosisEventsURL(session.value.diagnosisID))
    } else if (!reportStreaming && !markRestored) {
      // 流结束/重连后由快照确认报告已完成，同样滚到底部。
      completeScrollPending = true
    }
  } else if (data.status === 'canceled') {
    phase.value = 'canceled'
  } else {
    phase.value = 'failed'
  }

  // 页面刷新/切换范围后恢复到已完成的报告时停留在顶部，避免直接跳到最后。
  if (markRestored && data.status === 'succeeded' && data.report?.markdown) {
    autoScroll.value = false
  }
}

const handleStreamError = error => {
  const code = Number(error?.code) || 0
  const terminal = code === 420 || (code >= 10000 && code < 11000)

  setError(error)
  if (terminal) {
    session.value.finishedAt = new Date().toISOString()
    connectionLost.value = false
    phase.value = 'failed'

    return
  }
  connectionLost.value = true
}

const connectDiagnosisStream = async (eventsURL, lastEventID = 0) => {
  if (!eventsURL) return

  closeStream()

  const currentController = new AbortController()

  controller = currentController
  reconnecting.value = 0

  try {
    await openSSE(eventsURL, {
      token: getToken(),
      lang: globalStore.language,
      lastEventID,
      signal: currentController.signal,
      onEvent: handleDiagnosisEvent,
      onRetry: count => {
        reconnecting.value = count
      },
    })
    reconnecting.value = 0
    if (currentController.signal.aborted) return
    if (['starting', 'running', 'streaming'].includes(phase.value)) {
      // 流结束却没有收到终止事件，用快照兜底；不自动重连，避免无限循环。
      await refreshSnapshot(false)
      if (['starting', 'running', 'streaming'].includes(phase.value)) {
        connectionLost.value = true
      }
    }
  } catch (error) {
    if (currentController.signal.aborted || error?.name === 'AbortError') return
    handleStreamError(error)
  } finally {
    if (controller === currentController) controller = null
  }
}

const connectApplyStream = async (eventsURL, lastEventID = 0) => {
  if (!eventsURL) return

  closeStream()

  const currentController = new AbortController()

  controller = currentController
  reconnecting.value = 0

  try {
    await openSSE(eventsURL, {
      token: getToken(),
      lang: globalStore.language,
      lastEventID,
      signal: currentController.signal,
      onEvent: handleApplyEvent,
      onRetry: count => {
        reconnecting.value = count
      },
    })
    reconnecting.value = 0
    if (currentController.signal.aborted) return
    if (phase.value === 'applying') {
      await refreshSnapshot(false)
      if (phase.value === 'applying') {
        errorMessage.value = t('diagnosis.error.sseLost')
        connectionLost.value = true
      }
    }
  } catch (error) {
    if (currentController.signal.aborted || error?.name === 'AbortError') return
    const code = Number(error?.code) || 0
    const terminal = code === 420 || (code >= 10000 && code < 11000)
    const message = error?.message || t('diagnosis.error.sseLost')

    if (phase.value === 'applying') {
      await refreshSnapshot(false)
      if (phase.value === 'applying') {
        errorCode.value = code
        errorMessage.value = message
        if (terminal) {
          session.value.finishedAt = new Date().toISOString()
          connectionLost.value = false
          phase.value = 'apply_failed'
        } else {
          connectionLost.value = true
        }
      }
    } else {
      setError(error)
      connectionLost.value = !terminal
    }
  } finally {
    if (controller === currentController) controller = null
  }
}

const resetSessionState = () => {
  session.value = emptySession()
  steps.value = []
  notices.value = []
  reportMeta.value = null
  reportMarkdown.value = ''
  reportUsage.value = null
  applyState.value = null
  selectedActionIDs.value = []
  errorCode.value = 0
  errorMessage.value = ''
  connectionLost.value = false
  reconnecting.value = 0
  restored.value = false
  cancelDialog.value = false
  confirmDialog.value = false
  confirmationText.value = ''
  confirmationError.value = ''
  confirmError.value = ''
  deltaBuffer = ''
  if (deltaTimer) {
    clearTimeout(deltaTimer)
    deltaTimer = null
  }
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
  autoScroll.value = true
  completeScrollPending = false
  lastTouchY = null
  phase.value = 'idle'
}

const restoreSession = async () => {
  const token = ++restoreToken
  const stored = parseStoredDiagnosis(scope.value, props.roomId)

  if (!stored) {
    resetSessionState()

    return
  }

  try {
    const response = await diagnosisApi.snapshot.get(stored.diagnosisID)

    if (token !== restoreToken) return

    applySnapshot(response.data, true, true)
  } catch (error) {
    if (token !== restoreToken) return
    if ([10021, 10041, 10042].includes(Number(error?.code))) {
      clearStoredDiagnosis(scope.value, props.roomId)
    }
    resetSessionState()
  }
}

const startDiagnosis = async () => {
  if (busy.value || !canStart.value) return

  restoreToken += 1
  closeStream()

  const previousPhase = phase.value
  const previousDiagnosisID = session.value.diagnosisID

  errorCode.value = 0
  errorMessage.value = ''
  connectionLost.value = false
  phase.value = 'starting'
  autoScroll.value = true
  lastTouchY = null

  try {
    const descriptionText = description.value.trim()

    const response = await diagnosisApi.start.post({
      scope: scope.value,
      roomID: scope.value === 'room' ? props.roomId : 0,
      description: descriptionText,
    })

    const data = response.data || {}

    resetSessionState()
    description.value = descriptionText
    session.value = {
      diagnosisID: data.diagnosisID || '',
      scope: data.scope || scope.value,
      roomID: scope.value === 'room' ? props.roomId : 0,
      roomName: scope.value === 'room' ? props.roomName : '',
      description: descriptionText,
      status: data.status || 'running',
      createdAt: new Date().toISOString(),
      finishedAt: '',
      canApply: false,
      error: '',
    }
    phase.value = 'running'
    storeDiagnosis(scope.value, props.roomId, data.diagnosisID)
    connectDiagnosisStream(data.eventsURL || diagnosisEventsURL(data.diagnosisID))
  } catch (error) {
    setError(error)
    phase.value = previousDiagnosisID && previousPhase !== 'idle' && previousPhase !== 'starting'
      ? previousPhase
      : 'failed'
  }
}

const handleCancel = async () => {
  if (!session.value.diagnosisID) return

  cancelLoading.value = true

  try {
    const response = await diagnosisApi.cancel.delete(session.value.diagnosisID)

    cancelDialog.value = false
    closeStream()
    session.value.status = 'canceled'
    session.value.finishedAt = new Date().toISOString()
    phase.value = 'canceled'
    clearStoredDiagnosis(scope.value, props.roomId)
    showSnackbar(response?.message || t('diagnosis.cancel.done'))
  } catch (error) {
    setError(error)
  } finally {
    cancelLoading.value = false
  }
}

const toggleAction = actionID => {
  const index = selectedActionIDs.value.indexOf(actionID)

  if (index >= 0) selectedActionIDs.value.splice(index, 1)
  else selectedActionIDs.value.push(actionID)
}

const openConfirm = () => {
  if (!canApply.value || !selectedActions.value.length || multipleTyped.value) return

  confirmationText.value = ''
  confirmationError.value = ''
  confirmError.value = ''
  confirmDialog.value = true
}

const submitApply = async () => {
  if (!confirmationValid.value) {
    confirmationError.value = t('diagnosis.apply.typedMismatch')

    return
  }

  applyLoading.value = true
  confirmationError.value = ''
  confirmError.value = ''

  try {
    const response = await diagnosisApi.apply.post(session.value.diagnosisID, {
      actionIDs: [...selectedActionIDs.value],
      confirm: true,
      confirmationText: selectedTyped.value.length ? confirmationText.value : '',
      paramOverrides: {},
    })

    const data = response.data || {}

    confirmDialog.value = false
    applyState.value = {
      applyID: data.applyID || '',
      status: data.status || 'running',
      startedAt: new Date().toISOString(),
      finishedAt: null,
      results: [],
    }
    selectedActionIDs.value = []
    phase.value = 'applying'
    connectApplyStream(data.eventsURL || diagnosisApplyEventsURL(session.value.diagnosisID))
  } catch (error) {
    confirmError.value = error?.message || t('diagnosis.error.unknown')
    if ([10041, 10042].includes(Number(error?.code))) {
      confirmDialog.value = false
      setError(error)
      phase.value = 'failed'
    }
  } finally {
    applyLoading.value = false
  }
}

const reconnect = () => {
  if (!session.value.diagnosisID) return

  connectionLost.value = false
  errorMessage.value = ''
  if (phase.value === 'applying') {
    connectApplyStream(diagnosisApplyEventsURL(session.value.diagnosisID))
  } else {
    connectDiagnosisStream(diagnosisEventsURL(session.value.diagnosisID))
  }
}

const NOTICE_KEYS = new Map([
  ['报告流式生成失败，已使用结构化结果生成报告', 'diagnosis.notice.reportFallback'],
  ['diagnosis canceled', 'diagnosis.notice.canceled'],
])

const noticeText = message => {
  const key = NOTICE_KEYS.get(message)

  return key ? t(key) : message
}

const noticeType = level => {
  if (level === 'error') return 'error'
  if (level === 'warning') return 'warning'

  return 'info'
}

const resultIcon = status => {
  if (status === 'succeeded') return 'ri-checkbox-circle-line'
  if (status === 'skipped') return 'ri-skip-forward-line'

  return 'ri-close-circle-line'
}

const actionResultText = result => {
  const parts = []

  if (result?.verifyMessage) parts.push(result.verifyMessage)
  else if (result?.message) parts.push(result.message)

  return parts.join(' · ')
}

const closePanel = () => {
  emit('close')
}

const openSettingsTab = () => {
  tab.value = 'settings'
}

watch(confirmationText, () => {
  confirmationError.value = ''
})

watch(() => props.active, value => {
  if (value) {
    startTicker()
    restoreSession()
  } else {
    closeStream()
    stopTicker()
    if (deltaTimer) {
      clearTimeout(deltaTimer)
      deltaTimer = null
    }
    deltaBuffer = ''
  }
}, { immediate: true })

watch(scope, () => {
  if (!props.active || tab.value !== 'diagnosis') return

  restoreToken += 1
  closeStream()
  resetSessionState()
  description.value = ''
  restoreSession()
})

watch(() => props.roomId, () => {
  if (!props.active || tab.value !== 'diagnosis' || scope.value !== 'room') return

  restoreToken += 1
  closeStream()
  resetSessionState()
  description.value = ''
  restoreSession()
})

watch(tab, value => {
  if (value !== 'diagnosis' || !props.active || controller) return
  if (!['starting', 'running', 'streaming', 'applying'].includes(phase.value)) return

  restoreSession()
})

onBeforeUnmount(() => {
  closeStream()
  stopTicker()
  if (deltaTimer) {
    clearTimeout(deltaTimer)
    deltaTimer = null
  }
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
  deltaBuffer = ''
})
</script>

<style scoped>
.v-card.diagnosis-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.v-card-text.diagnosis-card-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.diagnosis-apply-bar {
  position: sticky;
  bottom: 0;
  z-index: 2;
  background: rgb(var(--v-theme-surface));
}

.diagnosis-spin {
  animation: diagnosis-spin 1s linear infinite;
}

@keyframes diagnosis-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

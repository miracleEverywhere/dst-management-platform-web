<template>
  <div>
    <v-row
      class="mb-2"
      dense
    >
      <v-col
        cols="12"
        md="3"
      >
        <v-select
          v-model="scopeFilter"
          :items="scopeItems"
          :label="t('diagnosis.history.filter.scope')"
          clearable
          density="comfortable"
          hide-details
          @update:model-value="reload"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-select
          v-model="statusFilter"
          :items="statusItems"
          :label="t('diagnosis.history.filter.status')"
          clearable
          density="comfortable"
          hide-details
          @update:model-value="reload"
        />
      </v-col>
      <v-spacer />
      <v-col
        cols="auto"
        class="d-flex align-center"
      >
        <v-btn
          icon="ri-refresh-line"
          variant="text"
          :loading="loading"
          @click="reload"
        />
      </v-col>
    </v-row>

    <v-sheet
      border
      rounded
    >
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="pageSize"
        :headers="headers"
        :items="rows"
        :items-length="total"
        :loading="loading"
        @update:options="loadHistory"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>
        <template #item.createdAt="{ value }">
          <span class="text-caption">{{ formatDateTime(value, locale) }}</span>
        </template>
        <template #item.scope="{ value }">
          <v-chip
            size="small"
            label
            :color="value === 'platform' ? 'warning' : 'primary'"
          >
            {{ t(`diagnosis.scope.${value}`) }}
          </v-chip>
        </template>
        <template #item.status="{ value }">
          <v-chip
            size="small"
            label
            :color="statusColor(value)"
          >
            {{ t(`diagnosis.status.${value}`) }}
          </v-chip>
        </template>
        <template #item.severity="{ value }">
          <v-chip
            v-if="value"
            size="small"
            label
            :color="severityColor(value)"
          >
            {{ t(`diagnosis.severity.${value}`) }}
          </v-chip>
          <span v-else>-</span>
        </template>
        <template #item.summary="{ value }">
          <span class="text-body-2">{{ value || '-' }}</span>
        </template>
        <template #item.description="{ value }">
          <span
            class="text-body-2 d-inline-block text-truncate"
            style="max-width: 260px"
            :title="value || ''"
          >
            {{ value || '-' }}
          </span>
        </template>
        <template #item.appliedCount="{ item }">
          <v-chip
            size="small"
            label
          >
            {{ item.appliedCount || 0 }}/{{ item.actionCount || 0 }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="text"
            color="info"
            @click="openDetail(item)"
          >
            {{ t('diagnosis.history.view') }}
          </v-btn>
        </template>
        <template #no-data>
          <div class="py-6 text-medium-emphasis">
            {{ t('diagnosis.history.empty') }}
          </div>
        </template>
      </v-data-table-server>
    </v-sheet>

    <v-dialog
      v-model="detailDialog"
      max-width="1000"
      scrollable
    >
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>
            {{ t('diagnosis.history.detailTitle') }}
          </v-toolbar-title>
          <v-btn
            icon="ri-close-line"
            variant="text"
            @click="detailDialog = false"
          />
        </v-toolbar>
        <v-card-text>
          <v-progress-linear
            v-if="detailLoading"
            indeterminate
            color="primary"
          />
          <v-alert
            v-else-if="detailError"
            type="error"
            variant="tonal"
          >
            {{ detailError }}
          </v-alert>
          <template v-else-if="detailSnapshot">
            <div class="d-flex align-center flex-wrap ga-2 mb-4">
              <v-chip
                size="small"
                label
                :color="detailSnapshot.scope === 'platform' ? 'warning' : 'primary'"
              >
                {{ t(`diagnosis.scope.${detailSnapshot.scope}`) }}
              </v-chip>
              <v-chip
                v-if="detailSnapshot.roomName"
                size="small"
                label
              >
                {{ detailSnapshot.roomName }}
              </v-chip>
              <v-chip
                size="small"
                label
                :color="statusColor(detailSnapshot.status)"
              >
                {{ t(`diagnosis.status.${detailSnapshot.status}`) }}
              </v-chip>
              <v-chip
                v-if="detailSnapshot.report?.severity"
                size="small"
                label
                :color="severityColor(detailSnapshot.report.severity)"
              >
                {{ t(`diagnosis.severity.${detailSnapshot.report.severity}`) }}
              </v-chip>
              <v-chip
                size="small"
                label
              >
                {{ formatDateTime(detailSnapshot.createdAt, locale) }}
              </v-chip>
              <v-chip
                v-if="detailSnapshot.report?.model"
                size="small"
                label
              >
                {{ detailSnapshot.report.model }}
              </v-chip>
              <v-chip
                v-if="detailSnapshot.apply"
                size="small"
                label
                :color="statusColor(detailSnapshot.apply.status)"
              >
                {{ applyStatusText(t, detailSnapshot.apply.status) }}
              </v-chip>
            </div>

            <v-sheet
              v-if="detailSnapshot.description"
              rounded
              border
              class="mb-4 pa-4"
            >
              <div class="text-caption text-medium-emphasis mb-1">
                {{ t('diagnosis.history.description') }}
              </div>
              <div class="text-body-2 diagnosis-description">
                {{ detailSnapshot.description }}
              </div>
            </v-sheet>

            <diagnosis-report
              v-if="detailSnapshot.report"
              :report="detailSnapshot.report"
            />
            <v-alert
              v-else
              type="info"
              variant="tonal"
            >
              {{ t('diagnosis.report.empty') }}
            </v-alert>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="elevated"
            @click="detailDialog = false"
          >
            {{ t('diagnosis.history.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import useGlobalStore from '@store/global'
import diagnosisApi from '@/api/diagnosis'
import {
  applyStatusText,
  formatDateTime,
  mergeApplyResults,
  severityColor,
  statusColor,
} from '@/utils/diagnosis'
import DiagnosisReport from './DiagnosisReport.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()

const locale = computed(() => globalStore.language)

const scopeFilter = ref(undefined)
const statusFilter = ref(undefined)
const page = ref(1)
const pageSize = ref(10)
const rows = ref([])
const total = ref(0)
const loading = ref(false)

const scopeItems = computed(() => [
  { title: t('diagnosis.scope.room'), value: 'room' },
  { title: t('diagnosis.scope.platform'), value: 'platform' },
])

const statusItems = computed(() => [
  { title: t('diagnosis.status.running'), value: 'running' },
  { title: t('diagnosis.status.succeeded'), value: 'succeeded' },
  { title: t('diagnosis.status.failed'), value: 'failed' },
  { title: t('diagnosis.status.canceled'), value: 'canceled' },
  { title: t('diagnosis.status.interrupted'), value: 'interrupted' },
])

const headers = computed(() => [
  { title: t('diagnosis.history.columns.createdAt'), key: 'createdAt' },
  { title: t('diagnosis.history.columns.scope'), key: 'scope' },
  { title: t('diagnosis.history.columns.room'), key: 'roomName' },
  { title: t('diagnosis.history.columns.status'), key: 'status' },
  { title: t('diagnosis.history.columns.severity'), key: 'severity' },
  { title: t('diagnosis.history.columns.summary'), key: 'summary' },
  { title: t('diagnosis.history.columns.description'), key: 'description' },
  { title: t('diagnosis.history.columns.actions'), key: 'appliedCount' },
  { title: t('diagnosis.history.columns.operation'), key: 'actions', sortable: false },
])

let historyToken = 0

const loadHistory = async (options = {}) => {
  const nextPage = options.page ?? page.value
  const nextSize = options.itemsPerPage ?? pageSize.value
  const token = ++historyToken

  page.value = nextPage
  pageSize.value = nextSize
  loading.value = true

  try {
    const params = {
      page: nextPage,
      pageSize: nextSize,
    }

    if (scopeFilter.value) params.scope = scopeFilter.value
    if (statusFilter.value) params.status = statusFilter.value

    const response = await diagnosisApi.history.get(params)

    if (token !== historyToken) return

    rows.value = response.data?.rows || []
    total.value = Number(response.data?.total) || 0
  } catch {
    if (token !== historyToken) return

    rows.value = []
    total.value = 0
  } finally {
    if (token === historyToken) loading.value = false
  }
}

const reload = () => {
  loadHistory({
    page: 1,
    itemsPerPage: pageSize.value,
  })
}

const detailDialog = ref(false)
const detailLoading = ref(false)
const detailError = ref('')
const detailSnapshot = ref(null)
let detailToken = 0

const openDetail = async item => {
  const token = ++detailToken

  detailDialog.value = true
  detailLoading.value = true
  detailError.value = ''
  detailSnapshot.value = null

  try {
    const response = await diagnosisApi.historyDetail.get(item.diagnosisID)

    if (token !== detailToken) return

    detailSnapshot.value = mergeApplyResults(response.data)
  } catch (error) {
    if (token !== detailToken) return

    detailError.value = error?.message || t('diagnosis.history.detailLoadFailed')
  } finally {
    if (token === detailToken) detailLoading.value = false
  }
}
</script>

<style scoped>
.diagnosis-description {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

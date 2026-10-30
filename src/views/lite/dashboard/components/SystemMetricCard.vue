<template>
  <v-card
    class="metric-card dash-card hover-lift h-100"
    variant="flat"
    :style="{ '--metric-soft': soft }"
  >
    <v-card-text class="d-flex flex-column h-100 pa-5">
      <div class="metric-head d-flex align-start justify-space-between ga-3">
        <div class="metric-head-main d-flex align-center ga-3">
          <v-avatar
            :color="accent"
            variant="tonal"
            rounded="lg"
            size="42"
            class="flex-shrink-0"
          >
            <v-icon
              :icon="icon"
              size="22"
            />
          </v-avatar>
          <div class="metric-head-text">
            <div class="text-subtitle-2 font-weight-medium text-truncate">
              {{ title }}
            </div>
            <div class="text-caption text-medium-emphasis text-truncate">
              {{ hint }}
            </div>
          </div>
        </div>
        <v-chip
          :color="statusColor"
          size="x-small"
          variant="tonal"
          class="metric-status font-weight-medium flex-shrink-0"
        >
          {{ status }}
        </v-chip>
      </div>

      <div class="d-flex align-end justify-space-between ga-3 mt-5">
        <div class="metric-value d-flex align-baseline">
          <span>{{ value }}</span>
          <span
            v-if="unit"
            class="metric-unit"
          >{{ unit }}</span>
        </div>
        <span class="text-caption text-medium-emphasis flex-shrink-0">{{ caption }}</span>
      </div>

      <div class="metric-chart mt-auto">
        <v-sparkline
          v-if="history.length > 1"
          :model-value="history"
          :gradient="gradient"
          :color="lineColor"
          :line-width="2.5"
          :height="44"
          :padding="0"
          :min="min"
          :max="max"
          type="trend"
          gradient-direction="top"
          smooth
          auto-draw
          fill
          class="metric-sparkline"
        />
        <div
          v-else
          class="metric-chart-empty"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  statusColor: {
    type: String,
    default: 'success',
  },
  accent: {
    type: String,
    default: 'primary',
  },
  lineColor: {
    type: String,
    default: '#8C57FF',
  },
  gradient: {
    type: Array,
    default: () => [],
  },
  soft: {
    type: String,
    default: 'rgba(140, 87, 255, 0.14)',
  },
  history: {
    type: Array,
    default: () => [],
  },
  min: {
    type: [Number, String],
    default: undefined,
  },
  max: {
    type: [Number, String],
    default: undefined,
  },
})
</script>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 100% 0%, var(--metric-soft) 0%, transparent 62%),
    rgb(var(--v-theme-surface));
}

.metric-card::after {
  position: absolute;
  inset-block-start: -84px;
  inset-inline-end: -72px;
  inline-size: 190px;
  block-size: 190px;
  border: 1px solid var(--metric-soft);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.metric-card :deep(.v-card-text) {
  position: relative;
  z-index: 1;
}

.metric-head-main {
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
}

.metric-head-text {
  min-inline-size: 0;
  overflow: hidden;
}

.metric-status {
  max-inline-size: 45%;
}

.metric-value {
  font-size: 2.05rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1;
}

.metric-unit {
  margin-inline-start: 0.35rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0;
}

.metric-chart {
  position: relative;
  min-block-size: 3.4rem;
  padding-block-start: 0.65rem;
}

.metric-sparkline {
  display: block;
  inline-size: 100%;
  block-size: auto;
  opacity: 0.9;
}

.metric-chart-empty {
  block-size: 44px;
  border-block-end: 1px dashed rgba(var(--v-border-color), calc(var(--v-border-opacity) * 0.9));
}
</style>

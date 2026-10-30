<template>
  <v-card
    class="world-card dash-card hover-lift h-100 d-flex flex-column"
    variant="flat"
    :style="{
      '--world-accent': palette.hex,
      '--world-soft': palette.soft,
    }"
  >
    <v-card-text class="d-flex flex-column flex-grow-1 pa-5 pa-md-6">
      <div class="d-flex align-start justify-space-between ga-3">
        <div class="d-flex align-center ga-3 min-w-0">
          <v-avatar
            :color="palette.color"
            variant="tonal"
            rounded="lg"
            size="46"
            class="flex-shrink-0"
          >
            <v-icon
              :icon="palette.icon"
              size="24"
            />
          </v-avatar>
          <div class="min-w-0">
            <div class="text-subtitle-1 font-weight-semibold text-truncate">
              {{ worldTitle }}
            </div>
            <div class="text-caption text-medium-emphasis text-truncate">
              {{ worldHint }}
            </div>
          </div>
        </div>
        <v-chip
          v-if="loaded"
          :color="roleColor"
          size="x-small"
          variant="tonal"
          class="font-weight-medium flex-shrink-0"
        >
          {{ roleLabel }}
        </v-chip>
      </div>

      <template v-if="loaded && configured">
        <div
          class="world-status"
          :class="running ? 'world-status--running' : 'world-status--stopped'"
        >
          <span
            class="world-status-beacon"
            aria-hidden="true"
          >
            <span class="world-status-dot" />
          </span>
          <div class="min-w-0">
            <div class="world-status-title">
              {{ statusTitle }}
            </div>
            <div class="world-status-hint">
              {{ statusHint }}
            </div>
          </div>
        </div>

        <div class="world-actions">
          <v-btn
            color="success"
            variant="tonal"
            prepend-icon="ri-play-circle-line"
            class="world-action-btn"
            :loading="action === 'start'"
            :disabled="running || busy || !levelDataConfigured"
            @click="handleStart"
          >
            启动世界
          </v-btn>
          <v-btn
            color="error"
            variant="tonal"
            prepend-icon="ri-stop-circle-line"
            class="world-action-btn"
            :loading="action === 'stop'"
            :disabled="!running || busy"
            @click="handleStop"
          >
            关闭世界
          </v-btn>
        </div>
      </template>

      <div
        v-else-if="loaded"
        class="world-empty"
      >
        <span class="world-empty-icon">
          <v-icon
            :icon="palette.icon"
            size="28"
          />
        </span>
        <p class="text-body-2 text-medium-emphasis text-center mb-0">
          该世界还没有配置，配置完成后即可启动。
        </p>
      </div>

      <div
        v-else
        class="world-empty"
      >
        <v-progress-circular
          :color="palette.color"
          indeterminate
          size="24"
          width="2"
        />
        <span class="text-body-2 text-medium-emphasis">加载中</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: value => ['ground', 'cave'].includes(value),
  },
  world: {
    type: Object,
    default: () => ({}),
  },
  loaded: {
    type: Boolean,
    default: false,
  },

  // 当前正在执行的操作：'' | 'start' | 'stop'
  action: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['start', 'stop'])

const palettes = {
  ground: {
    color: 'warning',
    hex: '#FFB400',
    soft: 'rgba(255, 180, 0, 0.13)',
    icon: 'ri-sun-line',
  },
  cave: {
    color: 'info',
    hex: '#16B1FF',
    soft: 'rgba(22, 177, 255, 0.13)',
    icon: 'ri-moon-line',
  },
}

const palette = computed(() => palettes[props.type] || palettes.ground)

// 世界名称与说明直接写死中文
const worldTitle = computed(() => (props.type === 'cave' ? '洞穴世界' : '地面世界'))
const worldHint = computed(() => (props.type === 'cave' ? '地下洞穴区域' : '地表生存区域'))

const configured = computed(() => {
  const world = props.world || {}

  return Boolean(world.id || world.serverPort)
})

const running = computed(() => Boolean(props.world?.status))

const busy = computed(() => Boolean(props.action))

// levelData 为空时世界参数未就绪，不允许启动
const levelDataConfigured = computed(() => Boolean((props.world?.levelData || '').trim()))

const roleLabel = computed(() => {
  if (!configured.value) return '未配置'

  return props.world?.isMaster
    ? '主世界'
    : '从世界'
})

const roleColor = computed(() => {
  if (!configured.value) return 'warning'

  return props.world?.isMaster ? 'primary' : 'secondary'
})

const statusTitle = computed(() => (running.value ? '世界运行中' : '世界未运行'))

const statusHint = computed(() => {
  if (props.action === 'start') return '正在启动世界…'
  if (props.action === 'stop') return '正在关闭世界…'
  if (!levelDataConfigured.value) return '世界参数为空，暂不可启动'

  return running.value
    ? '玩家可以正常进入该世界'
    : '启动后玩家即可进入该世界'
})

const handleStart = () => {
  if (running.value || busy.value || !levelDataConfigured.value) return

  emit('start')
}

const handleStop = () => {
  if (!running.value || busy.value) return

  emit('stop')
}
</script>

<style scoped>
.world-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 100% 0%, var(--world-soft) 0%, transparent 60%),
    rgb(var(--v-theme-surface));
}

.world-card::before {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  block-size: 3px;
  background: linear-gradient(90deg, var(--world-accent), transparent 72%);
  content: '';
  opacity: 0.8;
}

.world-card :deep(.v-card-text) {
  position: relative;
  z-index: 1;
}

.world-status {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-block: 1.6rem 1.4rem;
  padding: 0.95rem 1.1rem;
  border: 1px solid rgba(var(--v-border-color), calc(var(--v-border-opacity) * 0.7));
  border-radius: 14px;
  background: rgba(var(--v-theme-on-surface), 0.025);
}

.world-status--running {
  border-color: rgba(var(--v-theme-success), 0.22);
  background: rgba(var(--v-theme-success), 0.07);
}

.world-status-beacon {
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  inline-size: 38px;
  block-size: 38px;
  border-radius: 50%;
  background: rgba(var(--v-theme-on-surface), 0.06);
  color: rgba(var(--v-theme-on-surface), 0.45);
}

.world-status--running .world-status-beacon {
  background: rgba(var(--v-theme-success), 0.14);
  color: rgb(var(--v-theme-success));
}

.world-status-dot {
  position: relative;
  display: inline-block;
  inline-size: 9px;
  block-size: 9px;
  border-radius: 50%;
  background: currentColor;
}

.world-status--running .world-status-dot::after {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: currentColor;
  content: '';
  animation: status-ring 2s ease-out infinite;
}

.world-status-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
}

.world-status-hint {
  margin-block-start: 0.15rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.75rem;
  line-height: 1.4;
}

.world-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-block-start: auto;
  padding-block-start: 1.1rem;
  border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.world-action-btn {
  font-size: 0.82rem;
}

.world-empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  min-block-size: 190px;
  padding-block: 1.5rem 0.5rem;
}

.world-empty-icon {
  display: grid;
  place-items: center;
  inline-size: 54px;
  block-size: 54px;
  border-radius: 15px;
  background: var(--world-soft);
  color: var(--world-accent);
}

@keyframes status-ring {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }

  80%,
  100% {
    opacity: 0;
    transform: scale(3);
  }
}

@media (max-width: 599px) {
  .world-actions {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .world-status--running .world-status-dot::after {
    animation: none;
  }
}
</style>

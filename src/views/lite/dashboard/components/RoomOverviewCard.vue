<template>
  <v-card
    class="room-card dash-card"
    variant="flat"
  >
    <v-card-text class="pa-5 pa-md-7">
      <template v-if="configured">
        <div class="d-flex flex-wrap align-start ga-4 ga-md-5">
          <span class="room-glyph">
            <v-icon
              icon="ri-gamepad-line"
              size="28"
            />
          </span>

          <div class="room-main flex-grow-1 min-w-0">
            <h2 class="room-name">
              {{ room.gameName }}
            </h2>
            <p class="room-description">
              {{ room.description || '暂无房间描述' }}
            </p>
          </div>

          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="ri-refresh-line"
            class="flex-shrink-0"
            @click="handleUpdate"
          >
            更新游戏
          </v-btn>
        </div>

        <v-divider class="my-5 my-md-6" />

        <div class="room-facts">
          <div class="room-fact">
            <span class="room-fact-icon">
              <v-icon
                icon="ri-group-line"
                size="17"
              />
            </span>
            <div class="min-w-0">
              <div class="room-fact-label">
                玩家数量
              </div>
              <div class="room-fact-value">
                {{ room.maxPlayer || '—' }}
                <span
                  v-if="room.maxPlayer"
                  class="room-fact-unit"
                >人</span>
              </div>
            </div>
          </div>

          <div class="room-fact">
            <span class="room-fact-icon">
              <v-icon
                icon="ri-history-line"
                size="17"
              />
            </span>
            <div class="min-w-0">
              <div class="room-fact-label">
                游戏模式
              </div>
              <div class="room-fact-value">
                {{ modeLabel }}
              </div>
            </div>
          </div>

          <div class="room-fact">
            <span class="room-fact-icon">
              <v-icon
                icon="ri-links-line"
                size="17"
              />
            </span>
            <div class="min-w-0 flex-grow-1">
              <div class="room-fact-label">
                直连地址
              </div>
              <div class="room-fact-value room-fact-value--actions">
                <div
                  v-if="props.address"
                  v-copy="props.address"
                  class="room-fact-value text-info cursor-pointer"
                >
                  点击复制
                </div>
              </div>
            </div>
          </div>

          <div class="room-fact">
            <span class="room-fact-icon">
              <v-icon
                icon="ri-puzzle-2-line"
                size="17"
              />
            </span>
            <div class="min-w-0">
              <div class="room-fact-label">
                模组数量
              </div>
              <div class="room-fact-value">
                {{ modCount === null ? '—' : modCount }}
                <span
                  v-if="modCount !== null"
                  class="room-fact-unit"
                >个</span>
              </div>
            </div>
          </div>

          <div class="room-fact">
            <span class="room-fact-icon">
              <v-icon
                icon="ri-chat-poll-line"
                size="17"
              />
            </span>
            <div class="min-w-0">
              <div class="room-fact-label">
                玩家投票
              </div>
              <div class="room-fact-value">
                {{ room.vote ? '开启' : '关闭' }}
              </div>
            </div>
          </div>

          <div class="room-fact">
            <span class="room-fact-icon">
              <v-icon
                icon="ri-pause-circle-line"
                size="17"
              />
            </span>
            <div class="min-w-0">
              <div class="room-fact-label">
                自动暂停
              </div>
              <div class="room-fact-value">
                {{ room.pauseEmpty ? '开启' : '关闭' }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-else-if="loaded"
        class="room-empty"
      >
        <span class="room-glyph room-glyph--muted">
          <v-icon
            icon="ri-gamepad-line"
            size="28"
          />
        </span>
        <div class="flex-grow-1 min-w-0">
          <div class="text-subtitle-1 font-weight-medium">
            尚未配置房间
          </div>
          <p class="text-body-2 text-medium-emphasis mt-1 mb-0">
            前往房间配置，填写开服所需的信息。
          </p>
        </div>
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="ri-settings-3-line"
          to="/room"
        >
          去配置
        </v-btn>
      </div>

      <div
        v-else
        class="room-empty room-empty--loading"
      >
        <v-progress-circular
          color="primary"
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
  room: {
    type: Object,
    default: () => ({}),
  },
  address: {
    type: String,
    default: '-',
  },
  loaded: {
    type: Boolean,
    default: false,
  },

  // null 表示尚未取到模组数据，显示「—」
  modCount: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['refresh', 'update'])

// 游戏模式直接写死中文，不再走 i18n
const modeLabels = {
  survival: '生存',
  endless: '无尽',
  wilderness: '荒野',
  relaxed: '轻松',
  lightsOut: '暗无天日',
  lavaarena: '熔炉',
  quagmire: '暴食',
  custom: '自定义',
}

const configured = computed(() => Boolean(props.room?.gameName))

const modeLabel = computed(() => {
  const mode = props.room?.gameMode

  return mode ? modeLabels[mode] || mode : ''
})

const clusterKeyVisible = ref(false)

const clusterKeyDisplay = computed(() => {
  if (!props.room?.clusterKey) return '—'

  return clusterKeyVisible.value ? props.room.clusterKey : '•'.repeat(12)
})

const handleUpdate = () => {
  emit('update')
}

const handleRefresh = () => {
  emit('refresh')
}
</script>

<style scoped>
.room-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 100% 0%, rgba(var(--v-theme-primary), 0.11) 0%, transparent 36rem),
    rgb(var(--v-theme-surface));
}

.room-card :deep(.v-card-text) {
  position: relative;
  z-index: 1;
}

.room-main {
  flex: 1 1 14rem;
}

.room-glyph {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  inline-size: 56px;
  block-size: 56px;
  border: 1px solid rgba(var(--v-theme-primary), 0.14);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.18), rgba(var(--v-theme-primary), 0.06));
  color: rgb(var(--v-theme-primary));
}

.room-glyph--muted {
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-on-surface), 0.03);
  color: rgba(var(--v-theme-on-surface), 0.45);
}

.room-name {
  margin-block: 0.3rem 0.35rem;
  font-size: clamp(1.55rem, 2.4vw, 2.1rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.room-description {
  max-inline-size: 62rem;
  margin: 0;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

.room-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.15rem 2rem;
}

.room-fact {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  min-inline-size: 0;
}

.room-fact-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  inline-size: 30px;
  block-size: 30px;
  border-radius: 9px;
  background: rgba(var(--v-theme-on-surface), 0.045);
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.room-fact-label {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

.room-fact-value {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  min-block-size: 1.45rem;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  line-height: 1.35;
}

.room-fact-value--actions {
  gap: 0.15rem;
}

.room-fact-unit {
  margin-inline-start: 0.2rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.72rem;
  font-weight: 400;
}

.fact-action {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.fact-action:hover {
  opacity: 1;
}

.room-empty {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  min-block-size: 116px;
}

.room-empty--loading {
  justify-content: center;
  min-block-size: 96px;
}

@media (max-width: 1279px) {
  .room-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .room-glyph {
    inline-size: 48px;
    block-size: 48px;
    border-radius: 14px;
  }

  .room-name {
    font-size: 1.5rem;
  }

  .room-description {
    font-size: 0.8125rem;
  }

  .room-edit {
    inline-size: 100%;
  }

  .room-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.95rem 1rem;
  }

  .room-fact-icon {
    display: none;
  }
}
</style>

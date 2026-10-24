<template>
  <check
    :category="['game', 'room']"
    :other-height="otherHeight"
  >
    <v-card class="map-page">
      <div class="map-page__header">
        <div class="map-page__header-main">
          <span class="text-h6">
            {{ t('tools.map.title') }}
          </span>
          <v-select
            :model-value="selectedWorldID"
            :items="worlds"
            item-title="worldName"
            item-value="id"
            :label="t('tools.map.world')"
            density="compact"
            hide-details
            class="map-page__world-select"
            @update:model-value="selectWorld"
          />
          <v-btn
            :loading="loading"
            prepend-icon="ri-refresh-line"
            variant="tonal"
            color="primary"
            @click="loadMap"
          >
            {{ t('tools.map.refresh') }}
          </v-btn>
          <v-switch
            v-model="overlays.players"
            color="primary"
            density="compact"
            hide-details
            :label="t('tools.map.overlays.players')"
          />
          <v-switch
            v-model="autoRefreshPlayers"
            color="primary"
            density="compact"
            hide-details
            :disabled="!overlays.players"
            :label="t('tools.map.autoRefreshPlayers')"
          />
        </div>
        <div
          v-if="mapData"
          class="map-page__header-meta"
        >
          <v-chip
            size="small"
            variant="tonal"
            color="info"
            prepend-icon="ri-save-3-line"
          >
            {{ mapData.payload.saveName }}
          </v-chip>
          <v-chip
            v-if="mapData.payload.gameBuild"
            size="small"
            variant="tonal"
            prepend-icon="ri-gamepad-line"
          >
            {{ t('tools.map.gameBuild') }} {{ mapData.payload.gameBuild }}
          </v-chip>
          <v-chip
            size="small"
            variant="tonal"
            prepend-icon="ri-time-line"
          >
            {{ t('tools.map.generatedAt') }} {{ relativeTime(mapData.payload.generatedAt, lang) }}
          </v-chip>
          <v-chip
            v-if="mapData.payload.saveModTime"
            size="small"
            variant="tonal"
            prepend-icon="ri-history-line"
          >
            {{ t('tools.map.saveModTime') }} {{ formatTime(mapData.payload.saveModTime) }}
          </v-chip>
        </div>
      </div>

      <v-divider />

      <div class="map-page__body">
        <div
          class="map-page__stage"
          :style="{ height: `${stageHeight}px` }"
        >
          <template v-if="mapData">
            <world-map-canvas
              ref="canvasRef"
              :map="mapData"
              :players="players"
              :players-stale="playersStale"
              :visible-layers="visibleLayers"
              :overlays="overlays"
              :flash="flash"
              @camera="onCameraChange"
              @cursor="cursor = $event"
            />

            <div class="map-hud map-hud--top-left">
              <div class="map-hud__title">
                {{ mapData.payload.worldName }}
              </div>
              <div class="map-hud__sub">
                {{ worldClockText }}
              </div>
            </div>

            <div class="map-hud map-hud--top-right">
              <div class="map-players">
                <div class="map-players__head">
                  <span>{{ t('tools.map.onlinePlayers') }}</span>
                  <v-chip
                    size="x-small"
                    :color="playersMeta.worldRunning ? 'success' : 'default'"
                    variant="flat"
                  >
                    {{ players.length }}
                  </v-chip>
                  <v-btn
                    icon="ri-refresh-line"
                    size="x-small"
                    variant="text"
                    :loading="refreshingPlayers"
                    :title="t('tools.map.refreshPlayers')"
                    @click="refreshPlayers({ manual: true })"
                  />
                </div>
                <div class="map-players__status">
                  {{ playersStatusText }}
                </div>
                <div
                  v-if="players.length"
                  class="map-players__list"
                >
                  <button
                    v-for="player in players"
                    :key="player.uid"
                    type="button"
                    class="map-players__row"
                    :title="getDstRoleName(player.prefab, lang)"
                    @click="focusWorldPoint(player.x, player.z, 18)"
                  >
                    <img
                      class="map-players__avatar"
                      :src="playerImageUrl(player.prefab)"
                      alt=""
                    >
                    <span class="map-players__name">{{ player.name || player.uid }}</span>
                    <span class="map-players__coord">{{ Math.round(player.x) }}, {{ Math.round(player.z) }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="map-hud map-hud--bottom-left">
              <span v-if="cursor">X {{ Math.round(cursor.x) }} · Z {{ Math.round(cursor.z) }}</span>
              <span v-else>{{ t('tools.map.cursorHint') }}</span>
              <span class="map-hud__sep">|</span>
              <span>{{ cameraState.zoom.toFixed(1) }} {{ t('tools.map.pxPerTile') }}</span>
            </div>

            <div class="map-hud map-hud--bottom-right">
              <v-btn
                icon="ri-add-line"
                size="small"
                variant="tonal"
                :title="t('tools.map.zoomIn')"
                @click="zoomBy(1.25)"
              />
              <v-btn
                icon="ri-subtract-line"
                size="small"
                variant="tonal"
                :title="t('tools.map.zoomOut')"
                @click="zoomBy(0.8)"
              />
              <v-btn
                icon="ri-anticlockwise-line"
                size="small"
                variant="tonal"
                :title="t('tools.map.rotateLeft')"
                @click="rotateBy(-Math.PI / 2)"
              />
              <v-btn
                icon="ri-clockwise-line"
                size="small"
                variant="tonal"
                :title="t('tools.map.rotateRight')"
                @click="rotateBy(Math.PI / 2)"
              />
              <v-btn
                icon="ri-focus-3-line"
                size="small"
                variant="tonal"
                :title="t('tools.map.fit')"
                @click="fit()"
              />
              <v-btn
                icon="ri-download-2-line"
                size="small"
                variant="tonal"
                :title="t('tools.map.exportPng')"
                @click="exportPng"
              />
            </div>
          </template>

          <div
            v-else-if="loading"
            class="map-page__placeholder"
          >
            <v-progress-circular
              indeterminate
              color="primary"
              size="42"
            />
            <span>{{ t('tools.map.fetch') }}</span>
          </div>

          <div
            v-else
            class="map-page__placeholder"
          >
            <v-icon
              size="42"
              color="warning"
            >
              ri-error-warning-line
            </v-icon>
            <span class="map-page__placeholder-title">
              {{ loadError || t('tools.map.empty') }}
            </span>
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="ri-refresh-line"
              @click="loadMap"
            >
              {{ t('tools.map.retry') }}
            </v-btn>
          </div>
        </div>

        <aside class="map-page__sidebar">
          <v-text-field
            v-model="searchQuery"
            density="compact"
            hide-details
            clearable
            prepend-inner-icon="ri-search-line"
            :placeholder="t('tools.map.searchPlaceholder')"
            class="map-page__search"
          />
          <div
            v-if="searchKeyword"
            class="map-search-results"
          >
            <div
              v-if="searchResults.length === 0"
              class="map-search-results__empty"
            >
              {{ t('tools.map.noMatch') }}
            </div>
            <button
              v-for="row in searchResults"
              :key="row.prefabIndex"
              type="button"
              class="map-search-results__row"
              @click="focusPrefab(row.prefabIndex)"
            >
              <span class="map-search-results__name">{{ row.label }}</span>
              <span class="map-search-results__count">{{ formatNumber(row.count) }}</span>
            </button>
          </div>

          <v-expansion-panels
            v-if="mapData"
            v-model="openPanels"
            multiple
            variant="accordion"
          >
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.layers') }}</span>
                  <span class="map-panel-title__hint">{{ formatNumber(objectCount) }} {{ t('tools.map.objects') }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  class="layer-composition"
                  :title="t('tools.map.layerComposition')"
                >
                  <span
                    v-for="part in layerParts"
                    :key="part.key"
                    class="layer-composition__slice"
                    :style="{ flexGrow: Math.max(part.share, 0.004), background: part.color }"
                  />
                </div>

                <div
                  v-for="layer in layers"
                  :key="layer"
                  class="layer-row"
                >
                  <v-checkbox
                    v-model="visibleLayers"
                    :value="layer"
                    density="compact"
                    hide-details
                    color="primary"
                  />
                  <span
                    class="layer-row__dot"
                    :style="{ background: layerColor(layer) }"
                  />
                  <span class="layer-row__name">{{ t(`tools.map.layers.${layer}`) }}</span>
                  <span class="layer-row__count">{{ formatNumber(layerCounts[layer]) }}</span>
                </div>

                <v-divider class="my-2" />

                <div
                  v-for="item in overlayRows"
                  :key="item.key"
                  class="layer-row"
                >
                  <v-checkbox
                    v-model="overlays[item.key]"
                    density="compact"
                    hide-details
                    color="primary"
                  />
                  <span
                    class="layer-row__dot"
                    :style="{ background: item.color }"
                  />
                  <span class="layer-row__name">{{ t(`tools.map.overlays.${item.key}`) }}</span>
                  <span class="layer-row__count">{{ item.count }}</span>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.world') }}</span>
                  <span class="map-panel-title__hint">{{ worldClockText }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="world-progress">
                  <div class="world-progress__head">
                    <span>{{ t('tools.map.seasonProgress') }}</span>
                    <span>{{ t('tools.map.dayOfSeason', { day: clock.dayInSeason, total: seasonTotalDays }) }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="seasonProgressPercent"
                    height="6"
                    rounded
                    color="success"
                  />
                </div>

                <dl class="world-facts">
                  <div>
                    <dt>{{ t('tools.map.cycle') }}</dt>
                    <dd>{{ formatNumber(clock.cycles) }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('tools.map.season') }}</dt>
                    <dd>{{ seasonLabel(clock.season) }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('tools.map.phase') }}</dt>
                    <dd>{{ phaseLabel(clock.phase) }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('tools.map.temperature') }}</dt>
                    <dd>{{ worldTemperature }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('tools.map.timeOfDay') }}</dt>
                    <dd>{{ world.isDay ? t('tools.map.daytime') : t('tools.map.night') }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('tools.map.seasonDays') }}</dt>
                    <dd>{{ world.seasonDaysGone }} / {{ world.seasonDaysGone + world.seasonDaysLeft }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('tools.map.tileKinds') }}</dt>
                    <dd>{{ mapData.payload.tileSpecs.length }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('tools.map.objectCount') }}</dt>
                    <dd>{{ formatNumber(objectCount) }}</dd>
                  </div>
                </dl>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.players') }}</span>
                  <span class="map-panel-title__hint">{{ players.length }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="players-status">
                  <v-chip
                    size="x-small"
                    :color="playersMeta.worldRunning ? 'success' : 'default'"
                    variant="tonal"
                  >
                    {{ playersMeta.worldRunning ? t('tools.map.worldRunning') : t('tools.map.worldStopped') }}
                  </v-chip>
                  <span>{{ playersStatusText }}</span>
                  <v-btn
                    size="x-small"
                    variant="text"
                    prepend-icon="ri-refresh-line"
                    :loading="refreshingPlayers"
                    @click="refreshPlayers({ manual: true })"
                  >
                    {{ t('tools.map.refreshPlayers') }}
                  </v-btn>
                </div>

                <v-alert
                  v-if="playersMeta.error"
                  type="warning"
                  density="compact"
                  variant="tonal"
                  class="my-2"
                >
                  {{ playersMeta.error }}
                </v-alert>

                <div
                  v-if="players.length === 0"
                  class="map-empty-hint"
                >
                  {{ playersMeta.worldRunning ? t('tools.map.noPlayers') : t('tools.map.worldStoppedHint') }}
                </div>

                <button
                  v-for="player in players"
                  :key="player.uid"
                  type="button"
                  class="player-row"
                  @click="focusWorldPoint(player.x, player.z, 18)"
                >
                  <img
                    class="player-row__avatar"
                    :src="playerImageUrl(player.prefab)"
                    alt=""
                  >
                  <span class="player-row__name">{{ player.name || player.uid }}</span>
                  <span class="player-row__prefab">{{ getDstRoleName(player.prefab, lang) }}</span>
                  <span class="player-row__coord">{{ Math.round(player.x) }}, {{ Math.round(player.z) }}</span>
                </button>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.resources') }}</span>
                  <span class="map-panel-title__hint">{{ t('tools.map.byCount') }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  v-if="resources.length === 0"
                  class="map-empty-hint"
                >
                  {{ t('tools.map.noObjects') }}
                </div>
                <button
                  v-for="row in resources"
                  :key="row.name"
                  type="button"
                  class="rank-row"
                  @click="focusPrefab(row.prefabIndex)"
                >
                  <span
                    class="rank-row__dot"
                    :style="{ background: layerColor(row.layer) }"
                  />
                  <span class="rank-row__name">
                    {{ lang === 'en' ? (row.en || row.name) : row.zh }}
                  </span>
                  <span class="rank-row__count">{{ formatNumber(row.count) }}</span>
                </button>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.terrain') }}</span>
                  <span class="map-panel-title__hint">{{ terrain.kinds }} {{ t('tools.map.kinds') }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  v-for="row in terrain.rows"
                  :key="row.tileId"
                  class="terrain-row"
                >
                  <span
                    class="terrain-row__dot"
                    :style="{ background: row.color }"
                  />
                  <span class="terrain-row__name">{{ row.label }}</span>
                  <span class="terrain-row__track">
                    <span
                      class="terrain-row__fill"
                      :style="{ width: `${(row.share * 100).toFixed(1)}%`, background: row.color }"
                    />
                  </span>
                  <span class="terrain-row__value">{{ (row.share * 100).toFixed(1) }}%</span>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.landmarks') }}</span>
                  <span class="map-panel-title__hint">{{ landmarks.length }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  v-if="landmarks.length === 0"
                  class="map-empty-hint"
                >
                  {{ t('tools.map.noLandmarks') }}
                </div>
                <div class="map-list">
                  <button
                    v-for="row in landmarks.slice(0, 60)"
                    :key="row.objectIndex"
                    type="button"
                    class="map-list__row"
                    @click="focusWorldPoint(row.x, row.z, 14)"
                  >
                    <span class="map-list__name">{{ row.label }}</span>
                    <span class="map-list__coord">{{ Math.round(row.x) }}, {{ Math.round(row.z) }}</span>
                  </button>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.signs') }}</span>
                  <span class="map-panel-title__hint">{{ mapData.labels.length }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  v-if="mapData.labels.length === 0"
                  class="map-empty-hint"
                >
                  {{ t('tools.map.noSigns') }}
                </div>
                <div class="map-list">
                  <button
                    v-for="(label, index) in mapData.labels.slice(0, 60)"
                    :key="`${label.x}-${label.z}-${index}`"
                    type="button"
                    class="map-list__row"
                    :title="label.text"
                    @click="focusWorldPoint(label.x, label.z, 14)"
                  >
                    <span class="map-list__name">{{ label.text }}</span>
                    <span class="map-list__coord">{{ Math.round(label.x) }}, {{ Math.round(label.z) }}</span>
                  </button>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="map-panel-title">
                  <span>{{ t('tools.map.panels.skeletons') }}</span>
                  <span class="map-panel-title__hint">{{ mapData.skeletons.length }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  v-if="mapData.skeletons.length === 0"
                  class="map-empty-hint"
                >
                  {{ t('tools.map.noSkeletons') }}
                </div>
                <div class="map-list">
                  <button
                    v-for="(skeleton, index) in mapData.skeletons.slice(0, 40)"
                    :key="`${skeleton.x}-${skeleton.z}-${index}`"
                    type="button"
                    class="map-list__row"
                    @click="focusWorldPoint(Number(skeleton.x), Number(skeleton.z), 14)"
                  >
                    <span class="map-list__name">{{ skeleton.name || t('tools.map.skeleton') }}</span>
                    <span class="map-list__coord">{{ Math.round(Number(skeleton.x)) }}, {{ Math.round(Number(skeleton.z)) }}</span>
                  </button>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </aside>
      </div>
    </v-card>
  </check>
</template>

<script setup>
import roomApi from '@/api/room.js'
import toolsApi from '@/api/tools.js'
import useGlobalStore from '@store/global.js'
import { useDisplay } from 'vuetify/framework'
import { useI18n } from 'vue-i18n'
import { getDstRoleName } from '@/utils/tools.js'
import {
  MAP_LABEL_RULES,
  decodeWorldMap,
  isImportantLabelPrefab,
  layerColor,
  listLandmarks,
  orderedLayers,
  rankResources,
  rankTerrain,
  relativeTime,
  searchPrefabs,
} from './world-map/worldMap.js'
import { playerImageUrl } from './world-map/worldMapImages.js'
import WorldMapCanvas from './world-map/WorldMapCanvas.vue'

/**
 * 世界地图页。
 *
 * 数据来自后端 GET /tools/map（实时解析存档，返回完整地形与物体），在线玩家
 * 由 GET /tools/map/players 单独刷新：打开页面时探测一次，之后按 5 秒轮询，
 * 页面隐藏时暂停，避免持续向游戏控制台发命令。
 */

const globalStore = useGlobalStore()
const { t, locale } = useI18n()
const { mobile } = useDisplay()
const { height: windowHeight } = useWindowSize()

const otherHeight = 210
const loading = ref(false)
const loadError = ref('')
const refreshingPlayers = ref(false)

// 解码结果里有 Canvas / TypedArray，必须用浅层 ref 保存：深层响应式代理会让
// canvas 的 drawImage 失去正确的 this，也会拖慢逐帧读取格阵。
const mapData = shallowRef(null)
const cameraState = reactive({ zoom: 6, rotation: 0 })
const cursor = ref(null)
const canvasRef = ref()
const worlds = ref([])
const selectedWorldID = ref()
const autoRefreshPlayers = ref(true)
const openPanels = ref([0, 2])

const visibleLayers = ref([])

const overlays = reactive({
  wormholes: true,
  labels: true,
  signs: true,
  skeletons: true,
  players: true,
})

const players = ref([])

const playersMeta = reactive({
  probedAt: '',
  worldRunning: false,
  error: '',
})

const searchQuery = ref('')
const flash = ref({ prefabIndex: -1, token: 0 })

let pollTimer = null
let probing = false
let disposed = false
let loadToken = 0

const lang = computed(() => (locale.value === 'en' ? 'en' : 'zh'))

const stageHeight = computed(() => {
  const reserved = mobile.value ? 420 : 220

  return Math.max(360, (windowHeight.value - reserved))
})

const payload = computed(() => mapData.value?.payload || {})
const clock = computed(() => payload.value.clock || {})
const world = computed(() => payload.value.world || {})
const objectCount = computed(() => payload.value.objectCount || 0)
const layerCounts = computed(() => payload.value.layerCounts || {})

const playersStale = computed(() => Boolean(playersMeta.error) && players.value.length > 0)

const seasonTotalDays = computed(() => {
  const days = Number(clock.value.daysInSeason) || 0
  const gone = Number(clock.value.dayInSeason) || 0

  return days > 0 ? days : Math.max(gone + (Number(world.value.seasonDaysLeft) || 0), gone)
})

const seasonProgressPercent = computed(() => {
  const total = seasonTotalDays.value

  if (!total) {
    return 0
  }

  return Math.min(100, Math.max(0, ((Number(clock.value.dayInSeason) || 0) / total) * 100))
})

const worldTemperature = computed(() => {
  const value = Number(world.value.temperature)

  return Number.isFinite(value) ? `${value.toFixed(1)}°` : '—'
})

const worldClockText = computed(() => {
  if (!mapData.value) {
    return ''
  }

  const parts = [
    seasonLabel(clock.value.season),
    phaseLabel(clock.value.phase),
    `${t('tools.map.cycle')} ${formatNumber(clock.value.cycles || 0)}`,
  ].filter(Boolean)

  return parts.join(' · ')
})

const layers = computed(() => orderedLayers(layerCounts.value))

const layerParts = computed(() => {
  const total = Math.max(1, objectCount.value)

  return layers.value.map(layer => ({
    key: layer,
    label: t(`tools.map.layers.${layer}`),
    share: (layerCounts.value[layer] || 0) / total,
    color: layerColor(layer),
  }))
})

const overlayRows = computed(() => {
  const data = mapData.value

  return [
    {
      key: 'wormholes',
      color: '#4dd0e1',
      count: data ? data.wormholes.length : 0,
    },
    {
      key: 'labels',
      color: '#64b5f6',
      count: data ? labelObjectCount.value : 0,
    },
    {
      key: 'signs',
      color: '#f06292',
      count: data ? data.labels.length : 0,
    },
    {
      key: 'skeletons',
      color: '#b0bec5',
      count: data ? data.skeletons.length : 0,
    },
    {
      key: 'players',
      color: '#38bdf8',
      count: overlays.players ? players.value.length : 0,
    },
  ]
})

const resources = computed(() => (mapData.value ? rankResources(mapData.value, 14) : []))

const terrain = computed(() => (mapData.value
  ? rankTerrain(mapData.value, lang.value, 10)
  : { rows: [], kinds: 0, totalTiles: 0 }))

const landmarks = computed(() => (mapData.value ? listLandmarks(mapData.value, lang.value) : []))

/** 会被标注名称的物体数量（地标 + 有人工名的重要建筑/巢穴）。 */
const labelObjectCount = computed(() => {
  if (!mapData.value) {
    return 0
  }

  const map = mapData.value
  let count = 0

  for (let index = 0; index < map.prefabs.length; index++) {
    const prefab = map.prefabs[index]
    const rule = MAP_LABEL_RULES.find(item => item.layer === prefab.layer)

    if (!rule) {
      continue
    }
    if (rule.namedOnly && !prefab.zh && !prefab.en) {
      continue
    }
    if (!isImportantLabelPrefab(prefab)) {
      continue
    }

    count += map.index.countByPrefab[index] || 0
  }

  return count
})

// clearable 的 v-text-field 点击清除按钮后会把 model 置为 null，这里统一兜底成字符串。
const searchKeyword = computed(() => (searchQuery.value || '').trim())

const searchResults = computed(() => {
  if (!mapData.value || !searchKeyword.value) {
    return []
  }

  return searchPrefabs(mapData.value, searchKeyword.value, lang.value).slice(0, 20)
})

const playersStatusText = computed(() => {
  if (playersMeta.error && players.value.length > 0) {
    return t('tools.map.playersStale', { time: relativeTime(playersMeta.probedAt, lang.value) })
  }
  if (playersMeta.error) {
    return t('tools.map.playersFailed')
  }
  if (!playersMeta.probedAt) {
    return t('tools.map.playersNever')
  }
  if (!playersMeta.worldRunning) {
    return t('tools.map.worldStoppedHint')
  }

  return t('tools.map.playersUpdated', { time: relativeTime(playersMeta.probedAt, lang.value) })
})

function formatNumber(value) {
  const number = Number(value) || 0

  return number.toLocaleString(lang.value === 'en' ? 'en-US' : 'zh-CN')
}

function formatTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) {
    return '—'
  }

  return date.toLocaleString(lang.value === 'en' ? 'en-US' : 'zh-CN', { hour12: false })
}

function seasonLabel(key) {
  if (!key) {
    return ''
  }
  if (['spring', 'summer', 'autumn', 'winter'].includes(key)) {
    return t(`tools.map.seasons.${key}`)
  }

  return key
}

function phaseLabel(key) {
  if (!key) {
    return ''
  }
  if (['day', 'dusk', 'night'].includes(key)) {
    return t(`tools.map.phases.${key}`)
  }

  return key
}

function applyPlayers(data) {
  if (!data) {
    players.value = []
    playersMeta.probedAt = ''
    playersMeta.worldRunning = false
    playersMeta.error = ''

    return
  }

  players.value = (data.list || []).filter(player => Number.isFinite(Number(player.x)) && Number.isFinite(Number(player.z)))
  playersMeta.probedAt = data.probedAt || ''
  playersMeta.worldRunning = Boolean(data.worldRunning)
  playersMeta.error = data.error || ''
}

async function getWorlds() {
  const response = await roomApi.worlds.get({ roomID: globalStore.room.id })

  worlds.value = response.data || []
  selectedWorldID.value = worlds.value[0]?.id || 0
}

function selectWorld(value) {
  if (value === selectedWorldID.value) {
    return
  }

  selectedWorldID.value = value
  loadMap()
}

async function loadMap() {
  if (!selectedWorldID.value) {
    return
  }

  const token = ++loadToken

  loading.value = true
  loadError.value = ''
  stopPlayerPoll()

  try {
    const response = await toolsApi.map.get({
      roomID: globalStore.room.id,
      worldID: selectedWorldID.value,
      players: 1,
    })

    const decoded = await decodeWorldMap(response.data)

    if (disposed || token !== loadToken) {
      return
    }

    mapData.value = decoded

    // 刷新时保留用户已勾选的图层，只丢弃新地图里不存在的那些。
    const available = layers.value.length > 0
      ? [...layers.value]
      : [...new Set(decoded.prefabs.map(prefab => prefab.layer))]

    const kept = visibleLayers.value.filter(layer => available.includes(layer))

    visibleLayers.value = kept.length > 0 ? kept : available
    applyPlayers(response.data.players)
    nextTick(() => startPlayerPoll())
  } catch (error) {
    if (disposed || token !== loadToken) {
      return
    }

    mapData.value = null
    loadError.value = typeof error === 'string' ? error : (error?.message || t('tools.map.loadFail'))
    applyPlayers(null)
  } finally {
    if (!disposed && token === loadToken) {
      loading.value = false
    }
  }
}

async function refreshPlayers({ manual = false } = {}) {
  if (!selectedWorldID.value || probing) {
    return
  }
  if (!manual && document.visibilityState !== 'visible') {
    return
  }

  probing = true
  refreshingPlayers.value = manual

  try {
    const response = await toolsApi.map.players.get({
      roomID: globalStore.room.id,
      worldID: selectedWorldID.value,
    })

    if (!disposed) {
      applyPlayers(response.data)
    }
  } catch (error) {
    if (!disposed) {
      // 探测失败保留上一次位置，只标记为过期，不清空玩家层。
      playersMeta.error = typeof error === 'string' ? error : t('tools.map.playersFailed')
    }
  } finally {
    probing = false
    if (!disposed) {
      refreshingPlayers.value = false
    }
  }
}

function startPlayerPoll() {
  stopPlayerPoll()

  if (!autoRefreshPlayers.value || !overlays.players || !playersMeta.worldRunning) {
    return
  }

  pollTimer = setInterval(() => {
    if (document.visibilityState === 'visible') {
      refreshPlayers()
    }
  }, 5000)
}

function stopPlayerPoll() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function onVisibilityChange() {
  if (document.visibilityState !== 'visible') {
    return
  }
  if (autoRefreshPlayers.value && overlays.players && playersMeta.worldRunning) {
    refreshPlayers()
  }
}

function onCameraChange(camera) {
  cameraState.zoom = camera.zoom
  cameraState.rotation = camera.rotation
}

function zoomBy(factor) {
  canvasRef.value?.zoomBy(factor)
}

function rotateBy(delta) {
  canvasRef.value?.rotateBy(delta)
}

function fit() {
  canvasRef.value?.fit()
}

function focusWorldPoint(x, z, zoom = 0) {
  canvasRef.value?.focusWorld(Number(x), Number(z), zoom)
}

function focusPrefab(prefabIndex) {
  const first = mapData.value?.index.firstByPrefab[prefabIndex] ?? -1

  if (first < 0) {
    return
  }

  const x = mapData.value.objects.x[first]
  const z = mapData.value.objects.z[first]

  focusWorldPoint(x, z, 14)
  flash.value = { prefabIndex, token: flash.value.token + 1 }
}

function exportPng() {
  const canvas = canvasRef.value?.getCanvas()

  if (!canvas) {
    return
  }

  canvas.toBlob(blob => {
    if (!blob) {
      return
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${payload.value.worldName || 'world'}-${payload.value.saveName || 'map'}.png`
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

watch([autoRefreshPlayers, () => overlays.players, () => playersMeta.worldRunning], () => {
  startPlayerPoll()
})

onMounted(async () => {
  document.addEventListener('visibilitychange', onVisibilityChange)

  // 未选择房间时 check 组件会给出引导页，不必再去请求世界列表。
  if (!globalStore.room.id) {
    return
  }

  await getWorlds()
  await loadMap()
})

onUnmounted(() => {
  disposed = true
  stopPlayerPoll()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<style scoped>
.map-page {
  overflow: hidden;
}

.map-page__header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
}

.map-page__header-main {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  align-items: center;
}

.map-page__world-select {
  min-width: 180px;
  max-width: 220px;
}

.map-page__header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.map-page__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 16px;
  padding: 16px;
  align-items: start;
}

.map-page__stage {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: #0b0f15;
  min-height: 360px;
}

.map-page__placeholder {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 24px;
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
}

.map-page__placeholder-title {
  max-width: 480px;
  font-size: 14px;
  line-height: 1.6;
}

.map-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.map-page__search {
  flex: 0 0 auto;
}

.map-search-results {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 200px;
  padding: 6px;
  overflow-y: auto;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
}

.map-search-results__empty {
  padding: 6px 8px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 12px;
}

.map-search-results__row,
.rank-row,
.map-list__row,
.player-row {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 5px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
}

.map-search-results__row:hover,
.rank-row:hover,
.map-list__row:hover,
.player-row:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.map-search-results__name,
.rank-row__name,
.map-list__name,
.player-row__name {
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.map-search-results__count,
.rank-row__count,
.map-list__coord,
.player-row__coord {
  flex: 0 0 auto;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-variant-numeric: tabular-nums;
  font-size: 11.5px;
}

.map-panel-title {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.map-panel-title__hint {
  color: rgba(var(--v-theme-on-surface), 0.56);
  font-weight: 400;
  font-size: 11.5px;
}

.layer-composition {
  display: flex;
  width: 100%;
  height: 8px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 999px;
}

.layer-composition__slice {
  display: block;
  min-width: 2px;
  height: 100%;
}

.layer-row {
  display: flex;
  gap: 4px;
  align-items: center;
  min-height: 34px;
}

.layer-row :deep(.v-checkbox) {
  flex: 0 0 auto;
}

.layer-row__dot {
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  margin-right: 2px;
  border-radius: 50%;
}

.layer-row__name {
  flex: 1 1 auto;
  font-size: 12.5px;
}

.layer-row__count {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}

.world-progress {
  margin-bottom: 10px;
}

.world-progress__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  color: rgba(var(--v-theme-on-surface), 0.66);
  font-size: 12px;
}

.world-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 14px;
  margin: 0;
}

.world-facts div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(var(--v-border-color), 0.4);
}

.world-facts dt {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 11.5px;
}

.world-facts dd {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.92);
  font-size: 12.5px;
}

.players-status {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
  color: rgba(var(--v-theme-on-surface), 0.66);
  font-size: 11.5px;
}

.player-row__avatar {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  object-fit: cover;
}

.player-row__prefab {
  flex: 0 0 auto;
  max-width: 92px;
  overflow: hidden;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rank-row__dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.terrain-row {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 2px 0;
  font-size: 11.5px;
}

.terrain-row__dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.terrain-row__name {
  flex: 0 0 76px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.terrain-row__track {
  flex: 1 1 auto;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(var(--v-border-color), 0.4);
}

.terrain-row__fill {
  display: block;
  height: 100%;
}

.terrain-row__value {
  flex: 0 0 44px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.map-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 240px;
  overflow-y: auto;
}

.map-empty-hint {
  padding: 4px 2px;
  color: rgba(var(--v-theme-on-surface), 0.55);
  font-size: 12px;
}

.map-hud {
  position: absolute;
  z-index: 4;
  display: flex;
  gap: 8px;
  align-items: center;
  color: rgba(255, 255, 255, 0.86);
  font-size: 11.5px;
  pointer-events: none;
}

.map-hud--top-left {
  top: 12px;
  left: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(8, 13, 20, 0.68);
  backdrop-filter: blur(4px);
}

.map-hud__title {
  font-weight: 600;
  font-size: 13px;
}

.map-hud__sub {
  color: rgba(203, 213, 225, 0.85);
  font-size: 11.5px;
}

.map-hud--top-right {
  top: 12px;
  right: 12px;
  pointer-events: auto;
}

.map-players {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 210px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(8, 13, 20, 0.78);
  backdrop-filter: blur(4px);
}

.map-players__head {
  display: flex;
  gap: 6px;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
}

.map-players__head > span:first-child {
  flex: 1 1 auto;
}

.map-players__status {
  color: rgba(203, 213, 225, 0.72);
  font-size: 11px;
}

.map-players__list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 150px;
  overflow-y: auto;
}

.map-players__row {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 2px 4px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.88);
  font-size: 11.5px;
  cursor: pointer;
  text-align: left;
}

.map-players__row:hover {
  background: rgba(56, 189, 248, 0.16);
}

.map-players__avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
}

.map-players__name {
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.map-players__coord {
  flex: 0 0 auto;
  color: rgba(203, 213, 225, 0.66);
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
}

.map-hud--bottom-left {
  bottom: 12px;
  left: 14px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(8, 13, 20, 0.68);
}

.map-hud__sep {
  color: rgba(255, 255, 255, 0.28);
}

.map-hud--bottom-right {
  right: 12px;
  bottom: 12px;
  pointer-events: auto;
}

@media (max-width: 1100px) {
  .map-page__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-page__sidebar {
    max-height: none;
  }
}
</style>

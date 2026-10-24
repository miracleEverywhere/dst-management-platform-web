<template>
  <div
    ref="wrapper"
    class="world-map-canvas"
    :class="{ 'is-dragging': dragging }"
  >
    <canvas
      ref="canvas"
      class="world-map-canvas__surface"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerleave="onPointerLeave"
      @wheel.prevent="onWheel"
      @dblclick="onDoubleClick"
      @contextmenu.prevent
    />
    <div
      v-if="hoverInfo"
      class="world-map-canvas__tooltip"
      :style="tooltipStyle"
    >
      <div class="world-map-canvas__tooltip-title">
        {{ hoverInfo.title }}
      </div>
      <div
        v-if="hoverInfo.subtitle"
        class="world-map-canvas__tooltip-subtitle"
      >
        {{ hoverInfo.subtitle }}
      </div>
      <div
        v-for="line in hoverInfo.lines"
        :key="line"
        class="world-map-canvas__tooltip-line"
      >
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { playerImageUrl } from './worldMapImages.js'
import { getDstRoleName } from '@/utils/tools.js'
import {
  MAP_LABEL_RULES,
  MAP_TEXTURE_MIN_ZOOM,
  NOISE_REPEAT_WORLD_UNITS,
  TILE_WORLD,
  clampZoom,
  fitZoom,
  isImportantLabelPrefab,
  layerColor,
  prefabDisplayName,
  projectWorld,
  tileHexColor,
  unprojectScreen,
} from './worldMap.js'
import { useI18n } from 'vue-i18n'

/**
 * 世界地图画布。
 *
 * 渲染顺序与游戏内地图一致：地形 → 虫洞连线 → 物体 → 路牌/遗骸/在线玩家。
 * 地形直接用后端烘好的格阵位图按世界坐标缩放绘制；物体与标记走屏幕空间，
 * 因此旋转地图时图标始终正立。
 */

const props = defineProps({
  // decodeWorldMap() 的结果
  map: {
    type: Object,
    required: true,
  },

  // 在线玩家快照（/tools/map/players）
  players: {
    type: Array,
    default: () => [],
  },
  playersStale: {
    type: Boolean,
    default: false,
  },

  // 可见图层（landmark/structure/nest/resource/other/item）
  visibleLayers: {
    type: Array,
    default: () => [],
  },
  overlays: {
    type: Object,
    required: true,
  },

  // { prefabIndex, token }：在图上高亮某一类物体
  flash: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['viewport', 'camera', 'cursor'])

const { t, locale } = useI18n()

const wrapper = ref()
const canvas = ref()
const size = reactive({ width: 0, height: 0 })
const camera = reactive({ cx: 0, cz: 0, zoom: 6, rotation: 0 })
const dragging = ref(false)

const lang = computed(() => (locale.value === 'en' ? 'en' : 'zh'))
const visibleLayerSet = computed(() => new Set(props.visibleLayers))

let pixelRatio = 1
let drawFrame = 0
let resizeObserver = null

/** 单帧最多绘制的名称数量：防止高缩放下成片建筑把文字画满整屏。 */
const MAX_MAP_LABELS = 160

/**
 * 地形噪声贴图的 CanvasPattern 缓存（键 = tileSpec.noise，含水域的 noise#tint）。
 * 图案按世界坐标缩放，同一张噪声在地图上连续，与游戏内地图的观感一致。
 */
let patterns = new Map()

function buildPatterns() {
  patterns = new Map()

  const ctx = canvas.value?.getContext('2d')
  const textures = props.map.textures

  if (!ctx || !textures || textures.size === 0 || typeof DOMMatrix === 'undefined') {
    return
  }

  for (const [name, texture] of textures) {
    const width = Number(texture.width) || 0
    const height = Number(texture.height) || 0

    if (width < 1 || height < 1) {
      continue
    }

    try {
      const pattern = ctx.createPattern(texture, 'repeat')

      if (!pattern) {
        continue
      }

      const matrix = new DOMMatrix()

      matrix.a = NOISE_REPEAT_WORLD_UNITS / width
      matrix.d = -NOISE_REPEAT_WORLD_UNITS / height
      pattern.setTransform(matrix)
      patterns.set(name, pattern)
    } catch {
      // 个别浏览器不支持 pattern.setTransform 时退回平均色位图。
    }
  }
}

/** 按图层分组的物体下标：每帧只设置一次 fillStyle。 */
const objectsByLayer = computed(() => {
  const groups = new Map()
  const { objects, prefabs } = props.map

  for (let index = 0; index < objects.count; index++) {
    const prefab = prefabs[objects.prefabIndex[index]]
    const layer = prefab?.layer || 'other'
    let list = groups.get(layer)

    if (!list) {
      list = []
      groups.set(layer, list)
    }

    list.push(index)
  }

  return groups
})

/** 角色头像缓存：首次绘制时创建 Image，加载完成后补一帧。 */
const playerImages = new Map()

function playerImage(prefab) {
  const url = playerImageUrl(prefab)

  if (!url) {
    return null
  }

  let image = playerImages.get(url)

  if (!image) {
    image = new Image()
    image.onload = () => scheduleDraw()
    image.src = url
    playerImages.set(url, image)
  }

  return image
}

function scheduleDraw() {
  if (drawFrame) {
    return
  }

  drawFrame = requestAnimationFrame(() => {
    drawFrame = 0
    draw()
  })
}

function applySize(width, height) {
  const next = {
    width: Math.max(320, Math.floor(width)),
    height: Math.max(260, Math.floor(height)),
  }

  if (next.width === size.width && next.height === size.height) {
    return
  }

  size.width = next.width
  size.height = next.height
  pixelRatio = Math.min(2, window.devicePixelRatio || 1)

  const element = canvas.value

  if (element) {
    element.width = Math.floor(size.width * pixelRatio)
    element.height = Math.floor(size.height * pixelRatio)
  }

  emit('viewport', { width: size.width, height: size.height })
  scheduleDraw()
}

// #region 绘制

function draw() {
  const element = canvas.value

  if (!element || !props.map || size.width < 2 || size.height < 2) {
    return
  }

  if (element.width !== Math.floor(size.width * pixelRatio)) {
    element.width = Math.floor(size.width * pixelRatio)
    element.height = Math.floor(size.height * pixelRatio)
  }

  const ctx = element.getContext('2d')

  if (!ctx) {
    return
  }

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.clearRect(0, 0, size.width, size.height)
  ctx.fillStyle = '#0b0f15'
  ctx.fillRect(0, 0, size.width, size.height)

  drawTerrain(ctx)
  drawWormholes(ctx)
  drawObjects(ctx)
  drawPrefabLabels(ctx)
  drawSigns(ctx)
  drawSkeletons(ctx)
  drawPlayers(ctx)
  drawFlash(ctx)
  drawHoverRing(ctx)
}

function drawTerrain(ctx) {
  const terrain = props.map.terrainCanvas
  const usePatterns = camera.zoom >= MAP_TEXTURE_MIN_ZOOM && patterns.size > 0

  if (!terrain && !usePatterns) {
    return
  }

  const pxPerWorld = camera.zoom / TILE_WORLD

  ctx.save()
  ctx.translate(size.width / 2, size.height / 2)
  ctx.rotate(camera.rotation)
  ctx.scale(pxPerWorld, pxPerWorld)
  ctx.translate(-camera.cx, -camera.cz)
  ctx.imageSmoothingEnabled = true

  if (usePatterns) {
    drawPatternTerrain(ctx)
  } else if (terrain) {
    // 缩到全图时用每格平均色位图：一帧一次 drawImage，比逐格贴图快得多。
    ctx.drawImage(
      terrain,
      -props.map.width * 2,
      -props.map.height * 2,
      props.map.width * 4,
      props.map.height * 4,
    )
  }

  ctx.restore()
}

/** 高缩放时逐格铺噪声贴图；只处理视口覆盖到的格阵，旋转时用四角包围盒。 */
function drawPatternTerrain(ctx) {
  if (typeof Path2D === 'undefined') {
    return
  }

  const { width, height, tiles, tileById } = props.map
  const halfWidth = width * 2
  const halfHeight = height * 2

  const corners = [
    unprojectScreen(0, 0, camera, size.width, size.height),
    unprojectScreen(size.width, 0, camera, size.width, size.height),
    unprojectScreen(0, size.height, camera, size.width, size.height),
    unprojectScreen(size.width, size.height, camera, size.width, size.height),
  ]

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const corner of corners) {
    const mapY = -corner.z

    minX = Math.min(minX, corner.x)
    maxX = Math.max(maxX, corner.x)
    minY = Math.min(minY, mapY)
    maxY = Math.max(maxY, mapY)
  }

  const minTx = Math.max(0, Math.floor((minX + halfWidth) / TILE_WORLD))
  const maxTx = Math.min(width - 1, Math.ceil((maxX + halfWidth) / TILE_WORLD))
  const minTy = Math.max(0, Math.floor((minY + halfHeight) / TILE_WORLD))
  const maxTy = Math.min(height - 1, Math.ceil((maxY + halfHeight) / TILE_WORLD))

  if (maxTx < minTx || maxTy < minTy) {
    return
  }

  const paths = new Map()

  for (let ty = minTy; ty <= maxTy; ty++) {
    const rowOffset = ty * width
    const top = -halfHeight + ty * TILE_WORLD

    for (let tx = minTx; tx <= maxTx; tx++) {
      const tileId = tiles[rowOffset + tx]
      let path = paths.get(tileId)

      if (!path) {
        path = new Path2D()
        paths.set(tileId, path)
      }

      // 略微重叠，避免相邻矩形之间出现透明细缝。
      path.rect(-halfWidth + tx * TILE_WORLD, top, TILE_WORLD + 0.02, TILE_WORLD + 0.02)
    }
  }

  for (const [tileId, path] of paths) {
    const spec = tileById.get(tileId)
    const pattern = spec?.noise ? patterns.get(spec.noise) : null

    ctx.fillStyle = pattern || props.map.tileColors?.get(tileId) || tileHexColor(spec?.name)
    ctx.fill(path)
  }
}

function isOnScreen(point, margin = 12) {
  return point.x >= -margin && point.x <= size.width + margin &&
    point.y >= -margin && point.y <= size.height + margin
}

function drawWormholes(ctx) {
  if (!props.overlays.wormholes || props.map.wormholes.length === 0) {
    return
  }

  ctx.save()
  ctx.lineCap = 'round'

  for (const wormhole of props.map.wormholes) {
    const from = projectWorld(wormhole.x1, wormhole.z1, camera, size.width, size.height)
    const to = projectWorld(wormhole.x2, wormhole.z2, camera, size.width, size.height)

    if (!isOnScreen(from, 40) && !isOnScreen(to, 40)) {
      continue
    }

    // 亮色光晕代替深色打底：不压暗地图，也能在森林/海面上看清连线。
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(0, 200, 235, 0.45)'
    ctx.lineWidth = 6.5
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()

    // 亮色虚线主体。
    ctx.setLineDash([8, 6])
    ctx.strokeStyle = 'rgba(150, 248, 255, 0.95)'
    ctx.lineWidth = 2.4
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.setLineDash([])

    // 两端入口：亮色圆环 + 亮色光晕，不使用深色填充。
    const radius = Math.max(3.5, Math.min(6, camera.zoom * 0.5))

    for (const point of [from, to]) {
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius + 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 200, 235, 0.22)'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.lineWidth = 2.4
      ctx.strokeStyle = 'rgba(160, 250, 255, 0.95)'
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(point.x, point.y, radius * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = '#e8fdff'
      ctx.fill()
    }

    if (wormhole.number && camera.zoom >= 3) {
      const midX = (from.x + to.x) / 2
      const midY = (from.y + to.y) / 2

      if (midX >= 0 && midX <= size.width && midY >= 0 && midY <= size.height) {
        // 浅色描边 + 深色字心：没有深色底块，但在任何地形上都清晰。
        ctx.font = '600 12px Roboto, "Noto Sans SC", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgba(240, 253, 255, 0.92)'
        ctx.strokeText(String(wormhole.number), midX, midY)
        ctx.fillStyle = '#04222c'
        ctx.fillText(String(wormhole.number), midX, midY)
      }
    }
  }

  ctx.restore()
}

function drawObjects(ctx) {
  const { objects, prefabs } = props.map
  const layers = visibleLayerSet.value
  const zoom = camera.zoom
  const groups = objectsByLayer.value
  const atlas = props.map.iconAtlas
  const iconRects = props.map.iconRects

  // 缩小时图标不足一个像素，用圆点表示分布；放大后换成后端图集里的原画。
  const iconsVisible = Boolean(atlas) && zoom >= 6

  for (const [layer, indices] of groups) {
    if (!layers.has(layer)) {
      continue
    }
    if (layer === 'item' && zoom < 8) {
      continue
    }
    if (layer === 'other' && zoom < 3.5) {
      continue
    }

    ctx.fillStyle = layerColor(layer)
    ctx.globalAlpha = 0.92

    for (const index of indices) {
      const point = projectWorld(objects.x[index], objects.z[index], camera, size.width, size.height)

      if (point.x < -6 || point.x > size.width + 6 || point.y < -6 || point.y > size.height + 6) {
        continue
      }

      const prefab = prefabs[objects.prefabIndex[index]]
      const rect = iconsVisible && prefab?.icon ? iconRects.get(prefab.icon) : null

      if (rect) {
        const iconSize = Math.min(96, Math.max(8, zoom * 1.2))

        ctx.drawImage(
          atlas,
          rect[0], rect[1], rect[2], rect[3],
          point.x - iconSize / 2, point.y - iconSize / 2, iconSize, iconSize,
        )
        continue
      }

      if (layer === 'landmark') {
        drawLandmark(ctx, point)
        continue
      }

      if (layer === 'structure') {
        const half = Math.max(1.6, Math.min(3.6, zoom * 0.16))

        ctx.fillRect(point.x - half, point.y - half, half * 2, half * 2)
        continue
      }

      if (layer === 'nest') {
        const radius = Math.max(2, Math.min(4.6, zoom * 0.2))

        ctx.beginPath()
        ctx.moveTo(point.x, point.y - radius)
        ctx.lineTo(point.x + radius, point.y + radius)
        ctx.lineTo(point.x - radius, point.y + radius)
        ctx.closePath()
        ctx.fill()
        continue
      }

      const radius = layer === 'item'
        ? 1
        : Math.max(1.2, Math.min(4.2, zoom * 0.18))

      if (radius <= 1.6) {
        ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2)
      } else {
        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  ctx.globalAlpha = 1
}

/** 地标：圆点 + 白边。名字由 drawPrefabLabels 统一画在图标上方。 */
function drawLandmark(ctx, point) {
  const radius = Math.max(3, Math.min(8, camera.zoom * 0.32))

  ctx.beginPath()
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = 1.2
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.stroke()
}

/**
 * 重要物体的名称标注（对齐 xy）：地标/Boss 在 6 像素/格起显示，
 * 重要建筑与巢穴在 12 像素/格起显示。屏幕空间绘制并做简单的防重叠。
 */
function drawPrefabLabels(ctx) {
  if (!props.overlays.labels) {
    return
  }

  const zoom = camera.zoom
  const { objects, prefabs } = props.map
  const groups = objectsByLayer.value
  const placed = []
  let drawn = 0

  ctx.save()
  ctx.font = '600 12px Roboto, "Noto Sans SC", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(12, 16, 26, 0.85)'
  ctx.fillStyle = '#f2f5fb'

  for (const rule of MAP_LABEL_RULES) {
    if (zoom < rule.minZoom || !visibleLayerSet.value.has(rule.layer)) {
      continue
    }

    const indices = groups.get(rule.layer)

    if (!indices) {
      continue
    }

    for (const index of indices) {
      if (drawn >= MAX_MAP_LABELS) {
        break
      }

      const prefab = prefabs[objects.prefabIndex[index]]

      if (!prefab || !isImportantLabelPrefab(prefab)) {
        continue
      }

      // 建筑/巢穴只标注有人工中英文名的 prefab，避免出现一串内部名。
      if (rule.namedOnly && !prefab.zh && !prefab.en) {
        continue
      }

      const point = projectWorld(objects.x[index], objects.z[index], camera, size.width, size.height)

      if (!isOnScreen(point, 30)) {
        continue
      }

      const text = prefabDisplayName(prefab, lang.value)

      if (!text) {
        continue
      }

      const offset = Math.max(10, Math.min(30, zoom * 0.9))
      const width = ctx.measureText(text).width
      const left = point.x - width / 2 - 4
      const right = point.x + width / 2 + 4
      const bottom = point.y - offset + 2
      const top = bottom - 15

      if (left < 0 || right > size.width) {
        continue
      }
      if (placed.some(rect => !(right < rect.left || left > rect.right || bottom < rect.top || top > rect.bottom))) {
        continue
      }

      ctx.strokeText(text, point.x, point.y - offset)
      ctx.fillText(text, point.x, point.y - offset)
      placed.push({ left, right, top, bottom })
      drawn++
    }
  }

  ctx.restore()
}

function drawSigns(ctx) {
  if (!props.overlays.signs || props.map.labels.length === 0) {
    return
  }

  for (const label of props.map.labels) {
    const point = projectWorld(label.x, label.z, camera, size.width, size.height)

    if (!isOnScreen(point, 24)) {
      continue
    }

    ctx.fillStyle = 'rgba(240, 98, 146, 0.9)'
    ctx.fillRect(point.x - 2.5, point.y - 2.5, 5, 5)

    if (camera.zoom < 3) {
      continue
    }

    const text = label.text.length > 22 ? `${label.text.slice(0, 22)}…` : label.text

    drawText(ctx, text, point.x + 6, point.y, { bg: 'rgba(9, 13, 19, 0.72)' })
  }
}

function drawSkeletons(ctx) {
  if (!props.overlays.skeletons || props.map.skeletons.length === 0) {
    return
  }

  for (const skeleton of props.map.skeletons) {
    const point = projectWorld(Number(skeleton.x), Number(skeleton.z), camera, size.width, size.height)

    if (!isOnScreen(point, 20)) {
      continue
    }

    const radius = Math.max(3, Math.min(7, camera.zoom * 0.2))

    ctx.fillStyle = '#e9e3d4'
    ctx.beginPath()
    ctx.arc(point.x, point.y - radius * 0.2, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#2b2b2b'
    ctx.beginPath()
    ctx.arc(point.x - radius * 0.36, point.y - radius * 0.32, radius * 0.22, 0, Math.PI * 2)
    ctx.arc(point.x + radius * 0.36, point.y - radius * 0.32, radius * 0.22, 0, Math.PI * 2)
    ctx.fill()

    if (camera.zoom >= 4 && skeleton.name) {
      drawText(ctx, skeleton.name, point.x + radius + 3, point.y, { bg: 'rgba(9, 13, 19, 0.72)' })
    }
  }
}

function drawPlayers(ctx) {
  if (!props.overlays.players || props.players.length === 0) {
    return
  }

  ctx.save()
  ctx.globalAlpha = props.playersStale ? 0.72 : 1

  for (const player of props.players) {
    const point = projectWorld(player.x, player.z, camera, size.width, size.height)

    if (!isOnScreen(point, 40)) {
      continue
    }

    const radius = Math.max(10, Math.min(20, camera.zoom * 0.45))
    const image = playerImage(player.prefab)

    ctx.save()
    ctx.beginPath()
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#0e1620'
    ctx.fill()
    ctx.clip()

    if (image && image.complete && image.naturalWidth > 0) {
      ctx.drawImage(image, point.x - radius, point.y - radius, radius * 2, radius * 2)
    } else {
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2)
    }

    ctx.restore()

    ctx.beginPath()
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
    ctx.lineWidth = 2
    ctx.strokeStyle = props.playersStale ? 'rgba(148, 163, 184, 0.9)' : 'rgba(56, 189, 248, 0.95)'
    ctx.stroke()

    const name = player.name || t('tools.map.unknownPlayer')

    drawText(ctx, name, point.x, point.y + radius + 8, {
      align: 'center',
      color: '#e6f6ff',
      bg: 'rgba(8, 14, 22, 0.78)',
    })
  }

  ctx.restore()
}

let flashPrefabIndex = -1
let flashUntil = 0

function drawFlash(ctx) {
  if (flashPrefabIndex < 0 || performance.now() > flashUntil) {
    return
  }

  const { objects } = props.map
  const phase = (performance.now() % 900) / 900
  const radius = 6 + phase * 12

  ctx.save()
  ctx.strokeStyle = `rgba(255, 235, 130, ${1 - phase})`
  ctx.lineWidth = 2

  for (let index = 0; index < objects.count; index++) {
    if (objects.prefabIndex[index] !== flashPrefabIndex) {
      continue
    }

    const point = projectWorld(objects.x[index], objects.z[index], camera, size.width, size.height)

    if (!isOnScreen(point, 20)) {
      continue
    }

    ctx.beginPath()
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.restore()
  setTimeout(scheduleDraw, 60)
}

function drawHoverRing(ctx) {
  const target = hover.value

  if (!target || !Number.isFinite(target.worldX)) {
    return
  }

  const point = projectWorld(target.worldX, target.worldZ, camera, size.width, size.height)

  ctx.save()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(point.x, point.y, target.kind === 'player' ? 20 : 10, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

/** 带底色的文字；用于地名、玩家名与路牌。 */
function drawText(ctx, text, x, y, options = {}) {
  const {
    align = 'left',
    color = '#f2f4f8',
    bg = null,
    font = '11px Roboto, "Noto Sans SC", sans-serif',
  } = options

  if (!text) {
    return
  }

  ctx.save()
  ctx.font = font
  ctx.textBaseline = 'middle'
  ctx.textAlign = align

  if (bg) {
    const padding = 3
    const metrics = ctx.measureText(text)
    const left = align === 'center' ? x - metrics.width / 2 : x
    const top = y - 7

    ctx.fillStyle = bg
    ctx.fillRect(left - padding, top, metrics.width + padding * 2, 14)
  }

  ctx.fillStyle = color
  ctx.fillText(text, x, y)
  ctx.restore()
}

// #endregion

// #region 悬停与相机

const hover = ref(null)

const tooltipStyle = computed(() => {
  const target = hover.value

  if (!target) {
    return {}
  }

  return {
    left: `${Math.min(Math.max(target.screenX + 14, 8), Math.max(8, size.width - 230))}px`,
    top: `${Math.min(Math.max(target.screenY + 14, 8), Math.max(8, size.height - 90))}px`,
  }
})

const hoverInfo = computed(() => {
  const target = hover.value

  if (!target) {
    return null
  }

  const coords = `X ${Math.round(target.worldX)} · Z ${Math.round(target.worldZ)}`

  if (target.kind === 'player') {
    const player = props.players[target.index]

    if (!player) {
      return null
    }

    return {
      title: player.name || t('tools.map.unknownPlayer'),
      subtitle: getDstRoleName(player.prefab, lang.value),
      lines: [coords],
    }
  }

  if (target.kind === 'skeleton') {
    const skeleton = props.map.skeletons[target.index]

    if (!skeleton) {
      return null
    }

    const lines = [coords]

    if (skeleton.cause) {
      lines.push(`${t('tools.map.cause')}: ${skeleton.cause}`)
    }

    return {
      title: skeleton.name || t('tools.map.skeleton'),
      subtitle: getDstRoleName(skeleton.char, lang.value),
      lines,
    }
  }

  if (target.kind === 'sign') {
    const label = props.map.labels[target.index]

    if (!label) {
      return null
    }

    return {
      title: label.text,
      subtitle: '',
      lines: [coords],
    }
  }

  const prefab = props.map.prefabs[target.prefabIndex]

  if (!prefab) {
    return null
  }

  return {
    title: prefabDisplayName(prefab, lang.value),
    subtitle: prefab.name,
    lines: [coords, t(`tools.map.layers.${prefab.layer}`)],
  }
})

let hoverFrame = 0
let pendingHoverPoint = null

function scheduleHover(clientX, clientY) {
  pendingHoverPoint = { clientX, clientY }

  if (hoverFrame) {
    return
  }

  hoverFrame = requestAnimationFrame(() => {
    hoverFrame = 0

    if (pendingHoverPoint) {
      updateHover(pendingHoverPoint.clientX, pendingHoverPoint.clientY)
    }
  })
}

function updateHover(clientX, clientY) {
  const element = canvas.value

  if (!element) {
    return
  }

  const rect = element.getBoundingClientRect()
  const screenX = clientX - rect.left
  const screenY = clientY - rect.top
  let best = null

  const consider = (distance, target, limit) => {
    if (distance > limit) {
      return
    }
    if (!best || distance < best.distance) {
      best = { distance, ...target }
    }
  }

  if (props.overlays.players) {
    props.players.forEach((player, index) => {
      const point = projectWorld(player.x, player.z, camera, size.width, size.height)

      consider(Math.hypot(point.x - screenX, point.y - screenY), {
        kind: 'player',
        index,
        screenX: point.x,
        screenY: point.y,
        worldX: player.x,
        worldZ: player.z,
      }, 22)
    })
  }

  if (props.overlays.skeletons) {
    props.map.skeletons.forEach((skeleton, index) => {
      const point = projectWorld(Number(skeleton.x), Number(skeleton.z), camera, size.width, size.height)

      consider(Math.hypot(point.x - screenX, point.y - screenY), {
        kind: 'skeleton',
        index,
        screenX: point.x,
        screenY: point.y,
        worldX: Number(skeleton.x),
        worldZ: Number(skeleton.z),
      }, 14)
    })
  }

  if (props.overlays.signs) {
    props.map.labels.forEach((label, index) => {
      const point = projectWorld(label.x, label.z, camera, size.width, size.height)

      consider(Math.hypot(point.x - screenX, point.y - screenY), {
        kind: 'sign',
        index,
        screenX: point.x,
        screenY: point.y,
        worldX: label.x,
        worldZ: label.z,
      }, 14)
    })
  }

  if (camera.zoom >= 3) {
    const { objects, prefabs } = props.map
    const layers = visibleLayerSet.value
    const objectLimit = camera.zoom >= 8 ? 9 : 7

    for (let index = 0; index < objects.count; index++) {
      const prefab = prefabs[objects.prefabIndex[index]]

      if (!prefab || !layers.has(prefab.layer)) {
        continue
      }

      const point = projectWorld(objects.x[index], objects.z[index], camera, size.width, size.height)

      if (Math.abs(point.x - screenX) > objectLimit || Math.abs(point.y - screenY) > objectLimit) {
        continue
      }

      consider(Math.hypot(point.x - screenX, point.y - screenY), {
        kind: 'object',
        prefabIndex: objects.prefabIndex[index],
        screenX: point.x,
        screenY: point.y,
        worldX: objects.x[index],
        worldZ: objects.z[index],
      }, objectLimit)
    }
  }

  hover.value = best
  scheduleDraw()
}

// #endregion

// #region 交互

const pointers = new Map()
let dragState = null
let pinchState = null

function pointerDistance() {
  const points = [...pointers.values()]

  if (points.length < 2) {
    return 0
  }

  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
}

function emitCamera() {
  emit('camera', { ...camera })
}

function clampCamera() {
  const limitX = props.map.width * TILE_WORLD * 0.8
  const limitY = props.map.height * TILE_WORLD * 0.8

  camera.cx = Math.min(limitX, Math.max(-limitX, camera.cx))
  camera.cz = Math.min(limitY, Math.max(-limitY, camera.cz))
}

function onPointerDown(event) {
  const element = canvas.value

  if (!element) {
    return
  }

  if (event.pointerType === 'mouse' && event.button !== 0) {
    return
  }

  element.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (pointers.size === 1) {
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      cx: camera.cx,
      cz: camera.cz,
      moved: false,
    }
  } else if (pointers.size === 2) {
    pinchState = { distance: pointerDistance(), zoom: camera.zoom }
    dragState = null
  }

  dragging.value = true
}

function onPointerMove(event) {
  if (pointers.has(event.pointerId)) {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  }

  if (pinchState && pointers.size === 2) {
    const distance = pointerDistance()

    if (pinchState.distance > 0) {
      camera.zoom = clampZoom(pinchState.zoom * (distance / pinchState.distance))
      scheduleDraw()
      emitCamera()
    }

    return
  }

  if (dragState && dragState.pointerId === event.pointerId) {
    const dx = event.clientX - dragState.startX
    const dy = event.clientY - dragState.startY

    if (!dragState.moved && Math.hypot(dx, dy) > 3) {
      dragState.moved = true
      hover.value = null
    }

    if (dragState.moved) {
      const pxPerWorld = camera.zoom / TILE_WORLD
      const cos = Math.cos(camera.rotation)
      const sin = Math.sin(camera.rotation)
      const worldX = (dx * cos + dy * sin) / pxPerWorld
      const worldY = (-dx * sin + dy * cos) / pxPerWorld

      camera.cx = dragState.cx - worldX
      camera.cz = dragState.cz - worldY
      clampCamera()
      scheduleDraw()
      emitCamera()
    }

    return
  }

  scheduleHover(event.clientX, event.clientY)

  const world = unprojectScreen(
    event.clientX - canvas.value.getBoundingClientRect().left,
    event.clientY - canvas.value.getBoundingClientRect().top,
    camera,
    size.width,
    size.height,
  )

  emit('cursor', { x: world.x, z: world.z })
}

function onPointerUp(event) {
  pointers.delete(event.pointerId)

  if (pointers.size < 2) {
    pinchState = null
  }

  if (dragState && dragState.pointerId === event.pointerId) {
    const wasClick = !dragState.moved

    dragState = null
    dragging.value = false

    if (wasClick) {
      scheduleHover(event.clientX, event.clientY)
    }
  }

  if (pointers.size === 0) {
    dragging.value = false
  }
}

function onPointerLeave() {
  if (!dragState) {
    hover.value = null
    emit('cursor', null)
    scheduleDraw()
  }
}

function onWheel(event) {
  const element = canvas.value

  if (!element) {
    return
  }

  const rect = element.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top
  const before = unprojectScreen(offsetX, offsetY, camera, size.width, size.height)
  const factor = Math.exp(-event.deltaY * 0.0015)

  camera.zoom = clampZoom(camera.zoom * factor)

  const after = unprojectScreen(offsetX, offsetY, camera, size.width, size.height)

  camera.cx += before.x - after.x
  camera.cz += after.z - before.z
  clampCamera()
  hover.value = null
  scheduleDraw()
  emitCamera()
}

function onDoubleClick(event) {
  const element = canvas.value

  if (!element) {
    return
  }

  const rect = element.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  zoomAt(offsetX, offsetY, 1.6)
}

function zoomAt(offsetX, offsetY, factor) {
  const before = unprojectScreen(offsetX, offsetY, camera, size.width, size.height)

  camera.zoom = clampZoom(camera.zoom * factor)

  const after = unprojectScreen(offsetX, offsetY, camera, size.width, size.height)

  camera.cx += before.x - after.x
  camera.cz += after.z - before.z
  clampCamera()
  scheduleDraw()
  emitCamera()
}

// #endregion

// #region 对外方法

function fit() {
  camera.cx = 0
  camera.cz = 0
  camera.rotation = 0
  camera.zoom = fitZoom(props.map.width, props.map.height, size.width, size.height)
  hover.value = null
  scheduleDraw()
  emitCamera()
}

function zoomBy(factor) {
  hover.value = null
  zoomAt(size.width / 2, size.height / 2, factor)
}

function rotateBy(delta) {
  camera.rotation = (camera.rotation + delta) % (Math.PI * 2)
  hover.value = null
  scheduleDraw()
  emitCamera()
}

function focusWorld(x, z, zoom = 0) {
  camera.cx = x
  camera.cz = -z
  camera.zoom = clampZoom(zoom || Math.max(camera.zoom, 8))
  clampCamera()
  hover.value = null
  scheduleDraw()
  emitCamera()
}

function getCanvas() {
  return canvas.value
}

defineExpose({ fit, zoomBy, rotateBy, focusWorld, getCanvas })

// #endregion

// #region 生命周期

watch(() => props.map, (value, previous) => {
  // 旧地图的位图不再需要，主动释放，避免连续刷新世界时占满显存。
  previous?.textures?.forEach(texture => texture.close?.())
  nextTick(() => {
    buildPatterns()
    fit()
  })
})

watch(() => props.flash, value => {
  if (!value || !Number.isFinite(value.prefabIndex)) {
    return
  }

  flashPrefabIndex = value.prefabIndex
  flashUntil = performance.now() + 3200
  scheduleDraw()
}, { deep: true })

watch(
  () => [props.players, props.visibleLayers, props.overlays, props.playersStale],
  scheduleDraw,
  { deep: true },
)

watch(camera, scheduleDraw)

onMounted(() => {
  applySize(wrapper.value?.clientWidth || 960, wrapper.value?.clientHeight || 600)
  resizeObserver = new ResizeObserver(entries => {
    const rect = entries[0]?.contentRect

    if (rect) {
      applySize(rect.width, rect.height)
    }
  })
  resizeObserver.observe(wrapper.value)

  // 首帧：地图已就绪时直接适配视口。
  if (props.map) {
    buildPatterns()
    fit()
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  patterns = new Map()

  if (drawFrame) {
    cancelAnimationFrame(drawFrame)
  }

  if (hoverFrame) {
    cancelAnimationFrame(hoverFrame)
  }
})

// #endregion
</script>

<style scoped>
.world-map-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0b0f15;
  cursor: grab;
  touch-action: none;
}

.world-map-canvas.is-dragging {
  cursor: grabbing;
}

.world-map-canvas__surface {
  display: block;
  width: 100%;
  height: 100%;
}

.world-map-canvas__tooltip {
  position: absolute;
  z-index: 5;
  max-width: 220px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: rgba(10, 15, 22, 0.94);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  color: #f2f4f8;
  pointer-events: none;
  font-size: 12px;
  line-height: 1.5;
}

.world-map-canvas__tooltip-title {
  font-weight: 600;
}

.world-map-canvas__tooltip-subtitle {
  color: #94a3b8;
  font-size: 11px;
}

.world-map-canvas__tooltip-line {
  color: #cbd5e1;
  font-size: 11px;
}
</style>

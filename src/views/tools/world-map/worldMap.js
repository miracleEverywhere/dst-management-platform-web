/**
 * 世界地图（GET /tools/map）浏览器侧的解码与显示口径。
 *
 * 后端契约（map_v2 正式版）：
 * - tiles：zlib + base64 的 width*height 个 uint16（大端），行序已经是"北在上"；
 * - objects：zlib + base64 的定长 10 字节记录（小端）：prefab 索引(2) + x*100(4) + z*100(4)；
 * - 世界坐标 x 向东、z 向北，画布坐标取 (x, -z)，与地形行序一致；
 * - 在线玩家由 GET /tools/map/players 单独刷新，地图本身不缓存。
 */

/** 一条物体记录的字节数。 */
export const OBJECT_RECORD_BYTES = 10

/** 世界坐标在载荷里的定点比例。 */
export const COORDINATE_SCALE = 100

/** 一格的边长（世界单位）。 */
export const TILE_WORLD = 4

/** 缩放范围（像素/格）。 */
export const MIN_ZOOM = 0.2
export const MAX_ZOOM = 48

/** 地形噪声贴图在世界上重复的世界单位数（48 = 12 格，与游戏内一致）。 */
export const NOISE_REPEAT_WORLD_UNITS = 48

/** 低于该缩放（像素/格）时用平均色位图，避免逐格贴图产生摩尔纹。 */
export const MAP_TEXTURE_MIN_ZOOM = 6

/** 图层顺序：先地标、最后是数量最大的其他。 */
export const MAP_LAYER_ORDER = ['landmark', 'structure', 'nest', 'resource', 'other', 'item']

/**
 * 地图名称标注策略：地标/Boss 在 6 像素/格起显示，重要建筑与巢穴在 12 像素/格起显示。
 * 与 xy 的标注阈值一致，避免缩到全图时文字糊成一片。
 */
export const MAP_LABEL_RULES = [
  { layer: 'landmark', minZoom: 6, namedOnly: false },
  { layer: 'structure', minZoom: 12, namedOnly: true },
  { layer: 'nest', minZoom: 12, namedOnly: true },
]

/** 批量建造、会刷屏的 prefab 不参与名称标注（城墙/栅栏/路牌/地皮等）。 */
const MAP_LABEL_MASS_PREFABS = new Set([
  'wall_stone',
  'wall_wood',
  'fence',
  'sign',
  'arrowsign_post',
  'dock_woodposts',
])

/** 该 prefab 是否适合显示名称：排除城墙、地皮这类成片出现的物体。 */
export function isImportantLabelPrefab(prefab) {
  if (!prefab) {
    return false
  }
  if (MAP_LABEL_MASS_PREFABS.has(prefab.name)) {
    return false
  }

  return !prefab.name.startsWith('turf_')
}

/** 每个图层的标记色。 */
export const LAYER_COLORS = {
  landmark: '#f06292',
  structure: '#64b5f6',
  nest: '#ffb74d',
  resource: '#81c784',
  other: '#4dd0e1',
  item: '#b0bec5',
}

/**
 * 地形名称：存档给的是 GROUND 常量名（FOREST、OCEAN_SWELL…），游戏自带的
 * 中英对照表里没有这一组，这里显式维护。英文名用于英文界面。
 */
const GROUND_LABELS = {
  IMPASSABLE: ['不可通行', 'Impassable'],
  ROAD: ['卵石路', 'Pebble Road'],
  ROCKY: ['矿区', 'Rocky'],
  DIRT: ['泥地', 'Dirt'],
  SAVANNA: ['稀树草原', 'Savanna'],
  GRASS: ['草地', 'Grass'],
  FOREST: ['森林', 'Forest'],
  MARSH: ['沼泽', 'Marsh'],
  WOODFLOOR: ['木地板', 'Wooden Floor'],
  CARPET: ['地毯', 'Carpet'],
  CHECKER: ['棋盘格', 'Checkerboard'],
  CAVE: ['洞穴', 'Cave'],
  FUNGUS: ['蓝蘑菇林', 'Blue Mushroom Forest'],
  SINKHOLE: ['洞口', 'Sinkhole'],
  UNDERROCK: ['岩石下', 'Under Rock'],
  MUD: ['泥浆', 'Mud'],
  BRICK: ['远古砖', 'Ancient Brick'],
  BRICK_GLOW: ['烁光砖', 'Glowing Brick'],
  TILES: ['远古地砖', 'Ancient Tile'],
  TILES_GLOW: ['烁光地砖', 'Glowing Tile'],
  TRIM: ['远古镶边', 'Ancient Trim'],
  TRIM_GLOW: ['烁光镶边', 'Glowing Trim'],
  FUNGUSRED: ['红蘑菇林', 'Red Mushroom Forest'],
  FUNGUSGREEN: ['绿蘑菇林', 'Green Mushroom Forest'],
  FUNGUSMOON: ['月亮蘑菇林', 'Moon Mushroom Forest'],
  DECIDUOUS: ['落叶林', 'Deciduous Forest'],
  DESERT_DIRT: ['沙漠', 'Desert'],
  SCALE: ['龙蝇地皮', 'Scaled Turf'],
  LAVAARENA_FLOOR: ['岩浆竞技场地面', 'Lava Arena Floor'],
  LAVAARENA_TRIM: ['岩浆竞技场镶边', 'Lava Arena Trim'],
  QUAGMIRE_PEATFOREST: ['泥沼森林', 'Peat Forest'],
  QUAGMIRE_PARKFIELD: ['公园草地', 'Park Field'],
  QUAGMIRE_PARKSTONE: ['公园石径', 'Park Stone'],
  QUAGMIRE_GATEWAY: ['大门', 'Gateway'],
  QUAGMIRE_SOIL: ['沃土', 'Soil'],
  QUAGMIRE_CITYSTONE: ['城市石', 'City Stone'],
  PEBBLEBEACH: ['卵石滩', 'Pebble Beach'],
  METEOR: ['陨石区', 'Meteor Field'],
  SHELLBEACH: ['贝壳滩', 'Shell Beach'],
  ARCHIVE: ['档案馆', 'Archive'],
  FARMING_SOIL: ['耕作土壤', 'Farm Soil'],
  OCEAN_COASTAL: ['浅海', 'Coastal Ocean'],
  OCEAN_COASTAL_SHORE: ['海岸', 'Coastal Shore'],
  OCEAN_SWELL: ['中海', 'Swell Ocean'],
  OCEAN_ROUGH: ['深海', 'Rough Ocean'],
  OCEAN_BRINEPOOL: ['盐池', 'Brine Pool'],
  OCEAN_BRINEPOOL_SHORE: ['盐池海岸', 'Brine Pool Shore'],
  OCEAN_HAZARDOUS: ['危险海域', 'Hazardous Ocean'],
  OCEAN_WATERLOG: ['沉水海域', 'Waterlogged Ocean'],
  OCEAN_ICE: ['浮冰', 'Ice'],
  COTL_BRICK: ['砖地', 'Brick Floor'],
  COTL_GOLD: ['金砖地', 'Gold Floor'],
  MONKEY_GROUND: ['海盗海滩', 'Monkey Beach'],
  MONKEY_DOCK: ['码头', 'Dock'],
  LUNAR_MARSH: ['月亮沼泽', 'Lunar Marsh'],
  SHADOW_MARSH: ['暗影沼泽', 'Shadow Marsh'],
  VENT: ['喷气口地面', 'Vent'],
  VAULT: ['宝库', 'Vault'],
  VAULT_CLEAN: ['洁净宝库', 'Clean Vault'],
  ROPE_BRIDGE: ['索桥', 'Rope Bridge'],
  CHARLIE_VINE: ['查理藤蔓', 'Charlie Vine'],
  WAGSTAFF_FLOOR: ['瓦格斯特夫地板', 'Wagstaff Floor'],
  MOSAIC_GREY: ['灰马赛克', 'Grey Mosaic'],
  MOSAIC_RED: ['红马赛克', 'Red Mosaic'],
  MOSAIC_BLUE: ['蓝马赛克', 'Blue Mosaic'],
  CARPET2: ['地毯', 'Carpet'],
  BEARD_RUG: ['胡须地毯', 'Beard Rug'],
  RIFT_MOON: ['月亮裂隙', 'Lunar Rift'],
  FAKE_GROUND: ['假地面', 'Fake Ground'],
  WEB: ['蛛网', 'Web'],
}

/** 地形配色：按 GROUND 名称给色，让整张图接近游戏内小地图的观感。 */
const TILE_COLORS = {
  INVALID: '#000000',
  IMPASSABLE: '#3e4e5a',
  ROAD: '#a1887f',
  ROCKY: '#a9a293',
  DIRT: '#a97f52',
  SAVANNA: '#b9b86a',
  GRASS: '#4e9a5f',
  FOREST: '#2f6b46',
  MARSH: '#5b4a6b',
  WOODFLOOR: '#8b6a45',
  CARPET: '#8e5b7a',
  CHECKER: '#8d8f93',
  CAVE: '#3d4753',
  FUNGUS: '#3f7fa8',
  SINKHOLE: '#4d3f36',
  UNDERROCK: '#4a4a52',
  MUD: '#6b5540',
  BRICK: '#5a5570',
  BRICK_GLOW: '#7a6aa8',
  TILES: '#4d4a63',
  TILES_GLOW: '#6f6a94',
  TRIM: '#3f3c52',
  TRIM_GLOW: '#5d5880',
  FUNGUSRED: '#a8524f',
  FUNGUSGREEN: '#4f8a55',
  FUNGUSMOON: '#5aa3a0',
  DECIDUOUS: '#8a6f3d',
  DESERT_DIRT: '#d9c18a',
  SCALE: '#8c3f3f',
  LAVAARENA_FLOOR: '#5c3a33',
  LAVAARENA_TRIM: '#7a4a3c',
  QUAGMIRE_PEATFOREST: '#4c5a3d',
  QUAGMIRE_PARKFIELD: '#5a7a4a',
  QUAGMIRE_PARKSTONE: '#8a8577',
  QUAGMIRE_GATEWAY: '#6a5a4a',
  QUAGMIRE_SOIL: '#6b4f37',
  QUAGMIRE_CITYSTONE: '#8a7f6a',
  PEBBLEBEACH: '#9a9187',
  METEOR: '#7a6f66',
  SHELLBEACH: '#d8cbb8',
  ARCHIVE: '#8a7f5f',
  FARMING_SOIL: '#6b4f37',
  OCEAN_COASTAL: '#2a7fb8',
  OCEAN_COASTAL_SHORE: '#3a92c9',
  OCEAN_SWELL: '#20689a',
  OCEAN_ROUGH: '#174d75',
  OCEAN_BRINEPOOL: '#4fa3b8',
  OCEAN_BRINEPOOL_SHORE: '#63b3c6',
  OCEAN_HAZARDOUS: '#3a5f7a',
  OCEAN_WATERLOG: '#2f6b6b',
  OCEAN_ICE: '#bcd9e6',
  COTL_BRICK: '#7a6a5a',
  COTL_GOLD: '#b08a3a',
  MONKEY_GROUND: '#7a8a5a',
  MONKEY_DOCK: '#7a6a4a',
  LUNAR_MARSH: '#4a7a7a',
  SHADOW_MARSH: '#3f3a4a',
  VENT: '#5a5a5a',
  VAULT: '#6a5a7a',
  VAULT_CLEAN: '#9a8ab0',
  ROPE_BRIDGE: '#8a7a5a',
  CHARLIE_VINE: '#3f5a3f',
  WAGSTAFF_FLOOR: '#6a6a6a',
  MOSAIC_GREY: '#8a8a8a',
  MOSAIC_RED: '#a85a5a',
  MOSAIC_BLUE: '#5a6a9a',
  CARPET2: '#8e5b7a',
  BEARD_RUG: '#7a6a5a',
  RIFT_MOON: '#9a8ac8',
  FAKE_GROUND: '#7a6f9a',
  WEB: '#c8c8c8',
}

const rgbCache = new Map()

/** 地形中文/英文名；未知地形回退到游戏内部名。 */
export function groundLabel(name, lang = 'zh') {
  const entry = GROUND_LABELS[name]

  if (!entry) {
    return name || ''
  }

  return lang === 'en' ? entry[1] : entry[0]
}

/** 地形颜色（十六进制）；未收录的地形按 id/名称散列出一个稳定色。 */
export function tileHexColor(name) {
  if (name && TILE_COLORS[name]) {
    return TILE_COLORS[name]
  }

  const seed = hashString(name || 'unknown')

  return `hsl(${seed % 360} 24% 42%)`
}

function hashString(value) {
  let hash = 0

  for (let index = 0; index < value.length; index++) {
    hash = Math.imul(hash, 31) + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

/** 十六进制/hsl 颜色转 [r,g,b]，用于逐格写 ImageData。 */
export function colorToRgb(value) {
  const cached = rgbCache.get(value)

  if (cached) {
    return cached
  }

  let rgb = [120, 130, 120]

  if (value.startsWith('#')) {
    const hex = value.length === 4
      ? value.slice(1).split('').map(item => item + item).join('')
      : value.slice(1, 7)

    rgb = [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ]
  } else {
    const match = /^hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)$/.exec(value)

    if (match) {
      rgb = hslToRgb(Number(match[1]), Number(match[2]) / 100, Number(match[3]) / 100)
    }
  }

  rgbCache.set(value, rgb)

  return rgb
}

function hslToRgb(hue, saturation, lightness) {
  const h = ((hue % 360) + 360) % 360 / 360

  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation

  const p = 2 * lightness - q

  const channel = offset => {
    let t = h + offset

    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

    return p
  }

  return [
    Math.round(channel(1 / 3) * 255),
    Math.round(channel(0) * 255),
    Math.round(channel(-1 / 3) * 255),
  ]
}

/** 图层色；未知图层回退到 other。 */
export function layerColor(layer) {
  return LAYER_COLORS[layer] || LAYER_COLORS.other
}

/** 有数据的图层，按固定顺序排；未知图层排在最后。 */
export function orderedLayers(counts) {
  const present = MAP_LAYER_ORDER.filter(layer => (counts?.[layer] ?? 0) > 0)
  const unknown = Object.keys(counts || {}).filter(layer => !MAP_LAYER_ORDER.includes(layer))

  return [...present, ...unknown]
}

function base64ToBytes(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

/** zlib（base64）解压；浏览器不支持 DecompressionStream 时抛出明确错误。 */
export async function inflateZlibBase64(value) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('当前浏览器不支持解压地图数据，请升级浏览器后重试')
  }

  const bytes = base64ToBytes(value || '')

  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream('deflate'))

  const buffer = await new Response(stream).arrayBuffer()

  return new Uint8Array(buffer)
}

/** 地形贴图的缓存键：带 minimap_color 的水域按 (噪声, 颜色) 区分。 */
export function textureKey(noise, tint) {
  if (!noise) {
    return undefined
  }

  return tint ? `${noise}#${tint}` : noise
}

/** 解码后端返回的 PNG（纯 base64，不含 data: 前缀）。 */
async function decodePngBase64(value) {
  if (!value || typeof createImageBitmap === 'undefined') {
    return null
  }

  try {
    const bytes = base64ToBytes(value)

    return await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
  } catch {
    // 单张图片损坏不应该让整张地图解码失败。
    return null
  }
}

/**
 * 噪声贴图的暗部压缩系数：把贴图里最黑的部分抬到"平均亮度 × 该系数"。
 * 游戏的小地图是低分辨率烘焙图，按原生分辨率铺贴时纯黑轮廓会变成硬边黑洞。
 */
const NOISE_DARK_FLOOR = 0.5

/** 就地压缩噪声贴图的暗部（便于单独验证的纯像素实现）。 */
export function toneMapNoisePixels(data, floor) {
  if (data.length < 4) {
    return
  }

  let total = 0
  let pixels = 0

  for (let index = 0; index + 3 < data.length; index += 4) {
    total += data[index] + data[index + 1] + data[index + 2]
    pixels++
  }

  if (pixels === 0) {
    return
  }

  const average = total / pixels / 3

  if (average <= 0) {
    return
  }

  for (let index = 0; index + 3 < data.length; index += 4) {
    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]
    const luminance = (red + green + blue) / 3

    if (luminance >= average) {
      continue
    }

    const lifted = average * floor + (1 - floor) * luminance
    const ratio = luminance > 1 ? lifted / luminance : 0

    if (ratio > 0) {
      data[index] = Math.min(255, red * ratio)
      data[index + 1] = Math.min(255, green * ratio)
      data[index + 2] = Math.min(255, blue * ratio)
    } else {
      data[index] = lifted
      data[index + 1] = lifted
      data[index + 2] = lifted
    }
  }
}

/** 把贴图的暗部压缩后返回一张新画布；失败时返回 null 由调用方退化为纯色。 */
export function toneMapNoise(bitmap) {
  try {
    const width = bitmap.width
    const height = bitmap.height

    if (width < 1 || height < 1) {
      return null
    }

    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return null
    }

    ctx.drawImage(bitmap, 0, 0)

    const image = ctx.getImageData(0, 0, width, height)

    toneMapNoisePixels(image.data, NOISE_DARK_FLOOR)
    ctx.putImageData(image, 0, 0)

    return canvas
  } catch {
    return null
  }
}

/** 海洋颗粒强度：噪声亮度换算出的中性明暗起伏幅度。 */
const OCEAN_GRAIN_AMPLITUDE = 0.3

/**
 * 水域逐像素合成：底色取 `minimap_color` 平色，只乘一层噪声亮度换算的中性颗粒。
 * 游戏的小地图海面不用噪声颜色，否则整片沿海会被染成绿色。
 */
export function tintOceanPixels(data, tint) {
  const match = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})[0-9a-f]{2}$/i.exec(tint)

  if (!match || data.length < 4) {
    return false
  }

  const red = parseInt(match[1], 16)
  const green = parseInt(match[2], 16)
  const blue = parseInt(match[3], 16)
  let total = 0

  for (let index = 0; index + 3 < data.length; index += 4) {
    total += 0.3 * data[index] + 0.59 * data[index + 1] + 0.11 * data[index + 2]
  }

  const average = total / (data.length / 4)

  if (average <= 0) {
    for (let index = 0; index + 3 < data.length; index += 4) {
      data[index] = red
      data[index + 1] = green
      data[index + 2] = blue
      data[index + 3] = 255
    }

    return true
  }

  for (let index = 0; index + 3 < data.length; index += 4) {
    const luminance = 0.3 * data[index] + 0.59 * data[index + 1] + 0.11 * data[index + 2]
    const grain = 1 + OCEAN_GRAIN_AMPLITUDE * (luminance / average - 1)

    data[index] = Math.min(255, red * grain)
    data[index + 1] = Math.min(255, green * grain)
    data[index + 2] = Math.min(255, blue * grain)
    data[index + 3] = 255
  }

  return true
}

/** 按 minimap_color 给噪声贴图染色，返回离屏画布；失败返回 null。 */
export function tintBitmap(bitmap, tint) {
  try {
    const width = bitmap.width
    const height = bitmap.height
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return null
    }

    ctx.drawImage(bitmap, 0, 0)

    const image = ctx.getImageData(0, 0, width, height)

    if (!tintOceanPixels(image.data, tint)) {
      return null
    }

    ctx.putImageData(image, 0, 0)

    return canvas
  } catch {
    return null
  }
}

/** 取一张贴图的平均色（缩到 1x1 再读像素）。 */
function averageColor(source) {
  try {
    const canvas = document.createElement('canvas')

    canvas.width = 1
    canvas.height = 1

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return [90, 110, 90]
    }

    ctx.drawImage(source, 0, 0, 1, 1)

    const data = ctx.getImageData(0, 0, 1, 1).data

    return [data[0], data[1], data[2]]
  } catch {
    return [90, 110, 90]
  }
}

function rgbToHex(rgb) {
  return `#${rgb.map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('')}`
}

/** 解码 assets 里的地形噪声贴图（name → 位图/画布）。 */
async function decodeMapTextures(payload) {
  const textures = new Map()
  const assets = Array.isArray(payload.assets) ? payload.assets : []

  await Promise.all(assets.map(async asset => {
    if (!asset || !asset.name || !asset.png) {
      return
    }

    const bitmap = await decodePngBase64(asset.png)

    if (!bitmap) {
      return
    }

    // 陆地贴图先做暗部压缩，水域的 minimap_color 混色在其上叠加。
    const toned = toneMapNoise(bitmap)

    if (toned) {
      bitmap.close?.()
      textures.set(asset.name, toned)
    } else {
      textures.set(asset.name, bitmap)
    }
  }))

  return textures
}

/** 解码图标图集：一张 PNG + 每个图标的裁剪矩形。 */
async function decodeMapIconAtlas(payload) {
  const rects = new Map()
  const atlas = payload.iconAtlas

  if (!atlas) {
    return { image: null, rects }
  }

  for (const [name, rect] of Object.entries(atlas.rects || {})) {
    if (Array.isArray(rect) && rect.length === 4) {
      rects.set(name, rect)
    }
  }

  return {
    image: atlas.png ? await decodePngBase64(atlas.png) : null,
    rects,
  }
}

/** 解析大端 uint16 格阵。 */
export function decodeTiles(raw, width, height) {
  const total = width * height
  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength)
  const tiles = new Uint16Array(total)

  if (raw.byteLength < total * 2) {
    throw new Error(`地图地形数据不完整（${raw.byteLength}/${total * 2} 字节）`)
  }

  for (let index = 0; index < total; index++) {
    tiles[index] = view.getUint16(index * 2, false)
  }

  return tiles
}

/** 解析定长物体记录；prefab 索引越界的记录直接丢弃。 */
export function decodeObjects(raw, prefabCount) {
  const total = Math.floor(raw.byteLength / OBJECT_RECORD_BYTES)
  const prefabIndex = new Uint16Array(total)
  const x = new Float32Array(total)
  const z = new Float32Array(total)
  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength)
  let written = 0

  for (let index = 0; index < total; index++) {
    const offset = index * OBJECT_RECORD_BYTES
    const prefab = view.getUint16(offset, true)

    if (prefab >= prefabCount) {
      continue
    }

    prefabIndex[written] = prefab
    x[written] = view.getInt32(offset + 2, true) / COORDINATE_SCALE
    z[written] = view.getInt32(offset + 6, true) / COORDINATE_SCALE
    written++
  }

  return {
    prefabIndex: prefabIndex.subarray(0, written),
    x: x.subarray(0, written),
    z: z.subarray(0, written),
    count: written,
  }
}

/** 一次遍历得到资源榜、图层构成与地形占比。 */
export function buildWorldMapIndex(payload, tiles, objects, prefabs) {
  const countByPrefab = new Int32Array(prefabs.length)
  const firstByPrefab = new Int32Array(prefabs.length).fill(-1)
  const layerCounts = new Map()

  for (let index = 0; index < objects.count; index++) {
    const prefabIndex = objects.prefabIndex[index]

    countByPrefab[prefabIndex]++
    if (firstByPrefab[prefabIndex] < 0) {
      firstByPrefab[prefabIndex] = index
    }
    const layer = prefabs[prefabIndex]?.layer || 'other'

    layerCounts.set(layer, (layerCounts.get(layer) || 0) + 1)
  }

  const terrainCounts = new Map()

  for (let index = 0; index < tiles.length; index++) {
    terrainCounts.set(tiles[index], (terrainCounts.get(tiles[index]) || 0) + 1)
  }

  return {
    countByPrefab,
    firstByPrefab,
    layerCounts,
    terrainCounts,
    labels: payload.labels || [],
  }
}

function hashCell(x, y) {
  let value = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)

  value = Math.imul(value ^ (value >>> 13), 1274126177)

  return ((value ^ (value >>> 16)) >>> 0) / 4294967295
}

/**
 * 逐格烘焙一张 width×height 的地形位图：行 0 是最北（与载荷行序一致）。
 *
 * 有地形噪声贴图时用贴图平均色作底色；没有贴图（或贴图损坏）时退回内置色板。
 * 缩到全图时每格只有一两个像素，平均色位图比逐格贴图更清晰也更快。
 */
export function buildTerrainCanvas(payload, tiles, tileById, textures = new Map()) {
  const width = payload.width
  const height = payload.height
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return { canvas: null, tileColors: new Map() }
  }

  const image = ctx.createImageData(width, height)
  const colors = new Map()
  const textureColors = new Map()
  const tileColors = new Map()

  const colorForTile = tileId => {
    const spec = tileById.get(tileId)
    const key = spec?.noise

    if (key && textures.has(key)) {
      let rgb = textureColors.get(key)

      if (!rgb) {
        rgb = averageColor(textures.get(key))
        textureColors.set(key, rgb)
      }

      return rgb
    }

    return colorToRgb(tileHexColor(spec?.name))
  }

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width

    for (let x = 0; x < width; x++) {
      const tileId = tiles[rowOffset + x]
      let rgb = colors.get(tileId)

      if (!rgb) {
        rgb = colorForTile(tileId)
        colors.set(tileId, rgb)
        tileColors.set(tileId, rgbToHex(rgb))
      }

      const border = (x > 0 && tiles[rowOffset + x - 1] !== tileId) ||
        (x < width - 1 && tiles[rowOffset + x + 1] !== tileId) ||
        (y > 0 && tiles[rowOffset - width + x] !== tileId) ||
        (y < height - 1 && tiles[rowOffset + width + x] !== tileId)

      const scale = (border ? 0.9 : 1) * (0.96 + hashCell(x, y) * 0.08)
      const offset = (rowOffset + x) * 4

      image.data[offset] = Math.min(255, rgb[0] * scale)
      image.data[offset + 1] = Math.min(255, rgb[1] * scale)
      image.data[offset + 2] = Math.min(255, rgb[2] * scale)
      image.data[offset + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)

  return { canvas, tileColors }
}

/** 过滤非法骸骨坐标，一个坏条目不该让整张地图解不出来。 */
export function decodeSkeletons(raw) {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.filter(item => item && Number.isFinite(Number(item.x)) && Number.isFinite(Number(item.z)))
}

/** 解码完整地图载荷。 */
export async function decodeWorldMap(payload) {
  if (!payload || !payload.tiles || !payload.objects) {
    throw new Error('地图数据不完整')
  }

  const width = Number(payload.width) || 0
  const height = Number(payload.height) || 0

  if (width < 1 || height < 1) {
    throw new Error('地图尺寸不合法')
  }

  const [tilesRaw, objectsRaw, textures, iconAtlas] = await Promise.all([
    inflateZlibBase64(payload.tiles),
    inflateZlibBase64(payload.objects),
    decodeMapTextures(payload),
    decodeMapIconAtlas(payload),
  ])

  const tiles = decodeTiles(tilesRaw, width, height)

  const prefabs = (payload.prefabs || []).map(prefab => ({
    name: prefab.name,
    layer: prefab.layer,
    icon: prefab.icon,
    zh: prefab.zh,
    en: prefab.en,
  }))

  const objects = decodeObjects(objectsRaw, prefabs.length)
  const tileById = new Map()

  for (const spec of payload.tileSpecs || []) {
    let noise

    if (spec.noise) {
      noise = spec.noise

      // 带 minimap_color 的地形（海面等）在本地按颜色生成一份贴图副本。
      if (spec.tint) {
        const tintedKey = textureKey(spec.noise, spec.tint)

        if (!textures.has(tintedKey)) {
          const base = textures.get(spec.noise)
          const tinted = base ? tintBitmap(base, spec.tint) : null

          if (tinted) {
            textures.set(tintedKey, tinted)
          }
        }
        if (textures.has(tintedKey)) {
          noise = tintedKey
        }
      }
    }

    tileById.set(spec.id, { name: spec.name, noise })
  }

  const terrain = buildTerrainCanvas(payload, tiles, tileById, textures)

  return {
    payload,
    width,
    height,
    tiles,
    objects,
    prefabs,
    tileById,
    textures,
    iconAtlas: iconAtlas.image,
    iconRects: iconAtlas.rects,
    terrainCanvas: terrain.canvas,
    tileColors: terrain.tileColors,
    skeletons: decodeSkeletons(payload.skeletons),
    labels: payload.labels || [],
    wormholes: payload.wormholes || [],
    index: buildWorldMapIndex(payload, tiles, objects, prefabs),
  }
}

/** prefab 的显示名：优先中文/英文名，退回到内部名。 */
export function prefabDisplayName(prefab, lang = 'zh') {
  if (!prefab) {
    return ''
  }

  if (lang === 'en') {
    return prefab.en || prefab.name
  }

  return prefab.zh || prefab.name
}

/** 资源榜：按实例数排序。 */
export function rankResources(map, limit = 14) {
  const rows = []

  for (let prefabIndex = 0; prefabIndex < map.prefabs.length; prefabIndex++) {
    const count = map.index.countByPrefab[prefabIndex]

    if (!count) {
      continue
    }

    const prefab = map.prefabs[prefabIndex]

    rows.push({
      prefabIndex,
      name: prefab.name,
      zh: prefab.zh || prefab.name,
      en: prefab.en || '',
      layer: prefab.layer,
      count,
    })
  }

  rows.sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))

  const top = rows.slice(0, limit)
  const total = rows.reduce((sum, row) => sum + row.count, 0) || 1

  for (const row of top) {
    row.share = row.count / total
  }

  return top
}

/** 地形构成：按格子数排序。 */
export function rankTerrain(map, lang = 'zh', limit = 10) {
  const total = map.tiles.length || 1

  const rows = [...map.index.terrainCounts.entries()].map(([tileId, count]) => {
    const spec = map.tileById.get(tileId)

    return {
      tileId,
      count,
      share: count / total,
      label: spec ? groundLabel(spec.name, lang) : `#${tileId}`,
      color: map.tileColors?.get(tileId) || tileHexColor(spec?.name),
    }
  })

  rows.sort((left, right) => right.count - left.count)

  return {
    rows: rows.slice(0, limit),
    totalTiles: map.tiles.length,
    kinds: rows.length,
  }
}

/** 地标索引：地标图层上每个实例的名字与坐标。 */
export function listLandmarks(map, lang = 'zh') {
  const rows = []

  for (let objectIndex = 0; objectIndex < map.objects.count; objectIndex++) {
    const prefab = map.prefabs[map.objects.prefabIndex[objectIndex]]

    if (!prefab || prefab.layer !== 'landmark') {
      continue
    }

    rows.push({
      name: prefab.name,
      label: prefabDisplayName(prefab, lang),
      x: map.objects.x[objectIndex],
      z: map.objects.z[objectIndex],
      objectIndex,
    })
  }

  return rows
}

export function clampZoom(zoom) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

/** 适应视口的缩放（像素/格），整张图留 6% 边距。 */
export function fitZoom(width, height, viewportWidth, viewportHeight) {
  const tiles = Math.max(width, height) * TILE_WORLD * 1.06

  if (!tiles || viewportWidth <= 0 || viewportHeight <= 0) {
    return MIN_ZOOM
  }

  return clampZoom(Math.min(viewportWidth / tiles, viewportHeight / tiles))
}

/** 世界坐标 → 画布坐标（世界 +z 朝北，画布 y 向下，故取反）。 */
export function worldToMap(x, z) {
  return { mx: x, my: -z }
}

/** 相机投影：世界坐标 → 屏幕坐标。 */
export function projectWorld(x, z, camera, width, height) {
  const pxPerWorld = camera.zoom / TILE_WORLD
  const dx = x - camera.cx
  const dy = -z - camera.cz
  const cos = Math.cos(camera.rotation)
  const sin = Math.sin(camera.rotation)

  return {
    x: (dx * cos - dy * sin) * pxPerWorld + width / 2,
    y: (dx * sin + dy * cos) * pxPerWorld + height / 2,
  }
}

/** 屏幕坐标 → 世界坐标（拖动/缩放锚点用）。 */
export function unprojectScreen(screenX, screenY, camera, width, height) {
  const pxPerWorld = camera.zoom / TILE_WORLD
  const dx = (screenX - width / 2) / pxPerWorld
  const dy = (screenY - height / 2) / pxPerWorld
  const cos = Math.cos(-camera.rotation)
  const sin = Math.sin(-camera.rotation)

  return {
    x: camera.cx + dx * cos - dy * sin,
    z: -(camera.cz + dx * sin + dy * cos),
  }
}

/** 命名匹配（中文/英文/内部名）。 */
export function searchPrefabs(map, query, lang = 'zh') {
  const needle = query.trim().toLowerCase()

  if (!needle) {
    return []
  }

  const matches = []

  for (let prefabIndex = 0; prefabIndex < map.prefabs.length; prefabIndex++) {
    const prefab = map.prefabs[prefabIndex]
    const count = map.index.countByPrefab[prefabIndex]

    if (!count) {
      continue
    }

    const zh = prefab.zh || ''
    const en = prefab.en || ''

    const hit = prefab.name.toLowerCase().includes(needle) ||
      zh.includes(query.trim()) ||
      en.toLowerCase().includes(needle)

    if (!hit) {
      continue
    }

    matches.push({
      prefabIndex,
      name: prefab.name,
      label: prefabDisplayName(prefab, lang),
      count,
    })
  }

  return matches.sort((left, right) => right.count - left.count)
}

/** 相对时间：实时位置按秒，其余按分钟/小时/天。 */
export function relativeTime(value, lang = 'zh') {
  const timestamp = Date.parse(value)

  if (Number.isNaN(timestamp)) {
    return ''
  }

  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000))
  const en = lang === 'en'

  if (seconds < 5) {
    return en ? 'just now' : '刚刚'
  }
  if (seconds < 60) {
    return en ? `${seconds}s ago` : `${seconds} 秒前`
  }

  const minutes = Math.round(seconds / 60)

  if (minutes < 60) {
    return en ? `${minutes}m ago` : `${minutes} 分钟前`
  }

  const hours = Math.round(minutes / 60)

  if (hours < 24) {
    return en ? `${hours}h ago` : `${hours} 小时前`
  }

  const days = Math.round(hours / 24)

  return en ? `${days}d ago` : `${days} 天前`
}

/** 秒数说成人话（相位剩余时间等）。 */
export function humanSeconds(seconds, lang = 'zh') {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '—'
  }

  const en = lang === 'en'

  if (seconds < 90) {
    return en ? `${Math.round(seconds)}s` : `${Math.round(seconds)} 秒`
  }
  if (seconds < 5400) {
    return en ? `${Math.round(seconds / 60)}min` : `${Math.round(seconds / 60)} 分钟`
  }

  return en ? `${(seconds / 3600).toFixed(1)}h` : `${(seconds / 3600).toFixed(1)} 小时`
}

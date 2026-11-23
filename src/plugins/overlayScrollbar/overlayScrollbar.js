/**
 * 👉 全局覆盖式滚动条
 *
 * 设计：
 * - 原生滚动条由 CSS（`@media (hover: hover)` 下 `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`）隐藏
 * - 这里只负责“画”：指针进入某个可滚动元素时，在它的可见边缘浮出一条滑块；离开即淡出
 * - 滚动、拖拽仍然作用在该元素的原生 scrollTop / scrollLeft 上，因此代码编辑器（CodeMirror）、
 *   文本域、表格、虚拟滚动等一律兼容，不需要逐个组件改造
 * - 只在支持 hover 的设备上启用；触屏设备交给系统滚动条
 */

const RAIL_SIZE = 10
const INSET = 2
const MIN_THUMB_SIZE = 24
const HOVER_QUERY = '(hover: hover)'

const state = {
  root: null,
  bars: { x: null, y: null },
  thumbs: { x: null, y: null },
  geometry: { x: null, y: null },
  target: null,
  hovered: null,
  frame: 0,
  dragging: null,
  endDrag: null,
  started: false,
}

const isRootScroller = el => el === document.scrollingElement || el === document.documentElement

const getOverflow = (el, axis) => {
  const style = getComputedStyle(el)
  const overflow = axis === 'y' ? style.overflowY : style.overflowX

  if (overflow !== 'auto' && overflow !== 'scroll' && overflow !== 'overlay') return 0

  return axis === 'y' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth
}

const isScrollable = (el, axis) => getOverflow(el, axis) > 1

// 从指针所在元素向上找最近的可滚动祖先；找不到时回落到页面根滚动容器
const findTarget = node => {
  let el = node instanceof Element ? node : null

  while (el && el !== document.body && el !== document.documentElement) {
    if (isScrollable(el, 'y') || isScrollable(el, 'x')) return el
    el = el.parentElement
  }

  const root = document.scrollingElement || document.documentElement

  return isScrollable(root, 'y') || isScrollable(root, 'x') ? root : null
}

// 滚动容器可能被祖先裁剪（例如 CodeMirror 的 .CodeMirror-scroll 比编辑器本体大 50px），
// 这里取“实际可见区域”，保证滑块贴在用户看到的边缘上
const getVisibleBox = el => {
  if (isRootScroller(el)) {
    return {
      top: 0,
      left: 0,
      right: innerWidth,
      bottom: innerHeight,
      width: innerWidth,
      height: innerHeight,
    }
  }

  const rect = el.getBoundingClientRect()
  let top = rect.top
  let left = rect.left
  let right = rect.right
  let bottom = rect.bottom

  let parent = el.parentElement

  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = getComputedStyle(parent)

    if (style.overflowX !== 'visible' || style.overflowY !== 'visible') {
      const parentRect = parent.getBoundingClientRect()

      top = Math.max(top, parentRect.top)
      left = Math.max(left, parentRect.left)
      right = Math.min(right, parentRect.right)
      bottom = Math.min(bottom, parentRect.bottom)
    }

    parent = parent.parentElement
  }

  top = Math.max(top, 0)
  left = Math.max(left, 0)
  right = Math.min(right, innerWidth)
  bottom = Math.min(bottom, innerHeight)

  return {
    top,
    left,
    right,
    bottom,
    width: Math.max(right - left, 0),
    height: Math.max(bottom - top, 0),
  }
}

const hide = () => {
  state.target = null
  state.geometry.x = null
  state.geometry.y = null
  state.bars.x?.classList.remove('is-visible')
  state.bars.y?.classList.remove('is-visible')
}

const applyBar = (axis, el, box, overflow) => {
  const isVertical = axis === 'y'
  const bar = state.bars[axis]
  const thumb = state.thumbs[axis]
  const track = (isVertical ? box.height : box.width) - INSET * 2

  if (overflow <= 1 || track <= 0) {
    bar.classList.remove('is-visible')
    state.geometry[axis] = null

    return
  }

  const viewport = isVertical ? el.clientHeight : el.clientWidth
  const content = isVertical ? el.scrollHeight : el.scrollWidth
  const scroll = isVertical ? el.scrollTop : el.scrollLeft
  const thumbSize = Math.min(Math.max(Math.round((track * viewport) / content), MIN_THUMB_SIZE), track)
  const maxOffset = Math.max(track - thumbSize, 0)
  const offset = maxOffset === 0 ? 0 : Math.round((scroll / overflow) * maxOffset)

  if (isVertical) {
    bar.style.top = `${box.top}px`
    bar.style.left = `${box.right - RAIL_SIZE}px`
    bar.style.width = `${RAIL_SIZE}px`
    bar.style.height = `${box.height}px`

    thumb.style.top = `${INSET + offset}px`
    thumb.style.bottom = 'auto'
    thumb.style.left = `${INSET}px`
    thumb.style.right = `${INSET}px`
    thumb.style.width = 'auto'
    thumb.style.height = `${thumbSize}px`
  } else {
    bar.style.top = `${box.bottom - RAIL_SIZE}px`
    bar.style.left = `${box.left}px`
    bar.style.width = `${box.width}px`
    bar.style.height = `${RAIL_SIZE}px`

    thumb.style.top = `${INSET}px`
    thumb.style.bottom = `${INSET}px`
    thumb.style.left = `${INSET + offset}px`
    thumb.style.right = 'auto'
    thumb.style.width = `${thumbSize}px`
    thumb.style.height = 'auto'
  }

  state.geometry[axis] = { maxOffset, scrollRange: overflow, track }
  bar.classList.add('is-visible')
}

const render = () => {
  const el = state.target

  if (!el || !el.isConnected) {
    hide()

    return
  }

  const box = getVisibleBox(el)

  applyBar('y', el, box, getOverflow(el, 'y'))
  applyBar('x', el, box, getOverflow(el, 'x'))

  if (!state.geometry.y && !state.geometry.x) hide()
}

const refresh = () => {
  if (state.dragging) return

  if (!state.frame) {
    state.frame = requestAnimationFrame(() => {
      state.frame = 0

      if (state.dragging) return

      const el = findTarget(state.hovered)

      if (!el) {
        hide()

        return
      }

      state.target = el
      render()
    })
  }
}

const handlePointerMove = event => {
  if (state.dragging) return

  // 指针落在滚动条自身（滑块）上时保持当前目标，不要把它当成“离开”
  if (state.root.contains(event.target)) return

  state.hovered = event.target
  refresh()
}

const handlePointerLeaveDocument = () => {
  if (state.dragging) {
    state.endDrag?.()

    return
  }

  state.hovered = null
  hide()
}

const handleThumbPointerDown = axis => event => {
  const el = state.target
  const geometry = state.geometry[axis]

  if (!el || !geometry || event.button !== 0) return

  event.preventDefault()

  const thumb = event.currentTarget
  const bar = thumb.parentElement
  const isVertical = axis === 'y'
  const startPointer = isVertical ? event.clientY : event.clientX
  const startScroll = isVertical ? el.scrollTop : el.scrollLeft

  bar.classList.add('is-dragging')

  // 拖拽期间整页保持默认光标，避免经过文字/链接时闪现 I-beam、pointer
  document.body.classList.add('overlay-scrollbars--dragging')
  state.dragging = { axis }

  // 指针捕获在个别环境会失败，失败也不能影响后续监听
  try {
    thumb.setPointerCapture?.(event.pointerId)
  } catch {
    // 忽略：下面在 window 上监听 move/up，不依赖捕获
  }

  const handleMove = moveEvent => {
    if (!geometry.maxOffset) return

    const delta = (isVertical ? moveEvent.clientY : moveEvent.clientX) - startPointer
    const nextScroll = startScroll + (delta / geometry.maxOffset) * geometry.scrollRange

    if (isVertical) el.scrollTop = nextScroll
    else el.scrollLeft = nextScroll
  }

  const handleEnd = () => {
    if (!state.dragging) return

    state.dragging = null
    state.endDrag = null
    bar.classList.remove('is-dragging')
    document.body.classList.remove('overlay-scrollbars--dragging')

    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleEnd)
    window.removeEventListener('pointercancel', handleEnd)

    try {
      thumb.releasePointerCapture?.(event.pointerId)
    } catch {
      // 忽略
    }

    render()
  }

  state.endDrag = handleEnd

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleEnd)
  window.addEventListener('pointercancel', handleEnd)
}

const createDom = () => {
  const root = document.createElement('div')

  root.className = 'overlay-scrollbars'

  for (const axis of ['y', 'x']) {
    const bar = document.createElement('div')

    bar.className = 'overlay-scrollbars__bar'
    bar.dataset.axis = axis

    const thumb = document.createElement('div')

    thumb.className = 'overlay-scrollbars__thumb'
    thumb.addEventListener('pointerdown', handleThumbPointerDown(axis))
    bar.appendChild(thumb)

    root.appendChild(bar)

    state.bars[axis] = bar
    state.thumbs[axis] = thumb
  }

  document.body.appendChild(root)
  state.root = root
}

export const startOverlayScrollbars = () => {
  if (state.started) return
  if (typeof window === 'undefined' || !window.matchMedia) return
  if (!window.matchMedia(HOVER_QUERY).matches) return

  // HMR 重新执行模块时避免重复创建
  if (document.querySelector('.overlay-scrollbars')) return

  createDom()

  document.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.addEventListener('pointerleave', handlePointerLeaveDocument)
  window.addEventListener('resize', render)

  // 任何滚动都同步更新（同时处理“祖先滚动导致容器位置变化”的情况）
  document.addEventListener('scroll', () => {
    if (state.target) render()
  }, true)

  state.started = true
}

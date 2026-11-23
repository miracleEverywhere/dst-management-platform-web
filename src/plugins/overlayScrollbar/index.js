import { startOverlayScrollbars } from './overlayScrollbar'

// 全局覆盖式滚动条：原生滚动条隐藏，指针进入可滚动区域时才浮出滑块
export default function () {
  startOverlayScrollbars()
}

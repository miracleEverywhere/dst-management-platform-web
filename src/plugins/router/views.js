// 主版本（standard）的视图注册表。
//
// 该文件通过 vite.config.js 中的 `@views-registry` 别名按构建形态选择：
// standard 用本文件，lite 用 views.lite.js。这样未选中的页面不会进入模块图，
// 也就不会生成对应的 chunk（import.meta.glob 是在构建期完全展开的，
// 只靠运行时的 `IsLite` 判断无法把页面从产物里去掉）。
//
// 排除 lite 专属页面：主版本的后端菜单不会指向它们。
// 登录页不走菜单，单独导出 loginView，避免两份登录页同时被打包。
//
// 注意：必须使用别名（@/...）而不是相对路径，Vite 生成的 key 才是
// `/src/views/...` 形式，createDynamicRouter 按这个 key 取组件。
export const loginView = () => import('@/views/login/index.vue')

export default import.meta.glob([
  '@/views/**/*.vue',
  '!@/views/lite/**',
  '!@/views/login/**',
])

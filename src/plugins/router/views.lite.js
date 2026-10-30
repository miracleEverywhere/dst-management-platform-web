// Lite 版本的视图注册表。
//
// lite 后端返回的菜单（lite/api/user.go 的 menuGet）只引用 lite/* 下的组件，
// 因此这里只匹配 src/views/lite，主版本页面不会被打进 lite 产物。
// 该文件通过 vite.config.js 中的 `@views-registry` 别名在 lite 模式下启用。
//
// 登录页不走菜单，单独导出 loginView，避免主版本登录页被一起打包。
//
// 注意：必须使用别名（@/...）而不是相对路径，Vite 生成的 key 才是
// `/src/views/...` 形式，createDynamicRouter 按这个 key 取组件。
export const loginView = () => import('@/views/login/lite.vue')

export default import.meta.glob('@/views/lite/**/*.vue')

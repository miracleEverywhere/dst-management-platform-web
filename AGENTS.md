# AGENTS.md

本文件用于指导 Codex（Codex.ai/code）在此代码仓库中开展工作。

## 项目概述

本项目是 [DMP（Don't Starve Together Management Platform）](https://github.com/miracleEverywhere/dst-management-platform-api) 的前端，是一个用于管理《饥荒联机版》（DST）游戏服务器的 Web 管理后台。项目基于 [materio-vuetify-vuejs-admin-template](https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free) 构建，standard 形态的构建产物会嵌入 Go 后端的 `embedFS/dist` 目录。

同一套代码在构建期产出两种形态：

- **standard**（默认）：完整版本，包含房间列表、游戏管理、工具、平台设置等全部页面。
- **lite**：精简版本，只保留控制面板、房间配置、地面/洞穴、模组与日志，面向单房间部署，构建产物输出到 `dist-lite/`。

**技术栈：** Vue 3（Composition API）、Vite 8、Vuetify 3、Pinia 3、Vue Router 4（Hash 模式）、Vue I18n、ECharts 5、Axios

## 常用命令

```bash
pnpm run dev          # 启动开发服务器（固定端口 5173）
pnpm run dev:lite     # 以 lite 形态启动开发服务器（vite --mode lite）
pnpm run build        # 执行生产环境构建（输出 dist/）
pnpm run build:lite   # 构建 lite 版本（vite --mode lite，输出 dist-lite/）
pnpm run lint         # 运行 ESLint 并自动修复（.eslintrc.cjs）
pnpm run preview      # 预览生产构建（端口 5050）
pnpm run build:icons  # 构建 Iconify 图标包（postinstall 时自动运行）
```

项目目前没有测试套件。`dist/` 用于嵌入后端，`dist-lite/` 已被 `.gitignore` 忽略；验证 lite 相关改动时需使用带 `:lite` 的命令，两种形态的产物不要混用。

## 项目架构

### 插件自动注册（`src/@core/utils/plugins.js`）

入口文件 `src/main.js` 会调用 `registerPlugins(app)`。该函数使用 `import.meta.glob` 扫描 `src/plugins/**/index.{ts,js}` 和 `src/plugins/*.{ts,js}` 文件。每个插件文件默认导出一个函数，该函数接收 Vue 应用实例并调用 `app.use(...)`。插件按文件名的字母顺序加载。

### 路由（`src/plugins/router/`）

项目使用 Hash 模式的路由历史。`routes.js` 中定义的静态路由很少，仅包含 `/login` 和一个捕获所有未匹配路径的错误页面。用户登录后，通过 `createDynamicRouter(router, userStore.menus)` 创建动态路由；后端返回的菜单树会映射到视图组件。

视图组件不再由路由文件直接 `import.meta.glob` 全量扫描，而是从 `@views-registry`（按形态二选一，见下文“应用形态”）导入模块映射；`createDynamicRouter` 以 `/src/views/<component>.vue` 为 key 取组件，取不到时打印 `console.warn` 并跳过该菜单。

首页路径由 `IsLite` 决定：standard 为 `/rooms`，lite 为 `/dashboard`。`/profile` 路由只在 standard 下注册——lite 后端没有用户信息接口。

`src/plugins/router/index.js` 中的路由守卫会将未登录用户重定向到 `/login`，并在登录后的首次导航中注入动态路由；已登录用户访问 `/login` 时同样按上面的首页路径跳转。

### 应用形态：standard 与 lite

`src/config/index.js` 从 `import.meta.env.VITE_APP_MODE` 读取 `AppMode`（缺省为 `"standard"`），并导出 `IsLite = AppMode === "lite"`。构建期由 `.env.lite` 中的 `VITE_APP_MODE=lite`（配合 `vite --mode lite`）切换到 lite 形态。

- `vite.config.js` 是函数式 `defineConfig(({ mode }) => ...)`，内部用 `loadEnv(mode, projectRoot, '')` 读取同一个变量，据此决定 `@views-registry` 指向哪份注册表，使构建期与运行期的形态判断保持一致。
- 两份注册表都默认导出一个 `import.meta.glob` 模块映射，并具名导出 `loginView`：standard 用 `views.js`（扫描 `@/views/**/*.vue`，排除 `@/views/lite/**` 与 `@/views/login/**`），lite 用 `views.lite.js`（只扫描 `@/views/lite/**`）。未被选中的页面不会进入模块图，也就不会产出对应 chunk——只靠运行时的 `IsLite` 判断做不到这一点。
- glob 必须以别名（`@/views/...`）书写，保证生成的 key 是 `/src/views/...`，与 `createDynamicRouter` 的取键方式一致；写成相对路径会导致动态路由全部取不到组件。

lite 形态的入口与数据：

- 登录页为 `src/views/login/lite.vue`（登录 + 首次使用的注册弹窗）。登录成功后从 `/menu` 拉取菜单写入 `userStore.menus`，把 `language` 固定为 `zh`，然后跳转 `/dashboard`。
- 接口集中在 `src/api/lite.js`，走 lite 后端精简后的顶层接口（`/register`、`/login`、`/menu`、`/platform/game_version`、`/room`、`/ground`、`/cave`、`/mod`、`/sys`、`/cc`、`/log`、`/exec`），与主版本按业务域划分的 `src/api/*.js` 不同，不要混用。
- 共享代码用 `IsLite` 分支适配，而不是复制组件：`main.js` 把标题设为 `DMP Lite`；`App.vue` 不再渲染 `ReadmeDialog`（首次登录的使用说明确认）；`DefaultLayoutWithVerticalNav.vue` 用 `DMP Lite` 标签加 `LiteHeaderInfo`（游戏版本）替换 `HeaderMain`/`Document`/`LangSelect`；`NavItems.vue` 使用写死的中文菜单标题表 `liteMenuTitles`；`NavHeader.vue`、`Github.vue`、`UserProfile.vue`（额外隐藏“个人中心”入口）同样按 `IsLite` 输出中文文案。

### 状态管理（`src/plugins/store/`）

项目包含两个 Pinia Store，二者都持久化到 `localStorage`，键名前缀为 `dmp-`：

- **`user`**（`user.js`）：保存 `token`、`userInfo`（`username`、`nickname`、`role`、`avatar`，以及 `roomCreation`、`maxWorlds`、`maxPlayers` 等权限）和 `menus`（后端返回的动态路由树）。
- **`global`**（`global.js`）：保存主题、语言、当前房间上下文（`id`、`gameName`），以及游戏与 DMP 的版本信息。

### API 层（`src/api/`、`src/utils/axios.js`）

`src/api/` 中的每个业务域都有对应文件，以嵌套对象形式导出接口定义，接口包含 `url` 和 HTTP 方法（`get`、`post`、`put`、`delete`）。所有接口都使用 `src/utils/axios.js` 中的共享 Axios 实例，该实例具有以下行为：

- 基础 URL 为 `/api/v3`，版本号取自配置中的 `ApiVersion`。
- 每个请求都会发送 `X-DMP-TOKEN` 请求头。
- 每个请求都会发送用于国际化的 `X-I18n-Lang` 请求头。
- 响应状态码为 420 时，清除认证信息并跳转到登录页。
- 响应状态码不是 200 时，显示 Snackbar 错误提示并拒绝 Promise。
- 请求成功时直接返回 `response.data`，调用方获取的是已解包的数据。

`src/api/lite.js` 是 lite 形态专用的精简接口集合，路径为顶层形式（`/room`、`/ground`、`/log` 等），由 `src/views/lite/**` 与 `src/views/login/lite.vue` 使用；不要在两份 API 之间混用路径。

### 布局系统

以下两个目录之间存在强制边界：

- **`src/@core/`**：基础主题层，包含 SCSS 基础设施（变量、Mixin、工具类）和共享 SCSS 组件，可由基础布局和自定义布局共同引用。
- **`src/@layouts/`**：布局框架层，包含 `VerticalNavLayout` 组件、导航工具以及布局枚举和类型。**该目录不能从 `@core/` 导入内容**，此限制由 ESLint 正则规则强制执行。

应用布局位于 `src/layouts/`：

- `blank.vue`：用于登录页和错误页的最简布局。
- `default.vue`：主布局，封装 `DefaultLayoutWithVerticalNav`，并通过 `provide("refresh", ...)` 提供页面重新渲染能力。

`DefaultLayoutWithVerticalNav.vue` 是两种形态共用的导航框架：standard 下显示 `HeaderMain`、`Document`、`LangSelect`，lite 下不渲染这三个组件，改为 `DMP Lite` 标签与 `LiteHeaderInfo`（游戏版本）。

### 配置（`src/config/index.js`）

- `PiniaPrefix` = `"dmp-"`
- `Version`：当前应用版本。
- `ApiVersion` = `"v3"`，用作 Axios 的 `baseURL`。
- `AppMode`：应用形态，取自 `VITE_APP_MODE`，缺省 `"standard"`。
- `IsLite`：`AppMode === "lite"`，所有形态分支判断都读它。
- `GamePortFactor`：DST 服务器各组件的端口偏移常量。

### 国际化（`src/languages/`）

项目包含两个语言文件：`lang-zh.js` 和 `lang-en.js`。国际化基于 `vue-i18n`，使用 Composition API 模式。语言设置会持久化到全局 Store；首次加载时根据浏览器语言初始化。Vuetify 的语言环境会单独同步。

Lite 形态不使用 i18n：`src/views/lite/**`、`src/views/login/lite.vue` 的文案直接写中文；共享组件（`NavItems.vue` 的 `liteMenuTitles`、`NavHeader.vue`、`Github.vue`、`UserProfile.vue` 等）通过 `IsLite` 分支给出中文，登录时还会强制 `globalStore.language = 'zh'`。i18n 插件仍会注册，因此 lite 页面里不要依赖 `t()` 取文案，也不要往语言包里加 lite 专用键。

### 路径别名（定义于 `vite.config.js`）

| 别名 | 路径 |
| --- | --- |
| `@` | `src/` |
| `@core` | `src/@core/` |
| `@layouts` | `src/@layouts/` |
| `@images` | `src/assets/images/` |
| `@styles` | `src/assets/styles/` |
| `@store` | `src/plugins/store/` |
| `@views-registry` | 视图注册表，按 `VITE_APP_MODE` 二选一：standard → `src/plugins/router/views.js`，lite → `src/plugins/router/views.lite.js` |

### 自动导入

项目通过 `unplugin-auto-import` 配置自动导入，`vue`、`vue-router`、`@vueuse/core`、`@vueuse/math` 和 `pinia` 中的 API 无需显式导入即可使用。`src/@core/components` 和 `src/components` 中的组件会自动注册。

### 自定义指令（`src/directives/`）

目前仅包含 `v-copy`，用于将内容复制到剪贴板。

### 视图目录结构（`src/views/`）

| 目录 | 用途 |
| --- | --- |
| `login/` | 登录与注册；`index.vue` 为 standard 登录页，`lite.vue` 为 lite 登录页 |
| `dashboard/` | 仪表盘，展示服务器信息和系统统计数据 |
| `rooms/` | 房间列表，也是 standard 的默认入口页面 |
| `game/` | 游戏管理，包括基础设置、模组和玩家管理 |
| `tools/` | 服务器工具，包括公告、备份、地图查看器、快照和令牌管理 |
| `logs/` | 聊天日志、游戏日志、访问日志、下载日志和清理日志 |
| `platform/` | 平台设置 |
| `profile/` | 用户资料与账号设置 |
| `install/` | DST 服务器安装向导 |
| `upload/` | 存档导入 |
| `lite/` | lite 形态的全部页面：`dashboard/`（房间概览 + 系统指标）、`room/`（单房间配置）、`world/`（地面、洞穴、模组）、`log/`（聊天、游戏日志）、`components/`（`WorldConfig`、`LogViewer` 等 lite 内复用组件） |

`src/views/lite/` 只会在 lite 构建中被收录，standard 构建不会打包它。

## 代码规范

- Vue 文件使用 `<script setup>` 和 Composition API。
- JavaScript 不使用分号（`semi: never`）。
- 使用 2 个空格缩进。
- 多行结构保留尾随逗号（`comma-dangle: always-multiline`）。
- 强制使用驼峰命名法。
- 模板中的组件名使用 kebab-case。
- 图标仅允许使用 `ri`（Remix Icons）前缀，此规则由 ESLint 正则规则强制执行。
- 图片导入使用 `@images` 别名，Store 导入使用 `@store` 别名，此规则由 ESLint 正则规则强制执行。
- 形态判断统一读 `src/config` 导出的 `IsLite`，不要在业务代码里直接访问 `import.meta.env.VITE_APP_MODE`。
- lite 专属页面必须放在 `src/views/lite/` 下（lite 注册表是白名单 glob），standard 页面不要放进该目录；新增页面后要确认对应注册表的 glob 能覆盖到它。
- 共享布局/组件需要适配 lite 时加 `IsLite` 分支，不要复制一份组件或新建 lite 专用布局。
- 后端菜单项里的 `component` 必须与 `src/views/<component>.vue` 的真实路径一致，否则该菜单会被跳过（只在控制台打印警告，不会报错）。

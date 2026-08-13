# AGENTS.md

本文件用于指导 Codex（Codex.ai/code）在此代码仓库中开展工作。

## 项目概述

本项目是 [DMP（Don't Starve Together Management Platform）](https://github.com/miracleEverywhere/dst-management-platform-api) 的前端，是一个用于管理《饥荒联机版》（DST）游戏服务器的 Web 管理后台。项目基于 [materio-vuetify-vuejs-admin-template](https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free) 构建，构建产物会嵌入 Go 后端的 `embedFS/dist` 目录。

**技术栈：** Vue 3（Composition API）、Vite 7、Vuetify 3、Pinia 3、Vue Router 4（Hash 模式）、Vue I18n、ECharts 5、Axios

## 常用命令

```bash
pnpm run dev          # 启动开发服务器（固定端口 5173）
pnpm run build        # 执行生产环境构建
pnpm run lint         # 运行 ESLint 并自动修复（.eslintrc.cjs）
pnpm run preview      # 预览生产构建（端口 5050）
pnpm run build:icons  # 构建 Iconify 图标包（postinstall 时自动运行）
```

项目目前没有测试套件。

## 项目架构

### 插件自动注册（`src/@core/utils/plugins.js`）

入口文件 `src/main.js` 会调用 `registerPlugins(app)`。该函数使用 `import.meta.glob` 扫描 `src/plugins/**/index.{ts,js}` 和 `src/plugins/*.{ts,js}` 文件。每个插件文件默认导出一个函数，该函数接收 Vue 应用实例并调用 `app.use(...)`。插件按文件名的字母顺序加载。

### 路由（`src/plugins/router/`）

项目使用 Hash 模式的路由历史。`routes.js` 中定义的静态路由很少，仅包含 `/login` 和一个捕获所有未匹配路径的错误页面。用户登录后，通过 `createDynamicRouter(router, userStore.menus)` 创建动态路由；后端返回的菜单树会映射到 `src/views/` 下的视图组件。

`src/plugins/router/index.js` 中的路由守卫会将未登录用户重定向到 `/login`，并在登录后的首次导航中注入动态路由。

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

### 布局系统

以下两个目录之间存在强制边界：

- **`src/@core/`**：基础主题层，包含 SCSS 基础设施（变量、Mixin、工具类）和共享 SCSS 组件，可由基础布局和自定义布局共同引用。
- **`src/@layouts/`**：布局框架层，包含 `VerticalNavLayout` 组件、导航工具以及布局枚举和类型。**该目录不能从 `@core/` 导入内容**，此限制由 ESLint 正则规则强制执行。

应用布局位于 `src/layouts/`：

- `blank.vue`：用于登录页和错误页的最简布局。
- `default.vue`：主布局，封装 `DefaultLayoutWithVerticalNav`，并通过 `provide("refresh", ...)` 提供页面重新渲染能力。

### 配置（`src/config/index.js`）

- `PiniaPrefix` = `"dmp-"`
- `Version`：当前应用版本。
- `ApiVersion` = `"v3"`，用作 Axios 的 `baseURL`。
- `GamePortFactor`：DST 服务器各组件的端口偏移常量。

### 国际化（`src/languages/`）

项目包含两个语言文件：`lang-zh.js` 和 `lang-en.js`。国际化基于 `vue-i18n`，使用 Composition API 模式。语言设置会持久化到全局 Store；首次加载时根据浏览器语言初始化。Vuetify 的语言环境会单独同步。

### 路径别名（定义于 `vite.config.js`）

| 别名 | 路径 |
| --- | --- |
| `@` | `src/` |
| `@core` | `src/@core/` |
| `@layouts` | `src/@layouts/` |
| `@images` | `src/assets/images/` |
| `@styles` | `src/assets/styles/` |
| `@store` | `src/plugins/store/` |

### 自动导入

项目通过 `unplugin-auto-import` 配置自动导入，`vue`、`vue-router`、`@vueuse/core`、`@vueuse/math` 和 `pinia` 中的 API 无需显式导入即可使用。`src/@core/components` 和 `src/components` 中的组件会自动注册。

### 自定义指令（`src/directives/`）

目前仅包含 `v-copy`，用于将内容复制到剪贴板。

### 视图目录结构（`src/views/`）

| 目录 | 用途 |
| --- | --- |
| `login/` | 登录与注册 |
| `dashboard/` | 仪表盘，展示服务器信息和系统统计数据 |
| `rooms/` | 房间列表，也是默认入口页面 |
| `game/` | 游戏管理，包括基础设置、模组和玩家管理 |
| `tools/` | 服务器工具，包括公告、备份、地图查看器、快照和令牌管理 |
| `logs/` | 聊天日志、游戏日志、访问日志、下载日志和清理日志 |
| `platform/` | 平台设置 |
| `profile/` | 用户资料与账号设置 |
| `install/` | DST 服务器安装向导 |

## 代码规范

- Vue 文件使用 `<script setup>` 和 Composition API。
- JavaScript 不使用分号（`semi: never`）。
- 使用 2 个空格缩进。
- 多行结构保留尾随逗号（`comma-dangle: always-multiline`）。
- 强制使用驼峰命名法。
- 模板中的组件名使用 kebab-case。
- 图标仅允许使用 `ri`（Remix Icons）前缀，此规则由 ESLint 正则规则强制执行。
- 图片导入使用 `@images` 别名，Store 导入使用 `@store` 别名，此规则由 ESLint 正则规则强制执行。

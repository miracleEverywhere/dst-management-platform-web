# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is the frontend for [DMP (Don't Starve Together Management Platform)](https://github.com/miracleEverywhere/dst-management-platform-api), a web admin panel for managing DST game servers. It's built on the [materio-vuetify-vuejs-admin-template](https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free). The standard build output is embedded into the Go backend's `embedFS/dist` directory.

The same codebase produces two forms at build time:

- **standard** (default) — full version: room list, game management, tools, platform settings, etc.
- **lite** — trimmed version with only the dashboard, room config, ground/cave, mods and logs, aimed at single-room deployments; its build output goes to `dist-lite/`.

**Stack:** Vue 3 (Composition API), Vite 8, Vuetify 3, Pinia 3, Vue Router 4 (hash mode), Vue I18n, ECharts 5, Axios

## Commands

```bash
pnpm run dev          # Start dev server (port 5173, strict)
pnpm run dev:lite     # Start dev server in lite form (vite --mode lite)
pnpm run build        # Production build (outputs dist/)
pnpm run build:lite   # Lite build (vite --mode lite, outputs dist-lite/)
pnpm run lint         # ESLint with auto-fix (.eslintrc.cjs)
pnpm run preview      # Preview production build (port 5050)
pnpm run build:icons  # Build iconify icon bundle (runs on postinstall)
```

There is no test suite. `dist/` is what gets embedded into the backend and `dist-lite/` is git-ignored; verify lite changes with the `:lite` scripts and don't mix the two outputs.

## Architecture

### Plugin auto-registration (`src/@core/utils/plugins.js`)

The entry point (`src/main.js`) calls `registerPlugins(app)`, which uses `import.meta.glob` to scan `src/plugins/**/index.{ts,js}` and `src/plugins/*.{ts,js}` files. Each plugin file exports a default function that receives the Vue app instance and calls `app.use(...)`. Plugin load order is alphabetically sorted.

### Routing (`src/plugins/router/`)

Uses hash-mode history. Static routes (defined in `routes.js`) are minimal: `/login` and a catch-all error page. Dynamic routes are created after login via `createDynamicRouter(router, userStore.menus)` — the backend returns a menu tree that maps to view components.

Views are no longer collected by a full `import.meta.glob` inside the router file; the module map comes from `@views-registry` (one of two registries, see "App modes" below). `createDynamicRouter` looks components up by the `/src/views/<component>.vue` key and logs a `console.warn` and skips the menu entry when the key is missing.

The home path depends on `IsLite`: `/rooms` for standard, `/dashboard` for lite. The `/profile` route is only registered in standard — the lite backend has no user-info endpoint.

The router guard in `src/plugins/router/index.js` redirects unauthenticated users to `/login` and injects dynamic routes on first navigation after login; authenticated users hitting `/login` are sent to the same home path.

### App modes: standard and lite

`src/config/index.js` reads `AppMode` from `import.meta.env.VITE_APP_MODE` (defaults to `"standard"`) and exports `IsLite = AppMode === "lite"`. Builds switch to lite via `VITE_APP_MODE=lite` in `.env.lite` together with `vite --mode lite`.

- `vite.config.js` uses the functional form `defineConfig(({ mode }) => ...)` and calls `loadEnv(mode, projectRoot, '')` to read the same variable, which decides where `@views-registry` points so build-time and runtime agree on the form.
- Both registries default-export an `import.meta.glob` module map and named-export `loginView`: standard uses `views.js` (scans `@/views/**/*.vue`, excludes `@/views/lite/**` and `@/views/login/**`), lite uses `views.lite.js` (only `@/views/lite/**`). Unselected pages never enter the module graph and produce no chunk — a runtime-only `IsLite` check cannot achieve that.
- Globs must use the alias form (`@/views/...`) so keys come out as `/src/views/...`, matching how `createDynamicRouter` looks them up; relative paths break every dynamic route.

lite entry points and data:

- The login page is `src/views/login/lite.vue` (login plus a first-run registration dialog). After a successful login it fetches menus from `/menu` into `userStore.menus`, pins `language` to `zh`, then navigates to `/dashboard`.
- Endpoints live in `src/api/lite.js` and hit the lite backend's trimmed top-level paths (`/register`, `/login`, `/menu`, `/platform/game_version`, `/room`, `/ground`, `/cave`, `/mod`, `/sys`, `/cc`, `/log`, `/exec`), unlike the per-domain `src/api/*.js` files of standard; don't mix the two.
- Shared code branches on `IsLite` instead of duplicating components: `main.js` sets the title to `DMP Lite`; `App.vue` no longer renders `ReadmeDialog` (the first-login readme acknowledgement); `DefaultLayoutWithVerticalNav.vue` swaps `HeaderMain`/`Document`/`LangSelect` for a `DMP Lite` chip plus `LiteHeaderInfo` (game version); `NavItems.vue` uses the hardcoded Chinese `liteMenuTitles` table; `NavHeader.vue`, `Github.vue` and `UserProfile.vue` (which also hides the profile entry) likewise render Chinese copy under `IsLite`.

### State management (`src/plugins/store/`)

Two Pinia stores, both persisted to localStorage with prefix `dmp-`:

- **`user`** (`user.js`) — token, userInfo (username, nickname, role, avatar, permissions like roomCreation/maxWorlds/maxPlayers), and menus (the dynamic route tree from backend)
- **`global`** (`global.js`) — theme, language, current room context (id, gameName), game/DMP version tracking

### API layer (`src/api/`, `src/utils/axios.js`)

Each domain has a file in `src/api/` exporting endpoint definitions as a nested object with `url` and HTTP methods (`get`, `post`, `put`, `delete`). All use the shared Axios instance from `src/utils/axios.js` which:
- Base URL is `/api/v3` (from `ApiVersion` in config)
- Sends `X-DMP-TOKEN` header on every request
- Sends `X-I18n-Lang` header for i18n
- On status 420 → clears auth and redirects to login
- On non-200 → shows snackbar error and rejects
- On successful response → returns `response.data` directly (callers get the unwrapped data)

`src/api/lite.js` is the lite-only endpoint set: flat top-level paths (`/room`, `/ground`, `/log`, …) used by `src/views/lite/**` and `src/views/login/lite.vue`. Don't mix paths between the two API surfaces.

### Layout system

Two directories with an enforced boundary:

- **`src/@core/`** — Base theme: SCSS foundations (variables, mixins, utilities), shared SCSS components. Imported by both base and custom layouts.
- **`src/@layouts/`** — Layout framework: `VerticalNavLayout` component, navigation utilities, layout enums/types. **Cannot import from `@core/`** (enforced by ESLint regex rule).

Application layouts live in `src/layouts/`:
- `blank.vue` — minimal layout for login/error pages
- `default.vue` — main layout wrapping `DefaultLayoutWithVerticalNav` with a `provide("refresh", ...)` for page re-rendering

`DefaultLayoutWithVerticalNav.vue` is the shared navigation shell for both forms: standard shows `HeaderMain`, `Document` and `LangSelect`, while lite skips all three in favor of a `DMP Lite` chip and `LiteHeaderInfo` (game version).

### Config (`src/config/index.js`)

- `PiniaPrefix` = `"dmp-"`
- `Version` = current app version
- `ApiVersion` = `"v3"` (used as Axios baseURL)
- `AppMode` — app form from `VITE_APP_MODE`, defaulting to `"standard"`
- `IsLite` — `AppMode === "lite"`; every form check reads this
- `GamePortFactor` — port offset constants for DST server components

### i18n (`src/languages/`)

Two locale files: `lang-zh.js` and `lang-en.js`. Uses `vue-i18n` with Composition API mode. Language is persisted in the global store and initialized from browser language on first load. Vuetify locale is synced separately.

Lite does not use i18n: copy in `src/views/lite/**` and `src/views/login/lite.vue` is literal Chinese; shared components (`liteMenuTitles` in `NavItems.vue`, plus `NavHeader.vue`, `Github.vue`, `UserProfile.vue`) branch on `IsLite` to render Chinese, and login forces `globalStore.language = 'zh'`. The i18n plugin is still registered, so don't rely on `t()` inside lite pages and don't add lite-only keys to the locale files.

### Path aliases (from `vite.config.js`)

| Alias | Path |
|-------|------|
| `@` | `src/` |
| `@core` | `src/@core/` |
| `@layouts` | `src/@layouts/` |
| `@images` | `src/assets/images/` |
| `@styles` | `src/assets/styles/` |
| `@store` | `src/plugins/store/` |
| `@views-registry` | View registry, one of two based on `VITE_APP_MODE`: standard → `src/plugins/router/views.js`, lite → `src/plugins/router/views.lite.js` |

### Auto-imports

Configured via `unplugin-auto-import`: `vue`, `vue-router`, `@vueuse/core`, `@vueuse/math`, `pinia` are globally available without explicit imports. Components from `src/@core/components` and `src/components` are auto-registered.

### Custom directives (`src/directives/`)

Currently only `v-copy` (clipboard copy).

### Views structure (`src/views/`)

| Directory | Purpose |
|-----------|---------|
| `login/` | Login & registration; `index.vue` for standard, `lite.vue` for lite |
| `dashboard/` | Dashboard with ECharts (server info, sys stats) |
| `rooms/` | Room list — the standard landing page |
| `game/` | Game management: base settings, mods, player management |
| `tools/` | Server tools: announce, backup, map viewer, snapshots, token management |
| `logs/` | Chat logs, game logs, access logs, download logs, cleanup logs |
| `platform/` | Platform settings |
| `profile/` | User profile/account settings |
| `install/` | DST server installation wizard |
| `upload/` | Save-file import |
| `lite/` | All lite pages: `dashboard/` (room overview + sys metrics), `room/` (single-room config), `world/` (ground, cave, mods), `log/` (chat, game logs), `components/` (shared lite pieces like `WorldConfig`, `LogViewer`) |

`src/views/lite/` is only picked up by the lite build; the standard build never bundles it.

## Code conventions

- Vue files use `<script setup>` with Composition API
- JS with semicolons disabled (`semi: never`)
- 2-space indentation
- Trailing commas in multiline (`comma-dangle: always-multiline`)
- CamelCase enforced
- Component names in templates use kebab-case
- Only `ri` (Remix Icons) icon prefix is allowed (ESLint regex rule)
- Use `@images` alias for image imports, `@store` for store imports (ESLint regex enforces this)
- Read `IsLite` from `src/config` for form checks; don't touch `import.meta.env.VITE_APP_MODE` in business code
- Lite-only pages must live under `src/views/lite/` (the lite registry is a whitelist glob); standard pages must not. After adding a page, confirm the matching registry glob covers it
- Adapt shared layouts/components with an `IsLite` branch instead of copying a component or adding a lite-only layout
- A backend menu item's `component` must match the real path `src/views/<component>.vue`, otherwise that menu is skipped (only a console warning, no error)

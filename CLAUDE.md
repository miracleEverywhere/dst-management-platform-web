# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is the frontend for [DMP (Don't Starve Together Management Platform)](https://github.com/miracleEverywhere/dst-management-platform-api), a web admin panel for managing DST game servers. It's built on the [materio-vuetify-vuejs-admin-template](https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free). The build output is embedded into the Go backend's `embedFS/dist` directory.

**Stack:** Vue 3 (Composition API), Vite 7, Vuetify 3, Pinia 3, Vue Router 4 (hash mode), Vue I18n, ECharts 5, Axios

## Commands

```bash
npm run dev          # Start dev server (port 5173, strict)
npm run build        # Production build
npm run lint         # ESLint with auto-fix (.eslintrc.cjs)
npm run preview      # Preview production build (port 5050)
npm run build:icons  # Build iconify icon bundle (runs on postinstall)
```

There is no test suite.

## Architecture

### Plugin auto-registration (`src/@core/utils/plugins.js`)

The entry point (`src/main.js`) calls `registerPlugins(app)`, which uses `import.meta.glob` to scan `src/plugins/**/index.{ts,js}` and `src/plugins/*.{ts,js}` files. Each plugin file exports a default function that receives the Vue app instance and calls `app.use(...)`. Plugin load order is alphabetically sorted.

### Routing (`src/plugins/router/`)

Uses hash-mode history. Static routes (defined in `routes.js`) are minimal: `/login` and a catch-all error page. Dynamic routes are created after login via `createDynamicRouter(router, userStore.menus)` — the backend returns a menu tree that maps to view components under `src/views/`. The router guard in `src/plugins/router/index.js` redirects unauthenticated users to `/login` and injects dynamic routes on first navigation after login.

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

### Layout system

Two directories with an enforced boundary:

- **`src/@core/`** — Base theme: SCSS foundations (variables, mixins, utilities), shared SCSS components. Imported by both base and custom layouts.
- **`src/@layouts/`** — Layout framework: `VerticalNavLayout` component, navigation utilities, layout enums/types. **Cannot import from `@core/`** (enforced by ESLint regex rule).

Application layouts live in `src/layouts/`:
- `blank.vue` — minimal layout for login/error pages
- `default.vue` — main layout wrapping `DefaultLayoutWithVerticalNav` with a `provide("refresh", ...)` for page re-rendering

### Config (`src/config/index.js`)

- `PiniaPrefix` = `"dmp-"`
- `Version` = current app version
- `ApiVersion` = `"v3"` (used as Axios baseURL)
- `GamePortFactor` — port offset constants for DST server components

### i18n (`src/languages/`)

Two locale files: `lang-zh.js` and `lang-en.js`. Uses `vue-i18n` with Composition API mode. Language is persisted in the global store and initialized from browser language on first load. Vuetify locale is synced separately.

### Path aliases (from `vite.config.js`)

| Alias | Path |
|-------|------|
| `@` | `src/` |
| `@core` | `src/@core/` |
| `@layouts` | `src/@layouts/` |
| `@images` | `src/assets/images/` |
| `@styles` | `src/assets/styles/` |
| `@store` | `src/plugins/store/` |

### Auto-imports

Configured via `unplugin-auto-import`: `vue`, `vue-router`, `@vueuse/core`, `@vueuse/math`, `pinia` are globally available without explicit imports. Components from `src/@core/components` and `src/components` are auto-registered.

### Custom directives (`src/directives/`)

Currently only `v-copy` (clipboard copy).

### Views structure (`src/views/`)

| Directory | Purpose |
|-----------|---------|
| `login/` | Login & registration |
| `dashboard/` | Dashboard with ECharts (server info, sys stats) |
| `rooms/` | Room list — the default landing page |
| `game/` | Game management: base settings, mods, player management |
| `tools/` | Server tools: announce, backup, map viewer, snapshots, token management |
| `logs/` | Chat logs, game logs, access logs, download logs, cleanup logs |
| `platform/` | Platform settings |
| `profile/` | User profile/account settings |
| `install/` | DST server installation wizard |

## Code conventions

- Vue files use `<script setup>` with Composition API
- JS with semicolons disabled (`semi: never`)
- 2-space indentation
- Trailing commas in multiline (`comma-dangle: always-multiline`)
- CamelCase enforced
- Component names in templates use kebab-case
- Only `mdi` (Material Design Icons) icon prefix is allowed (ESLint regex rule)
- Use `@images` alias for image imports, `@store` for store imports (ESLint regex enforces this)

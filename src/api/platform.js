import http from "@/utils/axios"
import { ApiVersion } from "@/config"

// 游戏安装/更新的输出是 SSE 流，需要携带 X-DMP-TOKEN，EventSource 无法自定义请求头，
// 因此由 utils/sse.js 的 fetch 版客户端直接请求，这里只负责拼地址。
// action 有值表示启动新任务；为空表示只订阅已有任务（刷新页面、断线重连）。
// after 是已收到的输出字节偏移，断线续传时传上一个事件的 id。
export const gameInstallStreamURL = ({ action, after } = {}) => {
  const query = new URLSearchParams()

  if (action) query.set('action', action)
  if (after) query.set('after', String(after))

  const search = query.toString()

  return `/${ApiVersion}/platform/game/install/stream${search ? `?${search}` : ''}`
}

// 平台自更新进度同样是 SSE 流，同样需要 X-DMP-TOKEN，因此走 utils/sse.js 的 fetch 版客户端。
// after 是已收到的事件序号，刷新页面或断线续传时传上一条事件的 id。
export const selfUpdateStreamURL = ({ after } = {}) => {
  const query = new URLSearchParams()

  if (after) query.set('after', String(after))

  const search = query.toString()

  return `/${ApiVersion}/platform/update/stream${search ? `?${search}` : ''}`
}

export default {
  overview: {
    url: `/platform/overview`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  gameVersion: {
    url: `/platform/game_version`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },

  // 平台版本检查：refresh=1 让后端忽略 10 分钟缓存重新查询 GitHub
  version: {
    url: `/platform/version`,
    get: async function (data, config) {
      return await http.get(this.url, data, config)
    },
  },

  // 平台自更新：POST 发起任务，state 用于刷新页面后恢复进度
  selfUpdate: {
    url: `/platform/update`,
    post: async function (data, config) {
      return await http.post(this.url, data, config)
    },
    state: {
      url: `/platform/update/state`,
      get: async function (data, config) {
        return await http.get(this.url, data, config)
      },
    },
  },
  gameInstall: {
    state: {
      url: `/platform/game/install/state`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
  osInfo: {
    url: `/platform/os_info`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  metrics: {
    url: `/platform/metrics`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  globalSettings: {
    url: `/platform/global_settings`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  readme: {
    url: `/platform/readme`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  runningScreens: {
    url: `/platform/running_screens`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  screen: {
    running: {
      url: `/platform/screen/running`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    kill: {
      url: `/platform/screen/kill`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
  },
  webhook: {
    test: {
      url: `/platform/webhook/test`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
    events: {
      url: `/platform/webhook/events`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
  plugin: {
    list: {
      url: `/platform/plugin/list`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    install: {
      url: `/platform/plugin/install`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
    action: {
      url: `/platform/plugin/action`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
    status: {
      url: `/platform/plugin/status`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
}

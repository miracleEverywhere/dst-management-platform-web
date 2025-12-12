import http from "@/utils/axios"

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
}
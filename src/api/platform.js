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
}
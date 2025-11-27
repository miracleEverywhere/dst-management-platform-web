import http from "@/utils/axios"

export default {
  exec: {
    game: {
      url: `/dashboard/exec/game`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
  },
  info: {
    base: {
      url: `/dashboard/info/base`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
}
import http from "@/utils/axios"

export default {
  download: {
    url: `/dashboard/download`,
    post: async function (data) {
      return await http.post(this.url, data)
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
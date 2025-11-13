import http from "@/utils/axios"

export default {
  overview: {
    url: `/platform/overview`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
}
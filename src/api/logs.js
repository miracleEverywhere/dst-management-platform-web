import http from "@/utils/axios"

export default {
  content: {
    url: `/logs/content`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
}
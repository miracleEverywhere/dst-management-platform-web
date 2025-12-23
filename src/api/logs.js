import http from "@/utils/axios"

export default {
  content: {
    url: `/logs/content`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  history: {
    list: {
      url: `/logs/history/list`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    content: {
      url: `/logs/history/content`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
}
import http from "@/utils/axios"

export default {
  create: {
    url: `/room/create`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  list: {
    url: `/room/list`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
}
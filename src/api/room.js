import http from "@/utils/axios"

export default {
  base: {
    url: `/room`,
    get: async function(data){
      return await http.get(this.url, data)
    },
    post: async function(data){
      return await http.post(this.url, data)
    },
    put: async function(data){
      return await http.put(this.url, data)
    },
    delete: async function(data){
      return await http.delete(this.url, data)
    },
  },
  list: {
    url: `/room/list`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  portFactor: {
    url: `/room/port/factor`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
}
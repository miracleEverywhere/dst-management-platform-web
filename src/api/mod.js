import http from "@/utils/axios"

export default {
  download: {
    url: `/mod/download`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  search: {
    url: `/mod/search`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  downloaded: {
    url: `/mod/downloaded`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
}
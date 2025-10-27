import http from "@/utils/axios.js"

export default {
  register: {
    url: `/user/register`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  login: {
    url: `/user/login`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  userinfo: {
    url: `/user/userinfo`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  menu: {
    url: `/user/menu`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
}
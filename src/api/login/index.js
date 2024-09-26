import http from "@/utils/axios.ts";


export default {
  login: {
    url: `/login`,
    post: async function(data){
      return await http.post(this.url, data);
    }
  },
  menu: {
    url: `/menu`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  updatePassword: {
    url: `/password/update`,
    post: async function(data){
      return await http.post(this.url, data);
    }
  },
}
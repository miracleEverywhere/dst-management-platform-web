import http from "@/utils/axios.ts";

export default {
  osInfo: {
    url: `/tools/os_info`,
    get: async function(data){
      return await http.get(this.url, data);
    }
  },
  install: {
    url: `/tools/install`,
    post: async function(data){
      return await http.post(this.url, data);
    }
  },
  installStatus: {
    url: `/tools/install/status`,
    get: async function(data){
      return await http.get(this.url, data);
    }
  },

}
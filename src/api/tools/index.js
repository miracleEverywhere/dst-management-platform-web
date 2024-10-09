import http from "@/utils/axios.ts";


export default {
  osInfo: {
    url: `/tools/os_info`,
    get: async function(data){
      return await http.get(this.url, data);
    }
  },

}
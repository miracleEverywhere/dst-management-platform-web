import http from "@/utils/axios.ts";


export default {
  room: {
    url: `/setting/room`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },

}
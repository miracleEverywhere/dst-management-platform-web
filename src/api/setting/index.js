import http from "@/utils/axios.ts";


export default {
  room: {
    url: `/setting/room`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  save: {
    url: `/setting/save`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  saveAndRestart: {
    url: `/setting/save_restart`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  saveAndGenerate: {
    url: `/setting/save_generate`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },

}
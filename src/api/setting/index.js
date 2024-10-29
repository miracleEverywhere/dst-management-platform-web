import http from "@/utils/axios.ts";


export default {
  room: {
    url: `/setting/room`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  save: {
    url: `/setting/room/save`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  saveAndRestart: {
    url: `/setting/room/save_restart`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  saveAndGenerate: {
    url: `/setting/room/save_generate`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  player: {
    list: {
      url: `/setting/player/list`,
      get: async function(data){
        return await http.get(this.url, data);
      },
    },
    addAdmin: {
      url: `/setting/player/add/admin`,
      post: async function (data) {
        return await http.post(this.url, data);
      }
    },
  },

}
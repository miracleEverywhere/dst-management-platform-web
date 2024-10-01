import http from "@/utils/axios.ts";


export default {
  base: {
    url: `/setting/room/base`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  ground: {
    url: `/setting/room/ground`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  cave: {
    url: `/setting/room/cave`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
  mod: {
    url: `/setting/room/mod`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
}
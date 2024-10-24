import http from "@/utils/axios.ts";


export default {
  roomInfo: {
    url: `/home/room_info`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
  sysInfo: {
    url: `/home/sys_info`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
}
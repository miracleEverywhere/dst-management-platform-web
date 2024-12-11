import http from "@/utils/axios.ts";

export default {
  setting: {
    url: `/mod/setting`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
  info: {
    url: `/mod/info`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
}

import http from "@/utils/axios.ts";

export default {
  settingFormat: {
    url: `/mod/setting/format`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
  configOptions: {
    url: `/mod/config_options`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
}

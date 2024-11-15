import http from "@/utils/axios.ts";

export default {
  dstVersion: {
    url: `/external/api/dst_version`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
  connectionCode: {
    url: `/external/api/connection_code`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
  modInfo: {
    url: `/external/api/mod_info`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
}

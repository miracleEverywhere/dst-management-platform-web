import http from "@/utils/axios.ts";

export default {
  logValue: {
    url: `/logs/log_value`,
    get: async function (data) {
      return await http.get(this.url, data);
    }
  },
  install: {
    url: `/tools/install`,
    post: async function (data) {
      return await http.post(this.url, data);
    }
  },
}
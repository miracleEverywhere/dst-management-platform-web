import http from "@/utils/axios"
import { ApiVersion } from "@/config"

// 当前日志的 SSE 地址。日志接口使用 X-DMP-TOKEN 鉴权，EventSource 不能带自定义请求头，
// 因此前端统一走 utils/sse.js 的 fetch 版客户端。
export const logsStreamURL = data => {
  const query = new URLSearchParams()

  Object.entries(data).forEach(([key, value]) => {
    // 空值交给后端默认值处理（例如行数输入框被清空时按 0 行处理）
    if (value === null || value === undefined || value === '') return
    query.set(key, String(value))
  })

  return `/${ApiVersion}/logs/content/stream?${query.toString()}`
}

export default {
  history: {
    list: {
      url: `/logs/history/list`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
    content: {
      url: `/logs/history/content`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
  clean: {
    url: `/logs/clean`,
    delete: async function (data) {
      return await http.delete(this.url, data)
    },
    info: {
      url: `/logs/clean/info`,
      get: async function (data) {
        return await http.get(this.url, data)
      },
    },
  },
  download: {
    url: `/logs/download`,
    download: async function (data, saveName) {
      return await http.download(this.url, data, saveName)
    },
  },
}

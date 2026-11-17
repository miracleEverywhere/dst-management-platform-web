import http from "@/utils/axios"
import { ApiVersion } from "@/config"

// SSE 事件地址：后端返回的 eventsURL 是完整路径，这里同时提供按 ID 拼接的方法，
// 用于页面刷新后恢复会话时重新连接。
export const diagnosisEventsURL = id => `/${ApiVersion}/diagnosis/${id}/events`

export const diagnosisApplyEventsURL = id => `/${ApiVersion}/diagnosis/${id}/apply/events`

export default {
  start: {
    url: `/diagnosis`,
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  snapshot: {
    url: `/diagnosis`,
    get: async function (id) {
      return await http.get(`${this.url}/${id}`)
    },
  },
  cancel: {
    url: `/diagnosis`,
    delete: async function (id) {
      return await http.delete(`${this.url}/${id}`)
    },
  },
  apply: {
    url: `/diagnosis`,
    post: async function (id, data) {
      return await http.post(`${this.url}/${id}/apply`, data)
    },
  },
  history: {
    url: `/diagnosis/history`,
    get: async function (params) {
      return await http.get(this.url, params)
    },
  },
  historyDetail: {
    url: `/diagnosis/history`,
    get: async function (id) {
      return await http.get(`${this.url}/${id}`)
    },
  },
  setting: {
    url: `/diagnosis/setting`,
    get: async function () {
      return await http.get(this.url)
    },
    put: async function (data) {
      return await http.put(this.url, data)
    },
  },
}

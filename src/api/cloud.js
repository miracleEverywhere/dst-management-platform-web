import http from "@/utils/axios"

// DMP Cloud 云账号接口
// 云服务只由 DMP 后端调用，前端不接触云 access/refresh token
export default {
  login: {
    url: `/cloud/login`,
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  status: {
    url: `/cloud/status`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  link: {
    url: `/cloud/link`,
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  unlink: {
    url: `/cloud/unlink`,
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  sync: {
    url: `/cloud/sync`,
    post: async function (data) {
      return await http.post(this.url, data)
    },
  },
  favorites: {
    url: `/cloud/favorites`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  tokens: {
    url: `/cloud/tokens`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  gameAdmins: {
    url: `/cloud/game-admins`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  gameReservedSlots: {
    url: `/cloud/game-reserved-slots`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  archives: {
    url: `/cloud/archives`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
    upload: {
      url: `/cloud/archives/upload`,
      post: async function (data) {
        return await http.post(this.url, data)
      },
    },
    download: async function (id, filename) {
      return await http.download(`/cloud/archives/${encodeURIComponent(id)}/download`, null, filename)
    },
    importArchive: async function (id) {
      return await http.post(`/cloud/archives/${encodeURIComponent(id)}/import`)
    },
  },
}

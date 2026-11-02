import http from "@/utils/axios"

// lite 后端只暴露精简后的顶层接口，与主版本的 /user/*、/room/* 不同
export default {
  register: {
    url: `/register`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
    post: async function(data) {
      return await http.post(this.url, data)
    },
  },
  login: {
    url: `/login`,
    post: async function(data) {
      return await http.post(this.url, data)
    },
  },
  menu: {
    url: `/menu`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
  },
  gameVersion: {
    url: `/platform/game_version`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
  },
  room: {
    url: `/room`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
    put: async function(data) {
      return await http.put(this.url, data)
    },
  },
  ground: {
    url: `/ground`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
    put: async function(data) {
      return await http.put(this.url, data)
    },
  },
  cave: {
    url: `/cave`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
    put: async function(data) {
      return await http.put(this.url, data)
    },
  },
  mod: {
    url: `/mod`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
    put: async function(data) {
      return await http.put(this.url, data)
    },
  },
  sys: {
    url: `/sys`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
  },
  cc: {
    url: `/cc`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
  },
  log: {
    url: `/log`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
  },
  exec: {
    url: `/exec`,
    post: async function(data) {
      return await http.post(this.url, data)
    },
  },
  players: {
    url: `/players`,
    get: async function(data) {
      return await http.get(this.url, data)
    },
  },
}

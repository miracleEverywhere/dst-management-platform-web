import http from "@/utils/axios"

export default {
  mod: {
    search: {
      url: `/external/mod/search`,
      get: async function(data){
        return await http.get(this.url, data)
      },
    },
  },
}
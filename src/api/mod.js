import http from "@/utils/axios"

export default {
  download: {
    url: `/mod/download`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
}
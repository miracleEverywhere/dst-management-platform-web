import axios from 'axios'
import { showSnackbar } from '@/utils/snackbar'
import { getToken } from "@/utils/tools.js"
import { router } from "@/plugins/router/index.js"
import useUserStore from "@store/user.js"
import { ApiVersion } from "@/config"


// 创建一个 axios 实例
const instance = axios.create({
  baseURL: ApiVersion,
  timeout: 600000, // 请求超时时间
})

// 请求拦截器：在请求发送之前添加 token
instance.interceptors.request.use(
  config => {
    const token = getToken()

    // 如果 token 存在，将其添加到请求头中
    if (token) {
      config.headers['X-DMP-TOKEN'] = token
    }
    
    return config
  },
  error => {
    // 请求错误处理
    return Promise.reject(error)
  },
)

// 响应拦截器：处理响应数据
instance.interceptors.response.use(
  async response => {
    const status = response.data.status || response.data.code
    if (status === 200) {
      // 服务器连接状态，非后端返回的status 或者 code
      // 这里的后端可能是code OR status 和 message OR message需要看后端传递的是什么？
      // console.log("200状态", status);
      return response.data
    } else if (status === 420) {
      const authStore = useUserStore()

      showSnackbar(response.data.message || "服务器偷偷跑到火星去玩了", 'error')
      await authStore.clearStore()
      await router.replace('/login')
      
      return Promise.reject(response.data)
    } else {
      showSnackbar(response.data.message || "服务器偷偷跑到火星去玩了", 'error')
      
      return Promise.reject(response.data.message || "服务器偷偷跑到火星去玩了") // 可以将异常信息延续到页面中处理，使用try{}catch(error){};
    }
  },
  error => {
    // 响应错误处理
    error.data = {}
    if (error.data.message) {
      showSnackbar(error.status + " " + error.data.message, 'error')
    } else {
      error.data.message = "连接到服务器失败"
      showSnackbar(error.data.message, 'error')
    }
    
    return Promise.reject(error) // 将错误返回给 try{} catch(){} 中进行捕获，就算不进行捕获，上方 res.data.status != 200也会抛出提示。
  },
)

// 封装常用的请求方法
const http = {
  get: (url, params) => instance.get(url, { params }),
  post: (url, data) => instance.post(url, data),
  put: (url, data) => instance.put(url, data),
  delete: (url, data) => instance.delete(url, { headers: { 'Content-Type': 'application/json' }, data: data }),
}

export default http
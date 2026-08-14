import axios from 'axios'
import { showSnackbar } from '@/utils/snackbar'
import { getToken } from "@/utils/tools"
import useUserStore from "@store/user"
import { ApiVersion } from "@/config"
import useGlobalStore from "@store/global.js"

import streamSaver from 'streamsaver'

streamSaver.mitm = window.location.origin + '/mitm.html'

// 保存下载的取消控制器（用于支持中途取消）
let downloadController = null

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
    const globalStore = useGlobalStore()

    config.headers["X-I18n-Lang"] = globalStore.language

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
    // 1. 如果是文件下载（responseType 为 blob），直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    const status = Number(response.data.status ?? response.data.code)
    if (status === 200) {
      // 服务器连接状态，非后端返回的status 或者 code
      // 这里的后端可能是code OR status 和 message OR message需要看后端传递的是什么？
      // console.log("200状态", status);

      // 后端如果传回token，则使用新token
      const newToken = response.headers['x-dmp-new-token'] || ''
      if (newToken && newToken !== getToken()) {
        const userStore = useUserStore()

        userStore.token = newToken
      }
      
      return response.data
    } else if (status === 420) {
      const userStore = useUserStore()

      showSnackbar(response.data.message || "服务器偷偷跑到火星去玩了", 'error')
      await userStore.clearStore()
      if (window.location.hash !== '#/login') {
        window.location.href = '/#/login'
      }

      return Promise.reject(response.data)
    } else {
      showSnackbar(response.data.message || "服务器偷偷跑到火星去玩了", 'error')

      return Promise.reject(response.data.message || "服务器偷偷跑到火星去玩了") // 可以将异常信息延续到页面中处理，使用try{}catch(error){};
    }
  },
  error => {
    // 响应错误处理
    error.data = error.data || {}
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
  delete: (url, data) => instance.delete(url, {
    headers: { 'Content-Type': 'application/json' },
    data: data,
  }),

  // 使用 streamsaver 下载
  download: async (url, params, filename) => {
    downloadController = new AbortController()

    const { signal } = downloadController

    // 1. 拼接 URL 查询参数
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    const fullUrl = "/v3" + url + queryString

    // 2. 组装请求头
    const token = getToken()

    const headers = {
      'X-DMP-TOKEN': token ? `${token}` : '',
      ...(instance.defaults?.headers?.common || {}),
    }

    let response
    try {
      // 3. 发起请求
      response = await fetch(fullUrl, {
        method: 'GET',
        headers,
        signal,
      })
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('用户已手动取消下载')

        return // 被取消时直接退出，不向上抛异常
      }
      console.error('网络请求失败:', error)
      throw error // 真正的网络异常抛给上层业务组件处理
    } finally {
      downloadController = null
    }

    // 4. 检查响应状态（放在 try 外部，不再触发“本地捕获异常”警告）
    if (!response.ok) {
      const errorMsg = `下载失败，HTTP 状态码: ${response.status}`

      console.error(errorMsg)
      throw new Error(errorMsg)
    }

    // 5. 解析文件名
    let targetFilename = filename
    if (!targetFilename) {
      const contentDisposition = response.headers.get('content-disposition')
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=(?:utf-8'')?([^;]+)/i)
        if (filenameMatch && filenameMatch[1]) {
          targetFilename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''))
        }
      }
    }
    if (!targetFilename) {
      targetFilename = 'download'
    }

    // 6. 流传输落盘
    try {
      const fileStream = streamSaver.createWriteStream(targetFilename, {
        size: response.headers.get('content-length') || undefined,
      })

      if (window.WritableStream && response.body.pipeTo) {
        await response.body.pipeTo(fileStream, { signal })
      } else {
        const writer = fileStream.getWriter()
        const reader = response.body.getReader()

        const pump = () => reader.read().then(res =>
          res.done ? writer.close() : writer.write(res.value).then(pump),
        )

        await pump()
      }

      return response
    } catch (streamError) {
      if (streamError.name === 'AbortError') {
        console.warn('写入过程被中断')
      } else {
        console.error('文件写入磁盘失败:', streamError)
        throw streamError
      }
    }
  },

  // 取消当前正在进行的下载
  cancelDownload: () => {
    if (downloadController) {
      downloadController.abort() // 打断 fetch 请求并关闭写入流
      downloadController = null
    }
  },
}

export default http

import { createRouter, createWebHashHistory } from 'vue-router'
import { createDynamicRouter, staticRouter } from './routes'
import useUserStore from "@store/user.js"


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRouter,
})

let dynamicRoutesAdded = false
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const hasToken = !!userStore.token

  // 1. 如果有token且尝试访问登录页，重定向到首页
  if (hasToken && to.path === '/login') {
    next({ path: '/' })
    
    return
  }

  // 2. 如果没有token且访问的不是登录页，重定向到登录页
  if (!hasToken && to.path !== '/login') {
    next(`/login?redirect=${to.path}`)
    
    return
  }

  // 3. 如果有token但动态路由未加载，获取动态路由
  if (hasToken && !dynamicRoutesAdded) {
    try {
      await createDynamicRouter(router, userStore.menus)

      // 添加404路由（必须放在最后）
      router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/error',
        meta: { hidden: true },
      })

      dynamicRoutesAdded = true

      // 添加动态路由后重定向到目标路由
      next({ ...to, replace: true })
    } catch (error) {
      // 获取菜单失败，清除token并重定向到登录页
      console.error('获取菜单失败:', error)
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
})


export default function (app) {
  app.use(router)
}
export { router }

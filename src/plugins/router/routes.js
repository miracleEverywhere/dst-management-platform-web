import { IsLite } from '@/config'

// 视图注册表按构建形态选择（见 vite.config.js 的 @views-registry 别名）
import viewModules, { loginView } from '@views-registry'

const homePath = IsLite ? '/dashboard' : '/rooms'

export const staticRouter = [
  {
    path: '/',
    redirect: homePath,
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: '/login',
        component: loginView,
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/components/[...error].vue'),
      },
    ],
  },
]


export const createDynamicRouter = (router, menus) => {
  const dynamic = {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [],
  }

  // lite 没有个人资料页，也不应该调用主版本的用户接口
  if (!IsLite) {
    dynamic.children.push({
      name: 'profile',
      path: '/profile',
      component: viewModules[`/src/views/profile/index.vue`],
    })
  }

  for (const menu of menus) {
    if (menu.type === 'group') {
      for (const link of menu.links) {
        const component = viewModules[`/src/views/${link.component}.vue`]

        if (!component) {
          console.warn(`未找到菜单组件: ${link.component}`)
          continue
        }

        dynamic.children.push({
          name: link.component,
          path: link.to,
          component,
        })
      }
    } else {
      const component = viewModules[`/src/views/${menu.component}.vue`]

      if (!component) {
        console.warn(`未找到菜单组件: ${menu.component}`)
        continue
      }

      dynamic.children.push({
        name: menu.component,
        path: menu.to,
        component,
      })
    }
  }

  router.addRoute(dynamic)
}

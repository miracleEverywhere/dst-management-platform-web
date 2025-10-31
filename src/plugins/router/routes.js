export const staticRouter = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
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

  let modules = import.meta.glob("@/views/**/*.vue")

  dynamic.children.push({
    name: 'profile',
    path: '/profile',
    component: modules[`/src/views/profile/index.vue`],
  })

  for (let menu of menus) {
    if (menu.type === 'group') {
      for (let link of menu.links) {
        dynamic.children.push({
          name: link.component,
          path: link.to,
          component: modules[`/src/views/${link.component}.vue`],
        })
      }
    } else {
      dynamic.children.push({
        name: menu.component,
        path: menu.to,
        component: modules[`/src/views/${menu.component}.vue`],
      })
    }
  }

  router.addRoute(dynamic)
}

import {useAppStore, useTabStore} from "@/store/index.js";

/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:00
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/
const baseTitle = import.meta.env.VITE_TITLE

export function createPageTitleGuard(router) {
  router.afterEach((to) => {
    const appStore = useAppStore()
    const tabStore = useTabStore()
    let pageTitle
    if (appStore.language === 'zh') {
      pageTitle = to.meta?.title
    } else {
      pageTitle = tabStore.tabs.find(menu => menu.title === to.meta?.title)
      if (pageTitle) {
        pageTitle = pageTitle.name
      }
    }
    if (pageTitle) {
      document.title = `${pageTitle} | ${baseTitle}`
    }
    else {
      document.title = baseTitle
    }
  })
}

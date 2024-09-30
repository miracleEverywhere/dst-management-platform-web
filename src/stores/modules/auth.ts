// 定义权限小仓库[选择式Api写法]
import { defineStore } from "pinia";
import { staticRouter } from "@/routers/modules/staticRouter";
// import authMenu from "@/assets/json/authMenu.json";
// import authUser from "@/assets/json/authUser.json";
import { generateRoutes, generateFlattenRoutes } from "@/utils/filterRoute.ts";
import { getShowStaticAndDynamicMenuList, getAllBreadcrumbList } from "@/utils/index.ts";
// @ts-ignore
import systemApi from "@/api/system"

// 权限数据，不进行持久化。否则刷新浏览器无法获取新的数据。
const authStore = defineStore("auth", {
  // 存储数据state
  state: (): any => {
    return {
      // 扁平化路由数据
      menuList: [],
      // 递归之后的菜单数据
      recursiveMenuList: [],
      // 面包屑数据
      breadcrumbList: [],
      // 用户角色
      roleList: [],
      // 按钮权限列表
      buttonList: [],
      // 用户信息
      userInfo: {
        username: "",
        nickname: "",
      }
    };
  },
  // 该函数没有上下文数据，所以获取state中的变量需要使用this
  actions: {
    // 获取后端菜单数据
    async listRouters() {
      // res.data是后端接口原始数据，进行扁平化路由数据。
      // @ts-ignore
      await systemApi.menu.get().then(response => {
        this.menuList = generateFlattenRoutes(response.data);
        this.recursiveMenuList = getShowStaticAndDynamicMenuList(staticRouter).concat(
          generateRoutes(getShowStaticAndDynamicMenuList(response.data), 0)
        );
        this.breadcrumbList = staticRouter.concat(generateRoutes(response.data, 0));
      })
    },
    // 获取角色数据 AND 按钮数据 AND 用户信息
    async getLoginUserInfo() {
      // @ts-ignore
      await systemApi.userInfo.get().then(response => {
        this.userInfo = response.data;
      })

    }
  },
  // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
  getters: {
    // 按钮权限列表
    getButtonList: state => state.buttonList,
    // 菜单权限列表 ==> 原始后端接口菜单数据，扁平化之后的一维数组菜单，主要用来添加动态路由，隐藏和不隐藏的菜单路由都需要
    getMenuList: state => state.menuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，这里的菜单将后端数据进行递归，需要将动态路由 isHide == 0 的隐藏菜单剔除, 将静态路由 isHide == 0 的隐藏菜单剔除
    showMenuList: state => state.recursiveMenuList,
    // 递归处理后的所有面包屑导航列表
    getBreadcrumbList: state => getAllBreadcrumbList(state.breadcrumbList)
  }
});

// 对外暴露方法
export default authStore;
export default {
  global: {
    title: "饥荒管理平台",
    github: "点击访问Github源码",
    document: "查看文档",
    light: "明亮",
    dark: "黑暗",
    profile: "个人中心",
    logout: "退出平台",
  },
  menu: {
    dashboard: "控制台",
    rooms: "房间总览",
  },
  login: {
    welcome: "欢迎使用饥荒管理平台",
    loginForm: {
      username: "用户名",
      password: "密码",
    },
    loginFormRule: {
      username: "请输入用户名",
      password: "请输入密码",
    },
    registerForm: {
      username: "用户名",
      nickname: "用户昵称",
      password: "密码",
    },
    registerFormRule: {
      username: "请输入用户名",
      nickname: "请输入用户昵称",
      password: "请输入密码",
    },
    login: "登录",
    register: "注册",
    cancel: "取消",
    submit: "提交",
    loginSuccess: "登录成功",
  },
  rooms: {
    header: {
      input: {
        label: '搜索',
        placeholder: '请输入房间名或房间昵称搜索',
      },
      button: {
        create: '新建房间',
        refresh: '刷新',
      },
    },
    card: {
      warning: {
        title: '房间未配置',
        subTitle: '请点击房间卡片进入配置页面',
      },
      success: {
        header: {
          menu: {
            activate: '激活',
            deactivate: '关闭',
            edit: '编辑',
            delete: '删除',
          }
        },
      }
    },
    result: {
      noRoom: {
        title: '没有发现房间',
        subTitle: '请点击右上角的新建按钮创建一个吧',
      },
      noResult: {
        title: '没有发现对应的房间',
        subTitle: '请更换搜索内容重新查询吧',
      },
    },
  }
}
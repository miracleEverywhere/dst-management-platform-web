export default {
  global: {
    title: "饥荒管理平台",
    room: '当前房间: ',
    noRoom:'未选择',
    gameVersion: '游戏版本: ',
    dmpVersion: '平台版本: ',
    github: "点击访问Github源码",
    document: "查看文档",
    light: "明亮",
    dark: "黑暗",
    profile: "个人中心",
    logout: "退出平台",
  },
  menu: {
    dashboard: "控制面板",
    rooms: "房间总览",
    game: '游戏设置',
    gameBase:'基础设置',
    gameMod: '模组设置',
    gamePlayer: '玩家设置',
    upload: '存档导入',
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
          title: {
            name: '房间名: ',
            activated: '已激活',
            deactivated: '已关闭',
          },
          menu: {
            activate: '激活',
            deactivate: '关闭',
            edit: '编辑',
            delete: '删除',
          }
        },
      },
      click: '已选择房间: ',
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
    dialog: {
      create: {
        title: '创建房间',
        form: {
          name: '房间名',
          displayName: '房间昵称',
        },
        rules: {
          name: '请输入房间名',
        },
        tips: {
          name: '用于区分不同的房间，不可重复',
          displayName: '为了让你能够更方便的区分不同的房间，只起到标识作用，如果不填则与房间名一致',
        },
        actions: {
          cancel: '取消',
          create: '创建',
        },
      },
    },
  }
}
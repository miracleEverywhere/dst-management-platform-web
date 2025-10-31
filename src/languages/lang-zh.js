export default {
  global: {
    title: "饥荒管理平台",
    room: '当前房间: ',
    noRoom: '未选择',
    gameVersion: '游戏版本: ',
    dmpVersion: '平台版本: ',
    github: "点击访问Github源码",
    document: "查看文档",
    light: "明亮",
    dark: "黑暗",
    profile: "个人中心",
    logout: "退出平台",
    result: {
      title: '未选择房间',
      subTitle: '请前往房间总览页面，选择一个房间再执行配置',
    },
  },
  menu: {
    dashboard: "控制面板",
    rooms: "房间总览",
    game: '游戏设置',
    gameBase: '基础设置',
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
          },
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
  },
  game: {
    prev: '上一步',
    next: {
      button: '下一步',
    },
    base: {
      gameName: {
        name: '游戏房间名',
        tip: '可通过游戏房间名在游戏大厅进行搜索',
        required: '请输入游戏房间名',
      },
      description: {
        name: '游戏房间描述',
        tip: '按Tab键显示在游戏房间名下方的文字',
      },
      gameMode: {
        name: '游戏模式',
        tip: '不同模式会生成不同类型的世界，萌新可无脑选无尽',
        modes: {
          endless: '无尽',
          survival: '生存',
          relaxed: '轻松',
          wilderness: '荒野',
          lightsOut: '暗无天日',
          lavaarena: '熔炉',
          quagmire: '暴食',
          custom: '自定义',
        },
      },
      pvp: {
        name: '玩家对战',
        tip: '游戏中的玩家是否能互相攻击',
        enable: '开启',
        disable: '关闭',
      },
      maxPlayer: {
        name: '玩家数量',
        tip: '可进入游戏的最大玩家数',
      },
      maxRollBack: {
        name: '回档天数',
        tip: '即每次游戏保存后生成的快照的最大值，如设置20，表示可以回档20天',
      },
      modInOne: {
        name: '统一模组',
        tip: '每个世界的模组是否独立设置',
        enable: '开启',
        disable: '关闭',
      },
      vote: {
        name: '玩家投票',
        tip: '游戏中的玩家是否能进行投票回档、重置、踢人等操作',
        enable: '开启',
        disable: '关闭',
      },
      pauseEmpty: {
        name: '自动暂停',
        tip: '游戏中没有玩家时是否自动暂停游戏时间',
        enable: '开启',
        disable: '关闭',
      },
      password: {
        name: '游戏密码',
        tip: '玩家进入游戏是否需要输入密码，如无需密码则留空',
      },
      token: {
        name: '游戏令牌',
        tip: '在科雷官网申请的饥荒游戏令牌',
        required: '请输入游戏令牌',
      },
      masterIP: {
        name: '主世界IP',
        tip: '如果所有世界都在当前云服务器，则无需更改，详细解释见文档',
        required: '请输入主世界IP',
      },
      masterPort: {
        name: '主世界端口',
        tip: '从世界连接主世界的端口，如果所有世界都在当前云服务器，则无需更改，详细解释见文档',
        required: '请输入主世界端口',
      },
      clusterKey: {
        name: '世界认证密码',
        tip: '从世界与主世界连接的认证密码',
        required: '请输入世界认证密码',
      },
    },
  },
}
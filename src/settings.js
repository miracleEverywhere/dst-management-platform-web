/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/13 20:54:36
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

export const defaultLayout = 'normal'

export const defaultPrimaryColor = '#3491FA'

export const piniaPrefixKey = 'mvs-'

// 控制 LayoutSetting 组件是否可见
export const layoutSettingVisible = false

export const naiveThemeOverrides = {
  common: {
    primaryColor: '#3491FA',
    primaryColorHover: '#57A9FB',
    primaryColorPressed: '#206CCF',
    primaryColorSuppl: '#57A9FB',
  },
}

export const basePermissions = [
  {
  'id': 104,
    'name': '个人资料',
    'code': 'Profile',
    'type': 'MENU',
    'parentId': null,
    'path': '/profile',
    'redirect': null,
    'icon': null,
    'component': '/src/views/profile/index.vue',
    'layout': '',
    'keepAlive': null,
    'method': null,
    'description': null,
    'show': false,
    'enable': true,
    'order': 2
  },
]

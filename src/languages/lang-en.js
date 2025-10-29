export default {
  global: {
    title: "DMP",
    room: 'Room: ',
    noRoom:'None',
    gameVersion: 'Game: ',
    dmpVersion: 'DMP: ',
    github: "Click to check the source code on GitHub",
    document: "Check the Documents",
    light: "Light",
    dark: "Dark",
    profile: "Profile",
    logout: "Logout",
  },
  menu: {
    dashboard: "Dashboard",
    rooms: "Rooms",
    game: 'Game',
    gameBase:'Base',
    gameMod: 'Mod',
    gamePlayer: 'Player',
    upload: 'Upload',
  },
  login: {
    welcome: "Welcome to DMP",
    loginForm: {
      username: "Username",
      password: "Password",
    },
    loginFormRule: {
      username: "Please input Username",
      password: "Please input Password",
    },
    registerForm: {
      username: "Username",
      nickname: "Nickname",
      password: "Password",
    },
    registerFormRule: {
      username: "Please input Username",
      nickname: "Please input Nickname",
      password: "Please input Password",
    },
    login: "Login",
    register: "Register",
    cancel: "Cancel",
    submit: "Submit",
    loginSuccess: "Login Success",
  },
  rooms: {
    header: {
      input: {
        label: 'Search',
        placeholder: 'Search by room name or room nickname',
      },
      button: {
        create: 'Create',
        refresh: 'Refresh',
      },
    },
    card: {
      warning: {
        title: 'Room NOT Configured',
        subTitle: 'Click this card to configure the room'
      },
      success: {
        header: {
          title: {
            name: 'Room Name: ',
            activated: 'Activated',
            deactivated: 'Deactivated',
          },
          menu: {
            activate: 'Activate',
            deactivate: 'Deactivate',
            edit: 'Edit',
            delete: 'Delete',
          }
        },
      },
      click: 'Selected Room: ',
    },
    result: {
      noRoom: {
        title: 'No Rooms Found',
        subTitle: 'Please click the "Create" button in the upper right corner to create one',
      },
      noResult: {
        title: 'No Rooms Found By Search',
        subTitle: 'Please change your search content and try again',
      },
    },
    dialog: {
      create: {
        title: 'Create Room',
        form: {
          name: 'Room Name',
          displayName: 'Room Nickname',
        },
        rules: {
          name: 'Please input the Room Name',
        },
        tips: {
          name: 'Used to distinguish between different rooms and cannot be duplicated',
          displayName: 'To help you distinguish between different rooms more easily, this serves only as an identifier. If left blank, it will default to the room name.',
        },
        actions: {
          cancel: 'Cancel',
          create: 'Create',
        },
      },
    },
  },
}
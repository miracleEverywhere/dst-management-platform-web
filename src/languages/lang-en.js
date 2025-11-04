export default {
  global: {
    title: "DMP",
    room: 'Room: ',
    noRoom: 'None',
    gameVersion: 'Game: ',
    dmpVersion: 'DMP: ',
    github: "Click to check the source code on GitHub",
    document: "Check the Documents",
    light: "Light",
    dark: "Dark",
    profile: "Profile",
    logout: "Logout",
    result: {
      title: 'No Room Selected',
      subTitle: 'Please go to the Rooms page, select a room, and then proceed with the configuration',
    },
  },
  menu: {
    dashboard: "Dashboard",
    rooms: "Rooms",
    game: 'Game',
    gameBase: 'Base',
    gameMod: 'Mod',
    gamePlayer: 'Player',
    upload: 'Upload',
    platform: 'Platform',
    platformOverview: 'Overview',
    platformSetting: 'Setting',
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
        subTitle: 'Click this card to configure the room',
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
            delete: 'Delete',
          },
        },
        text: {
          left: {
            gameMode: 'Game Mode',
            worldNum: 'Worlds',
            modNum: 'Mods',
            playerNum: 'Players',
          },
          right: {
            chartTitle: 'Max num Players',
            unit: 's',
          },
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
  game: {
    prev: 'Prev',
    next: {
      button: 'Next',
      save: 'Save',
    },
    base: {
      loading: 'Loading',
      step1: {
        gameName: {
          name: 'Room Name',
          tip: 'Searchable by game room name in the game lobby.',
          required: 'Please input Room Name',
        },
        description: {
          name: 'Description',
          tip: 'Text displayed below the game room name when pressing the Tab key.',
        },
        gameMode: {
          name: 'Game Mode',
          tip: 'Different modes generate different types of worlds. Beginners can simply choose "Endless" without hesitation',
          modes: {
            endless: 'Endless',
            survival: 'Survival',
            relaxed: 'Relaxed',
            wilderness: 'Wilderness',
            lightsOut: 'Lights Out',
            lavaarena: 'Lava Arena',
            quagmire: 'Quagmire',
            custom: 'Custom',
          },
        },
        pvp: {
          name: 'PVP',
          tip: 'Whether players can attack each other in the game',
          enable: 'Enable',
          disable: 'Disable',
        },
        maxPlayer: {
          name: 'Player Number',
          tip: 'Maximum number of players allowed to join the game',
        },
        maxRollBack: {
          name: 'Rollback Days',
          tip: 'The maximum number of snapshots generated after each game save. For example, if set to 20, it means you can roll back up to 20 days',
        },
        modInOne: {
          name: 'Unified mods',
          tip: 'Whether mods are configured independently for each world',
          enable: 'Enable',
          disable: 'Disable',
        },
        vote: {
          name: 'Vote',
          tip: 'Whether players in the game can perform actions such as voting to rollback, reset, or kick players',
          enable: 'Enable',
          disable: 'Disable',
        },
        pauseEmpty: {
          name: 'Auto Pause',
          tip: 'Whether the game automatically pauses when there are no players',
          enable: 'Enable',
          disable: 'Disable',
        },
        password: {
          name: 'Password',
          tip: 'Whether a password is required for players to enter the game. Leave blank if no password is needed',
        },
        token: {
          name: 'Token',
          tip: 'The Don\'t Starve Together game token applied for on the Klei official website',
          required: 'Please input Token',
          buttonAdd: 'Default Token',
          buttonUrl: 'Create Token',
        },
        masterIP: {
          name: 'Master IP',
          tip: 'If all worlds are on the current cloud server, no changes are needed. For detailed explanations, please refer to the documentation',
          required: 'Please input Master IP',
        },
        masterPort: {
          name: 'Master Port',
          tip: 'The port connecting from the world to the master world. If all worlds are on the current cloud server, no changes are needed. For detailed explanations, please refer to the documentation',
          required: 'Please input Master Port',
        },
        clusterKey: {
          name: 'Cluster Key',
          tip: 'The authentication password for the connection between the world and the master world',
          required: 'Please input Cluster Key',
        },
      },
      step2: {
        oneClickSet: {
          name: 'One Click Setting',
          ground: 'Ground',
          cave: 'Cave',
        },
        code: 'Code',
        visualization: 'Visualization',
        isMaster: {
          name: 'Master',
          tip: 'Whether this world is the master world',
          radio: {
            yes: 'Yes',
            no: 'No',
          },
        },
        encodeUserPath: {
          name: 'Encode Path',
          tip: 'Whether to enable user save path encoding. It is recommended to enable this feature',
          radio: {
            yes: 'Yes',
            no: 'No',
          },
        },
        gameID: {
          name: 'World ID',
          tip: 'Under one room, the world ID for each world should not be the same',
          required: 'Please input World ID',
        },
        serverPort: {
          name: 'Connection Port',
          tip: 'When players enter the game, they need to communicate with this port using the UDP protocol',
          required: 'Please input Connection Port',
        },
        masterServerPort: {
          name: 'Steam Connect Port',
          tip: 'If there is no specific purpose, do not change this. It corresponds to the field server.ini-[STEAM]-master_server_port',
          required: 'Please input Steam Connect Port',
        },
        authenticationPort: {
          name: 'Steam Authentication Port',
          tip: 'If there is no specific purpose, do not change this. It corresponds to the field server.ini-[STEAM]-authentication_port',
          required: 'Please input Steam Authentication Port',
        },
        itemUndefined: 'Your config file is not the latest version',
        worldRule: {
          worldRule: 'World Settings',
          global: 'Global',
          events: 'Events',
          survivors: 'Survivors',
          world: 'World',
          resourceRegrowth: 'Resource Regrowth',
          unnaturalPortalResource: 'Unnatural Portal Resource',
          creatures: 'Creatures',
          hostileCreatures: 'Hostile Creatures',
          giants: 'Giants',
          moonMutated: 'Moon Mutated',
        },
        worldGeneration: {
          worldGeneration: 'World Generation',
          global: 'Global',
          world: 'World',
          resources: 'Resources',
          creaturesAndSpawners: 'Creatures And Spawners',
          hostileCreaturesAndSpawners: 'Hostile Creatures And Spawners',
        },
        levelData: {
          required: 'Please input world code configuration',
          lua: 'World code configuration format error',
        },
        levelDataNeeded: '',
      },
      step3: {
        modInOne: {
          name: 'Unified mods',
          tip: 'Whether mods are configured independently for each world',
          enable: 'Unified settings',
          disable: 'Individual settings',
        },
        modDataError: 'Mod code format error',
      },
      step4: {
        form: {
          backup: {
            name: 'Auto Backup',
            enable: 'Enable',
            disable: 'Disable',
            time: 'Backup Time',
            add: 'Add',
            deleteBlock: 'Must include at least one backup time',
            tip: {
              name: 'When enabled, the game save will be automatically backed up at the set time',
              time: 'Multiple backup times can be set',
            },
          },
          backupClean: {
            name: 'Backup Clean',
            enable: 'Enable',
            disable: 'Disable',
            days: 'Backup retention period',
            unit: 'Day',
            tip: {
              name: 'When enabled, backup files older than the set number of days will be automatically cleaned up',
              days: 'If set to 10 days, backup files generated more than 10 days ago will be cleaned up',
            },
            required: 'Please input Backup retention period',
          },
          restart: {
            name: 'Auto Restart',
            enable: 'Enable',
            disable: 'Disable',
            time: 'Restart Time',
            tip: {
              name: 'The DST server will restart at the set time to update mods',
              time: 'It is recommended to schedule the restart during a time when no players are in the game. A restart announcement will be made in the game 15 minutes before the restart',
            },
          },
          keepalive: {
            name: 'Keepalive',
            enable: 'Enable',
            disable: 'Disable',
            interval: 'Interval',
            unit: 'Minute',
            tip: {
              name: 'When the DMP detects an abnormal world, it will automatically restart that world',
              interval: 'The DMP will check all worlds according to the interval',
            },
            required: 'Please input Interval',
          },
          scheduledStartStop: {
            name: 'Auto Start Stop',
            enable: 'Enable',
            disable: 'Disable',
            time: {
              start: 'Start Time',
              stop: 'Stop Time',
            },
            tip: {
              name: 'The DMP will start or stop the game at the specified time',
              start: 'Start the game at the set time',
              stop: 'Stop the game at the set time',
            },
          },
          tickRate: {
            name: 'Tick Rate',
            tip: 'The communication frequency between the player\'s game client and the DST dedicated server. Higher values result in smoother gameplay but consume more resources',
          },
          bit64: {
            name: '64-bit Game',
            enable: 'Enable',
            disable: 'Disable',
            tip: 'A 64-bit dedicated server processes data faster but consumes more memory',
          },
        },
      },
      step5: {
        title: 'Configuration Completed',
        subTitle: 'Please click the "Save" button below to save',
      },
    },
  },
}
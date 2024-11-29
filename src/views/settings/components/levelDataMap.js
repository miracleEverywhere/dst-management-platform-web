export const overrides = {
  alternatehunt: {
    configs: ["never", "rare", "default", "often", "always"],
    modelValue: 'default',
    image: 'alternatehunt.png',
    i18n: {
      zh: '追猎惊喜',
      en: 'Hunt Surprises',
    }
  },
  angrybees: {
    configs: ["never", "rare", "uncommon", "default", "often", "mostly", "always", "insane"],
    modelValue: 'default',
    image: 'angrybees.png',
    i18n: {
      zh: '杀人蜂巢',
      en: 'Killer Bee Hives',
    }
  },
  antliontribute: {
    configs: ["never", "rare", "default", "often", "always"],
    modelValue: 'default',
    image: 'antliontribute.png',
    i18n: {
      zh: '蚁狮',
      en: 'Antlion Tribute',
    }
  },
  autumn: {
    configs: ["noseason", "veryshortseason", "shortseason", "default", "longseason", "verylongseason", "random",],
    modelValue: 'default',
    image: 'autumn.png',
    i18n: {
      zh: '秋天',
      en: 'Autumn',
    }
  },
  bananabush_portalrate: {
    configs: ["never", "rare", "default", "often", "always"],
    modelValue: 'default',
    image: 'bananabush_portalrate.png',
    i18n: {
      zh: '香蕉丛',
      en: 'Banana Bushes',
    }
  },
  basicresource_regrowth: {
    configs: ["never", "always"],
    modelValue: 'default',
    image: 'basicresource_regrowth.png',
    i18n: {
      zh: '基础资源',
      en: 'Basic Resource',
    }
  },
  bats_setting: {
    configs: ["never", "rare", "default", "often", "always"],
    modelValue: 'default',
    image: 'bats_setting.png',
    i18n: {
      zh: '蝙蝠',
      en: 'bianfu',
    }
  },
  bearger: {
    configs: ["never", "rare", "default", "often", "always"],
    modelValue: 'default',
    image: 'bearger.png',
    i18n: {
      zh: '熊獾',
      en: 'bianfu',
    }
  },
}

export const configsMap = {
  never: {
    zh: '无',
    en: 'None'
  },
  rare: {
    zh: '很少',
    en: 'Little'
  },
  uncommon: {
    zh: '较少',
    en: 'Less'
  },
  default: {
    zh: '默认',
    en: 'Default'
  },
  often: {
    zh: '较多',
    en: 'More'
  },
  mostly: {
    zh: '很多',
    en: 'Lots'
  },
  always: {
    zh: '大量',
    en: 'Tons'
  },
  insane: {
    zh: '疯狂',
    en: 'Insane'
  },
  noseason: {
    zh: '无',
    en: 'None'
  },
  veryshortseason: {
    zh: '很短',
    en: 'Very Short'
  },
  shortseason: {
    zh: '短',
    en: 'Short'
  },
  longseason: {
    zh: '长',
    en: 'Long'
  },
  verylongseason: {
    zh: '很长',
    en: 'Very Long'
  },
  random: {
    zh: '随机',
    en: 'Random'
  },
}

export const groundWorldSetting = {
  global: [
    'autumn',
  ],
  events: [

  ],
  survivors: [

  ],
  world: [

  ],
  resourceRegrowth: [

  ],
  unnaturalPortalResource: [

  ],
  creatures: [

  ],
  hostileCreatures: [

  ],
  giants: [

  ],
}

export const groundWorldGeneration = {
  global: [

  ],
  world: [

  ],
  resources: [

  ],
  creaturesAndSpawners: [

  ],
  hostileCreaturesAndSpawners: [

  ],
}

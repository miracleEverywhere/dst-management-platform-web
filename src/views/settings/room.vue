<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?$t('setting.roomSettingMobile'):$t('setting.roomSetting')" @click="handleStepClick(0)"/>
            <el-step :title="isMobile?$t('setting.worldSettingMobile'):$t('setting.worldSetting')" @click="handleStepClick(1)"/>
            <el-step :title="isMobile?$t('setting.modSettingMobile'):$t('setting.modSetting')" @click="handleStepClick(3)"/>
            <el-step :title="isMobile?$t('setting.finishSettingMobile'):$t('setting.finishSetting')"
                     @click="handleStepClick(2)"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card v-if="step===0" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                {{ t('setting.roomSetting') }}
              </span>
            </div>
          </template>
          <el-form ref="roomBaseFormRef" :label-position="isMobile?'top':'left'" :label-width="isMobile?'70':'auto'"
                   :model="roomBaseForm" :rules="roomBaseFormRules" :size="isMobile?'small':'large'">
            <el-form-item :label="t('setting.baseForm.room')" prop="name">
              <el-input v-model="roomBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.description')" prop="description">
              <el-input v-model="roomBaseForm.description"></el-input>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.gameMode.name')" prop="gameMode">
              <el-radio-group v-model="roomBaseForm.gameMode">
                <el-radio :label="$t('setting.baseForm.gameMode.endless')" value="endless"/>
                <el-radio :label="$t('setting.baseForm.gameMode.survival')" value="survival"/>
                <el-radio :label="$t('setting.baseForm.gameMode.lavaarena')" value="lavaarena"/>
                <el-radio :label="$t('setting.baseForm.gameMode.quagmire')" value="quagmire"/>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.pvp')" prop="pvp">
              <el-switch v-model="roomBaseForm.pvp"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.playerNum')" prop="playerNum">
              <el-slider v-model="roomBaseForm.playerNum" :max="100" :min="2" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.backDays')" prop="backDays">
              <el-slider v-model="roomBaseForm.backDays" :max="50" :min="5" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.vote')" prop="vote">
              <el-switch v-model="roomBaseForm.vote"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.password')">
              <el-input v-model="roomBaseForm.password" autocomplete="new-password" show-password></el-input>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.token')" prop="token">
              <el-input v-model="roomBaseForm.token" show-password></el-input>
              <div class="el-form-item-msg">
                <el-link :underline="false" href="https://accounts.klei.com"
                         target="_blank">{{ t('setting.baseForm.tokenHelp') }}
                </el-link>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===1" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-tabs v-model="worldTabName" type="card" editable @edit="handleWorldTabsEdit">
            <el-tab-pane v-for="(world, index) in worldForm" :key="world.name"
                         :name="world.name"
                         :label="world.name">

            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card v-if="step===2" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-form ref="roomModFormRef" :label-width="isMobile?'70':'100'" :model="roomModForm" :rules="roomModFormRules"
                   :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="modSetting">
              <sc-code-editor ref="editor" v-model="roomModForm.modSetting" :height="isMobile?320:500"
                              :theme="isDark?'darcula':'idea'"
                              mode="lua" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===3" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <div :style="isMobile?'min-height: 360px':'min-height: 560px'" class="fcc">
            <el-result :sub-title="$t('setting.finish.description')" :title="$t('setting.finish.title')" icon="success"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card shadow="never">
          <div style="display: flex; justify-content: flex-end;">
            <el-button v-if="step>0" @click="handlePrev">{{ t('setting.button.prev') }}</el-button>
            <el-button v-if="step<3" type="primary" @click="handleNext">{{ t('setting.button.next') }}</el-button>
            <el-dropdown v-if="step===3" style="margin-left: 12px" trigger="click" @command="handleCommand">
              <el-button :loading="loading" type="warning">
                {{ t('setting.button.actions') }}
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="save">{{ t('setting.button.save') }}</el-dropdown-item>
                  <el-dropdown-item command="saveAndRestart">{{ t('setting.button.saveAndRestart') }}</el-dropdown-item>
                  <el-dropdown-item command="generateNewWorld">{{ t('setting.button.generateNewWorld') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="settingsRoom" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {useRoute, useRouter} from "vue-router";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import luaparse from 'luaparse'
import luamin from 'lua-format'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import {
  caveOverrideWorldGenerationWorld,
  cavesWorldGeneration,
  cavesWorldRule,
  groundWorldGeneration,
  groundWorldRule,
  overrides
} from "@/views/settings/components/levelDataMap.js"
import {endless, survival} from "@/views/settings/components/leveldataoverride.js"

const {t} = useI18n()

onMounted(async () => {
  await getMultiHost()
  await handleGetCurrentRoomSetting()
})

const loading = ref(false)

const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")
const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.name);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name);
      refreshCurrentPage(true);
    });
  }, 0);
};

const editorGroundSettingRef = ref()
const editorCavesSettingRef = ref()

const step = ref(0)
const handleStepClick = (goStep) => {
  if (isMultiHost.value) {
    if (step.value > goStep) {
      step.value = goStep
    }
  } else {
    if (step.value > goStep) {
      if (goStep === 1) {
        generateGroundOverridesObj()
      }
      if (goStep === 2) {
        generateCavesOverridesObj()
      }
      step.value = goStep
    }
  }

}
const handlePrev = () => {
  step.value--
}
const handleNext = async () => {
  if (step.value === 0) {
    roomBaseFormRef.value.validate(valid => {
      if (valid) {
        step.value++
      }
    })
  }
  if (step.value === 1) {
    roomBaseFormRef.value.validate(valid => {
      if (valid) {
        if (isMaster.value) {
          roomGroundFormRef.value.validate(groundValid => {
            if (groundValid) {
              try {
                luaparse.parse(roomGroundForm.value.groundSetting)
                step.value++
              } catch (e) {
                koiMsgError(t('setting.luaError'))
              }
            }
          })
        } else {
          roomCaveFormRef.value.validate(caveValid => {
            if (caveValid) {
              try {
                luaparse.parse(roomCaveForm.value.caveSetting)
                step.value++
              } catch (e) {
                koiMsgError(t('setting.luaError'))
              }
            }
          })
        }
      }
    })
  }
  if (step.value === 2) {
    if (roomModForm.value) {
      try {
        luaparse.parse(roomModForm.value.modSetting);
        step.value++
      } catch (e) {
        koiMsgError(t('setting.luaError'))
      }
    }
  }
}

const roomBaseFormRef = ref()
const roomBaseForm = ref({
  name: '',
  description: '',
  gameMode: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: true,
  password: '',
  token: '',
})
const roomBaseFormRules = {
  name: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'blur'}],
  masterPort: [{required: true, message: t('setting.roomBaseFormRules.masterPort'), trigger: 'blur'}],
  cavesPort: [{required: true, message: t('setting.roomBaseFormRules.cavesPort'), trigger: 'blur'}],
  gameMode: [{required: true, message: t('setting.roomBaseFormRules.gameMode'), trigger: 'change'}],
  token: [{required: true, message: t('setting.roomBaseFormRules.token'), trigger: 'blur'}],
}

const roomGroundFormRef = ref()
const roomGroundForm = ref({
  groundSetting: '',
})
const roomGroundFormRules = {
  groundSetting: [{required: true, message: t('setting.roomGroundFormRules.groundSetting'), trigger: 'blur'}],
}

const roomCaveFormRef = ref()
const roomCaveForm = ref({
  caveSetting: '',
})
const roomCaveFormRules = {
  caveSetting: [{required: true, message: t('setting.roomCaveFormRules.caveSetting'), trigger: 'blur'}],
}

const roomModFormRef = ref()
const roomModForm = ref({
  modSetting: '',
})
const roomModFormRules = {
  modSetting: [{required: true, message: t('setting.roomModFormRules.modSetting'), trigger: 'blur'}],
}

const handleImportLeveldataLua = (world, mode) => {
  if (world === 'master') {
    if (mode === 'endless') {
      roomGroundForm.value.groundSetting = endless.master
    }
    if (mode === 'survival') {
      roomGroundForm.value.groundSetting = survival.master
    }
    // generateGroundOverridesObj()
    if (isMultiHost.value) {
      roomBaseForm.value.masterPort = 11000
      roomBaseForm.value.cavesPort = 0
      roomBaseForm.value.shardMasterPort = 10888
      roomBaseForm.value.steamMasterPort = 27018
      roomBaseForm.value.steamAuthenticationPort = 8768
      roomBaseForm.value.shardMasterIp = '127.0.0.1'
      roomBaseForm.value.clusterKey = undefined
    }
  }
  if (world === 'caves') {
    if (mode === 'endless') {
      roomCaveForm.value.caveSetting = endless.caves
    }
    if (mode === 'survival') {
      roomCaveForm.value.caveSetting = survival.caves
    }
    // generateCavesOverridesObj()
    if (isMultiHost.value) {
      roomBaseForm.value.masterPort = 0
      roomBaseForm.value.cavesPort = 11001
      roomBaseForm.value.shardMasterPort = 10888
      roomBaseForm.value.steamMasterPort = 27019
      roomBaseForm.value.steamAuthenticationPort = 8769
      roomBaseForm.value.shardMasterIp = undefined
      roomBaseForm.value.clusterKey = undefined
    }
  }
}

const handleGetCurrentRoomSetting = () => {
  settingApi.room.get().then(response => {
    roomBaseForm.value = response.data.base
    roomGroundForm.value.groundSetting = response.data.ground
    roomCaveForm.value.caveSetting = response.data.cave
    roomModForm.value.modSetting = response.data.mod
    if (roomGroundForm.value.groundSetting === "") {
      isMaster.value = false
    } else {
      if (roomCaveForm.value.caveSetting === "") {
        isMaster.value = true
      } else {
        isMaster.value = true
      }
    }
    if (roomBaseForm.value.masterPort === 0) {
      roomBaseForm.value.masterPort = 11000
    }
    if (roomBaseForm.value.cavesPort === 0) {
      roomBaseForm.value.cavesPort = 11001
    }
  })
}

const handleCommand = (cmd) => {
  switch (cmd) {
    case 'save':
      handleSave()
      break;
    case 'saveAndRestart':
      handleSaveAndRestart()
      break;
    case 'generateNewWorld':
      handleGenerateNewWorld()
      break;
  }
}

const handleSave = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.save.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    loading.value = false
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}
const handleSaveAndRestart = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.saveAndRestart.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    loading.value = false
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}
const handleGenerateNewWorld = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.saveAndGenerate.post(reqForm).then(response => {
    loading.value = false
    koiMsgSuccess(response.message)
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}

const groundTabName = ref('Code')
const cavesTabName = ref('Code')

const handleGroundTabChange = (name) => {
  if (name === 'Visualization') {
    try {
      generateGroundOverridesObj()
    } catch {
      koiMsgError(language.value==='zh'?'可视化配置加载失败':'Visualization load failed')
    }
  }
  if (name === 'Code') {
    roomGroundForm.value.groundSetting = beautifyLua(roomGroundForm.value.groundSetting)
    nextTick(() => {
      if (editorGroundSettingRef.value) {
        editorGroundSettingRef.value.refresh()
      }
    })
  }
}

const handleCavesTabChange = (name) => {
  if (name === 'Visualization') {
    try {
      generateCavesOverridesObj()
    } catch {
      koiMsgError(language.value==='zh'?'可视化配置加载失败':'Visualization load failed')
    }
  }
  if (name === 'Code') {
    roomCaveForm.value.caveSetting = beautifyLua(roomCaveForm.value.caveSetting)
    nextTick(() => {
      if (editorCavesSettingRef.value) {
        editorCavesSettingRef.value.refresh()
      }
    })
  }
}

const overridesObj = ref({})

const generateGroundOverridesObj = () => {
  if (roomGroundForm.value.groundSetting === '') {
    return
  }
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // 将 Lua 表转换为 JavaScript 对象
  overridesObj.value = convertLuaTableToObject(overridesTable);
}

const generateCavesOverridesObj = () => {
  if (roomCaveForm.value.caveSetting === '') {
    return
  }
  const ast = luaparse.parse(roomCaveForm.value.caveSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // 将 Lua 表转换为 JavaScript 对象
  overridesObj.value = convertLuaTableToObject(overridesTable);
}

function extractOverrides(ast) {
  // 找到 return 语句中的 overrides 字段
  const returnStatement = ast.body[0]; // 假设只有一个 return 语句
  const returnTable = returnStatement.arguments[0]; // return 语句的参数是一个表

  // 遍历表中的字段，找到 overrides 字段
  for (const field of returnTable.fields) {
    // console.log(field)
    if (field.key.type === 'Identifier' && field.key.name === 'overrides') {
      return field.value;
    }
  }

  return null;
}

function convertLuaTableToObject(luaTable) {
  const obj = {};
  for (const field of luaTable.fields) {
    const key = field.key.name;
    obj[key] = field.value.raw.replace(/"/g, '')
  }

  return obj;
}

const beautifyLua = (luaScript) => {
  let removedWatermark = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false,
  });
  removedWatermark = removedWatermark.replace(/--\[\[\n\t.+\n\t.+\n--]]\n\n\n\n\n/g, "");
  removedWatermark = removedWatermark.replace(/ = /g, "=");
  removedWatermark = removedWatermark.replace(/\t/g, "  ");

  removedWatermark = removedWatermark.replace(/overrides=\{ +(.+)\n/g, "overrides={\n    $1\n");
  removedWatermark = removedWatermark.replace(/^(\w+)=(.+)\n/gm, "    $1=$2\n");
  removedWatermark = removedWatermark.replace(/(.+)},\n/g, "$1\n  },\n");
  removedWatermark = removedWatermark.replace(/^ +?\n/gm, "");

  return removedWatermark;
};

const handleModelValueChange = (data) => {
  const key = data.name
  const value = data.value
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`
    }
  }
  roomGroundForm.value.groundSetting = astToLua(ast)
}

const handleCavesModelValueChange = (data) => {
  const key = data.name
  const value = data.value
  const ast = luaparse.parse(roomCaveForm.value.caveSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`
    }
  }
  const luaScript = astToLua(ast)
  roomCaveForm.value.caveSetting = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false
  })
  if (editorCavesSettingRef.value) {
    editorCavesSettingRef.value.refresh()
  }
}

const astToLua = (astNode, indentLevel = 0) => {
  const indent = '    '.repeat(indentLevel);
  switch (astNode.type) {
    case 'Chunk':
      return astNode.body.map(node => astToLua(node, indentLevel)).join('\n');
    case 'LocalStatement':
      return `${indent}local ${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`;
    case 'FunctionDeclaration':
      return `${indent}function ${astToLua(astNode.identifier)}(${astNode.parameters.map(astToLua).join(', ')}) \n${astToLua(astNode.body, indentLevel + 1)}\n${indent}end`;
    case 'ReturnStatement':
      return `${indent}return ${astNode.arguments.map(astToLua).join(', ')}`;
    case 'BinaryExpression':
      return `${astToLua(astNode.left)} ${astNode.operator} ${astToLua(astNode.right)}`;
    case 'CallStatement':
      return `${indent}${astToLua(astNode.expression)}`;
    case 'Identifier':
      return astNode.name;
    case 'StringLiteral':
      return `${astNode.raw}`;
    case 'NumericLiteral':
      return astNode.raw;
    case 'VarargLiteral':
      return '...';
    case 'TableConstructorExpression':
      return `${indent}{ ${astNode.fields.map(field => astToLua(field, indentLevel + 1)).join(',\n' + indent)} }`;
    case 'Field':
      return astNode.key ? `${astToLua(astNode.key)} = ${astToLua(astNode.value)}` : astToLua(astNode.value);
    case 'AssignmentStatement':
      return `${indent}${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`;
    case 'CallExpression':
      return `${astToLua(astNode.base)}(${astNode.arguments.map(astToLua).join(', ')})`;
    case 'TableKeyString':
      return `${astToLua(astNode.key)} = ${astToLua(astNode.value)}`;
    case 'BooleanLiteral':
      return astNode.raw;
    case 'TableValue':
      return astToLua(astNode.value);
    default:
      throw new Error(`Unsupported node type: ${astNode.type}`);
  }
}

const isMultiHost = ref(false)
const getMultiHost = async () => {
  await settingApi.multihost.get().then(response => {
    isMultiHost.value = response.data
  })
}

const handleChangeMultiHost = (v) => {
  settingApi.multihost.post({multiHost: !isMultiHost.value}).then(response => {
    isMultiHost.value = !isMultiHost.value
    if (v) {
      clearSetting()
    }

  })
}

const isMaster = ref(true)

const clearSetting = () => {
  roomGroundForm.value.groundSetting = ""
  roomCaveForm.value.caveSetting = ""

  roomBaseForm.value.masterPort = undefined
  roomBaseForm.value.cavesPort = undefined
  roomBaseForm.value.shardMasterPort = undefined
  roomBaseForm.value.steamMasterPort = undefined
  roomBaseForm.value.steamAuthenticationPort = undefined
  if (isMaster.value) {
    roomBaseForm.value.shardMasterIp = '127.0.0.1'
  } else {
    roomBaseForm.value.shardMasterIp = undefined
  }

  roomBaseForm.value.clusterKey = undefined

}

const multiHostFormRules = {
  masterPort: [{required: true, message: t('setting.roomWorldFormRules.masterPort'), trigger: 'blur'}],
  cavesPort: [{required: true, message: t('setting.roomWorldFormRules.cavesPort'), trigger: 'blur'}],
  shardMasterPort: [{required: true, message: t('setting.roomWorldFormRules.shardMasterPort'), trigger: 'blur'}],
  steamMasterPort: [{required: true, message: t('setting.roomWorldFormRules.steamMasterPort'), trigger: 'blur'}],
  steamAuthenticationPort: [{required: true, message: t('setting.roomWorldFormRules.steamAuthenticationPort'), trigger: 'blur'}],
  shardMasterIp: [{required: true, message: t('setting.roomWorldFormRules.shardMasterIp'), trigger: 'blur'}],
  clusterKey: [{required: true, message: t('setting.roomWorldFormRules.clusterKey'), trigger: 'blur'}],
}

const worldTabName = ref('World0')
const worldForm = ref([
  {
    name: 'World0',
    isMaster: true,
    levelData: '',
    serverPort: undefined,
    shardMasterPort: undefined,
    steamMasterPort: undefined,
    steamAuthenticationPort: undefined,
    shardMasterIp: undefined,
    clusterKey: undefined,
    encodeUserPath: true,
  }
])
let worldTabIndex = worldForm.value.length - 1
const handleWorldTabsEdit = (
  targetName,
  action
) => {
  if (action === 'add') {
    const newTabName = `World${++worldTabIndex}`
    worldForm.value.push({
      name: newTabName,
      isMaster: false,
      levelData: '',
      serverPort: undefined,
      shardMasterPort: undefined,
      steamMasterPort: undefined,
      steamAuthenticationPort: undefined,
      shardMasterIp: undefined,
      clusterKey: undefined,
      encodeUserPath: true,
    })
    worldTabName.value = newTabName
  } else if (action === 'remove') {
    const tabs = worldForm.value
    let activeName = worldTabName.value
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    }

    worldTabName.value = activeName
    worldForm.value = tabs.filter((tab) => tab.name !== targetName)
  }
}

watch(() => globalStore.selectedDstCluster, (newValue, oldValue) => {
  if (newValue) {
    nextTick(() => {
      handleRefresh()
    })
  }
}, {immediate: false})

</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
}
</style>

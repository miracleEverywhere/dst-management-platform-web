<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step @click="handleStepClick(0)" :title="isMobile?$t('setting.roomSettingMobile'):$t('setting.roomSetting')"/>
            <el-step @click="handleStepClick(1)" :title="isMobile?$t('setting.groundSettingMobile'):$t('setting.groundSetting')"/>
            <el-step @click="handleStepClick(2)" :title="isMobile?$t('setting.caveSettingMobile'):$t('setting.caveSetting')"/>
            <el-step @click="handleStepClick(3)" :title="isMobile?$t('setting.modSettingMobile'):$t('setting.modSetting')"/>
            <el-step @click="handleStepClick(4)" :title="isMobile?$t('setting.finishSettingMobile'):$t('setting.finishSetting')"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card v-if="step===0" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'" >
          <el-form ref="roomBaseFormRef" :label-position="isMobile?'top':'left'" :model="roomBaseForm"
                   :rules="roomBaseFormRules" :label-width="isMobile?'70':'auto'" :size="isMobile?'small':'large'">
            <el-form-item :label="$t('setting.baseForm.room')" prop="name">
              <el-input v-model="roomBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.description')" prop="description">
              <el-input v-model="roomBaseForm.description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.gameMode.name')" prop="gameMode">
              <el-radio-group v-model="roomBaseForm.gameMode">
                <el-radio :label="$t('setting.baseForm.gameMode.endless')" value="endless" />
                <el-radio :label="$t('setting.baseForm.gameMode.survival')" value="survival" />
                <el-radio :label="$t('setting.baseForm.gameMode.lavaarena')" value="lavaarena" />
                <el-radio :label="$t('setting.baseForm.gameMode.quagmire')" value="quagmire" />
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.pvp')" prop="pvp">
              <el-switch v-model="roomBaseForm.pvp" />
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.playerNum')" prop="playerNum">
              <el-slider v-model="roomBaseForm.playerNum" size="small" show-input :min="2" :max="100"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.backDays')" prop="backDays">
              <el-slider v-model="roomBaseForm.backDays" size="small" show-input  :min="5" :max="50"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.vote')" prop="vote">
              <el-switch v-model="roomBaseForm.vote" />
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.password')">
              <el-input v-model="roomBaseForm.password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.token')" prop="token">
              <el-input v-model="roomBaseForm.token" show-password></el-input>
              <div class="el-form-item-msg">
                <el-link :underline="false" target="_blank"
                         href="https://accounts.klei.com">{{t('setting.baseForm.tokenHelp')}}</el-link>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===1" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'">
          <el-tabs v-model="groundTabName">
            <el-tab-pane label="Code" name="Code">
              <el-form ref="roomGroundFormRef" :model="roomGroundForm" :rules="roomGroundFormRules"
                       :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
                <el-form-item label-position="top" prop="groundSetting">
                  <sc-code-editor ref="editor" v-model="roomGroundForm.groundSetting" mode="lua" :theme="isDark?'darcula':'idea'"
                                  :height="isMobile?320:500" style="width: 100%"></sc-code-editor>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Visualization" name="Visualization">
              <template v-for="(item, k) in overrides">
                <LevelDataSetting v-model="item.modelValue"
                                  :name="k"
                                  :i18n="item.i18n"
                                  :configs="item.configs"
                                  :image="item.image"
                                  :customConfigsValue="item.customConfigsValue"/>
              </template>

            </el-tab-pane>

          </el-tabs>
        </el-card>
        <el-card v-if="step===2" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'">
          <el-alert :effect="isDark?'light':'dark'" type="success" :closable="false">{{t('setting.cavesTip')}}</el-alert>
          <el-form ref="roomCaveFormRef" :model="roomCaveForm" :rules="roomCaveFormRules"
                   :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'" style="margin-top: 10px">
            <el-form-item label-position="top" prop="caveSetting">
              <sc-code-editor ref="editor" v-model="roomCaveForm.caveSetting" mode="lua" :theme="isDark?'darcula':'idea'"
                              :height="isMobile?320:500" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===3" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'">
          <el-form ref="roomModFormRef" :model="roomModForm" :rules="roomModFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="modSetting">
              <sc-code-editor ref="editor" v-model="roomModForm.modSetting" mode="lua" :theme="isDark?'darcula':'idea'"
                              :height="isMobile?320:500" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===4" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'">
          <el-result
            icon="success"
            :title="$t('setting.finish.title')"
            :sub-title="$t('setting.finish.description')"
            :style="isMobile?'margin-top: 20%':'margin-top: 15%'"
          >
          </el-result>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card shadow="never">
          <div style="display: flex; justify-content: flex-end;">
            <el-button v-if="step>0" @click="handlePrev">{{t('setting.button.prev')}}</el-button>
            <el-button v-if="step<4" type="primary" @click="handleNext">{{t('setting.button.next')}}</el-button>
            <el-dropdown v-if="step===4" @command="handleCommand" trigger="click" style="margin-left: 12px">
              <el-button type="warning" :loading="loading">
                {{t('setting.button.actions')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="save">{{t('setting.button.save')}}</el-dropdown-item>
                  <el-dropdown-item command="saveAndRestart">{{t('setting.button.saveAndRestart')}}</el-dropdown-item>
                  <el-dropdown-item command="generateNewWorld">{{t('setting.button.generateNewWorld')}}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="settingsRoom">
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import luaparse from 'luaparse'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import {overrides} from "@/views/settings/components/levelDataMap.js"

const { t } = useI18n()

onMounted(() => {
  handleGetCurrentRoomSetting()
})

const loading = ref(false)

const { isMobile } = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const step = ref(0)
const handleStepClick = (goStep) => {
  if (step.value > goStep) {
    step.value = goStep
  }
}
const handlePrev = () => {
  step.value--
}
const handleNext = () => {
  if (step.value === 0) {
    roomBaseFormRef.value.validate(valid => {
      if (valid) {
        step.value++
      }
    })
  } else if (step.value === 1) {
    roomGroundFormRef.value.validate(valid => {
      if (valid) {
        try {
          luaparse.parse(roomGroundForm.value.groundSetting);
          step.value++
        } catch (e) {
          koiMsgError(t('setting.luaError'))
        }
      }
    })
  } else if (step.value === 2) {
    if (roomCaveForm.value) {
      try {
        luaparse.parse(roomCaveForm.value.caveSetting);
        step.value++
      } catch (e) {
        koiMsgError(t('setting.luaError'))
      }
    }else {
      step.value++
    }
  } else if (step.value === 3) {
    if (roomModForm.value) {
      try {
        luaparse.parse(roomModForm.value.modSetting);
        step.value++
      } catch (e) {
        koiMsgError(t('setting.luaError'))
      }
    }else {
      step.value++
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
  name: [ { required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'blur' } ],
  token: [ { required: true, message: t('setting.roomBaseFormRules.token'), trigger: 'blur' } ],
}

const roomGroundFormRef = ref()
const roomGroundForm = ref({
  groundSetting: '',
})
const roomGroundFormRules = {
  groundSetting: [ { required: true, message: t('setting.roomGroundFormRules.groundSetting'), trigger: 'blur' } ],
}

const roomCaveFormRef = ref()
const roomCaveForm = ref({
  caveSetting: '',
})
const roomCaveFormRules = {
  caveSetting: [ { required: true, message: t('setting.roomCaveFormRules.caveSetting'), trigger: 'blur' } ],
}

const roomModFormRef = ref()
const roomModForm = ref({
  modSetting: '',
})
const roomModFormRules = {
  modSetting: [ { required: true, message: t('setting.roomModFormRules.modSetting'), trigger: 'blur' } ],
}

const handleGetCurrentRoomSetting = () => {
  settingApi.room.get().then(response => {
    roomBaseForm.value = response.data.base
    roomGroundForm.value.groundSetting = response.data.ground
    roomCaveForm.value.caveSetting = response.data.cave
    roomModForm.value.modSetting = response.data.mod
  })
}

const handleCommand = (cmd) => {
  switch(cmd)
  {
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
  })
}

const groundTabName = ref('Code')


const aaa = () => {
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
// 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
// 将 Lua 表转换为 JavaScript 对象
  const overridesss = convertLuaTableToObject(overridesTable);
  console.log(overridesss)
}


function extractOverrides(ast) {
  // 找到 return 语句中的 overrides 字段
  const returnStatement = ast.body[0]; // 假设只有一个 return 语句
  const returnTable = returnStatement.arguments[0]; // return 语句的参数是一个表

  // 遍历表中的字段，找到 overrides 字段
  for (const field of returnTable.fields) {
    // console.log(field)
    if (field.key.type === 'Identifier' && field.key.name === 'overrides') {
      console.log(field.value)
      return field.value;
    }
  }

  return null;
}

function convertLuaTableToObject(luaTable) {
  const obj = {};
  for (const field of luaTable.fields) {
    const key = field.key.name;
    const value = field.value.raw.replace(/"/g, '')
    obj[key] = value
  }

  return obj;
}


</script>

<style scoped>

</style>

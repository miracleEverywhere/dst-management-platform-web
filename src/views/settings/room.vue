<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?$t('setting.roomSettingMobile'):$t('setting.roomSetting')" @click="handleStepClick(0)"/>
            <el-step :title="isMobile?$t('setting.groundSettingMobile'):$t('setting.groundSetting')" @click="handleStepClick(1)"/>
            <el-step :title="isMobile?$t('setting.caveSettingMobile'):$t('setting.caveSetting')" @click="handleStepClick(2)"/>
            <el-step :title="isMobile?$t('setting.modSettingMobile'):$t('setting.modSetting')" @click="handleStepClick(3)"/>
            <el-step :title="isMobile?$t('setting.finishSettingMobile'):$t('setting.finishSetting')" @click="handleStepClick(4)"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card v-if="step===0" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-form ref="roomBaseFormRef" :label-position="isMobile?'top':'left'" :label-width="isMobile?'70':'auto'"
                   :model="roomBaseForm" :rules="roomBaseFormRules" :size="isMobile?'small':'large'">
            <el-form-item :label="$t('setting.baseForm.room')" prop="name">
              <el-input v-model="roomBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.description')" prop="description">
              <el-input v-model="roomBaseForm.description"></el-input>
            </el-form-item>
            <el-form-item prop="masterPort">
              <template #label>
                <el-tooltip :content="t('setting.roomBaseFormPortToolTip')" effect="light" placement="top">
                  {{ t('setting.baseForm.masterPort') }}
                </el-tooltip>
              </template>
              <el-input-number v-model="roomBaseForm.masterPort" :max="65535" :min="1" :size="isMobile?'small':'large'"
                               controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item prop="cavesPort">
              <template #label>
                <el-tooltip :content="t('setting.roomBaseFormPortToolTip')" effect="light" placement="top">
                  {{ t('setting.baseForm.cavesPort') }}
                </el-tooltip>
              </template>
              <el-input-number v-model="roomBaseForm.cavesPort" :max="65535" :min="1" :size="isMobile?'small':'large'"
                               controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.gameMode.name')" prop="gameMode">
              <el-radio-group v-model="roomBaseForm.gameMode">
                <el-radio :label="$t('setting.baseForm.gameMode.endless')" value="endless"/>
                <el-radio :label="$t('setting.baseForm.gameMode.survival')" value="survival"/>
                <el-radio :label="$t('setting.baseForm.gameMode.lavaarena')" value="lavaarena"/>
                <el-radio :label="$t('setting.baseForm.gameMode.quagmire')" value="quagmire"/>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.pvp')" prop="pvp">
              <el-switch v-model="roomBaseForm.pvp"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.playerNum')" prop="playerNum">
              <el-slider v-model="roomBaseForm.playerNum" :max="100" :min="2" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.backDays')" prop="backDays">
              <el-slider v-model="roomBaseForm.backDays" :max="50" :min="5" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.vote')" prop="vote">
              <el-switch v-model="roomBaseForm.vote"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.password')">
              <el-input v-model="roomBaseForm.password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.token')" prop="token">
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
          <el-tabs v-model="groundTabName" @tab-click="handleTabClick">
            <el-tab-pane label="Code" name="Code">
              <el-form ref="roomGroundFormRef" :label-width="isMobile?'70':'100'" :model="roomGroundForm"
                       :rules="roomGroundFormRules" :size="isMobile?'small':'large'">
                <el-form-item label-position="top" prop="groundSetting">
                  <sc-code-editor ref="editorGroundSettingRef" v-model="roomGroundForm.groundSetting" :height="isMobile?320:500"
                                  :theme="isDark?'darcula':'idea'"
                                  mode="lua" style="width: 100%"></sc-code-editor>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Visualization" name="Visualization">
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.global') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.global">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.events') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.events">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.survivors') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.survivors">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.world') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.world">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.resourceRegrowth') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.resourceRegrowth">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.unnaturalPortalResource') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.unnaturalPortalResource">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.creatures') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.creatures">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.hostileCreatures') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.hostileCreatures">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.giants') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.giants">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.global') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.global">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.world') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.world">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.resources') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.resources">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.creaturesAndSpawners') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.creaturesAndSpawners">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.hostileCreaturesAndSpawners') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.hostileCreaturesAndSpawners">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>

            </el-tab-pane>

          </el-tabs>
        </el-card>
        <el-card v-if="step===2" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-alert :closable="false" :effect="isDark?'light':'dark'" type="success">{{ t('setting.cavesTip') }}</el-alert>
          <el-form ref="roomCaveFormRef" :label-width="isMobile?'70':'100'" :model="roomCaveForm"
                   :rules="roomCaveFormRules" :size="isMobile?'small':'large'" style="margin-top: 10px">
            <el-form-item label-position="top" prop="caveSetting">
              <sc-code-editor ref="editor" v-model="roomCaveForm.caveSetting" :height="isMobile?320:500"
                              :theme="isDark?'darcula':'idea'"
                              mode="lua" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===3" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-form ref="roomModFormRef" :label-width="isMobile?'70':'100'" :model="roomModForm" :rules="roomModFormRules"
                   :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="modSetting">
              <sc-code-editor ref="editor" v-model="roomModForm.modSetting" :height="isMobile?320:500"
                              :theme="isDark?'darcula':'idea'"
                              mode="lua" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===4" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
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
            <el-button v-if="step<4" type="primary" @click="handleNext">{{ t('setting.button.next') }}</el-button>
            <el-dropdown v-if="step===4" style="margin-left: 12px" trigger="click" @command="handleCommand">
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
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import luaparse from 'luaparse'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import {groundWorldRule,groundWorldGeneration, overrides} from "@/views/settings/components/levelDataMap.js"

const {t} = useI18n()

onMounted(() => {
  handleGetCurrentRoomSetting()
})

const loading = ref(false)

const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const editorGroundSettingRef = ref()

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
        if (roomBaseForm.value.masterPort === roomBaseForm.value.cavesPort) {
          koiMsgError(t('setting.roomBaseFormRules.samePort'))
          return
        }
        generateOverridesObj()
        step.value++
      }
    })
  } else if (step.value === 1) {
    roomGroundFormRef.value.validate(valid => {
      if (valid) {
        try {
          roomGroundForm.value.groundSetting = tmpGroundSetting.value
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
    } else {
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
    } else {
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
  masterPort: 0,
  cavesPort: 0,
})
const roomBaseFormRules = {
  name: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'blur'}],
  masterPort: [{required: true, message: t('setting.roomBaseFormRules.masterPort'), trigger: 'blur'}],
  cavesPort: [{required: true, message: t('setting.roomBaseFormRules.cavesPort'), trigger: 'blur'}],
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

const handleGetCurrentRoomSetting = () => {
  settingApi.room.get().then(response => {
    roomBaseForm.value = response.data.base
    roomGroundForm.value.groundSetting = response.data.ground
    roomCaveForm.value.caveSetting = response.data.cave
    roomModForm.value.modSetting = response.data.mod
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

const overridesObj = ref({})
const getFieldValue = (field) => {

}
const generateOverridesObj = () => {
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
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

const tmpGroundSetting = ref({})
const handleTabClick = (tab, event) => {
  if (tab.paneName === 'Code') {
    roomGroundForm.value.groundSetting = tmpGroundSetting.value
    if (editorGroundSettingRef.value) {
      editorGroundSettingRef.value.refresh()
    }
  }
}

const handleModelValueChange = (data) => {
  overridesObj.value[data.name] = data.value
  tmpGroundSetting.value = insertOverridesToLuaScript(roomGroundForm.value.groundSetting, convertObjectToLuaTable(overridesObj.value))
}

const convertObjectToLuaTable = (obj) => {
  let result = '{\n';
  const keys = Object.keys(obj);

  keys.forEach((key, index) => {
    const value = obj[key];
    if (typeof value === 'string') {
      result += `    ${key}="${value}"`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      result += `    ${key}=${convertObjectToLuaTable(value)}`;
    } else {
      result += `    ${key}=${value}`;
    }

    if (index < keys.length - 1) {
      result += ',\n';
    } else {
      result += '\n';
    }
  });

  result += '  },\n';
  return result;
}

const insertOverridesToLuaScript = (luaScript, overridesObj) => {
  return luaScript.replace(/overrides=\{[\s\S]*playstyle/m, `overrides=${overridesObj}  playstyle`)
}

</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
}
</style>

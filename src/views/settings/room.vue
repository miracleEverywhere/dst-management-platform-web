<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?$t('setting.roomSettingMobile'):$t('setting.roomSetting')"/>
            <el-step :title="isMobile?$t('setting.groundSettingMobile'):$t('setting.groundSetting')"/>
            <el-step :title="isMobile?$t('setting.caveSettingMobile'):$t('setting.caveSetting')"/>
            <el-step :title="isMobile?$t('setting.modSettingMobile'):$t('setting.modSetting')"/>
            <el-step :title="isMobile?$t('setting.finishSettingMobile'):$t('setting.finishSetting')"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card v-if="step===0" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'" >
          <el-form ref="roomBaseFormRef" :label-position="isMobile?'top':'left'" :model="roomBaseForm" :rules="roomBaseFormRules" :label-width="isMobile?'70':'auto'" :size="isMobile?'small':'large'">
            <el-form-item :label="$t('setting.baseForm.room')" prop="name">
              <el-input v-model="roomBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.description')" prop="description">
              <el-input v-model="roomBaseForm.description"></el-input>
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
            <el-form-item :label="$t('setting.baseForm.password')" prop="password">
              <el-input v-model="roomBaseForm.password" show-password></el-input>
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
          <el-form ref="roomGroundFormRef" :model="roomGroundForm" :rules="roomGroundFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="groundSetting">
              <sc-code-editor ref="editor" v-model="roomGroundForm.groundSetting" mode="lua" :height="isMobile?320:500" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===2" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'">
          <el-form ref="roomCaveFormRef" :model="roomCaveForm" :rules="roomCaveFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="caveSetting">
              <sc-code-editor ref="editor" v-model="roomCaveForm.caveSetting" mode="lua" :height="isMobile?320:500" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===3" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'">
          <el-form ref="roomModFormRef" :model="roomModForm" :rules="roomModFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="modSetting">
              <sc-code-editor ref="editor" v-model="roomModForm.modSetting" mode="lua" :height="isMobile?320:500" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===4" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 600px'">
          <el-result
            icon="success"
            :title="$t('setting.finish.title')"
            :sub-title="$t('setting.finish.description')"
            style="margin-top: 20%"
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
              <el-button type="warning">
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
import {onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import luaparse from 'luaparse'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {useI18n} from "vue-i18n";

const { t } = useI18n()

onMounted(() => {
  handleGetCurrentRoomSetting()
})

const { isMobile } = useScreenStore();

const step = ref(0)
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
  settingApi.save.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  })
}
const handleSaveAndRestart = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  settingApi.saveAndRestart.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  })
}
const handleGenerateNewWorld = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  settingApi.saveAndGenerate.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  })
}

</script>

<style scoped>

</style>
<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?'房间':'房间设置'"/>
            <el-step :title="isMobile?'地面':'地面设置'"/>
            <el-step :title="isMobile?'洞穴':'洞穴设置'"/>
            <el-step :title="isMobile?'模组':'模组设置'"/>
            <el-step :title="isMobile?'完成':'设置完成'"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card v-if="step===0" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'" >
          <el-form ref="roomBaseFormRef" :model="roomBaseForm" :rules="roomBaseFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label="房间名" prop="name">
              <el-input v-model="roomBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item label="房间描述" prop="description">
              <el-input v-model="roomBaseForm.description"></el-input>
            </el-form-item>
            <el-form-item label="玩家对战" prop="pvp">
              <el-switch v-model="roomBaseForm.pvp" />
            </el-form-item>
            <el-form-item label="玩家数量" prop="playerNum">
              <el-slider v-model="roomBaseForm.playerNum" size="small" show-input :min="2" :max="100"/>
            </el-form-item>
            <el-form-item label="回档天数" prop="backDays">
              <el-slider v-model="roomBaseForm.backDays" size="small" show-input  :min="5" :max="50"/>
            </el-form-item>
            <el-form-item label="玩家投票" prop="vote">
              <el-switch v-model="roomBaseForm.vote" />
            </el-form-item>
            <el-form-item label="房间密码" prop="password">
              <el-input v-model="roomBaseForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="令牌" prop="token">
              <el-input v-model="roomBaseForm.token" show-password></el-input>
              <div class="el-form-item-msg">
                <el-link :underline="false" target="_blank"
                         href="https://accounts.klei.com">点击获取游戏令牌</el-link>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===1" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'">
          <el-form ref="roomGroundFormRef" :model="roomGroundForm" :rules="roomGroundFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="groundSetting">
              <sc-code-editor ref="editor" v-model="roomGroundForm.groundSetting" mode="lua" :height="isMobile?320:700" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===2" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'">
          <el-form ref="roomCaveFormRef" :model="roomCaveForm" :rules="roomCaveFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="caveSetting">
              <sc-code-editor ref="editor" v-model="roomCaveForm.caveSetting" mode="lua" :height="isMobile?320:700" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===3" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'">
          <el-form ref="roomModFormRef" :model="roomModForm" :rules="roomModFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="modSetting">
              <sc-code-editor ref="editor" v-model="roomModForm.modSetting" mode="lua" :height="isMobile?320:700" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===4" shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'">
          <el-result
            icon="success"
            title="Success Tip"
            sub-title="Please follow the instructions"
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
            <el-button v-if="step>0" @click="handlePrev">上一步</el-button>
            <el-button v-if="step<4" type="primary" @click="handleNext">下一步</el-button>
            <el-button v-if="step===4" type="success" @click="handleSave">仅保存</el-button>
            <el-button v-if="step===4" type="warning" @click="handleSaveAndRestart">保存并重启</el-button>
            <el-button v-if="step===4" type="danger" @click="handleGenerateNewWorld">生成新世界</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import luaparse from 'luaparse'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";


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
          koiMsgError('lua语法校验失败')
        }
      }
    })
  } else if (step.value === 2) {
    roomCaveFormRef.value.validate(valid => {
      if (valid) {
        try {
          luaparse.parse(roomCaveForm.value.caveSetting);
          step.value++
        } catch (e) {
          koiMsgError('lua语法校验失败')
        }
      }
    })
  } else if (step.value === 3) {
    roomModFormRef.value.validate(valid => {
      if (valid) {
        try {
          luaparse.parse(roomModForm.value.modSetting);
          step.value++
        } catch (e) {
          koiMsgError('lua语法校验失败')
        }
      }
    })
  }
}

const roomBaseFormRef = ref()
const roomBaseForm = ref({
  name: '',
  description: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: true,
  password: '',
  token: '',
})
const roomBaseFormRules = {
  name: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
  token: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
}

const roomGroundFormRef = ref()
const roomGroundForm = ref({
  groundSetting: '',
})
const roomGroundFormRules = {
  groundSetting: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
}

const roomCaveFormRef = ref()
const roomCaveForm = ref({
  caveSetting: '',
})
const roomCaveFormRules = {
  caveSetting: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
}

const roomModFormRef = ref()
const roomModForm = ref({
  modSetting: '',
})
const roomModFormRules = {
  modSetting: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
}


const handleGetCurrentRoomSetting = () => {
  settingApi.room.get().then(response => {
    roomBaseForm.value = response.data.base
    roomGroundForm.value.groundSetting = response.data.ground
    roomCaveForm.value.caveSetting = response.data.cave
    roomModForm.value.modSetting = response.data.mod
  })
}

const handleSave = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  settingApi.room.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
  })
}
const handleSaveAndRestart = () => {

}
const handleGenerateNewWorld = () => {

}

</script>

<style scoped>

</style>
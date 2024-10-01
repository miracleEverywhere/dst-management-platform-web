<template>
  <el-row :gutter="10" style="margin-top: 5px">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
      <el-card shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'">
        <el-form ref="roomSettingFormRef" :model="roomSettingForm" :rules="roomSettingFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
          <el-form-item label="房间名" prop="name">
            <el-input v-model="roomSettingForm.name"></el-input>
          </el-form-item>
          <el-form-item label="房间描述" prop="description">
            <el-input v-model="roomSettingForm.description"></el-input>
          </el-form-item>
          <el-form-item label="玩家对战" prop="pvp">
            <el-switch v-model="roomSettingForm.pvp" />
          </el-form-item>
          <el-form-item label="玩家数量" prop="playerNum">
            <el-slider v-model="roomSettingForm.playerNum" size="small" show-input :min="2" :max="100"/>
          </el-form-item>
          <el-form-item label="回档天数" prop="backDays">
            <el-slider v-model="roomSettingForm.backDays" size="small" show-input  :min="5" :max="50"/>
          </el-form-item>
          <el-form-item label="玩家投票" prop="vote">
            <el-switch v-model="roomSettingForm.vote" />
          </el-form-item>
          <el-form-item label="房间密码" prop="password">
            <el-input v-model="roomSettingForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="令牌" prop="token">
            <el-input v-model="roomSettingForm.token" show-password></el-input>
            <div class="el-form-item-msg">
              <el-link :underline="false" target="_blank"
                       href="https://accounts.klei.com">点击获取游戏令牌</el-link>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
      <el-card shadow="never">
        <div style="display: flex; justify-content: flex-end;">
          <el-button type="success" @click="handleNext">下一步</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import settingApi from "@/api/setting"

onMounted(() => {
  settingApi.base.get().then(response => {
    roomSettingForm.value = response.data
  })
})

const { isMobile } = useScreenStore();
const props = defineProps(['step'])
const emit = defineEmits(['update:step'])

const roomSettingFormRef = ref()
const roomSettingForm = ref({
  name: '',
  description: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: true,
  password: '',
  token: '',
})
const roomSettingFormRules = {
  name: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
  token: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
}

const handleNext = () => {
  roomSettingFormRef.value.validate(async valid => {
    if (valid) {
      await settingApi.base.post(roomSettingForm.value)
      emit('update:step', props.step + 1)
    }
  })
}


</script>

<style scoped>
</style>
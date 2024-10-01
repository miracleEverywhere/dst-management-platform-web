<template>
  <el-form ref="roomSettingFormRef" :model="roomSettingForm" :rules="roomSettingFormRules" label-width="70" size="large">
    <el-form-item label="房间名" prop="roomName">
      <el-input v-model="roomSettingForm.roomName"></el-input>
    </el-form-item>
    <el-form-item label="房间描述" prop="roomName">
      <el-input v-model="roomSettingForm.roomName"></el-input>
    </el-form-item>
    <el-form-item label="玩家对战" prop="roomName">
      <el-switch v-model="value1" />
    </el-form-item>
    <el-form-item label="玩家数量" prop="roomName">
      <el-slider v-model="value" show-input />
    </el-form-item>
    <el-form-item label="回档天数" prop="roomName">
      <el-slider v-model="value" show-input />
    </el-form-item>
    <el-form-item label="玩家投票" prop="roomName">
      <el-switch v-model="value1" />
    </el-form-item>
    <el-form-item label="房间密码" prop="roomName">
      <el-input v-model="roomSettingForm.roomName" show-password></el-input>
    </el-form-item>
    <el-form-item label="令牌" prop="roomName">
      <el-input v-model="roomSettingForm.roomName" show-password></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {reactive, ref} from "vue";

const roomSettingFormRef = ref()
const roomSettingForm = reactive({
  roomName: '',
})
const roomSettingFormRules = {

}
</script>

<style scoped>
</style>
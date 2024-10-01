<template>
  <el-row :gutter="10" style="margin-top: 5px">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
      <el-card shadow="never" :style="isMobile?'min-height: 400px':'min-height: 800px'">
        <el-form ref="roomModFormRef" :model="roomModForm" :rules="roomModFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
          <el-form-item label-position="top" prop="modSetting">
            <sc-code-editor ref="editor" v-model="roomModForm.modSetting" mode="lua" :height="isMobile?320:700" style="width: 100%"></sc-code-editor>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
      <el-card shadow="never">
        <div style="display: flex; justify-content: flex-end;">
          <el-button>如何获取</el-button>
          <el-button type="primary" @click="handlePrev">上一步</el-button>
          <el-button type="success" @click="handleNext">下一步</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import luaparse from "luaparse";
import {koiMsgError} from "@/utils/koi.ts";
import settingApi from "@/api/setting/index.js";

onMounted(() => {
  settingApi.mod.get().then(response => {
    roomModForm.value.modSetting = response.data
  })
})

const props = defineProps(['step'])
const emit = defineEmits(['update:step'])

const { isMobile } = useScreenStore();

const roomModFormRef = ref()
const roomModForm = ref({
  modSetting: '',
})
const roomModFormRules = {
  modSetting: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
}


const handlePrev = () => {
  emit('update:step', props.step - 1)
}
const handleNext = () => {
  roomModFormRef.value.validate(async valid => {
    if (valid) {
      try {
        luaparse.parse(roomModForm.value.modSetting);
        await settingApi.mod.post(roomModForm.value)
        emit('update:step', props.step + 1)
      } catch (e) {
        koiMsgError('lua语法校验失败')
      }
    }
  })
}
</script>

<style scoped>
</style>
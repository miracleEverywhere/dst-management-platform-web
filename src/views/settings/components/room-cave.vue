<template>
  <el-row :gutter="10" style="margin-top: 20px">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 10px">
      <el-card :style="isMobile?'min-height: 400px':'min-height: 800px'">
        <el-form ref="roomCaveFormRef" :model="roomCaveForm" :rules="roomCaveFormRules" :label-width="isMobile?'70':'100'" :size="isMobile?'small':'large'">
          <el-form-item label-position="top" prop="caveSetting">
            <sc-code-editor ref="editor" v-model="roomCaveForm.caveSetting" mode="lua" :height="isMobile?320:700" style="width: 100%"></sc-code-editor>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 2px">
      <el-card>
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
  settingApi.cave.get().then(response => {
    roomCaveForm.value.caveSetting = response.data
  })
})

const props = defineProps(['step'])
const emit = defineEmits(['update:step'])

const { isMobile } = useScreenStore();

const roomCaveFormRef = ref()
const roomCaveForm = ref({
  caveSetting: '',
})
const roomCaveFormRules = {
  caveSetting: [ { required: true, message: 'Please input Activity name', trigger: 'blur' } ],
}


const handlePrev = () => {
  emit('update:step', props.step - 1)
}
const handleNext = () => {
  roomCaveFormRef.value.validate(async valid => {
    if (valid) {
      try {
        luaparse.parse(roomCaveForm.value.caveSetting);
        await settingApi.cave.post(roomCaveForm.value)
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
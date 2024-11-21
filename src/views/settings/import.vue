<template>
  <div class="page-div">
    <el-button @click="openUploadDialog">aaa</el-button>
    <el-dialog v-model="uploadDialogVisible">
      <el-upload ref="uploadRef" drag :limit="1" :http-request="handleUpload" :before-upload="checkUploadFile">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>

</template>

<script setup>
import {useI18n} from "vue-i18n";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {ElMessageBox, ElNotification} from 'element-plus'
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";
import settingApi from "@/api/setting"

const { t } = useI18n()
const { isMobile } = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const uploadDialogVisible = ref(false)
const uploadRef = ref()
const openUploadDialog = () => {
  if (uploadRef.value) {
    // 清空上次上传的文件
    uploadRef.value.clearFiles()
  }
  uploadDialogVisible.value = true
}
const checkUploadFile = (param) => {
  const zipPattern = /\.zip$/i;
  if (zipPattern.test(param.name)) {
    return true
  } else {
    koiMsgError(language.value==='zh'?'请上传zip文件':'Please upload a zip file')
    return false
  }
}
const handleUpload = (param) => {
  const formData = new FormData()
  formData.append('file', param.file)
  settingApi.import.upload.post(formData).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
  })
}
</script>

<style scoped>
</style>

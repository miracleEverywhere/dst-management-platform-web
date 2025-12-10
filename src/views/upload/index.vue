<template>
  <v-dialog v-model="uploadDialogVisible" :persistent="uploadLoading" class="flex-wrap" max-width="65%">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn class="mr-2" color="primary" v-bind="activatorProps">上传存档</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="导入存档" min-height="500">
        <v-card-text>
          <template v-if="!uploadLoading">
            <v-alert color="warning" density="compact" class="mt-2 mb-2">
              请上传.zip文件，请严格按照教程中的路径进行压缩，上传过程中请勿关闭本对话框
            </v-alert>
            <v-file-upload density="default" icon="ri-upload-cloud-2-line"
                           @update:modelValue="handleUpload">
            </v-file-upload>
          </template>
          <template v-else>
            上传中，请稍后
          </template>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import {showSnackbar} from "@/utils/snackbar.js";
import roomApi from "@/api/room.js"


const uploadLoading = ref(false)
const uploadDialogVisible = ref(false)
const checkUploadFile = (param) => {
  const zipPattern = /\.zip$/i;
  return zipPattern.test(param.name);
}
const handleUpload = (file) => {
  if (!checkUploadFile(file)) {
    showSnackbar('请上传zip文件', 'error')
    uploadDialogVisible.value = false
    return
  }
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('roomID', 1)
  roomApi.upload.post(formData).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
    uploadLoading.value = false
  })
}
</script>

<style scoped>
</style>
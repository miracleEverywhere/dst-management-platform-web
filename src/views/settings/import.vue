<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <template #header>
            <div class="card-header">
              {{ t('setting.import.title') }}
              <el-button type="success" @click="helpDialogVisible=true">{{ t('setting.import.buttonHelp') }}</el-button>
            </div>
          </template>
          <div>
            <div style="line-height: 30px;">
              {{ t('setting.import.text1') }}
            </div>
            <div>
              <el-row :gutter="20">
                <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24">
                  <div class="tip custom-block">
                    <div>
                      <span class="bolder">{{ t('setting.import.text2') }}</span>
                    </div>
                    <div>.</div>
                    <div>├── adminlist.txt</div>
                    <div>├── blocklist.txt</div>
                    <div>├── Caves</div>
                    <div><span class="tree-tab">│</span>   ├── backup</div>
                    <div><span class="tree-tab">│</span>   ├── leveldataoverride.lua</div>
                    <div><span class="tree-tab">│</span>   ├── modoverrides.lua</div>
                    <div><span class="tree-tab">│</span>   ├── save</div>
                    <div><span class="tree-tab">│</span>   ├── server_chat_log.txt</div>
                    <div><span class="tree-tab">│</span>   ├── server.ini</div>
                    <div><span class="tree-tab">│</span>   └── server_log.txt</div>
                    <div>
                      <span class="bolder">├── cluster.ini</span>
                    </div>
                    <div>
                      <span class="bolder">├── cluster_token.txt</span>
                    </div>
                    <div class="bolder">├── Master</div>
                    <div><span class="tree-tab">│</span>   ├── backup</div>
                    <div class="bolder"><span class="tree-tab">│</span>   ├── leveldataoverride.lua</div>
                    <div class="bolder"><span class="tree-tab">│</span>   ├── modoverrides.lua</div>
                    <div><span class="tree-tab">│</span>   ├── save</div>
                    <div><span class="tree-tab">│</span>   ├── server_chat_log.txt</div>
                    <div class="bolder"><span class="tree-tab">│</span>   ├── server.ini</div>
                    <div><span class="tree-tab">│</span>   └── server_log.txt</div>
                    <div>└── whitelist.txt</div>
                  </div>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24">
                  <div>
                    <el-image :hide-on-click-modal="true" :initial-index="4" :max-scale="7" :min-scale="0.2"
                              :preview-src-list="[imageZip]"
                              :src="imageZip"
                              :zoom-rate="1.2" fit="cover" style="margin-top: 10px; margin-bottom: 10px"></el-image>
                  </div>
                  <div>
                    <el-image :hide-on-click-modal="true" :initial-index="4" :max-scale="7" :min-scale="0.2"
                              :preview-src-list="[imageZipMaster]"
                              :src="imageZipMaster"
                              :zoom-rate="1.2" fit="cover" style="margin-top: 10px; margin-bottom: 10px"></el-image>
                  </div>

                </el-col>
              </el-row>
            </div>
          </div>
          <template #footer>
            <div class="card-footer">
              <el-button type="primary" @click="openUploadDialog">{{ t('setting.import.button') }}</el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="uploadDialogVisible" :close-on-click-modal="!uploadLoading"
               :close-on-press-escape="!uploadLoading" :show-close="!uploadLoading" :title="t('setting.import.dialog.title')"
               width="45%">
      <el-upload ref="uploadRef" v-loading="uploadLoading" :before-upload="checkUploadFile" :http-request="handleUpload"
                 :limit="1" drag>
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          {{ t('setting.import.dialog.text1') }} <em>{{ t('setting.import.dialog.text2') }}</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ t('setting.import.dialog.tip') }}
          </div>
        </template>
      </el-upload>
    </el-dialog>
    <el-dialog v-model="helpDialogVisible" :title="t('setting.import.dialog2.title')" width="70%">
      <el-alert :closable="false" :effect="isDark?'light':'dark'" type="error">
        {{ t('setting.import.dialog2.text1') }}
      </el-alert>
      <el-image :src="helpGif" class="fcc" fit="fill" loading="lazy" style="margin-top: 10px"></el-image>
    </el-dialog>
  </div>

</template>

<script setup>
import {useI18n} from "vue-i18n";
import {computed, ref} from "vue";
import {UploadFilled} from '@element-plus/icons-vue'
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import settingApi from "@/api/setting"

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const helpDialogVisible = ref(false)

const uploadLoading = ref(false)
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
    koiMsgError(language.value === 'zh' ? '请上传zip文件' : 'Please upload a zip file')
    return false
  }
}
const handleUpload = (param) => {
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', param.file)
  settingApi.import.upload.post(formData).then(response => {
    koiMsgSuccess(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
    uploadLoading.value = false
  })
}

const imageZip = new URL('./images/zip-image.png', import.meta.url).href
const imageZipMaster = new URL('./images/zip-image-master.png', import.meta.url).href
const helpGif = new URL('./images/help.gif', import.meta.url).href
</script>

<style scoped>
.tree-tab {
  margin-left: 1.5px
}

.bolder {
  font-weight: bolder
}
</style>

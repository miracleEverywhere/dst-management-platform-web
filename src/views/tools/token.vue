<template>
  <div class="page-div">
    <el-card shadow="never" style="min-height: 80vh">
      <template #header>
        <div class="card-header">
          <span>{{ t('tools.token.title') }}</span>
          <el-button type="primary" @click="handleCreateToken">{{ t('tools.token.createButton') }}</el-button>
        </div>
      </template>
      <div>
        <div style="display: flex; align-items: center">
          <span>{{ t('tools.token.expiredTime') }}</span>
          <el-date-picker v-model="apiForm.expiredTime" format="YYYY-MM-DD" size="large"
                          style="width: 160px; margin-left: 5px" type="date" value-format="x"/>
        </div>

        <div v-if="token">
          <div class="tip custom-block">
            <div>
              {{ t('tools.token.tip.tip1') }} <span style="font-weight: bolder">{{ timestamp2time(apiForm.expiredTime) }}</span>
              {{ t('tools.token.tip.tip2') }}
            </div>
            <div style="margin-top: 5px">
              {{ t('tools.token.tip.tip3') }}
            </div>
          </div>

          <el-input v-model="token" style="max-width: 100%">
            <template #append>
              <el-button v-copy="token" :icon="DocumentCopy"/>
            </template>
          </el-input>

          <div style="margin-top: 20px">
            <div>
              {{ t('tools.token.usage') }}
            </div>
            <MdPreview :modelValue="requestPython"
                       previewTheme="github"
                       :theme="isDark?'dark':'light'"/>
          </div>
        </div>


      </div>
    </el-card>
  </div>
</template>

<script name="toolsToken" setup>
import toolsApi from "@/api/tools"
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import {koiMsgSuccess} from "@/utils/koi.ts";
import {DocumentCopy} from "@element-plus/icons-vue";
import {timestamp2time} from "@/utils/tools.js";
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';


const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

onMounted(async () => {
  apiForm.value.expiredTime = new Date().getTime()
})

const apiForm = ref({
  expiredTime: 0
})

const token = ref('')

const handleCreateToken = () => {
  toolsApi.token.create.post(apiForm.value).then(response => {
    token.value = response.data
    koiMsgSuccess(response.message)
  })
}

const requestPython = ref('```python\n' +
  'import requests\n' +
  '\n' +
  'url = "http://{ip}:{port}"\n' +
  'token = "your token"\n' +
  '# 中文\n' +
  'lang = "zh"\n' +
  '# English\n' +
  '# lang = "en"\n' +
  '\n' +
  'payload = {}\n' +
  'headers = {\n' +
  '    \'Authorization\': token,\n' +
  '    \'X-I18n-Lang\': lang\n' +
  '}\n' +
  '\n' +
  'response = requests.request("GET", url, headers=headers, data=payload)\n' +
  '\n' +
  'print(response.text)\n' +
  '```');

</script>

<style scoped>
</style>

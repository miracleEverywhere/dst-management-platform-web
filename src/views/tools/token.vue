<template>
  <div class="page-div">
    <el-card shadow="never" style="height: 80vh">
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
                          style="width: 160px" type="date" value-format="x"/>
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
            <sc-code-editor ref="twoCodeRef" v-model="request" :height="isMobile?200:400" :read-only="true"
                            :theme="isDark?'darcula':'idea'"
                            mode="python" style="margin-top: 10px"></sc-code-editor>
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
import scCodeEditor from "@/components/scCodeEditor/index.vue";

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

const request = `import requests

url = "http://{ip}:{port}"
token = "your token"
# 中文
lang = "zh"
# English
# lang = "en"

payload = {}
headers = {
    'Authorization': token,
    'X-I18n-Lang': lang
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)`

</script>

<style scoped>
</style>

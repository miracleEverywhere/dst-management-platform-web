<template>
  <div class="page-div">
    <el-card shadow="never" style="min-height: 80vh">
      <template #header>
        <div class="card-header">
          <span>{{ t('tools.token.title') }}</span>
          <div style="display: flex">
            <el-select v-model="apiForm.expiredTime"
                       :placeholder="t('tools.token.expiredTime')"
                       style="width: 20vw; margin-right: 20px; font-weight: lighter">
              <el-option :label="t('tools.token.options.day')" :value="24"/>
              <el-option :label="t('tools.token.options.month')" :value="720"/>
              <el-option :label="t('tools.token.options.year')" :value="8760"/>
              <el-option :label="t('tools.token.options.forever')" :value="8751240"/>
            </el-select>
            <el-button type="primary" @click="handleCreateToken">{{ t('tools.token.createButton') }}</el-button>
          </div>
        </div>
      </template>
      <div>
        <div v-if="token">
          <div class="tip custom-block">
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
            <MdPreview :modelValue="requestShow"
                       :theme="isDark?'dark':'light'"
                       previewTheme="github"/>
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
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {DocumentCopy} from "@element-plus/icons-vue";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';


const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);
const isDark = computed(() => globalStore.isDark);

onMounted(async () => {

})

const apiForm = ref({
  expiredTime: null
})

const token = ref('')

const handleCreateToken = () => {
  if (apiForm.value.expiredTime === null ) {
    koiMsgError(language.value === 'zh'?'请选择过期时间':'Please select expire time')
    return
  }
  toolsApi.token.create.post(apiForm.value).then(response => {
    token.value = response.data
    koiMsgSuccess(response.message)
  })
}

const requestPython = ref('```python [id:Python]\n' +
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
const requestGolang = ref('```golang [id:Golang]\n' +
  'package main\n' +
  '\n' +
  'import (\n' +
  '  "fmt"\n' +
  '  "net/http"\n' +
  '  "io"\n' +
  ')\n' +
  '\n' +
  'func main() {\n' +
  '  token := "your token"\n' +
  '  url := "http://{ip}:{port}"\n' +
  '  method := "GET"\n' +
  '  //中文\n' +
  '  lang := "zh"\n' +
  '  //English\n' +
  '  //lang := "en"\n' +
  '\n' +
  '  client := &http.Client{}\n' +
  '  req, err := http.NewRequest(method, url, nil)\n' +
  '\n' +
  '  if err != nil {\n' +
  '    fmt.Println(err)\n' +
  '    return\n' +
  '  }\n' +
  '  req.Header.Add("Authorization", token)\n' +
  '  req.Header.Add("X-I18n-Lang", lang)\n' +
  '\n' +
  '  res, err := client.Do(req)\n' +
  '  if err != nil {\n' +
  '    fmt.Println(err)\n' +
  '    return\n' +
  '  }\n' +
  '  defer res.Body.Close()\n' +
  '\n' +
  '  body, err := io.ReadAll(res.Body)\n' +
  '  if err != nil {\n' +
  '    fmt.Println(err)\n' +
  '    return\n' +
  '  }\n' +
  '  fmt.Println(string(body))\n' +
  '}\n' +
  '```')
const requestJava = ref('```java [id:Java]\n' +
  'import java.io.BufferedReader;\n' +
  'import java.io.InputStreamReader;\n' +
  'import java.net.HttpURLConnection;\n' +
  'import java.net.URL;\n' +
  '\n' +
  'public class Main {\n' +
  '    public static void main(String[] args) {\n' +
  '        try {\n' +
  '            // 定义请求的 URL\n' +
  '            String url = "http://{ip}:{port}";\n' +
  '            // 定义 token 和语言\n' +
  '            String token = "your token";\n' +
  '            String lang = "zh"; // 中文\n' +
  '            // String lang = "en"; // English\n' +
  '\n' +
  '            // 创建 URL 对象\n' +
  '            URL apiUrl = new URL(url);\n' +
  '            // 打开连接\n' +
  '            HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();\n' +
  '            // 设置请求方法\n' +
  '            connection.setRequestMethod("GET");\n' +
  '            // 添加请求头\n' +
  '            connection.setRequestProperty("Authorization", token);\n' +
  '            connection.setRequestProperty("X-I18n-Lang", lang);\n' +
  '\n' +
  '            // 获取响应码\n' +
  '            int responseCode = connection.getResponseCode();\n' +
  '            System.out.println("Response Code: " + responseCode);\n' +
  '\n' +
  '            // 读取响应内容\n' +
  '            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));\n' +
  '            String inputLine;\n' +
  '            StringBuilder response = new StringBuilder();\n' +
  '\n' +
  '            while ((inputLine = in.readLine()) != null) {\n' +
  '                response.append(inputLine);\n' +
  '            }\n' +
  '            in.close();\n' +
  '\n' +
  '            // 打印响应内容\n' +
  '            System.out.println("Response Body: " + response.toString());\n' +
  '        } catch (Exception e) {\n' +
  '            e.printStackTrace();\n' +
  '        }\n' +
  '    }\n' +
  '}\n' +
  '```')
const requestCurl = ref('```bash [id:cURL]\n' +
  'curl --location --globoff \'http://{ip}:{port}\' \\\n' +
  '--header \'Authorization: token\' \\\n' +
  '--header \'X-I18n-Lang: lang\'\n' +
  '```')
const requestPowerShell = ref('```powershell [id:PowerShell]\n'+
  '$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"\n' +
  '$headers.Add("Authorization", "token")\n' +
  '$headers.Add("X-I18n-Lang", "lang")\n' +
  '\n' +
  '$response = Invoke-RestMethod \'http://{ip}:{port}\' -Method \'GET\' -Headers $headers\n' +
  '$response | ConvertTo-Json\n' +
  '```')

const requestShow = requestPython.value + '\n\n' +
  requestGolang.value + '\n\n' +
  requestJava.value + '\n\n' +
  requestCurl.value + '\n\n' +
  requestPowerShell.value
</script>

<style scoped>
</style>

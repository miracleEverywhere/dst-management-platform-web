<template>
  <div style="display: flex; align-items: center; margin: 5px; width:215px">
    <el-image :src="getImageUrl(props.image)" fit="fill" style="width: 75px; height: 75px"/>
    <div style="width: 140px">
      <div class="fcc">
        <!--配置文件没有，平台有-->
        <template v-if="modelValue==='undefined'&&image!=='undefined.png'">
          <el-tooltip :content="language==='zh'?'你的配置文件不是最新版哦':'Your config file is not the latest version'" effect="light" placement="top">
            <el-tag size="large" type="danger">
              <div class="fcc">
                {{language==='zh'?props.i18n.zh:props.i18n.en}}
                <el-icon size="14" style="margin-left: 2px">
                  <QuestionFilled/>
                </el-icon>
              </div>
            </el-tag>
          </el-tooltip>
        </template>
        <template v-else>
          <el-tag size="large" :type="modelValue===defaultModelValue?'primary':'warning'">{{language==='zh'?props.i18n.zh:props.i18n.en}}</el-tag>
        </template>
      </div>
      <div style="margin: 5px 0" class="fcc">
        <el-button :icon="ArrowLeftBold" link type="primary"
                   :disabled="leftClickDisabled||image==='undefined.png'||modelValue==='undefined'"
                   @click="leftClick">
        </el-button>
        <el-tag v-if="image==='undefined.png'||modelValue==='undefined'" size="large"
                effect="plain" type="danger" style="margin: 0 5px; width: 100px">{{language==='zh'?'未配置':'undefined'}}</el-tag>
        <el-tag v-else size="large" effect="plain" type="primary" style="margin: 0 5px; width: 100px">{{getDisplayTagValue()}}</el-tag>
        <el-button :icon="ArrowRightBold" link type="primary"
                   :disabled="rightClickDisabled||image==='undefined.png'||modelValue==='undefined'"
                   @click="rightClick"></el-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'
import {computed, ref, watch, defineEmits, onMounted} from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import {configsMap, overrides} from "@/views/settings/components/levelDataMap.js"

const props = defineProps({
  configs: {type: Array, default: ['undefined']},
  modelValue: {type: String, default: 'undefined'},
  image: {type: String, default: 'undefined.png'},
  i18n: {type: Object, default: {zh: '平台未识别', en: 'undefined'}},
  name: {type: String, default: 'undefined'},
  customConfigsValue: {type: Object, default: {}},
  defaultModelValue: {type: String, default: 'undefined'},
})

const emit = defineEmits(['changeModelValue']);

onMounted(() => {
  if (props.configs.length === 1) {
    leftClickDisabled.value = true
    rightClickDisabled.value = true
  }
  if (props.configs.length === 2) {
    const index = props.configs.indexOf(setting.value)
    if (index === 0) {
      leftClickDisabled.value = true
      rightClickDisabled.value = false
    } else if (index === (props.configs.length - 1)) {
      rightClickDisabled.value = true
      leftClickDisabled.value = false
    } else {
      leftClickDisabled.value = false
      rightClickDisabled.value = false
    }
  } else {
    const index = props.configs.indexOf(setting.value)
    if (index === 0) {
      leftClickDisabled.value = true
      rightClickDisabled.value = false
    } else if (index === (props.configs.length - 1)) {
      rightClickDisabled.value = true
      leftClickDisabled.value = false
    } else {
      leftClickDisabled.value = false
      rightClickDisabled.value = false
    }
  }
})

const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const leftClickDisabled = ref(false)
const rightClickDisabled = ref(false)
const setting = ref(props.modelValue)

const leftClick = () => {
  const index = props.configs.indexOf(setting.value)
  setting.value = props.configs[index - 1]
}
const rightClick = () => {
  const index = props.configs.indexOf(setting.value)
  setting.value = props.configs[index + 1]
}

const getImageUrl = (file) => {
  return new URL(`./gameSettingImages/${file}`, import.meta.url).href
}

const getDisplayTagValue = () => {
  let tagValue
  if (Object.keys(props.customConfigsValue).length !== 0) {
    tagValue = props.customConfigsValue[setting.value]
  } else {
    tagValue = configsMap[setting.value]
  }
  try {
    // console.log(props)
    if (language.value === 'zh') {
      return tagValue['zh']
    } else {
      return tagValue['en']
    }
  } catch {
    if (language.value === 'zh') {
      return '未识别'
    } else {
      return 'Undefined'
    }
  }

}

const handleSettingChange = () => {
  const emitData = {
    name: props.name,
    value: setting.value
  }
  emit('changeModelValue', emitData);
}


watch(() => setting.value, (newValue, oldValue) => {
  if (props.configs.length === 1) {
    leftClickDisabled.value = true
    rightClickDisabled.value = true
  } else {
    const index = props.configs.indexOf(setting.value)
    if (index === 0) {
      leftClickDisabled.value = true
      rightClickDisabled.value = false
    } else if (index === (props.configs.length - 1)) {
      rightClickDisabled.value = true
      leftClickDisabled.value = false
    } else {
      leftClickDisabled.value = false
      rightClickDisabled.value = false
    }
  }
  handleSettingChange()
}, {immediate: false})

</script>

<style scoped>
</style>

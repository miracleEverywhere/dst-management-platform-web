<template>
  <div style="display: flex; align-items: center; margin: 5px">
    <el-image :src="getImageUrl(props.image)" fit="fill" style="width: 75px; height: 75px"/>
    <div style="width: 120px">
      <div class="fcc">
        <el-tag size="large">{{language==='zh'?props.i18n.zh:props.i18n.en}}</el-tag>
      </div>
      <div style="margin: 5px 0" class="fcc">
        <el-button :icon="ArrowLeftBold" link :disabled="leftClickDisabled" @click="leftClick"></el-button>
        <el-tag size="large" effect="plain" type="primary" style="margin: 0 5px">{{language==='zh'?configsMap[setting]:setting}}</el-tag>
        <el-button :icon="ArrowRightBold" link :disabled="rightClickDisabled" @click="rightClick"></el-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'
import {computed, onMounted, ref} from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import {configsMap} from "@/views/settings/components/levelDataMap.js"

const props = defineProps({
  configs: {type: Array, default: []},
  modelValue: {type: String, default: ''},
  image: {type: String, default: ''},
  i18n: {type: Object, default: {zh: '', en: ''}},
})

const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const leftClickDisabled = ref(false)
const rightClickDisabled = ref(false)
const setting = ref(props.modelValue)

const leftClick = () => {
  const index = props.configs.indexOf(setting.value)
  console.log(index)
  if (index === 1) {
    setting.value = props.configs[index - 1]
    leftClickDisabled.value = true
  } else {
    rightClickDisabled.value = false
    setting.value = props.configs[index - 1]
  }
}
const rightClick = () => {
  const index = props.configs.indexOf(setting.value)
  if (index === (props.configs.length - 2)) {
    setting.value = props.configs[index + 1]
    rightClickDisabled.value = true
  } else {
    leftClickDisabled.value = false
    setting.value = props.configs[index + 1]
  }
}

const getImageUrl = (file) => {
  return new URL('./groundImages/'+file, import.meta.url).href
}

</script>

<style scoped>
</style>

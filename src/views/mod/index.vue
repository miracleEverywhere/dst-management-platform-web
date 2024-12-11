<template>
</template>

<script setup name="mod">
import modApi from "@/api/mod"
import {computed, onMounted, ref, watch} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import luaparse from 'luaparse'
import luamin from 'lua-format'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";


onMounted(async () => {
  await handleGetModSetting()
})

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

modApi.info.get()

const modSetting = ref('')
const handleGetModSetting = () => {
  modApi.setting.get().then(response => {
    modSetting.value = response.data
    let a = "3"
    console.log(a)
    console.log(eval(a))
  })
}

const modObj = ref({})



watch(() => modSetting.value, (newValue, oldValue) => {

}, {immediate: false})
</script>

<style scoped>
</style>

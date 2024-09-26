<template>
  <div class="hover:bg-[rgba(0,0,0,0.06)] koi-icon w-32px h-100% flex flex-justify-center flex-items-center">
    <el-dropdown @command="handleChangeLanguage">
      <i class="i-material-symbols:translate"></i>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languageList"
            :key="item.value"
            :command="item.value"
            :disabled="language === item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, onMounted, watch, computed } from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import { LanguageType } from "@/stores/interface/index.ts";

const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = ref<any>([]);

onMounted(() => {
  handleSwitchLanguage();
});

const handleSwitchLanguage = () => {
  // 当 language 变化时，手动触发 dimensionList 的更新
  if (globalStore.language === "en") {
    languageList.value = [
    { label: "简体中文", value: "zh" },
    { label: "English", value: "en" }
    ];
  } else {
    languageList.value = [
      { label: "简体中文", value: "zh" },
      { label: "English", value: "en" }
    ];
  }
};

// 监听 globalStore.language 的变化
watch(
  () => globalStore.language,
  () => {
    // 当 language 变化时，手动触发 dimensionList 的更新
    handleSwitchLanguage();
  }
);

const handleChangeLanguage = (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
};
</script>

<style lang="scss" scoped></style>

<template>
  <v-menu
    open-on-hover
  >
    <template v-slot:activator="{ props }">
      <v-btn
        color="default"
        icon="ri-translate-2"
        variant="text"
        v-bind="props"
      >
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="item in languageList"
        :key="item.value"
        :command="item.value"
        :disabled="language === item.value"
        @click="handleChangeLanguage(item.value)"
      >
        {{ item.label }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import useGlobalStore from "@/plugins/store/global";

const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = ref([]);

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

const handleChangeLanguage = (lang) => {
  i18n.locale.value = lang;
  globalStore.language = lang
};
</script>

<style scoped>
</style>
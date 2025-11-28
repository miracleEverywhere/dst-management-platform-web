<template>
  <v-card>
    <v-card-text>
      <MdPreview :modelValue="'```text ::open'+'\n'+props.content" :theme="editorTheme" previewTheme="github" class="mdp"/>
    </v-card-text>
  </v-card>

</template>

<script setup>
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import useGlobalStore from "@/plugins/store/global.js";
import logsApi from "@/api/logs.js";


const props = defineProps({
  content: {
    type: String,
    default: "",
  },
})

const globalStore = useGlobalStore()
const editorTheme = computed(() => globalStore.theme)
</script>

<style scoped>
.mdp :deep(.md-editor-preview .md-editor-code) {
  margin: 0 !important;
}
</style>
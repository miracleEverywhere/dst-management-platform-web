<template>
  <md-preview
    :model-value="'```text ::open'+'\n'+props.content"
    :theme="editorTheme"
    preview-theme="github"
    class="mdp"
    :style="{'overflow-y': 'auto','height':props.height+'px'}"
  />
</template>

<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import useGlobalStore from "@store/global.js"


const props = defineProps({
  content: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 800,
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
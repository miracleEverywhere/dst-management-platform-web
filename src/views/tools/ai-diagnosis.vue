<template>
  <check
    :category="['game']"
    :other-height="otherHeight"
  >
    <diagnosis-panel
      active
      :height="calculateContainerSize()"
      :room-id="roomId"
      :room-name="roomName"
      @applied="handleApplied"
    />
  </check>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import useGlobalStore from '@store/global'
import { showSnackbar } from '@/utils/snackbar'
import { debounce } from '@/utils/tools.js'
import DiagnosisPanel from '@/views/tools/components/DiagnosisPanel.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()

// 64（导航栏）+ 24×2（页面上下内边距）
const otherHeight = 112
const windowHeight = ref(window.innerHeight)
const roomId = computed(() => globalStore.room.id || 0)
const roomName = computed(() => globalStore.room.gameName || '')

const calculateContainerSize = () => Math.max(320, Math.floor(windowHeight.value - otherHeight))

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const handleApplied = () => {
  showSnackbar(t('diagnosis.apply.afterSuccess'))
}

onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>

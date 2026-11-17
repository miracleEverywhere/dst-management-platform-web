<template>
  <check
    :category="['game']"
    :other-height="otherHeight"
  >
    <diagnosis-panel
      active
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
import DiagnosisPanel from '@/views/diagnosis/components/DiagnosisPanel.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()

const otherHeight = 80
const roomId = computed(() => globalStore.room.id || 0)
const roomName = computed(() => globalStore.room.gameName || '')

const handleApplied = () => {
  showSnackbar(t('diagnosis.apply.afterSuccess'))
}
</script>

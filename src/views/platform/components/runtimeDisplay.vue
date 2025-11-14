<template>
  <div>
    <span v-if="timeDisplay.years > 0">{{ timeDisplay.years }}年</span>
    <span v-if="timeDisplay.days > 0">{{ timeDisplay.days }}天</span>
    <span v-if="timeDisplay.hours > 0">{{ timeDisplay.hours }}时</span>
    <span v-if="timeDisplay.minutes > 0">{{ timeDisplay.minutes }}分</span>
    <span>{{ timeDisplay.seconds }}秒</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  seconds: {
    type: Number,
    default: 0,
  },
})

const totalSeconds = ref(props.seconds)
let timer = null

const timeDisplay = computed(() => {
  let secs = totalSeconds.value
  const years = Math.floor(secs / (365 * 24 * 60 * 60))

  secs %= 365 * 24 * 60 * 60

  const days = Math.floor(secs / (24 * 60 * 60))

  secs %= 24 * 60 * 60

  const hours = Math.floor(secs / 3600)

  secs %= 3600

  const minutes = Math.floor(secs / 60)
  const seconds = secs % 60

  return { years, days, hours, minutes, seconds }
})

watch(() => props.seconds, newVal => {
  totalSeconds.value = newVal
})

onMounted(() => {
  timer = setInterval(() => totalSeconds.value += 1, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
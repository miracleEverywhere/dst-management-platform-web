<script setup>
const themes = [
  {
    name: 'system',
    icon: 'ri-computer-line',
  },
  {
    name: 'light',
    icon: 'ri-sun-line',
  },
  {
    name: 'dark',
    icon: 'ri-moon-clear-line',
  },
]
</script>

<template>
  <theme-switcher :themes="themes" />
</template>

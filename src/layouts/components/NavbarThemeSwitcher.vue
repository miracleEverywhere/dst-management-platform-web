<script setup>
const themes = [
  {
    name: 'system',
    icon: 'ri-dmp-theme-auto',
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

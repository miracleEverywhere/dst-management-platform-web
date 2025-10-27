<template>
  <v-btn @click="handleGetSysInfo">
    info
  </v-btn>
  {{ sysInfo }}
</template>

<script setup>
import homeApi from '@/api/home.js'


const sysInfo = ref({
  cpu: 0,
  memory: 0,
})

const handleGetSysInfo = () => {
  homeApi.sysInfo.get().then(response => {
    sysInfo.value = response.data
  })
}
</script>


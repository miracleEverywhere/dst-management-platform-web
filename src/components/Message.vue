<template>
  <v-snackbar
    v-model="snackbar"
    :location="location"
    :timeout="timeout"
    :color="color"
    transition="slide-y-transition"
    variant="flat"
  >
    <v-icon :icon="icon" />
    {{ text }}
  </v-snackbar>
</template>

<script setup>
import { useSnackbar } from "@/utils/snackbar.js"

const { snackbar, color, text, location, icon, timeout } = useSnackbar()
</script>
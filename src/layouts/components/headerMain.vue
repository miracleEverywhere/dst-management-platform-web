<template>
  <div
      v-if="mobile"
      class="d-flex align-center"
      style="user-select: none;"
  >
    <div>
      <v-chip label color="primary">
        {{ globalStore.room.displayName}}
      </v-chip>
    </div>
  </div>
  <div
      v-else
      class="d-flex align-center"
      style="user-select: none;"
  >
    <div>
      <v-chip  color="primary" class="mr-4">
        {{ t('global.room') + globalStore.room.displayName}}
      </v-chip>
    </div>
    <div>
      <v-chip  :color="getColor()" class="mr-4">
        {{t('global.gameVersion') + globalStore.gameVersion.local}}
      </v-chip>
    </div>
    <div>
      <v-chip  color="info" class="mr-4">
        {{t('global.dmpVersion') + Version}}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import useGlobalStore from "@/plugins/store/global";
import {Version} from "@/config/index";
import {useI18n} from "vue-i18n";
import {useDisplay} from "vuetify";

const globalStore = useGlobalStore()
const { t } = useI18n()
const { mobile } = useDisplay()

const getColor = () => {
  if (globalStore.gameVersion.local === 0) {
    return 'error'
  }
  if (globalStore.gameVersion.local !== globalStore.gameVersion.server) {
    return 'warning'
  }
  return 'success'
}
</script>

<style scoped>
</style>
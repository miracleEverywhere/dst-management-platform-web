<template>
  <div
    v-if="mobile"
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <v-chip
        v-if="globalStore.room.id"
        label
        color="primary"
      >
        {{ truncateString(globalStore.room.gameName, 8) }}
      </v-chip>
      <v-chip
        v-else
        label
        color="primary"
      >
        {{ t('global.noRoom') }}
      </v-chip>
    </div>
  </div>
  <div
    v-else
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <v-chip
        v-if="globalStore.room.id"
        color="primary"
        class="mr-4"
      >
        {{ t('global.room') + truncateString(globalStore.room.gameName, 15) }}
      </v-chip>
      <v-chip
        v-else
        color="primary"
        class="mr-4"
      >
        {{ t('global.room') + t('global.noRoom') }}
      </v-chip>
    </div>
    <div>
      <v-chip
        :color="getColor()"
        class="mr-4"
      >
        {{ t('global.gameVersion') + globalStore.gameVersion.local }}
      </v-chip>
    </div>
    <div>
      <v-chip
        color="info"
        class="mr-4"
      >
        {{ t('global.dmpVersion') + Version }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import useGlobalStore from "@store/global"
import { Version } from "@/config/index"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify"
import { truncateString } from "../../utils/tools.js"

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


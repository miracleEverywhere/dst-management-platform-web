<template>
  <v-tabs v-model="worldTabName">
    <v-tab v-for="world in worldForm" :value="world.name">
      {{world.name}}
      <v-btn icon="ri-delete-bin-5-line" variant="text"
             @click="handleWorldTabsEdit(world.name, 'remove')"
             class="ml-4"></v-btn>
    </v-tab>
    <v-btn icon="ri-add-line" variant="text"
           @click="handleWorldTabsEdit('', 'add')"></v-btn>
  </v-tabs>
  <v-tabs-window v-model="worldTabName" class="mx-8">
    <v-tabs-window-item v-for="world in worldForm" :key="world.name" :value="world.name">
      {{world.name}}
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import {GamePortFactor} from "@/config/index.js";
import {showSnackbar} from "@/utils/snackbar.js";

const { mobile } = useDisplay()
const { t } = useI18n()

const props = defineProps({
  formData: {
    type: Array,
    default: () => ([])
  },
})

onMounted(() => {
  if ((props.formData?.length||0) !== 0) {
    globalWorldIndex.value = props.formData.length
    worldForm.value = props.formData
    worldForm.value.forEach((world, index) => {
      world.name = `World${index+1}`
    })
  } else {
    globalWorldIndex.value = 1
    worldForm.value[0].name = 'World1'
    worldForm.value[0].serverPort = props.lastRoomID + GamePortFactor.serverPort + 1
    worldForm.value[0].masterServerPort = props.lastRoomID + GamePortFactor.masterServerPort + 1
    worldForm.value[0].authenticationPort = props.lastRoomID + GamePortFactor.authenticationPort + 1
  }
  worldTabName.value = worldForm.value[0].name
})

const worldTabName = ref('')
const worldForm = ref([{
  name: '',
  serverPort: 0,
  masterServerPort: 0,
  authenticationPort: 0,
  isMaster: true,
  encodeUserPath: true,
  levelData: '',
  modData: '',
}])

// name: ref
const dynamicWorldRefs = {}

// 防止 name 重复
const globalWorldIndex = ref(0)
const handleWorldTabsEdit = async (targetName, action) => {
  if (action === 'add') {
    globalWorldIndex.value = globalWorldIndex.value + 1
    const newWorldName = `World${globalWorldIndex.value}`
    console.log(typeof newWorldName)
    console.log(typeof worldTabName.value)
    dynamicWorldRefs[newWorldName] = ref()
    worldForm.value.push({
      name: newWorldName,
      serverPort: worldForm.value[worldForm.value.length-1].serverPort + 1,
      masterServerPort: worldForm.value[worldForm.value.length-1].masterServerPort + 1,
      authenticationPort: worldForm.value[worldForm.value.length-1].authenticationPort + 1,
      isMaster: false,
      encodeUserPath: true,
      levelData: '',
      modData: '',
    })
    worldTabName.value = newWorldName
  } else if (action === 'remove') {
    if (worldForm.value.length === 1) {
      showSnackbar('每个房间至少含有一个世界', 'error')
      return
    }
    const tabs = worldForm.value
    worldForm.value = tabs.filter((tab) => tab.name !== targetName)
    delete dynamicWorldRefs[targetName]
  }
}

watch(worldTabName, (v) => {
  if (!v) {
    worldTabName.value = worldForm.value[worldForm.value.length - 1].name
  }
  // worldLevelDataTabName.value = 'Code'
})
</script>

<style scoped>
</style>
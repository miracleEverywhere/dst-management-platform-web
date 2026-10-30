<template>
  <div>
    <v-card
      v-if="world"
      class="d-flex flex-column"
      :height="calculateContainerSize()"
    >
      <v-card-title class="flex-none mt-2">
        {{ title }}
      </v-card-title>
      <v-card-text class="flex-grow-1 overflow-y-auto pt-8">
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="world.serverPort"
              v-tooltip="'玩家进入游戏时，需要与该端口进行通信，协议为UDP'"
              label="直连端口"
              readonly
              hide-details
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="world.masterServerPort"
              v-tooltip="'如无特殊用途，请勿更改，对应字段为server.ini-[STEAM]-master_server_port'"
              label="Steam连接端口"
              readonly
              hide-details
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="world.authenticationPort"
              v-tooltip="'如无特殊用途，请勿更改，对应字段为server.ini-[STEAM]-authentication_port'"
              label="Steam认证端口"
              readonly
              hide-details
            />
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col
            cols="12"
            md="4"
          >
            <v-switch
              v-model="world.isMaster"
              v-tooltip="'此世界是否为主世界'"
              color="primary"
              label="主世界"
              hide-details
              inset
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-switch
              v-model="world.encodeUserPath"
              v-tooltip="'不可随意修改。是否开启用户存档路径编码，建议开启'"
              color="primary"
              label="路径编码"
              hide-details
              inset
            />
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div class="mb-2">
          世界配置 leveldataoverride.lua
        </div>

        <code-editor
          v-model="levelDraft"
          mode="lua"
          :height="480"
        />
      </v-card-text>
      <v-card-actions class="flex-none">
        <v-spacer />
        <v-btn
          :disabled="!dirty || saving"
          prepend-icon="ri-arrow-go-back-line"
          variant="text"
          class="mb-2"
          @click="resetAll"
        >
          重置
        </v-btn>
        <v-btn
          :disabled="!dirty || saving"
          :loading="saving"
          color="primary"
          prepend-icon="ri-save-line"
          class="mr-6 mb-2 px-4"
          @click="saveAll"
        >
          保存
        </v-btn>
      </v-card-actions>
    </v-card>

    <result
      v-else-if="loadError"
      type="error"
      title="加载失败"
      sub-title="请检查后端服务是否正常，然后重试。"
      :height="420"
    >
      <v-btn
        class="mt-4"
        color="primary"
        @click="loadWorld"
      >
        重试
      </v-btn>
    </result>

    <result
      v-else
      type="info"
      title="拼命加载中"
      :height="calculateContainerSize()"
    />
  </div>
</template>

<script setup>
import liteApi from '@/api/lite'
import { showSnackbar } from '@/utils/snackbar'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: value => ['ground', 'cave'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
})

const world = ref(null)
const levelDraft = ref('')
const loadError = ref(false)
const saving = ref(false)

// 已落盘的世界设置（主世界、路径编码），用于判断是否有未保存的修改
const settingsSnapshot = ref(null)

const windowHeight = ref(window.innerHeight)
const otherHeight = 150

const calculateContainerSize = () => {
  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
}

const handleResize = () => {
  windowHeight.value = window.innerHeight
}

const levelDirty = computed(() => {
  return levelDraft.value !== (world.value?.levelData || '')
})

const settingsDirty = computed(() => {
  if (!world.value || !settingsSnapshot.value) {
    return false
  }

  return world.value.isMaster !== settingsSnapshot.value.isMaster ||
    world.value.encodeUserPath !== settingsSnapshot.value.encodeUserPath
})

const dirty = computed(() => levelDirty.value || settingsDirty.value)

const syncSettingsSnapshot = (data = world.value) => {
  settingsSnapshot.value = data
    ? {
      isMaster: data.isMaster,
      encodeUserPath: data.encodeUserPath,
    }
    : null
}

const loadWorld = async () => {
  loadError.value = false

  try {
    const response = await liteApi[props.type].get()
    const data = response.data || null

    levelDraft.value = data?.levelData || ''
    world.value = data
    syncSettingsSnapshot(data)
  } catch {
    loadError.value = true
  }
}

const resetAll = () => {
  levelDraft.value = world.value?.levelData || ''

  if (world.value && settingsSnapshot.value) {
    world.value.isMaster = settingsSnapshot.value.isMaster
    world.value.encodeUserPath = settingsSnapshot.value.encodeUserPath
  }
}

const saveAll = async () => {
  if (!world.value) {
    return
  }

  // 世界配置允许为空；
  // 先固定本次要保存的值，避免保存期间继续编辑导致快照与实际落盘值不一致
  const levelData = levelDraft.value

  const settings = {
    isMaster: world.value.isMaster,
    encodeUserPath: world.value.encodeUserPath,
  }

  saving.value = true

  try {
    const response = await liteApi[props.type].put({
      ...world.value,
      ...settings,
      levelData,
    })

    world.value.levelData = levelData
    syncSettingsSnapshot(settings)
    showSnackbar(response.message || '保存成功')
  } catch {
    // 请求拦截器已给出提示
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadWorld()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

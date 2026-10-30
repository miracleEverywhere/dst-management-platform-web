<template>
  <div>
    <template v-if="loaded">
      <v-card>
        <v-card-title class="d-flex flex-wrap align-center ga-2">
          模组配置 modoverrides.lua
          <v-spacer />
          <v-btn
            :disabled="!modDirty || saving"
            prepend-icon="ri-arrow-go-back-line"
            variant="text"
            size="small"
            @click="resetMod"
          >
            重置
          </v-btn>
          <v-btn
            :disabled="!modDirty || saving"
            :loading="saving"
            color="primary"
            prepend-icon="ri-save-line"
            variant="elevated"
            size="small"
            @click="saveMod"
          >
            保存
          </v-btn>
        </v-card-title>
        <v-card-text>
          <code-editor
            v-model="modDraft"
            mode="lua"
            :height="600"
          />
        </v-card-text>
      </v-card>
    </template>

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
        @click="loadMod"
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

const modConfig = ref('')
const modDraft = ref('')
const loadError = ref(false)
const loaded = ref(false)
const saving = ref(false)

const windowHeight = ref(window.innerHeight)
const otherHeight = 150

const calculateContainerSize = () => {
  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
}

const handleResize = () => {
  windowHeight.value = window.innerHeight
}

const modDirty = computed(() => modDraft.value !== modConfig.value)

const loadMod = async () => {
  loadError.value = false

  try {
    const response = await liteApi.mod.get()

    modConfig.value = response.data || ''
    modDraft.value = modConfig.value
    loaded.value = true
  } catch {
    loadError.value = true
  }
}

const resetMod = () => {
  modDraft.value = modConfig.value
}

const saveMod = async () => {

  saving.value = true

  try {
    const response = await liteApi.mod.put({
      mod: modDraft.value,
    })

    modConfig.value = modDraft.value
    showSnackbar(response.message || '保存成功')
  } catch {
    // 请求拦截器已给出提示
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadMod()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

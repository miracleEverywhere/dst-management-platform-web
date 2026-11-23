<template>
  <v-card :loading="loading">
    <v-card-title>
      <div class="card-header">
        <div>
          {{ t('platform.bannedMods.title') }}
        </div>
        <div>
          <v-btn
            class="mr-2"
            :disabled="saveLoading || ids.length === 0"
            color="error"
            variant="tonal"
            @click="clearIDs"
          >
            {{ t('platform.bannedMods.clear') }}
          </v-btn>
          <v-btn
            :loading="saveLoading"
            color="primary"
            @click="save"
          >
            {{ t('platform.bannedMods.save') }}
          </v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-alert
        color="warning"
        density="compact"
        variant="tonal"
        class="mb-4"
      >
        {{ t('platform.bannedMods.tip') }}
      </v-alert>

      <v-textarea
        v-model="input"
        :label="t('platform.bannedMods.add.label')"
        :hint="t('platform.bannedMods.add.hint')"
        persistent-hint
        rows="2"
        auto-grow
        clearable
        class="mb-2"
        :placeholder="t('placeholders.platform.bannedMods')"
      />
      <div class="d-flex justify-end">
        <v-btn
          prepend-icon="ri-add-line"
          :disabled="!input.trim()"
          @click="addIDs"
        >
          {{ t('platform.bannedMods.add.action') }}
        </v-btn>
      </div>

      <div class="d-flex align-center justify-space-between mt-6 mb-2">
        <span class="text-subtitle-1">
          {{ t('platform.bannedMods.list.title') }}
        </span>
        <v-chip
          size="small"
          label
          variant="tonal"
          color="primary"
        >
          {{ t('platform.bannedMods.list.total', { total: ids.length }) }}
        </v-chip>
      </div>

      <v-progress-linear
        v-if="namesLoading"
        indeterminate
        color="primary"
        class="mb-2"
      />

      <v-sheet
        rounded
        border
      >
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ t('platform.bannedMods.table.preview') }}
              </th>
              <th class="text-left">
                {{ t('platform.bannedMods.table.id') }}
              </th>
              <th class="text-left">
                {{ t('platform.bannedMods.table.name') }}
              </th>
              <th class="text-right">
                {{ t('platform.bannedMods.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="ids.length === 0">
              <td
                colspan="4"
                class="text-center text-medium-emphasis py-6"
              >
                {{ t('platform.bannedMods.table.empty') }}
              </td>
            </tr>
            <tr
              v-for="id in ids"
              :key="id"
            >
              <td>
                <v-img
                  v-if="modPreviews[id]"
                  :src="modPreviews[id]"
                  :width="100"
                  cover
                  rounded
                  aspect-ratio="1"
                  class="ma-2"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                      />
                    </div>
                  </template>
                </v-img>
                <v-sheet
                  v-else
                  :width="100"
                  :height="100"
                  class="ma-2 d-flex align-center justify-center"
                  color="grey-lighten-4"
                  rounded
                >
                  <v-icon
                    icon="ri-image-line"
                    color="grey"
                    size="28"
                  />
                </v-sheet>
              </td>
              <td>
                <v-chip label>
                  {{ id }}
                </v-chip>
              </td>
              <td>{{ modNames[id] || t('platform.bannedMods.table.unknown') }}</td>
              <td class="text-right">
                <v-btn
                  v-tooltip="t('platform.bannedMods.table.delete')"
                  icon="ri-delete-bin-line"
                  color="error"
                  size="small"
                  variant="text"
                  @click="removeID(id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import modApi from "@/api/mod.js"
import { showSnackbar } from "@/utils/snackbar.js"


const { t } = useI18n()

const ids = ref([])
const modNames = ref({})
const modPreviews = ref({})
const input = ref('')
const loading = ref(false)
const namesLoading = ref(false)
const saveLoading = ref(false)

// 名单随时可能被增删，模组信息请求返回时用令牌丢弃过期响应
let namesToken = 0

// 用 /mod/info 批量补全模组名与预览图，查不到的只保留 ID
const loadModNames = async () => {
  const token = ++namesToken
  const modIDs = [...ids.value]

  if (modIDs.length === 0) {
    modNames.value = {}
    modPreviews.value = {}
    namesLoading.value = false

    return
  }

  namesLoading.value = true

  try {
    const response = await modApi.info.post({ modIDs })

    if (token !== namesToken) {
      return
    }

    const names = {}
    const previews = {}

    for (const mod of response.data || []) {
      if (!mod?.id) {
        continue
      }

      if (mod.name) {
        names[mod.id] = mod.name
      }

      if (mod.preview_url) {
        previews[mod.id] = mod.preview_url
      }
    }

    modNames.value = names
    modPreviews.value = previews
  } catch {
    // 查询失败时保留已有名称与预览图，未知的只显示 ID（接口异常由 Axios 拦截器统一提示）
  } finally {
    if (token === namesToken) {
      namesLoading.value = false
    }
  }
}

const getBannedIDs = async () => {
  loading.value = true

  try {
    const response = await modApi.banned.get()

    ids.value = Array.isArray(response.data) ? response.data : []
    await loadModNames()
  } catch {
    // 读取失败由 Axios 拦截器统一提示
  } finally {
    loading.value = false
  }
}

// 支持逗号、中文逗号、空格、换行分隔，过滤非法值与重复值
const parseIDs = raw => {
  const result = []
  const seen = new Set()

  for (const item of raw.split(/[\s,，]+/)) {
    const id = Number(item)

    if (!Number.isInteger(id) || id <= 0 || seen.has(id)) {
      continue
    }

    seen.add(id)
    result.push(id)
  }

  return result
}

const addIDs = async () => {
  const parsedIDs = parseIDs(input.value)

  if (parsedIDs.length === 0) {
    showSnackbar(t('platform.bannedMods.add.invalid'), 'warning')

    return
  }

  const existing = new Set(ids.value)
  const addedIDs = parsedIDs.filter(id => !existing.has(id))

  input.value = ''

  if (addedIDs.length === 0) {
    showSnackbar(t('platform.bannedMods.add.duplicated'), 'warning')

    return
  }

  ids.value = [...ids.value, ...addedIDs]
  await loadModNames()
}

const removeID = id => {
  ids.value = ids.value.filter(item => item !== id)
  delete modNames.value[id]
  delete modPreviews.value[id]
}

// 清空只影响本地列表，点保存才会写入屏蔽名单
const clearIDs = () => {
  ids.value = []
  modNames.value = {}
  modPreviews.value = {}
}

const save = async () => {
  saveLoading.value = true

  try {
    const response = await modApi.banned.put({ ids: ids.value })

    showSnackbar(response.message)
  } catch {
    // 保存失败由 Axios 拦截器统一提示
  } finally {
    saveLoading.value = false
  }
}

onMounted(() => {
  getBannedIDs()
})
</script>

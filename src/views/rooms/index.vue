<template>
  <div class="fcc">
    <v-text-field
      v-model="reqForm.name"
      :label="t('rooms.header.input.label')"
      :placeholder="t('rooms.header.input.placeholder')"
      append-inner-icon="ri-search-line"
      class="mr-4"
      :loading="getRoomsLoading"
      @click:append-inner="getRooms"
      @keyup.enter="getRooms"
    />
    <v-btn
      v-if="!mobile"
      :disabled="!userStore.userInfo.roomCreation&&userStore.userInfo.role!=='admin'"
      prepend-icon="ri-add-line"
      variant="elevated"
      size="large"
      class="mr-4"
      @click="openCreateDialog"
    >
      {{ t('rooms.header.button.create') }}
    </v-btn>
    <v-btn
      v-if="!mobile"
      prepend-icon="ri-refresh-line"
      color="default"
      variant="elevated"
      size="large"
      @click="getRooms"
    >
      {{ t('rooms.header.button.refresh') }}
    </v-btn>
    <v-btn
      v-if="mobile"
      :disabled="!userStore.userInfo.roomCreation&&userStore.userInfo.role!=='admin'"
      icon="ri-add-line"
      class="mr-4"
      @click="openCreateDialog"
    />
    <v-btn
      v-if="mobile"
      icon="ri-refresh-line"
      color="default"
      @click="getRooms"
    />
  </div>

  <v-row class="mt-8">
    <v-row>
      <v-col
        v-for="room in rooms"
        :cols="mobile?12:6"
      >
        <v-card
          :hover="true"
          variant="flat"
          :height="mobile?'600px':'300px'"
        >
          <v-card-title>
            <div class="fcb">
              <div class="fcc">
                {{ room.displayName }}
                <v-chip
                  color="default"
                  class="ml-4"
                >
                  {{ room.name }}
                </v-chip>
                <v-chip
                  :color="room.status?'success':'warning'"
                  class="ml-4"
                >
                  {{ room.status?t('rooms.card.success.header.title.activated'):t('rooms.card.success.header.title.deactivated') }}
                </v-chip>
                <v-icon
                  v-if="globalStore.room.name===room.name"
                  icon="ri-crosshair-2-line"
                  color="info"
                  class="ml-4"
                />
              </div>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :disabled="getRoomsLoading"
                    color="primary"
                    icon="ri-more-2-line"
                  />
                </template>

                <v-list>
                  <v-list-item
                    class="text-success"
                    @click="console.log(room.name)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-play-large-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('rooms.card.success.header.menu.activate') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    class="text-warning"
                    @click="console.log(room.name)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-stop-large-line"
                        color="warning"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('rooms.card.success.header.menu.deactivate') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    class="text-info"
                    @click="console.log(room.name)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-file-edit-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('rooms.card.success.header.menu.edit') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    class="text-error"
                    @click="console.log(room.name)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-delete-bin-line"
                        color="error"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('rooms.card.success.header.menu.delete') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card-title>
          <v-card-text
            v-ripple
            class="cursor-pointer"
            @click="gotoDashboard({name: room.name, displayName: room.displayName})"
          >
            <v-row v-if="room.gameName!==''">
              <v-col :cols="mobile?12:6">
                <v-row>
                  <v-col>
                    <v-btn>{{ room.gameName }}</v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col :cols="mobile?12:6">
                <v-card
                  class="mx-auto"
                  color="surface-light"
                >
                  <template #prepend>
                    <v-icon
                      color="primary"
                      class="me-8"
                      icon="ri-line-chart-line"
                      size="64"
                    />
                  </template>
                  <template #title>
                    <div class="text-caption text-grey">
                      60分钟最大玩家数
                    </div>
                    <span class="text-h3 font-weight-black">
                      <count-to
                        :duration="4000"
                        :end-val="Math.max(...[0,1,4,2,6,2,3,5,7,9,0,1,9])"
                        :start-val="0"
                      />
                    </span>
                    <strong>人</strong>
                  </template>
                  <v-sheet color="transparent">
                    <v-sparkline
                      :gradient="['#f72047', '#ffd200', '#1feaea']"
                      :line-width="3"
                      :model-value="[0,1,4,2,6,2,3,5,7,9,0,1,9]"
                      :smooth="true"
                      padding="8"
                      stroke-linecap="round"
                      auto-draw
                    />
                  </v-sheet>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <result
                type="warning"
                :height="mobile?600:300"
                :title="t('rooms.card.warning.title')"
                :sub-title="t('rooms.card.warning.subTitle')"
              />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
  <v-pagination
    v-if="total > reqForm.pageSize"
    v-model="reqForm.page"
    :length="Math.max(1, Math.ceil(total/reqForm.pageSize))"
    class="mt-8"
    @update:model-value="getRooms"
  />
  <div v-if="rooms.length===0&&reqForm.name!==''">
    <result
      type="warning"
      :height="windowHeight"
      :title="t('rooms.result.noResult.title')"
      :sub-title="t('rooms.result.noResult.subTitle')"
    />
  </div>
  <div v-if="rooms.length===0&&reqForm.name===''">
    <result
      type="warning"
      :height="windowHeight"
      :title="t('rooms.result.noRoom.title')"
      :sub-title="t('rooms.result.noRoom.subTitle')"
    />
  </div>

  <v-dialog
    v-model="createDialog"
    :width="mobile?'90%':'65%'"
  >
    <v-form
      fast-fail
      @submit.prevent="handleCreate"
    >
      <v-card>
        <v-card-title>
          {{ t('rooms.dialog.create.title') }}
        </v-card-title>
        <v-card-text class="mx-4">
          <v-row class="mt-8">
            <v-text-field
              v-model="createForm.name"
              v-tooltip="t('rooms.dialog.create.tips.name')"
              :rules="createFormRules.name"
              :label="t('rooms.dialog.create.form.name')"
            />
          </v-row>
          <v-row class="mt-8">
            <v-text-field
              v-model="createForm.displayName"
              v-tooltip="t('rooms.dialog.create.tips.displayName')"
              :label="t('rooms.dialog.create.form.displayName')"
            />
          </v-row>
        </v-card-text>
        <v-card-actions class="mt-16 mx-4 mb-8">
          <v-spacer />
          <v-btn
            color="default"
            variant="elevated"
            @click="createDialog=false"
          >
            {{ t('rooms.dialog.create.actions.cancel') }}
          </v-btn>
          <v-btn
            :loading="createLoading"
            variant="elevated"
            type="submit"
          >
            {{ t('rooms.dialog.create.actions.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import roomApi from "@/api/room"
import { useDisplay } from "vuetify"
import { CountTo } from "vue3-count-to"
import useUserStore from "@store/user"
import useGlobalStore from "@store/global"
import { useI18n } from "vue-i18n"
import { debounce } from "@/utils/tools"
import { showSnackbar } from "@/utils/snackbar.js"
import { useRouter } from "vue-router"


onMounted(() => {
  // 初始获取房间
  getRooms()

  // 计算初始pageSize
  reqForm.value.pageSize = calculatePageSize()


  // 防抖处理resize事件
  const handleResize = debounce(() => {
    windowHeight.value = window.innerHeight
    reqForm.value.pageSize = calculatePageSize()
  }, 200)


  // 添加事件监听
  window.addEventListener('resize', handleResize)

  // 在组件卸载时移除监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

const { mobile } = useDisplay()
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const globalStore = useGlobalStore()

const windowHeight = ref(window.innerHeight)

const calculatePageSize = () => {
  // 64(navbar) + 48(margin) + 44(pagination) + 24 * 2(card margins) = 204
  const usedHeight = 204
  const cardHeight = 300
  
  return Math.max(2, Math.floor((windowHeight.value - usedHeight) / cardHeight) * 2)
}

const reqForm = ref({
  name: "",
  page: 1,
  pageSize: 6,
})

const rooms = ref([])
const total = ref(0)
const getRoomsLoading = ref(false)

const getRooms = () => {
  getRoomsLoading.value = true
  roomApi.list.get(reqForm.value).then(response => {
    rooms.value = response.data.rows || []
    total.value = response.data.total
  }).finally(() => {
    getRoomsLoading.value = false
  })
}

const createDialog = ref(false)
const createRef = ref()

const createForm = ref({
  name: '',
  displayName: '',
})

const createFormRules = ref({
  name: [
    value => {
      if (value) return true
      
      return t('rooms.dialog.create.rules.name')
    },
  ],
})

const createLoading = ref(false)

const openCreateDialog = () => {
  createForm.value = {
    name: '',
    displayName: '',
  }
  createDialog.value = true
}

const handleCreate = async event => {
  createLoading.value = true

  const results = await event
  if (!results.valid) {
    createLoading.value = false
    
    return
  }
  roomApi.base.post(createForm.value).then(response => {
    createDialog.value = false
    getRooms()
    showSnackbar(response.message)
  }).finally(() => {
    createLoading.value = false
  })
}

const gotoDashboard = room => {
  if (globalStore.room.name === room.name) return
  globalStore.room = room
  showSnackbar(t('rooms.card.click')+globalStore.room.displayName)
}


watch(windowHeight, () => {
  getRooms()
}, { immediate: true })
</script>


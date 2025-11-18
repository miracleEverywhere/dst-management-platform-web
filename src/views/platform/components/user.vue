<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            clearable
            @keyup.enter="getUserListData"
          />
        </v-col>
        <v-col cols="12">
          <v-sheet
            rounded
            border
          >
            <v-data-table-server
              v-model:items-per-page="userListData.pageSize"
              :items="userListData.rows"
              :items-length="userListData.total"
              :page="userListData.page"
              :loading="getUserListDataLoading"
              :headers="headers"
              @update:options="getUserListData"
            >
              <template #top>
                <v-toolbar flat>
                  <v-toolbar-title>
                    <v-icon
                      icon="ri-user-settings-line"
                      start
                    />
                    用户列表
                  </v-toolbar-title>
                  <v-btn
                    prepend-icon="ri-add-line"
                    color="success"
                    @click="openUserDialog"
                  >
                    新增
                  </v-btn>
                  <v-btn
                    prepend-icon="ri-refresh-line"
                    :loading="getUserListDataLoading"
                    color="default"
                    @click="getUserListData"
                  >
                    刷新
                  </v-btn>
                </v-toolbar>
              </template>
            </v-data-table-server>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog
    v-model="userDialogVisible"
    :width="mobile?'85%':'60%'"
  >
    <v-card>
      <v-form>
        <v-card-title>
          新建用户
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="userForm.username"
                label="用户名"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="userForm.nickname"
                label="用户昵称"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
                cols="12"
                md="6"
            >
              <v-radio-group
                v-model="userForm.role"
                inline
              >
                <template #prepend>
                  <v-chip v-tooltip="t('game.base.step1.gameMode.tip')">
                    {{ t('game.base.step1.gameMode.name') }}
                  </v-chip>
                </template>
                <v-radio
                  :label="t('game.base.step1.gameMode.modes.endless')"
                  value="endless"
                  class="mr-4"
                />
                <v-radio
                  :label="t('game.base.step1.gameMode.modes.survival')"
                  value="survival"
                  class="mr-4"
                />
              </v-radio-group>
            </v-col>
            <v-col
                cols="12"
                md="6"
            >
              <v-radio-group
                v-model="userForm.disabled"
                inline
              >
                <template #prepend>
                  <v-chip v-tooltip="t('game.base.step1.gameMode.tip')">
                    {{ t('game.base.step1.gameMode.name') }}
                  </v-chip>
                </template>
                <v-radio
                  :label="t('game.base.step1.gameMode.modes.endless')"
                  value="endless"
                  class="mr-4"
                />
                <v-radio
                  :label="t('game.base.step1.gameMode.modes.survival')"
                  value="survival"
                  class="mr-4"
                />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row class="mb-6">
            <v-col v-for="i in 4" :key="i">
              <v-badge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  :model-value="userForm.avatar === i.toString()"
              >
                <v-avatar
                    v-ripple
                    color="primary"
                    variant="tonal"
                    @click="userForm.avatar = i.toString()"
                >
                  <v-img :src="getAvatar(i)" />
                </v-avatar>
              </v-badge>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import userApi from "@/api/user.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import avatar1 from "@images/avatars/avatar-1.png";
import avatar2 from "@images/avatars/avatar-2.png";
import avatar3 from "@images/avatars/avatar-3.png";
import avatar4 from "@images/avatars/avatar-4.png";


const { mobile } = useDisplay()
const { t } = useI18n()

const search = ref('')

const userListData = ref({
  rows: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const getUserListDataLoading = ref(false)

const getUserListData = () => {
  const reqFrom = {
    username: search.value,
    page: userListData.value.page,
    pageSize: userListData.value.pageSize,
  }
  getUserListDataLoading.value = true
  userApi.list.get(reqFrom).then(response => {
    userListData.value = response.data
  }).finally(() => {
    getUserListDataLoading.value = false
  })
}

const headers = [
  { title: '用户名', value: 'username' },
  { title: '昵称', value: 'nickname' },
  { title: '角色', value: 'role' },
  { title: '头像', value: 'avatar' },
  { title: '禁用', value: 'disabled' },
  { title: '房间数', value: 'rooms' },
  { title: '房间创建', value: 'roomCreation' },
  { title: '世界个数', value: 'maxWorlds' },
  { title: '玩家个数', value: 'maxPlayers' },
  { title: '玩家个数', value: 'maxPlayers' },
]

const userFormRef = ref()

const userForm = ref({
  username: '',
  nickname: '',
  role: 'admin',
  avatar: '1',
  password: '',
  disabled: false,
  rooms: [],
  roomCreation: true,
  maxWorlds: 0,
  maxPlayers: 0,
})

const userFormRules = {
  username: [
    value => {
      if (value) return true

      return t('game.base.step1.gameName.required')
    },
  ],
  nickname: [
    value => {
      if (value) return true

      return t('game.base.step1.gameName.required')
    },
  ],
  password: [
    value => {
      if (value) return true

      return t('game.base.step1.gameName.required')
    },
  ],
}

const userDialogVisible = ref(false)

const openUserDialog = () => {
  userDialogVisible.value = true
}


const avatars = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4
}

const getAvatar = (index) => {
  return avatars[index]
}
</script>


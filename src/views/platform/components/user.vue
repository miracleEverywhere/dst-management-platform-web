<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field>

          </v-text-field>
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
</template>

<script setup>
import platformApi from "@/api/platform.js"

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
    pageSize: userListData.value.pageSize
  }
  platformApi.user.list.get(reqFrom).then(response => {
    userListData.value = response.data
  })
}

const headers = [
  {title: '用户名', value: 'username'},
  {title: '昵称', value: 'nickname'},
  {title: '角色', value: 'role'},
  {title: '头像', value: 'avatar'},
  {title: '禁用', value: 'disabled'},
  {title: '房间数', value: 'rooms'},
  {title: '房间创建', value: 'roomCreation'},
  {title: '世界个数', value: 'maxWorlds'},
  {title: '玩家个数', value: 'maxPlayers'},
  {title: '玩家个数', value: 'maxPlayers'},
]
</script>

<style scoped>
</style>
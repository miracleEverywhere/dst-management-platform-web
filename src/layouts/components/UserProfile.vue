<template>
  <v-badge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <v-avatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <v-img :src="avatarImage" />

      <!-- SECTION Menu -->
      <v-menu
        activator="parent"
        location="bottom end"
        offset="14px"
      >
        <v-list>
          <!-- 👉 User Avatar & Name -->
          <v-list-item>
            <template #prepend>
              <v-list-item-action start>
                <v-badge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <v-avatar
                    color="primary"
                    variant="tonal"
                  >
                    <v-img :src="avatarImage" />
                  </v-avatar>
                </v-badge>
              </v-list-item-action>
            </template>

            <v-list-item-title class="font-weight-semibold">
              {{ userInfo.nickname || userInfo.username }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ userInfo.username }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-2" />

          <!-- 👉 Profile (lite 没有个人资料页) -->
          <v-list-item
            v-if="!IsLite"
            to="/profile"
          >
            <template #prepend>
              <v-icon
                icon="ri-user-line"
                size="22"
              />
            </template>

            <v-list-item-title>{{ IsLite ? '个人中心' : t('global.profile') }}</v-list-item-title>
          </v-list-item>

          <!-- 👉 Logout -->
          <v-list-item @click="handleLogout">
            <template #prepend>
              <v-icon
                icon="ri-logout-box-r-line"
                size="22"
              />
            </template>

            <v-list-item-title>{{ IsLite ? '退出平台' : t('global.logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- !SECTION -->
    </v-avatar>
  </v-badge>
</template>

<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import useUserStore from '@store/user'
import { useI18n } from "vue-i18n"
import userApi from "@/api/user"
import { IsLite } from '@/config'
import { useRouter } from 'vue-router'


const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const userInfo = userStore.userInfo
const avatarImage = ref()

switch (userInfo.avatar) {
  case '1':
    avatarImage.value = avatar1
    break
  case '2':
    avatarImage.value = avatar2
    break
  case '3':
    avatarImage.value = avatar3
    break
  case '4':
    avatarImage.value = avatar4
    break
  default:
    avatarImage.value = avatar1
}

const handleLogout = async () => {
  await userStore.clearStore()
  await router.push('/login')
}

onMounted(async () => {
  // lite 的菜单在登录时已经写入 store，这里不需要再请求主版本接口
  if (IsLite) return

  const resMenu = await userApi.menu.get()

  userStore.menus = resMenu.data
})
</script>

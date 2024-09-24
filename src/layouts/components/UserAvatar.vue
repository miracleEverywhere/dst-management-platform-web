<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:42
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-dropdown :options="generateOptions()" @select="handleSelect">
    <div class="flex cursor-pointer items-center">
      <n-avatar round :size="36">{{userStore.username?userStore.username.charAt(0).toUpperCase():''}}</n-avatar>
      <div v-if="userStore.userInfo" class="ml-12 flex-col flex-shrink-0 items-center">
        <span class="text-14">{{ userStore.username }}</span>
        <span class="text-12 opacity-50">[{{ userStore.role }}]</span>
      </div>
    </div>
  </n-dropdown>

  <RoleSelect ref="roleSelectRef" />
</template>

<script setup>
import { RoleSelect } from '@/layouts/components'
import {useAppStore, useAuthStore, usePermissionStore, useUserStore} from '@/store'
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()

const { t } = useI18n();

const generateOptions = () => {
  return [
    {
      label: t('header.profile'),
      key: 'profile',
      icon: () => h('i', { class: 'i-material-symbols:person-outline text-14' }),
      show: computed(() => permissionStore.accessRoutes?.some(item => item.path === '/profile')),
    },
    {
      label: t('header.logout'),
      key: 'logout',
      icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' }),
    },
  ]
}

const roleSelectRef = ref(null)

async function handleSelect(key) {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      await authStore.logout()
      break
  }
}
</script>

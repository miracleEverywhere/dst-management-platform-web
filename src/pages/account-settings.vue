<script setup>
import { useRoute } from 'vue-router'
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'
import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue'

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  {
    title: 'Account',
    icon: 'ri-group-line',
    tab: 'account',
  },
  {
    title: 'Security',
    icon: 'ri-lock-line',
    tab: 'security',
  },
  {
    title: 'Notifications',
    icon: 'ri-notification-3-line',
    tab: 'notification',
  },
]
</script>

<template>
  <div>
    <v-tabs
      v-model="activeTab"
      show-arrows
      class="v-tabs-pill"
    >
      <v-tab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <v-icon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-window
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Account -->
      <v-window-item value="account">
        <account-settings-account />
      </v-window-item>

      <!-- Security -->
      <v-window-item value="security">
        <account-settings-security />
      </v-window-item>

      <!-- Notification -->
      <v-window-item value="notification">
        <account-settings-notification />
      </v-window-item>
    </v-window>
  </div>
</template>

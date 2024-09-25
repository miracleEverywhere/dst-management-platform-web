<template>
  <div class="wh-full flex-col">
    <div style="display: flex; justify-content: right; font-size: 18px; margin-top: 10px">
      <Language/>
      <ToggleTheme/>
    </div>
    <div class="m-auto max-w-900 min-w-345 f-c-c rounded-8 bg-opacity-20 bg-cover p-12 card-shadow auto-bg">
<!--      <div class="hidden w-400 px-20 py-35 md:block">-->
<!--        <img alt="login_banner" class="w-full" src="@/assets/images/logo_mvs.svg">-->
<!--      </div>-->

      <div class="w-500 flex-col px-20 py-32">
        <h2 class="f-c-c text-24 text-#6a6a6a font-normal">
          <img alt="logo" class="mr-12 h-50" src="@/assets/images/logo.svg">
          <span v-if="language==='zh'">{{ titleZH }}</span>
          <span v-if="language==='en'">{{ titleEN }}</span>
        </h2>
        <n-input
          v-model:value="loginInfo.username"
          :maxlength="20"
          autofocus
          class="mt-32 h-40 items-center"
          :placeholder="$t('global.plzInput')+' '+$t('global.username')"
        >
          <template #prefix>
            <i class="i-fe:user mr-12 opacity-20"/>
          </template>
        </n-input>
        <n-input
          v-model:value="loginInfo.password"
          :maxlength="20"
          class="mt-20 h-40 items-center"
          :placeholder="$t('global.plzInput')+' '+$t('global.password')"
          show-password-on="mousedown"
          type="password"
          @keydown.enter="handleLogin()"
        >
          <template #prefix>
            <i class="i-fe:lock mr-12 opacity-20"/>
          </template>
        </n-input>

        <div class="mt-20 flex items-center">

          <n-button
            :loading="loading"
            class="mt-20 h-40 flex-1 rounded-5 text-16"
            type="primary"
            @click="handleLogin()"
          >
            {{t('login.login')}}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useAuthStore, useAppStore} from '@/store'
import {lStorage, SHA512, throttle} from '@/utils'
import {useStorage} from '@vueuse/core'
import api from './api'
import {useRoute, useRouter} from "vue-router";
import {ToggleTheme, Language} from '@/components'
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const titleZH = import.meta.env.VITE_WEB_TITLE_ZH
const titleEN = import.meta.env.VITE_WEB_TITLE_EN

const language = computed(() => appStore.language)

const loginInfo = ref({
  username: '',
  password: '',
})

const localLoginInfo = lStorage.get('loginInfo')
if (localLoginInfo) {
  loginInfo.value.username = localLoginInfo.username || ''
  loginInfo.value.password = localLoginInfo.password || ''
}

const loading = ref(false)

async function handleLogin(isQuick) {
  const {username, password, captcha} = loginInfo.value
  if (!username || !password)
    return $message.warning(t('login.needUsernamePassword'))
  try {
    loading.value = true
    const passwordSHA512 = SHA512(password.toString())
    const loginForm = {
      username: username,
      password: passwordSHA512
    }
    const {data, message} = await api.login({loginForm: loginForm})
    $message.success(message)
    await onLoginSuccess(data)
  } catch (error) {
  }
  loading.value = false
}

async function onLoginSuccess(data = {}) {
  authStore.setToken(data)
  try {
    if (route.query.redirect) {
      const path = route.query.redirect
      delete route.query.redirect
      await router.push({path, query: route.query})
    } else {
      await router.push('/')
    }
  } catch (e) {
  }
}
</script>

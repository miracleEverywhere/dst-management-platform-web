<template>
  <div class="header">
    <div class="fcc">
      <nav-header />
    </div>
    <div class="fcc">
      <github />
      <navbar-theme-switcher />
    </div>
  </div>
  <div class="d-flex align-center justify-center pa-4">
    <!-- 登录卡片 -->
    <v-card
      width="448"
      class="auth-card"
      :style="mobile?{'margin-top': '10vh'}:{'margin-top': '25vh'}"
    >
      <v-card-text class="mt-4">
        <v-badge location="top right" color="primary" content="Lite" :offset-x="-16" :offset-y="-8">
          <span style="font-size: 1.5em">
            欢迎使用饥荒管理平台
          </span>
        </v-badge>
      </v-card-text>

      <v-card-text class="mt-6">
        <v-alert
          v-if="needRegister"
          type="info"
          variant="tonal"
          class="mb-6"
          text="首次使用，请先注册一个账号。"
        />
        <v-form @submit.prevent="handleLogin">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="loginForm.username"
                label="用户名"
                autocomplete="username"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="loginForm.password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                label="密码"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <v-btn
                block
                class="my-6"
                type="submit"
                :loading="loginLoading"
              >
                登录
              </v-btn>
              <v-btn
                v-if="needRegister"
                :color="colors.grey.lighten3"
                block
                class="my-6"
                @click="registerDialogVisible = true"
              >
                注册账号
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-img
      :src="authV1Tree"
      :width="250"
      class="auth-footer-start-tree d-none d-md-block"
      style="z-index: 1!important;"
    />

    <v-img
      :src="authV1Tree2"
      :width="350"
      class="auth-footer-end-tree d-none d-md-block"
      style="z-index: 1!important;"
    />

    <v-img
      :src="authThemeMask"
      class="auth-footer-mask d-none d-md-block"
      style="z-index: 0!important;"
    />
  </div>

  <v-dialog
    v-model="registerDialogVisible"
    :max-width="mobile?'80%':'50%'"
  >
    <v-card title="注册账号">
      <v-card-text>
        <v-alert
          type="info"
          variant="tonal"
          class="mb-6"
          text="Lite 版本仅需用户名和密码即可使用。"
        />
        <v-form
          ref="registerFormRef"
          fast-fail
          @submit.prevent="handleRegisterPost"
        >
          <v-text-field
            v-model="registerForm.username"
            class="mb-6"
            label="用户名"
            :rules="registerFormRules.username"
            clearable
          />
          <v-text-field
            v-model="registerForm.password"
            :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
            :type="isPasswordVisible ? 'text' : 'password'"
            autocomplete="password"
            label="密码"
            :rules="registerFormRules.password"
            clearable
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
          />
          <v-card-actions class="mt-6">
            <v-spacer />
            <v-btn
              color="default"
              variant="elevated"
              text="取消"
              class="mr-4"
              @click="registerDialogVisible = false"
            />
            <v-btn
              text="提交"
              variant="elevated"
              type="submit"
              :loading="registerLoading"
            />
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDisplay, useTheme } from 'vuetify'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import colors from 'vuetify/lib/util/colors'
import liteApi from '@/api/lite'
import { showSnackbar } from "@/utils/snackbar"
import useUserStore from "@store/user"
import useGlobalStore from "@store/global"
import { useRouter } from 'vue-router'
import NavHeader from "@/layouts/components/NavHeader.vue"
import Github from "@/layouts/components/Github.vue"
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue"

const router = useRouter()
const userStore = useUserStore()
const globalStore = useGlobalStore()

const { mobile } = useDisplay()

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const loginForm = ref({
  username: '',
  password: '',
})

const isPasswordVisible = ref(false)
const loginLoading = ref(false)

const handleLogin = async () => {
  const username = loginForm.value.username.trim()

  if (username === '') {
    showSnackbar('请输入用户名', 'error')

    return
  }
  if (loginForm.value.password === '') {
    showSnackbar('请输入密码', 'error')

    return
  }

  loginLoading.value = true

  try {
    const response = await liteApi.login.post({
      username,
      password: loginForm.value.password,
    })

    userStore.token = response.data

    // lite 后端不提供用户信息接口，使用登录用户名填充
    userStore.userInfo = {
      ...userStore.userInfo,
      username,
      nickname: username,
      role: 'admin',
    }

    const resMenu = await liteApi.menu.get()

    userStore.menus = resMenu.data

    // lite 固定中文
    globalStore.language = 'zh'
    if (globalStore.theme === '') {
      globalStore.theme = 'light'
    }

    const redirect = router.currentRoute.value.query.redirect
    const target = typeof redirect === 'string' && redirect !== '/login' ? redirect : '/dashboard'

    await router.push(target)
    showSnackbar('登录成功')
  } catch {
    // 登录或拉取菜单失败，清理可能残留的认证信息
    userStore.clearStore()
  } finally {
    loginLoading.value = false
  }
}

const registerDialogVisible = ref(false)
const registerLoading = ref(false)
const registerFormRef = ref()

const registerForm = ref({
  username: '',
  password: '',
})

const registerFormRules = {
  username: [
    value => {
      if (value) return true

      return '请输入用户名'
    },
  ],
  password: [
    value => {
      if (value) return true

      return '请输入密码'
    },
  ],
}

const needRegister = ref(false)

const getNeedRegister = async () => {
  try {
    const response = await liteApi.register.get()

    needRegister.value = response.data || false
  } catch {
    needRegister.value = false
  }
}

const handleRegisterPost = async () => {
  const { valid } = await registerFormRef.value.validate()

  if (!valid) return

  registerLoading.value = true

  try {
    const username = registerForm.value.username.trim()

    const response = await liteApi.register.post({
      username,
      password: registerForm.value.password,
    })

    showSnackbar(response.message)
    loginForm.value.username = username
    registerForm.value = {
      username: '',
      password: '',
    }
    registerDialogVisible.value = false
    await getNeedRegister()
  } catch {
    // 请求拦截器已给出提示
  } finally {
    registerLoading.value = false
  }
}

onMounted(() => {
  getNeedRegister()
})
</script>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth";
.header {
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<template>
  <vertical-nav-layout>
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <div class="d-flex align-center">
          <nav-header />
        </div>
        <v-spacer />
        <github />
        <document />
        <lang-select />
        <navbar-theme-switcher class="me-2" />
      </div>
    </template>
    <div class="d-flex align-center justify-center pa-4">
      <v-card
        width="448"
        :style="mobile?{'margin-top': '10vh'}:{'margin-top': '25vh'}"
      >
        <v-card-text class="mt-4">
          <span style="font-size: 1.5em">
            {{ $t('login.welcome') }}
          </span>
        </v-card-text>

        <v-card-text class="mt-6">
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="loginForm.username"
                  label="用户名"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="loginForm.password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  label="密码"
                  placeholder="············"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
                <v-btn
                  block
                  class="my-6"
                  to="/rooms"
                  type="submit"
                  @click="handleLogin"
                >
                  登录
                </v-btn>
                <v-dialog
                  v-model="registerDialogVisible"
                  max-width="50%"
                >
                  <template #activator="{ props: activatorProps }">
                    <v-btn
                      :color="colors.grey.lighten3"
                      block
                      class="my-6"
                      v-bind="activatorProps"
                    >
                      注册
                    </v-btn>
                  </template>

                  <template #default="{ isActive }">
                    <v-card title="用户注册">
                      <v-card-text>
                        <v-form
                          fast-fail
                          class="mx-4 mt-6"
                          @submit.prevent="handleRegisterPost"
                        >
                          <v-row>
                            <v-text-field
                              v-model="registerForm.username"
                              class="mb-6"
                              label="用户名"
                              placeholder="请输入用户名"
                              clearable
                              :rules="registerFormRules.username"
                            />
                          </v-row>
                          <v-row>
                            <v-text-field
                              v-model="registerForm.nickname"
                              class="mb-6"
                              label="昵称"
                              placeholder="请输入用户昵称"
                              clearable
                              :rules="registerFormRules.nickname"
                            />
                          </v-row>
                          <v-row class="mb-6">
                            <v-col>
                              <v-badge
                                v-if="registerForm.avatar==='1'"
                                dot
                                location="bottom right"
                                offset-x="3"
                                offset-y="3"
                                color="success"
                              >
                                <v-avatar
                                  v-ripple
                                  color="primary"
                                  variant="tonal"
                                  @click="registerForm.avatar='1'"
                                >
                                  <v-img :src="avatar1" />
                                </v-avatar>
                              </v-badge>
                              <v-avatar
                                v-else
                                v-ripple
                                color="primary"
                                variant="tonal"
                                @click="registerForm.avatar='1'"
                              >
                                <v-img :src="avatar1" />
                              </v-avatar>
                            </v-col>
                            <v-col>
                              <v-badge
                                v-if="registerForm.avatar==='2'"
                                dot
                                location="bottom right"
                                offset-x="3"
                                offset-y="3"
                                color="success"
                              >
                                <v-avatar
                                  v-ripple
                                  color="primary"
                                  variant="tonal"
                                  @click="registerForm.avatar='2'"
                                >
                                  <v-img :src="avatar2" />
                                </v-avatar>
                              </v-badge>
                              <v-avatar
                                v-else
                                v-ripple
                                color="primary"
                                variant="tonal"
                                @click="registerForm.avatar='2'"
                              >
                                <v-img :src="avatar2" />
                              </v-avatar>
                            </v-col>
                            <v-col>
                              <v-badge
                                v-if="registerForm.avatar==='3'"
                                dot
                                location="bottom right"
                                offset-x="3"
                                offset-y="3"
                                color="success"
                              >
                                <v-avatar
                                  v-ripple
                                  color="primary"
                                  variant="tonal"
                                  @click="registerForm.avatar='3'"
                                >
                                  <v-img :src="avatar3" />
                                </v-avatar>
                              </v-badge>
                              <v-avatar
                                v-else
                                v-ripple
                                color="primary"
                                variant="tonal"
                                @click="registerForm.avatar='3'"
                              >
                                <v-img :src="avatar3" />
                              </v-avatar>
                            </v-col>
                            <v-col>
                              <v-badge
                                v-if="registerForm.avatar==='4'"
                                dot
                                location="bottom right"
                                offset-x="3"
                                offset-y="3"
                                color="success"
                              >
                                <v-avatar
                                  v-ripple
                                  color="primary"
                                  variant="tonal"
                                  @click="registerForm.avatar='4'"
                                >
                                  <v-img :src="avatar4" />
                                </v-avatar>
                              </v-badge>
                              <v-avatar
                                v-else
                                v-ripple
                                color="primary"
                                variant="tonal"
                                @click="registerForm.avatar='4'"
                              >
                                <v-img :src="avatar4" />
                              </v-avatar>
                            </v-col>
                          </v-row>
                          <v-spacer />
                          <v-row>
                            <v-text-field
                              v-model="registerForm.password"
                              :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                              :type="isPasswordVisible ? 'text' : 'password'"
                              autocomplete="password"
                              class="mb-6"
                              label="密码"
                              :rules="registerFormRules.password"
                              clearable
                              placeholder="请输入密码"
                              @click:append-inner="isPasswordVisible = !isPasswordVisible"
                            />
                          </v-row>
                          <v-card-actions class="mt-16">
                            <v-spacer />
                            <v-btn
                              color="default"
                              variant="elevated"
                              text="取消"
                              @click="isActive.value = false"
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
                  </template>
                </v-dialog>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <v-img
        :src="authV1Tree"
        :width="250"
        class="auth-footer-start-tree d-none d-md-block"
      />

      <v-img
        :src="authV1Tree2"
        :width="350"
        class="auth-footer-end-tree d-none d-md-block"
      />

      <v-img
        :src="authThemeMask"
        class="auth-footer-mask d-none d-md-block"
      />
    </div>
  </vertical-nav-layout>
</template>

<script setup>
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue"
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue"
import {useDisplay, useTheme} from 'vuetify'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import colors from 'vuetify/lib/util/colors'
import userApi from '@/api/user'
import { deepCopy, getBrowserLang, SHA512 } from "@/utils/tools"
import { showSnackbar } from "@/utils/snackbar"
import useUserStore from "@store/user"
import useGlobalStore from "@store/global"
import { useRouter } from 'vue-router'
import NavHeader from "@/layouts/components/NavHeader.vue"
import Github from "@/layouts/components/GitHub.vue"
import LangSelect from "@/layouts/components/LangSelect.vue"
import Document from "@/layouts/components/Document.vue"


const router = useRouter()
const userStore = useUserStore()
const globalStore = useGlobalStore()

const {
  xs, sm, md, lg, xl,   // 布尔值，当前屏幕是否匹配该断点
  smAndUp, mdAndUp,      // 当前屏幕及以上尺寸
  smAndDown, mdAndDown,  // 当前屏幕及以下尺寸
  name,                  // 当前断点名称 ('xs', 'sm', 'md', 'lg', 'xl', 'xxl')
  width, height,         // 屏幕宽高
  mobile,                // 是否为移动设备
  thresholds             // 断点阈值
} = useDisplay()

onMounted(() => {

})

const loginForm = ref({
  username: '',
  password: '',
})

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const isPasswordVisible = ref(false)

const handleLogin = async () => {
  const reqForm = deepCopy(loginForm.value)

  reqForm.password = SHA512(loginForm.value.password)

  const resLogin = await userApi.login.post(reqForm)

  userStore.token = resLogin.data

  const resUser = await userApi.userinfo.get()

  userStore.userInfo = resUser.data

  const resMenu = await userApi.menu.get()

  userStore.menus = resMenu.data

  const redirect = router.currentRoute.value.query.redirect || '/rooms'

  if (globalStore.language === "") {
    globalStore.language = getBrowserLang()
  }

  if (globalStore.theme === "") {
    globalStore.theme = "light"
  }

  await router.push(redirect)
  showSnackbar('登录成功')
}

const registerDialogVisible = ref(false)
const registerLoading = ref(false)

const registerForm = ref({
  username: '',
  nickname: '',
  avatar: '1',
  password: '',
})

const registerFormRules = {
  username: [
    value => {
      if (value) return true
      
      return '请输入用户名'
    },
  ],
  nickname: [
    value => {
      if (value) return true
      
      return '请输入用户昵称'
    },
  ],
  password: [
    value => {
      if (value) return true
      
      return '请输入密码'
    },
  ],
}

const handleRegisterPost = async event => {
  registerLoading.value = true

  const results = await event

  console.log(results.valid)
  if (!results.valid) {
    registerLoading.value = false
    
    return
  }

  const password = SHA512(registerForm.value.password)
  const reqForm = registerForm.value

  reqForm.password = password

  userApi.register.post(reqForm).then(response => {
    showSnackbar(response.message, 'success')
    registerLoading.value = false
    registerDialogVisible.value = false
  }).finally(() => {
    registerLoading.value = false
  })

}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>

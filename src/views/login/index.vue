<template>
  <div class="h-full">
    <el-row class="h-100%">
      <div class="absolute top-10px right-10px flex flex-items-center">
        <Language></Language>
        <Dark></Dark>
      </div>
      <el-col :lg="16" :md="12" :sm="15" :xs="0" class="flex items-center justify-center">
        <div class="login-background w-85% h-100%"></div>
        <div class="absolute text-center select-none">
          <el-image :src="bg" class="w-400px h-360px mb-50px animate-float <md:hidden <lg:w-360px h-320px"/>
          <div class="font-bold text-3xl chroma-text mb-6px text-center <lg:text-2xl <md:hidden">
            {{ $t("login.welcome") }} {{ loginTitle }}
          </div>
          <div class="chroma-text text-lg text-center <md:hidden">{{ $t("login.description") }}</div>
        </div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="9" :xs="24" class="dark:bg-#161616 bg-gray-100 flex items-center justify-center flex-col">
        <div style="margin-bottom: -50px">
          <el-image :src="logo" style="width: 200px"/>
        </div>
        <div class="flex items-center">
          <div class="ml-6px font-bold text-xl">{{ loginTitle }}</div>
        </div>
        <div class="flex items-center space-x-3 text-gray-400 mt-16px mb-16px">
          <span class="h-1px w-16 bg-gray-300 inline-block"></span>
          <span class="text-center">{{ $t("login.account") }}</span>
          <span class="h-1px w-16 bg-gray-300 inline-block"></span>
        </div>
        <!-- 输入框盒子 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" :validate-on-rule-change="false"
                 class="w-260px" @keyup.enter="handleKoiLogin">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" :placeholder="$t('login.loginName')" :prefix-icon="User" type="text"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :placeholder="$t('login.password')"
              :prefix-icon="Lock"
              show-password
              type="password"
            />
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button v-if="!loading" v-throttle:3000="handleKoiLogin"
                       round type="primary" style="width: 100%;"
            >
              {{ $t("login.in") }}
            </el-button>
            <el-button v-else :loading="loading"
                       round type="primary" style="width: 100%;">
              {{ $t("login.center") }}
            </el-button>

          </el-form-item>
          <el-form-item style="margin-top: -3%">
            <el-button round @click="openRegisterDialog" style="width: 100%;">
              {{ t("login.register") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog v-model="registerDialogVisible" width="60%" @closed="clearRegisterForm">
      <template #header>
        {{ t("login.register") }}
      </template>
      <div class="tip">
        {{ t("login.registerTip") }}
      </div>
      <div class="tip_error">
        {{ t("login.registerTip2") }}
      </div>
      <el-form ref="registerFormRef" :model="registerForm" label-width="100"
               :rules="registerFormRules" :validate-on-rule-change="false"
               style="margin: 20px"
      >
        <el-form-item :label="t('profile.username')" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item :label="t('profile.nickname')" prop="nickname">
          <el-input v-model="registerForm.nickname"></el-input>
        </el-form-item>
        <el-form-item :label="t('profile.password')" prop="password">
          <el-input v-model="registerForm.password" autocomplete="new-password" show-password></el-input>
          <sc-password-strength v-model="registerForm.password"></sc-password-strength>
          <div class="el-form-item-msg">{{ t('profile.suggestedPassword') }}</div>
        </el-form-item>
        <div style="display: flex; justify-content: flex-end; padding-top: 10px">
          <el-button type="primary" :loading="registerLoading" @click="handleRegister">
            {{ t('profile.submit') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import {Lock, User} from "@element-plus/icons-vue";
import {computed, reactive, ref} from "vue";
import {koiMsgSuccess, koiMsgWarning} from "@/utils/koi.ts";
import {useRouter} from "vue-router";
import useUserStore from "@/stores/modules/user.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import {HOME_URL, LOGIN_URL} from "@/config/index.ts";
import {initDynamicRouter} from "@/routers/modules/dynamicRouter.ts";
import useTabsStore from "@/stores/modules/tabs.ts";
import {getAssets, getLanguage} from "@/utils/index.ts";
import settings from "@/settings";
import Language from "@/layouts/components/Header/components/Language.vue";
import Dark from "@/layouts/components/Header/components/Dark.vue";
import useGlobalStore from "@/stores/modules/global.ts";
import {SHA512} from "@/utils/tools.js";
import systemApi from "@/api/system"
import {useI18n} from "vue-i18n";
import ScPasswordStrength from "@/components/scPasswordStrength/index.vue";

// 标题语言切换
const loginTitle = ref(settings.loginTitle);
loginTitle.value = computed(() => {
  return getLanguage(globalStore.language, settings.loginTitle, settings.loginEnTitle);
});
const {t} = useI18n()
const globalStore = useGlobalStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const router = useRouter();

/** 用户登录代码 */
const logo = getAssets("images/logo/logo.svg");
const bg = getAssets("images/login/bg.png");

const loginFormRef = ref();
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = computed(() => {
  if (globalStore.language === "en") {
    return reactive({
      username: [{required: true, message: "The user name cannot be empty", trigger: "blur"}],
      password: [{required: true, message: "The password cannot be empty", trigger: "blur"}],
    });
  } else {
    return reactive({
      username: [{required: true, message: "用户名不能为空", trigger: "blur"}],
      password: [{required: true, message: "密码不能为空", trigger: "blur"}],
    });
  }
});

/** 登录 */
const handleKoiLogin = () => {
  if (!loginFormRef.value) return;
  (loginFormRef.value).validate(async (valid, fields) => {

    const password = SHA512(loginForm.password)
    if (valid) {
      loading.value = true;
      try {
        // 1、执行登录接口
        const reqForm = {
          username: loginForm.username,
          password: password
        }
        const res = await systemApi.login.post({loginForm: reqForm});
        koiMsgSuccess(res.message)
        // userStore.setToken(res.data.tokenValue);
        userStore.setToken(res.data.token);
        // 2、添加动态路由 AND 用户按钮 AND 角色信息 AND 用户个人信息
        if (userStore?.token) {
          await initDynamicRouter();
        } else {
          koiMsgWarning(globalStore.language==='zh'?'登录失败':'Login Failed');
          await router.replace(LOGIN_URL);
          return;
        }
        // 3、清空 tabs数据、keepAlive缓存数据
        await tabsStore.setTab([]);
        await keepAliveStore.setKeepAliveName([]);
        // 4、跳转到首页
        await router.replace(HOME_URL);
      } catch (error) {
        // 等待1秒关闭loading
        let loadingTime = 1;
        setInterval(() => {
          loadingTime--;
          if (loadingTime === 0) {
            loading.value = false;
          }
        }, 1000);
      }
    }
  });
};

const registerDialogVisible = ref(false)
const registerFormRef = ref()
const registerForm = ref({
  username: '',
  nickname: '',
  role: "想什么呢",
  password: '',
  disabled: false,
})
const registerFormRules = {
  username: [
    {required: true, message: t('profile.formValidateMsg.username')}
  ],
  nickname: [
    {required: true, message: t('profile.formValidateMsg.nickname')}
  ],
  password: [
    {required: true, message: t('profile.formValidateMsg.password')}
  ],
  disabled: [
    {required: true, message: t('profile.formValidateMsg.disabled')}
  ],
}
const clearRegisterForm = () => {
  registerForm.value = {
    username: '',
    nickname: '',
    password: '',

  }
}
const openRegisterDialog = () => {
  if (registerFormRef.value) {
    registerFormRef.value.clearValidate()
  }
  registerDialogVisible.value = true
}
const registerLoading = ref(false)
const handleRegister = () => {
  registerFormRef.value.validate(valid => {
    if (valid) {
      registerLoading.value = true
      const reqForm = {
        role: "想什么呢",
        disabled: false,
        username: registerForm.value.username,
        nickname: registerForm.value.nickname,
        password: SHA512(registerForm.value.password),
      }
      systemApi.register.post(reqForm).then(response => {
        registerDialogVisible.value = false
        koiMsgSuccess(response.message)
      }).finally(() => {
        registerLoading.value = false
      })
    }
  })
}

</script>

<style lang="scss" scoped>
/** 备案号 */
.beianhao {
  position: absolute;
  bottom: 10px;
  left: auto;
  font-size: 12px;
  font-weight: bold;
}

.login-background {
  background: linear-gradient(155deg, #07070915 12%, var(--el-color-primary) 36%, #07070915 76%);
  filter: blur(100px);
}

.animate-float {
  animation: float 5s linear 0ms infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>

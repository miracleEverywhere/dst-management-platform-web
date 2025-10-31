<template>
  <template v-if="globalStore.room.name===''">
    <result
      type="error"
      :title="t('global.result.title')"
      :sub-title="t('global.result.subTitle')"
      :height="windowHeight"
    />
  </template>
  <template v-else>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item :color="step > 0 ? 'success' : ''" :complete="step > 0" :value="0" title="房间设置">
          <template #icon>
            <v-icon icon="ri-number-1" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 1 ? 'success' : ''" :complete="step > 1" :value="1" title="世界设置">
          <template #icon>
            <v-icon icon="ri-number-2" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 2 ? 'success' : ''" :complete="step > 2" :value="2" title="模组设置">
          <template #icon>
            <v-icon icon="ri-number-3" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 3 ? 'success' : ''" :complete="step > 3" :value="3" title="系统设置">
          <template #icon>
            <v-icon icon="ri-number-4" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 4 ? 'success' : ''" :complete="step > 4" :value="4" title="设置完成">
          <template #icon>
            <v-icon icon="ri-number-5" size="12"></v-icon>
          </template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window v-model="step">
        <v-stepper-window-item :value="0">
          <v-container :height="calculateContainerSize()" style="overflow-y: auto">
            <room-setting/>
          </v-container>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions class="mx-8">
        <template #prev>
          <v-btn :disabled="step===0" color="grey-lighten-3" variant="elevated" @click="handlePrev">上一步</v-btn>
        </template>
        <template #next>
          <v-btn v-if="step!==4" color="primary" variant="elevated" @click="handleNext">下一步</v-btn>
          <v-menu open-on-click>
            <template v-slot:activator="{ props }">
              <v-btn v-if="step===4" :disabled="false" color="success" prepend-icon="ri-list-unordered"
                     variant="elevated" v-bind="props">
                操作
              </v-btn>
            </template>
            <v-list>
              <v-list-item title="保存" @click="console.log(1)" />
              <v-list-item title="保存并重启" @click="console.log(1)" />
              <v-list-item title="生成新世界" @click="console.log(1)" />
            </v-list>
          </v-menu>
        </template>
      </v-stepper-actions>
    </v-stepper>
  </template>
</template>

<script setup>
import { debounce } from "@/utils/tools.js"
import useUserStore from "@store/user.js"
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import roomSetting from "@/views/game/components/roomSetting.vue";

onMounted(() => {
  // 防抖处理resize事件
  const handleResize = debounce(() => {
    windowHeight.value = window.innerHeight
  }, 200)


  // 添加事件监听
  window.addEventListener('resize', handleResize)

  // 在组件卸载时移除监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

const windowHeight = ref(window.innerHeight)
const userStore = useUserStore()
const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const step = ref(0)

const calculateContainerSize = () => {
  // 64(navbar) + 72(step header) + 54(step action) + 24(card margins) = 304
  const other = 304

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const handlePrev = () => {

}
const handleNext = () => {

}


</script>


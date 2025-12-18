<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-tabs
        v-model="activeTabName"
        align-tabs="start"
        color="primary"
        show-arrows
      >
        <v-tab value="current">
          当前日志
        </v-tab>
        <v-tab value="history">
          历史日志
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="activeTabName" class="mt-4">
        <v-tabs-window-item value="current">
          <single-log type="chat" chat/>
        </v-tabs-window-item>
        <v-tabs-window-item value="history">
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template v-else>
      <result
        :title="t('global.result.title')"
        :sub-title="t('global.result.subTitle')"
        type="error"
        :height="calculateHeight()"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.result.button') }}
        </v-btn>
      </result>
    </template>
  </template>
  <template v-else>
    <result
      v-if="userStore.userInfo.role==='admin'"
      :title="t('global.noGame.title')"
      :sub-title="t('global.noGame.subTitle')"
      :height="calculateHeight()"
      type="error"
    >
      <v-btn
        to="/install"
        class="mt-4"
      >
        {{ t('global.noGame.button') }}
      </v-btn>
    </result>
    <result
      v-else
      :title="t('global.noGameNoAdmin.title')"
      :sub-title="t('global.noGameNoAdmin.subTitle')"
      :height="calculateHeight()"
      type="error"
    />
  </template>
</template>
<script setup>
import SingleLog from "@/views/logs/components/singleLog.vue";
import {debounce} from "@/utils/tools.js";
import useGlobalStore from "@/plugins/store/global.js";
import useUserStore from "@/plugins/store/user.js";
import {useDisplay} from "vuetify/framework";
import {useI18n} from "vue-i18n";


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const activeTabName = ref('current')

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - 160 - 37))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

onMounted(async () => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
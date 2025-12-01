<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <!-- 数据是否获取 -->
      <template v-if="dataGot">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-card ref="card1Ref">
              <v-card-title>
                {{ t('dashboard.card1.title') }}
              </v-card-title>
              <v-card-text class="my-4">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-2"
                    >
                      房间名称
                    </v-chip>
                    <v-btn
                      v-copy="baseInfo.room.gameName"
                      variant="text"
                      append-icon="ri-file-copy-line"
                      class="text-none"
                    >
                      {{ truncateString(baseInfo.room.gameName, mobile?(card1Width-200)/15:(card1Width-400)/30) }}
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-2"
                    >
                      直连代码
                    </v-chip>
                    <v-btn
                      variant="text"
                      icon="ri-file-copy-line"
                    />
                    <v-btn
                      variant="text"
                      color="default"
                    >
                      自定义
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      游戏天数
                    </v-chip>
                    <v-chip v-if="baseInfo.session.cycles!==-1">
                      {{ baseInfo.session.cycles }}
                    </v-chip>
                    <v-chip
                      v-else
                      color="error"
                    >
                      {{ t('dashboard.card1.error') }}
                    </v-chip>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      游戏模式
                    </v-chip>
                    <v-chip>{{ t(`game.base.step1.gameMode.modes.${baseInfo.room.gameMode}`) }}</v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      游戏季节
                    </v-chip>
                    <v-chip v-if="baseInfo.session.season!=='error'">
                      {{ t(`dashboard.card1.season.${baseInfo.session.season}`) }}({{ baseInfo.session.elapsedDays }}/{{ baseInfo.session.seasonLength[baseInfo.session.season] }})
                    </v-chip>
                    <v-chip
                      v-else
                      color="error"
                    >
                      {{ t('dashboard.card1.error') }}
                    </v-chip>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      游戏阶段
                    </v-chip>
                    <v-chip v-if="baseInfo.session.phase!=='error'">
                      {{ t(`dashboard.card1.phase.${baseInfo.session.phase}`) }}
                    </v-chip>
                    <v-chip
                      v-else
                      color="error"
                    >
                      {{ t('dashboard.card1.error') }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      游戏模组
                    </v-chip>
                    <v-chip @click="console.log(1)">
                      {{ baseInfo.room.modInOne?parseModLua(baseInfo.room.modData).length:parseModLua(baseInfo.worlds[0].modData).length }}
                    </v-chip>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      游戏玩家
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-card>
              <v-card-title>
                {{ t('dashboard.card2.title') }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  />
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-card>
              <v-card-title>
                {{ t('dashboard.card3.title') }}
              </v-card-title>
              <v-card-text class="mx-4">
                <v-row class="mt-4">
                  <v-btn
                    v-tooltip="t('dashboard.card3.startup.tip')"
                    class="mr-4 mb-4"
                    color="success"
                    @click="confirmBoxVisible.startup.visible=true"
                  >
                    {{ t('dashboard.card3.startup.title') }}
                  </v-btn>
                  <confirm-box
                    v-model="confirmBoxVisible.startup.visible"
                    type="info"
                    :title="t('dashboard.card3.startup.title')"
                    :content="t('dashboard.card3.startup.confirm')"
                    :confirm-text="t('global.confirm.confirm')"
                    :cancel-text="t('global.confirm.cancel')"
                    :confirm-loading="confirmBoxVisible.startup.loading"
                    @confirm="handleGameExec({type:'startup',extra:'all'})"
                    @cancel="confirmBoxVisible.startup.visible=false"
                  />

                  <v-btn
                    v-tooltip="t('dashboard.card3.shutdown.tip')"
                    class="mr-4 mb-4"
                    color="error"
                    @click="confirmBoxVisible.shutdown.visible=true"
                  >
                    {{ t('dashboard.card3.shutdown.title') }}
                  </v-btn>
                  <confirm-box
                    v-model="confirmBoxVisible.shutdown.visible"
                    type="info"
                    :title="t('dashboard.card3.shutdown.title')"
                    :content="t('dashboard.card3.shutdown.confirm')"
                    :confirm-text="t('global.confirm.confirm')"
                    :cancel-text="t('global.confirm.cancel')"
                    :confirm-loading="confirmBoxVisible.shutdown.loading"
                    @confirm="handleGameExec({type:'shutdown',extra:'all'})"
                    @cancel="confirmBoxVisible.shutdown.visible=false"
                  />

                  <v-btn
                    v-tooltip="t('dashboard.card3.restart.tip')"
                    class="mr-4 mb-4"
                    color="warning"
                    @click="confirmBoxVisible.restart.visible=true"
                  >
                    {{ t('dashboard.card3.restart.title') }}
                  </v-btn>
                  <confirm-box
                    v-model="confirmBoxVisible.restart.visible"
                    type="info"
                    :title="t('dashboard.card3.restart.title')"
                    :content="t('dashboard.card3.restart.confirm')"
                    :confirm-text="t('global.confirm.confirm')"
                    :cancel-text="t('global.confirm.cancel')"
                    :confirm-loading="confirmBoxVisible.restart.loading"
                    @confirm="handleGameExec({type:'restart'})"
                    @cancel="confirmBoxVisible.restart.visible=false"
                  />

                  <v-btn
                    v-tooltip="t('dashboard.card3.update.tip')"
                    class="mr-4 mb-4"
                    color="info"
                  >
                    {{ t('dashboard.card3.update.title') }}
                  </v-btn>
                </v-row>
                <v-row class="mb-4">
                  <v-btn
                    v-tooltip="t('dashboard.card3.reset.tip')"
                    class="mr-4 mb-4"
                    :color="colors.purple.base"
                  >
                    {{ t('dashboard.card3.reset.title') }}
                  </v-btn>
                  <v-btn
                    v-tooltip="t('dashboard.card3.clean.tip')"
                    class="mr-4 mb-4"
                    :color="colors.brown.base"
                  >
                    {{ t('dashboard.card3.clean.title') }}
                  </v-btn>
                  <v-btn
                    v-tooltip="t('dashboard.card3.quickCmd.tip')"
                    class="mr-4 mb-4"
                    :color="colors.cyan.darken1"
                  >
                    {{ t('dashboard.card3.quickCmd.title') }}
                  </v-btn>
                  <v-btn
                    v-tooltip="t('dashboard.card3.check.tip')"
                    class="mr-4 mb-4"
                    :color="colors.teal.base"
                  >
                    {{ t('dashboard.card3.check.title') }}
                  </v-btn>
                </v-row>
                <v-row>
                  <v-chip
                    v-tooltip="t('dashboard.card3.rollback.tip')"
                    label
                    class="mr-4"
                  >
                    {{ t('dashboard.card3.rollback.title') }}
                  </v-chip>
                  <v-btn
                    v-for="i in mobile?[1, 2, 3, 4]:[1, 2, 3, 4, 5, 6, 7, 8, 9]"
                    color="default"
                    size="x-small"
                    class="mr-4 mb-4"
                  >
                    {{ i }}
                    <v-dialog
                      activator="parent"
                      max-width="500px"
                      persistent
                    >
                      <template #default="{ isActive }">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <span>{{ t('dashboard.card3.rollback.title') }}</span>
                          </v-card-title>
                          <v-card-text>
                            <v-alert
                              :text="t('dashboard.card3.rollback.confirm.c1')+i+t('dashboard.card3.rollback.confirm.c2')"
                              type="info"
                              variant="tonal"
                            />
                          </v-card-text>
                          <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn
                              variant="elevated"
                              color="default"
                              @click="isActive.value = false"
                            >
                              {{ t('global.confirm.cancel') }}
                            </v-btn>
                            <v-btn
                              variant="elevated"
                              :loading="confirmBoxVisible.rollback.loading"
                              @click="handleGameExec({type:'console',extra:`c_rollback(${i})`,worldID:baseInfo.worlds[0].id}, isActive)"
                            >
                              {{ t('global.confirm.confirm') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-card>
              <v-card-title>
                {{ t('dashboard.card4.title') }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  />
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                {{ t('dashboard.card5.title') }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-sheet
                      rounded
                      border
                    >
                      <v-data-table
                        :items="baseInfo.worlds"
                        :headers="worldHeaders"
                        hide-default-footer
                      >
                        <template #item.isMaster="{ value }">
                          <v-chip
                            v-if="value"
                            color="info"
                            label
                          >
                            是
                          </v-chip>
                          <v-chip
                            v-else
                            label
                          >
                            否
                          </v-chip>
                        </template>
                        <template #item.cpu="{ item }">
                          <v-chip
                            label
                          >
                            {{ item.performanceStatus.cpu.toFixed(2) }}%
                          </v-chip>
                        </template>
                        <template #item.mem="{ item }">
                          <v-chip
                            label
                          >
                            {{ item.performanceStatus.mem.toFixed(2) }}% ({{ item.performanceStatus.memSize }}MB)
                          </v-chip>
                        </template>
                        <template #item.disk="{ item }">
                          <v-chip
                            label
                          >
                            {{ formatBytes(item.performanceStatus.disk) }}
                          </v-chip>
                        </template>
                        <template #item.status="{ item }">
                          <v-switch
                            v-model="item.status"
                            :loading="worldStatusLoading"
                            color="success"
                            hide-details
                            @change="item.status?handleGameExec({type:'startup',worldID:item.id}):handleGameExec({type:'shutdown',worldID:item.id})"
                          ></v-switch>
                        </template>
                      </v-data-table>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <result
          type="info"
          :title="t('game.base.loading')"
          :height="calculateContainerSize()"
        />
      </template>
    </template>
    <template v-else>
      <result
        :title="t('global.result.title')"
        :sub-title="t('global.result.subTitle')"
        type="error"
        :height="calculateContainerSize()"
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
      :height="calculateContainerSize()"
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
      :height="calculateContainerSize()"
      type="error"
    />
  </template>
</template>

<script setup>
import {debounce, formatBytes, parseModLua, truncateString} from "@/utils/tools.js"
import dashboardApi from "@/api/dashboard.js"
import useGlobalStore from "@store/global.js"
import colors from 'vuetify/lib/util/colors'
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { showSnackbar } from "@/utils/snackbar.js"
import useUserStore from "@store/user.js"

const windowHeight = ref(window.innerHeight)
const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const baseInfo = ref()

const card1Ref = ref()

const card1Width = ref(0)

const getBaseInfo = async () => {
  if (globalStore.room.id === 0) {
    return
  }

  const reqForm = {
    roomID: globalStore.room.id,
  }

  const response = await dashboardApi.info.base.get(reqForm)

  baseInfo.value = response.data
}

const confirmBoxVisible = ref({
  startup: {
    visible: false,
    loading: false,
  },
  shutdown: {
    visible: false,
    loading: false,
  },
  restart: {
    visible: false,
    loading: false,
  },
  clean: {
    visible: false,
    loading: false,
  },
  rollback: {
    visible: false,
    loading: false,
  },
})

const worldHeaders = [
  {title: '名称', value: 'worldName'},
  {title: '主节点', value: 'isMaster'},
  {title: 'CPU', value: 'cpu'},
  {title: '内存', value: 'mem'},
  {title: '磁盘', value: 'disk'},
  {title: '状态', value: 'status'},
]
const worldStatusLoading = ref(false)
const handleGameExec = (params, isActive=false) => {
  const reqForm = {
    type: params.type,
    roomID: globalStore.room.id,
    worldID: params.worldID,
    extra: params.extra,
  }
  worldStatusLoading.value = true
  Object.keys(confirmBoxVisible.value).forEach(key => {
    confirmBoxVisible.value[key].loading = true
  })
  dashboardApi.exec.game.post(reqForm).then(response => {
    showSnackbar(response.message)
    Object.keys(confirmBoxVisible.value).forEach(key => {
      confirmBoxVisible.value[key].visible = false
    })
    isActive.value = false
  }).finally(() => {
    Object.keys(confirmBoxVisible.value).forEach(key => {
      confirmBoxVisible.value[key].loading = false
    })
    worldStatusLoading.value = false
    getBaseInfo()
  })
}

let intervalId = null

const startRequests = () => {
  intervalId = setInterval(() => {
    getBaseInfo()
  }, 10000)
}

const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  if (card1Ref.value) {
    card1Width.value = card1Ref.value.$el.offsetWidth
  }
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const dataGot = ref(false)

onMounted(async () => {
  await Promise.all([getBaseInfo()])
  dataGot.value = true
  handleResize()

  // 添加事件监听
  window.addEventListener('resize', handleResize)
  startRequests()
})

onUnmounted(() => {
  cancelRequests()
  window.removeEventListener('beforeunload', cancelRequests)
  window.removeEventListener('resize', handleResize)
})
</script>

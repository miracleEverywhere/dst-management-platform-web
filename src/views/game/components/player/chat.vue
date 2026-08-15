<template>
  <v-card
    border
    flat
    class="mt-4"
  >
    <v-card-title class="py-4">
      <div class="fcb">
        <div v-if="!mobile">
          {{ t('game.player.chat.title') }}
        </div>
        <div v-if="mobile" />

        <div class="fcc">
          <v-dialog
            v-model="chatDialogVisible"
            class="flex-wrap"
            :width="mobile?'90%':'60%'"
          >
            <template #activator="{ props: activatorProps }">
              <v-btn
                v-if="!mobile"
                class="mr-4"
                color="info"
                v-bind="activatorProps"
                @click="sendMessage=''"
              >
                {{ t('game.player.chat.send.start') }}
              </v-btn>
              <v-btn
                v-if="mobile"
                class="mr-4"
                color="info"
                variant="text"
                icon="ri-send-ins-line"
                v-bind="activatorProps"
                @click="sendMessage=''"
              />
            </template>
            <template #default>
              <v-card>
                <v-row class="ma-2">
                  <v-col cols="12">
                    <v-radio-group
                      v-model="sendMessageType"
                      inline
                    >
                      <template #prepend>
                        <v-chip>
                          {{ t('game.player.chat.send.sendMessageType') }}
                        </v-chip>
                      </template>
                      <v-radio
                        :label="t('game.player.chat.send.announce')"
                        value="announce"
                      />
                      <v-radio
                        :label="t('game.player.chat.send.systemMsg')"
                        value="systemMsg"
                      />
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="sendMessage"
                      @keyup.enter="handleSendMessage"
                    >
                      <template #append>
                        <v-btn
                          icon="ri-send-ins-line"
                          variant="text"
                          @click="handleSendMessage"
                        />
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </template>
          </v-dialog>

          <v-number-input
            v-model="lines"
            :label="t('game.player.chat.lines')"
            density="compact"
            width="120"
            hide-details
            :min="1"
            :loading="loading"
            class="mr-4"
          />
          <v-select
            v-if="!mobile"
            v-model="selectedTypes"
            :items="allTypes"
            density="compact"
            :label="t('game.player.chat.typeSelect')"
            multiple
            clearable
            :width="globalStore.language==='zh'?240:280"
            class="mr-4"
            @update:menu="getChatMessages"
          >
            <template #selection="{ item, index }">
              <v-chip
                v-if="index < 1"
                label
                :text="item.title"
              />
              <v-chip
                v-if="index === 1"
                label
              >
                <span v-tooltip="selectedTypes.slice(1).map(key => allTypes.find(i => i.value === key)?.title || key).join(', ')">
                  +{{ selectedTypes.length - 1 }}
                </span>
              </v-chip>
            </template>
          </v-select>
          <v-chip
            v-if="!mobile"
            v-tooltip="t('game.player.chat.needTime.tip')"
            label
            size="large"
            class="mr-4"
          >
            <span class="mr-2">
              {{ t('game.player.chat.needTime.text') }}
            </span>
            <v-switch
              v-model="needTime"
              hide-details
              color="info"
              :loading="loading"
              @update:model-value="getChatMessages(false)"
            />
          </v-chip>
          <v-chip
            v-if="!mobile"
            v-tooltip="t('game.player.chat.autoPullTip')"
            label
            size="large"
            class="mr-4"
          >
            <span class="mr-2">
              {{ t('game.player.chat.autoPull') }}
            </span>
            <v-switch
              v-model="autoPull"
              hide-details
              color="info"
            />
          </v-chip>
          <v-switch
            v-if="mobile"
            v-model="needTime"
            v-tooltip="t('game.player.chat.needTime.tip')"
            hide-details
            color="info"
            :loading="loading"
            class="mr-4"
            @update:model-value="getChatMessages(false)"
          />
          <v-btn
            color="x"
            :loading="loading"
            @click="getChatMessages(false)"
          >
            {{ t('game.player.chat.refresh') }}
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <v-data-table
      v-if="chatMessages.length"
      :headers="headers"
      :items="chatMessages"
    >
      <template #item.uid="{ value }">
        <v-chip
          v-show="value!==''"
          label
        >
          {{ value }}
        </v-chip>
      </template>

      <template #item.nickname="{ value }">
        <v-chip
          label
          color="info"
          class="mr-2"
        >
          {{ value }}
        </v-chip>
      </template>

      <template #item.type="{ value }">
        <div class="d-flex align-center justify-start text-left">
          <v-img
            :src="getImage(value)"
            contain
            max-width="40"
            height="40"
            class="flex-shrink-0"
          />
          <v-chip class="ml-2">
            {{ t(`game.player.chat.type.${value}`) }}
          </v-chip>
        </div>
      </template>

      <template #item.time="{ value }">
        <v-chip label>
          {{ timestamp2time(value*1000) }}
        </v-chip>
      </template>

      <template #item.message="{ item }">
        <v-chip
          v-if="item.type==='VoteAnnouncement'"
          label
          color="success"
        >
          {{ t(`game.player.chat.type['${item.message}']`) }}
        </v-chip>
        <v-chip
          v-else-if="item.type==='SkinAnnouncement'"
          label
          color="success"
        >
          <template #append>
            <v-btn
              v-tooltip="t(`game.player.chat.gotoWiki`)"
              icon="ri-question-line"
              color="success"
              density="compact"
              variant="text"
              :href="generateSkinUrl(item.message)"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-2"
            />
          </template>
          {{ item.message }}
        </v-chip>
        <v-chip
          v-else
          label
          color="success"
        >
          <v-tooltip
            v-if="mobile"
            activator="parent"
            location="top"
          >
            {{ item.message }}
          </v-tooltip>
          {{ item.message }}
        </v-chip>
      </template>
    </v-data-table>
    
    <v-card-text v-else>
      <result
        :height="props.height - 70"
        type="info"
        :title="t('game.player.chat.noMessage')"
      >
        <v-btn
          color="info"
          @click="getChatMessages"
        >
          {{ t('game.player.chat.clickRefresh') }}
        </v-btn>
      </result>
    </v-card-text>
  </v-card>
</template>

<script setup>
import playerApi from "@/api/player"
import useGlobalStore from "@store/global"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import Result from "@/components/Result.vue"
import { timestamp2time } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"
import dashboardApi from "@/api/dashboard.js"


const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
})

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const chatMessages = ref([])
const lines = ref(20)
const needTime = ref(false)
const chatContainer = ref()
const loading = ref(false)

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value && chatContainer.value.$el) {
      chatContainer.value.$el.scrollTo({
        top: chatContainer.value.$el.scrollHeight,
        behavior: 'smooth',
      })
    } else if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 100)
}

watch(chatMessages, newVal => {
  if (newVal && newVal.length > 0) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}, { deep: true })

const getChatMessages = (isOpen=false) => {
  if (isOpen) return
  loading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    lines: lines.value,
    needTime: needTime.value,
  }

  playerApi.chat.get(reqForm).then(response => {
    const messages = response.data || []

    chatMessages.value = []
    if (selectedTypes.value.length === 0) {
      selectedTypes.value = types
    }
    for (const m of messages) {
      if (selectedTypes.value.includes(m.type)) {
        chatMessages.value.push(m)
      }
    }
  }).finally(() => {
    loading.value = false
  })
}

const generateSkinUrl = name => {
  if (!name) return name
  const wikiName = name.charAt(0).toUpperCase() + name.slice(1)

  return `https://dontstarve.huijiwiki.com/wiki/文件:${wikiName}_icon.png`
}

const allHeaders = [
  { key: 'uid', title: t('game.player.online.header.uid'), align: 'start' },
  { key: 'nickname', title: t('game.player.online.header.nickname'), align: 'start' },
  { key: 'type', title: t('game.player.chat.typeSelect'), align: 'start' },
  { key: 'time', title: t('game.player.chat.needTime.text'), align: 'start' },
  { key: 'message', title: t('game.player.chat.title'), align: 'start' },
]

// 2. 使用 computed 根据 needTime 动态过滤表头
const headers = computed(() => {
  return allHeaders.filter(header => {
    // 如果是 time 列，根据 needTime 的布尔值决定是否保留
    if (header.key === 'time') {
      return needTime.value // 如果是 Vue 2，直接写 this.needTime
    }

    return true
  })
})

const types = [
  'Announcement',
  'BanAnnouncement',
  'DeathAnnouncement',
  'JoinAnnouncement',
  'KickAnnouncement',
  'LeaveAnnouncement',
  'ResurrectAnnouncement',
  'RollAnnouncement',
  'Say',
  'SkinAnnouncement',
  'SystemMessage',
  'VoteAnnouncement',
]

const getImage = type => {
  let name = 'Undefined'
  if (types.includes(type)) {
    name = type
  }

  return new URL(`./images/${name}.png`, import.meta.url).href
}

const selectedTypes = ref([])
const allTypes = ref([])

const chatDialogVisible = ref(false)
const sendMessage = ref('')
const sendMessageType = ref('announce')

const handleSendMessage = () => {
  if (sendMessage.value.length === 0) {
    return
  }

  const reqForm = {
    type: sendMessageType.value,
    roomID: globalStore.room.id,
    extra: sendMessage.value,
  }

  dashboardApi.exec.game.post(reqForm).then(response => {
    showSnackbar(response.message)
    chatDialogVisible.value = false
  }).finally(() => {
    getChatMessages()
  })
}

let intervalId = null
const autoPull = ref(true)

const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value) {
      getChatMessages()
    }
  }, 5000)
}

const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  for (const i of types) {
    allTypes.value.push({
      title: t(`game.player.chat.type.${i}`),
      value: i,
    })
  }
  selectedTypes.value = types
  getChatMessages()
  startRequests()
})

onBeforeUnmount(() => {
  cancelRequests()
  window.removeEventListener('beforeunload', cancelRequests)
})
</script>

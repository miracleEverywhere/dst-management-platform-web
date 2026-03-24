<template>
  <v-card
    class="mt-4"
    :height="props.height-70"
  >
    <v-card-title>
      <div class="fcb">
        <span>日志</span>
        <div class="fcc">
          <v-number-input
            v-model="lines"
            label="条数"
            density="compact"
            min-width="100"
            hide-details
            :min="1"
            class="mr-2"
          />
          <v-chip
            label
            size="large"
            class="mr-2"
          >
            <span  class="mr-2">
              时间预测
            </span>
            <v-switch
              v-model="needTime"
              hide-details
              color="info"
              @update:model-value="getChatMessages"
            />
          </v-chip>
          <v-btn
            color="x"
            @click="getChatMessages"
          >
            刷新
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <v-card-text
      v-if="chatMessages.length"
      class="overflow-y-auto"
      :style="{ height: `${props.height - 100}px` }"
    >
      <v-list lines="two">
        <v-list-item
          v-for="(p, i) in chatMessages"
          :key="i"
          variant="outlined"
          rounded
          class="mb-2"
        >
          <v-row>
            <v-col>
              <v-img
                :src="getImageUrl(p.type)"
                fit="fill"
                style="width: 75px; height: 75px"
              />

            </v-col>
            <v-col>
              {{p.nickname}}
            </v-col>
            <v-col>
              {{p.message}}
            </v-col>
            <v-col v-if="needTime">
              {{timestamp2time(p.time*1000)}}
            </v-col>
            <v-col>
              {{generateSkinUrl(p.message)}}
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text v-else>
      <result
        :height="props.height - 70"
        type="info"
        title="没有聊天记录"
      >
        <v-btn
          color="info"
          @click="getChatMessages"
        >
          点我刷新
        </v-btn>
      </result>
    </v-card-text>

  </v-card>
</template>

<script setup>
import playerApi from "@/api/player"
import useGlobalStore from "@/plugins/store/global";
import {useDisplay} from "vuetify/framework";
import {useI18n} from "vue-i18n";
import Result from "@/components/Result.vue";
import {timestamp2time} from "@/utils/tools.js";


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

const getChatMessages = () => {
  const reqForm = {
    roomID: globalStore.room.id,
    lines: lines.value,
    needTime: needTime.value,
  }
  playerApi.chat.get(reqForm).then(response => {
    chatMessages.value = response.data || []
  })
}

const generateSkinUrl = name => {
  if (!name) return name;
  const wikiName = name.charAt(0).toUpperCase() + name.slice(1)

  return `https://dontstarve.huijiwiki.com/wiki/文件:${wikiName}_icon.png`
}

const getImageUrl = type => {
  const types = [
    'Announcement',
    'DeathAnnouncement',
    'JoinAnnouncement',
    'ResurrectAnnouncement',
    'RollAnnouncement',
    'Say',
    'SkinAnnouncement',
    'SystemMessage',
    'VoteAnnouncement'
  ]
  let name = 'Undefined'
  if (types.includes(type)) {
    name = type
  }

  return new URL(`./images/${name}.png`, import.meta.url).href
}

onMounted(() => {
  getChatMessages()
})
</script>

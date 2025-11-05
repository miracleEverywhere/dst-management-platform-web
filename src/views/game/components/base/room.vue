<template>
  <v-form ref="roomFormRef">
    <!-- 游戏名 -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.gameName"
          v-tooltip="t('game.base.step1.gameName.tip')"
          :rules="roomFormRules.gameName"
          :label="t('game.base.step1.gameName.name')"
        />
      </v-col>
    </v-row>
    <!-- 描述 -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.description"
          v-tooltip="t('game.base.step1.description.tip')"
          :label="t('game.base.step1.description.name')"
        />
      </v-col>
    </v-row>
    <!-- 游戏模式 -->
    <v-row>
      <v-col>
        <v-radio-group
          v-model="roomForm.gameMode"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.gameMode.tip')">
              {{ t('game.base.step1.gameMode.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.gameMode.modes.endless')"
            value="endless"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.survival')"
            value="survival"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.relaxed')"
            value="relaxed"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.wilderness')"
            value="wilderness"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.lightsOut')"
            value="lightsOut"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.lavaarena')"
            value="lavaarena"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.quagmire')"
            value="quagmire"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.custom')"
            value="custom"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <!-- 玩家数 -->
    <v-row>
      <v-col>
        <v-slider
          v-model="roomForm.maxPlayer"
          :max="64"
          :min="1"
          class="align-center"
          hide-details
          step="1"
          style="margin-left: -1px"
        >
          <template #label>
            <v-chip
              v-tooltip="t('game.base.step1.maxPlayer.tip')"
              style="margin-right: 1rem"
            >
              {{ t('game.base.step1.maxPlayer.name') }}
            </v-chip>
          </template>
          <template #append>
            <v-chip
              label
              color="primary"
            >
              {{ roomForm.maxPlayer }}
            </v-chip>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <!-- pvp等 -->
    <v-row>
      <v-col :cols="mobile?12:4">
        <v-radio-group
          v-model="roomForm.pvp"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.pvp.tip')">
              {{ t('game.base.step1.pvp.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.pvp.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.pvp.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
      <v-col :cols="mobile?12:4">
        <v-radio-group
          v-model="roomForm.vote"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.vote.tip')">
              {{ t('game.base.step1.vote.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.vote.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.vote.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
      <v-col :cols="mobile?12:4">
        <v-radio-group
          v-model="roomForm.pauseEmpty"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.pauseEmpty.tip')">
              {{ t('game.base.step1.pauseEmpty.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.pauseEmpty.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.pauseEmpty.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <!-- 回档天数 -->
    <v-row>
      <v-col>
        <v-slider
          v-model="roomForm.maxRollBack"
          :max="64"
          :min="1"
          class="align-center"
          hide-details
          step="1"
          style="margin-left: -1px"
        >
          <template #label>
            <v-chip
              v-tooltip="t('game.base.step1.maxRollBack.tip')"
              style="margin-right: 1rem"
            >
              {{ t('game.base.step1.maxRollBack.name') }}
            </v-chip>
          </template>
          <template #append>
            <v-chip
              label
              color="primary"
            >
              {{ roomForm.maxRollBack }}
            </v-chip>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <!-- 密码 -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.password"
          v-tooltip="t('game.base.step1.password.tip')"
          :label="t('game.base.step1.password.name')"
          :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
      </v-col>
    </v-row>
    <!-- 令牌 -->
    <v-row>
      <v-col class="fcc">
        <v-text-field
          v-model="roomForm.token"
          v-tooltip="t('game.base.step1.token.tip')"
          :rules="roomFormRules.token"
          :label="t('game.base.step1.token.name')"
          :append-inner-icon="isTokenVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          :type="isTokenVisible ? 'text' : 'password'"
          class="w-100"
          @click:append-inner="isTokenVisible = !isTokenVisible"
        />
        <v-btn
          v-if="!mobile"
          density="comfortable"
          variant="text"
          class="ml-4"
          color="success"
          prepend-icon="ri-add-line"
          @click="handleAddToken"
        >
          {{ t('game.base.step1.token.buttonAdd') }}
        </v-btn>
        <v-btn
          v-if="!mobile"
          density="comfortable"
          variant="text"
          class="ml-4"
          color="info"
          href="https://accounts.klei.com"
          target="_blank"
          prepend-icon="ri-links-line"
        >
          {{ t('game.base.step1.token.buttonUrl') }}
        </v-btn>
      </v-col>
    </v-row>
    <!-- master ip -->
    <v-row>
      <v-col
        :cols="mobile?12:9"
        :style="mobile?{marginBottom:'1.25rem'}:{}"
      >
        <v-text-field
          v-model="roomForm.masterIP"
          v-tooltip="t('game.base.step1.masterIP.tip')"
          :rules="roomFormRules.masterIP"
          :label="t('game.base.step1.masterIP.name')"
        />
      </v-col>
      <v-col :cols="mobile?12:3">
        <v-number-input
          v-model="roomForm.masterPort"
          v-tooltip="t('game.base.step1.masterPort.tip')"
          :rules="roomFormRules.masterPort"
          :label="t('game.base.step1.masterPort.name')"
          :min="1"
          :max="65535"
          style="margin-bottom: -1.25rem"
        />
      </v-col>
    </v-row>
    <!-- cluster key -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.clusterKey"
          v-tooltip="t('game.base.step1.clusterKey.tip')"
          :rules="roomFormRules.clusterKey"
          :label="t('game.base.step1.clusterKey.name')"
          :append-inner-icon="isClusterKeyVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          :type="isClusterKeyVisible ? 'text' : 'password'"
          @click:append-inner="isClusterKeyVisible = !isClusterKeyVisible"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { GamePortFactor } from "@/config/index.js"
import { generateRandomString, getDstToken } from "@/utils/tools.js"

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({}),
  },
  roomCount: {
    type: Number,
    default: 0,
  },
})

const { mobile } = useDisplay()
const { t } = useI18n()

onMounted(() => {
  if ((props.formData?.id||0) !== 0) {
    roomForm.value = props.formData
  } else {
    roomForm.value.masterPort = props.roomCount + GamePortFactor.masterPort + 1
    roomForm.value.gameMode = 'endless'
    roomForm.value.clusterKey = generateRandomString(14)
    roomForm.value.modInOne = true
  }
})

const roomFormRef = ref()

const roomForm = ref({
  id: 0,
  gameName: '',
  description: '',
  gameMode: '',
  customGameMode: '',
  pvp: false,
  maxPlayer: 6,
  maxRollBack: 10,
  modInOne: false,
  modData: '',
  vote: false,
  pauseEmpty: true,
  password: '',
  token: '',
  masterIP: '127.0.0.1',
  masterPort: 0,
  clusterKey: '',
})

const roomFormRules = ref({
  gameName: [
    value => {
      if (value) return true

      return t('game.base.step1.gameName.required')
    },
  ],
  token: [
    value => {
      if (value) return true

      return t('game.base.step1.token.required')
    },
  ],
  masterIP: [
    value => {
      if (value) return true

      return t('game.base.step1.masterIP.required')
    },
  ],
  masterPort: [
    value => {
      if (value) return true

      return t('game.base.step1.masterPort.required')
    },
  ],
  clusterKey: [
    value => {
      if (value) return true

      return t('game.base.step1.clusterKey.required')
    },
  ],
})

const isPasswordVisible = ref(false)
const isTokenVisible = ref(false)
const isClusterKeyVisible = ref(false)

const handleAddToken = () => {
  roomForm.value.token = getDstToken()
}

const validate = async () => {
  const { valid } = await roomFormRef.value.validate()
  if (valid) {
    return {
      validate: true,
      formData: roomForm.value,
    }
  }
  
  return {
    validate: false,
    formData: {},
  }
}

defineExpose({
  validate,
})
</script>

<style scoped>
.layout-wrapper .v-row {
  margin-bottom: 1.25rem;
}
</style>


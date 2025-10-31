<template>
  <v-form ref="roomFormRef">
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.gameName"
          v-tooltip="t('game.base.gameName.tip')"
          :rules="roomFormRules.gameName"
          :label="t('game.base.gameName.name')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.description"
          v-tooltip="t('game.base.description.tip')"
          :label="t('game.base.description.name')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group
          v-model="roomForm.gameMode"
          inline
        >
          <template #prepend>
            <span v-tooltip="t('game.base.gameMode.tip')">
              游戏模式
            </span>
          </template>
          <v-radio
            :label="t('game.base.gameMode.modes.endless')"
            value="endless"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.gameMode.modes.survival')"
            value="survival"
            class="mr-4"
          />
          <v-radio
              :label="t('game.base.gameMode.modes.relaxed')"
              value="relaxed"
              class="mr-4"
          />
          <v-radio
              :label="t('game.base.gameMode.modes.wilderness')"
              value="wilderness"
              class="mr-4"
          />
          <v-radio
              :label="t('game.base.gameMode.modes.lightsOut')"
              value="lightsOut"
              class="mr-4"
          />
          <v-radio
              :label="t('game.base.gameMode.modes.lavaarena')"
            value="lavaarena"
            class="mr-4"
          />
          <v-radio
              :label="t('game.base.gameMode.modes.quagmire')"
            value="quagmire"
            class="mr-4"
          />
          <v-radio
              :label="t('game.base.gameMode.modes.custom')"
              value="custom"
              class="mr-4"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-slider v-model="roomForm.maxPlayer" :max="64" :min="1" class="align-center" hide-details
                  step="1" style="margin-left: -1px">
          <template #label>
            <span v-tooltip="t('game.base.maxPlayer.tip')" style="margin-right: 1rem">{{t('game.base.maxPlayer.name')}}</span>
          </template>
          <template v-slot:append>
            <v-chip label color="primary">
              {{ roomForm.maxPlayer }}
            </v-chip>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="mobile?12:4">
        <v-radio-group
          v-model="roomForm.pvp"
          inline
        >
          <template #prepend>
            <span v-tooltip="t('game.base.pvp.tip')">
              {{t('game.base.pvp.name')}}
            </span>
          </template>
          <v-radio
            :label="t('game.base.pvp.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
              :label="t('game.base.pvp.disable')"
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
            <span v-tooltip="t('game.base.vote.tip')">
              {{t('game.base.vote.name')}}
            </span>
          </template>
          <v-radio
              :label="t('game.base.vote.enable')"
              :value="true"
              class="mr-4"
          />
          <v-radio
              :label="t('game.base.vote.disable')"
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
            <span v-tooltip="t('game.base.pauseEmpty.tip')">
              {{t('game.base.pauseEmpty.name')}}
            </span>
          </template>
          <v-radio
              :label="t('game.base.pauseEmpty.enable')"
              :value="true"
              class="mr-4"
          />
          <v-radio
              :label="t('game.base.pauseEmpty.disable')"
              :value="false"
              class="mr-4"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-slider v-model="roomForm.maxRollBack" :max="64" :min="1" class="align-center" hide-details
                  step="1" style="margin-left: -1px">
          <template #label>
            <span v-tooltip="t('game.base.maxRollBack.tip')" style="margin-right: 1rem">{{t('game.base.maxRollBack.name')}}</span>
          </template>
          <template v-slot:append>
            <v-chip label color="primary">
              {{ roomForm.maxRollBack }}
            </v-chip>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="roomForm.password"
            v-tooltip="t('game.base.password.tip')"
            :label="t('game.base.password.name')"
            :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
            :type="isPasswordVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="fcc">
        <v-text-field
            v-model="roomForm.token"
            v-tooltip="t('game.base.token.tip')"
            :rules="roomFormRules.token"
            :label="t('game.base.token.name')"
            :append-inner-icon="isTokenVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
            :type="isTokenVisible ? 'text' : 'password'"
            class="w-100"
            @click:append-inner="isTokenVisible = !isTokenVisible"
        />
        <v-btn v-if="!mobile" density="comfortable" variant="text" size="x-large" class="ml-4"
               color="info"
               prepend-icon="ri-links-line">
          {{t('game.base.token.buttonUrl')}}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="mobile?12:9" :style="mobile?{marginBottom:'1.25rem'}:{}">
        <v-text-field
            v-model="roomForm.masterIP"
            v-tooltip="t('game.base.masterIP.tip')"
            :rules="roomFormRules.masterIP"
            :label="t('game.base.masterIP.name')"
        />
      </v-col>
      <v-col :cols="mobile?12:3">
        <v-number-input
            v-model="roomForm.masterPort"
            v-tooltip="t('game.base.masterPort.tip')"
            :rules="roomFormRules.masterPort"
            :label="t('game.base.masterPort.name')"
            :min="1"
            :max="65535"
            style="margin-bottom: -1.25rem"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="roomForm.clusterKey"
            v-tooltip="t('game.base.clusterKey.tip')"
            :rules="roomFormRules.clusterKey"
            :label="t('game.base.clusterKey.name')"
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
import {GamePortFactor} from "@/config/index.js";

const { mobile } = useDisplay()
const { t } = useI18n()

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  },
  lastRoomID: {
    type: Number,
    default: 0,
  },
})

onMounted(() => {
  if ((props.formData?.id||0) !== 0) {
    roomForm.value = props.formData
  } else {
    roomForm.value.masterPort = props.lastRoomID + GamePortFactor.masterPort + 1
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

      return t('game.base.gameName.required')
    },
  ],
  token: [
    value => {
      if (value) return true

      return t('game.base.token.required')
    },
  ],
  masterIP: [
    value => {
      if (value) return true

      return t('game.base.masterIP.required')
    },
  ],
  masterPort: [
    value => {
      if (value) return true

      return t('game.base.masterPort.required')
    },
  ],
  clusterKey: [
    value => {
      if (value) return true

      return t('game.base.clusterKey.required')
    },
  ],
})

const isPasswordVisible = ref(false)
const isTokenVisible = ref(false)
const isClusterKeyVisible = ref(false)
</script>

<style scoped>
.layout-wrapper .v-row {
  margin-bottom: 1.25rem;
}
</style>


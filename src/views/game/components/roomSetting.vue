<template>
  <v-form ref="roomFormRef">
    <v-row>
      <v-col>
        <v-text-field v-model="roomForm.gameName" v-tooltip="t('game.base.gameName.tip')"
                      :rules="roomFormRules.gameName" :label="t('game.base.gameName.name')">
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="roomForm.description" v-tooltip="t('game.base.description.tip')"
                      :label="t('game.base.description.name')">
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group v-model="roomForm.gameMode" inline>
          <template #prepend>
                      <span>
                        游戏模式
                      </span>
          </template>
          <v-radio label="无尽" value="endless" class="mr-4"></v-radio>
          <v-radio label="生存" value="survival" class="mr-4"></v-radio>
          <v-radio label="熔炉" value="lavaarena" class="mr-4"></v-radio>
          <v-radio label="暴食" value="quagmire" class="mr-4"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="mobile?12:6">
        <v-radio-group v-model="roomForm.pvp" inline>
          <template #prepend>
                  <span>
                    玩家对战
                  </span>
          </template>
          <v-radio label="开启" :value="true" class="mr-4"></v-radio>
          <v-radio label="关闭" :value="false" class="mr-4"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col :cols="mobile?12:6">
        <v-radio-group v-model="roomForm.vote" inline>
          <template #prepend>
                  <span>
                    玩家对战
                  </span>
          </template>
          <v-radio label="开启" :value="true" class="mr-4"></v-radio>
          <v-radio label="关闭" :value="false" class="mr-4"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="mobile?12:6">
        <v-radio-group v-model="roomForm.pauseEmpty" inline>
          <template #prepend>
                  <span>
                    玩家对战
                  </span>
          </template>
          <v-radio label="开启" :value="true" class="mr-4"></v-radio>
          <v-radio label="关闭" :value="false" class="mr-4"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col :cols="mobile?12:6">
        <v-radio-group v-model="roomForm.modInOne" inline>
          <template #prepend>
                  <span>
                    玩家对战
                  </span>
          </template>
          <v-radio label="开启" :value="true" class="mr-4"></v-radio>
          <v-radio label="关闭" :value="false" class="mr-4"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import {useDisplay} from "vuetify/framework";
import {useI18n} from "vue-i18n";

const { mobile } = useDisplay()
const { t } = useI18n()

const roomFormRef = ref()
const roomForm = ref({
  gameName: '',
  description: '',
  gameMode: '',
  customGameMode: '',
  pvp: false,
  maxPlayer: 0,
  maxRollBack: 0,
  modInOne: false,
  modData: '',
  vote: false,
  pauseEmpty: false,
  password: '',
  token: '',
  masterIP: '',
  masterPort: '',
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
</script>

<style scoped>
</style>
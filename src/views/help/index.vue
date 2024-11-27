<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <div style="margin: 10px">
            <el-collapse v-model="activeName" accordion @change="collapseChange">
              <el-collapse-item name="1">
                <template #title>
                  <span style="font-weight: bolder; font-size: 16px">{{ t('help.one.title') }}</span>
                </template>
                <div style="line-height: 50px;">
                  {{ t('help.one.text1') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.one.text2') }}
                </div>
                <div class="tip custom-block">
                  <p class="custom-block-title">{{ t('help.one.text3') }}</p>
                </div>
                <el-image :hide-on-click-modal="true" :initial-index="4" :max-scale="7" :min-scale="0.2"
                          :preview-src-list="[image1]"
                          :src="image1"
                          :zoom-rate="1.2" fit="cover" style="margin-top: 10px; margin-bottom: 10px"></el-image>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title>
                  <span style="font-weight: bolder; font-size: 16px">{{ t('help.two.title') }}</span>
                </template>
                <div class="tip custom-block">
                  <p class="custom-block-title">{{ t('help.two.text2') }}</p>
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.two.text1') }}
                  <code>{{ t('help.two.text1_1') }}</code>
                  {{ t('help.two.text1_2') }}
                  <code>{{ t('help.two.text1_3') }}</code>
                  {{ t('help.two.text1_4') }}
                </div>
                <sc-code-editor ref="twoCodeRef" v-model="twoCode" :height="isMobile?200:200" :read-only="true" :theme="isDark?'darcula':'idea'"
                                mode="shell"></sc-code-editor>
                <div style="line-height: 50px;">
                  {{ t('help.two.text3') }}
                </div>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template #title>
                  <span style="font-weight: bolder; font-size: 16px">{{ t('help.three.title') }}</span>
                </template>
                <div style="line-height: 50px;">
                  {{ t('help.three.text1') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.three.text2') }}
                </div>
                <sc-code-editor ref="threeCodeOneRef" v-model="threeCodeOne" :height="isMobile?320:500" :read-only="true"
                                :theme="isDark?'darcula':'idea'"
                                mode="lua" style="width: 95%"></sc-code-editor>
                <div style="line-height: 50px;">
                  {{ t('help.three.text3') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.three.text4') }}
                </div>
                <sc-code-editor ref="threeCodeTwoRef" v-model="threeCodeTwo" :height="isMobile?320:500" :read-only="true"
                                :theme="isDark?'darcula':'idea'"
                                mode="lua" style="width: 95%"></sc-code-editor>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template #title>
                  <span style="font-weight: bolder; font-size: 16px">{{ t('help.four.title') }}</span>
                </template>
                <div style="line-height: 50px;">
                  {{ t('help.four.text1') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.four.text2') }}
                  <el-button size="small" @click="handleDownloadLog" :loading="downloadLogLoading">
                    {{ t('help.four.button') }}
                  </el-button>
                  {{ t('help.four.text3') }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="help" setup>
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {computed, nextTick, ref} from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import logsApi from "@/api/logs"
import {saveFile} from "@/utils/tools.js";

const {t} = useI18n()
const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const activeName = ref('0')

const image1 = new URL('./images/1.png', import.meta.url).href

const twoCodeRef = ref()
const twoCode = ref('# 备份\ncd ~\nmv dst/bin/lib32/steamclient.so dst/bin/lib32/steamclient.so.bak\nmv dst/steamclient.so dst/steamclient.so.bak\n# 替换\ncp steamcmd/linux32/steamclient.so dst/bin/lib32/steamclient.so\ncp steamcmd/linux32/steamclient.so dst/steamclient.so\n')
const threeCodeOneRef = ref()
const threeCodeOne = ref(`return {
  background_node_range={ 0, 1 },
  desc="你敢去熔炉里证明你自己的实力吗？",
  hideminimap=false,
  id="LAVAARENA",
  location="lavaarena",
  max_playlist_position=999,
  min_playlist_position=0,
  name="熔炉",
  numrandom_set_pieces=0,
  override_level_string=false,
  overrides={
    autumn="default",
    basicresource_regrowth="none",
    beefaloheat="default",
    boons="never",
    brightmarecreatures="default",
    crow_carnival="default",
    darkness="default",
    day="default",
    dropeverythingondespawn="default",
    extrastartingitems="default",
    ghostenabled="always",
    ghostsanitydrain="always",
    hallowed_nights="default",
    healthpenalty="always",
    hunger="default",
    keep_disconnected_tiles=true,
    krampus="default",
    layout_mode="RestrictNodesByKey",
    lessdamagetaken="none",
    no_joining_islands=true,
    no_wormholes_to_disconnected_tiles=true,
    poi="never",
    portalresurection="none",
    protected="never",
    resettime="default",
    roads="never",
    season_start="default",
    seasonalstartingitems="default",
    shadowcreatures="default",
    spawnmode="fixed",
    spawnprotection="default",
    specialevent="default",
    spring="default",
    start_location="lavaarena",
    summer="default",
    task_set="lavaarena_taskset",
    temperaturedamage="default",
    touchstone="never",
    traps="never",
    winter="default",
    winters_feast="default",
    world_size="small",
    year_of_the_beefalo="default",
    year_of_the_bunnyman="default",
    year_of_the_carrat="default",
    year_of_the_catcoon="default",
    year_of_the_dragonfly="default",
    year_of_the_gobbler="default",
    year_of_the_pig="default",
    year_of_the_varg="default"
  },
  required_prefabs={ "lavaarena_portal" },
  settings_desc="你敢去熔炉里证明你自己的实力吗？",
  settings_id="LAVAARENA",
  settings_name="熔炉",
  substitutes={  },
  version=2,
  worldgen_desc="你敢去熔炉里证明你自己的实力吗？",
  worldgen_id="LAVAARENA",
  worldgen_name="熔炉"
}`)
const threeCodeTwoRef = ref()
const threeCodeTwo = ref(`return {
  ["workshop-1938752683"]={
    configuration_options={
      ADJUST_FILTER=false,
      BATTLESTANDARD_EFFICIENCY=1,
      COMMAND_SPAM_BAN_TIME=10,
      DAMAGE_NUMBER_FONT_SIZE=32,
      DAMAGE_NUMBER_HEIGHT=40,
      DAMAGE_NUMBER_OPTIONS="default",
      DAMAGE_NUMBER_PLAYERS=false,
      DEBUG=false,
      DEFAULT_FILTER=1,
      DEFAULT_LOBBY_TAB="news",
      DEFAULT_ROTATION=false,
      DIFFICULTY="normal",
      DISPLAY_COLORED_STATS=true,
      DISPLAY_TARGET_BADGE=true,
      DISPLAY_TEAMMATES_DEBUFFS=false,
      ["Damage Number Options"]=0,
      ["Detailed Summary Options"]=0,
      EVENT_TRACKING=true,
      FORCE_START_DELAY_TIME=5,
      FRIENDLY_FIRE=false,
      GAMETYPE="forge",
      GIFT_SIDE="right",
      ["Gameplay Settings"]=0,
      HIDE_INDICATORS=true,
      JOINABLE_MIDMATCH=true,
      LOBBY_GEAR=true,
      ["Lobby Options"]=0,
      MAX_MESSAGES=100,
      MOB_ATTACK_RATE=1,
      MOB_DAMAGE_DEALT=1,
      MOB_DAMAGE_TAKEN=1,
      MOB_DUPLICATOR=1,
      MOB_HEALTH=1,
      MOB_SIZE=1,
      MOB_SPEED=1,
      MODE="reforged",
      Mutators=0,
      NO_HUD=false,
      NO_REVIVES=false,
      NO_SLEEP=false,
      ONLY_SHOW_NONZERO_STATS=true,
      Other=0,
      PING_KEYBIND="KEY_R",
      PING_TRANSPARENCY=100,
      PLAYER_DEBUFF_DISPLAY="mini",
      ["Player HUD Options"]=0,
      RESERVE_SLOTS=true,
      ROTATION=0,
      SANDBOX=false,
      SERVER_ACHIEVEMENTS=false,
      SERVER_LEVEL=false,
      SHOW_CHAT_ICON=false,
      SPECTATORS_ONLY=true,
      SPECTATOR_ON_DEATH=false,
      VOTE_FORCE_START=true,
      VOTE_GAME_SETTINGS=true,
      VOTE_KICK=true,
      ["Visual Options"]=0,
      Vote=0,
      WAVESET="swineclops"
    },
    enabled=true
  },
  ["workshop-2038128735"]={ configuration_options={ klaustrophobia=false }, enabled=true },
  ["workshop-2619860122"]={ configuration_options={  }, enabled=true },
  ["workshop-2633870801"]={
    configuration_options={
      ["Gameplay Settings"]=0,
      MAP="none",
      ["Other Settings"]=0,
      WAVESET="none",
      light_color_override=false
    },
    enabled=true
  },
  ["workshop-2961923603"]={ configuration_options={  }, enabled=true },
  ["workshop-3132633883"]={ configuration_options={  }, enabled=true },
  ["workshop-3139080374"]={
    configuration_options={
      Brainwash_Fix=true,
      Lock_Recipes=true,
      Manually_Rapid_Atk=true,
      Random_Character_Fix=true,
      Rhinocebro_Fix=false,
      Spike_Fix=true,
      Tenfold_Optimize=true,
      force_camera=true,
      worly_cookpot=false
    },
    enabled=true
  },
  ["workshop-666155465"]={
    configuration_options={
      chestB=-1,
      chestG=-1,
      chestR=-1,
      display_hp=-1,
      food_estimation=-1,
      food_order=0,
      food_style=0,
      lang="auto",
      show_food_units=-1,
      show_uses=-1
    },
    enabled=true
  }
}`)

const collapseChange = () => {
  if (activeName.value === '2') {
    nextTick(() => {
      twoCodeRef.value.refresh()
    })
  } else if (activeName.value === '3') {
    nextTick(() => {
      threeCodeOneRef.value.refresh()
      threeCodeTwoRef.value.refresh()
    })
  }
}

const downloadLogLoading = ref(false)
const handleDownloadLog = () => {
  downloadLogLoading.value = true
  logsApi.processLog.post().then(async (response) => {
    await saveFile(response.data, 'logs.tgz')
  }).finally(() => {
    downloadLogLoading.value = false
  })
}
</script>

<style scoped>

</style>

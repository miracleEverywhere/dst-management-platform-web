<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card :style="isMobile?'min-height: 500px':'min-height: 700px'" shadow="never">
          <div style="margin: 10px">
            <el-collapse v-model="activeName" accordion @change="collapseChange">
              <el-collapse-item name="1">
                <template #title>
                  <span style="font-weight: bolder; font-size: 12px">{{t('help.one.title')}}</span>
                </template>
                <div>
                  {{t('help.one.text1')}}
                </div>
                <div>
                  {{t('help.one.text2')}}
                </div>
                <div>
                  <span style="font-weight: bolder">{{t('help.one.text3')}}</span>
                </div>
                <el-image :hide-on-click-modal="true" :initial-index="4" :max-scale="7" :min-scale="0.2"
                          :preview-src-list="[image1]"
                          :src="image1"
                          :zoom-rate="1.2" fit="cover" style="margin-top: 10px; margin-bottom: 10px"></el-image>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title>
                  <span style="font-weight: bolder; font-size: 12px">{{t('help.two.title')}}</span>
                </template>
                <div>
                  {{t('help.two.text1')}}
                </div>
                <sc-code-editor ref="twoCodeRef" v-model="twoCode" mode="shell" :theme="isDark?'darcula':'idea'"
                                :height="isMobile?200:200" style="width: 95%"></sc-code-editor>
                <div>
                  {{t('help.two.text3')}}
                </div>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template #title>
                  <span style="font-weight: bolder; font-size: 12px">{{t('help.three.title')}}</span>
                </template>
                <div>
                  {{t('help.three.text1')}}
                </div>
                <div>
                  {{t('help.three.text2')}}
                </div>
                <sc-code-editor ref="threeCodeOneRef" v-model="threeCodeOne" mode="lua" :theme="isDark?'darcula':'idea'"
                                :height="isMobile?320:500" style="width: 95%"></sc-code-editor>
                <div>
                  {{t('help.three.text3')}}
                </div>
                <div>
                  {{t('help.three.text4')}}
                </div>
                <sc-code-editor ref="threeCodeTwoRef" v-model="threeCodeTwo" mode="lua" :theme="isDark?'darcula':'idea'"
                                :height="isMobile?320:500" style="width: 95%"></sc-code-editor>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="help">
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {computed, nextTick, ref} from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";

const {t} = useI18n()
const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const activeName = ref('0')

const image1 = new URL('./images/1.png', import.meta.url).href

const twoCodeRef = ref()
const twoCode = ref('# 备份\ncd ~\nmv dst/bin/lib32/steamclient.so dst/bin/lib32/steamclient.so.bak\nmv dst/steamclient.so dst/steamclient.so.bak\n# 替换\ncp steamcmd/linux32/steamclient.so dst/bin/lib32/steamclient.so\ncp steamcmd/linux32/steamclient.so dst/steamclient.so\n')
const threeCodeOneRef = ref()
const threeCodeOne = ref('return {\n' +
  '  background_node_range={ 0, 1 },\n' +
  '  desc="你敢去熔炉里证明你自己的实力吗？",\n' +
  '  hideminimap=false,\n' +
  '  id="LAVAARENA",\n' +
  '  location="lavaarena",\n' +
  '  max_playlist_position=999,\n' +
  '  min_playlist_position=0,\n' +
  '  name="熔炉",\n' +
  '  numrandom_set_pieces=0,\n' +
  '  override_level_string=false,\n' +
  '  overrides={\n' +
  '    autumn="default",\n' +
  '    basicresource_regrowth="none",\n' +
  '    beefaloheat="default",\n' +
  '    boons="never",\n' +
  '    brightmarecreatures="default",\n' +
  '    crow_carnival="default",\n' +
  '    darkness="default",\n' +
  '    day="default",\n' +
  '    dropeverythingondespawn="default",\n' +
  '    extrastartingitems="default",\n' +
  '    ghostenabled="always",\n' +
  '    ghostsanitydrain="always",\n' +
  '    hallowed_nights="default",\n' +
  '    healthpenalty="always",\n' +
  '    hunger="default",\n' +
  '    keep_disconnected_tiles=true,\n' +
  '    krampus="default",\n' +
  '    layout_mode="RestrictNodesByKey",\n' +
  '    lessdamagetaken="none",\n' +
  '    no_joining_islands=true,\n' +
  '    no_wormholes_to_disconnected_tiles=true,\n' +
  '    poi="never",\n' +
  '    portalresurection="none",\n' +
  '    protected="never",\n' +
  '    resettime="default",\n' +
  '    roads="never",\n' +
  '    season_start="default",\n' +
  '    seasonalstartingitems="default",\n' +
  '    shadowcreatures="default",\n' +
  '    spawnmode="fixed",\n' +
  '    spawnprotection="default",\n' +
  '    specialevent="default",\n' +
  '    spring="default",\n' +
  '    start_location="lavaarena",\n' +
  '    summer="default",\n' +
  '    task_set="lavaarena_taskset",\n' +
  '    temperaturedamage="default",\n' +
  '    touchstone="never",\n' +
  '    traps="never",\n' +
  '    winter="default",\n' +
  '    winters_feast="default",\n' +
  '    world_size="small",\n' +
  '    year_of_the_beefalo="default",\n' +
  '    year_of_the_bunnyman="default",\n' +
  '    year_of_the_carrat="default",\n' +
  '    year_of_the_catcoon="default",\n' +
  '    year_of_the_dragonfly="default",\n' +
  '    year_of_the_gobbler="default",\n' +
  '    year_of_the_pig="default",\n' +
  '    year_of_the_varg="default" \n' +
  '  },\n' +
  '  required_prefabs={ "lavaarena_portal" },\n' +
  '  settings_desc="你敢去熔炉里证明你自己的实力吗？",\n' +
  '  settings_id="LAVAARENA",\n' +
  '  settings_name="熔炉",\n' +
  '  substitutes={  },\n' +
  '  version=2,\n' +
  '  worldgen_desc="你敢去熔炉里证明你自己的实力吗？",\n' +
  '  worldgen_id="LAVAARENA",\n' +
  '  worldgen_name="熔炉" \n' +
  '}')
const threeCodeTwoRef = ref()
const threeCodeTwo = ref('return {\n' +
  '  ["workshop-1938752683"]={\n' +
  '    configuration_options={\n' +
  '      ADJUST_FILTER=false,\n' +
  '      BATTLESTANDARD_EFFICIENCY=1,\n' +
  '      COMMAND_SPAM_BAN_TIME=10,\n' +
  '      DAMAGE_NUMBER_FONT_SIZE=32,\n' +
  '      DAMAGE_NUMBER_HEIGHT=40,\n' +
  '      DAMAGE_NUMBER_OPTIONS="default",\n' +
  '      DAMAGE_NUMBER_PLAYERS=false,\n' +
  '      DEBUG=false,\n' +
  '      DEFAULT_FILTER=1,\n' +
  '      DEFAULT_LOBBY_TAB="news",\n' +
  '      DEFAULT_ROTATION=false,\n' +
  '      DIFFICULTY="normal",\n' +
  '      DISPLAY_COLORED_STATS=true,\n' +
  '      DISPLAY_TARGET_BADGE=true,\n' +
  '      DISPLAY_TEAMMATES_DEBUFFS=false,\n' +
  '      ["Damage Number Options"]=0,\n' +
  '      ["Detailed Summary Options"]=0,\n' +
  '      EVENT_TRACKING=true,\n' +
  '      FORCE_START_DELAY_TIME=5,\n' +
  '      FRIENDLY_FIRE=false,\n' +
  '      GAMETYPE="forge",\n' +
  '      GIFT_SIDE="right",\n' +
  '      ["Gameplay Settings"]=0,\n' +
  '      HIDE_INDICATORS=true,\n' +
  '      JOINABLE_MIDMATCH=true,\n' +
  '      LOBBY_GEAR=true,\n' +
  '      ["Lobby Options"]=0,\n' +
  '      MAX_MESSAGES=100,\n' +
  '      MOB_ATTACK_RATE=1,\n' +
  '      MOB_DAMAGE_DEALT=1,\n' +
  '      MOB_DAMAGE_TAKEN=1,\n' +
  '      MOB_DUPLICATOR=1,\n' +
  '      MOB_HEALTH=1,\n' +
  '      MOB_SIZE=1,\n' +
  '      MOB_SPEED=1,\n' +
  '      MODE="reforged",\n' +
  '      Mutators=0,\n' +
  '      NO_HUD=false,\n' +
  '      NO_REVIVES=false,\n' +
  '      NO_SLEEP=false,\n' +
  '      ONLY_SHOW_NONZERO_STATS=true,\n' +
  '      Other=0,\n' +
  '      PING_KEYBIND="KEY_R",\n' +
  '      PING_TRANSPARENCY=100,\n' +
  '      PLAYER_DEBUFF_DISPLAY="mini",\n' +
  '      ["Player HUD Options"]=0,\n' +
  '      RESERVE_SLOTS=true,\n' +
  '      ROTATION=0,\n' +
  '      SANDBOX=false,\n' +
  '      SERVER_ACHIEVEMENTS=false,\n' +
  '      SERVER_LEVEL=false,\n' +
  '      SHOW_CHAT_ICON=false,\n' +
  '      SPECTATORS_ONLY=true,\n' +
  '      SPECTATOR_ON_DEATH=false,\n' +
  '      VOTE_FORCE_START=true,\n' +
  '      VOTE_GAME_SETTINGS=true,\n' +
  '      VOTE_KICK=true,\n' +
  '      ["Visual Options"]=0,\n' +
  '      Vote=0,\n' +
  '      WAVESET="swineclops" \n' +
  '    },\n' +
  '    enabled=true \n' +
  '  },\n' +
  '  ["workshop-2038128735"]={ configuration_options={ klaustrophobia=false }, enabled=true },\n' +
  '  ["workshop-2619860122"]={ configuration_options={  }, enabled=true },\n' +
  '  ["workshop-2633870801"]={\n' +
  '    configuration_options={\n' +
  '      ["Gameplay Settings"]=0,\n' +
  '      MAP="none",\n' +
  '      ["Other Settings"]=0,\n' +
  '      WAVESET="none",\n' +
  '      light_color_override=false \n' +
  '    },\n' +
  '    enabled=true \n' +
  '  },\n' +
  '  ["workshop-2961923603"]={ configuration_options={  }, enabled=true },\n' +
  '  ["workshop-3132633883"]={ configuration_options={  }, enabled=true },\n' +
  '  ["workshop-3139080374"]={\n' +
  '    configuration_options={\n' +
  '      Brainwash_Fix=true,\n' +
  '      Lock_Recipes=true,\n' +
  '      Manually_Rapid_Atk=true,\n' +
  '      Random_Character_Fix=true,\n' +
  '      Rhinocebro_Fix=false,\n' +
  '      Spike_Fix=true,\n' +
  '      Tenfold_Optimize=true,\n' +
  '      force_camera=true,\n' +
  '      worly_cookpot=false \n' +
  '    },\n' +
  '    enabled=true \n' +
  '  },\n' +
  '  ["workshop-666155465"]={\n' +
  '    configuration_options={\n' +
  '      chestB=-1,\n' +
  '      chestG=-1,\n' +
  '      chestR=-1,\n' +
  '      display_hp=-1,\n' +
  '      food_estimation=-1,\n' +
  '      food_order=0,\n' +
  '      food_style=0,\n' +
  '      lang="auto",\n' +
  '      show_food_units=-1,\n' +
  '      show_uses=-1 \n' +
  '    },\n' +
  '    enabled=true \n' +
  '  }\n' +
  '}')

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
</script>

<style scoped>
div {
  line-height: 50px;
}
</style>

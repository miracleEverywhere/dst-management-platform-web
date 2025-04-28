<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" style="min-height: 80vh">
          <div style="margin: 10px">
            <el-collapse v-model="activeName" accordion @change="collapseChange">
              <el-collapse-item name="1">
                <template #title>
                  <el-tooltip v-if="needToolTip(t('help.one.title'))" :content="t('help.one.title')"
                              effect="light" placement="top">
                    <span style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.one.title')) }}</span>
                  </el-tooltip>
                  <span v-else style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.one.title')) }}</span>
                </template>
                <div v-if="needToolTip(t('help.one.title'))"
                     style="line-height: 50px; font-weight: bold; color: #409EFF">
                  {{ t('help.one.title') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.one.text1') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.one.text2') }}
                </div>
                <div class="tip custom-block">
                  <p class="custom-block-title">{{ t('help.one.text3') }}</p>
                </div>
                <div style="width: 50vh; height: 70vh">
                  <el-image :hide-on-click-modal="true" :initial-index="4" :max-scale="7" :min-scale="0.2"
                            :preview-src-list="[image1]"
                            :src="image1"
                            :zoom-rate="1.2" fit="contain" style="margin-top: 10px; margin-bottom: 10px"></el-image>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title>
                  <el-tooltip v-if="needToolTip(t('help.two.title'))" :content="t('help.two.title')"
                              effect="light" placement="top">
                    <span style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.two.title')) }}</span>
                  </el-tooltip>
                  <span v-else style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.two.title')) }}</span>
                </template>
                <div v-if="needToolTip(t('help.two.title'))"
                     style="line-height: 50px; font-weight: bold; color: #409EFF">
                  {{ t('help.two.title') }}
                </div>
                <div class="tip_success custom-block">
                  <span class="custom-block-title">{{ t('help.two.text2_6') }}</span>
                </div>
                <div class="tip custom-block">
                  <p class="custom-block-title">{{ t('help.two.text2_2') }}</p>
                  <el-button type="primary" @click="handleReplaceSo">{{ t('help.two.button_1') }}</el-button>
                </div>
                <div style="line-height: 50px;text-decoration: line-through;">
                  {{ t('help.two.text1') }}
                  <code>{{ t('help.two.text1_1') }}</code>
                  {{ t('help.two.text1_2') }}
                  <code>{{ t('help.two.text1_3') }}</code>
                  {{ t('help.two.text1_4') }}
                </div>
                <MdPreview ref="twoCodeRef"
                           :modelValue="twoCode"
                           :theme="isDark?'dark':'light'"
                           previewTheme="github"/>
                <div style="line-height: 50px;text-decoration: line-through;">
                  {{ t('help.two.text3') }}
                </div>
                <div style="line-height: 50px;font-weight: bolder; font-size: 14px;">
                  {{ t('help.two.timeline') }}
                </div>
                <el-timeline style="max-width: 600px">
                  <el-timeline-item size="large" timestamp="2024-10-25" type="primary">
                    {{ t('help.two.text2_4') }}
                  </el-timeline-item>
                  <el-timeline-item size="large" timestamp="2024-11-7" type="danger">
                    {{ t('help.two.text2') }}
                  </el-timeline-item>
                  <el-timeline-item size="large" timestamp="2024-12-8" type="danger">
                    {{ t('help.two.text2') }}
                  </el-timeline-item>
                  <el-timeline-item size="large" timestamp="2024-12-9" type="warning">
                    {{ t('help.two.text2_3') }}
                  </el-timeline-item>
                  <el-timeline-item size="large" timestamp="2025-3-18" type="warning">
                    {{ t('help.two.text2_5') }}
                  </el-timeline-item>
                </el-timeline>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template #title>
                  <el-tooltip v-if="needToolTip(t('help.three.title'))" :content="t('help.three.title')"
                              effect="light" placement="top">
                    <span style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.three.title')) }}</span>
                  </el-tooltip>
                  <span v-else style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.three.title')) }}</span>
                </template>
                <div v-if="needToolTip(t('help.three.title'))"
                     style="line-height: 50px; font-weight: bold; color: #409EFF">
                  {{ t('help.three.title') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.three.text1') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.three.text2') }}
                </div>
                <!--                <sc-code-editor ref="threeCodeOneRef" v-model="threeCodeOne" :height="isMobile?320:500" :read-only="true"-->
                <!--                                :theme="isDark?'darcula':'idea'"-->
                <!--                                mode="lua" style="width: 95%"></sc-code-editor>-->
                <MdPreview ref="threeCodeOneRef"
                           :modelValue="threeCodeOne"
                           :theme="isDark?'dark':'light'"
                           previewTheme="github"/>
                <div style="line-height: 50px;">
                  {{ t('help.three.text3') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.three.text4') }}
                </div>
                <!--                <sc-code-editor ref="threeCodeTwoRef" v-model="threeCodeTwo" :height="isMobile?320:500" :read-only="true"-->
                <!--                                :theme="isDark?'darcula':'idea'"-->
                <!--                                mode="lua" style="width: 95%"></sc-code-editor>-->
                <MdPreview ref="threeCodeTwoRef"
                           :modelValue="threeCodeTwo"
                           :theme="isDark?'dark':'light'"
                           previewTheme="github"/>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template #title>
                  <el-tooltip v-if="needToolTip(t('help.four.title'))" :content="t('help.four.title')"
                              effect="light" placement="top">
                    <span style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.four.title')) }}</span>
                  </el-tooltip>
                  <span v-else style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.four.title')) }}</span>
                </template>
                <div v-if="needToolTip(t('help.four.title'))"
                     style="line-height: 50px; font-weight: bold; color: #409EFF">
                  {{ t('help.four.title') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.four.text1') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.four.text2') }}
                  <el-button :loading="downloadLogLoading" size="small" type="success" @click="handleDownloadLog">
                    {{ t('help.four.button') }}
                  </el-button>
                  {{ t('help.four.text3') }}
                </div>
              </el-collapse-item>
              <el-collapse-item name="5">
                <template #title>
                  <el-tooltip v-if="needToolTip(t('help.five.title'))" :content="t('help.five.title')"
                              effect="light" placement="top">
                    <span style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.five.title')) }}</span>
                  </el-tooltip>
                  <span v-else style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.five.title')) }}</span>
                </template>
                <div v-if="needToolTip(t('help.five.title'))"
                     style="line-height: 50px; font-weight: bold; color: #409EFF">
                  {{ t('help.five.title') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.five.text1') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.five.text2') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.five.text3') }}
                </div>
                <div class="tip custom-block">
                  <p>
                    <span class="custom-block-title">
                      {{ t('help.five.tip1') }}
                    </span>
                    {server.ini - [NETWORK] - server_port}
                    <span class="custom-block-title">
                      {{ t('help.five.tip1_1') }}
                    </span>
                  </p>
                  <p>
                    <span class="custom-block-title">
                      {{ t('help.five.tip2') }}
                    </span>
                    {cluster.ini - [SHARD] - master_port}
                    <span class="custom-block-title">
                      {{ t('help.five.tip2_1') }}
                    </span>
                  </p>
                  <p>
                    <span class="custom-block-title">
                      {{ t('help.five.tip3') }}
                    </span>
                    {server.ini - [STEAM] - server_master_port}
                    <span class="custom-block-title">
                      {{ t('help.five.tip3_1') }}
                    </span>
                  </p>
                  <p>
                    <span class="custom-block-title">
                      {{ t('help.five.tip4') }}
                    </span>
                    {server.ini - [STEAM] - authentication_port}
                    <span class="custom-block-title">
                      {{ t('help.five.tip4_1') }}
                    </span>
                  </p>
                  <p>
                    <span class="custom-block-title">
                      {{ t('help.five.tip5') }}
                    </span>
                    {cluster.ini - [SHARD] - master_ip}
                    <span class="custom-block-title">
                      {{ t('help.five.tip5_1') }}
                    </span>
                  </p>
                  <p>
                    <span class="custom-block-title">
                      {{ t('help.five.tip6') }}
                    </span>
                    {cluster.ini - [SHARD] - cluster_key}
                    <span class="custom-block-title">
                      {{ t('help.five.tip6_1') }}
                    </span>
                  </p>
                </div>
                <div class="tip_warning">
                  {{ t('help.five.alert') }}
                </div>
                <div class="tip custom-block">
                  {{ t('help.five.tip7') }}
                </div>
              </el-collapse-item>
              <el-collapse-item name="6">
                <template #title>
                  <el-tooltip v-if="needToolTip(t('help.six.title'))" :content="t('help.six.title')"
                              effect="light" placement="top">
                    <span style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.six.title')) }}</span>
                  </el-tooltip>
                  <span v-else style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.six.title')) }}</span>
                </template>
                <div v-if="needToolTip(t('help.six.title'))"
                     style="line-height: 50px; font-weight: bold; color: #409EFF">
                  {{ t('help.six.title') }}
                </div>
                <div class="tip custom-block">
                  {{ t('help.six.text6') }}
                </div>
                <div style="line-height: 50px;font-weight: bolder">
                  {{ t('help.six.text7') }}
                </div>
                <div class="tip_warning custom-block">
                  {{ t('help.six.text8') }}
                </div>
                <div style="line-height: 50px;">
                  {{ t('help.six.text1') }}
                  <code>{{ t('help.six.code1') }}</code>
                  {{ t('help.six.text2') }}
                  <code>{{ t('help.six.code2') }}</code>
                  {{ t('help.six.text3') }}
                </div>
                <MdPreview ref="sixCodeOneRef"
                           :modelValue="sixCodeOne"
                           :theme="isDark?'dark':'light'"
                           previewTheme="github"/>
                <div style="line-height: 50px;">
                  {{ t('help.six.text4') }}
                </div>
                <!--                <sc-code-editor ref="sixCodeTwoRef" v-model="sixCodeTwo" :height="100" :read-only="true" :theme="isDark?'darcula':'idea'"-->
                <!--                                mode="javascript"></sc-code-editor>-->
                <MdPreview ref="sixCodeTwoRef"
                           :modelValue="sixCodeTwo"
                           :theme="isDark?'dark':'light'"
                           previewTheme="github"/>
                <div style="line-height: 50px;">
                  {{ t('help.six.text5') }}
                </div>
              </el-collapse-item>
              <el-collapse-item name="7">
                <template #title>
                  <el-tooltip v-if="needToolTip(t('help.seven.title'))" :content="t('help.seven.title')"
                              effect="light" placement="top">
                    <span style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.six.title')) }}</span>
                  </el-tooltip>
                  <span v-else style="font-weight: bolder; font-size: 16px">{{ optTitle(t('help.seven.title')) }}</span>
                </template>
                <div v-if="needToolTip(t('help.seven.title'))"
                     style="line-height: 50px; font-weight: bold; color: #409EFF">
                  {{ t('help.six.title') }}
                </div>
                <div class="tip custom-block">
                  <div style="display: flex; align-content: center">
                    <el-icon :size="20" class="koi-icon">
                      <sc-icon-github-fill/>
                    </el-icon>
                    <el-link href="https://github.com/miracleEverywhere/dst-management-platform-desktop"
                             target="_blank" :underline="false" style="margin-left: 5px"
                    >
                      https://github.com/miracleEverywhere/dst-management-platform-desktop
                    </el-link>
                  </div>

                </div>
                <div style="line-height: 50px;font-weight: bolder">
                  {{ t('help.seven.text1') }}
                </div>
                <div style="line-height: 50px;font-weight: bolder">
                  {{ t('help.seven.text2') }}
                </div>
                <div style="line-height: 50px;font-weight: bolder">
                  {{ t('help.seven.text3') }}
                </div>
              </el-collapse-item>
              <el-collapse-item name="8">
                <template #title>
                  路径说明
                </template>
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
import {computed, ref} from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import logsApi from "@/api/logs"
import toolsApi from "@/api/tools"
import {saveFile} from "@/utils/tools.js";
import {koiMsgSuccess} from "@/utils/koi.ts";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const {t} = useI18n()
const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const activeName = ref('0')

const image1 = new URL('./images/1.jpg', import.meta.url).href

const twoCodeRef = ref()
const twoCode = ref('```shell ::close\n# 备份\ncd ~\nmv dst/bin/lib32/steamclient.so dst/bin/lib32/steamclient.so.bak\nmv dst/steamclient.so dst/steamclient.so.bak\n# 替换\ncp steamcmd/linux32/steamclient.so dst/bin/lib32/steamclient.so\ncp steamcmd/linux32/steamclient.so dst/steamclient.so\n```')
const threeCodeOneRef = ref()
const threeCodeOne = ref('```lua ::open\nreturn {\n  background_node_range={ 0, 1 },\n  desc="你敢去熔炉里证明你自己的实力吗？",\n  hideminimap=false,\n  id="LAVAARENA",\n  location="lavaarena",\n  max_playlist_position=999,\n  min_playlist_position=0,\n  name="熔炉",\n  numrandom_set_pieces=0,\n  override_level_string=false,\n  overrides={\n    autumn="default",\n    basicresource_regrowth="none",\n    beefaloheat="default",\n    boons="never",\n    brightmarecreatures="default",\n    crow_carnival="default",\n    darkness="default",\n    day="default",\n    dropeverythingondespawn="default",\n    extrastartingitems="default",\n    ghostenabled="always",\n    ghostsanitydrain="always",\n    hallowed_nights="default",\n    healthpenalty="always",\n    hunger="default",\n    keep_disconnected_tiles=true,\n    krampus="default",\n    layout_mode="RestrictNodesByKey",\n    lessdamagetaken="none",\n    no_joining_islands=true,\n    no_wormholes_to_disconnected_tiles=true,\n    poi="never",\n    portalresurection="none",\n    protected="never",\n    resettime="default",\n    roads="never",\n    season_start="default",\n    seasonalstartingitems="default",\n    shadowcreatures="default",\n    spawnmode="fixed",\n    spawnprotection="default",\n    specialevent="default",\n    spring="default",\n    start_location="lavaarena",\n    summer="default",\n    task_set="lavaarena_taskset",\n    temperaturedamage="default",\n    touchstone="never",\n    traps="never",\n    winter="default",\n    winters_feast="default",\n    world_size="small",\n    year_of_the_beefalo="default",\n    year_of_the_bunnyman="default",\n    year_of_the_carrat="default",\n    year_of_the_catcoon="default",\n    year_of_the_dragonfly="default",\n    year_of_the_gobbler="default",\n    year_of_the_pig="default",\n    year_of_the_varg="default"\n  },\n  required_prefabs={ "lavaarena_portal" },\n  settings_desc="你敢去熔炉里证明你自己的实力吗？",\n  settings_id="LAVAARENA",\n  settings_name="熔炉",\n  substitutes={  },\n  version=2,\n  worldgen_desc="你敢去熔炉里证明你自己的实力吗？",\n  worldgen_id="LAVAARENA",\n  worldgen_name="熔炉"\n}\n```')
const threeCodeTwoRef = ref()
const threeCodeTwo = ref('```lua ::open\nreturn {\n  ["workshop-1938752683"]={\n    configuration_options={\n      ADJUST_FILTER=false,\n      BATTLESTANDARD_EFFICIENCY=1,\n      COMMAND_SPAM_BAN_TIME=10,\n      DAMAGE_NUMBER_FONT_SIZE=32,\n      DAMAGE_NUMBER_HEIGHT=40,\n      DAMAGE_NUMBER_OPTIONS="default",\n      DAMAGE_NUMBER_PLAYERS=false,\n      DEBUG=false,\n      DEFAULT_FILTER=1,\n      DEFAULT_LOBBY_TAB="news",\n      DEFAULT_ROTATION=false,\n      DIFFICULTY="normal",\n      DISPLAY_COLORED_STATS=true,\n      DISPLAY_TARGET_BADGE=true,\n      DISPLAY_TEAMMATES_DEBUFFS=false,\n      ["Damage Number Options"]=0,\n      ["Detailed Summary Options"]=0,\n      EVENT_TRACKING=true,\n      FORCE_START_DELAY_TIME=5,\n      FRIENDLY_FIRE=false,\n      GAMETYPE="forge",\n      GIFT_SIDE="right",\n      ["Gameplay Settings"]=0,\n      HIDE_INDICATORS=true,\n      JOINABLE_MIDMATCH=true,\n      LOBBY_GEAR=true,\n      ["Lobby Options"]=0,\n      MAX_MESSAGES=100,\n      MOB_ATTACK_RATE=1,\n      MOB_DAMAGE_DEALT=1,\n      MOB_DAMAGE_TAKEN=1,\n      MOB_DUPLICATOR=1,\n      MOB_HEALTH=1,\n      MOB_SIZE=1,\n      MOB_SPEED=1,\n      MODE="reforged",\n      Mutators=0,\n      NO_HUD=false,\n      NO_REVIVES=false,\n      NO_SLEEP=false,\n      ONLY_SHOW_NONZERO_STATS=true,\n      Other=0,\n      PING_KEYBIND="KEY_R",\n      PING_TRANSPARENCY=100,\n      PLAYER_DEBUFF_DISPLAY="mini",\n      ["Player HUD Options"]=0,\n      RESERVE_SLOTS=true,\n      ROTATION=0,\n      SANDBOX=false,\n      SERVER_ACHIEVEMENTS=false,\n      SERVER_LEVEL=false,\n      SHOW_CHAT_ICON=false,\n      SPECTATORS_ONLY=true,\n      SPECTATOR_ON_DEATH=false,\n      VOTE_FORCE_START=true,\n      VOTE_GAME_SETTINGS=true,\n      VOTE_KICK=true,\n      ["Visual Options"]=0,\n      Vote=0,\n      WAVESET="swineclops"\n    },\n    enabled=true\n  },\n  ["workshop-2038128735"]={ configuration_options={ klaustrophobia=false }, enabled=true },\n  ["workshop-2619860122"]={ configuration_options={  }, enabled=true },\n  ["workshop-2633870801"]={\n    configuration_options={\n      ["Gameplay Settings"]=0,\n      MAP="none",\n      ["Other Settings"]=0,\n      WAVESET="none",\n      light_color_override=false\n    },\n    enabled=true\n  },\n  ["workshop-2961923603"]={ configuration_options={  }, enabled=true },\n  ["workshop-3132633883"]={ configuration_options={  }, enabled=true },\n  ["workshop-3139080374"]={\n    configuration_options={\n      Brainwash_Fix=true,\n      Lock_Recipes=true,\n      Manually_Rapid_Atk=true,\n      Random_Character_Fix=true,\n      Rhinocebro_Fix=false,\n      Spike_Fix=true,\n      Tenfold_Optimize=true,\n      force_camera=true,\n      worly_cookpot=false\n    },\n    enabled=true\n  },\n  ["workshop-666155465"]={\n    configuration_options={\n      chestB=-1,\n      chestG=-1,\n      chestR=-1,\n      display_hp=-1,\n      food_estimation=-1,\n      food_order=0,\n      food_style=0,\n      lang="auto",\n      show_food_units=-1,\n      show_uses=-1\n    },\n    enabled=true\n  }\n}\n```')
const sixCodeOneRef = ref()
const sixCodeOne = ref('```ini ::open\n[ACCOUNT]\nencode_user_path = true\n```')
const sixCodeTwoRef = ref()
const sixCodeTwo = ref('```ini ::open\n[ACCOUNT]\nencode_user_path = false\n```')

const collapseChange = () => {
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

const handleReplaceSo = () => {
  toolsApi.replaceSo.post().then(response => {
    koiMsgSuccess(response.message)
  })
}

const optTitle = (title) => {
  if (!isMobile.value) {
    return title
  }

  if (title.length > 25) {
    return title.substring(0, 25) + '...'
  } else {
    return title
  }
}

const needToolTip = (title) => {
  if (!isMobile.value) {
    return false
  }
  return title.length > 25;
}

</script>

<style scoped>

</style>

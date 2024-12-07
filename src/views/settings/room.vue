<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?$t('setting.roomSettingMobile'):$t('setting.roomSetting')" @click="handleStepClick(0)"/>
            <el-step :title="isMobile?$t('setting.groundSettingMobile'):$t('setting.groundSetting')" @click="handleStepClick(1)"/>
            <el-step :title="isMobile?$t('setting.caveSettingMobile'):$t('setting.caveSetting')" @click="handleStepClick(2)"/>
            <el-step :title="isMobile?$t('setting.modSettingMobile'):$t('setting.modSetting')" @click="handleStepClick(3)"/>
            <el-step :title="isMobile?$t('setting.finishSettingMobile'):$t('setting.finishSetting')" @click="handleStepClick(4)"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card v-if="step===0" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-form ref="roomBaseFormRef" :label-position="isMobile?'top':'left'" :label-width="isMobile?'70':'auto'"
                   :model="roomBaseForm" :rules="roomBaseFormRules" :size="isMobile?'small':'large'">
            <el-form-item :label="$t('setting.baseForm.room')" prop="name">
              <el-input v-model="roomBaseForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.description')" prop="description">
              <el-input v-model="roomBaseForm.description"></el-input>
            </el-form-item>
            <el-form-item prop="masterPort">
              <template #label>
                <el-tooltip :content="t('setting.roomBaseFormPortToolTip')" effect="light" placement="top">
                  {{ t('setting.baseForm.masterPort') }}
                </el-tooltip>
              </template>
              <el-input-number v-model="roomBaseForm.masterPort" :max="65535" :min="1" :size="isMobile?'small':'large'"
                               controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item prop="cavesPort">
              <template #label>
                <el-tooltip :content="t('setting.roomBaseFormPortToolTip')" effect="light" placement="top">
                  {{ t('setting.baseForm.cavesPort') }}
                </el-tooltip>
              </template>
              <el-input-number v-model="roomBaseForm.cavesPort" :max="65535" :min="1" :size="isMobile?'small':'large'"
                               controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.gameMode.name')" prop="gameMode">
              <el-radio-group v-model="roomBaseForm.gameMode">
                <el-radio :label="$t('setting.baseForm.gameMode.endless')" value="endless"/>
                <el-radio :label="$t('setting.baseForm.gameMode.survival')" value="survival"/>
                <el-radio :label="$t('setting.baseForm.gameMode.lavaarena')" value="lavaarena"/>
                <el-radio :label="$t('setting.baseForm.gameMode.quagmire')" value="quagmire"/>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.pvp')" prop="pvp">
              <el-switch v-model="roomBaseForm.pvp"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.playerNum')" prop="playerNum">
              <el-slider v-model="roomBaseForm.playerNum" :max="100" :min="2" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.backDays')" prop="backDays">
              <el-slider v-model="roomBaseForm.backDays" :max="50" :min="5" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.vote')" prop="vote">
              <el-switch v-model="roomBaseForm.vote"/>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.password')">
              <el-input v-model="roomBaseForm.password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.baseForm.token')" prop="token">
              <el-input v-model="roomBaseForm.token" show-password></el-input>
              <div class="el-form-item-msg">
                <el-link :underline="false" href="https://accounts.klei.com"
                         target="_blank">{{ t('setting.baseForm.tokenHelp') }}
                </el-link>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===1" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-tabs v-model="groundTabName">
            <el-tab-pane :label="t('setting.tabCode')" name="Code">
              <el-button v-if="roomBaseForm.gameMode==='endless'" type="primary"
                         @click="handleImportLeveldataLua('master', 'endless')">
                {{t('setting.luaImportButton.endless')}}
              </el-button>
              <el-button v-if="roomBaseForm.gameMode==='survival'" type="primary"
                         @click="handleImportLeveldataLua('master', 'survival')">
                {{t('setting.luaImportButton.survival')}}
              </el-button>
              <el-form ref="roomGroundFormRef" :label-width="isMobile?'70':'100'" :model="roomGroundForm"
                       :rules="roomGroundFormRules" :size="isMobile?'small':'large'" style="margin-top: 10px">
                <el-form-item label-position="top" prop="groundSetting">
                  <sc-code-editor ref="editorGroundSettingRef" v-model="roomGroundForm.groundSetting" :height="isMobile?320:500"
                                  :theme="isDark?'darcula':'idea'"
                                  mode="lua" style="width: 100%"></sc-code-editor>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane v-if="roomBaseForm.gameMode==='endless'||roomBaseForm.gameMode==='survival'" :label="t('setting.tabVisualization')" name="Visualization">
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.global') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.global">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.events') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.events">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.survivors') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.survivors">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.world') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.world">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.resourceRegrowth') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.resourceRegrowth">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.unnaturalPortalResource') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.unnaturalPortalResource">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.creatures') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.creatures">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.hostileCreatures') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.hostileCreatures">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                {{ t('setting.groundVisualizationRuleItem.giants') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldRule.giants">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.global') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.global">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.world') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.world">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.resources') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.resources">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.creaturesAndSpawners') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.creaturesAndSpawners">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.groundVisualizationGeneration') }}</span> -
                {{ t('setting.groundVisualizationGenerationItem.hostileCreaturesAndSpawners') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in groundWorldGeneration.hostileCreaturesAndSpawners">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleModelValueChange"
                    />
                  </div>
                </template>
              </div>

            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card v-if="step===2" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-tabs v-model="cavesTabName">
            <el-tab-pane :label="t('setting.tabCode')" name="Code">
              <el-alert :closable="false" :effect="isDark?'light':'dark'" type="success">{{ t('setting.cavesTip') }}</el-alert>
              <div style="margin-top: 10px">
                <el-button v-if="roomBaseForm.gameMode==='endless'" type="primary"
                           @click="handleImportLeveldataLua('caves', 'endless')">
                  {{t('setting.luaImportButton.endless')}}
                </el-button>
                <el-button v-if="roomBaseForm.gameMode==='survival'" type="primary"
                           @click="handleImportLeveldataLua('caves', 'survival')">
                  {{t('setting.luaImportButton.survival')}}
                </el-button>
              </div>
              <el-form ref="roomCaveFormRef" :label-width="isMobile?'70':'100'" :model="roomCaveForm"
                       :rules="roomCaveFormRules" :size="isMobile?'small':'large'" style="margin-top: 10px">
                <el-form-item label-position="top" prop="caveSetting">
                  <sc-code-editor ref="editorCavesSettingRef" v-model="roomCaveForm.caveSetting" :height="isMobile?320:500"
                                  :theme="isDark?'darcula':'idea'"
                                  mode="lua" style="width: 100%"></sc-code-editor>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane v-if="roomBaseForm.gameMode==='endless'||roomBaseForm.gameMode==='survival'" :label="t('setting.tabVisualization')" name="Visualization">
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                {{ t('setting.cavesVisualizationRuleItem.world') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldRule.world">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                {{ t('setting.cavesVisualizationRuleItem.resourceRegrowth') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldRule.resourceRegrowth">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                {{ t('setting.cavesVisualizationRuleItem.creatures') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldRule.creatures">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                {{ t('setting.cavesVisualizationRuleItem.hostileCreatures') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldRule.hostileCreatures">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                {{ t('setting.cavesVisualizationRuleItem.giants') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldRule.giants">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                {{ t('setting.cavesVisualizationGenerationItem.world') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldGeneration.world">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="caveOverrideWorldGenerationWorld[i].configs"
                                      :customConfigsValue="caveOverrideWorldGenerationWorld[i].customConfigsValue"
                                      :i18n="caveOverrideWorldGenerationWorld[i].i18n"
                                      :image="caveOverrideWorldGenerationWorld[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                {{ t('setting.cavesVisualizationGenerationItem.resources') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldGeneration.resources">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                {{ t('setting.cavesVisualizationGenerationItem.creaturesAndSpawners') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldGeneration.creaturesAndSpawners">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
              <el-divider content-position="center"><span
                style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                {{ t('setting.cavesVisualizationGenerationItem.hostileCreaturesAndSpawners') }}
              </el-divider>
              <div class="item-container">
                <template v-for="i in cavesWorldGeneration.hostileCreaturesAndSpawners">
                  <div>
                    <LevelDataSetting v-model="overridesObj[i]"
                                      :configs="overrides[i].configs"
                                      :customConfigsValue="overrides[i].customConfigsValue"
                                      :i18n="overrides[i].i18n"
                                      :image="overrides[i].image"
                                      :name="i"
                                      :key="new Date().getTime()"
                                      @changeModelValue="handleCavesModelValueChange"
                    />
                  </div>
                </template>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card v-if="step===3" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-form ref="roomModFormRef" :label-width="isMobile?'70':'100'" :model="roomModForm" :rules="roomModFormRules"
                   :size="isMobile?'small':'large'">
            <el-form-item label-position="top" prop="modSetting">
              <sc-code-editor ref="editor" v-model="roomModForm.modSetting" :height="isMobile?320:500"
                              :theme="isDark?'darcula':'idea'"
                              mode="lua" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===4" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <div :style="isMobile?'min-height: 360px':'min-height: 560px'" class="fcc">
            <el-result :sub-title="$t('setting.finish.description')" :title="$t('setting.finish.title')" icon="success"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card shadow="never">
          <div style="display: flex; justify-content: flex-end;">
            <el-button v-if="step>0" @click="handlePrev">{{ t('setting.button.prev') }}</el-button>
            <el-button v-if="step<4" type="primary" @click="handleNext">{{ t('setting.button.next') }}</el-button>
            <el-dropdown v-if="step===4" style="margin-left: 12px" trigger="click" @command="handleCommand">
              <el-button :loading="loading" type="warning">
                {{ t('setting.button.actions') }}
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="save">{{ t('setting.button.save') }}</el-dropdown-item>
                  <el-dropdown-item command="saveAndRestart">{{ t('setting.button.saveAndRestart') }}</el-dropdown-item>
                  <el-dropdown-item command="generateNewWorld">{{ t('setting.button.generateNewWorld') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="settingsRoom" setup>
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import luaparse from 'luaparse'
import luamin from 'lua-format'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import {groundWorldGeneration, groundWorldRule, overrides, caveOverrideWorldGenerationWorld, cavesWorldRule, cavesWorldGeneration} from "@/views/settings/components/levelDataMap.js"
import {endless, survival} from "@/views/settings/components/leveldataoverride.js"

const {t} = useI18n()

onMounted(() => {
  handleGetCurrentRoomSetting()
})

const loading = ref(false)

const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);

const editorGroundSettingRef = ref()
const editorCavesSettingRef = ref()

const step = ref(0)
const handleStepClick = (goStep) => {
  if (step.value > goStep) {
    if (goStep === 1) {
      generateGroundOverridesObj()
    }
    if (goStep === 2) {
      generateCavesOverridesObj()
    }
    step.value = goStep
  }
}
const handlePrev = () => {
  if (step.value === 2) {
    generateGroundOverridesObj()
  }
  if (step.value === 3) {
    generateCavesOverridesObj()
  }
  step.value--
}
const handleNext = () => {
  if (step.value === 0) {
    roomBaseFormRef.value.validate(valid => {
      if (valid) {
        if (roomBaseForm.value.masterPort === roomBaseForm.value.cavesPort) {
          koiMsgError(t('setting.roomBaseFormRules.samePort'))
          return
        }
        generateGroundOverridesObj()
        step.value++
      }
    })
  } else if (step.value === 1) {
    roomGroundFormRef.value.validate(valid => {
      if (valid) {
        try {
          luaparse.parse(roomGroundForm.value.groundSetting);
          generateCavesOverridesObj()
          step.value++
        } catch (e) {
          koiMsgError(t('setting.luaError'))
        }
      }
    })
  } else if (step.value === 2) {
    if (roomCaveForm.value) {
      try {
        luaparse.parse(roomCaveForm.value.caveSetting);
        step.value++
      } catch (e) {
        koiMsgError(t('setting.luaError'))
      }
    } else {
      step.value++
    }
  } else if (step.value === 3) {
    if (roomModForm.value) {
      try {
        luaparse.parse(roomModForm.value.modSetting);
        step.value++
      } catch (e) {
        koiMsgError(t('setting.luaError'))
      }
    } else {
      step.value++
    }
  }
}

const roomBaseFormRef = ref()
const roomBaseForm = ref({
  name: '',
  description: '',
  gameMode: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: true,
  password: '',
  token: '',
  masterPort: 0,
  cavesPort: 0,
})
const roomBaseFormRules = {
  name: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'blur'}],
  masterPort: [{required: true, message: t('setting.roomBaseFormRules.masterPort'), trigger: 'blur'}],
  cavesPort: [{required: true, message: t('setting.roomBaseFormRules.cavesPort'), trigger: 'blur'}],
  token: [{required: true, message: t('setting.roomBaseFormRules.token'), trigger: 'blur'}],
}

const roomGroundFormRef = ref()
const roomGroundForm = ref({
  groundSetting: '',
})
const roomGroundFormRules = {
  groundSetting: [{required: true, message: t('setting.roomGroundFormRules.groundSetting'), trigger: 'blur'}],
}

const roomCaveFormRef = ref()
const roomCaveForm = ref({
  caveSetting: '',
})
const roomCaveFormRules = {
  caveSetting: [{required: true, message: t('setting.roomCaveFormRules.caveSetting'), trigger: 'blur'}],
}

const roomModFormRef = ref()
const roomModForm = ref({
  modSetting: '',
})
const roomModFormRules = {
  modSetting: [{required: true, message: t('setting.roomModFormRules.modSetting'), trigger: 'blur'}],
}

const handleImportLeveldataLua = (world, mode) => {
  if (world === 'master') {
    if (mode === 'endless') {
      roomGroundForm.value.groundSetting = endless.master
    }
    if (mode === 'survival') {
      roomGroundForm.value.groundSetting = survival.master
    }
    generateGroundOverridesObj()
  }
  if (world === 'caves') {
    if (mode === 'endless') {
      roomCaveForm.value.caveSetting = endless.caves
    }
    if (mode === 'survival') {
      roomCaveForm.value.caveSetting = survival.caves
    }
    generateCavesOverridesObj()
  }
}

const handleGetCurrentRoomSetting = () => {
  settingApi.room.get().then(response => {
    roomBaseForm.value = response.data.base
    roomGroundForm.value.groundSetting = response.data.ground
    roomCaveForm.value.caveSetting = response.data.cave
    roomModForm.value.modSetting = response.data.mod
  })
}

const handleCommand = (cmd) => {
  switch (cmd) {
    case 'save':
      handleSave()
      break;
    case 'saveAndRestart':
      handleSaveAndRestart()
      break;
    case 'generateNewWorld':
      handleGenerateNewWorld()
      break;
  }
}

const handleSave = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.save.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    loading.value = false
  }).finally(() => {
    loading.value = false
  })
}
const handleSaveAndRestart = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.saveAndRestart.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    loading.value = false
  }).finally(() => {
    loading.value = false
  })
}
const handleGenerateNewWorld = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.saveAndGenerate.post(reqForm).then(response => {
    loading.value = false
    koiMsgSuccess(response.message)
  }).finally(() => {
    loading.value = false
  })
}

const groundTabName = ref('Code')
const cavesTabName = ref('Code')

const overridesObj = ref({})

const generateGroundOverridesObj = () => {
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // 将 Lua 表转换为 JavaScript 对象
  overridesObj.value = convertLuaTableToObject(overridesTable);
}

const generateCavesOverridesObj = () => {
  const ast = luaparse.parse(roomCaveForm.value.caveSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // 将 Lua 表转换为 JavaScript 对象
  overridesObj.value = convertLuaTableToObject(overridesTable);
}

function extractOverrides(ast) {
  // 找到 return 语句中的 overrides 字段
  const returnStatement = ast.body[0]; // 假设只有一个 return 语句
  const returnTable = returnStatement.arguments[0]; // return 语句的参数是一个表

  // 遍历表中的字段，找到 overrides 字段
  for (const field of returnTable.fields) {
    // console.log(field)
    if (field.key.type === 'Identifier' && field.key.name === 'overrides') {
      return field.value;
    }
  }

  return null;
}

function convertLuaTableToObject(luaTable) {
  const obj = {};
  for (const field of luaTable.fields) {
    const key = field.key.name;
    obj[key] = field.value.raw.replace(/"/g, '')
  }

  return obj;
}

const handleModelValueChange = (data) => {
  const key = data.name
  const value = data.value
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`
    }
  }
  const luaScript = astToLua(ast)
  roomGroundForm.value.groundSetting = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false
  })
  if (editorGroundSettingRef.value) {
    editorGroundSettingRef.value.refresh()
  }
}

const handleCavesModelValueChange = (data) => {
  const key = data.name
  const value = data.value
  const ast = luaparse.parse(roomCaveForm.value.caveSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`
    }
  }
  const luaScript = astToLua(ast)
  roomCaveForm.value.caveSetting = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false
  })
  if (editorCavesSettingRef.value) {
    editorCavesSettingRef.value.refresh()
  }
}

const astToLua = (astNode, indentLevel = 0) => {
  const indent = '    '.repeat(indentLevel);
  switch (astNode.type) {
    case 'Chunk':
      return astNode.body.map(node => astToLua(node, indentLevel)).join('\n');
    case 'LocalStatement':
      return `${indent}local ${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`;
    case 'FunctionDeclaration':
      return `${indent}function ${astToLua(astNode.identifier)}(${astNode.parameters.map(astToLua).join(', ')}) \n${astToLua(astNode.body, indentLevel + 1)}\n${indent}end`;
    case 'ReturnStatement':
      return `${indent}return ${astNode.arguments.map(astToLua).join(', ')}`;
    case 'BinaryExpression':
      return `${astToLua(astNode.left)} ${astNode.operator} ${astToLua(astNode.right)}`;
    case 'CallStatement':
      return `${indent}${astToLua(astNode.expression)}`;
    case 'Identifier':
      return astNode.name;
    case 'StringLiteral':
      return `${astNode.raw}`;
    case 'NumericLiteral':
      return astNode.raw;
    case 'VarargLiteral':
      return '...';
    case 'TableConstructorExpression':
      return `${indent}{ ${astNode.fields.map(field => astToLua(field, indentLevel + 1)).join(',\n' + indent)} }`;
    case 'Field':
      return astNode.key ? `${astToLua(astNode.key)} = ${astToLua(astNode.value)}` : astToLua(astNode.value);
    case 'AssignmentStatement':
      return `${indent}${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`;
    case 'CallExpression':
      return `${astToLua(astNode.base)}(${astNode.arguments.map(astToLua).join(', ')})`;
    case 'TableKeyString':
      return `${astToLua(astNode.key)} = ${astToLua(astNode.value)}`;
    case 'BooleanLiteral':
      return astNode.raw;
    case 'TableValue':
      return astToLua(astNode.value);
    default:
      throw new Error(`Unsupported node type: ${astNode.type}`);
  }
}
</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
}
</style>

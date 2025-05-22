<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?t('setting.roomSettingMobile'):t('setting.roomSetting')" @click="handleStepClick(0)"/>
            <el-step :title="isMobile?t('setting.worldSettingMobile'):t('setting.worldSetting')" @click="handleStepClick(1)"/>
            <el-step :title="isMobile?t('setting.modSettingMobile'):t('setting.modSetting')" @click="handleStepClick(3)"/>
            <el-step :title="isMobile?t('setting.finishSettingMobile'):t('setting.finishSetting')"
                     @click="handleStepClick(2)"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card v-if="step===0" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                {{ t('setting.roomSetting') }}
              </span>
            </div>
          </template>
          <el-scrollbar :height="windowHeight - 437.5">
            <el-form ref="clusterSettingFormRef" :label-position="isMobile?'top':'left'"
                     :label-width="isMobile?'70':'auto'"
                     :model="clusterSettingForm" :rules="clusterSettingFormRules"
                     :size="isMobile?'small':'large'" style="margin-right: 16px">
              <el-form-item :label="t('setting.baseForm.room')" prop="name" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <el-input v-model="clusterSettingForm.name"></el-input>
              </el-form-item>
              <div v-if="!isMobile"></div>
              <el-form-item :label="t('setting.baseForm.description')" prop="description" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <el-input v-model="clusterSettingForm.description"></el-input>
              </el-form-item>
              <el-form-item :label="t('setting.baseForm.gameMode.name')" prop="gameMode" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <el-radio-group v-model="clusterSettingForm.gameMode">
                  <el-radio :label="t('setting.baseForm.gameMode.endless')" value="endless"/>
                  <el-radio :label="t('setting.baseForm.gameMode.survival')" value="survival"/>
                  <el-radio :label="t('setting.baseForm.gameMode.lavaarena')" value="lavaarena"/>
                  <el-radio :label="t('setting.baseForm.gameMode.quagmire')" value="quagmire"/>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="t('setting.baseForm.pvp')" prop="pvp" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <el-switch v-model="clusterSettingForm.pvp"/>
              </el-form-item>
              <el-form-item :label="t('setting.baseForm.playerNum')" prop="playerNum" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <el-slider v-model="clusterSettingForm.playerNum" :max="100" :min="2" show-input size="small"/>
              </el-form-item>
              <el-form-item :label="t('setting.baseForm.backDays')" prop="backDays" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <el-slider v-model="clusterSettingForm.backDays" :max="50" :min="5" show-input size="small"/>
              </el-form-item>
              <el-form-item :label="t('setting.baseForm.vote')" prop="vote" :style="isMobile?'padding-top: 0px':'padding-top: 29px'">
                <el-switch v-model="clusterSettingForm.vote"/>
              </el-form-item>
              <el-form-item :label="t('setting.baseForm.password')" :style="isMobile?'padding-top: 0px':'padding-top: 30px'">
                <el-input v-model="clusterSettingForm.password" autocomplete="new-password" show-password></el-input>
              </el-form-item>
              <el-form-item :label="t('setting.baseForm.token')" prop="token" :style="isMobile?'padding-top: 0px':'padding-top: 30px'">
                <el-input v-model="clusterSettingForm.token" show-password></el-input>
                <div class="el-form-item-msg">
                  <el-link :underline="false" href="https://accounts.klei.com"
                           target="_blank">{{ t('setting.baseForm.tokenHelp') }}
                  </el-link>
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </el-card>
        <el-card v-if="step===1" shadow="never">
          <template #header>
            <div class="card-header">
              <span>{{t('setting.worldSetting')}}</span>
              <div>
                <el-dropdown trigger="click" @command="handleCreateWorld">
                  <el-button :disabled="worldLevelDataTabName!=='Code'" type="success">
                    {{t('setting.oneClick')}}
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{clusterType: 'endless', worldType: 'ground'}"
                                        :disabled="clusterSettingForm.gameMode!=='endless'">
                        {{t('setting.endless')}}-{{t('setting.groundSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'endless', worldType: 'cave'}"
                                        :disabled="clusterSettingForm.gameMode!=='endless'">
                        {{t('setting.endless')}}-{{t('setting.caveSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'survival', worldType: 'ground'}"
                                        :disabled="clusterSettingForm.gameMode!=='survival'">
                        {{t('setting.survival')}}-{{t('setting.groundSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'survival', worldType: 'cave'}"
                                        :disabled="clusterSettingForm.gameMode!=='survival'">
                        {{t('setting.survival')}}-{{t('setting.caveSettingMobile')}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
          <el-scrollbar :height="windowHeight - 450">
            <el-tabs v-model="worldTabName" editable type="card" @edit="handleWorldTabsEdit"
                     @tab-change="handleWorldTabsEditChange" style="margin-right: 16px">
              <el-tab-pane v-for="world in worldForm" :key="world.name"
                           :label="language==='zh'?'世界':'World'"
                           :name="world.name">
                <el-row>
                  <el-form :ref="(el) => (dynamicWorldRefs[world.name] = el)"
                           :label-position="isMobile||language==='en'?'top':'left'" :model="world"
                           :rules="worldFormRules" :size="isMobile?'small':'large'"
                           inline label-width="120px" style="margin-top: 10px">
                    <div style="display: flex; flex-wrap: wrap;">
                      <el-form-item :label="t('setting.isMaster')" prop="isMaster" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.isMasterTip')" effect="light" placement="top">
                          <el-switch v-model="world.isMaster" :active-text="language==='zh'?'是':'Y'"
                                     :inactive-text="language==='zh'?'否':'N'"
                                     inline-prompt
                          ></el-switch>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.system.encodeUserPath.divider')" prop="encodeUserPath" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.encodeUserPathTip')" effect="light"
                                    placement="top">
                          <el-switch v-model="world.encodeUserPath" :active-text="language==='zh'?'是':'Y'"
                                     :inactive-text="language==='zh'?'否':'N'"
                                     inline-prompt
                          ></el-switch>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.roomWorldForm.id')" prop="id" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.idTip')" effect="light" placement="top">
                          <el-input v-model.number="world.id" :disabled="world.saved" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.serverPort')" prop="serverPort" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.serverPortTip')" effect="light" placement="top">
                          <el-input v-model.number="world.serverPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.roomWorldForm.shardMasterPort')"
                                    prop="shardMasterPort" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.noEdit')+'，cluster.ini -> [SHARD] -> master_port'"
                                    effect="light" placement="top">
                          <el-input v-model.number="world.shardMasterPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.roomWorldForm.steamMasterPort')"
                                    prop="steamMasterPort" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.noEdit')+'，server.ini -> [STEAM] -> server_master_port'"
                                    effect="light" placement="top">
                          <el-input v-model.number="world.steamMasterPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.roomWorldForm.steamAuthenticationPort')"
                                    prop="steamAuthenticationPort" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.noEdit')+'，server.ini -> [STEAM] -> authentication_port'"
                                    effect="light" placement="top">
                          <el-input v-model.number="world.steamAuthenticationPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.shardMasterIp')" prop="shardMasterIp" style="width: 250px">
                        <el-tooltip :show-after="100" :content="t('setting.shardMasterIpTip')"
                                    effect="light" placement="top">
                          <el-input v-model="world.shardMasterIp" :disabled="world.isMaster"
                                    size="default"/>
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item :label="t('setting.roomWorldForm.clusterKey')" prop="clusterKey" style="width: 250px">
                        <el-tooltip :show-after="100"
                                    :content="t('setting.clusterKeyTip')"
                                    effect="light" placement="top">
                          <el-input v-model="world.clusterKey" autocomplete="new-password" show-password size="default"
                                    type="password"/>
                        </el-tooltip>
                      </el-form-item>
                    </div>
                  </el-form>
                </el-row>
                <div style="width: 99%">
                  <el-tabs v-model="worldLevelDataTabName" @tab-change="handleWorldTabChange">
                    <el-tab-pane :label="language==='zh'?'配置文件':'Code'" name="Code">
                      <div style="width: 100%">
                        <el-form :model="world">
                          <el-form-item>
                            <sc-code-editor v-model="world.levelData"
                                            :height="windowHeight * 0.5"
                                            :theme="isDark?'darcula':'idea'"
                                            mode="lua" style="width: 100%">
                            </sc-code-editor>
                          </el-form-item>
                        </el-form>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane
                      v-if="(clusterSettingForm.gameMode==='endless'||clusterSettingForm.gameMode==='survival') && world.levelData!==''"
                      :label="t('setting.tabVisualization')" lazy name="Visualization">
                      <template v-if="visualizationType==='forest' && Object.keys(overridesObj).length!==0">
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.groundVisualizationRule') }}</span> -
                          {{ t('setting.groundVisualizationRuleItem.global') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in groundWorldRule.global">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.events">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.survivors">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.world">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.resourceRegrowth">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.unnaturalPortalResource">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.creatures">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.hostileCreatures">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldRule.giants">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldGeneration.global">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldGeneration.world">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldGeneration.resources">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldGeneration.creaturesAndSpawners">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
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
                          <template v-for="(i, key) in groundWorldGeneration.hostileCreaturesAndSpawners">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                      </template>
                      <template v-if="visualizationType==='cave' && Object.keys(overridesObj).length!==0">
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                          {{ t('setting.cavesVisualizationRuleItem.world') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldRule.world">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                          {{ t('setting.cavesVisualizationRuleItem.resourceRegrowth') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldRule.resourceRegrowth">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                          {{ t('setting.cavesVisualizationRuleItem.creatures') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldRule.creatures">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                          {{ t('setting.cavesVisualizationRuleItem.hostileCreatures') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldRule.hostileCreatures">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationRule') }}</span> -
                          {{ t('setting.cavesVisualizationRuleItem.giants') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldRule.giants">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                          {{ t('setting.cavesVisualizationGenerationItem.world') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldGeneration.world">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="caveOverrideWorldGenerationWorld[i].configs"
                                                :customConfigsValue="caveOverrideWorldGenerationWorld[i].customConfigsValue"
                                                :defaultModelValue="caveOverrideWorldGenerationWorld[i].modelValue"
                                                :i18n="caveOverrideWorldGenerationWorld[i].i18n"
                                                :image="caveOverrideWorldGenerationWorld[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                          {{ t('setting.cavesVisualizationGenerationItem.resources') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldGeneration.resources">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                          {{ t('setting.cavesVisualizationGenerationItem.creaturesAndSpawners') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldGeneration.creaturesAndSpawners">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                        <el-divider content-position="center"><span
                          style="font-weight: bolder">{{ t('setting.cavesVisualizationGeneration') }}</span> -
                          {{ t('setting.cavesVisualizationGenerationItem.hostileCreaturesAndSpawners') }}
                        </el-divider>
                        <div class="item-container">
                          <template v-for="(i, key) in cavesWorldGeneration.hostileCreaturesAndSpawners">
                            <div>
                              <LevelDataSetting :key="key"
                                                v-model="overridesObj[i]"
                                                :configs="overrides[i].configs"
                                                :customConfigsValue="overrides[i].customConfigsValue"
                                                :defaultModelValue="overrides[i].modelValue"
                                                :i18n="overrides[i].i18n"
                                                :image="overrides[i].image"
                                                :name="i"
                                                @changeModelValue="handleModelValueChange"
                              />
                            </div>
                          </template>
                        </div>
                      </template>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-scrollbar>
        </el-card>
        <el-card v-if="step===2" shadow="never">
          <div v-if="worldForm.length > 2" class="tip_warning">
            <div style="display: flex; align-items: center">
              <span>
                {{t('setting.multiWorldTip')}}
              </span>
              <el-button size="small" style="margin-left: 10px"
                         type="warning" @click="openMultiWorldModAddDialog"
              >
                {{language==='zh'?'多层世界':'Multi-world'}}
              </el-button>
            </div>
          </div>
          <el-form :model="clusterModForm">
            <el-form-item>
              <sc-code-editor v-model="clusterModForm.mod" :height="windowHeight - 401"
                              :theme="isDark?'darcula':'idea'"
                              mode="lua" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===3" shadow="never">
          <div :style="{height: `${windowHeight - 381}px`}" class="fcc">
            <el-result :sub-title="t('setting.finish.description')" :title="t('setting.finish.title')" icon="success"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card shadow="never">
          <div style="display: flex; justify-content: flex-end;">
            <el-button v-if="step>0" @click="handlePrev">{{ t('setting.button.prev') }}</el-button>
            <el-button v-if="step<3" type="primary" :loading="nextButtonLoading" @click="handleNext">{{ t('setting.button.next') }}</el-button>
            <el-dropdown v-if="step===3" style="margin-left: 12px" trigger="click" @command="handleCommand">
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
    <el-dialog v-model="multiWorldModAddDialog" width="50%">
      <template #header>
        {{t('setting.multiWorldDialog.title')}}
      </template>
      <div class="tip_warning">
        {{t('setting.multiWorldDialog.tip')}}
      </div>
      <div style="margin: 50px">
        <el-form :model="multiWorldModNameForm" label-position="top">
          <el-form-item v-for="world in worldForm">
            <template #label>
              <div style="display: flex; align-items: center">
                <span style="margin-right: 10px">{{ world.name }}</span>
                <el-tag v-if="getWorldType(world.levelData)==='forest'" type="primary">
                  {{language==='zh'?'地面':'Ground'}}
                </el-tag>
                <el-tag v-if="getWorldType(world.levelData)==='cave'" type="info">
                  {{language==='zh'?'洞穴':'Cave'}}
                </el-tag>
              </div>
            </template>
            <el-input v-model="multiWorldModNameForm[`${world.id}`]"
                      :placeholder="t('setting.multiWorldDialog.placeholder1')"
                      style="width: 60%"/>
            <el-input v-model="multiWorldModNumForm[`${world.id}`]"
                      :placeholder="t('setting.multiWorldDialog.placeholder2')"
                      type="number"
                      style="margin-left: 3%;width: 37%"/>
          </el-form-item>
          <div style="display: flex; justify-content: flex-end; padding-top: 10px">
            <el-button type="primary" @click="handleGenerateModSetting">
              {{language==='zh'?'生成配置':'Generate'}}
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script name="settingsRoom" setup>
import {ArrowDown, Plus} from "@element-plus/icons-vue";
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {useRoute, useRouter} from "vue-router";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
import systemApi from "@/api/system"
import luaparse from 'luaparse'
import luamin from 'lua-format'
import {koiMsgError, koiMsgSuccess} from "@/utils/koi.ts";
import {useI18n} from "vue-i18n";
import useGlobalStore from "@/stores/modules/global.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import {endless, survival} from "@/views/settings/components/leveldataoverride.js"
import {
  caveOverrideWorldGenerationWorld,
  cavesWorldGeneration,
  cavesWorldRule,
  groundWorldGeneration,
  groundWorldRule,
  overrides
} from "@/views/settings/components/levelDataMap.js";
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import useAuthStore from "@/stores/modules/auth.ts";
import {sleep} from "@/utils/tools.js";

const {t} = useI18n()

onMounted(async () => {
  windowHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    windowHeight.value = window.innerHeight;
  });
  await getAllClusters()
  await getMaxWorlds()
  await handleGetClusterSetting()
  generateWorldFormRefs()
})

const loading = ref(false)

const windowHeight = ref(0)

const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const authStore = useAuthStore()
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);
const userInfo = authStore.userInfo
const worldPortFactor = computed(() => {
  const clusters = allClusters.value || []
  const index = clusters.findIndex(c => c.clusterName === globalStore.selectedDstCluster)
  return index !== -1 ? index : 0
})

const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")

const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
const debouncedRefresh = debounce((editor) => {
  requestAnimationFrame(() => {
    if (editor) {
      editor.refresh();
    }
  });
}, 100);

const allClusters = ref([])
const getAllClusters = () => {
  settingApi.clusters.all.get().then(response => {
    allClusters.value = response.data
  })
}
const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
    if (globalStore.selectedDstCluster === null && globalStore.dstClusters !== null) {
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  })
}

const maxWorlds = ref(0)
const getMaxWorlds = () => {
  systemApi.userInfo.get().then(response => {
    maxWorlds.value = response.data.maxWorldsPerCluster
  })
}

const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.name);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name);
      refreshCurrentPage(true);
    });
  }, 0);
};

const step = ref(0)
const nextButtonLoading = ref(false)
const handleStepClick = (goStep) => {
  if (step.value > goStep) {
    step.value = goStep
  }
}
const handlePrev = () => {
  step.value--
}
const handleNext = async () => {
  if (step.value === 0) {
    clusterSettingFormRef.value.validate(async valid => {
      if (valid) {
        if (!hasWorlds.value) {
          worldTabIndex.value = 1
          worldTabName.value = 'World1'
          worldForm.value = [{
            id: 101,
            name: 'World1',
            isMaster: true,
            levelData: '',
            serverPort: 11001 + worldPortFactor.value * 10,
            shardMasterPort: 10888 + worldPortFactor.value * 10,
            steamMasterPort: 27018 + worldPortFactor.value * 10,
            steamAuthenticationPort: 8768 + worldPortFactor.value * 10,
            shardMasterIp: '127.0.0.1',
            clusterKey: 'supersecretkey',
            encodeUserPath: true,
            saved: false
          }]
        }
        step.value++
      }
    })
  }
  if (step.value === 1) {
    if (userInfo.role !== "admin") {
      if (worldForm.value.length > maxWorlds.value) {
        let msg = ""
        if (language.value === 'zh') {
          msg = `超过最大可创建世界数量，当前最大可创建世界数为${maxWorlds.value}`
        } else {
          msg = `Exceeds the maximum number of worlds that can be created. The current maximum is ${maxWorlds.value}`
        }
        koiMsgError(msg)
        return
      }
    }

    for (let key in dynamicWorldRefs) {
      if (dynamicWorldRefs?.key) {
        await dynamicWorldRefs[key].validate()
      }
    }
    for (let i of worldForm.value) {
      if (i.levelData === '') {
        koiMsgError(language.value === 'zh' ? '请输入世界配置' : 'Please input world configure')
        return
      }
      if (i.shardMasterPort !== worldForm.value[0].shardMasterPort) {
        koiMsgError(language.value === 'zh' ? '主节点端口必须一致' : 'Master Port must be same')
        return
      }
      try {
        luaparse.parse(i.levelData)
      } catch (e) {
        koiMsgError(t('setting.luaError'))
        return
      }
    }
    step.value++
    return
  }
  if (step.value === 2) {
    if (clusterModForm.value) {
      try {
        luaparse.parse(clusterModForm.value.mod);
        step.value++
      } catch (e) {
        koiMsgError(t('setting.luaError'))
      }
    } else {
      step.value++
    }
  }
}

const clusterSettingFormRef = ref()
const clusterSettingForm = ref({
  clusterName: globalStore.selectedDstCluster,
  name: '',
  description: '',
  gameMode: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: false,
  password: '',
  token: '',
})
const clusterSettingFormRules = {
  name: [{required: true, message: t('setting.roomBaseFormRules.name'), trigger: 'blur'}],
  masterPort: [{required: true, message: t('setting.roomBaseFormRules.masterPort'), trigger: 'blur'}],
  cavesPort: [{required: true, message: t('setting.roomBaseFormRules.cavesPort'), trigger: 'blur'}],
  gameMode: [{required: true, message: t('setting.roomBaseFormRules.gameMode'), trigger: 'change'}],
  token: [{required: true, message: t('setting.roomBaseFormRules.token'), trigger: 'blur'}],
}

const clusterModForm = ref({
  mod: '',
})

const hasWorlds = ref(false)
const handleGetClusterSetting = () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingApi.cluster.get(reqForm).then(response => {
    clusterSettingForm.value = response.data.clusterSetting
    if (response.data.worlds) {
      worldForm.value = response.data.worlds
      let maxIndex = 1
      let minIndex = 999999
      for (let world of worldForm.value) {
        let index = parseInt(world.name.replace('World', ''))
        if (index > maxIndex) {
          maxIndex = index
        }
        if (index < minIndex) {
          minIndex = index
        }
        world['saved'] = true
      }
      worldTabIndex.value = maxIndex
      worldTabName.value = 'World' + minIndex.toString()
      hasWorlds.value = true
    } else {
      hasWorlds.value = false
    }
    clusterModForm.value.mod = response.data.mod
  })
}

const handleCommand = async (cmd) => {
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
    clusterSetting: clusterSettingForm.value,
    worlds: worldForm.value,
    mod: clusterModForm.value.mod,
    sysSetting: {},
  }
  loading.value = true
  settingApi.cluster.save.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    loading.value = false
    getClusters()
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}

const handleSaveAndRestart = () => {
  const reqForm = {
    clusterSetting: clusterSettingForm.value,
    worlds: worldForm.value,
    mod: clusterModForm.value.mod,
    sysSetting: {},
  }
  loading.value = true
  settingApi.cluster.saveRestart.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    loading.value = false
    getClusters()
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}
const handleGenerateNewWorld = () => {
  const reqForm = {
    clusterSetting: clusterSettingForm.value,
    worlds: worldForm.value,
    mod: clusterModForm.value.mod,
    sysSetting: {},
  }
  loading.value = true
  settingApi.cluster.saveRegenerate.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    loading.value = false
    getClusters()
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}

const overridesObj = ref({})

const generateOverridesObj = (levelData) => {
  if (levelData === '') {
    return
  }
  const ast = luaparse.parse(levelData)
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

const beautifyLua = (luaScript) => {
  let removedWatermark = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false,
  });
  removedWatermark = removedWatermark.replace(/--\[\[\n\t.+\n\t.+\n--]]\n\n\n\n\n/g, "");
  removedWatermark = removedWatermark.replace(/ = /g, "=");
  removedWatermark = removedWatermark.replace(/\t/g, "  ");

  removedWatermark = removedWatermark.replace(/overrides=\{ +(.+)\n/g, "overrides={\n    $1\n");
  removedWatermark = removedWatermark.replace(/^(\w+)=(.+)\n/gm, "    $1=$2\n");
  removedWatermark = removedWatermark.replace(/(.+)},\n/g, "$1\n  },\n");
  removedWatermark = removedWatermark.replace(/^ +?\n/gm, "");

  return removedWatermark;
};

const handleModelValueChange = debounce((data) => {
  const key = data.name
  const value = data.value
  for (let world of worldForm.value) {
    if (world.name === worldTabName.value) {
      const ast = luaparse.parse(world.levelData)
      // 提取 overrides 字段
      const overridesTable = extractOverrides(ast);
      for (let field of overridesTable.fields) {
        if (field.key.name === key) {
          field.value.raw = `"${value}"`
        }
      }
      world.levelData = astToLua(ast)
      break
    }
  }
}, 100)

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
    case 'TableKey':
      return `[${astToLua(astNode.key)}] = ${astToLua(astNode.value)}`;
    case 'TableValue':
      return astToLua(astNode.value);
    default:
      throw new Error(`Unsupported node type: ${astNode.type}`);
  }
}

const worldTabIndex = ref(1)
const worldTabName = ref('World1')
const worldForm = ref([{
  id: 101,
  name: 'World1',
  isMaster: true,
  levelData: '',
  serverPort: 11001 + worldPortFactor.value * 10,
  shardMasterPort: 10888 + worldPortFactor.value * 10,
  steamMasterPort: 27018 + worldPortFactor.value * 10,
  steamAuthenticationPort: 8768 + worldPortFactor.value * 10,
  shardMasterIp: '127.0.0.1',
  clusterKey: 'supersecretkey',
  encodeUserPath: true,
}])
const worldFormRules = {
  id: [{required: true, message: t('setting.roomWorldFormRules.id'), trigger: 'blur'}],
  isMaster: [{required: true, trigger: 'change'}],
  encodeUserPath: [{required: true, trigger: 'change'}],
  serverPort: [{required: true, message: t('setting.roomWorldFormRules.masterPort'), trigger: 'blur'}],
  shardMasterPort: [{required: true, message: t('setting.roomWorldFormRules.shardMasterPort'), trigger: 'blur'}],
  steamMasterPort: [{required: true, message: t('setting.roomWorldFormRules.steamMasterPort'), trigger: 'blur'}],
  steamAuthenticationPort: [{required: true, message: t('setting.roomWorldFormRules.steamAuthenticationPort'), trigger: 'blur'}],
  shardMasterIp: [{required: true, message: t('setting.roomWorldFormRules.shardMasterIp'), trigger: 'blur'}],
  clusterKey: [{required: true, message: t('setting.roomWorldFormRules.clusterKey'), trigger: 'blur'}],
}

const dynamicWorldRefs = {}
const generateWorldFormRefs = () => {
  for (let world of worldForm.value) {
    const worldIndex = worldForm.value.length
    worldTabIndex.value = worldIndex
    dynamicWorldRefs[`World${worldIndex}`] = ref()
  }
}
const handleWorldTabsEdit = (targetName, action) => {
  if (action === 'add') {
    worldTabIndex.value++
    const newTabName = `World${worldTabIndex.value}`
    dynamicWorldRefs[newTabName] = ref()
    worldForm.value.push({
      id: worldTabIndex.value + 100,
      name: newTabName,
      isMaster: false,
      levelData: '',
      serverPort: 11000 + worldTabIndex.value + worldPortFactor.value * 10,
      shardMasterPort: 10888 + worldPortFactor.value * 10,
      steamMasterPort: 27017 + worldTabIndex.value + worldPortFactor.value * 10,
      steamAuthenticationPort: 8767 + worldTabIndex.value + worldPortFactor.value * 10,
      shardMasterIp: '127.0.0.1',
      clusterKey: 'supersecretkey',
      encodeUserPath: true,
    })
    worldTabName.value = newTabName
  } else if (action === 'remove') {
    if (worldForm.value.length === 1) {
      koiMsgError(language.value === 'zh'?'每个房间至少含有一个世界':'Every room must include at least one world')
      return
    }
    const tabs = worldForm.value
    let activeName = worldTabName.value
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
    worldTabName.value = activeName
    worldForm.value = tabs.filter((tab) => tab.name !== targetName)
    delete dynamicWorldRefs[targetName]
  }
  worldLevelDataTabName.value = 'Code'
}

const worldLevelDataTabName = ref('Code')

const handleCreateWorld = (cmd) => {
  for (let world of worldForm.value) {
    if (world.name === worldTabName.value) {
      if (cmd.clusterType === 'endless') {
        if (cmd.worldType === 'ground') {
          world.levelData = endless.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = endless.caves
        }
      }
      if (cmd.clusterType === 'survival') {
        if (cmd.worldType === 'ground') {
          world.levelData = survival.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = survival.caves
        }
      }
    }
  }
}

const visualizationType = ref('')

const handleWorldTabChange = async (name) => {
  if (name === 'Visualization') {
    try {
      for (let world of worldForm.value) {
        if (world.name === worldTabName.value) {
          visualizationType.value = getWorldType(world.levelData)
          await generateOverridesObj(world.levelData)
          break
        }
      }
    } catch {
      koiMsgError(language.value === 'zh' ? '可视化配置加载失败' : 'Visualization load failed')
    }
  }
  if (name === 'Code') {
    await nextTick(() => {
      for (let world of worldForm.value) {
        if (world.name === worldTabName.value) {
          world.levelData = beautifyLua(world.levelData)
          break
        }
      }
    })
  }
}

const getWorldType = (levelData) => {
  const regex = /location\s*=\s*"([^"]*)"/;
  const match = levelData.match(regex);

  if (match) {
    return match[1]
  } else {
    return ""
  }
}

const handleWorldTabsEditChange = () => {
  worldLevelDataTabName.value = 'Code'
}

const multiWorldModAddDialog = ref(false)
const multiWorldModNameForm = ref({})
const multiWorldModNumForm = ref({})
const openMultiWorldModAddDialog = () => {
  multiWorldModNameForm.value = {}
  multiWorldModNumForm.value = {}
  multiWorldModAddDialog.value = true
}

const handleGenerateModSetting = () => {
  if (Object.keys(multiWorldModNameForm.value).length!==worldForm.value.length) {
    koiMsgError(language.value === 'zh'?'世界名为必填项':'World name is required')
    return
  }

  let worldName = ""
  for (let world of worldForm.value) {
    worldName = worldName + `["${world.id}"]="${multiWorldModNameForm.value[world.id]}",`
  }

  let worldNum = ""
  for (let world of worldForm.value) {
    worldNum = worldNum +`["${world.id}"]="${multiWorldModNumForm.value[world.id]}",`
  }

  worldName = worldName.slice(0, -1)
  worldNum = worldNum.slice(0, -1)

  let multiModSetting = `return {["workshop-1438233888"]={
    configuration_options={
      auto_balancing=true,
      extra_worlds={},
      ignore_sinkholes=false,
      invisible_worlds={},
      language="auto",
      migration_postern=false,
      no_bat=true,
      population_limit={${worldNum}},
      say_dest=true,
      world_name={${worldName}},
      world_prompt=true
    },
    enabled=true
  }}`
  if (clusterModForm.value.mod === "") {
    clusterModForm.value.mod = "return {}"
  }
  const modAst = luaparse.parse(clusterModForm.value.mod)
  const multiModSettingAst = luaparse.parse(multiModSetting)

  for (const [i, v] of modAst.body[0].arguments[0].fields.entries()) {
    if (v.key.raw === "\"workshop-1438233888\"") {
      modAst.body[0].arguments[0].fields.splice(i, 1)
    }
  }

  modAst.body[0].arguments[0].fields.push(multiModSettingAst.body[0].arguments[0].fields[0])
  clusterModForm.value.mod = beautifyLua(astToLua(modAst))
  multiWorldModAddDialog.value = false
}

watch(() => globalStore.selectedDstCluster, (newValue) => {
  if (newValue) {
    nextTick(() => {
      handleRefresh()
    })
  }
}, {immediate: false})

</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
}
:deep(.el-tabs__new-tab) {
  position: relative;
  border: none !important;
  overflow: hidden;
  border-radius: 2px;
  height: 24px;
  width: 24px;
  background: transparent !important;
  z-index: 1;
}

/* 彩虹边框层 */
:deep(.el-tabs__new-tab)::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  //background: linear-gradient(-45deg, #fbf8cc, #fde4cf, #ffcfd2, #f1c0e8, #cfbaf0, #a3c4f3, #90dbf4, #8eecf5, #98f5e1, #b9fbc0);
  //background: linear-gradient(-45deg, #cdb4db, #ffc8dd, #ffafcc, #bde0fe, #a2d2ff);
  //background: linear-gradient(-45deg, #264653, #2a9d8f, #e9c46a, #f4a261, #e76f51);
  //background: linear-gradient(-45deg, #8ecae6, #219ebc, #023047, #ffb703, #fb8500);
  background: linear-gradient(-45deg, #e63946, #f1faee, #a8dadc, #457b9d, #1d3557);
  animation: rotateBorder 6s linear infinite;
  z-index: -1;
}

/* 内层遮罩，显示实际内容 */
:deep(.el-tabs__new-tab)::after {
  content: '';
  position: absolute;
  inset: 8%; /* 调整这个值控制边框粗细 */
  background: var(--el-bg-color); /* 背景色与页面一致 */
  border-radius: 1px; /* 比外层小1px */
  z-index: -1;
}

/* 顺时针旋转动画 */
@keyframes rotateBorder {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

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
          <el-scrollbar :height="windowHeight - 438">
            <el-form ref="clusterSettingFormRef" :label-position="isMobile?'top':'left'"
                     :label-width="isMobile?'70':'auto'"
                     hide-required-asterisk
                     :model="clusterSettingForm" :rules="clusterSettingFormRules"
                     :size="isMobile?'small':'large'" style="margin-right: 16px">
              <el-form-item prop="name" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span>{{t('setting.baseForm.room')}}</span>
                    <el-tooltip :content="t('setting.tip.stepOne.name')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="clusterSettingForm.name">
                  <template #append>
                    <el-tooltip :content="t('setting.iconTip')" effect="light" placement="top">
                      <el-button icon="sc-icon-EmotionLine" @click="handleOpenEmojiDialog('name')"/>
                    </el-tooltip>
                  </template>
                </el-input>
              </el-form-item>
              <div v-if="!isMobile"></div>
              <el-form-item prop="description" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span>{{t('setting.baseForm.description')}}</span>
                    <el-tooltip :content="t('setting.tip.stepOne.description')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="clusterSettingForm.description">
                  <template #append>
                    <el-tooltip :content="t('setting.iconTip')" effect="light" placement="top">
                      <el-button icon="sc-icon-EmotionLine" @click="handleOpenEmojiDialog('description')"/>
                    </el-tooltip>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="gameMode" :style="isMobile?'padding-top: 0px':'padding-top: 25px'" style="display: flex; align-items: center;">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span>{{t('setting.baseForm.gameMode.name')}}</span>
                    <el-tooltip :content="t('setting.tip.stepOne.gameMode')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-radio-group v-model="clusterSettingForm.gameMode" style="margin-right: 20px;">
                  <el-radio :label="t('setting.baseForm.gameMode.endless')" value="endless"/>
                  <el-radio :label="t('setting.baseForm.gameMode.survival')" value="survival"/>
                  <el-radio :label="t('setting.baseForm.gameMode.relaxed')" value="relaxed"/>
                  <el-radio :label="t('setting.baseForm.gameMode.wilderness')" value="wilderness"/>
                  <el-radio :label="t('setting.baseForm.gameMode.lightsOut')" value="lightsOut"/>
                  <el-radio :label="t('setting.baseForm.gameMode.lavaarena')" value="lavaarena"/>
                  <el-radio :label="t('setting.baseForm.gameMode.quagmire')" value="quagmire"/>
                  <el-radio :label="t('setting.baseForm.gameMode.custom')" value="custom"/>
                </el-radio-group>
                <el-input v-if="clusterSettingForm.gameMode==='custom'"
                          v-model="clusterSettingForm.customGameMode"
                          :placeholder="t('setting.baseForm.gameMode.customInputPlaceholder')"
                          style="flex: 0 0 auto; width: 25%"></el-input>
              </el-form-item>
              <el-form-item prop="playerNum" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span>{{t('setting.baseForm.playerNum')}}</span>
                    <el-tooltip :content="t('setting.tip.stepOne.playerNum')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-slider v-model="clusterSettingForm.playerNum" :max="64" :min="2" show-input size="small"/>
              </el-form-item>
              <el-form-item prop="backDays" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span>{{t('setting.baseForm.backDays')}}</span>
                    <el-tooltip :content="t('setting.tip.stepOne.backDays')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-slider v-model="clusterSettingForm.backDays" :max="64" :min="5" show-input size="small"/>
              </el-form-item>
              <el-row>
                <el-col :lg="8" :md="8" :sm="24" :span="8" :xs="24">
                  <el-form-item prop="vote" :style="isMobile?'padding-top: 0px':'padding-top: 29px'">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span>{{t('setting.baseForm.vote')}}</span>
                        <el-tooltip :content="t('setting.tip.stepOne.vote')" effect="light" placement="top">
                          <el-icon size="14" style="margin-left: 2px">
                            <QuestionFilled/>
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-switch v-model="clusterSettingForm.vote"/>
                  </el-form-item>
                </el-col>
                <el-col :lg="8" :md="8" :sm="24" :span="8" :xs="24">
                  <el-form-item prop="vote" :style="isMobile?'padding-top: 0px':'padding-top: 29px'">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span>{{t('setting.baseForm.pauseEmptyDisabled')}}</span>
                        <el-tooltip :content="t('setting.tip.stepOne.pauseEmptyDisabled')" effect="light" placement="top">
                          <el-icon size="14" style="margin-left: 2px">
                            <QuestionFilled/>
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-switch v-model="clusterSettingForm.pauseEmptyDisabled"
                               :active-value="false" :inactive-value="true"/>
                  </el-form-item>
                </el-col>
                <el-col :lg="8" :md="8" :sm="24" :span="8" :xs="24">
                  <el-form-item prop="pvp" :style="isMobile?'padding-top: 0px':'padding-top: 25px'">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span>{{t('setting.baseForm.pvp')}}</span>
                        <el-tooltip :content="t('setting.tip.stepOne.pvp')" effect="light" placement="top">
                          <el-icon size="14" style="margin-left: 2px">
                            <QuestionFilled/>
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-switch v-model="clusterSettingForm.pvp"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :style="isMobile?'padding-top: 0px':'padding-top: 30px'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span>{{t('setting.baseForm.password')}}</span>
                    <el-tooltip :content="t('setting.tip.stepOne.password')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input v-model="clusterSettingForm.password" autocomplete="new-password" show-password></el-input>
              </el-form-item>
              <el-form-item prop="token" :style="isMobile?'padding-top: 0px':'padding-top: 30px'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span>{{t('setting.baseForm.token')}}</span>
                    <el-tooltip :content="t('setting.tip.stepOne.token')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
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
                  <el-button :disabled="worldLevelDataTabName!=='Code'||(
                  clusterSettingForm.gameMode!=='endless'&&
                  clusterSettingForm.gameMode!=='survival'&&
                  clusterSettingForm.gameMode!=='relaxed'&&
                  clusterSettingForm.gameMode!=='wilderness'&&
                  clusterSettingForm.gameMode!=='lightsOut'&&
                  clusterSettingForm.gameMode!=='lavaarena')"
                             type="success">
                    {{t('setting.oneClick')}}
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{clusterType: 'endless', worldType: 'ground'}"
                                        v-if="clusterSettingForm.gameMode==='endless'">
                        {{t('setting.endless')}}-{{t('setting.groundSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'endless', worldType: 'cave'}"
                                        v-if="clusterSettingForm.gameMode==='endless'">
                        {{t('setting.endless')}}-{{t('setting.caveSettingMobile')}}
                      </el-dropdown-item>

                      <el-dropdown-item :command="{clusterType: 'survival', worldType: 'ground'}"
                                        v-if="clusterSettingForm.gameMode==='survival'">
                        {{t('setting.survival')}}-{{t('setting.groundSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'survival', worldType: 'cave'}"
                                        v-if="clusterSettingForm.gameMode==='survival'">
                        {{t('setting.survival')}}-{{t('setting.caveSettingMobile')}}
                      </el-dropdown-item>

                      <el-dropdown-item :command="{clusterType: 'relaxed', worldType: 'ground'}"
                                        v-if="clusterSettingForm.gameMode==='relaxed'">
                        {{t('setting.baseForm.gameMode.relaxed')}}-{{t('setting.groundSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'relaxed', worldType: 'cave'}"
                                        v-if="clusterSettingForm.gameMode==='relaxed'">
                        {{t('setting.baseForm.gameMode.relaxed')}}-{{t('setting.caveSettingMobile')}}
                      </el-dropdown-item>

                      <el-dropdown-item :command="{clusterType: 'wilderness', worldType: 'ground'}"
                                        v-if="clusterSettingForm.gameMode==='wilderness'">
                        {{t('setting.baseForm.gameMode.wilderness')}}-{{t('setting.groundSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'wilderness', worldType: 'cave'}"
                                        v-if="clusterSettingForm.gameMode==='wilderness'">
                        {{t('setting.baseForm.gameMode.wilderness')}}-{{t('setting.caveSettingMobile')}}
                      </el-dropdown-item>

                      <el-dropdown-item :command="{clusterType: 'lightsOut', worldType: 'ground'}"
                                        v-if="clusterSettingForm.gameMode==='lightsOut'">
                        {{t('setting.baseForm.gameMode.lightsOut')}}-{{t('setting.groundSettingMobile')}}
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'lightsOut', worldType: 'cave'}"
                                        v-if="clusterSettingForm.gameMode==='lightsOut'">
                        {{t('setting.baseForm.gameMode.lightsOut')}}-{{t('setting.caveSettingMobile')}}
                      </el-dropdown-item>

                      <el-dropdown-item :command="{clusterType: 'lavaarena', worldType: 'ground'}"
                                        v-if="clusterSettingForm.gameMode==='lavaarena'">
                        {{t('setting.baseForm.gameMode.lavaarena')}}-{{t('setting.groundSettingMobile')}}
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="caveOverrideWorldGenerationWorld[i]?.configs || ['undefined']"
                                                :customConfigsValue="caveOverrideWorldGenerationWorld[i]?.customConfigsValue || {}"
                                                :defaultModelValue="caveOverrideWorldGenerationWorld[i]?.modelValue || 'undefined'"
                                                :i18n="caveOverrideWorldGenerationWorld[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="caveOverrideWorldGenerationWorld[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
                                                :configs="overrides[i]?.configs || ['undefined']"
                                                :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                                :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                                :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                                :image="overrides[i]?.image || 'undefined.png'"
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
          <div class="tip">
            <div style="display: flex; align-items: center">
              <span>
                {{t('setting.multiWorldTip')}}
              </span>
              <el-button size="small" style="margin-left: 10px"
                         type="primary" @click="openMultiWorldModAddDialog"
              >
                {{language==='zh'?'多层世界':'Multi-world'}}
              </el-button>
            </div>
          </div>
          <el-form :model="clusterModForm">
            <el-form-item>
              <sc-code-editor v-model="clusterModForm.mod" :height="windowHeight - 481"
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
    <el-dialog v-model="multiWorldModAddDialog" width="65%">
      <template #header>
        {{t('setting.multiWorldDialog.title')}}
      </template>
      <div class="tip_warning">
        {{t('setting.multiWorldDialog.tip')}}
      </div>
      <div style="margin: 10px">
        <el-form :model="multiWorldModForm" label-position="top">
          <el-form-item v-for="world in multiWorldModForm">
            <el-input v-model="world.ID"
                      :placeholder="t('setting.multiWorldDialog.placeholder0')"
                      type="number"
                      style="width: 20%"/>
            <el-input v-model="world.name"
                      :placeholder="t('setting.multiWorldDialog.placeholder1')"
                      style="margin-left: 2%;width: 48%"/>
            <el-input v-model="world.maxPlayers"
                      :placeholder="t('setting.multiWorldDialog.placeholder2')"
                      type="number"
                      style="margin-left: 2%;width: 28%"/>

          </el-form-item>
          <div style="display: flex; justify-content: flex-end; padding-top: 10px">
            <el-button type="success" @click="multiWorldModForm.push({ID:undefined,name:'',maxPlayers:undefined})">
              {{language==='zh'?'新增一条':'New Line'}}
            </el-button>
            <el-button type="primary" @click="handleGenerateModSetting">
              {{language==='zh'?'生成配置':'Generate'}}
            </el-button>
          </div>
        </el-form>
        <el-divider v-if="multiWorldModContent"/>
        <MdPreview ref="threeCodeOneRef"
                   v-if="multiWorldModContent"
                   :modelValue="multiWorldModContent"
                   :theme="isDark?'dark':'light'"
                   previewTheme="github"/>
      </div>
    </el-dialog>
    <el-dialog v-model="emojiDialogVisible" width="65%">
      <template #header>
        <div style="display: flex; align-items: center">
          <el-switch v-model="insertOrCopy"
                     active-value="insert"
                     inactive-value="copy"
                     :active-text="language==='zh'?'插入模式':'Insert Mode'"
                     :inactive-text="language==='zh'?'复制模式':'Copy Mode'"
          ></el-switch>
        </div>
      </template>
      <div v-if="insertOrCopy==='insert'" style="width: 100%;">
        <el-input v-if="clusterSettingStepOneInput==='name'"
                  v-model="clusterSettingForm.name" style="width: 100%"></el-input>
        <el-input v-if="clusterSettingStepOneInput==='description'"
                  v-model="clusterSettingForm.description" style="width: 100%"></el-input>
      </div>
      <div class="emoji-container mt-4 mb-6">
        <div v-for="e in Emoji" class="emoji-item" @click="handleEmoji(e)">
          {{e}}
        </div>
      </div>

      <template #footer>
        <el-link v-if="language==='zh'" href="https://www.bilibili.com/opus/814456568458248259" target="_blank" type="info" underline="never">
          感谢B站长鸽门徒提供的饥荒表情字体
        </el-link>
        <el-link v-else href="https://www.bilibili.com/opus/814456568458248259" target="_blank" type="info" underline="never">
          Thanks to Bilibili user 长鸽门徒 for providing the DST emoji font.
        </el-link>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {IceTea, ArrowDown, Plus} from "@element-plus/icons-vue";
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
import {endless, survival, relaxed, wilderness, lightsOut, lavaarena} from "@/views/settings/components/leveldataoverride.js"
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
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {generateRandomString} from "@/utils/tools.js";
import Emoji from './components/emoji'

const {t} = useI18n()

onMounted(async () => {
  clusterKey.value = generateRandomString(14)
  windowHeight.value = window.innerHeight;
  window.addEventListener("resize", () => {
    windowHeight.value = window.innerHeight;
  });
  await getAllClusters()
  await getClustersWorldPort()
  await getMaxWorlds()
  await handleGetClusterSetting()
  generateWorldFormRefs()
})

const clusterKey = ref('')

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
    if (clusterSettingForm.value.gameMode==='custom' && clusterSettingForm.value.customGameMode==='') {
      koiMsgError(language.value==='zh'?'请输入自定义模式':'Please input custom game mode')
      return
    }
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
            clusterKey: clusterKey.value,
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

    const worldPortKeys = ['serverPort', 'shardMasterPort', 'steamMasterPort', 'steamAuthenticationPort']
    for (let world of worldForm.value) {
      for (const clustersWorldPortItem of clustersWorldPort.value) {
        if (clustersWorldPortItem.clusterName !== globalStore.selectedDstCluster) {
          for (let worldPortKey of worldPortKeys) {
            if (clustersWorldPortItem.worldPort === null) {
              continue
            }
            if (clustersWorldPortItem.worldPort.includes(world[worldPortKey])) {
              koiMsgError(`[${t(`setting.roomWorldForm.${worldPortKey}`)}]:${world[worldPortKey]} ${language.value==='zh'?'端口冲突，请检查并修改':'Port Conflicted, please check and modify'}`, 3000)
              return
            }
          }
        }
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
  customGameMode: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: false,
  consoleEnabled: true,
  pauseEmptyDisabled: false,
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
        clusterKey.value = world.clusterKey
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
  if (clusterSettingForm.value.gameMode !== 'custom') {
    clusterSettingForm.value.customGameMode = ''
  }
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
  if (clusterSettingForm.value.gameMode !== 'custom') {
    clusterSettingForm.value.customGameMode = ''
  }
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
  if (clusterSettingForm.value.gameMode !== 'custom') {
    clusterSettingForm.value.customGameMode = ''
  }
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
  clusterKey: clusterKey.value,
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
      clusterKey: clusterKey.value,
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

      if (cmd.clusterType === 'relaxed') {
        if (cmd.worldType === 'ground') {
          world.levelData = relaxed.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = relaxed.caves
        }
      }

      if (cmd.clusterType === 'wilderness') {
        if (cmd.worldType === 'ground') {
          world.levelData = wilderness.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = wilderness.caves
        }
      }

      if (cmd.clusterType === 'lightsOut') {
        if (cmd.worldType === 'ground') {
          world.levelData = lightsOut.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = lightsOut.caves
        }
      }

      if (cmd.clusterType === 'lavaarena') {
        if (cmd.worldType === 'ground') {
          world.levelData = lightsOut.master
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
const multiWorldModContent = ref('')
const multiWorldModForm = ref([])

const openMultiWorldModAddDialog = () => {
  multiWorldModForm.value = [
    {
      ID: undefined,
      name: '',
      maxPlayers: undefined
    }
  ]
  multiWorldModContent.value = ''
  multiWorldModAddDialog.value = true
}

const handleGenerateModSetting = () => {
  let worldName = ""
  let worldMaxPlayers = ""
  for (let world of multiWorldModForm.value) {
    if (!world.ID) {
      koiMsgError(language.value === 'zh'?'世界ID未填写':'World ID is required')
      return
    }
    if (!world.name) {
      koiMsgError(language.value === 'zh'?'世界名未填写':'World name is required')
      return
    }
    if (!world.maxPlayers) {
      koiMsgError(language.value === 'zh'?'世界最大玩家数未填写':'World max players is required')
      return
    }

    worldName = worldName + `["${world.ID}"]="${world.name}",`
    worldMaxPlayers = worldMaxPlayers +`["${world.ID}"]="${world.maxPlayers}",`
  }

  multiWorldModContent.value = `
  ["workshop-1438233888"]={
    configuration_options={
      auto_balancing=true,
      extra_worlds={},
      ignore_sinkholes=false,
      invisible_worlds={},
      language="auto",
      migration_postern=false,
      no_bat=true,
      population_limit={${worldMaxPlayers}},
      say_dest=true,
      world_name={${worldName}},
      world_prompt=true
    },
    enabled=true
  }`
  multiWorldModContent.value = '```lua ::open\n' + multiWorldModContent.value
}

const clustersWorldPort = ref([])
const getClustersWorldPort = () => {
  settingApi.clustersWorldPort.get().then(response => {
    clustersWorldPort.value = response.data
  })
}

const emojiDialogVisible = ref(false)
const clusterSettingStepOneInput = ref('name')
const insertOrCopy = ref('copy')
const handleOpenEmojiDialog = (x) => {
  clusterSettingStepOneInput.value = x
  emojiDialogVisible.value = true
}
const handleEmoji = (e) => {
  if (insertOrCopy.value === 'insert') {
    if (clusterSettingStepOneInput.value === 'name') {
      clusterSettingForm.value.name = clusterSettingForm.value.name + e
    } else {
      clusterSettingForm.value.description = clusterSettingForm.value.description + e
    }
  } else {
    copyToClipboard(e).then(() => {
      let message
      if (language.value === 'zh') {
        message = '复制成功'
      } else {
        message = 'Copy Success'
      }
      koiMsgSuccess(message)
    }).catch(() => {
      let message
      if (language.value === 'zh') {
        message = '复制失败'
      } else {
        message = 'Copy Fail'
      }
    })
  }
}

function copyToClipboard(text, onSuccess, onError) {
  // 返回一个Promise以便可以使用await或.then()
  return new Promise((resolve, reject) => {
    // 检查是否支持navigator.clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代剪贴板API
      navigator.clipboard.writeText(text)
        .then(() => {
          if (typeof onSuccess === 'function') onSuccess(text);
          resolve(text);
        })
        .catch(err => {
          if (typeof onError === 'function') onError(err, text);
          reject(err);
        });
    } else {
      // 降级方案：使用document.execCommand
      try {
        // 创建一个临时的textarea元素
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // 防止页面滚动
        textarea.style.opacity = '0'; // 隐藏元素

        // 将textarea添加到DOM中
        document.body.appendChild(textarea);

        // 选中文本
        textarea.select();

        // 执行复制命令
        const success = document.execCommand('copy');

        // 移除临时元素
        document.body.removeChild(textarea);

        if (success) {
          if (typeof onSuccess === 'function') onSuccess(text);
          resolve(text);
        } else {
          throw new Error('复制失败，execCommand返回false');
        }
      } catch (err) {
        if (typeof onError === 'function') onError(err, text);
        reject(err);
      }
    }
  });
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
  grid-template-columns: repeat(auto-fill, 20px);
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

:deep(.el-tabs__new-tab)::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(-45deg, #70d6ff, #ff70a6, #ff9770, #ffd670, #e9ff70);
  animation: rotateBorder 6s linear infinite;
  z-index: -1;
}

:deep(.el-tabs__new-tab)::after {
  content: '';
  position: absolute;
  inset: 12%;
  background: var(--el-bg-color);
  border-radius: 1px;
  z-index: -1;
}

@keyframes rotateBorder {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.emoji-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  gap: 2rem;
  justify-content: center;
}

.emoji-item {
  font-size: 3rem;
  cursor: pointer;
}
.emoji-item:hover {
  background: #409EFF;
  transition: background 0.5s;
}
</style>

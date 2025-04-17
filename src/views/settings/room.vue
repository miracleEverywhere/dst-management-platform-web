<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never">
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?$t('setting.roomSettingMobile'):$t('setting.roomSetting')" @click="handleStepClick(0)"/>
            <el-step :title="isMobile?$t('setting.worldSettingMobile'):$t('setting.worldSetting')" @click="handleStepClick(1)"/>
            <el-step :title="isMobile?$t('setting.modSettingMobile'):$t('setting.modSetting')" @click="handleStepClick(3)"/>
            <el-step :title="isMobile?$t('setting.finishSettingMobile'):$t('setting.finishSetting')"
                     @click="handleStepClick(2)"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 5px">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24">
        <el-card v-if="step===0" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                {{ t('setting.roomSetting') }}
              </span>
            </div>
          </template>
          <el-form ref="clusterSettingFormRef" :label-position="isMobile?'top':'left'" :label-width="isMobile?'70':'auto'"
                   :model="clusterSettingForm" :rules="clusterSettingFormRules" :size="isMobile?'small':'large'">
            <el-form-item :label="t('setting.baseForm.room')" prop="name">
              <el-input v-model="clusterSettingForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.description')" prop="description">
              <el-input v-model="clusterSettingForm.description"></el-input>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.gameMode.name')" prop="gameMode">
              <el-radio-group v-model="clusterSettingForm.gameMode">
                <el-radio :label="$t('setting.baseForm.gameMode.endless')" value="endless"/>
                <el-radio :label="$t('setting.baseForm.gameMode.survival')" value="survival"/>
                <el-radio :label="$t('setting.baseForm.gameMode.lavaarena')" value="lavaarena"/>
                <el-radio :label="$t('setting.baseForm.gameMode.quagmire')" value="quagmire"/>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.pvp')" prop="pvp">
              <el-switch v-model="clusterSettingForm.pvp"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.playerNum')" prop="playerNum">
              <el-slider v-model="clusterSettingForm.playerNum" :max="100" :min="2" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.backDays')" prop="backDays">
              <el-slider v-model="clusterSettingForm.backDays" :max="50" :min="5" show-input size="small"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.vote')" prop="vote">
              <el-switch v-model="clusterSettingForm.vote"/>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.password')">
              <el-input v-model="clusterSettingForm.password" autocomplete="new-password" show-password></el-input>
            </el-form-item>
            <el-form-item :label="t('setting.baseForm.token')" prop="token">
              <el-input v-model="clusterSettingForm.token" show-password></el-input>
              <div class="el-form-item-msg">
                <el-link :underline="false" href="https://accounts.klei.com"
                         target="_blank">{{ t('setting.baseForm.tokenHelp') }}
                </el-link>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===1" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <template #header>
            <div class="card-header">
              <span>世界设置</span>
              <div>
                <el-dropdown trigger="click" @command="handleCreateWorld">
                  <el-button :disabled="worldLevelDataTabName!=='Code'" type="success">
                    一键带入
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{clusterType: 'endless', worldType: 'ground'}"
                                        :disabled="clusterSettingForm.gameMode!=='endless'">
                        无尽-地面
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'endless', worldType: 'cave'}"
                                        :disabled="clusterSettingForm.gameMode!=='endless'">
                        无尽-洞穴
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'survival', worldType: 'ground'}"
                                        :disabled="clusterSettingForm.gameMode!=='survival'">
                        生存-地面
                      </el-dropdown-item>
                      <el-dropdown-item :command="{clusterType: 'survival', worldType: 'cave'}"
                                        :disabled="clusterSettingForm.gameMode!=='survival'">
                        生存-洞穴
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
          <el-tabs v-model="worldTabName" editable type="card" @edit="handleWorldTabsEdit"
                   @tab-change="handleWorldTabsEditChange">
            <el-tab-pane v-for="(world, index) in worldForm" :key="world.name"
                         :label="language==='zh'?'世界':'World'"
                         :name="world.name">
              <el-row>
                <el-form :ref="(el) => (dynamicWorldRefs[world.name] = el)"
                         :label-position="isMobile||language==='en'?'top':'left'" :model="world"
                         :rules="worldFormRules"
                         :size="isMobile?'small':'large'"
                         inline label-width="120px" style="margin-top: 10px">
                  <el-row>
                    <el-col :span="8" :xs="12">
                      <el-form-item label="主节点" prop="isMaster">
                        <el-tooltip :show-after="100" content="注意！一个集群中只能有一个主节点" effect="light" placement="top">
                          <el-switch v-model="world.isMaster" :active-text="language==='zh'?'是':'Y'"
                                     :inactive-text="language==='zh'?'否':'N'"
                                     inline-prompt
                          ></el-switch>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="12">
                      <el-form-item label="用户路径编码" prop="encodeUserPath">
                        <el-tooltip :show-after="100" content="是否存档数据的保存路径进行编码" effect="light" placement="top">
                          <el-switch v-model="world.encodeUserPath" :active-text="language==='zh'?'是':'Y'"
                                     :inactive-text="language==='zh'?'否':'N'"
                                     inline-prompt
                          ></el-switch>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="24">
                      <el-form-item label="游戏端口" prop="serverPort">
                        <el-tooltip :show-after="100" content="游戏暴露的udp端口" effect="light" placement="top">
                          <el-input v-model="world.serverPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" :xs="24">
                      <el-form-item :label="t('setting.roomWorldForm.shardMasterPort')"
                                    prop="shardMasterPort">
                        <el-tooltip :show-after="100" content="cluster.ini -> [SHARD] -> master_port" effect="light"
                                    placement="top">
                          <el-input v-model="world.shardMasterPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="24">
                      <el-form-item :label="t('setting.roomWorldForm.steamMasterPort')"
                                    prop="steamMasterPort">
                        <el-tooltip :show-after="100" content="server.ini -> [STEAM] -> server_master_port" effect="light"
                                    placement="top">
                          <el-input v-model="world.steamMasterPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="24">
                      <el-form-item :label="t('setting.roomWorldForm.steamAuthenticationPort')"
                                    prop="steamAuthenticationPort">
                        <el-tooltip :show-after="100" content="server.ini -> [STEAM] -> authentication_port" effect="light"
                                    placement="top">
                          <el-input v-model="world.steamAuthenticationPort" size="default" type="number"/>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" :xs="24">
                      <el-form-item label="Master IP" prop="shardMasterIp">
                        <el-tooltip :show-after="100" content="主节点IP，如果主节点不再当前云服务器，则需要输入主节点的公网IP"
                                    effect="light" placement="top">
                          <el-input v-model="world.shardMasterIp" :disabled="world.isMaster"
                                    size="default"/>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="!isMobile" :span="8"></el-col>
                    <el-col :span="8" :xs="24">
                      <el-form-item :label="t('setting.roomWorldForm.clusterKey')" prop="clusterKey">
                        <el-tooltip :show-after="100"
                                    content="主节点和从节点进行交互的认证密码，如果所有节点在同一台云服务器上，则无需设置"
                                    effect="light" placement="top">
                          <el-input v-model="world.clusterKey" autocomplete="new-password" show-password size="default"
                                    type="password"/>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-row>
              <div style="width: 100%">
                <el-tabs v-model="worldLevelDataTabName" @tab-change="handleWorldTabChange">
                  <el-tab-pane label="配置文件" name="Code">
                    <div style="width: 100%">
                      <el-form :model="world">
                        <el-form-item>
                          <sc-code-editor v-model="world.levelData"
                                          :height="isMobile?320:500"
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
                    <template v-if="getWorldType(world.levelData)==='forest'">
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
                    <template v-if="getWorldType(world.levelData)==='cave'">
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
                                              :defaultModelValue="overrides[i].modelValue"
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
        </el-card>
        <el-card v-if="step===2" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
          <el-form :model="clusterModForm">
            <el-form-item>
              <sc-code-editor v-model="clusterModForm.mod" :height="isMobile?320:500"
                              :theme="isDark?'darcula':'idea'"
                              mode="lua" style="width: 100%"></sc-code-editor>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-if="step===3" :style="isMobile?'min-height: 400px':'min-height: 600px'" shadow="never">
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
            <el-button v-if="step<3" type="primary" @click="handleNext">{{ t('setting.button.next') }}</el-button>
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
  </div>
</template>

<script name="settingsRoom" setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {useRoute, useRouter} from "vue-router";
import scCodeEditor from "@/components/scCodeEditor/index.vue";
import settingApi from "@/api/setting"
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

const {t} = useI18n()

onMounted(async () => {
  await handleGetClusterSetting()
  generateWorldFormRefs()
})

const loading = ref(false)

const {isMobile} = useScreenStore();

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const refreshCurrentPage = inject("refresh")
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

const editorGroundSettingRef = ref()
const editorCavesSettingRef = ref()

const step = ref(0)
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
    clusterSettingFormRef.value.validate(valid => {
      if (valid) {
        step.value++
      }
    })
  }
  if (step.value === 1) {
    for (let key in dynamicWorldRefs) {
      if (dynamicWorldRefs[key]) {
        await dynamicWorldRefs[key].validate()
      }
    }
    for (let i of worldForm.value) {
      if (i.levelData === '') {
        koiMsgError('必填')
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
  vote: true,
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

const clusterModForm = ref({
  mod: '',
})

const handleImportLeveldataLua = (world, mode) => {
  if (world === 'master') {
    if (mode === 'endless') {
      roomGroundForm.value.groundSetting = endless.master
    }
    if (mode === 'survival') {
      roomGroundForm.value.groundSetting = survival.master
    }
    // generateGroundOverridesObj()
    if (isMultiHost.value) {
      clusterSettingForm.value.masterPort = 11000
      clusterSettingForm.value.cavesPort = 0
      clusterSettingForm.value.shardMasterPort = 10888
      clusterSettingForm.value.steamMasterPort = 27018
      clusterSettingForm.value.steamAuthenticationPort = 8768
      clusterSettingForm.value.shardMasterIp = '127.0.0.1'
      clusterSettingForm.value.clusterKey = undefined
    }
  }
  if (world === 'caves') {
    if (mode === 'endless') {
      roomCaveForm.value.caveSetting = endless.caves
    }
    if (mode === 'survival') {
      roomCaveForm.value.caveSetting = survival.caves
    }
    // generateCavesOverridesObj()
    if (isMultiHost.value) {
      clusterSettingForm.value.masterPort = 0
      clusterSettingForm.value.cavesPort = 11001
      clusterSettingForm.value.shardMasterPort = 10888
      clusterSettingForm.value.steamMasterPort = 27019
      clusterSettingForm.value.steamAuthenticationPort = 8769
      clusterSettingForm.value.shardMasterIp = undefined
      clusterSettingForm.value.clusterKey = undefined
    }
  }
}

const handleGetClusterSetting = () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingApi.cluster.get(reqForm).then(response => {
    clusterSettingForm.value = response.data.clusterSetting
    worldForm.value = response.data.worlds
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
  console.log(clusterModForm.value.mod)
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
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}
const handleGenerateNewWorld = () => {
  const reqForm = {
    base: clusterSettingForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: clusterModForm.value.mod
  }
  loading.value = true
  settingApi.saveAndGenerate.post(reqForm).then(response => {
    loading.value = false
    koiMsgSuccess(response.message)
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}

const groundTabName = ref('Code')
const cavesTabName = ref('Code')

const handleGroundTabChange = (name) => {
  if (name === 'Visualization') {
    try {
      generateOverridesObj()
    } catch {
      koiMsgError(language.value === 'zh' ? '可视化配置加载失败' : 'Visualization load failed')
    }
  }
  if (name === 'Code') {
    roomGroundForm.value.groundSetting = beautifyLua(roomGroundForm.value.groundSetting)
    nextTick(() => {
      if (editorGroundSettingRef.value) {
        editorGroundSettingRef.value.refresh()
      }
    })
  }
}

const handleCavesTabChange = (name) => {
  if (name === 'Visualization') {
    try {
      generateCavesOverridesObj()
    } catch {
      koiMsgError(language.value === 'zh' ? '可视化配置加载失败' : 'Visualization load failed')
    }
  }
  if (name === 'Code') {
    roomCaveForm.value.caveSetting = beautifyLua(roomCaveForm.value.caveSetting)
    nextTick(() => {
      if (editorCavesSettingRef.value) {
        editorCavesSettingRef.value.refresh()
      }
    })
  }
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

const generateCavesOverridesObj = () => {
  if (roomCaveForm.value.caveSetting === '') {
    return
  }
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

const handleModelValueChange = (data) => {
  const key = data.name
  const value = data.value
  const ast = luaparse.parse(worldForm.value.find(world => world.name === worldTabName.value))
  // const ast = luaparse.parse(worldForm.value[worldTabIndex.value].levelData)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`
    }
  }
  worldForm.value.find(world => world.name === worldTabName.value).levelData = astToLua(ast)
  // worldForm.value[worldTabIndex.value].levelData = astToLua(ast)
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

const isMultiHost = ref(false)
const getMultiHost = async () => {
  await settingApi.multihost.get().then(response => {
    isMultiHost.value = response.data
  })
}

const handleChangeMultiHost = (v) => {
  settingApi.multihost.post({multiHost: !isMultiHost.value}).then(response => {
    isMultiHost.value = !isMultiHost.value
    if (v) {
      clearSetting()
    }

  })
}

const isMaster = ref(true)

const clearSetting = () => {
  roomGroundForm.value.groundSetting = ""
  roomCaveForm.value.caveSetting = ""

  clusterSettingForm.value.masterPort = undefined
  clusterSettingForm.value.cavesPort = undefined
  clusterSettingForm.value.shardMasterPort = undefined
  clusterSettingForm.value.steamMasterPort = undefined
  clusterSettingForm.value.steamAuthenticationPort = undefined
  if (isMaster.value) {
    clusterSettingForm.value.shardMasterIp = '127.0.0.1'
  } else {
    clusterSettingForm.value.shardMasterIp = undefined
  }

  clusterSettingForm.value.clusterKey = undefined

}

const multiHostFormRules = {
  masterPort: [{required: true, message: t('setting.roomWorldFormRules.masterPort'), trigger: 'blur'}],
  cavesPort: [{required: true, message: t('setting.roomWorldFormRules.cavesPort'), trigger: 'blur'}],
  shardMasterPort: [{required: true, message: t('setting.roomWorldFormRules.shardMasterPort'), trigger: 'blur'}],
  steamMasterPort: [{required: true, message: t('setting.roomWorldFormRules.steamMasterPort'), trigger: 'blur'}],
  steamAuthenticationPort: [{required: true, message: t('setting.roomWorldFormRules.steamAuthenticationPort'), trigger: 'blur'}],
  shardMasterIp: [{required: true, message: t('setting.roomWorldFormRules.shardMasterIp'), trigger: 'blur'}],
  clusterKey: [{required: true, message: t('setting.roomWorldFormRules.clusterKey'), trigger: 'blur'}],
}

const worldTabName = ref('World0')
const worldForm = ref([
  {
    name: 'World0',
    isMaster: true,
    levelData: '',
    serverPort: 11000,
    shardMasterPort: 10888,
    steamMasterPort: 27018,
    steamAuthenticationPort: 8768,
    shardMasterIp: '127.0.0.1',
    clusterKey: 'supersecretkey',
    encodeUserPath: true,
  }
])
const worldFormRules = {
  isMaster: [{required: true, trigger: 'change'}],
  encodeUserPath: [{required: true, trigger: 'change'}],
  serverPort: [{required: true, message: t('setting.roomWorldFormRules.masterPort'), trigger: 'blur'}],
  shardMasterPort: [{required: true, message: t('setting.roomWorldFormRules.shardMasterPort'), trigger: 'blur'}],
  steamMasterPort: [{required: true, message: t('setting.roomWorldFormRules.steamMasterPort'), trigger: 'blur'}],
  steamAuthenticationPort: [{required: true, message: t('setting.roomWorldFormRules.steamAuthenticationPort'), trigger: 'blur'}],
  shardMasterIp: [{required: true, message: t('setting.roomWorldFormRules.shardMasterIp'), trigger: 'blur'}],
  clusterKey: [{required: true, message: t('setting.roomWorldFormRules.clusterKey'), trigger: 'blur'}],
}

const worldTabIndex = ref(0)
const dynamicWorldRefs = {}
const generateWorldFormRefs = () => {
  for (let world of worldForm.value) {
    dynamicWorldRefs[`World${worldTabIndex.value}`] = ref()
    worldTabIndex.value++
  }
}
const handleWorldTabsEdit = (targetName, action) => {
  if (action === 'add') {
    const newTabName = `World${++worldTabIndex.value}`
    dynamicWorldRefs[newTabName] = ref()
    worldForm.value.push({
      name: newTabName,
      isMaster: false,
      levelData: '',
      serverPort: 11000 + worldTabIndex.value,
      shardMasterPort: 10888 + worldTabIndex.value,
      steamMasterPort: 27018 + worldTabIndex.value,
      steamAuthenticationPort: 8768 + worldTabIndex.value,
      shardMasterIp: '127.0.0.1',
      clusterKey: 'supersecretkey',
      encodeUserPath: true,
    })
    worldTabName.value = newTabName
  } else if (action === 'remove') {
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

const handleWorldTabChange = (name) => {
  if (name === 'Visualization') {
    overridesObj.value = {}
    try {
      console.log(worldForm.value.find(world => world.name === worldTabName.value))
      generateOverridesObj(worldForm.value.find(world => world.name === worldTabName.value).levelData)
    } catch {
      koiMsgError(language.value === 'zh' ? '可视化配置加载失败' : 'Visualization load failed')
    }
  }
  if (name === 'Code') {
    nextTick(() => {
      worldForm.value.find(world => world.name === worldTabName.value).levelData = beautifyLua(worldForm.value.find(world => world.name === worldTabName.value).levelData)
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

const handleWorldTabsEditChange = (name) => {
  console.log(name)
}

watch(() => globalStore.selectedDstCluster, (newValue, oldValue) => {
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
</style>

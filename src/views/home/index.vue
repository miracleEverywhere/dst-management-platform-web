<template>
  <div class="page-div">
    <template v-if="version.local!==-1">
      <template v-if="globalStore.dstClusters">
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
            <el-card shadow="never" style="min-height: 250px">
              <template #header>
                <div class="card-header">
                  <div class="fcc">
                    {{ t('home.roomInfo') }}
                    <el-tooltip :content="t('home.roomInfoTip')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <template v-if="roomInfo.clusterSetting.name!==''">
                <el-descriptions :column="isMobile?1:2">
                  <el-descriptions-item :label="t('home.roomName')">
                    <el-button v-copy="roomInfo.clusterSetting.name" link type="primary">
                      {{ roomInfo.clusterSetting.name }}
                      <el-icon style="margin-left: 3px">
                        <DocumentCopy/>
                      </el-icon>
                    </el-button>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('home.connectionCode')">
                    <el-tooltip :content="connectionCode" effect="light" placement="top">
                      <el-button v-copy="connectionCode" :disabled="connectionCode===''" :loading="connectionCodeLoading" link
                                 type="primary">{{ t('home.copy') }}
                      </el-button>
                    </el-tooltip>
                    <el-button link type="info" @click="handleOpenCustomConnectionCodeDialog">{{t('home.customConnectionCode')}}</el-button>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('home.cycles')">
                    <el-tag v-if="roomInfo.seasonInfo.cycles>-1" type="success">
                      {{ roomInfo.seasonInfo.cycles }}
                    </el-tag>
                    <el-tag v-else type="danger">
                      {{ language==='zh'?'获取失败':'Failed to retrieve' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('home.phase')">
                    <el-tag v-if="language==='en'" :type="roomInfo.seasonInfo.phase.en==='Failed to retrieve'?'danger':'success'">
                      {{ roomInfo.seasonInfo.phase.en }}
                    </el-tag>
                    <el-tag v-if="language==='zh'" :type="roomInfo.seasonInfo.phase.zh==='获取失败'?'danger':'success'">
                      {{ roomInfo.seasonInfo.phase.zh }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('home.season')">
                    <el-tag v-if="language==='en'" :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                      {{ roomInfo.seasonInfo.season.en }} {{ getSeasonDays(roomInfo.seasonInfo.season.en) }}
                    </el-tag>
                    <el-tag v-if="language==='zh'" :type="roomInfo.seasonInfo.cycles>-1?'success':'danger'">
                      {{ roomInfo.seasonInfo.season.zh }} {{ getSeasonDays(roomInfo.seasonInfo.season.en) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('home.mods')">
                    <el-tag>{{ roomInfo.modsCount }}</el-tag>
                    <el-button link style="margin-left: 10px" type="primary" @click="handleOpenModDialog">{{ t('home.modsButton') }}
                    </el-button>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('home.version')">
                    <el-tag v-loading="versionLoading" :type="version.local===version.server&&!version.server<1?'success':'danger'">
                      ({{ version.local }}/{{ version.server }})
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('home.playerNum')">
                    <template v-if="roomInfo.players!==null">
                      <el-tooltip :content="roomInfo.players.map(player => player.nickName).join(', ')" effect="light" placement="top">
                        <el-tag type="primary">{{ roomInfo.players.length }}</el-tag>
                      </el-tooltip>
                    </template>
                    <template v-else>
                      <el-tag type="primary">0</el-tag>
                    </template>
                  </el-descriptions-item>
                </el-descriptions>
              </template>
              <template v-if="roomInfo.clusterSetting.name===''">
                <div class="fcc" style="height: 150px">
                  <el-result :title="t('home.noServer')" icon="warning"/>
                </div>
              </template>
            </el-card>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
            <el-card shadow="never" style="min-height: 250px">
              <template #header>
                <div class="card-header">
                  <div class="fcc">
                    {{ t('home.sysInfo') }}
                    <el-tooltip :content="t('home.sysInfoTip')" effect="light" placement="top">
                      <el-icon size="14" style="margin-left: 2px">
                        <QuestionFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <div class="fcc">
                <el-progress :color="progressColors" :percentage="sysInfo.cpu" type="dashboard">
                  <template #default="{ percentage }">
                    <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                    <span class="percentage-label">CPU</span>
                  </template>
                </el-progress>
                <el-progress :color="progressColors" :percentage="sysInfo.memory" style="margin-left: 10%" type="dashboard">
                  <template #default="{ percentage }">
                    <span class="percentage-value">{{ percentage.toFixed(1) }}</span>
                    <span class="percentage-label">{{ t('home.mem') }}</span>
                  </template>
                </el-progress>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
            <el-card style="min-height: 300px" shadow="never">
              <template #header>
                <div class="card-header">
                  {{ t('home.control') }}
                </div>
              </template>
              <div v-if="roomInfo.clusterSetting.name!==''">
                <el-form size="large">
                  <el-form-item :label="t('home.rollback')">
                    <el-col v-if="isMobile">
                      <el-button size="small" @click="handleExec('rollback', 1)">1{{ t('home.day') }}
                      </el-button>
                      <el-button size="small" @click="handleExec('rollback', 2)">
                        2{{ t('home.days') }}
                      </el-button>
                      <el-button size="small" @click="handleExec('rollback', 3)">
                        3{{ t('home.days') }}
                      </el-button>
                    </el-col>
                    <el-col v-if="isMobile">
                      <el-button size="small" @click="handleExec('rollback', 4)">
                        4{{ t('home.days') }}
                      </el-button>
                      <el-button size="small" @click="handleExec('rollback', 5)">
                        5{{ t('home.days') }}
                      </el-button>
                    </el-col>
                    <el-col v-if="!isMobile">
                      <el-button size="small" @click="handleExec('rollback', 1)">1{{ t('home.day') }}
                      </el-button>
                      <el-button size="small" @click="handleExec('rollback', 2)">
                        2{{ t('home.days') }}
                      </el-button>
                      <el-button size="small" @click="handleExec('rollback', 3)">
                        3{{ t('home.days') }}
                      </el-button>
                      <el-button size="small" @click="handleExec('rollback', 4)">
                        4{{ t('home.days') }}
                      </el-button>
                      <el-button size="small" @click="handleExec('rollback', 5)">
                        5{{ t('home.days') }}
                      </el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-form size="large">
                  <el-form-item>
                    <el-button size="default" type="success" @click="handleExec('startup', 0)">{{ t('home.startup') }}</el-button>
                    <el-button size="default" type="primary" @click="handleExec('restart', 0)">{{ t('home.restart') }}</el-button>
                    <el-button :disabled="userInfo.role!=='admin'" :loading="isUpdating" size="default" type="warning" @click="handleExec('update', 0)">{{ t('home.update') }}</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="default" type="info" @click="handleExec('shutdown', 0)">{{ t('home.shutdown') }}</el-button>
                    <el-button size="default" type="danger" @click="handleExec('reset', 0)">{{ t('home.reset') }}</el-button>
                    <el-tooltip :content="t('home.deleteTips')" effect="light" placement="top">
                      <el-dropdown trigger="click" style="margin-left: 12px">
                        <el-button color="#626aef" size="default">
                          {{ t('home.delete') }}
                        </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item v-for="world in worldInfo"
                                              @click="handleExec('delete', 0, world.world)">
                              <div class="fcc">
                                <span style="margin-right: 10px">{{ world.world }}</span>
                                <el-tag v-if="world.type==='forest'" type="success">
                                  {{language==='zh'?'地面':'Ground'}}
                                </el-tag>
                                <el-tag v-if="world.type==='cave'" type="warning">
                                  {{language==='zh'?'洞穴':'Cave'}}
                                </el-tag>
                                <el-tag v-if="world.type==='None'" type="danger">
                                  {{language==='zh'?'未识别':'Undefined'}}
                                </el-tag>
                              </div>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
<!--                      <el-button color="#626aef" size="default" @click="handleExec('delete', 0)">{{ t('home.delete') }}</el-button>-->
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="roomInfo.clusterSetting.name===''" class="fcc" style="height: 150px">
                <el-result :title="t('home.noServer')" icon="warning"/>
              </div>
            </el-card>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24" :span="12" :xs="24" style="margin-top: 10px">
            <el-card style="min-height: 300px" shadow="never">
              <template #header>
                <div class="card-header">
                  {{ t('home.interface') }}
                  <el-button link type="primary" @click="quickCmdDialogVisible=true">
                    {{ t('home.quickCmd.openButton') }}
                  </el-button>
                </div>
              </template>
              <div v-if="roomInfo.clusterSetting.name!==''">
                <el-form label-position="top">
                  <el-form-item>
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span>{{t('home.announcement')}}</span>
                        <el-tooltip :content="t('home.announceTip')" effect="light" placement="top">
                          <el-icon size="14" style="margin-left: 2px">
                            <QuestionFilled/>
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-input v-model="announceForm.message" @keyup.enter="handleAnnounce">
                      <template #append>
                        <el-button :loading="announceLoading" @click="handleAnnounce">{{ t('home.send') }}</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span>Console</span>
                        <el-tooltip :content="t('home.consoleTip')" effect="light" placement="top">
                          <el-icon size="14" style="margin-left: 2px">
                            <QuestionFilled/>
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-input v-model="consoleForm.cmd" @keyup.enter="handleConsole">
                      <template #prepend>
                        <el-select v-model="consoleForm.world" style="width: 115px">
                          <el-option v-for="world in worldInfo" :disabled="!world.stat"
                                     :label="world.world" :value="world.world">
                            <div class="fcc">
                              <span style="margin-right: 10px">{{ world.world }}</span>
                              <el-tag v-if="world.type==='forest'" type="success">
                                {{language==='zh'?'地面':'Ground'}}
                              </el-tag>
                              <el-tag v-if="world.type==='cave'" type="warning">
                                {{language==='zh'?'洞穴':'Cave'}}
                              </el-tag>
                              <el-tag v-if="world.type==='None'" type="danger">
                                {{language==='zh'?'未识别':'Undefined'}}
                              </el-tag>
                            </div>
                          </el-option>
                        </el-select>
                      </template>
                      <template #append>
                        <el-button :loading="consoleLoading" @click="handleConsole">{{ t('home.execute') }}</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="roomInfo.clusterSetting.name===''" class="fcc" style="height: 150px">
                <el-result :title="t('home.noServer')" icon="warning"/>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
            <el-card :style="isMobile?'min-height: 300px':'height: 400px'" shadow="never">
              <template #header>
                <div class="card-header">
                  <span>{{language==='zh'?'世界信息':'World Info'}}</span>
                  <el-button link type="primary" @click="handleOpenAllScreensDialog">
                    {{language==='zh'?'检查世界':'Check World'}}
                  </el-button>
                </div>
              </template>
              <el-table v-if="worldInfo" :data="worldInfo" border>
                <el-table-column label="ID" prop="id">
                  <template #default="scope">
                    <el-tag type="info">{{scope.row.id}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('home.worldName')" prop="world">
                  <template #default="scope">
                    <el-tag type="primary">{{scope.row.world}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('home.type')" prop="type">
                  <template #default="scope">
                    <el-tag v-if="scope.row.type==='forest'" type="success">
                      {{language==='zh'?'地面':'Ground'}}
                    </el-tag>
                    <el-tag v-if="scope.row.type==='cave'" type="warning">
                      {{language==='zh'?'洞穴':'Cave'}}
                    </el-tag>
                    <el-tag v-if="scope.row.type==='None'" type="danger">
                      {{language==='zh'?'未识别':'Undefined'}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('home.isMaster')" prop="isMaster">
                  <template #default="scope">
                    <el-tag v-if="scope.row.isMaster" type="primary">
                      {{language==='zh'?'是':'Yes'}}
                    </el-tag>
                    <el-tag v-else type="info">
                      {{language==='zh'?'否':'No'}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="cpu">
                  <template #header>
                    <div style="display: flex; align-items: center">
                      <span>CPU</span>
                      <el-tooltip :content="t('home.cpuTip')" effect="light" placement="top">
                        <el-icon size="14" style="margin-left: 2px">
                          <QuestionFilled/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                  <template #default="scope">
                    <el-tag type="info">{{scope.row.cpu.toFixed(2)}}%</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('home.memory')+'(MiB)'" prop="mem">
                  <template #default="scope">
                    <el-tag type="info">{{scope.row.memSize.toFixed(0)}} [{{scope.row.mem.toFixed(0)}}%]</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('home.disk')" prop="diskUsed">
                  <template #default="scope">
                    <el-tag type="info">{{formatBytes(scope.row.diskUsed, 0)}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('home.status')" prop="stat">
                  <template #default="scope">
                    <el-switch v-model="scope.row.stat" inline-prompt
                               :active-text="t('home.running')" :inactive-text="t('home.terminated')"
                               :loading="worldSwitchLoading"
                               @change="handleWorldSwitch(scope.row.world)"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else class="fcc" style="height: 300px">
                <el-result :title="t('home.noServer')" icon="warning"/>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
      <el-card v-else shadow="never">
        <div class="fcc" style="height: 67vh">
          <el-result title="请创建集群后再使用本平台功能" icon="warning"/>
        </div>
      </el-card>
    </template>
    <el-card v-if="version.local===-1" shadow="never">
      <div class="fcc" style="height: 67vh">
        <el-result title="请先安装游戏后再使用本平台功能"
                   sub-title="请前往 工具-安装游戏 页面，或使用脚本进行手动安装"
                   icon="warning"/>
      </div>
    </el-card>

    <el-dialog v-model="modInfoDialogVisible" :close-on-click-modal="false" :title="t('home.modsTable.title')" width="80%">
      <el-table v-loading="modInfoLoading" :data="modInfoList.filter(mod => mod.id !== 1)" border height="70vh"
                size="small" style="width: 100%" tooltip-effect="light">
        <el-table-column :label="t('home.modsTable.name')" prop="name">
        </el-table-column>
        <el-table-column :label="t('home.modsTable.pics')" prop="preview_url" width="120px">
          <template #default="scope">
            <el-image :src="scope.row.preview_url" fit="fill" style="width: 100px; height: 100px"/>
          </template>
        </el-table-column>
        <el-table-column :label="t('home.modsTable.size')" prop="size">
          <template #default="scope">
            {{ formatBytes(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('home.modsTable.id')" prop="id"/>
        <el-table-column :label="t('home.modsTable.tags')" prop="tags">
          <template #default="scope">
            <el-tag v-for="item in scope.row.tags" style="margin: 0 5px 5px 0;">{{ item.display_name }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="allScreensDialogVisible" width="60%">
      <template #header>
        {{t('home.screenDialog.title')}}
      </template>
      <el-select v-model="selectRegions" multiple :disabled="lobbyCheckLoading"
                 @change="handleCheckLobby"
                 style="margin: 20px 0">
        <el-option v-for="region in regions" :label="region.label" :value="region.value"></el-option>
      </el-select>
      <el-alert v-if="lobbyCheckLoading" :closable="false" type="info" show-icon :effect="isDark?'light':'dark'">
        <template #icon>
          <el-icon class="is-loading">
            <Loading />
          </el-icon>
        </template>
        {{t('home.screenDialog.tip3')}}
      </el-alert>
      <el-alert v-if="lobbyCheckResult&&!lobbyCheckLoading" :closable="false" type="success" show-icon :effect="isDark?'light':'dark'">
        {{t('home.screenDialog.tip4')}}
      </el-alert>
      <el-alert v-if="!lobbyCheckResult&&!lobbyCheckLoading" :closable="false" type="error" show-icon :effect="isDark?'light':'dark'">
        {{t('home.screenDialog.tip5')}}
      </el-alert>
      <div class="tip_warning">
        {{t('home.screenDialog.tip1')}}
      </div>
      <div class="tip">
        {{t('home.screenDialog.tip2')}}
      </div>
      <el-table :data="allScreens" border v-loading="allScreensLoading">
        <el-table-column :label="t('home.screenDialog.column1')" prop="screenName">
          <template #default="scope">
            <el-tag type="primary">{{scope.row.screenName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('home.screenDialog.column2')">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleKillScreen(scope.row.screenName)">{{t('home.screenDialog.stop')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="customConnectionCodeDialogVisible" width="60%">
      <div style="margin: 20px">
        <div class="tip">{{t('home.customConnectionCodeTip')}}</div>
        <div class="tip_success">{{t('home.customConnectionCodeTip2')}}</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="customConnectionCode.ip" :placeholder="t('home.ip')"/>
          </el-col>
          <el-col :span="8">
            <el-input v-model="customConnectionCode.port" :placeholder="t('home.port')"/>
          </el-col>
          <el-col :span="8">
            <el-input v-model="customConnectionCode.password" :placeholder="t('home.password')"/>
          </el-col>
        </el-row>
        <div v-if="customConnectionCode.ip && customConnectionCode.port" class="tip">
          <strong>{{t('home.preview')}}: </strong>
          c_connect('{{customConnectionCode.ip}}', {{customConnectionCode.port}}{{customConnectionCode.password?`, '${customConnectionCode.password}'`:""}})
        </div>
        <div style="display: flex; justify-content: flex-end; padding-top: 30px">
          <el-button type="danger" @click="handleDeleteCustomConnectionCode">{{ t('home.clear') }}</el-button>
          <el-button type="primary" @click="handleUpdateCustomConnectionCode">{{ t('home.submit') }}</el-button>
        </div>

      </div>
    </el-dialog>
    <el-dialog v-model="quickCmdDialogVisible">
      <template #header>
        {{t('home.quickCmd.openButton')}}
      </template>
      <div style="margin: 20px 0">
        <el-row>
          <el-radio-group v-model="quickCmdType">
            <el-radio value="player">{{language==='zh'?'玩家':'Player'}}</el-radio>
            <el-radio value="world">{{language==='zh'?'世界':'World'}}</el-radio>
          </el-radio-group>
        </el-row>

        <el-row class="mt-16px">
          <el-tooltip v-for="player in roomInfo.players" effect="light" placement="top" :show-after="200"
                      :content="language==='zh'?`点击可快速插入UID: ${player.uid}`:`Click to insert player's UID: ${player.uid}`">
            <el-button  link type="primary"
                       :disabled="quickCmdType==='world'" @click="quickCmdUid=player.uid">
              {{player.nickName}}
            </el-button>
          </el-tooltip>

        </el-row>

        <el-row class="mt-16px">
          <el-input v-model="quickCmdUid" :disabled="quickCmdType==='world'"
                    :placeholder="t('home.quickCmd.uid')" clearable></el-input>
        </el-row>

        <el-row class="mt-16px">
          <el-select v-model="quickCmdPlayerId" :disabled="quickCmdType==='world'||quickCmdUid===''"
                     :placeholder="t('home.quickCmd.player')" filterable
                     @change="quickCmdPlayerGenerate" clearable>
            <el-option v-for="item in quickCmdPlayerOptions"
                       :label="language==='zh'?item.label.zh:item.label.en"
                       :value="item.value"/>
          </el-select>
        </el-row>

        <el-row class="mt-16px">
          <el-select v-model="quickCmdWorldId" :disabled="quickCmdType==='player'"
                     :placeholder="t('home.quickCmd.world')" filterable
                     @change="quickCmdWorldGenerate" clearable>
            <el-option v-for="item in quickCmdWorldOptions"
                       :label="language==='zh'?item.label.zh:item.label.en"
                       :value="item.value"/>
          </el-select>
        </el-row>

        <el-row v-if="quickCmd&&(quickCmdPlayerId>=0||quickCmdWorldId>=0)" class="mt-16px">
          <div class="tip" style="width: 100%">
            {{language==='zh'?'预览：':'preview: '}}
            <el-text type="primary">{{quickCmd}}</el-text>
          </div>
        </el-row>
      </div>

      <template #footer>
        <el-button @click="quickCmdDialogVisible=false">{{t('home.quickCmd.cancel')}}</el-button>
        <el-button type="primary" @click="quickCmdInsert">
          {{t('home.quickCmd.insert')}}
        </el-button>
      </template>

    </el-dialog>

    <el-tour v-model="globalStore.needTour">
      <el-tour-step :title="t('home.tour.one.title')">
        <div style="display: flex; align-items: center">
          <el-icon style="margin-right: 5px"><MilkTea /></el-icon>
          <span>{{t('home.tour.one.desc')}}</span>
        </div>
      </el-tour-step>
      <el-tour-step target="#tourUser" :title="t('home.tour.two.title')">
        <div style="display: flex; align-items: center">
          <el-icon style="margin-right: 5px"><Sugar /></el-icon>
          <span>{{t('home.tour.two.desc')}}</span>
        </div>
      </el-tour-step>
      <el-tour-step target="#tourClusterSelect" :title="t('home.tour.three.title')">
        <div style="display: flex; align-items: center">
          <el-icon style="margin-right: 5px"><ColdDrink /></el-icon>
          <span>{{t('home.tour.three.desc')}}</span>
        </div>
      </el-tour-step>
      <el-tour-step target="#tourDocs" :title="t('home.tour.four.title')">
        <div style="display: flex; align-items: center">
          <el-icon style="margin-right: 5px"><Dessert /></el-icon>
          <span>{{t('home.tour.four.desc')}}</span>
        </div>
      </el-tour-step>
      <el-tour-step target="#tourGithub" :title="t('home.tour.five.title')">
        <div style="display: flex; align-items: center">
          <el-icon style="margin-right: 5px"><Fries /></el-icon>
          <span>{{t('home.tour.five.desc')}}</span>
        </div>
      </el-tour-step>
      <el-tour-step :title="t('home.tour.six.title')">
        <div style="display: flex; align-items: center">
          <el-icon style="margin-right: 5px"><IceDrink /></el-icon>
          <span>{{t('home.tour.six.desc')}}</span>
        </div>
      </el-tour-step>
    </el-tour>
  </div>
</template>

<script setup>
import homeApi from "@/api/home"
import externalApi from "@/api/externalApi"
import {useI18n} from "vue-i18n";
import {computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {ElMessageBox} from 'element-plus'
import {koiMsgError, koiMsgInfo, koiMsgSuccess, koiNoticeWarning} from "@/utils/koi.ts";
import {formatBytes, sleep} from "@/utils/tools.js"
import {useRoute, useRouter} from "vue-router";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import useAuthStore from "@/stores/modules/auth.ts";


onMounted(() => {
  getRoomInfo()
  getVersion()
  getConnectionCode()
  getWorldInfo(false)
  handleGetUpdating()
  startRequests()
  checkTour()
})

const {t} = useI18n()
const {isMobile} = useScreenStore();
const globalStore = useGlobalStore();
const authStore = useAuthStore()
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);
const userInfo = authStore.userInfo

const checkTour = async () => {
  await sleep(2000)
  globalStore.needTour = (globalStore.dstClusters?.length || 0) === 0
}

const loading = ref(false)
const versionLoading = ref(false)
const connectionCodeLoading = ref(false)

const version = ref({
  server: 0,
  local: 0
})

const connectionCode = ref('')  // 服务端生成的code
const customConnectionCode = ref({
  ip: '',
  port: '',
  password: ''
})  // 用户自定义的code

const customConnectionCodeDialogVisible = ref(false)
const handleOpenCustomConnectionCodeDialog = () => {
  if (globalStore.customConnectionCode[globalStore.selectedDstCluster]) {
    customConnectionCode.value = globalStore.customConnectionCode[globalStore.selectedDstCluster]
  } else {
    customConnectionCode.value = {
      ip: '',
      port: '',
      password: ''
    }
  }

  customConnectionCodeDialogVisible.value = true
}
const handleUpdateCustomConnectionCode = () => {
  globalStore.customConnectionCode[globalStore.selectedDstCluster] = customConnectionCode.value
  customConnectionCodeDialogVisible.value = false
  koiMsgSuccess(language.value==='zh'?'更新成功':'Update Success')
  handleRefresh()
}

const handleDeleteCustomConnectionCode = () => {
  delete globalStore.customConnectionCode[globalStore.selectedDstCluster]
  customConnectionCodeDialogVisible.value = false
  koiMsgSuccess(language.value==='zh'?'清除成功':'Clear Success')
  handleRefresh()
}

const getVersion = () => {
  versionLoading.value = true
  externalApi.dstVersion.get().then(response => {
    version.value = response.data
    if (version.value.local === 691071) {
      if (language.value === 'zh') {
        koiNoticeWarning('游戏版本异常，请确认游戏是否安装成功。安装成功后，才能正常使用此平台', '饥荒管理平台提示', 0)
      } else {
        koiNoticeWarning('Game version is abnormal. Please confirm whether the game has been installed successfully. This DMP can only function properly after the game is successfully installed.', 'DMP TIPS', 0)
      }
    }
  }).finally(() => {
    versionLoading.value = false
  })
}

const getConnectionCode = async () => {
  if (globalStore.customConnectionCode[globalStore.selectedDstCluster]) {
    if (globalStore.customConnectionCode[globalStore.selectedDstCluster].password) {
      connectionCode.value = `c_connect('${globalStore.customConnectionCode[globalStore.selectedDstCluster].ip}', ${globalStore.customConnectionCode[globalStore.selectedDstCluster].port}, '${globalStore.customConnectionCode[globalStore.selectedDstCluster].password}')`
    } else {
      connectionCode.value = `c_connect('${globalStore.customConnectionCode[globalStore.selectedDstCluster].ip}', ${globalStore.customConnectionCode[globalStore.selectedDstCluster].port})`
    }
  } else {
    connectionCodeLoading.value = true
    if (!globalStore.selectedDstCluster) {
      await sleep(1000)
    }
    externalApi.connectionCode.get({clusterName: globalStore.selectedDstCluster}).then(response => {
      connectionCode.value = response.data
    }).finally(() => {
      connectionCodeLoading.value = false
    })
  }
}

const roomInfo = ref({
  clusterSetting: {},
  seasonInfo: {
    season: {},
    cycles: 0,
    elapsedDays: 0,
    seasonLength: {
      summer: 15,
      autumn: 20,
      spring: 20,
      winter: 15
    },
    phase: {}
  },
  modsCount: 0,
  players: [],
})
const getRoomInfo = async () => {
  if (!globalStore.selectedDstCluster) {
    await sleep(1000)
  }
  homeApi.roomInfo.get({clusterName: globalStore.selectedDstCluster}).then(response => {
    roomInfo.value = response.data
  })
}

const getSeasonDays = (season) => {
  if (roomInfo.value.seasonInfo.cycles > -1) {
    return `(${roomInfo.value.seasonInfo.elapsedDays}/${roomInfo.value.seasonInfo.seasonLength[season]})`
  } else {
    return ''
  }
}

const sysInfo = ref({
  cpu: 0,
  memory: 0,
})
const worldInfo = ref([{
  id: '',
  stat: false,
  world: '',
  type: '',
  cpu: 0,
  mem: 0,
  memSize: 0,
  diskUsed: 0,
}])
const getSysInfo = () => {
  homeApi.sysInfo.get().then(response => {
    sysInfo.value = response.data
  })
}
const getWorldInfo = async (force = true) => {
  if (roomInfo.value.clusterSetting.name === '') {
    return
  }
  if (!force) {
    if (!globalStore.selectedDstCluster) {
      await sleep(1000)
    }
  }
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  homeApi.worldInfo.get(reqForm).then(response => {
    worldInfo.value = response.data
  })
}
const progressColors = [
  {color: '#5cb87a', percentage: 20},
  {color: '#1989fa', percentage: 40},
  {color: '#e6a23c', percentage: 60},
  {color: '#f56c6c', percentage: 80},
  {color: '#6f7ad3', percentage: 100},
]

const isUpdating = ref(false)

const handleGetUpdating = () => {
  homeApi.isUpdating.get().then(response => {
    isUpdating.value = response.data
  })
}

let intervalSysId = null
let intervalWorldId = null
const startRequests = () => {
  intervalSysId = setInterval(() => {
    getSysInfo()
  }, 2000)
  intervalWorldId = setInterval(() => {
    if (globalStore.selectedDstCluster) {
      getWorldInfo()
      handleGetUpdating()
    }
  }, 10000)
}
const cancelRequests = () => {
  if (intervalSysId) {
    clearInterval(intervalSysId)
    clearInterval(intervalWorldId)
    intervalSysId = null
    intervalWorldId = null
  }
}

const worldSwitchLoading = ref(false)
const handleWorldSwitch = (world) => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    worldName: world,
    type: 'switch',
    extraData: "",
  }
  worldSwitchLoading.value = true
  homeApi.exec.post(reqForm).finally(async () => {
    await getWorldInfo()
    await sleep(1500)
    worldSwitchLoading.value = false
  })
}

const handleExec = (type, extraData, worldName=null) => {
  const typeMap = {
    startup: {
      en: 'STARTUP',
      zh: '启动'
    },
    rollback: {
      en: 'ROLLBACK',
      zh: '回档'
    },
    shutdown: {
      en: 'SHUTDOWN',
      zh: '关闭'
    },
    restart: {
      en: 'RESTART',
      zh: '重启'
    },
    update: {
      en: 'UPDATE GAME',
      zh: '更新游戏'
    },
    reset: {
      en: 'RESET GAME',
      zh: '重置游戏'
    },
    delete: {
      en: 'DELETE GAME',
      zh: '删除世界'
    },
  }
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 ${typeMap[type]['zh']} 操作，是否继续？` : `The ${typeMap[type]['en']} operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            type: type,
            extraData: extraData,
            clusterName: globalStore.selectedDstCluster,
            worldName: worldName,
          }
          homeApi.exec.post(reqForm).then(response => {
            koiMsgSuccess(response.message)
            handleGetUpdating()
            done()
          }).catch(() => {
          }).finally(() => {
            instance.confirmButtonLoading = false
          })
        } else {
          done()
        }
      }
    }
  ).then(() => {
  }).catch(() => {
    koiMsgInfo(t('home.canceled'))
  })
}

const announceLoading = ref(false)
const announceForm = ref({
  message: ''
})
const handleAnnounce = () => {
  if (announceForm.value.message === '') {
    koiMsgError(language.value === 'zh' ? '请输入要宣告的内容' : 'Please enter the content to be announced')
    return
  }
  announceLoading.value = true
  const reqForm = {
    type: 'announce',
    extraData: announceForm.value.message,
    clusterName: globalStore.selectedDstCluster,
    worldName: '',
  }
  homeApi.exec.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    announceForm.value.message = ''
  }).finally(() => {
    announceLoading.value = false
  })
}

const consoleLoading = ref(false)
const consoleForm = ref({
  cmd: '',
  world: ''
})
const handleConsole = () => {
  if (consoleForm.value.world === '') {
    koiMsgError(language.value === 'zh' ? '请选择地面或洞穴' : 'Please select a world from ground and cave')
    return
  }
  if (consoleForm.value.cmd === '') {
    koiMsgError(language.value === 'zh' ? '请输入要执行的命令' : 'Please enter the command to execute')
    return
  }
  consoleLoading.value = true
  const reqForm = {
    type: 'console',
    extraData: consoleForm.value.cmd,
    clusterName: globalStore.selectedDstCluster,
    worldName: consoleForm.value.world,
  }
  homeApi.exec.post(reqForm).then(response => {
    koiMsgSuccess(response.message)
    consoleForm.value.cmd = ''
  }).finally(() => {
    consoleLoading.value = false
  })
}

const modInfoDialogVisible = ref(false)
const modInfoLoading = ref(false)
const modInfoList = ref([])
const handleOpenModDialog = () => {
  modInfoDialogVisible.value = true
  modInfoLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  externalApi.modInfo.get(reqForm).then(response => {
    modInfoList.value = response.data
  }).finally(() => {
    modInfoLoading.value = false
  })
}

const allScreensLoading = ref(false)
const allScreens = ref([])
const allScreensDialogVisible = ref(false)
const handleOpenAllScreensDialog = () => {
  allScreensDialogVisible.value = true
  allScreensLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  homeApi.allScreens.get(reqForm).then(response => {
     allScreens.value = response.data
  }).finally(() => {
    allScreensLoading.value = false
  })
  handleCheckLobby()
}
const handleKillScreen = (screenName) => {
  ElMessageBox.confirm(
    language.value === 'zh' ? `将执行 关闭进程 操作，是否继续？` : `The shutdown operation will be performed. Do you want to continue?`,
    language.value === 'zh' ? '请确认您的操作' : 'Please confirm your operation',
    {
      confirmButtonText: language.value === 'zh' ? '确定' : 'confirm',
      cancelButtonText: language.value === 'zh' ? '取消' : 'cancel',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          const reqForm = {
            screenName: screenName
          }
          homeApi.screenKill.post(reqForm).then(response => {
            koiMsgSuccess(response.message)
            handleOpenAllScreensDialog()
            done()
          }).catch(() => {
          }).finally(() => {
            instance.confirmButtonLoading = false
          })
        } else {
          done()
        }
      }
    }
  ).then(() => {
  }).catch(() => {
    koiMsgInfo(t('home.canceled'))
  })
}

const regions = [
  {
    label: 'ap-southeast-1',
    value: 'ap-southeast-1',
  },
  {
    label: 'ap-east-1',
    value: 'ap-east-1',
  },
  {
    label: 'us-east-1',
    value: 'us-east-1',
  },
  {
    label: 'eu-central-1',
    value: 'eu-central-1',
  },
]
const selectRegions = ref(['ap-southeast-1', 'ap-east-1'])
const lobbyCheckResult = ref(false)
const lobbyCheckLoading = ref(false)

const handleCheckLobby = () => {
  lobbyCheckLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    regions: selectRegions.value
  }
  externalApi.checkLobby.post(reqForm).then(response => {
    lobbyCheckResult.value = response.data
  }).finally(() => {
    lobbyCheckLoading.value = false
  })
}

const quickCmdDialogVisible = ref(false)
const quickCmdType = ref('player')
const quickCmdUid = ref('')
const quickCmdPlayerId = ref()
const quickCmdWorldId = ref()
const quickCmd = ref('')
const quickCmdPlayerOptions = [
  {
    label: {
      zh: "开启上帝模式",
      en: "god mode"
    },
    value: 0
  },
  {
    label: {
      zh: "开启建造模式",
      en: "builder mode"
    },
    value: 1
  },
  {
    label: {
      zh: "开启隐身模式",
      en: "invisible mode"
    },
    value: 2
  },
  {
    label: {
      zh: "开启一击必杀",
      en: "one attack to kill"
    },
    value: 3
  },
  {
    label: {
      zh: "解锁所有科技",
      en: "unlock all tech"
    },
    value: 4
  },
  {
    label: {
      zh: "移速×4(按需更改)",
      en: "moving speed × 4 (modify it by self)"
    },
    value: 5
  },
  {
    label: {
      zh: "重选角色",
      en: "reselect character"
    },
    value: 6
  },
]
const quickCmdPlayerGenerate = () => {
  if (!(/^KU_/.test(quickCmdUid.value))) {
    koiMsgError(language.value === 'zh' ? '请输入正确的玩家UID' : 'Please input the correct player UID')
    return
  }
  if (quickCmdPlayerId.value === 0) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.health:SetInvincible(true)`
  }
  if (quickCmdPlayerId.value === 1) {
    quickCmd.value = `for k, v in pairs(AllPlayers) do if v.userid=='${quickCmdUid.value}' then AllPlayers[k].components.builder:GiveAllRecipes() end end`
  }
  if (quickCmdPlayerId.value === 2) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}'):AddTag('debugnoattack')`
  }
  if (quickCmdPlayerId.value === 3) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.combat.CalcDamage = function() return 9999999999 * 9 end`
  }
  if (quickCmdPlayerId.value === 4) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.builder:UnlockRecipesForTech({SCIENCE = 1, MAGIC = 1, ANCIENT = 1, SHADOW = 1, CARTOGRAPHY = 1})`
  }
  if (quickCmdPlayerId.value === 5) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.locomotor:SetExternalSpeedMultiplier(UserToPlayer('${quickCmdUid.value}'), 'c_speedmult', 4)`
  }
  if (quickCmdPlayerId.value === 6) {
    quickCmd.value = `c_despawn(UserToPlayer('${quickCmdUid.value}'))`
  }
}
const quickCmdWorldOptions = [
  {
    label: {
      zh: "回档6天(按需更改)",
      en: "roll back 6 days (modify it by self)"
    },
    value: 0
  },
  {
    label: {
      zh: "跳过1天(按需更改)",
      en: "skip 1 day (modify it by self)"
    },
    value: 1
  },
  {
    label: {
      zh: "下一阶段",
      en: "next phase"
    },
    value: 2
  },
  {
    label: {
      zh: "保存游戏",
      en: "save"
    },
    value: 3
  },
]
const quickCmdWorldGenerate = () => {
  if (quickCmdWorldId.value === 0) {
    quickCmd.value = `c_rollback(6)`
  }
  if (quickCmdWorldId.value === 1) {
    quickCmd.value = `c_skip(1)`
  }
  if (quickCmdWorldId.value === 2) {
    quickCmd.value = `TheWorld:PushEvent('ms_nextphase')`
  }
  if (quickCmdWorldId.value === 3) {
    quickCmd.value = `c_save()`
  }
}

const quickCmdInsert = () => {
  consoleForm.value.cmd = quickCmd.value
  quickCmdDialogVisible.value = false
}

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

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})

watch(() => globalStore.selectedDstCluster, (newValue) => {
  if (newValue) {
    nextTick(() => {
      handleRefresh()
    })
  }
}, {immediate: false})
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>

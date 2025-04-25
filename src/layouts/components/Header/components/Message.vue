<template>
  <div class="search-menu hover:bg-[rgba(0,0,0,0.06)] w-32px h-100% flex flex-justify-center" @click="handleMessage">
    <el-badge :hidden="badgeNum===0" :value="badgeNum" :max="99" class="fcc">
      <el-icon :size="20" class="koi-icon">
        <ChatDotRound />
      </el-icon>
    </el-badge>
  </div>
  <el-drawer v-model="messageVisible" :show-close="false" @closed="handleClose" :size="isMobile?'80%':'60%'">
    <template #default>
      <div>
        <el-scrollbar>
          <ul v-if="language==='zh'">
            <li v-for="item in messageList" v-bind:key="item.id">
              <div style="display: flex; align-items: center;">
                <el-tag :type="item.type==='update'?'success':'danger'" size="large" :effect="isDark?'dark':'light'">{{item.title.zh}}</el-tag>
                <template v-if="item.type==='bug'&&item.fixed">
                  <el-icon color="#67C23A" style="margin-left: 10px"><Select /></el-icon>
                  <span style="color: #67C23A">已修复</span>
                </template>
              </div>
              <div>
                <template v-if="item.type==='update'">
                  <el-divider content-position="left">新功能</el-divider>
                  <p v-for="i in item.content.zh.feature" style="color: #606266">{{i}}</p>
                  <el-divider content-position="left">Bug修复</el-divider>
                  <p v-for="i in item.content.zh.bug" style="color: #606266">{{i}}</p>
                  <el-divider content-position="left">优化</el-divider>
                  <p v-for="i in item.content.zh.opt" style="color: #606266">{{i}}</p>
                </template>
                <template v-if="item.type==='bug'">
                  <p style="color: #606266">{{item.content.zh}}</p>
                </template>
              </div>
              <div style="margin-bottom: 5vh">
                <p>{{timestamp2time(item.time)}}</p>
              </div>
            </li>
          </ul>
          <ul v-if="language==='en'">
            <li v-for="item in messageList" v-bind:key="item.id">
              <div style="display: flex; align-items: center;">
                <el-tag :type="item.type==='update'?'success':'danger'" size="large" :effect="isDark?'dark':'light'">{{item.title.en}}</el-tag>
                <template v-if="item.type==='bug'&&item.fixed">
                  <el-icon color="#67C23A" style="margin-left: 10px"><Select /></el-icon>
                  <span style="color: #67C23A">Fixed</span>
                </template>
              </div>
              <div>
                <template v-if="item.type==='update'">
                  <el-divider content-position="left">Feature</el-divider>
                  <p v-for="i in item.content.en.feature" style="color: #606266">{{i}}</p>
                  <el-divider content-position="left">Bug Fix</el-divider>
                  <p v-for="i in item.content.en.bug" style="color: #606266">{{i}}</p>
                  <el-divider content-position="left">Optimization</el-divider>
                  <p v-for="i in item.content.en.opt" style="color: #606266">{{i}}</p>
                </template>
                <template v-if="item.type==='bug'">
                  <p style="color: #606266">{{item.content.en}}</p>
                </template>
              </div>
              <div style="margin-bottom: 5vh">
                <p>{{timestamp2time(item.time)}}</p>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import axios from 'axios';
import settings from "@/settings.ts";
import systemApi from "@/api/system"
import {timestamp2time} from "@/utils/tools.js";
import useGlobalStore from "@/stores/modules/global.ts";

onMounted(async () => {
  await getMessage()
  await handleGetAnnouncedID()
  badgeNum.value = maxAnnouncedID.value - announcedID.value
})

const { isMobile } = useScreenStore();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);
const isDark = computed(() => globalStore.isDark);

const messageVisible = ref(false)
const handleMessage = () => {
  messageVisible.value = true
}

const messageList = ref([])

const getMessage = async () =>{
  try {
    const response = await axios.get(settings.announceUrl);
    messageList.value = response.data.announce;
    messageList.value.reverse()
    maxAnnouncedID.value = Math.max(...messageList.value.map(item => item.id))
  } catch (error) {
    messageList.value = []
    maxAnnouncedID.value = 0
  }
}

const announcedID = ref(0)
const maxAnnouncedID = ref(0)
const badgeNum = ref(0)
const handleGetAnnouncedID = async () => {
  await systemApi.announcedID.get().then(async response => {
    announcedID.value = response.data
  })
}

const handleClose = () =>{
  if (badgeNum.value === 0) {
    return
  }
  systemApi.announcedID.post({id: maxAnnouncedID.value}).then(() => {
    badgeNum.value = 0
  })
}
</script>

<style scoped>
.search-menu {
  display: flex;
  align-items: center;

  :deep(.el-dialog) {
    border-radius: 4px;
  }
}
ul {
  list-style-type: none;
}
</style>

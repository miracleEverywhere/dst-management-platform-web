<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24">
        <el-tabs v-model="activeTabName" @tab-change="handleTabChange">
          <el-tab-pane label="Chat" name="current">
            <log ref="logRef" type="chat"/>
          </el-tab-pane>
          <el-tab-pane label="Historical" name="historical" :lazy="true">
            <log ref="HistoricalLogRef" type="chat" :historical="true"/>
          </el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import log from "./components/log.vue"
import {ref} from "vue";

const activeTabName = ref('current')
const handleTabChange = (name) => {
  if (activeTabName.value === 'current' && logRef.value) {
    logRef.value.startRequests()
  }
  if (activeTabName.value === 'historical' && logRef.value) {
    logRef.value.cancelRequests()
  }
  activeTabName.value = name
}

const logRef = ref()
const HistoricalLogRef = ref()

</script>

<style scoped>
</style>

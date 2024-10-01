<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :span="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top: 10px">
        <el-card>
          <el-steps :active="step" align-center finish-status="success">
            <el-step :title="isMobile?'房间':'房间设置'"/>
            <el-step :title="isMobile?'地面':'地面设置'"/>
            <el-step :title="isMobile?'洞穴':'洞穴设置'"/>
            <el-step :title="isMobile?'模组':'模组设置'"/>
            <el-step :title="isMobile?'完成':'设置完成'"/>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
    <room-base v-if="step===0" v-model:step="step"/>
    <room-ground v-if="step===1" v-model:step="step"/>
    <room-cave v-if="step===2" v-model:step="step"/>
    <room-mod v-if="step===3" v-model:step="step"/>
    <room-finish v-if="step===4" v-model:step="step"/>
  </div>
</template>

<script setup>
import RoomBase from './components/room-base.vue'
import RoomGround from './components/room-ground.vue'
import RoomCave from './components/room-cave.vue'
import RoomMod from './components/room-mod.vue'
import RoomFinish from './components/room-finish.vue'
import {ref} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";

const { isMobile } = useScreenStore();

const step = ref(0)

</script>

<style scoped>

</style>
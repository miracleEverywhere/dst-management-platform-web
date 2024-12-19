<template>
  <div style="display: flex; align-items: center; margin: 5px; width:320px">
<!--    <el-image :src="props.mod.preview_url" fit="fill" style="width: 80px; height: 80px"/>-->
    <el-image :src="123" fit="fill" style="width: 80px; height: 80px"/>
    <div style="width: 240px">
      <div class="fcc">
        <el-tooltip effect="light" :show-after="500" :content="props.mod.name" placement="top">
          <el-tag size="small">{{computedName}}</el-tag>
        </el-tooltip>
      </div>
      <div style="margin: 5px 0" class="fcc">
        <el-rate v-model="computedRate" :max="5" disabled allow-half show-score/>
      </div>
      <div class="fcc">
        <el-button type="primary" size="small" @click="dialogVisible=true">详情</el-button>
        <el-button type="success" size="small" :loading="downloadLoading" @click="downloadLoading=true">下载</el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :title="props.mod.name" width="80vw">
    <div style="min-height: 50vh; margin-top: 20px">
      <el-descriptions :column="2" border :direction="isMobile?vertical:horizontal">
        <el-descriptions-item :rowspan="isMobile?1:2" :width="140" label="Photo" align="center">
          <el-image :style="isMobile?'width: 60px; height: 60px':'width: 120px; height: 120px'" :src="123"/>
        </el-descriptions-item>
        <el-descriptions-item label="ID" align="center">
          <el-tag type="info">{{props.mod.id}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="size" align="center">
          <el-tag type="info">{{formatBytes(props.mod.size)}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item align="center">
          <template #label>
            <div class="fcc">
              <el-icon>
                <sc-icon-ThumbUpFill />
              </el-icon>
            </div>
          </template>
          <el-tag type="info">{{props.mod.vote_data.votes_up}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="isMobile"/>
        <el-descriptions-item align="center">
          <template #label>
            <div class="fcc">
              <el-icon>
                <sc-icon-ThumbDownFill />
              </el-icon>
            </div>
          </template>
          <el-tag type="info">{{props.mod.vote_data.votes_down}}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="fcc">
              <el-icon>
                <sc-icon-StarFill />
              </el-icon>
            </div>
          </template>
          <el-rate v-model="computedRate" :max="5" disabled allow-half show-score score-template="({value}/5)"/>
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 20px">
        <el-scrollbar max-height="20vh">
          {{props.mod.file_description}}
        </el-scrollbar>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {computed, ref, watch, defineEmits, onMounted} from "vue";
import {useScreenStore} from "@/hooks/screen/index.ts";
import {formatBytes} from "@/utils/tools.js"


const {isMobile} = useScreenStore();

const props = defineProps({
  mod: {
    type: Object,
    default: {}
  },
})

const computedRate = computed(() => {
  return (props.mod.vote_data.score * 5).toFixed(2)
})

const computedName = computed(() => {
  const maxStr = 20
  if (props.mod.name.length > maxStr) {
    return props.mod.name.slice(0, maxStr) + '...'
  }
  return props.mod.name
})

const dialogVisible = ref(false)

const downloadLoading = ref(false)

</script>

<style scoped>
</style>

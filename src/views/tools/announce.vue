<template>
  <div class="page-div">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :span="24" :xs="24" style="margin-top: 10px">
        <el-card shadow="never" :style="isMobile?'min-height: 500px':'min-height: 700px'">
          <template #header>
            <div class="card-header">
              {{t('tools.announce.title')}}
              <div>
                <el-button type="success" size="default" @click="addAnnounce">{{t('tools.announce.new')}}</el-button>
              </div>
            </div>
          </template>
          <el-table v-if="announceData.length > 0" :data="announceData" tooltip-effect="light"
                    border style="width: 100%" size="small">
            <el-table-column prop="name" :label="$t('tools.announce.name')"/>
            <el-table-column prop="enable" :label="$t('tools.announce.isEnable')">
              <template #default="scope">
                <el-tag v-if="scope.row.enable" type="success">{{t('tools.announce.enable')}}</el-tag>
                <el-tag v-else type="danger">{{t('tools.announce.disable')}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="frequency" :label="$t('tools.announce.frequency')">
              <template #default="scope">
              </template>
            </el-table-column>
            <el-table-column prop="content" :label="$t('tools.announce.content')" show-overflow-tooltip>
              <template #default="scope">
              </template>
            </el-table-column>
            <el-table-column prop="actions" :label="$t('tools.announce.actions')" width="140" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="openAnnounceUpdate(scope.row)">{{t('tools.announce.update')}}</el-button>
                <el-button link type="danger" @click="handleAnnounceDelete(scope.row)">{{t('tools.announce.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-result v-else icon="warning" :title="$t('tools.announce.noData')" style="margin-top: 10%"></el-result>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="addDialogVisible" :close-on-click-modal="false" :title="$t('tools.announce.new')" width="60%">
      <el-form ref="announceFormRef" :label-position="isMobile?'top':'left'" :model="announceForm"
               :rules="announceFormRules" :label-width="isMobile?'70':'auto'" :size="isMobile?'small':'large'">
        <el-form-item :label="$t('tools.announce.name')" prop="name">
          <el-input v-model="announceForm.name" :disabled="announceAction==='put'"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tools.announce.isEnable')" prop="enable">
          <el-switch v-model="announceForm.enable" />
        </el-form-item>
        <el-form-item :label="$t('tools.announce.content')" prop="content">
          <el-input v-model="announceForm.content"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tools.announce.frequency')" prop="frequency">
          <el-input v-model.number="announceForm.frequency" :min="1" :step="1"></el-input>
          <div class="el-form-item-msg">{{t('tools.announce.frequencyTip')}}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">{{t('tools.announce.cancel')}}</el-button>
          <el-button type="primary" @click="handleAnnounce">
            {{t('tools.announce.submit')}}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="toolsAnnounce">
import {useI18n} from "vue-i18n";
import {useScreenStore} from "@/hooks/screen/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import {computed, nextTick, onMounted, ref} from "vue";
import toolsApi from "@/api/tools"
import {koiMsgError, koiMsgInfo, koiMsgSuccess} from "@/utils/koi.ts";
import {ElMessageBox} from "element-plus";

const { t } = useI18n()
const { isMobile } = useScreenStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.isDark);
const language = computed(() => globalStore.language);

onMounted(() => {
  getAnnounceData()
})

const announceData = ref([])
const getAnnounceData = () => {
  toolsApi.announce.get().then(response => {
    announceData.value = response.data
  })
}

const announceAction = ref('')
const addAnnounce = () => {
  announceForm.value = {
    name: '',
    enable: true,
    content: '',
    frequency: 600,
  }
  nextTick(() => {
    announceFormRef.value.clearValidate()
  })
  announceAction.value = 'post'
  addDialogVisible.value = true
}
const addDialogVisible = ref(false)
const announceFormRef = ref()
const announceForm = ref({
  name: '',
  enable: true,
  content: '',
  frequency: 600,
})
const announceFormRules = {
  name: [ { required: true, message: t('tools.announce.rules.name'), trigger: 'blur' } ],
  enable: [ { required: true, message: t('tools.announce.rules.enable'), trigger: 'change' } ],
  content: [ { required: true, message: t('tools.announce.rules.content'), trigger: 'blur' } ],
  frequency: [ { required: true, message: t('tools.announce.rules.frequency'), trigger: 'blur' } ],
}
const handleAnnounce = () => {
  if (announceForm.value.frequency < 1) {
    koiMsgError(t('tools.announce.rules.frequencyMin'))
    return
  }
  switch (announceAction.value) {
    case 'post':
      handleAnnouncePost()
      break;
    case 'put':
      handleAnnouncePut()
      break;
  }
}
const handleAnnouncePost = () => {
  announceFormRef.value.validate(valid => {
    if (valid) {
      toolsApi.announce.post(announceForm.value).then(response => {
        addDialogVisible.value = false
        koiMsgSuccess(response.message)
        getAnnounceData()
      })
    }
  })
}

const handleAnnounceDelete = (form) => {
  ElMessageBox.confirm(
    t('tools.announce.deleteTip'),
    'Warning',
    {
      confirmButtonText: t('tools.announce.confirm'),
      cancelButtonText: t('tools.announce.cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      toolsApi.announce.delete(form).then(response => {
        koiMsgSuccess(response.message)
        getAnnounceData()
      })
    })
    .catch(() => {
      koiMsgInfo(t('home.canceled'))
    })
}

const openAnnounceUpdate = (row) => {
  announceForm.value = row
  nextTick(() => {
    announceFormRef.value.clearValidate()
  })
  announceAction.value = 'put'
  addDialogVisible.value = true
}

const handleAnnouncePut = () => {
  announceFormRef.value.validate(valid => {
    if (valid) {
      toolsApi.announce.put(announceForm.value).then(response => {
        addDialogVisible.value = false
        koiMsgSuccess(response.message)
        getAnnounceData()
      })
    }
  })
}
</script>

<style scoped>
</style>

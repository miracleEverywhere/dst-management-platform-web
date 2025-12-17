<template>
  <v-card
    class="mt-4"
    :height="props.height-70"
  >
    <v-card-title>
      <div class="card-header my-2">
        <span>
          {{ t(`game.player.list.${props.listType}`) }}
        </span>
        <v-btn
          color="default"
          @click="getListData(true)"
        >
          {{ t('game.player.list.refresh') }}
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <v-container
        :height="props.height-152"
        style="overflow-y: auto"
      >
        <v-row>
          <v-alert
            color="success"
            density="compact"
          >
            {{ t('game.player.list.tip') }}
          </v-alert>
          <v-col
            class="mt-4"
            cols="12"
          />
          <v-chip
            v-for="uid in listData"
            closable
            color="info"
            class="mt-2 mr-2"
            label
            size="large"
            @click:close="handleListChange(uid,'delete')"
          >
            {{ uid }}
            <span v-if="(props.uidmap.find(item => item.uid === uid)?.nickname||'')!==''">
              ({{props.uidmap.find(item => item.uid === uid)?.nickname||''}})
            </span>
          </v-chip>
          <div
            class="d-flex align-center"
            style="width: 160px"
          >
            <v-text-field
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              density="compact"
              :placeholder="t('game.player.list.placeholder')"
              class="mt-4"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <v-btn
              v-else
              variant="tonal"
              append-icon="ri-add-line"
              color="default"
              class="mt-2 mr-2"
              @click="showInput"
            >
              {{ t('game.player.list.add') }}
            </v-btn>
          </div>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup>
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import playerApi from "@/api/player.js"
import { showSnackbar } from "@/utils/snackbar.js"

const props = defineProps({
  listType: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 0,
  },
  uidmap: {
    type: Array,
    default: () => [],
  },
})

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const listData = ref([])
const getListDataLoading = ref(false)

const getListData = (tip=false) => {
  getListDataLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    listType: props.listType,
  }

  playerApi.list.get(reqForm).then(response => {
    listData.value = response.data || []
    if (tip) {
      showSnackbar(t('game.player.list.refreshSuccess'))
    }
  }).finally(() => {
    getListDataLoading.value = false
  })
}

const listChangeLoading = ref(false)

const handleListChange = (uid, actionType) => {
  listChangeLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    listType: props.listType,
    uid: uid,
    actionType: actionType,
  }

  playerApi.list.post(reqForm).then(response => {
    showSnackbar(response.message)
    getListData()
  }).finally(() => {
    listChangeLoading.value = false
  })
}

const inputVisible = ref(false)
const inputRef = ref()
const inputValue = ref('')

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    if (!(/^KU_/.test(inputValue.value))) {
      showSnackbar(t('game.player.list.uidValid'), 'error')
      
      return
    }
    handleListChange(inputValue.value, 'add')
  }
  inputVisible.value = false
  inputValue.value = ''
}


onMounted(() => {
  getListData()
})
</script>


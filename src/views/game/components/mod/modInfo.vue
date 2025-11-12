<template>
  <v-card
    :hover="true"
    variant="flat"
    height="135"
    class="fcc"
  >
    <div style="display: flex; align-items: center; margin: 5px; width:320px">
      <v-img
        :src="props.mod.preview_url"
        aspect-ratio="1"
        style="width: 80px; height: 80px"
      />
      <div style="width: 200px">
        <div class="fcc">
          <v-chip
            label
            size="small"
            color="primary"
          >
            {{ computedName }}
            <v-tooltip
              activator="parent"
              open-delay="300"
              scroll-strategy="close"
            >
              {{ props.mod.name }}
            </v-tooltip>
          </v-chip>
        </div>
        <div
          style="margin: 5px 0"
          class="fcc"
        >
          <precise-rating
            :value="computedRate"
            :length="5"
            :show-actual-value="true"
            size="24"
          />
        </div>
        <div class="fcc">
          <v-dialog
            v-model="dialogVisible"
            class="flex-wrap"
            max-width="60%"
          >
            <template #activator="{ props: activatorProps }">
              <v-btn
                color="info"
                density="compact"
                size="small"
                v-bind="activatorProps"
                class="mr-4"
                @click="dialogVisible=true"
              >
                {{t('game.mod.download.modInfo.detail')}}
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card :title="props.mod.name">
                <v-card-text>
                  <v-table class="custom-table">
                    <tbody>
                      <tr>
                        <td rowspan="2">
                          <v-icon icon="ri-image-line" />
                        </td>
                        <td rowspan="2">
                          <v-img
                            :src="props.mod.preview_url"
                            aspect-ratio="1"
                            style="width: 150px; height: 150px"
                          />
                        </td>
                        <td>ID</td>
                        <td>
                          <v-chip
                            color="info"
                            label
                          >
                            {{ props.mod.id }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td>{{t('game.mod.download.modInfo.size')}}</td>
                        <td>
                          <v-chip
                            color="info"
                            label
                          >
                            {{ formatBytes(props.mod.size) }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            icon="ri-thumb-up-fill"
                            color="success"
                          />
                        </td>
                        <td>
                          <v-chip
                            color="success"
                            label
                          >
                            {{ props.mod.vote_data.votes_up }}
                          </v-chip>
                        </td>
                        <td>
                          <v-icon
                            icon="ri-thumb-down-fill"
                            color="error"
                          />
                        </td>
                        <td>
                          <v-chip
                            color="error"
                            label
                          >
                            {{ props.mod.vote_data.votes_down }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            icon="ri-star-fill"
                            color="warning"
                          />
                        </td>
                        <td colspan="3">
                          <precise-rating
                            :value="computedRate"
                            :length="5"
                            :show-actual-value="true"
                            size="24"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-container height="30vh">
                    <div v-html="bbCodeParser.parse(props.mod.file_description)" />
                  </v-container>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
          <v-btn
            color="success"
            density="compact"
            size="small"
            @click="handleDownload"
          >
            {{t('game.mod.download.modInfo.download')}}
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { formatBytes } from "@/utils/tools.js"

import modApi from "@/api/mod"
import {showSnackbar} from "@/utils/snackbar"
import PreciseRating from "@/components/PreciseRating.vue"
import bbCodeParser from 'js-bbcode-parser'
import {useI18n} from "vue-i18n";


const props = defineProps({
  mod: {
    type: Object,
    default: {},
  },
  roomID: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

const computedRate = computed(() => {
  return parseFloat((props.mod.vote_data.score * 5).toFixed(2))
})

const computedName = computed(() => {
  const maxStr = 20
  if (props.mod.name.length > maxStr) {
    return props.mod.name.slice(0, maxStr) + '...'
  }
  
  return props.mod.name
})

const dialogVisible = ref(false)

const handleDownload = () => {
  const reqFrom = {
    roomID: props.roomID,
    id: props.mod.id,
    file_url: props.mod.file_url,
  }
  modApi.download.post(reqFrom).then(response => {
    showSnackbar(response.message)
  })
}
</script>

<style scoped>
.custom-table {
  border-collapse: collapse;
  width: 100%;
}

.custom-table th,
.custom-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: 500;
}

.custom-table tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>

<template>
  <div class="d-flex">
    <v-text-field></v-text-field>
    <v-btn size="x-large">新建房间</v-btn>
  </div>

  <v-infinite-scroll
    @load="loadRooms"
    :items="rooms.length"
    :has-more="hasMore"
    class="d-flex flex-wrap"
    style="gap: 16px; align-items: flex-start"
  >
    <div class="d-flex flex-wrap">
      <template v-for="room in rooms" :key="room.name">
        <div :style="{ width: mobile ? '100%' : '50%', padding: '8px' }">
          <v-card height="200px">
            <v-card-title>
              {{room.displayName}}({{room.name}})
            </v-card-title>
          </v-card>
        </div>
      </template>
      <div :style="{ width: mobile ? '100%' : '50%', padding: '8px' }">
        <v-card height="200px">
          <v-card-title>
            点击新建
          </v-card-title>
        </v-card>
      </div>
    </div>
    <template v-slot:empty>
      <span>已加载所有房间，共计{{rooms.length}}个</span>
    </template>
    <template v-slot:loading>
      <div class="w-100 text-center py-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </template>
  </v-infinite-scroll>
</template>


<script setup>
import roomApi from "@/api/room"
import {useDisplay} from "vuetify";


const {mobile} = useDisplay()

const reqForm = ref({
  name: "",
  page: 1,
  pageSize: 5,
})
const rooms = ref([])
const hasMore = ref(true)

const loadRooms = ({ done }) => {
  roomApi.list.get(reqForm.value).then(response => {
    if (response.data.rows?.length > 0) {
      rooms.value.push(...response.data.rows)
      reqForm.value.page++
      // 检查是否还有更多数据
      hasMore.value = response.data.rows.length >= reqForm.value.pageSize
      done(hasMore.value ? 'ok' : 'empty')
    } else {
      hasMore.value = false
      done('empty')
    }
  }).catch(() => {
    done('error')
  })
}

</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>
<template>
  <v-tabs v-model="tabName">
    <v-tab value="info">
      账号信息
    </v-tab>
    <v-tab value="update">
      账号修改
    </v-tab>
    <v-tab value="password">
      密码修改
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tabName">
    <v-tabs-window-item value="info">
      <v-card
        class="mt-4"
        height="100%"
      >
        <v-card-text>
          <v-row>
            <v-col cols="1" />
            <v-col cols="3">
              <v-img
                :src="avatarImageFull"
                height="356"
                width="178"
              />
            </v-col>
            <v-col
              cols="4"
              class="fcc"
            >
              <div>
                <v-row>
                  <v-col
                    cols="6"
                    class="d-flex justify-end"
                  >
                    <span style="white-space: nowrap;">用户名</span>
                  </v-col>
                  <v-col cols="6">
                    <span style="color: #9e9e9e">
                      {{ userInfo.username }}
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="6"
                    class="d-flex justify-end"
                  >
                    <span style="white-space: nowrap;">用户昵称</span>
                  </v-col>
                  <v-col cols="6">
                    <span style="color: #9e9e9e">
                      {{ userInfo.nickname }}
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="6"
                    class="d-flex justify-end"
                  >
                    <span style="white-space: nowrap;">角色</span>
                  </v-col>
                  <v-col cols="6">
                    <span style="color: #9e9e9e">
                      {{ userInfo.role }}
                    </span>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="4" />
          </v-row>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar1full from '@images/avatars/avatar-1-full.png'
import avatar2full from '@images/avatars/avatar-2-full.png'
import avatar3full from '@images/avatars/avatar-3-full.png'
import avatar4full from '@images/avatars/avatar-4-full.png'
import useUserStore from "@store/user"


const userStore = useUserStore()

const tabName = ref('info')

const userInfo = userStore.userInfo

const avatarImage = ref()
const avatarImageFull = ref()

switch (userInfo.avatar) {
case '1':
  avatarImage.value = avatar1
  avatarImageFull.value = avatar1full
  break
case '2':
  avatarImage.value = avatar2
  avatarImageFull.value = avatar2full
  break
case '3':
  avatarImage.value = avatar3
  avatarImageFull.value = avatar3full
  break
case '4':
  avatarImage.value = avatar4
  avatarImageFull.value = avatar4full
  break
default:
  avatarImage.value = avatar1
  avatarImageFull.value = avatar1full
}
</script>


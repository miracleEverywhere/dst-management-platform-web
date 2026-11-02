<template>
  <result
    v-if="!dataGot && !loadError"
    type="info"
    title="拼命加载中"
    :height="calculateContainerSize()"
  />
  <result
    v-else-if="loadError"
    type="error"
    title="加载失败"
    sub-title="请检查后端服务是否正常，然后重试。"
    :height="calculateContainerSize()"
  >
    <v-btn
      class="mt-4"
      color="primary"
      @click="loadRoom"
    >
      重试
    </v-btn>
  </result>
  <v-card
    v-else
    class="d-flex flex-column"
    :height="calculateContainerSize()"
  >
    <v-card-title class="flex-none mt-2">
      房间配置
    </v-card-title>
    <v-card-text class="flex-grow-1 overflow-y-auto pt-8">
      <v-form ref="roomFormRef">
        <!-- 游戏名 -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="roomForm.gameName"
              v-tooltip="'可通过游戏房间名在游戏大厅进行搜索'"
              :rules="roomFormRules.gameName"
              label="房间名"
              append-inner-icon="ri-emotion-happy-line"
              @click:append-inner="emojiDialog=true;emojiGameName=true"
            />
          </v-col>
        </v-row>
        <!-- 描述 -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="roomForm.description"
              v-tooltip="'按Tab键显示在游戏房间名下方的文字'"
              label="房间描述"
              append-inner-icon="ri-emotion-happy-line"
              @click:append-inner="emojiDialog=true;emojiGameName=false"
            />
          </v-col>
        </v-row>
        <!-- 游戏模式 -->
        <v-row>
          <v-col>
            <v-radio-group
              v-model="roomForm.gameMode"
              inline
            >
              <template #prepend>
                <v-chip v-tooltip="'不同模式会生成不同类型的世界，萌新可无脑选无尽'">
                  游戏模式
                </v-chip>
              </template>
              <v-radio
                label="无尽"
                value="endless"
                class="mr-4"
              />
              <v-radio
                label="生存"
                value="survival"
                class="mr-4"
              />
              <v-radio
                label="轻松"
                value="relaxed"
                class="mr-4"
              />
              <v-radio
                label="荒野"
                value="wilderness"
                class="mr-4"
              />
              <v-radio
                label="暗无天日"
                value="lightsOut"
                class="mr-4"
              />
              <v-radio
                label="熔炉"
                value="lavaarena"
                class="mr-4"
              />
              <v-radio
                label="暴食"
                value="quagmire"
                class="mr-4"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <!-- 玩家数 -->
        <v-row>
          <v-col>
            <v-slider
              v-model="roomForm.maxPlayer"
              :max="64"
              :min="1"
              class="align-center"
              hide-details
              step="1"
              style="margin-left: -1px"
            >
              <template #label>
                <v-chip
                  v-tooltip="'可进入游戏的最大玩家数'"
                  style="margin-right: 1rem"
                >
                  玩家数量
                </v-chip>
              </template>
              <template #append>
                <v-chip
                  label
                  color="primary"
                >
                  {{ roomForm.maxPlayer }}
                </v-chip>
              </template>
            </v-slider>
          </v-col>
        </v-row>
        <!-- pvp等 -->
        <v-row>
          <v-col :cols="mobile?12:4">
            <v-radio-group
              v-model="roomForm.pvp"
              inline
            >
              <template #prepend>
                <v-chip v-tooltip="'游戏中的玩家是否能互相攻击'">
                  玩家对战
                </v-chip>
              </template>
              <v-radio
                label="开启"
                :value="true"
                class="mr-4"
              />
              <v-radio
                label="关闭"
                :value="false"
                class="mr-4"
              />
            </v-radio-group>
          </v-col>
          <v-col :cols="mobile?12:4">
            <v-radio-group
              v-model="roomForm.vote"
              inline
            >
              <template #prepend>
                <v-chip v-tooltip="'游戏中的玩家是否能进行投票回档、重置、踢人等操作'">
                  玩家投票
                </v-chip>
              </template>
              <v-radio
                label="开启"
                :value="true"
                class="mr-4"
              />
              <v-radio
                label="关闭"
                :value="false"
                class="mr-4"
              />
            </v-radio-group>
          </v-col>
          <v-col :cols="mobile?12:4">
            <v-radio-group
              v-model="roomForm.pauseEmpty"
              inline
            >
              <template #prepend>
                <v-chip v-tooltip="'游戏中没有玩家时是否自动暂停游戏时间'">
                  自动暂停
                </v-chip>
              </template>
              <v-radio
                label="开启"
                :value="true"
                class="mr-4"
              />
              <v-radio
                label="关闭"
                :value="false"
                class="mr-4"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <!-- 回档天数 -->
        <v-row>
          <v-col>
            <v-slider
              v-model="roomForm.maxRollBack"
              :max="64"
              :min="1"
              class="align-center"
              hide-details
              step="1"
              style="margin-left: -1px"
            >
              <template #label>
                <v-chip
                  v-tooltip="'即每次游戏保存后生成的快照的最大值，如设置20，表示可以回档20天'"
                  style="margin-right: 1rem"
                >
                  回档天数
                </v-chip>
              </template>
              <template #append>
                <v-chip
                  label
                  color="primary"
                >
                  {{ roomForm.maxRollBack }}
                </v-chip>
              </template>
            </v-slider>
          </v-col>
        </v-row>
        <!-- 启动类型 -->
        <v-row>
          <v-col>
            <v-radio-group
              v-model="roomForm.startType"
              inline
            >
              <template #prepend>
                <v-chip v-tooltip="'启动32位游戏还是64位游戏'">
                  启动类型
                </v-chip>
              </template>
              <v-radio
                label="32位"
                value="32-bit"
                class="mr-4"
              />
              <v-radio
                label="64位"
                value="64-bit"
                class="mr-4"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <!-- 密码 -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="roomForm.password"
              v-tooltip="'玩家进入游戏是否需要输入密码，如无需密码则留空'"
              autocomplete="new-password"
              label="游戏密码"
              :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
              :type="isPasswordVisible ? 'text' : 'password'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />
          </v-col>
        </v-row>
        <!-- 令牌 -->
        <v-row>
          <v-col class="fcc">
            <v-text-field
              v-model="roomForm.token"
              v-tooltip="'在科雷官网申请的饥荒游戏令牌'"
              :rules="roomFormRules.token"
              label="游戏令牌"
              :append-inner-icon="isTokenVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
              :type="isTokenVisible ? 'text' : 'password'"
              class="w-100"
              @click:append-inner="isTokenVisible = !isTokenVisible"
            />
            <v-btn
              v-if="!mobile"
              density="comfortable"
              variant="text"
              class="ml-4"
              color="success"
              prepend-icon="ri-add-line"
              @click="handleAddToken"
            >
              默认令牌
            </v-btn>
            <v-btn
              v-if="!mobile"
              density="comfortable"
              variant="text"
              class="ml-4"
              color="info"
              href="https://accounts.klei.com"
              target="_blank"
              prepend-icon="ri-links-line"
            >
              创建令牌
            </v-btn>
          </v-col>
        </v-row>
        <!-- master ip -->
        <v-row>
          <v-col
            :cols="mobile?12:9"
            :style="mobile?{marginBottom:'1.25rem'}:{}"
          >
            <v-text-field
              v-model="roomForm.masterIP"
              v-tooltip="'如果所有世界都在当前云服务器，则无需更改，详细解释见文档'"
              :rules="roomFormRules.masterIP"
              label="主世界IP"
            />
          </v-col>
          <v-col :cols="mobile?12:3">
            <v-number-input
              v-model="roomForm.masterPort"
              v-tooltip="'从世界连接主世界的端口，如果所有世界都在当前云服务器，则无需更改，详细解释见文档'"
              :rules="roomFormRules.masterPort"
              label="主世界端口"
              :min="1"
              :max="65535"
              style="margin-bottom: -1.25rem"
            />
          </v-col>
        </v-row>
        <!-- cluster key -->
        <v-row>
          <v-col>
            <v-text-field
              v-model="roomForm.clusterKey"
              v-tooltip="'从世界与主世界连接的认证密码'"
              :rules="roomFormRules.clusterKey"
              label="世界认证密码"
              :append-inner-icon="isClusterKeyVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
              :type="isClusterKeyVisible ? 'text' : 'password'"
              @click:append-inner="isClusterKeyVisible = !isClusterKeyVisible"
            />
          </v-col>
        </v-row>
        <!-- 预留位 -->
        <v-row>
          <v-col>
            <v-combobox
              v-model="roomForm.whitelist"
              v-tooltip="'预留位玩家UID，输入后回车生成标签，保存时一行一个写入 whitelist.txt'"
              label="预留位"
              multiple
              chips
              closable-chips
              clearable
              hide-no-data
              :delimiters="[',', '，', ' ']"
            />
          </v-col>
        </v-row>
        <!-- 管理员 -->
        <v-row>
          <v-col>
            <v-combobox
              v-model="roomForm.adminlist"
              v-tooltip="'管理员玩家UID，输入后回车生成标签，保存时一行一个写入 adminlist.txt'"
              label="管理员"
              multiple
              chips
              closable-chips
              clearable
              hide-no-data
              :delimiters="[',', '，', ' ']"
            />
          </v-col>
        </v-row>
        <!-- 黑名单 -->
        <v-row>
          <v-col>
            <v-combobox
              v-model="roomForm.blocklist"
              v-tooltip="'黑名单玩家UID，输入后回车生成标签，保存时一行一个写入 blocklist.txt'"
              label="黑名单"
              multiple
              chips
              closable-chips
              clearable
              hide-no-data
              :delimiters="[',', '，', ' ']"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="saveLoading"
        variant="elevated"
        class="mr-6 mt-4 mb-2 px-4"
        @click="handleSave"
      >
        保存
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog
    v-model="emojiDialog"
    :width="mobile?'90%':'60%'"
  >
    <v-card>
      <v-card-title>
        <div class="card-header">
          <div>
            表情
          </div>
          <div>
            <v-radio-group
              v-model="emojiInsertMode"
              inline
            >
              <v-radio
                label="插入"
                :value="true"
                class="mr-4"
              />
              <v-radio
                label="复制"
                :value="false"
              />
            </v-radio-group>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="mt-4">
        <div v-if="emojiInsertMode">
          <v-text-field
            v-if="emojiGameName"
            ref="emojiInputNameRef"
            v-model="roomForm.gameName"
            label="房间名"
          />
          <v-text-field
            v-else
            ref="emojiInputDescriptionRef"
            v-model="roomForm.description"
            label="房间描述"
          />
        </div>
        <div class="emoji-container mt-8">
          <div
            v-for="e in Emoji"
            class="emoji-item"
            @click="handleEmoji(e)"
          >
            {{ e }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions v-if="!mobile">
        <v-spacer />
        <v-btn
          variant="text"
          color="info"
          href="https://www.bilibili.com/opus/814456568458248259"
          target="_blank"
          append-icon="ri-share-box-line"
        >
          感谢B站长鸽门徒提供的饥荒表情字体
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import liteApi from "@/api/lite"
import { useDisplay } from "vuetify/framework"
import { showSnackbar } from "@/utils/snackbar.js"
import { debounce, generateRandomString, getDstToken } from "@/utils/tools.js"
import Emoji from "@/views/game/components/base/emoji.js"

const windowHeight = ref(window.innerHeight)
const otherHeight = 150
const { mobile } = useDisplay()

const dataGot = ref(false)
const loadError = ref(false)
const roomFormRef = ref()

const roomForm = ref({
  gameName: '',
  description: '',
  gameMode: '',
  pvp: '',
  maxPlayer: 6,
  maxRollBack: 10,
  vote: false,
  pauseEmpty: true,
  password: '',
  token: '',
  masterIP: '',
  masterPort: 0,
  clusterKey: '',
  startType: '',
  whitelist: [],
  adminlist: [],
  blocklist: [],
})

const roomFormRules = ref({
  gameName: [
    value => {
      if (value) return true

      return '请输入房间名'
    },
  ],
  token: [
    value => {
      if (value) return true

      return '请输入游戏令牌'
    },
  ],
  masterIP: [
    value => {
      if (value) return true

      return '请输入主世界IP'
    },
  ],
  masterPort: [
    value => {
      if (value) return true

      return '请输入主世界端口'
    },
  ],
  clusterKey: [
    value => {
      if (value) return true

      return '请输入世界认证密码'
    },
  ],
})

const toList = val =>
  (typeof val === 'string' ? val : '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

const joinList = list =>
  (Array.isArray(list) ? list : [])
    .map(s => String(s).trim())
    .filter(Boolean)
    .join('\n')

const getRoom = async () => {
  const response = await liteApi.room.get()
  const roomData = response.data ?? {}

  const list = {
    whitelist: toList(roomData.whitelist),
    adminlist: toList(roomData.adminlist),
    blocklist: toList(roomData.blocklist),
  }

  roomForm.value = {
    ...roomData,
    ...list,
  }
  if (roomForm.value.clusterKey === "") {
    roomForm.value.clusterKey = generateRandomString(14)
  }
}

const loadRoom = async () => {
  loadError.value = false

  try {
    await getRoom()
    dataGot.value = true
  } catch {
    loadError.value = true
  }
}

const isPasswordVisible = ref(false)
const isTokenVisible = ref(false)
const isClusterKeyVisible = ref(false)

const handleAddToken = () => {
  roomForm.value.token = getDstToken()
}

const emojiGameName = ref(false) // 游戏名为true 游戏描述为false
const emojiInsertMode = ref(true) // 插入模式为true 复制模式为false
const emojiDialog = ref(false)
const emojiInputNameRef = ref()
const emojiInputDescriptionRef = ref()
const cursorPosition = ref(0)

const handleEmoji = e => {
  if (emojiInsertMode.value) {
    let input, currentValue
    if (emojiGameName.value) {
      input = emojiInputNameRef.value?.$el.querySelector('input')
      if (!input) return
      currentValue = roomForm.value.gameName
    } else {
      input = emojiInputDescriptionRef.value?.$el.querySelector('input')
      if (!input) return
      currentValue = roomForm.value.description
    }

    const startPos = input.selectionStart || cursorPosition.value
    const endPos = input.selectionEnd || cursorPosition.value

    // 更新值
    if (emojiGameName.value) {
      roomForm.value.gameName =
        currentValue.substring(0, startPos) +
        e +
        currentValue.substring(endPos)
    } else {
      roomForm.value.description =
        currentValue.substring(0, startPos) +
        e +
        currentValue.substring(endPos)
    }

    // 更新光标
    const newCursorPos = startPos + e.length

    cursorPosition.value = newCursorPos

    // 设置光标位置
    nextTick(() => {
      input.setSelectionRange(newCursorPos, newCursorPos)
      input.focus()
    })
  } else {
    copyToClipboard(e).then(() => {
      showSnackbar('复制成功')
      emojiDialog.value = false
    }).catch(() => {
      showSnackbar('复制失败', 'error')
    })
  }
}

function copyToClipboard(text, onSuccess, onError) {
  // 返回一个Promise以便可以使用await或.then()
  return new Promise((resolve, reject) => {
    // 检查是否支持navigator.clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代剪贴板API
      navigator.clipboard.writeText(text)
        .then(() => {
          if (typeof onSuccess === 'function') onSuccess(text)
          resolve(text)
        })
        .catch(err => {
          if (typeof onError === 'function') onError(err, text)
          reject(err)
        })
    } else {
      // 降级方案：使用document.execCommand
      try {
        // 创建一个临时的textarea元素
        const textarea = document.createElement('textarea')

        textarea.value = text
        textarea.style.position = 'fixed' // 防止页面滚动
        textarea.style.opacity = '0' // 隐藏元素

        // 将textarea添加到DOM中
        document.body.appendChild(textarea)

        // 选中文本
        textarea.select()

        // 执行复制命令
        const success = document.execCommand('copy')

        // 移除临时元素
        document.body.removeChild(textarea)

        if (success) {
          if (typeof onSuccess === 'function') onSuccess(text)
          resolve(text)
        } else {
          throw new Error('复制失败，execCommand返回false')
        }
      } catch (err) {
        if (typeof onError === 'function') onError(err, text)
        reject(err)
      }
    }
  })
}

const saveLoading = ref(false)

const handleSave = async () => {
  saveLoading.value = true

  const { valid } = await roomFormRef.value.validate()

  if (valid) {
    // 三个名单在表单中是数组，保存时再拼成后端需要的换行分隔字符串
    const payload = {
      ...roomForm.value,
      whitelist: joinList(roomForm.value.whitelist),
      adminlist: joinList(roomForm.value.adminlist),
      blocklist: joinList(roomForm.value.blocklist),
    }

    liteApi.room.put(payload).then(response => {
      showSnackbar(response.message)
    }).finally(() => {
      saveLoading.value = false
    })
  } else {
    saveLoading.value = false
  }
}

const calculateContainerSize = () => {
  // 64(navbar) + 72(step header) + 54(step action) + 24(card margins) = 304

  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

onMounted(() => {
  loadRoom()

  // 添加事件监听
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.layout-wrapper .v-row {
  margin-bottom: 1.25rem;
}

.emoji-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
  gap: 2rem;
  justify-content: center;
}

.emoji-item {
  font-size: 3rem;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.emoji-item:hover {
  transform: scale(1.5); /* 放大1.5倍 */
}
</style>

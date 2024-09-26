<template>
  <div>
    <el-drawer
      v-model="visible"
      :title="title"
      :size="size"
      :direction="direction"
      :close-on-click-modal="closeOnClickModel"
      :destroy-on-close="destroyOnClose"
      :before-close="koiClose"
      :loading="loading"
      :footerHidden="footerHidden"
    >
      <div class="formDrawer">
        <div class="body">
          <slot name="content"></slot>
        </div>
        <div class="footer" v-if="!footerHidden">
          <el-button type="primary" loading-icon="Eleme" :loading="confirmLoading" v-throttle="koiConfirm">{{
            confirmText
          }}</el-button>
          <el-button type="danger" @click="koiCancel">{{ cancelText }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
// @ts-ignore
import { koiMsgWarning, koiMsgBox } from "@/utils/koi.ts";
// 定义参数的类型
interface IDrawerProps {
  title?: string;
  visible?: boolean;
  size?: string;
  destroyOnClose?: boolean;
  closeOnClickModel?: boolean;
  confirmText?: string;
  cancelText?: string;
  direction?: any;
  loading?: boolean;
  footerHidden?: boolean; // 是否隐藏确认和取消按钮部分
}
// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
const props = withDefaults(defineProps<IDrawerProps>(), {
  title: "朕很中意你KoiDrawer",
  visible: false,
  size: "450",
  closeOnClickModel: false,
  destroyOnClose: false,
  confirmText: "确定",
  cancelText: "取消",
  direction: "rtl",
  loading: false,
  footerHidden: false
});

// 开关变量
const visible = ref(false);
// 确定的loading，此处必须用toRefs，否则将失去响应式
const { loading } = toRefs(props);
const confirmLoading = ref(loading);

// 打开抽屉
const koiOpen = () => {
  visible.value = true;
};

// 关闭抽屉
const koiClose = () => {
  koiMsgBox("您确认进行关闭么？")
    .then(() => {
      visible.value = false;
      koiMsgWarning("已关闭");
    })
    .catch(() => {
      // 用户点击了取消按钮或关闭确认框
      // 执行取消操作或不做任何操作
      koiMsgWarning("已取消");
    });
};

// 确认提交后关闭弹窗
const koiQuickClose = () => {
  visible.value = false;
  koiMsgWarning("已提交");
};

// 确认
const koiConfirm = () => {
  emits("koiConfirm");
};

// 关闭抽屉
const koiCancel = () => {
  emits("koiCancel");
};

// 当前组件获取父组件传递的事件方法，然后点击确认和提交是触发父组件传递过来的事件
const emits = defineEmits(["koiConfirm", "koiCancel"]);

// defineExpose是vue3新增的一个api，放在<script setup>下使用的，
// 目的是把属性和方法暴露出去，可以用于父子组件通信，子组件把属性暴露出去，
// 父组件用ref获取子组件DOM，子组件暴露的方法或属性可以用dom获取。
defineExpose({
  koiOpen,
  koiClose,
  koiQuickClose
});
</script>

<style lang="scss" scoped>
.formDrawer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .body {
    bottom: 50px;
    flex: 1;
    overflow-y: auto; // 超出部分则滚动
  }
  .footer {
    display: flex;
    align-items: center;
    height: 50px;
    margin-top: auto;
    // justify-content: center;
  }
}

:deep(.el-drawer__title) {
  font-weight: 600;
  @apply dark:c-#CFD3DC;
}

:deep(.el-drawer__body) {
  padding-top: 0px;
}

:deep(.el-drawer__header) {
  margin-bottom: 18px;
}
</style>

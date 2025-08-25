<template>
  <div class="expandable-container" :class="{ 'dark-mode': darkMode }">
    <div class="header" @click="toggleExpand">
      <h3>{{ title }}</h3>
      <div class="arrow-container" :class="{ rotated: isExpanded }">
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
    </div>

    <transition name="expand">
      <div v-show="isExpanded" class="content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {ArrowRight} from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultExpanded: {
    type: Boolean,
    default: false
  },
  darkMode: {
    type: Boolean,
    default: false
  }
});

const isExpanded = ref(props.defaultExpanded);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.expandable-container {
  --bg-color: rgba(245, 245, 245, 0.9);
  --border-color: rgba(224, 224, 224, 0.8);
  --text-color: rgba(0, 0, 0, 0.87);
  --arrow-color: rgba(102, 102, 102, 0.8);
  --content-bg: rgba(255, 255, 255, 0.9);
  --hover-bg: rgba(238, 238, 238, 0.9);

  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.expandable-container.dark-mode {
  --bg-color: rgba(30, 30, 30, 0.9);
  --border-color: rgba(60, 60, 60, 0.8);
  --text-color: rgba(255, 255, 255, 0.87);
  --arrow-color: rgba(170, 170, 170, 0.8);
  --content-bg: rgba(40, 40, 40, 0.9);
  --hover-bg: rgba(60, 60, 60, 0.9);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--bg-color);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.header:hover {
  background-color: var(--hover-bg);
}

.header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
}

.arrow-container {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.arrow-container.rotated {
  transform: rotate(90deg);
}

.arrow-icon {
  width: 100%;
  height: 100%;
  fill: var(--arrow-color);
  transition: fill 0.3s ease;
}

.content {
  padding: 16px;
  background-color: var(--content-bg);
  color: var(--text-color);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
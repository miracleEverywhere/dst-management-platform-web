<template>
  <span
    ref="activatorRef"
    class="chip-select"
    :style="{ '--chip-select-max-width': maxWidth + 'px' }"
  >
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="bottom start"
      origin="top start"
      transition="slide-y-transition"
    >
      <template #activator="{ props: activatorProps }">
        <v-chip
          v-if="model===0"
          v-bind="mergeProps(activatorProps, { color })"
          variant="tonal"
          class="chip-select__activator"
        >
          <slot />
          <span class="chip-select__label">{{ t('global.noRoom') }}</span>
          <template #prepend>
            <v-icon
              :icon="props.prependIcon"
              size="18"
              class="mr-2"
            />
          </template>
          <template #append>
            <v-icon
              icon="ri-arrow-down-s-line"
              size="18"
              class="chip-select__caret"
              :class="[{ 'is-open': menu }]"
            />
          </template>
        </v-chip>
        <v-chip
          v-else
          v-bind="mergeProps(activatorProps, { color })"
          variant="tonal"
          class="chip-select__activator"
        >
          <slot />
          <span class="chip-select__label">{{ selectedLabel }}</span>
          <template #prepend>
            <v-icon
              :icon="props.prependIcon"
              size="18"
              class="mr-2"
            />
          </template>
          <template #append>
            <v-icon
              icon="ri-arrow-down-s-line"
              size="18"
              class="chip-select__caret"
              :class="[{ 'is-open': menu }]"
            />
          </template>
        </v-chip>
      </template>

      <div
        class="chip-select__dropdown"
        :style="{ width: menuWidth ? menuWidth + 'px' : null }"
      >
        <v-chip
          v-for="item in items"
          :key="getKey(item)"
          :color="color"
          variant="tonal"
          class="chip-select__option"
          @click="onSelect(item)"
        >
          <span class="chip-select__label">{{ getLabel(item) }}</span>
        </v-chip>
      </div>
    </v-menu>
  </span>
</template>

<script setup>
import { computed, mergeProps, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from "vue-i18n"

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  color: {
    type: String,
    default: 'primary',
  },
  maxWidth: {
    type: Number,
    default: 190,
  },
  prependIcon: {
    type: String,
    default: 'ri-honour-line',
  },
})

const { t } = useI18n()

const emit = defineEmits(['change'])

const model = defineModel({ default: undefined })

const menu = ref(false)
const activatorRef = ref(null)
const menuWidth = ref(0)

function getKey(item) {
  return typeof item === 'object' && item !== null ? item.roomID : item
}

function getLabel(item) {
  return typeof item === 'object' && item !== null ? item.roomName : item
}

const selectedLabel = computed(() => {
  const match = props.items.find(i => getKey(i) === model.value)

  return match ? getLabel(match) : (model.value ?? '')
})

function isSelected(item) {
  return getKey(item) === model.value
}

function onSelect(item) {
  const value = getKey(item)

  model.value = value
  emit('change', value)
  menu.value = false
}

// 下拉菜单宽度 = 激活态 chip 的实际渲染宽度
// （外层 span 仅包含激活态，下拉内容被 v-menu teleport 到 body，不占 span 宽度）
function measure() {
  const el = activatorRef.value
  if (el) {
    menuWidth.value = Math.min(el.offsetWidth, props.maxWidth)
  }
}

watch(menu, open => {
  if (open) nextTick(measure)
})

watch(model, () => nextTick(measure))

onMounted(() => nextTick(measure))
</script>

<style scoped>
.chip-select {
  display: inline-block;
}

.chip-select__activator {
  max-width: var(--chip-select-max-width);
  cursor: pointer;
}

.chip-select__option {
  width: 100%;
  max-width: var(--chip-select-max-width);
  cursor: pointer;
}

.chip-select__activator :deep(.v-chip__content),
.chip-select__option :deep(.v-chip__content) {
  width: 100%;
  min-width: 0;
}

.chip-select__label {
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chip-select__caret {
  transition: transform 0.2s ease;
}

.chip-select__caret.is-open {
  transform: rotate(180deg);
}

.chip-select__dropdown {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  margin-top: 16px;
  max-width: var(--chip-select-max-width);
}
</style>
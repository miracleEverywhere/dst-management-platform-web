<template>
  <v-card
    variant="tonal"
    class="custom-setting-card"
  >
    <v-card-text>
      <div class="d-flex align-center ga-3 mb-4">
        <v-avatar
          color="secondary"
          variant="tonal"
          rounded
        >
          <v-icon icon="ri-puzzle-2-line" />
        </v-avatar>
        <div class="flex-grow-1 overflow-hidden">
          <div class="text-body-1 font-weight-medium text-truncate">
            {{ item.name }}
          </div>
          <v-chip
            size="x-small"
            color="secondary"
            variant="outlined"
          >
            {{ t(`game.base.step2.customOverrides.types.${item.type}`) }}
          </v-chip>
        </div>
      </div>

      <v-text-field
        v-if="item.type === 'string'"
        v-model="setting"
        :label="t('game.base.step2.customOverrides.value')"
        density="compact"
        hide-details
        variant="outlined"
        @change="emitChange()"
      />
      <v-text-field
        v-else-if="item.type === 'number'"
        v-model="setting"
        :label="t('game.base.step2.customOverrides.value')"
        density="compact"
        hide-details
        type="number"
        variant="outlined"
        @change="emitChange()"
      />
      <v-switch
        v-else-if="item.type === 'boolean'"
        v-model="setting"
        :label="setting
          ? t('game.base.step2.customOverrides.enabled')
          : t('game.base.step2.customOverrides.disabled')"
        color="primary"
        density="compact"
        hide-details
        @update:model-value="emitChange"
      />
      <v-textarea
        v-else
        :label="t('game.base.step2.customOverrides.rawValue')"
        :model-value="item.raw"
        auto-grow
        density="compact"
        hide-details
        max-rows="6"
        readonly
        rows="2"
        variant="outlined"
      />

      <div
        v-if="item.type === 'complex'"
        class="text-caption text-medium-emphasis mt-2"
      >
        {{ t('game.base.step2.customOverrides.readOnly') }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['changeValue'])

const { t } = useI18n()
const setting = ref(props.item.value)

const emitChange = value => {
  emit('changeValue', {
    name: props.item.name,
    type: props.item.type,
    value: value === undefined ? setting.value : value,
  })
}

watch(() => props.item.value, value => {
  setting.value = value
})
</script>

<style scoped>
.custom-setting-card {
  height: 100%;
}
</style>

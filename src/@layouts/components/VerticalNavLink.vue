<script setup>
const props = defineProps({
  item: {
    type: null,
    required: true,
  },
})
</script>

<template>
  <li
    class="nav-link"
    :class="{ disabled: item.disable }"
  >
    <Component
      :is="item.to ? 'RouterLink' : 'a'"
      v-ripple
      :to="item.to"
      :href="item.href"
      :target="item.target"
    >
      <v-icon
        size="18"
        :icon="item.icon || 'ri-checkbox-blank-circle-line'"
        class="nav-item-icon"
      />
      <!-- 👉 Title -->
      <span class="nav-item-title">
        {{ item.title }}
      </span>
      <span
        class="nav-item-badge"
        :class="item.badgeClass"
      >
        <v-chip
          v-if="item.badgeContent"
          variant="flat"
          size="small"
          color="error"
        >
          {{ item.badgeContent }}
        </v-chip>
        <span v-else>
          {{ item.badgeContent }}
        </span>
      </span>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>

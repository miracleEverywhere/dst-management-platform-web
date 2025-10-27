<template>
  <template v-for="menu in menus">
    <vertical-nav-section-title
      v-if="menu.section!==''"
      :key="menu.id"
      :item="{heading: menu.section}"
    />
    <vertical-nav-group
      v-if="menu.type==='group'"
      :key="menu.id"
      :item="{
        title: menu.title,
        badgeContent: menu.badgeContent,
        badgeClass: menu.badgeClass,
        icon: menu.icon
      }"
      :is-open="activeGroupId === menu.id"
      @toggle="handleGroupToggle(menu.id)"
    >
      <vertical-nav-link
        v-for="link in menu.links"
        :key="link.id"
        :item="{
          title: link.title,
          icon: link.icon,
          to: link.to,
          href: link.href,
          target: link.target,
          badgeContent: link.badgeContent,
        }"
      />
    </vertical-nav-group>
    <vertical-nav-link
      v-if="menu.type==='link'"
      :key="menu.id"
      :item="{
        title: menu.title,
        icon: menu.icon,
        to: menu.to,
        href: menu.href,
        target: menu.target,
        badgeContent: menu.badgeContent,
      }"
      @click="handleCloseAll"
    />
  </template>
</template>

<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import useUserStore from '@store/user'


const userStore = useUserStore()

const menus = userStore.menus

// 当前展开的菜单组ID
const activeGroupId = ref(null)

// 展开/折叠
const handleGroupToggle = groupId => {
  if (activeGroupId.value === groupId) {
    activeGroupId.value = null
  } else {
    activeGroupId.value = groupId
  }
}

const handleCloseAll = () => {
  activeGroupId.value = null
}
</script>
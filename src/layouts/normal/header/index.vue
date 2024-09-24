<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:52:48
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppCard class="flex items-center px-12" border-b="1px solid light_border dark:dark_border">
    <MenuCollapse />

    <AppTab class="w-0 flex-1 px-12" />

    <span class="mx-6 opacity-20">|</span>

    <div class="flex flex-shrink-0 items-center px-12 text-18">
      <Language/>

      <ToggleTheme />

      <Fullscreen />

      <UserAvatar />
    </div>
  </AppCard>
</template>

<script setup>
import { ToggleTheme, Language } from '@/components'
import { AppTab, Fullscreen, MenuCollapse, UserAvatar } from '@/layouts/components'

function handleLinkClick(link) {
  window.open(link)
}
</script>

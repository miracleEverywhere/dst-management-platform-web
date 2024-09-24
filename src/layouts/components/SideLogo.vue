<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:28
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
<!--  <router-link class="h-60 f-c-c" to="/">-->
  <router-link class="h-60 pl-20" style="display: flex; align-items: center" to="/">
    <TheLogo />
    <h2
      v-show="!appStore.collapsed"
      class="ml-10 max-w-140 flex-shrink-0 text-16 color-primary font-bold"
    >
      <span v-if="appStore.language==='zh'" class="ml-10">{{ titleZH }}</span>
      <span v-if="appStore.language==='en'" class="ml-40">{{ titleEN }}</span>
    </h2>
  </router-link>
</template>

<script setup>
import { useAppStore } from '@/store'

const titleZH = import.meta.env.VITE_WEB_TITLE_ZH
const titleEN = import.meta.env.VITE_WEB_TITLE_EN_ABBREVIATION

const appStore = useAppStore()
</script>

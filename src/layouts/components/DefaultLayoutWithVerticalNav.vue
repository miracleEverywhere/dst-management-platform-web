<template>
  <vertical-nav-layout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <icon-btn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <v-icon icon="ri-menu-line" />
        </icon-btn>

        <!-- 👉 Search -->
        <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none;"
        >
          <!-- 👉 Search Trigger button -->
          <icon-btn>
            <v-icon icon="ri-search-line" />
          </icon-btn>

          <span class="d-none d-md-flex align-center text-disabled">
            <span class="me-3">Search</span>
            <span class="meta-key">&#8984;K</span>
          </span>
        </div>

        <v-spacer />

        <v-btn
          icon="ri-github-line"
          color="default"
          variant="text"
          href="https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free"
          target="_blank"
          rel="noopener noreferrer"
        />

        <lang-select />

        <navbar-theme-switcher class="me-2" />

        <user-profile />
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <router-link
        to="/"
        class="app-logo app-title-wrapper"
      >
        <!-- eslint-disable vue/no-v-html -->
        <!--        <div -->
        <!--          class="d-flex" -->
        <!--          v-html="logo" -->
        <!--        /> -->
        <v-img
          width="3em"
          height="1.9em"
          src="src/assets/images/logo1.svg"
        />
        <!-- eslint-enable -->

        <h1 class="font-weight-medium leading-normal text-xl text-uppercase">
          PMP
        </h1>
      </router-link>

      <icon-btn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <v-icon icon="ri-close-line" />
      </icon-btn>
    </template>

    <template #vertical-nav-content>
      <nav-items />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <footer />
    </template>
  </vertical-nav-layout>
</template>

<script setup>
import NavItems from '@/layouts/components/NavItems.vue'

// import logo from '@images/logo1.svg?raw'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import LangSelect from '@/layouts/components/LangSelect.vue'
import UserProfile from '@/components/UserProfile.vue'
</script>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>

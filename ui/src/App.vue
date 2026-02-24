<template>
  <v-app class="main-background">
    <snack-bar
      :message="snackbarMessage"
      :show="snackbarShow"
      :level="snackbarLevel"
    />

    <navigation-drawer v-if="authenticated" v-model="drawerOpen" />

    <app-bar v-if="authenticated" :user="user" @toggle-nav="toggleNav" />

    <!-- Sizes your content based upon application components -->
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <app-footer v-if="authenticated" />
  </v-app>
</template>

<script lang="ts" src="./App.ts"></script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* Vuetify menu/select/autocomplete dropdown transitions */
.v-menu-transition-enter-active,
.v-menu-transition-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  transform-origin: top center;
}

.v-menu-transition-enter-from {
  opacity: 0 !important;
  transform: scaleY(0.8) translateY(-8px) !important;
}

.v-menu-transition-leave-to {
  opacity: 0 !important;
  transform: scaleY(0.8) translateY(-8px) !important;
}

.v-menu-transition-enter-to,
.v-menu-transition-leave-from {
  opacity: 1 !important;
  transform: scaleY(1) translateY(0) !important;
}
</style>

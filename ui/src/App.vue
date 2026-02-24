<template>
  <v-app class="main-background">
    <snack-bar
      :message="snackbarMessage"
      :show="snackbarShow"
      :level="snackbarLevel"
    />

    <navigation-drawer v-if="authenticated" />

    <app-bar v-if="authenticated" :user="user" />

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
/* Dropdown/menu open & close transitions */
.v-overlay__content {
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
  transform-origin: top center;
}

.v-overlay--active .v-overlay__content {
  opacity: 1;
  transform: scaleY(1);
}

/* Select/autocomplete dropdown list animation */
.v-select__content,
.v-autocomplete__content {
  transform-origin: top center;
}

.v-menu > .v-overlay__content > .v-list {
  animation: dropdown-in 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dropdown list items stagger animation */
.v-menu .v-list-item {
  animation: item-fade-in 0.12s ease both;
}

@keyframes item-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<template>
  <v-navigation-drawer
    :rail="!isMobile && mini"
    :permanent="!isMobile"
    :temporary="isMobile"
    v-model="drawerOpen"
    :disable-route-watcher="true"
    class="nav-drawer"
  >
    <div class="nav-header d-flex align-center" :class="mini ? 'justify-center' : ''">
      <v-btn
        icon
        variant="text"
        size="small"
        @click.stop="mini = !mini"
      >
        <v-icon>{{ mini ? 'mdi-menu' : 'mdi-close' }}</v-icon>
      </v-btn>
      <span v-if="!mini" class="text-body-1 font-weight-bold ml-2 brand-title">WUD</span>
    </div>

    <v-divider class="nav-divider" />

    <v-list nav class="px-2 pt-2 pb-1">
      <v-list-item
        to="/"
        key="home"
        class="nav-item mb-1"
        prepend-icon="mdi-home"
        rounded="lg"
      >
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item
        to="/containers"
        key="containers"
        class="nav-item mb-1"
        :prepend-icon="containerIcon"
        rounded="lg"
      >
        <v-list-item-title>Containers</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="nav-divider mx-3" />

    <div v-if="!mini" class="section-label">Configuration</div>

    <v-list nav class="px-2 pt-1 pb-0">
      <v-list-item
        v-for="configurationItem in configurationItemsSorted"
        :key="configurationItem.to"
        :to="configurationItem.to"
        class="nav-item mb-1"
        :class="{ 'nav-sub-item': !mini }"
        :prepend-icon="configurationItem.icon"
        rounded="lg"
      >
        <v-list-item-title class="text-capitalize">
          {{ configurationItem.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider class="nav-divider" />
      <div class="pa-3 d-flex align-center" :class="mini ? 'justify-center' : 'justify-space-between'">
        <span v-if="!mini" class="text-caption" style="color: rgba(var(--v-theme-on-surface), 0.6);">
          {{ darkMode ? 'Dark' : 'Light' }} Mode
        </span>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="toggleDarkMode(!darkMode)"
        >
          <v-icon size="small">{{ darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" src="./NavigationDrawer.ts"></script>

<style scoped>
.nav-drawer {
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
}

.nav-header {
  height: 48px;
  padding: 0 12px;
  background-color: rgb(var(--v-theme-primary));
}

.nav-header :deep(.v-icon) {
  color: rgba(255, 255, 255, 0.85);
}

.brand-title {
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.85);
}

.nav-divider {
  border-color: rgba(var(--v-theme-on-surface), 0.1) !important;
}

.section-label {
  padding: 12px 20px 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.4);
}

.nav-item {
  margin-bottom: 2px;
  transition: background-color 0.15s ease;
}

.nav-item :deep(.v-list-item-title) {
  font-size: 0.875rem;
}

.nav-sub-item {
  padding-left: 8px !important;
}

.nav-sub-item :deep(.v-list-item-title) {
  font-size: 0.8125rem;
}

/* Override Vuetify's default active state */
.nav-item.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.15);
}

.nav-item.v-list-item--active :deep(.v-icon) {
  color: rgb(var(--v-theme-primary));
}

.nav-item.v-list-item--active :deep(.v-list-item-title) {
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
}

/* Hover state */
.nav-item:not(.v-list-item--active):hover {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
}

/* Keep icons centred in rail (collapsed) mode */
:deep(.v-navigation-drawer--rail) .v-list-item {
  justify-content: center;
}
</style>

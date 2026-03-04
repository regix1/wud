<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    :rail="!isMobile && mini"
    :permanent="!isMobile"
    :temporary="isMobile"
    :disable-route-watcher="!isMobile"
    class="nav-drawer"
  >
    <!-- Header -->
    <template #prepend>
      <v-list density="compact" class="nav-header-list">
        <v-list-item prepend-icon="mdi-menu" title="WUD" density="compact" class="nav-header-item" @click="!isMobile ? toggleMini() : closeMobileDrawer()">
          <template v-slot:append>
            <v-icon v-if="!isMobile">{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
            <v-btn v-else icon="mdi-close" variant="text" size="small" density="comfortable" @click.stop="closeMobileDrawer" />
          </template>
        </v-list-item>
      </v-list>
    </template>

    <!-- Main nav items -->
    <v-list density="compact" nav class="nav-list">
      <v-list-item
        v-for="item in mainItems"
        :key="item.route"
        :to="item.route"
        :prepend-icon="item.icon"
        :title="item.name"
        active-class="nav-item--active"
        rounded="lg"
        class="nav-item"
      />
    </v-list>

    <v-divider class="my-1" />

    <!-- Configuration section -->
    <v-list density="compact" nav class="nav-list">
      <div v-if="isMobile || !mini" class="nav-section-label">Configuration</div>
      <v-list-item
        v-for="item in configItems"
        :key="item.route"
        :to="item.route"
        :prepend-icon="item.icon"
        :title="item.name"
        active-class="nav-item--active"
        rounded="lg"
        class="nav-item"
      />
    </v-list>

    <!-- Footer: dark mode toggle -->
    <template #append>
      <v-list density="compact" nav class="nav-footer-list">
        <v-list-item :prepend-icon="darkModeIcon" :title="darkModeLabel" @click="toggleDarkMode" class="nav-footer-item" />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" src="./NavigationDrawer.ts"></script>

<style scoped>
.nav-header-list {
  background-color: rgb(var(--v-theme-primary)) !important;
  padding: 0 !important;
}

.nav-header-item {
  color: white !important;
  min-height: 40px;
  max-height: 40px;
  cursor: pointer;
}

.nav-header-item :deep(.v-list-item__prepend .v-icon) {
  color: white !important;
  opacity: 1 !important;
}

.nav-header-item :deep(.v-list-item__append .v-btn) {
  color: white !important;
}

.nav-header-item :deep(.v-list-item__append .v-icon) {
  color: white !important;
  opacity: 1 !important;
}

.nav-header-item :deep(.v-list-item-title) {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: white !important;
}

.nav-list {
  padding: 4px 8px;
}

.nav-item {
  margin-bottom: 2px;
  transition: background-color 0.15s ease;
}

.nav-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.nav-section-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.55);
  padding: 4px 12px 2px;
  margin-top: 4px;
}

.nav-footer-list {
  padding: 4px 8px !important;
}

.nav-footer-item {
  border-radius: 8px;
  min-height: 40px;
  max-height: 40px;
}

.nav-drawer :deep(.v-divider) {
  border-color: rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
</style>

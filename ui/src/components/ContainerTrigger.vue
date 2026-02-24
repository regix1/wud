<template>
  <v-card variant="flat" class="trigger-card">
    <v-list-item class="pa-3">
      <template v-slot:prepend>
        <v-icon color="secondary">mdi-bell-ring</v-icon>
      </template>
      <v-list-item-title class="d-flex align-center gap-sm flex-wrap">
        <router-link to="/configuration/triggers" class="text-decoration-none">
          <v-chip label size="small" color="info" variant="tonal" class="text-capitalize">{{ trigger.type }}</v-chip>
        </router-link>
        <span class="text-body-2 font-weight-medium">{{ trigger.name }}</span>
      </v-list-item-title>
      <v-list-item-subtitle class="mt-1">
        Threshold:
        <v-chip size="x-small" label variant="tonal" color="info">{{ trigger.configuration.threshold }}</v-chip>
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-btn
          variant="outlined"
          color="accent"
          size="small"
          :disabled="!updateAvailable"
          @click="runTrigger"
          :loading="isTriggering"
        >
          Run
          <v-icon end size="small">mdi-gesture-tap</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-card>
</template>

<script lang="ts" src="./ContainerTrigger.ts"></script>

<style scoped>
.trigger-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: box-shadow 0.2s ease;
}
.trigger-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.gap-sm {
  gap: 8px;
}
</style>

<template>
  <v-container fluid class="pa-4">
    <v-row v-for="watcher in watchers" :key="watcher.name" dense>
      <v-col :cols="12" class="pt-2 pb-2">
        <configuration-item :item="watcher" />
      </v-col>
    </v-row>
    <v-row v-if="watchers.length === 0">
      <v-col>
        <v-card variant="flat" class="text-center pa-8 my-4">
          <v-icon size="64" color="secondary" class="mb-4">mdi-update</v-icon>
          <div class="text-h6">No watchers configured</div>
          <div class="text-body-2 text-medium-emphasis mt-2">Docker watchers will appear here once configured</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src="./ConfigurationWatchersView.ts"></script>

<template>
  <v-container fluid class="pa-4">
    <v-row v-for="registry in registries" :key="registry.id" dense>
      <v-col :cols="12" class="pt-2 pb-2">
        <configuration-item :item="registry" />
      </v-col>
    </v-row>
    <v-row v-if="registries.length === 0">
      <v-col>
        <v-card variant="flat" class="text-center pa-8 my-4">
          <v-icon size="64" color="secondary" class="mb-4">mdi-database-search</v-icon>
          <div class="text-h6">No registries configured</div>
          <div class="text-body-2 text-medium-emphasis mt-2">Registry providers will appear here once configured</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src="./ConfigurationRegistriesView.ts"></script>

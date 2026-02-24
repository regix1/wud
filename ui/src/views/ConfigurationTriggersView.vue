<template>
  <v-container fluid class="pa-4">
    <v-row v-for="trigger in triggers" :key="trigger.id" dense>
      <v-col :cols="12" class="pt-2 pb-2">
        <trigger-detail :trigger="trigger" />
      </v-col>
    </v-row>
    <v-row v-if="triggers.length === 0">
      <v-col>
        <v-card variant="flat" class="text-center pa-8 my-4">
          <v-icon size="64" color="secondary" class="mb-4">mdi-bell-ring</v-icon>
          <div class="text-h6">No triggers configured</div>
          <div class="text-body-2 text-medium-emphasis mt-2">Notification triggers will appear here once configured</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src="./ConfigurationTriggersView.ts"></script>

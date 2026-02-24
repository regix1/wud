<template>
  <v-container fluid>
    <v-row v-if="triggers.length > 0">
      <v-col v-for="trigger in triggers" :key="trigger.id" lg="6" sm="12">
        <container-trigger
          :trigger="trigger"
          :update-available="container.updateAvailable"
          :container-id="container.id"
        />
      </v-col>
    </v-row>
    <v-card-text v-else class="text-center pa-8">
      <v-icon size="48" color="secondary" class="mb-2">mdi-bell-off-outline</v-icon>
      <div class="text-body-2 text-medium-emphasis">No triggers associated to this container</div>
    </v-card-text>
  </v-container>
</template>

<script lang="ts" src="./ContainerTriggers.ts"></script>

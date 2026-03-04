<template>
  <v-card variant="flat" class="filter-card pa-4">
    <v-row dense align="center">
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          :hide-details="true"
          v-model="watcherSelected"
          :items="watchers"
          :virtual="true"
          :clearable="watchers.length > 0"
          clear-icon="mdi-close"
          label="Watcher"
          variant="outlined"
          density="compact"
          color="primary"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          :hide-details="true"
          v-model="registrySelected"
          :items="registries"
          :virtual="true"
          :clearable="registries.length > 0"
          clear-icon="mdi-close"
          label="Registry"
          variant="outlined"
          density="compact"
          color="primary"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          :hide-details="true"
          v-model="updateKindSelected"
          :items="updateKinds"
          :virtual="true"
          :clearable="updateKinds.length > 0"
          clear-icon="mdi-close"
          label="Update kind"
          variant="outlined"
          density="compact"
          color="primary"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          label="Group by label"
          :items="groupLabels"
          v-model="groupByLabelLocal"
          :virtual="true"
          :clearable="groupLabels.length > 0"
          clear-icon="mdi-close"
          variant="outlined"
          density="compact"
          :hide-details="true"
          color="primary"
        >
        </v-autocomplete>
      </v-col>
    </v-row>

    <v-divider class="my-3" style="border-color: rgba(var(--v-border-color), var(--v-border-opacity));" />

    <v-row dense align="center" justify="space-between">
      <v-col cols="12" sm="auto" class="d-flex align-center ga-6">
        <v-switch
          label="Update available"
          v-model="updateAvailableLocal"
          :hide-details="true"
          density="compact"
          color="primary"
          class="flex-grow-0"
        />
        <v-switch
          label="Oldest first"
          v-model="oldestFirstLocal"
          :hide-details="true"
          density="compact"
          color="primary"
          class="flex-grow-0"
        />
      </v-col>
      <v-col cols="12" sm="auto">
        <v-btn
          color="secondary"
          @click.stop="refreshAllContainers"
          :loading="isRefreshing"
        >
          Watch now
          <v-icon end>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" src="./ContainerFilter.ts"></script>

<style scoped>
.filter-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep(.v-field__clearable) {
  opacity: 0.5;
  transition: opacity 0.15s ease;
}

:deep(.v-field__clearable:hover) {
  opacity: 1;
}

:deep(.v-field__clearable .v-icon) {
  font-size: 16px;
}
</style>

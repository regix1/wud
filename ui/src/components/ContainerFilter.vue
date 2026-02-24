<template>
  <v-card variant="flat" class="filter-card pa-4">
    <v-row dense align="center">
      <v-col cols="12" sm="6" md="3">
        <v-select
          :hide-details="true"
          v-model="watcherSelected"
          :items="watchers"
          @update:modelValue="emitWatcherChanged"
          :clearable="true"
          clear-icon="mdi-close"
          label="Watcher"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          :hide-details="true"
          v-model="registrySelected"
          :items="registries"
          @update:modelValue="emitRegistryChanged"
          :clearable="true"
          clear-icon="mdi-close"
          label="Registry"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          :hide-details="true"
          v-model="updateKindSelected"
          :items="updateKinds"
          @update:modelValue="emitUpdateKindChanged"
          :clearable="true"
          clear-icon="mdi-close"
          label="Update kind"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          label="Group by label"
          :items="groupLabels"
          v-model="groupByLabelLocal"
          @update:modelValue="emitGroupByLabelChanged"
          clearable
          clear-icon="mdi-close"
          variant="outlined"
          density="compact"
          :hide-details="true"
        >
        </v-autocomplete>
      </v-col>
    </v-row>

    <v-divider class="my-3" style="border-color: rgba(var(--v-theme-on-surface), 0.1);" />

    <v-row dense align="center" justify="space-between">
      <v-col cols="auto" class="d-flex align-center ga-6">
        <v-switch
          label="Update available"
          v-model="updateAvailableLocal"
          @update:modelValue="emitUpdateAvailableChanged"
          :hide-details="true"
          density="compact"
          color="primary"
          class="flex-grow-0"
        />
        <v-switch
          label="Oldest first"
          v-model="oldestFirstLocal"
          @update:modelValue="emitOldestFirstChanged"
          :hide-details="true"
          density="compact"
          color="primary"
          class="flex-grow-0"
        />
      </v-col>
      <v-col cols="auto">
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
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
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

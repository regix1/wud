<template>
  <v-container class="pa-4" style="max-width: 1400px;">
    <v-row dense>
      <v-col>
        <container-filter
          :registries="registries"
          :registry-selected-init="registrySelected"
          :watchers="watchers"
          :watcher-selected-init="watcherSelected"
          :update-kinds="updateKinds"
          :update-kind-selected-init="updateKindSelected"
          :updateAvailable="updateAvailableSelected"
          :oldestFirst="oldestFirst"
          :groupByLabel="groupByLabel"
          :groupLabels="allContainerLabels"
          @registry-changed="onRegistryChanged"
          @watcher-changed="onWatcherChanged"
          @update-available-changed="onUpdateAvailableChanged"
          @oldest-first-changed="onOldestFirstChanged"
          @group-by-label-changed="onGroupByLabelChanged"
          @update-kind-changed="onUpdateKindChanged"
          @refresh-all-containers="onRefreshAllContainers"
        />
      </v-col>
    </v-row>
    <v-row
      v-for="(container, index) in containersFiltered"
      :key="container.id"
    >
      <v-col class="container-item-col">
        <container-item
          :groupingLabel="groupByLabel"
          :previousContainer="containersFiltered[(index as number) - 1]"
          :container="container"
          :oldest-first="oldestFirst"
          @delete-container="deleteContainer(container)"
          @container-deleted="removeContainerFromList(container)"
        />
      </v-col>
    </v-row>
    <v-row v-if="containersFiltered.length === 0">
      <v-col>
        <v-card variant="flat" class="text-center pa-4 pa-sm-8 my-4">
          <v-icon size="64" color="secondary" class="mb-4">mdi-docker</v-icon>
          <div class="text-h6">No containers found</div>
          <div class="text-body-2 text-medium-emphasis mt-2">Containers will appear here once watchers detect them</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src="./ContainersView.ts"></script>

<style scoped>
.container-item-col {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>

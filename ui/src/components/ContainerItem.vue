<template>
  <div>
    <div
      v-if="
        this.groupingLabel &&
        this.previousContainer?.labels?.[this.groupingLabel] !==
          this.container.labels?.[this.groupingLabel]
      "
    >
      <div class="text-h6">
        {{ this.groupingLabel }} =
        {{ this.container.labels?.[this.groupingLabel] ?? "(empty)" }}
      </div>
      <v-divider class="pb-3"></v-divider>
    </div>
    <v-card :class="{ 'update-available': container.updateAvailable }">
      <v-card-title
        @click="collapseDetail()"
        class="clickable-header pa-3 d-flex align-center bg-surface"
      >
        <div
          class="text-body-2 d-flex align-center gap-sm"
        >
          <span v-if="smAndUp">
            <v-chip label color="info" variant="tonal">
              <v-icon start>mdi-update</v-icon>
              {{ container.watcher }}
            </v-chip>
            /
          </span>
          <span v-if="mdAndUp">
            <v-chip label color="info" variant="tonal">
              <IconRenderer
                v-if="smAndUp"
                :icon="registryIcon"
                :size="24"
                :margin-right="8"
              />
              {{ container.image.registry.name }}
            </v-chip>
            /
          </span>
          <v-chip label color="info" variant="tonal">
            <IconRenderer
              v-if="smAndUp"
              :icon="container.displayIcon"
              :size="24"
              :margin-right="8"
            />
            <span class="text-truncate-custom">
              {{ container.displayName }}
            </span>
          </v-chip>
          <span>
            :
            <v-chip label variant="tonal" color="info">
              {{ container.image.tag.value }}
            </v-chip>
          </span>
        </div>

        <v-spacer />

        <div class="d-flex align-center gap-sm">
          <span v-if="smAndUp && container.updateAvailable" class="d-flex align-center gap-sm">
            <v-icon>mdi-arrow-right</v-icon>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-chip
                  label
                  variant="outlined"
                  :color="newVersionClass"
                  v-bind="props"
                  @click="
                    copyToClipboard('container new version', newVersion);
                    $event.stopImmediatePropagation();
                  "
                >
                  {{ newVersion }}
                  <v-icon end size="small">mdi-clipboard-outline</v-icon>
                </v-chip>
              </template>
              <span class="text-caption">Copy to clipboard</span>
            </v-tooltip>
          </span>

          <span
            v-if="smAndUp && oldestFirst"
            class="text-caption"
          >
            {{ this.$filters.date(container.image.created) }}
          </span>

          <v-icon>{{
            showDetail ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </div>
      </v-card-title>
        <div v-if="showDetail">
          <v-tabs
            :stacked="smAndUp"
            fixed-tabs
            v-model="tab"
            ref="tabs"
          >
            <v-tab v-if="container.result">
              <span v-if="smAndUp">Update</span>
              <v-icon>mdi-package-down</v-icon>
            </v-tab>
            <v-tab>
              <span v-if="smAndUp">Triggers</span>
              <v-icon>mdi-bell-ring</v-icon>
            </v-tab>
            <v-tab>
              <span v-if="smAndUp">Image</span>
              <v-icon>mdi-package-variant-closed</v-icon>
            </v-tab>
            <v-tab>
              <span v-if="smAndUp">Container</span>
              <IconRenderer
                :icon="container.displayIcon"
                :size="24"
                :margin-right="0"
              />
            </v-tab>
            <v-tab v-if="container.error">
              <span v-if="smAndUp">Error</span>
              <v-icon>mdi-alert</v-icon>
            </v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item v-if="container.result">
              <container-update
                :result="container.result"
                :semver="container.image.tag.semver"
                :update-kind="container.updateKind"
                :update-available="container.updateAvailable"
              />
            </v-window-item>
            <v-window-item>
              <container-triggers :container="container" />
            </v-window-item>
            <v-window-item>
              <container-image :image="container.image" />
            </v-window-item>
            <v-window-item>
              <container-detail :container="container" />
            </v-window-item>
            <v-window-item v-if="container.error">
              <container-error :error="container.error" />
            </v-window-item>
          </v-window>

          <v-card-actions>
            <v-row>
              <v-col class="text-center">
                <v-dialog
                  v-model="dialogDelete"
                  width="500"
                  v-if="deleteEnabled"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      size="small"
                      color="error"
                      variant="outlined"
                      v-bind="props"
                    >
                      Delete
                      <v-icon end>mdi-delete</v-icon>
                    </v-btn>
                  </template>

                  <v-card class="text-center">
                    <v-app-bar color="error" flat density="compact">
                      <v-toolbar-title class="text-body-1">
                        Delete the container?
                      </v-toolbar-title>
                    </v-app-bar>
                    <v-card-subtitle class="text-body-2">
                      <v-row class="mt-2" no-gutters>
                        <v-col>
                          Delete
                          <span class="font-weight-bold text-error">{{
                            container.name
                          }}</span>
                          from the list?
                          <br />
                          <span class="font-italic"
                            >(The real container won't be deleted)</span
                          >
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="text-center">
                          <v-btn variant="outlined" @click="dialogDelete = false" size="small">
                            Cancel
                          </v-btn>
                          &nbsp;
                          <v-btn
                            color="error"
                            size="small"
                            @click="
                              dialogDelete = false;
                              deleteContainer();
                            "
                          >
                            Delete
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-subtitle>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-card-actions>
        </div>
    </v-card>
  </div>
</template>

<script lang="ts" src="./ContainerItem.ts"></script>

<style scoped>
.clickable-header {
  cursor: pointer;
}

.gap-sm {
  gap: 8px;
}

.text-truncate-custom {
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.update-available {
  border-left: 3px solid rgb(var(--v-theme-warning));
}
</style>

<template>
  <div>
  <v-card>
    <v-card-title
      @click="collapse()"
      class="clickable-header pa-3 d-flex align-center bg-surface"
    >
      <div class="text-body-2">
        <v-chip label color="info" variant="tonal">{{ trigger.type }}</v-chip>
        /
        <v-chip label color="info" variant="tonal">{{ trigger.name }}</v-chip>
      </div>
      <v-spacer />
      <v-icon :size="24">{{ trigger.icon }}</v-icon>
      <v-icon>{{ showDetail ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
    </v-card-title>
      <v-expand-transition>
      <v-card-text v-if="showDetail">
        <v-row>
          <v-col cols="12" sm="8">
            <div v-if="configurationItems.length > 0" class="table-scroll-wrapper">
              <table class="config-table">
                <tbody>
                  <tr v-for="configurationItem in configurationItems" :key="configurationItem.key">
                    <td class="text-capitalize text-medium-emphasis config-key">
                      {{ configurationItem.key }}
                    </td>
                    <td class="config-value">
                      <!-- Boolean values: colored chip -->
                      <v-chip
                        v-if="typeof configurationItem.value === 'boolean'"
                        :color="configurationItem.value ? 'success' : 'error'"
                        size="x-small"
                        label
                        variant="tonal"
                      >
                        {{ configurationItem.value }}
                      </v-chip>
                      <!-- Number values: info chip -->
                      <v-chip
                        v-else-if="typeof configurationItem.value === 'number'"
                        color="info"
                        size="x-small"
                        label
                        variant="tonal"
                      >
                        {{ configurationItem.value }}
                      </v-chip>
                      <!-- Empty/null: muted text -->
                      <span v-else-if="configurationItem.value === undefined || configurationItem.value === null || configurationItem.value === ''"
                        class="text-disabled font-italic"
                      >
                        empty
                      </span>
                      <!-- String values: check if it looks like a path/command -->
                      <code v-else-if="looksLikeCode(configurationItem.value)" class="config-code">
                        {{ configurationItem.value }}
                      </code>
                      <!-- Default: regular text -->
                      <span v-else class="text-body-2">{{ configurationItem.value }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <span v-else>Default configuration</span>
          </v-col>
          <v-col cols="12" sm="4" class="text-right">
            <v-btn variant="outlined" size="small" color="accent" @click.stop="showTestForm = true">
              Test
              <v-icon end>mdi-test-tube</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      </v-expand-transition>
  </v-card>

  <Teleport to="body">
    <transition name="slide-right">
      <div v-if="showTestForm" class="trigger-panel-overlay" @click.self="showTestForm = false">
        <div class="trigger-panel" :style="{ width: smAndUp ? '500px' : '75vw' }">
          <div class="d-flex align-center justify-space-between pa-3 pb-0">
            <div class="text-subtitle-2">
              <v-icon size="small">mdi-test-tube</v-icon>
              Test trigger
            </div>
            <v-btn icon="mdi-close" variant="text" size="small" density="comfortable" @click="showTestForm = false" />
          </div>
          <div class="pa-3 pt-2">
            <v-text-field
              label="Container ID"
              v-model="container.id"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-text-field
              label="Container Name"
              v-model="container.name"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-text-field
              label="Container Watcher"
              v-model="container.watcher"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-autocomplete
              label="Update kind"
              v-model="container.updateKind.kind"
              :items="['digest', 'tag']"
              :virtual="true"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-autocomplete
              v-if="container.updateKind.kind === 'tag'"
              label="Update semver diff"
              v-model="container.updateKind.semverDiff"
              :items="['major', 'minor', 'patch']"
              :virtual="true"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-text-field
              label="Container local value"
              v-model="container.updateKind.localValue"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-text-field
              label="Container remote value"
              v-model="container.updateKind.remoteValue"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            />
            <v-btn
              variant="outlined"
              size="small"
              color="accent"
              block
              @click="runTrigger"
              :loading="isTriggering"
              >Run trigger</v-btn
            >
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
  </div>
</template>

<script lang="ts" src="./TriggerDetail.ts"></script>

<style scoped>
.clickable-header {
  cursor: pointer;
}

.config-table {
  width: 100%;
  background: transparent;
  border-collapse: collapse;
}

.config-table td {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  padding: 6px 12px !important;
}

.table-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.config-key {
  width: 160px;
  font-weight: 500;
  white-space: nowrap;
}

.config-value {
  word-break: break-word;
}

.config-code {
  background: rgba(var(--v-theme-on-surface), 0.10);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-family: 'Roboto Mono', monospace;
  color: rgb(var(--v-theme-secondary));
}
</style>

<style>
.trigger-panel-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
}

.trigger-panel {
  height: 100%;
  background: rgb(var(--v-theme-surface));
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-active .trigger-panel,
.slide-right-leave-active .trigger-panel {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  background: rgba(0, 0, 0, 0);
}

.slide-right-enter-from .trigger-panel {
  transform: translateX(100%);
}

.slide-right-leave-to .trigger-panel {
  transform: translateX(100%);
}

.trigger-panel .v-field--focused .v-field__outline {
  --v-field-border-opacity: 0.4;
  color: rgb(var(--v-theme-secondary)) !important;
}
</style>

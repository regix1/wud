<template>
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
      <v-card-text v-if="showDetail">
        <v-row>
          <v-col cols="8">
            <table class="config-table" v-if="configurationItems.length > 0">
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
            <span v-else>Default configuration</span>
          </v-col>
          <v-col cols="4" class="text-right">
            <v-btn variant="outlined" size="small" color="accent" @click="showTestForm = true">
              Test
              <v-icon end>mdi-test-tube</v-icon>
            </v-btn>

            <v-navigation-drawer
              v-model="showTestForm"
              location="right"
              temporary
              width="400"
            >
              <div class="pa-3">
                <div class="text-subtitle-2 mb-2">
                  <v-icon size="small">mdi-test-tube</v-icon>
                  Test trigger
                </div>
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
                <v-select
                  label="Update kind"
                  v-model="container.updateKind.kind"
                  :items="['digest', 'tag']"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mb-2"
                />
                <v-select
                  v-if="container.updateKind.kind === 'tag'"
                  label="Update semver diff"
                  v-model="container.updateKind.semverDiff"
                  :items="['major', 'minor', 'patch']"
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
            </v-navigation-drawer>
          </v-col>
        </v-row>
      </v-card-text>
  </v-card>
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
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06) !important;
  padding: 6px 12px !important;
}

.config-key {
  width: 140px;
  white-space: nowrap;
  font-weight: 500;
}

.config-value {
  word-break: break-word;
}

.config-code {
  background: rgba(var(--v-theme-on-surface), 0.06);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-family: 'Roboto Mono', monospace;
  color: rgb(var(--v-theme-secondary));
}
</style>

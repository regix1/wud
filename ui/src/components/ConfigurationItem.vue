<template>
  <v-card>
    <v-card-title
      @click="collapse()"
      class="clickable-header pa-3 d-flex align-center bg-surface"
    >
      <div class="text-body-2">
        <v-chip label color="info" variant="tonal">{{ item.type }}</v-chip>
        /
        <v-chip label color="info" variant="tonal">{{ item.name }}</v-chip>
      </div>
      <v-spacer />
      <IconRenderer :icon="item.icon" :size="24" :margin-right="8" />
      <v-icon>{{ showDetail ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
    </v-card-title>
      <v-card-text v-if="showDetail">
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
      </v-card-text>
  </v-card>
</template>

<script lang="ts" src="./ConfigurationItem.ts"></script>

<style scoped>
.clickable-header {
  cursor: pointer;
}

.v-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
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

<template>
  <v-card-text>
    <div class="table-scroll-wrapper">
      <table class="config-table">
        <tbody>
          <tr>
            <td class="text-capitalize text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-identifier</v-icon>
              Id
            </td>
            <td class="config-value">
              <code class="config-code">{{ image.id }}</code>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" size="x-small" icon v-bind="props" @click="copyToClipboard('image id', image.id)">
                    <v-icon size="x-small">mdi-clipboard-outline</v-icon>
                  </v-btn>
                </template>
                <span class="text-caption">Copy to clipboard</span>
              </v-tooltip>
            </td>
          </tr>
          <tr>
            <td class="text-capitalize text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-pencil</v-icon>
              Name
            </td>
            <td class="config-value">{{ image.name }}</td>
          </tr>
          <tr>
            <td class="text-capitalize text-medium-emphasis config-key">
              <IconRenderer :icon="registryIcon" :size="18" :margin-right="0" class="mr-2" />
              Registry
            </td>
            <td class="config-value">{{ image.registry.name }}</td>
          </tr>
          <tr>
            <td class="text-capitalize text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-tag</v-icon>
              Tag
            </td>
            <td class="config-value">
              {{ image.tag.value }}
              <v-chip v-if="image.tag.semver" size="x-small" variant="outlined" color="success" label class="ml-2">semver</v-chip>
            </td>
          </tr>
          <tr v-if="image.digest.value">
            <td class="text-capitalize text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-function-variant</v-icon>
              Digest
            </td>
            <td class="config-value">
              <code class="config-code">{{ image.digest.value }}</code>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" size="x-small" icon v-bind="props" @click="copyToClipboard('image digest', image.digest.value)">
                    <v-icon size="x-small">mdi-clipboard-outline</v-icon>
                  </v-btn>
                </template>
                <span class="text-caption">Copy to clipboard</span>
              </v-tooltip>
            </td>
          </tr>
          <tr>
            <td class="text-capitalize text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">{{ osIcon }}</v-icon>
              OS / Architecture
            </td>
            <td class="config-value">{{ image.os }} / {{ image.architecture }}</td>
          </tr>
          <tr v-if="image.created">
            <td class="text-capitalize text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-calendar</v-icon>
              Created
            </td>
            <td class="config-value">{{ $filters.date(image.created) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-card-text>
</template>

<script lang="ts" src="./ContainerImage.ts"></script>

<style scoped>
.table-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
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
  width: 120px;
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

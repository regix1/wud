<template>
  <div>
    <v-card-text v-if="updateAvailable">
      <div class="table-scroll-wrapper">
        <table class="config-table">
          <tbody>
          <!-- Row: Tag (conditional on result.tag) -->
          <tr v-if="result.tag">
            <td class="text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-tag</v-icon>
              Tag
              <v-chip v-if="semver" size="x-small" variant="outlined" color="success" label class="ml-2">semver</v-chip>
            </td>
            <td class="config-value">
              <code class="config-code">{{ result.tag }}</code>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" size="x-small" icon v-bind="props" @click="copyToClipboard('update tag', result.tag)">
                    <v-icon size="x-small">mdi-clipboard-outline</v-icon>
                  </v-btn>
                </template>
                <span class="text-caption">Copy to clipboard</span>
              </v-tooltip>
            </td>
          </tr>
          <!-- Row: Link (conditional on result.link) -->
          <tr v-if="result.link">
            <td class="text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-link</v-icon>
              Link
            </td>
            <td class="config-value">
              <a :href="result.link" target="_blank">{{ result.link }}</a>
            </td>
          </tr>
          <!-- Row: Digest (conditional on result.digest) -->
          <tr v-if="result.digest">
            <td class="text-medium-emphasis config-key">
              <v-icon size="small" color="secondary" class="mr-2">mdi-function-variant</v-icon>
              Digest
            </td>
            <td class="config-value">
              <code class="config-code">{{ result.digest }}</code>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" size="x-small" icon v-bind="props" @click="copyToClipboard('update digest', result.digest)">
                    <v-icon size="x-small">mdi-clipboard-outline</v-icon>
                  </v-btn>
                </template>
                <span class="text-caption">Copy to clipboard</span>
              </v-tooltip>
            </td>
          </tr>
          <!-- Row: Update kind (always shown) -->
          <tr>
            <td class="text-medium-emphasis config-key">
              <v-icon v-if="updateKind.semverDiff === 'patch'" size="small" color="success" class="mr-2">mdi-information</v-icon>
              <v-icon v-else-if="updateKind.semverDiff === 'major'" size="small" color="error" class="mr-2">mdi-alert-decagram</v-icon>
              <v-icon v-else size="small" color="warning" class="mr-2">mdi-alert</v-icon>
              Update kind
            </td>
            <td class="config-value">
              <v-chip
                size="x-small"
                label
                variant="tonal"
                :color="updateKind.semverDiff === 'patch' ? 'success' : updateKind.semverDiff === 'major' ? 'error' : 'warning'"
              >
                {{ updateKindFormatted }}
              </v-chip>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </v-card-text>
    <v-card-text v-else class="text-center pa-8">
      <v-icon size="48" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
      <div class="text-body-2 text-medium-emphasis">No update available</div>
    </v-card-text>
  </div>
</template>

<script lang="ts" src="./ContainerUpdate.ts"></script>

<style scoped>
.table-scroll-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.config-table { width: 100%; background: transparent; border-collapse: collapse; }
.config-table td { border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06) !important; padding: 6px 12px !important; }
.config-key { width: 120px; font-weight: 500; }
.config-value { word-break: break-word; }
.config-code { background: rgba(var(--v-theme-on-surface), 0.06); padding: 2px 8px; border-radius: 4px; font-size: 0.8125rem; font-family: 'Roboto Mono', monospace; color: rgb(var(--v-theme-secondary)); }
</style>

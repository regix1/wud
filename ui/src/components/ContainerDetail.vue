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
            <code class="config-code">{{ container.id }}</code>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn variant="text" size="x-small" icon v-bind="props" @click="copyToClipboard('container id', container.id)">
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
          <td class="config-value">{{ container.name }}</td>
        </tr>
        <tr>
          <td class="text-capitalize text-medium-emphasis config-key">
            <v-icon size="small" color="secondary" class="mr-2">mdi-restart</v-icon>
            Status
          </td>
          <td class="config-value">
            <v-chip size="x-small" label variant="tonal" :color="container.status === 'running' ? 'success' : 'warning'">{{ container.status }}</v-chip>
          </td>
        </tr>
        <tr>
          <td class="text-capitalize text-medium-emphasis config-key">
            <v-icon size="small" color="secondary" class="mr-2">mdi-update</v-icon>
            Watcher
          </td>
          <td class="config-value">
            <router-link to="/configuration/watchers">{{ container.watcher }}</router-link>
          </td>
        </tr>
        <tr v-if="container.includeTags">
          <td class="text-capitalize text-medium-emphasis config-key">
            <v-icon size="small" color="secondary" class="mr-2">mdi-tag</v-icon>
            Include tags
          </td>
          <td class="config-value">
            <code class="config-code">{{ container.includeTags }}</code>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn size="x-small" icon v-bind="props" href="https://regex101.com" target="_blank">
                  <v-icon size="x-small">mdi-regex</v-icon>
                </v-btn>
              </template>
              <span>Test on regex101.com</span>
            </v-tooltip>
          </td>
        </tr>
        <tr v-if="container.excludeTags">
          <td class="text-capitalize text-medium-emphasis config-key">
            <v-icon size="small" color="secondary" class="mr-2">mdi-tag-off</v-icon>
            Exclude tags
          </td>
          <td class="config-value">
            <code class="config-code">{{ container.excludeTags }}</code>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn size="x-small" icon v-bind="props" href="https://regex101.com" target="_blank">
                  <v-icon size="x-small">mdi-regex</v-icon>
                </v-btn>
              </template>
              <span>Test on regex101.com</span>
            </v-tooltip>
          </td>
        </tr>
        <tr v-if="container.transformTags">
          <td class="text-capitalize text-medium-emphasis config-key">
            <v-icon size="small" color="secondary" class="mr-2">mdi-tag-arrow-right</v-icon>
            Transform tags
          </td>
          <td class="config-value">
            <code class="config-code">{{ container.transformTags }}</code>
          </td>
        </tr>
        <tr v-if="container.linkTemplate">
          <td class="text-capitalize text-medium-emphasis config-key">
            <v-icon size="small" color="secondary" class="mr-2">mdi-file-replace</v-icon>
            Link template
          </td>
          <td class="config-value">
            <code class="config-code">{{ container.linkTemplate }}</code>
          </td>
        </tr>
        <tr v-if="container.link">
          <td class="text-capitalize text-medium-emphasis config-key">
            <v-icon size="small" color="secondary" class="mr-2">mdi-link</v-icon>
            Link
          </td>
          <td class="config-value">
            <a :href="container.link" target="_blank">{{ container.link }}</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </v-card-text>
</template>

<script lang="ts" src="./ContainerDetail.ts"></script>

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

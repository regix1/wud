<template>
  <svg
    v-if="inlineSvg"
    :viewBox="inlineSvgViewBox"
    :width="size"
    :height="size"
    :style="iconStyle"
    :class="['brand-svg', iconKey ? `brand-${iconKey}` : '']"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-for="(d, i) in inlineSvg.paths"
      :key="i"
      :d="d"
    />
  </svg>
  <img
    v-else-if="isHomarrIcon"
    :src="homarrIconUrl"
    :style="iconStyle"
    :alt="icon"
  />
  <img
    v-else-if="isSelfhstIcon"
    :src="selfhstIconUrl"
    :style="iconStyle"
    :alt="icon"
  />
  <img
    v-else-if="isSimpleIcon"
    :src="simpleIconUrl"
    :style="iconStyle"
    :alt="icon"
    class="simple-icon"
  />
  <v-icon v-else :size="size" :style="{ marginRight: `${marginRight}px`, verticalAlign: 'middle' }">
    {{ normalizedIcon }}
  </v-icon>
</template>

<script lang="ts" src="./IconRenderer.ts"></script>

<style scoped>
/* Brand colors for inline SVG registry icons */
.brand-svg.brand-docker { color: #2496ED; }
.brand-svg.brand-github { color: #181717; }
.brand-svg.brand-microsoftazure { color: #0078D4; }
.brand-svg.brand-amazonaws { color: #FF9900; }
.brand-svg.brand-forgejo { color: #FB923C; }
.brand-svg.brand-googlecloud { color: #4285F4; }
.brand-svg.brand-gitea { color: #609926; }
.brand-svg.brand-gitlab { color: #FC6D26; }
.brand-svg.brand-redhat { color: #EE0000; }
.brand-svg.brand-linuxcontainers { color: #333333; }
.brand-svg.brand-opencontainersinitiative { color: #262261; }

/* Dark mode overrides for icons with dark brand colors */
.v-theme--dark .brand-svg.brand-github { color: #e6edf3; }
.v-theme--dark .brand-svg.brand-linuxcontainers { color: #B0BEC5; }
.v-theme--dark .brand-svg.brand-opencontainersinitiative { color: #7C77B9; }

.simple-icon {
  opacity: 0.87;
}

.v-theme--dark .simple-icon {
  filter: invert(1) hue-rotate(180deg);
  opacity: 0.87;
}
</style>

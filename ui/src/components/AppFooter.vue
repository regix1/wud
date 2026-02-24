<template>
  <v-footer class="pa-0" theme="dark" height="36px" border="t thin">
    <v-col cols="12" class="text-center text-caption pa-0">
      {{ new Date().getFullYear() }} — WUD (version {{ version }})
    </v-col>
  </v-footer>
</template>

<script lang="ts" src="./AppFooter.ts"></script>

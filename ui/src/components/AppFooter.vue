<template>
  <v-footer app class="py-1 px-0" border="t thin">
    <v-col cols="12" class="text-center text-caption pa-0">
      {{ new Date().getFullYear() }} — WUD (version {{ version }})
    </v-col>
  </v-footer>
</template>

<script lang="ts" src="./AppFooter.ts"></script>

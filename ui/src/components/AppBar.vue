<template>
  <v-app-bar flat rounded="0" border="b thin" density="compact">
    <v-app-bar-nav-icon v-if="isMobile" @click="$emit('toggle-nav')" />
    <v-toolbar-title
      v-if="viewName && 'home'.toLowerCase() !== viewName.toLowerCase()"
      class="text-h6 text-capitalize ma-0 pl-4"
      >{{ viewName }}</v-toolbar-title
    >
    <v-spacer />
    <v-menu v-if="user && user.username !== 'anonymous'">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          size="small"
          class="text-lowercase"
        >
          {{ user.username }}
          &nbsp;
          <v-icon size="small">mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list density="compact">
        <v-list-item @click="logout">
          <v-list-item-title class="text-body-2">Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script lang="ts" src="./AppBar.ts"></script>

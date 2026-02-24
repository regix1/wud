<template>
  <v-form @keyup.enter="redirect">
    <v-card-text>
      <v-btn block color="primary" @click="redirect">
        <v-icon start>mdi-openid</v-icon>Connect
      </v-btn>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" src="./LoginOidc.ts"></script>

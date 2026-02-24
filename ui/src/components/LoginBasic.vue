<template>
  <v-form validate-on="blur" @keyup.enter="login">
    <v-card-text>
      <v-text-field
        label="Username"
        v-model="username"
        append-icon="mdi-account"
        :rules="[rules.required]"
        autocomplete="username"
        variant="outlined"
        autofocus
      />
      <v-text-field
        label="Password"
        type="password"
        v-model="password"
        append-icon="mdi-lock"
        :rules="[rules.required]"
        autocomplete="current-password"
        variant="outlined"
      />
      <v-btn
        block
        color="primary"
        variant="flat"
        size="large"
        class="mt-2"
        :disabled="!valid"
        @click="login"
      >
        Login
      </v-btn>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" src="./LoginBasic.ts"></script>

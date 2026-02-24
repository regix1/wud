<template>
  <v-container class="login-background">
    <v-dialog v-model="showDialog" width="400px" persistent>
      <v-card elevation="2" class="login-card">
        <div class="pt-6 pb-2 px-4">
          <div class="d-flex justify-center mb-4">
            <img :src="logo" alt="WUD Logo" class="login-logo" />
          </div>
          <v-tabs v-if="strategies.length > 1" v-model="strategySelected">
            <v-tab
              v-for="strategy in strategies"
              :key="strategy.name"
              class="text-body-2"
            >
              {{ strategy.name }}
            </v-tab>
          </v-tabs>
          <v-window v-model="strategySelected">
            <v-window-item
              v-for="strategy in strategies"
              :key="strategy.type + strategy.name"
            >
              <login-basic
                v-if="strategy.type === 'basic'"
                @authentication-success="onAuthenticationSuccess"
              />
              <login-oidc
                v-if="strategy.type === 'oidc'"
                :name="strategy.name"
                @authentication-success="onAuthenticationSuccess"
              />
            </v-window-item>
          </v-window>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./LoginView.ts"></script>
<style scoped>
.login-background {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-top: 2px solid rgb(var(--v-theme-primary));
}

.login-logo {
  width: 72px;
  height: 72px;
}
</style>

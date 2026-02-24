<template>
  <v-container class="login-background">
    <v-dialog v-model="showDialog" width="400px" persistent>
      <v-card elevation="8" class="login-card">
        <v-container>
          <v-row justify="center" class="ma-1">
            <div class="d-flex flex-column align-center">
              <img :src="logo" alt="WUD Logo" class="login-logo mb-2" />
              <v-avatar color="primary" size="80">
                <v-icon color="on-primary" size="x-large">mdi-account</v-icon>
              </v-avatar>
            </div>
          </v-row>
          <v-row>
            <v-container>
              <v-tabs v-model="strategySelected">
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
            </v-container>
          </v-row>
        </v-container>
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
  border-top: 3px solid #0078D4;
}

.login-logo {
  width: 64px;
  height: 64px;
}
</style>

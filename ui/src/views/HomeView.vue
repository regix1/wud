<template>
  <v-container>
    <v-row class="d-flex pa-md-8 ma-md-4 align-stretch">
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.05s">
        <v-card
          class="home-card text-center"
          variant="flat"
          style="border-top: 3px solid rgb(var(--v-theme-primary))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{
              containerIcon
            }}</v-icon>
            <v-btn variant="plain" size="x-large" to="/containers"
              >{{ containersCount }} containers</v-btn
            >
            <v-btn
              size="small"
              variant="plain"
              :color="containersToUpdateCount > 0 ? 'warning' : 'success'"
              to="/containers?update-available=true"
              :style="{
                pointerEvents: containersToUpdateCount === 0 ? 'none' : 'auto',
              }"
              >({{ containerUpdateMessage }})</v-btn
            >
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.10s">
        <v-card
          class="home-card text-center"
          variant="flat"
          style="border-top: 3px solid rgb(var(--v-theme-accent))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{ triggerIcon }}</v-icon>
            <v-btn variant="plain" size="x-large" to="/configuration/triggers"
              >{{ triggersCount }} triggers</v-btn
            >
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.15s">
        <v-card
          class="home-card text-center"
          variant="flat"
          style="border-top: 3px solid rgb(var(--v-theme-secondary))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{ watcherIcon }}</v-icon>
            <v-btn variant="plain" size="x-large" to="/configuration/watchers"
              >{{ watchersCount }} watchers</v-btn
            >
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.20s">
        <v-card
          class="home-card text-center"
          variant="flat"
          style="border-top: 3px solid rgb(var(--v-theme-info))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{
              registryIcon
            }}</v-icon>
            <v-btn variant="plain" size="x-large" to="/configuration/registries"
              >{{ registriesCount }} registries</v-btn
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src="./HomeView.ts"></script>
<style scoped>
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.home-card {
  height: 100%;
  min-height: 160px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  animation: card-enter 0.4s ease-out backwards;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.home-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.home-icon {
  font-size: 80px;
  width: 80px;
  height: 80px;
}
</style>

<template>
  <v-container>
    <v-row class="d-flex pa-md-8 ma-md-4 align-stretch">
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.05s">
        <v-card
          class="home-card text-center"
          variant="flat"
          @click="navigateContainers"
          style="border-top: 3px solid rgb(var(--v-theme-primary))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{
              containerIcon
            }}</v-icon>
            <div class="text-h6 text-uppercase mt-2">{{ containersCount }} containers</div>
            <div
              v-if="containersToUpdateCount > 0"
              class="text-caption text-warning text-uppercase mt-1 update-link"
              @click.stop="navigateUpdates"
              >({{ containerUpdateMessage }})</div
            >
            <div v-else class="text-caption text-success text-uppercase mt-1">({{ containerUpdateMessage }})</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.10s">
        <v-card
          class="home-card text-center"
          variant="flat"
          to="/configuration/triggers"
          style="border-top: 3px solid rgb(var(--v-theme-accent))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{ triggerIcon }}</v-icon>
            <div class="text-h6 text-uppercase mt-2">{{ triggersCount }} triggers</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.15s">
        <v-card
          class="home-card text-center"
          variant="flat"
          to="/configuration/watchers"
          style="border-top: 3px solid rgb(var(--v-theme-secondary))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{ watcherIcon }}</v-icon>
            <div class="text-h6 text-uppercase mt-2">{{ watchersCount }} watchers</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="3" xl="3" style="animation-delay: 0.20s">
        <v-card
          class="home-card text-center"
          variant="flat"
          to="/configuration/registries"
          style="border-top: 3px solid rgb(var(--v-theme-info))"
        >
          <div class="d-flex flex-column align-center justify-center fill-height pa-4">
            <v-icon color="secondary" class="home-icon">{{
              registryIcon
            }}</v-icon>
            <div class="text-h6 text-uppercase mt-2">{{ registriesCount }} registries</div>
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
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  animation: card-enter 0.4s ease-out backwards;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  text-decoration: none;
}

.home-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.home-card :deep(.v-card__overlay) {
  display: none;
}

.home-icon {
  font-size: clamp(48px, 10vw, 80px);
  width: clamp(48px, 10vw, 80px);
  height: clamp(48px, 10vw, 80px);
}

.update-link {
  cursor: pointer;
  text-decoration: none;
}

.update-link:hover {
  text-decoration: underline;
}
</style>

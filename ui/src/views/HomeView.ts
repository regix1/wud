import { getContainerIcon } from "@/services/container";
import { getRegistryIcon } from "@/services/registry";
import { getTriggerIcon } from "@/services/trigger";
import { getWatcherIcon } from "@/services/watcher";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useDataCache } from "@/composables/useDataCache";
import type { Container } from "@/types/container";

export default defineComponent({
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      loading: true,
      containersCount: 0,
      containersToUpdateCount: 0,
      triggersCount: 0,
      watchersCount: 0,
      registriesCount: 0,
      containerIcon: getContainerIcon(),
      registryIcon: getRegistryIcon(),
      triggerIcon: getTriggerIcon(),
      watcherIcon: getWatcherIcon(),
    };
  },

  computed: {
    containers(): Container[] {
      const cache = useDataCache();
      return cache.containers.value;
    },
    containerUpdateMessage() {
      if (this.containersToUpdateCount > 0) {
        return `${this.containersToUpdateCount} updates available`;
      }
      return "all containers are up-to-date";
    },
  },

  watch: {
    containers: {
      handler() {
        this.recalculateContainerCounts();
      },
      deep: true,
      immediate: true,
    },
  },

  async mounted() {
    try {
      const cache = useDataCache();
      await cache.prefetchAll();
      const watchers = cache.watchers.value;
      const registries = cache.registries.value;
      const triggers = cache.triggers.value;
      this.triggersCount = triggers.length;
      this.watchersCount = watchers.length;
      this.registriesCount = registries.length;
    } finally {
      this.loading = false;
    }
  },

  beforeUnmount() {
    // SSE lifecycle is managed by useDataCache composable
  },

  methods: {
    navigateContainers() {
      this.router.push("/containers");
    },
    navigateUpdates() {
      this.router.push("/containers?update-available=true");
    },
    recalculateContainerCounts() {
      this.containersCount = this.containers.length;
      this.containersToUpdateCount = this.containers.filter(
        (container: Container) => container.updateAvailable,
      ).length;
    },
  },
});

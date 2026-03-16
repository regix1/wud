import { getContainerIcon } from "@/services/container";
import { getRegistryIcon } from "@/services/registry";
import { getTriggerIcon } from "@/services/trigger";
import { getWatcherIcon } from "@/services/watcher";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useDataCache } from "@/composables/useDataCache";

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
      eventSource: null as EventSource | null,
      containers: [] as Record<string, unknown>[],
    };
  },

  computed: {
    containerUpdateMessage() {
      if (this.containersToUpdateCount > 0) {
        return `${this.containersToUpdateCount} updates available`;
      }
      return "all containers are up-to-date";
    },
  },

  async mounted() {
    try {
      const cache = useDataCache();
      await cache.prefetchAll();
      const containers = cache.containers.value;
      const watchers = cache.watchers.value;
      const registries = cache.registries.value;
      const triggers = cache.triggers.value;
      this.containers = containers as Record<string, unknown>[];
      this.containersCount = containers.length;
      this.triggersCount = triggers.length;
      this.watchersCount = watchers.length;
      this.registriesCount = registries.length;
      this.containersToUpdateCount = containers.filter(
        (container: Record<string, unknown>) => container.updateAvailable,
      ).length;
    } finally {
      this.loading = false;
    }

    // Subscribe to real-time container updates via SSE
    this.eventSource = new EventSource('/api/sse');

    this.eventSource.addEventListener('container-added', (event: MessageEvent) => {
      const container = JSON.parse(event.data);
      if (!this.containers.some((c: Record<string, unknown>) => c.id === container.id)) {
        this.containers.push(container);
        this.recalculateContainerCounts();
      }
    });

    this.eventSource.addEventListener('container-updated', (event: MessageEvent) => {
      const container = JSON.parse(event.data);
      const index = this.containers.findIndex((c: Record<string, unknown>) => c.id === container.id);
      if (index !== -1) {
        this.containers.splice(index, 1, container);
      } else {
        this.containers.push(container);
      }
      this.recalculateContainerCounts();
    });

    this.eventSource.addEventListener('container-removed', (event: MessageEvent) => {
      const container = JSON.parse(event.data);
      this.containers = this.containers.filter((c: Record<string, unknown>) => c.id !== container.id);
      this.recalculateContainerCounts();
    });
  },

  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
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
        (container: Record<string, unknown>) => container.updateAvailable,
      ).length;
    },
  },
});

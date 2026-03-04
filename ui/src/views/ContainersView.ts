import ContainerItem from "@/components/ContainerItem.vue";
import ContainerFilter from "@/components/ContainerFilter.vue";
import { deleteContainer } from "@/services/container";
import { defineComponent } from "vue";
import type { Container } from "@/types/container";
import { useDataCache } from "@/composables/useDataCache";

export default defineComponent({
  components: {
    ContainerItem,
    ContainerFilter,
  },

  data() {
    return {
      loading: true,
      containers: [] as Container[],
      eventSource: null as EventSource | null,
      registrySelected: "",
      watcherSelected: "",
      updateKindSelected: "",
      updateAvailableSelected: false,
      groupByLabel: "",
      oldestFirst: false,
      cachedRegistries: [] as string[],
      cachedWatchers: [] as string[],
      cachedUpdateKinds: [] as string[],
      cachedLabels: [] as string[],
    };
  },
  watch: {
    containers: {
      handler() {
        const newRegistries = [...new Set(
          this.containers.map((c: Container) => c.image.registry.name).sort(),
        )];
        if (JSON.stringify(newRegistries) !== JSON.stringify(this.cachedRegistries)) {
          this.cachedRegistries = newRegistries;
        }

        const newWatchers = [...new Set(
          this.containers.map((c: Container) => c.watcher).sort(),
        )];
        if (JSON.stringify(newWatchers) !== JSON.stringify(this.cachedWatchers)) {
          this.cachedWatchers = newWatchers;
        }

        const newUpdateKinds = [...new Set(
          this.containers
            .filter((c: Container) => c.updateAvailable)
            .filter((c: Container) => c.updateKind.kind === "tag")
            .filter((c: Container) => c.updateKind.semverDiff)
            .map((c: Container) => c.updateKind.semverDiff)
            .sort(),
        )];
        if (JSON.stringify(newUpdateKinds) !== JSON.stringify(this.cachedUpdateKinds)) {
          this.cachedUpdateKinds = newUpdateKinds;
        }

        const newLabels = [...new Set(
          this.containers.reduce((acc: string[], c: Container) => {
            return [...acc, ...Object.keys(c.labels ?? {})];
          }, [] as string[]),
        )].sort();
        if (JSON.stringify(newLabels) !== JSON.stringify(this.cachedLabels)) {
          this.cachedLabels = newLabels;
        }
      },
      deep: false,
    },
  },
  computed: {
    allContainerLabels() {
      return this.cachedLabels;
    },
    registries() {
      return this.cachedRegistries;
    },
    watchers() {
      return this.cachedWatchers;
    },
    updateKinds() {
      return this.cachedUpdateKinds;
    },
    containersFiltered() {
      const filteredContainers = this.containers
        .filter((container) =>
          this.registrySelected
            ? this.registrySelected === container.image.registry.name
            : true,
        )
        .filter((container) =>
          this.watcherSelected
            ? this.watcherSelected === container.watcher
            : true,
        )
        .filter((container) =>
          this.updateKindSelected
            ? this.updateKindSelected ===
              (container.updateKind && container.updateKind.semverDiff)
            : true,
        )
        .filter((container) =>
          this.updateAvailableSelected ? container.updateAvailable : true,
        )
        .sort((a, b) => {
          const getImageDate = (item: Container) => new Date(item.image.created);

          if (this.groupByLabel) {
            const aLabel = a.labels?.[this.groupByLabel];
            const bLabel = b.labels?.[this.groupByLabel];

            if (aLabel && !bLabel) return -1;
            if (!aLabel && bLabel) return 1;

            if (aLabel && bLabel) {
              if (this.oldestFirst) return getImageDate(a).getTime() - getImageDate(b).getTime();

              return aLabel.localeCompare(bLabel);
            }
          }

          if (this.oldestFirst) return getImageDate(a).getTime() - getImageDate(b).getTime();
          return a.displayName.localeCompare(b.displayName);
        });
      return filteredContainers;
    },
    groupHeaderIds(): Set<string> {
      if (!this.groupByLabel) return new Set();
      const ids = new Set<string>();
      for (let i = 0; i < this.containersFiltered.length; i++) {
        const cur = this.containersFiltered[i].labels?.[this.groupByLabel];
        const prev = this.containersFiltered[i - 1]?.labels?.[this.groupByLabel];
        if (cur !== prev) {
          ids.add(this.containersFiltered[i].id);
        }
      }
      return ids;
    },
  },

  methods: {
    onRegistryChanged(registrySelected: string) {
      this.registrySelected = registrySelected;
      this.updateQueryParams();
    },
    onWatcherChanged(watcherSelected: string) {
      this.watcherSelected = watcherSelected;
      this.updateQueryParams();
    },
    onUpdateAvailableChanged() {
      this.updateAvailableSelected = !this.updateAvailableSelected;
      this.updateQueryParams();
    },
    onOldestFirstChanged() {
      this.oldestFirst = !this.oldestFirst;
      this.updateQueryParams();
    },
    onGroupByLabelChanged(groupByLabel: string) {
      this.groupByLabel = groupByLabel;
      this.updateQueryParams();
    },
    onUpdateKindChanged(updateKindSelected: string) {
      this.updateKindSelected = updateKindSelected;
      this.updateQueryParams();
    },
    updateQueryParams() {
      const query: Record<string, string> = {};
      if (this.registrySelected) {
        query["registry"] = this.registrySelected;
      }
      if (this.watcherSelected) {
        query["watcher"] = this.watcherSelected;
      }
      if (this.updateKindSelected) {
        query["update-kind"] = this.updateKindSelected;
      }
      if (this.updateAvailableSelected) {
        query["update-available"] = String(this.updateAvailableSelected);
      }
      if (this.oldestFirst) {
        query["oldest-first"] = String(this.oldestFirst);
      }
      if (this.groupByLabel) {
        query["group-by-label"] = this.groupByLabel;
      }
      this.$router.replace({ query });
    },
    onRefreshAllContainers(containersRefreshed: Container[]) {
      this.containers = containersRefreshed;
    },
    removeContainerFromList(container: Container) {
      this.containers = this.containers.filter((c) => c.id !== container.id);
    },
    async deleteContainer(container: Container) {
      try {
        await deleteContainer(container.id);
        this.removeContainerFromList(container);
      } catch (e: unknown) {
        this.$eventBus.emit(
          "notify",
          `Error when trying to delete the container (${e instanceof Error ? e.message : String(e)})`,
          "error",
        );
      }
    },
  },

  created() {
    const query = this.$route.query;
    if (query["registry"]) {
      this.registrySelected = query["registry"] as string;
    }
    if (query["watcher"]) {
      this.watcherSelected = query["watcher"] as string;
    }
    if (query["update-kind"]) {
      this.updateKindSelected = query["update-kind"] as string;
    }
    if (query["update-available"]) {
      this.updateAvailableSelected = (query["update-available"] as string).toLowerCase() === "true";
    }
    if (query["oldest-first"]) {
      this.oldestFirst = (query["oldest-first"] as string).toLowerCase() === "true";
    }
    if (query["group-by-label"]) {
      this.groupByLabel = query["group-by-label"] as string;
    }
  },

  async mounted() {
    try {
      const cache = useDataCache();
      await cache.prefetchAll();
      this.containers = cache.containers.value as unknown as Container[];
    } catch (e: unknown) {
      this.$eventBus.emit(
        "notify",
        `Error when trying to get the containers (${e instanceof Error ? e.message : String(e)})`,
        "error",
      );
    } finally {
      this.loading = false;
    }

    // Subscribe to real-time container updates via SSE
    this.eventSource = new EventSource('/api/sse');

    this.eventSource.addEventListener('container-added', (event: MessageEvent) => {
      const container: Container = JSON.parse(event.data);
      if (!this.containers.some((c) => c.id === container.id)) {
        this.containers.push(container);
      }
    });

    this.eventSource.addEventListener('container-updated', (event: MessageEvent) => {
      const container: Container = JSON.parse(event.data);
      const index = this.containers.findIndex((c) => c.id === container.id);
      if (index !== -1) {
        this.containers.splice(index, 1, container);
      }
    });

    this.eventSource.addEventListener('container-removed', (event: MessageEvent) => {
      const container: Container = JSON.parse(event.data);
      this.containers = this.containers.filter((c) => c.id !== container.id);
    });
  },

  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  },
});

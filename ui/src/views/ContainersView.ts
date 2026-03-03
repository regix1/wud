import ContainerItem from "@/components/ContainerItem.vue";
import ContainerFilter from "@/components/ContainerFilter.vue";
import { deleteContainer, getAllContainers } from "@/services/container";
import { defineComponent } from "vue";
import type { Container } from "@/types/container";

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
    };
  },
  watch: {},
  computed: {
    allContainerLabels() {
      const allLabels = this.containers.reduce((acc: string[], container) => {
        return [...acc, ...Object.keys(container.labels ?? {})];
      }, [] as string[]);
      return [...new Set(allLabels)].sort();
    },
    registries() {
      return [
        ...new Set(
          this.containers
            .map((container) => container.image.registry.name)
            .sort(),
        ),
      ];
    },
    watchers() {
      return [
        ...new Set(
          this.containers.map((container) => container.watcher).sort(),
        ),
      ];
    },
    updateKinds() {
      return [
        ...new Set(
          this.containers
            .filter((container) => container.updateAvailable)
            .filter((container) => container.updateKind.kind === "tag")
            .filter((container) => container.updateKind.semverDiff)
            .map((container) => container.updateKind.semverDiff)
            .sort(),
        ),
      ];
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
      this.$router.push({ query });
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

  async mounted() {
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
    try {
      this.containers = await getAllContainers();
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

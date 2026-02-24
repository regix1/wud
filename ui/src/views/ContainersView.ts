import ContainerItem from "@/components/ContainerItem.vue";
import ContainerFilter from "@/components/ContainerFilter.vue";
import { deleteContainer, getAllContainers } from "@/services/container";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

interface Container {
  id: string;
  displayName: string;
  watcher: string;
  updateAvailable: boolean;
  updateKind: {
    kind: string;
    semverDiff?: string;
    remoteValue: string;
  };
  image: {
    registry: {
      name: string;
    };
    created: string;
    os: string;
  };
  result: {
    created?: string;
  };
  labels?: Record<string, string>;
}

export default defineComponent({
  components: {
    ContainerItem,
    ContainerFilter,
  },

  data() {
    return {
      containers: [] as Container[],
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
      const allLabels = this.containers.reduce((acc, container) => {
        return [...acc, ...Object.keys(container.labels ?? {})];
      }, []);
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

  async beforeRouteEnter(to, from, next) {
    const registrySelected = to.query["registry"];
    const watcherSelected = to.query["watcher"];
    const updateKindSelected = to.query["update-kind"];
    const updateAvailable = to.query["update-available"];
    const oldestFirst = to.query["oldest-first"];
    const groupByLabel = to.query["group-by-label"];
    try {
      const containers = await getAllContainers();
      next((vm: ComponentPublicInstance) => {
        const v = vm as ComponentPublicInstance & {
          registrySelected: string;
          watcherSelected: string;
          updateKindSelected: string;
          updateAvailableSelected: boolean;
          oldestFirst: boolean;
          groupByLabel: string;
          containers: Container[];
        };
        if (registrySelected) {
          v.registrySelected = registrySelected as string;
        }
        if (watcherSelected) {
          v.watcherSelected = watcherSelected as string;
        }
        if (updateKindSelected) {
          v.updateKindSelected = updateKindSelected as string;
        }
        if (updateAvailable) {
          v.updateAvailableSelected = (updateAvailable as string).toLowerCase() === "true";
        }
        if (oldestFirst) {
          v.oldestFirst = (oldestFirst as string).toLowerCase() === "true";
        }
        if (groupByLabel) {
          v.groupByLabel = groupByLabel as string;
        }
        v.containers = containers;
      });
    } catch (e: unknown) {
      next((vm: ComponentPublicInstance) => {
        vm.$eventBus.emit(
          "notify",
          `Error when trying to get the containers (${e instanceof Error ? e.message : String(e)})`,
          "error",
        );
      });
    }
  },
});

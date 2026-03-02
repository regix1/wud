import { getContainerIcon, getAllContainers } from "@/services/container";
import { getRegistryIcon, getAllRegistries } from "@/services/registry";
import { getTriggerIcon, getAllTriggers } from "@/services/trigger";
import { getWatcherIcon, getAllWatchers } from "@/services/watcher";
import { defineComponent } from "vue";

export default defineComponent({
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
    containerUpdateMessage() {
      if (this.containersToUpdateCount > 0) {
        return `${this.containersToUpdateCount} updates available`;
      }
      return "all containers are up-to-date";
    },
  },

  async mounted() {
    try {
      const [containers, watchers, registries, triggers] = await Promise.all([
        getAllContainers(),
        getAllWatchers(),
        getAllRegistries(),
        getAllTriggers(),
      ]);
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
  },
});

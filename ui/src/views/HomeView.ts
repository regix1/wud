import { getContainerIcon, getAllContainers } from "@/services/container";
import { getRegistryIcon, getAllRegistries } from "@/services/registry";
import { getTriggerIcon, getAllTriggers } from "@/services/trigger";
import { getWatcherIcon, getAllWatchers } from "@/services/watcher";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

interface HomeViewInstance {
  containersCount: number;
  containersToUpdateCount: number;
  triggersCount: number;
  watchersCount: number;
  registriesCount: number;
}

export default defineComponent({
  data() {
    return {
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

  async beforeRouteEnter(to, from, next) {
    try {
      const [containers, watchers, registries, triggers] = await Promise.all([
        getAllContainers(),
        getAllWatchers(),
        getAllRegistries(),
        getAllTriggers(),
      ]);
      next((vm: ComponentPublicInstance) => {
        const instance = vm as unknown as HomeViewInstance;
        instance.containersCount = containers.length;
        instance.triggersCount = triggers.length;
        instance.watchersCount = watchers.length;
        instance.registriesCount = registries.length;
        instance.containersToUpdateCount = containers.filter(
          (container: Record<string, unknown>) => container.updateAvailable,
        ).length;
      });
    } catch {
      next();
    }
  },
});

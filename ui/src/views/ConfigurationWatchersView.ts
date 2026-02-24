import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getAllWatchers } from "@/services/watcher";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

export default defineComponent({
  data() {
    return {
      watchers: [] as Record<string, unknown>[],
    };
  },
  components: {
    ConfigurationItem,
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const watchers = await getAllWatchers();
      next((vm: ComponentPublicInstance) => ((vm as unknown as { watchers: Record<string, unknown>[] }).watchers = watchers));
    } catch (e: unknown) {
      next((vm: ComponentPublicInstance) => {
        vm.$eventBus.emit(
          "notify",
          `Error when trying to load the watchers (${(e as Error).message})`,
          "error",
        );
      });
    }
  },
});

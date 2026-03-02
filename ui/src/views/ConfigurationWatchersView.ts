import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getAllWatchers } from "@/services/watcher";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      loading: true,
      watchers: [] as Record<string, unknown>[],
    };
  },
  components: {
    ConfigurationItem,
  },

  async mounted() {
    try {
      this.watchers = await getAllWatchers();
    } catch (e: unknown) {
      this.$eventBus.emit(
        "notify",
        `Error when trying to load the watchers (${(e as Error).message})`,
        "error",
      );
    } finally {
      this.loading = false;
    }
  },
});

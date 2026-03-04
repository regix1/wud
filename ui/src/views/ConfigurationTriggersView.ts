import TriggerDetail from "@/components/TriggerDetail.vue";
import { useDataCache } from "@/composables/useDataCache";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      loading: true,
      triggers: [] as Record<string, unknown>[],
    };
  },
  components: {
    TriggerDetail,
  },

  async mounted() {
    const cache = useDataCache();
    try {
      await cache.prefetchAll();
      this.triggers = cache.triggers.value;
    } catch (e: unknown) {
      this.$eventBus.emit(
        "notify",
        `Error when trying to load the triggers (${(e as Error).message})`,
        "error",
      );
    } finally {
      this.loading = false;
    }
  },
});

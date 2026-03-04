import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { useDataCache } from "@/composables/useDataCache";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      loading: true,
      authentications: [] as Record<string, unknown>[],
    };
  },
  components: {
    ConfigurationItem,
  },

  async mounted() {
    const cache = useDataCache();
    try {
      await cache.prefetchAll();
      this.authentications = cache.authentications.value;
    } catch (e: unknown) {
      this.$eventBus.emit(
        "notify",
        `Error when trying to load the authentications (${(e as Error).message})`,
        "error",
      );
    } finally {
      this.loading = false;
    }
  },
});

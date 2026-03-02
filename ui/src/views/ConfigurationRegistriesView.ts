import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getAllRegistries, getRegistryProviderIcon } from "@/services/registry";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      loading: true,
      registries: [] as Record<string, unknown>[],
    };
  },
  components: {
    ConfigurationItem,
  },

  async mounted() {
    try {
      const registries = await getAllRegistries();
      this.registries = registries
        .map((registry: Record<string, unknown>) => ({
          ...registry,
          icon: getRegistryProviderIcon(registry.type as string),
        }))
        .sort((r1: Record<string, unknown>, r2: Record<string, unknown>) => (r1.id as string).localeCompare(r2.id as string));
    } catch (e: unknown) {
      this.$eventBus.emit(
        "notify",
        `Error when trying to load the registries (${(e as Error).message})`,
        "error",
      );
    } finally {
      this.loading = false;
    }
  },
});

import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getAllRegistries, getRegistryProviderIcon } from "@/services/registry";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

export default defineComponent({
  data() {
    return {
      registries: [] as Record<string, unknown>[],
    };
  },
  components: {
    ConfigurationItem,
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const registries = await getAllRegistries();
      const registriesWithIcons = registries
        .map((registry: Record<string, unknown>) => ({
          ...registry,
          icon: getRegistryProviderIcon(registry.type as string),
        }))
        .sort((r1: Record<string, unknown>, r2: Record<string, unknown>) => (r1.id as string).localeCompare(r2.id as string));
      next((vm: ComponentPublicInstance) => ((vm as unknown as { registries: Record<string, unknown>[] }).registries = registriesWithIcons));
    } catch (e: unknown) {
      next((vm: ComponentPublicInstance) => {
        vm.$eventBus.emit(
          "notify",
          `Error when trying to load the registries (${(e as Error).message})`,
          "error",
        );
      });
    }
  },
});

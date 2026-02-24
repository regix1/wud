import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getAllAuthentications } from "@/services/authentication";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

export default defineComponent({
  data() {
    return {
      authentications: [] as Record<string, unknown>[],
    };
  },
  components: {
    ConfigurationItem,
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const authentications = await getAllAuthentications();
      next((vm: ComponentPublicInstance) => ((vm as unknown as { authentications: Record<string, unknown>[] }).authentications = authentications));
    } catch (e: unknown) {
      next((vm: ComponentPublicInstance) => {
        vm.$eventBus.emit(
          "notify",
          `Error when trying to load the authentications (${(e as Error).message})`,
          "error",
        );
      });
    }
  },
});

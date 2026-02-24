import TriggerDetail from "@/components/TriggerDetail.vue";
import { getAllTriggers } from "@/services/trigger";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

export default defineComponent({
  data() {
    return {
      triggers: [] as Record<string, unknown>[],
    };
  },
  components: {
    TriggerDetail,
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const triggers = await getAllTriggers();
      next((vm: ComponentPublicInstance) => ((vm as unknown as { triggers: Record<string, unknown>[] }).triggers = triggers));
    } catch (e: unknown) {
      next((vm: ComponentPublicInstance) => {
        vm.$eventBus.emit(
          "notify",
          `Error when trying to load the triggers (${(e as Error).message})`,
          "error",
        );
      });
    }
  },
});

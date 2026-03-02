import TriggerDetail from "@/components/TriggerDetail.vue";
import { getAllTriggers } from "@/services/trigger";
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
    try {
      this.triggers = await getAllTriggers();
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

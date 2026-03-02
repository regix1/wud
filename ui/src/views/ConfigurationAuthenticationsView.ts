import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getAllAuthentications } from "@/services/authentication";
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
    try {
      this.authentications = await getAllAuthentications();
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

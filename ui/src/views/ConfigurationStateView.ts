import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getStore } from "@/services/store";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

export default defineComponent({
  components: {
    ConfigurationItem,
  },
  data() {
    return {
      state: {} as Record<string, unknown>,
    };
  },
  computed: {
    configurationItem() {
      return {
        name: "state",
        icon: "mdi-content-save",
        configuration: this.state.configuration,
      };
    },
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const state = await getStore();
      next((vm: ComponentPublicInstance) => ((vm as unknown as { state: Record<string, unknown> }).state = state));
    } catch (e: unknown) {
      next((vm: ComponentPublicInstance) => {
        vm.$eventBus.emit(
          "notify",
          `Error when trying to load the state configuration (${(e as Error).message})`,
          "error",
        );
      });
    }
  },
});

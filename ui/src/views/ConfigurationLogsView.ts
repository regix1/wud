import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getLog } from "@/services/log";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

export default defineComponent({
  components: {
    ConfigurationItem,
  },
  data() {
    return {
      log: {} as Record<string, unknown>,
    };
  },

  computed: {
    configurationItem() {
      return {
        name: "logs",
        icon: "mdi-bug",
        configuration: {
          level: this.log.level,
        },
      };
    },
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const log = await getLog();
      next((vm: ComponentPublicInstance) => ((vm as unknown as { log: Record<string, unknown> }).log = log));
    } catch (e: unknown) {
      next((vm: ComponentPublicInstance) => {
        vm.$eventBus.emit(
          "notify",
          `Error when trying to load the log configuration (${(e as Error).message})`,
          "error",
        );
      });
    }
  },
});

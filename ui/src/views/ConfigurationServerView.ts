import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getServer } from "@/services/server";
import { getLog } from "@/services/log";
import { getStore } from "@/services/store";
import { defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";

interface ServerViewInstance {
  server: Record<string, unknown>;
  store: Record<string, unknown>;
  log: Record<string, unknown>;
}

export default defineComponent({
  components: {
    ConfigurationItem,
  },
  data() {
    return {
      server: {} as Record<string, unknown>,
      store: {} as Record<string, unknown>,
      log: {} as Record<string, unknown>,
    };
  },
  computed: {
    serverConfiguration() {
      return {
        type: "server",
        name: "configuration",
        icon: "mdi-connection",
        configuration: this.server.configuration,
      };
    },
    logConfiguration() {
      return {
        type: "logs",
        name: "configuration",
        icon: "mdi-bug",
        configuration: this.log,
      };
    },
    storeConfiguration() {
      return {
        type: "store",
        name: "configuration",
        icon: "mdi-file-multiple",
        configuration: this.store.configuration,
      };
    },
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const server = await getServer();
      const store = await getStore();
      const log = await getLog();

      next((vm: ComponentPublicInstance) => {
        const instance = vm as unknown as ServerViewInstance;
        instance.server = server;
        instance.store = store;
        instance.log = log;
      });
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

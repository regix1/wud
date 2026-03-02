import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { getServer } from "@/services/server";
import { getLog } from "@/services/log";
import { getStore } from "@/services/store";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ConfigurationItem,
  },
  data() {
    return {
      loading: true,
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

  async mounted() {
    try {
      const [server, store, log] = await Promise.all([
        getServer(),
        getStore(),
        getLog(),
      ]);
      this.server = server;
      this.store = store;
      this.log = log;
    } catch (e: unknown) {
      this.$eventBus.emit(
        "notify",
        `Error when trying to load the state configuration (${(e as Error).message})`,
        "error",
      );
    } finally {
      this.loading = false;
    }
  },
});

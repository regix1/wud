import ConfigurationItem from "@/components/ConfigurationItem.vue";
import { useDataCache } from "@/composables/useDataCache";
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
    const cache = useDataCache();
    try {
      await cache.prefetchAll();
      this.server = cache.serverConfig.value ?? {};
      this.store = cache.storeData.value ?? {};
      this.log = cache.logData.value ?? {};
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

import { refreshAllContainers } from "@/services/container";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    registries: {
      type: Array,
      required: true,
    },
    registrySelectedInit: {
      type: String,
      required: true,
    },
    watchers: {
      type: Array,
      required: true,
    },
    watcherSelectedInit: {
      type: String,
      required: true,
    },
    updateKinds: {
      type: Array,
      required: true,
    },
    updateKindSelectedInit: {
      type: String,
      required: true,
    },
    updateAvailable: {
      type: Boolean,
      required: true,
    },
    oldestFirst: {
      type: Boolean,
      required: true,
    },
    groupLabels: {
      type: Array,
      required: true,
    },
    groupByLabel: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      isRefreshing: false,
      registrySelected: this.registrySelectedInit || "",
      watcherSelected: this.watcherSelectedInit || "",
      updateKindSelected: this.updateKindSelectedInit || "",
      updateAvailableLocal: this.updateAvailable,
      oldestFirstLocal: this.oldestFirst,
      groupByLabelLocal: this.groupByLabel || "",
    };
  },

  methods: {
    async refreshAllContainers() {
      this.isRefreshing = true;
      try {
        const body = await refreshAllContainers();
        this.$eventBus.emit("notify", "All containers refreshed");
        this.$emit("refresh-all-containers", body);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        this.$eventBus.emit(
          "notify",
          `Error when trying to refresh all containers (${message})`,
          "error",
        );
      } finally {
        this.isRefreshing = false;
      }
    },
  },

  watch: {
    registrySelected(val: string) {
      this.$emit("registry-changed", val ?? "");
    },
    watcherSelected(val: string) {
      this.$emit("watcher-changed", val ?? "");
    },
    updateKindSelected(val: string) {
      this.$emit("update-kind-changed", val ?? "");
    },
    updateAvailableLocal() {
      this.$emit("update-available-changed");
    },
    oldestFirstLocal() {
      this.$emit("oldest-first-changed");
    },
    groupByLabelLocal(val: string) {
      this.$emit("group-by-label-changed", val ?? "");
    },
  },
});

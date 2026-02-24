import { runTrigger } from "@/services/trigger";
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  props: {
    trigger: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDetail: false,
      showTestForm: false,
      isTriggering: false,
      container: {
        id: "123456789",
        name: "container_test",
        watcher: "watcher_test",
        updateKind: {
          kind: "tag",
          semverDiff: "major",
          localValue: "1.2.3",
          remoteValue: "4.5.6",
          result: {
            link: "https://my-container/release-notes/",
          },
        },
      },
    };
  },
  computed: {
    configurationItems() {
      return Object.keys(this.trigger.configuration || [])
        .map((key) => ({
          key,
          value: this.trigger.configuration[key],
        }))
        .sort((trigger1, trigger2) => trigger1.key.localeCompare(trigger2.key));
    },
  },

  methods: {
    collapse() {
      this.showDetail = !this.showDetail;
    },
    async runTrigger() {
      this.isTriggering = true;
      try {
        await runTrigger({
          triggerType: this.trigger.type,
          triggerName: this.trigger.name,
          container: this.container,
        });
        this.$eventBus.emit("notify", "Trigger executed with success");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.$eventBus.emit(
          "notify",
          `Trigger executed with error (${message}})`,
          "error",
        );
      } finally {
        this.isTriggering = false;
      }
    },
    formatValue(value: unknown) {
      if (value === undefined || value === null || value === "") {
        return "<empty>";
      }
      return value;
    },
  },
});

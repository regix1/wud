import { defineComponent } from "vue";

export default defineComponent({
  props: {
    container: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },

  methods: {
    copyToClipboard(kind: string, value: string) {
      navigator.clipboard.writeText(value);
      this.$eventBus.emit("notify", `${kind} copied to clipboard`);
    },
  },
});

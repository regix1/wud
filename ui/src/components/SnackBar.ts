import { defineComponent } from "vue";

const LEVEL_COLOR_MAP: Record<string, string> = {
  error: "error",
  success: "success",
  warning: "warning",
  info: "primary",
};

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    timeout: {
      type: Number,
      default: 4000,
    },
    message: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      default: "info",
    },
  },

  computed: {
    showLocal: {
      get() {
        return this.show;
      },
      set(value: boolean) {
        if (!value) {
          this.closeSnackbar();
        }
      }
    },

    snackbarColor(): string {
      return LEVEL_COLOR_MAP[this.level] || "primary";
    },
  },

  methods: {
    closeSnackbar() {
      this.$eventBus.emit("notify:close");
    },
  },
});

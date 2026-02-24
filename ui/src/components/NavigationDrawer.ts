import { ref, computed, onMounted, defineComponent } from "vue";
import { useTheme, useDisplay } from "vuetify";
import { getContainerIcon } from "@/services/container";
import { getRegistryIcon } from "@/services/registry";
import { getTriggerIcon } from "@/services/trigger";
import { getServerIcon } from "@/services/server";
import { getWatcherIcon } from "@/services/watcher";
import { getAuthenticationIcon } from "@/services/authentication";

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const theme = useTheme();
    const { mobile } = useDisplay();
    const isMobile = computed(() => mobile.value);
    const mini = ref(true);
    const darkMode = ref(
      localStorage.darkMode !== undefined
        ? localStorage.darkMode === "true"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    const configurationItems = [
      {
        to: "/configuration/authentications",
        name: "auth",
        icon: getAuthenticationIcon(),
      },
      {
        to: "/configuration/registries",
        name: "registries",
        icon: getRegistryIcon(),
      },
      {
        to: "/configuration/triggers",
        name: "triggers",
        icon: getTriggerIcon(),
      },
      {
        to: "/configuration/watchers",
        name: "watchers",
        icon: getWatcherIcon(),
      },
      {
        to: "/configuration/server",
        name: "server",
        icon: getServerIcon(),
      },
    ];

    const applyTheme = (isDark: boolean) => {
      theme.global.name.value = isDark ? "dark" : "light";
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    const toggleDarkMode = (value: boolean) => {
      darkMode.value = value;
      localStorage.darkMode = String(darkMode.value);
      applyTheme(darkMode.value);
    };

    const drawerOpen = computed({
      get: () => props.modelValue,
      set: (value: boolean) => emit("update:modelValue", value),
    });

    onMounted(() => {
      applyTheme(darkMode.value);
    });

    return {
      mini,
      darkMode,
      isMobile,
      drawerOpen,
      containerIcon: getContainerIcon(),
      configurationItems,
      toggleDarkMode,
    };
  },

  computed: {
    configurationItemsSorted() {
      return [...this.configurationItems].sort((item1, item2) =>
        item1.name.localeCompare(item2.name),
      );
    },
  },
});

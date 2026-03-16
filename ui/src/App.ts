import {
  ref,
  computed,
  onMounted,
  inject,
  getCurrentInstance,
  watch,
  defineComponent,
} from "vue";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import AppBar from "@/components/AppBar.vue";
import SnackBar from "@/components/SnackBar.vue";
import AppFooter from "@/components/AppFooter.vue";
import { getServer } from "@/services/server";
import { getUser } from "@/services/auth";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useEventBus } from "@/composables/useEventBus";
import { useDataCache } from "@/composables/useDataCache";

export default defineComponent({
  components: {
    NavigationDrawer,
    AppBar,
    SnackBar,
    AppFooter,
  },
  setup() {
    const route = useRoute();
    const eventBus = inject("eventBus") as ReturnType<typeof useEventBus>;
    const instance = getCurrentInstance();
    const { mobile } = useDisplay();

    const { prefetchAll } = useDataCache();

    const snackbarMessage = ref("");
    const snackbarShow = ref(false);
    const snackbarLevel = ref("info");
    const user = ref(undefined);
    const drawerOpen = ref(!mobile.value);

    const toggleNav = () => {
      drawerOpen.value = !drawerOpen.value;
    };

    const items = computed(() => {
      return route.fullPath
        .replace("/", "")
        .split("/")
        .map((item) => ({
          text: item ? item : "Home",
          disabled: false,
          href: "",
        }));
    });

    const authenticated = computed(() => {
      return user.value !== undefined;
    });

    const onAuthenticated = (userData: Record<string, unknown>) => {
      user.value = userData;
      prefetchAll();
    };

    const notify = (message: string, level = "info") => {
      snackbarMessage.value = message;
      snackbarShow.value = true;
      snackbarLevel.value = level;
    };

    const notifyClose = () => {
      snackbarMessage.value = "";
      snackbarShow.value = false;
    };

    onMounted(async () => {
      eventBus.on("authenticated", onAuthenticated);
      eventBus.on("notify", notify);
      eventBus.on("notify:close", notifyClose);
    });

    // Watch route changes to sync auth state
    watch(route, async (newRoute) => {
      if (newRoute.name === 'login') {
        user.value = undefined;
      } else if (!user.value) {
        const currentUser = await getUser();
        if (currentUser) {
          onAuthenticated(currentUser);
        }
      }
    });

    let serverConfigFetching = false;
    watch(authenticated, async (isAuthenticated) => {
      if (
        isAuthenticated &&
        instance &&
        !instance.appContext.config.globalProperties.$serverConfig &&
        !serverConfigFetching
      ) {
        serverConfigFetching = true;
        try {
          const server = await getServer();
          instance.appContext.config.globalProperties.$serverConfig =
            server.configuration;
        } finally {
          serverConfigFetching = false;
        }
      }
    }, { immediate: true });

    return {
      snackbarMessage,
      snackbarShow,
      snackbarLevel,
      user,
      items,
      authenticated,
      drawerOpen,
      toggleNav,
    };
  },
});

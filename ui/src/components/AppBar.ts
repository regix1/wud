import { computed, inject, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { logout } from "@/services/auth";
import type { useEventBus } from "@/composables/useEventBus";

export default defineComponent({
  name: "AppBar",

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  emits: ["toggle-nav"],

  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { mobile } = useDisplay();
    const eventBus = inject("eventBus") as ReturnType<typeof useEventBus>;

    const isMobile = computed(() => mobile.value);

    const viewName = computed(() => {
      const name = route.name as string | undefined;
      if (!name || name.toLowerCase() === "home") {
        return "";
      }
      return name;
    });

    const showUserMenu = computed(() => {
      return (
        props.user &&
        props.user.username &&
        props.user.username !== "anonymous"
      );
    });

    const performLogout = async () => {
      try {
        const logoutResult = await logout();
        if (logoutResult && logoutResult.logoutUrl) {
          window.location.href = logoutResult.logoutUrl;
        } else {
          await router.push({ name: "login" });
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        eventBus.emit(
          "notify",
          `Error when trying to logout (${message})`,
          "error",
        );
      }
    };

    return {
      isMobile,
      viewName,
      showUserMenu,
      logout: performLogout,
    };
  },
});

import { computed, inject, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { logout } from "@/services/auth";
import type { useEventBus } from "@/composables/useEventBus";

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ["toggle-nav"],
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventBus = inject("eventBus") as ReturnType<typeof useEventBus>;
    const { mobile } = useDisplay();
    const isMobile = computed(() => mobile.value);

    const viewName = computed(() => {
      return typeof route.name === "string" ? route.name : "";
    });

    const performLogout = async () => {
      try {
        const logoutResult = await logout();
        if (logoutResult.logoutUrl) {
          window.location = logoutResult.logoutUrl;
        } else {
          await router.push({
            name: "login",
          });
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
      viewName,
      logout: performLogout,
      isMobile,
    };
  },
});

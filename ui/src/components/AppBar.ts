import { computed, inject, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { logout } from "@/services/auth";
import type { useEventBus } from "@/composables/useEventBus";

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventBus = inject("eventBus") as ReturnType<typeof useEventBus>;

    const viewName = computed(() => {
      return route.name;
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
    };
  },
});

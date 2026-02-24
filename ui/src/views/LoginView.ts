import { inject, defineComponent } from "vue";
import type { ComponentPublicInstance } from "vue";
import { useDisplay } from "vuetify";
import { getOidcRedirection, getStrategies } from "@/services/auth";
import LoginBasic from "@/components/LoginBasic.vue";
import LoginOidc from "@/components/LoginOidc.vue";
import logo from "@/assets/wud-logo.svg";

interface AuthStrategy {
  type: string;
  name: string;
  redirect?: boolean;
}

interface EventBus {
  emit: (event: string, ...args: unknown[]) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
}

interface LoginViewInstance {
  strategies: AuthStrategy[];
  isSupportedStrategy: (strategy: AuthStrategy) => boolean;
  eventBus?: EventBus;
}

export default defineComponent({
  components: {
    LoginBasic,
    LoginOidc,
  },
  setup() {
    const eventBus = inject("eventBus") as EventBus;
    const { smAndUp } = useDisplay();
    return {
      eventBus,
      smAndUp,
    };
  },
  data() {
    return {
      logo,
      strategies: [] as AuthStrategy[],
      strategySelected: 0,
      showDialog: true,
    };
  },

  methods: {
    /**
     * Is strategy supported for Web UI usage?
     * @param strategy
     * @returns {boolean}
     */
    isSupportedStrategy(strategy: AuthStrategy) {
      switch (strategy.type) {
        case "basic":
          return true;
        case "oidc":
          return true;
        default:
          return false;
      }
    },

    /**
     * Handle authentication success.
     */
    onAuthenticationSuccess() {
      this.$router.push((this.$route.query.next as string) || "/");
    },
  },

  /**
   * Collect available auth strategies.
   * @param to
   * @param from
   * @param next
   * @returns {Promise<void>}
   */
  async beforeRouteEnter(to, from, next) {
    try {
      const strategies = await getStrategies();

      // If anonymous auth is enabled then no need to login => go home
      if (strategies.find((strategy: AuthStrategy) => strategy.type === "anonymous")) {
        next("/");
      }

      // If oidc strategy supporting redirect
      const oidcWithRedirect = strategies.find(
        (strategy: AuthStrategy) => strategy.type === "oidc" && strategy.redirect,
      );
      if (oidcWithRedirect) {
        const redirection = await getOidcRedirection(oidcWithRedirect.name);
        window.location.href = redirection.url;
      } else {
        // Filter on supported auth for UI
        next(async (vm: ComponentPublicInstance) => {
          const instance = vm as unknown as LoginViewInstance;
          instance.strategies = strategies.filter(instance.isSupportedStrategy);
        });
      }
    } catch (e: unknown) {
      // Note: In beforeRouteEnter, 'this' is not available, so we'll handle this in the component
      next((vm: ComponentPublicInstance) => {
        const instance = vm as unknown as LoginViewInstance;
        if (instance.eventBus) {
          instance.eventBus.emit(
            "notify",
            `Error when trying to get the authentication strategies (${(e as Error).message})`,
            "error",
          );
        }
      });
    }
  },
});

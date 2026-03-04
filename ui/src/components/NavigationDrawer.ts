import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useDisplay, useTheme } from 'vuetify';
import { getContainerIcon } from '@/services/container';
import { getRegistryIcon } from '@/services/registry';
import { getTriggerIcon } from '@/services/trigger';
import { getServerIcon } from '@/services/server';
import { getWatcherIcon } from '@/services/watcher';
import { getAuthenticationIcon } from '@/services/authentication';

interface NavItem {
  name: string;
  icon: string;
  route: string;
}

export default defineComponent({
  name: 'NavigationDrawer',

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { mobile } = useDisplay();
    const theme = useTheme();

    const isMobile = computed(() => mobile.value);
    const mini = ref(true);

    const drawerOpen = computed({
      get(): boolean {
        return props.modelValue;
      },
      set(value: boolean): void {
        emit('update:modelValue', value);
      },
    });

    watch(isMobile, (nowMobile: boolean) => {
      if (nowMobile) {
        mini.value = true;
      }
    });

    const mainItems: NavItem[] = [
      { name: 'Home', icon: 'mdi-home', route: '/' },
      { name: 'Containers', icon: getContainerIcon(), route: '/containers' },
    ];

    const configItems: NavItem[] = [
      { name: 'Auth', icon: getAuthenticationIcon(), route: '/configuration/authentications' },
      { name: 'Registries', icon: getRegistryIcon(), route: '/configuration/registries' },
      { name: 'Triggers', icon: getTriggerIcon(), route: '/configuration/triggers' },
      { name: 'Watchers', icon: getWatcherIcon(), route: '/configuration/watchers' },
      { name: 'Server', icon: getServerIcon(), route: '/configuration/server' },
    ].sort((a: NavItem, b: NavItem) => a.name.localeCompare(b.name));

    const isDark = ref(false);

    function detectInitialTheme(): boolean {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function applyTheme(dark: boolean): void {
      theme.change(dark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    }

    function toggleDarkMode(): void {
      isDark.value = !isDark.value;
      localStorage.setItem('darkMode', String(isDark.value));
      applyTheme(isDark.value);
    }

    onMounted(() => {
      isDark.value = detectInitialTheme();
      applyTheme(isDark.value);
    });

    const darkModeLabel = computed((): string => {
      return isDark.value ? 'Dark Mode' : 'Light Mode';
    });

    const darkModeIcon = computed((): string => {
      return isDark.value ? 'mdi-weather-night' : 'mdi-white-balance-sunny';
    });

    function toggleMini(): void {
      mini.value = !mini.value;
    }

    function closeMobileDrawer(): void {
      drawerOpen.value = false;
    }

    return {
      isMobile,
      mini,
      drawerOpen,
      mainItems,
      configItems,
      isDark,
      darkModeLabel,
      darkModeIcon,
      toggleMini,
      closeMobileDrawer,
      toggleDarkMode,
    };
  },
});

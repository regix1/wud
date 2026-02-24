// Google fonts
import "@fontsource/roboto";

// Material design icons
import "@mdi/font/css/materialdesignicons.css";

// Font-awesome
import "@fortawesome/fontawesome-free/css/all.css";

import { createVuetify as createVuetifyInstance } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

export function createVuetify() {
  return createVuetifyInstance({
    components,
    directives,
    defaults: {
      VCard: { elevation: 0, rounded: 'lg' },
      VBtn: { rounded: 'lg' },
      VChip: { variant: 'tonal', size: 'small' },
      VTextField: { variant: 'outlined', density: 'compact' },
      VSelect: { variant: 'outlined', density: 'compact' },
      VList: { density: 'compact' },
    },
    theme: {
      defaultTheme: "dark",
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#00355E",
            secondary: "#0096C7",
            accent: "#06D6A0",
            error: "#E53935",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FF9800",
          },
        },
        dark: {
          dark: true,
          colors: {
            background: '#1E1E1E',
            surface: '#2D2D30',
            'surface-variant': '#333337',
            'surface-bright': '#3E3E42',
            primary: '#0078D4',
            secondary: '#0096C7',
            accent: '#06D6A0',
            error: '#F14C4C',
            info: '#3794FF',
            success: '#4EC9B0',
            warning: '#DDB559',
            'on-background': '#CCCCCC',
            'on-surface': '#CCCCCC',
            'on-primary': '#FFFFFF',
            'on-secondary': '#FFFFFF',
            'on-error': '#FFFFFF',
          },
          variables: {
            'border-color': '#3E3E42',
            'border-opacity': 1,
            'high-emphasis-opacity': 0.87,
            'medium-emphasis-opacity': 0.60,
            'disabled-opacity': 0.38,
          }
        },
      },
    },
  });
}

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
            background: '#F8F9FA',
            surface: '#FFFFFF',
            'surface-variant': '#F0F1F3',
            'surface-bright': '#FFFFFF',
            primary: '#1565C0',
            secondary: '#0288D1',
            accent: '#059669',
            error: '#D32F2F',
            info: '#1976D2',
            success: '#2E7D32',
            warning: '#E65100',
            'on-background': '#1A1A1A',
            'on-surface': '#1A1A1A',
            'on-primary': '#FFFFFF',
            'on-secondary': '#FFFFFF',
            'on-error': '#FFFFFF',
          },
          variables: {
            'border-color': '#1A1A1A',
            'border-opacity': 0.12,
            'high-emphasis-opacity': 0.87,
            'medium-emphasis-opacity': 0.60,
            'disabled-opacity': 0.38,
          }
        },
        dark: {
          dark: true,
          colors: {
            background: '#1E1E1E',
            surface: '#2D2D30',
            'surface-variant': '#333337',
            'surface-bright': '#3E3E42',
            primary: '#4DA8FF',
            secondary: '#29B6F6',
            accent: '#06D6A0',
            error: '#FF6B6B',
            info: '#64B5F6',
            success: '#4EC9B0',
            warning: '#FFB74D',
            'on-background': '#E0E0E0',
            'on-surface': '#E0E0E0',
            'on-primary': '#0D1B2E',
            'on-secondary': '#0D1B2E',
            'on-error': '#FFFFFF',
          },
          variables: {
            'border-color': '#3E3E42',
            'border-opacity': 1,
            'high-emphasis-opacity': 0.87,
            'medium-emphasis-opacity': 0.60,
            'disabled-opacity': 0.45,
          }
        },
      },
    },
  });
}

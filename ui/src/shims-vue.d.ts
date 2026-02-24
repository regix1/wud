/* eslint-disable */

// 1. Module Definitions (from your old shims-vue and shims-vue-2)
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg' {
  const content: any;
  export default content;
}

// 2. Global Type Augmentation
// This tells TypeScript that these properties exist on ALL Vue components.
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $eventBus: {
      emit: (event: string, ...args: unknown[]) => void;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      off: (event: string, callback: (...args: unknown[]) => void) => void;
    };

    $filters: {
      short: (str: string, length: number) => string;
      dateTime: (date: string) => string;
      date: (date: string) => string;
    };

    $serverConfig?: {
      feature?: {
        delete?: boolean;
      };
    };
  }
}
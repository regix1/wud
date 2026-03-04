import { ref } from 'vue';
import { getAllContainers } from '@/services/container';
import { getAllWatchers } from '@/services/watcher';
import { getAllTriggers } from '@/services/trigger';
import { getAllRegistries } from '@/services/registry';
import { getAllAuthentications } from '@/services/authentication';
import { getServer } from '@/services/server';
import { getStore } from '@/services/store';
import { getLog } from '@/services/log';

// Module-level singleton state — shared across all consumers
const containers = ref<Record<string, unknown>[]>([]);
const watchers = ref<Record<string, unknown>[]>([]);
const triggers = ref<Record<string, unknown>[]>([]);
const registries = ref<Record<string, unknown>[]>([]);
const authentications = ref<Record<string, unknown>[]>([]);
const serverConfig = ref<Record<string, unknown> | null>(null);
const storeData = ref<Record<string, unknown> | null>(null);
const logData = ref<Record<string, unknown> | null>(null);

const loading = ref(false);
const initialized = ref(false);

// Deduplication: if a prefetch is already in flight, return the same promise
let prefetchPromise: Promise<void> | null = null;

async function prefetchAll(): Promise<void> {
  if (initialized.value) return;
  if (prefetchPromise) return prefetchPromise;

  prefetchPromise = (async () => {
    loading.value = true;
    try {
      const [c, w, t, r, a, s, st, l] = await Promise.all([
        getAllContainers(),
        getAllWatchers(),
        getAllTriggers(),
        getAllRegistries(),
        getAllAuthentications(),
        getServer(),
        getStore(),
        getLog(),
      ]);
      containers.value = c;
      watchers.value = w;
      triggers.value = t;
      registries.value = r;
      authentications.value = a;
      serverConfig.value = s;
      storeData.value = st;
      logData.value = l;
      initialized.value = true;
    } finally {
      loading.value = false;
      prefetchPromise = null;
    }
  })();

  return prefetchPromise;
}

function invalidate(): void {
  initialized.value = false;
}

export function useDataCache() {
  return {
    containers,
    watchers,
    triggers,
    registries,
    authentications,
    serverConfig,
    storeData,
    logData,
    loading,
    initialized,
    prefetchAll,
    invalidate,
  };
}

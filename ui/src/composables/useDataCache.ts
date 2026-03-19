import { ref } from 'vue';
import { Container } from '@/types/container';
import { getAllContainers } from '@/services/container';
import { getAllWatchers } from '@/services/watcher';
import { getAllTriggers } from '@/services/trigger';
import { getAllRegistries } from '@/services/registry';
import { getAllAuthentications } from '@/services/authentication';
import { getServer } from '@/services/server';
import { getStore } from '@/services/store';
import { getLog } from '@/services/log';

// Module-level singleton state — shared across all consumers
const containers = ref<Container[]>([]);
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

// SSE connection state
let eventSource: EventSource | null = null;
let explicitlyClosed = false;
const pendingEvents: Array<{ type: string; data: string }> = [];

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
      // Flush any SSE events that arrived during initial fetch
      while (pendingEvents.length > 0) {
        const event = pendingEvents.shift()!;
        if (event.type === 'container-added') handleContainerAdded(event.data);
        else if (event.type === 'container-updated') handleContainerUpdated(event.data);
        else if (event.type === 'container-removed') handleContainerRemoved(event.data);
      }
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

function handleContainerAdded(data: string): void {
  const container = JSON.parse(data) as Container;
  const exists = containers.value.find((c: Container) => c.id === container.id);
  if (!exists) {
    containers.value.push(container);
  }
}

function handleContainerUpdated(data: string): void {
  const container = JSON.parse(data) as Container;
  const index = containers.value.findIndex((c: Container) => c.id === container.id);
  if (index !== -1) {
    containers.value.splice(index, 1, container);
  } else {
    containers.value.push(container);
  }
}

function handleContainerRemoved(data: string): void {
  const container = JSON.parse(data) as Container;
  containers.value = containers.value.filter((c: Container) => c.id !== container.id);
}

function connectSSE(): void {
  if (eventSource) return;
  explicitlyClosed = false;

  eventSource = new EventSource('/api/sse');

  eventSource.addEventListener('container-added', (e: MessageEvent) => {
    if (!initialized.value) {
      pendingEvents.push({ type: 'container-added', data: e.data });
      return;
    }
    handleContainerAdded(e.data);
  });

  eventSource.addEventListener('container-updated', (e: MessageEvent) => {
    if (!initialized.value) {
      pendingEvents.push({ type: 'container-updated', data: e.data });
      return;
    }
    handleContainerUpdated(e.data);
  });

  eventSource.addEventListener('container-removed', (e: MessageEvent) => {
    if (!initialized.value) {
      pendingEvents.push({ type: 'container-removed', data: e.data });
      return;
    }
    handleContainerRemoved(e.data);
  });

  eventSource.onerror = () => {
    if (!explicitlyClosed) {
      console.warn('SSE connection error — auto-reconnecting...');
    }
  };
}

function disconnectSSE(): void {
  explicitlyClosed = true;
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
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
    connectSSE,
    disconnectSSE,
  };
}

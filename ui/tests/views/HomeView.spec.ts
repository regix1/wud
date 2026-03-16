import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView';

// Mock services
jest.mock('@/services/container', () => ({
  getContainerIcon: jest.fn(() => 'mdi-docker'),
  getAllContainers: jest.fn(() => Promise.resolve([
    { id: 1, updateAvailable: true },
    { id: 2, updateAvailable: false }
  ]))
}));
jest.mock('@/services/registry', () => ({
  getRegistryIcon: jest.fn(() => 'mdi-database'),
  getAllRegistries: jest.fn(() => Promise.resolve([{}, {}, {}]))
}));
jest.mock('@/services/trigger', () => ({
  getTriggerIcon: jest.fn(() => 'mdi-bell'),
  getAllTriggers: jest.fn(() => Promise.resolve([{}]))
}));
jest.mock('@/services/watcher', () => ({
  getWatcherIcon: jest.fn(() => 'mdi-eye'),
  getAllWatchers: jest.fn(() => Promise.resolve([{}, {}]))
}));
jest.mock('@/services/authentication', () => ({
  getAuthenticationIcon: jest.fn(() => 'mdi-lock'),
  getAllAuthentications: jest.fn(() => Promise.resolve([]))
}));
jest.mock('@/services/server', () => ({
  getServer: jest.fn(() => Promise.resolve({}))
}));
jest.mock('@/services/store', () => ({
  getStore: jest.fn(() => Promise.resolve({}))
}));
jest.mock('@/services/log', () => ({
  getLog: jest.fn(() => Promise.resolve({}))
}));

// Mock EventSource
const mockEventSource = {
  addEventListener: jest.fn(),
  close: jest.fn(),
};
(global as Record<string, unknown>).EventSource = jest.fn(() => mockEventSource);

// Mock useRouter
const mockPush = jest.fn();
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

// Reset useDataCache singleton state between tests
beforeEach(() => {
  jest.resetModules();
  mockPush.mockClear();
});

describe('HomeView', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(HomeView, {
      global: {
        stubs: {}
      }
    });

    // Simulate data loaded from beforeRouteEnter
    await wrapper.setData({
      containersCount: 2,
      containersToUpdateCount: 1,
      triggersCount: 1,
      watchersCount: 2,
      registriesCount: 3,
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders all status cards', () => {
    const cards = wrapper.findAll('.home-card');
    expect(cards).toHaveLength(4);
  });

  it('displays correct counts', () => {
    expect(wrapper.text()).toContain('2 containers');
    expect(wrapper.text()).toContain('1 triggers');
    expect(wrapper.text()).toContain('2 watchers');
    expect(wrapper.text()).toContain('3 registries');
  });

  it('displays update warning when updates are available', () => {
    expect(wrapper.text()).toContain('1 updates available');
    const updateLink = wrapper.find('.update-link');
    expect(updateLink.exists()).toBe(true);
  });

  it('displays success message when no updates are available', async () => {
    await wrapper.setData({
      containersToUpdateCount: 0
    });
    expect(wrapper.text()).toContain('all containers are up-to-date');
    const updateLink = wrapper.find('.update-link');
    expect(updateLink.exists()).toBe(false);
  });

  it('navigates to correct routes on card click', async () => {
    const cards = wrapper.findAll('.home-card');
    expect(cards).toHaveLength(4);

    // Containers card uses @click with router.push
    await cards[0].trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/containers');

    // Other cards use `to` prop — check it's set correctly
    expect(cards[1].attributes('to')).toBe('/configuration/triggers');
    expect(cards[2].attributes('to')).toBe('/configuration/watchers');
    expect(cards[3].attributes('to')).toBe('/configuration/registries');
  });

  it('navigates to updates on update-link click', async () => {
    const updateLink = wrapper.find('.update-link');
    await updateLink.trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/containers?update-available=true');
  });
});

describe('HomeView Data Fetching', () => {
    it('fetches data on mount', async () => {
        // Reset the useDataCache singleton so prefetchAll runs fresh
        const { useDataCache } = require('@/composables/useDataCache');
        const cache = useDataCache();
        cache.initialized.value = false;

        const wrapper = mount(HomeView, {
          global: {
            stubs: {}
          }
        });

        // Wait for mounted async to resolve
        await wrapper.vm.$nextTick();
        await new Promise((r) => setTimeout(r, 50));
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$data.containersCount).toBe(2);
        expect(wrapper.vm.$data.registriesCount).toBe(3);
        expect(wrapper.vm.$data.triggersCount).toBe(1);
        expect(wrapper.vm.$data.watchersCount).toBe(2);
        expect(wrapper.vm.$data.containersToUpdateCount).toBe(1);
        expect(wrapper.vm.$data.loading).toBe(false);

        wrapper.unmount();
    });
});

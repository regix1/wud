import { mount } from '@vue/test-utils';
import ContainerFilter from '@/components/ContainerFilter';

const mockProps = {
  registries: ['hub', 'ghcr'],
  registrySelectedInit: '',
  watchers: ['local', 'docker'],
  watcherSelectedInit: '',
  updateKinds: ['major', 'minor', 'patch'],
  updateKindSelectedInit: '',
  updateAvailable: false,
  oldestFirst: false,
  groupLabels: ['app', 'env', 'version'],
  groupByLabel: ''
};

// Mock the container service
jest.mock('@/services/container', () => ({
  refreshAllContainers: jest.fn(() => Promise.resolve([]))
}));

describe('ContainerFilter', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ContainerFilter, {
      props: mockProps
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders all filter components', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('emits registry-changed event when registry selection changes', async () => {
    wrapper.vm.registrySelected = 'hub';
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('registry-changed')).toBeTruthy();
    expect(wrapper.emitted('registry-changed')[0]).toEqual(['hub']);
  });

  it('emits watcher-changed event when watcher selection changes', async () => {
    wrapper.vm.watcherSelected = 'docker';
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('watcher-changed')).toBeTruthy();
    expect(wrapper.emitted('watcher-changed')[0]).toEqual(['docker']);
  });

  it('emits update-kind-changed event when update kind selection changes', async () => {
    wrapper.vm.updateKindSelected = 'major';
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update-kind-changed')).toBeTruthy();
    expect(wrapper.emitted('update-kind-changed')[0]).toEqual(['major']);
  });

  it('emits group-by-label-changed event when group by label changes', async () => {
    wrapper.vm.groupByLabelLocal = 'app';
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('group-by-label-changed')).toBeTruthy();
    expect(wrapper.emitted('group-by-label-changed')[0]).toEqual(['app']);
  });

  it('emits update-available-changed event when update available toggle changes', async () => {
    wrapper.vm.updateAvailableLocal = !wrapper.vm.updateAvailableLocal;
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update-available-changed')).toBeTruthy();
  });

  it('emits oldest-first-changed event when oldest first toggle changes', async () => {
    wrapper.vm.oldestFirstLocal = !wrapper.vm.oldestFirstLocal;
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('oldest-first-changed')).toBeTruthy();
  });

  it('handles refresh all containers action', async () => {
    const { refreshAllContainers } = require('@/services/container');
    refreshAllContainers.mockResolvedValue([{ id: 'test' }]);

    await wrapper.vm.refreshAllContainers();

    expect(refreshAllContainers).toHaveBeenCalled();
    expect(wrapper.emitted('refresh-all-containers')).toBeTruthy();
  });

  it('handles refresh error gracefully', async () => {
    const { refreshAllContainers } = require('@/services/container');
    refreshAllContainers.mockRejectedValue(new Error('Network error'));

    await wrapper.vm.refreshAllContainers();

    expect(wrapper.vm.isRefreshing).toBe(false);
  });

  it('initializes local state from props', () => {
    const customWrapper = mount(ContainerFilter, {
      props: {
        ...mockProps,
        registrySelectedInit: 'ghcr',
        watcherSelectedInit: 'docker',
        updateAvailable: true,
        oldestFirst: true,
        groupByLabel: 'app'
      }
    });

    expect(customWrapper.vm.registrySelected).toBe('ghcr');
    expect(customWrapper.vm.watcherSelected).toBe('docker');
    expect(customWrapper.vm.updateAvailableLocal).toBe(true);
    expect(customWrapper.vm.oldestFirstLocal).toBe(true);
    expect(customWrapper.vm.groupByLabelLocal).toBe('app');

    customWrapper.unmount();
  });

  it('emits with empty string when value is empty', async () => {
    // registrySelected starts as '' from props, set it to something then back to ''
    wrapper.vm.registrySelected = 'hub';
    await wrapper.vm.$nextTick();
    wrapper.vm.registrySelected = '';
    await wrapper.vm.$nextTick();

    const events = wrapper.emitted('registry-changed');
    expect(events[events.length - 1]).toEqual(['']);
  });
});

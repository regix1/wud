import { Gauge, register } from 'prom-client';

type WatcherLabels = 'type' | 'name';

interface WatchContainerMetric {
    set(labels: Record<WatcherLabels, string>, value: number): void;
}

const noopGauge: WatchContainerMetric = {
    set() {},
};

let watchContainerGauge: Gauge<WatcherLabels> | undefined;

export function init() {
    if (watchContainerGauge) {
        register.removeSingleMetric('wud_watcher_total');
    }
    watchContainerGauge = new Gauge<WatcherLabels>({
        name: 'wud_watcher_total',
        help: 'The number of watched containers',
        labelNames: ['type', 'name'],
    });
}

export function getWatchContainerGauge(): WatchContainerMetric {
    return watchContainerGauge ?? noopGauge;
}

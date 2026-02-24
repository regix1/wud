import { Counter, register } from 'prom-client';

type TriggerLabels = 'type' | 'name' | 'status';

interface TriggerCounterMetric {
    inc(labels: Record<TriggerLabels, string>, delta?: number): void;
}

const noopCounter: TriggerCounterMetric = {
    inc() {},
};

let triggerCounter: Counter<TriggerLabels> | undefined;

export function init() {
    if (triggerCounter) {
        register.removeSingleMetric('wud_trigger_count');
    }
    triggerCounter = new Counter<TriggerLabels>({
        name: 'wud_trigger_count',
        help: 'Total count of trigger events',
        labelNames: ['type', 'name', 'status'],
    });
}

export function getTriggerCounter(): TriggerCounterMetric {
    return triggerCounter ?? noopCounter;
}

import { Summary, register } from 'prom-client';

type RegistryLabels = 'type' | 'name';

interface RegistrySummaryMetric {
    observe(labels: Record<RegistryLabels, string>, value: number): void;
}

const noopSummary: RegistrySummaryMetric = {
    observe() {},
};

let summaryGetTags: Summary<RegistryLabels> | undefined;

export function init() {
    if (summaryGetTags) {
        register.removeSingleMetric('wud_registry_response');
    }
    summaryGetTags = new Summary<RegistryLabels>({
        name: 'wud_registry_response',
        help: 'The Registry response time (in second)',
        labelNames: ['type', 'name'],
    });
}

export function getSummaryTags(): RegistrySummaryMetric {
    return summaryGetTags ?? noopSummary;
}

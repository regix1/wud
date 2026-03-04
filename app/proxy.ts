import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { AxiosRequestConfig } from 'axios';

/**
 * Get proxy-related axios config by reading HTTP_PROXY / HTTPS_PROXY / NO_PROXY env vars.
 * Returns httpsAgent, httpAgent, and proxy:false when a proxy is configured,
 * or an empty object when no proxy applies.
 */
export function getProxyConfig(
    targetUrl?: string,
): Partial<AxiosRequestConfig> {
    const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
    const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
    const noProxy = process.env.NO_PROXY || process.env.no_proxy;

    // Pick the right proxy URL based on the target protocol
    let proxyUrl: string | undefined;
    if (targetUrl) {
        const isHttps = targetUrl.startsWith('https://');
        proxyUrl = isHttps ? httpsProxy || httpProxy : httpProxy;
    } else {
        proxyUrl = httpsProxy || httpProxy;
    }

    if (!proxyUrl) {
        return {};
    }

    // Honour NO_PROXY
    if (noProxy && targetUrl) {
        const noProxyList = noProxy
            .split(',')
            .map((s) => s.trim().toLowerCase());
        const targetHost = new URL(targetUrl).hostname.toLowerCase();
        for (const entry of noProxyList) {
            if (entry === '*') return {};
            if (targetHost === entry || targetHost.endsWith(`.${entry}`)) {
                return {};
            }
        }
    }

    return {
        httpsAgent: new HttpsProxyAgent(proxyUrl),
        httpAgent: new HttpProxyAgent(proxyUrl),
        proxy: false as const,
    };
}

/**
 * Build proxy config from an explicit proxy URL string (e.g. user-configured proxy).
 * Falls back to env-var-based proxy when proxyUrl is not provided.
 */
export function getExplicitProxyConfig(
    proxyUrl: string | undefined,
    targetUrl?: string,
): Partial<AxiosRequestConfig> {
    if (!proxyUrl) {
        return getProxyConfig(targetUrl);
    }
    return {
        httpsAgent: new HttpsProxyAgent(proxyUrl),
        httpAgent: new HttpProxyAgent(proxyUrl),
        proxy: false as const,
    };
}

import Logger from 'bunyan';

/**
 * Wraps an axios call with 429 rate-limit retry logic.
 * Non-429 errors are thrown immediately without retrying.
 * @param axiosCall function returning the axios promise
 * @param log Bunyan logger instance for warning messages
 * @param maxRetries maximum number of attempts (default 3)
 * @returns the axios response from the first successful attempt
 */
async function retryOnRateLimit(
    axiosCall: () => Promise<any>,
    log: Logger,
    maxRetries: number = 3,
): Promise<any> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await axiosCall();
        } catch (error: any) {
            if (error.response?.status === 429 && attempt < maxRetries) {
                const retryAfter = error.response?.headers?.['retry-after'];
                const delay = retryAfter
                    ? parseInt(retryAfter, 10) * 1000
                    : Math.pow(4, attempt) * 500;
                log.warn(
                    `Rate limited (429), retry ${attempt}/${maxRetries - 1} after ${delay}ms`,
                );
                await new Promise<void>((resolve) => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
}

export default retryOnRateLimit;

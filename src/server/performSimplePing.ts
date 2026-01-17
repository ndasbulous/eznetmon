/**
 * Simple ping implementation using TCP connection attempt
 * Returns latency in milliseconds, or null if connection fails
 */
export async function performSimplePing(
  hostname: string,
  timeout: number
): Promise<number | null> {
  return new Promise((resolve: (value: number | null) => void) => {
    const startTime = Date.now();

    // Create a timeout to reject the promise
    const timeoutId = setTimeout(() => {
      resolve(null);
    }, timeout);

    try {
      // Use fetch to a common endpoint like 1.1.1.1 DNS or just measure DNS resolution
      // For most cases, a simple HEAD request works well
      fetch(`https://${hostname}`, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(timeout),
      })
        .then(() => {
          clearTimeout(timeoutId);
          const latency = Date.now() - startTime;
          resolve(latency);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(null);
        });
    } catch {
      clearTimeout(timeoutId);
      resolve(null);
    }
  });
}

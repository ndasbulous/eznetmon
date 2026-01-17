/**
 * Calculate jitter from ping times
 * Jitter is the standard deviation of latency measurements
 */
export function calculateJitter(times: Array<number>): number {
  if (times.length < 2) {
    return 0;
  }

  const mean = times.reduce((sum: number, time: number) => sum + time, 0) / times.length;
  const variance = times.reduce(
    (sum: number, time: number) => sum + Math.pow(time - mean, 2),
    0
  ) / times.length;

  return Math.sqrt(variance);
}

/**
 * Calculate packet loss percentage
 */
export function calculatePacketLoss(
  totalPackets: number,
  successfulPackets: number
): number {
  if (totalPackets === 0) {
    return 0;
  }

  return ((totalPackets - successfulPackets) / totalPackets) * 100;
}

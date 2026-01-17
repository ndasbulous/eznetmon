export interface PingResult {
  times: Array<number>;
  min: number;
  max: number;
  avg: number;
  stdDev: number;
  packetLoss: number;
}

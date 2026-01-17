import { calculatePacketLoss } from './calculatePacketLoss';

describe('calculatePacketLoss', () => {
  it('should return 0 for zero total packets', () => {
    expect(calculatePacketLoss(0, 0)).toBe(0);
  });

  it('should return 0 when all packets are successful', () => {
    expect(calculatePacketLoss(10, 10)).toBe(0);
  });

  it('should return 100 when no packets are successful', () => {
    expect(calculatePacketLoss(10, 0)).toBe(100);
  });

  it('should calculate packet loss as 50% when half the packets fail', () => {
    expect(calculatePacketLoss(10, 5)).toBe(50);
  });

  it('should calculate packet loss as 25% when one quarter of packets fail', () => {
    expect(calculatePacketLoss(100, 75)).toBe(25);
  });

  it('should calculate packet loss as 10% for 9 successful out of 10', () => {
    expect(calculatePacketLoss(10, 9)).toBe(10);
  });

  it('should handle decimal results', () => {
    expect(calculatePacketLoss(3, 1)).toBeCloseTo(66.66666666666666, 5);
  });

  it('should return 0 for single successful packet', () => {
    expect(calculatePacketLoss(1, 1)).toBe(0);
  });

  it('should return 100 for single failed packet', () => {
    expect(calculatePacketLoss(1, 0)).toBe(100);
  });

  it('should handle large packet counts', () => {
    expect(calculatePacketLoss(1000000, 999900)).toBe(0.01);
  });
});

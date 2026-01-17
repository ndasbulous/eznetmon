import { calculateJitter } from './calculateJitter';

describe('calculateJitter', () => {
  it('should return 0 for empty array', () => {
    expect(calculateJitter([])).toBe(0);
  });

  it('should return 0 for single element', () => {
    expect(calculateJitter([10])).toBe(0);
  });

  it('should calculate jitter correctly for two elements', () => {
    const times = [10, 20];
    const jitter = calculateJitter(times);
    expect(jitter).toBeCloseTo(5);
  });

  it('should calculate jitter correctly for multiple equal values', () => {
    const times = [10, 10, 10, 10];
    expect(calculateJitter(times)).toBe(0);
  });

  it('should calculate jitter correctly for varying values', () => {
    const times = [10, 20, 30];
    const jitter = calculateJitter(times);
    // Mean = 20, variance = ((10-20)^2 + (20-20)^2 + (30-20)^2) / 3 = 200/3
    // stdDev = sqrt(200/3) ≈ 8.165
    expect(jitter).toBeCloseTo(8.165, 2);
  });

  it('should handle large values', () => {
    const times = [1000, 2000, 3000];
    const jitter = calculateJitter(times);
    expect(jitter).toBeGreaterThan(0);
  });

  it('should handle decimal values', () => {
    const times = [10.5, 20.5, 30.5];
    const jitter = calculateJitter(times);
    expect(jitter).toBeCloseTo(8.165, 2);
  });
});

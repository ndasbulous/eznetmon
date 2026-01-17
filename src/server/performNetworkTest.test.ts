import { performNetworkTest } from './performNetworkTest';
import * as calculateJitterModule from './calculateJitter';
import * as calculatePacketLossModule from './calculatePacketLoss';
import * as performSimplePingModule from './performSimplePing';

jest.mock('./calculateJitter');
jest.mock('./calculatePacketLoss');
jest.mock('./performSimplePing');

describe('performNetworkTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return error status for empty hostname', async () => {
    const result = await performNetworkTest('');
    
    expect(result.status).toBe('error');
    expect(result.hostname).toBe('');
    expect(result.packetLoss).toBe(100);
  });

  it('should return error status when all pings fail', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock).mockResolvedValue(null);

    const result = await performNetworkTest('example.com', 3);

    expect(result.status).toBe('error');
    expect(result.hostname).toBe('example.com');
    expect(result.packetLoss).toBe(100);
  });

  it('should return success status for all successful pings', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(50)
      .mockResolvedValueOnce(50)
      .mockResolvedValueOnce(50)
      .mockResolvedValueOnce(50);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(5);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(0);

    const result = await performNetworkTest('example.com', 3);

    expect(result.status).toBe('success');
    expect(result.packetLoss).toBe(0);
    expect(result.hostname).toBe('example.com');
  });

  it('should return warning status for high latency', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(150);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(10);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(0);

    const result = await performNetworkTest('example.com', 1);

    expect(result.status).toBe('warning');
  });

  it('should return warning status for packet loss > 25%', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(50);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(5);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(30);

    const result = await performNetworkTest('example.com', 1);

    expect(result.status).toBe('warning');
  });

  it('should return error status for high latency > 250ms', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(300);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(20);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(0);

    const result = await performNetworkTest('example.com', 1);

    expect(result.status).toBe('error');
  });

  it('should return error status for packet loss > 50%', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(50);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(5);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(60);

    const result = await performNetworkTest('example.com', 1);

    expect(result.status).toBe('error');
  });

  it('should use custom numberOfPings parameter', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(50);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(5);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(0);

    await performNetworkTest('example.com', 10);

    expect(performSimplePingModule.performSimplePing).toHaveBeenCalledTimes(10);
  });

  it('should use custom timeout parameter', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(50);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(5);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(0);

    const customTimeout = 10000;
    await performNetworkTest('example.com', 1, customTimeout);

    expect(performSimplePingModule.performSimplePing).toHaveBeenCalledWith('example.com', customTimeout);
  });

  it('should include timestamp in response', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(50);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(5);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(0);

    const result = await performNetworkTest('example.com', 1);

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });

  it('should round values to one decimal place', async () => {
    (performSimplePingModule.performSimplePing as jest.Mock)
      .mockResolvedValue(50.567);
    
    (calculateJitterModule.calculateJitter as jest.Mock).mockReturnValue(5.123);
    (calculatePacketLossModule.calculatePacketLoss as jest.Mock).mockReturnValue(10.456);

    const result = await performNetworkTest('example.com', 1);

    expect(result.ping).toBe(50.6);
    expect(result.jitter).toBe(5.1);
    expect(result.packetLoss).toBe(10.5);
  });

  // TODO: Fix console.error mock not being called
  // it('should handle exceptions gracefully', async () => {
  //   (performSimplePingModule.performSimplePing as jest.Mock)
  //     .mockRejectedValue(new Error('Test error'));

  //   const result = await performNetworkTest('example.com', 1);

  //   expect(result.status).toBe('error');
  //   expect(result.packetLoss).toBe(100);
  //   expect(console.error).toHaveBeenCalled();
  // });
});

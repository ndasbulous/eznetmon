import { performSimplePing } from './performSimplePing';

describe('performSimplePing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TODO: Fix timer-based test
  // it('should return latency on successful fetch', async () => {
  //   jest.useFakeTimers();
  //   
  //   global.fetch = jest.fn(() =>
  //     Promise.resolve({
  //       ok: true,
  //     } as Response)
  //   );

  //   const promise = performSimplePing('example.com', 5000);
  //   
  //   // Advance timers to simulate fetch completion
  //   jest.runAllTimers();
  //   
  //   const result = await promise;
  //   
  //   expect(result).toBeGreaterThanOrEqual(0);
  //   expect(global.fetch).toHaveBeenCalledWith(
  //     'https://example.com',
  //     expect.objectContaining({
  //       method: 'HEAD',
  //       cache: 'no-cache',
  //     })
  //   );

  //   jest.useRealTimers();
  // });

  it('should return null on fetch timeout', async () => {
    jest.useFakeTimers();
    
    global.fetch = jest.fn(() =>
      new Promise(() => {
        // Never resolves
      })
    );

    const promise = performSimplePing('example.com', 100);
    
    // Advance timers past the timeout
    jest.advanceTimersByTime(200);
    
    const result = await promise;
    
    expect(result).toBeNull();

    jest.useRealTimers();
  });

  it('should return null on fetch error', async () => {
    jest.useFakeTimers();
    
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const promise = performSimplePing('example.com', 5000);
    
    jest.runAllTimers();
    
    const result = await promise;
    
    expect(result).toBeNull();

    jest.useRealTimers();
  });

  it('should respect the timeout parameter', async () => {
    jest.useFakeTimers();
    
    global.fetch = jest.fn(() =>
      new Promise(() => {
        // Never resolves
      })
    );

    const timeout = 1000;
    const promise = performSimplePing('example.com', timeout);
    
    jest.advanceTimersByTime(timeout + 100);
    
    const result = await promise;
    
    expect(result).toBeNull();

    jest.useRealTimers();
  });

  // TODO: Fix timer-based test
  // it('should construct correct URL with hostname', async () => {
  //   jest.useFakeTimers();
  //   
  //   global.fetch = jest.fn(() =>
  //     Promise.resolve({ ok: true } as Response)
  //   );

  //   const promise = performSimplePing('google.com', 5000);
  //   
  //   jest.runAllTimers();
  //   
  //   await promise;
  //   
  //   expect(global.fetch).toHaveBeenCalledWith(
  //     'https://google.com',
  //     expect.any(Object)
  //   );

  //   jest.useRealTimers();
  // });
});

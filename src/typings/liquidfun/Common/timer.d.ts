/**
 * Timer for profiling. This has platform specific code and may
 * not work on every platform.
 */
declare class Timer {
  private start: number;

  constructor();

  /**
   * Reset the timer.
   */
  Reset(): void;

  /**
   * Get the time since construction or the last reset.
   */
  GetMilliseconds(): number;

  /**
   * Get platform specific tick count
   */
  private static GetTicks(): number;
}

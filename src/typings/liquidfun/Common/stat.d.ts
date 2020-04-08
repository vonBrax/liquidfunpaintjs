/**
 * Calculates min/max/mean of a set of samples
 */
declare class Stat {
  private count: number;
  private total: number;
  private min: number;
  private max: number;

  constructor();

  /**
   * Record a sample
   * @param t
   */
  Record(t: number): void;

  /**
   * Returns the number of recorded samples
   */
  GetCount(): number;

  /**
   * Returns the mean of all recorded samples,
   * Returns 0 if there are no recorded samples
   */
  GetMean(): number;

  /**
   * Returns the min of all recorded samples,
   * FLT_MAX if there are no recorded samples
   */
  GetMax(): number;

  /**
   * Erase all recorded samples
   */
  Clear(): void;
}

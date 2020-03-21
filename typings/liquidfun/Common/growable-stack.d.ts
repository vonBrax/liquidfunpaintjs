/**
 * @todo finish implementation
 */

declare class GrowableStack<T, N> {
  private stack: T;
  private array: T;
  private count: number;
  private capacity: number;

  constructor();

  Push(element: T): void;

  Pop(): T;

  GetCount(): number;
}

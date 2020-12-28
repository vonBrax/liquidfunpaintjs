declare class StackQueue<T> {
  private allocator: StackAllocator;
  private buffer: T;
  private front: number;
  private back: number;
  private capacity: number;

  constructor(allocator: StackAllocator, capacity: number);

  Push(item: T): void;

  Pop(): void;

  Empty(): boolean;

  Front(): T;
}

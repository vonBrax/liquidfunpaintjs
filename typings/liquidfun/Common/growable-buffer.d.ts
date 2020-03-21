declare class GrowableBuffer<T> {
  private data: T;
  private count: number;
  private capacity: number;
  private allocation: BlockAllocator;

  constructor(allocator: BlockAllocator);
  constructor(rhs: T);

  Append(): T;

  Reserve(newCapacity: number): void;

  Grow(): void;

  Free(): void;

  Shorten(newEnd: T): void;

  Data(): T;

  Begin(): T;

  End(): T;

  GetCount(): number;

  SetCount(newCount: number): void;

  GetCapacity(): number;
}

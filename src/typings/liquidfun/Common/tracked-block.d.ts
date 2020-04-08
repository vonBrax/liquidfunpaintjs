declare class TrackedBlock extends TypedIntrusiveListNode<TrackedBlock> {
  // Padding required to align the pointer to user memory in the block
  // to b2_mallocAlignment.
  private padding: number; // [b2_mallocAlignment + sizeof(b2TrackedBlock**)]

  constructor();

  // Get the allocated memory associated with this block.
  GetMemory(): void;

  /**
   * Allocate a b2TrackedBlock returning a pointer to memory of size
   * bytes that can be used by the caller.
   * @param size
   */
  static Allocate(size: number): void;

  /**
   * Get a b2TrackedBlock from a pointer to memory returned by
   * b2TrackedBlock::Allocate().
   * @param memory
   */
  static GetFromMemory(memory: void): TrackedBlock;

  /**
   * Free a block of memory returned by b2TrackedBlock::Allocate()
   * @param memory
   */
  static Free(memory: void): void;

  /**
   * Free a b2TrackedBlock.
   * @param block
   */
  static Free(block: TrackedBlock): void;
}

declare class TrackedBlockAllocator {
  private blocks: TypedIntrusiveListNode<TrackedBlock>;

  constructor();

  /**
   * Allocate a block of size bytes using TrackedBlock.Allocate().
   * @param size
   */
  Allocate(size: number): void;

  /**
   * Free a block returned by Allocate().
   * @param memory
   */
  Free(memory: void): void;

  /**
   * Free all allocated blocks.
   */
  FreeAll(): void;

  /**
   * Get the list of allocated blocks.
   */
  GetList(): TypedIntrusiveListNode<TrackedBlock>;
}

declare interface Block {
  next: Block;
}

declare interface Chunk {
  blockSize: number;
  blocks: Block;
}

/**
 * This is a small object allocator used for allocating small
 * objects that persist for more than one time step.
 * See: http://www.codeproject.com/useritems/Small_Block_Allocator.asp
 */
declare class BlockAllocator {
  private chunks: Chunk;
  private chunkCount: number;
  private chunkSpace: number;

  private freeLists: Block[]; // b2_blockSizes;

  // Record giant allocations--ones bigger than the max block size
  private giants: TrackedBlockAllocator;

  private static blockSizes: number; // b2_blockSizes
  private static blockSizeLookup: number; // b2_maxBlockSize + 1
  private static blockSizeLookupInitialized: boolean;

  constructor();

  /**
   * Allocate memory. This uses b2Alloc if the size is larger than b2_maxBlockSize.
   * @param size
   */
  Allocate(size: number): void;

  /**
   * Free memory. This uses b2Free if the size is larger than b2_maxBlockSize.
   * @param p
   * @param size
   */
  Free(p: void, size: number): void;

  Clear(): void;

  /**
   * Returns the number of allocations larger than the max block size.
   */
  GetNumGiantAllocations(): number;
}

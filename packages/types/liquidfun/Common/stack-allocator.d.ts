/**
 * @todo Review exports here and need for type declaration
 */
// export const stackSize = 100 * 1024; // 100k
// export const maxStackEntries = 32;

declare interface StackEntry {
  data: string;
  size: number;
  usedMalloc: boolean;
}

/**
 * This is a stack allocator used for fast per step allocations.
 * You must nest allocate/free pairs. The code will assert
 * if you try to interleave multiple allocate/free pairs.
 */
declare class StackAllocator {
  private data: string; // [b2_stackSize]
  private index: number;

  private allocation: number;
  private maxAllocation: number;

  private entries: StackEntry; // [b2_maxStackEntries]
  private entryCount: number;

  constructor();

  Allocate(size: number): void;
  Reallocate(p: void, size: number): void;
  Free(p: void): void;

  GetMaxAllocation(): number;
}

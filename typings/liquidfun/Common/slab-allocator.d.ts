declare class Slab<T> {
  // Number of items in the slab.
  private numberOfItems: number;

  // Padding to align the first item in the slab to b2_mallocAlignment.
  private padding: number[]; // [b2_mallocAlignment - sizeof(uint32)]

  constructor(numberOfItems: number);

  /**
   * Get the number of items in this slab.
   */
  GetNumberOfItems(): number;

  /**
   * Get a pointer to the first item in the slab.
   */
  GetFirstItem(): T;

  /**
   * Get a pointer to the end of the slab.
   * NOTE: This is a pointer after the last byte of the slab not the
   * last item in the slab.
   */
  GetItemEnd(): T;
}

/**
 * Freelist based allocator for fixed sized items from slabs (memory
 * preallocated from the heap).
 * T should be a class which has a default constructor and implements the
 * member function "b2IntrusiveList* GetListNode()".
 * All objects in a slab are constructed when a slab is created and destructed
 * when a slab is freed.
 */
declare class SlabAllocator<T> {
  // Contains a list of b2TrackedBlock instances where each b2TrackedBlock's
  // associated user memory contains a Slab followed by instances of T.
  private slabs: TrackedBlockAllocator;

  // Number of items to allocate in the next allocated slab.
  private itemsPerSlab: number;

  // Freelist which contains instances of T.
  private freeList: TypedFreeList<T>;

  constructor(itemsPerSlab: number);

  /**
   * Set size of the next allocated slab using the number of items per
   * slab.  Setting this value to zero disables further slab allocation.
   * @param itemsPerSlab
   */
  SetItemsPerSlab(itemsPerSlab: number): void;

  /**
   * Get the size of the next allocated slab.
   */
  GetItemsPerSlab(): number;

  /**
   * Allocate a item from the slab.
   */
  Allocate(): T;

  /**
   * Free an item from the slab.
   * @param object
   */
  Free(object: T): void;

  /**
   * Allocate a slab, construct instances of T and add them to the free
   * pool.
   */
  AllocateSlab(): boolean;

  /**
   * Free all slabs.
   */
  FreeAllSlabs(): void;

  /**
   * Free all empty slabs.
   * This method is slow - O(M^N) - since this class doesn't track
   * the association between each item and slab.
   */
  FreeEmptySlabs(): void;

  /**
   * Get the item allocator freelist.
   */
  GetFreeList(): TypedFreeList<T>;

  /**
   * Destroy all objects in a slab and free the slab.
   * @param slab
   */
  private FreeSlab(slab: Slab<T>);

  /**
   * Get a pointer to a Slab from a block of memory in m_slabs.
   * @param memory
   */
  private BlockGetSlab(memory: void): Slab<T>;

  /**
   * Get a pointer to the first item in the array of items referenced by a
   * Slab.
   * @param slab
   */
  private SlabGetFirstItem(slab: Slab<T>): T;
}

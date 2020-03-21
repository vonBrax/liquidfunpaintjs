declare class FreeList {
  // List of allocated items.
  protected allocated: IntrusiveListNode;

  // List of free items.
  protected free: IntrusiveListNode;

  constructor();

  /**
   * Allocate an item from the freelist.
   */
  Allocate(): IntrusiveListNode;

  /**
   * Free an item from the freelist.
   * @param node
   */
  Free(node: IntrusiveListNode): void;

  /**
   * Add an item to the freelist so that it can be allocated using
   * FreeList.Allocate().
   * @param node
   */
  AddToFreeList(node: IntrusiveListNode): void;

  /**
   * Remove all items (allocated and free) from the freelist.
   */
  RemoveAll(): void;

  /**
   * Get the list which tracks allocated items.
   */
  GetAllocatedList(): IntrusiveListNode;

  /**
   * Get the list which tracks free items.
   */
  GetFreeList(): IntrusiveListNode;
}

declare class TypedFreeList<T> {
  protected freeList: FreeList;

  constructor();

  /**
   * Allocate an item from the free list.
   */
  Allocate(): T;

  /**
   * Free an item.
   * @param instance
   */
  Free(instance: T): void;

  /**
   * Add an item to the freelist so that it can be allocated with
   * b2TypedFreeList::Allocate().
   * @param instance
   */
  AddToFreeList(instance: T): void;

  /**
   * Get the underlying b2FreeList.
   */
  GetFreeList(): FreeList;
}

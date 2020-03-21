declare interface TreeNode {
  aabb: AABB;
  userData: void;
  child1: number;
  child2: number;
  height: number;

  isLeaf(): boolean;
}

/**
 * A dynamic AABB tree broad-phase, inspired by Nathanael Presson's btDbvt.
 * A dynamic tree arranges data in a binary tree to accelerate
 * queries such as volume queries and ray casts. Leafs are proxies
 * with an AABB. In the tree we expand the proxy AABB by b2_fatAABBFactor
 * so that the proxy AABB is bigger than the client object. This allows the client
 * object to move by small amounts without triggering a tree update.
 *
 * Nodes are pooled and relocatable, so we use node indices rather than pointers
 */
declare class DynamicTree {
  private root: number;
  private nodes: TreeNode;
  private nodeCount: number;
  private nodeCapacity: number;
  private freeList: number;
  // This is used to incrementally traverse the tree for re-balancing.
  private path: number;
  private insertionCount: number;

  private AllocateNode(): number;
  private FreeNode(node: number): void;
  private InsertLeaf(node: number): void;
  private RemoveLeaf(node: number): void;
  private Balance(index: number): number;
  private ComputeHeight(): number;
  private ComputeHeight(nodeId: number): number;
  private ValidateStructure(index: number): void;
  private ValidateMetrics(index: number): void;
  constructor();

  /**
   * Create a proxy. Provide a tight fitting AABB and a userData pointer.
   * @param aabb
   * @param userData
   */
  CreateProxy(aabb: AABB, userData: void): number;

  /**
   * Destroy a proxy. This asserts if the id is invalid.
   * @param proxyId
   */
  DestroyProxy(proxyId: number): void;

  /**
   * Move a proxy with a swepted AABB. If the proxy has moved outside of its fattened AABB,
   * then the proxy is removed from the tree and re-inserted. Otherwise
   * the function returns immediately.
   * @param proxyId
   * @param aabb1
   * @param displacement
   * @return true if the proxy was re-inserted.
   */
  MoveProxy(proxyId: number, aabb1: AABB, displacement: Vec2): boolean;

  /**
   * Get proxy user data.
   * @param proxyId
   * @return the proxy user data or 0 if the id is invalid.
   */
  GetUserData(proxyId: number): void;

  /**
   * Get the fat AABB for a proxy.
   * @param proxyId
   */
  GetFatAABB(proxyId: number): AABB;

  /**
   * Query an AABB for overlapping proxies. The callback class
   * is called for each proxy that overlaps the supplied AABB.
   * @param callback
   * @param aabb
   */
  Query<T>(callback: T, aabb: AABB): void;

  /**
   * Ray-cast against the proxies in the tree. This relies on the callback
   * to perform a exact ray-cast in the case were the proxy contains a shape.
   * The callback also performs the any collision filtering. This has performance
   * roughly equal to k * log(n), where k is the number of collisions and n is the
   * number of proxies in the tree.
   * @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
   * @param callback a callback class that is called for each proxy that is hit by the ray.
   */
  RayCast<T>(callback: T, input: RayCastInput): void;

  /**
   * Validate this tree. For testing.
   */
  Validate(): void;

  /**
   * Compute the height of the binary tree in O(N) time. Should not be
   * called often.
   */
  GetHeight(): number;

  /**
   * Get the maximum balance of an node in the tree. The balance is the difference
   * in height of the two children of a node.
   */
  GetMaxBalance(): number;

  /**
   * Get the ratio of the sum of the node areas to the root area.
   */
  GetAreaRatio(): number;

  /**
   * Build an optimal tree. Very expensive. For testing.
   */
  RebuildBottomUp(): void;

  /**
   * Shift the world origin. Useful for large worlds.
   * The shift formula is: position -= newOrigin
   * @param newOrigin the new origin with respect to the old origin
   */
  ShiftOrigin(newOrigin: Vec2): void;
}

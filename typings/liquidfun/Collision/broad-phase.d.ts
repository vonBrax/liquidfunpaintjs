declare interface Pair {
  proxyIdA: number;
  proxyIdB: number;
}

/**
 * The broad-phase is used for computing pairs and performing volume queries and ray casts.
 * This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
 * It is up to the client to consume the new pairs and to track subsequent overlap.
 */
declare class BroadPhase {
  private tree: DynamicTree;
  private proxyCount: number;
  private moveBuffer: number;
  private moveCapacity: number;
  private moveCount: number;
  private pairBuffer: Pair;
  private pairCapacity: number;
  private pairCount: number;
  private queryProxyId: number;

  constructor();

  private BufferMove(proxyId: number): void;
  private UnBufferMove(proxyId: number): void;
  private QueryCallback(proxyId: number): boolean;

  /**
   * Create a proxy with an initial AABB. Pairs are not reported until
   * UpdatePairs is called.
   * @param aabb
   * @param userData
   */
  CreateProxy(aabb: AABB, userData: void): number;

  /**
   * Destroy a proxy. It is up to the client to remove any pairs.
   * @param proxyId
   */
  DestroyProxy(proxyId: number): void;

  /**
   * Call MoveProxy as many times as you like, then when you are done
   * call UpdatePairs to finalized the proxy pairs (for your time step).
   * @param proxyId
   * @param aabb
   * @param displacement
   */
  MoveProxy(proxyId: number, aabb: AABB, displacement: Vec2): void;

  /**
   * Call to trigger a re-processing of it's pairs on the next call to UpdatePairs.
   * @param proxyId
   */
  TouchProxy(proxyId: number): void;

  /**
   * Get the fat AABB for a proxy.
   * @param proxyId
   */
  GetFatAABB(proxyId: number): AABB;

  /**
   * Get user data from a proxy. Returns NULL if the id is invalid.
   * @param proxyId
   */
  GetUserData(proxyId: number): void;

  /**
   * Test overlap of fat AABBs.
   * @param proxyIdA
   * @param proxyIdB
   */
  TestOverlap(proxyIdA: number, proxyIdB: number): boolean;

  /**
   * Get the number of proxies.
   */
  GetProxyCount(): number;

  /**
   * Update the pairs. This results in pair callbacks. This can only add pairs.
   * @param callback
   */
  UpdatePairs(callback: T): void;

  /**
   * Query an AABB for overlapping proxies. The callback class
     is called for each proxy that overlaps the supplied AABB.
   * @param callback
   * @param aabb
   */
  Query(callback: T, aabb: AABB): void;

  /**
   * Ray-cast against the proxies in the tree. This relies on the callback
   * to perform a exact ray-cast in the case were the proxy contains a shape.
   * The callback also performs the any collision filtering. This has performance
   * roughly equal to k * log(n), where k is the number of collisions and n is the
   * number of proxies in the tree.
   * @param callback input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
   * @param input callback a callback class that is called for each proxy that is hit by the ray.
   */
  RayCast(callback: T, input: RayCastInput): void;

  /**
   * Get the height of the embedded tree.
   */
  GetTreeHeight(): number;

  /**
   * Get the balance of the embedded tree.
   */
  GetTreeBalance(): number;

  /**
   * Get the quality metric of the embedded tree.
   */
  GetTreeQuality(): number;

  /**
   * Shift the world origin. Useful for large worlds.
   * The shift formula is: position -= newOrigin
   * @param newOrigin the new origin with respect to the old origin
   */
  ShiftOrigin(newOrigin: Vec2): void;
}

declare type T = () => {};

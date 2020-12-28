declare class DistanceProxy {
  buffer: Vec2[];
  vertices: Vec2;
  count: number;
  radius: number;

  constructor();

  /**
   * Initialize the proxy using the given shape. The shape
   * must remain in scope while the proxy is in use.
   * @param shape
   * @param index
   */
  Set(shape: Shape, index: number): void;

  /**
   * Get the supporting vertex index in the given direction.
   * @param d
   */
  GetSupport(d: Vec2): number;

  /**
   * Get the supporting vertex in the given direction.
   * @param d
   */
  GetSupportVertex(d: Vec2): Vec2;

  /**
   * Get the vertex count.
   */
  GetVertexCount(): number;

  /**
   * Get a vertex by index. Used by b2Distance.
   * @param index
   */
  GetVertex(index: number): Vec2;
}

/**
 * Used to warm start b2Distance.
 * Set count to zero on first call.
 */
declare interface SimplexCache {
  metric: number;
  count: number;
  indexA: number[];
  indexB: number[];
}

/**
 * Input for b2Distance.
 * You have to option to use the shape radii
 * in the computation. Even
 */
declare interface DistanceInput {
  proxyA: DistanceProxy;
  proxyB: DistanceProxy;
  transformA: Transform;
  transformB: Transform;
  useRadii: boolean;
}

declare interface DistanceOutput {
  pointA: Vec2;
  pointB: Vec2;
  distance: number;
  iterations: number;
}

/**
 * Compute the closest points between two shapes. Supports any combination of:
 * b2CircleShape, b2PolygonShape, b2EdgeShape. The simplex cache is input/output.
 * On the first call set b2SimplexCache.count to zero.
 * @param output
 * @param cache
 * @param input
 */
declare function Distance(
  output: DistanceOutput,
  cache: SimplexCache,
  input: DistanceInput,
): void;

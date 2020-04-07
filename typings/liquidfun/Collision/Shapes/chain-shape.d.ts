/**
 * A chain shape is a free form sequence of line segments.
 * The chain has two-sided collision, so you can use inside and outside collision.
 * Therefore, you may use any winding order.
 * Since there may be many vertices, they are allocated using b2Alloc.
 * Connectivity information is used to create smooth collisions.
 * WARNING: The chain will not collide properly if there are self-intersections.
 */
declare class ChainShape extends Shape {
  // type: Shape.Type.chain;
  // radius: number;

  vertices: Vec2;
  count: number;
  prevVertex: Vec2;
  nextVertex: Vec2;
  hasPrevVertex: boolean;
  hasNextVertex: boolean;

  constructor();

  /**
   * Create a loop. This automatically adjusts connectivity.
   * @param vertices
   * @param count
   */
  CreateLoop(vertices: Vec2, count: number): void;

  /**
   * Create a chain with isolated end vertices.
   * @param vertices
   * @param count
   */
  CreateChain(vertices: Vec2, count: number): void;

  /**
   * Establish connectivity to a vertex that precedes the first vertex.
   * Don't call this for loops.
   * @param prevVertex
   */
  SetPrevVertex(prevVertex: Vec2): void;

  /**
   * Establish connectivity to a vertex that follows the last vertex.
   * Don't call this for loops.
   * @param nextVertex
   */
  SetNextVertex(nextVertex: Vec2): void;

  /**
   * Implement Shape. Vertices are cloned using Alloc.
   * @param allocator
   */
  Clone(allocator: BlockAllocator): Shape;

  /**
   *  @see Shape.GetChildCount
   */
  GetChildCount(): number;

  /**
   * Get a child edge.
   * @param edge
   * @param index
   */
  GetChildEdge(edge: EdgeShape, index: number): void;

  /**
   * This always return false.
   * @see Shape.TestPoint
   * @param transform
   * @param p
   */
  TestPoint(transform: Transform, p: Vec2): boolean;

  /**
   * @see Shape.ComputeDistance
   * @param xf
   * @param p
   * @param distance
   * @param normal
   * @param childIndex
   */
  ComputedDistance(
    xf: Transform,
    p: Vec2,
    distance: number,
    normal: Vec2,
    childIndex: number,
  ): void;

  /**
   * Implement b2Shape
   * @param output
   * @param input
   * @param transform
   * @param childIndex
   */
  RayCast(
    output: RayCastOutput,
    input: RayCastInput,
    transform: Transform,
    childIndex: number,
  ): boolean;

  /**
   * @see Shape.ComputeAABB
   * @param aabb
   * @param transform
   * @param childIndex
   */
  ComputeAABB(aabb: AABB, transform: Transform, childIndex: number): void;

  /**
   * Chains have zero mass.
   * @see Shape.ComputeMass
   * @param massData
   * @param density
   */
  ComputeMass(massData: MassData, density: number): void;
}

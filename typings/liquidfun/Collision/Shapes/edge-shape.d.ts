declare class EdgeShape {
  // type: Shape.Type.edge;
  // radius: number;

  // These are the edge vertices
  vertex1: Vec2;
  vertex2: Vec2;

  // Options adjacent vertices. There are used for smooth collision;
  vertex0: Vec2;
  vertex3: Vec2;
  hasVertex0: boolean;
  hasVertex3: boolean;

  constructor();

  /**
   * // Set this as an isolated edge.
   * @param v1
   * @param v2
   */
  Set(v1: Vec2, v2: Vec2): void;

  /**
   * Implement b2Shape.
   * @param allocator
   */
  Clone(allocator: BlockAllocator): Shape;

  /**
   * @see Shape.GetChildCount
   */
  GetChildCount(): number;

  /**
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
  ComputeDistance(
    xf: Transform,
    p: Vec2,
    distance: number,
    normal: Vec2,
    childIndex: number,
  ): void;

  /**
   * Implement Shape.
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
   * @see Shape.ComputeMass
   * @param massData
   * @param density
   */
  ComputeMass(massData: MassData, density: number): void;
}

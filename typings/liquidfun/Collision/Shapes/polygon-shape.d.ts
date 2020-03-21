declare class PolygonShape extends Shape implements ClassHandle<PolygonShape> {
  /**
   * Modified class declaration for embind:
   */
  clone(): PolygonShape;
  delete(): void;
  deleteLater(): ClassHandle<PolygonShape>;
  isAliasOf(other: ClassHandle<PolygonShape>): boolean;
  isDeleted(): boolean;
  /** */

  // type: Shape.Type.polygon;
  // radius: number;
  centroid: Vec2;
  vertices: Vec2[]; // b2_maxPolygonVertices;
  normals: Vec2[]; // b2_maxPolygonVertices;
  count: number;

  constructor();

  /**
   * // Implement b2Shape.
   * @param allocator
   */
  Clone(allocator: BlockAllocator): Shape;

  /**
   * @see Shape.GetChildCount
   */
  GetChildCount(): number;

  /**
   * Create a convex hull from the given array of local points.
   * The count must be in the range [3, b2_maxPolygonVertices].
   * @warning the points may be re-ordered, even if they form a convex polygon
   * @warning collinear points are handled but not removed. Collinear points
   * may lead to poor stacking behavior.
   * @param points
   * @param count
   */
  Set(points: Vec2, count: number): void;

  /**
   * Build vertices to represent an axis-aligned box centered on the local origin.
   * @param hx hx the half-width.
   * @param hy hy the half-height.
   */
  SetAsBox(hx: number, hy: number): void;

  /**
   * Build vertices to represent an oriented box.
   * @param hx the half-width.
   * @param hy the half-height.
   * @param center the center of the box in local coordinates.
   * @param angle the rotation of the box in local coordinates.
   */
  SetAsBox(hx: number, hy: number, center: Vec2, angle: number): void;

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
   * Implement b2Shape.
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

  /**
   * Get the vertex count.
   */
  GetVertexCount(): number;

  /**
   * Get a vertex by index.
   * @param index
   */
  GetVertex(index: number): Vec2;

  /**
   * Validate convexity. This is a very time consuming operation.
   * @returns true if valid
   */
  Validate(): boolean;
}

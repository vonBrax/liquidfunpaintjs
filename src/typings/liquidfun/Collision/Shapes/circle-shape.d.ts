// A circle shape
declare class CircleShape extends Shape implements ClassHandle<CircleShape> {
  /**
   * Modified class declaration for embind:
   */
  clone(): CircleShape;
  delete(): void;
  deleteLater(): ClassHandle<CircleShape>;
  isAliasOf(other: ClassHandle<CircleShape>): boolean;
  isDeleted(): boolean;
  /** */

  // type: Shape.Type.circle;
  // radius: number;
  p: Vec2;

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
   * Implement b2Shape.
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
   * @see b2Shape.ComputeAABB
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
   * Get a vertex by index. Used by Distance.
   * @param index
   */
  GetVertex(index: number): Vec2;

  /* #if LIQUIDFUN_EXTERNAL_LANGUAGE_API */
  SetPosition(x: number, y: number): void;

  GetPositionX(): number;

  GetPositionY(): number;
}

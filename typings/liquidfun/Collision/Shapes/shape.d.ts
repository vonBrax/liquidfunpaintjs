/**
 * This holds the mass data computed for a shape.
 */
interface MassData {
  /**
   * The mass of the shape, usually in kilograms.
   */
  mass: number;

  /**
   * The position of the shape's centroid relative to the shape's origin.
   */
  center: Vec2;

  /**
   * The rotational inertia of the shape about the local origin.
   */
  I: number;
}

/**
 * A shape is used for collision detection. You can create a shape however you like.
 * Shapes used for simulation in b2World are created automatically when a b2Fixture
 * is created. Shapes may encapsulate a one or more child shapes.
 */
declare class Shape {
  type: Shape.Type;
  radius: number;

  constructor();

  /**
   * Clone the concrete shape using the provided allocator.
   * @param allocator
   */
  Clone(allocator: BlockAllocator): Shape;

  /**
   * Get the type of this shape. You can use this to down cast to the concrete shape.
   * @return the shape type.
   */
  GetType(): Shape.Type;

  /**
   * Get the number of child primitives.
   */
  GetChildCount(): number;

  /**
   * Test a point for containment in this shape. This only works for convex shapes.
   * @param xf the shape world transform.
   * @param p a point in world coordinates.
   */
  TestPoint(xf: Transform, p: Vec2): boolean;

  /**
   * Compute the distance from the current shape to the specified point. This only works for convex shapes.
   * @param xf the shape world transform.
   * @param p a point in world coordinates.
   * @param distance returns the distance from the current shape.
   * @param normal returns the direction in which the distance increases.
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
   * Cast a ray against a child shape.
   * @param output the ray-cast results.
   * @param input the ray-cast input parameters.
   * @param transform the transform to be applied to the shape.
   * @param childIndex the child shape index
   */
  RayCast(
    output: RayCastOutput,
    input: RayCastInput,
    transform: Transform,
    childIndex: number,
  ): boolean;

  /**
   * Given a transform, compute the associated axis aligned bounding box for a child shape.
   * @param aabb returns the axis aligned box.
   * @param xf the world transform of the shape.
   * @param childIndex the child shape
   */
  ComputeAABB(aabb: AABB, xf: Transform, childIndex: number): void;

  /**
   * Compute the mass properties of this shape using its dimensions and density.
   * The inertia tensor is computed about the local origin.
   * @param massData returns the mass data for this shape.
   * @param density the density in kilograms per meter squared.
   */
  ComputeMass(massData: MassData, density: number): void;
}

declare namespace Shape {
  enum Type {
    circle = 0,
    edge = 1,
    polygon = 2,
    chain = 3,
    typeCount = 4,
  }
}

/**
 * @file
 * Structures and functions used for computing contact points, distance
 * queries, and TOI queries.
 */

declare namespace ContactFeature {
  enum Type {
    vertex = 0,
    face = 1,
  }
}

/**
 * The features that intersect to form the contact point
 * This must be 4 bytes or less.
 */
declare interface ContactFeature {
  // Feature index on shapeA
  indexA: number;
  // Feature index on shapeB
  indexB: number;
  // The feature type on shapeA
  typeA: number;
  // The feature type on shapeB
  typeB: number;
}

declare interface ContactID {
  cf: ContactFeature;
  key: number;
}

/**
 * A manifold point is a contact point belonging to a contact
 * manifold. It holds details related to the geometry and dynamics
 * of the contact points.
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleB
 * -e_faceA: the local center of cirlceB or the clip point of polygonB
 * -e_faceB: the clip point of polygonA
 * This structure is stored across time steps, so we keep it small.
 * Note: the impulses are used for internal caching and may not
 * provide reliable contact forces, especially for high speed collisions.
 */
declare interface ManifoldPoint {
  localPoint: Vec2;
  normalImpulse: number;
  tangentImpulse: number;
  id: ContactID;
}

declare namespace Manifold {
  enum Type {
    circles,
    faceA,
    faceB,
  }
}

/**
 * A manifold for two touching convex shapes.
 * Box2D supports multiple types of contact:
 * - clip point versus plane with radius
 * - point versus point with radius (circles)
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleA
 * -e_faceA: the center of faceA
 * -e_faceB: the center of faceB
 * Similarly the local normal usage:
 * -e_circles: not used
 * -e_faceA: the normal on polygonA
 * -e_faceB: the normal on polygonB
 * We store contacts in this way so that position correction can
 * account for movement, which is critical for continuous physics.
 * All contact scenarios must be expressed in one of these types.
 * This structure is stored across time steps, so we keep it small.
 */
interface Manifold {
  points: ManifoldPoint; // b2_maxManifoldPoints
  localNormal: Vec2;
  localPoint: Vec2;
  type: Manifold.Type;
  pointCount: number;
}

declare class WorldManifold {
  normal: Vec2;
  points: Vec2[]; // b2_maxManifoldPoints
  separations: number[]; // b2_maxManifoldPoints;

  /**
   * Evaluate the manifold with supplied transforms. This assumes
   * modest motion from the original state. This does not change the
   * point count, impulses, etc. The radii must come from the shapes
   * that generated the manifold.
   * @param manifold
   * @param xfA
   * @param radiusA
   * @param xfB
   * @param radiusB
   */
  Initialize(
    manifold: Manifold,
    xfA: Transform,
    radiusA: number,
    xfB: Transform,
    radiusB: number,
  ): void;
}

// This is used for determining the state of contact points.
declare enum PointState {
  nullState,
  addState,
  persistState,
  removeState,
}

/**
 * Compute the point states given two manifolds. The states pertain to the transition from manifold1
 * to manifold2. So state1 is either persist or remove while state2 is either add or persist.
 * @param state1
 * @param state2
 * @param manifold1
 * @param manifold2
 */
declare function GetPointStates(
  state1: PointState,
  state2: PointState,
  manifold1: Manifold,
  manifold2: Manifold,
): void;

// Used for computing contact manifolds.
declare interface ClipVertex {
  v: Vec2;
  id: ContactID;
}

// Ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
declare interface RayCastInput {
  p1: Vec2;
  p2: Vec2;
  maxFraction: number;
}

// Ray-cast output data. The ray hits at p1 + fraction * (p2 - p1), where p1 and p2
// come from b2RayCastInput.
declare interface RayCastOutput {
  normal: Vec2;
  fraction: number;
}

// An axis aligned bounding box.
declare class AABB {
  // Verify that the bounds are sorted.
  isValid(): boolean;

  // Get the center of the AABB
  GetCenter(): Vec2;

  // Get the extents of the AABB (half-widths).
  GetExtents(): Vec2;

  // Get the perimeter length
  GetPerimeter(): number;

  // Combine an AABB into this one.
  Combine(aabb: AABB): void;

  // Combine two AABBs into this one.
  Combine(aabb1: AABB, aabb2: AABB): void;

  // Does this aabb contain the provided AABB.
  Contains(aabb: AABB): boolean;

  RayCast(output: RayCastOutput, input: RayCastInput): boolean;
}

declare function TestOverlap(a: AABB, b: AABB): boolean;

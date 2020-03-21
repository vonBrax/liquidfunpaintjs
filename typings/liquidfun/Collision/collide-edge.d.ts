/**
 * Compute contact points for edge versus circle.
 * This accounts for edge connectivity.
 * @param manifold
 * @param edgeA
 * @param xfA
 * @param circleB
 * @param xfB
 */
declare function CollideEdgeAndCircle(
  manifold: Manifold,
  edgeA: EdgeShape,
  xfA: Transform,
  circleB: CircleShape,
  xfB: Transform,
): void;

declare namespace EPAxis {
  enum Type {
    unknown,
    edgeA,
    edgeB,
  }
}

/**
 * This structure is used to keep track of the best separating axis.
 */
declare interface EPAxis {
  type: EPAxis.Type;
  index: number;
  separation: number;
}

/**
 * This holds polygon B expressed in frame A.
 */
declare interface TempPolygon {
  vertices: Vec2[]; // b2_maxPolygonVertices
  normals: Vec2[]; // b2_maxPolygonVertices;
  count: number;
}

/**
 * Reference face used for clipping
 */
declare interface ReferenceFace {
  i1: number;
  i2: number;
  v1: Vec2;
  v2: Vec2;
  normal: Vec2;
  sideNormal: Vec2;
  sideOffset1: number;
  sideNormal2: Vec2;
  sideOffset2: number;
}

declare namespace EPCollider {
  enum VertexType {
    isolated,
    concave,
    convex,
  }
}

/**
 * This class collides and edge and a polygon, taking into account edge adjacency.
 */
declare class EPCollider {
  polygonB: TempPolygon;
  xf: Transform;
  centroidB: Vec2;
  v0: Vec2;
  v1: Vec2;
  v2: Vec2;
  v3: Vec2;
  normal0: Vec2;
  normal1: Vec2;
  normal2: Vec2;
  normal: Vec2;
  type1: EPCollider.VertexType;
  type2: EPCollider.VertexType;
  lowerLimit: Vec2;
  upperLimit: Vec2;
  radius: number;
  front: boolean;

  /**
   *
   * @param manifold
   * @param edgeA
   * @param xfA
   * @param polygonB
   * @param xfB
   */
  Collide(
    manifold: Manifold,
    edgeA: EdgeShape,
    xfA: Transform,
    polygonB: PolygonShape,
    xfB: Transform,
  ): void;

  ComputeEdgeSeparation(): EPAxis;

  ComputePolygonSeparation(): EPAxis;

  CollideEdgeAndPolygon(
    manifold: Manifold,
    edgeA: EdgeShape,
    xfA: Transform,
    polygonB: PolygonShape,
    xfB: Transform,
  ): void;
}

/**
 * Find the max separation between poly1 and poly2 using edge normals from poly1.
 * @param edgeIndex
 * @param poly1
 * @param xf1
 * @param poly2
 * @param xf2
 */
declare function FindMaxSeparation(
  edgeIndex: number,
  poly1: PolygonShape,
  xf1: Transform,
  poly2: PolygonShape,
  xf2: Transform,
): number;

/**
 *
 * @param c
 * @param poly1
 * @param xf1
 * @param edge1
 * @param poly2
 * @param xf2
 */
declare function FindIncidentEdge(
  c: ClipVertex,
  poly1: PolygonShape,
  xf1: Transform,
  edge1: number,
  poly2: PolygonShape,
  xf2: Transform,
): void;

/**
 * The normal points from 1 to 2
 * @param manifold
 * @param polyA
 * @param xfA
 * @param polyB
 * @param xfB
 */
declare function collidePolygons(
  manifold: Manifold,
  polyA: PolygonShape,
  xfA: Transform,
  polyB: PolygonShape,
  xfB: Transform,
): void;

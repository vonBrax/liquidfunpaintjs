declare function CollideCircles(
  manifold: Manifold,
  circleA: CircleShape,
  xfA: Transform,
  circleB: CircleShape,
  xfB: Transform,
): void;

declare function CollidePolygonAndCircle(
  manifold: Manifold,
  polygonA: PolygonShape,
  xfA: Transform,
  circleB: CircleShape,
  xfB: Transform,
): void;

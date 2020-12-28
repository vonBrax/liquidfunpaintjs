// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNumber(x: any): boolean {
  if (x === 0) return true;
  return typeof x === 'number';
}

/**
 * A simple 2d vector class with extended functionality.
 * API heavily borrowed from math.geom2d.Vector2D which is not available on
 * Android.
 */
export class Vector2f /* extends android.graphics.PointF */ {
  x: number;
  y: number;

  // constructor(v: Vector2f);
  constructor(x: number | Vector2f, y?: number) {
    if (isNumber(x) && isNumber(y)) {
      this.x = x as number;
      this.y = y;
    } else if (x && x instanceof Vector2f) {
      this.x = x.x;
      this.y = x.y;
    } else {
      throw new Error('Invalid constructor arguments');
    }
  }

  public set(x: number | Vector2f, y?: number): void {
    if (isNumber(x) && isNumber(y)) {
      this.x = x as number;
      this.y = y;
    } else if (x && x instanceof Vector2f) {
      this.x = x.x;
      this.y = x.y;
    } else {
      throw new Error('Invalid set arguments');
    }
  }

  /**
   * Returns the sum of current vector with vector given as parameter.
   * Inner fields are not modified.
   */
  public add(inVec: Vector2f): Vector2f {
    return new Vector2f(this.x + inVec.x, this.y + inVec.y);
  }

  /**
   * Returns the subtraction of current vector with vector given as parameter.
   * Inner fields are not modified.
   */
  public sub(inVec: Vector2f): Vector2f {
    return new Vector2f(this.x - inVec.x, this.y - inVec.y);
  }

  /**
   * Multiplies the vector by a scalar amount. Inner fields are not modified.
   */
  public mul(s: number): Vector2f {
    return new Vector2f(this.x * s, this.y * s);
  }

  /**
   * Returns the euclidian distance from (0,0) to (x,y)
   * @param x
   * @param y
   */
  public length(x?: number, y?: number): number {
    x = x || x === 0 ? x : this.x;
    y = y || y === 0 ? y : this.y;
    return Math.sqrt(Math.pow(x - 0, 2) + Math.pow(y - 0, 2));
  }

  /**
   * Returns distance between 2 vectors.
   */
  public static length2(a: Vector2f, b: Vector2f): number {
    const dist: Vector2f = a.sub(b);
    return dist.length();
  }

  /**
   * Interpolate between start and end, in fixed increments defined by the
   * number of segments (segmentCount) and which segment we want (segmentLoc).
   */
  public static lerpFixedInterval(
    start: Vector2f,
    end: Vector2f,
    segmentLoc: number,
    segmentCount: number,
  ): Vector2f {
    // v0 = start * (segmentLoc + 1)
    const v0: Vector2f = start.mul(segmentLoc + 1);
    // v1 = end * (segmentCount - segmentLoc);
    const v1: Vector2f = end.mul(segmentCount - segmentLoc);
    // (v0 + v1) / (segmentCount + 1)
    return v0.add(v1).mul(1 / (segmentCount + 1));
  }
}

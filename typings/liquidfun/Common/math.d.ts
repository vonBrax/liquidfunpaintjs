/**
 * This function is used to ensure that a floating point number is not a NaN or infinity.
 * @param x
 */
declare function IsValid(x: number): boolean;

/**
 * This is a approximate yet fast inverse square-root.
 * @param x
 */
declare function InvSqrt(x: number): number;

/**
 * A 2D column vector.
 */
declare class Vec2 implements ClassHandle<Vec2> {
  /**
   * Modified class declaration for embind:
   */
  clone(): Vec2;
  delete(): void;
  deleteLater(): ClassHandle<Vec2>;
  isAliasOf(other: ClassHandle<Vec2>): boolean;
  isDeleted(): boolean;
  /** */

  x: number;
  y: number;

  constructor();

  constructor(x: number, y: number);

  /**
   * Set this vector to all zeros.
   */
  SetZero(): void;

  /**
   * Set this vector to some specified coordinates.
   * @param x
   * @param y
   */
  Set(x: number, y: number): void;

  /**
   * Get the length of this vector (the norm).
   */
  Length(): number;

  /**
   * Get the length squared. For performance, use this instead of
   * b2Vec2,Length (if possible).
   */
  LengthSquared(): number;

  /**
   * Convert this vector into a unit vector. Returns the length.
   */
  Normalize(): number;

  /**
   * Does this vector contain finite coordinates?
   */
  IsValid(): boolean;

  /**
   * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
   */
  Skew(): Vec2;
}

/**
 * A 3D column vector with 3 elements.
 */
declare class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor();

  constructor(x: number, y: number, z: number);

  /**
   * Set this vector to all zeros.
   */
  SetZero(): void;

  /**
   * Set this vector to some specified coordinates.
   * @param x
   * @param y
   * @param z
   */
  Set(x: number, y: number, z: number): void;

  /**
   * Get the length of this vector (the norm).
   */
  Length(): number;

  /**
   * Convert this vector into a unit vector. Returns the length.
   */
  Normalize(): number;
}

/**
 * A 4D column vector with 4 elements.
 */
declare class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor();

  constructor(x: number, y: number, z: number, w: number);
}

/**
 * A 2-by-2 matrix. Stored in column-major order.
 */
declare class Mat22 {
  ex: Vec2;
  ey: Vec2;

  constructor();
  constructor(c1: Vec2, c2: Vec2);
  constructor(a11: number, a12: number, a21: number, a22: number);

  /**
   * Initialize this matrix using columns.
   * @param c1
   * @param c2
   */
  Set(c1: Vec2, c2: Vec2): void;

  /**
   * Set this to the identity matrix.
   */
  SetIdentity(): void;

  /**
   * Set this matrix to all zeros.
   */
  SetZero(): void;

  GetInverse(): Mat22;

  /**
   * Solve A * x = b, where b is a column vector. This is more efficient
   * than computing the inverse in one-shot cases.
   * @param b
   */
  Solve(b: Vec2): Vec2;
}

/**
 * A 3-by-3 matrix. Stored in column-major order.
 */
declare class Mat33 {
  ex: Vec3;
  ey: Vec3;
  ez: Vec3;

  constructor();
  constructor(c1: Vec3, c2: Vec3, c3: Vec3);

  /**
   * Set this matrix to all zeros.
   */
  SetZero(): void;

  /**
   * Solve A * x = b, where b is a column vector. This is more efficient
   * than computing the inverse in one-shot cases.
   * @param b
   */
  Solve33(b: Vec3): Vec3;

  /**
   * Solve A * x = b, where b is a column vector. This is more efficient
   * than computing the inverse in one-shot cases. Solve only the upper
   * 2-by-2 matrix equation.
   * @param b
   */
  Solve22(b: Vec2): Vec2;

  /**
   * Get the inverse of this matrix as a 2-by-2.
   * Returns the zero matrix if singular.
   * @param M
   */
  GetInverse22(M: Mat33): void;

  /**
   * Get the symmetric inverse of this matrix as a 3-by-3.
   * Returns the zero matrix if singular.
   * @param M
   */
  GetSymInverse33(M: Mat33): void;
}

/**
 * Rotation
 */
declare class Rot {
  // Sine
  s: number;

  // Cosine
  c: number;

  constructor();
  constructor(angle: number);

  /**
   * Set using an angle in radians.
   * @param angle
   */
  Set(angle: number): void;

  /**
   * Set to the identity rotation
   */
  SetIdentity(): void;

  /**
   * Get the angle in radians
   */
  GetAngle(): number;

  /**
   * Get the x-axis
   */
  GetXAxis(): Vec2;

  /**
   * Get the u-axis
   */
  GetYAxis(): Vec2;
}

/**
 * A transform contains translation and rotation. It is used to represent
 * the position and orientation of rigid frames.
 */
declare class Transform {
  p: Vec2;
  q: Rot;

  constructor();
  constructor(position: Vec2, rotation: Rot);

  /**
   * Set this to the identity transform.
   */
  SetIdentity(): void;

  /**
   * Set this based on the position and angle.
   * @param position
   * @param angle
   */
  Set(position: Vec2, angle: number): void;

  // LIQUIDFUN_EXTERNAL_LANGUAGE_API:
  GetPositionY(): number;
  GetRotationSin(): number;
  GetRotationCos(): number;
}

/**
 * This describes the motion of a body/shape for TOI computation.
 * Shapes are defined with respect to the body origin, which may
 * no coincide with the center of mass. However, to support dynamics
 * we must interpolate the center of mass position.
 */
declare interface Sweep {
  // local center of mass position
  localCenter: Vec2;

  // center world positions
  c0: Vec2;
  c: Vec2;

  // world angles
  a0: number;
  a: number;

  // Fraction of the current time step in the range [0,1]
  // c0 and a0 are the positions at alpha0.
  alpha0: number;

  /**
   * Get the interpolated transform at a specific time.
   * @param xfb
   * @param beta is a factor in [0,1], where 0 indicates alpha0.
   */
  GetTransform(xfb: Transform, beta: number): void;

  /**
   * Advance the sweep forward, yielding a new initial state.
   * @param alpha the new initial time.
   */
  Advance(alpha: number): void;

  /**
   * Normalize the angles.
   */
  Normalize(): void;
}

/**
 * @todo
 * See if we are going to need the rest of the inline
 * function on the file (eg, b2Dot, b2Cross, b2Mul, etc)
 */

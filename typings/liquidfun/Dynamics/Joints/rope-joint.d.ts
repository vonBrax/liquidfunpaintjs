/**
 * Rope joint definition. This requires two body anchor points and
 * a maximum lengths.
 * Note: by default the connected objects will not collide.
 * see collideConnected in b2JointDef.
 */
declare class RopeJointDef extends JointDef {
  constructor();

  // The local anchor point relative to bodyA's origin.
  localAnchorA: Vec2;

  // The local anchor point relative to bodyB's origin.
  localAnchorB: Vec2;

  // The maximum length of the rope.
  // Warning: this must be larger than b2_linearSlop or
  // the joint will have no effect.
  maxLength: number;
}

/**
 * A rope joint enforces a maximum distance between two points
 * on two bodies. It has no other effect.
 * @warning if you attempt to change the maximum length during
 * the simulation you will get some non-physical behavior.
 * A model that would allow you to dynamically modify the length
 * would have some sponginess, so I chose not to implement it
 * that way. See b2DistanceJoint if you want to dynamically
 * control length.
 */
declare class RopeJoint extends Joint {
  // Solver shared
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected maxLength: number;
  protected length: number;
  protected impulse: number;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected u: Vec2;
  protected rA: Vec2;
  protected rB: Vec2;
  protected localCenterA: Vec2;
  protected localCenterB: Vec2;
  protected invMassA: number;
  protected invMassB: number;
  protected invIA: number;
  protected invIB: number;
  protected mass: number;
  protected state: LimitState;

  constructor(data: RopeJointDef);

  GetAnchorA(): Vec2;
  GetAnchorB(): Vec2;

  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionForce(inv_dt: number): Vec2;
  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionTorque(inv_dt: number): number;

  /**
   * The local anchor point relative to bodyA's origin.
   */
  GetLocalAnchorA(): Vec2;

  /**
   * The local anchor point relative to bodyB's origin.
   */
  GetLocalAnchorB(): Vec2;

  /**
   * Set/Get the maximum length of the rope.
   * @param length
   */
  SetMaxLength(length: number): void;
  GetMaxLength(): number;

  GetLimitState(): LimitState;

  /**
   * Dump joint to dmLog
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

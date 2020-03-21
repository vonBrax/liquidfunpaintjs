declare const minPulleyLength: number;

/**
 * Pulley joint definition. This requires two ground anchors,
 * two dynamic body anchor points, and a pulley ratio.
 */
declare class PulleyJointDef extends JointDef {
  // The first ground anchor in world coordinates. This point never moves.
  groundAnchorA: Vec2;

  // The second ground anchor in world coordinates. This point never moves.
  groundAnchorB: Vec2;

  // The local anchor point relative to bodyA's origin.
  localAnchorA: Vec2;

  // The local anchor point relative to bodyB's origin.
  localAnchorB: Vec2;

  // The a reference length for the segment attached to bodyA.
  lengthA: number;

  // The a reference length for the segment attached to bodyB.
  lengthB: number;

  // The pulley ratio, used to simulate a block-and-tackle.
  ratio: number;

  constructor();

  /**
   * Initialize the bodies, anchors, lengths, max lengths, and ratio using the world anchors.
   * @param bodyA
   * @param bodyB
   * @param groundAnchorA
   * @param groundAnchorB
   * @param anchorA
   * @param anchorB
   * @param ratio
   */
  Initialize(
    bodyA: Body,
    bodyB: Body,
    groundAnchorA: Vec2,
    groundAnchorB: Vec2,
    anchorA: Vec2,
    anchorB: Vec2,
    ratio: number,
  ): void;
}

/**
 * The pulley joint is connected to two bodies and two fixed ground points.
 * The pulley supports a ratio such that:
 * length1 + ratio * length2 <= constant
 * Yes, the force transmitted is scaled by the ratio.
 * @warning the pulley joint can get a bit squirrelly by itself. They often
 * work better when combined with prismatic joints. You should also cover the
 * the anchor points with static shapes to prevent one side from going to
 * zero length.
 */
declare class PulleyJoint extends Joint {
  protected groundAnchorA: Vec2;
  protected groundAnchorB: Vec2;
  protected lengthA: number;
  protected lengthB: number;

  // Solver shared
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected constant: number;
  protected ratio: number;
  protected impulse: number;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected uA: Vec2;
  protected uB: Vec2;
  protected rA: Vec2;
  protected rB: Vec2;
  protected localCenterA: Vec2;
  protected localCenterB: Vec2;
  protected invMassA: number;
  protected invMassB: number;
  protected invIA: number;
  protected invIB: number;
  protected mass: number;

  protected constructor(data: PulleyJointDef);

  GetAnchorA(): Vec2;
  GetAnchorB(): Vec2;

  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionForce(inv_dt: number): Vec2;
  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionTorque(inv_dt: number): number;

  /**
   * Get the first ground anchor.
   */
  GetGroundAnchorA(): Vec2;

  /**
   * Get the second ground anchor.
   */
  GetGroundAnchorB(): Vec2;

  /**
   * Get the current length of the segment attached to bodyA.
   */
  GetLengthA(): number;

  /**
   * Get the current length of the segment attached to bodyB.
   */
  GetLengthB(): number;

  /**
   * Get the pulley ratio.
   */
  GetRatio(): number;

  /**
   * Get the current length of the segment attached to bodyA.
   */
  GetCurrentLengthA(): number;

  /**
   * Get the current length of the segment attached to bodyB.
   */
  GetCurrentLengthB(): number;

  /**
   * Dump joint to dmLog
   */
  Dump(): void;

  /**
   * Implement b2Joint::ShiftOrigin
   * @param newOrigin
   */
  ShiftOrigin(newOrigin: Vec2): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

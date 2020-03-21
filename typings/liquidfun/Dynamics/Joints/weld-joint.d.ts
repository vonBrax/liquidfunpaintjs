/**
 * Weld joint definition. You need to specify local anchor points
 * where they are attached and the relative body angle. The position
 * of the anchor points is important for computing the reaction torque.
 */
declare class WeldJointDef extends JointDef {
  constructor();

  // The local anchor point relative to bodyA's origin.
  localAnchorA: Vec2;

  // The local anchor point relative to bodyB's origin.
  localAnchorB: Vec2;

  // The bodyB angle minus bodyA angle in the reference state (radians).
  referenceAngle: number;

  // The mass-spring-damper frequency in Hertz. Rotation only.
  // Disable softness with a value of 0.
  frequencyHz: number;

  // The damping ratio. 0 = no damping, 1 = critical damping.
  dampingRatio: number;

  /**
   * Initialize the bodies, anchors, and reference angle using a world
   * anchor point.
   * @param bodyA
   * @param bodyB
   * @param anchor
   */
  Initialize(bodyA: Body, bodyB: Body, anchor: Vec2): void;
}

/**
 * A weld joint essentially glues two bodies together. A weld joint may
distort somewhat because the island constraint solver is approximate.
 */
declare class WeldJoint extends Joint {
  protected frequencyHz: number;
  protected dampingRatio: number;
  protected bias: number;

  // Solver shared
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected referenceAngle: number;
  protected gamma: number;
  protected impulse: Vec3;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected rA: Vec2;
  protected rB: Vec2;
  protected localCenterA: Vec2;
  protected localCenterB: Vec2;
  protected invMassA: number;
  protected invMassB: number;
  protected invIA: number;
  protected invIB: number;
  protected mass: Mat33;

  constructor(def: WeldJointDef);

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
   * Get the reference angle.
   */
  GetReferenceAngle(): number;

  /**
   * Set/get frequency in Hz.
   * @param hz
   */
  SetFrequency(hz: number): void;
  GetFrequency(): number;

  /**
   * Set/get damping ratio.
   * @param ratio
   */
  SetDampingRatio(ratio: number): void;
  GetDampingRatio(): number;

  /**
   * Dump to b2Log
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

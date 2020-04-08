/* eslint-disable @typescript-eslint/camelcase */

/**
 * Distance joint definition. This requires defining an
 * anchor point on both bodies and the non-zero length of the
 * distance joint. The definition uses local anchor points
 * so that the initial configuration can violate the constraint
 * slightly. This helps when saving and loading a game.
 * @warning Do not use a zero or short length.
 */
declare class DistanceJointDef extends JointDef {
  // The local anchor point relative to bodyA's origin.
  localAnchorA: Vec2;
  // The local anchor point relative to bodyB's origin.
  localAnchorB: Vec2;
  // The natural length between the anchor points.
  length: number;
  // The mass-spring-damper frequency in Hertz. A value of 0
  // disables softness.
  frequencyHz: number;
  // The damping ratio. 0 = no damping, 1 = critical damping.
  dampingRation: number;

  constructor();

  /**
   * Initialize the bodies, anchors, and length using the world
   * anchors.
   * @param bodyA
   * @param bodyB
   * @param anchorA
   * @param anchorB
   */
  Initialize(bodyA: Body, bodyB: Body, anchorA: Vec2, anchorB: Vec2): void;
}

/**
 * A distance joint constrains two points on two bodies
 * to remain at a fixed distance from each other. You can view
 * this as a massless, rigid rod.
 */
declare class DistanceJoint extends Joint {
  protected constructor(data: DistanceJointDef);

  protected frequencyHz: number;
  protected dampingRatio: number;
  protected bias: number;

  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected gamma: number;
  protected impulse: number;
  protected length: number;

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

  GetAnchorA(): Vec2;
  GetAnchorB(): Vec2;

  /**
   * Get the reaction force given the inverse time step.
   * Unit is N.
   * @param inv_dt
   */
  GetReactionForce(inv_dt: number): Vec2;

  /**
   * Get the reaction torque given the inverse time step.
   * Unit is N*m. This is always zero for a distance joint.
   * @param inv_dt
   */
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
   * Set/get the natural length.
   * Manipulating the length can lead to non-physical behavior when the frequency is zero.
   * @param length
   */
  SetLength(length: number): void;
  GetLength(): number;

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
   * Dump joint to dmLog
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  SolvePositionContraints(data: SolverData): boolean;
}

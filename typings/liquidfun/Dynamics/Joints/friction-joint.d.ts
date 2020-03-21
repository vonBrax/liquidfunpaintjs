/* eslint-disable @typescript-eslint/camelcase */

/**
 * Friction joint definition.
 */
declare class FrictionJointDef extends JointDef {
  // The local anchor point relative to bodyA's origin.
  localAnchorA: Vec2;

  // The local anchor point relative to bodyB's origin.
  localAnchorB: Vec2;

  // The maximum friction force in N.
  maxForce: number;

  // The maximum friction torque in N-m.
  maxTorque: number;

  constructor();

  /**
   * Initialize the bodies, anchors, axis, and reference angle using the world
   * anchor and world axis.
   * @param bodyA
   * @param bodyB
   * @param anchor
   */
  Initialize(bodyA: Body, bodyB: Body, anchor: Vec2): void;
}

/**
 * Friction joint. This is used for top-down friction.
 * It provides 2D translational friction and angular friction.
 */
declare class FrictionJoint extends Joint {
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;

  // Solver shared
  protected linearImpulse: Vec2;
  protected angularImpulse: number;
  protected maxForce: number;
  protected maxTorque: number;

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
  protected linearMass: Mat22;
  protected angularMass: number;

  GetAnchorA(): Vec2;
  GetAnchorB(): Vec2;

  GetReactionForce(inv_dt: number): Vec2;
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
   * Set the maximum friction force in N.
   * @param force
   */
  SetMaxForce(force: number): void;

  /**
   * Get the maximum friction force in N.
   */
  GetMaxForce(): number;

  /**
   * Set the maximum friction torque in N*m.
   * @param torque
   */
  SetMaxTorque(torque: number): void;

  /**
   * Get the maximum friction torque in N*m.
   */
  GetMaxTorque(): number;

  /**
   * Dump joint to dmLog
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

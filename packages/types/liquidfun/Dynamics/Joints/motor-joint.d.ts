/* eslint-disable @typescript-eslint/camelcase */

declare class MotorJointDef extends JointDef {
  // Position of bodyB minus the position of bodyA, in bodyA's frame, in meters.
  linearOffset: Vec2;

  // The bodyB angle minus bodyA angle in radians.
  angularOffset: number;

  // The maximum motor force in N.
  maxForce: number;

  // The maximum motor torque in N-m.
  maxTorque: number;

  // Position correction factor in the range [0,1].
  correctionFactor: number;

  constructor();

  /**
   * Initialize the bodies and offsets using the current transforms.
   * @param bodyA
   * @param bodyB
   */
  Initialize(bodyA: Body, bodyB: Body): void;
}

/**
 * A motor joint is used to control the relative motion
 * between two bodies. A typical usage is to control the movement
 * of a dynamic body with respect to the ground.
 */
declare class MotorJoint extends Joint {
  // Solver shared
  protected linearOffset: Vec2;
  protected angularOffset: number;
  protected linearImpulse: Vec2;
  protected angularImpulse: number;
  protected maxForce: number;
  protected maxTorque: number;
  protected correctionFactor: number;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected rA: Vec2;
  protected rB: Vec2;
  protected localCenterA: Vec2;
  protected localCenterB: Vec2;
  protected linearError: Vec2;
  protected angularError: number;
  protected invMassA: number;
  protected invMassB: number;
  protected invIA: number;
  protected invIB: number;
  protected linearMass: Mat22;
  protected angularMass: number;

  protected constructor(def: MotorJointDef);

  GetAnchorA(): Vec2;
  GetAnchorB(): Vec2;

  GetReactionForce(inv_dt: number): Vec2;
  GetReactionTorque(inv_dt: number): number;

  /**
   *  Set/get the target linear offset, in frame A, in meters.
   * @param linearOffset
   */
  SetLinearOffset(linearOffset: Vec2): void;
  GetLinearOffset(): Vec2;

  /**
   * Set/get the target angular offset, in radians.
   * @param angularOffset
   */
  SetAngularOffset(angularOffset: number): void;
  GetAngularOffset(): number;

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
   * Set the maximum friction torque in N*m
   * @param torque
   */
  SetMaxTorque(torque: number): void;

  /**
   * Get the maximum friction torque in N*m.
   */
  GetMaxTorque(): number;

  /**
   * Set the position correction factor in the range [0,1].
   * @param factor
   */
  SetCorrectionFactor(factor: number): void;

  /**
   * Get the position correction factor in the range [0,1].
   */
  GetCorrectionFactor(): number;

  /**
   * Dump to b2Log
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

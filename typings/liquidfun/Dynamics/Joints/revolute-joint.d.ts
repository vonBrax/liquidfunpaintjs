/**
 * Revolute joint definition. This requires defining an
 * anchor point where the bodies are joined. The definition
 * uses local anchor points so that the initial configuration
 * can violate the constraint slightly. You also need to
 * specify the initial relative angle for joint limits. This
 * helps when saving and loading a game.
 * The local anchor points are measured from the body's origin
 * rather than the center of mass because:
 *  1. you might not know where the center of mass will be.
 *  2. if you add/remove shapes from a body and recompute the mass,
 *  the joints will be broken.
 */
declare class RevoluteJointDef extends JointDef {
  constructor();

  // The local anchor point relative to bodyA's origin.
  localAnchorA: Vec2;

  // The local anchor point relative to bodyB's origin.
  localAnchorB: Vec2;

  // The bodyB angle minus bodyA angle in the reference state (radians).
  referenceAngle: number;

  // A flag to enable joint limits.
  enableLimit: boolean;

  // The lower angle for the joint limit (radians).
  lowerAngle: number;

  // The upper angle for the joint limit (radians).
  upperAngle: number;

  // A flag to enable the joint motor.
  enableMotor: boolean;

  // The desired motor speed. Usually in radians per second.
  motorSpeed: number;

  // The maximum motor torque used to achieve the desired motor speed.
  // Usually in N-m.
  maxMotorTorque: number;

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
 * A revolute joint constrains two bodies to share a common point while they
 * are free to rotate about the point. The relative rotation about the shared
 * point is the joint angle. You can limit the relative rotation with
 * a joint limit that specifies a lower and upper angle. You can use a motor
 * to drive the relative rotation about the shared point. A maximum motor torque
 * is provided so that infinite forces are not generated.
 */
declare class RevoluteJoint extends Joint {
  // Solver shared
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected impulse: Vec3;
  protected motorImpulse: number;

  protected enableMotor: boolean;
  protected maxMotorTorque: number;
  protected motorSpeed: number;

  protected enableLimit: boolean;
  protected referenceAngle: number;
  protected lowerAngle: number;
  protected upperAngle: number;

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
  protected mass: Mat33; // effective mass for point-to-point constraint.
  protected motorMass: number; // effective mass for motor/limit angular constraint.
  protected limitState: LimitState;

  protected constructor(def: RevoluteJointDef);

  GetAnchorA(): Vec2;
  GetAnchorB(): Vec2;

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
   * Get the current joint angle in radians.
   */
  GetJointAngle(): number;

  /**
   * Get the current joint angle speed in radians per second.
   */
  GetJointSpeed(): number;

  /**
   * Is the joint limit enabled?
   */
  IsLimitEnabled(): boolean;

  /**
   * Enable/disable the joint limit.
   * @param flag
   */
  EnableLimit(flag: boolean): void;

  /**
   * Get the lower joint limit in radians.
   */
  GetLowerLimit(): number;

  /**
   * Get the upper joint limit in radians.
   */
  GetUpperLimit(): number;

  /**
   * Set the joint limits in radians.
   * @param lower
   * @param upper
   */
  SetLimits(lower: number, upper: number): void;

  /**
   * Is the joint motor enabled?
   */
  IsMotorEnabled(): boolean;

  /**
   * Enable/disable the joint motor.
   * @param flag
   */
  EnableMotor(flag: boolean): void;

  /**
   * Set the motor speed in radians per second.
   * @param speed
   */
  SetMotorSpeed(speed: number): void;

  /**
   * Get the motor speed in radians per second.
   */
  GetMotorSpeed(): number;

  /**
   * Set the maximum motor torque, usually in N-m.
   * @param torque
   */
  SetMaxMotorTorque(torque: number): void;
  GetMaxMotorTorque(): number;

  /**
   * Get the reaction force given the inverse time step.
   * Unit is N.
   * @param inv_dt
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionForce(inv_dt: number): Vec2;

  /**
   * Get the reaction torque due to the joint limit given the inverse time step.
   * Unit is N*m.
   * @param inv_dt
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionTorque(inv_dt: number): number;

  /**
   * Get the current motor torque given the inverse time step.
   * Unit is N*m.
   * @param inv_dt
   */

  // eslint-disable-next-line @typescript-eslint/camelcase
  GetMotorTorque(inv_dt: number): number;

  /**
   * Dump to b2Log.
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

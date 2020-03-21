/* eslint-disable @typescript-eslint/camelcase */
/**
 * Wheel joint definition. This requires defining a line of
 * motion using an axis and an anchor point. The definition uses local
 * anchor points and a local axis so that the initial configuration
 * can violate the constraint slightly. The joint translation is zero
 * when the local anchor points coincide in world space. Using local
 * anchors and a local axis helps when saving and loading a game.
 */
declare class WheelJointDef extends JointDef {
  constructor();

  /**
   * Initialize the bodies, anchors, axis, and reference angle using the world
   * anchor and world axis.
   * @param bodyA
   * @param bodyB
   * @param anchor
   * @param axis
   */
  Initialize(bodyA: Body, bodyB: Body, anchor: Vec2, axis: Vec2): void;

  /**
   * The local anchor point relative to bodyA's origin.
   */
  localAnchorA: Vec2;

  /**
   * The local anchor point relative to bodyB's origin.
   */
  localAnchorB: Vec2;

  /**
   * The local translation axis in bodyA.
   */
  localAxisA: Vec2;

  /**
   * Enable/disable the joint motor.
   */
  enableMotor: boolean;

  /**
   * The maximum motor torque, usually in N-m.
   */
  maxMotorTorque: number;

  /**
   * The desired motor speed in radians per second.
   */
  motorSpeed: number;

  /**
   * Suspension frequency, zero indicates no suspension
   */
  frequencyHz: number;

  /**
   * Suspension damping ratio, one indicates critical damping
   */
  dampingRatio: number;
}

/**
 * A wheel joint. This joint provides two degrees of freedom: translation
 * along an axis fixed in bodyA and rotation in the plane. You can use a
 * joint limit to restrict the range of motion and a joint motor to drive
 * the rotation or to model rotational friction.
 * This joint is designed for vehicle suspensions.
 */
declare class WheelJoint extends Joint {
  protected frequencyHz: number;
  protected dampingRatio: number;

  // Solver shared
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected localXAxisA: Vec2;
  protected localYAxisA: Vec2;

  protected impulse: number;
  protected motorImpulse: number;
  protected springImpulse: number;

  protected maxMotorTorque: number;
  protected motorSpeed: number;
  protected enableMotor: boolean;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected localCenterA: Vec2;
  protected localCenterB: Vec2;
  protected invMassA: number;
  protected invMassB: number;
  protected invIA: number;
  protected invIB: number;

  protected ax: Vec2;
  protected m_ay: Vec2;
  protected sAx: number;
  protected sBx: number;
  protected sAy: number;
  protected sBy: number;

  protected mass: number;
  protected motorMass: number;
  protected springMass: number;

  protected bias: number;
  protected gamma: number;

  protected constructor(def: WheelJointDef);

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
   * The local joint axis relative to bodyA.
   */
  GetLocalAxisA(): Vec2;

  /**
   * Get the current joint translation, usually in meters.
   */
  GetJointTranslation(): number;

  /**
   * Get the current joint translation speed, usually in meters per second.
   */
  GetJointSpeed(): number;

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
   * Set the motor speed, usually in radians per second.
   * @param speed
   */
  SetMotorSpeed(speed: number): void;

  /**
   * Get the motor speed, usually in radians per second.
   */
  GetMotorSpeed(): number;

  /**
   * Set/Get the maximum motor force, usually in N-m.
   * @param torque
   */
  SetMaxMotorTorque(torque: number): void;
  GetMaxMotorTorque(): number;

  /**
   * Get the current motor torque given the inverse time step, usually in N-m.
   * @param inv_dt
   */
  GetMotorTorque(inv_dt: number): number;

  /**
   * Set/Get the spring frequency in hertz. Setting the frequency to zero disables the spring.
   * @param hz
   */
  SetSpringFrequencyHz(hz: number): void;
  GetSpringFrequencyHz(): number;

  /**
   * Set/Get the spring damping ratio
   * @param ratio
   */
  SetSpringDampingRatio(ratio: number): void;
  GetSpringDampingRatio(): number;

  /// Dump to b2Log
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

/**
 * Prismatic joint definition. This requires defining a line of
 * motion using an axis and an anchor point. The definition uses local
 * anchor points and a local axis so that the initial configuration
 * can violate the constraint slightly. The joint translation is zero
 * when the local anchor points coincide in world space. Using local
 * anchors and a local axis helps when saving and loading a game.
 */
declare class PrismaticJointDef extends JointDef {
  // The local anchor point relative to bodyA's origin.
  localAnchorA: Vec2;

  // The local anchor point relative to bodyB's origin.
  localAnchorB: Vec2;

  // The local translation unit axis in bodyA.
  localAxisA: Vec2;

  // The constrained angle between the bodies: bodyB_angle - bodyA_angle.
  referenceAngle: number;

  // Enable/disable the joint limit.
  enableLimit: boolean;

  // The lower translation limit, usually in meters.
  lowerTranslation: number;

  // The upper translation limit, usually in meters.
  upperTranslation: number;

  // Enable/disable the joint motor.
  enableMotor: boolean;

  // The maximum motor torque, usually in N-m.
  maxMotorForce: number;

  // The desired motor speed in radians per second.
  motorSpeed: number;

  constructor();

  /**
   * Initialize the bodies, anchors, axis, and reference angle using the world
   * anchor and unit world axis.
   * @param bodyA
   * @param bodyB
   * @param anchor
   * @param axis
   */
  Initialize(bodyA: Body, bodyB: Body, anchor: Vec2, axis: Vec2): void;
}

/**
 * A prismatic joint. This joint provides one degree of freedom: translation
 * along an axis fixed in bodyA. Relative rotation is prevented. You can
 * use a joint limit to restrict the range of motion and a joint motor to
 * drive the motion or to model joint friction.
 */
declare class PrismaticJoint extends Joint {
  // Solver shared
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected localXAxisA: Vec2;
  protected localYAxisA: Vec2;
  protected referenceAngle: number;
  protected impulse: Vec2;
  protected motorImpulse: number;
  protected lowerTranslation: number;
  protected upperTranslation: number;
  protected maxMotorForce: number;
  protected motorSpeed: number;
  protected enableLimit: boolean;
  protected enableMotor: boolean;
  protected limitState: LimitState;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected localCenterA: Vec2;
  protected localCenterB: Vec2;
  protected invMassA: number;
  protected invMassB: number;
  protected invIA: number;
  protected invIB: number;
  protected axis: Vec2;
  protected perp: Vec2;
  protected s1: number;
  protected s2: number;
  protected a1: number;
  protected a2: number;
  protected K: Mat33;
  protected motorMass: number;

  protected constructor(def: PrismaticJointDef);

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
   * The local joint axis relative to bodyA.
   */
  GetLocalAxisA(): Vec2;

  /**
   * Get the reference angle.
   */
  GetReferenceAngle(): number;

  /**
   * Get the current joint translation, usually in meters.
   */
  GetJointTranslation(): number;

  /**
   * Get the current joint translation speed, usually in meters per second.
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
   * Get the lower joint limit, usually in meters.
   */
  GetLowerLimit(): number;

  /**
   * Get the upper joint limit, usually in meters.
   */
  GetUpperLimit(): number;

  /**
   * Set the joint limits, usually in meters.
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
   * Set the motor speed, usually in meters per second.
   * @param speed
   */
  SetMotorSpeed(speed: number): void;

  /**
   * Get the motor speed, usually in meters per second.
   */
  GetMotorSpeed(): number;

  /**
   * Set the maximum motor force, usually in N.
   * @param force
   */
  SetMaxMotorForce(force: number): void;
  GetMaxMotorForce(): number;

  /**
   * Get the current motor force given the inverse time step, usually in N.
   * @param inv_dt
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  GetMotorForce(inv_dt: number): number;

  /**
   * Dump to b2Log
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

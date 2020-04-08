/**
 * Mouse joint definition. This requires a world target point,
 * tuning parameters, and the time step.
 */
declare class MouseJointDef extends JointDef {
  constructor();

  // The initial world target point. This is assumed
  // to coincide with the body anchor initially.
  target: Vec2;

  // The maximum constraint force that can be exerted
  // to move the candidate body. Usually you will express
  // as some multiple of the weight (multiplier * mass * gravity).
  maxForce: number;

  // The response speed.
  frequencyHz: number;

  // The damping ratio. 0 = no damping, 1 = critical damping.
  dampingRatio: number;
}

/**
 * A mouse joint is used to make a point on a body track a
 * specified world point. This a soft constraint with a maximum
 * force. This allows the constraint to stretch and without
 * applying huge forces.
 * NOTE: this joint is not documented in the manual because it was
 * developed to be used in the testbed. If you want to learn how to
 * use the mouse joint, look at the testbed.
 */
declare class MouseJoint extends Joint {
  protected localAnchorB: Vec2;
  protected targetA: Vec2;
  protected frequencyHz: number;
  protected dampingRatio: number;
  protected beta: number;

  // Solver shared
  protected impulse: Vec2;
  protected maxForce: number;
  protected gamma: number;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected rB: Vec2;
  protected localCenterB: Vec2;
  protected invMassB: number;
  protected invIB: number;
  protected mass: Mat22;
  protected C: Vec2;
  protected constructor(def: MouseJointDef);

  /**
   * Implements b2Joint.
   */
  GetAnchorA(): Vec2;

  /**
   * Implements b2Joint.
   */
  GetAnchorB(): Vec2;

  /**
   * Implements b2Joint.
   * @param inv_dt
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionForce(inv_dt: number): Vec2;

  /**
   * Implements b2Joint.
   * @param inv_dt
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  GetReactionTorque(inv_dt: number): number;

  /**
   * Use this to update the target point.
   * @param target
   */
  SetTarget(target: Vec2): void;
  GetTarget(): void;

  /**
   * Set/get the maximum force in Newtons.
   * @param force
   */
  SetMaxForce(force: number): void;
  GetMaxForce(): number;

  /**
   * Set/get the frequency in Hertz.
   * @param hz
   */
  SetFrequency(hz: number): void;
  GetFrequency(): number;

  /**
   * Set/get the damping ratio (dimensionless).
   * @param ratio
   */
  SetDampingRatio(ratio: number): void;
  GetDampingRatio(): number;

  /**
   * The mouse joint does not support dumping.
   */
  Dump(): void;

  /**
   * Implement Joint.ShiftOrigin
   * @param newOrigin
   */
  ShiftOrigin(newOrigin: Vec2): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

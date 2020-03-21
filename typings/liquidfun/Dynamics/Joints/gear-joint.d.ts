/* eslint-disable @typescript-eslint/camelcase */

/**
 * Gear joint definition. This definition requires two existing
 * revolute or prismatic joints (any combination will work).
 */
declare class GearJointDef extends JointDef {
  // The first revolute/prismatic joint attached to the gear joint.
  joint1: Joint;

  // The second revolute/prismatic joint attached to the gear joint.
  joint2: Joint;

  /**
   * The gear ratio.
   * @see b2GearJoint for explanation.
   */
  ratio: number;

  constructor();
}

/**
 * A gear joint is used to connect two joints together. Either joint
 * can be a revolute or prismatic joint. You specify a gear ratio
 * to bind the motions together:
 * coordinate1 + ratio * coordinate2 = constant
 * The ratio can be negative or positive. If one joint is a revolute joint
 * and the other joint is a prismatic joint, then the ratio will have units
 * of length or units of 1/length.
 * @warning You have to manually destroy the gear joint if joint1 or joint2
 * is destroyed.
 */
declare class GearJoint extends Joint {
  protected joint1: Joint;
  protected joint2: Joint;

  protected typeB: JointType;
  protected typeA: JointType;

  // Body A is connected to body C
  // Body B is connected to body D
  protected _bodyC: Body;
  protected _bodyD: Body;

  // Solver shared
  protected localAnchorA: Vec2;
  protected localAnchorB: Vec2;
  protected localAnchorC: Vec2;
  protected localAnchorD: Vec2;

  protected localAxisC: Vec2;
  protected localAxisD: Vec2;

  protected referenceAngleA: number;
  protected referenceAngleB: number;

  protected constant: number;
  protected ratio: number;

  protected impulse: number;

  // Solver temp
  protected indexA: number;
  protected indexB: number;
  protected indexC: number;
  protected indexD: number;

  protected lcA: Vec2;
  protected lcB: Vec2;
  protected lcC: Vec2;
  protected lcD: Vec2;

  protected mA: number;
  protected mB: number;
  protected mC: number;
  protected mD: number;

  protected iA: number;
  protected iB: number;
  protected iC: number;
  protected iD: number;

  protected JvAC: Vec2;
  protected JvBD: Vec2;

  protected JwA: number;
  protected JwB: number;
  protected JwC: number;
  protected JwD: number;

  protected mass: number;

  protected constructor(data: GearJointDef);

  GetAnchorA(): Vec2;
  GetAnchorB(): Vec2;

  GetReactionForce(inv_dt: number): Vec2;
  GetReactionTorque(inv_dt: number): number;

  /**
   * Get the first joint.
   */
  GetJoint1(): Joint;

  /**
   * Get the second joint.
   */
  GetJoint2(): Joint;

  /**
   * Set/Get the gear ratio.
   * @param ratio
   */
  SetRatio(ratio: number): void;
  GetRatio(): number;

  /**
   * Dump joint to dmLog
   */
  Dump(): void;

  protected InitVelocityConstraints(data: SolverData): void;
  protected SolveVelocityConstraints(data: SolverData): void;
  protected SolvePositionConstraints(data: SolverData): boolean;
}

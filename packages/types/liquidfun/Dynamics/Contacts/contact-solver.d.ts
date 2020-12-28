declare namespace LiquidFun {
  export interface VelocityConstraintPoint {
    rA: Vec2;
    rb: Vec2;
    normalImpulse: number;
    tangentImpulse: number;
    normalMass: number;
    tangentMass: number;
    velocityBias: number;
  }

  export interface ContactVelocityConstraint {
    points: VelocityConstraintPoint[]; // [b2_maxManifoldPoints]
    normal: Vec2;
    normalMass: Mat22;
    K: Mat22;
    indexA: number;
    indexB: number;
    invMassA: number;
    invMassB: number;
    invIA: number;
    invIB: number;
    friction: number;
    restitution: number;
    tangentSpeed: number;
    pointCount: number;
    contactIndex: number;
  }

  export interface ContactSolverDef {
    step: TimeStep;
    contacts: Contact;
    count: number;
    positions: Position;
    velocities: Velocity;
    allocator: StackAllocator;
  }

  export interface ContactPositionConstraint {
    localPoints: Vec2[]; // [b2_maxManifoldPoints]
    localNormal: Vec2;
    localPoint: Vec2;
    indexA: number;
    indexB: number;
    invMassA: number;
    invMassB: number;
    localCenterA: Vec2;
    localCenterB: Vec2;
    invIA: number;
    invIB: number;
    type: Manifold.Type;
    radiusA: number;
    radiusB: number;
    pointCount: number;
  }

  export class ContactSolver {
    step: TimeStep;
    positions: Position;
    velocities: Velocity;
    allocator: StackAllocator;
    positionConstraints: ContactPositionConstraint;
    velocityConstraints: ContactVelocityConstraint;
    contacts: Contact;
    count: number;

    constructor(def: ContactSolverDef);

    InitializeVelocityConstrains(): void;

    WarmStart(): void;
    SolveVelocityConstraints(): void;
    StoreImpulses(): void;

    SolvePositionConstraints(): boolean;
    SolveTOIPositionConstraints(toIndexA: number, toIndexB: number): boolean;
  }
}

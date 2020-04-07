declare namespace LiquidFun {

  /**
   * This is an internal class.
   */
  export class Island {
    allocator: StackAllocator;
    listener: ContactListener;

    bodies: Body;
    contacts: Contact;
    joints: Joint;

    positions: Position;
    velocities: Velocity;

    bodyCount: number;
    jointCount: number;
    contactCount: number;

    bodyCapacity: number;
    contactCapacity: number;
    jointCapacity: number;

    constructor(
      bodyCapacity: number,
      contactCapacity: number,
      jointCapacity: number,
      allocator: StackAllocator,
      listener: ContactListener,
    );

    Clear(): void;

    Solve(
      profile: Profile,
      step: TimeStep,
      gravity: Vec2,
      allowSleep: boolean,
    ): void;

    SolveTOI(subStep: TimeStep, toiIndexA: number, toiIndexB: number): void;

    Add(body: Body): void;

    Add(contact: Contact): void;

    Add(joint: Joint): void;

    Report(constraints: ContactVelocityConstraint): void;
  }
}

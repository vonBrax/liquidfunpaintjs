/**
 * Friction mixing law. The idea is to allow either fixture to drive the restitution to zero.
 * For example, anything slides on ice.
 * @param friction1
 * @param friction2
 */
declare function MixFriction(friction1: number, friction2: number): number;

/**
 * Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
 * For example, a superball bounces on anything.
 * @param restitution1
 * @param restitution2
 */
declare function MixRestitution(
  restitution1: number,
  restitution2: number,
): number;

declare type ContactCreateFcn = (
  fixtureA: Fixture,
  indexA: number,
  fixtureB: Fixture,
  indexB: number,
  allocator: BlockAllocator,
) => Contact;

declare type ContactDestroyFcn = (
  contact: Contact,
  allocator: BlockAllocator,
) => void;

declare interface ContactRegister {
  createFcn: ContactCreateFcn;
  destroyFcn: ContactDestroyFcn;
  primary: boolean;
}

/**
 * A contact edge is used to connect bodies and contacts together
 * in a contact graph where each body is a node and each contact
 * is an edge. A contact edge belongs to a doubly linked list
 * maintained in each attached body. Each contact has two contact
 * nodes, one for each attached body.
 */
declare interface ContactEdge {
  // provides quick access to the other body attached.
  other: Body;
  // the contact
  contact: Contact;
  // the previous contact edge in the body's contact list
  prev: ContactEdge;
  // the next contact edge in the body's contact list
  next: ContactEdge;
}

declare namespace Contact {
  // Flags stored in flags
  enum Flags {
    // Used when crawling contact graph when forming islands.
    islandFlag = 0x0001,

    // Set when the shapes are touching.
    touchingFlag = 0x0002,

    // This contact can be disabled (by user)
    enabledFlag = 0x0004,

    // This contact needs filtering because a fixture filter was changed.
    filterFlag = 0x0008,

    // This bullet contact had a TOI event
    bulletHitFlag = 0x0010,

    // This contact has a valid TOI in toi
    toiFlag = 0x0020,
  }
}

/**
 * The class manages contact between two shapes. A contact exists for each overlapping
 * AABB in the broad-phase (except if filtered). Therefore a contact object may exist
 * that has no contact points.
 */
declare class Contact {
  protected static registers: ContactRegister; // [b2Shape::e_typeCount][b2Shape::e_typeCount]
  protected initialized: boolean;

  protected flags: number;

  // World pool and list pointers
  protected prev: Contact;
  protected next: Contact;

  // Nodes for connecting bodies
  protected nodeA: ContactEdge;
  protected nodeB: ContactEdge;

  protected fixtureA: Fixture;
  protected fixtureB: Fixture;

  protected indexA: number;
  protected indexB: number;

  protected manifold: Manifold;

  protected toiCount: number;
  protected toi: number;

  protected friction: number;
  protected restitution: number;

  protected tangentSpeed: number;

  protected constructor();
  protected constructor(
    fixtureA: Fixture,
    indexA: number,
    fixtureB: Fixture,
    indexB: number,
  );

  /**
   * Get the contact manifold. Do not modify the manifold unless you understand the
   * internals of Box2D
   */
  GetManifold(): Manifold;

  /**
   * Get the world manifold.
   * @param worldManiforld
   */
  GetWorldManifold(worldManiforld: WorldManifold): void;

  /**
   * Is this contact touching?
   */
  IsTouching(): boolean;

  /**
   * Enable/disable this contact. This can be used inside the pre-solve
   * contact listener. The contact is only disabled for the current
   * time step (or sub-step in continuous collisions).
   * @param flag
   */
  SetEnabled(flag: boolean): void;

  /**
   * Has this contact been disabled?
   */
  IsEnabled(): boolean;

  /**
   * Get the next contact in the world's contact list.
   */
  GetNext(): Contact;

  /**
   * Get fixture A in this contact.
   */
  GetFixtureA(): Fixture;

  /**
   * Get the child primitive index for fixture A.
   */
  GetChildIndexA(): number;

  /**
   * Get fixture B in this contact.
   */
  GetFixtureB(): FixtureDef;

  /**
   * Get the child primitive index for fixture B.
   */
  GetChildIndexB(): number;

  /**
   * Override the default friction mixture. You can call this in b2ContactListener::PreSolve.
   * This value persists until set or reset.
   * @param friction
   */
  SetFriction(friction: number): void;

  /**
   * Get the friction.
   */
  GetFriction(): number;

  /**
   * Reset the friction mixture to the default value.
   */
  ResetFriction(): void;

  /**
   * Override the default restitution mixture. You can call this in b2ContactListener::PreSolve.
   * The value persists until you set or reset.
   * @param restitution
   */
  SetRestitution(restitution: number): void;

  /**
   * Get the restitution.
   */
  GetRestitution(): number;

  /**
   * Reset the restitution to the default value.
   */
  ResetRestitution(): void;

  /**
   * Set the desired tangent speed for a conveyor belt behavior. In meters per second.
   * @param speed
   */
  SetTangentSpeed(speed: number): void;

  /**
   * Get the desired tangent speed. In meters per second.
   */
  GetTangentSpeed(): number;

  /**
   * Evaluate this contact with your own manifold and transforms.
   * @param manifold
   * @param xfA
   * @param xfB
   */
  Evaluate(manifold: Manifold, xfA: Transform, xfB: Transform): void;

  /**
   * Flag this contact for filtering. Filtering will occur the next time step.
   */
  protected FlagForFiltering(): void;

  protected static AddType(
    createFcn: ContactCreateFcn,
    destroyFcn: ContactDestroyFcn,
    typeA: Shape.Type,
    typeB: Shape.Type,
  ): void;

  protected static InitializeRegisters(): void;

  protected static Create(
    fixtureA: Fixture,
    indexA: number,
    fixtureB: Fixture,
    indexB: number,
    allocator: BlockAllocator,
  ): Contact;

  protected static Destroy(
    contact: Contact,
    typeA: Shape.Type,
    typeB: Shape.Type,
    allocator: BlockAllocator,
  ): void;
  protected static Destroy(contact: Contact, allocator: BlockAllocator): void;

  protected Update(listener: ContactListener): void;
}

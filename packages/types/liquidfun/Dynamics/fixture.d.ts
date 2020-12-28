/**
 * This holds contact filtering data.
 */
declare class Filter {
  constructor();

  // The collision category bits. Normally you would just set one bit.
  categoryBits: number;

  // The collision mask bits. This states the categories that this
  // shape would accept for collision.
  maskBits: number;

  // Collision groups allow a certain group of objects to never collide (negative)
  // or always collide (positive). Zero means no collision group. Non-zero group
  // filtering always wins against the mask bits.
  groupIndex: number;
}

/**
 * A fixture definition is used to create a fixture. This class defines an
 * abstract fixture definition. You can reuse fixture definitions safely.
 */
declare class FixtureDef {
  /// The constructor sets the default fixture definition values.
  constructor();

  // The shape, this must be set. The shape will be cloned, so you
  // can create the shape on the stack.
  shape: Shape;

  // Use this to store application specific fixture data.
  userData: void;

  // The friction coefficient, usually in the range [0,1].
  friction: number;

  // The restitution (elasticity) usually in the range [0,1].
  restitution: number;

  // The density, usually in kg/m^2.
  density: number;

  // A sensor shape collects contact information but never generates a collision
  // response.
  isSensor: boolean;

  // Contact filtering data.
  filter: Filter;
}

/**
 * This proxy is used internally to connect fixtures to the broad-phase.
 */
declare interface FixtureProxy {
  aabb: AABB;
  fixture: Fixture;
  childIndex: number;
  proxyId: number;
}

/**
 * A fixture is used to attach a shape to a body for collision detection. A fixture
 * inherits its transform from its parent. Fixtures hold additional non-geometric data
 * such as friction, collision filters, etc.
 * Fixtures are created via Body.CreateFixture.
 * @warning you cannot reuse fixtures.
 */
declare class Fixture {
  protected density: number;

  protected next: Fixture;
  protected body: Body;

  protected shape: Shape;

  protected friction: number;
  protected restitution: number;

  protected proxies: FixtureProxy;
  protected proxyCount: number;

  protected filter: Filter;

  protected isSensor: boolean;

  protected userData: void;

  protected constructor();

  /**
   * Get the type of the child shape. You can use this to down cast to the concrete shape.
   * @return the shape type.
   */
  GetType(): Shape.Type;

  /**
   * Get the child shape. You can modify the child shape, however you should not change the
   * number of vertices because this will crash some collision caching mechanisms.
   * Manipulating the shape may lead to non-physical behavior.
   */
  GetShape(): Shape;

  /**
   * Set if this fixture is a sensor.
   * @param sensor
   */
  SetSensor(sensor: boolean): void;

  /**
   * Is this fixture a sensor (non-solid)?
   * @return the true if the shape is a sensor.
   */
  IsSensor(): boolean;

  /**
   * Set the contact filtering data. This will not update contacts until the next time
   * step when either parent body is active and awake.
   * This automatically calls Refilter.
   * @param filter
   */
  SetFilterData(filter: Filter): void;

  /**
   * Get the contact filtering data.
   */
  GetFilterData(): Filter;

  /**
   * Call this if you want to establish collision that was previously disabled by b2ContactFilter::ShouldCollide.
   */
  Refilter(): void;

  /**
   * Get the parent body of this fixture. This is NULL if the fixture is not attached.
   * @return the parent body.
   */
  GetBody(): Body;

  /**
   * Get the next fixture in the parent body's fixture list.
   * @return the next shape.
   */
  GetNext(): Fixture;

  /**
   * Get the user data that was assigned in the fixture definition. Use this to
   * store your application specific data.
   */
  GetUserData(): void;

  /**
   * Set the user data. Use this to store your application specific data.
   * @param data
   */
  SetUserData(data: void): void;

  /**
   * Test a point for containment in this fixture.
   * @param p a point in world coordinates.
   */
  TestPoint(p: Vec2): boolean;

  /**
   * Compute the distance from this fixture.
   * @param p a point in world coordinates.
   * @param distance
   * @param normal
   * @param childIndex
   */
  ComputeDistance(
    p: Vec2,
    distance: number,
    normal: Vec2,
    childIndex: number,
  ): void;

  /**
   * Cast a ray against this shape.
  /// @param output the ray-cast results.
  /// @param input the ray-cast input parameters.
   * @param childIndex
   */
  RayCast(
    output: RayCastOutput,
    input: RayCastInput,
    childIndex: number,
  ): boolean;

  /**
   * Get the mass data for this fixture. The mass data is based on the density and
   * the shape. The rotational inertia is about the shape's origin. This operation
   * may be expensive.
   * @param massData
   */
  GetMassData(massData: MassData): void;

  /**
   * Set the density of this fixture. This will _not_ automatically adjust the mass
   * of the body. You must call b2Body::ResetMassData to update the body's mass.
   * @param density
   */
  SetDensity(density: number): void;

  /**
   * Get the density of this fixture.
   */
  GetDensity(): number;

  /**
   * Get the coefficient of friction.
   */
  GetFriction(): number;

  /**
   * Set the coefficient of friction. This will _not_ change the friction of
   * existing contacts.
   * @param friction
   */
  SetFriction(friction: number): void;

  /**
   * Get the coefficient of restitution.
   */
  GetRestitution(): number;

  /**
   * Set the coefficient of restitution. This will _not_ change the restitution of
   * existing contacts.
   * @param restitution
   */
  SetRestitution(restitution: number): void;

  /**
   * Get the fixture's AABB. This AABB may be enlarge and/or stale.
   * If you need a more accurate AABB, compute it using the shape and
   * the body transform.
   * @param childIndex
   */
  GetAABB(childIndex: number): AABB;

  /**
   * Dump this fixture to the log file.
   * @param bodyIndex
   */
  Dump(bodyIndex: number): void;

  /**
   * We need separation create/destroy functions from the constructor/destructor because
   * the destructor cannot access the allocator (no destructor arguments allowed by C++).
   * @param allocator
   * @param body
   * @param def
   */
  protected Create(
    allocator: BlockAllocator,
    body: Body,
    def: FixtureDef,
  ): void;
  protected Destroy(allocator: BlockAllocator): void;

  /**
   * These support body activation/deactivation.
   * @param broadPhase
   * @param xf
   */
  protected CreateProxies(broadPhase: BroadPhase, xf: Transform): void;
  protected DestroyProxies(broadPhase: BroadPhase): void;

  protected Synchronize(
    broadPhase: BroadPhase,
    xf1: Transform,
    xf2: Transform,
  ): void;
}

/**
 * The body type.
 * static: zero mass, zero velocity, may be manually moved
 * kinematic: zero mass, non-zero velocity set by user, moved by solver
 * dynamic: positive mass, non-zero velocity determined by forces, moved by solver
 */
declare enum BodyType {
  staticBody = 0,
  kinematicBody,
  dynamicBody,

  // TODO_ERIN
  //b2_bulletBody,
}

/**
 * A body definition holds all the data needed to construct a rigid body.
 * You can safely re-use body definitions. Shapes are added to a body after construction.
 */
declare class BodyDef implements ClassHandle<BodyDef> {
  /**
   * Modified class declaration for embind:
   */
  clone(): BodyDef;
  delete(): void;
  deleteLater(): ClassHandle<BodyDef>;
  isAliasOf(other: ClassHandle<BodyDef>): boolean;
  isDeleted(): boolean;
  /** */

  // This constructor sets the body definition default values.
  constructor();

  // The body type: static, kinematic, or dynamic.
  // Note: if a dynamic body would have zero mass, the mass is set to one.
  type: BodyType;

  // The world position of the body. Avoid creating bodies at the origin
  // since this can lead to many overlapping shapes.
  position: Vec2;

  // The world angle of the body in radians.
  angle: number;

  // The linear velocity of the body's origin in world co-ordinates.
  linearVelocity: Vec2;

  // The angular velocity of the body.
  angularVelocity: number;

  // Linear damping is use to reduce the linear velocity. The damping parameter
  // can be larger than 1.0f but the damping effect becomes sensitive to the
  // time step when the damping parameter is large.
  linearDamping: number;

  // Angular damping is use to reduce the angular velocity. The damping parameter
  // can be larger than 1.0f but the damping effect becomes sensitive to the
  // time step when the damping parameter is large.
  angularDamping: number;

  // Set this flag to false if this body should never fall asleep. Note that
  // this increases CPU usage.
  allowSleep: boolean;

  // Is this body initially awake or sleeping?
  awake: boolean;

  // Should this body be prevented from rotating? Useful for characters.
  fixedRotation: boolean;

  // Is this a fast moving body that should be prevented from tunneling through
  // other moving bodies? Note that all bodies are prevented from tunneling through
  // kinematic and static bodies. This setting is only considered on dynamic bodies.
  // @warning You should use this flag sparingly since it increases processing time.
  bullet: boolean;

  // Does this body start out active?
  active: boolean;

  // Use this to store application specific body data.
  userData: void;

  // Scale the gravity applied to this body.
  gravityScale: number;
}

/**
 * A rigid body. These are created via b2World::CreateBody.
 */
declare class Body implements ClassHandle<Body> {
  /**
   * Modified class declaration for embind:
   */
  clone(): Body;
  delete(): void;
  deleteLater(): ClassHandle<Body>;
  isAliasOf(other: ClassHandle<Body>): boolean;
  isDeleted(): boolean;
  /** */

  // flags enum
  private islandFlag: number;
  private awakeFlag: number;
  private autoSleepFlag: number;
  private bulletFlag: number;
  private fixedRotationFlag: number;
  private activeFlag: number;
  private toiFlag: number;

  private type: BodyType;

  private flags: number;

  private islandIndex: number;

  private xf: Transform; // the body origin transform
  private xf0: Transform; // the previous transform for particle simulation
  private sweep: Sweep; // the swept motion for CCD

  private linearVelocity: Vec2;
  private angularVelocity: number;

  private force: Vec2;
  private torque: number;

  private world: World;
  private prev: Body;
  private next: Body;

  private fixtureList: Fixture;
  private fixtureCount: number;

  private jointList: JointEdge;
  private contactList: ContactEdge;

  private mass: number;
  private invMass: number;

  // Rotational inertia about the center of mass.
  private I: number;
  private invI: number;

  private linearDamping: number;
  private angularDamping: number;
  private gravityScale: number;

  private sleepTime: number;

  private userData: void;

  private constructor(bd: BodyDef, world: World);

  /**
   * Creates a fixture and attach it to this body. Use this function if you need
   * to set some fixture parameters, like friction. Otherwise you can create the
   * fixture directly from a shape.
   * If the density is non-zero, this function automatically updates the mass of the body.
   * Contacts are not created until the next time step.
   * @param def the fixture definition.
   * @warning This function is locked during callbacks.
   */
  CreateFixture(def: FixtureDef): Fixture;

  /**
   * Creates a fixture from a shape and attach it to this body.
   * This is a convenience function. Use b2FixtureDef if you need to set parameters
   * like friction, restitution, user data, or filtering.
   * If the density is non-zero, this function automatically updates the mass of the body.
   * @param shape the shape to be cloned.
   * @param density the shape density (set to zero for static bodies).
   * @warning This function is locked during callbacks.
   */
  CreateFixture(shape: Shape, density: number): Fixture;

  /**
   * Destroy a fixture. This removes the fixture from the broad-phase and
   * destroys all contacts associated with this fixture. This will
   * automatically adjust the mass of the body if the body is dynamic and the
   * fixture has positive density.
   * All fixtures attached to a body are implicitly destroyed when the body is destroyed.
   * @param fixture the fixture to be removed.
   * @warning This function is locked during callbacks.
   */
  DestroyFixture(fixture: Fixture): void;

  /**
   * Set the position of the body's origin and rotation.
   * Manipulating a body's transform may cause non-physical behavior.
   * Note: contacts are updated on the next call to b2World::Step.
   * @param position the world position of the body's local origin.
   * @param angle the world rotation in radians.
   */
  SetTransform(position: Vec2, angle: number): void;

  /**
   * Get the body transform for the body's origin.
   * @return the world transform of the body's origin.
   */
  GetTransform(): Transform;

  /**
   * Get the world body origin position.
   * @return the world position of the body's origin.
   */
  GetPosition(): Vec2;

  /**
   * Get the angle in radians.
   * @return the current world rotation angle in radians.
   */
  GetAngle(): number;

  /**
   * Get the world position of the center of mass.
   */
  GetWorldCenter(): Vec2;

  /**
   * Get the local position of the center of mass.
   */
  GetLocalCenter(): Vec2;

  /**
   * Set the linear velocity of the center of mass.
   * @param v the new linear velocity of the center of mass.
   */
  SetLinearVelocity(v: Vec2): void;

  /**
   * Get the linear velocity of the center of mass.
   * @return the linear velocity of the center of mass.
   */
  GetLinearVelocity(): Vec2;

  /**
   * Set the angular velocity.
   * @param omega the new angular velocity in radians/second.
   */
  SetAngularVelocity(omega: number): void;

  /**
   * Get the angular velocity.
   * @return the angular velocity in radians/second.
   */
  GetAngularVelocity(): number;

  /**
   * Apply a force at a world point. If the force is not
   * applied at the center of mass, it will generate a torque and
   * affect the angular velocity. This wakes up the body.
   * @param force the world force vector, usually in Newtons (N).
   * @param point the world position of the point of application.
   * @param wake also wake up the body
   */
  ApplyForce(force: Vec2, point: Vec2, wake: boolean): void;

  /**
   * Apply a force to the center of mass. This wakes up the body.
   * @param force the world force vector, usually in Newtons (N).
   * @param wake also wake up the body
   */
  ApplyForceToCenter(force: Vec2, wake: boolean): void;

  /**
   * Apply a torque. This affects the angular velocity
   * without affecting the linear velocity of the center of mass.
   * This wakes up the body.
   * @param torque about the z-axis (out of the screen), usually in N-m.
   * @param wake also wake up the body
   */
  ApplyTorque(torque: number, wake: boolean): void;

  /**
   * Apply an impulse at a point. This immediately modifies the velocity.
   * It also modifies the angular velocity if the point of application
   * is not at the center of mass. This wakes up the body.
   * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
   * @param point the world position of the point of application.
   * @param wake also wake up the body
   */
  ApplyLinearImpulse(impulse: Vec2, point: Vec2, wake: boolean): void;

  /**
   * Apply an angular impulse.
   * @param impulse the angular impulse in units of kg*m*m/s
   * @param wake also wake up the body
   */
  ApplyAngularImpulse(impulse: number, wake: boolean): void;

  /**
   * Get the total mass of the body.
   * @return the mass, usually in kilograms (kg).
   */
  GetMass(): number;

  /**
   * Get the rotational inertia of the body about the local origin.
   * @return the rotational inertia, usually in kg-m^2.
   */
  GetInertia(): number;

  /**
   * Get the mass data of the body.
   * @param data
   * @return a struct containing the mass, inertia and center of the body.
   */
  GetMassData(data: MassData): void;

  /**
   * Set the mass properties to override the mass properties of the fixtures.
   * Note that this changes the center of mass position.
   * Note that creating or destroying fixtures can also alter the mass.
   * This function has no effect if the body isn't dynamic.
   * @param data the mass properties.
   */
  SetMassData(data: MassData): void;

  /**
   * This resets the mass properties to the sum of the mass properties of the fixtures.
   * This normally does not need to be called unless you called SetMassData to override
   * the mass and you later want to reset the mass.
   */
  ResetMassData(): void;

  /// Get the world coordinates of a point given the local coordinates.
  /// @param localPoint a point on the body measured relative the the body's origin.
  /// @return the same point expressed in world coordinates.
  GetWorldPoint(localPoint: Vec2): Vec2;

  /**
   * Get the world coordinates of a vector given the local coordinates.
   * @param localVector a vector fixed in the body.
   * @return the same vector expressed in world coordinates.
   */
  GetWorldVector(localVector: Vec2): Vec2;

  /**
   * Gets a local point relative to the body's origin given a world point.
   * @param worldPoint point in world coordinates.
   * @return the corresponding local point relative to the body's origin.
   */
  GetLocalPoint(worldPoint: Vec2): Vec2;

  /**
   * Gets a local vector given a world vector.
   * @param worldVector vector in world coordinates.
   * @return the corresponding local vector.
   */
  GetLocalVector(worldVector: Vec2): Vec2;

  /**
   * Get the world linear velocity of a world point attached to this body.
   * @param worldPoint point in world coordinates.
   * @return the world velocity of a point.
   */
  GetLinearVelocityFromWorldPoint(worldPoint: Vec2): Vec2;

  /**
   * Get the world velocity of a local point.
   * @param localPoint point in local coordinates.
   * @return the world velocity of a point.
   */
  GetLinearVelocityFromLocalPoint(localPoint: Vec2): Vec2;

  /**
   * Get the linear damping of the body.
   */
  GetLinearDamping(): number;

  /**
   * Set the linear damping of the body.
   * @param linearDamping
   */
  SetLinearDamping(linearDamping: number): void;

  /**
   * Get the angular damping of the body.
   */
  GetAngularDamping(): number;

  /**
   * Set the angular damping of the body.
   * @param angularDamping
   */
  SetAngularDamping(angularDamping: number): void;

  /**
   * Get the gravity scale of the body.
   */
  GetGravityScale(): number;

  /**
   * Set the gravity scale of the body.
   * @param scale
   */
  SetGravityScale(scale: number): void;

  /**
   * Set the type of this body. This may alter the mass and velocity.
   * @param type
   */
  SetType(type: BodyType): void;

  /**
   * Get the type of this body.
   */
  GetType(): BodyType;

  /**
   * Should this body be treated like a bullet for continuous collision detection?
   * @param flag
   */
  SetBullet(flag: boolean): void;

  /**
   * Is this body treated like a bullet for continuous collision detection?
   */
  IsBullet(): boolean;

  /**
   * You can disable sleeping on this body. If you disable sleeping, the
   * body will be woken.
   * @param flag
   */
  SetSleepingAllowed(flag: boolean): void;

  /**
   * Is this body allowed to sleep
   */
  IsSleepingAllowed(): boolean;

  /**
   * Set the sleep state of the body. A sleeping body has very
   * low CPU cost.
   * @param flag set to true to wake the body, false to put it to sleep.
   */
  SetAwake(flag: boolean): void;

  /**
   * Get the sleeping state of this body.
   * @return true if the body is awake.
   */
  IsAwake(): boolean;

  /**
   * Set the active state of the body. An inactive body is not
   * simulated and cannot be collided with or woken up.
   * If you pass a flag of true, all fixtures will be added to the
   * broad-phase.
   * If you pass a flag of false, all fixtures will be removed from
   * the broad-phase and all contacts will be destroyed.
   * Fixtures and joints are otherwise unaffected. You may continue
   * to create/destroy fixtures and joints on inactive bodies.
   * Fixtures on an inactive body are implicitly inactive and will
   * not participate in collisions, ray-casts, or queries.
   * Joints connected to an inactive body are implicitly inactive.
   * An inactive body is still owned by a b2World object and remains
   * in the body list.
   * @param flag
   */
  SetActive(flag: boolean): void;

  /**
   * Get the active state of the body.
   */
  IsActive(): boolean;

  /**
   * Set this body to have fixed rotation. This causes the mass
   * to be reset.
   * @param flag
   */
  SetFixedRotation(flag: boolean): void;

  /**
   * Does this body have fixed rotation?
   */
  IsFixedRotation(): boolean;

  /**
   * Get the list of all fixtures attached to this body.
   */
  GetFixtureList(): Fixture;

  /**
   * Get the list of all joints attached to this body.
   */
  GetJointList(): JointEdge;

  /**
   * Get the list of all contacts attached to this body.
   * @warning this list changes during the time step and you may
   * miss some collisions if you don't use b2ContactListener.
   */
  GetContactList(): ContactEdge;

  /**
   * Get the next body in the world's body list.
   */
  GetNext(): Body;

  /**
   * Get the user data pointer that was provided in the body definition.
   */
  GetUserData(): void;

  /**
   * Set the user data. Use this to store your application specific data.
   * @param data
   */
  SetUserData(data: void): void;

  /**
   * Get the parent world of this body.
   */
  GetWorld(): World;

  /**
   * Dump this body to a log file
   */
  Dump(): void;

  private SynchronizeFixtures(): void;
  private SynchronizeTransform(): void;

  /**
   * This is used to prevent connected bodies from colliding.
   * It may lie, depending on the collideConnected flag.
   * @param other
   */
  private ShouldCollide(other: Body): boolean;

  private Advance(t: number): void;
}

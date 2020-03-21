/**
 * The world class manages all physics entities, dynamic simulation,
 * and asynchronous queries. The world also contains efficient memory
 * management facilities.
 */
declare class World implements ClassHandle<World> {
  /**
   * Modified class declaration for embind:
   */
  clone(): World;
  delete(): void;
  deleteLater(): ClassHandle<World>;
  isAliasOf(other: ClassHandle<World>): boolean;
  isDeleted(): boolean;
  /** */

  // m_flags enum
  private newFixture: number;
  private locked: number;
  private clearForces: number;

  private Init(gravity: Vec2): void;

  private Solve(step: TimeStep): void;
  private SolveTOI(step: TimeStep): void;

  private DrawJoint(joint: Joint): void;
  private DrawShape(shape: Fixture, xf: Transform, color: Color): void;

  private DrawParticleSystem(system: ParticleSystem): void;

  private blockAllocator: BlockAllocator;
  private stackAllocator: StackAllocator;

  private flags: number;

  private contactManager: ContactManager;

  private bodyList: Body;
  private jointList: Joint;
  private particleSystemList: ParticleSystem;

  private bodyCount: number;
  private jointCount: number;

  private gravity: Vec2;
  private allowSleep: boolean;

  private destructionListener: DestructionListener;
  private debugDraw: Draw;

  // This is used to compute the time step ratio to
  // support a variable time step.
  private inv_dt0: number;

  // These are for debugging the solver.
  private warmStarting: boolean;
  private continuousPhysics: boolean;
  private subStepping: boolean;

  private stepComplete: boolean;

  private profile: Profile;

  /// Used to reference b2_LiquidFunVersion so that it's not stripped from
  /// the static library.
  private liquidFunVersion: Version;
  private liquidFunVersionString: string;

  /**
   * Construct a world object.
   * @param gravity the world gravity vector.
   */
  constructor(gravity: Vec2);

  /**
   * Register a destruction listener. The listener is owned by you and must
   * remain in scope.
   * @param listener
   */
  SetDestructionListener(listener: DestructionListener): void;

  /**
   * Register a contact filter to provide specific control over collision.
   * Otherwise the default filter is used (b2_defaultFilter). The listener is
   * owned by you and must remain in scope.
   * @param filter
   */
  SetContactFilter(filter: ContactFilter): void;

  /**
   * Register a contact event listener. The listener is owned by you and must
   * remain in scope.
   * @param listener
   */
  SetContactListener(listener: ContactListener): void;

  /**
   * Register a routine for debug drawing. The debug draw functions are called
   * inside with b2World::DrawDebugData method. The debug draw object is owned
   * by you and must remain in scope.
   * @param debugDraw
   */
  SetDebugDraw(debugDraw: Draw): void;

  /**
   * Create a rigid body given a definition. No reference to the definition
   * is retained.
   * @warning This function is locked during callbacks.
   * @param def
   */
  CreateBody(def: BodyDef): Body;

  /**
   * Destroy a rigid body.
   * This function is locked during callbacks.
   * @warning This automatically deletes all associated shapes and joints.
   * @warning This function is locked during callbacks.
   * @param body
   */
  DestroyBody(body: Body): void;

  /**
   * Create a joint to constrain bodies together. No reference to the definition
   * is retained. This may cause the connected bodies to cease colliding.
   * @warning This function is locked during callbacks.
   * @param def
   */
  CreateJoint(def: JointDef): Joint;

  /**
   * Destroy a joint. This may cause the connected bodies to begin colliding.
   * @warning This function is locked during callbacks.
   * @param joint
   */
  DestroyJoint(joint: Joint): void;

  /**
   * Create a particle system given a definition. No reference to the
   * definition is retained.
   * @warning This function is locked during callbacks.
   * @param def
   */
  CreateParticleSystem(def: ParticleSystemDef): ParticleSystem;

  /**
   * Destroy a particle system.
   * @warning This function is locked during callbacks.
   * @param p
   */
  DestroyParticleSystem(p: ParticleSystem): void;

  /**
   * Take a time step. This performs collision detection, integration,
   * and constraint solution.
   * For the numerical stability of particles, minimize the following
   * dimensionless gravity acceleration:
   *      gravity / particleRadius * (timeStep / particleIterations)^2
   * CalculateParticleIterations() or
   * CalculateReasonableParticleIterations() help to determine the optimal
   * particleIterations.
   * @param timeStep the amount of time to simulate, this should not vary.
   * @param velocityIterations for the velocity constraint solver.
   * @param positionIterations for the position constraint solver.
   * @param particleIterations for the particle simulation.
   */
  Step(
    timeStep: number,
    velocityIterations: number,
    positionIterations: number,
    particleIterations: number,
  ): void;

  /**
   * Take a time step. This performs collision detection, integration,
   * and constraint solution.
   * @param timeStep the amount of time to simulate, this should not vary.
   * @param velocityIterations for the velocity constraint solver.
   * @param positionIterations for the position constraint solver.
   */
  Step(
    timeStep: number,
    velocityIterations: number,
    positionIterations: number,
  ): void;

  /**
   * Recommend a value to be used in `Step` for `particleIterations`.
   * This calculation is necessarily a simplification and should only be
   * used as a starting point. Please see "Particle Iterations" in the
   * Programmer's Guide for details.
   * @param timeStep is the value to be passed into `Step`.
   */
  CalculateReasonableParticleIterations(timeStep: number): number;

  /**
   * Manually clear the force buffer on all bodies. By default, forces are cleared automatically
   * after each call to Step. The default behavior is modified by calling SetAutoClearForces.
   * The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
   * a fixed sized time step under a variable frame-rate.
   * When you perform sub-stepping you will disable auto clearing of forces and instead call
   * ClearForces after all sub-steps are complete in one pass of your game loop.
   * @see SetAutoClearForces
   */
  ClearForces(): void;

  /**
   * Call this to draw shapes and other debug draw data. This is intentionally non-const.
   */
  DrawDebugData(): void;

  /**
   * Query the world for all fixtures that potentially overlap the
   * provided AABB.
   * @param callback a user implemented callback class.
   * @param aabb the query box.
   */
  QueryAABB(callback: QueryCallback, aabb: AABB): void;

  /**
   * Query the world for all fixtures that potentially overlap the
   * provided shape's AABB. Calls QueryAABB internally.
   * @param callback a user implemented callback class.
   * @param shape the query shape
   * @param xf the transform of the AABB
   */
  QueryShapeAABB(callback: QueryCallback, shape: Shape, xf: Transform): void;

  /**
   * Ray-cast the world for all fixtures in the path of the ray. Your callback
   * controls whether you get the closest point, any point, or n-points.
   * The ray-cast ignores shapes that contain the starting point.
   * @param callback a user implemented callback class.
   * @param point1 the ray starting point
   * @param point2 the ray ending point
   */
  RayCast(callback: RayCastCallback, point1: Vec2, point2: Vec2): void;

  /**
   * Get the world body list. With the returned body, use b2Body::GetNext to get
   * the next body in the world list. A NULL body indicates the end of the list.
   * @return the head of the world body list.
   */
  GetBodyList(): Body;

  /**
   * Get the world joint list. With the returned joint, use b2Joint::GetNext to get
   * the next joint in the world list. A NULL joint indicates the end of the list.
   * @return the head of the world joint list.
   */
  GetJointList(): Joint;

  /**
   * Get the world particle-system list. With the returned body, use
   * ParticleSystem.GetNext to get the next particle-system in the world
   * list. A NULL particle-system indicates the end of the list.
   * @return the head of the world particle-system list.
   */
  GetParticleSystemList(): ParticleSystem;

  /**
   * Get the world contact list. With the returned contact, use Contact.GetNext to get
   * the next contact in the world list. A NULL contact indicates the end of the list.
   * @return the head of the world contact list.
   * @warning contacts are created and destroyed in the middle of a time step.
   * Use ContactListener to avoid missing contacts.
   */
  GetContactList(): Contact;

  /**
   * Enable/disable sleep.
   * @param flag
   */
  SetAllowSleeping(flag: boolean): void;
  GetAllowSleeping(): boolean;

  /**
   * Enable/disable warm starting. For testing.
   * @param flag
   */
  SetWarmStarting(flag: boolean): void;
  GetWarmStarting(): boolean;

  /**
   * Enable/disable continuous physics. For testing.
   * @param flag
   */
  SetContinuousPhysics(flag: boolean): void;
  GetContinuousPhysics(): boolean;

  /**
   * Enable/disable single stepped continuous physics. For testing.
   * @param flag
   */
  SetSubStepping(flag: boolean): void;
  GetSubStepping(): boolean;

  /**
   * Get the number of broad-phase proxies.
   */
  GetProxyCount(): number;

  /**
   * Get the number of bodies.
   */
  GetBodyCount(): number;

  /**
   * Get the number of joints.
   */
  GetJointCount(): number;

  /**
   * Get the number of contacts (each may have 0 or more contact points).
   */
  GetContactCount(): number;

  /**
   * Get the height of the dynamic tree.
   */
  GetTreeHeight(): number;

  /**
   * Get the balance of the dynamic tree.
   */
  GetTreeBalance(): number;

  /**
   * Get the quality metric of the dynamic tree. The smaller the better.
   * The minimum is 1.
   */
  GetTreeQuality(): number;

  /**
   * Change the global gravity vector.
   * @param gravity
   */
  SetGravity(gravity: Vec2): void;

  /**
   * Get the global gravity vector.
   */
  GetGravity(): Vec2;

  /**
   * Is the world locked (in the middle of a time step).
   */
  IsLocked(): boolean;

  /**
   * Set flag to control automatic clearing of forces after each time step.
   * @param flag
   */
  SetAutoClearForces(flag: boolean): void;

  /**
   * Get the flag that controls automatic clearing of forces after each time step.
   */
  GetAutoClearForces(): boolean;

  /**
   * Shift the world origin. Useful for large worlds.
   * The body shift formula is: position -= newOrigin
   * @param newOrigin the new origin with respect to the old origin
   */
  ShiftOrigin(newOrigin: Vec2): void;

  /**
   * Get the contact manager for testing.
   */
  GetContactManager(): ContactManager;

  /**
   * Get the current profile.
   */
  GetProfile(): Profile;

  /**
   * Dump the world into the log file.
   * @warning this should be called outside of a time step.
   */
  Dump(): void;

  /**
   * Get API version.
   */
  GetVersion(): Version;

  /**
   * Get API version string.
   */
  GetVersionString(): string;
}

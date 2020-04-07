declare namespace LiquidFun {

  // 16-bit particle indices consume less memory and thus improve
  // performance. We iterate through m_contactBuffer many times during
  // b2ParticleSystem::Solve, so reducing the amount of data we churn
  // through speeds things up. Also, FindContactsFromChecks_Simd takes
  // advantage of the reduced size for specific optimizations.
  // #ifdef B2_USE_16_BIT_PARTICLE_INDICES
  // 	typedef int16 b2ParticleIndex;
  // #else
  // 	typedef int32 b2ParticleIndex;
  // #endif

  export type ParticleIndex = number;

  export interface ParticleContact {
    // Indices of the respective particles making contact.
    indexA: ParticleIndex;
    indexB: ParticleIndex;

    // Weight of the contact. A value between 0.0f and 1.0f.
    // 0.0f ==> particles are just barely touching
    // 1.0f ==> particles are perfectly on top of each other
    weight: number;

    // The normalized direction from A to B.
    normal: Vec2;

    // The logical sum of the particle behaviors that have been set.
    // See the b2ParticleFlag enum.
    flags: number;

    SetIndices(a: number, b: number): void;
    SetWeight(w: number): void;
    SetNormal(n: Vec2): void;
    SetFlags(f: number): void;

    GetIndexA(): number;
    GetIndexB(): number;
    GetWeight(): number;
    GetNormal(): Vec2;
    GetFlags(): number;

    ApproximatelyEqual(rhs: ParticleContact): boolean;
  }

  export interface ParticleBodyContact {
    // Index of the particle making contact.
    index: number;

    // The body making contact.
    body: Body;

    // The specific fixture making contact
    fixture: Fixture;

    // Weight of the contact. A value between 0.0f and 1.0f.
    weight: number;

    // The normalized direction from the particle to the body.
    normal: Vec2;

    // The effective mass used in calculating force.
    mass: number;
  }

  /**
   * Connection between two particles
   */
  export interface ParticlePair {
    // Indices of the respective particles making pair.
    indexA: number;
    indexB: number;

    // The logical sum of the particle flags. See the b2ParticleFlag enum.
    flags: number;

    // The strength of cohesion among the particles.
    strength: number;

    // The initial distance of the particles.
    distance: number;
  }

  /**
   * Connection between three particles
   */
  export interface ParticleTriad {
    // Indices of the respective particles making triad.
    indexA: number;
    indexB: number;
    indexC: number;

    // The logical sum of the particle flags. See the b2ParticleFlag enum.
    flags: number;

    // The strength of cohesion among the particles.
    strength: number;

    // Values used for calculation.
    pa: Vec2;
    pb: Vec2;
    pc: Vec2;
    ka: number;
    kb: number;
    kc: number;
    s: number;
  }

  export class ParticleSystemDef implements ClassHandle<ParticleSystemDef> {
    /**
     * Modified class declaration for embind:
     */
    clone(): ParticleSystemDef;
    delete(): void;
    deleteLater(): ClassHandle<ParticleSystemDef>;
    isAliasOf(other: ClassHandle<ParticleSystemDef>): boolean;
    isDeleted(): boolean;
    /** */

    constructor();

    // Enable strict Particle/Body contact check.
    // See SetStrictContactCheck for details.
    strictContactCheck: boolean;

    // Set the particle density.
    // See SetDensity for details.
    density: number;

    // Change the particle gravity scale. Adjusts the effect of the global
    // gravity vector on particles. Default value is 1.0f.
    gravityScale: number;

    // Particles behave as circles with this radius. In Box2D units.
    radius: number;

    // Set the maximum number of particles.
    // By default, there is no maximum. The particle buffers can continue to
    // grow while b2World's block allocator still has memory.
    // See SetMaxParticleCount for details.
    maxCount: number;

    // Increases pressure in response to compression
    // Smaller values allow more compression
    pressureStrength: number;

    // Reduces velocity along the collision normal
    // Smaller value reduces less
    dampingStrength: number;

    // Restores shape of elastic particle groups
    // Larger values increase elastic particle velocity
    elasticStrength: number;

    // Restores length of spring particle groups
    // Larger values increase spring particle velocity
    springStrength: number;

    // Reduces relative velocity of viscous particles
    // Larger values slow down viscous particles more
    viscousStrength: number;

    // Produces pressure on tensile particles
    // 0~0.2. Larger values increase the amount of surface tension.
    surfaceTensionPressureStrength: number;

    // Smoothes outline of tensile particles
    // 0~0.2. Larger values result in rounder, smoother, water-drop-like
    // clusters of particles.
    surfaceTensionNormalStrength: number;

    // Produces additional pressure on repulsive particles
    // Larger values repulse more
    // Negative values mean attraction. The range where particles behave
    // stably is about -0.2 to 2.0.
    repulsiveStrength: number;

    // Produces repulsion between powder particles
    // Larger values repulse more
    powderStrength: number;

    // Pushes particles out of solid particle group
    // Larger values repulse more
    ejectionStrength: number;

    // Produces static pressure
    // Larger values increase the pressure on neighboring partilces
    // For a description of static pressure, see
    // http://en.wikipedia.org/wiki/Static_pressure#Static_pressure_in_fluid_dynamics
    staticPressureStrength: number;

    // Reduces instability in static pressure calculation
    // Larger values make stabilize static pressure with fewer iterations
    staticPressureRelaxation: number;

    // Computes static pressure more precisely
    // See SetStaticPressureIterations for details
    staticPressureIterations: number;

    // Determines how fast colors are mixed
    // 1.0f ==> mixed immediately
    // 0.5f ==> mixed half way each simulation step (see b2World::Step())
    colorMixingStrength: number;

    // Whether to destroy particles by age when no more particles can be
    // created.  See #b2ParticleSystem::SetDestructionByAge() for
    // more information.
    destroyByAge: boolean;

    // Granularity of particle lifetimes in seconds.  By default this is
    // set to (1.0f / 60.0f) seconds.  b2ParticleSystem uses a 32-bit signed
    // value to track particle lifetimes so the maximum lifetime of a
    // particle is (2^32 - 1) / (1.0f / lifetimeGranularity) seconds.
    // With the value set to 1/60 the maximum lifetime or age of a particle is
    // 2.27 years.
    lifetimeGranularity: number;
  }

  /**
   * Allocator for a fixed set of items.
   */
  export class FixedSetAllocator {
    // Set buffer.
    private buffer: void;

    // Array of size m_count which indicates whether an item is in the
    // corresponding index of m_set (1) or the item is invalid (0).
    private valid: number;

    // Number of items in set.
    private count: number;

    // Allocator used to allocate / free the set.
    private allocator: StackAllocator;

    /**
     * Associate a memory allocator with this object.
     * @param allocator
     */
    constructor(allocator: StackAllocator);

    /**
     * Allocate internal storage for this object returning the size.
     * @param itemSize
     * @param count
     */
    Allocate(itemSize: number, count: number): number;

    /**
     * Deallocate the internal buffer if it's allocated.
     */
    Clear(): void;

    /**
     * Get the number of items in the set.
     */
    GetCount(): number;

    /**
     * Invalidate an item from the set by index.
     * @param itemIndex
     */
    Invalidate(itemIndex: number): void;

    /**
     * Get the buffer which indicates whether items are valid in the set.
     */
    GetValidBuffer(): number;

    /**
     *  Get the internal buffer.
     */
    protected GetBuffer(): void;

    /**
     * Reduce the number of items in the set.
     * @param count
     */
    protected SetCount(count: number): void;
  }

  /**
   * Allocator for a fixed set of objects.
   */
  export class TypedFixedSetAllocator<T> extends FixedSetAllocator {
    /**
     * Initialize members of this class.
     * @param allocator
     */
    constructor(allocator: StackAllocator);

    /**
     * Allocate a set of objects, returning the new size of the set.
     * @param numberOfObjects
     */
    Allocate(numberOfObjects: number): number;

    /**
     * Get the index of an item in the set if it's valid return an index
     * >= 0, -1 otherwise.
     * @param item
     */
    GetIndex(item: T): number;

    /**
     * Get the internal buffer.
     */
    GetBuffer(): T;
  }

  export class ParticlePairSet extends TypedFixedSetAllocator<ParticlePair> {
    /**
     * Initialize members of this class.
     * @param allocator
     */
    constructor(allocator: StackAllocator);

    /**
     * Initialize from a set of particle contacts.
     * @param contacts
     * @param numContacts
     * @param particleFlagsBuffer
     */
    Initialize(
      contacts: ParticleContact,
      numContacts: number,
      particleFlagsBuffer: number,
    ): void;

    /**
     * Find the index of a particle pair in the set or -1
     * if it's not present.
     * NOTE: This was not written as a template function to avoid
     * exposing any dependencies via this header.
     * @param pair
     */
    Find(pair: ParticlePair): number;
  }

  export interface LightweightPair<A, B> {
    first: A;
    second: B;

    Compare(left: LightweightPair<A, B>, right: LightweightPair<A, B>): boolean;
  }

  export type FixtureParticle = LightweightPair<Fixture, number>;

  export class FixtureParticleSet extends TypedFixedSetAllocator<
    FixtureParticle
  > {
    /**
     * Initialize members of this class.
     * @param allocator
     */
    constructor(allocator: StackAllocator);

    /**
     * Initialize from a set of particle / body contacts for particles
     * that have the fixtureContactListenerParticle flag set.
     * @param bodyContacts
     * @param numBodyContacts
     * @param particleFlagsBuffer
     */
    Initialize(
      bodyContacts: ParticleBodyContact,
      numBodyContacts: number,
      particleFlagsBuffer: number,
    ): void;

    /**
     * Find the index of a particle / fixture pair in the set or -1
     * if it's not present.
     * NOTE: This was not written as a template function to avoid
     * exposing any dependencies via this header.
     * @param fixtureParticle
     */
    Find(fixtureParticle: FixtureParticle): number;
  }

  export class ParticleSystem {
    /**
     * Create a particle whose properties have been defined.
     * No reference to the definition is retained.
     * A simulation step must occur before it's possible to interact with a
     * newly created particle.  For example, DestroyParticleInShape() will
     * not destroy a particle until b2World::Step() has been called.
     * @warning This function is locked during callbacks.
     * @param def
     * @return the index of the particle.
     */
    CreateParticle(def: ParticleDef): number;

    /**
     * Retrieve a handle to the particle at the specified index.
     * Please see #ParticleHandle for why you might want a handle.
     * @param index
     */
    GetParticleHandleFromIndex(index: number): ParticleHandle;

    /**
     * Destroy a particle.
     * The particle is removed after the next simulation step (see
     * World.Step()).
     * @param index
     */
    DestroyParticle(index: number): void;

    /**
     * Destroy a particle.
     * The particle is removed after the next step.
     * @param index of the particle to destroy.
     * @param callDestructionListener Whether to call the destruction listener just before the
     * particle is destroyed.
     */
    DestroyParticle(index: number, callDestructionListener: boolean): void;

    /**
     * Destroy the Nth oldest particle in the system.
     * The particle is removed after the next b2World::Step().
     * @param index of the Nth oldest particle to destroy, 0 will destroy the
     * oldest particle in the system, 1 will destroy the next oldest
     * particle etc.
     * @param callDestructionListener Whether to call the destruction listener just before the
     * particle is destroyed.
     */
    DestroyOldestParticle(index: number, callDestructionListener: boolean): void;

    /**
     * Destroy particles inside a shape without enabling the destruction
     * callback for destroyed particles.
     * This function is locked during callbacks.
     * For more information see
     * DestroyParticleInShape(const b2Shape&, const b2Transform&,bool).
     * @param shape Shape which encloses particles that should be destroyed.
     * @param xf Transform applied to the shape.
     * @warning This function is locked during callbacks.
     * @return Number of particles destroyed.
     */
    DestroyParticlesInShape(shape: Shape, xf: Transform): number;

    /**
     * Destroy particles inside a shape.
     * This function is locked during callbacks.
     * In addition, this function immediately destroys particles in the shape
     * in constrast to DestroyParticle() which defers the destruction until
     * the next simulation step.
     * @param shape Shape which encloses particles that should be destroyed.
     * @param xf Transform applied to the shape.
     * @param callDestructionListener Whether to call the world b2DestructionListener for each
     * particle destroyed.
     * @warning This function is locked during callbacks.
     * @return Number of particles destroyed.
     */
    DestroyParticlesInShape(
      shape: Shape,
      xf: Transform,
      callDestructionListener: boolean,
    ): number;

    /**
     * Create a particle group whose properties have been defined. No
     * reference to the definition is retained.
     * @warning This function is locked during callbacks.
     * @param def
     */
    CreateParticleGroup(def: ParticleGroupDef): ParticleGroup;

    /**
     * Join two particle groups.
     * @param groupA the first group. Expands to encompass the second group.
     * @param groupB the second group. It is destroyed.
     * @warning This function is locked during callbacks.
     */
    JoinParticleGroups(groupA: ParticleGroup, groupB: ParticleGroup): void;

    /**
     * Split particle group into multiple disconnected groups.
     * @param group the group to be split.
     * @warning This function is locked during callbacks.
     */
    SplitParticleGroup(group: ParticleGroup): void;

    /**
     * Get the world particle group list. With the returned group, use
     * ParticleGroup.GetNext to get the next group in the world list.
     * A NULL group indicates the end of the list.
     * @return the head of the world particle group list.
     */
    GetParticleGroupList(): ParticleGroup;

    /**
     * Get the number of particle groups.
     */
    GetParticleGroupCount(): number;

    /**
     * Get the number of particles.
     */
    GetParticleCount(): number;

    /**
     * Get the maximum number of particles.
     */
    GetMaxParticleCount(): number;

    /**
     * Set the maximum number of particles.
     * A value of 0 means there is no maximum. The particle buffers can
     * continue to grow while World's block allocator still has memory.
     * Note: If you try to CreateParticle() with more than this count,
     * invalidParticleIndex is returned unless
     * SetDestructionByAge() is used to enable the destruction of the
     * oldest particles in the system.
     * @param count
     */
    SetMaxParticleCount(count: number): void;

    /**
     * Get all existing particle flags.
     */
    GetAllParticleFlags(): number;

    /**
     * Get all existing particle group flags.
     */
    GetAllGroupFlags(): number;

    /**
     * Pause or unpause the particle system. When paused, World.Step()
     * skips over this particle system. All ParticleSystem function calls
     * still work.
     * @param paused is true to pause, false to un-pause.
     */
    SetPaused(paused: boolean): void;

    /**
     * @return true if the particle system is being updated in
     * World.Step().
     * Initially, true, then, the last value passed into SetPaused().
     */
    GetPaused(): boolean;

    /**
     * Change the particle density.
     * Particle density affects the mass of the particles, which in turn
     * affects how the particles interact with b2Bodies. Note that the density
     * does not affect how the particles interact with each other.
     * @param density
     */
    SetDensity(density: number): void;

    /**
     * Get the particle density.
     */
    GetDensity(): number;

    /**
     * Change the particle gravity scale. Adjusts the effect of the global
     * gravity vector on particles.
     * @param gravityScale
     */
    SetGravityScale(gravityScale: number): void;

    /**
     * Get the particle gravity scale.
     */
    GetGravityScale(): number;

    /**
     * Damping is used to reduce the velocity of particles. The damping
     * parameter can be larger than 1.0f but the damping effect becomes
     * sensitive to the time step when the damping parameter is large.
     * @param damping
     */
    SetDamping(damping: number): void;

    /**
     * Get damping for particles
     */
    GetDamping(): number;

    /**
     * Change the number of iterations when calculating the static pressure of
     * particles. By default, 8 iterations. You can reduce the number of
     * iterations down to 1 in some situations, but this may cause
     * instabilities when many particles come together. If you see particles
     * popping away from each other like popcorn, you may have to increase the
     * number of iterations.
     * For a description of static pressure, see
     * http://en.wikipedia.org/wiki/Static_pressure#Static_pressure_in_fluid_dynamics
     * @param iterations
     */
    SetStaticPressureIterations(iterations: number): void;

    /**
     * Get the number of iterations for static pressure of particles.
     */
    GetStaticPressureIterations(): number;

    /**
     * Change the particle radius.
     * You should set this only once, on world start.
     * If you change the radius during execution, existing particles may
     * explode, shrink, or behave unexpectedly.
     * @param radius
     */
    SetRadius(radius: number): void;

    /**
     * Get the particle radius.
     */
    GetRadius(): number;

    /**
     * Get the position of each particle
     * Array is length GetParticleCount()
     * @return the pointer to the head of the particle positions array.
     */
    GetPositionBuffer(): Vec2;

    /**
     * Get the velocity of each particle
     * Array is length GetParticleCount()
     * @return the pointer to the head of the particle velocities array.
     */
    GetVelocityBuffer(): Vec2;

    /**
     * Get the color of each particle
     * Array is length GetParticleCount()
     * @return the pointer to the head of the particle colors array.
     */
    GetColorBuffer(): ParticleColor;

    /**
     * Get the particle-group of each particle.
     * Array is length GetParticleCount()
     * @return the pointer to the head of the particle group array.
     */
    GetGroupBuffer(): ParticleGroup;

    /**
     * Get the weight of each particle
     * Array is length GetParticleCount()
     * @return the pointer to the head of the particle positions array.
     */
    GetWeightBuffer(): number;

    /**
     * Get the user-specified data of each particle.
     * Array is length GetParticleCount()
     * @return the pointer to the head of the particle user-data array.
     */
    GetUserDataBuffer(): void;

    /**
     * Get the flags for each particle. See the ParticleFlag enum.
     * Array is length GetParticleCount()
     * @return the pointer to the head of the particle-flags array.
     */
    GetFlagsBuffer(): number;

    /**
     * Set flags for a particle. See the ParticleFlag enum.
     * @param index
     * @param flags
     */
    SetParticleFlags(index: number, flags: number): void;

    /**
     * Get flags for a particle. See the b2ParticleFlag enum.
     * @param index
     */
    GetParticleFlags(index: number): number;

    /**
     * Set an external buffer for particle data.
     * Normally, the b2World's block allocator is used for particle data.
     * However, sometimes you may have an OpenGL or Java buffer for particle
     * data. To avoid data duplication, you may supply this external buffer.
     *
     * Note that, when b2World's block allocator is used, the particle data
     * buffers can grow as required. However, when external buffers are used,
     * the maximum number of particles is clamped to the size of the smallest
     * external buffer.
     *
     * @param buffer is a pointer to a block of memory.
     * @param capacity size is the number of values in the block.
     */
    SetFlagsBuffer(buffer: number, capacity: number): void;
    SetPositionBuffer(buffer: Vec2, capacity: number): void;
    SetVelocityBuffer(buffer: Vec2, capacity: number): void;
    SetColorBuffer(buffer: ParticleColor, capacity: number): void;
    SetUserDataBuffer(buffer: void, capacity: number): void;

    /**
     * Get contacts between particles
     * Contact data can be used for many reasons, for example to trigger
     * rendering or audio effects.
     */
    GetContacts(): ParticleContact;
    GetContactCount(): number;

    /**
     * Get contacts between particles and bodies
     * Contact data can be used for many reasons, for example to trigger
     * rendering or audio effects.
     */
    GetBodyContacts(): ParticleBodyContact;
    GetBodyContactCount(): number;

    /**
     * Get array of particle pairs. The particles in a pair:
     *    (1) are contacting,
     *    (2) are in the same particle group,
     *    (3) are part of a rigid particle group, or are spring, elastic,
     *       or wall particles.
     *   (4) have at least one particle that is a spring or barrier
     *       particle (i.e. one of the types in k_pairFlags),
     *   (5) have at least one particle that returns true for
     *       ConnectionFilter::IsNecessary,
     *   (6) are not zombie particles.
     * Essentially, this is an array of spring or barrier particles that
     * are interacting. The array is sorted by b2ParticlePair's indexA,
     * and then indexB. There are no duplicate entries.
     */
    GetPairs(): ParticlePair;
    GetPairCount(): number;

    /**
     * Get array of particle triads. The particles in a triad:
     *   (1) are in the same particle group,
     *   (2) are in a Voronoi triangle together,
     *   (3) are within b2_maxTriadDistance particle diameters of each
     *       other,
     *   (4) return true for ConnectionFilter::ShouldCreateTriad
     *   (5) have at least one particle of type elastic (i.e. one of the
     *       types in k_triadFlags),
     *   (6) are part of a rigid particle group, or are spring, elastic,
     *       or wall particles.
     *   (7) are not zombie particles.
     * Essentially, this is an array of elastic particles that are
     * interacting. The array is sorted by b2ParticleTriad's indexA,
     * then indexB, then indexC. There are no duplicate entries.
     */
    GetTriads(): ParticleTriad;
    GetTriadCount(): number;

    /**
     * Set an optional threshold for the maximum number of
     * consecutive particle iterations that a particle may contact
     * multiple bodies before it is considered a candidate for being
     * "stuck". Setting to zero or less disables.
     * @param iterations
     */
    SetStuckThreshold(iterations: number): void;

    /**
     * Get potentially stuck particles from the last step; the user must
     * decide if they are stuck or not, and if so, delete or move them
     */
    GetStuckCandidates(): number;

    /**
     * Get the number of stuck particle candidates from the last step.
     */
    GetStuckCandidateCount(): number;

    /**
     * Compute the kinetic energy that can be lost by damping force
     */
    ComputeCollisionEnergy(): number;

    /**
     * Set strict Particle/Body contact check.
     * This is an option that will help ensure correct behavior if there are
     * corners in the world model where Particle/Body contact is ambiguous.
     * This option scales at n*log(n) of the number of Particle/Body contacts,
     * so it is best to only enable if it is necessary for your geometry.
     * Enable if you see strange particle behavior around b2Body
     * intersections.
     * @param enabled
     */
    SetStrictContactCheck(enabled: boolean): void;

    /**
     * Get the status of the strict contact check.
     */
    GetStrictContactCheck(): boolean;

    /**
     * Set the lifetime (in seconds) of a particle relative to the current
     * time.  A lifetime of less than or equal to 0.0f results in the particle
     * living forever until it's manually destroyed by the application.
     * @param index
     * @param lifetime
     */
    SetParticleLifetime(index: number, lifetime: number): void;

    /**
     * Get the lifetime (in seconds) of a particle relative to the current
     * time.  A value > 0.0f is returned if the particle is scheduled to be
     * destroyed in the future, values <= 0.0f indicate the particle has an
     * infinite lifetime.
     * @param index
     */
    GetParticleLifetime(index: number): number;

    /**
     * Enable / disable destruction of particles in CreateParticle() when
     * no more particles can be created due to a prior call to
     * SetMaxParticleCount().  When this is enabled, the oldest particle is
     * destroyed in CreateParticle() favoring the destruction of particles
     * with a finite lifetime over particles with infinite lifetimes.
     * This feature is enabled by default when particle lifetimes are
     * tracked.  Explicitly enabling this feature using this function enables
     * particle lifetime tracking.
     * @param enable
     */
    SetDestructionByAge(enable: boolean): void;

    /**
     * Get whether the oldest particle will be destroyed in CreateParticle()
     * when the maximum number of particles are present in the system.
     */
    GetDestructionByAge(): boolean;

    /**
     * Get the array of particle expiration times indexed by particle index.
     * GetParticleCount() items are in the returned array.
     */
    GetExpirationTimeBuffer(): number;

    /**
     * Convert a expiration time value in returned by
     * GetExpirationTimeBuffer() to a time in seconds relative to the
     * current simulation time.
     * @param expirationTime
     */
    ExpirationTimeToLifetime(expirationTime: number): number;

    /**
     * Get the array of particle indices ordered by reverse lifetime.
     * The oldest particle indexes are at the end of the array with the
     * newest at the start.  Particles with infinite lifetimes
     * (i.e expiration times less than or equal to 0) are placed at the start
     *  of the array.
     * ExpirationTimeToLifetime(GetExpirationTimeBuffer()[index])
     * is equivalent to GetParticleLifetime(index).
     * GetParticleCount() items are in the returned array.
     */
    GetIndexByExpirationTimeBuffer(): number;

    /**
     * Apply an impulse to one particle. This immediately modifies the
     * velocity. Similar to b2Body::ApplyLinearImpulse.
     * @param index the particle that will be modified.
     * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
     * @param index
     * @param impulse
     */
    ParticleApplyLinearImpulse(index: number, impulse: Vec2): void;

    /**
     * Apply an impulse to all particles between 'firstIndex' and 'lastIndex'.
     * This immediately modifies the velocity. Note that the impulse is
     * applied to the total mass of all particles. So, calling
     * ParticleApplyLinearImpulse(0, impulse) and
     * ParticleApplyLinearImpulse(1, impulse) will impart twice as much
     * velocity as calling just ApplyLinearImpulse(0, 1, impulse).
     * @param firstIndex the first particle to be modified.
     * @param lastIndex the last particle to be modified.
     * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
     * @param firstIndex
     * @param lastIndex
     * @param impulse
     */
    ApplyLinearImpulse(
      firstIndex: number,
      lastIndex: number,
      impulse: Vec2,
    ): void;

    /**
     * Apply a force to the center of a particle.
     * @param index the particle that will be modified.
     * @param force the world force vector, usually in Newtons (N).
     * @param index
     * @param force
     */
    ParticleApplyForce(index: number, force: Vec2): void;

    /**
     * Distribute a force across several particles. The particles must not be
     * wall particles. Note that the force is distributed across all the
     * particles, so calling this function for indices 0..N is not the same as
     * calling ParticleApplyForce(i, force) for i in 0..N.
     * @param firstIndex the first particle to be modified.
     * @param lastIndex the last particle to be modified.
     * @param force the world force vector, usually in Newtons (N).
     * @param firstIndex
     * @param lastIndex
     * @param force
     */
    ApplyForce(firstIndex: number, lastIndex: number, force: Vec2): void;

    /**
     * Get the next particle-system in the world's particle-system list.
     */
    GetNext(): ParticleSystem;

    /**
     * Query the particle system for all particles that potentially overlap
     * the provided AABB. b2QueryCallback::ShouldQueryParticleSystem is
     * ignored.
     * @param callback a user implemented callback class.
     * @param aabb the query box.
     */
    QueryAABB(callback: QueryCallback, aabb: AABB): void;

    /**
     * Query the particle system for all particles that potentially overlap
     * the provided shape's AABB. Calls QueryAABB internally.
     * b2QueryCallback::ShouldQueryParticleSystem is ignored.
     * @param callback a user implemented callback class.
     * @param shape the query shape
     * @param xf the transform of the AABB
     */
    QueryShapeAABB(callback: QueryCallback, shape: Shape, xf: Transform): void;

    /**
     * Ray-cast the particle system for all particles in the path of the ray.
     * Your callback controls whether you get the closest point, any point, or
     * n-points. The ray-cast ignores particles that contain the starting
     * point. b2RayCastCallback::ShouldQueryParticleSystem is ignored.
     * @param callback a user implemented callback class.
     * @param point1 the ray starting point
     * @param point2 the ray ending point
     */
    RayCast(callback: RayCastCallback, point1: Vec2, point2: Vec2): void;

    /**
     * Compute the axis-aligned bounding box for all particles contained
     * within this particle system.
     * @param aabb Returns the axis-aligned bounding box of the system.
     */
    ComputeAABB(aabb: AABB): void;

    // LIQUIDFUN_EXTERNAL_LANGUAGE_API
    // CopyPositionBuffer(
    //   startIndex: number,
    //   numParticles: number,
    //   outBuf: Buffer | WebGLBuffer,
    //   size: number,
    // ): number;
    /***
     * Adding the first parameter ParticleSystem
     * to make it possible to pass pointers to
     * primitives in Embind
     */
    CopyPositionBuffer(
      // ps: ParticleSystem,
      startIndex: number,
      numParticles: number,
      outBuf: ArrayBuffer | number, // Pointer
      size: number,
    ): number;
    CopyColorBuffer(
      startIndex: number,
      numParticles: number,
      outBuf: ArrayBuffer | number, // Pointer
      size: number,
    ): number;
    CopyWeightBuffer(
      startIndex: number,
      numParticles: number,
      outBuf: ArrayBuffer | number, // Pointer
      size: number,
    ): number;

    // All particle types that require creating pairs
    private static pairFlags: number;

    // All particle types that apply extra damping force with bodies
    private static extraDampingFlags: number;

    private constructor(def: ParticleSystemDef, world: World);

    private FreeBuffer<T>(b: T, capacity: number): void;
    private FreeUserOverridableBuffer<T>(
      b: ParticleSystem.UserOverridableBuffer<T>,
    ): void;
    private ReallocateBuffer<T>(
      buffer: T,
      oldCapacity: number,
      newCapacity: number,
    ): T;
    private ReallocateBuffer<T>(
      buffer: T,
      userSuppliedCapacity: number,
      oldCapacity: number,
      newCapacity: number,
      deferred: boolean,
    ): T;
    private ReallocateBuffer<T>(
      buffer: ParticleSystem.UserOverridableBuffer<T>,
      oldCapacity: number,
      newCapacity: number,
      deferred: boolean,
    ): T;
    private RequestBuffer<T>(buffer: T): T;

    /**
     * Reallocate the handle / index map and schedule the allocation of a new
     * pool for handle allocation.
     * @param newCapacity
     */
    private ReallocateHandleBuffers(newCapacity: number): void;

    private ReallocateInternalAllocatedBuffers(capacity: number): void;
    private CreateParticleForGroup(
      groupDef: ParticleGroupDef,
      xf: Transform,
      position: Vec2,
    ): number;
    private CreateParticlesStrokeShapeForGroup(
      shape: Shape,
      groupDef: ParticleGroupDef,
      xf: Transform,
    ): void;
    private CreateParticlesFillShapeForGroup(
      shape: Shape,
      groupDef: ParticleGroupDef,
      xf: Transform,
    ): void;
    private CreateParticlesWithShapeForGroup(
      shape: Shape,
      groupDef: ParticleGroupDef,
      xf: Transform,
    ): void;
    private CreateParticlesWithShapesForGroup(
      shapes: Shape,
      shapeCount: number,
      groupDef: ParticleGroupDef,
      xf: Transform,
    ): void;
    private CloneParticle(index: number, group: ParticleGroup): number;
    private DestroyParticleGroup(group: ParticleGroup): void;

    private UpdatePairsAndTriads(
      firstIndex: number,
      lastIndex: number,
      filter: ParticleSystem.ConnectionFilter,
    ): void;
    private UpdatePairsAndTriadsWithReactiveParticles(): void;
    private static ComparePairIndices(a: ParticlePair, b: ParticlePair): boolean;
    private static MatchPairIndices(a: ParticlePair, b: ParticlePair): boolean;
    private static CompareTriadIndices(
      a: ParticleTriad,
      b: ParticleTriad,
    ): boolean;
    private static MatchTriadIndices(a: ParticleTriad, b: ParticleTriad): boolean;

    private static InitializeParticleLists(
      group: ParticleGroup,
      nodeBuffer: ParticleSystem.ParticleListNode,
    ): void;
    private MergeParticleListsInContact(
      group: ParticleGroup,
      nodeBuffer: ParticleSystem.ParticleListNode,
    ): void;
    private static MergeParticleLists(
      listA: ParticleSystem.ParticleListNode,
      listB: ParticleSystem.ParticleListNode,
    ): void;
    private static FindLongestParticleList(
      group: ParticleGroup,
      nodeBuffer: ParticleSystem.ParticleListNode,
    ): ParticleSystem.ParticleListNode;
    private MergeZombieParticleListNodes(
      group: ParticleGroup,
      nodeBuffer: ParticleSystem.ParticleListNode,
      survivingList: ParticleSystem.ParticleListNode,
    ): void;
    private static MergeParticleListAndNode(
      list: ParticleSystem.ParticleListNode,
      node: ParticleSystem.ParticleListNode,
    ): void;
    CreateParticleGroupsFromParticleList(
      group: ParticleGroup,
      nodeBuffer: ParticleSystem.ParticleListNode,
      survivingList: ParticleSystem.ParticleListNode,
    ): void;
    private UpdatePairsAndTriadsWithParticleList(
      group: ParticleGroup,
      nodeBuffer: ParticleSystem.ParticleListNode,
    ): void;

    private ComputeDepth(): void;

    private GetInsideBoundsEnumerator(
      aabb: AABB,
    ): ParticleSystem.InsideBoundsEnumerator;

    private UpdateAllParticleFlags(): void;
    private UpdateAllGroupFlags(): void;
    private AddContact(
      a: number,
      b: number,
      contacts: GrowableBuffer<ParticleContact>,
    ): void;
    // eslint-disable-next-line @typescript-eslint/camelcase
    private FindContacts_Reference(
      contacts: GrowableBuffer<ParticleContact>,
    ): void;
    private ReorderForFindContact(
      reordered: FindContactInput,
      alignedCount: number,
    ): void;
    private GatherChecksOneParticle(
      bound: number,
      startIndex: number,
      particleIndex: number,
      nextUncheckedIndex: number,
      checks: GrowableBuffer<FindContactCheck>,
    ): void;
    private GatherChecks(checks: GrowableBuffer<FindContactCheck>): void;
    // eslint-disable-next-line @typescript-eslint/camelcase
    private FindContacts_Simd(contacts: GrowableBuffer<ParticleContact>): void;
    private FindContacts(contacts: GrowableBuffer<ParticleContact>): void;
    private static UpdateProxyTags(
      tags: number,
      proxies: GrowableBuffer<ParticleSystem.Proxy>,
    ): void;
    private static ProxyBufferHasIndex(
      index: number,
      a: ParticleSystem.Proxy,
      count: number,
    ): boolean;
    private static NumProxiesWithSameTag(
      a: ParticleSystem.Proxy,
      b: ParticleSystem.Proxy,
      count: number,
    ): number;
    private static AreProxyBuffersTheSame(
      a: GrowableBuffer<ParticleSystem.Proxy>,
      b: GrowableBuffer<ParticleSystem.Proxy>,
    ): boolean;
    // eslint-disable-next-line @typescript-eslint/camelcase
    private UpdateProxies_Reference(
      proxies: GrowableBuffer<ParticleSystem.Proxy>,
    ): void;
    // eslint-disable-next-line @typescript-eslint/camelcase
    private UpdateProxies_Simd(
      proxies: GrowableBuffer<ParticleSystem.Proxy>,
    ): void;
    private UpdateProxies(proxies: GrowableBuffer<ParticleSystem.Proxy>): void;
    private SortProxies(proxies: GrowableBuffer<ParticleSystem.Proxy>): void;
    private FilterContacts(contacts: GrowableBuffer<ParticleContact>): void;
    private NotifyContactListenerPreContact(particlePairs: ParticlePairSet): void;
    private NotifyContactListenerPostContact(
      particlePairs: ParticlePairSet,
    ): void;
    private UpdateContacts(exceptZombie: boolean): void;
    private NotifyBodyContactListenerPreContact(
      fixtureSet: FixtureParticleSet,
    ): void;
    private NotifyBodyContactListenerPostContact(
      fixtureSet: FixtureParticleSet,
    ): void;
    private UpdateBodyContacts(): void;

    private Solve(step: TimeStep): void;
    private SolveCollision(step: TimeStep): void;
    private LimitVelocity(step: TimeStep): void;
    private SolveGravity(step: TimeStep): void;
    private SolveBarrier(step: TimeStep): void;
    private SolveStaticPressure(step: TimeStep): void;
    private ComputeWeight(): void;
    private SolvePressure(step: TimeStep): void;
    private SolveDamping(step: TimeStep): void;
    private SolveRigidDamping(): void;
    private SolveExtraDamping(): void;
    private SolveWall(): void;
    private SolveRigid(step: TimeStep): void;
    private SolveElastic(step: TimeStep): void;
    private SolveSpring(step: TimeStep): void;
    private SolveTensile(step: TimeStep): void;
    private SolveViscous(): void;
    private SolveRepulsive(step: TimeStep): void;
    private SolvePowder(step: TimeStep): void;
    private SolveSolid(step: TimeStep): void;
    private SolveForce(step: TimeStep): void;
    private SolveColorMixing(): void;
    private SolveZombie(): void;
    /// Destroy all particles which have outlived their lifetimes set by
    /// SetParticleLifetime().
    private SolveLifetimes(step: TimeStep): void;
    private RotateBuffer(start: number, mid: number, end: number): void;

    private GetCriticalVelocity(step: TimeStep): number;
    private GetCriticalVelocitySquared(step: TimeStep): number;
    private GetCriticalPressure(step: TimeStep): number;
    private GetParticleStride(): number;
    private GetParticleMass(): number;
    private GetParticleInvMass(): number;

    /**
     * Get the world's contact filter if any particles with the
     * contactFilterParticle flag are present in the system.
     */
    private GetFixtureContactFilter(): ContactFilter;

    /**
     * Get the world's contact filter if any particles with the
     * particleContactFilterParticle flag are present in the system.
     */
    private GetParticleContactFilter(): ContactFilter;

    /**
     * Get the world's contact listener if any particles with the
     * fixtureContactListenerParticle flag are present in the system.
     */
    private GetFixtureContactListener(): ContactListener;

    /**
     * Get the world's contact listener if any particles with the
     * particleContactListenerParticle flag are present in the system.
     */
    private GetParticleContactListener(): ContactListener;

    private SetUserOverridableBuffer<T>(
      buffer: ParticleSystem.UserOverridableBuffer<T>,
      newBufferData: T,
      newCapacity: number,
    ): void;

    private SetGroupFlags(group: ParticleGroup, flags: number): void;

    private RemoveSpuriousBodyContacts(): void;
    private static BodyContactCompare(
      lhs: ParticleBodyContact,
      rhs: ParticleBodyContact,
    ): boolean;

    private DetectStuckParticle(particle: number): void;

    /**
     * Determine whether a particle index is valid.
     * @param index
     */
    private ValidateParticleIndex(index: number): boolean;

    /**
     * Get the time elapsed in b2ParticleSystemDef::lifetimeGranularity.
     */
    private GetQuantizedTimeElapsed(): number;

    /**
     * Convert a lifetime in seconds to an expiration time.
     * @param lifetime
     */
    private LifetimeToExpirationTime(lifetime: number): number;

    private ForceCanBeApplied(flags: number): boolean;
    private PrepareForceBuffer(): void;

    private IsRigidGroup(group: ParticleGroup): boolean;
    private GetLinearVelocity(
      group: ParticleGroup,
      particleIndex: number,
      point: Vec2,
    ): Vec2;
    private InitDampingParameter(
      invMass: number,
      invInertia: number,
      tangentDistance: number,
      mass: number,
      inertia: number,
      center: Vec2,
      point: Vec2,
      normal: Vec2,
    ): void;
    private InitDampingParameterWithRigidGroupOrParticle(
      invMass: number,
      invInertia: number,
      tangentDistance: number,
      isRigidGroup: boolean,
      group: ParticleGroup,
      particleIndex: number,
      point: Vec2,
      normal: Vec2,
    ): void;
    private ComputeDampingImpulse(
      invMassA: number,
      invInertiaA: number,
      tangentDistanceA: number,
      invMassB: number,
      invInertiaB: number,
      tangentDistanceB: number,
      normalVelocity: number,
    ): number;
    private ApplyDamping(
      invMass: number,
      invInertia: number,
      tangentDistance: number,
      isRigidGroup: boolean,
      group: ParticleGroup,
      particleIndex: number,
      impulse: number,
      normal: Vec2,
    ): void;

    private paused: boolean;
    private timestamp: number;
    private allParticleFlags: number;
    private needsUpdateAllParticleFlags: boolean;
    private allGroupFlags: number;
    private needsUpdateAllGroupFlags: boolean;
    private hasForce: boolean;
    private iterationIndex: number;
    private inverseDensity: number;
    private particleDiameter: number;
    private inverseDiameter: number;
    private squaredDiameter: number;

    private count: number;
    private internalAllocatedCapacity: number;
    // Allocator for b2ParticleHandle instances.
    private handleAllocator: SlabAllocator<ParticleHandle>;
    // Maps particle indicies to  handles.
    private handleIndexBuffer: ParticleSystem.UserOverridableBuffer<
      ParticleHandle
    >;
    private flagsBuffer: ParticleSystem.UserOverridableBuffer<number>;
    private positionBuffer: ParticleSystem.UserOverridableBuffer<Vec2>;
    private velocityBuffer: ParticleSystem.UserOverridableBuffer<Vec2>;
    private forceBuffer: Vec2;
    /// m_weightBuffer is populated in ComputeWeight and used in
    /// ComputeDepth(), SolveStaticPressure() and SolvePressure().
    private weightBuffer: number;
    /// When any particles have the flag b2_staticPressureParticle,
    /// m_staticPressureBuffer is first allocated and used in
    /// SolveStaticPressure() and SolvePressure().  It will be reallocated on
    /// subsequent CreateParticle() calls.
    private staticPressureBuffer: number;
    /// m_accumulationBuffer is used in many functions as a temporary buffer
    /// for scalar values.
    private accumulationBuffer: number;
    /// When any particles have the flag b2_tensileParticle,
    /// m_accumulation2Buffer is first allocated and used in SolveTensile()
    /// as a temporary buffer for vector values.  It will be reallocated on
    /// subsequent CreateParticle() calls.
    private accumulation2Buffer: Vec2;
    /// When any particle groups have the flag b2_solidParticleGroup,
    /// m_depthBuffer is first allocated and populated in ComputeDepth() and
    /// used in SolveSolid(). It will be reallocated on subsequent
    /// CreateParticle() calls.
    private depthBuffer: number;
    private colorBuffer: ParticleSystem.UserOverridableBuffer<ParticleColor>;
    private groupBuffer: ParticleGroup;
    private userDataBuffer: ParticleSystem.UserOverridableBuffer<void>;

    // Stuck particle detection parameters and record keeping
    private stuckThreshold: number;
    private m_lastBodyContactStepBuffer: ParticleSystem.UserOverridableBuffer<
      number
    >;
    private m_bodyContactCountBuffer: ParticleSystem.UserOverridableBuffer<
      number
    >;
    private m_consecutiveContactStepsBuffer: ParticleSystem.UserOverridableBuffer<
      number
    >;
    private m_stuckParticleBuffer: GrowableBuffer<number>;
    private m_proxyBuffer: GrowableBuffer<ParticleSystem.Proxy>;
    private m_contactBuffer: GrowableBuffer<ParticleContact>;
    private m_bodyContactBuffer: GrowableBuffer<ParticleBodyContact>;
    private m_pairBuffer: GrowableBuffer<ParticlePair>;
    private m_triadBuffer: GrowableBuffer<ParticleTriad>;

    /// Time each particle should be destroyed relative to the last time
    /// m_timeElapsed was initialized.  Each unit of time corresponds to
    /// ParticleSystemDef.lifetimeGranularity seconds.
    private expirationTimeBuffer: ParticleSystem.UserOverridableBuffer<number>;
    /// List of particle indices sorted by expiration time.
    private indexByExpirationTimeBuffer: ParticleSystem.UserOverridableBuffer<
      number
    >;
    /// Time elapsed in 32:32 fixed point.  Each non-fractional unit of time
    /// corresponds to b2ParticleSystemDef::lifetimeGranularity seconds.
    private timeElapsed: number;
    /// Whether the expiration time buffer has been modified and needs to be
    /// resorted.
    private expirationTimeBufferRequiresSorting: boolean;

    private groupCount: number;
    private groupList: ParticleGroup;

    private def: ParticleSystemDef;

    private world: World;
    private prev: ParticleSystem;
    private next: ParticleSystem;
  }

  export namespace ParticleSystem {
    export class UserOverridableBuffer<T> {
      constructor();
      data: T;
      userSuppliedCapacity: number;
    }

    /// Used for detecting particle contacts
    export interface Proxy {
      index: number;
      tag: number;
    }

    /// Class for filtering pairs or triads.
    export class ConnectionFilter {
      /**
       * Is the particle necessary for connection?
       * A pair or a triad should contain at least one 'necessary' particle.
       */
      IsNecessary(index: number): boolean;

      /**
       * An additional condition for creating a pair.
       */
      ShouldCreatePair(a: number, b: number): boolean;

      /**
       * An additional condition for creating a triad.
       */
      ShouldCreateTriad(a: number, b: number, c: number): boolean;
    }

    /// InsideBoundsEnumerator enumerates all particles inside the given bounds.
    export class InsideBoundsEnumerator {
      /// Construct an enumerator with bounds of tags and a range of proxies.
      constructor(lower: number, upper: number, first: Proxy, last: Proxy);

      /**
       * Get index of the next particle. Returns b2_invalidParticleIndex if
       * there are no more particles.
       */
      GetNext(): number;

      // The lower and upper bound of x component in the tag.
      private xLower: number;
      private xUpper: number;

      // The lower and upper bound of y component in the tag.
      private yLower: number;
      private yUpper: number;

      /// The range of proxies.
      private first: Proxy;
      private last: Proxy;
    }

    /// Node of linked lists of connected particles
    export interface ParticleListNode {
      /// The head of the list.
      list: ParticleListNode;
      /// The next node in the list.
      next: ParticleListNode;
      /// Number of entries in the list. Valid only for the node at the head
      /// of the list.
      count: number;
      /// Particle index.
      index: number;
    }
  }
}

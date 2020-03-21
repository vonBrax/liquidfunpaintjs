/**
 * Joints and fixtures are destroyed when their associated
 * body is destroyed. Implement this listener so that you
 * may nullify references to these joints and shapes.
 */
declare class DestructionListener {
  /**
   * Called when any joint is about to be destroyed due
   * to the destruction of one of its attached bodies.
   * @param joint
   */
  SayGoodbye(joint: Joint): void;

  /**
   * Called when any fixture is about to be destroyed due
   * to the destruction of its parent body.
   * @param fixture
   */
  SayGoodbye(fixture: Fixture): void;

  /**
   * Called when any particle group is about to be destroyed.
   * @param group
   */
  SayGoodbye(group: ParticleGroup): void;

  /**
   * Called when a particle is about to be destroyed.
   * The index can be used in conjunction with
   * ParticleSystem.GetUserDataBuffer() or
   * ParticleSystem.GetParticleHandleFromIndex() to determine which
   * particle has been destroyed.
   * @param particleSystem
   * @param index
   */
  SayGoodbye(particleSystem: ParticleSystem, index: number): void;
}

/**
 * Implement this class to provide collision filtering. In other words, you can implement
 * this class if you want finer control over contact creation.
 */
declare class ContactFilter {
  /**
   * Return true if contact calculations should be performed between these two shapes.
   * @warning for performance reasons this is only called when the AABBs begin to overlap.
   * @param fixtureA
   * @param fixtureB
   */
  ShouldCollide(fixtureA: Fixture, fixtureB: Fixture): boolean;

  /**
   * Return true if contact calculations should be performed between a
   * fixture and particle.  This is only called if the
   * fixtureContactListenerParticle flag is set on the particle.
   * @param fixture
   * @param particleSystem
   * @param particleIndex
   */
  ShouldCollide(
    fixture: Fixture,
    particleSystem: ParticleSystem,
    particleIndex: number,
  ): boolean;

  /**
   * Return true if contact calculations should be performed between two
   * particles.  This is only called if the
   * particleContactListenerParticle flag is set on the particle.
   * @param particleSystem
   * @param particleIndexA
   * @param particleIndexB
   */
  ShouldCollide(
    particleSystem: ParticleSystem,
    particleIndexA: number,
    particleIndexB: number,
  ): boolean;
}

/**
 * Contact impulses for reporting. Impulses are used instead of forces because
 * sub-step forces may approach infinity for rigid body collisions. These
 * match up one-to-one with the contact points in b2Manifold.
 */
declare interface ContactImpulse {
  normalImpulses: number[]; // [b2_maxManifoldPoints];
  tangentImpulses: number[]; // [b2_maxManifoldPoints];
  count: number;
}

/**
 * Implement this class to get contact information. You can use these results for
 * things like sounds and game logic. You can also get contact results by
 * traversing the contact lists after the time step. However, you might miss
 * some contacts because continuous physics leads to sub-stepping.
 * Additionally you may receive multiple callbacks for the same contact in a
 * single time step.
 * You should strive to make your callbacks efficient because there may be
 * many callbacks per time step.
 * @warning You cannot create/destroy Box2D entities inside these callbacks.
 */
declare class ContactListener {
  /**
   * Called when two fixtures begin to touch.
   * @param contact
   */
  BeginContact(contact: Contact): void;

  /**
   * Called when a fixture and particle start touching if the
   * fixtureContactFilterParticle flag is set on the particle.
   * @param particleSystem
   * @param particleBodyContact
   */
  BeginContact(
    particleSystem: ParticleSystem,
    particleBodyContact: ParticleBodyContact,
  ): void;

  /**
   * Called when two particles start touching if
   * particleContactFilterParticle flag is set on either particle.
   * @param particleSystem
   * @param particleContact
   */
  BeginContact(
    particleSystem: ParticleSystem,
    particleContact: ParticleContact,
  ): void;

  /**
   * Called when two fixtures cease to touch.
   * @param contact
   */
  EndContact(contact: Contact): void;

  /**
   * Called when a fixture and particle stop touching if the
   * fixtureContactFilterParticle flag is set on the particle.
   * @param fixture
   * @param particleSystem
   * @param index
   */
  EndContact(
    fixture: Fixture,
    particleSystem: ParticleSystem,
    index: number,
  ): void;

  /**
   * Called when two particles start touching if
   * particleContactFilterParticle flag is set on either particle.
   * @param particleSystem
   * @param indexA
   * @param indexB
   */
  EndContact(
    particleSystem: ParticleSystem,
    indexA: number,
    indexB: number,
  ): void;

  /**
   * This is called after a contact is updated. This allows you to inspect a
   * contact before it goes to the solver. If you are careful, you can modify the
   * contact manifold (e.g. disable contact).
   * A copy of the old manifold is provided so that you can detect changes.
   * Note: this is called only for awake bodies.
   * Note: this is called even when the number of contact points is zero.
   * Note: this is not called for sensors.
   * Note: if you set the number of contact points to zero, you will not
   * get an EndContact callback. However, you may get a BeginContact callback
   * the next step.
   * @param contact
   * @param oldManifold
   */
  PreSolve(contact: Contact, oldManifold: Manifold): void;

  /**
   * This lets you inspect a contact after the solver is finished. This is useful
   * for inspecting impulses.
   * Note: the contact manifold does not include time of impact impulses, which can be
   * arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly
   * in a separate data structure.
   * Note: this is only called for contacts that are touching, solid, and awake.
   * @param contact
   * @param impulse
   */
  PostSolve(contact: Contact, impulse: ContactImpulse): void;
}

/**
 * Callback class for AABB queries.
 * See World.Query
 */
declare class QueryCallback {
  /**
   * Called for each fixture found in the query AABB.
   * @return false to terminate the query.
   * @param fixture
   */
  ReportFixture(fixture: Fixture): boolean;

  /**
   * Called for each particle found in the query AABB.
   * @return false to terminate the query
   * @param particleSystem
   * @param index
   */
  ReportParticle(particleSystem: ParticleSystem, index: number): boolean;

  /**
   * Cull an entire particle system from b2World::QueryAABB. Ignored for
   * ParticleSystem.QueryAABB.
   * @return true if you want to include particleSystem in the AABB query,
   * or false to cull particleSystem from the AABB query.
   * @param particleSystem
   */
  ShouldQueryParticleSystem(particleSystem: ParticleSystem): boolean;
}

/**
 * Callback class for ray casts.
 * See World.RayCast
 */
declare class RayCastCallback {
  /**
   * Called for each fixture found in the query. You control how the ray cast
   * proceeds by returning a float:
   * return -1: ignore this fixture and continue
   * return 0: terminate the ray cast
   * return fraction: clip the ray to this point
   * return 1: don't clip the ray and continue
   * @param fixture the fixture hit by the ray
   * @param point the point of initial intersection
   * @param normal the normal vector at the point of intersection
   * @param fraction
   * @return -1 to filter, 0 to terminate, fraction to clip the ray for
   * closest hit, 1 to continue
   */
  ReportFixture(
    fixture: Fixture,
    point: Vec2,
    normal: Vec2,
    fraction: number,
  ): number;

  /**
   * Called for each particle found in the query. You control how the ray
   * cast proceeds by returning a float:
   * return <=0: ignore the remaining particles in this particle system
   * return fraction: ignore particles that are 'fraction' percent farther
   *   along the line from 'point1' to 'point2'. Note that 'point1' and
   *   'point2' are parameters to b2World::RayCast.
   * @param particleSystem the particle system containing the particle
   * @param index the index of the particle in particleSystem
   * @param point the point of intersection bt the ray and the particle
   * @param normal the normal vector at the point of intersection
   * @param fraction percent (0.0~1.0) from 'point0' to 'point1' along the
   *   ray. Note that 'point1' and 'point2' are parameters to
   *   World.RayCast.
   * @return <=0 to ignore rest of particle system, fraction to ignore
   * particles that are farther away.
   */
  ReportParticle(
    particleSystem: ParticleSystem,
    index: number,
    point: Vec2,
    normal: Vec2,
    fraction: number,
  ): number;

  /**
   * Cull an entire particle system from b2World::RayCast. Ignored in
   * ParticleSystem.RayCast.
   * @param particleSystem
   * @return true if you want to include particleSystem in the RayCast, or
   * false to cull particleSystem from the RayCast.
   */
  ShouldQueryParticleSystem(particleSystem: ParticleSystem): boolean;
}

declare namespace LiquidFun {
  /**
   * @file
   */

  /**
   * The particle type. Can be combined with the | operator.
   */
  export enum ParticleFlag {
    // Water particle.
    waterParticle = 0,
    // Removed after next simulation step.
    zombieParticle = 1 << 1,
    // Zero velocity.
    wallParticle = 1 << 2,
    // With restitution from stretching.
    springParticle = 1 << 3,
    // With restitution from deformation.
    elasticParticle = 1 << 4,
    // With viscosity.
    viscousParticle = 1 << 5,
    // Without isotropic pressure.
    powderParticle = 1 << 6,
    // With surface tension.
    tensileParticle = 1 << 7,
    // Mix color between contacting particles.
    colorMixingParticle = 1 << 8,
    // Call b2DestructionListener on destruction.
    destructionListenerParticle = 1 << 9,
    // Prevents other particles from leaking.
    barrierParticle = 1 << 10,
    // Less compressibility.
    staticPressureParticle = 1 << 11,
    // Makes pairs or triads with other particles.
    reactiveParticle = 1 << 12,
    // With high repulsive force.
    repulsiveParticle = 1 << 13,
    // Call b2ContactListener when this particle is about to interact with
    // a rigid body or stops interacting with a rigid body.
    // This results in an expensive operation compared to using
    // b2_fixtureContactFilterParticle to detect collisions between
    // particles.
    fixtureContactListenerParticle = 1 << 14,
    // Call b2ContactListener when this particle is about to interact with
    // another particle or stops interacting with another particle.
    // This results in an expensive operation compared to using
    // b2_particleContactFilterParticle to detect collisions between
    // particles.
    particleContactListenerParticle = 1 << 15,
    // Call b2ContactFilter when this particle interacts with rigid bodies.
    fixtureContactFilterParticle = 1 << 16,
    // Call b2ContactFilter when this particle interacts with other
    // particles.
    particleContactFilterParticle = 1 << 17,
  }

  /// Small color object for each particle
  export class ParticleColor implements ClassHandle<ParticleColor> {
    /**
     * Modified class declaration for embind:
     */
    clone(): ParticleColor;
    delete(): void;
    deleteLater(): ClassHandle<ParticleColor>;
    isAliasOf(other: ClassHandle<ParticleColor>): boolean;
    isDeleted(): boolean;
    /** */

    constructor();
    /**
     * Constructor with four elements: r (red), g (green), b (blue), and a
     * (opacity).
     * Each element can be specified 0 to 255.
     * @param r
     * @param g
     * @param b
     * @param a
     */
    constructor(r: number, g: number, b: number, a: number);

    /**
     * Constructor that initializes the above four elements with the value of
     * the b2Color object.
     * @param color
     */
    constructor(color: Color);

    /**
     * True when all four color elements equal 0. When true, a particle color
     * buffer isn't allocated by CreateParticle().
     */
    IsZero(): boolean;

    /**
     * Used internally to convert the value of b2Color.
     */
    GetColor(): Color;

    /**
     * Sets color for current object using the four elements described above.
     * @param r_
     * @param g_
     * @param b_
     * @param a_
     */
    Set(r_: number, g_: number, b_: number, a_: number): void;

    /**
     * Initializes the object with the value of the b2Color.
     * @param color
     */
    Set(color: Color): void;

    /**
     * Mix mixColor with this color using strength to control how much of
     * mixColor is mixed with this color and vice versa.  The range of
     * strength is 0..128 where 0 results in no color mixing and 128 results
     * in an equal mix of both colors.  strength 0..128 is analogous to an
     * alpha channel value between 0.0f..0.5f.
     * @param mixColor
     * @param strength
     */
    Mix(mixColor: ParticleColor, strength: number): void;

    /**
     * Mix colorA with colorB using strength to control how much of
     * colorA is mixed with colorB and vice versa.  The range of
     * strength is 0..128 where 0 results in no color mixing and 128 results
     * in an equal mix of both colors.  strength 0..128 is analogous to an
     * alpha channel value between 0.0f..0.5f.
     * @param colorA
     * @param colorB
     * @param strength
     */
    static MixColors(
      colorA: ParticleColor,
      colorB: ParticleColor,
      strength: number,
    ): void;

    /**
     * Generalization of the multiply operator using a scalar in-place
     * multiplication.
     * @param s
     */
    private MultiplyByScalar<T>(s: T): ParticleColor;

    r: number;
    g: number;
    b: number;
    a: number;

    /**
     * Maximum value of a b2ParticleColor component.
     */
    protected static maxValue: number;

    /**
     * 1.0 / maxValue.
     */
    protected static inverseMaxValue: number;

    /**
     * Number of bits used to store each b2ParticleColor component.
     */
    protected static bitsPerComponent: number;
  }

  // extern b2ParticleColor b2ParticleColor_zero;

  /**
   * A particle definition holds all the data needed to construct a particle.
   * You can safely re-use these definitions.
   */
  export class ParticleDef {
    constructor();

    // \brief Specifies the type of particle (see #ParticleFlag).
    //
    // A particle may be more than one type.
    // Multiple types are chained by logical sums, for example:
    // pd.flags = elasticParticle | viscousParticle
    flags: number;

    // The world position of the particle.
    position: Vec2;

    // The linear velocity of the particle in world co-ordinates.
    velocity: Vec2;

    // The color of the particle.
    color: ParticleColor;

    // Lifetime of the particle in seconds.  A value <= 0.0f indicates a
    // particle with infinite lifetime.
    lifetime: number;

    // Use this to store application-specific body data.
    userData: void;

    // An existing particle group to which the particle will be added.
    group: ParticleGroup;
  }

  /**
   * A helper function to calculate the optimal number of iterations.
   * @param gravity
   * @param radius
   * @param timeStep
   */
  export function CalculateParticleIterations(
    gravity: number,
    radius: number,
    timeStep: number,
  ): number;

  /**
   * Handle to a particle. Particle indices are ephemeral: the same index might
   * refer to a different particle, from frame-to-frame. If you need to keep a
   * reference to a particular particle across frames, you should acquire a
   * b2ParticleHandle. Use #b2ParticleSystem::GetParticleHandleFromIndex() to
   * retrieve the b2ParticleHandle of a particle from the particle system.
   */
  export class ParticleHandle extends TypedIntrusiveListNode<ParticleHandle> {
    // Index of the particle within the particle system.
    private index: number;

    // Initialize the index associated with the handle to an invalid index.
    constructor();

    /**
     * Get the index of the particle associated with this handle.
     */
    GetIndex(): number;

    /**
     * Set the index of the particle associated with this handle.
     * @param index
     */
    private SetIndex(index: number): void;
  }
}

declare namespace LiquidFun {

  /**
   * @file
   */

  /**
   * The particle group type.  Can be combined with the | operator.
   */
  export enum ParticleGroupFlag {
    // Prevents overlapping or leaking.
    solidParticleGroup = 1 << 0,

    // Keeps its shape.
    rigidParticleGroup = 1 << 1,

    // Won't be destroyed if it gets empty.
    particleGroupCanBeEmpty = 1 << 2,

    // Will be destroyed on next simulation step.
    particleGroupWillBeDestroyed = 1 << 3,

    // Updates depth data on next simulation step.
    particleGroupNeedsUpdateDepth = 1 << 4,
    particleGroupInternalMask = particleGroupWillBeDestroyed |
      particleGroupNeedsUpdateDepth,
  }

  /**
   * A particle group definition holds all the data needed to construct a
   * particle group.  You can safely re-use these definitions.
   */
  export class ParticleGroupDef implements ClassHandle<ParticleGroupDef> {
    /**
     * Modified class declaration for embind:
     */
    clone(): ParticleGroupDef;
    delete(): void;
    deleteLater(): ClassHandle<ParticleGroupDef>;
    isAliasOf(other: ClassHandle<ParticleGroupDef>): boolean;
    isDeleted(): boolean;
    /** */

    constructor();

    // The particle-behavior flags (See #b2ParticleFlag).
    flags: number;

    // The group-construction flags (See #b2ParticleGroupFlag).
    groupFlags: number;

    // The world position of the group.
    // Moves the group's shape a distance equal to the value of position.
    position: Vec2;

    // The world angle of the group in radians.
    // Rotates the shape by an angle equal to the value of angle.
    angle: number;

    // The linear velocity of the group's origin in world co-ordinates.
    linearVelocity: Vec2;

    // The angular velocity of the group.
    angularVelocity: number;

    // The color of all particles in the group.
    color: ParticleColor;

    // The strength of cohesion among the particles in a group with flag
    // elasticParticle or springParticle.
    strength: number;

    // The shape where particles will be added.
    shape: Shape;

    // A array of shapes where particles will be added.
    shapes: Shape;

    // The number of shapes.
    shapeCount: number;

    // The interval of particles in the shape.
    // If it is 0, particleStride * particleDiameter is used instead.
    stride: number;

    // The number of particles in addition to ones added in the shape.
    particleCount: number;

    // The initial positions of the particleCount particles.
    positionData: Vec2;

    // Lifetime of the particle group in seconds.  A value <= 0.0f indicates a
    // particle group with infinite lifetime.
    lifetime: number;

    // Use this to store application-specific group data.
    userData: void;

    // An existing particle group to which the particles will be added.
    group: ParticleGroup;

    /* if LIQUIDFUN_EXTERNAL_LANGUAGE_API */

    // Storage for constructed CircleShapes from an incoming vertex list
    circleShapes: CircleShape;

    // True if we create the shapes array internally.
    owhShapesArray: boolean;

    // Clean up all memory associated with SetCircleShapesFromVertexList
    FreeShapesMemory(): void;

    // From a vertex list created by an external language API, construct
    // a list of circle shapes that can be used to create a b2ParticleGroup
    // This eliminates cumbersome array-interfaces between languages.
    SetCircleShapesFromVertexList(
      inBuf: any,
      numShapes: number,
      radius: number,
    ): void;

    // Set position with direct floats.
    SetPosition(x: number, y: number): void;

    // Set color with direct ints.
    SetColor(r: number, g: number, b: number, a: number): void;
  }

  /**
   * A group of particles. ParticleGroup.CreateParticleGroup creates these.
   */
  export class ParticleGroup {
    private system: ParticleSystem;
    private firstIndex: number;
    private lastIndex: number;
    private groupFlags: number;
    private strength: number;
    private prev: ParticleGroup;
    private next: ParticleGroup;

    private timestamp: number;
    private mass: number;
    private inertia: number;
    private center: Vec2;
    private linearVelocity: Vec2;
    private angularVelocity: number;
    private transform: Transform;

    private userData: void;

    private constructor();

    /**
     * Get the next particle group from the list in World.
     */
    GetNext(): ParticleGroup;

    /**
     * Get the particle system that holds this particle group.
     */
    GetParticleSystem(): ParticleSystem;

    /**
     * Get the number of particles.
     */
    GetParticleCount(): number;

    /**
     * Get the offset of this group in the global particle buffer
     */
    GetBufferIndex(): number;

    /**
     * Does this group contain the particle.
     * @param index
     */
    ContainsParticle(index: number): boolean;

    /**
     * Get the logical sum of particle flags.
     */
    GetAllParticleFlags(): number;

    /**
     * Get the construction flags for the group.
     */
    GetGroupFlags(): number;

    /**
     * Set the construction flags for the group.
     * @param flags
     */
    SetGroupFlags(flags: number): void;

    /**
     * Get the total mass of the group: the sum of all particles in it.
     */
    GetMass(): number;

    /**
     * Get the moment of inertia for the group.
     */
    GetInertia(): number;

    /**
     * Get the center of gravity for the group.
     */
    GetCenter(): Vec2;

    /**
     * Get the linear velocity of the group.
     */
    GetLinearVelocity(): Vec2;

    /**
     * Get the angular velocity of the group.
     */
    GetAngularVelocity(): number;

    /**
     * Get the position of the group's origin and rotation.
     * Used only with groups of rigid particles.
     */
    GetTransform(): Transform;

    /**
     * Get position of the particle group as a whole.
     * Used only with groups of rigid particles.
     */
    GetPosition(): Vec2;

    /**
     * Get the rotational angle of the particle group as a whole.
     * Used only with groups of rigid particles.
     */
    GetAngle(): number;

    /**
     * Get the world linear velocity of a world point, from the average linear
     * and angular velocities of the particle group.
     * @param worldPoint a point in world coordinates.
     * @return the world velocity of a point.
     */
    GetLinearVelocityFromWorldPoint(worldPoint: Vec2): Vec2;

    /**
     * Get the user data pointer that was provided in the group definition.
     */
    GetUserData(): void;

    /**
     * Set the user data. Use this to store your application specific data.
     * @param data
     */
    SetUserData(data: void): void;

    /**
     * Call ParticleSystem.ApplyForce for every particle in the group.
     * @param force
     */
    ApplyForce(force: Vec2): void;

    /**
     * Call ParticleSystem.ApplyLinearImpulse for every particle in the
     * group.
     * @param impulse
     */
    ApplyLinearImpulse(impulse: Vec2): void;

    /**
     * Destroy all the particles in this group.
     * This function is locked during callbacks.
     * @param callDestructionListener Whether to call the world b2DestructionListener for each
     * particle is destroyed.
     * @warning This function is locked during callbacks.
     */
    DestroyParticles(callDestructionListener: boolean): void;

    /**
     * Destroy all particles in this group without enabling the destruction
     * callback for destroyed particles.
     * This function is locked during callbacks.
     * @warning This function is locked during callbacks.
     */
    DestroyParticles(): void;

    private UpdateStatistics(): void;
  }
}

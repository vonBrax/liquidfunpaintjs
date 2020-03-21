/**
 * @file
 * Global tuning constants based on meters-kilograms-seconds (MKS) units.
 */

// Collision

/// The maximum number of contact points between two convex shapes. Do
/// not change this value.
declare const maxManifoldPoints: number;

/// The maximum number of vertices on a convex polygon. You cannot increase
/// this too much because b2BlockAllocator has a maximum object size.
declare const maxPolygonVertices: number;

/// This is used to fatten AABBs in the dynamic tree. This allows proxies
/// to move by a small amount without triggering a tree adjustment.
/// This is in meters.
declare const aabbExtension: number;

/// This is used to fatten AABBs in the dynamic tree. This is used to predict
/// the future position based on the current displacement.
/// This is a dimensionless multiplier.
declare const aabbMultiplier: number;

/// A small length used as a collision and constraint tolerance. Usually it is
/// chosen to be numerically significant, but visually insignificant.
declare const linearSlop: number;

/// A small angle used as a collision and constraint tolerance. Usually it is
/// chosen to be numerically significant, but visually insignificant.
declare const angularSlop: number;

/// The radius of the polygon/edge shape skin. This should not be modified. Making
/// this smaller means polygons will have an insufficient buffer for continuous collision.
/// Making it larger may create artifacts for vertex collision.
declare const polygonRadius: number;

/// Maximum number of sub-steps per contact in continuous physics simulation.
declare const maxSubSteps: number;

// Dynamics

/// Maximum number of contacts to be handled to solve a TOI impact.
declare const maxTOIContacts: number;

/// A velocity threshold for elastic collisions. Any collision with a relative linear
/// velocity below this threshold will be treated as inelastic.
declare const velocityThreshold: number;

/// The maximum linear position correction used when solving constraints. This helps to
/// prevent overshoot.
declare const maxLinearCorrection: number;

/// The maximum angular position correction used when solving constraints. This helps to
/// prevent overshoot.
declare const maxAngularCorretion: number;

/// The maximum linear velocity of a body. This limit is very large and is used
/// to prevent numerical problems. You shouldn't need to adjust this.
declare const maxTranslation: number;
declare const maxTranslationSquared: number;

/// The maximum angular velocity of a body. This limit is very large and is used
/// to prevent numerical problems. You shouldn't need to adjust this.
declare const maxRotation: number;
declare const maxRotationSquared: number;

/// This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
/// that overlap is removed in one time step. However using values close to 1 often lead
/// to overshoot.
declare const baumgarte: number;
declare const toiBaugaurte: number;

// Particle

/// A symbolic constant that stands for particle allocation error.
declare const invalidParticleIndex: number;

/// The default distance between particles, multiplied by the particle diameter.
declare const particleStride: number;

/// The minimum particle weight that produces pressure.
declare const minParticleWeight: number;

/// The upper limit for particle pressure.
declare const maxParticlePressure: number;

/// The upper limit for force between particles.
declare const maxParticleForce: number;

/// The maximum distance between particles in a triad, multiplied by the
/// particle diameter.
declare const maxTriadDistance: number;
declare const maxTriadDistanceSquared: number;

/// The initial size of particle data buffers.
declare const minParticleSystemBufferCapacity: number;

/// The time into the future that collisions against barrier particles will be detected.
declare const barrierCollisionTime: number;

// Sleep

/// The time that a body must be still before it will go to sleep.
declare const timeToSleep: number;

/// A body cannot sleep if its linear velocity is above this tolerance.
declare const linearSleepTolerance: number;

/// A body cannot sleep if its angular velocity is above this tolerance.
declare const angularSleepTolerance: number;

// Memory Allocation
// ... todo

declare interface Version {
  major: number;
  minor: number;
  revision: number;
}

declare const version: Version;

declare const liquidFunVersion: Version;

declare const liquitFunVersionString: string;

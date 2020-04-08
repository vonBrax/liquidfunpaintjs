/**
 * Profiling data. Times are in milliseconds.
 */
declare interface Profile {
  step: number;
  collide: number;
  solve: number;
  solveInit: number;
  solveVelocity: number;
  solvePosition: number;
  broadphase: number;
  solveTOI: number;
}

/**
 * This is an internal structure.
 */
declare interface TimeStep {
  dt: number; // time step
  inv_dt: number; // inverse time step (0 if dt == 0).
  dtRatio: number; // dt * inv_dt0
  velocityIterations: number;
  positionIterations: number;
  particleIterations: number;
  warmStarting: boolean;
}

/**
 * This is an internal structure.
 */
declare interface Position {
  c: Vec2;
  a: number;
}

/**
 * This is an internal structure.
 */
declare interface Velocity {
  v: Vec2;
  w: number;
}

/**
 * Solver Data
 */
declare interface SolverData {
  step: TimeStep;
  positions: Position;
  velocities: Velocity;
}

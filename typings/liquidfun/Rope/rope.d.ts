declare class RopeDef {
  vertices: Vec2;

  count: number;

  masses: number;

  gravity: Vec2;

  damping: number;

  // Stretching stiffness
  k2: number;

  // Bending stiffness. Values above 0.5 can make the simulation blow up.
  k3: number;

  constructor();
}

declare class Rope {
  private SolveC2(): void;
  private SolveC3(): void;

  private count: number;
  private ps: Vec2;
  private p0s: Vec2;
  private vs: Vec2;

  private ims: number;

  private Ls: number;
  private as: number;

  private gravity: Vec2;
  private damping: number;

  private k2: number;
  private k3: number;

  constructor();

  Initialize(def: RopeDef): void;

  Step(timeStep: number, iterations: number): void;

  GetVertexCount(): number;

  GetVertices(): Vec2;

  Draw(draw: Draw): void;

  SetAngle(angle: number): void;
}

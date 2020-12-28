declare namespace LiquidFun {
  /**
   * Color for debug drawing. Each value has the range [0,1].
   */
  export class Color {
    r: number;
    g: number;
    b: number;

    constructor();
    constructor(r: number, g: number, b: number);
    Set(ri: number, gi: number, bi: number): void;
  }

  // export namespace Draw {
  //   enum Type {
  //     shapeBit = 0x0001, ///< draw shapes
  //     jointBit = 0x0002, ///< draw joint connections
  //     aabbBit = 0x0004, ///< draw axis aligned bounding boxes
  //     pairBit = 0x0008, ///< draw broad-phase pairs
  //     centerOfMassBit = 0x0010, ///< draw center of mass frame
  //     particleBit = 0x0020, ///< draw particles
  //   }
  // }

  /**
   * Implement and register this class with a World to provide debug drawing of physics
   * entities in your game.
   */
  export class Draw {
    static shapeBit: number; ///< draw shapes
    static jointBit: number; ///< draw joint connections
    static aabbBit: number; ///< draw axis aligned bounding boxes
    static pairBit: number; ///< draw broad-phase pairs
    static centerOfMassBit: number; ///< draw center of mass frame
    static particleBit: number; ///< draw particles

    protected drawFlags: number;

    constructor();

    /**
     * Set the drawing flags.
     * @param flags
     */
    SetFlags(flags: number): void;

    /**
     * Get the drawing flags.
     */
    GetFlags(): number;

    /**
     * Append flags to the current flags.
     * @param flags
     */
    AppendFlags(flags: number): void;

    /**
     * Clear flags from the current flags.
     * @param flags
     */
    ClearFlags(flags: number): void;

    /**
     * Draw a closed polygon provided in CCW order.
     * @param vertices
     * @param vertexCount
     * @param color
     */
    DrawPolygon(vertices: Vec2[], vertexCount: number, color: Color): void;

    /**
     * Draw a solid closed polygon provided in CCW order.
     * @param vertices
     * @param vertexCount
     * @param color
     */
    DrawSolidPolygon(vertices: Vec2[], vertexCount: number, color: Color): void;

    /**
     * Draw a circle.
     * @param center
     * @param radius
     * @param color
     */
    DrawCircle(center: Vec2, radius: number, color: Color): void;

    /**
     * Draw a solid circle.
     * @param center
     * @param radius
     * @param colors
     * @param count
     */
    DrawSolidCircle(
      center: Vec2,
      radius: number,
      axis: Vec2,
      colors: Color,
    ): void;

    /**
     * Draw a particle array
     * @param centers
     * @param radius
     * @param colors
     * @param count
     */
    DrawParticles(
      centers: Vec2[],
      radius: number,
      colors: ParticleColor[],
      count: number,
    ): void;

    /**
     * Draw a line segment.
     * @param p1
     * @param p2
     * @param color
     */
    DrawSegment(p1: Vec2, p2: Vec2, color: Color): void;

    /**
     * Draw a transform. Choose your own length scale.
     * @param xf a transform.
     */
    DrawTransform(xf: Transform): void;
  }
}

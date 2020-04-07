import { mat4 } from 'gl-matrix';
import { ShaderProgram } from './shader';
import { ParticleRenderer } from './particle-renderer';
import { DebugRenderer } from './debug-renderer';
import { TextureRenderer } from './texture-renderer';
import { state } from './state';
import { AssetManager } from './util/asset-manager';
import { MainActivity } from './main-activity';
// import {} from '../util/types';

function createMatrix(): mat4 {
  const m4 = mat4.create();
  mat4.identity(m4);
  return m4;
}

/**
 * Renderer class. Contains the game update and render loop.
 *
 * This also contains the pointer to the LiquidFun world. The convention for
 * thread-safety is to called acquireWorld to obtain a thread-safe world
 * pointer, and releaseWorld when you are done with the object.
 */
// extends Observable implements GLSurfaceView.Renderer
export class Renderer {
  // Private constants
  private static _instance: Renderer = new Renderer();
  private static TAG = 'Renderer';
  private static ONE_SEC = 1000000000;
  // private static WORLD_HEIGHT = 3.0;
  private static WORLD_HEIGHT = 6.0;
  public static MAX_PARTICLE_COUNT = 5000;
  public static PARTICLE_RADIUS = 0.06;
  public static PARTICLE_REPULSIVE_STRENGTH = 0.5;
  public static DEBUG_DRAW = true;

  // Parameters for world simulation
  private static TIME_STEP = 1 / 60; // 60 fps
  private static VELOCITY_ITERATIONS = 6;
  private static POSITION_ITERATIONS = 2;
  private static PARTICLE_ITERATIONS = 5;
  private static BOUNDARY_THICKNESS = 20.0;

  // Public static constants; variables for reuse
  public static MAT4X4_IDENTITY: mat4 = createMatrix();

  // Public constants; records render states
  public sRenderWorldWidth = Renderer.WORLD_HEIGHT;
  public sRenderWorldHeight = Renderer.WORLD_HEIGHT;
  public sScreenWidth = 1;
  public sScreenHeight = 1;

  // Renderer class owns all Box2D objects, for thread-safety
  private mWorld: LiquidFun.World = null;
  private mParticleSystem: LiquidFun.ParticleSystem = null;
  private mBoundaryBody: LiquidFun.Body = null;

  // Variables for thread synchronization
  private mSimulation = false;

  private mParticleRenderer: ParticleRenderer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected mDebugRenderer: any = null;

  // Measure the frame rate
  totalFrames = -10000;
  private mFrames: number;
  private mStartTime: number;
  private mTime: number;

  // Override
  protected finalize(): void {
    this.deleteWorld();

    if (this.mDebugRenderer !== null) {
      /**
       * @todo Investigate what is the delete method.
       * - Not from DebugRenderer
       * - Not from b2Draw
       *
       * @update
       * It is probably introduced by swig and
       * it server the purpose of releasing memory
       * allocated by the native code (similar to embind)
       */
      // this.mDebugRenderer.delete();
      this.mDebugRenderer = null;
    }
  }

  public static getInstance(): Renderer {
    return this._instance;
  }

  public init(): void {
    // Adjust world height based on pixel density
    Renderer.WORLD_HEIGHT /= MainActivity.devicePixelRatio;

    // TS does not seem to initialize class properties
    // pointing to other static property
    this.sRenderWorldWidth = Renderer.WORLD_HEIGHT;
    this.sRenderWorldHeight = Renderer.WORLD_HEIGHT;

    // Initialize all the different renderers
    this.mParticleRenderer = new ParticleRenderer();

    if (Renderer.DEBUG_DRAW) {
      const dr = new DebugRenderer();

      // eslint-disable-next-line
      // @ts-ignore
      const Derived = Module.Draw.extend('Draw', {
        DrawPolygon: dr.DrawPolygon,
        DrawSolidPolygon: dr.DrawSolidPolygon,
        DrawCircle: dr.DrawCircle,
        DrawSolidCircle: dr.DrawSolidCircle,
        DrawParticles: dr.DrawParticles,
        DrawSegment: dr.DrawSegment,
        DrawTransform: dr.DrawTransform,
      });
      const instance = new Derived();
      // console.log(instance);
      instance.jsObj = dr;
      // eslint-disable-next-line
      // @ts-ignore
      dr.nativeObj = instance;
      // eslint-disable-next-line
      // @ts-ignore
      dr.SetFlags = instance.SetFlags;
      // eslint-disable-next-line
      // @ts-ignore
      dr.GetFlags = instance.GetFlags;
      // eslint-disable-next-line
      // @ts-ignore
      dr.$$ = instance.$$;
      // eslint-disable-next-line
      // @ts-ignore
      dr.__parent = instance.__parent;

      this.mDebugRenderer = dr;
      this.mDebugRenderer.SetFlags(
        0x0001 | 0x0020, // shapeBit // particleBit
        // this.mDebugRenderer.shapeBit | this.mDebugRenderer.particleBit,
      );
    }

    this.reset();

    this.mTime = self.performance.now() * 1000000;
  }

  // Override
  public onDrawFrame(/* GL10 */): void {
    // Show the frame rate
    if (state.get('stats')) {
      const time = self.performance.now() * 1000000;

      if (time - this.mTime > Renderer.ONE_SEC) {
        if (this.totalFrames < 0) {
          this.totalFrames = 0;
          this.mStartTime = time - 1;
        }
        const fps: number =
          (this.mFrames / (time - this.mTime)) * Renderer.ONE_SEC;
        const avefps: number =
          (this.totalFrames / (time - this.mStartTime)) * Renderer.ONE_SEC;
        const count: number = this.mParticleSystem.GetParticleCount();

        this.mTime = time;
        this.mFrames = 0;

        const msg = `
          ${fps} fps (Now)
          ${avefps} fps(Average)
          ${count} particles
          ${this.mParticleSystem.GetParticleGroupCount()} particle groups
          ${this.mWorld.GetBodyCount()} bodies
        `;
        // postCustomMessage({ type: 'log', value: msg });
        postMessage({
          target: 'custom',
          userData: { type: 'log', value: msg },
        });
      }
      this.mFrames++;
      this.totalFrames++;
    }

    this.update(Renderer.TIME_STEP);
    this.render();
    requestAnimationFrame(() => this.onDrawFrame());
  }

  // Override
  public onSurfaceChanged(
    gl: WebGLRenderingContext,
    width: number,
    height: number,
  ): void {
    gl.viewport(0, 0, width, height);

    /**
     * @todo:
     * Experimenting here setting WORLD_HEIGHT to be
     * 1% of the canvas height
     *   - Renderer.WORLD_HEIGHT = Math.floor(height / 100);
     *
     * Radius in pixels =
     *  (Renderer.PARTICLE_RADIUS / sRenderWorldHeight) * height
     * (to calculate volume later and amount of particles needed
     * to fill a glass)
     */

    // this.sRenderWorldHeight = Renderer.WORLD_HEIGHT;
    // this.sRenderWorldWidth = (width * Renderer.WORLD_HEIGHT) / height;
    let xRatio = 1;
    let yRatio = 1;

    if (width < height) {
      xRatio = width / height;
    } else {
      yRatio = height / width;
    }

    this.sRenderWorldHeight = Renderer.WORLD_HEIGHT * yRatio;
    this.sRenderWorldWidth = Renderer.WORLD_HEIGHT * xRatio;

    this.sScreenWidth = width;
    this.sScreenHeight = height;

    // Reset the boundary
    this.initBoundaries();

    this.mParticleRenderer.onSurfaceChanged(width, height);

    if (Renderer.DEBUG_DRAW) {
      this.mDebugRenderer.onSurfaceChanged();
    }
  }

  // Override
  public async onSurfaceCreated(): Promise<void> {
    if (this.mWorld == null) {
      throw new Error('Init world before rendering');
    }

    // Load all shaders
    await ShaderProgram.loadAllShaders(new AssetManager());

    TextureRenderer.getInstance().onSurfaceCreated();

    await this.mParticleRenderer.onSurfaceCreated();

    if (Renderer.DEBUG_DRAW) {
      this.mDebugRenderer.onSurfaceCreated();
    }
  }

  /** Update function for render loop */
  private update(dt: number): void {
    if (this.mSimulation) {
      /**
       * @todo
       * Implement Observables here if we find
       * any code that subscribes to this class.
       */
      // this.setChanged();
      // this.notifyObservers(dt);

      this.mParticleRenderer.update(dt);

      const world: LiquidFun.World = this.acquireWorld();
      try {
        world.Step(
          dt,
          Renderer.VELOCITY_ITERATIONS,
          Renderer.POSITION_ITERATIONS,
          Renderer.PARTICLE_ITERATIONS,
        );
      } catch (e) {
        console.error(e);
      } finally {
        this.releaseWorld();
      }
    }
  }

  /** Render function for render loop */
  private render(): void {
    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw particles
    this.mParticleRenderer.draw();

    if (Renderer.DEBUG_DRAW) {
      this.mDebugRenderer.draw();
    }
  }

  public pauseSimulation(): void {
    this.mSimulation = false;
  }

  public startSimulation(): void {
    this.mSimulation = true;
  }

  private deleteWorld(): void {
    const world: LiquidFun.World = this.acquireWorld();

    try {
      if (this.mBoundaryBody != null) {
        this.mBoundaryBody.delete();
        this.mBoundaryBody = null;
      }
      if (world != null) {
        world.delete();
        this.mWorld = null;
        this.mParticleSystem = null;
      }
    } finally {
      this.releaseWorld();
    }
  }

  /**
   * Resets the world -- which means a delete and a new.
   * Initializes the boundaries and reset the ParticleRenderer as well.
   */
  public reset(): void {
    this.acquireWorld();
    try {
      this.deleteWorld();
      const gravity = new Module.Vec2(0, 0);
      this.mWorld = new Module.World(gravity);

      this.initParticleSystem();
      this.initBoundaries();

      if (Renderer.DEBUG_DRAW) {
        this.mWorld.SetDebugDraw(this.mDebugRenderer);
      }

      this.mParticleRenderer.reset();
    } finally {
      this.releaseWorld();
    }
  }

  /** Create a new particle system */
  private initParticleSystem(): void {
    this.acquireWorld();
    try {
      // Create a new particle system; we only use one.
      const psDef: LiquidFun.ParticleSystemDef = new Module.ParticleSystemDef();
      psDef.radius = Renderer.PARTICLE_RADIUS;
      psDef.maxCount = Renderer.MAX_PARTICLE_COUNT;
      psDef.repulsiveStrength = Renderer.PARTICLE_REPULSIVE_STRENGTH;
      this.mParticleSystem = this.mWorld.CreateParticleSystem(psDef);
      psDef.delete();
    } finally {
      this.releaseWorld();
    }
  }

  /** Constructs boundaries for the canvas. **/
  private initBoundaries(): void {
    const world: LiquidFun.World = this.acquireWorld();

    try {
      // clean up previous Body if exists
      if (this.mBoundaryBody != null) {
        world.DestroyBody(this.mBoundaryBody);
      }

      // Create native objects
      const bodyDef: LiquidFun.BodyDef = new Module.BodyDef();
      const boundaryPolygon: PolygonShape = new Module.PolygonShape();
      this.mBoundaryBody = world.CreateBody(bodyDef);

      // SetAsBox:
      // (half-width, half-height, center, angle)

      // TOP
      /**
       * @todo:
       * Replace the parameters calls to SetAsBox
       * (no need to create the Vec2 here)
       */
      const topCenter = new Module.Vec2(
        this.sRenderWorldWidth / 2,
        this.sRenderWorldHeight + Renderer.BOUNDARY_THICKNESS,
      );
      boundaryPolygon.SetAsBox(
        this.sRenderWorldWidth, // width
        Renderer.BOUNDARY_THICKNESS, // height
        topCenter, // Center
        0, // Angle
      );
      this.mBoundaryBody.CreateFixture(boundaryPolygon, 0.0);

      // BOTTOM
      const centerBottom = new Module.Vec2(
        this.sRenderWorldWidth / 2,
        -Renderer.BOUNDARY_THICKNESS,
      );
      boundaryPolygon.SetAsBox(
        this.sRenderWorldWidth,
        Renderer.BOUNDARY_THICKNESS,
        centerBottom,
        0,
      );
      this.mBoundaryBody.CreateFixture(boundaryPolygon, 0.0);

      // LEFT
      const centerLeft = new Module.Vec2(
        -Renderer.BOUNDARY_THICKNESS,
        this.sRenderWorldHeight / 2,
      );
      boundaryPolygon.SetAsBox(
        Renderer.BOUNDARY_THICKNESS,
        this.sRenderWorldHeight,
        centerLeft,
        0,
      );
      this.mBoundaryBody.CreateFixture(boundaryPolygon, 0.0);

      // RIGHT
      const centerRight = new Module.Vec2(
        this.sRenderWorldWidth + Renderer.BOUNDARY_THICKNESS,
        this.sRenderWorldHeight / 2,
      );
      boundaryPolygon.SetAsBox(
        Renderer.BOUNDARY_THICKNESS,
        this.sRenderWorldHeight,
        centerRight,
        0,
      );
      this.mBoundaryBody.CreateFixture(boundaryPolygon, 0.0);

      // Clean up native objects
      bodyDef.delete();
      boundaryPolygon.delete();
    } finally {
      this.releaseWorld();
    }
  }

  /**
   * Acquire the world for thread-safe operations.
   */
  public acquireWorld(): LiquidFun.World {
    /**
     * @todo: Threads and thread locks dont
     * make sense in JS. See if makes sense
     * to use WebWorkers to offload some of
     * the work.
     */
    // this.mWorldLock.lock();
    return this.mWorld;
  }

  /**
   * Release the world after thread-safe operations.
   */
  public releaseWorld(): void {
    // this.mWorldLock.unlock();
  }

  /**
   * Acquire the particle system for thread-safe operations.
   * Uses the same lock as World, as all LiquidFun operations should be
   * synchronized. For example, if we are in the middle of World.sync(), we
   * don't want to call ParticleSystem.createParticleGroup() at the same
   * time.
   */
  public acquireParticleSystem(): LiquidFun.ParticleSystem {
    // this.mWorldLock.lock();
    return this.mParticleSystem;
  }

  /**
   * Release the world after thread-safe operations.
   */
  public releaseParticleSystem(): void {
    // this.mWorldLock.unlock();
  }

  /**
   * This provides access to the main Activity class that our Renderer is
   * associated with. Provided for debug access; use with care.
   */
  // public getCurrentActivity(): Activity {
  //   return this.mActivity;
  // }
}

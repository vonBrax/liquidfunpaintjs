import { mat4 } from 'gl-matrix';
import { ShaderProgram } from './shader';
import { ParticleRenderer } from './particle-renderer';
import { DebugRenderer } from './debug-renderer';
import { TextureRenderer } from './texture-renderer';
import { state } from './state';
import { AssetManager } from './util/asset-manager';

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
  private static WORLD_HEIGHT = 3.0;
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

  /// Member variables
  // private mActivity: Activity = null;

  // Renderer class owns all Box2D objects, for thread-safety
  private mWorld: World = null;
  private mParticleSystem: ParticleSystem = null;
  private mBoundaryBody: Body = null;

  // Variables for thread synchronization
  private mSimulation = false;
  // private mWorldLock: Lock = new ReentrantLock();

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
       * - ?
       */
      // this.mDebugRenderer.delete();
      this.mDebugRenderer = null;
    }
  }

  // private constructor() {}

  public static getInstance(): Renderer {
    return this._instance;
  }

  public init(/* activity: Activity */): void {
    // TS does not seem to initialize class properties
    // pointing to other static property
    this.sRenderWorldWidth = Renderer.WORLD_HEIGHT;
    this.sRenderWorldHeight = Renderer.WORLD_HEIGHT;
    // this.mActivity = activity;

    // Initialize all the different renderers
    this.mParticleRenderer = new ParticleRenderer();
    if (Renderer.DEBUG_DRAW) {
      const dr = new DebugRenderer();
      console.log(dr);
      // console.log(dr);
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
      console.log(instance);
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
      console.log(instance);
      this.mDebugRenderer = dr;
      // this.mDebugRenderer = new DebugRenderer();
      // this.mDebugRenderer.b2Draw.SetFlags(
      //   this.mDebugRenderer.shapeBit | this.mDebugRenderer.particleBit,
      // );
      this.mDebugRenderer.SetFlags(
        0x0001 | 0x0020, // shapeBit // particleBit
        // this.mDebugRenderer.shapeBit | this.mDebugRenderer.particleBit,
      );
    }

    this.reset();

    /**
     * @todo: REMOVE
     */
    state.set('DEBUG', true);
    this.mTime = window.performance.now() * 1000000;
  }

  // Override
  public onDrawFrame(/* GL10 */): void {
    // Show the frame rate
    /**
     * @todo: See where else BuildConfig is being used
     * and implement it accordingly
     */
    if (state.get('DEBUG')) {
      const time = window.performance.now() * 1000000;

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
        // Log.d(Renderer.TAG, fps + ' fps (Now)');
        // Log.d(Renderer.TAG, avefps + ' fps (Average)');
        // Log.d(Renderer.TAG, count + ' particles');
        this.mTime = time;
        this.mFrames = 0;

        const msg = `
          ${fps} fps (Now)
          ${avefps} fps(Average)
          ${this.mParticleSystem.GetParticleCount()} particles
          ${this.mParticleSystem.GetParticleGroupCount()} particle groups
          ${this.mWorld.GetBodyCount()} bodies
        `;
        document.getElementById('log').textContent = msg;

        /**
         * @todo:
         * - Implement the Runnable either as a Web Worker
         *  (where we probably will lose all the context here)
         * or just as a RAF * console.log combo
         */
        // Implement off main thread work with Web Workers
        // const runnable = new Runnable();
        // Override (use prototype instead?)
        // runnable.run = function(): void {
        //   const message =
        //     this.MainActivity.sVersionName +
        //     '\n' +
        //     fps +
        //     ' fps\n' +
        //     count +
        //     ' particles\n' +
        //     this.mParticleSystem.getParticleGroupCount() +
        //     ' particle groups\n' +
        //     this.mWorld.getBodyCount() +
        //     ' bodies\n';
        //   this.mActivity.findViewByIde(R.id.fps).setText(message);
        // };
        // this.mActivity.runOnUiThread(runnable);
      }
      this.mFrames++;
      this.totalFrames++;
    }

    this.update(Renderer.TIME_STEP);
    this.render();
    window.requestAnimationFrame(() => this.onDrawFrame());
  }

  // Override
  public onSurfaceChanged(
    /* GL10 */ gl: WebGLRenderingContext,
    width: number,
    height: number,
  ): void {
    // const gl: WebGL2RenderingContext = state.get(
    //   'context',
    // ) as WebGL2RenderingContext;
    this.sRenderWorldHeight = Renderer.WORLD_HEIGHT;
    this.sRenderWorldWidth = (width * Renderer.WORLD_HEIGHT) / height;
    this.sScreenWidth = width;
    this.sScreenHeight = height;

    const canvas: HTMLCanvasElement = gl.canvas as HTMLCanvasElement;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);

    // Reset the boundary
    this.initBoundaries();

    this.mParticleRenderer.onSurfaceChanged(width, height);

    if (Renderer.DEBUG_DRAW) {
      this.mDebugRenderer.onSurfaceChanged();
    }
  }

  // Override
  // Parameters: gl: WebGLRenderingContext (GL10), config: EGLConfig
  public async onSurfaceCreated(/*gl: WebGLRenderingContext*/): Promise<void> {
    if (this.mWorld == null) {
      throw new Error('Init world before rendering');
    }

    // Load all shaders
    await ShaderProgram.loadAllShaders(
      // this.mActivity.getAssets())
      new AssetManager(),
    );

    TextureRenderer.getInstance().onSurfaceCreated();

    await this.mParticleRenderer.onSurfaceCreated(/* this.mActivity */);

    if (Renderer.DEBUG_DRAW) {
      this.mDebugRenderer.onSurfaceCreated(/* this.mActivity */);
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

      const world: World = this.acquireWorld();
      try {
        world.Step(
          dt,
          Renderer.VELOCITY_ITERATIONS,
          Renderer.POSITION_ITERATIONS,
          Renderer.PARTICLE_ITERATIONS,
        );
        // console.log(this.acquireParticleSystem().GetParticleCount());
        // console.log(this.acquireParticleSystem().GetParticleGroupList());
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

    // gl.clearDepth(1.0);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
    const world: World = this.acquireWorld();
    console.log('Deleting world.');
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
    // const world: World =
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
    // const world: World =
    this.acquireWorld();
    try {
      // Create a new particle system; we only use one.
      const psDef: ParticleSystemDef = new Module.ParticleSystemDef();
      // psDef.setRadius(Renderer.PARTICLE_RADIUS);
      psDef.radius = Renderer.PARTICLE_RADIUS;
      // psDef.setRepulsiveStrength(Renderer.PARTICLE_REPULSIVE_STRENGTH);
      // this.mParticleSystem.SetMaxParticleCount(Renderer.MAX_PARTICLE_COUNT);
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
    const world: World = this.acquireWorld();

    try {
      // clean up previous Body if exists
      if (this.mBoundaryBody != null) {
        world.DestroyBody(this.mBoundaryBody);
      }

      // Create native objects
      const bodyDef: BodyDef = new Module.BodyDef();
      const boundaryPolygon: PolygonShape = new Module.PolygonShape();

      this.mBoundaryBody = world.CreateBody(bodyDef);

      const centerTop = new Module.Vec2(
        this.sRenderWorldWidth / 2,
        this.sRenderWorldHeight + Renderer.BOUNDARY_THICKNESS,
      );
      // boundary definitions
      // top
      // boundaryPolygon.SetAsBox(
      //   this.sRenderWorldWidth,
      //   Renderer.BOUNDARY_THICKNESS,
      //   this.sRenderWorldWidth / 2,
      //   this.sRenderWorldHeight + Renderer.BOUNDARY_THICKNESS,
      //   0,
      // );

      boundaryPolygon.SetAsBox(
        this.sRenderWorldWidth,
        Renderer.BOUNDARY_THICKNESS,
        centerTop,
        0,
      );
      this.mBoundaryBody.CreateFixture(boundaryPolygon, 0.0);

      const centerBottom = new Module.Vec2(
        this.sRenderWorldWidth / 2,
        -Renderer.BOUNDARY_THICKNESS,
      );
      // bottom
      // boundaryPolygon.SetAsBox(
      //   this.sRenderWorldWidth,
      //   Renderer.BOUNDARY_THICKNESS,
      //   this.sRenderWorldWidth / 2,
      //   -Renderer.BOUNDARY_THICKNESS,
      //   0,
      // );
      boundaryPolygon.SetAsBox(
        this.sRenderWorldWidth,
        Renderer.BOUNDARY_THICKNESS,
        centerBottom,
        0,
      );
      this.mBoundaryBody.CreateFixture(boundaryPolygon, 0.0);

      const centerLeft = new Module.Vec2(
        -Renderer.BOUNDARY_THICKNESS,
        this.sRenderWorldHeight / 2,
      );

      // left
      // boundaryPolygon.setAsBox(
      //   Renderer.BOUNDARY_THICKNESS,
      //   this.sRenderWorldHeight,
      //   -Renderer.BOUNDARY_THICKNESS,
      //   this.sRenderWorldHeight / 2,
      //   0,
      // );
      boundaryPolygon.SetAsBox(
        Renderer.BOUNDARY_THICKNESS,
        this.sRenderWorldHeight,
        centerLeft,
        0,
      );
      this.mBoundaryBody.CreateFixture(boundaryPolygon, 0.0);

      const centerRight = new Module.Vec2(
        this.sRenderWorldWidth + Renderer.BOUNDARY_THICKNESS,
        this.sRenderWorldHeight / 2,
      );
      // right
      // boundaryPolygon.setAsBox(
      //   Renderer.BOUNDARY_THICKNESS,
      //   this.sRenderWorldHeight,
      //   this.sRenderWorldWidth + Renderer.BOUNDARY_THICKNESS,
      //   this.sRenderWorldHeight / 2,
      //   0,
      // );
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
  public acquireWorld(): World {
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
  public acquireParticleSystem(): ParticleSystem {
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

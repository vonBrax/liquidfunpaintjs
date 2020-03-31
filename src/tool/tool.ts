import { PointerInfo } from './pointer-info';
import { Vector2f } from '../util/vector2f';
import { Renderer } from '../renderer';
import { MotionEvent } from './motion-event';
import { ByteBuffer } from '../util/byte-buffer';

/**
 * Type of tools
 */
export enum ToolType {
  MOVE,
  ERASER,
  WATER,
  PENCIL,
  RIGID,
}

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
  // fixtureContactFilterParticle to detect collisions between
  // particles.
  fixtureContactListenerParticle = 1 << 14,
  // Call b2ContactListener when this particle is about to interact with
  // another particle or stops interacting with another particle.
  // This results in an expensive operation compared to using
  // particleContactFilterParticle to detect collisions between
  // particles.
  particleContactListenerParticle = 1 << 15,
  // Call b2ContactFilter when this particle interacts with rigid bodies.
  fixtureContactFilterParticle = 1 << 16,
  // Call b2ContactFilter when this particle interacts with other
  // particles.
  particleContactFilterParticle = 1 << 17,
}

export enum ParticleGroupFlag {
  solidParticleGroup = 1 << 0,
  rigidParticleGroup = 1 << 1,
  particleGroupCanBeEmpty = 1 << 2,
  particleGroupWillBeDestroyed = 1 << 3,
  particleGroupNeedsUpdateDepth = 1 << 4,
  particleGroupInternalMask = ParticleGroupFlag.particleGroupWillBeDestroyed |
    ParticleGroupFlag.particleGroupNeedsUpdateDepth,
}

/**
 * Tool operations
 */
enum ToolOperation {
  ADD_PARTICLES,
  REMOVE_PARTICLES,
}

function createMatIdentity(): Transform {
  const matIdentity = new Module.Transform();
  matIdentity.SetIdentity();
  return matIdentity;
}

/**
 * A class that defines each tool we have for drawing
 */
export abstract class Tool {
  private static TAG = 'Tool';
  public static TOOL_MAP: Map<ToolType, Tool> = new Map();
  protected static MAT_IDENTITY: Transform = createMatIdentity();

  // The size of the circle shape we use to create ParticleGroups with.
  // Independent from the particle radius, but should not be smaller than it.
  protected static MINIMUM_BRUSHSIZE = 0.18;

  public ToolType: ToolType;

  protected ToolOperation: ToolOperation;

  // Static variables
  // Only one tool is active at a time, and all PointerInfos should be global
  private static mGroupMap: Map<number, PointerInfo> = new Map<
    number,
    PointerInfo
  >();

  // Member variables of the class
  private mType: ToolType;
  protected mParticleFlags = 0;
  protected mParticleGroupFlags = 0;
  protected mBrushSize = Tool.MINIMUM_BRUSHSIZE;

  // Default for a tool is to both add and remove particles
  protected mOperations: Set<ToolOperation> = new Set<ToolOperation>([
    ToolOperation.ADD_PARTICLES,
    ToolOperation.REMOVE_PARTICLES,
  ]);

  // member native (C++) variables
  protected mColor: ParticleColor = new Module.ParticleColor();
  protected mVelocity: Vec2 = new Module.Vec2(0, 0);

  // This variable is a temporary variable to allow us to destroy particles.
  protected mShape: CircleShape = new Module.CircleShape();

  /** Initializes all the different tools */
  // static constructToolMap(): Map<ToolType, Tool>;
  // Not implemented here due to a cyclic dependency between
  // the Tool class and the other different tool type classes

  /** Returns the tool based on the type */
  static getTool(type: ToolType): Tool {
    return Tool.TOOL_MAP.get(type);
  }

  /** Goes through all tools and call reset() */
  static resetAllTools(): void {
    for (const tool of this.TOOL_MAP.values()) {
      tool.reset();
    }
  }

  constructor(type: ToolType) {
    this.mType = type;
  }

  public registerTool(type: ToolType, tool: Tool): void {
    Tool.TOOL_MAP.set(type, tool);
  }

  /**
   * @override
   */
  protected finalize(): void {
    // clean up native variables
    this.mColor.delete();
    this.mVelocity.delete();
    this.mShape.delete();
  }

  public getType(): ToolType {
    return this.mType;
  }

  public setColor(color: number): void {
    // Convert ABGR back into ParticleColor
    // Box2D doesn't have this functionality,
    // check why color is stored as an int to begin with.
    const a = (color >> 24) & 0xff;
    const b = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const r = color & 0xff;

    this.mColor.Set(r, g, b, a);
  }

  public getParticleGroupFlags(): number {
    return this.mParticleGroupFlags;
  }

  public onTouch(e: MotionEvent): void {
    switch (e.getActionMasked()) {
      case MotionEvent.ACTION_DOWN:
      case MotionEvent.ACTION_POINTER_DOWN: {
        const pointerIndex = e.getActionIndex();
        const pID = e.getPointerId(pointerIndex);

        // Create new PointerInfo as this is a new pointer
        const pInfo: PointerInfo = new PointerInfo(pID);
        console.assert(
          Tool.mGroupMap.get(pID) == null,
          'mGroupMap with same ID already exist.',
        );
        this.processTouchInput(e, pInfo, pointerIndex, true, true);
        // Put updated PointerInfo back in map
        Tool.mGroupMap.set(pID, pInfo);
        break;
      }

      case MotionEvent.ACTION_MOVE: {
        for (
          let pointerIndex = 0;
          pointerIndex < e.getPointerCount();
          ++pointerIndex
        ) {
          const pID = e.getPointerId(pointerIndex);
          // Get cached PointerInfo
          const pInfo: PointerInfo = Tool.mGroupMap.get(pID);
          console.assert(pInfo != null);
          this.processTouchInput(e, pInfo, pointerIndex, true, true);
          // Put updated PointerInfo back in map
          Tool.mGroupMap.set(pID, pInfo);
        }
        break;
      }

      case MotionEvent.ACTION_UP:
      case MotionEvent.ACTION_POINTER_UP: {
        const pointerIndex = e.getActionIndex();
        const pID = e.getPointerId(pointerIndex);
        // Get cached PointerInfo
        const pInfo: PointerInfo = Tool.mGroupMap.get(pID);
        console.assert(pInfo != null);
        this.processTouchInput(e, pInfo, pointerIndex, true, true);
        // Pointer is up -- end the action
        this.endAction(pID);
        break;
      }

      case MotionEvent.ACTION_CANCEL: {
        // All pointers are cancelled, call endAction() on them.
        for (const pID of Tool.mGroupMap.keys()) {
          this.endAction(pID);
        }
        Tool.mGroupMap.clear();
        break;
      }

      default:
        break;
    }
  }

  protected clampToWorld(worldPoint: Vector2f, border: number): void {
    worldPoint.x = Math.max(
      border,
      Math.min(worldPoint.x, Renderer.getInstance().sRenderWorldWidth - border),
    );

    worldPoint.y = Math.max(
      border,
      Math.min(
        worldPoint.y,
        Renderer.getInstance().sRenderWorldHeight - border,
      ),
    );
  }

  /**
   * Initializes a touch event
   * @param pInfo The pointer info associated with this touch event
   * @param worldPoint First point of this touch
   */
  protected initPointerInfo(pInfo: PointerInfo, worldPoint: Vector2f): void {
    pInfo.init(worldPoint, true);
  }

  /**
   * Updates a touch event
   * @param pInfo The pointer info associated with this touch event
   * @param worldPoint First point of this touch
   */
  protected updatePointerInfo(pInfo: PointerInfo, worldPoint: Vector2f): void {
    pInfo.update(worldPoint);
  }

  private applyToolAcrossRange(
    e: MotionEvent,
    pInfo: PointerInfo,
    screenX: number,
    screenY: number,
    interpolatePoints: boolean,
  ): PointerInfo {
    const radius = this.mBrushSize / 2;

    // The dimensions of the world
    const worldHeight = Renderer.getInstance().sRenderWorldHeight;
    const worldWidth = Renderer.getInstance().sRenderWorldWidth;

    // The dimensions of the the view (canvas)
    const viewHeight = e.container.clientHeight; // worldHeight;
    const viewWidth = e.container.clientWidth; // worldWidth;

    // screenX and screenY are the coordinates of
    // the pointer event
    const worldPoint = new Vector2f(
      (worldWidth * screenX) / viewWidth,
      (worldHeight * (viewHeight - screenY)) / viewHeight,
    );

    this.clampToWorld(worldPoint, radius);

    // Initialize this touch event, specifically the buffers
    this.initPointerInfo(pInfo, worldPoint);

    if (interpolatePoints) {
      // Now generate in-between points
      const pointCount = Math.floor(
        Vector2f.length2(worldPoint, pInfo.getWorldPoint()) / radius,
      );
      for (let j = 0; j < pointCount; ++j) {
        const incr: Vector2f = Vector2f.lerpFixedInterval(
          pInfo.getWorldPoint(),
          worldPoint,
          j,
          pointCount,
        );
        pInfo.putPoint(incr);
      }
    }

    // Check if the buffer needs flushing
    if (pInfo.needsFlush()) {
      this.applyTool(pInfo);
      pInfo.resetBuffer();
    }

    // Update the pointerInfo with the first point of this touch event.
    // PointerInfo contains the previous touch event for interpolation
    // so we update when the previous event info is not needed anymore.
    this.updatePointerInfo(pInfo, worldPoint);

    return pInfo;
  }

  protected processTouchInput(
    e: MotionEvent,
    pInfo: PointerInfo,
    pointerIndex: number,
    useMotionHistory: boolean,
    interpolatePoints: boolean,
  ): void {
    if (useMotionHistory) {
      // Look into the historical x's and y's if needed
      for (let h = 0; h < e.getHistorySize(); ++h) {
        this.applyToolAcrossRange(
          e,
          pInfo,
          e.getHistoricalX(pointerIndex, h),
          e.getHistoricalY(pointerIndex, h),
          interpolatePoints,
        );
      }
    }

    // Then look into the current x and y
    /**
     * @todo:
     * Review X and Y (must be specific to the pointer causing the event)
     * similar to getX and getY on Android MotionEvent
     * https://developer.android.com/reference/android/view/MotionEvent#getX(int)
     */
    this.applyToolAcrossRange(
      e,
      pInfo,
      e.getX(pointerIndex),
      e.getY(pointerIndex),
      interpolatePoints,
    );
  }

  /**
   * End this tool's current action
   * @param pointerId
   */
  protected endAction(pointerId: number): void {
    Tool.mGroupMap.delete(pointerId);
    if (Tool.mGroupMap.size === 0) {
      PointerInfo.resetGlobalBuffer();
    }
  }

  /** Reset the tool */
  protected reset(): void {
    PointerInfo.resetGlobalBuffer();
  }

  protected applyTool(pInfo: PointerInfo): void {
    const radius = this.mBrushSize / 2;

    const buffer: ByteBuffer = pInfo.getRawPointsBuffer();

    let pgd: ParticleGroupDef = null;

    if (this.mOperations.has(ToolOperation.ADD_PARTICLES)) {
      pgd = new Module.ParticleGroupDef();
      pgd.flags = this.mParticleFlags;
      pgd.groupFlags = this.mParticleGroupFlags;
      pgd.linearVelocity = this.mVelocity;
      pgd.SetColor(this.mColor.r, this.mColor.g, this.mColor.b, this.mColor.a);
      buffer.position(pInfo.getBufferStart());

      buffer.sendToEmbind();

      pgd.SetCircleShapesFromVertexList(
        buffer.getPointer(),
        pInfo.getNumPoints(),
        radius,
      );
    }

    const ps: ParticleSystem = Renderer.getInstance().acquireParticleSystem();

    try {
      if (this.mOperations.has(ToolOperation.REMOVE_PARTICLES)) {
        buffer.position(pInfo.getBufferStart());
        this.mShape.radius = radius;

        // Goes through each (x,y) pair and queries for the particles in
        // the circle shape to be destroyed.
        for (let i = 0; i < pInfo.getNumPoints(); ++i) {
          this.mShape.SetPosition(buffer.getFloat(), buffer.getFloat());
          ps.DestroyParticlesInShape(this.mShape, Tool.MAT_IDENTITY);
        }
      }

      // Create ParticleGroup
      if (pgd != null) {
        // Join to existing group if the group has the same flags
        const pGroup: ParticleGroup = ps.CreateParticleGroup(pgd);
        const existingGroup: ParticleGroup = pInfo.getParticleGroup();

        if (
          existingGroup == null ||
          existingGroup.GetGroupFlags() != pgd.groupFlags
        ) {
          pInfo.setParticleGroup(pGroup);
        } else {
          ps.JoinParticleGroups(existingGroup, pGroup);
        }

        // Clean up native objects
        pgd.delete();
      }
    } catch (e) {
      console.log('%c ERROR', 'color: red');
      console.error(e);
    } finally {
      Renderer.getInstance().releaseParticleSystem();
    }
  }

  /**
   * These methods are called by Controller, when new tools are selected.
   * It allows for the tools to register/de-register themselves from different
   * listener or observer classes.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  deactivate(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  activate(): void {}
}

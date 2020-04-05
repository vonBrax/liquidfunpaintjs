import { state } from './state';
import { Renderer } from './renderer';
import { MotionEvent } from './tool/motion-event';
import { Tool, ToolType } from './tool/tool';
import { WaterTool } from './tool/water-tool';
import { Controller } from './controller';
import { RigidTool } from './tool/rigid-tool';

export class MainActivity {
  // Keep a reference to the MotionEvent class
  private motionEvent: MotionEvent;
  private mController: Controller;
  private mWorldView: HTMLCanvasElement;
  private mUsingTool: boolean;
  private mSelected: ToolType;
  public static devicePixelRatio = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.mWorldView = canvas;
  }

  async onCreate(): Promise<void> {
    const renderer: Renderer = Renderer.getInstance();
    renderer.init();

    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;
    await renderer.onSurfaceCreated();
    const canvas = this.mWorldView;
    const bb = canvas.getBoundingClientRect();
    const width = Math.floor(bb.width * MainActivity.devicePixelRatio);
    const height = Math.floor(bb.height * MainActivity.devicePixelRatio);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    renderer.onSurfaceChanged(gl, width, height);
    this.motionEvent = new MotionEvent(this.mWorldView);
    this.mController = new Controller();

    /**
     * @todo
     * Add event listeners to specific target
     * instead of the whole document
     */
    this.motionEvent.setOnTouchListener(this);
    renderer.startSimulation();

    // Instantiate all required tools here
    new WaterTool();
    new RigidTool();

    // getColor expects color in the format 0xAARRGGBB
    Tool.getTool(ToolType.WATER).setColor(this.getColor(0xff63cee4));
    this.select(ToolType.WATER);

    renderer.onDrawFrame();
  }

  public onEvent(
    name: string,
    checked?: boolean,
    color?: number,
    data?: any,
  ): void {
    switch (name) {
      case 'play':
        Renderer.getInstance().startSimulation();
        break;
      case 'pause':
        Renderer.getInstance().pauseSimulation();
        break;
      case 'reset':
        Renderer.getInstance().reset();
        this.mController.reset();
        break;
      case 'stats':
        state.set('stats', checked);
        break;
      case 'debug':
        Renderer.DEBUG_DRAW = checked;
        break;
      case 'blur':
        state.set('blur', checked);
        break;
      case 'WATER':
        this.select(ToolType.WATER);
        if (color) {
          Tool.getTool(ToolType.WATER).setColor(this.getColor(color));
        }
        break;
      case 'RIGID':
        this.select(ToolType.RIGID);
        if (color) {
          Tool.getTool(ToolType.RIGID).setColor(this.getColor(color));
        }
        break;
      case 'resize':
        if (
          this.mWorldView.width !== data.width ||
          this.mWorldView.height !== data.height
        ) {
          this.mWorldView.width = data.width;
          this.mWorldView.height = data.height;
        }

        Renderer.getInstance().onSurfaceChanged(
          state.get('context') as WebGLRenderingContext,
          data.width,
          data.height,
        );
    }
  }

  getColor(color: number): number {
    const red = (color >> 16) & 0xff;
    const blue = (color << 16) & 0xff0000;

    return (color & 0xff00ff00) | red | blue;
  }

  private select(tool: ToolType): void {
    // Send the new tool over to the Controller
    this.mSelected = tool;
    this.mController.setTool(tool);
  }

  /**
   * OnTouch event handler.
   */
  onTouch(event: MotionEvent): boolean {
    let retValue = false;
    retValue = this.onTouchCanvas(event);
    return retValue;
  }

  /**
   * OnTouch handler for OpenGL canvas.
   * Called from OnTouchListener event.
   */
  onTouchCanvas(event: MotionEvent): boolean {
    switch (event.getActionMasked()) {
      case MotionEvent.ACTION_DOWN:
        this.mUsingTool = true;
        if (this.mSelected === ToolType.RIGID) {
          Renderer.getInstance().pauseSimulation();
        }
        break;

      case MotionEvent.ACTION_CANCEL:
      case MotionEvent.ACTION_UP:
        this.mUsingTool = false;
        if (this.mSelected === ToolType.RIGID) {
          Renderer.getInstance().startSimulation();
        }
        break;
      default:
        break;
    }

    return this.mController.onTouch(event);
  }
}

import { state } from './state';
import { Renderer } from './renderer';
import { MotionEvent } from './tool/motion-event';
import { Tool, ToolType } from './tool/tool';
import { WaterTool } from './tool/water-tool';
import { Controller } from './controller';
import { RigidTool } from './tool/rigid-tool';
// import { LFEmscriptenModule } from './util/types';

export class MainActivity {
  // Keep a reference to the MotionEvent class
  private motionEvent: MotionEvent;
  private mController: Controller;
  private mWorldView: HTMLCanvasElement;
  private mUsingTool: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.mWorldView = canvas;
  }

  async onCreate(): Promise<void> {
    const renderer: Renderer = Renderer.getInstance();
    renderer.init();

    // mController = new Controller();

    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;
    await renderer.onSurfaceCreated(/* gl */);
    // renderer.onSurfaceChanged(gl, window.innerWidth, window.innerHeight);
    renderer.onSurfaceChanged(
      gl,
      Math.floor(
        (gl.canvas as HTMLCanvasElement).clientWidth * window.devicePixelRatio,
      ),
      Math.floor(
        (gl.canvas as HTMLCanvasElement).clientHeight * window.devicePixelRatio,
      ),
    );
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

    // Set up the OpenGL WorldView
    // const canvas: HTMLCanvasElement = document.getElementById(
    //   canvasId,
    // ) as HTMLCanvasElement;
    // const gl = canvas.getContext('webgl');
    // state.set('context', gl);

    // renderer.onSurfaceCreated(gl);
    // renderer.startSimulation();

    window.addEventListener('resize', () =>
      // renderer.onSurfaceChanged(gl, window.innerWidth, window.innerHeight),
      renderer.onSurfaceChanged(
        gl,
        Math.floor(
          (gl.canvas as HTMLCanvasElement).clientWidth *
            window.devicePixelRatio,
        ),
        Math.floor(
          (gl.canvas as HTMLCanvasElement).clientHeight *
            window.devicePixelRatio,
        ),
      ),
    );
    // canvas.addEventListener('mousedown', this.onTouchCanvas)
    // canvas.addEventListener('touchstart', this.onTouchCanvas)
    // canvas.addEventListener('pointerdown', this.onTouchCanvas)
    document.getElementById('reset').addEventListener('click', () => {
      Renderer.getInstance().reset();
      this.mController.reset();
    });

    document.getElementById('tools').addEventListener('change', evt => {
      switch ((evt.target as HTMLInputElement).value.toUpperCase()) {
        case 'WATER':
          this.select(ToolType.WATER);
          break;
        case 'RIGID':
          this.select(ToolType.RIGID);
          break;
      }
    });
    document.getElementById('colors').addEventListener('change', evt => {
      const checked: HTMLInputElement = document
        .getElementById('tools')
        .querySelector(':checked');
      let tool;
      switch (checked.value.toUpperCase()) {
        case 'WATER':
          tool = Tool.getTool(ToolType.WATER);
          break;
        case 'RIGID':
          tool = Tool.getTool(ToolType.RIGID);
          break;
      }
      tool.setColor(
        this.getColor(parseInt((evt.target as HTMLInputElement).value, 16)),
      );
    });
    renderer.onDrawFrame();
    // window.requestAnimationFrame(() => renderer.onDrawFrame(gl));
  }

  getColor(color: number): number {
    const red = (color >> 16) & 0xff;
    const blue = (color << 16) & 0xff0000;

    return (color & 0xff00ff00) | red | blue;
  }

  private select(tool: ToolType): void {
    // Send the new tool over to the Controller
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
    // this.mController.onTouch(event);
    console.log(event.getActionMasked());
    switch (event.getActionMasked()) {
      case MotionEvent.ACTION_DOWN:
        this.mUsingTool = true;
        break;

      case MotionEvent.ACTION_CANCEL:
      case MotionEvent.ACTION_UP:
        this.mUsingTool = false;
        break;
      default:
        break;
    }

    return this.mController.onTouch(event);
  }
}

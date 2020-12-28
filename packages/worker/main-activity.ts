import { state } from './state';
import { Renderer } from './renderer';
import { Tool, ToolType } from './tool/tool';
import { WaterTool } from './tool/water-tool';
import { RigidTool } from './tool/rigid-tool';

// import { MotionEvent } from './motion-event';
import { MotionEvent } from '@lfpjs/common';
import { Controller } from './controller';

interface CustomMessageData {
  type: string;
  checked?: boolean;
  color?: number;
  width?: number;
  height?: number;
  value?: string | number | boolean;
  x?: number;
  y?: number;
  // e?: UIEvent;
}

interface OnTouchListener {
  onTouch(event: MotionEvent): boolean;
}

export class MainActivity implements OnTouchListener {
  // Keep a reference to the MotionEvent class
  // private motionEvent: MotionEvent;
  private mController: Controller;
  private mWorldView: HTMLCanvasElement;
  private mUsingTool: boolean;
  private mSelected: ToolType;
  public static devicePixelRatio = 1;

  constructor(canvas: HTMLCanvasElement, private mModule: EmscriptenModule) {
    this.mWorldView = canvas;
    // MainActivity.devicePixelRatio = window.devicePixelRatio;
  }

  async onCreate(): Promise<void> {
    const renderer: Renderer = Renderer.getInstance();
    renderer.init(this.mModule);

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
    // this.motionEvent = new MotionEvent(this.mWorldView);
    this.mController = new Controller(this.mModule);

    // this.motionEvent.setOnTouchListener(this);

    renderer.startSimulation();

    // Instantiate all required tools here
    new WaterTool(this.mModule);
    new RigidTool(this.mModule);

    // getColor expects color in the format 0xAARRGGBB
    Tool.getTool(ToolType.WATER).setColor(this.getColor(0xff63cee4));
    this.select(ToolType.WATER);

    renderer.onDrawFrame();
    // postMessage(
    //   {
    //     target: 'custom',
    //     userData: { type: 'init-renderer', width, height },
    //   },
    //   '*',
    // );
    // this.postCustomMessage({ type: 'init-renderer', width, height });
  }

  // postCustomMessage(data: CustomMessageData): void {
  //   postMessage(
  //     {
  //       target: 'custom',
  //       userData: data,
  //     },
  //     '*',
  //   );
  // }

  public onEvent(event: CustomMessageData): void {
    switch (event.type) {
      // case 'pointerdown':
      // case 'pointermove':
      // case 'pointerup':
      // case 'pointercancel':
      //   this.onTouch(data);
      //   break;
      // case 'set-gravity':
      //   Renderer.getInstance()
      //     .acquireWorld()
      //     .SetGravity(new Module.Vec2(event.x, event.y));
      //   break;
      case 'start-simulation':
        Renderer.getInstance().startSimulation();
        // this.postCustomMessage({ type: 'start-simulation' });
        break;
      case 'pause-simulation':
        Renderer.getInstance().pauseSimulation();
        // this.postCustomMessage({ type: 'pause-simulation' });
        break;
      case 'reset-simulation':
        Renderer.getInstance().reset();
        // this.postCustomMessage({ type: 'reset-simulation' });
        this.mController.reset();
        break;
      case 'set-stats':
        state.set('stats', event.value);
        // this.postCustomMessage({ type: 'set-stats', value: data.checked });
        break;
      case 'set-debug':
        Renderer.DEBUG_DRAW = Boolean(event.value);
        // this.postCustomMessage({ type: 'set-debug', value: data.checked });
        break;
      case 'set-blur':
        state.set('blur', event.value);
        // this.postCustomMessage({ type: 'set-blur', value: data.checked });
        break;
      case 'set-tool':
        this.select(this.toToolType(event.value.toString()));
        if (event.color) {
          Tool.getTool(this.toToolType(event.value.toString())).setColor(
            this.getColor(event.color),
          );
        }
        break;
      case 'set-color':
        Tool.getTool(this.mSelected).setColor(
          this.getColor(Number(event.value)),
        );
        break;
      case 'set-pixel-ratio':
        this.setPixelRatio(Number(event.value));
        break;
      // case 'WATER':
      //   this.select(ToolType.WATER);
      //   if (event.color) {
      //     Tool.getTool(ToolType.WATER).setColor(this.getColor(event.color));
      //   }
      //   break;
      // case 'RIGID':
      //   this.select(ToolType.RIGID);
      //   if (event.color) {
      //     Tool.getTool(ToolType.RIGID).setColor(this.getColor(event.color));
      //   }
      //   break;
      case 'resize':
        if (
          this.mModule.canvas.width !== event.width ||
          this.mModule.canvas.height !== event.height
        ) {
          this.mModule.canvas.width = event.width;
          this.mModule.canvas.height = event.height;
        }
        if (
          this.mWorldView.width !== event.width ||
          this.mWorldView.height !== event.height
        ) {
          this.mWorldView.width = event.width;
          this.mWorldView.height = event.height;
        }

        // this.postCustomMessage({
        //   type: 'surface-changed',
        //   width: data.width,
        //   height: data.height,
        // });

        Renderer.getInstance().onSurfaceChanged(
          state.get('context') as WebGL2RenderingContext,
          event.width,
          event.height,
        );
        break;

      default:
        console.log(event);
        throw new Error('Invalid message type');
    }
  }

  private toToolType(type: string): ToolType {
    switch (type.toUpperCase()) {
      case 'WATER':
        return ToolType.WATER;
      case 'RIGID':
        return ToolType.RIGID;
    }
  }

  public setPixelRatio(ratio: number): void {
    MainActivity.devicePixelRatio = ratio;
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
  // onTouch(event: any): boolean {
  //   let retValue = false;
  //   retValue = this.onTouchCanvas(event);
  //   return retValue;
  // }

  /**
   * OnTouch handler for OpenGL canvas.
   * Called from OnTouchListener event.
   */
  onTouchCanvas(event: MotionEvent): boolean {
    switch (event.getActionMasked()) {
      case MotionEvent.ACTION_DOWN:
        this.mUsingTool = true;
        if (this.mSelected === ToolType.RIGID) {
          // this.onEvent('pause');
          Renderer.getInstance().pauseSimulation();
          // this.postCustomMessage({ type: 'pause-simulation' });
        }
        break;

      case MotionEvent.ACTION_CANCEL:
      case MotionEvent.ACTION_UP:
        this.mUsingTool = false;
        if (this.mSelected === ToolType.RIGID) {
          Renderer.getInstance().startSimulation();
          // this.onEvent('play');
          // this.postCustomMessage({ type: 'start-simulation' });
        }
        break;
      default:
        break;
    }

    return this.mController.onTouch(this.mWorldView, event);
  }
  // onTouchCanvas(event: any): boolean {
  //   switch (event.type) {
  //     case 'pointerdown':
  //       this.mUsingTool = true;
  //       if (this.mSelected === ToolType.RIGID) {
  //         // this.onEvent('pause');
  //         // Renderer.getInstance().pauseSimulation();
  //         this.postCustomMessage({ type: 'pause-simulation' });
  //       }
  //       break;

  //     case 'pointercancel':
  //     case 'pointerup':
  //       this.mUsingTool = false;
  //       if (this.mSelected === ToolType.RIGID) {
  //         // Renderer.getInstance().startSimulation();
  //         // this.onEvent('play');
  //         this.postCustomMessage({ type: 'start-simulation' });
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   return this.mController.onTouch(event);
  // }
}

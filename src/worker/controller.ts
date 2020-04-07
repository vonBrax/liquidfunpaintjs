// import { Renderer } from '../worker/renderer';
import { ToolType, Tool } from './tool/tool';
import { MotionEvent } from './motion-event';
import { DeviceMotionEventAcceleration } from '../common/types';
import { Renderer } from './renderer';

enum Surface {
  ROTATION_0 = 0,
  ROTATION_90 = 90,
  ROTATION_180 = 180,
  ROTATION_270 = 270,
}

class Device {
  getRotation(): number {
    return Surface.ROTATION_90;
  }
}

/**
 * Basic controller that listens to touch and sensor inputs
 */
export class Controller {
  // private mManager: SensorManager;
  // private mManager: any;
  // private mAccelerometer: Sensor;
  // private mAccelerometer: any;
  private mGravityVec: number[] = [0, 0];
  private mTool: Tool = null;

  private static TAG = 'Controller';
  private static GRAVITY = 10.0;

  private device: Device;

  constructor() {
    this.device = new Device();
    // Get the rotation and set the vector
    switch (this.device.getRotation()) {
      case Surface.ROTATION_0:
        this.mGravityVec[0] = -Controller.GRAVITY;
        break;
      case Surface.ROTATION_90:
        this.mGravityVec[1] = -Controller.GRAVITY;
        break;
      case Surface.ROTATION_180:
        this.mGravityVec[0] = Controller.GRAVITY;
        break;
      case Surface.ROTATION_270:
        this.mGravityVec[1] = Controller.GRAVITY;
    }
    this.onSensorChanged({ x: 1, y: 0, z: 0 });

    // this.mManager = (SensorManager) activity.getSystemService(Activity.SENSOR_SERVICE);
    // this.mAccelerometer = mManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
  }

  protected onResume(): void {
    // mManager.registerListener(this, mAccelerometer, SensorManager.SENSOR_DELAY_GAME);
  }

  protected onPause(): void {
    // mManager.unregisterListener(this);
  }

  public onTouch(e: MotionEvent): boolean {
    if (this.mTool !== null) {
      this.mTool.onTouch(e);
    }

    return true;
  }

  // public onAccuracyChanged(sensor: Sensor, accuracy: number): void {}

  public onSensorChanged(e: DeviceMotionEventAcceleration): void {
    // if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
    const world: World = Renderer.getInstance().acquireWorld();

    try {
      const gravity = new Module.Vec2(
        this.mGravityVec[0] * e.x - this.mGravityVec[1] * e.y,
        this.mGravityVec[1] * e.x + this.mGravityVec[0] * e.y,
      );
      // const x = this.mGravityVec[0] * e.x - this.mGravityVec[1] * e.y;
      // const y = this.mGravityVec[1] * e.x + this.mGravityVec[0] * e.y;
      // postMessage({ type: 'set-gravity', x, y }, '*');
      world.SetGravity(gravity);
    } finally {
      Renderer.getInstance().releaseWorld();
    }
  }

  public setColor(color: number): void {
    if (this.mTool !== null) {
      this.mTool.setColor(color);
    }
  }

  public setTool(type: ToolType): void {
    const oldTool: Tool = this.mTool;
    this.mTool = Tool.getTool(type);

    if (oldTool !== this.mTool) {
      if (oldTool != null) {
        oldTool.deactivate();
      }

      if (this.mTool != null) {
        this.mTool.activate();
      }
    }
  }

  public reset(): void {
    Tool.resetAllTools();
    this.onSensorChanged({ x: 1, y: 0, z: 0 });
  }
}
